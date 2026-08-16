"use client";

import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  GraduationCap,
  BrainCircuit,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Mic,
  Image as ImageIcon,
  Paperclip,
  Send,
  Flame,
  Award
} from "lucide-react";
import { MOCK_QUIZ_QUESTIONS } from "@/lib/api/mockData";
import { useAppStore } from "@/lib/store/useAppStore";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

export default function StudyModePage() {
  const router = useRouter();
  const { addChatMessage, openVoiceModal } = useAppStore();
  const [activeTab, setActiveTab] = useState<"explain" | "quiz" | "doubt" | "prep">("explain");

  // Explain State
  const [explainTopic, setExplainTopic] = useState("Lenz's Law & Electromagnetic Induction");
  const [explainLevel, setExplainLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");

  // Quiz State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Doubt Solver State
  const [doubtText, setDoubtText] = useState("");
  const [doubtSubject, setDoubtSubject] = useState("Physics");
  const [doubtImage, setDoubtImage] = useState<string | null>(null);

  const currentQuestion = MOCK_QUIZ_QUESTIONS[currentQIndex];

  const handleQuizOptionClick = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleQuizSubmit = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);

    if (selectedAnswer === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < MOCK_QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handleResetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleAskAIExplanation = () => {
    router.push("/student/chat");
    setTimeout(() => {
      addChatMessage({
        id: `user_${Date.now()}`,
        sender: "user",
        text: `Please explain the topic "${explainTopic}" in ${explainLevel.toUpperCase()} depth with clear diagrams and real-life analogies.`,
        timestamp: new Date().toISOString()
      });
    }, 300);
  };

  const handleDoubtSubmit = () => {
    if (!doubtText.trim() && !doubtImage) return;

    router.push("/student/chat");
    setTimeout(() => {
      let prompt = `[Doubt in ${doubtSubject}]\n\n${doubtText}`;
      if (doubtImage) {
        prompt = `[Attached Question Image]\n${prompt}`;
      }
      addChatMessage({
        id: `user_${Date.now()}`,
        sender: "user",
        text: prompt,
        timestamp: new Date().toISOString()
      });
    }, 300);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-indigo-500" /> AI Study Suite
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Master complex concepts with interactive explanations, speed quizzes, and doubt solver
          </p>
        </div>

        {/* Study Suite Tabs */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-2xl border border-border/60 self-start sm:self-auto">
          {[
            { id: "explain", label: "Explain Topic", icon: BookOpen },
            { id: "quiz", label: "Interactive Quiz", icon: HelpCircle },
            { id: "doubt", label: "Doubt Solver", icon: BrainCircuit },
            { id: "prep", label: "Exam Prep", icon: GraduationCap }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode 1: Explain a Topic */}
      {activeTab === "explain" && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-border space-y-6">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Concept Explainer
            </span>
            <h3 className="text-xl font-bold text-foreground mt-1">
              Select Depth & Get Instant AI Breakdown
            </h3>
          </div>

          <div className="space-y-4">
            {/* Topic Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Enter Topic, Chapter or Formula:
              </label>
              <input
                type="text"
                value={explainTopic}
                onChange={(e) => setExplainTopic(e.target.value)}
                placeholder="e.g. Lenz's Law, Cannizzaro Reaction, Integration by Parts"
                className="w-full rounded-2xl p-3.5 text-sm bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Depth Toggle (Beginner / Intermediate / Advanced) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">
                Target Understanding Level:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "beginner", label: "🌱 Beginner", desc: "Simple analogies & everyday examples" },
                  { id: "intermediate", label: "🎯 Intermediate", desc: "Standard NCERT exam derivations" },
                  { id: "advanced", label: "⚡ Advanced", desc: "JEE/Competitive depth & tricks" }
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setExplainLevel(lvl.id as any)}
                    className={cn(
                      "p-3.5 rounded-2xl border text-left transition-all",
                      explainLevel === lvl.id
                        ? "bg-primary/10 border-primary ring-2 ring-primary/20 text-foreground"
                        : "bg-muted/40 border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <p className="text-xs font-bold">{lvl.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                      {lvl.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAskAIExplanation}
              className="w-full py-3.5 px-4 rounded-2xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Personalized Explanation</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Interactive Quiz Engine */}
      {activeTab === "quiz" && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-border space-y-6">
          {!quizCompleted ? (
            <div>
              {/* Quiz Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">
                    Question {currentQIndex + 1} of {MOCK_QUIZ_QUESTIONS.length}
                  </span>
                  <h3 className="text-lg font-bold text-foreground mt-0.5">
                    {currentQuestion.subject} Speed Quiz
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold bg-muted px-3 py-1.5 rounded-xl border border-border">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Score: {score}</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="my-6">
                <p className="text-base sm:text-lg font-semibold text-foreground leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrect = i === currentQuestion.correctIndex;
                  const showCorrect = isAnswerSubmitted && isCorrect;
                  const showWrong = isAnswerSubmitted && isSelected && !isCorrect;

                  return (
                    <button
                      key={i}
                      onClick={() => handleQuizOptionClick(i)}
                      disabled={isAnswerSubmitted}
                      className={cn(
                        "w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between",
                        showCorrect && "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold",
                        showWrong && "bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 font-bold",
                        !isAnswerSubmitted && isSelected && "bg-primary/10 border-primary ring-2 ring-primary/20",
                        !isAnswerSubmitted && !isSelected && "bg-muted/40 border-border hover:bg-muted"
                      )}
                    >
                      <span>{opt}</span>
                      {showCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                      {showWrong && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Note when submitted */}
              {isAnswerSubmitted && (
                <div className="mt-4 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Explanation:
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <button
                  onClick={handleResetQuiz}
                  className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restart
                </button>

                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={selectedAnswer === null}
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold disabled:opacity-40 shadow-sm"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{currentQIndex < MOCK_QUIZ_QUESTIONS.length - 1 ? "Next Question" : "Finish Quiz"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Completed Screen */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-foreground">Quiz Completed!</h3>
              <p className="text-sm text-muted-foreground">
                You scored <strong>{score}</strong> out of <strong>{MOCK_QUIZ_QUESTIONS.length}</strong>!
              </p>
              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={handleResetQuiz}
                  className="px-5 py-2.5 rounded-2xl bg-muted hover:bg-muted/80 text-xs font-bold border border-border"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={() => setActiveTab("explain")}
                  className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-bold"
                >
                  Review Weak Topics
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Multi-modal Doubt Solver */}
      {activeTab === "doubt" && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-border space-y-6">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              24/7 AI Doubt Solver
            </span>
            <h3 className="text-xl font-bold text-foreground mt-1">
              Ask Any Academic Doubt via Text, Voice or Homework Photo
            </h3>
          </div>

          <div className="space-y-4">
            {/* Subject Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Select Subject:</label>
              <select
                value={doubtSubject}
                onChange={(e) => setDoubtSubject(e.target.value)}
                className="w-full rounded-2xl p-3 text-xs bg-background border border-input focus:ring-2 focus:ring-primary"
              >
                <option value="Physics">Physics (Electromagnetism & Optics)</option>
                <option value="Chemistry">Chemistry (Organic & Physical)</option>
                <option value="Mathematics">Mathematics (Calculus & Vectors)</option>
                <option value="Computer Science">Computer Science (Python & SQL)</option>
              </select>
            </div>

            {/* Doubt Input Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Describe your doubt:</label>
              <textarea
                rows={4}
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
                placeholder="Type your question, formula confusion, or textbook step you didn't understand..."
                className="w-full rounded-2xl p-3.5 text-xs sm:text-sm bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openVoiceModal}
                  className="px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold flex items-center gap-1.5"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Speak Doubt</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleDoubtSubmit}
                disabled={!doubtText.trim() && !doubtImage}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1.5 shadow-md shadow-primary/20"
              >
                <span>Solve Step-by-Step</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode 4: Exam Preparation */}
      {activeTab === "prep" && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-border space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Exam War Room
            </span>
            <h3 className="text-xl font-bold text-foreground mt-1">
              Physics Unit Test II (Aug 21) — 5-Day Revision Blueprint
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" /> Day 1 & 2: Core Derivations
              </span>
              <p className="text-xs text-muted-foreground">
                Faraday's Experiments, Self Inductance of Long Solenoid, Mutual Inductance of Two Coaxial Solenoids.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" /> Day 3 & 4: Numerical Sets
              </span>
              <p className="text-xs text-muted-foreground">
                NCERT Q12-24 on Induced EMF with moving conductors and Transformer efficiency calculations.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              router.push("/student/chat");
              setTimeout(() => {
                addChatMessage({
                  id: `user_${Date.now()}`,
                  sender: "user",
                  text: "Give me the formula summary cheat sheet for Physics Unit Test II on Electromagnetism",
                  timestamp: new Date().toISOString()
                });
              }, 300);
            }}
            className="w-full py-3 px-4 rounded-2xl bg-primary text-primary-foreground text-xs font-bold shadow-md"
          >
            Download / View Formula Cheat Sheet with AI
          </button>
        </div>
      )}
    </div>
  );
}
