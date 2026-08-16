"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Mic,
  Clock,
  Sparkles,
  BookOpen
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { cn } from "@/lib/utils";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { currentRole, openVoiceModal } = useAppStore();

  const navItems = [
    { label: "Home", icon: LayoutDashboard, href: `/${currentRole}` },
    { label: "Chat", icon: MessageSquare, href: "/student/chat" },
    { label: "Voice", icon: Mic, isVoice: true },
    { label: "Timetable", icon: Clock, href: "/student/timetable" },
    { label: "Study", icon: Sparkles, href: "/student/study" },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 glass-panel px-3 py-1.5 flex items-center justify-around safe-area-bottom"
      aria-label="Mobile Bottom Navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.href ? pathname === item.href : false;

        if (item.isVoice) {
          return (
            <button
              key="voice-center"
              onClick={openVoiceModal}
              className="relative -top-4 w-13 h-13 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-xl shadow-indigo-600/30 flex items-center justify-center transform active:scale-95 transition-transform"
              aria-label="Open Voice Assistant"
            >
              <div className="w-full h-full rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white">
                <Mic className="w-6 h-6 animate-pulse" />
              </div>
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href!}
            className={cn(
              "flex flex-col items-center justify-center p-1.5 rounded-2xl min-w-[56px] transition-colors",
              isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
