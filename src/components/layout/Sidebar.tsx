"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Mic,
  CheckSquare,
  Clock,
  FileText,
  Calendar,
  Sparkles,
  Award,
  Bell,
  Settings,
  HeartHandshake,
  Briefcase,
  Building,
  PhoneCall
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { AIAvatar } from "../ai/AIAvatar";
import { cn } from "@/lib/utils";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentRole, avatarState, openVoiceModal, openEscalationModal, t } = useAppStore();

  const studentNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/student" },
    { label: "AI Assistant", icon: MessageSquare, href: "/student/chat" },
    { label: "Voice Mode", icon: Mic, href: "/student/voice" },
    { label: "Attendance", icon: CheckSquare, href: "/student/attendance" },
    { label: "Timetable", icon: Clock, href: "/student/timetable" },
    { label: "Assignments", icon: FileText, href: "/student/assignments" },
    { label: "Exams", icon: Calendar, href: "/student/exams" },
    { label: "Study Mode", icon: Sparkles, href: "/student/study" },
    { label: "Performance", icon: Award, href: "/student/performance" },
    { label: "Notifications", icon: Bell, href: "/student/notifications" },
  ];

  const parentNavItems = [
    { label: "Parent Portal", icon: HeartHandshake, href: "/parent" },
    { label: "Child Attendance", icon: CheckSquare, href: "/student/attendance" },
    { label: "Exams & Marks", icon: Award, href: "/student/performance" },
    { label: "AI Parent Assistant", icon: MessageSquare, href: "/student/chat" },
  ];

  const teacherNavItems = [
    { label: "Teacher Portal", icon: Briefcase, href: "/teacher" },
    { label: "Class Timetable", icon: Clock, href: "/student/timetable" },
    { label: "Student Escalations", icon: PhoneCall, href: "/teacher#escalations" },
    { label: "AI Lesson Prep", icon: Sparkles, href: "/student/study" },
  ];

  const managementNavItems = [
    { label: "Management Portal", icon: Building, href: "/management" },
    { label: "School Analytics", icon: Award, href: "/management" },
    { label: "Broadcast Alerts", icon: Bell, href: "/student/notifications" },
  ];

  const getNavItems = () => {
    switch (currentRole) {
      case "parent":
        return parentNavItems;
      case "teacher":
        return teacherNavItems;
      case "management":
        return managementNavItems;
      default:
        return studentNavItems;
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border/70 glass-panel h-[calc(100vh-4rem)] sticky top-16 select-none p-4 justify-between shrink-0">
      <div className="space-y-6">
        {/* Compact AI Companion Card */}
        <div className="p-3.5 rounded-3xl bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 text-center relative overflow-hidden">
          <div className="flex justify-center mb-1">
            <AIAvatar state={avatarState} size="md" showMoodBadge={false} />
          </div>
          <h4 className="text-xs font-bold text-foreground">XYZ AI Companion</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Always ready to explain, quiz & guide
          </p>
          <button
            onClick={openVoiceModal}
            className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 hover:opacity-95 transition-opacity"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Assistant</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Faculty Support / Settings */}
      <div className="pt-3 border-t border-border/60 space-y-1.5">
        <button
          onClick={() => openEscalationModal()}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Talk to Teacher</span>
        </button>

        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors",
            pathname === "/settings" && "bg-muted text-foreground"
          )}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
};
