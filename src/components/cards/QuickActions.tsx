"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CheckSquare,
  Award,
  BookOpen,
  HelpCircle,
  Clock,
  Sparkles,
  PhoneCall,
  Building,
  GraduationCap,
  FileText,
  Flame,
  BrainCircuit
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { cn } from "@/lib/utils";

export const QuickActions: React.FC = () => {
  const router = useRouter();
  const { openEscalationModal, addChatMessage, t } = useAppStore();
  const [activeTab, setActiveTab] = useState<"all" | "academic" | "study" | "support">("all");

  const handleAction = (item: { actionType: "route" | "chat" | "escalation"; value: string; label: string }) => {
    if (item.actionType === "route") {
      router.push(item.value);
    } else if (item.actionType === "escalation") {
      openEscalationModal({
        subject: "Physics",
        teacherName: "Dr. Rajesh Sharma",
        reason: "Requested callback via Quick Actions"
      });
    } else if (item.actionType === "chat") {
      router.push("/student/chat");
      setTimeout(() => {
        addChatMessage({
          id: `user_${Date.now()}`,
          sender: "user",
          text: item.value,
          timestamp: new Date().toISOString()
        });
      }, 300);
    }
  };

  const actionItems = [
    // Academic
    {
      id: "act_attendance",
      label: "My Attendance",
      category: "academic",
      icon: CheckSquare,
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      actionType: "route" as const,
      value: "/student/attendance"
    },
    {
      id: "act_timetable",
      label: "Timetable",
      category: "academic",
      icon: Clock,
      color: "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      actionType: "route" as const,
      value: "/student/timetable"
    },
    {
      id: "act_assignments",
      label: "Assignments",
      category: "academic",
      icon: FileText,
      color: "from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      actionType: "route" as const,
      value: "/student/assignments"
    },
    {
      id: "act_exams",
      label: "Exams",
      category: "academic",
      icon: Calendar,
      color: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      actionType: "route" as const,
      value: "/student/exams"
    },
    {
      id: "act_performance",
      label: "Performance",
      category: "academic",
      icon: Award,
      color: "from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      actionType: "route" as const,
      value: "/student/performance"
    },

    // AI Study
    {
      id: "act_explain",
      label: "Explain a Topic",
      category: "study",
      icon: Sparkles,
      color: "from-indigo-500/10 to-cyan-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      actionType: "route" as const,
      value: "/student/study"
    },
    {
      id: "act_hw_help",
      label: "Homework Help",
      category: "study",
      icon: BrainCircuit,
      color: "from-cyan-500/10 to-blue-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      actionType: "route" as const,
      value: "/student/assignments"
    },
    {
      id: "act_exam_prep",
      label: "Exam Preparation",
      category: "study",
      icon: GraduationCap,
      color: "from-amber-500/10 to-yellow-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      actionType: "route" as const,
      value: "/student/study?mode=prep"
    },
    {
      id: "act_quiz_me",
      label: "Quiz Me",
      category: "study",
      icon: HelpCircle,
      color: "from-emerald-500/10 to-lime-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      actionType: "route" as const,
      value: "/student/study?mode=quiz"
    },
    {
      id: "act_revise",
      label: "Revise",
      category: "study",
      icon: Flame,
      color: "from-orange-500/10 to-red-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      actionType: "route" as const,
      value: "/student/study?mode=explain"
    },

    // Support
    {
      id: "act_talk_teacher",
      label: "Talk to Teacher",
      category: "support",
      icon: PhoneCall,
      color: "from-indigo-500/15 to-purple-500/15 text-indigo-600 dark:text-indigo-300 border-indigo-500/30",
      actionType: "escalation" as const,
      value: ""
    },
    {
      id: "act_contact_mgmt",
      label: "Contact Management",
      category: "support",
      icon: Building,
      color: "from-slate-500/10 to-slate-600/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
      actionType: "chat" as const,
      value: "I would like to submit a query to School Administration / Principal office regarding official certificate request."
    }
  ];

  const filteredItems = activeTab === "all"
    ? actionItems
    : actionItems.filter((i) => i.category === activeTab);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-primary" /> {t("quick_actions")}
        </h3>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-xl border border-border/60 text-xs">
          {(["all", "academic", "study", "support"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium capitalize transition-all",
                activeTab === tab
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "all" ? "All" : t(tab === "academic" ? "academic" : tab === "study" ? "ai_study" : "support")}
            </button>
          ))}
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleAction(item)}
              className={cn(
                "group p-3 rounded-2xl border text-left bg-gradient-to-br transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex flex-col justify-between h-24",
                item.color
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="p-2 rounded-xl bg-background/80 shadow-xs">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                  {item.category}
                </span>
              </div>
              <p className="text-xs font-bold leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                {item.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
