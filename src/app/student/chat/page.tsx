"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AIChat } from "@/components/ai/AIChat";
import { Sparkles, BookOpen, BrainCircuit, Calendar, MessageSquare } from "lucide-react";

function ChatInner() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || undefined;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <AIChat className="flex-1" initialPrompt={initialPrompt} />
    </div>
  );
}

export default function StudentChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading AI Assistant...</div>}>
      <ChatInner />
    </Suspense>
  );
}
