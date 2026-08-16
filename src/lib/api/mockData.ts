import {
  AttendanceRecord,
  DailyAttendance,
  TimetablePeriod,
  Assignment,
  Exam,
  PerformanceSubject,
  NotificationItem,
  QuizQuestion
} from "@/types";

export const MOCK_ATTENDANCE_SUMMARY = {
  overallPercentage: 91.2,
  totalClasses: 216,
  attendedClasses: 197,
  absentClasses: 19,
  lateClasses: 4,
  requiredPercentage: 75.0,
  isEligibleForExams: true,
  status: "safe" as const,
};

export const MOCK_SUBJECT_ATTENDANCE: AttendanceRecord[] = [
  {
    subject: "Physics",
    attendedClasses: 42,
    totalClasses: 45,
    percentage: 93.3,
    lastUpdated: "Today, 10:15 AM",
    status: "safe",
    teacher: "Dr. Rajesh Sharma"
  },
  {
    subject: "Chemistry",
    attendedClasses: 38,
    totalClasses: 43,
    percentage: 88.4,
    lastUpdated: "Yesterday",
    status: "safe",
    teacher: "Mrs. Sunita Verma"
  },
  {
    subject: "Mathematics",
    attendedClasses: 45,
    totalClasses: 48,
    percentage: 93.8,
    lastUpdated: "Today, 11:30 AM",
    status: "safe",
    teacher: "Mr. Anand Joshi"
  },
  {
    subject: "Computer Science",
    attendedClasses: 39,
    totalClasses: 40,
    percentage: 97.5,
    lastUpdated: "Aug 14, 2026",
    status: "safe",
    teacher: "Ms. Priyanka Sen"
  },
  {
    subject: "English Core",
    attendedClasses: 33,
    totalClasses: 40,
    percentage: 82.5,
    lastUpdated: "Aug 13, 2026",
    status: "warning",
    teacher: "Mrs. Ananya Roy"
  }
];

export const MOCK_RECENT_ATTENDANCE_LOG: DailyAttendance[] = [
  { date: "2026-08-15", status: "present", remarks: "All 5 periods attended" },
  { date: "2026-08-14", status: "present", remarks: "All 5 periods attended" },
  { date: "2026-08-13", status: "present", remarks: "All 5 periods attended" },
  { date: "2026-08-12", status: "absent", remarks: "Medical Leave (Approved)" },
  { date: "2026-08-11", status: "present", remarks: "All 5 periods attended" },
  { date: "2026-08-10", status: "present", remarks: "Arrived on time" },
  { date: "2026-08-08", status: "present", remarks: "All 5 periods attended" },
];

export const MOCK_ATTENDANCE_MONTHLY_TREND = [
  { month: "Apr", percentage: 94.0 },
  { month: "May", percentage: 92.5 },
  { month: "Jun", percentage: 95.0 },
  { month: "Jul", percentage: 89.5 },
  { month: "Aug", percentage: 91.2 },
];

export const MOCK_TIMETABLE_TODAY: TimetablePeriod[] = [
  {
    id: "p1",
    periodNumber: 1,
    subject: "Physics",
    teacher: "Dr. Rajesh Sharma",
    room: "Room 302 (Senior Block)",
    startTime: "08:30 AM",
    endTime: "09:20 AM",
    topic: "Faraday's Laws & Lenz's Law Applications"
  },
  {
    id: "p2",
    periodNumber: 2,
    subject: "Mathematics",
    teacher: "Mr. Anand Joshi",
    room: "Room 302",
    startTime: "09:25 AM",
    endTime: "10:15 AM",
    topic: "Integration by Partial Fractions"
  },
  {
    id: "p3",
    periodNumber: 3,
    subject: "Chemistry",
    teacher: "Mrs. Sunita Verma",
    room: "Chemistry Lab 2",
    startTime: "10:35 AM",
    endTime: "11:25 AM",
    isCurrent: true,
    topic: "Aldehydes, Ketones and Carboxylic Acids Lab"
  },
  {
    id: "p4",
    periodNumber: 4,
    subject: "Computer Science",
    teacher: "Ms. Priyanka Sen",
    room: "Computer Lab 1",
    startTime: "11:30 AM",
    endTime: "12:20 PM",
    isNext: true,
    topic: "Data Structures: Stacks and Queues in Python"
  },
  {
    id: "p5",
    periodNumber: 5,
    subject: "English Core",
    teacher: "Mrs. Ananya Roy",
    room: "Room 302",
    startTime: "01:00 PM",
    endTime: "01:50 PM",
    topic: "Poem Analysis: Keeping Quiet"
  }
];

export const MOCK_TIMETABLE_TOMORROW: TimetablePeriod[] = [
  {
    id: "tm1",
    periodNumber: 1,
    subject: "Mathematics",
    teacher: "Mr. Anand Joshi",
    room: "Room 302",
    startTime: "08:30 AM",
    endTime: "09:20 AM",
    topic: "Definite Integrals as Limit of Sum"
  },
  {
    id: "tm2",
    periodNumber: 2,
    subject: "Physics",
    teacher: "Dr. Rajesh Sharma",
    room: "Physics Lab 1",
    startTime: "09:25 AM",
    endTime: "10:15 AM",
    topic: "AC Generator & Transformer Simulation"
  },
  {
    id: "tm3",
    periodNumber: 3,
    subject: "Physical Education",
    teacher: "Coach Vikram Singh",
    room: "Ground / Sports Complex",
    startTime: "10:35 AM",
    endTime: "11:25 AM",
    topic: "Track & Field Form Training"
  },
  {
    id: "tm4",
    periodNumber: 4,
    subject: "Chemistry",
    teacher: "Mrs. Sunita Verma",
    room: "Room 302",
    startTime: "11:30 AM",
    endTime: "12:20 PM",
    topic: "Carboxylic Acid Chemical Properties"
  },
  {
    id: "tm5",
    periodNumber: 5,
    subject: "Computer Science",
    teacher: "Ms. Priyanka Sen",
    room: "Computer Lab 1",
    startTime: "01:00 PM",
    endTime: "01:50 PM",
    topic: "SQL Joins and Group By Queries"
  }
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "asg_1",
    title: "Electromagnetic Induction Problem Set 4",
    subject: "Physics",
    teacher: "Dr. Rajesh Sharma",
    dueDate: "2026-08-18",
    status: "due_soon",
    priority: "urgent",
    estimatedMinutes: 45,
    description: "Solve numerical problems 12 to 24 from NCERT Chapter 6 regarding Mutual Inductance and Eddy Currents.",
    instructions: [
      "Show all formula substitutions clearly with SI units.",
      "Draw neat circuit diagrams for question 16 & 19.",
      "Submit handwritten or scanned PDF before 5:00 PM."
    ]
  },
  {
    id: "asg_2",
    title: "Organic Reaction Mechanisms Chart",
    subject: "Chemistry",
    teacher: "Mrs. Sunita Verma",
    dueDate: "2026-08-20",
    status: "pending",
    priority: "high",
    estimatedMinutes: 60,
    description: "Prepare an A3 summary chart of Nucleophilic Addition Reactions for Carbonyl Compounds.",
    instructions: [
      "Include Aldol Condensation and Cannizzaro Reaction mechanisms.",
      "Highlight electron pushing arrows in contrasting colors."
    ]
  },
  {
    id: "asg_3",
    title: "Definite Integrals Practice Assignment",
    subject: "Mathematics",
    teacher: "Mr. Anand Joshi",
    dueDate: "2026-08-22",
    status: "pending",
    priority: "medium",
    estimatedMinutes: 50,
    description: "Complete miscellaneous exercise problems on properties of definite integrals.",
    instructions: [
      "Verify odd/even function shortcuts where applicable.",
      "Box the final answers clearly."
    ]
  },
  {
    id: "asg_4",
    title: "Python Stack Implementation & Test Cases",
    subject: "Computer Science",
    teacher: "Ms. Priyanka Sen",
    dueDate: "2026-08-14",
    status: "completed",
    priority: "medium",
    estimatedMinutes: 30,
    description: "Implement a LIFO stack in Python using list methods with Push, Pop, Peek, and Display operations.",
    instructions: [
      "Include exception handling for stack underflow."
    ]
  }
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: "ex_1",
    subject: "Physics",
    examName: "Unit Test II (Electromagnetism)",
    date: "2026-08-21",
    startTime: "09:00 AM",
    endTime: "11:00 AM",
    room: "Room 302 (Senior Block)",
    totalMarks: 50,
    daysRemaining: 6,
    preparationStatus: 78,
    syllabusTopics: [
      { topic: "Magnetic Effects of Current & Biot-Savart Law", prepared: true },
      { topic: "Ampere's Circuital Law & Solenoids", prepared: true },
      { topic: "Electromagnetic Induction & Faraday's Laws", prepared: true },
      { topic: "Lenz's Law and Conservation of Energy", prepared: true },
      { topic: "Self & Mutual Inductance Derivations", prepared: false },
      { topic: "Alternating Current & LCR Resonance", prepared: false }
    ]
  },
  {
    id: "ex_2",
    subject: "Chemistry",
    examName: "Mid-Term Evaluation",
    date: "2026-08-28",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    room: "Room 204",
    totalMarks: 70,
    daysRemaining: 13,
    preparationStatus: 52,
    syllabusTopics: [
      { topic: "Solutions & Colligative Properties", prepared: true },
      { topic: "Electrochemistry & Nernst Equation", prepared: true },
      { topic: "Chemical Kinetics Rate Laws", prepared: false },
      { topic: "d and f Block Elements", prepared: false },
      { topic: "Aldehydes and Ketones Mechanisms", prepared: false }
    ]
  },
  {
    id: "ex_3",
    subject: "Mathematics",
    examName: "Calculus Assessment Test",
    date: "2026-09-04",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    room: "Room 108",
    totalMarks: 40,
    daysRemaining: 20,
    preparationStatus: 65,
    syllabusTopics: [
      { topic: "Continuity and Differentiability", prepared: true },
      { topic: "Application of Derivatives (Maxima/Minima)", prepared: true },
      { topic: "Indefinite Integrals Substitution", prepared: true },
      { topic: "Definite Integral Properties", prepared: false }
    ]
  }
];

export const MOCK_PERFORMANCE: PerformanceSubject[] = [
  {
    subject: "Physics",
    score: 92,
    grade: "A1",
    trend: "up",
    classAverage: 74,
    strengths: ["Electromagnetism Concepts", "Numerical Problem Solving", "Lab Practical Work"],
    areasToImprove: ["Mutual Inductance Derivations", "AC Phasor Diagrams"]
  },
  {
    subject: "Mathematics",
    score: 95,
    grade: "A1",
    trend: "up",
    classAverage: 72,
    strengths: ["Differential Calculus", "Trigonometric Identifications", "Calculations Speed"],
    areasToImprove: ["Definite Integrals as Limit of Sum"]
  },
  {
    subject: "Chemistry",
    score: 84,
    grade: "A2",
    trend: "stable",
    classAverage: 76,
    strengths: ["Physical Chemistry (Electrochemistry)", "Solutions and Colligative Laws"],
    areasToImprove: ["Organic Reaction Named Mechanisms (Cannizzaro)", "Inorganic D-Block Trends"]
  },
  {
    subject: "Computer Science",
    score: 98,
    grade: "A1",
    trend: "up",
    classAverage: 81,
    strengths: ["Python Algorithms", "Data Structures", "SQL Query Optimization"],
    areasToImprove: ["Computer Networks Topology Subnetting"]
  },
  {
    subject: "English Core",
    score: 86,
    grade: "A2",
    trend: "up",
    classAverage: 79,
    strengths: ["Creative Writing", "Reading Comprehension"],
    areasToImprove: ["Poetry Metaphor Analysis"]
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    title: "Physics Unit Test in 6 Days",
    message: "Unit Test II on Electromagnetism is scheduled for Friday, Aug 21 at 09:00 AM.",
    category: "exam",
    timestamp: "10 mins ago",
    read: false,
    priority: "urgent",
    actionUrl: "/student/exams"
  },
  {
    id: "notif_2",
    title: "Physics Assignment Due Soon",
    message: "Electromagnetic Induction Problem Set 4 is due in 3 days (Aug 18).",
    category: "assignment",
    timestamp: "1 hour ago",
    read: false,
    priority: "high",
    actionUrl: "/student/assignments"
  },
  {
    id: "notif_3",
    title: "Attendance Safety Update",
    message: "Your attendance this month is 91.2%. Great job staying well above the 75% requirement!",
    category: "attendance",
    timestamp: "Today, 09:00 AM",
    read: false,
    priority: "normal",
    actionUrl: "/student/attendance"
  },
  {
    id: "notif_4",
    title: "Teacher Announcement — Dr. Rajesh Sharma",
    message: "Extra doubt-clearing session for Class 11-A on Transformer numericals tomorrow at 3:30 PM.",
    category: "teacher",
    timestamp: "Yesterday",
    read: true,
    priority: "normal",
    actionUrl: "/student/timetable"
  }
];

export const MOCK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    subject: "Physics",
    difficulty: "intermediate",
    question: "According to Lenz's Law, the polarity of induced EMF is such that it:",
    options: [
      "Aids the change that produces it",
      "Opposes the change in magnetic flux producing it",
      "Is always zero in a closed circuit",
      "Increases with decreased resistance only"
    ],
    correctIndex: 1,
    explanation: "Lenz's law states that the direction of induced EMF always opposes the change in magnetic flux that caused it, in strict agreement with the Law of Conservation of Energy."
  },
  {
    id: "q2",
    subject: "Physics",
    difficulty: "beginner",
    question: "What is the SI unit of Magnetic Flux?",
    options: [
      "Tesla (T)",
      "Weber (Wb)",
      "Henry (H)",
      "Gauss (G)"
    ],
    correctIndex: 1,
    explanation: "The SI unit of Magnetic Flux (Φ) is the Weber (Wb), which equals 1 Tesla · square meter (T·m²)."
  },
  {
    id: "q3",
    subject: "Chemistry",
    difficulty: "intermediate",
    question: "Which of the following compounds will undergo Cannizzaro reaction on treatment with 50% NaOH?",
    options: [
      "Acetaldehyde (CH₃CHO)",
      "Formaldehyde (HCHO)",
      "Acetone (CH₃COCH₃)",
      "Propionaldehyde (CH₃CH₂CHO)"
    ],
    correctIndex: 1,
    explanation: "Formaldehyde lacks alpha-hydrogens (α-H), which is the essential condition to undergo self-oxidation and reduction (Cannizzaro reaction) in concentrated alkali."
  },
  {
    id: "q4",
    subject: "Mathematics",
    difficulty: "intermediate",
    question: "What is the value of ∫ (from -π/2 to π/2) sin⁵(x) dx ?",
    options: [
      "0",
      "1",
      "2",
      "π/2"
    ],
    correctIndex: 0,
    explanation: "sin⁵(x) is an odd function because f(-x) = sin⁵(-x) = -sin⁵(x). The integral of any continuous odd function over symmetric limits [-a, a] is exactly 0."
  },
  {
    id: "q5",
    subject: "Computer Science",
    difficulty: "beginner",
    question: "Which data structure follows the LIFO (Last In First Out) principle?",
    options: [
      "Queue",
      "Stack",
      "Binary Search Tree",
      "Linked List"
    ],
    correctIndex: 1,
    explanation: "A Stack strictly operates on Last In First Out (LIFO), where elements are pushed and popped from the same top end."
  }
];
