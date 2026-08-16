"use client";

import React, { useState } from "react";
import {
  Building,
  Users,
  CheckSquare,
  Award,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Send,
  PhoneCall,
  BellRing,
  AlertTriangle
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useAppStore } from "@/lib/store/useAppStore";
import { useRouter } from "next/navigation";

export default function ManagementPortalPage() {
  const router = useRouter();
  const { addChatMessage } = useAppStore();
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [isBroadcastSent, setIsBroadcastSent] = useState(false);

  const gradeAttendanceData = [
    { grade: "Grade 9", attendance: 94.2 },
    { grade: "Grade 10", attendance: 95.1 },
    { grade: "Grade 11", attendance: 91.8 },
    { grade: "Grade 12", attendance: 93.4 },
  ];

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    setIsBroadcastSent(true);
    setTimeout(() => {
      setIsBroadcastSent(false);
      setBroadcastTitle("");
      setBroadcastMessage("");
      alert("Emergency school-wide announcement dispatched via Push and SMS!");
    }, 1500);
  };

  const handleAskManagementAI = (prompt: string) => {
    router.push("/student/chat");
    setTimeout(() => {
      addChatMessage({
        id: `user_${Date.now()}`,
        sender: "user",
        text: `[Principal Query - Dr. K. Rao]\n\n${prompt}`,
        timestamp: new Date().toISOString()
      });
    }, 300);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Management Hero Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-950/90 via-slate-900 to-slate-950 border border-amber-500/20 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold">
              <Building className="w-3.5 h-3.5" />
              <span>Management & Principal Portal • Institutional Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Institutional Overview — Dr. K. Rao (Principal)
            </h2>
            <p className="text-sm text-slate-300">
              Delhi Public School, R.K. Puram • Daily Operations & Analytics
            </p>
          </div>

          <button
            onClick={() => handleAskManagementAI("Generate comprehensive weekly institutional report covering student attendance trends, syllabus completion percentage across Science and Commerce, and unresolved teacher callbacks")}
            className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-colors self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Executive Briefing</span>
          </button>
        </div>
      </div>

      {/* High-Level Institutional KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall School Attendance */}
        <div className="glass-card p-5 rounded-3xl space-y-2 border border-emerald-500/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-emerald-500" /> School Attendance
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              93.8%
            </h3>
            <span className="text-xs font-bold text-emerald-500">+1.2% this week</span>
          </div>
          <p className="text-xs text-muted-foreground">
            1,420 present out of 1,514 enrolled students
          </p>
        </div>

        {/* Total Faculty */}
        <div className="glass-card p-5 rounded-3xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-500" /> Teaching Faculty
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-foreground">
              86 / 88
            </h3>
            <span className="text-xs font-bold text-emerald-500">97.7% present</span>
          </div>
          <p className="text-xs text-muted-foreground">
            2 on approved academic leave
          </p>
        </div>

        {/* Escalations Resolution SLA */}
        <div className="glass-card p-5 rounded-3xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-purple-500" /> Escalation SLA
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-purple-600 dark:text-purple-400">
              96.4%
            </h3>
            <span className="text-xs font-bold text-purple-500">&lt; 24h SLA</span>
          </div>
          <p className="text-xs text-muted-foreground">
            52 student requests resolved this term
          </p>
        </div>

        {/* Academic Benchmark */}
        <div className="glass-card p-5 rounded-3xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" /> CBSE Readiness
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400">
              88.2%
            </h3>
            <span className="text-xs font-bold text-amber-500">Distinction avg</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Mid-term preparations on track
          </p>
        </div>
      </div>

      {/* Two Columns: Grade Attendance Analytics + Emergency Broadcaster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance by Wing Chart */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl border border-border space-y-4">
          <h3 className="text-base font-bold text-foreground">Attendance by High School Wing</h3>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.15)" />
                <XAxis dataKey="grade" stroke="#888888" fontSize={12} />
                <YAxis domain={[80, 100]} stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderRadius: "1rem",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff"
                  }}
                />
                <Bar dataKey="attendance" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emergency Announcement Broadcaster */}
        <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-border space-y-4">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-foreground">School-Wide Emergency Broadcast</h3>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Broadcast Title:</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Inclement Weather Alert / Schedule Shift"
                required
                className="w-full rounded-2xl p-3 text-xs bg-background border border-input focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Message Content:</label>
              <textarea
                rows={3}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Type official notification message dispatched to all parents, students and faculty..."
                required
                className="w-full rounded-2xl p-3 text-xs bg-background border border-input focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isBroadcastSent}
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors shadow-md shadow-amber-600/30 flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isBroadcastSent ? "Dispatching to 1,514 Devices..." : "Dispatch Broadcast"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
