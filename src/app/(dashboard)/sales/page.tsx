"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowDownLeft, ArrowUpRight, CreditCard, IndianRupee, Loader2, Receipt, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

interface Txn {
  id: string;
  type: string;
  item: string | null;
  quantity: string | null;
  amount: number;
  recorded_via: string | null;
  created_at: string;
}

interface Pnl { totalRevenue: number; totalExpenses: number; profit: number; transactionCount: number }

const fmt = (n: number) => `₹${Math.abs(n).toLocaleString("en-IN")}`;
const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
const dateLabel = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export default function SalesPage() {
  const { token, businessId } = useAuth();
  const [transactions, setTransactions] = useState<Txn[]>([]);
  const [pnl, setPnl] = useState<Pnl | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  const fetchData = useCallback(async () => {
    if (!token || !businessId) return;
    try {
      const typeFilter = tab === "all" ? "" : `&type=${tab === "sales" ? "sale" : "expense"}`;
      const [txns, p] = await Promise.all([
        api<Txn[]>(`/businesses/${businessId}/transactions?limit=25${typeFilter}`, { token }),
        api<Pnl>(`/businesses/${businessId}/transactions/pnl/today`, { token }),
      ]);
      setTransactions(Array.isArray(txns) ? txns : []);
      setPnl(p);
    } catch (e) { console.error("Sales fetch failed:", e); }
    finally { setLoading(false); }
  }, [token, businessId, tab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const p = pnl || { totalRevenue: 0, totalExpenses: 0, profit: 0, transactionCount: 0 };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-[#FF6B00]" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">Sales & Transactions</h1>
        <p className="text-sm text-[#9CA3AF]">Aaj ki saari bikri aur kharche</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up-delay-1">
        <KpiCard title="Today's Sales" value={fmt(p.totalRevenue)} changeType={p.totalRevenue > 0 ? "up" : "neutral"} change={p.totalRevenue > 0 ? "Revenue" : "No sales yet"} icon={<IndianRupee className="h-5 w-5 text-[#1B8C3A]" />} />
        <KpiCard title="Today's Expenses" value={fmt(p.totalExpenses)} changeType={p.totalExpenses > 0 ? "down" : "neutral"} change={p.totalExpenses > 0 ? "Spent today" : "No expenses"} icon={<CreditCard className="h-5 w-5 text-[#E53935]" />} />
        <KpiCard title="Net P&L" value={`${p.profit >= 0 ? "" : "-"}${fmt(p.profit)}`} changeType={p.profit >= 0 ? "up" : "down"} change={p.profit >= 0 ? "Profit" : "Loss"} icon={<TrendingUp className="h-5 w-5 text-[#FF6B00]" />} />
        <KpiCard title="Transactions" value={`${p.transactionCount}`} changeType="neutral" change="Today" icon={<Receipt className="h-5 w-5 text-[#1A56DB]" />} />
      </div>

      {/* Tab Switcher */}
      <div className="animate-fade-in-up-delay-2">
        <div className="inline-flex items-center rounded-xl bg-[#F8F5F0] p-1">
          {[
            { value: "all", label: "All" },
            { value: "sales", label: "Sales" },
            { value: "expenses", label: "Expenses" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => { setTab(t.value); setLoading(true); }}
              className={`rounded-lg px-5 py-2 text-sm font-medium transition-all cursor-pointer ${
                tab === t.value
                  ? "bg-white text-[#FF6B00] shadow-sm"
                  : "text-[#9CA3AF] hover:text-[#1A1A2E]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <Card className="border border-[#F0EBE3] shadow-none bg-white animate-fade-in-up-delay-3">
        <CardContent className="p-0">
          {transactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8F5F0] mb-4">
                <Receipt className="h-7 w-7 text-[#9CA3AF]" />
              </div>
              <p className="text-sm font-medium text-[#1A1A2E]">No transactions yet</p>
              <p className="text-xs text-[#9CA3AF] mt-1">Record your first sale from the dashboard!</p>
            </div>
          )}
          <div className="divide-y divide-[#F0EBE3]">
            {transactions.map((txn) => {
              const isSale = txn.type === "sale" || txn.type === "payment_received";
              return (
                <div key={txn.id} className="flex items-center justify-between p-4 sm:p-5 hover:bg-[#FFFBF5] transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isSale ? "bg-[#E8F5EC]" : "bg-[#FDEAEA]"}`}>
                      {isSale ? <ArrowUpRight className="h-5 w-5 text-[#1B8C3A]" /> : <ArrowDownLeft className="h-5 w-5 text-[#E53935]" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A2E]">{txn.item || (isSale ? "Sale" : "Expense")}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-[#9CA3AF]">{timeLabel(txn.created_at)}</span>
                        <span className="h-1 w-1 rounded-full bg-[#D1D5DB]" />
                        <span className="text-[11px] text-[#9CA3AF]">{dateLabel(txn.created_at)}</span>
                        {txn.quantity && (
                          <>
                            <span className="h-1 w-1 rounded-full bg-[#D1D5DB]" />
                            <span className="text-[11px] text-[#9CA3AF]">Qty: {txn.quantity}</span>
                          </>
                        )}
                        {txn.recorded_via && (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            txn.recorded_via === "whatsapp" ? "bg-[#E8F5EC] text-[#25D366]" : "bg-[#EBF1FF] text-[#1A56DB]"
                          }`}>
                            {txn.recorded_via}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className={`text-base font-bold tracking-tight ${isSale ? "text-[#1B8C3A]" : "text-[#E53935]"}`}>
                    {isSale ? "+" : "-"}{fmt(txn.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
