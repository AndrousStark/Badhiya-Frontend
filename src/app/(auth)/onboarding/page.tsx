"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Store, MapPin, FileText, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";

const STEPS = [
  { title: "Business Type", icon: Store },
  { title: "Business Info", icon: FileText },
  { title: "Location", icon: MapPin },
  { title: "Done!", icon: Check },
];

const BUSINESS_TYPES = [
  { value: "kirana", label: "Kirana Store", labelHi: "किराना दुकान", icon: Store, color: "#FF6B00" },
  { value: "retail", label: "Retail Shop", labelHi: "रिटेल शॉप", icon: Store, color: "#1A56DB" },
  { value: "vendor", label: "Street Vendor", labelHi: "ठेला / स्टॉल", icon: Store, color: "#1B8C3A" },
  { value: "manufacturer", label: "Manufacturer", labelHi: "मैन्युफैक्चरर", icon: Store, color: "#7C3AED" },
  { value: "services", label: "Services", labelHi: "सेवाएं", icon: Store, color: "#0891B2" },
  { value: "other", label: "Other", labelHi: "अन्य", icon: Store, color: "#6B7280" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { token, refreshToken, user, setAuth } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not authenticated
  useEffect(() => { if (!token) router.replace("/login"); }, [token, router]);
  const [form, setForm] = useState({
    businessType: "",
    businessName: "",
    ownerName: "",
    city: "",
    area: "",
    gstNumber: "",
  });

  const updateForm = (key: string, value: string) => { setForm((prev) => ({ ...prev, [key]: value })); setError(""); };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const biz = await api<any>("/businesses", {
        method: "POST",
        token: token!,
        body: {
          name: form.businessName,
          type: form.businessType,
          city: form.city,
          area: form.area,
          gstNumber: form.gstNumber || undefined,
        },
      });
      setAuth({
        token: token!,
        refreshToken: refreshToken || "",
        user,
        businessId: biz.id,
      });
      setStep(3);
    } catch (e: any) {
      setError(e.message || "Registration failed. Kripya dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFFBF5] px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 ${
                i <= step
                  ? "bg-gradient-to-br from-[#FF6B00] to-[#FF8C38] text-white shadow-lg shadow-[#FF6B00]/20"
                  : "bg-[#F8F5F0] text-[#9CA3AF]"
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-8 rounded-full transition-all duration-500 ${i < step ? "bg-[#FF6B00]" : "bg-[#F0EBE3]"}`} />
              )}
            </div>
          ))}
        </div>

        <Card className="border border-[#F0EBE3] shadow-xl shadow-[#FF6B00]/5">
          <CardContent className="p-7">
            {/* Step 0: Business Type */}
            {step === 0 && (
              <div className="space-y-5 animate-fade-in-up">
                <div>
                  <h2 className="text-xl font-bold text-[#1A1A2E]">Aapka business kaisa hai?</h2>
                  <p className="text-sm text-[#9CA3AF] mt-1">Business type select karein</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {BUSINESS_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updateForm("businessType", type.value)}
                      className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-5 text-center transition-all cursor-pointer ${
                        form.businessType === type.value
                          ? "border-[#FF6B00] bg-[#FFF3E8] shadow-md shadow-[#FF6B00]/10"
                          : "border-[#F0EBE3] hover:border-[#FF6B00]/30 hover:bg-[#FFFBF5]"
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${type.color}15` }}>
                        <type.icon className="h-5 w-5" style={{ color: type.color }} />
                      </div>
                      <span className="text-sm font-semibold text-[#1A1A2E]">{type.label}</span>
                      <span className="text-[10px] text-[#9CA3AF]">{type.labelHi}</span>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={() => setStep(1)}
                  disabled={!form.businessType}
                  className="h-12 w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white rounded-xl shadow-lg shadow-[#FF6B00]/20 cursor-pointer"
                >
                  Aage Badhein <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 1: Business Info */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in-up">
                <div>
                  <h2 className="text-xl font-bold text-[#1A1A2E]">Business ki details</h2>
                  <p className="text-sm text-[#9CA3AF] mt-1">Basic information bharein</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#1A1A2E]">Aapka Naam</label>
                  <Input placeholder="Rajesh Sharma" value={form.ownerName} onChange={(e) => updateForm("ownerName", e.target.value)} className="h-12 rounded-xl bg-[#F8F5F0] border-[#F0EBE3] focus:bg-white" autoFocus />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#1A1A2E]">Dukaan / Business Ka Naam</label>
                  <Input placeholder="Sharma General Store" value={form.businessName} onChange={(e) => updateForm("businessName", e.target.value)} className="h-12 rounded-xl bg-[#F8F5F0] border-[#F0EBE3] focus:bg-white" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#1A1A2E]">GST Number <span className="text-[#9CA3AF] font-normal">(optional)</span></label>
                  <Input placeholder="22AAAAA0000A1Z5" value={form.gstNumber} onChange={(e) => updateForm("gstNumber", e.target.value.toUpperCase())} className="h-12 rounded-xl bg-[#F8F5F0] border-[#F0EBE3] focus:bg-white" maxLength={15} />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(0)} className="h-12 rounded-xl border-[#F0EBE3] cursor-pointer">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={() => setStep(2)} disabled={!form.businessName || !form.ownerName} className="h-12 flex-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white rounded-xl shadow-lg shadow-[#FF6B00]/20 cursor-pointer">
                    Aage Badhein <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in-up">
                <div>
                  <h2 className="text-xl font-bold text-[#1A1A2E]">Dukaan kahaan hai?</h2>
                  <p className="text-sm text-[#9CA3AF] mt-1">Location se local insights milenge</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#1A1A2E]">City / Sheher</label>
                  <Input placeholder="Jaipur" value={form.city} onChange={(e) => updateForm("city", e.target.value)} className="h-12 rounded-xl bg-[#F8F5F0] border-[#F0EBE3] focus:bg-white" autoFocus />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#1A1A2E]">Area / Mohalla <span className="text-[#9CA3AF] font-normal">(optional)</span></label>
                  <Input placeholder="Vaishali Nagar" value={form.area} onChange={(e) => updateForm("area", e.target.value)} className="h-12 rounded-xl bg-[#F8F5F0] border-[#F0EBE3] focus:bg-white" />
                </div>
                {error && <p className="text-sm font-medium text-[#E53935]">{error}</p>}
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="h-12 rounded-xl border-[#F0EBE3] cursor-pointer">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading || !form.city} className="h-12 flex-1 bg-gradient-to-r from-[#1B8C3A] to-[#34D399] hover:from-[#167832] hover:to-[#1B8C3A] text-white rounded-xl shadow-lg shadow-[#1B8C3A]/20 cursor-pointer">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                    Register Karein
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="space-y-6 text-center py-4 animate-fade-in-up">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B8C3A] to-[#34D399] shadow-xl shadow-[#1B8C3A]/20">
                  <Check className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#1A1A2E]">Badhiya!</h2>
                  <p className="mt-2 text-[#9CA3AF]">
                    <strong className="text-[#1A1A2E]">{form.businessName || "Aapki dukaan"}</strong> register ho gayi!
                  </p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-[#FFF3E8] to-[#FFFBF5] p-5 text-left border border-[#FF6B00]/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-[#FF6B00]" />
                    <p className="text-sm font-bold text-[#FF6B00]">Main yeh sab kar sakta hoon:</p>
                  </div>
                  <ul className="space-y-2 text-sm text-[#374151]">
                    {[
                      "Sale record: \"becha 50kg atta 2500\"",
                      "Udhar track: \"Ravi ko 500 udhar\"",
                      "Hisaab: \"aaj ka hisaab\"",
                      "Stock alerts — automatic",
                      "Govt scheme matching — AI powered",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#E8F5EC] text-[10px] font-bold text-[#1B8C3A]">{i + 1}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={() => router.push("/")}
                  className="h-12 w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white text-base font-semibold rounded-xl shadow-xl shadow-[#FF6B00]/20 cursor-pointer"
                >
                  Dashboard Pe Jaaein <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tricolor at bottom */}
        <div className="mt-6 flex h-1 max-w-xs mx-auto rounded-full overflow-hidden">
          <div className="flex-1 bg-[#FF6B00]" />
          <div className="flex-1 bg-white border-y border-[#F0EBE3]" />
          <div className="flex-1 bg-[#1B8C3A]" />
        </div>
      </div>
    </div>
  );
}
