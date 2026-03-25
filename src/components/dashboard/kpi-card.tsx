"use client";

import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon?: ReactNode;
  className?: string;
}

export function KpiCard({ title, value, change, changeType = "neutral", icon, className }: KpiCardProps) {
  const changeConfig = {
    up: { color: "text-[#1B8C3A]", bg: "bg-[#E8F5EC]" },
    down: { color: "text-[#E53935]", bg: "bg-[#FDEAEA]" },
    neutral: { color: "text-[#9CA3AF]", bg: "bg-[#F8F5F0]" },
  };

  const config = changeConfig[changeType];

  return (
    <Card className={`group border border-[#F0EBE3] shadow-none card-hover bg-white cursor-pointer ${className || ""}`}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">{title}</p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8F5F0] transition-all group-hover:scale-110">
            {icon}
          </div>
        </div>
        <p className="text-2xl font-bold tracking-tight text-[#1A1A2E]">{value}</p>
        {change && (
          <div className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${config.color} ${config.bg}`}>
            {changeType === "up" && <TrendingUp className="h-3 w-3" />}
            {changeType === "down" && <TrendingDown className="h-3 w-3" />}
            {change}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
