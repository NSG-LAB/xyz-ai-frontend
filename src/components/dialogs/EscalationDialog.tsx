"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PhoneCall,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  BookOpen,
  Send,
  Loader2,
  Calendar
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { cn } from "@/lib/utils";

export const EscalationDialog: React.FC = () => {
  const {
    isEscalationModalOpen,
    closeEscalationModal,
    escalationContext,
    createEscalationRequest,
    userProfile
  } = useAppStore();

  const [reason, setReason] = useState(
    escalationContext?.reason || "Need clarification on Electromagnetic Induction derivation for upcoming exam"
  );
  const [priority, setPriority] = useState<"normal" | "urgent">("urgent");
  const [preferredSlot, setPreferredSlot] = useState("Tomorrow, 03:30 PM - 04:00 PM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedRequest, setConfirmedRequest] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isEscalationModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Backend confirmation guarantee: Waits for real/simulated server acknowledgment
      const result = await createEscalationRequest({
        studentName: userProfile.name,
        subject: escalationContext?.subject || "Physics",
        teacherName: escalationContext?.teacherName || "Dr. Rajesh Sharma",
        reason: reason.trim(),
        priority,
        scheduledSlot: preferredSlot
      });

      setConfirmedRequest(result);
    } catch (err: any) {
      setError("Failed to reach school dispatch server. Please check your network and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setConfirmedRequest(null);
    setError(null);
    closeEscalationModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-lg bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Talk to Subject Teacher</h3>
                <p className="text-xs text-muted-foreground">Direct Faculty Callback & Consultation</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {confirmedRequest ? (
            /* Backend Confirmed Success State */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-foreground">Callback Request Confirmed!</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  Ticket ID: #{confirmedRequest.id}
                </p>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                  Your request has been dispatched to <strong>{confirmedRequest.teacherName}</strong>. You will receive an SMS and push alert when accepted.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/50 border border-border text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subject:</span>
                  <span className="font-semibold text-foreground">{confirmedRequest.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teacher:</span>
                  <span className="font-semibold text-foreground">{confirmedRequest.teacherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Preferred Time:</span>
                  <span className="font-semibold text-foreground">{confirmedRequest.scheduledSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority:</span>
                  <span className={cn("font-bold uppercase", confirmedRequest.priority === "urgent" ? "text-rose-500" : "text-indigo-500")}>
                    {confirmedRequest.priority}
                  </span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          ) : (
            /* Request Form */
            <form onSubmit={handleSubmit} className="pt-4 space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200">
                <p className="font-medium">
                  Would you like XYZ AI to schedule a 1-on-1 call with your teacher?
                </p>
                <p className="text-muted-foreground mt-1">
                  The teacher will be notified with your query and preferred availability.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Subject & Teacher Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Subject
                  </span>
                  <p className="text-sm font-semibold mt-0.5">{escalationContext?.subject || "Physics"}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" /> Faculty
                  </span>
                  <p className="text-sm font-semibold mt-0.5">{escalationContext?.teacherName || "Dr. Rajesh Sharma"}</p>
                </div>
              </div>

              {/* Doubt / Reason Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  What do you need help with?
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  placeholder="Describe your specific question, chapter, or numerical problem..."
                  className="w-full rounded-xl p-3 text-xs bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Preferred Slot */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" /> Preferred Time Slot
                </label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  className="w-full rounded-xl p-2.5 text-xs bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Today, 03:30 PM - 04:00 PM (After School)">Today, 03:30 PM - 04:00 PM (After School)</option>
                  <option value="Tomorrow, 08:00 AM - 08:30 AM (Zero Period)">Tomorrow, 08:00 AM - 08:30 AM (Zero Period)</option>
                  <option value="Tomorrow, 03:30 PM - 04:00 PM">Tomorrow, 03:30 PM - 04:00 PM</option>
                  <option value="Saturday, 10:00 AM - 11:00 AM (Clinic Hour)">Saturday, 10:00 AM - 11:00 AM (Clinic Hour)</option>
                </select>
              </div>

              {/* Priority Toggle */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold">Urgency Level:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPriority("normal")}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-medium transition-colors border",
                      priority === "normal"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                    )}
                  >
                    Normal (Within 24h)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority("urgent")}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-medium transition-colors border",
                      priority === "urgent"
                        ? "bg-rose-600 text-white border-rose-600"
                        : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                    )}
                  >
                    Urgent (Exam Doubt)
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-input hover:bg-muted text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !reason.trim()}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying with Server...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Request Call</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
