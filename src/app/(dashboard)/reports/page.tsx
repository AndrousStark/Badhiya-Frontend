"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart3, Download, Calendar, IndianRupee, TrendingUp, FileText, Receipt, Loader2, PieChart as PieIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

interface MonthlyReport {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  totalTransactions: number;
  averageDailyRevenue: number;
  topSellingItems: Array<{ item: string; revenue: number; count: number }>;
  expenseBreakdown: Array<{ category: string; amount: number }>;
  creditSummary: { totalOutstanding: number; overdueAmount: number; activeCustomers: number };
  healthScore: number;
  healthLevel: string;
}

interface PnlDay { date: string; revenue: number; expenses: number; profit: number }
interface ExpenseCat { category: string; amount: number; count: number; percentage: number }

const fmt = (n: number) => `₹${Math.abs(n).toLocaleString("en-IN")}`;
const EXPENSE_COLORS = ["#FF6B00", "#1A56DB", "#1B8C3A", "#F9A825", "#7C3AED", "#E53935", "#0891B2", "#6B7280"];

export default function ReportsPage() {
  const { token, businessId } = useAuth();
  const [tab, setTab] = useState("pnl");
  const [loading, setLoading] = useState(true);
  const [gstMsg, setGstMsg] = useState("");
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [pnlDays, setPnlDays] = useState<PnlDay[]>([]);
  const [expenses, setExpenses] = useState<{ categories: ExpenseCat[]; total: number } | null>(null);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthName = now.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const fetchData = useCallback(async () => {
    if (!token || !businessId) return;
    setLoading(true);
    try {
      const [rep, pnl, exp] = await Promise.all([
        api<MonthlyReport>(`/businesses/${businessId}/analytics/report/monthly?year=${year}&month=${month}`, { token }),
        api<{ days: PnlDay[] }>(`/businesses/${businessId}/analytics/pnl/monthly?year=${year}&month=${month}`, { token }),
        api<{ categories: ExpenseCat[]; total: number }>(`/businesses/${businessId}/analytics/expenses/breakdown?year=${year}&month=${month}`, { token }),
      ]);
      setReport(rep);
      setPnlDays(pnl.days || []);
      setExpenses(exp);
    } catch (e) {
      console.error("Reports fetch failed:", e);
    } finally {
      setLoading(false);
    }
  }, [token, businessId, year, month]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-[#FF6B00]" /></div>;
  }

  const r = report || { totalRevenue: 0, totalExpenses: 0, netProfit: 0, profitMargin: 0, totalTransactions: 0, averageDailyRevenue: 0, topSellingItems: [], expenseBreakdown: [], creditSummary: { totalOutstanding: 0, overdueAmount: 0, activeCustomers: 0 }, healthScore: 0, healthLevel: "bronze" };

  // GST rate: 5% for kirana/food, 12% for retail, 18% for services (configurable per business)
  const gstRate = 0.05; // Default 5% for kirana — should come from business settings
  const gstOnSales = r.totalRevenue * gstRate;
  const itcAvailable = r.totalExpenses * gstRate;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">Reports & Analytics</h1>
          <p className="text-sm text-[#9CA3AF]">Business ki poori picture — numbers mein</p>
        </div>
        <div className="flex gap-2.5">
          <div className="inline-flex items-center gap-2 rounded-xl bg-white border border-[#F0EBE3] px-4 py-2 text-sm font-medium text-[#6B7280]">
            <Calendar className="h-4 w-4 text-[#FF6B00]" />
            {monthName}
          </div>
        </div>
      </div>

      {/* KPI Cards — Real Data */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up-delay-1">
        <KpiCard title="Monthly Revenue" value={fmt(r.totalRevenue)} change={`${r.totalTransactions} transactions`} changeType={r.totalRevenue > 0 ? "up" : "neutral"} icon={<IndianRupee className="h-5 w-5 text-[#1B8C3A]" />} />
        <KpiCard title="Monthly Expenses" value={fmt(r.totalExpenses)} changeType={r.totalExpenses > 0 ? "down" : "neutral"} icon={<Receipt className="h-5 w-5 text-[#E53935]" />} />
        <KpiCard title="Net Profit" value={`${r.netProfit >= 0 ? "" : "-"}${fmt(r.netProfit)}`} change={`${r.profitMargin.toFixed(1)}% margin`} changeType={r.netProfit >= 0 ? "up" : "down"} icon={<TrendingUp className="h-5 w-5 text-[#FF6B00]" />} />
        <KpiCard title="Avg Daily Revenue" value={fmt(r.averageDailyRevenue)} change="Daily average" changeType="neutral" icon={<BarChart3 className="h-5 w-5 text-[#1A56DB]" />} />
      </div>

      {/* Tab Switcher */}
      <div className="animate-fade-in-up-delay-2">
        <div className="inline-flex items-center rounded-xl bg-[#F8F5F0] p-1">
          {[
            { value: "pnl", label: "P&L Report" },
            { value: "expenses", label: "Expenses" },
            { value: "gst", label: "GST Summary" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`rounded-lg px-5 py-2 text-sm font-medium transition-all cursor-pointer ${
                tab === t.value ? "bg-white text-[#FF6B00] shadow-sm" : "text-[#9CA3AF] hover:text-[#1A1A2E]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* P&L Tab */}
      {tab === "pnl" && (
        <div className="space-y-5 animate-fade-in-up">
          <Card className="border border-[#F0EBE3] shadow-none bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-[#1A1A2E]">Daily Revenue vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {pnlDays.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BarChart3 className="h-10 w-10 text-[#F0EBE3] mb-3" />
                  <p className="text-sm text-[#9CA3AF]">No transaction data for this month yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={pnlDays.map(d => ({ ...d, date: new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) }))} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, ""]} contentStyle={{ borderRadius: "12px", border: "1px solid #F0EBE3", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }} />
                    <Bar dataKey="revenue" fill="#1B8C3A" radius={[4, 4, 0, 0]} name="Revenue" />
                    <Bar dataKey="expenses" fill="#FF6B00" radius={[4, 4, 0, 0]} name="Expenses" opacity={0.7} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Top Selling Items */}
          {r.topSellingItems.length > 0 && (
            <Card className="border border-[#F0EBE3] shadow-none bg-white">
              <CardHeader><CardTitle className="text-sm font-bold text-[#1A1A2E]">Top Selling Items</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {r.topSellingItems.slice(0, 8).map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF3E8] text-xs font-bold text-[#FF6B00]">{i + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-[#1A1A2E]">{item.item}</p>
                          <p className="text-[11px] text-[#9CA3AF]">{item.count} sales</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-[#1B8C3A]">{fmt(item.revenue)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Expenses Tab */}
      {tab === "expenses" && (
        <div className="grid gap-5 lg:grid-cols-2 animate-fade-in-up">
          <Card className="border border-[#F0EBE3] shadow-none bg-white">
            <CardHeader><CardTitle className="text-sm font-bold text-[#1A1A2E]">Expense Distribution</CardTitle></CardHeader>
            <CardContent>
              {(!expenses || expenses.categories.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <PieIcon className="h-10 w-10 text-[#F0EBE3] mb-3" />
                  <p className="text-sm text-[#9CA3AF]">No expenses recorded this month</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={expenses.categories} cx="50%" cy="50%" outerRadius={95} innerRadius={55} dataKey="amount" strokeWidth={3} stroke="#FFFBF5">
                      {expenses.categories.map((_, i) => <Cell key={i} fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} contentStyle={{ borderRadius: "12px", border: "1px solid #F0EBE3" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card className="border border-[#F0EBE3] shadow-none bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-[#1A1A2E]">Category Breakdown</CardTitle>
                {expenses && <span className="text-sm font-bold text-[#E53935]">Total: {fmt(expenses.total)}</span>}
              </div>
            </CardHeader>
            <CardContent>
              {(!expenses || expenses.categories.length === 0) ? (
                <p className="text-sm text-[#9CA3AF] py-8 text-center">No expense data</p>
              ) : (
                <div className="space-y-5">
                  {expenses.categories.map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: EXPENSE_COLORS[i % EXPENSE_COLORS.length] }} />
                          <span className="text-sm font-medium text-[#1A1A2E]">{item.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#1A1A2E]">{fmt(item.amount)}</span>
                          <span className="text-[10px] font-semibold text-[#9CA3AF] bg-[#F8F5F0] rounded-full px-2 py-0.5">{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-[#F8F5F0]">
                        <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${item.percentage}%`, backgroundColor: EXPENSE_COLORS[i % EXPENSE_COLORS.length] }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* GST Tab */}
      {tab === "gst" && (
        <Card className="border border-[#F0EBE3] shadow-none bg-white animate-fade-in-up">
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-3 mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-[#E8F5EC] to-[#F0FFF4] p-5 border border-[#1B8C3A]/10">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-[#1B8C3A]" />
                  <p className="text-[10px] font-bold text-[#1B8C3A] uppercase tracking-wider">GSTR-1 (Sales)</p>
                </div>
                <p className="text-2xl font-bold text-[#1A1A2E]">{fmt(r.totalRevenue)}</p>
                <span className="mt-2 inline-flex items-center rounded-full bg-[#1B8C3A] px-2.5 py-0.5 text-[10px] font-bold text-white">Auto-Generated</span>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#EBF1FF] to-[#F5F8FF] p-5 border border-[#1A56DB]/10">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-[#1A56DB]" />
                  <p className="text-[10px] font-bold text-[#1A56DB] uppercase tracking-wider">GSTR-3B (Tax Due)</p>
                </div>
                <p className="text-2xl font-bold text-[#1A1A2E]">{fmt(gstOnSales)}</p>
                <span className="mt-2 inline-flex items-center rounded-full bg-[#F9A825] px-2.5 py-0.5 text-[10px] font-bold text-white">Due 20th</span>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#FFF8E1] to-[#FFFDF5] p-5 border border-[#F9A825]/10">
                <div className="flex items-center gap-2 mb-2">
                  <IndianRupee className="h-4 w-4 text-[#F9A825]" />
                  <p className="text-[10px] font-bold text-[#F9A825] uppercase tracking-wider">ITC Available</p>
                </div>
                <p className="text-2xl font-bold text-[#1A1A2E]">{fmt(itcAvailable)}</p>
                <span className="mt-2 inline-flex items-center rounded-full bg-[#F8F5F0] px-2.5 py-0.5 text-[10px] font-bold text-[#6B7280]">Claimable</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white rounded-xl shadow-md shadow-[#FF6B00]/20 cursor-pointer" onClick={() => { setGstMsg("GST filing feature coming soon! Abhi Rs 99 mein file hoga."); setTimeout(() => setGstMsg(""), 4000); }}>
                File GSTR-3B (Rs 99)
              </Button>
              {gstMsg && <span className="text-xs font-medium text-[#FF6B00] animate-fade-in-up">{gstMsg}</span>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
