"use client";

import React from "react";
import Link from "next/link";
import { Calendar, ArrowUpRight, Target, Sparkles } from "lucide-react";
import { MOCK_EXAMS } from "@/lib/api/mockData";

export const ExamCard: React.FC = () => {
  const nextExam = MOCK_EXAMS[0];

  return (
    <div className="glass-card p-4 sm:p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between h-full group hover:border-primary/40 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" /> Next Exam
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {nextExam.daysRemaining} Days Left
          </span>
        </div>

        {/* Exam Details */}
        <div className="mt-2.5 p-3 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {nextExam.subject}
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">
              Aug 21 (09:00 AM)
            </span>
          </div>
          <h4 className="text-sm font-bold text-foreground mt-0.5 truncate">
            {nextExam.examName}
          </h4>

          {/* Readiness Bar */}
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">Syllabus Prepared</span>
              <span className="font-bold text-foreground">{nextExam.preparationStatus}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${nextExam.preparationStatus}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs">
        <span className="text-muted-foreground text-[11px]">
          Room 302 • 50 Marks
        </span>
        <Link
          href="/student/exams"
          className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <span>Prep Plan</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
