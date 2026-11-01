"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Video,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  ChevronRight,
  Mail,
  Phone,
  RefreshCw,
  Clock,
  ExternalLink,
  Edit3,
  Filter,
  Check,
  CalendarDays,
  Menu,
  X,
  BookOpen,
  GraduationCap,
  Award,
  Sparkles,
  AlertCircle,
  ArrowRight,
  FileText,
  Star,
  Send,
  MessageSquare,
  Key,
  RotateCcw,
  CalendarClock,
  DollarSign,
  CreditCard,
  Paperclip,
  Download,
  Plus,
  UserCheck,
} from "lucide-react";
import NotificationEnvelope from "@/components/NotificationEnvelope";

/* ─── Types based on API responses ────────────────────────── */
type TutorProfile = {
  id: number;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  subjects: string[];
  levels: string[];
  approval_status: "approved" | "pending" | "rejected" | string;
};

type TutorStats = {
  total_students: number;
  upcoming_sessions_count: number;
  completed_sessions_count: number;
};

type StudentMini = {
  id: number;
  student_name: string;
  parent_name?: string;
  email?: string;
  phone?: string;
  level?: string;
};

type WeeklyTimetableSlot = {
  id: number;
  student_id: number;
  tutor_id: number;
  subject: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  meeting_link?: string;
  status: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  student?: StudentMini;
};

type UpcomingSession = {
  id: number;
  student_id: number;
  tutor_id: number;
  lesson_schedule_id?: number;
  subject: string;
  date: string;
  start_time: string;
  end_time: string;
  meeting_link?: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled" | string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  student?: StudentMini;
};

type AssignedStudent = {
  id: number;
  student_name: string;
  parent_name?: string;
  email: string;
  phone?: string;
  level?: string;
  subject?: string;
  pivot_notes?: string;
  timetable_slots?: WeeklyTimetableSlot[];
  total_completed_lessons?: number;
};

type SessionsPagination = {
  current_page: number;
  data: UpcomingSession[];
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
  links?: { url: string | null; label: string; page: number | null; active: boolean }[];
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
  updated_at?: string;
  student?: StudentMini;
  session?: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    status: string;
    subject?: string;
  };
};

type ChangeRequest = {
  id: number;
  lesson_session_id: number;
  requested_by?: number;
  request_type: "reschedule" | "cancel" | string;
  proposed_date?: string;
  proposed_start_time?: string;
  proposed_end_time?: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | string;
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
  session?: {
    id: number;
    subject?: string;
    date?: string;
    start_time?: string;
    end_time?: string;
    student?: {
      id?: number;
      student_name?: string;
      parent_name?: string;
    };
  };
};

type TutorPayoutSession = {
  session_id: number;
  date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  subject: string;
  student_name: string;
  status: string;
  attendance_status: string;
  report_submitted: boolean;
  earnings: number;
};

type TutorPayoutResponse = {
  month: string;
  hourly_rate: number;
  summary: {
    total_scheduled?: number;
    total_sessions?: number;
    completed_sessions: number;
    total_hours: number;
    total_earnings: number;
  };
  sessions: TutorPayoutSession[];
};

type NavTab = "overview" | "schedule" | "students" | "sessions" | "reports" | "requests" | "payouts" | "homework" | "chat" | "profile";

type AssignmentSubmission = {
  id: number;
  assignment_id: number;
  student_id: number;
  content?: string;
  file_name?: string;
  file_url?: string;
  submitted_at: string;
  student?: { id: number; name?: string; student_name?: string };
};

type Assignment = {
  id: number;
  tutor_id?: number;
  student_id: number;
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
  student?: { id: number; name?: string; student_name?: string; email?: string } | null;
  tutor?: { id: number; name?: string } | null;
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

const statusStyle: Record<string, { bg: string; color: string; border: string; label: string }> = {
  scheduled: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", label: "Scheduled" },
  completed: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0", label: "Completed" },
  cancelled: { bg: "#fef2f2", color: "#991b1b", border: "#fecaca", label: "Cancelled" },
  rescheduled: { bg: "#fffbeb", color: "#b45309", border: "#fde68a", label: "Rescheduled" },
  active: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0", label: "Active" },
  pending: { bg: "#fffbeb", color: "#b45309", border: "#fde68a", label: "Pending" },
  approved: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0", label: "Approved" },
  rejected: { bg: "#fef2f2", color: "#991b1b", border: "#fecaca", label: "Rejected" },
  assigned: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", label: "Assigned" },
  submitted: { bg: "#fffbeb", color: "#b45309", border: "#fde68a", label: "Submitted" },
  graded: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0", label: "Graded" },
  overdue: { bg: "#fef2f2", color: "#991b1b", border: "#fecaca", label: "Overdue" },
};

export default function TutorDashboard() {
  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Login form states (for direct login if not authenticated)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Navigation
  const [activeTab, setActiveTab] = useState<NavTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Dashboard state (from GET /api/tutor/dashboard)
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  const [stats, setStats] = useState<TutorStats>({
    total_students: 0,
    upcoming_sessions_count: 0,
    completed_sessions_count: 0,
  });
  const [weeklyTimetable, setWeeklyTimetable] = useState<WeeklyTimetableSlot[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);

  // Students state (from GET /api/tutor/students)
  const [students, setStudents] = useState<AssignedStudent[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [searchStudent, setSearchStudent] = useState("");

  // Sessions state (from GET /api/tutor/sessions)
  const [sessionsData, setSessionsData] = useState<SessionsPagination | null>(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [sessionFilterStatus, setSessionFilterStatus] = useState<string>("all");
  const [sessionFromDate, setSessionFromDate] = useState<string>("");
  const [sessionToDate, setSessionToDate] = useState<string>("");
  const [sessionStudentId, setSessionStudentId] = useState<string>("all");
  const [sessionPage, setSessionPage] = useState<number>(1);

  // Edit / Update Session modal state (PATCH /api/tutor/sessions/{id})
  const [editingSession, setEditingSession] = useState<UpcomingSession | null>(null);
  const [editStatus, setEditStatus] = useState<string>("scheduled");
  const [editMeetingLink, setEditMeetingLink] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [isUpdatingSession, setIsUpdatingSession] = useState(false);

  // Lesson Report Modal State (POST/GET /api/tutor/sessions/{sessionId}/report)
  const [reportModalSession, setReportModalSession] = useState<UpcomingSession | null>(null);
  const [reportForm, setReportForm] = useState({
    attendance_status: "present",
    topics_covered: "",
    student_engagement: 5,
    homework_assigned: "",
    strengths: "",
    areas_for_improvement: "",
    notes_for_parents: "",
    status: "submitted",
  });
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // Student Past Reports Modal (GET /api/tutor/students/{studentId}/reports)
  const [viewingStudentReports, setViewingStudentReports] = useState<{
    student: AssignedStudent | StudentMini;
    reports: LessonReport[];
    loading: boolean;
  } | null>(null);

  // View Single Report Modal
  const [selectedReportView, setSelectedReportView] = useState<LessonReport | null>(null);

  // Tutor Reports Tab List
  const [tutorReports, setTutorReports] = useState<LessonReport[]>([]);
  const [loadingTutorReports, setLoadingTutorReports] = useState(false);
  const [reportSearchQuery, setReportSearchQuery] = useState("");

  // Change Requests State (GET /api/tutor/change-requests & POST /api/tutor/sessions/{sessionId}/request-change)
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [loadingChangeRequests, setLoadingChangeRequests] = useState(false);
  const [changeRequestFilter, setChangeRequestFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [changeRequestModalSession, setChangeRequestModalSession] = useState<UpcomingSession | null>(null);
  const [changeRequestForm, setChangeRequestForm] = useState({
    request_type: "reschedule" as "reschedule" | "cancel",
    reason: "",
    proposed_date: "",
    proposed_start_time: "10:00",
    proposed_end_time: "11:00",
  });
  const [isSubmittingChangeRequest, setIsSubmittingChangeRequest] = useState(false);
  const [changeRequestError, setChangeRequestError] = useState<string | null>(null);

  // Payouts State (GET /api/tutor/payouts?month=YYYY-MM)
  const [payoutMonth, setPayoutMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [payoutData, setPayoutData] = useState<TutorPayoutResponse | null>(null);
  const [loadingPayoutData, setLoadingPayoutData] = useState(false);

  // Homework / Assignments State
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [assignmentFilter, setAssignmentFilter] = useState<string>("all");
  const [assignmentStudentFilter, setAssignmentStudentFilter] = useState<string>("all");
  const [assignmentSearch, setAssignmentSearch] = useState<string>("");
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    student_id: "",
    lesson_session_id: "",
    title: "",
    description: "",
    due_date: "",
    max_points: "100",
  });
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [gradeModalAssignment, setGradeModalAssignment] = useState<Assignment | null>(null);
  const [gradeForm, setGradeForm] = useState({ grade: "", feedback: "" });
  const [isGrading, setIsGrading] = useState(false);
  const [gradeError, setGradeError] = useState<string | null>(null);

  // Chat / Messaging State
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

  // Attendance tracking state: sessionId -> { joined: boolean, joinedAt?: string, leftAt?: string, duration?: number }
  const [sessionAttendance, setSessionAttendance] = useState<Record<number, { joined: boolean; joinedAt?: string; leftAt?: string; duration?: number }>>({});
  const [attendanceLoadingId, setAttendanceLoadingId] = useState<number | null>(null);

  // Logout confirmation modal
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

  /* ── Open Report Modal for a Session (GET existing report if any) ── */
  const openReportModal = async (session: UpcomingSession) => {
    setReportModalSession(session);
    setReportError(null);
    setReportForm({
      attendance_status: "present",
      topics_covered: session.notes || "",
      student_engagement: 5,
      homework_assigned: "",
      strengths: "",
      areas_for_improvement: "",
      notes_for_parents: "",
      status: "submitted",
    });

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/tutor/sessions/${session.id}/report`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.report) {
          setReportForm({
            attendance_status: data.report.attendance_status || "present",
            topics_covered: data.report.topics_covered || "",
            student_engagement: Number(data.report.student_engagement) || 5,
            homework_assigned: data.report.homework_assigned || "",
            strengths: data.report.strengths || "",
            areas_for_improvement: data.report.areas_for_improvement || "",
            notes_for_parents: data.report.notes_for_parents || "",
            status: data.report.status || "submitted",
          });
        }
      }
    } catch {
      // New report
    }
  };

  /* ── Submit Report: POST /api/tutor/sessions/{sessionId}/report ── */
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportModalSession) return;

    if (!reportForm.topics_covered.trim()) {
      setReportError("Please enter the topics covered during the lesson.");
      return;
    }

    setIsSubmittingReport(true);
    setReportError(null);

    try {
      const baseUrl = getBackendApiUrl();
      const payload = {
        topics_covered: reportForm.topics_covered.trim(),
        attendance_status: reportForm.attendance_status,
        student_engagement: Number(reportForm.student_engagement) || 5,
        homework_assigned: reportForm.homework_assigned.trim() || undefined,
        strengths: reportForm.strengths.trim() || undefined,
        areas_for_improvement: reportForm.areas_for_improvement.trim() || undefined,
        notes_for_parents: reportForm.notes_for_parents.trim() || undefined,
        status: reportForm.status || "submitted",
      };

      const res = await fetch(`${baseUrl}/api/tutor/sessions/${reportModalSession.id}/report`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setReportError(data?.message || `Failed to submit report (HTTP ${res.status}).`);
        return;
      }

      showToast("Lesson report saved successfully!");
      setReportModalSession(null);

      // Refresh data
      fetchDashboardData();
      fetchSessions(sessionPage);
      if (activeTab === "reports") {
        fetchTutorReports();
      }
    } catch (err: any) {
      console.error("Submit report error:", err);
      setReportError(err?.message || "An unexpected error occurred while saving report.");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  /* ── Open Student Reports Modal: GET /api/tutor/students/{studentId}/reports ── */
  const openStudentReportsModal = async (student: AssignedStudent | StudentMini) => {
    setViewingStudentReports({
      student,
      reports: [],
      loading: true,
    });

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/tutor/students/${student.id}/reports`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setViewingStudentReports({
          student,
          reports: Array.isArray(data.reports) ? data.reports : [],
          loading: false,
        });
      } else {
        setViewingStudentReports((prev) => (prev ? { ...prev, loading: false } : null));
      }
    } catch (err) {
      console.error("Failed to fetch student reports:", err);
      setViewingStudentReports((prev) => (prev ? { ...prev, loading: false } : null));
    }
  };

  /* ── Fetch Tutor's Reports for Reports Tab ── */
  const fetchTutorReports = async () => {
    setLoadingTutorReports(true);
    try {
      const baseUrl = getBackendApiUrl();
      const reportPromises = students.map((st) =>
        fetch(`${baseUrl}/api/tutor/students/${st.id}/reports`, {
          headers: getAuthHeaders(),
        })
          .then((r) => (r.ok ? r.json() : { reports: [] }))
          .then((d) => (Array.isArray(d.reports) ? d.reports : []))
          .catch(() => [])
      );

      const studentReportArrays = await Promise.all(reportPromises);
      const allReports = studentReportArrays.flat();

      const uniqueMap = new Map<number, LessonReport>();
      allReports.forEach((rep: LessonReport) => {
        if (rep?.id) uniqueMap.set(rep.id, rep);
      });
      setTutorReports(Array.from(uniqueMap.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err) {
      console.error("Error gathering tutor reports:", err);
    } finally {
      setLoadingTutorReports(false);
    }
  };

  /* ── Fetch Tutor Change Requests: GET /api/tutor/change-requests ── */
  const fetchChangeRequests = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    if (!token) return;

    setLoadingChangeRequests(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/tutor/change-requests`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const list =
          data.change_requests?.data ||
          data.change_requests ||
          data.data ||
          (Array.isArray(data) ? data : []);
        setChangeRequests(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error("Error fetching change requests:", err);
    } finally {
      setLoadingChangeRequests(false);
    }
  };

  /* ── Open Change Request Modal for an Upcoming Session ── */
  const openChangeRequestModal = (session: UpcomingSession) => {
    setChangeRequestModalSession(session);
    setChangeRequestError(null);
    setChangeRequestForm({
      request_type: "reschedule",
      reason: "",
      proposed_date: session.date || "",
      proposed_start_time: session.start_time ? session.start_time.slice(0, 5) : "10:00",
      proposed_end_time: session.end_time ? session.end_time.slice(0, 5) : "11:00",
    });
  };

  /* ── Submit Change Request: POST /api/tutor/sessions/{sessionId}/request-change ── */
  const handleSubmitChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeRequestModalSession) return;
    setChangeRequestError(null);

    if (!changeRequestForm.reason.trim()) {
      setChangeRequestError("Please specify a reason for this reschedule/cancellation request.");
      return;
    }

    if (changeRequestForm.request_type === "reschedule") {
      if (!changeRequestForm.proposed_date) {
        setChangeRequestError("Please select a proposed new date.");
        return;
      }
      if (!changeRequestForm.proposed_start_time) {
        setChangeRequestError("Please select a proposed start time.");
        return;
      }
    }

    setIsSubmittingChangeRequest(true);
    try {
      const baseUrl = getBackendApiUrl();
      const payload: any = {
        request_type: changeRequestForm.request_type,
        reason: changeRequestForm.reason.trim(),
      };

      if (changeRequestForm.request_type === "reschedule") {
        payload.proposed_date = changeRequestForm.proposed_date;
        payload.proposed_start_time = changeRequestForm.proposed_start_time;
        if (changeRequestForm.proposed_end_time) {
          payload.proposed_end_time = changeRequestForm.proposed_end_time;
        }
      }

      const res = await fetch(`${baseUrl}/api/tutor/sessions/${changeRequestModalSession.id}/request-change`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || `Failed to submit request (HTTP ${res.status})`);
      }

      showToast(data?.message || "✅ Session change request submitted successfully and is awaiting admin review.");
      setChangeRequestModalSession(null);
      fetchChangeRequests();
      fetchDashboardData();
      fetchSessions(sessionPage);
    } catch (err: any) {
      console.error("Change request error:", err);
      setChangeRequestError(err.message || "Failed to submit change request.");
    } finally {
      setIsSubmittingChangeRequest(false);
    }
  };

  const getSessionPendingRequest = (sessionId: number) => {
    return changeRequests.find((cr) => cr.lesson_session_id === sessionId && cr.status === "pending");
  };

  /* ── Fetch Tutor Payouts: GET /api/tutor/payouts?month=YYYY-MM ── */
  const fetchTutorPayouts = async (month: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    if (!token) return;

    setLoadingPayoutData(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/tutor/payouts?month=${month}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setPayoutData(data);
      } else {
        setPayoutData(null);
      }
    } catch (err) {
      console.error("Failed to fetch tutor payouts:", err);
      setPayoutData(null);
    } finally {
      setLoadingPayoutData(false);
    }
  };

  /* ── 1. Fetch Dashboard: GET /api/tutor/dashboard ── */
  const fetchDashboardData = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    if (!token) return;

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/tutor/dashboard`, {
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.tutor) setTutorProfile(data.tutor);
        if (data.stats) setStats(data.stats);
        if (Array.isArray(data.weekly_timetable)) setWeeklyTimetable(data.weekly_timetable);
        if (Array.isArray(data.upcoming_sessions)) setUpcomingSessions(data.upcoming_sessions);
      } else if (res.status === 401) {
        console.warn("Unauthorized /api/tutor/dashboard");
      }
    } catch (err) {
      console.error("Error fetching tutor dashboard:", err);
    }
  };

  /* ── 2. Fetch Schedule: GET /api/tutor/schedule ── */
  const fetchScheduleData = async () => {
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/tutor/schedule`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.weekly_timetable)) setWeeklyTimetable(data.weekly_timetable);
        if (Array.isArray(data.upcoming_sessions)) setUpcomingSessions(data.upcoming_sessions);
      }
    } catch (err) {
      console.error("Error fetching schedule:", err);
    }
  };

  /* ── 3. Fetch Students: GET /api/tutor/students ── */
  const fetchStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/tutor/students`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data.students) ? data.students : [];
        setStudents(list);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  /* ── 4. Fetch Sessions: GET /api/tutor/sessions with filters ── */
  const fetchSessions = async (page = 1) => {
    setIsLoadingSessions(true);
    try {
      const baseUrl = getBackendApiUrl();
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("per_page", "20");

      if (sessionFilterStatus && sessionFilterStatus !== "all") {
        params.append("status", sessionFilterStatus);
      }
      if (sessionFromDate) {
        params.append("from_date", sessionFromDate);
      }
      if (sessionToDate) {
        params.append("to_date", sessionToDate);
      }
      if (sessionStudentId && sessionStudentId !== "all") {
        params.append("student_id", sessionStudentId);
      }

      const res = await fetch(`${baseUrl}/api/tutor/sessions?${params.toString()}`, {
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.sessions) {
          setSessionsData(data.sessions);
          setSessionPage(data.sessions.current_page || page);
        }
      }
    } catch (err) {
      console.error("Error fetching tutor sessions:", err);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  /* ── 5. Update Session: PATCH /api/tutor/sessions/{id} ── */
  const handleUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    setIsUpdatingSession(true);

    try {
      const baseUrl = getBackendApiUrl();
      const payload: { status?: string; meeting_link?: string; notes?: string } = {
        status: editStatus,
        meeting_link: editMeetingLink.trim(),
        notes: editNotes.trim(),
      };

      const res = await fetch(`${baseUrl}/api/tutor/sessions/${editingSession.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || `Failed to update session (HTTP ${res.status})`);
      }

      showToast(data?.message || `✅ Session #${editingSession.id} updated successfully.`);

      // Update local state in upcomingSessions and sessionsData
      const updatedSession = data?.session || {
        ...editingSession,
        status: editStatus,
        meeting_link: editMeetingLink.trim(),
        notes: editNotes.trim(),
      };

      setUpcomingSessions((prev) =>
        prev.map((s) => (s.id === editingSession.id ? { ...s, ...updatedSession } : s))
      );

      if (sessionsData) {
        setSessionsData({
          ...sessionsData,
          data: sessionsData.data.map((s) => (s.id === editingSession.id ? { ...s, ...updatedSession } : s)),
        });
      }

      // Refresh stats and schedule in background
      fetchDashboardData();

      setEditingSession(null);
    } catch (err: any) {
      console.error("Update session error:", err);
      showToast(`⚠️ ${err.message || "Failed to update session."}`);
    } finally {
      setIsUpdatingSession(false);
    }
  };

  const quickMarkCompleted = async (session: UpcomingSession) => {
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/tutor/sessions/${session.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: "completed" }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || `Failed to complete session (HTTP ${res.status})`);
      }

      showToast(`✅ Session #${session.id} marked as completed!`);
      setUpcomingSessions((prev) =>
        prev.map((s) => (s.id === session.id ? { ...s, status: "completed" } : s))
      );
      if (sessionsData) {
        setSessionsData({
          ...sessionsData,
          data: sessionsData.data.map((s) => (s.id === session.id ? { ...s, status: "completed" } : s)),
        });
      }
      fetchDashboardData();
    } catch (err: any) {
      console.error("Quick complete error:", err);
      showToast(`⚠️ ${err.message || "Failed to update status."}`);
    }
  };

  const openEditModal = (session: UpcomingSession) => {
    setEditingSession(session);
    setEditStatus(session.status || "scheduled");
    setEditMeetingLink(session.meeting_link || "");
    setEditNotes(session.notes || "");
  };

  /* ── Fetch Assignments (GET /api/assignments?status=...&student_id=...) ── */
  const fetchAssignments = async (status?: string, studentId?: string) => {
    setLoadingAssignments(true);
    try {
      const baseUrl = getBackendApiUrl();
      const currentStatus = status !== undefined ? status : assignmentFilter;
      const currentStudentId = studentId !== undefined ? studentId : assignmentStudentFilter;

      const params = new URLSearchParams();
      if (currentStatus && currentStatus !== "all") {
        params.append("status", currentStatus);
      }
      if (currentStudentId && currentStudentId !== "all") {
        params.append("student_id", currentStudentId);
      }

      const query = params.toString();
      const url = query ? `${baseUrl}/api/assignments?${query}` : `${baseUrl}/api/assignments`;
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

  /* ── Create Assignment (POST /api/assignments) ── */
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentForm.student_id || !assignmentForm.title.trim() || !assignmentForm.description.trim() || !assignmentForm.due_date) {
      setAssignmentError("Please complete all required fields (student, title, description, due date).");
      return;
    }
    setAssignmentError(null);
    setIsSubmittingAssignment(true);
    try {
      const baseUrl = getBackendApiUrl();
      const formData = new FormData();
      formData.append("student_id", assignmentForm.student_id);
      if (assignmentForm.lesson_session_id) {
        formData.append("lesson_session_id", assignmentForm.lesson_session_id);
      }
      formData.append("title", assignmentForm.title.trim());
      formData.append("description", assignmentForm.description.trim());
      formData.append("due_date", assignmentForm.due_date);
      formData.append("max_points", assignmentForm.max_points || "100");
      if (assignmentFile) {
        formData.append("attachment", assignmentFile);
      }

      const res = await fetch(`${baseUrl}/api/assignments`, {
        method: "POST",
        headers: getAuthHeadersNoContentType(),
        body: formData,
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        showToast(data?.message || "Homework assigned successfully!");
        setShowAssignmentModal(false);
        setAssignmentForm({ student_id: "", lesson_session_id: "", title: "", description: "", due_date: "", max_points: "100" });
        setAssignmentFile(null);
        fetchAssignments();
      } else {
        setAssignmentError(data?.message || "Failed to create assignment.");
      }
    } catch (err: any) {
      setAssignmentError(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmittingAssignment(false);
    }
  };

  /* ── Grade Assignment (POST /api/assignments/{id}/grade) ── */
  const handleGradeAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeModalAssignment) return;
    if (gradeForm.grade === "" || isNaN(Number(gradeForm.grade))) {
      setGradeError("Please enter a valid numeric grade.");
      return;
    }
    setGradeError(null);
    setIsGrading(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/assignments/${gradeModalAssignment.id}/grade`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          grade: Number(gradeForm.grade),
          feedback: gradeForm.feedback.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        showToast(data?.message || "Assignment graded successfully!");
        setGradeModalAssignment(null);
        setGradeForm({ grade: "", feedback: "" });
        fetchAssignments();
      } else {
        setGradeError(data?.message || "Failed to submit grade.");
      }
    } catch (err: any) {
      setGradeError(err?.message || "An unexpected error occurred while grading.");
    } finally {
      setIsGrading(false);
    }
  };

  /* ── Fetch Chat Conversations (GET /api/chat/conversations) ── */
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

  /* ── Fetch Messages for active conversation (GET /api/chat/conversations/{id}/messages) ── */
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
        // Mark as read
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

  /* ── Fetch Chat Unread Count (GET /api/chat/unread-count) ── */
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

  /* ── Send Message (POST /api/chat/conversations/{id}/messages) ── */
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

  /* ── Start New Conversation (POST /api/chat/conversations) ── */
  const handleStartConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConvForm.recipient_id) {
      showToast("Please choose a student to message.");
      return;
    }
    if (!newConvForm.initial_message.trim() && !newConvFile) {
      showToast("Please enter an initial message or attach a file.");
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

  /* ── Attendance Tracking (POST /api/sessions/{sessionId}/join & leave) ── */
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
        showToast("Attendance logged! You have checked in to this session.");
        if (link && typeof window !== "undefined") {
          window.open(link, "_blank", "noreferrer");
        }
      } else {
        showToast(data?.message || "Unable to join session.");
      }
    } catch (err: any) {
      showToast("Error marking session attendance.");
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
        showToast(`Checked out of session.${duration ? ` Duration: ${duration} mins.` : ""}`);
        fetchSessions(sessionPage);
      } else {
        showToast(data?.message || "Unable to record session checkout.");
      }
    } catch (err: any) {
      showToast("Error checking out of session.");
    } finally {
      setAttendanceLoadingId(null);
    }
  };

  /* ── Auth checking & initial load ── */
  useEffect(() => {
    const mustChange = typeof window !== "undefined" ? localStorage.getItem("samin_must_change_password") : null;
    if (mustChange === "true") {
      window.location.href = "/change-password";
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("samin_user") : null;

    if (token) {
      setIsAuthed(true);
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          if (u.name) {
            setTutorProfile((prev) => ({
              id: u.id || 0,
              name: u.name,
              email: u.email,
              phone: u.phone || "",
              qualification: u.tutor_profile?.qualification || prev?.qualification || "Verified Tutor",
              subjects: Array.isArray(u.tutor_profile?.subjects) ? u.tutor_profile.subjects : prev?.subjects || ["General"],
              levels: Array.isArray(u.tutor_profile?.levels) ? u.tutor_profile.levels : prev?.levels || ["All Levels"],
              approval_status: u.tutor_profile?.approval_status || "approved",
            }));
          }
        } catch {}
      }

      Promise.all([
        fetchDashboardData(),
        fetchStudents(),
        fetchSessions(1),
        fetchChangeRequests(),
        fetchAssignments(),
        fetchChatUnreadCount(),
      ]).finally(() => {
        setInitialLoading(false);
      });
    } else {
      setInitialLoading(false);
    }

    setChecking(false);
  }, []);

  /* ── Handle direct Tutor Login ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setLoginError(data?.message || "Invalid credentials. Please verify your email and password.");
        return;
      }

      if (data?.token) {
        localStorage.setItem("samin_auth_token", data.token);
      }
      if (data?.user) {
        localStorage.setItem("samin_user", JSON.stringify(data.user));
      }
      localStorage.setItem("samin_admin_logged_in", "true");

      if (data?.must_change_password === true || data?.user?.must_change_password === true) {
        localStorage.setItem("samin_must_change_password", "true");
        window.location.href = "/change-password";
        return;
      }

      setIsAuthed(true);
      setInitialLoading(true);
      await Promise.all([
        fetchDashboardData(),
        fetchStudents(),
        fetchSessions(1),
        fetchAssignments(),
        fetchChatUnreadCount(),
      ]);
      setInitialLoading(false);
      showToast(data?.message || "Welcome back to your Tutor Portal!");
    } catch (err: any) {
      console.error("Login error:", err);
      setLoginError(err?.message || "Login failed. Please check network connection.");
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
      localStorage.removeItem("samin_admin_logged_in");
      window.location.href = "/";
    }
  };

  /* ── Filtered students for Students tab ── */
  const filteredStudents = students.filter((s) => {
    if (!searchStudent.trim()) return true;
    const q = searchStudent.toLowerCase();
    return (
      s.student_name.toLowerCase().includes(q) ||
      (s.parent_name && s.parent_name.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.subject && s.subject.toLowerCase().includes(q)) ||
      (s.level && s.level.toLowerCase().includes(q))
    );
  });

  /* ── Group weekly timetable by day ── */
  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const groupedTimetable: Record<string, WeeklyTimetableSlot[]> = {};
  daysOfWeek.forEach((d) => (groupedTimetable[d] = []));
  weeklyTimetable.forEach((slot) => {
    const day = (slot.day_of_week || "").toLowerCase();
    if (groupedTimetable[day]) {
      groupedTimetable[day].push(slot);
    } else {
      groupedTimetable[day] = [slot];
    }
  });

  // Next upcoming session
  const nextSession = upcomingSessions.find((s) => s.status === "scheduled");

  /* ── Login screen if not authed ── */
  if (checking) return null;

  if (!isAuthed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "1.5rem", fontFamily: "'Inter',system-ui,sans-serif" }}>
        <div style={{ width: "100%", maxWidth: "420px", background: "#fff", borderRadius: "16px", padding: "2.25rem", boxShadow: "0 10px 30px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%", background: "#e8f8f7", color: "#20b2a4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", border: "2px solid #99f6e4" }}>
              <GraduationCap size={28} />
            </div>
            <h1 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.35rem" }}>
              Samin Tutor Portal
            </h1>
            <p style={{ fontSize: "0.82rem", color: "#64748b" }}>
              Sign in with your tutor credentials to view your timetable, students, and sessions.
            </p>
          </div>

          {loginError && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "0.75rem", color: "#b91c1c", fontSize: "0.82rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>Email Address</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="your.email@example.com"
                style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", outline: "none", fontSize: "0.88rem" }}
              />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#334155", margin: 0 }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: "0.75rem", color: "#0d9488", textDecoration: "none", fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", outline: "none", fontSize: "0.88rem" }}
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
                fontWeight: 700,
                fontSize: "0.9rem",
                border: "none",
                cursor: loginLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              {loginLoading ? "Authenticating…" : "Sign In to Tutor Portal"}
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", textAlign: "center", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
            <Link href="/" style={{ fontSize: "0.82rem", color: "#20b2a4", textDecoration: "none", fontWeight: 600 }}>
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Nav items for Tutor Portal (ONLY tutor features, NO admin features) ── */
  const pendingRequestsCount = changeRequests.filter((r) => r.status === "pending").length;
  const navTabs: { tab: NavTab; icon: React.ReactNode; label: string; badge?: number }[] = [
    { tab: "overview", icon: <LayoutDashboard size={18} />, label: "Overview" },
    { tab: "schedule", icon: <Calendar size={18} />, label: "My Schedule", badge: stats.upcoming_sessions_count || undefined },
    { tab: "students", icon: <Users size={18} />, label: "My Students", badge: stats.total_students || undefined },
    { tab: "sessions", icon: <CalendarDays size={18} />, label: "All Sessions" },
    { tab: "reports", icon: <FileText size={18} />, label: "Lesson Reports" },
    { tab: "requests", icon: <RotateCcw size={18} />, label: "Change Requests", badge: pendingRequestsCount || undefined },
    { tab: "payouts", icon: <CreditCard size={18} />, label: "Payouts & Earnings" },
    { tab: "homework", icon: <BookOpen size={18} />, label: "Homework", badge: assignments.filter((a) => a.status === "submitted").length || undefined },
    { tab: "chat", icon: <MessageSquare size={18} />, label: "Messages", badge: chatUnreadCount || undefined },
    { tab: "profile", icon: <Award size={18} />, label: "My Profile" },
  ];

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
        .action-btn:hover{opacity:0.88;transform:translateY(-1px)}
        .search-box{display:flex;align-items:center;gap:0.5rem;background:#fff;border:1.5px solid #e2e8f0;border-radius:8px;padding:0.5rem 0.85rem}
        .search-box:focus-within{border-color:#20b2a4}
        .search-box input{border:none;outline:none;font-size:0.87rem;background:transparent;width:100%;font-family:inherit}
        .table-row:hover{background:#f8fafc}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .page-enter{animation:fadeUp 0.25s ease}
        @keyframes spin{to{transform:rotate(360deg)}}
        .toast{position:fixed;bottom:1.5rem;right:1.5rem;background:#0f172a;color:#fff;padding:0.8rem 1.3rem;border-radius:10px;font-size:0.85rem;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.2);animation:fadeUp 0.3s ease}
        @media(max-width:768px){
          .sidebar{position:fixed!important;left:0;top:0;z-index:200;height:100vh;transform:translateX(-100%);transition:transform 0.3s}
          .sidebar.open{transform:translateX(0)!important}
          .mob-menu{display:flex!important}
        }
      `}</style>

      {/* Toast Notification */}
      {toast && <div className="toast">{toast}</div>}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 199 }} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`sidebar${sidebarOpen ? " open" : ""}`}
        style={{
          width: "245px",
          minWidth: "245px",
          background: "#fff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          padding: "1.25rem 0.95rem",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", padding: "0 0.15rem 1rem", borderBottom: "1px solid #f1f5f9" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.55rem", textDecoration: "none" }}>
            <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", overflow: "hidden", border: "2px solid #20b2a4", flexShrink: 0 }}>
              <Image src="/images/samin_logo.jpeg" alt="Samin" width={32} height={32} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a", display: "block", lineHeight: 1.2 }}>
                <span style={{ color: "#20b2a4" }}>Samin</span> Tutor
              </span>
              <span style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 600 }}>Tutor Portal</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
            <X size={17} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          {navTabs.map(({ tab, icon, label, badge }) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSidebarOpen(false);
                if (tab === "sessions") fetchSessions(1);
                if (tab === "students") fetchStudents();
                if (tab === "requests") fetchChangeRequests();
                if (tab === "payouts") fetchTutorPayouts(payoutMonth);
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
                <span style={{ background: "#e8f8f7", color: "#0d9488", fontSize: "0.7rem", fontWeight: 800, padding: "0.1rem 0.5rem", borderRadius: "10px" }}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Profile card & Sign out */}
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.85rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {tutorProfile && (
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.75rem", marginBottom: "0.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                {/* Avatar with Verified Badge Overlay */}
                <div style={{ position: "relative", width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", flexShrink: 0, boxShadow: "0 2px 6px rgba(13,148,136,0.25)" }}>
                  {tutorProfile.name?.charAt(0) || "T"}
                  {tutorProfile.approval_status === "approved" && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-2px",
                        right: "-2px",
                        background: "#10b981",
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
                      title="Verified & Approved Tutor"
                    >
                      <Check size={9} strokeWidth={3} />
                    </div>
                  )}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tutorProfile.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.1rem" }}>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: tutorProfile.approval_status === "approved" ? "#059669" : "#b45309",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.2rem",
                      }}
                    >
                      {tutorProfile.approval_status === "approved" ? (
                        <>
                          <CheckCircle2 size={11} color="#059669" /> Verified Tutor
                        </>
                      ) : (
                        "Pending Approval"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Link href="/change-password" style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.85rem", borderRadius: "8px", color: "#4b5563", textDecoration: "none", fontSize: "0.82rem", fontWeight: 600 }}>
            <Key size={15} /> Change Password
          </Link>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.85rem", borderRadius: "8px", color: "#4b5563", textDecoration: "none", fontSize: "0.82rem", fontWeight: 600 }}>
            <BookOpen size={15} /> Public Website
          </Link>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "none", background: "none", color: "#ef4444", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", textAlign: "left" }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Panel ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Header */}
        <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0.85rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <button onClick={() => setSidebarOpen(true)} className="mob-menu" style={{ display: "none", background: "none", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0.45rem", cursor: "pointer", alignItems: "center" }}>
              <Menu size={18} color="#374151" />
            </button>
            <div>
              <h1 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                {activeTab === "overview" && "Tutor Dashboard"}
                {activeTab === "schedule" && "Weekly Timetable & Schedule"}
                {activeTab === "students" && "My Assigned Students"}
                {activeTab === "sessions" && "Lesson Sessions"}
                {activeTab === "reports" && "Lesson Reports & Feedback"}
                {activeTab === "requests" && "Session Change Requests"}
                {activeTab === "payouts" && "Payouts & Earnings"}
                {activeTab === "homework" && "Homework & Assignments"}
                {activeTab === "chat" && "In-App Student Messages"}
                {activeTab === "profile" && "Tutor Profile"}
              </h1>
              <p style={{ fontSize: "0.72rem", color: "#94a3b8", margin: 0 }}>
                {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <button
              onClick={() => {
                fetchDashboardData();
                fetchStudents();
                fetchSessions(sessionPage);
                fetchChangeRequests();
                fetchAssignments();
                fetchChatUnreadCount();
              }}
              title="Sync latest sessions and timetable from server"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: "0.76rem", fontWeight: 600, cursor: "pointer" }}
            >
              <RefreshCw size={13} />
              <span>Refresh</span>
            </button>

            {/* Notifications Envelope */}
            <NotificationEnvelope
              onActionClick={(actionUrl) => {
                if (actionUrl.includes("payout")) {
                  setActiveTab("payouts");
                  fetchTutorPayouts(payoutMonth);
                } else if (actionUrl.includes("session")) {
                  setActiveTab("sessions");
                  fetchSessions(1);
                } else if (actionUrl.includes("schedule") || actionUrl.includes("timetable")) {
                  setActiveTab("schedule");
                } else if (actionUrl.includes("student")) {
                  setActiveTab("students");
                  fetchStudents();
                } else if (actionUrl.includes("report")) {
                  setActiveTab("reports");
                  fetchTutorReports();
                }
              }}
            />
          </div>
        </header>

        {/* Content Area */}
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }} className="page-enter">
          {initialLoading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "55vh", gap: "1rem" }}>
              <div style={{ width: "36px", height: "36px", border: "3px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
              <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>Loading your tutor schedule & sessions…</p>
            </div>
          ) : (
            <>
              {/* ══════════════ OVERVIEW TAB ══════════════ */}
              {activeTab === "overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {/* Tutor Welcome Banner */}
                  <div
                    style={{
                      background: "linear-gradient(135deg, #0d9488 0%, #20b2a4 100%)",
                      borderRadius: "14px",
                      padding: "1.5rem 1.75rem",
                      color: "#fff",
                      boxShadow: "0 6px 20px rgba(13,148,136,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.2)", padding: "0.2rem 0.65rem", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700, marginBottom: "0.6rem" }}>
                        <Sparkles size={12} /> Samin Verified Educator
                      </div>
                      <h2 style={{ fontSize: "1.45rem", fontWeight: 800, margin: "0 0 0.35rem", letterSpacing: "-0.02em" }}>
                        Welcome back, {tutorProfile?.name || "Tutor"}!
                      </h2>
                      <p style={{ fontSize: "0.86rem", opacity: 0.92, margin: 0, maxWidth: "580px" }}>
                        {tutorProfile?.qualification ? `${tutorProfile.qualification} • ` : ""}
                        Teaching: {tutorProfile?.subjects?.join(", ") || "General Tutoring"} ({tutorProfile?.levels?.join(", ") || "All Levels"})
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "0.6rem" }}>
                      <button
                        onClick={() => setActiveTab("schedule")}
                        style={{ padding: "0.6rem 1.1rem", borderRadius: "8px", background: "#fff", color: "#0d9488", fontWeight: 700, fontSize: "0.84rem", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}
                      >
                        <Calendar size={15} /> View Schedule
                      </button>
                      <button
                        onClick={() => setActiveTab("students")}
                        style={{ padding: "0.6rem 1.1rem", borderRadius: "8px", background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: "0.84rem", border: "1px solid rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}
                      >
                        <Users size={15} /> My Students ({stats.total_students})
                      </button>
                    </div>
                  </div>

                  {/* Tutor Stats Row */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "1.1rem" }}>
                    {[
                      { icon: <Users size={24} color="#20b2a4" />, label: "Assigned Students", value: stats.total_students, bg: "#f0fdf9", border: "#99f6e4" },
                      { icon: <CalendarDays size={24} color="#3b82f6" />, label: "Upcoming Sessions", value: stats.upcoming_sessions_count, bg: "#eff6ff", border: "#bfdbfe" },
                      { icon: <CheckCircle2 size={24} color="#10b981" />, label: "Completed Lessons", value: stats.completed_sessions_count, bg: "#ecfdf5", border: "#a7f3d0" },
                    ].map(({ icon, label, value, bg, border }) => (
                      <div key={label} className="dash-card" style={{ padding: "1.2rem 1.4rem", display: "flex", alignItems: "center", gap: "1.1rem", border: `1.5px solid ${border}`, background: bg }}>
                        <div style={{ width: "3.2rem", height: "3.2rem", borderRadius: "12px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                          {icon}
                        </div>
                        <div>
                          <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{value}</div>
                          <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600, marginTop: "0.2rem" }}>{label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Next Up Session Card (Spotlight) */}
                  {nextSession && (
                    <div className="dash-card" style={{ padding: "1.4rem 1.6rem", borderLeft: "4px solid #20b2a4" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem", marginBottom: "0.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ background: "#e8f8f7", color: "#0d9488", padding: "0.25rem 0.65rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                            <Clock size={13} /> Next Upcoming Lesson
                          </span>
                          <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
                            {new Date(nextSession.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })} • {nextSession.start_time?.slice(0, 5)} - {nextSession.end_time?.slice(0, 5)}
                          </span>
                        </div>
                        <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "0.2rem 0.6rem", borderRadius: "20px", ...statusStyle[nextSession.status] }}>
                          {nextSession.status}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                        <div>
                          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
                            {nextSession.student?.student_name || "Assigned Student"} — {nextSession.subject}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.15rem" }}>
                            Parent: {nextSession.student?.parent_name || "—"} {nextSession.student?.phone ? `• Phone: ${nextSession.student.phone}` : ""} {nextSession.student?.level ? `• Level: ${nextSession.student.level}` : ""}
                          </div>
                          {nextSession.notes && (
                            <div style={{ fontSize: "0.78rem", color: "#475569", background: "#f8fafc", padding: "0.45rem 0.75rem", borderRadius: "6px", marginTop: "0.5rem", borderLeft: "3px solid #cbd5e1" }}>
                              📌 <strong>Notes:</strong> {nextSession.notes}
                            </div>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                          {nextSession.meeting_link && (
                            <a
                              href={nextSession.meeting_link}
                              target="_blank"
                              rel="noreferrer"
                              className="action-btn"
                              style={{ background: "#20b2a4", color: "#fff", padding: "0.55rem 1.1rem", fontSize: "0.84rem" }}
                            >
                              <Video size={16} /> Join Lesson Room
                            </a>
                          )}
                          <button
                            onClick={() => openEditModal(nextSession)}
                            className="action-btn"
                            style={{ background: "#fff", color: "#0f172a", border: "1.5px solid #cbd5e1", padding: "0.55rem 1rem" }}
                          >
                            <Edit3 size={15} /> Update Link / Notes
                          </button>
                          <button
                            onClick={() => quickMarkCompleted(nextSession)}
                            className="action-btn"
                            style={{ background: "#ecfdf5", color: "#065f46", border: "1.5px solid #a7f3d0", padding: "0.55rem 1rem" }}
                          >
                            <Check size={15} /> Mark Completed
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upcoming Sessions List */}
                  <div className="dash-card" style={{ padding: "1.4rem 1.6rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem" }}>
                      <div>
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Upcoming Dated Sessions</h3>
                        <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0.15rem 0 0" }}>Chronological list of next scheduled lessons</p>
                      </div>
                      <button
                        onClick={() => setActiveTab("sessions")}
                        style={{ background: "none", border: "none", color: "#20b2a4", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}
                      >
                        View all sessions <ChevronRight size={14} />
                      </button>
                    </div>

                    {upcomingSessions.length === 0 ? (
                      <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
                        No upcoming sessions currently scheduled.
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {upcomingSessions.slice(0, 5).map((session) => (
                          <div
                            key={session.id}
                            className="table-row"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "1rem",
                              padding: "0.85rem 1rem",
                              borderRadius: "10px",
                              border: "1px solid #f1f5f9",
                              flexWrap: "wrap",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", minWidth: "220px" }}>
                              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#f0fdf9", color: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem", flexShrink: 0 }}>
                                <Calendar size={18} />
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0f172a" }}>
                                  {session.student?.student_name || "Student"} • {session.subject}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.1rem" }}>
                                  {new Date(session.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} • {session.start_time?.slice(0, 5)} - {session.end_time?.slice(0, 5)}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "20px", ...statusStyle[session.status] }}>
                                {session.status}
                              </span>

                              {session.meeting_link && (
                                <a
                                  href={session.meeting_link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="action-btn"
                                  style={{ background: "#20b2a4", color: "#fff", padding: "0.35rem 0.75rem", fontSize: "0.76rem" }}
                                  title="Open Google Meet link"
                                >
                                  <Video size={13} /> Join Meet
                                </a>
                              )}

                              {/* Attendance Tracking */}
                              {session.status !== "cancelled" && (
                                <>
                                  {sessionAttendance[session.id]?.joined ? (
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                                      <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: "14px", background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                                        <CheckCircle2 size={12} color="#059669" /> In Session ({sessionAttendance[session.id].joinedAt})
                                      </span>
                                      <button
                                        onClick={() => handleLeaveSession(session.id)}
                                        disabled={attendanceLoadingId === session.id}
                                        className="action-btn"
                                        style={{ background: "#dc2626", color: "#fff", padding: "0.32rem 0.65rem", fontSize: "0.75rem" }}
                                        title="Check out of session and record duration"
                                      >
                                        <LogOut size={12} /> Leave
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleJoinSession(session.id, session.meeting_link)}
                                      disabled={attendanceLoadingId === session.id || session.status === "completed"}
                                      className="action-btn"
                                      style={{ background: "#059669", color: "#fff", padding: "0.32rem 0.7rem", fontSize: "0.75rem", opacity: session.status === "completed" ? 0.6 : 1 }}
                                      title="Check in to track session attendance"
                                    >
                                      <UserCheck size={13} /> {attendanceLoadingId === session.id ? "Checking in…" : "Check In"}
                                    </button>
                                  )}
                                </>
                              )}

                              <button
                                onClick={() => openEditModal(session)}
                                className="action-btn"
                                style={{ background: "#fff", color: "#475569", border: "1px solid #cbd5e1", padding: "0.35rem 0.7rem", fontSize: "0.76rem" }}
                                title="Edit meeting link and notes"
                              >
                                <Edit3 size={13} /> Edit
                              </button>

                              {getSessionPendingRequest(session.id) ? (
                                <span
                                  style={{
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    padding: "0.25rem 0.6rem",
                                    borderRadius: "20px",
                                    background: "#fffbeb",
                                    color: "#b45309",
                                    border: "1px solid #fde68a",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.3rem",
                                  }}
                                  title="Change request submitted and awaiting admin approval"
                                >
                                  <RotateCcw size={11} /> Change Pending
                                </span>
                              ) : session.status === "scheduled" ? (
                                <button
                                  onClick={() => openChangeRequestModal(session)}
                                  className="action-btn"
                                  style={{ background: "#fff", color: "#d97706", border: "1px solid #fde68a", padding: "0.35rem 0.7rem", fontSize: "0.76rem" }}
                                  title="Request reschedule or cancellation for this session"
                                >
                                  <RotateCcw size={12} /> Reschedule
                                </button>
                              ) : null}

                              {session.status === "scheduled" && (
                                <button
                                  onClick={() => quickMarkCompleted(session)}
                                  className="action-btn"
                                  style={{ background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0", padding: "0.35rem 0.7rem", fontSize: "0.76rem" }}
                                  title="Mark as completed"
                                >
                                  <Check size={13} /> Complete
                                </button>
                              )}

                              <button
                                onClick={() => openReportModal(session)}
                                className="action-btn"
                                style={{
                                  background: session.status === "completed" ? "#f0fdf9" : "#eff6ff",
                                  color: session.status === "completed" ? "#0d9488" : "#1d4ed8",
                                  border: session.status === "completed" ? "1px solid #99f6e4" : "1px solid #bfdbfe",
                                  padding: "0.35rem 0.7rem",
                                  fontSize: "0.76rem",
                                }}
                                title="Submit post-lesson report for this session"
                              >
                                <FileText size={13} /> Report
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Weekly Recurring Timetable Preview */}
                  <div className="dash-card" style={{ padding: "1.4rem 1.6rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <div>
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Weekly Recurring Timetable</h3>
                        <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0.15rem 0 0" }}>Your standard weekly slots assigned to students</p>
                      </div>
                      <button
                        onClick={() => setActiveTab("schedule")}
                        style={{ background: "none", border: "none", color: "#20b2a4", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}
                      >
                        Open full timetable →
                      </button>
                    </div>

                    {weeklyTimetable.length === 0 ? (
                      <div style={{ padding: "2rem 1rem", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
                        No weekly timetable slots assigned yet.
                      </div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.85rem" }}>
                        {weeklyTimetable.map((slot) => (
                          <div key={slot.id} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                              <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", background: "#e0f2fe", color: "#0369a1", padding: "0.15rem 0.5rem", borderRadius: "6px" }}>
                                {slot.day_of_week}
                              </span>
                              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#334155" }}>
                                {slot.start_time?.slice(0, 5)} - {slot.end_time?.slice(0, 5)}
                              </span>
                            </div>
                            <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#0f172a" }}>
                              {slot.student?.student_name || "Student"}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                              {slot.subject} {slot.student?.level ? `• ${slot.student.level}` : ""}
                            </div>
                            {slot.notes && (
                              <div style={{ fontSize: "0.72rem", color: "#475569", marginTop: "0.4rem", fontStyle: "italic" }}>
                                "{slot.notes}"
                              </div>
                            )}
                            {slot.meeting_link && (
                              <a
                                href={slot.meeting_link}
                                target="_blank"
                                rel="noreferrer"
                                style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.74rem", color: "#20b2a4", fontWeight: 700, textDecoration: "none", marginTop: "0.6rem" }}
                              >
                                <Video size={13} /> {slot.meeting_link}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══════════════ SCHEDULE / TIMETABLE TAB ══════════════ */}
              {activeTab === "schedule" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="page-enter">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem" }}>
                    <div>
                      <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                        Weekly Recurring Schedule & Upcoming Lessons
                      </h2>
                      <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.15rem 0 0" }}>
                        View your regular teaching schedule by day of the week and all upcoming calendar sessions
                      </p>
                    </div>
                    <button
                      onClick={fetchScheduleData}
                      style={{ padding: "0.45rem 0.85rem", borderRadius: "8px", background: "#fff", border: "1px solid #cbd5e1", fontSize: "0.8rem", fontWeight: 600, color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" }}
                    >
                      <RefreshCw size={13} /> Refresh Schedule
                    </button>
                  </div>

                  {/* Day-of-week breakdown */}
                  <div className="dash-card" style={{ padding: "1.4rem" }}>
                    <h3 style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem" }}>
                      Weekly Timetable Slots
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                      {daysOfWeek.map((day) => {
                        const slots = groupedTimetable[day] || [];
                        const isToday = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() === day;

                        return (
                          <div
                            key={day}
                            style={{
                              background: isToday ? "#f0fdf9" : "#ffffff",
                              border: isToday ? "2px solid #20b2a4" : "1px solid #e2e8f0",
                              borderRadius: "12px",
                              padding: "1rem",
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.6rem",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.5rem" }}>
                              <span style={{ fontWeight: 800, fontSize: "0.85rem", textTransform: "capitalize", color: isToday ? "#0d9488" : "#0f172a" }}>
                                {day} {isToday && "• Today"}
                              </span>
                              <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>
                                {slots.length} lesson{slots.length === 1 ? "" : "s"}
                              </span>
                            </div>

                            {slots.length === 0 ? (
                              <div style={{ fontSize: "0.75rem", color: "#94a3b8", padding: "1rem 0", textAlign: "center" }}>
                                No slots scheduled
                              </div>
                            ) : (
                              slots.map((slot) => (
                                <div key={slot.id} style={{ background: isToday ? "#fff" : "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                                    <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#0d9488", background: "#e8f8f7", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                                      {slot.start_time?.slice(0, 5)} - {slot.end_time?.slice(0, 5)}
                                    </span>
                                    <span style={{ fontSize: "0.72rem", color: "#64748b" }}>{slot.subject}</span>
                                  </div>
                                  <div style={{ fontWeight: 700, fontSize: "0.86rem", color: "#0f172a" }}>
                                    {slot.student?.student_name || "Student"}
                                  </div>
                                  <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                                    Parent: {slot.student?.parent_name || "—"} {slot.student?.phone ? `• ${slot.student.phone}` : ""}
                                  </div>
                                  {slot.notes && (
                                    <div style={{ fontSize: "0.72rem", color: "#475569", marginTop: "0.3rem", fontStyle: "italic" }}>
                                      "{slot.notes}"
                                    </div>
                                  )}
                                  {slot.meeting_link && (
                                    <a
                                      href={slot.meeting_link}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.74rem", color: "#20b2a4", fontWeight: 700, marginTop: "0.45rem", textDecoration: "none" }}
                                    >
                                      <Video size={13} /> Meeting Room
                                    </a>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Upcoming Sessions List */}
                  <div className="dash-card" style={{ padding: "1.4rem" }}>
                    <h3 style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem" }}>
                      Upcoming Calendar Sessions
                    </h3>

                    {upcomingSessions.length === 0 ? (
                      <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
                        No upcoming sessions found.
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {upcomingSessions.map((session) => (
                          <div
                            key={session.id}
                            className="table-row"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "1rem",
                              padding: "0.85rem 1rem",
                              borderRadius: "10px",
                              border: "1px solid #f1f5f9",
                              flexWrap: "wrap",
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0f172a" }}>
                                {session.student?.student_name || "Student"} — {session.subject}
                              </div>
                              <div style={{ fontSize: "0.76rem", color: "#64748b", marginTop: "0.15rem" }}>
                                📅 {new Date(session.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })} • 🕒 {session.start_time?.slice(0, 5)} - {session.end_time?.slice(0, 5)}
                              </div>
                              {session.notes && (
                                <div style={{ fontSize: "0.74rem", color: "#475569", marginTop: "0.25rem" }}>
                                  📌 Notes: {session.notes}
                                </div>
                              )}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "20px", ...statusStyle[session.status] }}>
                                {session.status}
                              </span>

                              {session.meeting_link && (
                                <a
                                  href={session.meeting_link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="action-btn"
                                  style={{ background: "#20b2a4", color: "#fff" }}
                                >
                                  <Video size={13} /> Join Meet
                                </a>
                              )}

                              {/* Attendance Tracking */}
                              {session.status !== "cancelled" && (
                                <>
                                  {sessionAttendance[session.id]?.joined ? (
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                                      <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: "14px", background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                                        <CheckCircle2 size={12} color="#059669" /> In Session ({sessionAttendance[session.id].joinedAt})
                                      </span>
                                      <button
                                        onClick={() => handleLeaveSession(session.id)}
                                        disabled={attendanceLoadingId === session.id}
                                        className="action-btn"
                                        style={{ background: "#dc2626", color: "#fff", padding: "0.32rem 0.65rem", fontSize: "0.75rem" }}
                                        title="Check out of session and record duration"
                                      >
                                        <LogOut size={12} /> Leave
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleJoinSession(session.id, session.meeting_link)}
                                      disabled={attendanceLoadingId === session.id || session.status === "completed"}
                                      className="action-btn"
                                      style={{ background: "#059669", color: "#fff", padding: "0.32rem 0.7rem", fontSize: "0.75rem", opacity: session.status === "completed" ? 0.6 : 1 }}
                                      title="Check in to track session attendance"
                                    >
                                      <UserCheck size={13} /> {attendanceLoadingId === session.id ? "Checking in…" : "Check In"}
                                    </button>
                                  )}
                                </>
                              )}

                              <button
                                onClick={() => openEditModal(session)}
                                className="action-btn"
                                style={{ background: "#fff", color: "#475569", border: "1px solid #cbd5e1" }}
                              >
                                <Edit3 size={13} /> Notes
                              </button>

                              {getSessionPendingRequest(session.id) ? (
                                <span
                                  style={{
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    padding: "0.25rem 0.6rem",
                                    borderRadius: "20px",
                                    background: "#fffbeb",
                                    color: "#b45309",
                                    border: "1px solid #fde68a",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.3rem",
                                  }}
                                  title="Change request submitted and awaiting admin approval"
                                >
                                  <RotateCcw size={11} /> Change Pending
                                </span>
                              ) : session.status === "scheduled" ? (
                                <button
                                  onClick={() => openChangeRequestModal(session)}
                                  className="action-btn"
                                  style={{ background: "#fff", color: "#d97706", border: "1px solid #fde68a" }}
                                  title="Request reschedule or cancellation for this session"
                                >
                                  <RotateCcw size={12} /> Reschedule
                                </button>
                              ) : null}

                              {session.status === "scheduled" && (
                                <button
                                  onClick={() => quickMarkCompleted(session)}
                                  className="action-btn"
                                  style={{ background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0" }}
                                >
                                  <Check size={13} /> Complete
                                </button>
                              )}

                              <button
                                onClick={() => openReportModal(session)}
                                className="action-btn"
                                style={{
                                  background: session.status === "completed" ? "#f0fdf9" : "#eff6ff",
                                  color: session.status === "completed" ? "#0d9488" : "#1d4ed8",
                                  border: session.status === "completed" ? "1px solid #99f6e4" : "1px solid #bfdbfe",
                                }}
                              >
                                <FileText size={13} /> Report
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══════════════ STUDENTS TAB ══════════════ */}
              {activeTab === "students" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="page-enter">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem" }}>
                    <div>
                      <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                        My Assigned Students ({students.length})
                      </h2>
                      <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.15rem 0 0" }}>
                        Students currently learning with you on Samin Home Tutors
                      </p>
                    </div>

                    <div className="search-box" style={{ width: "100%", maxWidth: "320px" }}>
                      <Search size={15} color="#94a3b8" />
                      <input
                        placeholder="Search student, parent, or subject…"
                        value={searchStudent}
                        onChange={(e) => setSearchStudent(e.target.value)}
                      />
                    </div>
                  </div>

                  {isLoadingStudents ? (
                    <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                      <div style={{ width: "28px", height: "28px", border: "2.5px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 0.6rem" }} />
                      <span style={{ fontSize: "0.82rem" }}>Loading students…</span>
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="dash-card" style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#94a3b8" }}>
                      <Users size={36} color="#cbd5e1" style={{ margin: "0 auto 0.8rem" }} />
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#475569" }}>No students found</div>
                      <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                        {searchStudent ? "Try a different search term" : "No students currently assigned to your timetable"}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.1rem" }}>
                      {filteredStudents.map((st) => (
                        <div key={st.id} className="dash-card" style={{ padding: "1.3rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.05rem", flexShrink: 0 }}>
                              {st.student_name?.charAt(0) || "S"}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontWeight: 800, fontSize: "0.98rem", color: "#0f172a" }}>
                                {st.student_name}
                              </div>
                              <div style={{ fontSize: "0.75rem", color: "#0d9488", fontWeight: 600 }}>
                                {st.subject || "Subject"} • {st.level || "Standard Level"}
                              </div>
                            </div>
                            <span style={{ background: "#ecfdf5", color: "#065f46", fontSize: "0.7rem", fontWeight: 800, padding: "0.2rem 0.55rem", borderRadius: "12px", border: "1px solid #a7f3d0" }}>
                              {st.total_completed_lessons || 0} Lessons
                            </span>
                          </div>

                          <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "0.75rem", border: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.78rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#475569" }}>
                              <Users size={14} color="#94a3b8" />
                              <span>Parent: <strong>{st.parent_name || "—"}</strong></span>
                            </div>
                            {st.email && (
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#475569" }}>
                                <Mail size={14} color="#94a3b8" />
                                <a href={`mailto:${st.email}`} style={{ color: "#20b2a4", textDecoration: "none" }}>{st.email}</a>
                              </div>
                            )}
                            {st.phone && (
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#475569" }}>
                                <Phone size={14} color="#94a3b8" />
                                <a href={`tel:${st.phone}`} style={{ color: "#475569", textDecoration: "none" }}>{st.phone}</a>
                              </div>
                            )}
                          </div>

                          {/* Timetable slots */}
                          {st.timetable_slots && st.timetable_slots.length > 0 && (
                            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.65rem" }}>
                              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                                Weekly Slots:
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                {st.timetable_slots.map((sl) => (
                                  <div key={sl.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.75rem", background: "#f1f5f9", padding: "0.25rem 0.55rem", borderRadius: "5px" }}>
                                    <span style={{ fontWeight: 700, textTransform: "capitalize", color: "#0f172a" }}>{sl.day_of_week}</span>
                                    <span style={{ color: "#475569" }}>{sl.start_time?.slice(0, 5)} - {sl.end_time?.slice(0, 5)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {st.pivot_notes && (
                            <div style={{ fontSize: "0.73rem", color: "#64748b", fontStyle: "italic", background: "#fffbeb", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #fde68a" }}>
                              📌 {st.pivot_notes}
                            </div>
                          )}

                          <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto", flexWrap: "wrap" }}>
                            <button
                              onClick={() => {
                                setSessionStudentId(String(st.id));
                                setActiveTab("sessions");
                                fetchSessions(1);
                              }}
                              className="action-btn"
                              style={{ flex: 1, minWidth: "130px", justifyContent: "center", background: "#f0fdf9", color: "#0d9488", border: "1.5px solid #99f6e4" }}
                            >
                              <CalendarDays size={14} /> Sessions
                            </button>
                            <button
                              onClick={() => openStudentReportsModal(st)}
                              className="action-btn"
                              style={{ flex: 1, minWidth: "130px", justifyContent: "center", background: "#f8fafc", color: "#0284c7", border: "1.5px solid #bae6fd" }}
                            >
                              <FileText size={14} /> Reports
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ══════════════ SESSIONS TAB (FULL FILTERS & PAGINATION) ══════════════ */}
              {activeTab === "sessions" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="page-enter">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem" }}>
                    <div>
                      <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                        All Lesson Sessions
                      </h2>
                      <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.15rem 0 0" }}>
                        Filter, track, update notes, and join live online lesson sessions
                      </p>
                    </div>

                    <button
                      onClick={() => fetchSessions(sessionPage)}
                      style={{ padding: "0.45rem 0.85rem", borderRadius: "8px", background: "#fff", border: "1px solid #cbd5e1", fontSize: "0.8rem", fontWeight: 600, color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" }}
                    >
                      <RefreshCw size={13} /> Refresh List
                    </button>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="dash-card" style={{ padding: "1rem 1.25rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <Filter size={15} color="#64748b" />
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#334155" }}>Status:</span>
                    </div>

                    {["all", "scheduled", "completed", "cancelled", "rescheduled"].map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          setSessionFilterStatus(st);
                          // will re-fetch
                        }}
                        style={{
                          padding: "0.32rem 0.75rem",
                          borderRadius: "20px",
                          border: sessionFilterStatus === st ? "1.5px solid #20b2a4" : "1px solid #e2e8f0",
                          background: sessionFilterStatus === st ? "#e8f8f7" : "#fff",
                          color: sessionFilterStatus === st ? "#0d9488" : "#475569",
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          textTransform: "capitalize",
                        }}
                      >
                        {st}
                      </button>
                    ))}

                    <div style={{ height: "20px", width: "1px", background: "#e2e8f0", margin: "0 0.25rem" }} />

                    {/* Student selector */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#334155" }}>Student:</span>
                      <select
                        value={sessionStudentId}
                        onChange={(e) => setSessionStudentId(e.target.value)}
                        style={{ padding: "0.32rem 0.65rem", borderRadius: "6px", border: "1.5px solid #cbd5e1", fontSize: "0.78rem", outline: "none", background: "#fff" }}
                      >
                        <option value="all">All Students</option>
                        {students.map((s) => (
                          <option key={s.id} value={String(s.id)}>
                            {s.student_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* From Date */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <span style={{ fontSize: "0.76rem", color: "#64748b" }}>From:</span>
                      <input
                        type="date"
                        value={sessionFromDate}
                        onChange={(e) => setSessionFromDate(e.target.value)}
                        style={{ padding: "0.28rem 0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.75rem" }}
                      />
                    </div>

                    {/* To Date */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <span style={{ fontSize: "0.76rem", color: "#64748b" }}>To:</span>
                      <input
                        type="date"
                        value={sessionToDate}
                        onChange={(e) => setSessionToDate(e.target.value)}
                        style={{ padding: "0.28rem 0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.75rem" }}
                      />
                    </div>

                    <button
                      onClick={() => fetchSessions(1)}
                      style={{ padding: "0.38rem 0.95rem", borderRadius: "6px", background: "#0d9488", color: "#fff", border: "none", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", marginLeft: "auto" }}
                    >
                      Apply Filters
                    </button>
                    {(sessionFilterStatus !== "all" || sessionStudentId !== "all" || sessionFromDate || sessionToDate) && (
                      <button
                        onClick={() => {
                          setSessionFilterStatus("all");
                          setSessionStudentId("all");
                          setSessionFromDate("");
                          setSessionToDate("");
                          fetchSessions(1);
                        }}
                        style={{ padding: "0.38rem 0.65rem", borderRadius: "6px", background: "#f1f5f9", color: "#475569", border: "none", fontWeight: 600, fontSize: "0.75rem", cursor: "pointer" }}
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Sessions Table */}
                  <div className="dash-card" style={{ overflow: "hidden" }}>
                    {isLoadingSessions ? (
                      <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                        <div style={{ width: "28px", height: "28px", border: "2.5px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 0.6rem" }} />
                        <span style={{ fontSize: "0.82rem" }}>Loading sessions…</span>
                      </div>
                    ) : !sessionsData || sessionsData.data.length === 0 ? (
                      <div style={{ padding: "3.5rem 1rem", textAlign: "center", color: "#94a3b8" }}>
                        <CalendarDays size={38} color="#cbd5e1" style={{ margin: "0 auto 0.8rem" }} />
                        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#475569" }}>No sessions found</div>
                        <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                          Try adjusting your status or date filters
                        </div>
                      </div>
                    ) : (
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", textAlign: "left" }}>
                          <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: 700 }}>
                              <th style={{ padding: "0.85rem 1rem" }}>Date & Time</th>
                              <th style={{ padding: "0.85rem 1rem" }}>Student</th>
                              <th style={{ padding: "0.85rem 1rem" }}>Subject</th>
                              <th style={{ padding: "0.85rem 1rem" }}>Status</th>
                              <th style={{ padding: "0.85rem 1rem" }}>Lesson Notes</th>
                              <th style={{ padding: "0.85rem 1rem" }}>Meeting Link</th>
                              <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sessionsData.data.map((sess) => (
                              <tr key={sess.id} className="table-row" style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "0.85rem 1rem", whiteSpace: "nowrap" }}>
                                  <div style={{ fontWeight: 700, color: "#0f172a" }}>
                                    {new Date(sess.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                                  </div>
                                  <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                                    {sess.start_time?.slice(0, 5)} - {sess.end_time?.slice(0, 5)}
                                  </div>
                                </td>
                                <td style={{ padding: "0.85rem 1rem" }}>
                                  <div style={{ fontWeight: 700, color: "#0f172a" }}>
                                    {sess.student?.student_name || "Student"}
                                  </div>
                                  <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                                    Parent: {sess.student?.parent_name || "—"} {sess.student?.level ? `(${sess.student.level})` : ""}
                                  </div>
                                </td>
                                <td style={{ padding: "0.85rem 1rem", fontWeight: 600, color: "#334155" }}>
                                  {sess.subject}
                                </td>
                                <td style={{ padding: "0.85rem 1rem" }}>
                                  <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "0.2rem 0.55rem", borderRadius: "20px", ...statusStyle[sess.status] }}>
                                    {sess.status}
                                  </span>
                                </td>
                                <td style={{ padding: "0.85rem 1rem", maxWidth: "220px" }}>
                                  {sess.notes ? (
                                    <span style={{ fontSize: "0.75rem", color: "#475569", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }} title={sess.notes}>
                                      {sess.notes}
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontStyle: "italic" }}>No notes added</span>
                                  )}
                                </td>
                                <td style={{ padding: "0.85rem 1rem", whiteSpace: "nowrap" }}>
                                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                                    {sess.meeting_link && (
                                      <a
                                        href={sess.meeting_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", background: "#e8f8f7", color: "#0d9488", padding: "0.25rem 0.6rem", borderRadius: "6px", fontWeight: 700, fontSize: "0.74rem", textDecoration: "none" }}
                                        title="Open Google Meet"
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
                                          title="Check out of session and record duration"
                                        >
                                          <LogOut size={12} /> Leave
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleJoinSession(sess.id, sess.meeting_link)}
                                          disabled={attendanceLoadingId === sess.id || sess.status === "completed"}
                                          className="action-btn"
                                          style={{ background: "#059669", color: "#fff", padding: "0.25rem 0.55rem", fontSize: "0.72rem", opacity: sess.status === "completed" ? 0.6 : 1 }}
                                          title="Check in to track session attendance"
                                        >
                                          <UserCheck size={12} /> In
                                        </button>
                                      )
                                    )}
                                  </div>
                                </td>
                                <td style={{ padding: "0.85rem 1rem", textAlign: "right", whiteSpace: "nowrap" }}>
                                  <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                                    <button
                                      onClick={() => openEditModal(sess)}
                                      className="action-btn"
                                      style={{ background: "#f8fafc", color: "#334155", border: "1px solid #cbd5e1", padding: "0.3rem 0.65rem", fontSize: "0.75rem" }}
                                      title="Update meeting link or lesson notes"
                                    >
                                      <Edit3 size={13} /> Notes
                                    </button>
                                    {getSessionPendingRequest(sess.id) ? (
                                      <span
                                        style={{
                                          fontSize: "0.72rem",
                                          fontWeight: 700,
                                          padding: "0.2rem 0.5rem",
                                          borderRadius: "16px",
                                          background: "#fffbeb",
                                          color: "#b45309",
                                          border: "1px solid #fde68a",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "0.25rem",
                                        }}
                                        title="Change request awaiting admin review"
                                      >
                                        <RotateCcw size={10} /> Pending
                                      </span>
                                    ) : sess.status === "scheduled" ? (
                                      <button
                                        onClick={() => openChangeRequestModal(sess)}
                                        className="action-btn"
                                        style={{ background: "#fff", color: "#d97706", border: "1px solid #fde68a", padding: "0.3rem 0.65rem", fontSize: "0.75rem" }}
                                        title="Request to reschedule or cancel this session"
                                      >
                                        <RotateCcw size={12} /> Reschedule
                                      </button>
                                    ) : null}
                                    {sess.status === "scheduled" && (
                                      <button
                                        onClick={() => quickMarkCompleted(sess)}
                                        className="action-btn"
                                        style={{ background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0", padding: "0.3rem 0.65rem", fontSize: "0.75rem" }}
                                        title="Mark session as completed"
                                      >
                                        <Check size={13} /> Complete
                                      </button>
                                    )}
                                    <button
                                      onClick={() => openReportModal(sess)}
                                      className="action-btn"
                                      style={{
                                        background: sess.status === "completed" ? "#f0fdf9" : "#eff6ff",
                                        color: sess.status === "completed" ? "#0d9488" : "#1d4ed8",
                                        border: sess.status === "completed" ? "1px solid #99f6e4" : "1px solid #bfdbfe",
                                        padding: "0.3rem 0.65rem",
                                        fontSize: "0.75rem",
                                      }}
                                      title="Submit or edit post-lesson report"
                                    >
                                      <FileText size={13} /> Report
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Pagination */}
                    {sessionsData && sessionsData.last_page > 1 && (
                      <div style={{ padding: "0.85rem 1.25rem", borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                        <div style={{ fontSize: "0.76rem", color: "#64748b" }}>
                          Showing <strong>{sessionsData.from || 0}</strong> to <strong>{sessionsData.to || 0}</strong> of <strong>{sessionsData.total}</strong> sessions
                        </div>
                        <div style={{ display: "flex", gap: "0.35rem" }}>
                          <button
                            disabled={sessionsData.current_page <= 1}
                            onClick={() => fetchSessions(sessionsData.current_page - 1)}
                            style={{ padding: "0.32rem 0.65rem", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff", fontSize: "0.75rem", cursor: sessionsData.current_page <= 1 ? "not-allowed" : "pointer", opacity: sessionsData.current_page <= 1 ? 0.5 : 1 }}
                          >
                            Previous
                          </button>
                          {Array.from({ length: sessionsData.last_page }).map((_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => fetchSessions(i + 1)}
                              style={{
                                padding: "0.32rem 0.65rem",
                                borderRadius: "6px",
                                border: sessionsData.current_page === i + 1 ? "1.5px solid #20b2a4" : "1px solid #cbd5e1",
                                background: sessionsData.current_page === i + 1 ? "#20b2a4" : "#fff",
                                color: sessionsData.current_page === i + 1 ? "#fff" : "#334155",
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                cursor: "pointer",
                              }}
                            >
                              {i + 1}
                            </button>
                          ))}
                          <button
                            disabled={sessionsData.current_page >= sessionsData.last_page}
                            onClick={() => fetchSessions(sessionsData.current_page + 1)}
                            style={{ padding: "0.32rem 0.65rem", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff", fontSize: "0.75rem", cursor: sessionsData.current_page >= sessionsData.last_page ? "not-allowed" : "pointer", opacity: sessionsData.current_page >= sessionsData.last_page ? 0.5 : 1 }}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══════════════ LESSON REPORTS TAB (Tutor Portal) ══════════════ */}
              {activeTab === "reports" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="page-enter">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem" }}>
                    <div>
                      <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                        Lesson Reports &amp; Feedback
                      </h2>
                      <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.15rem 0 0" }}>
                        Post-lesson academic reports, student engagement metrics, and feedback for parents
                      </p>
                    </div>

                    <button
                      onClick={fetchTutorReports}
                      style={{ padding: "0.45rem 0.85rem", borderRadius: "8px", background: "#fff", border: "1px solid #cbd5e1", fontSize: "0.8rem", fontWeight: 600, color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" }}
                    >
                      <RefreshCw size={13} className={loadingTutorReports ? "spin" : ""} /> Refresh Reports
                    </button>
                  </div>

                  {/* Search and Guidance Card */}
                  <div className="dash-card" style={{ padding: "1.1rem 1.25rem", background: "linear-gradient(135deg,#f0fdf9,#e0f2fe)", border: "1.5px solid #ccfbf1", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#20b2a4", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" }}>Why Lesson Reports Matter</div>
                        <div style={{ fontSize: "0.76rem", color: "#475569" }}>
                          Submitting a post-lesson report marks the session as <strong>completed</strong> and keeps parents informed on topics covered, engagement, and homework.
                        </div>
                      </div>
                    </div>

                    <div className="search-box" style={{ width: "100%", maxWidth: "280px", background: "#fff" }}>
                      <Search size={15} color="#94a3b8" />
                      <input
                        placeholder="Search reports…"
                        value={reportSearchQuery}
                        onChange={(e) => setReportSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Reports List */}
                  {loadingTutorReports ? (
                    <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                      <div style={{ width: "28px", height: "28px", border: "2.5px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 0.6rem" }} />
                      <span style={{ fontSize: "0.82rem" }}>Loading lesson reports…</span>
                    </div>
                  ) : tutorReports.length === 0 ? (
                    <div className="dash-card" style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#94a3b8" }}>
                      <FileText size={38} color="#cbd5e1" style={{ margin: "0 auto 0.8rem" }} />
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#475569" }}>No Lesson Reports Submitted Yet</div>
                      <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.25rem", maxWidth: "450px", margin: "0.25rem auto 1rem" }}>
                        Click the <strong>Report</strong> button next to any completed or scheduled session in your Timetable or Sessions tab to submit your first report.
                      </div>
                      <button
                        onClick={() => setActiveTab("sessions")}
                        className="action-btn"
                        style={{ background: "#20b2a4", color: "#fff", padding: "0.5rem 1.25rem", margin: "0 auto" }}
                      >
                        Go to Lesson Sessions
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
                      {tutorReports
                        .filter((rep) => {
                          if (!reportSearchQuery) return true;
                          const q = reportSearchQuery.toLowerCase();
                          return (
                            rep.subject?.toLowerCase().includes(q) ||
                            rep.topics_covered?.toLowerCase().includes(q) ||
                            rep.student?.student_name?.toLowerCase().includes(q)
                          );
                        })
                        .map((rep) => (
                          <div key={rep.id} className="dash-card" style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <div>
                                <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>{rep.subject}</span>
                                <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                                  📅 {rep.date} • {rep.student?.student_name || "Student"}
                                </div>
                              </div>
                              <span style={{ fontSize: "0.8rem", color: "#f59e0b", fontWeight: 700 }}>
                                {"★".repeat(Math.min(5, Math.max(1, Number(rep.student_engagement) || 5)))}
                              </span>
                            </div>

                            <div style={{ background: "#f8fafc", padding: "0.65rem 0.8rem", borderRadius: "8px", fontSize: "0.8rem", color: "#334155", lineHeight: 1.5 }}>
                              <strong>Topics:</strong> {rep.topics_covered}
                            </div>

                            {rep.notes_for_parents && (
                              <div style={{ fontSize: "0.75rem", color: "#0369a1", background: "#f0f9ff", padding: "0.4rem 0.65rem", borderRadius: "6px" }}>
                                💬 {rep.notes_for_parents}
                              </div>
                            )}

                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
                              <button
                                onClick={() => setSelectedReportView(rep)}
                                className="action-btn"
                                style={{ background: "#f0fdf9", color: "#0d9488", border: "1px solid #99f6e4", fontSize: "0.75rem" }}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* ══════════════ CHANGE REQUESTS TAB ══════════════ */}
              {activeTab === "requests" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.35rem" }} className="page-enter">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem" }}>
                    <div>
                      <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                        Session Change Requests
                      </h2>
                      <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.15rem 0 0" }}>
                        Track your reschedule and cancellation requests submitted for admin review
                      </p>
                    </div>

                    <button
                      onClick={fetchChangeRequests}
                      disabled={loadingChangeRequests}
                      style={{
                        padding: "0.45rem 0.85rem",
                        borderRadius: "8px",
                        background: "#fff",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#475569",
                        cursor: loadingChangeRequests ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <RefreshCw size={13} style={{ animation: loadingChangeRequests ? "spin 0.8s linear infinite" : "none" }} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {/* Summary Metric Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.85rem" }}>
                    <div className="dash-card" style={{ padding: "1rem 1.2rem", borderLeft: "4px solid #0d9488" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Total Requests</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>
                        {changeRequests.length}
                      </div>
                    </div>

                    <div className="dash-card" style={{ padding: "1rem 1.2rem", borderLeft: "4px solid #f59e0b", background: "#fffdfa" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#b45309", textTransform: "uppercase" }}>Awaiting Review</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#b45309", marginTop: "0.2rem" }}>
                        {changeRequests.filter((r) => r.status === "pending").length}
                      </div>
                    </div>

                    <div className="dash-card" style={{ padding: "1rem 1.2rem", borderLeft: "4px solid #10b981", background: "#fafffd" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#047857", textTransform: "uppercase" }}>Approved</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#047857", marginTop: "0.2rem" }}>
                        {changeRequests.filter((r) => r.status === "approved").length}
                      </div>
                    </div>

                    <div className="dash-card" style={{ padding: "1rem 1.2rem", borderLeft: "4px solid #ef4444", background: "#fffafa" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#b91c1c", textTransform: "uppercase" }}>Declined</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#b91c1c", marginTop: "0.2rem" }}>
                        {changeRequests.filter((r) => r.status === "rejected").length}
                      </div>
                    </div>
                  </div>

                  {/* Filter tabs */}
                  <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", alignItems: "center" }}>
                    {(["all", "pending", "approved", "rejected"] as const).map((st) => {
                      const count = st === "all" ? changeRequests.length : changeRequests.filter((r) => r.status === st).length;
                      const isActive = changeRequestFilter === st;
                      return (
                        <button
                          key={st}
                          onClick={() => setChangeRequestFilter(st)}
                          style={{
                            padding: "0.4rem 0.85rem",
                            borderRadius: "20px",
                            border: isActive ? "1.5px solid #20b2a4" : "1px solid #e2e8f0",
                            background: isActive ? "#e8f8f7" : "#fff",
                            color: isActive ? "#0d9488" : "#475569",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            textTransform: "capitalize",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                          }}
                        >
                          <span>{st}</span>
                          <span style={{ fontSize: "0.7rem", opacity: 0.85 }}>({count})</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Requests List */}
                  {loadingChangeRequests ? (
                    <div className="dash-card" style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                      <div style={{ width: "28px", height: "28px", border: "2.5px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 0.6rem" }} />
                      <span style={{ fontSize: "0.82rem" }}>Loading change requests…</span>
                    </div>
                  ) : changeRequests.filter((r) => changeRequestFilter === "all" || r.status === changeRequestFilter).length === 0 ? (
                    <div className="dash-card" style={{ padding: "3.5rem 1.5rem", textAlign: "center", color: "#94a3b8" }}>
                      <RotateCcw size={38} color="#cbd5e1" style={{ margin: "0 auto 0.8rem" }} />
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#475569" }}>No change requests found</div>
                      <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.3rem", maxWidth: "420px", margin: "0.3rem auto 0" }}>
                        {changeRequestFilter !== "all"
                          ? `There are no change requests with '${changeRequestFilter}' status.`
                          : "You haven't submitted any reschedule or cancellation requests yet. You can request changes directly from your 'My Schedule' or 'All Sessions' tabs."}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                      {changeRequests
                        .filter((r) => changeRequestFilter === "all" || r.status === changeRequestFilter)
                        .map((req) => {
                          const isReschedule = req.request_type === "reschedule";
                          const isPending = req.status === "pending";
                          const isApproved = req.status === "approved";
                          const isRejected = req.status === "rejected";

                          return (
                            <div
                              key={req.id}
                              className="dash-card"
                              style={{
                                padding: "1.25rem 1.4rem",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.85rem",
                                borderLeft: isPending ? "4px solid #f59e0b" : isApproved ? "4px solid #10b981" : "4px solid #ef4444",
                              }}
                            >
                              {/* Header row */}
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                  <span
                                    style={{
                                      fontSize: "0.74rem",
                                      fontWeight: 800,
                                      padding: "0.2rem 0.6rem",
                                      borderRadius: "6px",
                                      background: isReschedule ? "#e0f2fe" : "#fee2e2",
                                      color: isReschedule ? "#0369a1" : "#991b1b",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.03em",
                                    }}
                                  >
                                    {isReschedule ? "Reschedule Request" : "Cancellation Request"}
                                  </span>

                                  <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>
                                    Request #{req.id} • Session #{req.lesson_session_id}
                                  </span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                  <span
                                    style={{
                                      fontSize: "0.72rem",
                                      fontWeight: 800,
                                      padding: "0.22rem 0.65rem",
                                      borderRadius: "20px",
                                      ...statusStyle[req.status],
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.3rem",
                                    }}
                                  >
                                    {isPending && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#b45309" }} />}
                                    {isApproved && "✓ "}
                                    {isRejected && "✕ "}
                                    {isPending ? "Awaiting Admin Review" : req.status}
                                  </span>

                                  {req.created_at && (
                                    <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                                      {new Date(req.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Lesson and Proposed Details */}
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.85rem", background: "#f8fafc", padding: "0.85rem 1rem", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                                <div>
                                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>Original Lesson Session</div>
                                  <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#0f172a", marginTop: "0.15rem" }}>
                                    {req.session?.student?.student_name || "Student"} • {req.session?.subject || "Subject"}
                                  </div>
                                  <div style={{ fontSize: "0.76rem", color: "#475569", marginTop: "0.1rem" }}>
                                    📅 {req.session?.date ? new Date(req.session.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : "Scheduled Session"} • 🕒 {req.session?.start_time?.slice(0, 5)} - {req.session?.end_time?.slice(0, 5)}
                                  </div>
                                </div>

                                {isReschedule && (
                                  <div>
                                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.03em" }}>Proposed New Schedule</div>
                                    <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#0369a1", marginTop: "0.15rem" }}>
                                      📅 {req.proposed_date ? new Date(req.proposed_date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "—"}
                                    </div>
                                    <div style={{ fontSize: "0.76rem", color: "#0284c7", fontWeight: 700, marginTop: "0.1rem" }}>
                                      🕒 {req.proposed_start_time?.slice(0, 5)} {req.proposed_end_time ? `- ${req.proposed_end_time.slice(0, 5)}` : ""}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Reason provided by tutor */}
                              <div style={{ fontSize: "0.82rem", color: "#334155" }}>
                                <strong style={{ color: "#0f172a" }}>Reason: </strong>
                                <span style={{ fontStyle: "italic", color: "#475569" }}>"{req.reason}"</span>
                              </div>

                              {/* Admin notes if provided */}
                              {req.admin_notes && (
                                <div style={{ background: isApproved ? "#f0fdf9" : "#fef2f2", border: isApproved ? "1px solid #99f6e4" : "1px solid #fecaca", borderRadius: "8px", padding: "0.6rem 0.85rem", fontSize: "0.78rem", color: isApproved ? "#065f46" : "#991b1b" }}>
                                  <strong>Admin Feedback: </strong> {req.admin_notes}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* ══════════════ PAYOUTS TAB (GET /api/tutor/payouts) ══════════════ */}
              {activeTab === "payouts" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="page-enter">
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                    <div>
                      <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <CreditCard size={20} color="#0d9488" />
                        Monthly Payouts & Earnings Breakdown
                      </h2>
                      <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.15rem 0 0" }}>
                        Your completed session earnings based on your set hourly rate
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#334155" }}>Month:</span>
                      <input
                        type="month"
                        value={payoutMonth}
                        onChange={(e) => {
                          const m = e.target.value;
                          setPayoutMonth(m);
                          fetchTutorPayouts(m);
                        }}
                        style={{
                          padding: "0.4rem 0.65rem",
                          borderRadius: "8px",
                          border: "1.5px solid #cbd5e1",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color: "#0f172a",
                          cursor: "pointer",
                          outline: "none",
                        }}
                      />
                      <button
                        onClick={() => fetchTutorPayouts(payoutMonth)}
                        disabled={loadingPayoutData}
                        style={{
                          background: "#f1f5f9",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          padding: "0.4rem 0.7rem",
                          fontSize: "0.76rem",
                          fontWeight: 600,
                          color: "#475569",
                          cursor: loadingPayoutData ? "not-allowed" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                        }}
                      >
                        <RefreshCw size={13} className={loadingPayoutData ? "spin" : ""} /> Refresh
                      </button>
                    </div>
                  </div>

                  {/* Summary Stat Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem" }}>
                    <div className="dash-card" style={{ padding: "1.1rem 1.25rem", borderLeft: "4px solid #94a3b8" }}>
                      <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Hourly Rate</div>
                      <div style={{ fontSize: "1.55rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>
                        {payoutData?.hourly_rate ? `₦${Number(payoutData.hourly_rate).toLocaleString()}` : "—"}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.25rem" }}>per hour</div>
                    </div>
                    <div className="dash-card" style={{ padding: "1.1rem 1.25rem", borderLeft: "4px solid #0284c7" }}>
                      <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Total Hours</div>
                      <div style={{ fontSize: "1.55rem", fontWeight: 800, color: "#0284c7", marginTop: "0.2rem" }}>
                        {payoutData?.summary?.total_hours ?? 0}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.25rem" }}>completed this month</div>
                    </div>
                    <div className="dash-card" style={{ padding: "1.1rem 1.25rem", borderLeft: "4px solid #10b981" }}>
                      <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Completed Sessions</div>
                      <div style={{ fontSize: "1.55rem", fontWeight: 800, color: "#059669", marginTop: "0.2rem" }}>
                        {payoutData?.summary?.completed_sessions ?? 0}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                        of {payoutData?.summary?.total_sessions ?? payoutData?.summary?.total_scheduled ?? 0} scheduled
                      </div>
                    </div>
                    <div className="dash-card" style={{ padding: "1.1rem 1.25rem", borderLeft: "4px solid #20b2a4", background: "linear-gradient(135deg,#f0fdf9,#fff)" }}>
                      <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#0d9488", textTransform: "uppercase" }}>Total Earnings</div>
                      <div style={{ fontSize: "1.55rem", fontWeight: 800, color: "#065f46", marginTop: "0.2rem" }}>
                        ₦{Number(payoutData?.summary?.total_earnings ?? 0).toLocaleString()}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "0.25rem" }}>for {payoutMonth}</div>
                    </div>
                  </div>

                  {/* Itemised Sessions Table */}
                  <div className="dash-card" style={{ overflow: "hidden" }}>
                    <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <h3 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <DollarSign size={16} color="#0d9488" />
                        Itemised Session Breakdown
                        <span style={{ fontSize: "0.72rem", background: "#f0fdf9", color: "#0d9488", border: "1px solid #99f6e4", padding: "0.1rem 0.45rem", borderRadius: "10px", fontWeight: 700 }}>
                          {payoutData?.sessions?.length ?? 0} sessions
                        </span>
                      </h3>
                    </div>

                    {loadingPayoutData ? (
                      <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                        <div style={{ width: "28px", height: "28px", border: "2.5px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 0.6rem" }} />
                        <span style={{ fontSize: "0.82rem" }}>Loading payout breakdown for {payoutMonth}…</span>
                      </div>
                    ) : !payoutData?.sessions || payoutData.sessions.length === 0 ? (
                      <div style={{ padding: "3.5rem 1.5rem", textAlign: "center" }}>
                        <CreditCard size={38} color="#cbd5e1" style={{ margin: "0 auto 0.75rem", display: "block" }} />
                        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#475569" }}>No sessions recorded for {payoutMonth}</div>
                        <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.3rem" }}>
                          Payouts are calculated from completed sessions with submitted attendance reports.
                        </div>
                      </div>
                    ) : (
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                          <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                              {["Date & Time", "Duration", "Student & Subject", "Status", "Attendance", "Report", "Earnings"].map((h) => (
                                <th key={h} style={{ padding: "0.65rem 1rem", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {payoutData.sessions.map((sess, idx) => (
                              <tr
                                key={sess.session_id || idx}
                                style={{ borderBottom: idx < payoutData.sessions.length - 1 ? "1px solid #f1f5f9" : "none" }}
                              >
                                <td style={{ padding: "0.75rem 1rem" }}>
                                  <div style={{ fontWeight: 700, color: "#0f172a" }}>{sess.date}</div>
                                  <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "0.1rem" }}>
                                    {sess.start_time?.slice(0, 5)} – {sess.end_time?.slice(0, 5)}
                                  </div>
                                </td>
                                <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "#334155" }}>
                                  {sess.duration_hours} hr{Number(sess.duration_hours) !== 1 ? "s" : ""}
                                </td>
                                <td style={{ padding: "0.75rem 1rem" }}>
                                  <div style={{ fontWeight: 700, color: "#0f172a" }}>{sess.student_name}</div>
                                  <div style={{ fontSize: "0.7rem", color: "#0d9488", marginTop: "0.1rem" }}>{sess.subject}</div>
                                </td>
                                <td style={{ padding: "0.75rem 1rem" }}>
                                  <span style={{
                                    fontSize: "0.68rem",
                                    fontWeight: 700,
                                    padding: "0.15rem 0.5rem",
                                    borderRadius: "10px",
                                    background: sess.status === "completed" ? "#dcfce7" : "#f1f5f9",
                                    color: sess.status === "completed" ? "#15803d" : "#475569",
                                    textTransform: "capitalize",
                                  }}>
                                    {sess.status}
                                  </span>
                                </td>
                                <td style={{ padding: "0.75rem 1rem" }}>
                                  <span style={{
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    color: sess.attendance_status === "present" ? "#059669" : sess.attendance_status === "absent" ? "#dc2626" : "#b45309",
                                    textTransform: "capitalize",
                                  }}>
                                    {sess.attendance_status || "—"}
                                  </span>
                                </td>
                                <td style={{ padding: "0.75rem 1rem" }}>
                                  {sess.report_submitted ? (
                                    <span style={{ color: "#059669", fontWeight: 700, fontSize: "0.74rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                      <CheckCircle2 size={13} /> Submitted
                                    </span>
                                  ) : (
                                    <span style={{ color: "#94a3b8", fontSize: "0.74rem" }}>Pending</span>
                                  )}
                                </td>
                                <td style={{ padding: "0.75rem 1rem", fontWeight: 800, color: sess.earnings > 0 ? "#059669" : "#64748b", fontSize: "0.88rem" }}>
                                  ₦{Number(sess.earnings || 0).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          {/* Totals row */}
                          <tfoot>
                            <tr style={{ background: "#f0fdf9", borderTop: "2px solid #a7f3d0" }}>
                              <td colSpan={1} style={{ padding: "0.75rem 1rem", fontWeight: 800, color: "#0f172a", fontSize: "0.82rem" }}>
                                Month Total
                              </td>
                              <td style={{ padding: "0.75rem 1rem", fontWeight: 800, color: "#0284c7" }}>
                                {payoutData.summary.total_hours} hrs
                              </td>
                              <td colSpan={3} style={{ padding: "0.75rem 1rem", fontSize: "0.74rem", color: "#64748b" }}>
                                {payoutData.summary.completed_sessions} completed sessions
                              </td>
                              <td style={{ padding: "0.75rem 1rem" }} />
                              <td style={{ padding: "0.75rem 1rem", fontWeight: 800, color: "#065f46", fontSize: "0.95rem" }}>
                                ₦{Number(payoutData.summary.total_earnings).toLocaleString()}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══════════════ HOMEWORK TAB ══════════════ */}
              {activeTab === "homework" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="page-enter">
                  {/* Top Bar */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                        Homework &amp; Assignments
                      </h2>
                      <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.15rem 0 0" }}>
                        Assign homework tasks to your students, review submissions, and provide scores and feedback
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setAssignmentError(null);
                        setShowAssignmentModal(true);
                      }}
                      className="action-btn"
                      style={{ background: "#20b2a4", color: "#fff", padding: "0.55rem 1.1rem", fontSize: "0.85rem", boxShadow: "0 2px 6px rgba(32,178,164,0.3)" }}
                    >
                      <Plus size={16} /> Assign New Homework
                    </button>
                  </div>

                  {/* Summary Metric Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                    <div className="dash-card" style={{ padding: "1.1rem 1.25rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>Total Assignments</span>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>{assignments.length}</div>
                    </div>
                    <div className="dash-card" style={{ padding: "1.1rem 1.25rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "#b45309", fontWeight: 600 }}>Awaiting Grading</span>
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
                    <div className="dash-card" style={{ padding: "1.1rem 1.25rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "#1d4ed8", fontWeight: 600 }}>Pending Student Submission</span>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1d4ed8", marginTop: "0.2rem" }}>
                        {assignments.filter((a) => a.status === "assigned").length}
                      </div>
                    </div>
                  </div>

                  {/* Filters Bar */}
                  <div className="dash-card" style={{ padding: "0.75rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                      {/* Status Pills */}
                      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
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
                            {st === "all" ? "All Assignments" : st}
                          </button>
                        ))}
                      </div>

                      {/* Student Filter Dropdown */}
                      <select
                        value={assignmentStudentFilter}
                        onChange={(e) => {
                          const sId = e.target.value;
                          setAssignmentStudentFilter(sId);
                          fetchAssignments(undefined, sId);
                        }}
                        style={{
                          padding: "0.35rem 0.65rem",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          background: "#fff",
                          color: "#334155",
                          fontSize: "0.76rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        <option value="all">All Students</option>
                        {students.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.student_name} (#{st.id})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="text"
                        placeholder="Search title, student..."
                        value={assignmentSearch}
                        onChange={(e) => setAssignmentSearch(e.target.value)}
                        style={{
                          padding: "0.35rem 0.65rem",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.76rem",
                          outline: "none",
                          width: "160px",
                        }}
                      />
                      <button
                        onClick={() => fetchAssignments()}
                        style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0.35rem 0.75rem", fontSize: "0.76rem", color: "#64748b", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                      >
                        <RefreshCw size={13} /> Refresh
                      </button>
                    </div>
                  </div>

                  {/* Assignment Cards List */}
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
                      <p style={{ fontSize: "0.82rem", color: "#64748b", maxWidth: "420px", margin: "0 auto 1.25rem" }}>
                        {assignmentFilter !== "all"
                          ? `No assignments currently in "${assignmentFilter}" status.`
                          : assignmentStudentFilter !== "all"
                          ? "No assignments found for the selected student."
                          : "You haven't assigned any homework yet. Click below to create your first assignment."}
                      </p>
                      <button
                        onClick={() => {
                          setAssignmentError(null);
                          setShowAssignmentModal(true);
                        }}
                        className="action-btn"
                        style={{ background: "#20b2a4", color: "#fff", padding: "0.5rem 1.1rem" }}
                      >
                        <Plus size={15} /> Assign Homework
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {assignments
                        .filter((item) => {
                          if (!assignmentSearch.trim()) return true;
                          const q = assignmentSearch.toLowerCase();
                          const title = (item.title || "").toLowerCase();
                          const desc = (item.description || "").toLowerCase();
                          const stName = (item.student?.student_name || item.student?.name || "").toLowerCase();
                          return title.includes(q) || desc.includes(q) || stName.includes(q);
                        })
                        .map((item) => {
                        const studentName = item.student?.student_name || item.student?.name || "Student #" + item.student_id;
                        const isOverdue = item.is_overdue || item.status === "overdue" || (item.status === "assigned" && new Date(item.due_date) < new Date());
                        const displayStatus = isOverdue && item.status === "assigned" ? "overdue" : item.status;
                        const submission = item.latest_submission || (item.submissions && item.submissions[0]);

                        return (
                          <div key={item.id} className="dash-card" style={{ padding: "1.35rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                                  <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "0.2rem 0.55rem", borderRadius: "14px", ...statusStyle[displayStatus] }}>
                                    {displayStatus.toUpperCase()}
                                  </span>
                                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0d9488", background: "#e8f8f7", padding: "0.2rem 0.6rem", borderRadius: "12px" }}>
                                    Student: {studentName}
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
                                  Due: {item.due_date_formatted || new Date(item.due_date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                            </div>

                            {/* Description */}
                            <p style={{ fontSize: "0.84rem", color: "#334155", margin: 0, lineHeight: 1.55, background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                              {item.description}
                            </p>

                            {/* Tutor Attachment */}
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
                                  <Download size={13} /> Attached Worksheet ({item.file_name || "Download"})
                                </a>
                              </div>
                            )}

                            {/* Submissions Section */}
                            {submission && (
                              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "0.85rem", marginTop: "0.2rem" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.4rem" }}>
                                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#166534", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                                    <CheckCircle2 size={14} color="#16a34a" /> Student Submission Received
                                  </span>
                                  {submission.submitted_at && (
                                    <span style={{ fontSize: "0.72rem", color: "#15803d" }}>
                                      Submitted at: {new Date(submission.submitted_at).toLocaleString("en-GB")}
                                    </span>
                                  )}
                                </div>
                                {submission.content && (
                                  <p style={{ fontSize: "0.82rem", color: "#14532d", margin: "0.25rem 0 0.5rem", whiteSpace: "pre-wrap" }}>
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
                                      padding: "0.3rem 0.7rem",
                                      borderRadius: "6px",
                                      background: "#16a34a",
                                      color: "#fff",
                                      fontSize: "0.75rem",
                                      fontWeight: 700,
                                      textDecoration: "none",
                                    }}
                                  >
                                    <Download size={13} /> Download Student Work ({submission.file_name || "Attachment"})
                                  </a>
                                )}
                              </div>
                            )}

                            {/* Graded Feedback Box */}
                            {item.status === "graded" && item.grade != null && (
                              <div style={{ background: "#f8fafc", border: "1.5px solid #cbd5e1", borderRadius: "8px", padding: "0.85rem" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#065f46" }}>
                                      Score: {item.grade} / {item.max_points}
                                    </span>
                                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0d9488", background: "#e8f8f7", padding: "0.15rem 0.5rem", borderRadius: "10px" }}>
                                      {Math.round((Number(item.grade) / Number(item.max_points || 100)) * 100)}%
                                    </span>
                                  </div>
                                  {item.graded_at && (
                                    <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                                      Graded on: {new Date(item.graded_at).toLocaleDateString("en-GB")}
                                    </span>
                                  )}
                                </div>
                                {item.feedback && (
                                  <p style={{ fontSize: "0.82rem", color: "#475569", margin: "0.4rem 0 0", fontStyle: "italic" }}>
                                    Feedback: &ldquo;{item.feedback}&rdquo;
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem", borderTop: "1px solid #f1f5f9", paddingTop: "0.75rem" }}>
                              {(item.status === "submitted" || (submission && item.status !== "graded")) && (
                                <button
                                  onClick={() => {
                                    setGradeModalAssignment(item);
                                    setGradeForm({ grade: String(item.grade ?? ""), feedback: item.feedback || "" });
                                    setGradeError(null);
                                  }}
                                  className="action-btn"
                                  style={{ background: "#059669", color: "#fff", padding: "0.4rem 0.9rem" }}
                                >
                                  <Award size={14} /> Grade Submission
                                </button>
                              )}
                              {item.status === "graded" && (
                                <button
                                  onClick={() => {
                                    setGradeModalAssignment(item);
                                    setGradeForm({ grade: String(item.grade ?? ""), feedback: item.feedback || "" });
                                    setGradeError(null);
                                  }}
                                  className="action-btn"
                                  style={{ background: "#fff", color: "#475569", border: "1px solid #cbd5e1", padding: "0.4rem 0.85rem" }}
                                >
                                  <Edit3 size={13} /> Update Grade
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
                          <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Direct messaging with students</span>
                        </div>
                        <button
                          onClick={() => {
                            setShowNewConvModal(true);
                            setNewConvForm({ recipient_id: "", subject: "", initial_message: "" });
                            setNewConvFile(null);
                          }}
                          className="action-btn"
                          style={{ background: "#20b2a4", color: "#fff", padding: "0.35rem 0.65rem", fontSize: "0.75rem" }}
                          title="Start conversation with a student"
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
                            <p style={{ fontSize: "0.82rem", margin: 0 }}>No conversations yet</p>
                            <span style={{ fontSize: "0.72rem" }}>Click &quot;New Chat&quot; above to message a student</span>
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
                              const other = conv.other_participants?.[0] || { name: "Student", role: "student" };
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
                                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", flexShrink: 0 }}>
                                      {other.name?.charAt(0) || "S"}
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
                                {activeConversation.other_participants?.[0]?.name?.charAt(0) || "S"}
                              </div>
                              <div>
                                <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                                  {activeConversation.other_participants?.[0]?.name || "Student"}
                                </h4>
                                <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                                  {activeConversation.subject || "Direct Message"} • Student Portal
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
                                const isMe = msg.sender?.role === "tutor" || msg.sender?.id === tutorProfile?.id;
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
                                title="Attach worksheet or file"
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
                                placeholder="Write a message to your student… (Press Enter to send)"
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
                            Choose an existing chat thread from the left or click New Chat to message one of your students.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════ PROFILE TAB ══════════════ */}
              {activeTab === "profile" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "800px" }} className="page-enter">
                  <div>
                    <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                      My Tutor Profile & Credentials
                    </h2>
                    <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.15rem 0 0" }}>
                      Your verified teacher profile visible to Samin Home Tutors administration
                    </p>
                  </div>

                  <div className="dash-card" style={{ padding: "1.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1.5rem", marginBottom: "1.5rem" }}>
                      <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.6rem", flexShrink: 0 }}>
                        {tutorProfile?.name?.charAt(0) || "T"}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                            {tutorProfile?.name}
                          </h3>
                          <span style={{ background: "#ecfdf5", color: "#065f46", fontSize: "0.72rem", fontWeight: 800, padding: "0.2rem 0.6rem", borderRadius: "20px", border: "1px solid #a7f3d0", textTransform: "capitalize" }}>
                            {tutorProfile?.approval_status || "Approved"}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#0d9488", fontWeight: 600, marginTop: "0.2rem" }}>
                          {tutorProfile?.qualification || "Registered Tutor"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.1rem" }}>
                          Tutor ID: #{tutorProfile?.id}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.2rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                          Email Address
                        </label>
                        <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f172a" }}>
                          {tutorProfile?.email || "—"}
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                          Phone Number
                        </label>
                        <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f172a" }}>
                          {tutorProfile?.phone || "—"}
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                          Degree / Qualification
                        </label>
                        <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f172a" }}>
                          {tutorProfile?.qualification || "—"}
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                          Teaching Subjects
                        </label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.2rem" }}>
                          {tutorProfile?.subjects?.map((s) => (
                            <span key={s} style={{ background: "#e0f2fe", color: "#0369a1", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "6px" }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                          Levels Taught
                        </label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.2rem" }}>
                          {tutorProfile?.levels?.map((lvl) => (
                            <span key={lvl} style={{ background: "#f1f5f9", color: "#334155", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "6px" }}>
                              {lvl}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: "1.75rem", borderTop: "1px solid #f1f5f9", paddingTop: "1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.8rem" }}>
                      <Link
                        href="/change-password"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: "8px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#334155", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}
                      >
                        Change Password
                      </Link>
                      <button
                        onClick={handleLogout}
                        style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Modal: Update Session Status, Notes & Meeting Link (PATCH /api/tutor/sessions/{id}) ── */}
      {editingSession && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ width: "100%", maxWidth: "520px", background: "#fff", borderRadius: "16px", padding: "1.75rem", boxShadow: "0 20px 40px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Update Lesson Session #{editingSession.id}
                </h3>
                <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0.15rem 0 0" }}>
                  {editingSession.student?.student_name} • {editingSession.subject} (📅 {editingSession.date})
                </p>
              </div>
              <button onClick={() => setEditingSession(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateSession} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                  Session Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", outline: "none", fontSize: "0.85rem" }}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                  Meeting Link (Google Meet / Zoom URL)
                </label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={editMeetingLink}
                  onChange={(e) => setEditMeetingLink(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", outline: "none", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                  Lesson Notes & Student Feedback
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Covered quadratic equations. Completed worksheet #3. Homework: practice exercises on page 42."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", outline: "none", fontSize: "0.85rem", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setEditingSession(null)}
                  style={{ padding: "0.55rem 1rem", borderRadius: "8px", background: "#f1f5f9", border: "none", color: "#475569", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingSession}
                  style={{ padding: "0.55rem 1.25rem", borderRadius: "8px", background: "#0d9488", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.82rem", cursor: isUpdatingSession ? "not-allowed" : "pointer" }}
                >
                  {isUpdatingSession ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Submit / Edit Lesson Report Modal (POST /api/tutor/sessions/{sessionId}/report) ── */}
      {reportModalSession && (
        <div
          onClick={() => !isSubmittingReport && setReportModalSession(null)}
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
              maxWidth: "600px",
              maxHeight: "92vh",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg,#20b2a4,#0d9488)", padding: "1.2rem 1.5rem", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#ccfbf1", fontWeight: 700 }}>
                  Post-Lesson Session Report
                </div>
                <h3 style={{ margin: "0.2rem 0 0", fontSize: "1.1rem", fontWeight: 800 }}>
                  {reportModalSession.subject} with {reportModalSession.student?.student_name || "Student"}
                </h3>
                <div style={{ fontSize: "0.74rem", color: "#e0f2fe", marginTop: "0.15rem" }}>
                  📅 {reportModalSession.date} • {reportModalSession.start_time?.slice(0, 5)} - {reportModalSession.end_time?.slice(0, 5)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isSubmittingReport && setReportModalSession(null)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitReport} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
                {reportError && (
                  <div style={{ background: "#fee2e2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", padding: "0.75rem", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <AlertCircle size={16} /> {reportError}
                  </div>
                )}

                {/* 2-column: Attendance & Engagement Rating */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
                      Attendance Status <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                      value={reportForm.attendance_status}
                      onChange={(e) => setReportForm({ ...reportForm, attendance_status: e.target.value })}
                      style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.85rem", outline: "none", background: "#fff" }}
                    >
                      <option value="present">Present (Attended)</option>
                      <option value="late">Late (Joined delayed)</option>
                      <option value="absent">Absent (No-show)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
                      Student Engagement (1–5) <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <div style={{ display: "flex", gap: "0.35rem" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReportForm({ ...reportForm, student_engagement: star })}
                          style={{
                            flex: 1,
                            padding: "0.5rem 0",
                            borderRadius: "6px",
                            border: reportForm.student_engagement >= star ? "1.5px solid #f59e0b" : "1.5px solid #cbd5e1",
                            background: reportForm.student_engagement >= star ? "#fef3c7" : "#fff",
                            color: reportForm.student_engagement >= star ? "#b45309" : "#94a3b8",
                            fontWeight: 800,
                            fontSize: "0.85rem",
                            cursor: "pointer",
                          }}
                        >
                          ★ {star}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Topics Covered */}
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
                    Topics Covered &amp; Material Studied <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={reportForm.topics_covered}
                    onChange={(e) => setReportForm({ ...reportForm, topics_covered: e.target.value })}
                    placeholder="e.g. Quadratic equations and graph factorization. Completed worksheet 4B."
                    style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.85rem", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
                  />
                </div>

                {/* Strengths & Improvement */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#065f46", marginBottom: "0.35rem" }}>
                      Student Strengths (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={reportForm.strengths}
                      onChange={(e) => setReportForm({ ...reportForm, strengths: e.target.value })}
                      placeholder="e.g. Quick grasp of factorization and completing the square."
                      style={{ width: "100%", padding: "0.5rem 0.7rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.82rem", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#9a3412", marginBottom: "0.35rem" }}>
                      Areas for Improvement (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={reportForm.areas_for_improvement}
                      onChange={(e) => setReportForm({ ...reportForm, areas_for_improvement: e.target.value })}
                      placeholder="e.g. Needs more practice with negative coefficients."
                      style={{ width: "100%", padding: "0.5rem 0.7rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.82rem", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
                    />
                  </div>
                </div>

                {/* Homework Assigned */}
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#0369a1", marginBottom: "0.35rem" }}>
                    Homework Assigned (Optional)
                  </label>
                  <input
                    value={reportForm.homework_assigned}
                    onChange={(e) => setReportForm({ ...reportForm, homework_assigned: e.target.value })}
                    placeholder="e.g. Exercise 4B, questions 1-8"
                    style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                {/* Notes for Parents */}
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
                    Notes for Parents / Feedback
                  </label>
                  <textarea
                    rows={2}
                    value={reportForm.notes_for_parents}
                    onChange={(e) => setReportForm({ ...reportForm, notes_for_parents: e.target.value })}
                    placeholder="e.g. Liam was very engaged and attentive throughout the lesson."
                    style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.85rem", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => setReportModalSession(null)}
                  style={{ padding: "0.55rem 1rem", borderRadius: "8px", background: "#f1f5f9", border: "none", color: "#475569", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  style={{
                    padding: "0.55rem 1.35rem",
                    borderRadius: "8px",
                    background: isSubmittingReport ? "#94a3b8" : "linear-gradient(135deg,#20b2a4,#0d9488)",
                    border: "none",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.84rem",
                    cursor: isSubmittingReport ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <Send size={14} /> {isSubmittingReport ? "Saving Report…" : "Submit Lesson Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Viewing Student Reports Modal (GET /api/tutor/students/{studentId}/reports) ── */}
      {viewingStudentReports && (
        <div
          onClick={() => setViewingStudentReports(null)}
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
              maxWidth: "600px",
              maxHeight: "88vh",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)", padding: "1.2rem 1.5rem", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#e0f2fe", fontWeight: 700 }}>
                  Student Progress History
                </div>
                <h3 style={{ margin: "0.2rem 0 0", fontSize: "1.1rem", fontWeight: 800 }}>
                  Reports for {viewingStudentReports.student.student_name}
                </h3>
              </div>
              <button
                onClick={() => setViewingStudentReports(null)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* List */}
            <div style={{ padding: "1.25rem 1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.85rem", flex: 1 }}>
              {viewingStudentReports.loading ? (
                <div style={{ padding: "2.5rem", textAlign: "center", color: "#64748b" }}>
                  <div style={{ width: "24px", height: "24px", border: "2.5px solid #0284c7", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 0.5rem" }} />
                  <span style={{ fontSize: "0.82rem" }}>Loading student reports…</span>
                </div>
              ) : viewingStudentReports.reports.length === 0 ? (
                <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#94a3b8" }}>
                  <FileText size={32} color="#cbd5e1" style={{ margin: "0 auto 0.5rem" }} />
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#475569" }}>No reports found for this student</div>
                </div>
              ) : (
                viewingStudentReports.reports.map((rep) => (
                  <div key={rep.id} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.9rem", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.88rem" }}>{rep.subject}</span>
                        <span style={{ fontSize: "0.74rem", color: "#64748b", marginLeft: "0.5rem" }}>📅 {rep.date}</span>
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "#f59e0b", fontWeight: 700 }}>
                        {"★".repeat(Math.min(5, Math.max(1, Number(rep.student_engagement) || 5)))}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.8rem", color: "#334155" }}>
                      <strong>Topics:</strong> {rep.topics_covered}
                    </div>

                    {rep.strengths && (
                      <div style={{ fontSize: "0.75rem", color: "#065f46" }}>
                        ✓ <strong>Strengths:</strong> {rep.strengths}
                      </div>
                    )}

                    {rep.homework_assigned && (
                      <div style={{ fontSize: "0.75rem", color: "#0369a1" }}>
                        📚 <strong>Homework:</strong> {rep.homework_assigned}
                      </div>
                    )}

                    {rep.notes_for_parents && (
                      <div style={{ fontSize: "0.74rem", color: "#475569", background: "#fff", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #f1f5f9" }}>
                        💬 {rep.notes_for_parents}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "0.85rem 1.5rem", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setViewingStudentReports(null)}
                style={{ padding: "0.5rem 1.25rem", borderRadius: "8px", background: "#0f172a", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Single Report View Modal ── */}
      {selectedReportView && (
        <div
          onClick={() => setSelectedReportView(null)}
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
              maxWidth: "540px",
              maxHeight: "88vh",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ background: "linear-gradient(135deg,#20b2a4,#0d9488)", padding: "1.2rem 1.5rem", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#ccfbf1", fontWeight: 700 }}>
                  Lesson Report #{selectedReportView.id}
                </div>
                <h3 style={{ margin: "0.2rem 0 0", fontSize: "1.05rem", fontWeight: 800 }}>
                  {selectedReportView.subject} • {selectedReportView.date}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReportView(null)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={15} />
              </button>
            </div>

            <div style={{ padding: "1.25rem 1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.85rem", flex: 1, fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", background: "#f8fafc", padding: "0.75rem", borderRadius: "8px" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700 }}>STUDENT</div>
                  <div style={{ fontWeight: 700, color: "#0f172a" }}>{selectedReportView.student?.student_name || "Student"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700 }}>ENGAGEMENT</div>
                  <div style={{ color: "#f59e0b", fontWeight: 700 }}>
                    {"★".repeat(Math.min(5, Math.max(1, Number(selectedReportView.student_engagement) || 5)))} ({selectedReportView.student_engagement}/5)
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Topics Covered</div>
                <div style={{ background: "#f8fafc", padding: "0.7rem", borderRadius: "8px", marginTop: "0.2rem", color: "#0f172a" }}>
                  {selectedReportView.topics_covered}
                </div>
              </div>

              {selectedReportView.strengths && (
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#065f46", fontWeight: 700, textTransform: "uppercase" }}>Strengths</div>
                  <div style={{ background: "#ecfdf5", padding: "0.6rem 0.75rem", borderRadius: "8px", marginTop: "0.2rem", color: "#065f46" }}>
                    {selectedReportView.strengths}
                  </div>
                </div>
              )}

              {selectedReportView.homework_assigned && (
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#0369a1", fontWeight: 700, textTransform: "uppercase" }}>Homework</div>
                  <div style={{ background: "#f0f9ff", padding: "0.6rem 0.75rem", borderRadius: "8px", marginTop: "0.2rem", color: "#0369a1" }}>
                    📚 {selectedReportView.homework_assigned}
                  </div>
                </div>
              )}

              {selectedReportView.notes_for_parents && (
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#475569", fontWeight: 700, textTransform: "uppercase" }}>Notes for Parents</div>
                  <div style={{ background: "#fdf4ff", padding: "0.6rem 0.75rem", borderRadius: "8px", marginTop: "0.2rem", color: "#86198f" }}>
                    💬 {selectedReportView.notes_for_parents}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: "0.85rem 1.5rem", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setSelectedReportView(null)}
                style={{ padding: "0.5rem 1.25rem", borderRadius: "8px", background: "#0f172a", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Request Session Change Modal (POST /api/tutor/sessions/{sessionId}/request-change) ── */}
      {changeRequestModalSession && (
        <div
          onClick={() => !isSubmittingChangeRequest && setChangeRequestModalSession(null)}
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
              maxWidth: "540px",
              maxHeight: "92vh",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)", padding: "1.2rem 1.5rem", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#ccfbf1", fontWeight: 700 }}>
                  Session Change Request
                </div>
                <h3 style={{ margin: "0.2rem 0 0", fontSize: "1.1rem", fontWeight: 800 }}>
                  {changeRequestModalSession.student?.student_name || "Student"} • {changeRequestModalSession.subject}
                </h3>
                <div style={{ fontSize: "0.74rem", color: "#e0f2fe", marginTop: "0.15rem" }}>
                  Current: 📅 {changeRequestModalSession.date} • 🕒 {changeRequestModalSession.start_time?.slice(0, 5)} - {changeRequestModalSession.end_time?.slice(0, 5)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isSubmittingChangeRequest && setChangeRequestModalSession(null)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitChangeRequest} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
                {changeRequestError && (
                  <div style={{ background: "#fee2e2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", padding: "0.75rem", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <AlertCircle size={16} /> {changeRequestError}
                  </div>
                )}

                {/* Request Type Selector (Segmented) */}
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
                    Request Type <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                    <button
                      type="button"
                      onClick={() => setChangeRequestForm({ ...changeRequestForm, request_type: "reschedule" })}
                      style={{
                        padding: "0.65rem 0.85rem",
                        borderRadius: "8px",
                        border: changeRequestForm.request_type === "reschedule" ? "2px solid #0d9488" : "1.5px solid #cbd5e1",
                        background: changeRequestForm.request_type === "reschedule" ? "#f0fdf9" : "#fff",
                        color: changeRequestForm.request_type === "reschedule" ? "#0f766e" : "#475569",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <RotateCcw size={15} /> Propose Reschedule
                    </button>

                    <button
                      type="button"
                      onClick={() => setChangeRequestForm({ ...changeRequestForm, request_type: "cancel" })}
                      style={{
                        padding: "0.65rem 0.85rem",
                        borderRadius: "8px",
                        border: changeRequestForm.request_type === "cancel" ? "2px solid #ef4444" : "1.5px solid #cbd5e1",
                        background: changeRequestForm.request_type === "cancel" ? "#fef2f2" : "#fff",
                        color: changeRequestForm.request_type === "cancel" ? "#b91c1c" : "#475569",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <XCircle size={15} /> Request Cancellation
                    </button>
                  </div>
                </div>

                {/* If Reschedule: Proposed Date and Times */}
                {changeRequestForm.request_type === "reschedule" && (
                  <div style={{ background: "#f8fafc", padding: "0.9rem", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0369a1", textTransform: "uppercase" }}>
                      Proposed New Date & Time
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#475569", marginBottom: "0.25rem" }}>
                        Proposed Date <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={changeRequestForm.proposed_date}
                        onChange={(e) => setChangeRequestForm({ ...changeRequestForm, proposed_date: e.target.value })}
                        style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.85rem", outline: "none", background: "#fff" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#475569", marginBottom: "0.25rem" }}>
                          Start Time <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                          type="time"
                          required
                          value={changeRequestForm.proposed_start_time}
                          onChange={(e) => setChangeRequestForm({ ...changeRequestForm, proposed_start_time: e.target.value })}
                          style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.85rem", outline: "none", background: "#fff" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#475569", marginBottom: "0.25rem" }}>
                          End Time (Optional)
                        </label>
                        <input
                          type="time"
                          value={changeRequestForm.proposed_end_time}
                          onChange={(e) => setChangeRequestForm({ ...changeRequestForm, proposed_end_time: e.target.value })}
                          style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.85rem", outline: "none", background: "#fff" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Reason for change */}
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
                    Reason for Request <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={changeRequestForm.reason}
                    onChange={(e) => setChangeRequestForm({ ...changeRequestForm, reason: e.target.value })}
                    placeholder="e.g. Doctor appointment on Tuesday morning, student exam preparation conflict, etc."
                    style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.85rem", outline: "none", resize: "vertical", fontFamily: "inherit" }}
                  />
                  <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                    This reason is sent to the admin team to coordinate with the student's parents.
                  </span>
                </div>

                {/* Notice */}
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "0.7rem 0.85rem", fontSize: "0.76rem", color: "#b45309", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                  <div>
                    Once submitted, this request will be marked as <strong>Awaiting Admin Review</strong>. The session will remain scheduled until an administrator approves the change.
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => !isSubmittingChangeRequest && setChangeRequestModalSession(null)}
                  style={{ padding: "0.55rem 1rem", borderRadius: "8px", background: "#f1f5f9", border: "none", color: "#475569", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingChangeRequest}
                  style={{
                    padding: "0.55rem 1.35rem",
                    borderRadius: "8px",
                    background: isSubmittingChangeRequest ? "#94a3b8" : "linear-gradient(135deg,#0d9488,#0f766e)",
                    border: "none",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.84rem",
                    cursor: isSubmittingChangeRequest ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <Send size={14} /> {isSubmittingChangeRequest ? "Submitting…" : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Assign Homework Modal ── */}
      {showAssignmentModal && (
        <div
          onClick={() => setShowAssignmentModal(false)}
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
              maxWidth: "540px",
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
                    Assign Homework Task
                  </h3>
                  <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Create a task for an assigned student</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAssignmentModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={18} />
              </button>
            </div>

            {assignmentError && (
              <div style={{ background: "#fee2e2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", padding: "0.7rem", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <AlertCircle size={15} /> {assignmentError}
              </div>
            )}

            <form onSubmit={handleCreateAssignment} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.3rem" }}>
                  Select Student <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <select
                  value={assignmentForm.student_id}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, student_id: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.85rem", background: "#fff", outline: "none" }}
                >
                  <option value="">-- Choose Assigned Student --</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.student_name} ({st.email || "No email"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.3rem" }}>
                  Assignment Title <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Quadratic Equations Practice Worksheet 3"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.85rem", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.3rem" }}>
                  Task Description &amp; Instructions <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <textarea
                  placeholder="Provide detailed instructions for the student (e.g. Complete questions 1 to 15 on page 42, show full working steps)..."
                  rows={4}
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.85rem", resize: "vertical", outline: "none" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.3rem" }}>
                    Due Date &amp; Time <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={assignmentForm.due_date}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, due_date: e.target.value })}
                    required
                    style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.82rem", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.3rem" }}>
                    Max Points
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={assignmentForm.max_points}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, max_points: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.85rem", outline: "none" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.3rem" }}>
                  Attach Worksheet or PDF (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setAssignmentFile(e.target.files?.[0] || null)}
                  style={{ width: "100%", padding: "0.45rem", borderRadius: "8px", border: "1.5px dashed #cbd5e1", fontSize: "0.8rem", background: "#f8fafc" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  style={{ padding: "0.55rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", color: "#475569", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAssignment}
                  className="action-btn"
                  style={{ background: "#20b2a4", color: "#fff", padding: "0.55rem 1.25rem", fontSize: "0.82rem" }}
                >
                  {isSubmittingAssignment ? "Assigning…" : "Assign Homework"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Grade Submission Modal ── */}
      {gradeModalAssignment && (
        <div
          onClick={() => setGradeModalAssignment(null)}
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
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Grade Submission
                </h3>
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                  {gradeModalAssignment.title} (Max: {gradeModalAssignment.max_points} pts)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setGradeModalAssignment(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={18} />
              </button>
            </div>

            {gradeError && (
              <div style={{ background: "#fee2e2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", padding: "0.65rem", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <AlertCircle size={15} /> {gradeError}
              </div>
            )}

            <form onSubmit={handleGradeAssignment} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.3rem" }}>
                  Score Earned (0 - {gradeModalAssignment.max_points}) <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={gradeModalAssignment.max_points}
                  step="0.5"
                  placeholder={`Score out of ${gradeModalAssignment.max_points}`}
                  value={gradeForm.grade}
                  onChange={(e) => setGradeForm({ ...gradeForm, grade: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.9rem", fontWeight: 700, outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.3rem" }}>
                  Feedback &amp; Constructive Remarks (Optional)
                </label>
                <textarea
                  placeholder="Provide personalized commentary, areas where the student excelled, and steps for improvement..."
                  rows={4}
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.85rem", resize: "vertical", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setGradeModalAssignment(null)}
                  style={{ padding: "0.55rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", color: "#475569", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGrading}
                  className="action-btn"
                  style={{ background: "#059669", color: "#fff", padding: "0.55rem 1.25rem", fontSize: "0.82rem" }}
                >
                  {isGrading ? "Saving…" : "Save Grade & Feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Start New Conversation Modal ── */}
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
                  New Student Message
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
                  Recipient Student <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <select
                  value={newConvForm.recipient_id}
                  onChange={(e) => setNewConvForm({ ...newConvForm, recipient_id: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.85rem", background: "#fff", outline: "none" }}
                >
                  <option value="">-- Choose Student to Message --</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.student_name} ({st.email || "Student"})
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
                  placeholder="e.g. Next Lesson Prep / Math Questions"
                  value={newConvForm.subject}
                  onChange={(e) => setNewConvForm({ ...newConvForm, subject: e.target.value })}
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.85rem", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.3rem" }}>
                  Initial Message <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <textarea
                  placeholder="Type your message to the student..."
                  rows={4}
                  value={newConvForm.initial_message}
                  onChange={(e) => setNewConvForm({ ...newConvForm, initial_message: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.85rem", resize: "vertical", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: "0.3rem" }}>
                  Attach File or Worksheet (Optional)
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
              Are you sure you want to sign out of the Tutor Portal? Your session data is safe.
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
                onClick={handleLogout}
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
