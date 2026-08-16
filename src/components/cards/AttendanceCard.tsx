"use client";

import React from "react";
import Link from "next/link";
import { CheckSquare, ArrowUpRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { MOCK_ATTENDANCE_SUMMARY } from "@/lib/api/mockData";
import { cn } from "@/lib/utils";

export const AttendanceCard: React.FC = () => {
  const data = MOCK_ATTENDANCE_SUMMARY;
  const isSafe = data.overallPercentage >= data.requiredPercentage;

  // Circular gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (data.overallPercentage / 100) * circumference;

  return (
    <div className="glass-card p-4 sm:p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between h-full group hover:border-primary/40 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> Attendance
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {data.overallPercentage}%
            </h4>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" /> Safe
            </span>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-muted"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-emerald-500 transition-all duration-1000 ease-out"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <span className="absolute text-[10px] font-bold text-muted-foreground">
            &gt;75%
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          <strong>{data.attendedClasses}</strong> / {data.totalClasses} Classes
        </span>
        <Link
          href="/student/attendance"
          className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <span>Breakdown</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
