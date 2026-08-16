"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Mic,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { QuickActions } from "@/components/cards/QuickActions";
import { AttendanceCard } from "@/components/cards/AttendanceCard";
import { TimetableCard } from "@/components/cards/TimetableCard";
import { AssignmentCard } from "@/components/cards/AssignmentCard";
import { ExamCard } from "@/components/cards/ExamCard";
import { ChatInput } from "@/components/ai/ChatInput";
import { AIAvatar } from "@/components/ai/AIAvatar";

export default function StudentDashboardPage() {
  const router = useRouter();
  const { userProfile, avatarState, openVoiceModal, addChatMessage, t } = useAppStore();

  const handleAskAI = (text: string, attachment?: string) => {
    router.push("/student/chat");
    setTimeout(() => {
      let prompt = text;
      if (attachment) {
        prompt = `[Attached Homework/Question]\n\n${text || "Please help solve and explain this question."}`;
      }
      addChatMessage({
        id: `user_${Date.now()}`,
        sender: "user",
        text: prompt,
        timestamp: new Date().toISOString(),
      });
    }, 250);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greeting_morning");
    if (hour < 17) return t("greeting_afternoon");
    return t("greeting_evening");
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Hero AI Interactive Banner */}
      <section className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-white/10 shadow-2xl overflow-hidden">
        {/* Glow ambient background circles */}
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Delhi Public School • Class 11 Science</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {getGreeting()}, {userProfile.name} 👋
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              {t("help_prompt")} Your attendance is solid at <strong>91.2%</strong> and you have <strong>5 classes</strong> scheduled today.
            </p>
          </div>

          {/* Interactive AI Avatar with Click-to-Speak */}
          <div className="shrink-0 flex flex-col items-center">
            <AIAvatar
              state={avatarState}
              size="lg"
              showMoodBadge={true}
              onClick={openVoiceModal}
            />
            <button
              onClick={openVoiceModal}
              className="mt-2 text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Mic className="w-3 h-3 text-emerald-400 animate-pulse" /> Tap to talk with XYZ AI
            </button>
          </div>
        </div>

        {/* Big AI Input Box */}
        <div className="mt-6 relative z-10">
          <ChatInput
            onSendMessage={handleAskAI}
            placeholder="Ask XYZ AI anything about homework, concepts, attendance, or upcoming exams..."
          />
        </div>

        {/* Recommended Starter Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-300 z-10 relative">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> Try asking:
          </span>
          {[
            "What is my next class?",
            "How is my attendance in Physics?",
            "Quiz me on Electromagnetic Induction",
            "Prepare study plan for Physics Unit Test"
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleAskAI(prompt)}
              className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 text-xs border border-white/10 transition-colors flex items-center gap-1"
            >
              <span>{prompt}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>
      </section>

      {/* Today's Overview Grid (Attendance, Classes, Assignments, Next Exam) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-extrabold text-foreground tracking-tight">
            {t("overview_today")}
          </h3>
          <span className="text-xs text-muted-foreground">
            Updated live from school ERP
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AttendanceCard />
          <TimetableCard />
          <AssignmentCard />
          <ExamCard />
        </div>
      </section>

      {/* Quick Actions Component */}
      <section className="pt-2">
        <QuickActions />
      </section>
    </div>
  );
}
