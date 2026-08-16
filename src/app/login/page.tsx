"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";
import { UserRole } from "@/types";
import {
  GraduationCap,
  HeartHandshake,
  Briefcase,
  Building,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useAppStore();

  const demoRoles: {
    role: UserRole;
    name: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    targetPath: string;
  }[] = [
    {
      role: "student",
      name: "Siva",
      title: "Student Portal",
      description: "Class 11 Science • Attendance 91.2%, Timetable, Assignments, Physics Exam Prep & AI Chat",
      icon: GraduationCap,
      color: "from-blue-600 to-indigo-600 shadow-blue-500/20",
      targetPath: "/student"
    },
    {
      role: "parent",
      name: "Meera (Mother of Siva)",
      title: "Parent Portal",
      description: "Caring Persona • Live attendance monitoring, fee status, PTM alerts & direct teacher call",
      icon: HeartHandshake,
      color: "from-rose-600 to-pink-600 shadow-rose-500/20",
      targetPath: "/parent"
    },
    {
      role: "teacher",
      name: "Dr. Rajesh Sharma",
      title: "Teacher Portal",
      description: "Physics Faculty • Class roll-call, student escalation queue, AI lesson plan & quiz generator",
      icon: Briefcase,
      color: "from-purple-600 to-indigo-600 shadow-purple-500/20",
      targetPath: "/teacher"
    },
    {
      role: "management",
      name: "Dr. K. Rao (Principal)",
      title: "Management & Principal Portal",
      description: "Institutional Metrics • School-wide 93.8% attendance, escalation SLAs & emergency broadcasts",
      icon: Building,
      color: "from-amber-600 to-orange-600 shadow-amber-500/20",
      targetPath: "/management"
    }
  ];

  const handleSelectRole = (item: (typeof demoRoles)[0]) => {
    setRole(item.role);
    router.push(item.targetPath);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
          <Sparkles className="w-4 h-4" />
          <span>XYZ AI — Human-Like AI School Platform</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
          Select Your Role Experience
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
          Choose a school persona to explore role-tailored AI interactions, datasets, and capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {demoRoles.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.role}
              onClick={() => handleSelectRole(item)}
              className="glass-card p-6 rounded-3xl border border-border text-left hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 active:translate-y-0 flex flex-col justify-between group space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className={cn("p-3 rounded-2xl text-white shadow-lg", item.color)}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-extrabold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                  Enter <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-primary mt-0.5">
                  Persona: {item.name}
                </p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
