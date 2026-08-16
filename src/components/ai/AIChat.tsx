"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { api } from "@/lib/api/client";
import { ContextualAction, ChatMessage as ChatMessageType } from "@/types";
import { Sparkles, Trash2, Mic, Bot, School, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface AIChatProps {
  className?: string;
  initialPrompt?: string;
}

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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isStreaming]);

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
          updateLastMessage((prev) => ({
            ...prev,
            text: completed.text || prev.text,
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
        text: "I encountered a momentary issue accessing the academic server. Please try asking again.",
        isStreaming: false,
      }));
    }
  };

  const handleActionClick = (action: ContextualAction) => {
    if (action.id === "act_escalate_now") {
      openEscalationModal({
        subject: "Physics",
        teacherName: "Dr. Rajesh Sharma",
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
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Online
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
