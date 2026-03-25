"use client";

import { useState, useEffect, useCallback } from "react";
import { TrendingUp, Shield, ArrowRight, Loader2, Lock, Sparkles, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

const LEVELS = [
  { min: 0, max: 300, level: "Bronze", color: "#CD7F32", emoji: "B" },
  { min: 301, max: 500, level: "Silver", color: "#9CA3AF", emoji: "S" },
  { min: 501, max: 700, level: "Gold", color: "#F9A825", emoji: "G" },
  { min: 701, max: 850, level: "Platinum", color: "#7C3AED", emoji: "P" },
  { min: 851, max: 900, level: "Diamond", color: "#0891B2", emoji: "D" },
];

const LOANS = [
  { provider: "FlexiLoans", maxAmount: "₹50,000", rate: "1.5%/month", minScore: 500, color: "#1B8C3A", url: "https://www.flexiloans.com/" },
  { provider: "Kinara Capital", maxAmount: "₹2,00,000", rate: "1.2%/month", minScore: 600, color: "#1A56DB", url: "https://www.kinaracapital.com/" },
  { provider: "Lendingkart", maxAmount: "₹5,00,000", rate: "1.0%/month", minScore: 700, color: "#7C3AED", url: "https://www.lendingkart.com/" },
];

const SCHEMES = [
  { name: "PMEGP", nameHi: "प्रधानमंत्री रोजगार सृजन", amount: "₹25 lakh", subsidy: "25% subsidy", match: 85, url: "https://www.kviconline.gov.in/pmegpeportal/jsp/pmegponline.jsp" },
  { name: "Mudra Kishore", nameHi: "मुद्रा किशोर", amount: "₹5 lakh", subsidy: "No collateral", match: 92, url: "https://www.mudra.org.in/" },
  { name: "CGTMSE", nameHi: "क्रेडिट गारंटी फंड", amount: "₹5 crore", subsidy: "Guarantee", match: 70, url: "https://www.cgtmse.in/" },
];

interface Breakdown {
  bookkeeping: number;
  revenueTrend: number;
  digitalPayments: number;
  creditHealth: number;
  compliance: number;
  engagement: number;
  total: number;
  level: string;
}

interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  maxAmount: number;
  subsidy: string;
  matchScore: number;
}

export default function FinancePage() {
  const { token, businessId } = useAuth();
  const [score, setScore] = useState(0);
  const [breakdown, setBreakdown] = useState<Breakdown | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token || !businessId) return;
    try {
      const [bd, sch] = await Promise.all([
        api<Breakdown>(`/businesses/${businessId}/analytics/health-score/breakdown`, { token }),
        api<Scheme[]>(`/businesses/${businessId}/schemes`, { token }).catch(() => []),
      ]);
      setScore(bd.total || 0);
      setBreakdown(bd);
      setSchemes(Array.isArray(sch) ? sch : []);
    } catch (e) { console.error("Finance fetch failed:", e); }
    finally { setLoading(false); }
  }, [token, businessId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const level = LEVELS.find((l) => score >= l.min && score <= l.max) || LEVELS[0];
  const scorePercent = (score / 900) * 100;

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-[#FF6B00]" /></div>;
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">Financial Hub</h1>
        <p className="text-sm text-[#9CA3AF]">Loans, schemes, insurance — sab ek jagah</p>
      </div>

      {/* Health Score Hero */}
      <Card className="relative overflow-hidden border-0 shadow-xl shadow-[#FF6B00]/8 animate-fade-in-up-delay-1">
        <div className="relative bg-gradient-to-br from-[#FF6B00] via-[#FF8C38] to-[#FFB066] p-6 sm:p-8 text-white">
          {/* Decorative */}
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-1/2 h-24 w-24 rounded-full bg-white/5 translate-y-8" />

          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-white/80" />
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Business Health Score</span>
              </div>
              <p className="text-5xl sm:text-6xl font-bold tracking-tight">{score}<span className="text-xl font-normal text-white/50"> / 900</span></p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: level.color }} />
                <span className="text-sm font-bold">{level.level} Level</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="relative h-36 w-36">
                <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="white" strokeWidth="10" strokeDasharray={`${scorePercent * 3.27} 327`} strokeLinecap="round" className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{Math.round(scorePercent)}%</span>
                  <span className="text-[10px] text-white/60">Score</span>
                </div>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="relative mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Bookkeeping", score: breakdown?.bookkeeping ?? 0, max: 200 },
              { label: "Revenue", score: breakdown?.revenueTrend ?? 0, max: 200 },
              { label: "Credit", score: breakdown?.creditHealth ?? 0, max: 150 },
              { label: "Digital", score: breakdown?.digitalPayments ?? 0, max: 150 },
              { label: "Compliance", score: breakdown?.compliance ?? 0, max: 100 },
              { label: "Engagement", score: breakdown?.engagement ?? 0, max: 100 },
            ].map((item, i) => (
              <div key={i} className="rounded-xl bg-white/10 p-3.5 backdrop-blur-sm">
                <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider">{item.label}</p>
                <p className="mt-1 text-xl font-bold">{item.score}<span className="text-[10px] text-white/40 ml-0.5">/{item.max}</span></p>
                <div className="mt-2 h-1.5 rounded-full bg-white/15">
                  <div className="h-1.5 rounded-full bg-white transition-all duration-1000" style={{ width: `${(item.score / item.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Loans */}
      <div className="animate-fade-in-up-delay-2">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-[#FF6B00]" />
          <h2 className="text-lg font-bold text-[#1A1A2E]">Loan Offers For You</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {LOANS.map((loan, i) => {
            const available = score >= loan.minScore;
            return (
              <Card key={i} className={`border border-[#F0EBE3] shadow-none card-hover bg-white cursor-pointer ${!available ? "opacity-50" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-[#1A1A2E]">{loan.provider}</p>
                    {!available && <Lock className="h-4 w-4 text-[#9CA3AF]" />}
                  </div>
                  <p className="text-3xl font-bold tracking-tight" style={{ color: loan.color }}>{loan.maxAmount}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-[#6B7280]">Rate: <span className="font-semibold text-[#1A1A2E]">{loan.rate}</span></p>
                    <p className="text-xs text-[#6B7280]">Min Score: <span className="font-semibold text-[#1A1A2E]">{loan.minScore}</span></p>
                  </div>
                  <Button
                    className={`mt-4 w-full rounded-xl h-10 cursor-pointer ${available ? "bg-gradient-to-r from-[#1B8C3A] to-[#34D399] hover:from-[#167832] hover:to-[#1B8C3A] text-white shadow-md shadow-[#1B8C3A]/20" : "bg-[#F8F5F0] text-[#9CA3AF] cursor-not-allowed"}`}
                    disabled={!available}
                    onClick={() => available && window.open(loan.url, "_blank")}
                  >
                    {available ? "Apply in 2 min" : `${loan.minScore - score} points to unlock`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Govt Schemes */}
      <div className="animate-fade-in-up-delay-3">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-[#1B8C3A]" />
          <h2 className="text-lg font-bold text-[#1A1A2E]">Government Schemes</h2>
          <span className="text-xs text-[#9CA3AF]">matching your profile</span>
        </div>
        <div className="space-y-3">
          {(schemes.length > 0 ? schemes : SCHEMES.map(s => ({ id: s.name, name: s.name, nameHi: s.nameHi, maxAmount: 0, subsidy: s.subsidy, matchScore: s.match }))).map((scheme, i) => (
            <Card key={i} className="border border-[#F0EBE3] border-l-4 border-l-[#1B8C3A] shadow-none card-hover bg-white cursor-pointer">
              <CardContent className="flex items-center justify-between p-4 sm:p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[#1A1A2E]">{scheme.name}</p>
                    {scheme.nameHi && <span className="text-xs text-[#9CA3AF]">{scheme.nameHi}</span>}
                  </div>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    {scheme.maxAmount > 0 && <span className="font-semibold text-[#1A1A2E]">₹{(scheme.maxAmount / 100000).toFixed(0)} lakh | </span>}
                    {scheme.subsidy}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-[#E8F5EC] px-3 py-1 text-xs font-bold text-[#1B8C3A]">
                    {scheme.matchScore}% match
                  </span>
                  <Button size="sm" className="bg-gradient-to-r from-[#1B8C3A] to-[#34D399] hover:from-[#167832] hover:to-[#1B8C3A] text-white rounded-lg shadow-sm shadow-[#1B8C3A]/20 cursor-pointer" onClick={() => {
                    const urls: Record<string, string> = { "PMEGP": "https://www.kviconline.gov.in/pmegpeportal/jsp/pmegponline.jsp", "Mudra Kishore": "https://www.mudra.org.in/", "CGTMSE": "https://www.cgtmse.in/" };
                    window.open(urls[scheme.name] || "https://udyamregistration.gov.in/", "_blank");
                  }}>
                    Apply <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
