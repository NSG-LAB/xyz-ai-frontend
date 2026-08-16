"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Users, GraduationCap, HeartHandshake, Briefcase, Building, X, Check } from "lucide-react";
import { useAppStore, MOCK_PROFILES } from "@/lib/store/useAppStore";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { currentRole, setRole, t } = useAppStore();

  if (!isOpen) return null;

  const roles: { role: UserRole; title: string; subtitle: string; icon: any; color: string; path: string }[] = [
    {
      role: "student",
      title: "Student Portal (Siva)",
      subtitle: "Grade 11 Science • Attendance, Timetable, Exams & AI Companion",
      icon: GraduationCap,
      color: "from-blue-500/15 to-indigo-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
      path: "/student"
    },
    {
      role: "parent",
      title: "Parent Portal (Meera)",
      subtitle: "Caring & Patient Persona • Child Attendance, Fees, Exam Alert & Teacher Connect",
      icon: HeartHandshake,
      color: "from-pink-500/15 to-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
      path: "/parent"
    },
    {
      role: "teacher",
      title: "Teacher Portal (Dr. Rajesh Sharma)",
      subtitle: "Faculty Assistant • Class Roll Call, Escalation Desk, Lesson & Quiz Generator",
      icon: Briefcase,
      color: "from-purple-500/15 to-indigo-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
      path: "/teacher"
    },
    {
      role: "management",
      title: "Principal & Management Portal",
      subtitle: "Executive Overview • School-wide Analytics, Teacher Escalation KPIs & Broadcasts",
      icon: Building,
      color: "from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
      path: "/management"
    }
  ];

  const handleSelectRole = (roleItem: (typeof roles)[0]) => {
    setRole(roleItem.role);
    router.push(roleItem.path);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-lg bg-card text-card-foreground border border-border rounded-3xl p-6 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Switch School Portal</h3>
                <p className="text-xs text-muted-foreground">Select a persona experience to demo</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 py-4">
            {roles.map((item) => {
              const Icon = item.icon;
              const isSelected = currentRole === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => handleSelectRole(item)}
                  className={cn(
                    "w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all duration-200 group bg-gradient-to-r",
                    item.color,
                    isSelected ? "ring-2 ring-primary shadow-md" : "hover:shadow-sm"
                  )}
                >
                  <div className="p-2.5 rounded-xl bg-background shadow-xs shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      {isSelected && (
                        <span className="p-1 rounded-full bg-primary text-primary-foreground">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 text-center text-xs text-muted-foreground">
            XYZ AI adapts persona tone, data access, and action capabilities per portal.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
