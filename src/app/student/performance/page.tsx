"use client";

import React from "react";
import { MOCK_PERFORMANCE } from "@/lib/api/mockData";
import {
  Award,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Target,
  ArrowRight,
  BookOpen
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { useAppStore } from "@/lib/store/useAppStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function PerformancePage() {
  const router = useRouter();
  const { addChatMessage } = useAppStore();
  const subjects = MOCK_PERFORMANCE;

  const chartData = subjects.map((s) => ({
    name: s.subject.split(" ")[0],
    StudentScore: s.score,
    ClassAverage: s.classAverage,
  }));

  const handleAskAIPlan = (subName: string, areas: string[]) => {
    router.push("/student/chat");
    setTimeout(() => {
      addChatMessage({
        id: `user_${Date.now()}`,
        sender: "user",
        text: `Create an improvement plan for ${subName} focusing on my weak areas: ${areas.join(", ")}`,
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
            <Award className="w-7 h-7 text-rose-500" /> Academic Performance
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Cumulative Grade Point: <strong>91.2% (Grade A1)</strong> • Class Rank: Top 5%
          </p>
        </div>

        <button
          onClick={() => {
            router.push("/student/chat");
            setTimeout(() => {
              addChatMessage({
                id: `user_${Date.now()}`,
                sender: "user",
                text: "Give me an AI analysis of my academic strengths and areas needing attention across all subjects",
                timestamp: new Date().toISOString()
              });
            }, 300);
          }}
          className="px-4 py-2.5 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20 flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>AI Growth Strategy</span>
        </button>
      </div>

      {/* Comparison Chart */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Subject Mastery vs Class Benchmark</h3>
            <p className="text-xs text-muted-foreground">Term 1 Evaluation Standards</p>
          </div>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            +14.8% above class avg
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.15)" />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} />
              <YAxis domain={[50, 100]} stroke="#888888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  borderRadius: "1rem",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff"
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Bar dataKey="StudentScore" name="Your Score (%)" fill="#6366f1" radius={[8, 8, 0, 0]} />
              <Bar dataKey="ClassAverage" name="Class Average (%)" fill="#94a3b8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Deep Dives (Strengths & Areas to Improve) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Subject Diagnostic Cards</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((sub) => (
            <div
              key={sub.subject}
              className="glass-card p-5 rounded-3xl border border-border space-y-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-foreground">{sub.subject}</h4>
                  <span className="text-xs text-muted-foreground">
                    Class Avg: {sub.classAverage}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-primary">{sub.score}%</span>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                    Grade {sub.grade}
                  </p>
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sub.strengths.map((str, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-500/20"
                    >
                      {str}
                    </span>
                  ))}
                </div>
              </div>

              {/* Areas to Improve */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Target Improvements
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sub.areasToImprove.map((area, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-medium border border-amber-500/20"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-border/60 flex justify-end">
                <button
                  onClick={() => handleAskAIPlan(sub.subject, sub.areasToImprove)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Build AI Improvement Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
