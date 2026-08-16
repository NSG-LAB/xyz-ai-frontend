"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowUpRight, AlertCircle, Sparkles } from "lucide-react";
import { MOCK_ASSIGNMENTS } from "@/lib/api/mockData";

export const AssignmentCard: React.FC = () => {
  const pendingAssignments = MOCK_ASSIGNMENTS.filter((a) => a.status !== "completed");
  const urgentAssignment = pendingAssignments[0] || MOCK_ASSIGNMENTS[0];

  return (
    <div className="glass-card p-4 sm:p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between h-full group hover:border-primary/40 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-purple-500" /> Assignments
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            {pendingAssignments.length} Pending
          </span>
        </div>

        {/* Priority Assignment */}
        <div className="mt-2.5 p-3 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Due in 3 Days
            </span>
            <span className="text-[11px] font-bold text-foreground">
              {urgentAssignment.subject}
            </span>
          </div>
          <h4 className="text-sm font-bold text-foreground mt-1 truncate">
            {urgentAssignment.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {urgentAssignment.description}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs">
        <span className="text-muted-foreground text-[11px]">
          Est. Time: ~{urgentAssignment.estimatedMinutes} mins
        </span>
        <Link
          href="/student/assignments"
          className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <span>All Tasks</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
