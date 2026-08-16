"use client";

import React, { useState } from "react";
import { MOCK_NOTIFICATIONS } from "@/lib/api/mockData";
import { NotificationItem } from "@/types";
import {
  Bell,
  Calendar,
  FileText,
  CheckCircle2,
  User,
  ArrowRight,
  Check,
  Filter
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<string>("all");

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.category === filter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "exam":
        return <Calendar className="w-5 h-5 text-amber-500" />;
      case "assignment":
        return <FileText className="w-5 h-5 text-purple-500" />;
      case "attendance":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "teacher":
        return <User className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-primary" /> Notifications & Alerts
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Timely academic notices, exam reminders, and teacher dispatches
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 rounded-xl bg-muted/80 hover:bg-muted text-xs font-bold text-foreground border border-border flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Check className="w-4 h-4 text-emerald-500" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/80 pb-3">
        {[
          { id: "all", label: "All Alerts" },
          { id: "exam", label: "Exams" },
          { id: "assignment", label: "Assignments" },
          { id: "attendance", label: "Attendance" },
          { id: "teacher", label: "Teacher Notices" }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
              filter === f.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={cn(
              "glass-card p-5 rounded-3xl border transition-all duration-200 flex items-start justify-between gap-4 group",
              !item.read && "ring-1 ring-primary/40 bg-primary/[0.02]"
            )}
          >
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-muted shrink-0 mt-0.5">
                {getCategoryIcon(item.category)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-foreground">
                    {item.title}
                  </h4>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.message}
                </p>
                <span className="text-[11px] text-muted-foreground/70 block pt-1">
                  {item.timestamp}
                </span>
              </div>
            </div>

            {item.actionUrl && (
              <Link
                href={item.actionUrl}
                className="px-4 py-2 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground text-xs font-bold transition-colors shrink-0 flex items-center gap-1 self-center"
              >
                <span>View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
