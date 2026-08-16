export type UserRole = "student" | "parent" | "teacher" | "management";

export type LanguageCode =
  | "en"
  | "hi"
  | "te"
  | "ta"
  | "mr"
  | "bn"
  | "gu"
  | "pa"
  | "kn"
  | "ml"
  | "ur";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  grade?: string;
  section?: string;
  schoolName: string;
  studentId?: string;
  email: string;
}

export type AvatarState = "idle" | "listening" | "thinking" | "speaking" | "happy" | "alert";

export type VoiceState = "idle" | "listening" | "processing" | "speaking" | "error";

export interface ContextualAction {
  id: string;
  label: string;
  prompt: string;
  icon?: string;
  category?: "academic" | "study" | "support" | "navigation";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "system";
  text: string;
  timestamp: string;
  provider?: string;
  contextualActions?: ContextualAction[];
  suggestedFollowUps?: string[];
  cards?: {
    type: "attendance" | "timetable" | "assignment" | "exam" | "escalation" | "quiz";
    data: any;
  }[];
  isStreaming?: boolean;
  audioUrl?: string;
  feedback?: "helpful" | "unhelpful" | null;
}

export interface AttendanceRecord {
  subject: string;
  attendedClasses: number;
  totalClasses: number;
  percentage: number;
  lastUpdated: string;
  status: "safe" | "warning" | "danger";
  teacher: string;
}

export interface DailyAttendance {
  date: string;
  status: "present" | "absent" | "late" | "holiday";
  remarks?: string;
}

export interface TimetablePeriod {
  id: string;
  periodNumber: number;
  subject: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  isCurrent?: boolean;
  isNext?: boolean;
  topic?: string;
}

export type AssignmentStatus = "pending" | "due_soon" | "completed" | "overdue";
export type PriorityLevel = "low" | "medium" | "high" | "urgent";

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  dueDate: string;
  status: AssignmentStatus;
  priority: PriorityLevel;
  description: string;
  instructions?: string[];
  estimatedMinutes?: number;
  submissionLink?: string;
}

export interface Exam {
  id: string;
  subject: string;
  examName: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  totalMarks: number;
  syllabusTopics: { topic: string; prepared: boolean }[];
  preparationStatus: number; // 0 to 100%
  daysRemaining: number;
}

export interface PerformanceSubject {
  subject: string;
  score: number;
  grade: string;
  trend: "up" | "down" | "stable";
  classAverage: number;
  strengths: string[];
  areasToImprove: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "assignment" | "exam" | "attendance" | "announcement" | "teacher";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority?: "normal" | "high" | "urgent";
}

export interface EscalationRequest {
  id: string;
  studentName: string;
  subject: string;
  teacherName: string;
  reason: string;
  priority: "normal" | "urgent";
  status: "submitted" | "acknowledged" | "scheduled" | "resolved";
  createdAt: string;
  scheduledSlot?: string;
  notes?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}
