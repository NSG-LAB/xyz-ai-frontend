"use client";

import React, { useState, useEffect, useRef } from "react";
import { AIAvatar } from "@/components/ai/AIAvatar";
import { AudioVisualizer } from "@/components/ai/AudioVisualizer";
import { useAppStore } from "@/lib/store/useAppStore";
import { api } from "@/lib/api/client";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  ChevronRight,
  Globe
} from "lucide-react";
import Link from "next/link";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/translations";
import { LanguageSelectorModal } from "@/components/dialogs/LanguageSelectorModal";

export default function StudentVoicePage() {
  const {
    voiceState,
    setVoiceState,
    avatarState,
    setAvatarState,
    currentLanguage,
    addChatMessage,
    t
  } = useAppStore();

  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      stopAllAudio();
      setVoiceState("idle");
      setAvatarState("idle");
    };
  }, []);

  useEffect(() => {
    if (voiceState === "listening") setAvatarState("listening");
    else if (voiceState === "processing") setAvatarState("thinking");
    else if (voiceState === "speaking") setAvatarState("speaking");
    else setAvatarState("idle");
  }, [voiceState, setAvatarState]);

  const stopAllAudio = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
    }
  };

  const startListening = () => {
    stopAllAudio();
    setTranscript("");
    setAiResponse("");
    setVoiceState("listening");

    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLanguage === "en" ? "en-IN" : `${currentLanguage}-IN`;

      recognition.onresult = (event: any) => {
        let currentText = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onerror = () => {
        fallbackVoiceTrigger();
      };

      recognition.onend = () => {
        if (transcript.trim().length > 0) {
          processVoiceQuery(transcript);
        } else {
          fallbackVoiceTrigger();
        }
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (e) {
        fallbackVoiceTrigger();
      }
    } else {
      fallbackVoiceTrigger();
    }
  };

  const fallbackVoiceTrigger = () => {
    const questions = [
      "What is my overall attendance percentage?",
      "What is my next class and topic today?",
      "Can you quiz me on Lenz's Law in Physics?",
      "When is my next exam scheduled?",
      "Help me solve my pending Physics homework"
    ];
    const picked = questions[Math.floor(Math.random() * questions.length)];

    let current = "";
    const words = picked.split(" ");
    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) {
        current += (i === 0 ? "" : " ") + words[i];
        setTranscript(current);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => processVoiceQuery(picked), 500);
      }
    }, 200);
  };

  const processVoiceQuery = async (query: string) => {
    if (!query.trim()) return;
    setVoiceState("processing");

    addChatMessage({
      id: `user_${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toISOString()
    });

    try {
      await api.streamAIChat(
        query,
        () => {},
        (completed) => {
          const resp = completed.text || "Here is your academic info.";
          setAiResponse(resp);
          setVoiceState("speaking");

          addChatMessage({
            id: `ai_${Date.now()}`,
            sender: "ai",
            text: resp,
            timestamp: new Date().toISOString(),
            contextualActions: completed.contextualActions,
            suggestedFollowUps: completed.suggestedFollowUps
          });

          if (!isAudioMuted && synthRef.current) {
            synthRef.current.cancel();
            const cleanText = resp.replace(/[*#_`>]/g, "").slice(0, 240);
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.onend = () => setVoiceState("idle");
            utterance.onerror = () => setVoiceState("idle");
            synthRef.current.speak(utterance);
          } else {
            setTimeout(() => setVoiceState("idle"), 5000);
          }
        }
      );
    } catch (err) {
      setVoiceState("idle");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/student"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground p-2 rounded-2xl bg-muted/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLangOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-muted/60 hover:bg-muted text-xs font-semibold text-foreground border border-border/60 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>{SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.nativeName}</span>
          </button>
          <button
            onClick={() => {
              if (synthRef.current?.speaking) synthRef.current.cancel();
              setIsAudioMuted(!isAudioMuted);
            }}
            className="p-2 rounded-2xl bg-muted/60 text-foreground"
            aria-label={isAudioMuted ? "Unmute" : "Mute"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-primary" />}
          </button>
        </div>
      </div>

      {/* Prominent Voice Stage Box */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-b from-slate-900 via-indigo-950/80 to-slate-950 border border-white/10 shadow-2xl flex flex-col items-center text-center overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Large Prominent AI Avatar */}
        <div className="my-4 z-10">
          <AIAvatar state={avatarState} size="xl" showMoodBadge={true} />
        </div>

        {/* Live Audio Visualizer */}
        <div className="w-full max-w-sm my-3 z-10">
          <AudioVisualizer
            isActive={voiceState === "listening" || voiceState === "speaking" || voiceState === "processing"}
            mode={voiceState}
            barCount={28}
          />
        </div>

        {/* Subtitles & Response Container */}
        <div className="min-h-[100px] flex flex-col items-center justify-center px-4 my-2 z-10 max-w-lg">
          {voiceState === "idle" && (
            <p className="text-base text-slate-200 font-semibold animate-pulse">
              {t("tap_to_speak")}
            </p>
          )}

          {voiceState === "listening" && (
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Listening...
              </span>
              <p className="text-xl font-bold text-white">
                {transcript || "Speak clearly into your microphone..."}
              </p>
            </div>
          )}

          {voiceState === "processing" && (
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              <span>Thinking & processing your question...</span>
            </div>
          )}

          {voiceState === "speaking" && (
            <div className="space-y-2 max-h-32 overflow-y-auto px-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Volume2 className="w-3.5 h-3.5" />
                Speaking
              </span>
              <p className="text-sm font-medium text-slate-200 text-left leading-relaxed">
                {aiResponse}
              </p>
            </div>
          )}
        </div>

        {/* Microphone Main Control Button */}
        <div className="mt-6 z-10">
          {voiceState === "listening" ? (
            <button
              onClick={() => {
                stopAllAudio();
                setVoiceState("idle");
              }}
              className="w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-2xl shadow-rose-600/50 flex items-center justify-center transition-transform transform active:scale-95"
              aria-label="Stop listening"
            >
              <MicOff className="w-8 h-8" />
            </button>
          ) : voiceState === "speaking" ? (
            <button
              onClick={() => {
                stopAllAudio();
                setVoiceState("idle");
              }}
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2"
            >
              <VolumeX className="w-4 h-4" /> Stop Speaking
            </button>
          ) : (
            <button
              onClick={startListening}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white shadow-2xl shadow-indigo-600/40 flex items-center justify-center transition-transform transform hover:scale-105 active:scale-95"
              aria-label="Start speaking"
            >
              <Mic className="w-8 h-8" />
            </button>
          )}
        </div>

        {/* Quick Voice Shortcuts */}
        <div className="w-full mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-2 z-10">
          {[
            "What is my attendance in Physics?",
            "What's my next class?",
            "Quiz me on Lenz's Law",
            "Prepare 5-day Physics revision plan"
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setTranscript(prompt);
                processVoiceQuery(prompt);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-xs text-slate-300 hover:text-white border border-white/5 transition-colors flex items-center gap-1.5"
            >
              <span>{prompt}</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>
          ))}
        </div>
      </div>

      <LanguageSelectorModal
        isOpen={isLangOpen}
        onClose={() => setIsLangOpen(false)}
      />
    </div>
  );
}
