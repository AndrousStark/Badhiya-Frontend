"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, Globe, Bell, LogOut, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

interface Business { id: string; name: string; city: string | null; area: string | null; gst_number: string | null; type: string }

export default function SettingsPage() {
  const { token, businessId, user, logout } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", ownerName: "", city: "", area: "", gstNumber: "" });
  const [language, setLanguage] = useState("hi");
  const [notifs, setNotifs] = useState({ morning: true, lowStock: true, reminders: true, weekly: false });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const fetchBusiness = useCallback(async () => {
    if (!token || !businessId) return;
    try {
      const list = await api<Business[]>("/businesses", { token });
      const b = list.find((x) => x.id === businessId) || list[0];
      if (b) {
        setForm({ name: b.name || "", ownerName: user?.name || "", city: b.city || "", area: b.area || "", gstNumber: b.gst_number || "" });
      }
    } catch (e) { console.error("Settings fetch failed:", e); }
    finally { setLoaded(true); }
  }, [token, businessId, user?.name]);

  useEffect(() => { fetchBusiness(); }, [fetchBusiness]);

  const handleSave = async () => {
    if (!token || !businessId) return;
    setSaving(true);
    try {
      await api(`/businesses/${businessId}`, {
        method: "PATCH", token,
        body: { name: form.name, city: form.city, area: form.area, gstNumber: form.gstNumber || undefined, language },
      });
      setSaveMsg("Settings saved successfully!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (e) { console.error("Save failed:", e); setSaveMsg("Save failed. Try again."); }
    finally { setSaving(false); }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!loaded) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-[#FF6B00]" /></div>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E] animate-fade-in-up">Settings</h1>

      <Card className="border border-[#F0EBE3] shadow-none bg-white animate-fade-in-up-delay-1">
        <CardHeader><CardTitle className="flex items-center gap-2 text-sm font-bold text-[#1A1A2E]"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF3E8]"><User className="h-4 w-4 text-[#FF6B00]" /></div> Business Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Business Name</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="mt-1" /></div>
          <div><Label>Owner Name</Label><Input value={form.ownerName} disabled className="mt-1 bg-gray-50" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} className="mt-1" /></div>
            <div><Label>Area</Label><Input value={form.area} onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))} className="mt-1" /></div>
          </div>
          <div><Label>GST Number</Label><Input value={form.gstNumber} onChange={(e) => setForm((p) => ({ ...p, gstNumber: e.target.value }))} placeholder="22AAAAA0000A1Z5" className="mt-1" /></div>
          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white rounded-xl shadow-md shadow-[#FF6B00]/20 cursor-pointer" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Save Changes
            </Button>
            {saveMsg && <span className={`text-sm font-medium ${saveMsg.includes("failed") ? "text-[#E53935]" : "text-[#1B8C3A]"}`}>{saveMsg}</span>}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-[#F0EBE3] shadow-none bg-white animate-fade-in-up-delay-2">
        <CardHeader><CardTitle className="flex items-center gap-2 text-sm font-bold text-[#1A1A2E]"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EBF1FF]"><Globe className="h-4 w-4 text-[#1A56DB]" /></div> Language</CardTitle></CardHeader>
        <CardContent>
          <Select value={language} onValueChange={(v) => { if (v) setLanguage(v); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
              <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
              <SelectItem value="mr">मराठी (Marathi)</SelectItem>
              <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
              <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border border-[#F0EBE3] shadow-none bg-white animate-fade-in-up-delay-3">
        <CardHeader><CardTitle className="flex items-center gap-2 text-sm font-bold text-[#1A1A2E]"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF8E1]"><Bell className="h-4 w-4 text-[#F9A825]" /></div> Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          {([
            { key: "morning" as const, label: "Morning Briefing (7 AM daily)" },
            { key: "lowStock" as const, label: "Low Stock Alerts" },
            { key: "reminders" as const, label: "Payment Reminders" },
            { key: "weekly" as const, label: "Weekly Report" },
          ]).map((item) => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifs[item.key]}
                onChange={(e) => setNotifs((p) => ({ ...p, [item.key]: e.target.checked }))}
                className="h-4 w-4 rounded border-[#F0EBE3] text-[#FF6B00] focus:ring-[#FF6B00]"
              />
              {item.label}
            </label>
          ))}
        </CardContent>
      </Card>

      <div className="pt-2">
        <Button variant="outline" className="text-[#E53935] border-[#E53935]/30 hover:bg-[#FDEAEA] hover:border-[#E53935] rounded-xl cursor-pointer" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );
}
