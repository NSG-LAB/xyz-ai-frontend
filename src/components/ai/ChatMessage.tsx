"use client";

import React, { useState } from "react";
import { ChatMessage as ChatMessageType, ContextualAction } from "@/types";
import { AIAvatar } from "./AIAvatar";
import { cn, formatTime } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Copy,
  Check,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";

interface ChatMessageProps {
  message: ChatMessageType;
  onActionClick?: (action: ContextualAction) => void;
  onFollowUpClick?: (question: string) => void;
  onRegenerate?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onActionClick,
  onFollowUpClick,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<"helpful" | "unhelpful" | null>(message.feedback || null);
  const { userProfile, openEscalationModal } = useAppStore();

  const isAI = message.sender === "ai";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;

    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    synth.cancel();
    const cleanText = message.text
      .replace(/[*#_`>]/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .replace(/\|/g, " ")
      .slice(0, 300);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    synth.speak(utterance);
  };

  return (
    <div
      className={cn(
        "flex gap-3 my-4 group transition-all duration-200",
        isAI ? "justify-start" : "justify-end flex-row-reverse"
      )}
    >
      {/* Sender Avatar */}
      {isAI ? (
        <div className="shrink-0 mt-1">
          <AIAvatar state="idle" size="sm" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1 shadow-md">
          {userProfile.name.charAt(0)}
        </div>
      )}

      {/* Message Bubble Body */}
      <div className={cn("flex flex-col max-w-[88%] sm:max-w-[78%]", !isAI && "items-end")}>
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-[11px] font-semibold text-muted-foreground">
            {isAI ? "XYZ AI Assistant" : userProfile.name}
          </span>
          <span className="text-[10px] text-muted-foreground/70">
            {formatTime(message.timestamp)}
          </span>
        </div>

        <div
          className={cn(
            "p-4 rounded-2xl text-sm leading-relaxed relative shadow-sm",
            isAI
              ? "glass-card text-foreground rounded-tl-sm border border-border/70"
              : "bg-primary text-primary-foreground rounded-tr-sm"
          )}
        >
          {/* Markdown Content */}
          <div className={cn("prose prose-sm dark:prose-invert max-w-none break-words", !isAI && "text-white")}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="my-2 list-disc pl-4 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="my-2 list-decimal pl-4 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-xs sm:text-sm">{children}</li>,
                h3: ({ children }) => <h3 className="text-sm font-bold mt-3 mb-1.5 text-foreground">{children}</h3>,
                h4: ({ children }) => <h4 className="text-xs font-bold mt-2 mb-1 text-foreground">{children}</h4>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-primary/50 pl-3 my-2 text-xs italic text-muted-foreground bg-primary/5 py-1 rounded-r-md">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3 rounded-lg border border-border">
                    <table className="min-w-full text-xs divide-y divide-border">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="px-3 py-2 bg-muted font-bold text-left text-[11px] text-muted-foreground">
                    {children}
                  </th>
                ),
                td: ({ children }) => <td className="px-3 py-2 border-t border-border/50 text-xs">{children}</td>,
                code: ({ children }) => (
                  <code className="px-1.5 py-0.5 rounded bg-muted text-accent font-mono text-xs">
                    {children}
                  </code>
                )
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>

          {/* Streaming Cursor */}
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse rounded-sm align-middle" />
          )}

          {/* AI Message Action Toolbar (Copy, TTS, Feedback) */}
          {isAI && !message.isStreaming && (
            <div className="mt-3 pt-2.5 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  title="Copy message"
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleSpeak}
                  title={isSpeaking ? "Stop speech" : "Read aloud"}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-primary" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                {onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    title="Regenerate response"
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFeedback("helpful")}
                  title="Helpful"
                  className={cn(
                    "p-1.5 rounded-lg hover:bg-muted transition-colors",
                    feedback === "helpful" ? "text-emerald-500 bg-emerald-500/10" : "text-muted-foreground"
                  )}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setFeedback("unhelpful");
                    openEscalationModal({
                      subject: "General Academic",
                      teacherName: "Faculty Coordinator",
                      reason: "AI response did not solve student query"
                    });
                  }}
                  title="Not helpful - Talk to teacher"
                  className={cn(
                    "p-1.5 rounded-lg hover:bg-muted transition-colors",
                    feedback === "unhelpful" ? "text-rose-500 bg-rose-500/10" : "text-muted-foreground"
                  )}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Contextual AI Action Pills (Section 8 of Requirements) */}
        {isAI && message.contextualActions && message.contextualActions.length > 0 && (
          <div className="w-full mt-2.5 flex flex-wrap gap-1.5">
            {message.contextualActions.map((action) => (
              <button
                key={action.id}
                onClick={() => onActionClick && onActionClick(action)}
                className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{action.label}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        )}

        {/* Suggested Follow-Up Questions */}
        {isAI && message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
          <div className="w-full mt-2 pl-1 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-indigo-400" /> Suggested questions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {message.suggestedFollowUps.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onFollowUpClick && onFollowUpClick(q)}
                  className="text-left px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] border border-border/50 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
