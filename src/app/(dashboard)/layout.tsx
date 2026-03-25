"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  BarChart3,
  BookOpen,
  Brain,
  CreditCard,
  Home,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: Home, labelHi: "होम" },
  { href: "/khata", label: "Khata", icon: BookOpen, labelHi: "खाता", badgeKey: "overdue" as const },
  { href: "/sales", label: "Sales", icon: CreditCard, labelHi: "बिक्री" },
  { href: "/store", label: "Store", icon: ShoppingBag, labelHi: "दुकान" },
  { href: "/inventory", label: "Inventory", icon: Package, labelHi: "स्टॉक" },
  { href: "/finance", label: "Finance", icon: TrendingUp, labelHi: "फाइनेंस" },
  { href: "/reports", label: "Reports", icon: BarChart3, labelHi: "रिपोर्ट" },
  { href: "/team", label: "Team", icon: Users, labelHi: "टीम" },
  { href: "/settings", label: "Settings", icon: Settings, labelHi: "सेटिंग्स" },
];

interface SidebarData {
  healthScore: number;
  healthLevel: string;
  overdueCount: number;
}

function SidebarContent({ pathname, data }: { pathname: string; data: SidebarData }) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Logo Area */}
      <div className="flex h-[72px] items-center gap-3 px-5">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF8C38] text-lg font-bold text-white shadow-lg shadow-[#FF6B00]/20">
          B
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#1B8C3A]" />
        </div>
        <div>
          <span className="font-[var(--font-poppins)] text-xl font-bold tracking-tight text-[#1A1A2E]">Badhiya</span>
          <span className="ml-0.5 rounded bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] px-1.5 py-0.5 text-[9px] font-bold text-white align-top">AI</span>
        </div>
      </div>

      {/* Made in India badge */}
      <div className="mx-4 mb-3 flex items-center gap-2 rounded-lg bg-[#FFFBF5] px-3 py-2">
        <div className="flex gap-0.5">
          <div className="h-3 w-1 rounded-full bg-[#FF6B00]" />
          <div className="h-3 w-1 rounded-full bg-white border border-gray-200" />
          <div className="h-3 w-1 rounded-full bg-[#1B8C3A]" />
        </div>
        <span className="text-[10px] font-medium text-[#6B7280]">Made for Bharat</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5 px-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const badge = item.badgeKey === "overdue" && data.overdueCount > 0 ? String(data.overdueCount) : undefined;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-[#FFF3E8] to-[#FFFBF5] text-[#FF6B00] shadow-sm shadow-[#FF6B00]/5"
                  : "text-[#6B7280] hover:bg-[#FFFBF5] hover:text-[#1A1A2E]"
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                isActive ? "bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/30" : "bg-[#F8F5F0] text-[#9CA3AF] group-hover:bg-[#FFF3E8] group-hover:text-[#FF6B00]"
              }`}>
                <item.icon className="h-4 w-4" />
              </div>
              <span className="flex-1">{item.label}</span>
              {badge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E53935] px-1.5 text-[10px] font-bold text-white">
                  {badge}
                </span>
              )}
              {isActive && <div className="h-5 w-1 rounded-full bg-[#FF6B00]" />}
            </Link>
          );
        })}
      </nav>

      {/* Health Score Card */}
      <div className="mx-3 mb-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF6B00] via-[#FF8C38] to-[#FFB066] p-4 text-white">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-white/10 -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 h-16 w-16 rounded-full bg-white/10 translate-y-6 -translate-x-6" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-white/80">Business Health</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm">{data.healthLevel.toUpperCase()}</span>
            </div>
            <p className="mt-1.5 text-3xl font-bold tracking-tight">{data.healthScore}<span className="text-base font-normal text-white/60">/900</span></p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white transition-all duration-1000" style={{ width: `${Math.round((data.healthScore / 900) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* India Tricolor line */}
      <div className="flex h-1 mx-3 mb-3 rounded-full overflow-hidden">
        <div className="flex-1 bg-[#FF6B00]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#1B8C3A]" />
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, businessId } = useAuth();
  const ownerName = user?.name || "User";
  const initial = ownerName.charAt(0).toUpperCase();
  const [sidebarData, setSidebarData] = useState<SidebarData>({ healthScore: 0, healthLevel: "bronze", overdueCount: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ type: string; message: string; time: string }>>([]);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const searchDebounce = useRef<ReturnType<typeof setTimeout>>(undefined);
  const notifsRef = useRef<HTMLDivElement>(null);

  // Close notifications on click outside
  useEffect(() => {
    if (!notifsOpen) return;
    const handler = (e: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) setNotifsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifsOpen]);

  // Cleanup debounce on unmount
  useEffect(() => () => clearTimeout(searchDebounce.current), []);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  const fetchSidebarData = useCallback(async () => {
    if (!token || !businessId) return;
    try {
      const [dash, credit] = await Promise.all([
        api<{ healthScore: number; healthLevel: string }>(`/businesses/${businessId}/dashboard`, { token }),
        api<{ totalOutstanding: number; overdue60Amount: number; activeCustomers: number; totalCustomers: number }>(`/businesses/${businessId}/credit/summary`, { token }).catch(() => null),
      ]);
      setSidebarData({
        healthScore: dash.healthScore || 0,
        healthLevel: dash.healthLevel || "bronze",
        overdueCount: credit?.activeCustomers || 0,
      });
    } catch {}
  }, [token, businessId]);

  useEffect(() => { fetchSidebarData(); }, [fetchSidebarData]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    clearTimeout(searchDebounce.current);
    if (!q || q.length < 2 || !token || !businessId) { setSearchResults(null); setSearchOpen(false); return; }
    searchDebounce.current = setTimeout(async () => {
      try {
        const results = await api<any>(`/businesses/${businessId}/search?q=${encodeURIComponent(q)}`, { token });
        setSearchResults(results);
        setSearchOpen(true);
      } catch { setSearchResults(null); }
    }, 300);
  };

  const handleLoadNotifs = async () => {
    if (!token || !businessId) return;
    setNotifsOpen(!notifsOpen);
    if (!notifsOpen) {
      try {
        const data = await api<Array<{ type: string; message: string; time: string }>>(`/businesses/${businessId}/notifications`, { token });
        setNotifications(data);
      } catch { setNotifications([]); }
    }
  };

  const handleAskAi = async (directQuery?: string) => {
    const q = directQuery || aiQuery;
    if (!q.trim() || !token || !businessId) return;
    if (directQuery) setAiQuery(directQuery);
    setAiLoading(true);
    setAiResponse("");
    try {
      const result = await api<any>("/ai/query", { method: "POST", token, body: { query: q, channel: "web" } });
      setAiResponse(result.response || result.intent || "Main samajh nahi paaya. Kripya dobara try karein.");
    } catch { setAiResponse("AI se connect nahi ho paya. Kripya baad mein try karein."); }
    finally { setAiLoading(false); }
  };

  if (!token) return null;

  return (
    <div className="flex h-screen bg-[#FFFBF5]">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[260px] flex-shrink-0 border-r border-[#F0EBE3] lg:block">
        <SidebarContent pathname={pathname} data={sidebarData} />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Premium Topbar */}
        <header className="flex h-[68px] items-center justify-between border-b border-[#F0EBE3] bg-white/80 backdrop-blur-md px-4 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger className="inline-flex items-center justify-center rounded-xl h-10 w-10 hover:bg-[#FFF3E8] transition-colors lg:hidden cursor-pointer">
                <Menu className="h-5 w-5 text-[#1A1A2E]" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] p-0">
                <SidebarContent pathname={pathname} data={sidebarData} />
              </SheetContent>
            </Sheet>

            {/* Search */}
            <div className="relative hidden md:block">
              <div className="flex items-center gap-2 rounded-xl bg-[#F8F5F0] px-4 py-2.5 w-72 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FF6B00]/20 focus-within:shadow-sm">
                <Search className="h-4 w-4 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchResults && setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                  className="bg-transparent text-sm text-[#1A1A2E] placeholder:text-[#9CA3AF] outline-none w-full"
                />
                <kbd className="hidden lg:inline rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-[#9CA3AF] border border-[#F0EBE3]">/</kbd>
              </div>
              {searchOpen && searchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-white border border-[#F0EBE3] shadow-xl shadow-[#FF6B00]/5 p-3 z-50 max-h-80 overflow-y-auto">
                  {searchResults.transactions?.length === 0 && searchResults.customers?.length === 0 && searchResults.products?.length === 0 && (
                    <p className="text-sm text-[#9CA3AF] text-center py-4">No results found</p>
                  )}
                  {searchResults.customers?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Customers</p>
                      {searchResults.customers.map((c: any) => (
                        <Link key={c.id} href="/khata" className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-[#FFF3E8] cursor-pointer">
                          <span className="text-sm font-medium text-[#1A1A2E]">{c.name}</span>
                          <span className="text-xs text-[#E53935]">₹{parseFloat(c.total_outstanding).toLocaleString("en-IN")}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchResults.products?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Products</p>
                      {searchResults.products.map((p: any) => (
                        <Link key={p.id} href="/inventory" className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-[#FFF3E8] cursor-pointer">
                          <span className="text-sm font-medium text-[#1A1A2E]">{p.name}</span>
                          <span className="text-xs text-[#6B7280]">{p.stock_quantity} in stock</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchResults.transactions?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Transactions</p>
                      {searchResults.transactions.map((t: any) => (
                        <Link key={t.id} href="/sales" className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-[#FFF3E8] cursor-pointer">
                          <span className="text-sm font-medium text-[#1A1A2E]">{t.item || t.type}</span>
                          <span className={`text-xs font-semibold ${t.type === "sale" ? "text-[#1B8C3A]" : "text-[#E53935]"}`}>₹{parseFloat(t.amount).toLocaleString("en-IN")}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="text-xs text-[#6B7280] hover:text-[#1A1A2E] hover:bg-[#F8F5F0] rounded-xl cursor-pointer">
                हिन्दी | En
              </Button>
            </Link>
            <div className="relative" ref={notifsRef}>
              <button aria-label="Notifications" onClick={handleLoadNotifs} className="relative rounded-xl p-2.5 text-[#6B7280] hover:bg-[#FFF3E8] hover:text-[#FF6B00] transition-colors cursor-pointer">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#E53935]" />
              </button>
              {notifsOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 rounded-xl bg-white border border-[#F0EBE3] shadow-xl shadow-[#FF6B00]/5 p-4 z-50">
                  <p className="text-xs font-bold text-[#1A1A2E] uppercase tracking-wider mb-3">Notifications</p>
                  {notifications.length === 0 ? (
                    <p className="text-sm text-[#9CA3AF] text-center py-4">All clear!</p>
                  ) : notifications.map((n, i) => (
                    <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[#F0EBE3] last:border-0">
                      <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${n.type === "stock" ? "bg-[#F9A825]" : n.type === "credit" ? "bg-[#E53935]" : "bg-[#1B8C3A]"}`} />
                      <div>
                        <p className="text-sm text-[#1A1A2E]">{n.message}</p>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button size="sm" className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white rounded-xl shadow-md shadow-[#FF6B00]/20 transition-all hover:shadow-lg hover:shadow-[#FF6B00]/30 cursor-pointer" onClick={() => setAiOpen(true)}>
              <Sparkles className="mr-1.5 h-4 w-4" />
              Ask AI
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF8C38] text-sm font-bold text-white shadow-md shadow-[#FF6B00]/20 cursor-pointer">
              {initial}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* AI Chat Modal */}
      {aiOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setAiOpen(false)} />
          <div className="relative w-full max-w-lg mx-4 mb-4 sm:mb-0 rounded-2xl bg-white border border-[#F0EBE3] shadow-2xl shadow-[#FF6B00]/10 overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-bold">Badhiya AI</span>
                <span className="text-[10px] bg-white/20 rounded-full px-2 py-0.5">Hindi + English</span>
              </div>
              <button aria-label="Close AI chat" onClick={() => setAiOpen(false)} className="rounded-lg p-1 hover:bg-white/20 cursor-pointer">
                <span className="text-lg leading-none">&times;</span>
              </button>
            </div>

            {/* Response Area */}
            <div className="p-5 min-h-[200px] max-h-[400px] overflow-y-auto">
              {!aiResponse && !aiLoading && (
                <div className="text-center py-8">
                  <p className="text-sm text-[#9CA3AF]">Kuch bhi poochiye — Hindi ya English mein</p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {["Aaj ka hisaab", "Low stock batao", "Govt scheme", "Profit badhaane ke tips"].map((q) => (
                      <button key={q} onClick={() => handleAskAi(q)} className="rounded-lg bg-[#FFF3E8] px-3 py-1.5 text-xs font-medium text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white transition-all cursor-pointer">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {aiLoading && (
                <div className="flex items-center gap-3 py-8 justify-center">
                  <div className="h-2 w-2 rounded-full bg-[#FF6B00] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 rounded-full bg-[#FF6B00] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 rounded-full bg-[#FF6B00] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
              {aiResponse && (
                <div className="rounded-xl bg-[#FFFBF5] border border-[#F0EBE3] p-4">
                  <p className="text-sm text-[#1A1A2E] leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-5 py-4 border-t border-[#F0EBE3] bg-[#FFFBF5]">
              <input
                type="text"
                placeholder="Type your question..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !aiLoading && handleAskAi()}
                className="flex-1 bg-white rounded-xl border border-[#F0EBE3] px-4 py-2.5 text-sm text-[#1A1A2E] placeholder:text-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#FF6B00]/20"
                autoFocus
              />
              <button
                onClick={() => handleAskAi()}
                disabled={aiLoading || !aiQuery.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] text-white shadow-md shadow-[#FF6B00]/20 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
