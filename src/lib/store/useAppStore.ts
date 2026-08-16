import { create } from "zustand";
import {
  UserRole,
  LanguageCode,
  UserProfile,
  AvatarState,
  VoiceState,
  ChatMessage,
  EscalationRequest
} from "@/types";
import { TRANSLATIONS } from "@/lib/i18n/translations";

export const MOCK_PROFILES: Record<UserRole, UserProfile> = {
  student: {
    id: "stu_101",
    name: "Siva",
    role: "student",
    grade: "Grade 11",
    section: "Section A (Science)",
    schoolName: "Delhi Public School, R.K. Puram",
    studentId: "DPS-2026-1184",
    email: "siva.kumar@dps.edu.in",
  },
  parent: {
    id: "par_201",
    name: "Meera (Mother of Siva)",
    role: "parent",
    schoolName: "Delhi Public School, R.K. Puram",
    email: "meera.kumar@gmail.com",
  },
  teacher: {
    id: "tch_301",
    name: "Dr. Rajesh Sharma",
    role: "teacher",
    grade: "Physics Faculty — Senior Wing",
    schoolName: "Delhi Public School, R.K. Puram",
    email: "r.sharma@dps.edu.in",
  },
  management: {
    id: "mgt_401",
    name: "Dr. K. Rao (Principal)",
    role: "management",
    schoolName: "Delhi Public School, R.K. Puram",
    email: "principal@dps.edu.in",
  }
};

interface AppState {
  currentRole: UserRole;
  currentLanguage: LanguageCode;
  userProfile: UserProfile;
  theme: "dark" | "light";
  avatarState: AvatarState;
  voiceState: VoiceState;
  isVoiceModalOpen: boolean;
  isEscalationModalOpen: boolean;
  escalationContext: { subject: string; teacherName: string; reason?: string } | null;
  escalations: EscalationRequest[];
  chatMessages: ChatMessage[];
  unreadNotificationsCount: number;

  // Actions
  setRole: (role: UserRole) => void;
  setLanguage: (lang: LanguageCode) => void;
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;
  setAvatarState: (state: AvatarState) => void;
  setVoiceState: (state: VoiceState) => void;
  openVoiceModal: () => void;
  closeVoiceModal: () => void;
  openEscalationModal: (context?: { subject: string; teacherName: string; reason?: string }) => void;
  closeEscalationModal: () => void;
  addChatMessage: (msg: ChatMessage) => void;
  updateLastMessage: (updater: (prev: ChatMessage) => ChatMessage) => void;
  clearChat: () => void;
  createEscalationRequest: (req: Omit<EscalationRequest, "id" | "createdAt" | "status">) => Promise<EscalationRequest>;
  t: (key: string) => string;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentRole: "student",
  currentLanguage: "en",
  userProfile: MOCK_PROFILES.student,
  theme: "dark",
  avatarState: "idle",
  voiceState: "idle",
  isVoiceModalOpen: false,
  isEscalationModalOpen: false,
  escalationContext: null,
  escalations: [
    {
      id: "ESC-8921",
      studentName: "Siva",
      subject: "Physics",
      teacherName: "Dr. Rajesh Sharma",
      reason: "Doubt in Electromagnetic Induction derivation for upcoming Aug 21 exam",
      priority: "urgent",
      status: "scheduled",
      createdAt: "2026-08-14T14:30:00Z",
      scheduledSlot: "Tomorrow, 3:30 PM (Room 302)"
    }
  ],
  chatMessages: [
    {
      id: "welcome_1",
      sender: "ai",
      text: "👋 **Hello Siva!** I'm XYZ AI, your personal academic companion.\n\nHere is your quick summary for today:\n* 📅 **Next class:** Physics at 10:15 AM (Room 302)\n* 📊 **Overall Attendance:** **91.2%** (Well above the 75% requirement)\n* 📝 **3 Assignments** pending (Physics due this Friday)\n* 🎯 **Next Exam:** Physics Unit Test on **Aug 21**\n\nHow can I help you excel today?",
      timestamp: new Date().toISOString(),
      contextualActions: [
        { id: "act_att", label: "📊 Check Attendance", prompt: "How is my attendance in each subject?" },
        { id: "act_exam", label: "🎯 Prep for Physics Exam", prompt: "Create a 5-day study plan for my upcoming Physics Unit Test on Aug 21" },
        { id: "act_assign", label: "📝 Pending Homework Help", prompt: "Explain the questions in my pending Physics Magnetism assignment" },
      ],
      suggestedFollowUps: [
        "What is my next class?",
        "Quiz me on Electromagnetic Induction",
        "Am I safe in attendance for all subjects?",
        "Talk to my Physics teacher"
      ]
    }
  ],
  unreadNotificationsCount: 3,

  setRole: (role: UserRole) => {
    set({
      currentRole: role,
      userProfile: MOCK_PROFILES[role]
    });
  },

  setLanguage: (lang: LanguageCode) => {
    set({ currentLanguage: lang });
  },

  setTheme: (theme: "dark" | "light") => {
    set({ theme });
    if (typeof document !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  },

  toggleTheme: () => {
    const nextTheme = get().theme === "dark" ? "light" : "dark";
    get().setTheme(nextTheme);
  },

  setAvatarState: (avatarState: AvatarState) => set({ avatarState }),
  setVoiceState: (voiceState: VoiceState) => set({ voiceState }),

  openVoiceModal: () => set({ isVoiceModalOpen: true, voiceState: "idle", avatarState: "idle" }),
  closeVoiceModal: () => set({ isVoiceModalOpen: false, voiceState: "idle", avatarState: "idle" }),

  openEscalationModal: (context) => set({
    isEscalationModalOpen: true,
    escalationContext: context || {
      subject: "Physics",
      teacherName: "Dr. Rajesh Sharma",
      reason: "Needs clarification on complex topic"
    }
  }),
  closeEscalationModal: () => set({ isEscalationModalOpen: false, escalationContext: null }),

  addChatMessage: (msg: ChatMessage) => {
    set((state) => ({
      chatMessages: [...state.chatMessages, msg]
    }));
  },

  updateLastMessage: (updater) => {
    set((state) => {
      const messages = [...state.chatMessages];
      if (messages.length === 0) return state;
      const lastIndex = messages.length - 1;
      messages[lastIndex] = updater(messages[lastIndex]);
      return { chatMessages: messages };
    });
  },

  clearChat: () => {
    set({
      chatMessages: [
        {
          id: `welcome_${Date.now()}`,
          sender: "ai",
          text: "👋 Chat reset. What would you like to explore or practice now?",
          timestamp: new Date().toISOString(),
          suggestedFollowUps: [
            "What is today's timetable?",
            "Explain Newton's Laws with real world examples",
            "Quiz me on Math Calculus"
          ]
        }
      ]
    });
  },

  createEscalationRequest: async (reqData) => {
    // Simulate backend network round-trip delay to ensure the UI NEVER falsely confirms prematurely
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const newRequest: EscalationRequest = {
      ...reqData,
      id: `ESC-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "submitted",
      createdAt: new Date().toISOString(),
      notes: "Teacher notified. You will receive an SMS and app alert when confirmed."
    };

    set((state) => ({
      escalations: [newRequest, ...state.escalations]
    }));

    return newRequest;
  },

  t: (key: string) => {
    const lang = get().currentLanguage;
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
  }
}));
