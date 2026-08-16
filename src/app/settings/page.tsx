"use client";

import React, { useState } from "react";
import {
  Settings,
  Globe,
  Sun,
  Moon,
  Volume2,
  Bell,
  Eye,
  Shield,
  Check,
  Sparkles
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/translations";
import { LanguageCode } from "@/types";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const {
    currentLanguage,
    setLanguage,
    theme,
    toggleTheme,
    userProfile,
    t
  } = useAppStore();

  const [speechRate, setSpeechRate] = useState(1.0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-primary" /> Application Preferences
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Customize language, accessibility, voice assistant behavior, and notification channels
        </p>
      </div>

      {/* Language Preference */}
      <div className="glass-card p-6 rounded-3xl border border-border space-y-4">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="text-base font-bold text-foreground">Language Selection (11 Indian Languages)</h3>
            <p className="text-xs text-muted-foreground">Select your primary language for AI conversations and interface</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={cn(
                  "p-3 rounded-2xl border text-left flex items-center justify-between transition-all",
                  isSelected
                    ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                    : "bg-muted/40 border-border text-foreground hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-xs truncate">{lang.nativeName}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Appearance & Accessibility */}
      <div className="glass-card p-6 rounded-3xl border border-border space-y-4">
        <div className="flex items-center gap-2.5">
          <Eye className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-base font-bold text-foreground">Appearance & Accessibility</h3>
            <p className="text-xs text-muted-foreground">Tailor UI contrast, themes, and motion for your comfort</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {/* Theme Toggle */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-foreground">Dark / Light Mode</p>
              <p className="text-[11px] text-muted-foreground">Current active theme: <span className="capitalize font-semibold">{theme}</span></p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold transition-opacity"
            >
              Toggle {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-foreground">Reduce Motion & Animations</p>
              <p className="text-[11px] text-muted-foreground">Disables pulsing waveforms and avatar float loops</p>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-colors",
                reducedMotion ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground border border-border"
              )}
            >
              {reducedMotion ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>
      </div>

      {/* Voice Assistant Speed */}
      <div className="glass-card p-6 rounded-3xl border border-border space-y-4">
        <div className="flex items-center gap-2.5">
          <Volume2 className="w-5 h-5 text-purple-500" />
          <div>
            <h3 className="text-base font-bold text-foreground">Voice Assistant Speech Speed</h3>
            <p className="text-xs text-muted-foreground">Configure Text-to-Speech speaking tempo</p>
          </div>
        </div>

        <div className="pt-2 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span>0.75x (Slower)</span>
            <span className="text-primary font-bold">{speechRate}x (Selected)</span>
            <span>1.5x (Faster)</span>
          </div>
          <input
            type="range"
            min="0.75"
            max="1.5"
            step="0.25"
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
