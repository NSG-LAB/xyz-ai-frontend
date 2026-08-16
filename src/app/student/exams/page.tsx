"use client";

import React, { useState } from "react";
import { MOCK_EXAMS } from "@/lib/api/mockData";
import { Exam } from "@/types";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  GraduationCap,
  ListTodo
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ExamsPage() {
  const router = useRouter();
  const { addChatMessage } = useAppStore();
  const [selectedExam, setSelectedExam] = useState<Exam>(MOCK_EXAMS[0]);

  const handleAIAction = (exam: Exam, action: "prepare" | "plan" | "quiz") => {
    let prompt = "";
    if (action === "prepare") {
      prompt = `I need thorough preparation for my upcoming ${exam.subject} exam (${exam.examName}). Give me the top high-yield derivations, formulas, and common exam questions.`;
    } else if (action === "plan") {
      prompt = `Create a structured daily revision timetable for my ${exam.subject} exam on ${exam.date} covering all syllabus chapters.`;
    } else {
      prompt = `Start a full practice quiz for ${exam.subject} (${exam.examName}) covering Lenz's Law, Ampere's Law, and Inductance.`;
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

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-amber-500" /> Upcoming Examinations
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Assessment schedule, countdown timers, syllabus trackers & AI test prep
          </p>
        </div>

        {/* Global Exam Prep Action */}
        <button
          onClick={() => handleAIAction(selectedExam, "plan")}
          className="px-4 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>AI Master Study Schedule</span>
        </button>
      </div>

      {/* Grid of Exams */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_EXAMS.map((exam) => {
          const isSelected = selectedExam.id === exam.id;
          return (
            <div
              key={exam.id}
              onClick={() => setSelectedExam(exam)}
              className={cn(
                "p-5 rounded-3xl border transition-all duration-200 cursor-pointer space-y-4 text-left group",
                isSelected
                  ? "glass-card border-amber-500 ring-2 ring-amber-500/20 shadow-md"
                  : "glass-card hover:border-amber-500/40"
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                    {exam.subject}
                  </span>
                  <h4 className="text-base font-bold text-foreground mt-0.5 group-hover:text-primary transition-colors">
                    {exam.examName}
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                  {exam.daysRemaining}d left
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Preparedness</span>
                  <span className="font-bold text-foreground">{exam.preparationStatus}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${exam.preparationStatus}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> {exam.date}
                </span>
                <span className="font-semibold">{exam.totalMarks} Marks</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Exam Syllabus & AI War-Room Suite */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-border space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wide border border-amber-500/20">
                {selectedExam.subject}
              </span>
              <span className="text-xs text-muted-foreground">
                Room {selectedExam.room} • {selectedExam.startTime} - {selectedExam.endTime}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-1.5">
              {selectedExam.examName} — Syllabus & Readiness
            </h3>
          </div>

          {/* AI Action Triggers (Prepare me, Study plan, Quiz me) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleAIAction(selectedExam, "prepare")}
              className="px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity shadow-md shadow-primary/20 flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Prepare Me</span>
            </button>
            <button
              onClick={() => handleAIAction(selectedExam, "plan")}
              className="px-4 py-2.5 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Create Study Plan</span>
            </button>
            <button
              onClick={() => handleAIAction(selectedExam, "quiz")}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Quiz Me</span>
            </button>
          </div>
        </div>

        {/* Syllabus Checklist */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-primary" /> Chapter Checklist ({selectedExam.syllabusTopics.filter((t) => t.prepared).length} / {selectedExam.syllabusTopics.length} Prepared)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedExam.syllabusTopics.map((topic, i) => (
              <div
                key={i}
                className={cn(
                  "p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-colors",
                  topic.prepared
                    ? "bg-emerald-500/5 border-emerald-500/20 text-foreground"
                    : "bg-muted/40 border-border text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-2.5">
                  {topic.prepared ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span className={cn("font-medium", topic.prepared && "text-foreground font-semibold")}>
                    {topic.topic}
                  </span>
                </div>
                {!topic.prepared && (
                  <button
                    onClick={() => {
                      router.push("/student/chat");
                      setTimeout(() => {
                        addChatMessage({
                          id: `user_${Date.now()}`,
                          sender: "user",
                          text: `Explain ${topic.topic} for my upcoming ${selectedExam.subject} exam with formulas and examples`,
                          timestamp: new Date().toISOString()
                        });
                      }, 300);
                    }}
                    className="text-[11px] font-bold text-primary hover:underline shrink-0 ml-2"
                  >
                    Revise
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
