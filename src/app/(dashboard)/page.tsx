"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  CreditCard,
  IndianRupee,
  Package,
  TrendingUp,
  Brain,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

interface DashboardData {
  todayRevenue: number;
  todayExpenses: number;
  todayProfit: number;
  totalOutstanding: number;
  healthScore: number;
  healthLevel: string;
  transactionCount: number;
}

interface RevenuePoint { date: string; revenue: number }
interface Transaction {
  id: string;
  type: string;
  item: string | null;
  amount: number;
  customer_name: string | null;
  created_at: string;
}
interface StockAlert {
  productName: string;
  stockQuantity: number;
  threshold: number;
  alertType: string;
}

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const dayLabel = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { weekday: "short" });
const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });

export default function DashboardHome() {
  const { token, businessId, user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [recentTxns, setRecentTxns] = useState<Transaction[]>([]);
  const [lowStock, setLowStock] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartDays, setChartDays] = useState(7);
  const [saleOpen, setSaleOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [saleForm, setSaleForm] = useState({ item: "", amount: "", quantity: "" });
  const [expenseForm, setExpenseForm] = useState({ item: "", amount: "", category: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleRecordSale = async () => {
    if (!token || !businessId || !saleForm.amount) return;
    setSubmitting(true);
    try {
      await api(`/businesses/${businessId}/transactions`, {
        method: "POST", token,
        body: { type: "sale", amount: parseFloat(saleForm.amount), item: saleForm.item || undefined, quantity: saleForm.quantity || undefined, recordedVia: "web" },
      });
      setSaleForm({ item: "", amount: "", quantity: "" });
      setSaleOpen(false);
      await fetchData();
    } catch (e) { console.error("Record sale failed:", e); }
    finally { setSubmitting(false); }
  };

  const handleRecordExpense = async () => {
    if (!token || !businessId || !expenseForm.amount) return;
    setSubmitting(true);
    try {
      await api(`/businesses/${businessId}/transactions`, {
        method: "POST", token,
        body: { type: "expense", amount: parseFloat(expenseForm.amount), item: expenseForm.item || undefined, category: expenseForm.category || undefined, recordedVia: "web" },
      });
      setExpenseForm({ item: "", amount: "", category: "" });
      setExpenseOpen(false);
      await fetchData();
    } catch (e) { console.error("Record expense failed:", e); }
    finally { setSubmitting(false); }
  };

  const fetchData = useCallback(async () => {
    if (!token || !businessId) return;
    try {
      const [dash, chart, txns, alerts] = await Promise.all([
        api<DashboardData>(`/businesses/${businessId}/dashboard`, { token }),
        api<{ date: string; revenue: number }[]>(`/businesses/${businessId}/analytics/revenue/chart?days=${chartDays}`, { token }),
        api<Transaction[]>(`/businesses/${businessId}/transactions?limit=5`, { token }),
        api<StockAlert[]>(`/businesses/${businessId}/inventory/alerts/low-stock`, { token }).catch(() => []),
      ]);
      setDashboard(dash);
      setRevenueData(chart.map((d) => ({ date: dayLabel(d.date), revenue: d.revenue })));
      setRecentTxns(Array.isArray(txns) ? txns : []);
      setLowStock(Array.isArray(alerts) ? alerts.slice(0, 5) : []);
    } catch (e) {
      console.error("Dashboard fetch failed:", e);
    } finally {
      setLoading(false);
    }
  }, [token, businessId, chartDays]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const ownerName = user?.name || "User";
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", weekday: "long" });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF6B00]" />
      </div>
    );
  }

  const d = dashboard || { todayRevenue: 0, todayExpenses: 0, todayProfit: 0, totalOutstanding: 0, healthScore: 0, healthLevel: "bronze", transactionCount: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">Namaste, {ownerName} ji!</h1>
          <p className="text-sm text-[#9CA3AF]">{today}</p>
        </div>
        <div className="flex gap-2.5">
          <Dialog open={saleOpen} onOpenChange={setSaleOpen}>
            <DialogTrigger className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/20 cursor-pointer">
                <CreditCard className="h-4 w-4" /> + Record Sale
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record Sale</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <Input type="number" placeholder="Amount (Rs) *" value={saleForm.amount} onChange={(e) => setSaleForm((p) => ({ ...p, amount: e.target.value }))} className="rounded-xl" />
                <Input placeholder="Item name (e.g. Atta 50kg)" value={saleForm.item} onChange={(e) => setSaleForm((p) => ({ ...p, item: e.target.value }))} className="rounded-xl" />
                <Input placeholder="Quantity (optional)" value={saleForm.quantity} onChange={(e) => setSaleForm((p) => ({ ...p, quantity: e.target.value }))} className="rounded-xl" />
                <Button className="w-full bg-gradient-to-r from-[#1B8C3A] to-[#34D399] hover:from-[#167832] hover:to-[#1B8C3A] text-white rounded-xl" onClick={handleRecordSale} disabled={submitting || !saleForm.amount}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Sale Record Karein
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}>
            <DialogTrigger className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border border-[#F0EBE3] bg-white text-[#1A1A2E] hover:bg-[#FFF3E8] hover:border-[#FF6B00]/30 cursor-pointer">
              + Expense
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record Expense</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <Input type="number" placeholder="Amount (Rs) *" value={expenseForm.amount} onChange={(e) => setExpenseForm((p) => ({ ...p, amount: e.target.value }))} className="rounded-xl" />
                <Input placeholder="Description (e.g. Bijli Bill)" value={expenseForm.item} onChange={(e) => setExpenseForm((p) => ({ ...p, item: e.target.value }))} className="rounded-xl" />
                <Input placeholder="Category (optional)" value={expenseForm.category} onChange={(e) => setExpenseForm((p) => ({ ...p, category: e.target.value }))} className="rounded-xl" />
                <Button className="w-full bg-[#E53935] hover:bg-[#C62828] text-white" onClick={handleRecordExpense} disabled={submitting || !expenseForm.amount}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Expense Record Karein
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Aaj Ki Bikri"
          value={fmt(d.todayRevenue)}
          change={`${d.transactionCount} transactions today`}
          changeType={d.todayRevenue > 0 ? "up" : "neutral"}
          icon={<IndianRupee className="h-5 w-5 text-[#FF6B00]" />}
        />
        <KpiCard
          title="Aaj Ka Profit"
          value={fmt(d.todayProfit)}
          change={d.todayProfit > 0 ? "Profit streak!" : "No profit yet"}
          changeType={d.todayProfit > 0 ? "up" : "neutral"}
          icon={<TrendingUp className="h-5 w-5 text-[#1B8C3A]" />}
        />
        <KpiCard
          title="Udhar Pending"
          value={fmt(d.totalOutstanding)}
          change="Total outstanding credit"
          changeType={d.totalOutstanding > 0 ? "down" : "neutral"}
          icon={<BookOpen className="h-5 w-5 text-[#E53935]" />}
        />
        <KpiCard
          title="Business Health Score"
          value={`${d.healthScore} / 900`}
          change={`${d.healthLevel.toUpperCase()}`}
          changeType="up"
          icon={<TrendingUp className="h-5 w-5 text-[#FF6B00]" />}
        />
      </div>

      {/* Charts + AI Insight Row */}
      <div className="grid gap-5 lg:grid-cols-3 animate-fade-in-up-delay-2">
        {/* Revenue Chart */}
        <Card className="border border-[#F0EBE3] shadow-none lg:col-span-2 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-[#1A1A2E]">Revenue Trend</CardTitle>
            <div className="flex gap-1 rounded-lg bg-[#F8F5F0] p-0.5">
              {[{ label: "Today", days: 1 }, { label: "Week", days: 7 }, { label: "Month", days: 30 }].map((t) => (
                <button key={t.label} onClick={() => setChartDays(t.days)} className={`h-7 rounded-md px-3 text-xs font-medium transition-all cursor-pointer ${chartDays === t.days ? "bg-white text-[#FF6B00] shadow-sm" : "text-[#9CA3AF] hover:text-[#1A1A2E]"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="revenue" fill="#FF6B00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-4">
          {/* AI Insight */}
          <Card className="relative overflow-hidden border border-[#FF6B00]/15 shadow-none bg-gradient-to-br from-[#FFF3E8] via-white to-[#FFFBF5]">
            <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-[#FF6B00]/5 -translate-y-6 translate-x-6" />
            <CardContent className="relative p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF8C38] shadow-md shadow-[#FF6B00]/20">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider">AI Insight</span>
              </div>
              {d.todayRevenue > 0 ? (
                <>
                  <p className="text-sm text-[#1A1A2E] font-semibold leading-relaxed">
                    Aaj {fmt(d.todayRevenue)} ki bikri hui — {d.transactionCount} transactions!
                    {d.todayProfit > 0 && <span className="text-[#1B8C3A]"> Profit: {fmt(d.todayProfit)}</span>}
                  </p>
                  <p className="mt-1.5 text-xs text-[#9CA3AF]">
                    {d.totalOutstanding > 0 ? `${fmt(d.totalOutstanding)} udhar pending hai. Reminders bhejein.` : "Sab udhar clear hai — badhiya!"}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-[#1A1A2E] font-semibold leading-relaxed">
                    Aaj ki pehli sale record karein! WhatsApp pe bolo ya yahan likho.
                  </p>
                  <p className="mt-1.5 text-xs text-[#9CA3AF]">
                    Tip: Daily bookkeeping se Health Score badhta hai — better loans milte hain.
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card className="border border-[#F0EBE3] shadow-none bg-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF8E1]">
                  <AlertTriangle className="h-4 w-4 text-[#F9A825]" />
                </div>
                <span className="text-xs font-bold text-[#1A1A2E] uppercase tracking-wider">Low Stock</span>
              </div>
              <div className="space-y-2.5">
                {lowStock.length === 0 ? (
                  <p className="text-sm text-[#9CA3AF] text-center py-2">All stock levels OK</p>
                ) : lowStock.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-[#374151]">{item.productName}</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${item.alertType === "out_of_stock" ? "bg-[#FDEAEA] text-[#E53935]" : "bg-[#FFF8E1] text-[#F9A825]"}`}>
                      {item.stockQuantity} left
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Transactions */}
      <Card className="border border-[#F0EBE3] shadow-none bg-white animate-fade-in-up-delay-3">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-bold text-[#1A1A2E]">Recent Transactions</CardTitle>
          <Link href="/sales" className="text-xs font-semibold text-[#FF6B00] hover:text-[#E55D00] transition-colors cursor-pointer">View All</Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {recentTxns.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">No transactions yet. Record your first sale!</p>
            )}
            {recentTxns.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between border-b py-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    txn.type === "sale" ? "bg-[#E8F5EC]" :
                    txn.type === "expense" ? "bg-[#FFF8E1]" :
                    "bg-[#EBF1FF]"
                  }`}>
                    {txn.type === "sale" && <IndianRupee className="h-4 w-4 text-[#1B8C3A]" />}
                    {txn.type === "expense" && <CreditCard className="h-4 w-4 text-[#F9A825]" />}
                    {txn.type === "payment_received" && <TrendingUp className="h-4 w-4 text-[#1A56DB]" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">{txn.item || txn.type}</p>
                    <p className="text-xs text-gray-400">{timeLabel(txn.created_at)}{txn.customer_name ? ` — ${txn.customer_name}` : ""}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    txn.type === "sale" || txn.type === "payment_received" ? "text-[#1B8C3A]" : "text-[#E53935]"
                  }`}>
                    {txn.type === "sale" || txn.type === "payment_received" ? "+" : "-"}{fmt(txn.amount)}
                  </p>
                  <Badge variant="secondary" className="text-[10px]">
                    {txn.type === "sale" ? "Sale" : txn.type === "expense" ? "Expense" : "Payment"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
