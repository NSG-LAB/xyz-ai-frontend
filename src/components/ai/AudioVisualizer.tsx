"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { VoiceState } from "@/types";

interface AudioVisualizerProps {
  isActive: boolean;
  mode?: VoiceState | "thinking";
  barCount?: number;
  className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isActive,
  mode = "idle",
  barCount = 18,
  className,
}) => {
  const [heights, setHeights] = useState<number[]>(Array(barCount).fill(15));

  useEffect(() => {
    if (!isActive || mode === "idle") {
      setHeights(Array(barCount).fill(12));
      return;
    }

    const interval = setInterval(() => {
      const newHeights = Array.from({ length: barCount }, (_, i) => {
        if (mode === "speaking") {
          // Middle-weighted wave for voice speaking
          const distanceFromCenter = Math.abs(i - barCount / 2) / (barCount / 2);
          const weight = 1 - distanceFromCenter * 0.6;
          return Math.floor((Math.random() * 65 + 20) * weight);
        } else if (mode === "listening") {
          // Responsive microphone sound ripples
          return Math.floor(Math.random() * 45 + 15);
        } else if (mode === "thinking" || mode === "processing") {
          // Sine wave rhythm
          const time = Date.now() / 200;
          return Math.floor(Math.sin(time + i * 0.4) * 20 + 30);
        }
        return 12;
      });
      setHeights(newHeights);
    }, 90);

    return () => clearInterval(interval);
  }, [isActive, mode, barCount]);

  const barColors: Record<string, string> = {
    listening: "bg-gradient-to-t from-emerald-600 to-teal-400 shadow-emerald-500/50",
    speaking: "bg-gradient-to-t from-indigo-600 via-purple-500 to-pink-400 shadow-purple-500/50",
    thinking: "bg-gradient-to-t from-amber-600 to-yellow-400 shadow-amber-500/50",
    processing: "bg-gradient-to-t from-amber-600 to-yellow-400 shadow-amber-500/50",
    error: "bg-rose-500 shadow-rose-500/50",
    idle: "bg-slate-400 dark:bg-slate-700",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1.5 h-16 px-4 py-2 select-none",
        className
      )}
      aria-hidden="true"
    >
      {heights.map((h, index) => (
        <div
          key={index}
          style={{ height: `${h}%` }}
          className={cn(
            "w-1.5 rounded-full transition-all duration-100 ease-out shadow-sm",
            barColors[mode]
          )}
        />
      ))}
    </div>
  );
};
