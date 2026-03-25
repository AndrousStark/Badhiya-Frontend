"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ShoppingBag, Plus, ExternalLink, Package, TrendingUp, Loader2, Copy, Check, IndianRupee, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

interface StoreStats {
  totalProducts: number;
  ordersToday: number;
  todayRevenue: number;
  recentOrders: Array<{ id: string; customer: string | null; total: number; source: string | null; created_at: string }>;
}

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });

export default function StorePage() {
  const { token, businessId } = useAuth();
  const [stats, setStats] = useState<StoreStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token || !businessId) return;
    try {
      const data = await api<StoreStats>(`/businesses/${businessId}/store/stats`, { token });
      setStats(data);
    } catch (e) { console.error("Store fetch failed:", e); }
    finally { setLoading(false); }
  }, [token, businessId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://wa.me/c/${businessId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-[#FF6B00]" /></div>;
  }

  const s = stats || { totalProducts: 0, ordersToday: 0, todayRevenue: 0, recentOrders: [] };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">My Store</h1>
          <p className="text-sm text-[#9CA3AF]">WhatsApp storefront + orders</p>
        </div>
        <div className="flex gap-2.5">
          <Link href="/inventory">
            <Button className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white rounded-xl shadow-md shadow-[#FF6B00]/20 cursor-pointer">
              <Plus className="mr-1.5 h-4 w-4" /> Add Product
            </Button>
          </Link>
          <Button variant="outline" className="rounded-xl border-[#F0EBE3] text-[#6B7280] hover:bg-[#FFF3E8] hover:text-[#FF6B00] cursor-pointer" onClick={handleCopyLink}>
            {copied ? <Check className="mr-1.5 h-4 w-4 text-[#1B8C3A]" /> : <ExternalLink className="mr-1.5 h-4 w-4" />}
            {copied ? "Link Copied!" : "Share Store Link"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up-delay-1">
        <KpiCard title="Products Listed" value={`${s.totalProducts}`} icon={<Package className="h-5 w-5 text-[#1A56DB]" />} />
        <KpiCard title="Orders Today" value={`${s.ordersToday}`} changeType={s.ordersToday > 0 ? "up" : "neutral"} change={s.ordersToday > 0 ? "Active" : "No orders yet"} icon={<ShoppingBag className="h-5 w-5 text-[#1B8C3A]" />} />
        <KpiCard title="Today's Revenue" value={fmt(s.todayRevenue)} changeType={s.todayRevenue > 0 ? "up" : "neutral"} icon={<IndianRupee className="h-5 w-5 text-[#FF6B00]" />} />
        <KpiCard title="Avg Order Value" value={s.ordersToday > 0 ? fmt(Math.round(s.todayRevenue / s.ordersToday)) : "₹0"} icon={<TrendingUp className="h-5 w-5 text-[#7C3AED]" />} />
      </div>

      <Card className="border border-[#F0EBE3] shadow-none bg-white animate-fade-in-up-delay-2">
        <CardContent className="p-5">
          <h3 className="mb-4 text-sm font-bold text-[#1A1A2E]">Recent Sales</h3>
          {s.recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F5F0] mb-4">
                <ShoppingBag className="h-6 w-6 text-[#9CA3AF]" />
              </div>
              <p className="text-sm font-medium text-[#1A1A2E]">No sales yet</p>
              <p className="text-xs text-[#9CA3AF] mt-1">Record your first sale from the dashboard!</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F0EBE3]">
              {s.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-4 hover:bg-[#FFFBF5] -mx-5 px-5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F5EC]">
                      <ArrowUpRight className="h-5 w-5 text-[#1B8C3A]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A2E]">{order.customer || "Sale"}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-[#9CA3AF]">{timeLabel(order.created_at)}</span>
                        {order.source && (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${order.source === "whatsapp" ? "bg-[#E8F5EC] text-[#25D366]" : "bg-[#EBF1FF] text-[#1A56DB]"}`}>
                            {order.source}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-base font-bold text-[#1B8C3A]">+{fmt(order.total)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
