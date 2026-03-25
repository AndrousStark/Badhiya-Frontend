"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight, Loader2, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { token, setAuth } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  useEffect(() => { if (token) router.replace("/"); }, [token, router]);

  const handleSendOtp = async () => {
    if (phone.length !== 10 || !/^[6-9]/.test(phone)) {
      setError("Valid Indian mobile number daalein (10 digits)");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api("/auth/otp/send", { method: "POST", body: { phone: `+91${phone}` } });
      setStep("otp");
    } catch (e: any) {
      setError(e.message || "OTP bhejne mein problem hui");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("6 digit OTP daalein");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await api<any>("/auth/otp/verify", {
        method: "POST",
        body: { phone: `+91${phone}`, otp },
      });
      setAuth({
        token: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
        businessId: data.user?.businessId,
      });
      if (data.isNewUser) {
        router.push("/onboarding");
      } else {
        router.push("/");
      }
    } catch (e: any) {
      setError(e.message || "OTP galat hai ya expire ho gaya");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFFBF5]">
      {/* Left — Branding (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#FF6B00] via-[#FF8C38] to-[#FFB066] items-center justify-center p-12">
        <div className="absolute top-0 right-0 h-60 w-60 rounded-full bg-white/10 -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/10 translate-y-10 -translate-x-10" />
        <div className="absolute bottom-10 right-10 h-20 w-20 rounded-full bg-white/5" />
        <div className="relative text-white max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur-sm">B</div>
            <div>
              <span className="text-2xl font-bold">Badhiya</span>
              <span className="ml-1.5 rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold">AI</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Business Ho Jayega<br />Badhiya!
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            63 million Indian businesses ke liye AI-powered business partner. Billing, khata, inventory, AI advisor — sab Hindi mein.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> Secure</span>
            <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> AI Powered</span>
            <span>10+ Languages</span>
          </div>
          {/* Tricolor */}
          <div className="mt-10 flex h-1 max-w-xs rounded-full overflow-hidden">
            <div className="flex-1 bg-white" /><div className="flex-1 bg-white/30" /><div className="flex-1 bg-[#1B8C3A]" />
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#FF8C38] text-2xl font-bold text-white shadow-xl shadow-[#FF6B00]/30">
                B
              </div>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">Login Karein</h1>
            <p className="mt-1.5 text-sm text-[#9CA3AF]">Aapka AI Business Partner intezaar kar raha hai</p>
          </div>

          <Card className="border border-[#F0EBE3] shadow-xl shadow-[#FF6B00]/5">
            <CardContent className="p-6">
              {step === "phone" ? (
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1A1A2E]">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#9CA3AF]">+91</span>
                      <Input
                        type="tel"
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                        className="pl-14 h-12 text-lg rounded-xl bg-[#F8F5F0] border-[#F0EBE3] focus:bg-white focus:ring-2 focus:ring-[#FF6B00]/20"
                        maxLength={10}
                        autoFocus
                      />
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
                    </div>
                  </div>
                  {error && <p className="text-sm text-[#E53935] font-medium">{error}</p>}
                  <Button
                    onClick={handleSendOtp}
                    disabled={loading || phone.length !== 10}
                    className="h-12 w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white text-base font-semibold rounded-xl shadow-lg shadow-[#FF6B00]/20 cursor-pointer"
                  >
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ArrowRight className="mr-2 h-5 w-5" />}
                    OTP Bhejo
                  </Button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-xl bg-[#E8F5EC] p-3.5 text-center border border-[#1B8C3A]/10">
                    <p className="text-sm font-medium text-[#1B8C3A]">
                      OTP bhej diya gaya <strong>+91 {phone}</strong> pe
                    </p>
                    <button onClick={() => setStep("phone")} className="mt-1 text-xs font-semibold text-[#1A56DB] hover:underline cursor-pointer">
                      Number badlein
                    </button>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1A1A2E]">6-Digit OTP</label>
                    <Input
                      type="text"
                      placeholder="------"
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                      className="h-14 text-center text-3xl tracking-[0.6em] font-mono rounded-xl bg-[#F8F5F0] border-[#F0EBE3] focus:bg-white focus:ring-2 focus:ring-[#FF6B00]/20"
                      maxLength={6}
                      autoFocus
                    />
                  </div>
                  {error && <p className="text-sm text-[#E53935] font-medium">{error}</p>}
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.length !== 6}
                    className="h-12 w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white text-base font-semibold rounded-xl shadow-lg shadow-[#FF6B00]/20 cursor-pointer"
                  >
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Shield className="mr-2 h-5 w-5" />}
                    Verify & Login
                  </Button>
                  <button onClick={handleSendOtp} disabled={loading} className="w-full text-center text-sm text-[#9CA3AF] hover:text-[#FF6B00] transition-colors cursor-pointer">
                    OTP nahi aaya? Dobara bhejo
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-[#9CA3AF]">
            <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-[#1B8C3A]" /> Secure Login</span>
            <span className="h-1 w-1 rounded-full bg-[#D1D5DB]" />
            <span>No Password</span>
            <span className="h-1 w-1 rounded-full bg-[#D1D5DB]" />
            <span>100% Free</span>
          </div>
        </div>
      </div>
    </div>
  );
}
