import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  CreditCard,
  Globe,
  MessageCircle,
  Package,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5]">
      {/* ===================== NAVBAR ===================== */}
      <header className="sticky top-0 z-50 border-b border-[#F0EBE3]/60 bg-white/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF8C38] text-lg font-bold text-white shadow-lg shadow-[#FF6B00]/20">
              B
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1A1A2E]">Badhiya</span>
            <span className="rounded bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] px-1.5 py-0.5 text-[9px] font-bold text-white">AI</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-[#6B7280] hover:text-[#FF6B00] transition-colors cursor-pointer">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-[#6B7280] hover:text-[#FF6B00] transition-colors cursor-pointer">How It Works</a>
            <a href="#pricing" className="text-sm font-medium text-[#6B7280] hover:text-[#FF6B00] transition-colors cursor-pointer">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-[#6B7280] hover:text-[#1A1A2E] cursor-pointer">Login</Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white rounded-xl shadow-md shadow-[#FF6B00]/20 cursor-pointer">
                Free Mein Shuru Karein
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Subtle warm gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFBF5] via-[#FFF3E8] to-[#FFFBF5]" />
        {/* Decorative circles */}
        <div className="absolute top-20 right-[10%] h-72 w-72 rounded-full bg-[#FF6B00]/5 blur-3xl" />
        <div className="absolute bottom-10 left-[5%] h-60 w-60 rounded-full bg-[#1B8C3A]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8 animate-fade-in-up">
              {/* Made in India pill */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm border border-[#F0EBE3]">
                <div className="flex gap-0.5">
                  <div className="h-3 w-1 rounded-full bg-[#FF6B00]" />
                  <div className="h-3 w-1 rounded-full bg-white border border-gray-200" />
                  <div className="h-3 w-1 rounded-full bg-[#1B8C3A]" />
                </div>
                <span className="text-xs font-semibold text-[#1A1A2E]">Made for 63 Million Indian Businesses</span>
                <Sparkles className="h-3.5 w-3.5 text-[#FF6B00]" />
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-[#1A1A2E] sm:text-5xl lg:text-[3.5rem]">
                Business Ho Jayega{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] bg-clip-text text-transparent">Badhiya!</span>
                  <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 200 12" fill="none"><path d="M2 8c40-6 80-6 120-2s50 4 76 0" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" opacity="0.3" /></svg>
                </span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-[#6B7280]">
                India ka pehla <strong className="text-[#1A1A2E]">AI Business Partner</strong> — aapki dukaan ka hisaab, udhar, inventory, aur profit prediction.{" "}
                <strong className="text-[#FF6B00]">Hindi mein, WhatsApp pe, FREE.</strong>
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/login">
                  <Button size="lg" className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white font-semibold text-base px-8 rounded-xl shadow-xl shadow-[#FF6B00]/20 transition-all hover:shadow-2xl hover:shadow-[#FF6B00]/30 sm:w-auto cursor-pointer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp Pe Shuru Karein
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full border-[#F0EBE3] text-[#1A1A2E] hover:bg-white hover:border-[#FF6B00]/30 rounded-xl text-base px-8 sm:w-auto cursor-pointer">
                    <Smartphone className="mr-2 h-5 w-5 text-[#FF6B00]" />
                    Dashboard Dekhein
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-[#9CA3AF]">
                <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-[#1B8C3A]" /> No Credit Card</span>
                <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-[#FF6B00]" /> 2 Min Setup</span>
                <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-[#1A56DB]" /> 10+ Languages</span>
              </div>
            </div>

            {/* Hero Dashboard Preview */}
            <div className="hidden lg:block animate-fade-in-up-delay-2">
              <div className="relative">
                {/* Glow behind */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FF6B00]/20 to-[#1B8C3A]/10 blur-2xl" />
                <div className="relative rounded-2xl border border-[#F0EBE3] bg-white p-6 shadow-2xl shadow-[#FF6B00]/8">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#9CA3AF]">Namaste, Rajesh ji!</p>
                      <p className="text-base font-bold text-[#1A1A2E]">Sharma General Store</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFF3E8] to-[#FFF8E1] px-3 py-1.5">
                      <div className="h-2 w-2 rounded-full bg-[#FF6B00]" />
                      <span className="text-xs font-bold text-[#FF6B00]">GOLD 580</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-[#FFF3E8] to-[#FFFBF5] p-4 border border-[#FF6B00]/10">
                      <p className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider">Aaj Ki Bikri</p>
                      <p className="mt-1 text-2xl font-bold text-[#1A1A2E]">&#8377;14,200</p>
                      <p className="mt-1 text-xs font-semibold text-[#1B8C3A]">&#9650; +12%</p>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-[#E8F5EC] to-[#F0FFF4] p-4 border border-[#1B8C3A]/10">
                      <p className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider">Aaj Ka Profit</p>
                      <p className="mt-1 text-2xl font-bold text-[#1B8C3A]">&#8377;3,100</p>
                      <p className="mt-1 text-xs font-semibold text-[#1B8C3A]">4-din streak!</p>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-[#FDEAEA] to-[#FFF5F5] p-4 border border-[#E53935]/10">
                      <p className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider">Udhar Pending</p>
                      <p className="mt-1 text-2xl font-bold text-[#E53935]">&#8377;1.5L</p>
                      <p className="mt-1 text-xs font-semibold text-[#E53935]">3 overdue</p>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-[#EBF1FF] to-[#F5F8FF] p-4 border border-[#1A56DB]/10">
                      <p className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider">AI Insight</p>
                      <p className="mt-1 text-sm font-semibold text-[#1A1A2E]">Holi mein colors stock karo!</p>
                      <p className="mt-1 text-xs font-semibold text-[#1A56DB]">+280% demand</p>
                    </div>
                  </div>
                  {/* Mini tricolor at bottom */}
                  <div className="mt-4 flex h-1 rounded-full overflow-hidden">
                    <div className="flex-1 bg-[#FF6B00]" /><div className="flex-1 bg-white" /><div className="flex-1 bg-[#1B8C3A]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== STATS BAR ===================== */}
      <section className="border-y border-[#F0EBE3] bg-white py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:grid-cols-4">
          {[
            { value: "63M+", label: "Indian MSMEs", color: "text-[#FF6B00]" },
            { value: "500M+", label: "WhatsApp Users", color: "text-[#25D366]" },
            { value: "98.4%", label: "AI Cost Savings", color: "text-[#1A56DB]" },
            { value: "10+", label: "Indian Languages", color: "text-[#1B8C3A]" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-[#9CA3AF]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== PAIN POINTS ===================== */}
      <section className="bg-[#FFFBF5] py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full bg-[#FFF3E8] px-4 py-1.5 text-xs font-bold text-[#FF6B00] mb-4">PROBLEMS WE SOLVE</span>
            <h2 className="text-3xl font-bold text-[#1A1A2E] sm:text-4xl">
              Yeh Problems Hain Aapki?
            </h2>
            <p className="mt-3 text-base text-[#6B7280] max-w-2xl mx-auto">
              Badhiya har ek problem solve karta hai — Hindi mein, WhatsApp pe, bilkul FREE
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: BookOpen, pain: "Profit pata nahi chalta", solution: "AI daily P&L bhejta hai — subah 7 baje WhatsApp pe", color: "#FF6B00", bg: "from-[#FFF3E8] to-white" },
              { icon: CreditCard, pain: "Udhar wapas nahi aata", solution: "Auto WhatsApp reminder + UPI link — 3x faster collection", color: "#E53935", bg: "from-[#FDEAEA] to-white" },
              { icon: TrendingUp, pain: "Competition se haar rahe", solution: "AI competitor pricing + demand prediction bata deta hai", color: "#1A56DB", bg: "from-[#EBF1FF] to-white" },
              { icon: Package, pain: "Stock khatam ho jaata hai", solution: "Low stock alert + AI reorder suggestion before festivals", color: "#7C3AED", bg: "from-[#F3E8FF] to-white" },
              { icon: BarChart3, pain: "GST filing ka tension", solution: "Auto GST invoice + GSTR-1/3B report ready — Rs 99 mein", color: "#1B8C3A", bg: "from-[#E8F5EC] to-white" },
              { icon: Shield, pain: "Loan nahi milta", solution: "Business Health Score (0-900) se loan unlock karo — 90 din mein", color: "#F9A825", bg: "from-[#FFF8E1] to-white" },
            ].map((item, i) => (
              <Card key={i} className={`group border-0 shadow-sm card-hover bg-gradient-to-br ${item.bg} overflow-hidden cursor-pointer`}>
                <CardContent className="relative p-6">
                  <div className="absolute top-0 right-0 h-20 w-20 rounded-full blur-2xl opacity-20" style={{ background: item.color }} />
                  <div className="relative">
                    <div className="mb-4 inline-flex rounded-xl p-3 shadow-sm" style={{ background: `${item.color}10` }}>
                      <item.icon className="h-6 w-6" style={{ color: item.color }} />
                    </div>
                    <h3 className="mb-2 text-base font-bold text-[#1A1A2E]">&ldquo;{item.pain}&rdquo;</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{item.solution}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section id="how-it-works" className="bg-white py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full bg-[#E8F5EC] px-4 py-1.5 text-xs font-bold text-[#1B8C3A] mb-4">SIMPLE SETUP</span>
            <h2 className="text-3xl font-bold text-[#1A1A2E] sm:text-4xl">
              3 Steps Mein Shuru
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: "1", title: "WhatsApp pe 'Hi' bhejo", desc: "Badhiya number pe message karo. 2 minute mein register. No app download needed.", icon: MessageCircle, color: "#FF6B00" },
              { step: "2", title: "Sale record karo", desc: "'Becha 50kg atta 2500' — bus itna likho ya bolo. AI sab samajh lega.", icon: Zap, color: "#1B8C3A" },
              { step: "3", title: "AI advice paao", desc: "Subah 7 baje daily briefing. Demand prediction. Competitor pricing. Sab FREE.", icon: Brain, color: "#1A56DB" },
            ].map((item, i) => (
              <div key={i} className="group relative rounded-2xl bg-[#FFFBF5] p-8 text-center card-hover border border-[#F0EBE3] cursor-pointer">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-all group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}CC)`, boxShadow: `0 8px 24px ${item.color}30` }}>
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#1A1A2E]">{item.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES BENTO ===================== */}
      <section id="features" className="bg-[#FFFBF5] py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full bg-[#EBF1FF] px-4 py-1.5 text-xs font-bold text-[#1A56DB] mb-4">POWERFUL FEATURES</span>
            <h2 className="text-3xl font-bold text-[#1A1A2E] sm:text-4xl">
              Ek App Mein Sab Kuch
            </h2>
            <p className="mt-3 text-base text-[#6B7280]">
              Vyapar billing karta hai. Khatabook ledger. <strong className="text-[#1A1A2E]">Badhiya SAB karta hai.</strong>
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "AI Business Advisor", desc: "Daily morning briefing, demand prediction, pricing advice — sab Hindi mein", icon: Brain, color: "#7C3AED" },
              { title: "Udhar / Khata", desc: "Digital credit book + auto WhatsApp reminder with UPI payment link", icon: BookOpen, color: "#E53935" },
              { title: "WhatsApp Store", desc: "Customers order from you on WhatsApp. ONDC listing bhi included.", icon: MessageCircle, color: "#25D366" },
              { title: "Billing & GST", desc: "GST invoice 1 tap mein. GSTR-1/3B auto-generated report.", icon: CreditCard, color: "#FF6B00" },
              { title: "Inventory", desc: "Stock tracking, low stock alerts, expiry warning, barcode scan", icon: Package, color: "#1A56DB" },
              { title: "Health Score", desc: "0-900 score builds your credit profile. Higher = better loan access.", icon: TrendingUp, color: "#F9A825" },
              { title: "Govt Schemes", desc: "AI matches 100+ schemes to your profile. PMEGP, Mudra, Stand-Up India.", icon: Shield, color: "#1B8C3A" },
              { title: "Voice-First", desc: "Bolo ya likho — Hindi, Tamil, Telugu. 10+ languages via Bhashini AI.", icon: Smartphone, color: "#0891B2" },
            ].map((item, i) => (
              <Card key={i} className="group border border-[#F0EBE3] shadow-none card-hover bg-white cursor-pointer">
                <CardContent className="p-5">
                  <div className="mb-4 inline-flex rounded-xl p-2.5 transition-all group-hover:scale-110" style={{ background: `${item.color}10` }}>
                    <item.icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <h3 className="mb-1.5 font-bold text-[#1A1A2E]">{item.title}</h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PRICING ===================== */}
      <section id="pricing" className="bg-white py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full bg-[#FFF8E1] px-4 py-1.5 text-xs font-bold text-[#F9A825] mb-4">PRICING</span>
            <h2 className="text-3xl font-bold text-[#1A1A2E] sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="mt-3 text-base text-[#6B7280]">Free se shuru karein. Jab business grow kare, upgrade karein.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { name: "Free", nameHi: "मुफ्त", price: "0", features: ["Daily briefing (1/day)", "50 AI queries/month", "Manual bookkeeping", "20 products catalog"], cta: "Shuru Karein", popular: false, gradient: "from-[#FFFBF5] to-white" },
              { name: "Starter", nameHi: "स्टार्टर", price: "299", features: ["Unlimited AI queries", "WhatsApp storefront", "Auto bookkeeping", "GST invoicing", "Business Health Score", "100 products"], cta: "Upgrade Karein", popular: true, gradient: "from-[#FFF3E8] to-white" },
              { name: "Growth", nameHi: "ग्रोथ", price: "699", features: ["Everything in Starter +", "Demand prediction", "Competitor intelligence", "ONDC listing", "Financial products", "Priority support"], cta: "Growth Plan", popular: false, gradient: "from-[#E8F5EC] to-white" },
            ].map((plan, i) => (
              <Card key={i} className={`relative overflow-hidden border card-hover cursor-pointer ${plan.popular ? "border-[#FF6B00] shadow-xl shadow-[#FF6B00]/10 scale-[1.02]" : "border-[#F0EBE3] shadow-sm"}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8C38]" />
                )}
                <CardContent className={`p-7 bg-gradient-to-b ${plan.gradient}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#1A1A2E]">{plan.name}</h3>
                      <p className="text-xs text-[#9CA3AF]">{plan.nameHi}</p>
                    </div>
                    {plan.popular && <span className="rounded-full bg-[#FF6B00] px-3 py-1 text-[10px] font-bold text-white">POPULAR</span>}
                  </div>
                  <div className="mb-6">
                    <span className="text-xs text-[#9CA3AF]">&#8377;</span>
                    <span className="text-4xl font-bold text-[#1A1A2E]">{plan.price}</span>
                    <span className="text-sm text-[#9CA3AF]">/month</span>
                  </div>
                  <ul className="mb-7 space-y-3">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-[#374151]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1B8C3A]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/login">
                    <Button className={`w-full rounded-xl cursor-pointer ${plan.popular ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20" : "bg-[#1A1A2E] hover:bg-[#2D2D42] text-white"}`}>
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00] via-[#FF8C38] to-[#FFB066]" />
        <div className="absolute top-0 right-0 h-60 w-60 rounded-full bg-white/10 -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/10 translate-y-10 -translate-x-10" />

        <div className="relative mx-auto max-w-3xl text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 mb-6 backdrop-blur-sm">
            <Star className="h-4 w-4 text-[#FFD700]" />
            <span className="text-sm font-medium">Join thousands of Indian business owners</span>
          </div>
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl leading-tight">
            Aaj Se Business<br />Badhiya Banao
          </h2>
          <p className="mt-5 text-lg text-white/80 max-w-xl mx-auto">
            63 million businesses. Zero AI advisors. Ab aapke paas hai — <strong className="text-white">Badhiya.</strong>
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-white text-[#FF6B00] hover:bg-white/90 font-bold px-10 rounded-xl shadow-xl cursor-pointer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Free Mein Shuru Karein
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {/* India tricolor */}
          <div className="mt-10 flex h-1 max-w-xs mx-auto rounded-full overflow-hidden">
            <div className="flex-1 bg-white" /><div className="flex-1 bg-white/30" /><div className="flex-1 bg-[#1B8C3A]" />
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-[#1A1A2E] py-14 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF8C38] text-lg font-bold text-white">B</div>
              <div>
                <span className="font-bold text-white text-lg">Badhiya</span>
                <p className="text-xs text-white/50">Business Ho Jayega Badhiya!</p>
              </div>
            </div>
            <div className="flex gap-8 text-sm text-white/50">
              <a href="#" className="hover:text-white transition-colors cursor-pointer">Privacy</a>
              <a href="#" className="hover:text-white transition-colors cursor-pointer">Terms</a>
              <a href="#" className="hover:text-white transition-colors cursor-pointer">Contact</a>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-8">
            <p className="text-xs text-white/40">2026 Badhiya AI. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                <div className="h-3 w-1 rounded-full bg-[#FF6B00]" />
                <div className="h-3 w-1 rounded-full bg-white" />
                <div className="h-3 w-1 rounded-full bg-[#1B8C3A]" />
              </div>
              <span className="text-xs text-white/40">Proudly Made in India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
