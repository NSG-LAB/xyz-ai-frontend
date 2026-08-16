"use client";

import React, { useState } from "react";
import {
  HeartHandshake,
  CheckSquare,
  Award,
  PhoneCall,
  Calendar,
  Sparkles,
  ShieldCheck,
  User,
  Clock,
  Send,
  MessageSquare,
  Bus,
  CreditCard,
  Bell
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { MOCK_ATTENDANCE_SUMMARY, MOCK_EXAMS, MOCK_PERFORMANCE } from "@/lib/api/mockData";
import { useRouter } from "next/navigation";

export default function ParentPortalPage() {
  const router = useRouter();
  const { openEscalationModal, addChatMessage } = useAppStore();
  const [parentDoubt, setParentDoubt] = useState("");

  const handleAskParentAI = (queryText: string) => {
    router.push("/student/chat");
    setTimeout(() => {
      addChatMessage({
        id: `user_${Date.now()}`,
        sender: "user",
        text: `[Parent Query - Meera]\n\n${queryText}`,
        timestamp: new Date().toISOString()
      });
    }, 300);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-rose-950/80 via-slate-900 to-slate-950 border border-rose-500/20 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-semibold">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Parent Portal • Caring & Patient AI Companion</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, Meera 👋
            </h2>
            <p className="text-sm text-slate-300">
              Monitoring <strong>Siva's</strong> academic journey at Delhi Public School (Grade 11-A Science).
            </p>
          </div>

          <button
            onClick={() => openEscalationModal({
              subject: "Parent-Teacher Consultation",
              teacherName: "Dr. Rajesh Sharma (Class Teacher)",
              reason: "Parent consultation on upcoming Unit Tests and career stream guidance"
            })}
            className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-2 self-start md:self-auto transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Request Teacher Call</span>
          </button>
        </div>

        {/* Parent AI Quick Query Box */}
        <div className="pt-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={parentDoubt}
              onChange={(e) => setParentDoubt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && parentDoubt.trim() && handleAskParentAI(parentDoubt)}
              placeholder="Ask XYZ AI: 'How is Siva doing in Physics?' or 'When are the school holidays?'"
              className="flex-1 rounded-2xl p-3.5 text-xs sm:text-sm bg-slate-900/80 text-white placeholder:text-slate-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              onClick={() => parentDoubt.trim() && handleAskParentAI(parentDoubt)}
              className="px-5 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Child Attendance */}
        <div className="glass-card p-5 rounded-3xl space-y-2 border border-emerald-500/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-emerald-500" /> Child Attendance
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {MOCK_ATTENDANCE_SUMMARY.overallPercentage}%
            </h3>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Excellent
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {MOCK_ATTENDANCE_SUMMARY.attendedClasses} of {MOCK_ATTENDANCE_SUMMARY.totalClasses} classes attended
          </p>
        </div>

        {/* Academic Marks */}
        <div className="glass-card p-5 rounded-3xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Award className="w-4 h-4 text-primary" /> Overall GPA
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-foreground">
              91.2%
            </h3>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Grade A1
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Ranked Top 5% in Science Section
          </p>
        </div>

        {/* Next Exam */}
        <div className="glass-card p-5 rounded-3xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-500" /> Next Major Test
          </span>
          <h3 className="text-xl font-bold text-foreground">
            Physics (Aug 21)
          </h3>
          <p className="text-xs text-muted-foreground">
            Unit Test II • 6 Days Remaining
          </p>
        </div>

        {/* School Bus & Transport */}
        <div className="glass-card p-5 rounded-3xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Bus className="w-4 h-4 text-indigo-500" /> Bus Route #14
          </span>
          <h3 className="text-xl font-bold text-foreground">
            Arrived Safely
          </h3>
          <p className="text-xs text-muted-foreground">
            Morning scan at 08:14 AM at School Gate
          </p>
        </div>
      </div>

      {/* Two Column Layout (Recent Observations & Teacher Remarks) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Teacher Notes */}
        <div className="glass-card p-6 rounded-3xl border border-border space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" /> Faculty Observations & Updates
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Dr. Rajesh Sharma (Physics)</span>
                <span className="text-muted-foreground text-[10px]">Yesterday</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "Siva is participating actively in electromagnetic lab experiments. Recommended to practice numericals 15-20 before Friday's assessment."
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Mrs. Sunita Verma (Chemistry)</span>
                <span className="text-muted-foreground text-[10px]">Aug 12</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "Completed homework notes on time. Good conceptual understanding of Aldehydes."
              </p>
            </div>
          </div>
        </div>

        {/* Direct Actions & Quick Links */}
        <div className="glass-card p-6 rounded-3xl border border-border space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Administrative & Fee Summary
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">Term 2 Tuition Fee</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Paid in Full • Receipt #DPS-8841</p>
              </div>
              <span className="text-xs font-bold text-emerald-600">Verified</span>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">Upcoming Parent-Teacher Meeting (PTM)</p>
                <p className="text-[11px] text-muted-foreground">Saturday, Aug 29 • 09:00 AM - 01:00 PM</p>
              </div>
              <button
                onClick={() => handleAskParentAI("What are the agenda items for the upcoming PTM meeting on Aug 29?")}
                className="text-xs font-bold text-primary hover:underline"
              >
                View Agenda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
