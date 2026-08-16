"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mic,
  Globe,
  Bell,
  Sun,
  Moon,
  Users,
  ChevronDown,
  Sparkles,
  Search
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { AIAvatar } from "../ai/AIAvatar";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/translations";
import { LanguageSelectorModal } from "../dialogs/LanguageSelectorModal";
import { NotificationDropdown } from "./NotificationDropdown";
import { RoleSwitcherModal } from "./RoleSwitcherModal";
import { cn } from "@/lib/utils";

export const AppHeader: React.FC = () => {
  const pathname = usePathname();
  const {
    currentRole,
    userProfile,
    currentLanguage,
    theme,
    toggleTheme,
    avatarState,
    openVoiceModal,
    unreadNotificationsCount,
    t
  } = useAppStore();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greeting_morning");
    if (hour < 17) return t("greeting_afternoon");
    return t("greeting_evening");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand & Student Greeting */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href={`/${currentRole}`} className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white font-black text-sm">
                XYZ
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-sm tracking-tight text-foreground flex items-center gap-1">
                XYZ AI <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-primary/10 text-primary font-bold">SCHOOL</span>
              </span>
              <p className="text-[10px] text-muted-foreground leading-none">
                Human-Like School Assistant
              </p>
            </div>
          </Link>

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-border hidden sm:block" />

          {/* User Persona Greeting */}
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-foreground truncate flex items-center gap-1.5">
              <span>{getGreeting()}, {userProfile.name.split(" ")[0]}</span>
              <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="text-[10px] text-muted-foreground truncate hidden md:block">
              {userProfile.schoolName} {userProfile.grade ? `• ${userProfile.grade}` : ""}
            </p>
          </div>
        </div>

        {/* Right: Actions (Voice, Language, Notifications, Role, Theme) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Voice Mode Trigger */}
          <button
            onClick={openVoiceModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all transform active:scale-95"
            aria-label="Open Voice Assistant"
          >
            <Mic className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden md:inline">{t("voice_assistant")}</span>
          </button>

          {/* Language Selector */}
          <button
            onClick={() => setIsLangOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-muted/60 hover:bg-muted text-xs font-semibold text-foreground border border-border/60 transition-colors"
            title="Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">
              {SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.nativeName}
            </span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-2xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground relative transition-colors border border-border/60"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-background animate-pulse" />
              )}
            </button>
            {isNotifOpen && (
              <NotificationDropdown onClose={() => setIsNotifOpen(false)} />
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-2xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border/60"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Role Switcher Pill */}
          <button
            onClick={() => setIsRoleModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-muted/60 hover:bg-muted border border-border/60 text-xs font-semibold text-foreground transition-colors"
            title="Switch User Role Portal"
          >
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="capitalize hidden lg:inline">{currentRole}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
      </div>

      <LanguageSelectorModal
        isOpen={isLangOpen}
        onClose={() => setIsLangOpen(false)}
      />

      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </header>
  );
};
