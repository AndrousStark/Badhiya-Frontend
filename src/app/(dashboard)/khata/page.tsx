"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Search,
  Send,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle,
  IndianRupee,
  Loader2,
  User,
  Phone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

interface Customer {
  id: string;
  name: string;
  phone: string | null;
  total_outstanding: number;
  last_payment_at: string | null;
  status: "overdue_60" | "overdue_30" | "current" | "paid";
}

interface CreditSummary {
  totalOutstanding: number;
  overdue60Amount: number;
  activeCustomers: number;
  totalCustomers: number;
}

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const statusConfig = {
  overdue_60: {
    label: "60+ Days",
    pill: "bg-[#FDEAEA] text-[#E53935]",
    border: "border-l-[#E53935]",
    avatarBg: "bg-gradient-to-br from-[#E53935] to-[#FF5252]",
    icon: AlertTriangle,
  },
  overdue_30: {
    label: "30+ Days",
    pill: "bg-[#FFF8E1] text-[#E6A817]",
    border: "border-l-[#F9A825]",
    avatarBg: "bg-gradient-to-br from-[#F9A825] to-[#FFD54F]",
    icon: Clock,
  },
  current: {
    label: "Current",
    pill: "bg-[#E8F5EC] text-[#1B8C3A]",
    border: "border-l-[#1B8C3A]",
    avatarBg: "bg-gradient-to-br from-[#1B8C3A] to-[#34D399]",
    icon: CheckCircle,
  },
  paid: {
    label: "Paid",
    pill: "bg-[#E8F5EC] text-[#1B8C3A]",
    border: "border-l-[#1B8C3A]",
    avatarBg: "bg-gradient-to-br from-[#1B8C3A] to-[#34D399]",
    icon: CheckCircle,
  },
};

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "No payment yet";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

export default function KhataPage() {
  const { token, businessId } = useAuth();
  const [search, setSearch] = useState("");
  const [creditForm, setCreditForm] = useState({ name: "", phone: "", amount: "", description: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [summary, setSummary] = useState<CreditSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token || !businessId) return;
    try {
      const [custs, sum] = await Promise.all([
        api<Customer[]>(`/businesses/${businessId}/credit`, { token }),
        api<CreditSummary>(`/businesses/${businessId}/credit/summary`, { token }),
      ]);
      setCustomers(Array.isArray(custs) ? custs : []);
      setSummary(sum);
    } catch (e) {
      console.error("Khata fetch failed:", e);
    } finally {
      setLoading(false);
    }
  }, [token, businessId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleGiveCredit = async () => {
    if (!token || !businessId || !creditForm.name || !creditForm.amount) return;
    setSubmitting(true);
    try {
      await api(`/businesses/${businessId}/credit/give`, {
        method: "POST",
        token,
        body: {
          customerName: creditForm.name,
          customerPhone: creditForm.phone || undefined,
          amount: parseFloat(creditForm.amount),
          description: creditForm.description || undefined,
        },
      });
      setCreditForm({ name: "", phone: "", amount: "", description: "" });
      setDialogOpen(false);
      await fetchData();
    } catch (e) {
      console.error("Give credit failed:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReminder = async (customerId: string) => {
    if (!token || !businessId) return;
    try {
      await api(`/businesses/${businessId}/credit/${customerId}/remind`, { method: "POST", token });
    } catch (e) { console.error("Reminder failed:", e); }
  };

  const handleSendAllReminders = async () => {
    if (!token || !businessId) return;
    try {
      const result = await api<{ sent: number; failed: number }>(`/businesses/${businessId}/credit/remind/all`, { method: "POST", token });
      console.log(`Reminders sent: ${result.sent}, failed: ${result.failed}`);
    } catch (e) { console.error("Bulk reminders failed:", e); }
  };

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const s = summary || { totalOutstanding: 0, overdue60Amount: 0, activeCustomers: 0, totalCustomers: 0 };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-[#FF6B00]" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">Khata / Credit Book</h1>
          <p className="text-sm text-[#9CA3AF]">Udhar manage karein — sabka hisaab clear</p>
        </div>
        <div className="flex gap-2.5">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/20 cursor-pointer">
                <Plus className="h-4 w-4" /> Give Credit
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-[#1A1A2E]">Naya Udhar Dein</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <Input placeholder="Customer ka naam *" value={creditForm.name} onChange={(e) => setCreditForm((p) => ({ ...p, name: e.target.value }))} className="pl-10 rounded-xl bg-[#F8F5F0] border-[#F0EBE3] focus:bg-white" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <Input placeholder="Phone (optional)" value={creditForm.phone} onChange={(e) => setCreditForm((p) => ({ ...p, phone: e.target.value }))} className="pl-10 rounded-xl bg-[#F8F5F0] border-[#F0EBE3] focus:bg-white" />
                </div>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <Input type="number" placeholder="Amount (Rs) *" value={creditForm.amount} onChange={(e) => setCreditForm((p) => ({ ...p, amount: e.target.value }))} className="pl-10 rounded-xl bg-[#F8F5F0] border-[#F0EBE3] focus:bg-white" />
                </div>
                <Input placeholder="Description (optional)" value={creditForm.description} onChange={(e) => setCreditForm((p) => ({ ...p, description: e.target.value }))} className="rounded-xl bg-[#F8F5F0] border-[#F0EBE3] focus:bg-white" />
                <Button className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white rounded-xl shadow-md shadow-[#FF6B00]/20 h-11 cursor-pointer" onClick={handleGiveCredit} disabled={submitting || !creditForm.name || !creditForm.amount}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Udhar Record Karein
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="rounded-xl border-[#1A56DB]/30 text-[#1A56DB] hover:bg-[#EBF1FF] cursor-pointer" onClick={handleSendAllReminders}>
            <Send className="mr-1.5 h-4 w-4" /> Send All Reminders
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up-delay-1">
        <KpiCard title="Total Outstanding" value={fmt(s.totalOutstanding)} changeType={s.totalOutstanding > 0 ? "down" : "neutral"} change={s.totalOutstanding > 0 ? "Collection needed" : "All clear!"} icon={<BookOpen className="h-5 w-5 text-[#E53935]" />} />
        <KpiCard title="Overdue (60+ Days)" value={fmt(s.overdue60Amount)} changeType="down" change="Urgent!" icon={<AlertTriangle className="h-5 w-5 text-[#E53935]" />} />
        <KpiCard title="Active Customers" value={`${s.activeCustomers}`} icon={<IndianRupee className="h-5 w-5 text-[#1B8C3A]" />} />
        <KpiCard title="Total Customers" value={`${s.totalCustomers}`} icon={<BookOpen className="h-5 w-5 text-[#1A56DB]" />} />
      </div>

      {/* Search */}
      <div className="relative max-w-sm animate-fade-in-up-delay-2">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
        <Input
          placeholder="Customer search karein..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-xl bg-white border-[#F0EBE3] focus:ring-2 focus:ring-[#FF6B00]/20"
        />
      </div>

      {/* Customer List */}
      <div className="space-y-3 animate-fade-in-up-delay-3">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8F5F0] mb-4">
              <BookOpen className="h-7 w-7 text-[#9CA3AF]" />
            </div>
            <p className="text-sm font-medium text-[#1A1A2E]">No customers found</p>
            <p className="text-xs text-[#9CA3AF] mt-1">Give your first credit to get started!</p>
          </div>
        )}
        {filtered.map((customer) => {
          const status = customer.status || "current";
          const config = statusConfig[status] || statusConfig.current;
          const StatusIcon = config.icon;
          const outstanding = parseFloat(String(customer.total_outstanding)) || 0;
          return (
            <Card key={customer.id} className={`border border-[#F0EBE3] border-l-4 shadow-none card-hover bg-white cursor-pointer ${config.border}`}>
              <CardContent className="flex items-center justify-between p-4 sm:p-5">
                <div className="flex items-center gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md ${config.avatarBg}`}>
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[#1A1A2E]">{customer.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${config.pill}`}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                      <span className="text-[11px] text-[#9CA3AF]">
                        {timeAgo(customer.last_payment_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xl font-bold tracking-tight text-[#1A1A2E]">
                      {fmt(outstanding)}
                    </p>
                    {customer.phone && (
                      <p className="text-[10px] text-[#9CA3AF] mt-0.5">{customer.phone}</p>
                    )}
                  </div>
                  {customer.phone && (
                    <Button
                      size="sm"
                      onClick={() => handleSendReminder(customer.id)}
                      className={`rounded-lg text-xs cursor-pointer ${
                        status === "overdue_60"
                          ? "bg-[#E53935] hover:bg-[#C62828] text-white shadow-sm shadow-[#E53935]/20"
                          : "bg-white border border-[#F0EBE3] text-[#6B7280] hover:bg-[#FFF3E8] hover:text-[#FF6B00] hover:border-[#FF6B00]/30"
                      }`}
                    >
                      <Send className="mr-1 h-3 w-3" />
                      {status === "overdue_60" ? "Urgent" : "Remind"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
