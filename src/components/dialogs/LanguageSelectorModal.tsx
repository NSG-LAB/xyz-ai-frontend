"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, X, Check } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/translations";
import { useAppStore } from "@/lib/store/useAppStore";
import { LanguageCode } from "@/types";
import { cn } from "@/lib/utils";

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentLanguage, setLanguage } = useAppStore();

  if (!isOpen) return null;

  const handleSelectLanguage = (langCode: LanguageCode) => {
    setLanguage(langCode);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-md bg-card text-card-foreground border border-border rounded-3xl p-6 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Select Language</h3>
                <p className="text-xs text-muted-foreground">Choose your preferred Indian language</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close language selector"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Languages Grid */}
          <div className="grid grid-cols-2 gap-2.5 py-4 max-h-[60vh] overflow-y-auto pr-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-2xl border text-left transition-all duration-200 group",
                    isSelected
                      ? "bg-primary/10 border-primary text-primary shadow-sm"
                      : "bg-muted/40 border-border/80 hover:bg-muted hover:border-border text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl" role="img" aria-label={lang.name}>
                      {lang.flag}
                    </span>
                    <div>
                      <p className="text-sm font-bold leading-tight">{lang.nativeName}</p>
                      <p className="text-[11px] text-muted-foreground">{lang.name}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-muted-foreground">
              XYZ AI will understand and respond in your selected language.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
