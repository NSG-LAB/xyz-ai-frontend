"use client";

import React, { useState } from "react";
import {
  MOCK_ATTENDANCE_SUMMARY,
  MOCK_SUBJECT_ATTENDANCE,
  MOCK_RECENT_ATTENDANCE_LOG,
  MOCK_ATTENDANCE_MONTHLY_TREND
} from "@/lib/api/mockData";
import {
  CheckSquare,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Sparkles,
  TrendingUp,
  User,
  Info,
  Clock,
  ArrowRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useAppStore } from "@/lib/store/useAppStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AttendancePage() {
  const router = useRouter();
  const { addChatMessage } = useAppStore();
  const summary = MOCK_ATTENDANCE_SUMMARY;
  const subjects = MOCK_SUBJECT_ATTENDANCE;
  const logs = MOCK_RECENT_ATTENDANCE_LOG;

  const [activeTab, setActiveTab] = useState<"breakdown" | "trend" | "logs">("breakdown");

  const handleAskAIAttendance = (prompt: string) => {
    router.push("/student/chat");
    setTimeout(() => {
      addChatMessage({
        id: `user_${Date.now()}`,
        sender: "user",
        text: prompt,
        timestamp: new Date().toISOString(),
      });
    }, 300);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <CheckSquare className="w-7 h-7 text-emerald-500" /> Attendance Tracker
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            CBSE Academic Year 2026 • Minimum Requirement: 75.0%
          </p>
        </div>

        {/* AI Quick Analysis Trigger */}
        <button
          onClick={() => handleAskAIAttendance("Analyze my subject attendance and tell me if I have any risk areas")}
          className="px-4 py-2.5 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20 flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>AI Attendance Audit</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Overall Percentage */}
        <div className="glass-card p-4 sm:p-5 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Overall Attendance
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {summary.overallPercentage}%
            </h3>
            <span className="text-xs font-bold text-emerald-500">Above 75%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Exam Eligibility: <strong>Verified</strong>
          </p>
        </div>

        {/* Attended Classes */}
        <div className="glass-card p-4 sm:p-5 rounded-3xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Attended Classes
          </span>
          <h3 className="text-3xl font-black text-foreground mt-1.5">
            {summary.attendedClasses}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Out of {summary.totalClasses} total periods
          </p>
        </div>

        {/* Missed / Leaves */}
        <div className="glass-card p-4 sm:p-5 rounded-3xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Absences / Leaves
          </span>
          <h3 className="text-3xl font-black text-rose-500 mt-1.5">
            {summary.absentClasses}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            14 Medical + 5 Casual Leaves
          </p>
        </div>

        {/* Safe Margin Buffer */}
        <div className="glass-card p-4 sm:p-5 rounded-3xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Safety Margin
          </span>
          <h3 className="text-3xl font-black text-indigo-500 mt-1.5">
            +16.2%
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Can miss up to ~14 classes safely
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2">
        {[
          { id: "breakdown", label: "Subject Breakdown" },
          { id: "trend", label: "Monthly Trend & Analytics" },
          { id: "logs", label: "Recent Daily Log" }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all",
              activeTab === t.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Subject Breakdown */}
      {activeTab === "breakdown" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub) => {
              const isWarning = sub.percentage < 85;
              return (
                <div
                  key={sub.subject}
                  className="glass-card p-5 rounded-3xl space-y-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-foreground">{sub.subject}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3 text-indigo-500" /> {sub.teacher}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-xl text-xs font-extrabold",
                        isWarning
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      )}
                    >
                      {sub.percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Attended: {sub.attendedClasses} / {sub.totalClasses}</span>
                      <span>Target: &gt;75%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isWarning ? "bg-amber-500" : "bg-emerald-500"
                        )}
                        style={{ width: `${sub.percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border/60">
                    <span className="text-[11px] text-muted-foreground">
                      Updated {sub.lastUpdated}
                    </span>
                    <button
                      onClick={() => handleAskAIAttendance(`How can I improve my attendance in ${sub.subject}?`)}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>Ask AI</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Monthly Trend */}
      {activeTab === "trend" && (
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-foreground">Monthly Attendance History</h4>
              <p className="text-xs text-muted-foreground">Term 1 & Term 2 Trajectory</p>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Avg: 92.4%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ATTENDANCE_MONTHLY_TREND}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.15)" />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                <YAxis domain={[70, 100]} stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    borderRadius: "1rem",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAtt)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 3: Daily Log */}
      {activeTab === "logs" && (
        <div className="glass-card rounded-3xl overflow-hidden border border-border">
          <div className="p-4 border-b border-border/80 bg-muted/30">
            <h4 className="text-sm font-bold text-foreground">Recent 7-Day Class Records</h4>
          </div>
          <div className="divide-y divide-border/60">
            {logs.map((log, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      log.status === "present" ? "bg-emerald-500" : "bg-rose-500"
                    )}
                  />
                  <div>
                    <p className="text-sm font-bold text-foreground">{log.date}</p>
                    <p className="text-xs text-muted-foreground">{log.remarks}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-bold capitalize",
                    log.status === "present"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                  )}
                >
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
