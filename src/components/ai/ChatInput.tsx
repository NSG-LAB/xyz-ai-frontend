"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, Paperclip, Globe, Sparkles, Image as ImageIcon, X } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/translations";
import { LanguageSelectorModal } from "../dialogs/LanguageSelectorModal";

interface ChatInputProps {
  onSendMessage: (text: string, attachment?: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder,
}) => {
  const [inputText, setInputText] = useState("");
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { currentLanguage, openVoiceModal, t } = useAppStore();

  const handleSend = () => {
    if ((!inputText.trim() && !attachedImage) || disabled) return;
    onSendMessage(inputText.trim(), attachedImage || undefined);
    setInputText("");
    setAttachedImage(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        setAttachedImage(loadEvt.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full relative bg-card border border-border/80 rounded-2xl shadow-xl p-2 sm:p-3 transition-all focus-within:ring-2 focus-within:ring-primary/40">
      {/* Attached Image Preview */}
      {attachedImage && (
        <div className="mb-2 p-2 rounded-xl bg-muted/60 flex items-center justify-between border border-border">
          <div className="flex items-center gap-2">
            <img
              src={attachedImage}
              alt="Uploaded homework doubt"
              className="w-10 h-10 object-cover rounded-lg border border-border"
            />
            <span className="text-xs text-muted-foreground font-medium">
              Image attached (Homework / Question Paper)
            </span>
          </div>
          <button
            onClick={() => setAttachedImage(null)}
            className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Textarea */}
      <textarea
        ref={textareaRef}
        rows={1}
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder || t("ask_placeholder")}
        className="w-full bg-transparent px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none resize-none max-h-32 leading-relaxed"
      />

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-1">
        <div className="flex items-center gap-1.5">
          {/* File Attachment Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach image or doubt diagram"
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Language Selector Button */}
          <button
            type="button"
            onClick={() => setIsLangModalOpen(true)}
            title="Switch Language"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-muted/50 hover:bg-muted text-xs text-muted-foreground hover:text-foreground transition-colors font-medium border border-border/40"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">
              {SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.nativeName}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Assistant Mic Button */}
          <button
            type="button"
            onClick={openVoiceModal}
            title="Open Voice Assistant"
            className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 transition-all transform active:scale-95 flex items-center gap-1.5"
          >
            <Mic className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-semibold hidden sm:inline">{t("voice")}</span>
          </button>

          {/* Send Message Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || (!inputText.trim() && !attachedImage)}
            className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-md shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <span>{t("send")}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />
    </div>
  );
};
