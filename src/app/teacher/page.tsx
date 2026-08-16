"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Users,
  CheckSquare,
  Sparkles,
  PhoneCall,
  Calendar,
  Clock,
  Send,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function TeacherPortalPage() {
  const router = useRouter();
  const { escalations, addChatMessage } = useAppStore();
  const [activeClass, setActiveClass] = useState("11-A");
  const [lessonPrompt, setLessonPrompt] = useState("");

  const [students, setStudents] = useState([
    { id: "s1", name: "Siva", rollNo: 14, attendance: "present", gpa: 91.2, alert: null },
    { id: "s2", name: "Aarav Sharma", rollNo: 1, attendance: "present", gpa: 84.5, alert: null },
    { id: "s3", name: "Divya Nair", rollNo: 8, attendance: "present", gpa: 94.0, alert: null },
    { id: "s4", name: "Kunal Verma", rollNo: 18, attendance: "absent", gpa: 68.2, alert: "Low Attendance (71%)" },
    { id: "s5", name: "Rhea Sen", rollNo: 22, attendance: "present", gpa: 88.0, alert: null },
  ]);

  const toggleStudentAttendance = (id: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, attendance: s.attendance === "present" ? "absent" : "present" }
          : s
      )
    );
  };

  const handleGenerateLessonPlan = (query: string) => {
    router.push("/student/chat");
    setTimeout(() => {
      addChatMessage({
        id: `user_${Date.now()}`,
        sender: "user",
        text: `[Teacher Assistant Prompt - Dr. Rajesh Sharma]\n\n${query || lessonPrompt}`,
        timestamp: new Date().toISOString(),
      });
    }, 300);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Teacher Hero Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 border border-indigo-500/20 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Teacher Portal • Professional Teaching Assistant</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Good day, Dr. Rajesh Sharma 👋
            </h2>
            <p className="text-sm text-slate-300">
              Senior Physics Faculty • Today's Schedule: <strong>3 Theory Classes + 1 Lab Session</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleGenerateLessonPlan("Generate a 45-minute lesson plan for Faraday's Law with 3 numerical examples and a 5-question pop quiz for Grade 11-A")}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Lesson Planner</span>
            </button>
          </div>
        </div>

        {/* Quick AI Prompt Input */}
        <div className="pt-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={lessonPrompt}
              onChange={(e) => setLessonPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lessonPrompt.trim() && handleGenerateLessonPlan(lessonPrompt)}
              placeholder="Ask AI Teacher Assistant: 'Create 5 MCQs on Lenz's Law' or 'Draft email to parents of students below 75% attendance'..."
              className="flex-1 rounded-2xl p-3.5 text-xs sm:text-sm bg-slate-900/80 text-white placeholder:text-slate-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => lessonPrompt.trim() && handleGenerateLessonPlan(lessonPrompt)}
              className="px-5 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors"
            >
              <span>Generate</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Roster & Quick Roll Call */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Class Roster & Roll Call Marker (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card p-6 rounded-3xl border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Class Attendance Roll-Call</h3>
                <p className="text-xs text-muted-foreground">Tap any student to toggle Present / Absent</p>
              </div>

              {/* Class Tabs */}
              <div className="flex gap-1 bg-muted p-1 rounded-xl text-xs font-bold">
                {["11-A", "11-B", "12-A"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveClass(c)}
                    className={cn(
                      "px-3 py-1 rounded-lg transition-colors",
                      activeClass === c ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Students List */}
            <div className="divide-y divide-border/60">
              {students.map((student) => {
                const isPresent = student.attendance === "present";
                return (
                  <div
                    key={student.id}
                    className="py-3 flex items-center justify-between text-xs hover:bg-muted/30 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-muted-foreground font-mono font-bold">
                        #{student.rollNo}
                      </span>
                      <div>
                        <p className="font-bold text-foreground">{student.name}</p>
                        {student.alert ? (
                          <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {student.alert}
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">
                            GPA: {student.gpa}%
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleStudentAttendance(student.id)}
                      className={cn(
                        "px-3 py-1 rounded-xl text-xs font-extrabold transition-all capitalize flex items-center gap-1.5",
                        isPresent
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                      )}
                    >
                      {isPresent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      <span>{student.attendance}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Pending Student Escalation Requests Desk (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-6 rounded-3xl border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-indigo-500" /> Escalation Requests
                </h3>
                <p className="text-xs text-muted-foreground">Student 1-on-1 Consultation Queue</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                {escalations.length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {escalations.map((esc) => (
                <div key={esc.id} className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{esc.studentName} ({esc.subject})</span>
                    <span className="text-[10px] uppercase font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">
                      {esc.priority}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    "{esc.reason}"
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px]">
                    <span className="text-muted-foreground">Slot: {esc.scheduledSlot || "Today 3:30 PM"}</span>
                    <button
                      onClick={() => alert(`Confirmed meeting with ${esc.studentName}. A calendar invitation has been dispatched.`)}
                      className="px-3 py-1 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
                    >
                      Accept Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
