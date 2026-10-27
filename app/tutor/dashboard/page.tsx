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
} from "lucide-react";

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

type NavTab = "overview" | "schedule" | "students" | "sessions" | "reports" | "profile";

const statusStyle: Record<string, { bg: string; color: string; border: string; label: string }> = {
  scheduled: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", label: "Scheduled" },
  completed: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0", label: "Completed" },
  cancelled: { bg: "#fef2f2", color: "#991b1b", border: "#fecaca", label: "Cancelled" },
  rescheduled: { bg: "#fffbeb", color: "#b45309", border: "#fde68a", label: "Rescheduled" },
  active: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0", label: "Active" },
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

      Promise.all([fetchDashboardData(), fetchStudents(), fetchSessions(1)]).finally(() => {
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
      await Promise.all([fetchDashboardData(), fetchStudents(), fetchSessions(1)]);
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
  const navTabs: { tab: NavTab; icon: React.ReactNode; label: string; badge?: number }[] = [
    { tab: "overview", icon: <LayoutDashboard size={18} />, label: "Overview" },
    { tab: "schedule", icon: <Calendar size={18} />, label: "My Schedule", badge: stats.upcoming_sessions_count || undefined },
    { tab: "students", icon: <Users size={18} />, label: "My Students", badge: stats.total_students || undefined },
    { tab: "sessions", icon: <CalendarDays size={18} />, label: "All Sessions" },
    { tab: "reports", icon: <FileText size={18} />, label: "Lesson Reports" },
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
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.65rem 0.75rem", marginBottom: "0.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.8rem", flexShrink: 0 }}>
                  {tutorProfile.name?.charAt(0) || "T"}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tutorProfile.name}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#10b981", fontWeight: 600 }}>
                    {tutorProfile.qualification || "Verified Tutor"}
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
            onClick={handleLogout}
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
              }}
              title="Sync latest sessions and timetable from server"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: "0.76rem", fontWeight: 600, cursor: "pointer" }}
            >
              <RefreshCw size={13} />
              <span>Refresh</span>
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", background: "#f0fdf9", border: "1px solid #99f6e4", borderRadius: "8px", padding: "0.4rem 0.75rem" }}>
              <ShieldCheck size={14} color="#0d9488" />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0d9488" }}>
                {tutorProfile?.name || "Tutor"} ({tutorProfile?.approval_status || "Approved"})
              </span>
            </div>

            <button
              onClick={handleLogout}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.75rem", borderRadius: "8px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#dc2626", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer" }}
              title="Sign Out"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
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

                              <button
                                onClick={() => openEditModal(session)}
                                className="action-btn"
                                style={{ background: "#fff", color: "#475569", border: "1px solid #cbd5e1", padding: "0.35rem 0.7rem", fontSize: "0.76rem" }}
                                title="Edit meeting link and notes"
                              >
                                <Edit3 size={13} /> Edit
                              </button>

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

                              <button
                                onClick={() => openEditModal(session)}
                                className="action-btn"
                                style={{ background: "#fff", color: "#475569", border: "1px solid #cbd5e1" }}
                              >
                                <Edit3 size={13} /> Notes
                              </button>

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
                                  {sess.meeting_link ? (
                                    <a
                                      href={sess.meeting_link}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", background: "#e8f8f7", color: "#0d9488", padding: "0.25rem 0.6rem", borderRadius: "6px", fontWeight: 700, fontSize: "0.74rem", textDecoration: "none" }}
                                    >
                                      <Video size={13} /> Join Meet
                                    </a>
                                  ) : (
                                    <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>—</span>
                                  )}
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
    </div>
  );
}
