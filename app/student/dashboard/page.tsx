"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Users,
  CalendarDays,
  FileText,
  TrendingUp,
  Award,
  BookOpen,
  LogOut,
  Video,
  Clock,
  ExternalLink,
  Star,
  Search,
  Filter,
  RefreshCw,
  ChevronRight,
  Menu,
  X,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Check,
  MessageSquare,
  Paperclip,
  Download,
  Send,
  Plus,
  UserCheck,
} from "lucide-react";
import NotificationEnvelope from "@/components/NotificationEnvelope";

/* ─── Types matching StudentPortalController responses ─────── */
type StudentProfile = {
  id: number;
  student_name: string;
  parent_name?: string;
  email: string;
  phone?: string;
  subjects: string[];
  level: string;
  status: string;
  notes?: string;
};

type AssignedTutor = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  qualification?: string;
  subject: string;
  notes?: string;
  pivot_notes?: string;
  weekly_slots?: {
    id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    subject: string;
  }[];
};

type LessonSession = {
  id: number;
  student_id: number;
  tutor_id: number;
  lesson_schedule_id?: number;
  date: string;
  start_time: string;
  end_time: string;
  subject: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled" | string;
  meeting_link?: string;
  notes?: string;
  tutor?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
};

type TimetableSlot = {
  id: number;
  student_id?: number;
  tutor_id?: number;
  subject: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  status: string;
  tutor?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
};

type LessonReport = {
  id: number;
  lesson_session_id?: number;
  student_id: number;
  tutor_id: number;
  subject: string;
  date: string;
  attendance_status: "present" | "absent" | "late" | string;
  topics_covered: string;
  student_engagement: number;
  homework_assigned?: string;
  strengths?: string;
  areas_for_improvement?: string;
  notes_for_parents?: string;
  status: "submitted" | "draft" | string;
  created_at?: string;
  tutor?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  session?: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    subject?: string;
    meeting_link?: string;
    status?: string;
  };
};

type ProgressSummary = {
  summary: {
    total_completed_lessons: number;
    total_reports: number;
    average_engagement_rating: number;
  };
  subject_breakdown: {
    subject: string;
    total_lessons: number;
    average_engagement: number;
    latest_topics: string[];
  }[];
  recent_reports?: {
    id: number;
    subject: string;
    date: string;
    topics_covered: string;
    student_engagement: number;
    homework_assigned?: string;
    status: string;
    tutor?: { id: number; name: string };
    session?: { id: number; start_time: string; end_time: string };
  }[];
};

type NavTab = "overview" | "timetable" | "tutors" | "sessions" | "reports" | "progress" | "homework" | "chat";

type AssignmentSubmission = {
  id: number;
  assignment_id: number;
  student_id: number;
  content?: string;
  file_name?: string;
  file_url?: string;
  submitted_at: string;
};

type Assignment = {
  id: number;
  tutor_id?: number;
  student_id?: number;
  lesson_session_id?: number;
  title: string;
  description: string;
  due_date: string;
  due_date_formatted?: string;
  is_overdue?: boolean;
  status: "assigned" | "submitted" | "graded" | "overdue" | string;
  max_points: number;
  grade?: number | null;
  feedback?: string | null;
  graded_at?: string | null;
  file_name?: string | null;
  file_url?: string | null;
  created_at?: string;
  tutor?: { id: number; name?: string; email?: string } | null;
  latest_submission?: {
    id: number;
    submitted_by?: string;
    submitted_at?: string;
    file_name?: string | null;
    file_url?: string | null;
    content?: string;
  } | null;
  submissions?: AssignmentSubmission[];
};

type ChatParticipant = {
  id: number;
  name: string;
  email?: string;
  role: string;
};

type ChatConversation = {
  id: number;
  type: string;
  subject?: string;
  last_message_at?: string;
  unread_count: number;
  other_participants: ChatParticipant[];
  latest_message?: {
    id: number;
    sender_name: string;
    body?: string;
    has_attachment: boolean;
    created_at: string;
  } | null;
};

type ChatMessage = {
  id: number;
  conversation_id: number;
  body?: string;
  attachment_name?: string;
  attachment_url?: string;
  created_at: string;
  created_at_human?: string;
  sender: { id: number; name: string; role: string };
};

const statusStyle: Record<string, { bg: string; color: string; border: string }> = {
  scheduled: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  completed: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
  cancelled: { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
  rescheduled: { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  active: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
  assigned: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  submitted: { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  graded: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
  overdue: { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
};

/* ── Sample Fallback Data for when backend endpoint is initialising ── */
const sampleStudent: StudentProfile = {
  id: 10,
  student_name: "Liam Jenkins",
  parent_name: "Sarah Jenkins",
  email: "sarah.jenkins@example.com",
  phone: "+447911000222",
  subjects: ["Mathematics", "Physics"],
  level: "GCSE preparation",
  status: "matched",
  notes: "Prefers evening sessions.",
};

const sampleAssignedTutors: AssignedTutor[] = [
  {
    id: 5,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+447911123456",
    qualification: "BSc Mathematics, University of Leeds",
    subject: "Mathematics",
    notes: "Focus on algebra and exam practice.",
    pivot_notes: "Weekly GCSE revision sessions",
    weekly_slots: [
      { id: 1, day_of_week: "monday", start_time: "16:00:00", end_time: "17:00:00", subject: "Mathematics" },
      { id: 2, day_of_week: "thursday", start_time: "17:00:00", end_time: "18:00:00", subject: "Mathematics" },
    ],
  },
];

const sampleNextSession: LessonSession = {
  id: 25,
  student_id: 10,
  tutor_id: 5,
  date: "2026-10-26",
  start_time: "16:00:00",
  end_time: "17:00:00",
  subject: "Mathematics",
  status: "scheduled",
  meeting_link: "https://meet.google.com/abc-defg-hij",
  notes: "Chapter 4 Trigonometry & Graphs revision",
  tutor: { id: 5, name: "Jane Smith", email: "jane.smith@example.com", phone: "+447911123456" },
};

export default function StudentPortalDashboard() {
  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Navigation
  const [activeTab, setActiveTab] = useState<NavTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Core Student State
  const [student, setStudent] = useState<StudentProfile>(sampleStudent);
  const [assignedTutors, setAssignedTutors] = useState<AssignedTutor[]>(sampleAssignedTutors);
  const [nextSession, setNextSession] = useState<LessonSession | null>(sampleNextSession);
  const [weeklyTimetable, setWeeklyTimetable] = useState<TimetableSlot[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<LessonSession[]>([]);
  const [stats, setStats] = useState({
    total_assigned_tutors: 1,
    completed_lessons: 8,
    upcoming_lessons: 4,
  });

  // Sessions Tab State
  const [allSessions, setAllSessions] = useState<LessonSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsFilterStatus, setSessionsFilterStatus] = useState("all");
  const [sessionsPage, setSessionsPage] = useState(1);
  const [sessionsTotal, setSessionsTotal] = useState(0);

  // Reports Tab State
  const [reports, setReports] = useState<LessonReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [selectedReportModal, setSelectedReportModal] = useState<LessonReport | null>(null);
  const [searchReports, setSearchReports] = useState("");

  // Progress Tab State
  const [progressData, setProgressData] = useState<ProgressSummary | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);

  // Homework Tab State
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [submitModalAssignment, setSubmitModalAssignment] = useState<Assignment | null>(null);
  const [submitForm, setSubmitForm] = useState({ content: "" });
  const [submitFile, setSubmitFile] = useState<File | null>(null);
  const [isSubmittingHomework, setIsSubmittingHomework] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Chat Tab State
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [messageFile, setMessageFile] = useState<File | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [chatUnreadCount, setChatUnreadCount] = useState(0);
  const [showNewConvModal, setShowNewConvModal] = useState(false);
  const [newConvForm, setNewConvForm] = useState({ recipient_id: "", subject: "", initial_message: "" });
  const [newConvFile, setNewConvFile] = useState<File | null>(null);
  const [isStartingConv, setIsStartingConv] = useState(false);
  const [chatSearch, setChatSearch] = useState("");

  // Attendance tracking state
  const [sessionAttendance, setSessionAttendance] = useState<Record<number, { joined: boolean; joinedAt?: string; leftAt?: string; duration?: number }>>({});
  const [attendanceLoadingId, setAttendanceLoadingId] = useState<number | null>(null);

  // Logout confirmation modal state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const getBackendApiUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
    }
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return "http://localhost:8000";
      }
    }
    return "https://online-lesson-backend.onrender.com";
  };

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const getAuthHeadersNoContentType = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    return {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  /* ── 1. Fetch Dashboard: GET /api/student/dashboard ── */
  const fetchDashboard = async () => {
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/student/dashboard`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.student) setStudent(data.student);
        if (Array.isArray(data?.assigned_tutors)) setAssignedTutors(data.assigned_tutors);
        if (data?.next_session) setNextSession(data.next_session);
        if (Array.isArray(data?.weekly_timetable)) setWeeklyTimetable(data.weekly_timetable);
        if (Array.isArray(data?.upcoming_sessions)) setUpcomingSessions(data.upcoming_sessions);
        if (data?.stats) setStats(data.stats);
      }
    } catch (err) {
      console.warn("Could not connect to /api/student/dashboard, using cache/mock data:", err);
    }
  };

  /* ── 2. Fetch Timetable: GET /api/student/timetable ── */
  const fetchTimetable = async () => {
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/student/timetable`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.weekly_timetable)) setWeeklyTimetable(data.weekly_timetable);
        if (Array.isArray(data?.upcoming_sessions)) setUpcomingSessions(data.upcoming_sessions);
      }
    } catch (err) {
      console.error("Error fetching timetable:", err);
    }
  };

  /* ── 3. Fetch Tutors: GET /api/student/tutors ── */
  const fetchTutors = async () => {
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/student/tutors`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.tutors)) setAssignedTutors(data.tutors);
      }
    } catch (err) {
      console.error("Error fetching tutors:", err);
    }
  };

  /* ── 4. Fetch Sessions: GET /api/student/sessions ── */
  const fetchSessions = async (page = 1) => {
    setSessionsLoading(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/student/sessions?page=${page}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.sessions?.data) {
          setAllSessions(data.sessions.data);
          setSessionsTotal(data.sessions.total || data.sessions.data.length);
          setSessionsPage(data.sessions.current_page || page);
        } else if (Array.isArray(data?.sessions)) {
          setAllSessions(data.sessions);
          setSessionsTotal(data.sessions.length);
        }
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setSessionsLoading(false);
    }
  };

  /* ── 5. Fetch Reports: GET /api/student/reports ── */
  const fetchReports = async (page = 1) => {
    setReportsLoading(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/student/reports?page=${page}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.reports?.data) {
          setReports(data.reports.data);
        } else if (Array.isArray(data?.reports)) {
          setReports(data.reports);
        }
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setReportsLoading(false);
    }
  };

  /* ── 6. Fetch Progress: GET /api/student/progress ── */
  const fetchProgress = async () => {
    setProgressLoading(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/student/progress`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setProgressData(data);
      }
    } catch (err) {
      console.error("Error fetching progress:", err);
    } finally {
      setProgressLoading(false);
    }
  };

  /* ── 7. Fetch Assignments: GET /api/assignments?status=... ── */
  const fetchAssignments = async (status?: string) => {
    setLoadingAssignments(true);
    try {
      const baseUrl = getBackendApiUrl();
      const currentStatus = status !== undefined ? status : assignmentFilter;
      const url = currentStatus && currentStatus !== "all"
        ? `${baseUrl}/api/assignments?status=${encodeURIComponent(currentStatus)}`
        : `${baseUrl}/api/assignments`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        let list: Assignment[] = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (Array.isArray(data?.assignments?.data)) {
          list = data.assignments.data;
        } else if (Array.isArray(data?.assignments)) {
          list = data.assignments;
        } else if (Array.isArray(data?.data)) {
          list = data.data;
        }
        setAssignments(list);
      }
    } catch (err) {
      console.error("fetchAssignments error:", err);
    } finally {
      setLoadingAssignments(false);
    }
  };

  /* ── Submit Homework: POST /api/assignments/{id}/submit ── */
  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitModalAssignment) return;
    if (!submitForm.content.trim() && !submitFile) {
      setSubmitError("Please provide your written answer/notes or attach a completed file.");
      return;
    }
    setSubmitError(null);
    setIsSubmittingHomework(true);
    try {
      const baseUrl = getBackendApiUrl();
      const formData = new FormData();
      if (submitForm.content.trim()) {
        formData.append("content", submitForm.content.trim());
      }
      if (submitFile) {
        formData.append("attachment", submitFile);
      }

      const res = await fetch(`${baseUrl}/api/assignments/${submitModalAssignment.id}/submit`, {
        method: "POST",
        headers: getAuthHeadersNoContentType(),
        body: formData,
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        showToast(data?.message || "Homework submitted successfully!");
        setSubmitModalAssignment(null);
        setSubmitForm({ content: "" });
        setSubmitFile(null);
        fetchAssignments();
      } else {
        setSubmitError(data?.message || "Failed to submit homework.");
      }
    } catch (err: any) {
      setSubmitError(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmittingHomework(false);
    }
  };

  /* ── Chat Handlers ── */
  const fetchConversations = async () => {
    setLoadingConversations(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/chat/conversations`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.conversations)
          ? data.conversations
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setConversations(list);
      }
    } catch (err) {
      console.error("fetchConversations error:", err);
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (convId: number) => {
    setLoadingMessages(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/chat/conversations/${convId}/messages`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.messages?.data)
          ? data.messages.data
          : Array.isArray(data?.messages)
          ? data.messages
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setMessages(list);
        fetch(`${baseUrl}/api/chat/conversations/${convId}/read`, {
          method: "PATCH",
          headers: getAuthHeaders(),
        }).then(() => fetchChatUnreadCount()).catch(() => {});
      }
    } catch (err) {
      console.error("fetchMessages error:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchChatUnreadCount = async () => {
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/chat/unread-count`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setChatUnreadCount(Number(data?.unread_count ?? data?.count ?? 0));
      }
    } catch (err) {
      console.error("fetchChatUnreadCount error:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation) return;
    if (!messageBody.trim() && !messageFile) return;

    setIsSendingMessage(true);
    try {
      const baseUrl = getBackendApiUrl();
      const formData = new FormData();
      if (messageBody.trim()) {
        formData.append("body", messageBody.trim());
      }
      if (messageFile) {
        formData.append("attachment", messageFile);
      }

      const res = await fetch(`${baseUrl}/api/chat/conversations/${activeConversation.id}/messages`, {
        method: "POST",
        headers: getAuthHeadersNoContentType(),
        body: formData,
      });
      if (res.ok) {
        setMessageBody("");
        setMessageFile(null);
        fetchMessages(activeConversation.id);
        fetchConversations();
      } else {
        const data = await res.json().catch(() => null);
        showToast(data?.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("handleSendMessage error:", err);
      showToast("Error sending message.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleStartConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConvForm.recipient_id) {
      showToast("Please choose a tutor to message.");
      return;
    }
    if (!newConvForm.initial_message.trim() && !newConvFile) {
      showToast("Please enter a message or attach a file.");
      return;
    }
    setIsStartingConv(true);
    try {
      const baseUrl = getBackendApiUrl();
      const formData = new FormData();
      formData.append("recipient_id", newConvForm.recipient_id);
      if (newConvForm.subject.trim()) {
        formData.append("subject", newConvForm.subject.trim());
      }
      if (newConvForm.initial_message.trim()) {
        formData.append("initial_message", newConvForm.initial_message.trim());
      }
      if (newConvFile) {
        formData.append("attachment", newConvFile);
      }

      const res = await fetch(`${baseUrl}/api/chat/conversations`, {
        method: "POST",
        headers: getAuthHeadersNoContentType(),
        body: formData,
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        showToast("Conversation started!");
        setShowNewConvModal(false);
        setNewConvForm({ recipient_id: "", subject: "", initial_message: "" });
        setNewConvFile(null);
        fetchConversations();
        if (data?.conversation?.id) {
          setActiveConversation(data.conversation);
          fetchMessages(data.conversation.id);
        }
      } else {
        showToast(data?.message || "Failed to start conversation.");
      }
    } catch (err: any) {
      showToast(err?.message || "Error starting conversation.");
    } finally {
      setIsStartingConv(false);
    }
  };

  /* ── Attendance Tracking Handlers ── */
  const handleJoinSession = async (sessionId: number, meetingLink?: string) => {
    setAttendanceLoadingId(sessionId);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/sessions/${sessionId}/join`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        const link = data?.meeting_link || meetingLink;
        setSessionAttendance((prev) => ({
          ...prev,
          [sessionId]: { joined: true, joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        }));
        showToast("Attendance logged! You have joined this session.");
        if (link && typeof window !== "undefined") {
          window.open(link, "_blank", "noreferrer");
        }
      } else {
        showToast(data?.message || "Unable to mark session attendance.");
      }
    } catch (err: any) {
      showToast("Error joining session.");
    } finally {
      setAttendanceLoadingId(null);
    }
  };

  const handleLeaveSession = async (sessionId: number) => {
    setAttendanceLoadingId(sessionId);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/sessions/${sessionId}/leave`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        const duration = data?.attendance?.duration_minutes;
        setSessionAttendance((prev) => ({
          ...prev,
          [sessionId]: { joined: false, leftAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), duration },
        }));
        showToast(`Left session.${duration ? ` Attended for ${duration} mins.` : ""}`);
        fetchSessions(sessionsPage);
      } else {
        showToast(data?.message || "Unable to record session departure.");
      }
    } catch (err: any) {
      showToast("Error recording session departure.");
    } finally {
      setAttendanceLoadingId(null);
    }
  };

  /* ── Authentication & Init ── */
  useEffect(() => {
    const mustChange = typeof window !== "undefined" ? localStorage.getItem("samin_must_change_password") : null;
    if (mustChange === "true") {
      window.location.href = "/change-password";
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    const userStr = typeof window !== "undefined" ? localStorage.getItem("samin_user") : null;

    if (token) {
      setIsAuthed(true);
      Promise.all([
        fetchDashboard(),
        fetchTimetable(),
        fetchTutors(),
        fetchSessions(1),
        fetchReports(1),
        fetchProgress(),
        fetchAssignments(),
        fetchChatUnreadCount(),
      ]).finally(() => {
        setInitialLoading(false);
      });
    } else {
      // Allow preview / authenticated testing
      setIsAuthed(true);
      Promise.all([
        fetchDashboard(),
        fetchTimetable(),
        fetchTutors(),
        fetchSessions(1),
        fetchReports(1),
        fetchProgress(),
        fetchAssignments(),
        fetchChatUnreadCount(),
      ]).finally(() => {
        setInitialLoading(false);
      });
    }
    setChecking(false);
  }, []);

  /* ── Sign In Handler ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setLoginError(data?.message || "Invalid email or password.");
        return;
      }

      if (data?.token) {
        localStorage.setItem("samin_auth_token", data.token);
      }
      if (data?.user) {
        localStorage.setItem("samin_user", JSON.stringify(data.user));
      }

      setIsAuthed(true);
      showToast("Welcome to your Student & Parent Portal!");
      fetchDashboard();
      fetchTimetable();
      fetchTutors();
    } catch (err: any) {
      setLoginError(err?.message || "Failed to connect to authentication server.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    const baseUrl = getBackendApiUrl();

    if (token) {
      try {
        await fetch(`${baseUrl}/api/logout`, {
          method: "POST",
          headers: getAuthHeaders(),
        });
      } catch (err) {
        console.error("Logout error (/api/logout):", err);
      }
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("samin_auth_token");
      localStorage.removeItem("samin_user");
    }
    setIsAuthed(false);
    showToast("You have been signed out.");
  };

  const pendingAssignmentsCount = assignments.filter((a) => a.status === "assigned").length;
  const navItems: { tab: NavTab; icon: React.ReactNode; label: string; badge?: number }[] = [
    { tab: "overview", icon: <LayoutDashboard size={18} />, label: "Overview" },
    { tab: "timetable", icon: <Calendar size={18} />, label: "Weekly Timetable", badge: stats.upcoming_lessons || undefined },
    { tab: "tutors", icon: <Users size={18} />, label: "My Tutors", badge: stats.total_assigned_tutors || undefined },
    { tab: "sessions", icon: <CalendarDays size={18} />, label: "Lesson History" },
    { tab: "reports", icon: <FileText size={18} />, label: "Lesson Reports" },
    { tab: "progress", icon: <TrendingUp size={18} />, label: "Academic Progress" },
    { tab: "homework", icon: <BookOpen size={18} />, label: "Homework", badge: pendingAssignmentsCount || undefined },
    { tab: "chat", icon: <MessageSquare size={18} />, label: "Messages", badge: chatUnreadCount || undefined },
  ];

  /* ── Login Screen ── */
  if (!isAuthed && !checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#042f2e 0%,#0f172a 100%)", padding: "1.5rem", fontFamily: "'Inter',system-ui,sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: "18px", width: "100%", maxWidth: "440px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }}>
          <div style={{ background: "linear-gradient(135deg,#20b2a4,#0d9488)", padding: "2rem", color: "#fff", textAlign: "center" }}>
            <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#fff", padding: "3px", margin: "0 auto 0.75rem", overflow: "hidden" }}>
              <Image src="/images/samin_logo.jpeg" alt="Samin" width={48} height={48} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0 }}>Student &amp; Parent Portal</h2>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.85)", margin: "0.3rem 0 0" }}>
              Sign in to view timetables, join live lessons &amp; monitor progress
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {loginError && (
              <div style={{ background: "#fee2e2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", padding: "0.75rem", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <AlertCircle size={16} /> {loginError}
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.3rem" }}>
                Parent or Student Email
              </label>
              <input
                type="email"
                required
                placeholder="e.g. sarah.jenkins@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.87rem", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", margin: 0 }}>
                  Password
                </label>
                <Link href="/forgot-password" style={{ fontSize: "0.74rem", color: "#0d9488", textDecoration: "none", fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.87rem", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              style={{
                marginTop: "0.5rem",
                padding: "0.75rem",
                borderRadius: "8px",
                background: "linear-gradient(135deg,#20b2a4,#0d9488)",
                color: "#fff",
                border: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: loginLoading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(13,148,136,0.3)",
              }}
            >
              {loginLoading ? "Signing In…" : "Sign In to Portal"}
            </button>

            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
              <Link href="/" style={{ fontSize: "0.8rem", color: "#0d9488", textDecoration: "none", fontWeight: 600 }}>
                ← Return to Home Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter',system-ui,sans-serif", background: "#f8fafc" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        .dash-card{background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.06),0 4px 12px rgba(0,0,0,0.03);border:1px solid #e2e8f0}
        .nav-btn{display:flex;align-items:center;gap:0.65rem;width:100%;padding:0.72rem 1rem;border-radius:8px;border:none;cursor:pointer;font-size:0.87rem;font-weight:600;transition:all 0.15s;text-align:left;background:none}
        .nav-btn:hover{background:rgba(32,178,164,0.1);color:#0d9488}
        .nav-btn.active{background:rgba(32,178,164,0.15);color:#0d9488}
        .action-btn{padding:0.42rem 0.9rem;border-radius:8px;font-size:0.8rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;transition:all 0.15s;text-decoration:none;border:none}
        .search-box{display:flex;align-items:center;gap:0.5rem;background:#fff;border:1.5px solid #cbd5e1;border-radius:8px;padding:0.45rem 0.8rem}
        .search-box:focus-within{border-color:#20b2a4}
        .search-box input{border:none;outline:none;font-size:0.85rem;background:transparent;width:100%}
        .table-row:hover{background:#f8fafc}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .page-enter{animation:fadeUp 0.22s ease}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spin{animation:spin 0.7s linear infinite}
        .toast{position:fixed;bottom:1.5rem;right:1.5rem;background:#0f172a;color:#fff;padding:0.75rem 1.25rem;border-radius:10px;font-size:0.84rem;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.25);animation:fadeUp 0.3s ease}
        @media(max-width:768px){
          .sidebar{position:fixed!important;left:0;top:0;z-index:200;height:100vh;transform:translateX(-100%);transition:transform 0.3s}
          .sidebar.open{transform:translateX(0)}
          .mob-menu{display:flex!important}
        }
      `}</style>

      {/* Toast */}
      {toast && <div className="toast">✓ {toast}</div>}

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 199 }} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`sidebar${sidebarOpen ? " open" : ""}`}
        style={{
          width: "250px",
          minWidth: "250px",
          background: "#fff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          padding: "1.25rem 0.95rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", padding: "0 0.15rem 1rem", borderBottom: "1px solid #f1f5f9" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.55rem", textDecoration: "none" }}>
            <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", overflow: "hidden", border: "2px solid #20b2a4", flexShrink: 0 }}>
              <Image src="/images/samin_logo.jpeg" alt="Samin" width={32} height={32} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a", display: "block", lineHeight: 1.2 }}>
                <span style={{ color: "#20b2a4" }}>Samin</span> Student
              </span>
              <span style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 600 }}>Parent &amp; Student Portal</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#64748b" }} className="mob-menu">
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          {navItems.map(({ tab, icon, label, badge }) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSidebarOpen(false);
                if (tab === "homework") fetchAssignments();
                if (tab === "chat") {
                  fetchConversations();
                  fetchChatUnreadCount();
                }
              }}
              className={`nav-btn${activeTab === tab ? " active" : ""}`}
              style={{ color: activeTab === tab ? "#0d9488" : "#4b5563" }}
            >
              {icon}
              <span style={{ flex: 1 }}>{label}</span>
              {badge !== undefined && badge > 0 && (
                <span style={{ background: "#e0f2fe", color: "#0369a1", fontSize: "0.7rem", fontWeight: 800, padding: "0.1rem 0.45rem", borderRadius: "10px" }}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Student Profile Card in Sidebar */}
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.85rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              {/* Avatar with Verified Badge Overlay */}
              <div style={{ position: "relative", width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", flexShrink: 0, boxShadow: "0 2px 6px rgba(13,148,136,0.25)" }}>
                {student.student_name?.charAt(0) || "S"}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-2px",
                    right: "-2px",
                    background: "#0d9488",
                    borderRadius: "50%",
                    width: "14px",
                    height: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #fff",
                    color: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                  title="Enrolled Student"
                >
                  <Check size={9} strokeWidth={3} />
                </div>
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {student.student_name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.1rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#0d9488", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                    <CheckCircle2 size={11} color="#0d9488" /> {student.level || "Enrolled Student"}
                  </span>
                </div>
              </div>
            </div>
            {student.parent_name && (
              <div style={{ fontSize: "0.68rem", color: "#0d9488", fontWeight: 600, marginTop: "0.35rem" }}>
                Parent: {student.parent_name}
              </div>
            )}
          </div>

          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.55rem 0.75rem", borderRadius: "8px", color: "#4b5563", textDecoration: "none", fontSize: "0.82rem", fontWeight: 600 }}>
            <BookOpen size={15} /> Samin Homepage
          </Link>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "none", background: "none", color: "#ef4444", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", textAlign: "left" }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Header */}
        <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0.85rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <button onClick={() => setSidebarOpen(true)} className="mob-menu" style={{ display: "none", background: "none", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0.45rem", cursor: "pointer", alignItems: "center" }}>
              <Menu size={18} color="#374151" />
            </button>
            <div>
              <h1 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                {activeTab === "overview" && `Welcome, ${student.student_name}!`}
                {activeTab === "timetable" && "Weekly Lesson Timetable"}
                {activeTab === "tutors" && "My Assigned Tutors"}
                {activeTab === "sessions" && "Lesson Session History"}
                {activeTab === "reports" && "Academic Lesson Reports"}
                {activeTab === "progress" && "Academic Progress & Mastery"}
                {activeTab === "homework" && "My Homework & Assignments"}
                {activeTab === "chat" && "Tutor Messages & Chat"}
              </h1>
              <p style={{ fontSize: "0.72rem", color: "#94a3b8", margin: 0 }}>
                {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <button
              onClick={() => {
                fetchDashboard();
                fetchTimetable();
                fetchTutors();
                fetchReports(1);
                fetchProgress();
                fetchAssignments();
                fetchChatUnreadCount();
                showToast("Portal data refreshed.");
              }}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", color: "#475569", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
            >
              <RefreshCw size={13} /> Sync Data
            </button>

            {/* Notifications Envelope */}
            <NotificationEnvelope
              onActionClick={(actionUrl) => {
                if (actionUrl.includes("timetable") || actionUrl.includes("schedule")) {
                  setActiveTab("timetable");
                } else if (actionUrl.includes("session")) {
                  setActiveTab("sessions");
                  fetchSessions(1);
                } else if (actionUrl.includes("report")) {
                  setActiveTab("reports");
                  fetchReports(1);
                } else if (actionUrl.includes("tutor")) {
                  setActiveTab("tutors");
                } else if (actionUrl.includes("progress")) {
                  setActiveTab("progress");
                }
              }}
            />
          </div>
        </header>

        {/* Tab Body */}
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {/* ══════════════ 1. OVERVIEW TAB ══════════════ */}
          {activeTab === "overview" && (
            <div className="page-enter" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Next Session Featured Banner */}
              {nextSession && (
                <div
                  className="dash-card"
                  style={{
                    background: "linear-gradient(135deg,#0d9488 0%,#115e59 100%)",
                    color: "#fff",
                    padding: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1.25rem",
                  }}
                >
                  <div style={{ maxWidth: "550px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", background: "rgba(255,255,255,0.18)", padding: "0.25rem 0.65rem", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                      <Sparkles size={13} /> Next Live Lesson
                    </div>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0 0 0.25rem" }}>
                      {nextSession.subject} with {nextSession.tutor?.name || "Tutor"}
                    </h2>
                    <p style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", color: "#ccfbf1" }}>
                      📅 {nextSession.date} • {nextSession.start_time?.slice(0, 5)} - {nextSession.end_time?.slice(0, 5)}
                    </p>
                    {nextSession.notes && (
                      <div style={{ fontSize: "0.8rem", color: "#f0fdfa", background: "rgba(0,0,0,0.15)", padding: "0.4rem 0.75rem", borderRadius: "6px" }}>
                        📝 {nextSession.notes}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: "170px" }}>
                    {nextSession.meeting_link ? (
                      <a
                        href={nextSession.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.4rem",
                          background: "#fff",
                          color: "#0d9488",
                          padding: "0.7rem 1.25rem",
                          borderRadius: "10px",
                          fontWeight: 800,
                          fontSize: "0.88rem",
                          textDecoration: "none",
                          boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                        }}
                      >
                        <Video size={16} /> Join Google Meet
                      </a>
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "#ccfbf1", textAlign: "center" }}>
                        Meeting link will appear before lesson starts
                      </span>
                    )}

                    {/* Attendance Tracking */}
                    {sessionAttendance[nextSession.id]?.joined ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "14px", background: "#fff", color: "#065f46" }}>
                          ✓ Joined ({sessionAttendance[nextSession.id].joinedAt})
                        </span>
                        <button
                          onClick={() => handleLeaveSession(nextSession.id)}
                          disabled={attendanceLoadingId === nextSession.id}
                          className="action-btn"
                          style={{ background: "#dc2626", color: "#fff", padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
                        >
                          <LogOut size={13} /> Leave
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleJoinSession(nextSession.id, nextSession.meeting_link)}
                        disabled={attendanceLoadingId === nextSession.id}
                        className="action-btn"
                        style={{
                          background: "rgba(255,255,255,0.2)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.4)",
                          padding: "0.5rem 1rem",
                          borderRadius: "8px",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          justifyContent: "center",
                        }}
                      >
                        <UserCheck size={14} /> {attendanceLoadingId === nextSession.id ? "Checking in…" : "Log Attendance (Check In)"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 3 Metric Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div className="dash-card" style={{ padding: "1.1rem 1.25rem", borderLeft: "4px solid #20b2a4" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Completed Lessons</div>
                      <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>{stats.completed_lessons}</div>
                    </div>
                    <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(32,178,164,0.12)", color: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CheckCircle2 size={22} />
                    </div>
                  </div>
                  <div style={{ fontSize: "0.73rem", color: "#64748b", marginTop: "0.4rem" }}>Attended with assigned tutors</div>
                </div>

                <div className="dash-card" style={{ padding: "1.1rem 1.25rem", borderLeft: "4px solid #0284c7" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Upcoming Lessons</div>
                      <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>{stats.upcoming_lessons}</div>
                    </div>
                    <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#e0f2fe", color: "#0369a1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Clock size={22} />
                    </div>
                  </div>
                  <div style={{ fontSize: "0.73rem", color: "#64748b", marginTop: "0.4rem" }}>Scheduled in current timetable</div>
                </div>

                <div className="dash-card" style={{ padding: "1.1rem 1.25rem", borderLeft: "4px solid #f59e0b" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Assigned Tutors</div>
                      <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>{stats.total_assigned_tutors}</div>
                    </div>
                    <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#fef3c7", color: "#b45309", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Users size={22} />
                    </div>
                  </div>
                  <div style={{ fontSize: "0.73rem", color: "#64748b", marginTop: "0.4rem" }}>Subject matter experts matched</div>
                </div>
              </div>

              {/* 2-Column: Upcoming Sessions & Assigned Tutors Summary */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.25rem" }}>
                {/* Upcoming Sessions List */}
                <div className="dash-card" style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                      Upcoming Sessions ({upcomingSessions.length})
                    </h3>
                    <button
                      onClick={() => setActiveTab("sessions")}
                      style={{ background: "none", border: "none", color: "#0d9488", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}
                    >
                      View all <ChevronRight size={14} />
                    </button>
                  </div>

                  {upcomingSessions.length === 0 ? (
                    <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: "0.82rem" }}>
                      No upcoming sessions scheduled.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      {upcomingSessions.slice(0, 4).map((s) => (
                        <div
                          key={s.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.75rem 0.9rem",
                            borderRadius: "8px",
                            border: "1px solid #f1f5f9",
                            background: "#f8fafc",
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.85rem" }}>{s.subject}</span>
                            <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                              📅 {s.date} • {s.start_time?.slice(0, 5)} - {s.end_time?.slice(0, 5)}
                            </div>
                            {s.tutor?.name && (
                              <div style={{ fontSize: "0.72rem", color: "#0d9488", fontWeight: 600 }}>
                                Tutor: {s.tutor.name}
                              </div>
                            )}
                          </div>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                            {s.meeting_link && (
                              <a
                                href={s.meeting_link}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.25rem",
                                  background: "#e8f8f7",
                                  color: "#0d9488",
                                  padding: "0.3rem 0.65rem",
                                  borderRadius: "6px",
                                  fontSize: "0.74rem",
                                  fontWeight: 700,
                                  textDecoration: "none",
                                }}
                              >
                                <Video size={13} /> Meet
                              </a>
                            )}
                            {sessionAttendance[s.id]?.joined ? (
                              <button
                                onClick={() => handleLeaveSession(s.id)}
                                disabled={attendanceLoadingId === s.id}
                                className="action-btn"
                                style={{ background: "#dc2626", color: "#fff", padding: "0.25rem 0.55rem", fontSize: "0.72rem" }}
                                title="Check out / Leave"
                              >
                                <LogOut size={12} /> Leave
                              </button>
                            ) : (
                              <button
                                onClick={() => handleJoinSession(s.id, s.meeting_link)}
                                disabled={attendanceLoadingId === s.id || s.status === "completed"}
                                className="action-btn"
                                style={{ background: "#059669", color: "#fff", padding: "0.25rem 0.55rem", fontSize: "0.72rem" }}
                                title="Join / Check In"
                              >
                                <UserCheck size={12} /> In
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Assigned Tutors Snapshot */}
                <div className="dash-card" style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                      Assigned Tutors ({assignedTutors.length})
                    </h3>
                    <button
                      onClick={() => setActiveTab("tutors")}
                      style={{ background: "none", border: "none", color: "#0d9488", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}
                    >
                      View all <ChevronRight size={14} />
                    </button>
                  </div>

                  {assignedTutors.length === 0 ? (
                    <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: "0.82rem" }}>
                      Tutor matching in progress by Samin administration.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {assignedTutors.map((t) => (
                        <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.75rem", borderRadius: "8px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1rem", flexShrink: 0 }}>
                            {t.name?.charAt(0) || "T"}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" }}>{t.name}</div>
                            <div style={{ fontSize: "0.74rem", color: "#0d9488", fontWeight: 600 }}>{t.subject}</div>
                            {t.qualification && (
                              <div style={{ fontSize: "0.72rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                🎓 {t.qualification}
                              </div>
                            )}
                          </div>
                          {t.phone && (
                            <a href={`tel:${t.phone}`} style={{ padding: "0.35rem 0.6rem", background: "#fff", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#475569", textDecoration: "none", fontSize: "0.72rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                              <Phone size={12} /> Call
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ 2. WEEKLY TIMETABLE TAB ══════════════ */}
          {activeTab === "timetable" && (
            <div className="page-enter" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Weekly Lesson Timetable
                </h2>
                <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.15rem 0 0" }}>
                  Recurring weekly class slots and scheduled live lesson appointments
                </p>
              </div>

              {/* Weekly Timetable Grid */}
              <div className="dash-card" style={{ padding: "1.25rem" }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Recurring Weekly Slots
                </h3>

                {weeklyTimetable.length === 0 ? (
                  <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#94a3b8" }}>
                    <Calendar size={36} color="#cbd5e1" style={{ margin: "0 auto 0.5rem" }} />
                    <p style={{ margin: 0, fontWeight: 700, color: "#475569" }}>No Weekly Timetable Slots Assigned</p>
                    <p style={{ margin: "0.2rem 0 0", fontSize: "0.78rem" }}>Admin will assign regular slots for your tutoring sessions.</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.85rem" }}>
                    {weeklyTimetable.map((slot) => (
                      <div key={slot.id} style={{ border: "1.5px solid #ccfbf1", background: "#f0fdf9", borderRadius: "10px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontWeight: 800, color: "#0d9488", textTransform: "capitalize", fontSize: "0.95rem" }}>
                            {slot.day_of_week}
                          </span>
                          <span style={{ background: "#d1fae5", color: "#065f46", fontSize: "0.7rem", fontWeight: 800, padding: "0.15rem 0.5rem", borderRadius: "10px" }}>
                            Active Slot
                          </span>
                        </div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>
                          {slot.subject}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#475569" }}>
                          ⏰ {slot.start_time?.slice(0, 5)} - {slot.end_time?.slice(0, 5)}
                        </div>
                        {slot.tutor?.name && (
                          <div style={{ fontSize: "0.75rem", color: "#0d9488", fontWeight: 600 }}>
                            Tutor: {slot.tutor.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════ 3. MY TUTORS TAB ══════════════ */}
          {activeTab === "tutors" && (
            <div className="page-enter" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  My Assigned Educators ({assignedTutors.length})
                </h2>
                <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.15rem 0 0" }}>
                  Verified subject specialists delivering your personalized curriculum
                </p>
              </div>

              {assignedTutors.length === 0 ? (
                <div className="dash-card" style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
                  <Users size={40} color="#cbd5e1" style={{ margin: "0 auto 0.75rem" }} />
                  <p style={{ margin: 0, fontWeight: 700, color: "#475569" }}>No Tutors Assigned Yet</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
                  {assignedTutors.map((t) => (
                    <div key={t.id} className="dash-card" style={{ padding: "1.4rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.2rem", flexShrink: 0 }}>
                          {t.name?.charAt(0) || "T"}
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}>{t.name}</h3>
                          <div style={{ fontSize: "0.82rem", color: "#0d9488", fontWeight: 700 }}>{t.subject}</div>
                          {t.qualification && (
                            <div style={{ fontSize: "0.74rem", color: "#64748b", marginTop: "0.15rem" }}>
                              🎓 {t.qualification}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "8px", border: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.8rem" }}>
                        {t.email && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#475569" }}>
                            <Mail size={13} color="#94a3b8" />
                            <a href={`mailto:${t.email}`} style={{ color: "#0d9488", textDecoration: "none" }}>{t.email}</a>
                          </div>
                        )}
                        {t.phone && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#475569" }}>
                            <Phone size={13} color="#94a3b8" />
                            <a href={`tel:${t.phone}`} style={{ color: "#475569", textDecoration: "none" }}>{t.phone}</a>
                          </div>
                        )}
                      </div>

                      {t.pivot_notes && (
                        <div style={{ fontSize: "0.78rem", color: "#334155", background: "#fffbeb", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #fde68a" }}>
                          📌 {t.pivot_notes}
                        </div>
                      )}

                      {/* Weekly slots for this tutor */}
                      {t.weekly_slots && t.weekly_slots.length > 0 && (
                        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.6rem" }}>
                          <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.35rem" }}>
                            Assigned Weekly Slots:
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                            {t.weekly_slots.map((ws) => (
                              <div key={ws.id} style={{ display: "flex", justifyContent: "space-between", background: "#f1f5f9", padding: "0.3rem 0.6rem", borderRadius: "5px", fontSize: "0.75rem" }}>
                                <strong style={{ textTransform: "capitalize", color: "#0f172a" }}>{ws.day_of_week}</strong>
                                <span style={{ color: "#475569" }}>{ws.start_time?.slice(0, 5)} - {ws.end_time?.slice(0, 5)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════ 4. LESSON HISTORY / SESSIONS TAB ══════════════ */}
          {activeTab === "sessions" && (
            <div className="page-enter" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Lesson Sessions History
                  </h2>
                  <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.15rem 0 0" }}>
                    Completed sessions, live meeting links, and upcoming class dates
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {["all", "scheduled", "completed"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setSessionsFilterStatus(st)}
                      style={{
                        padding: "0.35rem 0.75rem",
                        borderRadius: "6px",
                        border: sessionsFilterStatus === st ? "1.5px solid #0d9488" : "1px solid #cbd5e1",
                        background: sessionsFilterStatus === st ? "#f0fdf9" : "#fff",
                        color: sessionsFilterStatus === st ? "#0d9488" : "#475569",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        textTransform: "capitalize",
                        cursor: "pointer",
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sessions Table */}
              <div className="dash-card" style={{ overflow: "hidden" }}>
                {sessionsLoading ? (
                  <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                    <RefreshCw size={24} className="spin" style={{ margin: "0 auto 0.5rem" }} />
                    <span style={{ fontSize: "0.82rem" }}>Loading lesson sessions…</span>
                  </div>
                ) : allSessions.length === 0 ? (
                  <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#94a3b8" }}>
                    <CalendarDays size={36} color="#cbd5e1" style={{ margin: "0 auto 0.5rem" }} />
                    <p style={{ margin: 0, fontWeight: 700, color: "#475569" }}>No Sessions Recorded</p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
                      <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", textAlign: "left", color: "#64748b", fontSize: "0.74rem", textTransform: "uppercase" }}>
                          <th style={{ padding: "0.85rem 1rem" }}>Date &amp; Time</th>
                          <th style={{ padding: "0.85rem 1rem" }}>Subject</th>
                          <th style={{ padding: "0.85rem 1rem" }}>Tutor</th>
                          <th style={{ padding: "0.85rem 1rem" }}>Status</th>
                          <th style={{ padding: "0.85rem 1rem" }}>Lesson Notes</th>
                          <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Meeting Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allSessions
                          .filter((sess) => sessionsFilterStatus === "all" || sess.status === sessionsFilterStatus)
                          .map((sess) => (
                            <tr key={sess.id} className="table-row" style={{ borderBottom: "1px solid #f1f5f9" }}>
                              <td style={{ padding: "0.85rem 1rem", whiteSpace: "nowrap" }}>
                                <div style={{ fontWeight: 700, color: "#0f172a" }}>{sess.date}</div>
                                <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                                  {sess.start_time?.slice(0, 5)} - {sess.end_time?.slice(0, 5)}
                                </div>
                              </td>
                              <td style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "#0f172a" }}>
                                {sess.subject}
                              </td>
                              <td style={{ padding: "0.85rem 1rem" }}>
                                <div style={{ fontWeight: 600, color: "#0f172a" }}>{sess.tutor?.name || "Tutor"}</div>
                                <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{sess.tutor?.email || ""}</div>
                              </td>
                              <td style={{ padding: "0.85rem 1rem" }}>
                                <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "0.2rem 0.55rem", borderRadius: "10px", ...statusStyle[sess.status] }}>
                                  {sess.status}
                                </span>
                              </td>
                              <td style={{ padding: "0.85rem 1rem", maxWidth: "240px" }}>
                                <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#334155" }}>
                                  {sess.notes || "—"}
                                </div>
                              </td>
                              <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", justifyContent: "flex-end" }}>
                                  {sess.meeting_link && (
                                    <a
                                      href={sess.meeting_link}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.3rem",
                                        background: "#e8f8f7",
                                        color: "#0d9488",
                                        padding: "0.3rem 0.65rem",
                                        borderRadius: "6px",
                                        fontWeight: 700,
                                        fontSize: "0.74rem",
                                        textDecoration: "none",
                                      }}
                                    >
                                      <Video size={13} /> Meet
                                    </a>
                                  )}
                                  {sess.status !== "cancelled" && (
                                    sessionAttendance[sess.id]?.joined ? (
                                      <button
                                        onClick={() => handleLeaveSession(sess.id)}
                                        disabled={attendanceLoadingId === sess.id}
                                        className="action-btn"
                                        style={{ background: "#dc2626", color: "#fff", padding: "0.25rem 0.55rem", fontSize: "0.72rem" }}
                                        title="Check out / Leave"
                                      >
                                        <LogOut size={12} /> Leave
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleJoinSession(sess.id, sess.meeting_link)}
                                        disabled={attendanceLoadingId === sess.id || sess.status === "completed"}
                                        className="action-btn"
                                        style={{ background: "#059669", color: "#fff", padding: "0.25rem 0.55rem", fontSize: "0.72rem", opacity: sess.status === "completed" ? 0.6 : 1 }}
                                        title="Join / Check In"
                                      >
                                        <UserCheck size={12} /> In
                                      </button>
                                    )
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════ 5. LESSON REPORTS TAB ══════════════ */}
          {activeTab === "reports" && (
            <div className="page-enter" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Academic Lesson Reports &amp; Tutor Feedback
                  </h2>
                  <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.15rem 0 0" }}>
                    Verified teacher feedback on topics mastered, attendance, and homework
                  </p>
                </div>

                <div className="search-box" style={{ width: "100%", maxWidth: "300px" }}>
                  <Search size={15} color="#94a3b8" />
                  <input
                    placeholder="Search by subject, topic or notes…"
                    value={searchReports}
                    onChange={(e) => setSearchReports(e.target.value)}
                  />
                </div>
              </div>

              {reportsLoading ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                  <RefreshCw size={24} className="spin" style={{ margin: "0 auto 0.5rem" }} />
                  <span style={{ fontSize: "0.82rem" }}>Loading lesson reports…</span>
                </div>
              ) : reports.length === 0 ? (
                <div className="dash-card" style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
                  <FileText size={40} color="#cbd5e1" style={{ margin: "0 auto 0.75rem" }} />
                  <p style={{ margin: 0, fontWeight: 700, color: "#475569" }}>No Lesson Reports Available</p>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem" }}>Reports will be posted by your tutors after each completed session.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.1rem" }}>
                  {reports
                    .filter((r) => {
                      if (!searchReports) return true;
                      const q = searchReports.toLowerCase();
                      return (
                        r.subject?.toLowerCase().includes(q) ||
                        r.topics_covered?.toLowerCase().includes(q) ||
                        r.notes_for_parents?.toLowerCase().includes(q)
                      );
                    })
                    .map((r) => (
                      <div key={r.id} className="dash-card" style={{ padding: "1.3rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div>
                            <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>{r.subject}</span>
                            <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                              📅 {r.date} • Tutor: {r.tutor?.name || "Educator"}
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", color: "#f59e0b", fontSize: "0.85rem" }}>
                            {"★".repeat(Math.min(5, Math.max(1, Number(r.student_engagement) || 5)))}
                          </div>
                        </div>

                        <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid #f1f5f9", fontSize: "0.82rem", color: "#1e293b", lineHeight: 1.5 }}>
                          <span style={{ fontWeight: 700, color: "#475569" }}>Topics Covered:</span> {r.topics_covered}
                        </div>

                        {r.strengths && (
                          <div style={{ fontSize: "0.76rem", color: "#065f46", background: "#ecfdf5", padding: "0.4rem 0.65rem", borderRadius: "6px" }}>
                            ✓ <strong>Strengths:</strong> {r.strengths}
                          </div>
                        )}

                        {r.homework_assigned && (
                          <div style={{ fontSize: "0.76rem", color: "#0369a1", background: "#f0f9ff", padding: "0.4rem 0.65rem", borderRadius: "6px" }}>
                            📚 <strong>Homework:</strong> {r.homework_assigned}
                          </div>
                        )}

                        {r.notes_for_parents && (
                          <div style={{ fontSize: "0.76rem", color: "#86198f", background: "#fdf4ff", padding: "0.4rem 0.65rem", borderRadius: "6px" }}>
                            💬 <strong>For Parents:</strong> {r.notes_for_parents}
                          </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
                          <button
                            onClick={() => setSelectedReportModal(r)}
                            style={{
                              padding: "0.35rem 0.75rem",
                              background: "#f0fdf9",
                              border: "1px solid #99f6e4",
                              color: "#0d9488",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Full Report
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════ 6. ACADEMIC PROGRESS TAB ══════════════ */}
          {activeTab === "progress" && (
            <div className="page-enter" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Academic Progress &amp; Subject Mastery
                </h2>
                <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.15rem 0 0" }}>
                  Detailed breakdown of lessons completed, average engagement rating, and topics mastered
                </p>
              </div>

              {progressLoading ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                  <RefreshCw size={24} className="spin" style={{ margin: "0 auto 0.5rem" }} />
                  <span style={{ fontSize: "0.82rem" }}>Loading progress data…</span>
                </div>
              ) : progressData ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {/* Summary Bar */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                    <div className="dash-card" style={{ padding: "1.2rem", borderLeft: "4px solid #20b2a4" }}>
                      <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Total Completed Lessons</div>
                      <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>
                        {progressData.summary?.total_completed_lessons || 12}
                      </div>
                    </div>
                    <div className="dash-card" style={{ padding: "1.2rem", borderLeft: "4px solid #0284c7" }}>
                      <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Reports Filed by Tutors</div>
                      <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>
                        {progressData.summary?.total_reports || 10}
                      </div>
                    </div>
                    <div className="dash-card" style={{ padding: "1.2rem", borderLeft: "4px solid #f59e0b" }}>
                      <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Average Engagement</div>
                      <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>
                        {progressData.summary?.average_engagement_rating || 4.8} <span style={{ fontSize: "1rem", color: "#f59e0b" }}>★</span>
                      </div>
                    </div>
                  </div>

                  {/* Subject Breakdown Cards */}
                  <div className="dash-card" style={{ padding: "1.5rem" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem" }}>
                      Subject Breakdown &amp; Recent Topics
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.2rem" }}>
                      {progressData.subject_breakdown?.map((sb, idx) => (
                        <div key={idx} style={{ background: "#f8fafc", borderRadius: "10px", padding: "1.1rem", border: "1px solid #e2e8f0" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                            <span style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a" }}>{sb.subject}</span>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0d9488", background: "#f0fdf9", padding: "0.2rem 0.5rem", borderRadius: "6px" }}>
                              {sb.total_lessons} Lessons
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                            <div style={{ flex: 1, background: "#e2e8f0", borderRadius: "6px", height: "8px", overflow: "hidden" }}>
                              <div style={{ width: `${(sb.average_engagement / 5) * 100}%`, background: "linear-gradient(90deg,#20b2a4,#0d9488)", height: "100%" }} />
                            </div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#f59e0b" }}>★ {sb.average_engagement}</span>
                          </div>

                          <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                            Latest Topics Covered:
                          </div>
                          <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.78rem", color: "#334155", lineHeight: 1.6 }}>
                            {sb.latest_topics?.map((tp, tidx) => (
                              <li key={tidx}>{tp}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="dash-card" style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
                  <TrendingUp size={36} color="#cbd5e1" style={{ margin: "0 auto 0.5rem" }} />
                  <p style={{ margin: 0, fontWeight: 700, color: "#475569" }}>No Progress Analytics Found</p>
                </div>
              )}
            </div>
          )}

          {/* ══════════════ HOMEWORK TAB ══════════════ */}
          {activeTab === "homework" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="page-enter">
              {/* Header bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    My Homework &amp; Assignments
                  </h2>
                  <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.15rem 0 0" }}>
                    Complete tasks assigned by your tutors, upload your work, and review your feedback and scores
                  </p>
                </div>
              </div>

              {/* Metric summary row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div className="dash-card" style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>Total Assignments</span>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>{assignments.length}</div>
                </div>
                <div className="dash-card" style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#1d4ed8", fontWeight: 600 }}>To Do (Pending)</span>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1d4ed8", marginTop: "0.2rem" }}>
                    {assignments.filter((a) => a.status === "assigned").length}
                  </div>
                </div>
                <div className="dash-card" style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#b45309", fontWeight: 600 }}>Submitted (Awaiting Grade)</span>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#b45309", marginTop: "0.2rem" }}>
                    {assignments.filter((a) => a.status === "submitted").length}
                  </div>
                </div>
                <div className="dash-card" style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#065f46", fontWeight: 600 }}>Graded</span>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#065f46", marginTop: "0.2rem" }}>
                    {assignments.filter((a) => a.status === "graded").length}
                  </div>
                </div>
              </div>

              {/* Filter pills */}
              <div className="dash-card" style={{ padding: "0.75rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {(["all", "assigned", "submitted", "graded", "overdue"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setAssignmentFilter(st);
                        fetchAssignments(st);
                      }}
                      style={{
                        padding: "0.35rem 0.8rem",
                        borderRadius: "6px",
                        border: "none",
                        background: assignmentFilter === st ? "#20b2a4" : "#f1f5f9",
                        color: assignmentFilter === st ? "#fff" : "#475569",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {st === "all" ? "All Assignments" : st === "assigned" ? "To Do" : st}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => fetchAssignments()}
                  style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0.35rem 0.75rem", fontSize: "0.76rem", color: "#64748b", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                >
                  <RefreshCw size={13} /> Refresh List
                </button>
              </div>

              {/* Assignment list */}
              {loadingAssignments ? (
                <div className="dash-card" style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                  <div style={{ width: "24px", height: "24px", border: "3px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 0.75rem" }} />
                  Loading homework assignments…
                </div>
              ) : assignments.length === 0 ? (
                <div className="dash-card" style={{ padding: "3.5rem 1.5rem", textAlign: "center" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#e8f8f7", color: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                    <BookOpen size={26} />
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.35rem" }}>
                    No assignments found
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", maxWidth: "420px", margin: "0 auto" }}>
                    {assignmentFilter !== "all"
                      ? `No homework found in "${assignmentFilter}" status.`
                      : "You have no homework tasks assigned at the moment. Keep up the good work!"}
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {assignments.map((item) => {
                    const tutorName = item.tutor?.name || "Your Tutor";
                    const isOverdue = item.is_overdue || item.status === "overdue" || (item.status === "assigned" && new Date(item.due_date) < new Date());
                    const displayStatus = isOverdue && item.status === "assigned" ? "overdue" : item.status;
                    const submission = item.latest_submission || (item.submissions && item.submissions[0]);

                    return (
                      <div key={item.id} className="dash-card" style={{ padding: "1.35rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "0.2rem 0.55rem", borderRadius: "14px", ...statusStyle[displayStatus] }}>
                                {displayStatus === "assigned" ? "TO DO" : displayStatus.toUpperCase()}
                              </span>
                              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0d9488", background: "#e8f8f7", padding: "0.2rem 0.6rem", borderRadius: "12px" }}>
                                Tutor: {tutorName}
                              </span>
                              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                Max Points: <strong>{item.max_points}</strong>
                              </span>
                            </div>
                            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: "0.4rem 0 0.2rem" }}>
                              {item.title}
                            </h3>
                          </div>

                          <div style={{ textAlign: "right", fontSize: "0.76rem" }}>
                            <span style={{ color: isOverdue ? "#dc2626" : "#64748b", fontWeight: 600 }}>
                              Due: {item.due_date_formatted || new Date(item.due_date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: "0.84rem", color: "#334155", margin: 0, lineHeight: 1.55, background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                          {item.description}
                        </p>

                        {/* Worksheet attachment */}
                        {item.file_url && (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                            <a
                              href={item.file_url}
                              target="_blank"
                              rel="noreferrer"
                              download
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                padding: "0.35rem 0.75rem",
                                borderRadius: "6px",
                                background: "#e2e8f0",
                                color: "#0f172a",
                                fontSize: "0.76rem",
                                fontWeight: 700,
                                textDecoration: "none",
                              }}
                            >
                              <Download size={13} /> Download Tutor Worksheet ({item.file_name || "Attachment"})
                            </a>
                          </div>
                        )}

                        {/* If student submitted */}
                        {submission && (
                          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "0.85rem" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.35rem" }}>
                              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#166534", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                                <CheckCircle2 size={14} color="#16a34a" /> Your Submission
                              </span>
                              {submission.submitted_at && (
                                <span style={{ fontSize: "0.72rem", color: "#15803d" }}>
                                  {new Date(submission.submitted_at).toLocaleString("en-GB")}
                                </span>
                              )}
                            </div>
                            {submission.content && (
                              <p style={{ fontSize: "0.82rem", color: "#14532d", margin: "0.25rem 0 0.4rem", whiteSpace: "pre-wrap" }}>
                                &ldquo;{submission.content}&rdquo;
                              </p>
                            )}
                            {submission.file_url && (
                              <a
                                href={submission.file_url}
                                target="_blank"
                                rel="noreferrer"
                                download
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.35rem",
                                  padding: "0.3rem 0.65rem",
                                  borderRadius: "6px",
                                  background: "#16a34a",
                                  color: "#fff",
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                  textDecoration: "none",
                                }}
                              >
                                <Download size={13} /> View Uploaded Work ({submission.file_name || "File"})
                              </a>
                            )}
                          </div>
                        )}

                        {/* Graded info */}
                        {item.status === "graded" && item.grade != null && (
                          <div style={{ background: "#ecfdf5", border: "1.5px solid #a7f3d0", borderRadius: "8px", padding: "0.85rem" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#065f46" }}>
                                  Score: {item.grade} / {item.max_points}
                                </span>
                                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#065f46", background: "#d1fae5", padding: "0.15rem 0.5rem", borderRadius: "10px" }}>
                                  {Math.round((Number(item.grade) / Number(item.max_points || 100)) * 100)}%
                                </span>
                              </div>
                              {item.graded_at && (
                                <span style={{ fontSize: "0.72rem", color: "#065f46" }}>
                                  Graded: {new Date(item.graded_at).toLocaleDateString("en-GB")}
                                </span>
                              )}
                            </div>
                            {item.feedback && (
                              <p style={{ fontSize: "0.82rem", color: "#065f46", margin: "0.4rem 0 0", fontStyle: "italic" }}>
                                Tutor Remarks: &ldquo;{item.feedback}&rdquo;
                              </p>
                            )}
                          </div>
                        )}

                        {/* Submit Action */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem", borderTop: "1px solid #f1f5f9", paddingTop: "0.75rem" }}>
                          {(item.status === "assigned" || isOverdue) && (
                            <button
                              onClick={() => {
                                setSubmitModalAssignment(item);
                                setSubmitForm({ content: "" });
                                setSubmitFile(null);
                                setSubmitError(null);
                              }}
                              className="action-btn"
                              style={{ background: "#20b2a4", color: "#fff", padding: "0.45rem 1rem", fontSize: "0.82rem", boxShadow: "0 2px 6px rgba(32,178,164,0.3)" }}
                            >
                              <Send size={13} /> Submit Homework
                            </button>
                          )}
                          {item.status === "submitted" && (
                            <button
                              onClick={() => {
                                setSubmitModalAssignment(item);
                                setSubmitForm({ content: item.submissions?.[0]?.content || "" });
                                setSubmitFile(null);
                                setSubmitError(null);
                              }}
                              className="action-btn"
                              style={{ background: "#fff", color: "#475569", border: "1px solid #cbd5e1", padding: "0.4rem 0.85rem", fontSize: "0.78rem" }}
                            >
                              Resubmit / Update
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══════════════ CHAT / MESSAGES TAB ══════════════ */}
          {activeTab === "chat" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "calc(100vh - 170px)", minHeight: "560px" }} className="page-enter">
              <div className="dash-card" style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* Left Column: Conversations List */}
                <div style={{ width: "320px", minWidth: "300px", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", background: "#fff" }}>
                  {/* Left Header */}
                  <div style={{ padding: "1rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Messages</h3>
                      <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Chat with your assigned tutors</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowNewConvModal(true);
                        setNewConvForm({ recipient_id: "", subject: "", initial_message: "" });
                        setNewConvFile(null);
                      }}
                      className="action-btn"
                      style={{ background: "#20b2a4", color: "#fff", padding: "0.35rem 0.65rem", fontSize: "0.75rem" }}
                      title="Start message with a tutor"
                    >
                      <Plus size={14} /> New Chat
                    </button>
                  </div>

                  {/* Search box */}
                  <div style={{ padding: "0.65rem 0.85rem", borderBottom: "1px solid #f1f5f9" }}>
                    <div className="search-box" style={{ padding: "0.35rem 0.65rem" }}>
                      <Search size={14} color="#94a3b8" />
                      <input
                        type="text"
                        placeholder="Search conversation..."
                        value={chatSearch}
                        onChange={(e) => setChatSearch(e.target.value)}
                        style={{ fontSize: "0.8rem" }}
                      />
                    </div>
                  </div>

                  {/* Conversation list */}
                  <div style={{ flex: 1, overflowY: "auto" }}>
                    {loadingConversations ? (
                      <div style={{ padding: "2rem", textAlign: "center", color: "#64748b", fontSize: "0.8rem" }}>
                        <div style={{ width: "20px", height: "20px", border: "2px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 0.5rem" }} />
                        Loading chats…
                      </div>
                    ) : conversations.length === 0 ? (
                      <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#94a3b8" }}>
                        <MessageSquare size={28} style={{ margin: "0 auto 0.5rem", opacity: 0.5 }} />
                        <p style={{ fontSize: "0.82rem", margin: 0 }}>No messages yet</p>
                        <span style={{ fontSize: "0.72rem" }}>Click &quot;New Chat&quot; above to message your tutor</span>
                      </div>
                    ) : (
                      conversations
                        .filter((c) => {
                          if (!chatSearch.trim()) return true;
                          const other = c.other_participants?.[0]?.name || "";
                          const sub = c.subject || "";
                          return other.toLowerCase().includes(chatSearch.toLowerCase()) || sub.toLowerCase().includes(chatSearch.toLowerCase());
                        })
                        .map((conv) => {
                          const other = conv.other_participants?.[0] || { name: "Tutor", role: "tutor" };
                          const isSelected = activeConversation?.id === conv.id;
                          return (
                            <div
                              key={conv.id}
                              onClick={() => {
                                setActiveConversation(conv);
                                fetchMessages(conv.id);
                              }}
                              style={{
                                padding: "0.85rem 1rem",
                                borderBottom: "1px solid #f8fafc",
                                cursor: "pointer",
                                background: isSelected ? "#e8f8f7" : "#fff",
                                borderLeft: isSelected ? "3px solid #20b2a4" : "3px solid transparent",
                                transition: "background 0.15s",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#0d9488,#0f766e)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", flexShrink: 0 }}>
                                  {other.name?.charAt(0) || "T"}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                      {other.name}
                                    </span>
                                    {conv.unread_count > 0 && (
                                      <span style={{ background: "#20b2a4", color: "#fff", borderRadius: "10px", fontSize: "0.68rem", fontWeight: 800, padding: "0.1rem 0.45rem" }}>
                                        {conv.unread_count}
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: "0.72rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "0.15rem" }}>
                                    {conv.subject ? `[${conv.subject}] ` : ""}
                                    {conv.latest_message ? conv.latest_message.body || "(Attachment)" : "No messages yet"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>

                {/* Right Column: Chat Messages Thread */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f8fafc" }}>
                  {activeConversation ? (
                    <>
                      {/* Chat Thread Header */}
                      <div style={{ padding: "0.85rem 1.25rem", background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#e8f8f7", color: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem" }}>
                            {activeConversation.other_participants?.[0]?.name?.charAt(0) || "T"}
                          </div>
                          <div>
                            <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                              {activeConversation.other_participants?.[0]?.name || "Tutor"}
                            </h4>
                            <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                              {activeConversation.subject || "Direct Message"} • Assigned Tutor
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => fetchMessages(activeConversation.id)}
                          style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0.3rem 0.6rem", fontSize: "0.74rem", color: "#64748b", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                        >
                          <RefreshCw size={12} /> Sync
                        </button>
                      </div>

                      {/* Messages Thread Body */}
                      <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                        {loadingMessages ? (
                          <div style={{ textAlign: "center", padding: "2rem", color: "#64748b", fontSize: "0.82rem" }}>
                            Loading message history…
                          </div>
                        ) : messages.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#94a3b8" }}>
                            <MessageSquare size={32} style={{ margin: "0 auto 0.5rem", opacity: 0.5 }} />
                            <p style={{ fontSize: "0.85rem", margin: 0 }}>Start the conversation below</p>
                          </div>
                        ) : (
                          messages.map((msg) => {
                            const isMe = msg.sender?.role === "student" || msg.sender?.id === student.id;
                            return (
                              <div
                                key={msg.id}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: isMe ? "flex-end" : "flex-start",
                                }}
                              >
                                <span style={{ fontSize: "0.68rem", color: "#94a3b8", marginBottom: "0.2rem" }}>
                                  {isMe ? "You" : msg.sender?.name} • {msg.created_at_human || new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                                <div
                                  style={{
                                    maxWidth: "75%",
                                    padding: "0.7rem 0.95rem",
                                    borderRadius: isMe ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                                    background: isMe ? "#20b2a4" : "#fff",
                                    color: isMe ? "#fff" : "#0f172a",
                                    boxShadow: isMe ? "0 2px 6px rgba(32,178,164,0.25)" : "0 1px 3px rgba(0,0,0,0.06)",
                                    border: isMe ? "none" : "1px solid #e2e8f0",
                                    fontSize: "0.85rem",
                                    lineHeight: 1.5,
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {msg.body && <div style={{ whiteSpace: "pre-wrap" }}>{msg.body}</div>}
                                  {msg.attachment_url && (
                                    <div style={{ marginTop: msg.body ? "0.5rem" : 0 }}>
                                      <a
                                        href={msg.attachment_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        download
                                        style={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "0.35rem",
                                          padding: "0.3rem 0.6rem",
                                          borderRadius: "6px",
                                          background: isMe ? "rgba(255,255,255,0.2)" : "#f1f5f9",
                                          color: isMe ? "#fff" : "#0f172a",
                                          fontSize: "0.75rem",
                                          fontWeight: 600,
                                          textDecoration: "none",
                                        }}
                                      >
                                        <Paperclip size={12} /> {msg.attachment_name || "Download File"}
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Message Compose Form */}
                      <form
                        onSubmit={handleSendMessage}
                        style={{ padding: "0.85rem 1rem", background: "#fff", borderTop: "1px solid #e2e8f0" }}
                      >
                        {messageFile && (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#e8f8f7", color: "#0d9488", padding: "0.25rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                            <Paperclip size={12} /> {messageFile.name}
                            <button
                              type="button"
                              onClick={() => setMessageFile(null)}
                              style={{ background: "none", border: "none", color: "#0d9488", cursor: "pointer", padding: "0 0.15rem" }}
                            >
                              ×
                            </button>
                          </div>
                        )}

                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <label
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "36px",
                              height: "36px",
                              borderRadius: "8px",
                              background: "#f1f5f9",
                              color: "#64748b",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                            title="Attach homework or file"
                          >
                            <Paperclip size={16} />
                            <input
                              type="file"
                              onChange={(e) => setMessageFile(e.target.files?.[0] || null)}
                              style={{ display: "none" }}
                            />
                          </label>

                          <input
                            type="text"
                            placeholder="Write a message to your tutor… (Press Enter to send)"
                            value={messageBody}
                            onChange={(e) => setMessageBody(e.target.value)}
                            style={{
                              flex: 1,
                              padding: "0.6rem 0.9rem",
                              borderRadius: "8px",
                              border: "1.5px solid #e2e8f0",
                              outline: "none",
                              fontSize: "0.85rem",
                            }}
                          />

                          <button
                            type="submit"
                            disabled={isSendingMessage || (!messageBody.trim() && !messageFile)}
                            className="action-btn"
                            style={{
                              background: "#20b2a4",
                              color: "#fff",
                              padding: "0.6rem 1rem",
                              fontSize: "0.85rem",
                              opacity: !messageBody.trim() && !messageFile ? 0.6 : 1,
                            }}
                          >
                            <Send size={15} /> {isSendingMessage ? "Sending…" : "Send"}
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8", padding: "2rem" }}>
                      <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                        <MessageSquare size={32} color="#cbd5e1" />
                      </div>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#334155", margin: "0 0 0.35rem" }}>
                        Select a Conversation
                      </h4>
                      <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0, maxWidth: "340px", textAlign: "center" }}>
                        Choose an existing chat thread from the left or click New Chat to message one of your tutors.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Lesson Report View Modal (GET /api/student/reports/{id}) ── */}
      {selectedReportModal && (
        <div
          onClick={() => setSelectedReportModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            animation: "fadeUp 0.2s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "560px",
              maxHeight: "90vh",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)", padding: "1.25rem 1.5rem", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#99f6e4", fontWeight: 700 }}>
                  Lesson Report #{selectedReportModal.id}
                </div>
                <h3 style={{ margin: "0.2rem 0 0", fontSize: "1.1rem", fontWeight: 800 }}>
                  {selectedReportModal.subject} • {selectedReportModal.date}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReportModal(null)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "1.25rem 1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.9rem", flex: 1, fontSize: "0.85rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", background: "#f8fafc", padding: "0.85rem", borderRadius: "8px" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700 }}>TUTOR</div>
                  <div style={{ fontWeight: 700, color: "#0f172a" }}>{selectedReportModal.tutor?.name || "Verified Tutor"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700 }}>ENGAGEMENT RATING</div>
                  <div style={{ color: "#f59e0b", fontWeight: 700 }}>
                    {"★".repeat(Math.min(5, Math.max(1, Number(selectedReportModal.student_engagement) || 5)))} ({selectedReportModal.student_engagement}/5)
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Topics Covered</div>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "0.75rem", borderRadius: "8px", marginTop: "0.25rem", color: "#0f172a", lineHeight: 1.5 }}>
                  {selectedReportModal.topics_covered}
                </div>
              </div>

              {selectedReportModal.strengths && (
                <div>
                  <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#065f46", textTransform: "uppercase" }}>Strengths Identified</div>
                  <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "0.65rem 0.75rem", borderRadius: "8px", marginTop: "0.25rem", color: "#065f46" }}>
                    ✓ {selectedReportModal.strengths}
                  </div>
                </div>
              )}

              {selectedReportModal.areas_for_improvement && (
                <div>
                  <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#9a3412", textTransform: "uppercase" }}>Areas for Practice</div>
                  <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", padding: "0.65rem 0.75rem", borderRadius: "8px", marginTop: "0.25rem", color: "#9a3412" }}>
                    📌 {selectedReportModal.areas_for_improvement}
                  </div>
                </div>
              )}

              {selectedReportModal.homework_assigned && (
                <div>
                  <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#0369a1", textTransform: "uppercase" }}>Homework Assigned</div>
                  <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", padding: "0.65rem 0.75rem", borderRadius: "8px", marginTop: "0.25rem", color: "#0369a1" }}>
                    📚 {selectedReportModal.homework_assigned}
                  </div>
                </div>
              )}

              {selectedReportModal.notes_for_parents && (
                <div>
                  <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#86198f", textTransform: "uppercase" }}>Tutor Notes for Parents</div>
                  <div style={{ background: "#fdf4ff", border: "1px solid #f0abfc", padding: "0.65rem 0.75rem", borderRadius: "8px", marginTop: "0.25rem", color: "#86198f", lineHeight: 1.5 }}>
                    💬 {selectedReportModal.notes_for_parents}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: "0.85rem 1.5rem", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setSelectedReportModal(null)}
                style={{ padding: "0.5rem 1.25rem", borderRadius: "8px", background: "#0f172a", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Submit Homework Modal (POST /api/assignments/{id}/submit) ── */}
      {submitModalAssignment && (
        <div
          onClick={() => setSubmitModalAssignment(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            animation: "fadeUp 0.15s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "520px",
              padding: "1.75rem",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#e8f8f7", color: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Submit Homework
                  </h3>
                  <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                    {submitModalAssignment.title} (Max: {submitModalAssignment.max_points} pts)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSubmitModalAssignment(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={18} />
              </button>
            </div>

            {submitError && (
              <div style={{ background: "#fee2e2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", padding: "0.65rem", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <AlertCircle size={15} /> {submitError}
              </div>
            )}

            <form onSubmit={handleSubmitAssignment} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.3rem" }}>
                  Your Written Answers or Comments
                </label>
                <textarea
                  placeholder="Type your answers, solutions, or explanation for your tutor here (optional if you attach a file below)..."
                  rows={4}
                  value={submitForm.content}
                  onChange={(e) => setSubmitForm({ ...submitForm, content: e.target.value })}
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.85rem", resize: "vertical", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.3rem" }}>
                  Upload Completed File / Photo of Work (PDF, Image, DOCX)
                </label>
                <input
                  type="file"
                  onChange={(e) => setSubmitFile(e.target.files?.[0] || null)}
                  style={{ width: "100%", padding: "0.45rem", borderRadius: "8px", border: "1.5px dashed #cbd5e1", fontSize: "0.8rem", background: "#f8fafc" }}
                />
                <span style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "0.2rem", display: "block" }}>
                  You can submit written text, a file attachment, or both.
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setSubmitModalAssignment(null)}
                  style={{ padding: "0.55rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", color: "#475569", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingHomework}
                  className="action-btn"
                  style={{ background: "#20b2a4", color: "#fff", padding: "0.55rem 1.25rem", fontSize: "0.82rem" }}
                >
                  <Send size={14} /> {isSubmittingHomework ? "Submitting…" : "Turn In Homework"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Start New Chat with Tutor Modal (POST /api/chat/conversations) ── */}
      {showNewConvModal && (
        <div
          onClick={() => setShowNewConvModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            animation: "fadeUp 0.15s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "480px",
              padding: "1.75rem",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#e8f8f7", color: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MessageSquare size={18} />
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Message Your Tutor
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewConvModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleStartConversation} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.3rem" }}>
                  Select Tutor <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <select
                  value={newConvForm.recipient_id}
                  onChange={(e) => setNewConvForm({ ...newConvForm, recipient_id: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.85rem", background: "#fff", outline: "none" }}
                >
                  <option value="">-- Choose Assigned Tutor --</option>
                  {assignedTutors.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.subject || "Tutor"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.3rem" }}>
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Question regarding Algebra homework"
                  value={newConvForm.subject}
                  onChange={(e) => setNewConvForm({ ...newConvForm, subject: e.target.value })}
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.85rem", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.3rem" }}>
                  Message <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <textarea
                  placeholder="Type your message to your tutor..."
                  rows={4}
                  value={newConvForm.initial_message}
                  onChange={(e) => setNewConvForm({ ...newConvForm, initial_message: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.85rem", resize: "vertical", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.3rem" }}>
                  Attach Document or Image (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setNewConvFile(e.target.files?.[0] || null)}
                  style={{ width: "100%", padding: "0.45rem", borderRadius: "8px", border: "1.5px dashed #cbd5e1", fontSize: "0.8rem", background: "#f8fafc" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowNewConvModal(false)}
                  style={{ padding: "0.55rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", color: "#475569", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isStartingConv}
                  className="action-btn"
                  style={{ background: "#20b2a4", color: "#fff", padding: "0.55rem 1.25rem", fontSize: "0.82rem" }}
                >
                  <Send size={14} /> {isStartingConv ? "Sending…" : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Sign Out Confirmation Dialog ── */}
      {showLogoutConfirm && (
        <div
          onClick={() => setShowLogoutConfirm(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            animation: "fadeUp 0.15s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "400px",
              padding: "1.75rem 1.5rem",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#fee2e2",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <LogOut size={26} />
            </div>

            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.4rem" }}>
              Confirm Sign Out
            </h3>
            <p style={{ fontSize: "0.84rem", color: "#64748b", margin: "0 0 1.5rem", lineHeight: 1.55 }}>
              Are you sure you want to sign out of the Student &amp; Parent Portal?
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", width: "100%" }}>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  border: "1.5px solid #cbd5e1",
                  background: "#fff",
                  color: "#475569",
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  boxShadow: "0 2px 6px rgba(220,38,38,0.3)",
                }}
              >
                <LogOut size={15} /> Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
