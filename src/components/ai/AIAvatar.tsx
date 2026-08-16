"use client";

import React, { useEffect, useState } from "react";
import { AvatarState } from "@/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mic, Volume2 } from "lucide-react";

interface AIAvatarProps {
  state?: AvatarState;
  size?: "sm" | "md" | "lg" | "xl";
  showMoodBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AIAvatar: React.FC<AIAvatarProps> = ({
  state = "idle",
  size = "md",
  showMoodBadge = false,
  className,
  onClick,
}) => {
  const [mouthPhase, setMouthPhase] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  // Lip-sync speech oscillation
  useEffect(() => {
    if (state === "speaking") {
      const interval = setInterval(() => {
        setMouthPhase((prev) => (prev + 1) % 4);
      }, 140);
      return () => clearInterval(interval);
    } else {
      setMouthPhase(0);
    }
  }, [state]);

  // Natural blinking interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4500);
    return () => clearInterval(blinkInterval);
  }, []);

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-28 h-28",
    xl: "w-44 h-44",
  };

  const stateColors = {
    idle: "from-blue-500/20 via-indigo-500/20 to-purple-500/20 text-indigo-400",
    listening: "from-emerald-500/30 via-teal-500/20 to-cyan-500/30 text-emerald-400 ring-4 ring-emerald-500/30",
    thinking: "from-amber-500/30 via-orange-500/20 to-purple-500/30 text-amber-400 ring-4 ring-amber-500/30",
    speaking: "from-indigo-600/40 via-purple-600/30 to-pink-500/40 text-purple-300 ring-4 ring-purple-500/40",
    happy: "from-pink-500/30 via-rose-500/20 to-amber-500/30 text-pink-400 ring-4 ring-pink-500/30",
    alert: "from-rose-500/30 via-red-500/20 to-orange-500/30 text-rose-400 ring-4 ring-rose-500/30",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center select-none cursor-pointer transition-all duration-300",
        className
      )}
      role="img"
      aria-label={`XYZ AI Avatar - Status: ${state}`}
    >
      {/* Outer Holographic Glow / Pulse Aura */}
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-tr transition-all duration-500 blur-xl opacity-70",
          stateColors[state],
          (state === "speaking" || state === "listening") && "animate-pulse"
        )}
      />

      {/* Main Avatar Container */}
      <motion.div
        animate={
          state === "speaking"
            ? { scale: [1, 1.03, 1], rotate: [0, 1, -1, 0] }
            : state === "listening"
            ? { scale: [1, 1.05, 1] }
            : state === "thinking"
            ? { rotate: [0, 2, -2, 0] }
            : { y: [0, -3, 0] }
        }
        transition={{
          repeat: Infinity,
          duration: state === "speaking" ? 1.5 : 3.5,
          ease: "easeInOut",
        }}
        className={cn(
          "relative rounded-full p-[2px] bg-gradient-to-b from-white/40 via-white/10 to-indigo-500/40 dark:from-white/20 dark:to-indigo-500/30 shadow-2xl backdrop-blur-md overflow-hidden",
          sizeClasses[size]
        )}
      >
        {/* Inner SVG Face */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full rounded-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950"
        >
          {/* Background Ambient Glow inside face */}
          <circle cx="50" cy="50" r="48" fill="url(#bgGlow)" />
          <defs>
            <radialGradient id="bgGlow" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#1e1b4b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
            </radialGradient>
            <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>

          {/* Futuristic Ear Nodes / Audio Sensor Pads */}
          <rect x="2" y="44" width="5" height="14" rx="2.5" fill="#6366f1" opacity="0.8" />
          <rect x="93" y="44" width="5" height="14" rx="2.5" fill="#6366f1" opacity="0.8" />

          {/* Forehead AI Spark / Neural Node */}
          <circle
            cx="50"
            cy="24"
            r={state === "thinking" ? 3.5 : 2.5}
            fill={state === "thinking" ? "#fbbf24" : state === "listening" ? "#34d399" : "#60a5fa"}
            className={state === "thinking" ? "animate-ping" : ""}
          />

          {/* Left Eye */}
          {isBlinking ? (
            <line x1="30" y1="45" x2="42" y2="45" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
          ) : state === "happy" ? (
            <path d="M 30 46 Q 36 39 42 46" stroke="#f472b6" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          ) : state === "thinking" ? (
            <g>
              <ellipse cx="36" cy="42" rx="5" ry="5.5" fill="url(#eyeGrad)" />
              <circle cx="38" cy="40" r="2" fill="#ffffff" />
            </g>
          ) : (
            <g>
              <ellipse
                cx="36"
                cy="46"
                rx={state === "listening" ? 6 : 5}
                ry={state === "listening" ? 6.5 : 5.5}
                fill="url(#eyeGrad)"
              />
              <circle cx="38" cy="44" r="2" fill="#ffffff" />
              <circle cx="34" cy="47" r="0.9" fill="#ffffff" opacity="0.7" />
            </g>
          )}

          {/* Right Eye */}
          {isBlinking ? (
            <line x1="58" y1="45" x2="70" y2="45" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
          ) : state === "happy" ? (
            <path d="M 58 46 Q 64 39 70 46" stroke="#f472b6" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          ) : state === "thinking" ? (
            <g>
              <ellipse cx="64" cy="42" rx="5" ry="5.5" fill="url(#eyeGrad)" />
              <circle cx="66" cy="40" r="2" fill="#ffffff" />
            </g>
          ) : (
            <g>
              <ellipse
                cx="64"
                cy="46"
                rx={state === "listening" ? 6 : 5}
                ry={state === "listening" ? 6.5 : 5.5}
                fill="url(#eyeGrad)"
              />
              <circle cx="66" cy="44" r="2" fill="#ffffff" />
              <circle cx="62" cy="47" r="0.9" fill="#ffffff" opacity="0.7" />
            </g>
          )}

          {/* Cheeks blush for friendly tone */}
          <ellipse cx="26" cy="54" rx="4" ry="2" fill="#f43f5e" opacity="0.25" />
          <ellipse cx="74" cy="54" rx="4" ry="2" fill="#f43f5e" opacity="0.25" />

          {/* Mouth Lip-Sync & Expression rendering */}
          {state === "speaking" ? (
            mouthPhase === 0 ? (
              <ellipse cx="50" cy="68" rx="8" ry="4" fill="#a855f7" />
            ) : mouthPhase === 1 ? (
              <ellipse cx="50" cy="68" rx="11" ry="6" fill="#c084fc" />
            ) : mouthPhase === 2 ? (
              <path d="M 40 67 Q 50 74 60 67" stroke="#e9d5ff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            ) : (
              <ellipse cx="50" cy="68" rx="6" ry="7" fill="#d8b4fe" />
            )
          ) : state === "listening" ? (
            /* Subtle attentive small mouth */
            <circle cx="50" cy="67" r="3.5" fill="#34d399" opacity="0.8" />
          ) : state === "thinking" ? (
            /* Wavy thinking curve */
            <path d="M 44 68 Q 50 64 56 68" stroke="#fbbf24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          ) : (
            /* Friendly gentle smile */
            <path d="M 42 66 Q 50 73 58 66" stroke="#818cf8" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
        </svg>
      </motion.div>

      {/* Mood Badge Pill */}
      {showMoodBadge && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-md capitalize backdrop-blur-md",
              state === "listening" && "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
              state === "speaking" && "bg-purple-500/20 text-purple-300 border border-purple-500/30",
              state === "thinking" && "bg-amber-500/20 text-amber-300 border border-amber-500/30",
              state === "idle" && "bg-slate-800/60 text-slate-300 border border-slate-700/50"
            )}
          >
            {state === "listening" && <Mic className="w-3 h-3 animate-pulse" />}
            {state === "speaking" && <Volume2 className="w-3 h-3 animate-pulse" />}
            {state === "thinking" && <Sparkles className="w-3 h-3 animate-spin" />}
            <span>{state}</span>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
