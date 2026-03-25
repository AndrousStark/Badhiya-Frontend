"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Plus, Shield, Crown, Sparkles, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

interface TeamMember {
  id: string;
  name: string | null;
  phone: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const roleConfig: Record<string, { pill: string; avatar: string; icon: typeof Crown }> = {
  owner: { pill: "bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] text-white", avatar: "bg-gradient-to-br from-[#FF6B00] to-[#FF8C38]", icon: Crown },
  manager: { pill: "bg-[#EBF1FF] text-[#1A56DB]", avatar: "bg-gradient-to-br from-[#1A56DB] to-[#60A5FA]", icon: Shield },
  staff: { pill: "bg-[#E8F5EC] text-[#1B8C3A]", avatar: "bg-gradient-to-br from-[#1B8C3A] to-[#34D399]", icon: Users },
};

export default function TeamPage() {
  const { token, businessId } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMsg, setShowMsg] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token || !businessId) return;
    try {
      const data = await api<TeamMember[]>(`/businesses/${businessId}/team`, { token });
      setMembers(Array.isArray(data) ? data : []);
    } catch (e) { console.error("Team fetch failed:", e); }
    finally { setLoading(false); }
  }, [token, businessId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-[#FF6B00]" /></div>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">Team</h1>
          <p className="text-sm text-[#9CA3AF]">Staff manage karein</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white rounded-xl shadow-md shadow-[#FF6B00]/20 cursor-pointer" onClick={() => { setShowMsg(true); setTimeout(() => setShowMsg(false), 3000); }}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Member
          </Button>
          {showMsg && <span className="inline-flex items-center gap-1 text-xs font-medium text-[#FF6B00] animate-fade-in-up"><CheckCircle className="h-3 w-3" /> Coming soon!</span>}
        </div>
      </div>

      <div className="space-y-3 animate-fade-in-up-delay-1">
        {members.length === 0 ? (
          <Card className="border border-[#F0EBE3] shadow-none bg-white">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-10 w-10 text-[#F0EBE3] mb-3" />
              <p className="text-sm font-medium text-[#1A1A2E]">No team members found</p>
            </CardContent>
          </Card>
        ) : members.map((m) => {
          const config = roleConfig[m.role] || roleConfig.staff;
          const Icon = config.icon;
          return (
            <Card key={m.id} className="border border-[#F0EBE3] shadow-none card-hover bg-white cursor-pointer">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white shadow-lg ${config.avatar}`}>
                    {(m.name || "U").charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[#1A1A2E]">{m.name || "User"}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{m.phone}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${config.pill}`}>
                  <Icon className="h-3 w-3" />{m.role.charAt(0).toUpperCase() + m.role.slice(1)}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="relative overflow-hidden border border-[#F0EBE3] shadow-none bg-gradient-to-br from-[#FFFBF5] to-[#FFF3E8] animate-fade-in-up-delay-2">
        <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-[#FF6B00]/5 -translate-y-8 translate-x-8" />
        <CardContent className="relative p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF3E8] mb-4">
            <Sparkles className="h-7 w-7 text-[#FF6B00]" />
          </div>
          <p className="text-base font-bold text-[#1A1A2E]">Team features unlock karein</p>
          <p className="mt-1 text-sm text-[#9CA3AF]">Growth plan mein roles, permissions aur activity log milega</p>
          <Button className="mt-5 bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white rounded-xl shadow-md shadow-[#FF6B00]/20 cursor-pointer" onClick={() => { setShowMsg(true); setTimeout(() => setShowMsg(false), 3000); }}>
            Upgrade to Growth — ₹699/mo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
