"use client";

import React, { useState } from "react";
import {
  MOCK_TIMETABLE_TODAY,
  MOCK_TIMETABLE_TOMORROW
} from "@/lib/api/mockData";
import {
  Clock,
  MapPin,
  User,
  Sparkles,
  Calendar,
  ArrowRight,
  BookOpen,
  CheckCircle2
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function TimetablePage() {
  const router = useRouter();
  const { addChatMessage } = useAppStore();
  const [dayView, setDayView] = useState<"today" | "tomorrow" | "week">("today");

  const timetable = dayView === "today" ? MOCK_TIMETABLE_TODAY : MOCK_TIMETABLE_TOMORROW;

  const handleAskAI = (prompt: string) => {
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
            <Clock className="w-7 h-7 text-blue-500" /> Class Schedule & Timetable
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Grade 11-A (Science) • Room 302 Senior Wing
          </p>
        </div>

        {/* Day Selector */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-2xl border border-border/60 self-start sm:self-auto">
          {[
            { id: "today", label: "Today (Mon)" },
            { id: "tomorrow", label: "Tomorrow (Tue)" },
            { id: "week", label: "Weekly Grid" }
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setDayView(d.id as any)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
                dayView === d.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Smart Shortcut Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-foreground">
              Instant AI Timetable Insights
            </h4>
            <p className="text-xs text-muted-foreground">
              Ask XYZ AI what book or lab apparatus to carry for your next period.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleAskAI("What is my next class today and what do I need to prepare for it?")}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm self-stretch sm:self-auto justify-center"
        >
          <span>"What is my next class?"</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Periods Timeline List */}
      <div className="space-y-3">
        {timetable.map((period) => {
          return (
            <div
              key={period.id}
              className={cn(
                "p-5 rounded-3xl border transition-all duration-200 glass-card flex flex-col md:flex-row md:items-center justify-between gap-4 group",
                period.isCurrent && "ring-2 ring-emerald-500 border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10",
                period.isNext && "ring-1 ring-blue-500/50 border-blue-500/30"
              )}
            >
              {/* Left: Period Time & Live Badge */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 rounded-2xl bg-muted flex flex-col items-center justify-center font-bold text-foreground shrink-0 border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase">Period</span>
                  <span className="text-base leading-none">{period.periodNumber}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">{period.startTime} - {period.endTime}</span>
                    {period.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        Live Now
                      </span>
                    )}
                    {period.isNext && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                        Up Next
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Duration: 50 mins</p>
                </div>
              </div>

              {/* Center: Subject & Topic Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {period.subject}
                </h4>
                {period.topic && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span>Topic: <strong>{period.topic}</strong></span>
                  </p>
                )}
              </div>

              {/* Right: Room, Teacher & AI Prep */}
              <div className="flex items-center gap-3 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border/60">
                <div className="text-left md:text-right text-xs">
                  <p className="font-semibold text-foreground flex items-center md:justify-end gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" /> {period.room}
                  </p>
                  <p className="text-muted-foreground flex items-center md:justify-end gap-1 mt-0.5">
                    <User className="w-3 h-3 text-indigo-500" /> {period.teacher}
                  </p>
                </div>

                <button
                  onClick={() => handleAskAI(`Give me a 3-minute quick revision of the topics for today's ${period.subject} class with ${period.teacher}`)}
                  className="px-3 py-1.5 rounded-xl bg-muted/80 hover:bg-primary hover:text-primary-foreground text-xs font-bold transition-colors shrink-0"
                >
                  AI Prep
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
