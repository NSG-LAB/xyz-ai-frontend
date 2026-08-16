"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowUpRight, MapPin, User, Sparkles } from "lucide-react";
import { MOCK_TIMETABLE_TODAY } from "@/lib/api/mockData";
import { useAppStore } from "@/lib/store/useAppStore";
import { useRouter } from "next/navigation";

export const TimetableCard: React.FC = () => {
  const router = useRouter();
  const { addChatMessage } = useAppStore();
  const currentClass = MOCK_TIMETABLE_TODAY.find((p) => p.isCurrent) || MOCK_TIMETABLE_TODAY[2];
  const nextClass = MOCK_TIMETABLE_TODAY.find((p) => p.isNext) || MOCK_TIMETABLE_TODAY[3];

  const handleAskNextClass = () => {
    router.push("/student/chat");
    setTimeout(() => {
      addChatMessage({
        id: `user_${Date.now()}`,
        sender: "user",
        text: "What is my next class and what topic are we studying?",
        timestamp: new Date().toISOString(),
      });
    }, 300);
  };

  return (
    <div className="glass-card p-4 sm:p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between h-full group hover:border-primary/40 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-500" /> Today's Classes
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            5 Periods
          </span>
        </div>

        {/* Current Active Class */}
        <div className="mt-2.5 p-3 rounded-2xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Now (Period {currentClass.periodNumber})
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">
              {currentClass.startTime}
            </span>
          </div>
          <h4 className="text-base font-bold text-foreground mt-0.5 truncate">
            {currentClass.subject}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-blue-500 shrink-0" /> {currentClass.room}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 truncate">
              <User className="w-3 h-3 text-indigo-500 shrink-0" /> {currentClass.teacher}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs">
        <button
          onClick={handleAskNextClass}
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium"
        >
          <Sparkles className="w-3 h-3 text-amber-500" /> Next: {nextClass.subject} ({nextClass.startTime})
        </button>
        <Link
          href="/student/timetable"
          className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <span>Schedule</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
