import {
  MOCK_ATTENDANCE_SUMMARY,
  MOCK_SUBJECT_ATTENDANCE,
  MOCK_TIMETABLE_TODAY,
  MOCK_TIMETABLE_TOMORROW,
  MOCK_ASSIGNMENTS,
  MOCK_EXAMS,
  MOCK_PERFORMANCE,
  MOCK_NOTIFICATIONS,
  MOCK_QUIZ_QUESTIONS
} from "./mockData";
import { ChatMessage, ContextualAction, EscalationRequest } from "@/types";

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_URL || "") {
    this.baseUrl = baseUrl;
  }

  async getAttendanceSummary() {
    await this.simulateLatency(150);
    return MOCK_ATTENDANCE_SUMMARY;
  }

  async getSubjectAttendance() {
    await this.simulateLatency(180);
    return MOCK_SUBJECT_ATTENDANCE;
  }

  async getTimetable(day: "today" | "tomorrow" = "today") {
    await this.simulateLatency(150);
    return day === "today" ? MOCK_TIMETABLE_TODAY : MOCK_TIMETABLE_TOMORROW;
  }

  async getAssignments() {
    await this.simulateLatency(200);
    return MOCK_ASSIGNMENTS;
  }

  async getExams() {
    await this.simulateLatency(180);
    return MOCK_EXAMS;
  }

  async getPerformance() {
    await this.simulateLatency(220);
    return MOCK_PERFORMANCE;
  }

  async getNotifications() {
    await this.simulateLatency(120);
    return MOCK_NOTIFICATIONS;
  }

  async getQuizQuestions(subject?: string) {
    await this.simulateLatency(200);
    if (!subject) return MOCK_QUIZ_QUESTIONS;
    return MOCK_QUIZ_QUESTIONS.filter((q) => q.subject.toLowerCase() === subject.toLowerCase());
  }

  async requestTeacherEscalation(data: Omit<EscalationRequest, "id" | "createdAt" | "status">) {
    // Strict simulation of reliable server endpoint
    await this.simulateLatency(1000);
    const newRequest: EscalationRequest = {
      ...data,
      id: `ESC-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "submitted",
      createdAt: new Date().toISOString(),
      notes: "Teacher has received the high-priority callback ticket."
    };
    return newRequest;
  }

  /**
   * Stream AI Assistant responses with rich Markdown and contextual actions.
   */
  async streamAIChat(
    userPrompt: string,
    onChunk: (chunk: string) => void,
    onComplete: (fullMessage: Partial<ChatMessage>) => void
  ) {
    const promptLower = userPrompt.toLowerCase();
    let responseText = "";
    let contextualActions: ContextualAction[] = [];
    let suggestedFollowUps: string[] = [];

    if (promptLower.includes("attendance")) {
      responseText = `📊 **Your Attendance Analysis**\n\n* **Overall Attendance:** **91.2%** (197 / 216 classes attended)\n* **CBSE Mandatory Minimum:** 75.0%\n* **Status:** 🟢 **Safe & Exam Eligible**\n\n### Subject Breakdown:\n| Subject | Attended | Total | % |\n| :--- | :--- | :--- | :--- |\n| **Physics** | 42 | 45 | **93.3%** |\n| **Chemistry** | 38 | 43 | **88.4%** |\n| **Mathematics** | 45 | 48 | **93.8%** |\n| **Computer Science** | 39 | 40 | **97.5%** |\n| **English Core** | 33 | 40 | **82.5%** |\n\n> 💡 *Tip:* You can comfortably take up to **3 consecutive days of approved leave** without falling below the 85% distinction bracket!`;
      contextualActions = [
        { id: "act_att_trend", label: "📈 Attendance Trend", prompt: "Show my monthly attendance trend" },
        { id: "act_att_safe", label: "🛡️ Leave Planner", prompt: "How many more classes can I miss safely?" },
        { id: "act_att_eng", label: "⚠️ English Attendance Plan", prompt: "How to improve my English attendance above 90%?" }
      ];
      suggestedFollowUps = [
        "How many classes can I miss safely?",
        "Why is English attendance at 82.5%?",
        "Show my attendance log for last week"
      ];
    } else if (promptLower.includes("next class") || promptLower.includes("timetable") || promptLower.includes("schedule")) {
      responseText = `📅 **Today's Live Schedule (Grade 11-A)**\n\n* 🟢 **Current Class (10:35 - 11:25 AM):** **Chemistry Lab 2** with Mrs. Sunita Verma\n  * *Topic:* Aldehydes, Ketones and Carboxylic Acids Experiments\n* ⏩ **Next Class (11:30 - 12:20 PM):** **Computer Science** with Ms. Priyanka Sen in Computer Lab 1\n* 🍱 **Lunch Break:** 12:20 PM - 01:00 PM\n* 📚 **Last Period (01:00 - 01:50 PM):** **English Core** in Room 302`;
      contextualActions = [
        { id: "act_tt_tom", label: "🗓️ Tomorrow's Timetable", prompt: "What is my timetable for tomorrow?" },
        { id: "act_tt_cs", label: "💻 Computer Science Prep", prompt: "What topics are we covering in Computer Science today?" }
      ];
      suggestedFollowUps = [
        "What is my schedule for tomorrow?",
        "What room is Computer Science in?",
        "Do I have any lab sessions today?"
      ];
    } else if (promptLower.includes("exam") || promptLower.includes("physics exam") || promptLower.includes("unit test")) {
      responseText = `🎯 **Physics Unit Test II Preparation Breakdown**\n\n* 📅 **Date:** Friday, Aug 21, 2026 (In **6 Days**)\n* ⏰ **Time:** 09:00 AM – 11:00 AM (Room 302)\n* 📊 **Your Current Syllabus Readiness:** **78%**\n\n### High-Yield Chapters:\n1. **Faraday & Lenz's Law:** Mastered ✅\n2. **Self & Mutual Inductance:** ⚠️ *Needs revision (Numerical deriv.)*\n3. **LCR Series Resonance:** ⚠️ *Practice Qs 14-22*\n\nWould you like me to start a **5-minute speed quiz** on Lenz's Law or generate a structured **Revision Schedule**?`;
      contextualActions = [
        { id: "act_quiz_lenz", label: "⚡ Quiz Me on Lenz's Law", prompt: "Start an interactive 5-question quiz on Lenz's Law" },
        { id: "act_plan_phys", label: "📋 Create 5-Day Revision Plan", prompt: "Give me a day-by-day revision plan for Physics Unit Test" },
        { id: "act_doubt_faraday", label: "❓ Explain Mutual Inductance", prompt: "Explain Mutual Inductance step-by-step with formulas" }
      ];
      suggestedFollowUps = [
        "Quiz me on Electromagnetic Induction",
        "Explain Mutual Inductance step-by-step",
        "Show full exam schedule for this month"
      ];
    } else if (promptLower.includes("lenz") || promptLower.includes("quiz")) {
      responseText = `⚡ **Lenz's Law Quick Revision & Concept Check**\n\n**Definition:**\n$$\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}$$\n\nThe negative sign represents **Lenz's Law**: The induced electromotive force (EMF) always produces a magnetic field that **opposes** the change in magnetic flux which caused it.\n\n* **Why it matters:** It is a direct manifestation of the **Conservation of Energy**.\n* *Example:* When you push the North pole of a magnet into a coil, the coil faces you with a North pole to repel the incoming magnet!`;
      contextualActions = [
        { id: "act_quiz_start", label: "📝 Take 3-Question Practice Quiz", prompt: "Quiz me on this topic with 3 multiple choice questions" },
        { id: "act_real_app", label: "🚆 Real World: Maglev & Eddy Brakes", prompt: "How is Lenz's law used in Maglev trains and electromagnetic braking?" }
      ];
      suggestedFollowUps = [
        "How is Lenz's law related to Conservation of Energy?",
        "What are Eddy Currents and how to minimize them?",
        "Give me a formula sheet for Electromagnetism"
      ];
    } else if (promptLower.includes("teacher") || promptLower.includes("talk to") || promptLower.includes("doubt")) {
      responseText = `👨‍🏫 **Direct Teacher Assistance**\n\nI can help explain concepts immediately, but if you require 1-on-1 personal guidance from your faculty:\n\n* **Faculty:** **Dr. Rajesh Sharma** (Physics Senior Department)\n* **Office:** Senior Faculty Room 204\n* **Available Clinic Hours:** Mon-Thu 3:30 PM - 4:30 PM\n\nWould you like me to book a callback or consultation slot for you?`;
      contextualActions = [
        { id: "act_escalate_now", label: "📞 Request Teacher Callback", prompt: "Please request a callback slot with Dr. Rajesh Sharma for me" },
        { id: "act_explain_first", label: "🤖 Explain Doubt First with AI", prompt: "Let me first explain my doubt to you, then decide" }
      ];
      suggestedFollowUps = [
        "Request a callback slot with Dr. Rajesh Sharma",
        "What are Dr. Rajesh Sharma's office hours?",
        "Can you explain the doubt to me first?"
      ];
    } else {
      responseText = `Here is what I found for **"${userPrompt}"**:\n\nI have cross-referenced your **Class 11 Science syllabus, homework submissions, and teacher notes**.\n\n1. **Core Concept:** This topic is part of your upcoming term curriculum.\n2. **Key Takeaway:** Focus on foundational definitions and standard numerical formulas.\n3. **Recommended Next Step:** Practice 2-3 standard NCERT problems.\n\nWould you like me to explain this in **Beginner (simplified)**, **Intermediate (exam-focused)**, or **Advanced** depth?`;
      contextualActions = [
        { id: "act_explain_simp", label: "🌱 Explain Simply (Beginner)", prompt: `Explain "${userPrompt}" in simple beginner terms with real-world analogies` },
        { id: "act_exam_prep", label: "🎯 Exam-Style Summary", prompt: `Give me an exam-ready 5-point summary of "${userPrompt}"` },
        { id: "act_quiz_gen", label: "❓ Quiz Me", prompt: `Generate 3 practice MCQs on "${userPrompt}"` }
      ];
      suggestedFollowUps = [
        "Explain this in simple terms with an example",
        "What are the most common exam questions on this?",
        "Quiz me with 3 practice questions"
      ];
    }

    // Stream out words with realistic typing tempo
    const words = responseText.split(" ");
    let currentText = "";
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? "" : " ") + words[i];
      onChunk(currentText);
      await this.simulateLatency(25);
    }

    onComplete({
      text: responseText,
      contextualActions,
      suggestedFollowUps
    });
  }

  private simulateLatency(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const api = new ApiClient();
