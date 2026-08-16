"use client";

import React, { useState } from "react";
import { MOCK_ASSIGNMENTS } from "@/lib/api/mockData";
import { Assignment, AssignmentStatus } from "@/types";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  ArrowRight,
  BookOpen,
  Send,
  HelpCircle
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AssignmentsPage() {
  const router = useRouter();
  const { addChatMessage } = useAppStore();
  const [filter, setFilter] = useState<"all" | "pending" | "due_soon" | "completed">("all");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(MOCK_ASSIGNMENTS[0]);

  const assignments = MOCK_ASSIGNMENTS.filter((a) => {
    if (filter === "all") return true;
    if (filter === "pending") return a.status === "pending" || a.status === "due_soon";
    return a.status === filter;
  });

  const handleAskAI = (assignment: Assignment, mode: "help" | "explain" | "plan") => {
    let prompt = "";
    if (mode === "help") {
      prompt = `Please give me hints and step-by-step guidance to solve the assignment "${assignment.title}" in ${assignment.subject}.`;
    } else if (mode === "explain") {
      prompt = `Explain the theoretical concepts behind "${assignment.title}" in ${assignment.subject} with clear examples.`;
    } else {
      prompt = `Create a 45-minute timed study and completion plan to finish "${assignment.title}" before the ${assignment.dueDate} deadline.`;
    }

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

  const getStatusBadge = (status: AssignmentStatus) => {
    switch (status) {
      case "due_soon":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Due Soon
          </span>
        );
      case "pending":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Pending
          </span>
        );
      case "completed":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case "overdue":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
            Overdue
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-purple-500" /> Academic Assignments
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track homework submissions, deadlines, and get instant AI assistance
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-2xl border border-border/60 self-start sm:self-auto">
          {(["all", "pending", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all",
                filter === f
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f === "all" ? "All Tasks" : f === "pending" ? "Pending (3)" : "Completed"}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout (List on left, detail & AI helper on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Assignment List */}
        <div className="lg:col-span-7 space-y-3">
          {assignments.map((item) => {
            const isSelected = selectedAssignment?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedAssignment(item)}
                className={cn(
                  "p-5 rounded-3xl border transition-all duration-200 cursor-pointer text-left space-y-3 group",
                  isSelected
                    ? "glass-card border-primary ring-2 ring-primary/20 shadow-md"
                    : "glass-card hover:border-primary/40"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-primary">{item.subject}</span>
                    <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" /> Due: {item.dueDate}
                  </span>
                  <span className="font-semibold text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3 text-indigo-500" /> {item.teacher}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Assignment Focus & Action Drawer */}
        <div className="lg:col-span-5">
          {selectedAssignment ? (
            <div className="glass-card p-6 rounded-3xl border border-border sticky top-20 space-y-5">
              <div className="flex items-start justify-between border-b border-border/80 pb-4">
                <div>
                  <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
                    {selectedAssignment.subject}
                  </span>
                  <h3 className="text-lg font-bold text-foreground mt-0.5">
                    {selectedAssignment.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-500" /> Assigned by {selectedAssignment.teacher}
                  </p>
                </div>
                {getStatusBadge(selectedAssignment.status)}
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-foreground">Teacher Instructions:</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedAssignment.description}
                </p>
                {selectedAssignment.instructions && (
                  <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
                    {selectedAssignment.instructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Required Prompt Actions: [Ask AI], [Explain], [Plan] */}
              <div className="pt-2 space-y-2 border-t border-border/80">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> XYZ AI Homework Assistant
                </span>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => handleAskAI(selectedAssignment, "help")}
                    className="p-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity shadow-sm flex flex-col items-center justify-center gap-1 text-center"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Ask AI Help</span>
                  </button>
                  <button
                    onClick={() => handleAskAI(selectedAssignment, "explain")}
                    className="p-2.5 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold transition-colors flex flex-col items-center justify-center gap-1 text-center"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Explain Topic</span>
                  </button>
                  <button
                    onClick={() => handleAskAI(selectedAssignment, "plan")}
                    className="p-2.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold transition-colors flex flex-col items-center justify-center gap-1 text-center"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Study Plan</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 rounded-3xl text-center text-muted-foreground">
              Select an assignment to view guidelines and AI assistance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
