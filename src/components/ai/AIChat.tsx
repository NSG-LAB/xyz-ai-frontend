"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { api } from "@/lib/api/client";
import { ContextualAction, ChatMessage as ChatMessageType } from "@/types";
import { Sparkles, Trash2, Mic, Bot, School, HelpCircle, RefreshCw, Cpu } from "lucide-react";
import { motion } from "framer-motion";

interface AIChatProps {
  className?: string;
  initialPrompt?: string;
}

const STARTER_PROMPTS = [
  { icon: "⚡", label: "Explain Lenz's Law simply", prompt: "Explain Lenz's Law in simple terms with formulas and real-world examples" },
  { icon: "📊", label: "My Attendance summary", prompt: "What is my current attendance summary and subject breakdown?" },
  { icon: "📅", label: "Today's Schedule", prompt: "What is my class timetable schedule for today?" },
  { icon: "📝", label: "Quiz on Photosynthesis", prompt: "Start an interactive practice quiz on Photosynthesis" },
  { icon: "🎯", label: "Exam Revision Plan", prompt: "Help me create an exam revision timetable for this week" }
];

export const AIChat: React.FC<AIChatProps> = ({ className, initialPrompt }) => {
  const {
    chatMessages,
    addChatMessage,
    updateLastMessage,
    clearChat,
    setAvatarState,
    openVoiceModal,
    openEscalationModal,
    t
  } = useAppStore();

  const [isStreaming, setIsStreaming] = useState(false);
  const [providerBadge, setProviderBadge] = useState<string>("Gemini + Auto");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isStreaming]);

  // Query AI Health to display active provider
  useEffect(() => {
    api.getAIHealth().then((health) => {
      if (health?.default_provider) {
        const prov = health.default_provider.toUpperCase();
        setProviderBadge(`${prov} Mode`);
      }
    }).catch(() => {
      setProviderBadge("Auto Fallback");
    });
  }, []);

  // Handle Initial Prompt if passed from other views
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (text: string, attachment?: string) => {
    if (!text.trim() && !attachment) return;

    let fullPrompt = text;
    if (attachment) {
      fullPrompt = `[Attached Image/Diagram]\n\n${text || "Please analyze this question/diagram and provide step-by-step guidance."}`;
    }

    // 1. Add User Message
    const userMsg: ChatMessageType = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: fullPrompt,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);

    // 2. Add Placeholder AI Message for Streaming
    const aiMsgId = `ai_${Date.now()}`;
    const aiPlaceholder: ChatMessageType = {
      id: aiMsgId,
      sender: "ai",
      text: "",
      provider: "auto",
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };
    addChatMessage(aiPlaceholder);
    setIsStreaming(true);
    setAvatarState("thinking");

    try {
      await api.streamAIChat(
        fullPrompt,
        (currentText) => {
          setAvatarState("speaking");
          updateLastMessage((prev) => ({
            ...prev,
            text: currentText,
          }));
        },
        (completed) => {
          setIsStreaming(false);
          setAvatarState("idle");
          if (completed.provider) {
            setProviderBadge(`${completed.provider.toUpperCase()} Engine`);
          }
          updateLastMessage((prev) => ({
            ...prev,
            text: completed.text || prev.text,
            provider: completed.provider || prev.provider,
            isStreaming: false,
            contextualActions: completed.contextualActions,
            suggestedFollowUps: completed.suggestedFollowUps,
          }));
        }
      );
    } catch (error) {
      setIsStreaming(false);
      setAvatarState("idle");
      updateLastMessage((prev) => ({
        ...prev,
        text: "AI service is temporarily unavailable. Please try again.",
        isStreaming: false,
        contextualActions: [
          { id: "act_retry", label: "🔄 Retry Question", prompt: fullPrompt },
          { id: "act_escalate_now", label: "👨‍🏫 Ask Teacher", prompt: `I need help with: ${fullPrompt}` }
        ]
      }));
    }
  };

  const handleActionClick = (action: ContextualAction) => {
    if (action.id === "act_escalate_now") {
      openEscalationModal({
        subject: "General Academic",
        teacherName: "Faculty Coordinator",
        reason: "Student requested callback from AI Chat"
      });
      return;
    }
    handleSendMessage(action.prompt);
  };

  const handleFollowUpClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleRegenerate = () => {
    if (chatMessages.length < 2) return;
    const lastUserMessage = [...chatMessages].reverse().find((m) => m.sender === "user");
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.text);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-background rounded-3xl border border-border/70 shadow-xl overflow-hidden ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-border/80 glass-panel">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-foreground">XYZ AI Companion</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {providerBadge}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Delhi Public School • Grade 11-A Curriculum Sync
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={openVoiceModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-500/20 transition-colors"
          >
            <Mic className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Voice Mode</span>
          </button>
          <button
            onClick={clearChat}
            title="Clear Chat History"
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-2">
        {chatMessages.length === 0 && (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center border border-primary/20 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">How can I assist your studies today?</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                Ask about complex formulas, concepts, attendance, timetable, or quiz questions.
              </p>
            </div>

            {/* Quick Starter Pills */}
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto pt-2">
              {STARTER_PROMPTS.map((starter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(starter.prompt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card hover:bg-muted/80 text-foreground text-xs border border-border/80 shadow-sm transition-all hover:scale-105 active:scale-95"
                >
                  <span>{starter.icon}</span>
                  <span className="font-medium">{starter.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onActionClick={handleActionClick}
            onFollowUpClick={handleFollowUpClick}
            onRegenerate={handleRegenerate}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-border/60 bg-muted/20">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isStreaming}
        />
      </div>
    </div>
  );
};
