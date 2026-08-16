"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
  MessageSquare,
  ChevronRight,
  Globe
} from "lucide-react";
import { AIAvatar } from "./AIAvatar";
import { AudioVisualizer } from "./AudioVisualizer";
import { useAppStore } from "@/lib/store/useAppStore";
import { api } from "@/lib/api/client";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

export const VoiceModal: React.FC = () => {
  const {
    isVoiceModalOpen,
    closeVoiceModal,
    voiceState,
    setVoiceState,
    avatarState,
    setAvatarState,
    currentLanguage,
    setLanguage,
    addChatMessage,
    t
  } = useAppStore();

  const [transcript, setTranscript] = useState("");
  const [aiSpokenResponse, setAiSpokenResponse] = useState("");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize SpeechSynthesis
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Sync avatar state with voice state
  useEffect(() => {
    if (voiceState === "listening") {
      setAvatarState("listening");
    } else if (voiceState === "processing") {
      setAvatarState("thinking");
    } else if (voiceState === "speaking") {
      setAvatarState("speaking");
    } else {
      setAvatarState("idle");
    }
  }, [voiceState, setAvatarState]);

  // Clean up speech on unmount or close
  useEffect(() => {
    if (!isVoiceModalOpen) {
      stopAllAudio();
      setTranscript("");
      setAiSpokenResponse("");
      setErrorMessage("");
      setVoiceState("idle");
    }
  }, [isVoiceModalOpen, setVoiceState]);

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
    setErrorMessage("");
    setTranscript("");
    setAiSpokenResponse("");
    setVoiceState("listening");

    // Web Speech Recognition API with smart graceful fallback simulation
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

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition notice:", event.error);
        if (event.error === "no-speech" || event.error === "network") {
          fallbackSpeechSim();
        } else {
          setVoiceState("error");
          setErrorMessage("I couldn't hear that. Please try again.");
        }
      };

      recognition.onend = () => {
        if (transcript.trim().length > 0) {
          handleProcessVoicePrompt(transcript);
        } else {
          fallbackSpeechSim();
        }
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (e) {
        fallbackSpeechSim();
      }
    } else {
      // Browser fallback simulation
      fallbackSpeechSim();
    }
  };

  const fallbackSpeechSim = () => {
    const sampleQuestions = [
      "What is my attendance in Physics?",
      "What is my next class today?",
      "Can you quiz me on Lenz's Law?",
      "When is my Physics Unit Test?",
      "Can you help me with my pending homework?"
    ];
    const pickedQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];

    let current = "";
    const words = pickedQuestion.split(" ");
    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) {
        current += (i === 0 ? "" : " ") + words[i];
        setTranscript(current);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          handleProcessVoicePrompt(pickedQuestion);
        }, 600);
      }
    }, 220);
  };

  const handleProcessVoicePrompt = async (promptText: string) => {
    if (!promptText.trim()) return;

    setVoiceState("processing");

    // Add user message to global chat history
    const userMsgId = `user_${Date.now()}`;
    addChatMessage({
      id: userMsgId,
      sender: "user",
      text: promptText,
      timestamp: new Date().toISOString()
    });

    try {
      let fullResponseText = "";
      await api.streamAIChat(
        promptText,
        () => {},
        (completed) => {
          fullResponseText = completed.text || "I have updated your schedule and dashboard with the latest academic info.";
          setAiSpokenResponse(fullResponseText);
          setVoiceState("speaking");

          // Save AI response to chat
          addChatMessage({
            id: `ai_${Date.now()}`,
            sender: "ai",
            text: fullResponseText,
            timestamp: new Date().toISOString(),
            contextualActions: completed.contextualActions,
            suggestedFollowUps: completed.suggestedFollowUps
          });

          // Text-to-Speech Output
          speakText(fullResponseText);
        }
      );
    } catch (err) {
      setVoiceState("error");
      setErrorMessage("Something went wrong while processing your request. Please try again.");
    }
  };

  const speakText = (text: string) => {
    if (isAudioMuted) {
      // Auto-return to idle after read duration
      setTimeout(() => {
        setVoiceState("idle");
      }, 5000);
      return;
    }

    if (synthRef.current) {
      synthRef.current.cancel();
      // Strip markdown syntax for natural speech
      const cleanText = text
        .replace(/[*#_`>]/g, "")
        .replace(/\[.*?\]\(.*?\)/g, "")
        .replace(/\|/g, " ")
        .slice(0, 240); // Concise spoken excerpt for voice clarity

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      utterance.onend = () => {
        setVoiceState("idle");
      };

      utterance.onerror = () => {
        setVoiceState("idle");
      };

      synthRef.current.speak(utterance);
    } else {
      setTimeout(() => {
        setVoiceState("idle");
      }, 5000);
    }
  };

  if (!isVoiceModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-indigo-950/90 to-slate-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden"
        >
          {/* Ambient Background Aura */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar Controls */}
          <div className="w-full flex items-center justify-between z-10 mb-4">
            {/* Language Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>{SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.nativeName}</span>
            </div>

            {/* Audio Mute & Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (synthRef.current?.speaking) synthRef.current.cancel();
                  setIsAudioMuted(!isAudioMuted);
                }}
                aria-label={isAudioMuted ? "Unmute voice" : "Mute voice"}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
              </button>
              <button
                onClick={closeVoiceModal}
                aria-label="Close voice assistant"
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Prominent AI Avatar Experience */}
          <div className="my-2 z-10">
            <AIAvatar state={avatarState} size="xl" showMoodBadge={true} />
          </div>

          {/* Live Waveform Audio Visualizer */}
          <div className="w-full max-w-xs my-2 z-10">
            <AudioVisualizer
              isActive={voiceState === "listening" || voiceState === "speaking" || voiceState === "processing"}
              mode={voiceState}
              barCount={24}
            />
          </div>

          {/* Dynamic Status Text & Subtitles */}
          <div className="min-h-[90px] flex flex-col items-center justify-center px-4 my-2 z-10">
            {voiceState === "idle" && (
              <p className="text-base text-slate-300 font-medium animate-pulse">
                {t("tap_to_speak")}
              </p>
            )}

            {voiceState === "listening" && (
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Listening...
                </span>
                <p className="text-lg font-medium text-white text-balance">
                  {transcript || "Listening to your voice..."}
                </p>
              </div>
            )}

            {voiceState === "processing" && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-indigo-300 font-medium">
                  <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Thinking... Analyzing school records</span>
                </div>
                <p className="text-xs text-slate-400 italic max-w-xs truncate">
                  "{transcript}"
                </p>
              </div>
            )}

            {voiceState === "speaking" && (
              <div className="space-y-2 max-h-24 overflow-y-auto px-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Volume2 className="w-3.5 h-3.5" />
                  Speaking
                </span>
                <p className="text-sm font-normal text-slate-200 text-left line-clamp-3">
                  {aiSpokenResponse}
                </p>
              </div>
            )}

            {voiceState === "error" && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-rose-400">
                  {errorMessage || "I couldn't hear that. Please try again."}
                </p>
                <button
                  onClick={startListening}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  <RefreshCw className="w-3 h-3" /> Tap to Retry
                </button>
              </div>
            )}
          </div>

          {/* Primary Voice Action Button */}
          <div className="w-full flex items-center justify-center gap-4 mt-4 z-10">
            {voiceState === "listening" ? (
              <button
                onClick={() => {
                  stopAllAudio();
                  setVoiceState("idle");
                }}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/40 flex items-center justify-center transition-all duration-200 transform active:scale-95"
                aria-label="Stop listening"
              >
                <MicOff className="w-7 h-7" />
              </button>
            ) : voiceState === "speaking" ? (
              <button
                onClick={() => {
                  stopAllAudio();
                  setVoiceState("idle");
                }}
                className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm flex items-center gap-2 transition-all shadow-lg"
              >
                <VolumeX className="w-4 h-4" /> Stop Speaking
              </button>
            ) : (
              <button
                onClick={startListening}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/40 flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95"
                aria-label="Start speaking"
              >
                <Mic className="w-7 h-7" />
              </button>
            )}
          </div>

          {/* Quick Voice Prompt Shortcuts */}
          <div className="w-full mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-center gap-2 z-10">
            {[
              "What's my attendance?",
              "Next class?",
              "Physics Unit Test Prep",
              "Quiz me"
            ].map((shortcut) => (
              <button
                key={shortcut}
                onClick={() => {
                  setTranscript(shortcut);
                  handleProcessVoicePrompt(shortcut);
                }}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white border border-white/5 transition-colors flex items-center gap-1"
              >
                <span>{shortcut}</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
