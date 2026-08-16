"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { MOCK_NOTIFICATIONS } from "@/lib/api/mockData";
import { Bell, Calendar, FileText, CheckCircle2, User, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "exam":
        return <Calendar className="w-4 h-4 text-amber-500" />;
      case "assignment":
        return <FileText className="w-4 h-4 text-purple-500" />;
      case "attendance":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "teacher":
        return <User className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-card text-card-foreground border border-border rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-bold">Notifications</h4>
          <span className="px-1.5 py-0.2 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
            3 New
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <Link
            key={notif.id}
            href={notif.actionUrl || "#"}
            onClick={onClose}
            className={cn(
              "p-3.5 flex items-start gap-3 hover:bg-muted/50 transition-colors group block",
              !notif.read && "bg-primary/[0.03]"
            )}
          >
            <div className="p-2 rounded-xl bg-muted shrink-0 mt-0.5">
              {getCategoryIcon(notif.category)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                  {notif.title}
                </h5>
                <span className="text-[10px] text-muted-foreground shrink-0 ml-1">
                  {notif.timestamp}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                {notif.message}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="p-3 bg-muted/30 border-t border-border text-center">
        <Link
          href="/student/notifications"
          onClick={onClose}
          className="text-xs font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1"
        >
          <span>View All Announcements</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
