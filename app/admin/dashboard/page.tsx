"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  UserPlus,
  Calendar,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  ChevronRight,
  Star,
  TrendingUp,
  Mail,
  Globe,
  Sparkles,
  Trash2,
  GraduationCap,
  AlertCircle,
  Menu,
  X,
  Eye,
  EyeOff,
  Plus,
  Phone,
  RefreshCw,
  Users,
  Clock,
  Video,
  ExternalLink,
  Edit3,
  Filter,
  Check,
  CalendarDays,
} from "lucide-react";

/* ─── Constants ───────────────────────────────────────────── */
const ADMIN_EMAIL = "saminhometutors@gmail.com";
const ADMIN_PASSWORD = "SaminMaster2026";

/* ─── Types ───────────────────────────────────────────────── */
type Applicant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  degree: string;
  subjects: string[];
  levels: string[];
  notes: string;
  appliedAt: string;
};

type TutorStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

type AttachedStudent = {
  id: string | number;
  name: string;
  parent?: string;
  subject?: string;
  level?: string;
  status?: string;
  phone?: string;
  email?: string;
};

type TutorDetail = {
  id: number | string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  created_at?: string;
  students_count?: number;
  students?: any[];
  assigned_students?: any[];
  matched_students?: any[];
  tutor_profile?: {
    id?: number;
    user_id?: number;
    qualification?: string;
    subjects?: string[];
    levels?: string[];
    years_of_experience?: string;
    bio?: string;
    approval_status?: "pending" | "approved" | "rejected" | string;
    created_at?: string;
    students?: any[];
  };
};

type Tutor = {
  id: string;
  name: string;
  school: string;
  subject: string;
  students: number;
  region: string;
  img: string;
  rate: string;
};

type BookingStatus = "New Inquiry" | "Diagnostic Scheduled" | "Tutor Matched" | "Active Student" | "pending_match" | "matched" | "completed" | "cancelled" | string;

type StudentStats = {
  total: number;
  pending_match: number;
  matched: number;
  cancelled: number;
};

type AssignedTutor = {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  qualification?: string;
  pivot_notes?: string;
};

type StudentDetail = {
  id: number | string;
  parent_name?: string;
  student_name: string;
  email: string;
  phone?: string;
  subjects?: string[];
  level?: string;
  notes?: string;
  status: "pending_match" | "matched" | "completed" | "cancelled" | string;
  created_at?: string;
  assigned_tutors?: AssignedTutor[];
};

type ApprovedTutor = {
  id: number | string;
  name: string;
  email: string;
  qualification?: string;
  subjects?: string[];
};

type Booking = {
  id: string;
  parent: string;
  student: string;
  subject: string;
  level: string;
  country: string;
  phone: string;
  email: string;
  status: BookingStatus;
  rawStatus?: string;
  date: string;
  tutorAssigned: string;
  notes?: string;
  subjects?: string[];
  assignedTutors?: AssignedTutor[];
};

type AuthUser = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  role: string;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
};

type TimetableSlot = {
  id: number;
  student_id: number;
  tutor_id: number;
  subject: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  meeting_link?: string;
  status?: string;
  notes?: string;
  tutor?: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
  };
};

type CalendarSession = {
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
  tutor?: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
  };
  student?: {
    id: number;
    student_name?: string;
    parent_name?: string;
  };
};

type NavTab = "overview" | "applicants" | "tutors" | "bookings" | "sessions";

const statusStyle: Record<string, { bg: string; color: string; label?: string }> = {
  "New Inquiry": { bg: "#fef3c7", color: "#b45309", label: "New Inquiry" },
  "Diagnostic Scheduled": { bg: "#dbeafe", color: "#1d4ed8", label: "Diagnostic Scheduled" },
  "Tutor Matched": { bg: "#d1fae5", color: "#065f46", label: "Tutor Matched" },
  "Active Student": { bg: "#e0f2fe", color: "#0369a1", label: "Active Student" },
  "pending_match": { bg: "#fef3c7", color: "#b45309", label: "Pending Match" },
  "matched": { bg: "#d1fae5", color: "#065f46", label: "Matched" },
  "completed": { bg: "#e0f2fe", color: "#0369a1", label: "Completed" },
  "cancelled": { bg: "#fee2e2", color: "#991b1b", label: "Cancelled" },
  "scheduled": { bg: "#e0f2fe", color: "#0369a1", label: "Scheduled" },
  "rescheduled": { bg: "#fef3c7", color: "#b45309", label: "Rescheduled" },
};

/* ─── Component ───────────────────────────────────────────── */
export default function AdminDashboard() {
  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<NavTab>("overview");
  const [initialLoading, setInitialLoading] = useState(true);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchApplicants, setSearchApplicants] = useState("");
  const [searchTutors, setSearchTutors] = useState("");
  const [searchBookings, setSearchBookings] = useState("");
  const [studentStatusFilter, setStudentStatusFilter] = useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedApplicant, setExpandedApplicant] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isAddTutorOpen, setIsAddTutorOpen] = useState(false);
  const [enrollTutorForm, setEnrollTutorForm] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    subjects: ["Mathematics"] as string[],
    levels: ["Year 1-6", "GCSE preparation"] as string[],
    years_of_experience: "",
    bio: "",
  });
  const [enrollCustomSubject, setEnrollCustomSubject] = useState("");
  const [isEnrollingTutor, setIsEnrollingTutor] = useState(false);
  const [enrollTutorError, setEnrollTutorError] = useState<string | null>(null);
  const [enrollTutorFieldErrors, setEnrollTutorFieldErrors] = useState<Record<string, string[]>>({});

  const [currentUser, setCurrentUser] = useState<AuthUser | { id?: number; name?: string; email?: string; role?: string; phone?: string | null } | null>(null);
  const [tutorStats, setTutorStats] = useState<TutorStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [isLoadingTutors, setIsLoadingTutors] = useState(false);

  // Single tutor detail modal state (GET /api/admin/tutors/{id})
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<TutorDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Student list & single student detail modal state (GET /api/admin/students, GET /api/admin/students/{id})
  const [studentStats, setStudentStats] = useState<StudentStats>({
    total: 0,
    pending_match: 0,
    matched: 0,
    cancelled: 0,
  });
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isStudentDetailOpen, setIsStudentDetailOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [loadingStudentDetail, setLoadingStudentDetail] = useState(false);

  // Match-tutors sub-modal state
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [approvedTutors, setApprovedTutors] = useState<ApprovedTutor[]>([]);
  const [selectedTutorIds, setSelectedTutorIds] = useState<Set<number | string>>(new Set());
  const [matchNotes, setMatchNotes] = useState("");
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  // Timetable & Calendar Sessions modal state
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [timetableStudent, setTimetableStudent] = useState<any | null>(null);
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>([]);
  const [calendarSessions, setCalendarSessions] = useState<CalendarSession[]>([]);
  const [loadingTimetable, setLoadingTimetable] = useState(false);
  const [generatingSessions, setGeneratingSessions] = useState(false);
  const [timetableTab, setTimetableTab] = useState<"recurring" | "sessions" | "add_slot">("recurring");

  // Timetable Slot Builder form state
  const [slotTutorId, setSlotTutorId] = useState<string | number>("");
  const [slotSubject, setSlotSubject] = useState("");
  const [slotDayOfWeek, setSlotDayOfWeek] = useState("monday");
  const [slotStartTime, setSlotStartTime] = useState("17:00");
  const [slotEndTime, setSlotEndTime] = useState("18:00");
  const [slotMeetingLink, setSlotMeetingLink] = useState("");
  const [slotNotes, setSlotNotes] = useState("");
  const [slotReplaceExisting, setSlotReplaceExisting] = useState(false);
  const [slotGenerateWeeks, setSlotGenerateWeeks] = useState(4);
  const [isSubmittingSlot, setIsSubmittingSlot] = useState(false);

  // Session Filters
  const [sessionFilterStatus, setSessionFilterStatus] = useState<string>("all");
  const [sessionFromDate, setSessionFromDate] = useState<string>("");
  const [sessionToDate, setSessionToDate] = useState<string>("");
  const [sessionTutorFilter, setSessionTutorFilter] = useState<string>("all");

  // Edit / Reschedule Single Session modal state
  const [editingSession, setEditingSession] = useState<CalendarSession | null>(null);
  const [editSessionDate, setEditSessionDate] = useState("");
  const [editSessionStartTime, setEditSessionStartTime] = useState("17:00");
  const [editSessionEndTime, setEditSessionEndTime] = useState("18:00");
  const [editSessionStatus, setEditSessionStatus] = useState("scheduled");
  const [editSessionMeetingLink, setEditSessionMeetingLink] = useState("");
  const [editSessionNotes, setEditSessionNotes] = useState("");
  const [isSavingSession, setIsSavingSession] = useState(false);

  // Sessions top-level tab active student
  const [selectedStudentForSessionsTab, setSelectedStudentForSessionsTab] = useState<string>("");

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

  const fetchCurrentUser = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    if (!token) return;

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/user`, {
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        if (typeof window !== "undefined") {
          localStorage.setItem("samin_user", JSON.stringify(user));
          if (user.must_change_password) {
            localStorage.setItem("samin_must_change_password", "true");
            window.location.href = "/change-password";
            return;
          }
        }
      } else if (res.status === 401) {
        console.warn("Session expired or token invalid from GET /api/user");
      }
    } catch (err) {
      console.error("Error fetching current user (/api/user):", err);
    }
  };

  const loadApprovedTutors = async (): Promise<ApprovedTutor[]> => {
    if (approvedTutors.length > 0) return approvedTutors;
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/admin/tutors?per_page=all&status=approved`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      const json = await res.json();
      const list = json.tutors?.data || (Array.isArray(json.tutors) ? json.tutors : []);
      const parsed: ApprovedTutor[] = list
        .filter((t: any) => t.tutor_profile?.approval_status === "approved" || t.role === "tutor")
        .map((t: any) => ({
          id: t.id,
          name: t.name,
          email: t.email,
          qualification: t.tutor_profile?.qualification || "",
          subjects: Array.isArray(t.tutor_profile?.subjects) ? t.tutor_profile.subjects : [],
        }));
      setApprovedTutors(parsed);
      return parsed;
    } catch (err) {
      console.error("Failed to load approved tutors:", err);
      return [];
    }
  };

  const fetchStudentTimetable = async (id: string | number) => {
    const cleanId = String(id).replace(/^(SAM-|STU-)/, "");
    const targetId = /^\d+$/.test(cleanId) ? cleanId : id;
    const baseUrl = getBackendApiUrl();
    setLoadingTimetable(true);

    try {
      const res = await fetch(`${baseUrl}/api/admin/students/${targetId}/timetable`, {
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        const data = await res.json();
        const slots = data.weekly_timetable || [];
        const upcoming = data.upcoming_sessions || [];
        setTimetableSlots(Array.isArray(slots) ? slots : []);
        if (Array.isArray(upcoming) && upcoming.length > 0) {
          setCalendarSessions(upcoming);
        }
      }
    } catch (err) {
      console.error("Error fetching timetable:", err);
    } finally {
      setLoadingTimetable(false);
    }
  };

  const fetchStudentSessions = async (id: string | number, customFilters?: { status?: string; from_date?: string; to_date?: string; tutor_id?: string }) => {
    const cleanId = String(id).replace(/^(SAM-|STU-)/, "");
    const targetId = /^\d+$/.test(cleanId) ? cleanId : id;
    const baseUrl = getBackendApiUrl();

    try {
      const params = new URLSearchParams();
      const st = customFilters?.status ?? sessionFilterStatus;
      const fr = customFilters?.from_date ?? sessionFromDate;
      const to = customFilters?.to_date ?? sessionToDate;
      const tu = customFilters?.tutor_id ?? sessionTutorFilter;

      if (st && st !== "all") params.append("status", st);
      if (fr) params.append("from_date", fr);
      if (to) params.append("to_date", to);
      if (tu && tu !== "all") params.append("tutor_id", String(tu));

      const qs = params.toString();
      const res = await fetch(`${baseUrl}/api/admin/students/${targetId}/sessions${qs ? `?${qs}` : ""}`, {
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        const data = await res.json();
        const list = data.sessions || data.data || (Array.isArray(data) ? data : []);
        setCalendarSessions(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  const openTimetableModal = async (student: any) => {
    setTimetableStudent(student);
    setIsTimetableModalOpen(true);
    setTimetableTab("recurring");
    const sub = Array.isArray(student.subjects) && student.subjects.length > 0
      ? student.subjects[0]
      : (student.subject || "Mathematics");
    setSlotSubject(sub);

    const tutorsList = await loadApprovedTutors();
    const assigned = student.assigned_tutors || student.assignedTutors || [];
    if (assigned.length > 0) {
      setSlotTutorId(assigned[0].id);
    } else if (tutorsList.length > 0) {
      setSlotTutorId(tutorsList[0].id);
    }

    await Promise.all([
      fetchStudentTimetable(student.id),
      fetchStudentSessions(student.id),
    ]);
  };

  const assignTimetableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timetableStudent) return;
    if (!slotTutorId) {
      showToast("⚠️ Please select an assigned tutor for the lesson slot.");
      return;
    }

    const cleanId = String(timetableStudent.id).replace(/^(SAM-|STU-)/, "");
    const targetId = /^\d+$/.test(cleanId) ? cleanId : timetableStudent.id;
    const baseUrl = getBackendApiUrl();
    setIsSubmittingSlot(true);

    try {
      const payload = {
        replace_existing: slotReplaceExisting,
        generate_weeks: Number(slotGenerateWeeks) || 4,
        slots: [
          {
            tutor_id: Number(slotTutorId),
            subject: slotSubject || "General Tutoring",
            day_of_week: slotDayOfWeek.toLowerCase(),
            start_time: slotStartTime,
            end_time: slotEndTime,
            meeting_link: slotMeetingLink ? slotMeetingLink.trim() : undefined,
            notes: slotNotes ? slotNotes.trim() : undefined,
          },
        ],
      };

      const res = await fetch(`${baseUrl}/api/admin/students/${targetId}/timetable`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || `Failed to assign timetable (HTTP ${res.status})`);
      }

      const json = await res.json();
      showToast(json.message || `✅ Lesson timetable assigned with ${json.generated_sessions_count || "calendar"} session(s) generated.`);
      
      setSlotNotes("");
      setSlotMeetingLink("");
      await fetchStudentTimetable(timetableStudent.id);
      await fetchStudentSessions(timetableStudent.id);
      setTimetableTab("recurring");
    } catch (err: any) {
      console.error("Assign timetable error:", err);
      showToast(`⚠️ ${err.message || "Failed to assign timetable."}`);
    } finally {
      setIsSubmittingSlot(false);
    }
  };

  const deleteTimetableSlot = async (slotId: number) => {
    if (!confirm("Are you sure you want to remove this weekly recurring slot? Its future pending sessions will be cancelled.")) {
      return;
    }

    const baseUrl = getBackendApiUrl();
    try {
      const res = await fetch(`${baseUrl}/api/admin/timetable/${slotId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || `Failed to remove slot (HTTP ${res.status})`);
      }

      const data = await res.json().catch(() => null);
      showToast(data?.message || "Weekly recurring slot removed successfully.");
      setTimetableSlots((prev) => prev.filter((s) => s.id !== slotId));
      if (timetableStudent) {
        fetchStudentSessions(timetableStudent.id);
      }
    } catch (err: any) {
      console.error("Delete slot error:", err);
      showToast(`⚠️ ${err.message || "Failed to delete slot."}`);
    }
  };

  const generateFutureSessions = async (weeks: number) => {
    if (!timetableStudent) return;
    const cleanId = String(timetableStudent.id).replace(/^(SAM-|STU-)/, "");
    const targetId = /^\d+$/.test(cleanId) ? cleanId : timetableStudent.id;
    const baseUrl = getBackendApiUrl();
    setGeneratingSessions(true);

    try {
      const res = await fetch(`${baseUrl}/api/admin/students/${targetId}/generate-sessions`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ weeks, generate_weeks: weeks }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || `Failed to generate sessions (HTTP ${res.status})`);
      }

      const json = await res.json().catch(() => null);
      showToast(json?.message || `✅ Successfully generated sessions for the next ${weeks} weeks!`);
      await fetchStudentSessions(timetableStudent.id);
    } catch (err: any) {
      console.error("Generate sessions error:", err);
      showToast(`⚠️ ${err.message || "Failed to generate sessions."}`);
    } finally {
      setGeneratingSessions(false);
    }
  };

  const openEditSessionModal = (session: CalendarSession) => {
    setEditingSession(session);
    setEditSessionDate(session.date || "");
    setEditSessionStartTime(session.start_time ? session.start_time.slice(0, 5) : "17:00");
    setEditSessionEndTime(session.end_time ? session.end_time.slice(0, 5) : "18:00");
    setEditSessionStatus(session.status || "scheduled");
    setEditSessionMeetingLink(session.meeting_link || "");
    setEditSessionNotes(session.notes || "");
  };

  const submitUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    const baseUrl = getBackendApiUrl();
    setIsSavingSession(true);

    try {
      const payload: any = {
        status: editSessionStatus,
        date: editSessionDate,
        start_time: editSessionStartTime,
        end_time: editSessionEndTime,
        meeting_link: editSessionMeetingLink ? editSessionMeetingLink.trim() : undefined,
        notes: editSessionNotes ? editSessionNotes.trim() : undefined,
      };

      const res = await fetch(`${baseUrl}/api/admin/sessions/${editingSession.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || `Failed to update session (HTTP ${res.status})`);
      }

      const json = await res.json().catch(() => null);
      showToast(json?.message || `✅ Session #${editingSession.id} updated successfully!`);

      setCalendarSessions((prev) =>
        prev.map((s) =>
          s.id === editingSession.id
            ? {
                ...s,
                status: editSessionStatus,
                date: editSessionDate,
                start_time: editSessionStartTime,
                end_time: editSessionEndTime,
                meeting_link: editSessionMeetingLink,
                notes: editSessionNotes,
              }
            : s
        )
      );
      setEditingSession(null);
    } catch (err: any) {
      console.error("Update session error:", err);
      showToast(`⚠️ ${err.message || "Failed to update session."}`);
    } finally {
      setIsSavingSession(false);
    }
  };

  const quickUpdateSessionStatus = async (sessionId: number, newStatus: string) => {
    const baseUrl = getBackendApiUrl();
    try {
      const res = await fetch(`${baseUrl}/api/admin/sessions/${sessionId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || `Failed to update status (HTTP ${res.status})`);
      }

      showToast(`✅ Session #${sessionId} marked as ${newStatus}.`);
      setCalendarSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, status: newStatus } : s))
      );
    } catch (err: any) {
      console.error("Quick status error:", err);
      showToast(`⚠️ ${err.message || "Failed to update session status."}`);
    }
  };

  const fetchTutorsFromApi = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    if (!token) return;

    setIsLoadingTutors(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/admin/tutors?per_page=all`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        if (res.status === 401) {
          console.warn("Admin session expired or token invalid");
        }
        return;
      }

      const json = await res.json();
      if (json.stats) {
        setTutorStats(json.stats);
      }

      const list = json.tutors?.data || (Array.isArray(json.tutors) ? json.tutors : []);
      if (Array.isArray(list)) {
        const liveApplicants: Applicant[] = [];
        const liveTutors: Tutor[] = [];

        list.forEach((item: any) => {
          const profile = item.tutor_profile || {};
          const status = profile.approval_status || "pending";

          if (status === "pending") {
            liveApplicants.push({
              id: String(item.id),
              name: item.name,
              email: item.email,
              phone: item.phone || "—",
              degree: profile.qualification || "Registered Tutor",
              subjects: Array.isArray(profile.subjects) ? profile.subjects : ["General"],
              levels: Array.isArray(profile.levels) ? profile.levels : ["All Levels"],
              notes: profile.bio || (profile.years_of_experience ? `Experience: ${profile.years_of_experience}` : "No additional bio."),
              appliedAt: item.created_at ? new Date(item.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Recent",
            });
          } else if (status === "approved") {
            liveTutors.push({
              id: String(item.id),
              name: item.name,
              school: profile.qualification || "Verified Faculty",
              subject: Array.isArray(profile.subjects) ? profile.subjects.join(", ") : "Specialist",
              students: 0,
              region: "UK & International 🌍",
              img: "/images/tutor-1.jpg",
              rate: "£45/hr",
            });
          }
        });

        setApplicants(liveApplicants);
        setTutors(liveTutors);
      }
    } catch (err) {
      console.error("Error fetching tutors from API:", err);
    } finally {
      setIsLoadingTutors(false);
    }
  };

  const getAttachedStudentsForTutor = (tutorId: string | number, tutorName?: string, tutorObj?: any): AttachedStudent[] => {
    const list: AttachedStudent[] = [];
    const seenIds = new Set<string>();

    // 1. From tutorObj if backend returned students/assigned_students/matched_students
    const apiStudents =
      tutorObj?.students ||
      tutorObj?.assigned_students ||
      tutorObj?.matched_students ||
      tutorObj?.tutor_profile?.students ||
      [];

    if (Array.isArray(apiStudents)) {
      apiStudents.forEach((s: any) => {
        const sid = String(s.id || s.student_id || "");
        if (sid) seenIds.add(sid);
        list.push({
          id: s.id || sid,
          name: s.student_name || s.name || "Student",
          parent: s.parent_name || s.parent,
          subject: Array.isArray(s.subjects) ? s.subjects.join(", ") : (s.subject || s.subjects),
          level: s.level,
          status: s.status,
          phone: s.phone,
          email: s.email,
        });
      });
    }

    // 2. From frontend bookings (student registrations)
    const cleanTutorId = String(tutorId).replace(/^(APP-|TUT-)/, "").toLowerCase();
    const cleanTutorName = (tutorName || tutorObj?.name || "").trim().toLowerCase();

    bookings.forEach((b) => {
      const isMatched =
        b.assignedTutors?.some((at) => {
          const atCleanId = String(at.id).replace(/^(APP-|TUT-)/, "").toLowerCase();
          const atCleanName = (at.name || "").trim().toLowerCase();
          return (cleanTutorId && atCleanId === cleanTutorId) || (cleanTutorName && atCleanName === cleanTutorName);
        }) ||
        (cleanTutorName && b.tutorAssigned && b.tutorAssigned.toLowerCase() === cleanTutorName);

      if (isMatched && !seenIds.has(String(b.id))) {
        seenIds.add(String(b.id));
        list.push({
          id: b.id,
          name: b.student,
          parent: b.parent,
          subject: b.subject,
          level: b.level,
          status: b.rawStatus || b.status,
          phone: b.phone,
          email: b.email,
        });
      }
    });

    return list;
  };

  const modalAttachedStudents = selectedTutor ? getAttachedStudentsForTutor(selectedTutor.id, selectedTutor.name, selectedTutor) : [];

  const openTutorDetail = async (id: string | number, fallbackData?: any) => {
    setIsDetailOpen(true);
    setLoadingDetail(true);

    if (fallbackData) {
      setSelectedTutor({
        id: fallbackData.id,
        name: fallbackData.name,
        email: fallbackData.email || "",
        phone: fallbackData.phone || "",
        role: "tutor",
        tutor_profile: {
          qualification: fallbackData.school || fallbackData.degree || "Qualified Educator",
          subjects: Array.isArray(fallbackData.subjects)
            ? fallbackData.subjects
            : typeof fallbackData.subject === "string"
            ? fallbackData.subject.split(",").map((s: string) => s.trim())
            : [],
          levels: Array.isArray(fallbackData.levels) ? fallbackData.levels : [],
          years_of_experience: fallbackData.notes || "",
          bio: fallbackData.notes || "",
          approval_status: fallbackData.approvalStatus || (tutors.some((t) => String(t.id) === String(fallbackData.id)) ? "approved" : "pending"),
        },
      });
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    const baseUrl = getBackendApiUrl();
    const cleanId = String(id).replace(/^(APP-|TUT-)/, "");
    const targetId = /^\d+$/.test(cleanId) ? cleanId : id;

    if (token) {
      try {
        const res = await fetch(`${baseUrl}/api/admin/tutors/${targetId}`, {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.tutor) {
            setSelectedTutor(data.tutor);
          }
        }
      } catch (err) {
        console.error("Error fetching single tutor profile:", err);
      }
    }

    setLoadingDetail(false);
  };

  const fetchStudentsFromApi = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    if (!token) return;

    setIsLoadingStudents(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/admin/students?per_page=all`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) return;

      const json = await res.json();
      if (json.stats) {
        setStudentStats(json.stats);
      }

      const list = json.students?.data || (Array.isArray(json.students) ? json.students : []);
      if (Array.isArray(list)) {
        const liveBookings: Booking[] = list.map((item: any) => ({
          id: String(item.id),
          parent: item.parent_name || "Parent / Guardian",
          student: item.student_name,
          subject: Array.isArray(item.subjects) ? item.subjects.join(", ") : (item.subjects || "General"),
          level: item.level || "Standard Level",
          country: item.phone?.startsWith("+44") ? "🇬🇧 UK" : item.phone?.startsWith("+1") ? "🇺🇸/🇨🇦 North America" : "🌍 International",
          phone: item.phone || "—",
          email: item.email,
          status: item.status || "pending_match",
          rawStatus: item.status || "pending_match",
          date: item.created_at
            ? new Date(item.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
            : "Recent",
          tutorAssigned: item.status === "matched" ? "Matched" : "Pending Match",
          notes: item.notes || "",
          subjects: Array.isArray(item.subjects) ? item.subjects : [],
          assignedTutors: Array.isArray(item.assigned_tutors) ? item.assigned_tutors : [],
        }));
        setBookings(liveBookings);
      }
    } catch (err) {
      console.error("Error fetching students from API:", err);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const openStudentDetail = async (id: string | number, fallbackData?: any) => {
    setIsStudentDetailOpen(true);
    setLoadingStudentDetail(true);

    if (fallbackData) {
      setSelectedStudent({
        id: fallbackData.id,
        parent_name: fallbackData.parent_name || fallbackData.parent || "Parent / Guardian",
        student_name: fallbackData.student_name || fallbackData.student || fallbackData.name || "Student",
        email: fallbackData.email || "",
        phone: fallbackData.phone || "",
        subjects: fallbackData.subjects || (fallbackData.subject ? [fallbackData.subject] : []),
        level: fallbackData.level || "Standard Level",
        notes: fallbackData.notes || "",
        status: fallbackData.rawStatus || fallbackData.status || "pending_match",
        created_at: fallbackData.date || "",
        assigned_tutors: Array.isArray(fallbackData.assignedTutors)
          ? fallbackData.assignedTutors
          : Array.isArray(fallbackData.assigned_tutors)
          ? fallbackData.assigned_tutors
          : [],
      });
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    const baseUrl = getBackendApiUrl();
    const cleanId = String(id).replace(/^(SAM-|STU-)/, "");
    const targetId = /^\d+$/.test(cleanId) ? cleanId : id;

    if (token) {
      try {
        const res = await fetch(`${baseUrl}/api/admin/students/${targetId}`, {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.student) {
            setSelectedStudent(data.student);
          }
        }
      } catch (err) {
        console.error("Error fetching single student profile:", err);
      }
    }

    setLoadingStudentDetail(false);
  };

  const updateStudentStatusApi = async (id: string | number, newStatus: string) => {
    const cleanId = String(id).replace(/^(SAM-|STU-)/, "");
    const targetId = /^\d+$/.test(cleanId) ? cleanId : id;

    try {
      const baseUrl = getBackendApiUrl();
      const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;

      if (token) {
        const res = await fetch(`${baseUrl}/api/admin/students/${targetId}/status`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.message || `Failed to update student status (HTTP ${res.status})`);
        }
      }

      setBookings((prev) =>
        prev.map((b) => (String(b.id) === String(id) ? { ...b, status: newStatus as any, rawStatus: newStatus } : b))
      );

      if (selectedStudent && String(selectedStudent.id) === String(id)) {
        setSelectedStudent((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      const readableStatus = newStatus === "pending_match" ? "Pending Match" : newStatus === "matched" ? "Matched" : newStatus;
      showToast(`Student status updated to ${readableStatus}.`);
    } catch (err: any) {
      console.error("Update student status error:", err);
      showToast(`⚠️ ${err.message || "Failed to update student status."}`);
    }
  };

  const openMatchModal = async () => {
    setSelectedTutorIds(new Set());
    setMatchNotes("");
    setIsMatchModalOpen(true);

    // If we already have approved tutors from the list, use them; else re-fetch
    const alreadyLoaded = approvedTutors.length > 0;
    if (alreadyLoaded) return;

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/admin/tutors?per_page=all&status=approved`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return;
      const json = await res.json();
      const list = json.tutors?.data || (Array.isArray(json.tutors) ? json.tutors : []);
      const parsed: ApprovedTutor[] = list
        .filter((t: any) => t.tutor_profile?.approval_status === "approved")
        .map((t: any) => ({
          id: t.id,
          name: t.name,
          email: t.email,
          qualification: t.tutor_profile?.qualification || "",
          subjects: Array.isArray(t.tutor_profile?.subjects) ? t.tutor_profile.subjects : [],
        }));
      setApprovedTutors(parsed);
    } catch (err) {
      console.error("Failed to load approved tutors for matching:", err);
    }
  };

  const toggleTutorSelection = (id: number | string) => {
    setSelectedTutorIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const submitMatchTutors = async () => {
    if (!selectedStudent || selectedTutorIds.size === 0) return;
    setIsMatchingLoading(true);

    const cleanId = String(selectedStudent.id).replace(/^(SAM-|STU-)/, "");
    const targetId = /^\d+$/.test(cleanId) ? cleanId : selectedStudent.id;

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/admin/students/${targetId}/match-tutors`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          tutor_ids: Array.from(selectedTutorIds),
          ...(matchNotes.trim() ? { notes: matchNotes.trim() } : {}),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || `HTTP ${res.status}`);
      }

      // Update local state
      const count = selectedTutorIds.size;
      setSelectedStudent((prev) => (prev ? { ...prev, status: "matched" } : null));
      setBookings((prev) =>
        prev.map((b) =>
          String(b.id) === String(selectedStudent.id)
            ? { ...b, status: "matched", rawStatus: "matched", tutorAssigned: "Matched" }
            : b
        )
      );
      setStudentStats((prev) => ({
        ...prev,
        pending_match: Math.max(0, prev.pending_match - 1),
        matched: prev.matched + 1,
      }));

      showToast(`✅ Student matched with ${count} tutor${count === 1 ? "" : "s"} successfully!`);
      setIsMatchModalOpen(false);
    } catch (err: any) {
      console.error("Match tutors error:", err);
      showToast(`⚠️ ${err.message || "Failed to match tutors."}`);
    } finally {
      setIsMatchingLoading(false);
    }
  };

  useEffect(() => {
    const mustChange = typeof window !== "undefined" ? localStorage.getItem("samin_must_change_password") : null;
    if (mustChange === "true") {
      window.location.href = "/change-password";
      return;
    }

    const stored = typeof window !== "undefined" ? localStorage.getItem("samin_admin_logged_in") : null;
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;

    if (stored === "true" || token) {
      setIsAuthed(true);
      Promise.all([fetchCurrentUser(), fetchTutorsFromApi(), fetchStudentsFromApi()]).finally(() => {
        setInitialLoading(false);
      });
    } else {
      setInitialLoading(false);
    }
    const u = typeof window !== "undefined" ? localStorage.getItem("samin_user") : null;
    if (u) {
      try {
        setCurrentUser(JSON.parse(u));
      } catch {}
    }
    setChecking(false);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    const cleanEmail = loginEmail.trim();
    const cleanPassword = loginPassword;

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // Fallback for hardcoded credentials if backend is offline
        if ((cleanEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase() || cleanEmail.toLowerCase() === "admin@samin.edu") && cleanPassword === ADMIN_PASSWORD) {
          localStorage.setItem("samin_admin_logged_in", "true");
          localStorage.removeItem("samin_must_change_password");
          setIsAuthed(true);
          return;
        }

        const msg = data?.message || "Invalid email or password.";
        setLoginError(msg);
        return;
      }

      // Success from API
      localStorage.setItem("samin_admin_logged_in", "true");
      if (data?.token) {
        localStorage.setItem("samin_auth_token", data.token);
      }
      if (data?.user) {
        localStorage.setItem("samin_user", JSON.stringify(data.user));
        setCurrentUser(data.user);
      }

      // Check if user must change password
      if (data?.must_change_password === true || data?.user?.must_change_password === true) {
        localStorage.setItem("samin_must_change_password", "true");
        window.location.href = "/change-password";
        return;
      } else {
        localStorage.removeItem("samin_must_change_password");
      }

      setIsAuthed(true);
      setInitialLoading(true);
      Promise.all([fetchCurrentUser(), fetchTutorsFromApi(), fetchStudentsFromApi()]).finally(() => {
        setInitialLoading(false);
      });
      showToast(data?.message || "Welcome back!");
    } catch (err: any) {
      console.error("Dashboard login error:", err);
      // Fallback for hardcoded credentials if backend is offline
      if ((cleanEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase() || cleanEmail.toLowerCase() === "admin@samin.edu") && cleanPassword === ADMIN_PASSWORD) {
        localStorage.setItem("samin_admin_logged_in", "true");
        setIsAuthed(true);
        setInitialLoading(true);
        Promise.all([fetchTutorsFromApi(), fetchStudentsFromApi()]).finally(() => {
          setInitialLoading(false);
        });
        return;
      }

      setLoginError(
        err?.message?.includes("Failed to fetch")
          ? `Unable to connect to backend server (${getBackendApiUrl()}).`
          : (err?.message || "Login failed. Please try again.")
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("samin_admin_logged_in");
      localStorage.removeItem("samin_auth_token");
      localStorage.removeItem("samin_user");
      window.location.href = "/";
    }
  };

  const approveApplicant = async (id: string) => {
    const app = applicants.find((a) => a.id === id);
    if (!app) return;

    try {
      const baseUrl = getBackendApiUrl();
      const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;

      if (token) {
        const res = await fetch(`${baseUrl}/api/admin/tutors/${id}/status`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: "approved" }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.message || `Failed to update status on server (HTTP ${res.status})`);
        }
      }

      const newTutor: Tutor = {
        id: id.startsWith("TUT-") ? id : `TUT-${id}`,
        name: app.name,
        school: app.degree,
        subject: app.subjects.join(", "),
        students: 0,
        region: "UK 🇬🇧",
        img: "/images/tutor-1.jpg",
        rate: "£45/hr",
      };
      setTutors((prev) => [newTutor, ...prev]);
      setApplicants((prev) => prev.filter((a) => a.id !== id));
      setExpandedApplicant(null);
      setTutorStats((prev) => ({
        ...prev,
        pending: Math.max(0, prev.pending - 1),
        approved: prev.approved + 1,
      }));
      showToast(`✅ ${app.name} approved and onboarded to active tutors!`);
    } catch (err: any) {
      console.error("Approve error:", err);
      showToast(`⚠️ ${err.message || "Failed to update tutor status."}`);
    }
  };

  const declineApplicant = async (id: string) => {
    const app = applicants.find((a) => a.id === id);
    if (!app) return;

    try {
      const baseUrl = getBackendApiUrl();
      const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;

      if (token) {
        const res = await fetch(`${baseUrl}/api/admin/tutors/${id}/status`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: "rejected" }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.message || `Failed to decline applicant on server (HTTP ${res.status})`);
        }
      }

      setApplicants((prev) => prev.filter((a) => a.id !== id));
      setExpandedApplicant(null);
      setTutorStats((prev) => ({
        ...prev,
        pending: Math.max(0, prev.pending - 1),
        rejected: prev.rejected + 1,
      }));
      showToast(`❌ ${app.name}'s application marked as rejected.`);
    } catch (err: any) {
      console.error("Decline error:", err);
      showToast(`⚠️ ${err.message || "Failed to decline applicant."}`);
    }
  };

  const removeTutor = async (id: string) => {
    const t = tutors.find((x) => x.id === id);
    if (!t) return;

    try {
      const baseUrl = getBackendApiUrl();
      const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;

      if (token) {
        await fetch(`${baseUrl}/api/admin/tutors/${id}/status`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: "rejected" }),
        });
      }

      setTutors((prev) => prev.filter((x) => x.id !== id));
      setTutorStats((prev) => ({
        ...prev,
        approved: Math.max(0, prev.approved - 1),
        rejected: prev.rejected + 1,
      }));
      showToast(`🗑️ ${t.name} removed from the roster.`);
    } catch (err) {
      setTutors((prev) => prev.filter((x) => x.id !== id));
      showToast(`🗑️ ${t.name} removed from the roster.`);
    }
  };

  const handleEnrollTutorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollTutorError(null);
    setEnrollTutorFieldErrors({});

    const trimmedName = enrollTutorForm.name.trim();
    const trimmedEmail = enrollTutorForm.email.trim();
    const trimmedQual = enrollTutorForm.qualification.trim();

    if (!trimmedName) {
      setEnrollTutorError("Tutor full name is required.");
      return;
    }
    if (!trimmedEmail) {
      setEnrollTutorError("A valid email address is required.");
      return;
    }
    if (!trimmedQual) {
      setEnrollTutorError("Highest qualification is required.");
      return;
    }
    if (!enrollTutorForm.subjects || enrollTutorForm.subjects.length === 0) {
      setEnrollTutorError("Please select or specify at least one subject.");
      return;
    }

    setIsEnrollingTutor(true);

    try {
      const baseUrl = getBackendApiUrl();
      const payload = {
        name: trimmedName,
        email: trimmedEmail,
        phone: enrollTutorForm.phone.trim() || undefined,
        qualification: trimmedQual,
        subjects: enrollTutorForm.subjects,
        levels: enrollTutorForm.levels.length > 0 ? enrollTutorForm.levels : [],
        years_of_experience: enrollTutorForm.years_of_experience.trim() || undefined,
        bio: enrollTutorForm.bio.trim() || undefined,
      };

      const res = await fetch(`${baseUrl}/api/admin/tutors`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 422 && data?.errors) {
          setEnrollTutorFieldErrors(data.errors);
          setEnrollTutorError(data.message || "Please fix the validation errors below.");
        } else if (res.status === 403) {
          setEnrollTutorError("Unauthorized. Admin access required.");
        } else {
          setEnrollTutorError(data?.message || `Failed to enroll tutor (HTTP ${res.status}).`);
        }
        return;
      }

      // Success (201 Created)
      showToast(data?.message || "Tutor enrolled successfully. Login details have been emailed.");
      setIsAddTutorOpen(false);
      setEnrollTutorForm({
        name: "",
        email: "",
        phone: "",
        qualification: "",
        subjects: ["Mathematics"],
        levels: ["Year 1-6", "GCSE preparation"],
        years_of_experience: "",
        bio: "",
      });
      await fetchTutorsFromApi();
    } catch (err: any) {
      console.error("Enroll tutor error:", err);
      setEnrollTutorError(err?.message || "An unexpected error occurred while enrolling tutor.");
    } finally {
      setIsEnrollingTutor(false);
    }
  };

  const updateBookingStatus = (id: string, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    showToast(`Updated status to ${newStatus}`);
  };

  const assignTutorToBooking = (id: string, tutorName: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, tutorAssigned: tutorName, status: "Tutor Matched" as BookingStatus } : b))
    );
    showToast(`Assigned ${tutorName} to student inquiry`);
  };

  const filteredApplicants = applicants.filter((a) =>
    `${a.name} ${a.email} ${a.subjects.join(" ")}`.toLowerCase().includes(searchApplicants.toLowerCase())
  );
  const filteredTutors = tutors.filter((t) =>
    `${t.name} ${t.school} ${t.subject}`.toLowerCase().includes(searchTutors.toLowerCase())
  );
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = `${b.parent} ${b.student} ${b.subject} ${b.status} ${b.email} ${b.phone}`
      .toLowerCase()
      .includes(searchBookings.toLowerCase());
    const matchesStatus =
      studentStatusFilter === "all" ||
      b.rawStatus === studentStatusFilter ||
      b.status === studentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const newInquiries = bookings.filter((b) => b.status === "New Inquiry" || b.status === "pending_match").length;

  /* ── Loading spinner ── */
  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ width: "2.5rem", height: "2.5rem", border: "3px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  /* ── Login screen ── */
  if (!isAuthed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#f0fdf9 0%,#e6f7f5 50%,#f8fafc 100%)", padding: "1rem", fontFamily: "'Inter',system-ui,sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box}`}</style>
        <div style={{ width: "100%", maxWidth: "420px", background: "#fff", borderRadius: "16px", boxShadow: "0 20px 60px rgba(32,178,164,0.12)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#20b2a4,#0d9488)", padding: "2rem", textAlign: "center" }}>
            <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <ShieldCheck size={28} color="#fff" />
            </div>
            <h1 style={{ color: "#fff", fontSize: "1.35rem", fontWeight: 800, margin: 0 }}>Admin Dashboard</h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.83rem", margin: "0.3rem 0 0" }}>Samin Home Tutors \u2014 Secure Portal</p>
          </div>
          <form onSubmit={handleLogin} style={{ padding: "2rem" }}>
            {loginError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "0.7rem 1rem", marginBottom: "1.2rem", color: "#dc2626", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <AlertCircle size={15} /> {loginError}
              </div>
            )}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.4rem" }}>Email</label>
              <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="admin@samin.com"
                style={{ width: "100%", padding: "0.65rem 0.85rem", border: "1.5px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: "1.5rem", position: "relative" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.4rem" }}>Password</label>
              <input type={showPw ? "text" : "password"} required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Master password"
                style={{ width: "100%", padding: "0.65rem 2.5rem 0.65rem 0.85rem", border: "1.5px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
              <button type="button" onClick={() => setShowPw((p) => !p)} style={{ position: "absolute", right: "0.75rem", top: "2.1rem", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
                {showPw ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <button type="submit" disabled={loginLoading}
              style={{ width: "100%", padding: "0.8rem", background: loginLoading ? "#9ca3af" : "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.95rem", cursor: loginLoading ? "not-allowed" : "pointer" }}>
              {loginLoading ? "Signing in\u2026" : "Sign In to Dashboard"}
            </button>
            <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
              <Link href="/" style={{ color: "#20b2a4", fontSize: "0.82rem", textDecoration: "none", fontWeight: 600 }}>\u2190 Back to Public Website</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* ── Dashboard ── */
  const navItems: { tab: NavTab; icon: React.ReactNode; label: string; badge?: number }[] = [
    { tab: "overview",    icon: <LayoutDashboard size={18} />, label: "Overview" },
    { tab: "applicants",  icon: <UserPlus size={18} />,        label: "Applicants",  badge: (tutorStats.pending || applicants.length) || undefined },
    { tab: "tutors",      icon: <GraduationCap size={18} />,   label: "Tutors",      badge: (tutorStats.approved || tutors.length) || undefined },
    { tab: "bookings",    icon: <Users size={18} />,           label: "Students",    badge: (studentStats.pending_match || newInquiries) || undefined },
    { tab: "sessions",    icon: <Calendar size={18} />,        label: "Timetables & Sessions" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter',system-ui,sans-serif", background: "#f8fafc" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
        .dash-card{background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.07),0 4px 12px rgba(0,0,0,0.04)}
        .nav-btn{display:flex;align-items:center;gap:0.65rem;width:100%;padding:0.72rem 1rem;border-radius:8px;border:none;cursor:pointer;font-size:0.87rem;font-weight:600;transition:all 0.15s;text-align:left;background:none}
        .nav-btn:hover{background:rgba(32,178,164,0.1);color:#0d9488}
        .nav-btn.active{background:rgba(32,178,164,0.15);color:#0d9488}
        .action-btn{padding:0.38rem 0.85rem;border-radius:6px;border:none;font-size:0.78rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:0.3rem;transition:opacity 0.15s}
        .action-btn:hover{opacity:0.82}
        .search-box{display:flex;align-items:center;gap:0.5rem;background:#fff;border:1.5px solid #e2e8f0;border-radius:8px;padding:0.5rem 0.85rem}
        .search-box:focus-within{border-color:#20b2a4}
        .search-box input{border:none;outline:none;font-size:0.87rem;background:transparent;width:100%;font-family:inherit}
        .table-row:hover{background:#f8fafc}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .page-enter{animation:fadeUp 0.25s ease}
        @keyframes spin{to{transform:rotate(360deg)}}
        .toast{position:fixed;bottom:1.5rem;right:1.5rem;background:#1e293b;color:#fff;padding:0.75rem 1.2rem;border-radius:10px;font-size:0.85rem;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.2);animation:fadeUp 0.3s ease}
        @media(max-width:768px){
          .sidebar{position:fixed!important;left:0;top:0;z-index:200;height:100vh;transform:translateX(-100%);transition:transform 0.3s}
          .sidebar.open{transform:translateX(0)!important}
          .mob-menu{display:flex!important}
          .booking-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 199 }} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}
        style={{ width: "235px", minWidth: "235px", background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", padding: "1.25rem 0.85rem" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", padding: "0 0.15rem 1rem", borderBottom: "1px solid #f1f5f9" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.55rem", textDecoration: "none" }}>
            <div style={{ width: "1.9rem", height: "1.9rem", borderRadius: "50%", overflow: "hidden", border: "2px solid #20b2a4", flexShrink: 0 }}>
              <Image src="/images/samin_logo.jpeg" alt="Samin" width={30} height={30} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "#0f172a" }}>
              <span style={{ color: "#20b2a4" }}>Samin</span> Admin
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#64748b" }} className="sidebar-close-btn">
            <X size={17} />
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.15rem" }}>
          {navItems.map(({ tab, icon, label, badge }) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setSidebarOpen(false); }}
              className={`nav-btn${activeTab === tab ? " active" : ""}`}
              style={{ color: activeTab === tab ? "#0d9488" : "#4b5563" }}>
              {icon}
              <span style={{ flex: 1 }}>{label}</span>
              {badge !== undefined && badge > 0 && (
                <span style={{
                  background: tab === "applicants" ? "#fef3c7" : tab === "bookings" ? "#fee2e2" : "#dbeafe",
                  color: tab === "applicants" ? "#b45309" : tab === "bookings" ? "#dc2626" : "#1d4ed8",
                  fontSize: "0.68rem", fontWeight: 800, padding: "0.1rem 0.45rem", borderRadius: "10px", minWidth: "20px", textAlign: "center"
                }}>{badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.85rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {currentUser && (
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.6rem 0.75rem", marginBottom: "0.35rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.75rem", flexShrink: 0 }}>
                  {currentUser.name?.charAt(0) || "A"}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {currentUser.name || "Admin"}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {currentUser.email || "admin@samin.com"}
                  </div>
                </div>
              </div>
            </div>
          )}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.65rem 1rem", borderRadius: "8px", color: "#4b5563", textDecoration: "none", fontSize: "0.84rem", fontWeight: 600 }}>
            <Globe size={16} /> Public Website
          </Link>
          <button onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.65rem 1rem", borderRadius: "8px", border: "none", background: "none", color: "#ef4444", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0.85rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <button onClick={() => setSidebarOpen(true)} className="mob-menu"
              style={{ display: "none", background: "none", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0.45rem", cursor: "pointer", alignItems: "center" }}>
              <Menu size={18} color="#374151" />
            </button>
            <div>
              <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "applicants" && "Tutor Applicants"}
                {activeTab === "tutors" && "Enrolled Tutors"}
                {activeTab === "bookings" && "Student Registrations"}
                {activeTab === "sessions" && "Student Timetables & Sessions"}
              </h1>
              <p style={{ fontSize: "0.73rem", color: "#94a3b8", margin: 0 }}>
                {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <button
              onClick={() => {
                fetchCurrentUser();
                fetchTutorsFromApi();
                fetchStudentsFromApi();
                if (timetableStudent) {
                  fetchStudentTimetable(timetableStudent.id);
                  fetchStudentSessions(timetableStudent.id);
                }
              }}
              disabled={isLoadingTutors || isLoadingStudents}
              title="Sync live tutor & student data from backend"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.38rem 0.65rem",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                background: "#fff",
                color: "#475569",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: (isLoadingTutors || isLoadingStudents) ? "not-allowed" : "pointer",
              }}
            >
              <RefreshCw size={13} style={{ animation: (isLoadingTutors || isLoadingStudents) ? "spin 0.8s linear infinite" : "none" }} />
              <span>Sync</span>
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#f0fdf9",
                border: "1px solid #99f6e4",
                borderRadius: "8px",
                padding: "0.38rem 0.75rem",
              }}
              title={currentUser?.email ? `${currentUser.name} (${currentUser.email})${currentUser.phone ? ` • ${currentUser.phone}` : ""}` : undefined}
            >
              <ShieldCheck size={14} color="#0d9488" />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0d9488" }}>
                {currentUser?.name || "Admin"} ({currentUser?.role || "Active"})
              </span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.38rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid #fee2e2",
                background: "#fef2f2",
                color: "#dc2626",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
              title="Sign Out to Public Website"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }} className="page-enter">

          {initialLoading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "55vh", gap: "1.25rem" }}>
              <div style={{ position: "relative", width: "3.75rem", height: "3.75rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", inset: 0, border: "3.5px solid #e2e8f0", borderRadius: "50%" }} />
                <div style={{ position: "absolute", inset: 0, border: "3.5px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
                <ShieldCheck size={24} color="#0d9488" />
              </div>
              <div style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.35rem" }}>
                  Loading Dashboard Data…
                </h3>
                <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                  Fetching live tutors, applicants, and student registrations from server
                </p>
              </div>
            </div>
          ) : (
            <>
          {/* ── OVERVIEW ─────────────────────────────────── */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(185px,1fr))", gap: "1rem" }}>
                {[
                  { icon: <GraduationCap size={22} color="#20b2a4" />, label: "Active Tutors", value: tutorStats.approved ?? tutors.length, bg: "#f0fdf9", border: "#99f6e4" },
                  { icon: <UserPlus size={22} color="#d97706" />, label: "Pending Applicants", value: tutorStats.pending ?? applicants.length, bg: "#fffbeb", border: "#fde68a" },
                  { icon: <Calendar size={22} color="#3b82f6" />, label: "Student Registrations", value: studentStats.total ?? bookings.length, bg: "#eff6ff", border: "#bfdbfe" },
                  { icon: <AlertCircle size={22} color="#ef4444" />, label: "Pending Matches", value: studentStats.pending_match ?? newInquiries, bg: "#fffbeb", border: "#fde68a" },
                  { icon: <TrendingUp size={22} color="#10b981" />, label: "Matched Students", value: studentStats.matched ?? 0, bg: "#ecfdf5", border: "#a7f3d0" },
                ].map(({ icon, label, value, bg, border }) => (
                  <div key={label} className="dash-card" style={{ padding: "1.15rem 1.3rem", display: "flex", alignItems: "center", gap: "1rem", border: `1.5px solid ${border}`, background: bg }}>
                    <div style={{ width: "2.8rem", height: "2.8rem", borderRadius: "10px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                        {(isLoadingTutors || isLoadingStudents) ? (
                          <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                        ) : (
                          value
                        )}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500, marginTop: "0.1rem" }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="dash-card" style={{ padding: "1.25rem 1.5rem" }}>
                <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.85rem" }}>Quick Actions</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
                  <button onClick={() => setActiveTab("applicants")} style={{ padding: "0.55rem 1rem", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.83rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <UserPlus size={14} /> Review Applicants {applicants.length > 0 && `(${applicants.length})`}
                  </button>
                  <button onClick={() => setActiveTab("bookings")} style={{ padding: "0.55rem 1rem", background: "#fff", color: "#0f172a", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontWeight: 700, fontSize: "0.83rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Calendar size={14} /> View Bookings
                  </button>
                  <button onClick={() => setActiveTab("tutors")} style={{ padding: "0.55rem 1rem", background: "#fff", color: "#0f172a", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontWeight: 700, fontSize: "0.83rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <GraduationCap size={14} /> Manage Tutors
                  </button>
                  <Link href="/" style={{ padding: "0.55rem 1rem", background: "#fff", color: "#20b2a4", border: "1.5px solid #20b2a4", borderRadius: "8px", fontWeight: 700, fontSize: "0.83rem", display: "flex", alignItems: "center", gap: "0.4rem", textDecoration: "none" }}>
                    <Globe size={14} /> View Public Site
                  </Link>
                </div>
              </div>

              {/* Recent bookings preview */}
              <div className="dash-card" style={{ padding: "1.25rem 1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>Recent Student Registrations</h3>
                  <button onClick={() => setActiveTab("bookings")} style={{ background: "none", border: "none", color: "#20b2a4", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                    View all <ChevronRight size={14} />
                  </button>
                </div>
                {isLoadingStudents ? (
                  <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#64748b" }}>
                    <div style={{ width: "24px", height: "24px", border: "2.5px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 0.6rem" }} />
                    <span style={{ fontSize: "0.82rem" }}>Loading student registrations…</span>
                  </div>
                ) : bookings.length === 0 ? (
                  <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
                    No student registrations found yet.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                    {bookings.slice(0, 4).map((b) => (
                      <div key={b.id} className="table-row" style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.6rem 0.75rem", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                        <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.88rem", flexShrink: 0 }}>
                          {b.parent.charAt(0)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: "0.83rem", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.parent}</div>
                          <div style={{ fontSize: "0.73rem", color: "#64748b" }}>{b.student} \u00b7 {b.subject}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.15rem", flexShrink: 0 }}>
                          <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "20px", ...statusStyle[b.status] }}>{b.status}</span>
                          <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>{b.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── APPLICANTS ───────────────────────────────── */}
          {activeTab === "applicants" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="page-enter">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                <div className="search-box" style={{ flex: 1, maxWidth: "340px" }}>
                  <Search size={15} color="#94a3b8" />
                  <input value={searchApplicants} onChange={(e) => setSearchApplicants(e.target.value)} placeholder="Search applicants…" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>
                    {isLoadingTutors ? "Loading..." : `${filteredApplicants.length} pending`}
                  </span>
                  <button
                    onClick={fetchTutorsFromApi}
                    disabled={isLoadingTutors}
                    title="Reload live tutor applications from API"
                    style={{
                      background: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      padding: "0.35rem 0.65rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#475569",
                      cursor: isLoadingTutors ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <RefreshCw size={12} style={{ animation: isLoadingTutors ? "spin 0.8s linear infinite" : "none" }} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {isLoadingTutors ? (
                <div className="dash-card" style={{ padding: "3.5rem 2rem", textAlign: "center" }}>
                  <div style={{ width: "32px", height: "32px", border: "3px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 0.75rem" }} />
                  <p style={{ fontWeight: 700, color: "#0f172a", margin: "0 0 0.3rem" }}>Loading tutor applications…</p>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>Fetching pending applications from server</p>
                </div>
              ) : filteredApplicants.length === 0 ? (
                <div className="dash-card" style={{ padding: "3.5rem 2rem", textAlign: "center" }}>
                  <CheckCircle2 size={40} color="#20b2a4" style={{ marginBottom: "0.75rem" }} />
                  <p style={{ fontWeight: 700, color: "#0f172a", margin: "0 0 0.3rem" }}>All clear!</p>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                    {searchApplicants ? "No applicants match your search." : "No pending applicants right now."}
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))", gap: "1rem" }}>
                  {filteredApplicants.map((app) => (
                    <div key={app.id} className="dash-card" style={{ padding: "1.2rem", border: "1.5px solid #e2e8f0", cursor: "pointer", transition: "all 0.15s" }}
                      onClick={() => openTutorDetail(app.id, app)}
                      title="Click card to view full tutor profile dossier"
                    >
                      {/* Header */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem", marginBottom: "0.8rem" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", flexShrink: 0 }}>
                          {app.name.charAt(0)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: "0.93rem", color: "#0f172a" }}>{app.name}</div>
                          <div style={{ fontSize: "0.76rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.degree}</div>
                          <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.1rem" }}>Applied: {app.appliedAt}</div>
                        </div>
                        <span style={{ background: "#fef3c7", color: "#b45309", fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "10px", flexShrink: 0 }}>Pending</span>
                      </div>

                      {/* Tags */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.65rem" }}>
                        {app.subjects.map((s) => (
                          <span key={s} style={{ fontSize: "0.7rem", background: "#f0fdf9", color: "#0d9488", border: "1px solid #99f6e4", padding: "0.12rem 0.45rem", borderRadius: "20px", fontWeight: 600 }}>{s}</span>
                        ))}
                        {app.levels.map((l) => (
                          <span key={l} style={{ fontSize: "0.7rem", background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", padding: "0.12rem 0.45rem", borderRadius: "20px", fontWeight: 600 }}>{l}</span>
                        ))}
                      </div>

                      {/* Contact Info Preview */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.4rem", fontSize: "0.76rem", color: "#64748b", marginBottom: "0.8rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <Mail size={12} /> {app.email}
                        </div>
                        <span style={{ color: "#20b2a4", fontWeight: 700, fontSize: "0.72rem", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                          <Eye size={12} /> View Profile ›
                        </span>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: "0.45rem" }}>
                        <button onClick={(e) => { e.stopPropagation(); approveApplicant(app.id); }}
                          className="action-btn" style={{ background: "#d1fae5", color: "#065f46", flex: 1, justifyContent: "center" }}>
                          <CheckCircle2 size={13} /> Approve &amp; Onboard
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); declineApplicant(app.id); }}
                          className="action-btn" style={{ background: "#fee2e2", color: "#991b1b" }}>
                          <XCircle size={13} /> Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TUTORS ───────────────────────────────────── */}
          {activeTab === "tutors" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="page-enter">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                <div className="search-box" style={{ flex: 1, maxWidth: "340px" }}>
                  <Search size={15} color="#94a3b8" />
                  <input value={searchTutors} onChange={(e) => setSearchTutors(e.target.value)} placeholder="Search tutors…" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>{filteredTutors.length} enrolled</span>
                  <button
                    onClick={fetchTutorsFromApi}
                    disabled={isLoadingTutors}
                    title="Reload live tutors from API"
                    style={{
                      background: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      padding: "0.45rem 0.65rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#475569",
                      cursor: isLoadingTutors ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <RefreshCw size={12} style={{ animation: isLoadingTutors ? "spin 0.8s linear infinite" : "none" }} />
                    <span>Refresh</span>
                  </button>
                  <button
                    onClick={() => setIsAddTutorOpen(true)}
                    style={{
                      background: "linear-gradient(135deg,#20b2a4,#0d9488)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.45rem 0.9rem",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      boxShadow: "0 2px 6px rgba(32,178,164,0.25)",
                    }}
                  >
                    <UserPlus size={15} />
                    <span>Enroll Tutor</span>
                  </button>
                </div>
              </div>

              {isLoadingTutors ? (
                <div className="dash-card" style={{ padding: "3.5rem 2rem", textAlign: "center" }}>
                  <div style={{ width: "32px", height: "32px", border: "3px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 0.75rem" }} />
                  <p style={{ fontWeight: 700, color: "#0f172a", margin: "0 0 0.3rem" }}>Loading enrolled tutors…</p>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>Fetching active tutor roster from server</p>
                </div>
              ) : filteredTutors.length === 0 ? (
                <div className="dash-card" style={{ padding: "3.5rem 2rem", textAlign: "center" }}>
                  <GraduationCap size={40} color="#94a3b8" style={{ marginBottom: "0.75rem" }} />
                  <p style={{ fontWeight: 700, color: "#0f172a", margin: "0 0 0.3rem" }}>No enrolled tutors yet</p>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                    {searchTutors ? "No tutors match your search criteria." : "Approve pending applicants or click 'Add New Tutor' above."}
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: "1rem" }}>
                  {filteredTutors.map((t) => {
                    const attachedStudents = getAttachedStudentsForTutor(t.id, t.name, t);
                    const studentCount = attachedStudents.length;
                    return (
                      <div key={t.id} className="dash-card" style={{ padding: "1.2rem", border: "1.5px solid #e2e8f0", cursor: "pointer", transition: "all 0.15s" }}
                        onClick={() => openTutorDetail(t.id, t)}
                        title="Click card to view full tutor profile dossier"
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.85rem" }}>
                          <div style={{ width: "48px", height: "48px", borderRadius: "50%", overflow: "hidden", border: "2px solid #20b2a4", flexShrink: 0 }}>
                            <Image src={t.img} alt={t.name} width={48} height={48} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 800, fontSize: "0.88rem", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                            <div style={{ fontSize: "0.73rem", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.school}</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem", flexShrink: 0 }}>
                            <span style={{ background: "#d1fae5", color: "#065f46", fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "10px" }}>Active</span>
                            <span style={{
                              background: studentCount > 0 ? "#ecfdf5" : "#f1f5f9",
                              color: studentCount > 0 ? "#065f46" : "#64748b",
                              border: `1px solid ${studentCount > 0 ? "#a7f3d0" : "#e2e8f0"}`,
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              padding: "0.1rem 0.45rem",
                              borderRadius: "8px",
                              whiteSpace: "nowrap",
                            }}>
                              Student {studentCount} active
                            </span>
                          </div>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem" }}>
                          {t.subject.split(",").map((s) => (
                            <span key={s} style={{ fontSize: "0.7rem", background: "#f0fdf9", color: "#0d9488", border: "1px solid #99f6e4", padding: "0.12rem 0.45rem", borderRadius: "20px", fontWeight: 600 }}>{s.trim()}</span>
                          ))}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "0.75rem" }}>
                          {[
                            { l: "Students", v: `Student ${studentCount} active` },
                            { l: "Rate", v: t.rate },
                            { l: "Region", v: t.region },
                            { l: "ID", v: `#${t.id}` },
                          ].map(({ l, v }) => (
                            <div key={l} style={{ background: "#f8fafc", borderRadius: "6px", padding: "0.32rem 0.55rem" }}>
                              <div style={{ fontSize: "0.62rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{l}</div>
                              <div style={{ fontSize: "0.76rem", color: l === "Students" && studentCount > 0 ? "#0d9488" : "#0f172a", fontWeight: 700 }}>{v}</div>
                            </div>
                          ))}
                        </div>

                        {/* Attached Student(s) Preview */}
                        <div style={{ background: attachedStudents.length > 0 ? "#f0fdf9" : "#f8fafc", border: `1px solid ${attachedStudents.length > 0 ? "#99f6e4" : "#e2e8f0"}`, borderRadius: "8px", padding: "0.45rem 0.65rem", marginBottom: "0.75rem" }}>
                          <div style={{ fontSize: "0.64rem", fontWeight: 800, color: attachedStudents.length > 0 ? "#0d9488" : "#64748b", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: "0.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                              <Users size={11} /> Attached Student{attachedStudents.length === 1 ? "" : "s"}
                            </span>
                            <span style={{ fontWeight: 700, color: attachedStudents.length > 0 ? "#065f46" : "#94a3b8" }}>
                              Student {studentCount} active
                            </span>
                          </div>
                          {attachedStudents.length > 0 ? (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                              {attachedStudents.map((st) => (
                                <span key={st.id} style={{ fontSize: "0.68rem", fontWeight: 700, color: "#0f172a", background: "#fff", border: "1px solid #99f6e4", borderRadius: "10px", padding: "0.12rem 0.45rem", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                                  <span>👤</span> {st.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div style={{ fontSize: "0.68rem", color: "#94a3b8", fontStyle: "italic" }}>
                              No students attached yet
                            </div>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: "0.45rem" }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); openTutorDetail(t.id, t); }}
                            className="action-btn"
                            style={{ background: "#f0fdf9", color: "#0d9488", border: "1px solid #99f6e4", flex: 1, justifyContent: "center" }}
                          >
                            <Eye size={13} /> View Profile
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeTutor(t.id); }}
                            className="action-btn"
                            style={{ background: "#fee2e2", color: "#991b1b" }}
                            title="Remove from roster"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── BOOKINGS / STUDENT REGISTRATIONS ───────────── */}
          {activeTab === "bookings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="page-enter">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                <div className="search-box" style={{ flex: 1, maxWidth: "340px" }}>
                  <Search size={15} color="#94a3b8" />
                  <input value={searchBookings} onChange={(e) => setSearchBookings(e.target.value)} placeholder="Search students / registrations\u2026" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
                  {[
                    { id: "all", label: `All (${bookings.length})` },
                    { id: "pending_match", label: `Pending Match (${studentStats.pending_match || 0})` },
                    { id: "matched", label: `Matched (${studentStats.matched || 0})` },
                    { id: "completed", label: `Completed (${studentStats.total ? studentStats.total - (studentStats.pending_match + studentStats.matched + studentStats.cancelled) : 0})` },
                    { id: "cancelled", label: `Cancelled (${studentStats.cancelled || 0})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setStudentStatusFilter(tab.id)}
                      style={{
                        padding: "0.3rem 0.65rem",
                        borderRadius: "20px",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        border: "1px solid",
                        cursor: "pointer",
                        borderColor: studentStatusFilter === tab.id ? "#20b2a4" : "#e2e8f0",
                        background: studentStatusFilter === tab.id ? "#f0fdf9" : "#fff",
                        color: studentStatusFilter === tab.id ? "#0d9488" : "#64748b",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                  <button
                    onClick={() => fetchStudentsFromApi()}
                    style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.35rem 0.65rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}
                  >
                    <RefreshCw size={13} className={isLoadingStudents ? "spin" : ""} /> Refresh
                  </button>
                </div>
              </div>

              {/* Desktop table */}
              {isLoadingStudents ? (
                <div className="dash-card" style={{ padding: "3.5rem 2rem", textAlign: "center" }}>
                  <div style={{ width: "32px", height: "32px", border: "3px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 0.75rem" }} />
                  <p style={{ fontWeight: 700, color: "#0f172a", margin: "0 0 0.3rem" }}>Loading student registrations…</p>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>Fetching student inquiries and assigned tutors</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="dash-card" style={{ padding: "3.5rem 2rem", textAlign: "center" }}>
                  <Calendar size={40} color="#94a3b8" style={{ marginBottom: "0.75rem" }} />
                  <p style={{ fontWeight: 700, color: "#0f172a", margin: "0 0 0.3rem" }}>No registrations found</p>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                    {searchBookings || studentStatusFilter !== "all"
                      ? "No student registrations match your filter criteria."
                      : "No students registered yet."}
                  </p>
                </div>
              ) : (
                <div className="dash-card" style={{ overflow: "hidden" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "750px" }}>
                      <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                          {["ID", "Student / Parent", "Subject & Level", "Contact", "Matching Status", "Date", "Action"].map((h) => (
                            <th key={h} style={{ padding: "0.7rem 1rem", fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((b, i) => {
                          const currentBadge = statusStyle[b.status] || { bg: "#f1f5f9", color: "#475569", label: b.status };
                          return (
                            <tr
                              key={b.id}
                              className="table-row"
                              onClick={() => openStudentDetail(b.id, b)}
                              style={{ borderBottom: i < filteredBookings.length - 1 ? "1px solid #f1f5f9" : "none", cursor: "pointer" }}
                            >
                              <td style={{ padding: "0.85rem 1rem", fontSize: "0.72rem", fontWeight: 700, color: "#64748b", fontFamily: "monospace" }}>#{b.id}</td>
                              <td style={{ padding: "0.85rem 1rem" }}>
                                <div style={{ fontWeight: 700, fontSize: "0.84rem", color: "#0f172a" }}>{b.student}</div>
                                <div style={{ fontSize: "0.73rem", color: "#64748b" }}>Parent: {b.parent}</div>
                              </td>
                              <td style={{ padding: "0.85rem 1rem" }}>
                                <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "#0f172a" }}>{b.subject}</div>
                                <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{b.level}</div>
                              </td>
                              <td style={{ padding: "0.85rem 1rem" }}>
                                <div style={{ fontSize: "0.78rem", color: "#0f172a", fontWeight: 500 }}>{b.email}</div>
                                <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{b.phone}</div>
                              </td>
                              <td style={{ padding: "0.85rem 1rem" }} onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={b.rawStatus || b.status}
                                  onChange={(e) => updateStudentStatusApi(b.id, e.target.value)}
                                  style={{
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    padding: "0.25rem 0.65rem",
                                    borderRadius: "20px",
                                    border: "1px solid rgba(0,0,0,0.08)",
                                    cursor: "pointer",
                                    background: currentBadge.bg,
                                    color: currentBadge.color,
                                  }}
                                >
                                  <option value="pending_match">Pending Match</option>
                                  <option value="matched">Matched</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                                {/* Compact tutor pills below status */}
                                {Array.isArray(b.assignedTutors) && b.assignedTutors.length > 0 && (
                                  <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", marginTop: "0.35rem" }}>
                                    {b.assignedTutors.map((t) => (
                                      <span key={t.id} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.66rem", background: "#f0fdf9", color: "#0d9488", border: "1px solid #99f6e4", padding: "0.1rem 0.45rem", borderRadius: "20px", fontWeight: 700, whiteSpace: "nowrap" }}>
                                        <GraduationCap size={10} /> {t.name}{t.subject ? ` · ${t.subject}` : ""}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: "0.85rem 1rem", fontSize: "0.73rem", color: "#94a3b8", whiteSpace: "nowrap" }}>{b.date}</td>
                              <td style={{ padding: "0.85rem 1rem" }} onClick={(e) => e.stopPropagation()}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                  <button
                                    onClick={() => openStudentDetail(b.id, b)}
                                    style={{
                                      background: "#f0fdf9",
                                      border: "1px solid #99f6e4",
                                      color: "#0d9488",
                                      borderRadius: "6px",
                                      padding: "0.3rem 0.65rem",
                                      fontSize: "0.75rem",
                                      fontWeight: 700,
                                      cursor: "pointer",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.3rem",
                                    }}
                                  >
                                    <Eye size={12} /> View Profile
                                  </button>
                                  <button
                                    onClick={() => openTimetableModal(b)}
                                    title="Manage recurring timetable & generated calendar sessions"
                                    style={{
                                      background: "#f0f9ff",
                                      border: "1px solid #bae6fd",
                                      color: "#0284c7",
                                      borderRadius: "6px",
                                      padding: "0.3rem 0.65rem",
                                      fontSize: "0.75rem",
                                      fontWeight: 700,
                                      cursor: "pointer",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.3rem",
                                    }}
                                  >
                                    <Calendar size={12} /> Timetable
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "sessions" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="page-enter">
              {/* Header and Student Selector */}
              <div className="dash-card" style={{ padding: "1.25rem 1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Calendar size={20} color="#0d9488" />
                      Student Timetables &amp; Generated Sessions
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>
                      Manage weekly recurring slots and schedule future lessons.
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Select Student:</span>
                      <select
                        value={selectedStudentForSessionsTab || (bookings.length > 0 ? bookings[0].id : "")}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedStudentForSessionsTab(val);
                          const st = bookings.find((b) => String(b.id) === String(val));
                          if (st) {
                            openTimetableModal(st);
                          }
                        }}
                        style={{
                          padding: "0.45rem 0.85rem",
                          borderRadius: "8px",
                          border: "1.5px solid #cbd5e1",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          color: "#0f172a",
                          background: "#fff",
                          outline: "none",
                          cursor: "pointer",
                        }}
                      >
                        {bookings.map((b) => (
                          <option key={b.id} value={b.id}>
                            #{b.id} - {b.student} ({b.parent})
                          </option>
                        ))}
                      </select>
                    </div>

                    {bookings.length > 0 && (
                      <button
                        onClick={() => {
                          const targetId = selectedStudentForSessionsTab || bookings[0].id;
                          const st = bookings.find((b) => String(b.id) === String(targetId));
                          if (st) openTimetableModal(st);
                        }}
                        style={{
                          padding: "0.45rem 0.95rem",
                          background: "linear-gradient(135deg,#20b2a4,#0d9488)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                        }}
                      >
                        <Calendar size={14} /> Open Timetable Manager
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Students Grid with direct Timetable buttons */}
              {bookings.length === 0 ? (
                <div className="dash-card" style={{ padding: "3rem 2rem", textAlign: "center" }}>
                  <Calendar size={36} color="#94a3b8" style={{ marginBottom: "0.5rem" }} />
                  <p style={{ fontWeight: 700, color: "#0f172a", margin: "0 0 0.25rem" }}>No Students Found</p>
                  <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>Register students to assign lesson timetables and calendar sessions.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="dash-card"
                      style={{
                        padding: "1.1rem 1.25rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "0.85rem",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", fontFamily: "monospace" }}>#{b.id}</span>
                          <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "20px", ...(statusStyle[b.status] || { bg: "#f1f5f9", color: "#475569" }) }}>
                            {b.status}
                          </span>
                        </div>
                        <h4 style={{ margin: "0 0 0.15rem", fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>
                          {b.student}
                        </h4>
                        <div style={{ fontSize: "0.76rem", color: "#64748b" }}>
                          Parent: {b.parent} • {b.phone}
                        </div>
                        <div style={{ marginTop: "0.45rem", fontSize: "0.75rem", color: "#0d9488", fontWeight: 600 }}>
                          🎓 {b.subject} ({b.level})
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid #f1f5f9", paddingTop: "0.75rem" }}>
                        <button
                          onClick={() => openTimetableModal(b)}
                          style={{
                            flex: 1,
                            padding: "0.45rem 0.75rem",
                            background: "linear-gradient(135deg,#0284c7,#0369a1)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.35rem",
                          }}
                        >
                          <Calendar size={13} /> Timetable &amp; Sessions
                        </button>
                        <button
                          onClick={() => openStudentDetail(b.id, b)}
                          style={{
                            padding: "0.45rem 0.75rem",
                            background: "#fff",
                            border: "1px solid #cbd5e1",
                            color: "#475569",
                            borderRadius: "8px",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
            </>
          )}

        </main>
      </div>

      {/* ── Enroll New Tutor Modal (Admin POST /api/admin/tutors) ── */}
      {isAddTutorOpen && (
        <div
          onClick={() => !isEnrollingTutor && setIsAddTutorOpen(false)}
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
              maxHeight: "90vh",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg,#20b2a4,#0d9488)",
                padding: "1.2rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UserPlus size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>Enroll New Tutor</h3>
                  <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.9 }}>
                    Onboard tutor &amp; auto-email temporary login credentials
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isEnrollingTutor && setIsAddTutorOpen(false)}
                disabled={isEnrollingTutor}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  cursor: "pointer",
                  padding: "0.4rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form
              onSubmit={handleEnrollTutorSubmit}
              style={{
                padding: "1.5rem",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "1.15rem",
                boxSizing: "border-box",
              }}
            >
              {/* Error Banner */}
              {enrollTutorError && (
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                    fontSize: "0.82rem",
                    color: "#991b1b",
                  }}
                >
                  <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>{enrollTutorError}</div>
                </div>
              )}

              {/* 2-column: Name & Email */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                    Full Name <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    required
                    placeholder="e.g. John Smith"
                    value={enrollTutorForm.name}
                    onChange={(e) => setEnrollTutorForm({ ...enrollTutorForm, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      border: enrollTutorFieldErrors.name ? "1.5px solid #ef4444" : "1.5px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {enrollTutorFieldErrors.name && (
                    <div style={{ fontSize: "0.73rem", color: "#dc2626", marginTop: "0.2rem" }}>
                      {enrollTutorFieldErrors.name[0]}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                    Email Address <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john.smith@example.com"
                    value={enrollTutorForm.email}
                    onChange={(e) => setEnrollTutorForm({ ...enrollTutorForm, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      border: enrollTutorFieldErrors.email ? "1.5px solid #ef4444" : "1.5px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {enrollTutorFieldErrors.email && (
                    <div style={{ fontSize: "0.73rem", color: "#dc2626", marginTop: "0.2rem" }}>
                      {enrollTutorFieldErrors.email[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* 2-column: Phone & Highest Qualification */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                    Phone / WhatsApp <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +447911123456"
                    value={enrollTutorForm.phone}
                    onChange={(e) => setEnrollTutorForm({ ...enrollTutorForm, phone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      border: "1.5px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                    Highest Qualification <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    required
                    placeholder="e.g. BSc Mathematics, University of Leeds"
                    value={enrollTutorForm.qualification}
                    onChange={(e) => setEnrollTutorForm({ ...enrollTutorForm, qualification: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      border: enrollTutorFieldErrors.qualification ? "1.5px solid #ef4444" : "1.5px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {enrollTutorFieldErrors.qualification && (
                    <div style={{ fontSize: "0.73rem", color: "#dc2626", marginTop: "0.2rem" }}>
                      {enrollTutorFieldErrors.qualification[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* Teaching Subjects */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                  Teaching Subjects <span style={{ color: "#ef4444" }}>*</span>
                  <span style={{ fontSize: "0.73rem", color: "#64748b", fontWeight: 500, marginLeft: "0.4rem" }}>
                    (Select all that apply)
                  </span>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.5rem" }}>
                  {[
                    "Mathematics",
                    "Science",
                    "English",
                    "Physics",
                    "Chemistry",
                    "Biology",
                    "Economic",
                    "Geography",
                    "Computer science",
                    "Further Maths",
                  ].map((sub) => {
                    const isSelected = enrollTutorForm.subjects.includes(sub);
                    return (
                      <button
                        type="button"
                        key={sub}
                        onClick={() => {
                          setEnrollTutorForm((prev) => {
                            const next = isSelected
                              ? prev.subjects.filter((s) => s !== sub)
                              : [...prev.subjects, sub];
                            return { ...prev, subjects: next };
                          });
                        }}
                        style={{
                          padding: "0.3rem 0.65rem",
                          borderRadius: "20px",
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          border: isSelected ? "1.5px solid #0d9488" : "1px solid #d1d5db",
                          background: isSelected ? "#f0fdf9" : "#fff",
                          color: isSelected ? "#0d9488" : "#475569",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {isSelected && <Check size={12} color="#0d9488" />}
                        <span>{sub}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Add custom subject */}
                <div style={{ display: "flex", gap: "0.45rem" }}>
                  <input
                    type="text"
                    placeholder="Add custom subject (e.g. Statistics)"
                    value={enrollCustomSubject}
                    onChange={(e) => setEnrollCustomSubject(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = enrollCustomSubject.trim();
                        if (val && !enrollTutorForm.subjects.includes(val)) {
                          setEnrollTutorForm((prev) => ({ ...prev, subjects: [...prev.subjects, val] }));
                          setEnrollCustomSubject("");
                        }
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: "0.45rem 0.65rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = enrollCustomSubject.trim();
                      if (val && !enrollTutorForm.subjects.includes(val)) {
                        setEnrollTutorForm((prev) => ({ ...prev, subjects: [...prev.subjects, val] }));
                        setEnrollCustomSubject("");
                      }
                    }}
                    style={{
                      background: "#f1f5f9",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      padding: "0.45rem 0.8rem",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "#475569",
                      cursor: "pointer",
                    }}
                  >
                    + Add
                  </button>
                </div>

                {enrollTutorFieldErrors.subjects && (
                  <div style={{ fontSize: "0.73rem", color: "#dc2626", marginTop: "0.3rem" }}>
                    {enrollTutorFieldErrors.subjects[0]}
                  </div>
                )}
              </div>

              {/* Teaching Levels */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                  Teaching Levels <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 400 }}>(Optional)</span>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {[
                    "Year 1-6",
                    "11 Plus preparation",
                    "Sat preparation",
                    "Year 7-11",
                    "GCSE preparation",
                    "A level preparation",
                    "National 5 preparation",
                  ].map((lvl) => {
                    const isSelected = enrollTutorForm.levels.includes(lvl);
                    return (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => {
                          setEnrollTutorForm((prev) => {
                            const next = isSelected
                              ? prev.levels.filter((l) => l !== lvl)
                              : [...prev.levels, lvl];
                            return { ...prev, levels: next };
                          });
                        }}
                        style={{
                          padding: "0.3rem 0.65rem",
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          border: isSelected ? "1.5px solid #0284c7" : "1px solid #d1d5db",
                          background: isSelected ? "#f0f9ff" : "#fff",
                          color: isSelected ? "#0284c7" : "#475569",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        {isSelected && <Check size={12} color="#0284c7" />}
                        <span>{lvl}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Years of Experience */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                  Years of Experience <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 400 }}>(Optional)</span>
                </label>
                <input
                  placeholder="e.g. 3 years private tutoring & secondary school teaching"
                  value={enrollTutorForm.years_of_experience}
                  onChange={(e) => setEnrollTutorForm({ ...enrollTutorForm, years_of_experience: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    border: "1.5px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Bio (max 2000 chars) */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151" }}>
                    Short Bio <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 400 }}>(Optional, max 2000 characters)</span>
                  </label>
                  <span style={{ fontSize: "0.7rem", color: enrollTutorForm.bio.length > 1900 ? "#ef4444" : "#94a3b8" }}>
                    {enrollTutorForm.bio.length}/2000
                  </span>
                </div>
                <textarea
                  maxLength={2000}
                  rows={3}
                  placeholder="Passionate STEM tutor with experience preparing students for GCSE exams."
                  value={enrollTutorForm.bio}
                  onChange={(e) => setEnrollTutorForm({ ...enrollTutorForm, bio: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    border: "1.5px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Informative Security Notice */}
              <div
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "8px",
                  padding: "0.75rem 0.9rem",
                  fontSize: "0.78rem",
                  color: "#1e40af",
                  lineHeight: 1.45,
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                <Mail size={16} color="#3b82f6" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong>Automatic Welcome Email:</strong> When enrolled, the tutor will automatically receive an email with their login credentials and a temporary password. Upon their first login, they will be prompted to set their permanent secure password.
                </div>
              </div>

              {/* Footer Actions */}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", flexShrink: 0 }}>
                <button
                  type="submit"
                  disabled={isEnrollingTutor}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "linear-gradient(135deg,#20b2a4,#0d9488)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    cursor: isEnrollingTutor ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.45rem",
                    boxShadow: "0 4px 12px rgba(32,178,164,0.3)",
                    opacity: isEnrollingTutor ? 0.75 : 1,
                  }}
                >
                  {isEnrollingTutor ? (
                    <>
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid #fff",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                        }}
                      />
                      <span>Enrolling Tutor…</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>Enroll Tutor &amp; Send Credentials</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={isEnrollingTutor}
                  onClick={() => setIsAddTutorOpen(false)}
                  style={{
                    padding: "0.75rem 1.25rem",
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    cursor: isEnrollingTutor ? "not-allowed" : "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Tutor Profile Detail Modal (GET /api/admin/tutors/{id}) ── */}
      {isDetailOpen && selectedTutor && (
        <div
          className="modal-overlay"
          onClick={() => setIsDetailOpen(false)}
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
              width: "100%",
              maxWidth: "600px",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
              overflow: "hidden",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.1rem 1.5rem",
                borderBottom: "1px solid #e2e8f0",
                background: "linear-gradient(135deg, #f0fdf9, #f8fafc)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "rgba(32,178,164,0.15)", color: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <GraduationCap size={16} />
                </div>
                <div>
                  <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Tutor Profile Dossier
                  </h2>
                  <p style={{ fontSize: "0.72rem", color: "#64748b", margin: 0 }}>
                    Full verified records via Admin Management API
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                aria-label="Close"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  padding: "0.3rem",
                  borderRadius: "6px",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div style={{ padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {loadingDetail && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.55rem 0.85rem", background: "#f0fdf9", border: "1px solid #99f6e4", borderRadius: "8px", fontSize: "0.78rem", color: "#0d9488" }}>
                  <span style={{ display: "inline-block", width: "12px", height: "12px", border: "2px solid #0d9488", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  <span>Syncing profile from /api/admin/tutors/{selectedTutor.id}...</span>
                </div>
              )}

              {/* Profile Card Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#f8fafc", padding: "1.2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.6rem", flexShrink: 0, boxShadow: "0 4px 12px rgba(32,178,164,0.3)" }}>
                  {selectedTutor.name?.charAt(0) || "T"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.2rem" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                      {selectedTutor.name}
                    </h3>
                    <span style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "0.15rem 0.55rem",
                      borderRadius: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                      background: selectedTutor.tutor_profile?.approval_status === "approved" ? "#d1fae5" : selectedTutor.tutor_profile?.approval_status === "rejected" ? "#fee2e2" : "#fef3c7",
                      color: selectedTutor.tutor_profile?.approval_status === "approved" ? "#065f46" : selectedTutor.tutor_profile?.approval_status === "rejected" ? "#991b1b" : "#b45309",
                    }}>
                      {selectedTutor.tutor_profile?.approval_status || "Pending"}
                    </span>
                    <span style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "0.15rem 0.6rem",
                      borderRadius: "12px",
                      background: modalAttachedStudents.length > 0 ? "#ecfdf5" : "#f1f5f9",
                      color: modalAttachedStudents.length > 0 ? "#065f46" : "#64748b",
                      border: `1px solid ${modalAttachedStudents.length > 0 ? "#a7f3d0" : "#cbd5e1"}`,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}>
                      <Users size={12} /> Student {modalAttachedStudents.length} active
                    </span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                    ID: #{selectedTutor.id} • Role: {selectedTutor.role || "tutor"}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151", marginBottom: "0.55rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Contact Information
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "0.65rem" }}>
                  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.65rem 0.85rem", display: "flex", alignItems: "center", gap: "0.55rem" }}>
                    <Mail size={15} color="#20b2a4" style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600 }}>Email Address</div>
                      <a href={`mailto:${selectedTutor.email}`} style={{ fontSize: "0.82rem", color: "#0f172a", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                        {selectedTutor.email || "Not specified"}
                      </a>
                    </div>
                  </div>

                  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.65rem 0.85rem", display: "flex", alignItems: "center", gap: "0.55rem" }}>
                    <Phone size={15} color="#20b2a4" style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600 }}>Phone / WhatsApp</div>
                      <a href={selectedTutor.phone ? `tel:${selectedTutor.phone}` : undefined} style={{ fontSize: "0.82rem", color: "#0f172a", fontWeight: 600, textDecoration: "none" }}>
                        {selectedTutor.phone || "Not specified"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic & Experience */}
              <div>
                <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151", marginBottom: "0.55rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Qualifications &amp; Experience
                </h4>
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.85rem 1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 600 }}>Highest Qualification / Alma Mater</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a" }}>
                      {selectedTutor.tutor_profile?.qualification || "Qualified Educator"}
                    </div>
                  </div>
                  {selectedTutor.tutor_profile?.years_of_experience && (
                    <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.5rem" }}>
                      <div style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 600 }}>Years of Teaching Experience</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>
                        {selectedTutor.tutor_profile.years_of_experience}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Attached Student(s) */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.55rem", flexWrap: "wrap", gap: "0.4rem" }}>
                  <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Attached Student(s)
                  </h4>
                  <span style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.55rem",
                    borderRadius: "10px",
                    background: modalAttachedStudents.length > 0 ? "#d1fae5" : "#f1f5f9",
                    color: modalAttachedStudents.length > 0 ? "#065f46" : "#64748b",
                    border: `1px solid ${modalAttachedStudents.length > 0 ? "#99f6e4" : "#e2e8f0"}`,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}>
                    <Users size={12} /> Student {modalAttachedStudents.length} active
                  </span>
                </div>

                {modalAttachedStudents.length === 0 ? (
                  <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "10px", padding: "1.2rem", textAlign: "center" }}>
                    <Users size={22} color="#94a3b8" style={{ marginBottom: "0.35rem" }} />
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>No students attached yet</div>
                    <div style={{ fontSize: "0.74rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                      Assign students to {selectedTutor.name} from the Bookings tab.
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                    {modalAttachedStudents.map((st) => (
                      <div
                        key={st.id}
                        style={{
                          background: "#fff",
                          border: "1.5px solid #ccfbf1",
                          borderRadius: "10px",
                          padding: "0.8rem 1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.75rem",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #20b2a4, #0d9488)",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              fontSize: "0.85rem",
                              flexShrink: 0,
                            }}
                          >
                            {st.name?.charAt(0) || "S"}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a" }}>
                                {st.name}
                              </span>
                              <span
                                style={{
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  padding: "0.1rem 0.45rem",
                                  borderRadius: "10px",
                                  background: st.status === "matched" ? "#d1fae5" : "#fef3c7",
                                  color: st.status === "matched" ? "#065f46" : "#b45309",
                                  textTransform: "capitalize",
                                }}
                              >
                                {st.status?.replace("_", " ") || "Active"}
                              </span>
                            </div>
                            <div style={{ fontSize: "0.74rem", color: "#64748b", marginTop: "0.15rem", display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                              {st.parent && <span>Parent: <strong style={{ color: "#334155" }}>{st.parent}</strong></span>}
                              {st.subject && <span>• Subject: <strong style={{ color: "#0d9488" }}>{st.subject}</strong></span>}
                              {st.level && <span>• {st.level}</span>}
                            </div>
                            {(st.email || st.phone) && (
                              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.15rem" }}>
                                {st.email} {st.phone && st.phone !== "—" ? `• ${st.phone}` : ""}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setIsDetailOpen(false);
                            openStudentDetail(st.id, {
                              id: st.id,
                              student_name: st.name,
                              parent_name: st.parent,
                              subject: st.subject,
                              subjects: st.subject ? [st.subject] : [],
                              level: st.level,
                              status: st.status,
                              phone: st.phone,
                              email: st.email,
                            });
                          }}
                          style={{
                            padding: "0.35rem 0.75rem",
                            background: "#f0fdf9",
                            color: "#0d9488",
                            border: "1px solid #99f6e4",
                            borderRadius: "6px",
                            fontSize: "0.74rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            flexShrink: 0,
                            whiteSpace: "nowrap",
                          }}
                          title="Open student profile dossier"
                        >
                          <Eye size={12} /> View Student
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Subjects & Levels */}
              <div>
                <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151", marginBottom: "0.55rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Subjects &amp; Levels Offered
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div>
                    <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>Subjects:</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                      {selectedTutor.tutor_profile?.subjects && selectedTutor.tutor_profile.subjects.length > 0 ? (
                        selectedTutor.tutor_profile.subjects.map((sub: string) => (
                          <span key={sub} style={{ fontSize: "0.75rem", background: "#f0fdf9", color: "#0d9488", border: "1px solid #99f6e4", padding: "0.2rem 0.6rem", borderRadius: "20px", fontWeight: 600 }}>
                            ✓ {sub}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>No subjects specified</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>Teaching Levels:</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                      {selectedTutor.tutor_profile?.levels && selectedTutor.tutor_profile.levels.length > 0 ? (
                        selectedTutor.tutor_profile.levels.map((lvl: string) => (
                          <span key={lvl} style={{ fontSize: "0.75rem", background: "#f8fafc", color: "#334155", border: "1px solid #cbd5e1", padding: "0.2rem 0.6rem", borderRadius: "20px", fontWeight: 600 }}>
                            🎓 {lvl}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>All standard levels</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio / Teaching Philosophy */}
              <div>
                <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151", marginBottom: "0.55rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Tell Us About Yourself / Bio
                </h4>
                <div style={{ background: "#f8fafc", borderLeft: "3px solid #20b2a4", borderRadius: "8px", padding: "0.85rem 1rem", fontSize: "0.84rem", color: "#334155", lineHeight: 1.65 }}>
                  {selectedTutor.tutor_profile?.bio || "No biography submitted yet."}
                </div>
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {selectedTutor.tutor_profile?.approval_status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        approveApplicant(String(selectedTutor.id));
                        setIsDetailOpen(false);
                      }}
                      style={{ padding: "0.55rem 1rem", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                    >
                      <CheckCircle2 size={14} /> Approve &amp; Onboard
                    </button>
                    <button
                      onClick={() => {
                        declineApplicant(String(selectedTutor.id));
                        setIsDetailOpen(false);
                      }}
                      style={{ padding: "0.55rem 0.9rem", background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5", borderRadius: "8px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                    >
                      <XCircle size={14} /> Decline
                    </button>
                  </>
                )}
                {selectedTutor.tutor_profile?.approval_status === "approved" && (
                  <button
                    onClick={() => {
                      removeTutor(String(selectedTutor.id));
                      setIsDetailOpen(false);
                    }}
                    style={{ padding: "0.55rem 0.9rem", background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5", borderRadius: "8px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                  >
                    <Trash2 size={14} /> Remove from Roster
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsDetailOpen(false)}
                style={{ padding: "0.55rem 1.1rem", background: "#fff", border: "1.5px solid #cbd5e1", borderRadius: "8px", fontWeight: 600, fontSize: "0.82rem", color: "#475569", cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Single Student Profile Dossier Modal (GET /api/admin/students/{id}) ── */}
      {isStudentDetailOpen && selectedStudent && (
        <div
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
          }}
          onClick={() => setIsStudentDetailOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "1px solid #e2e8f0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", color: "#fff", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "linear-gradient(135deg,#20b2a4,#0d9488)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem" }}>
                  {selectedStudent.student_name?.charAt(0) || "S"}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>
                    {selectedStudent.student_name || "Student"}
                  </h3>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "0.45rem", marginTop: "0.15rem" }}>
                    <span>Parent: {selectedStudent.parent_name || "—"}</span>
                    <span>•</span>
                    <span style={{ fontFamily: "monospace", color: "#38bdf8" }}>ID: #{selectedStudent.id}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsStudentDetailOpen(false)}
                style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {/* Status Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div>
                  <div style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>Matching Status</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", textTransform: "capitalize" }}>
                    {selectedStudent.status ? selectedStudent.status.replace("_", " ") : "Pending Match"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  <button
                    onClick={() => updateStudentStatusApi(selectedStudent.id, "matched")}
                    style={{ padding: "0.35rem 0.7rem", borderRadius: "6px", border: "none", background: selectedStudent.status === "matched" ? "#0d9488" : "#f0fdf9", color: selectedStudent.status === "matched" ? "#fff" : "#0d9488", fontWeight: 700, fontSize: "0.72rem", cursor: "pointer" }}
                  >
                    Matched
                  </button>
                  <button
                    onClick={() => updateStudentStatusApi(selectedStudent.id, "pending_match")}
                    style={{ padding: "0.35rem 0.7rem", borderRadius: "6px", border: "none", background: selectedStudent.status === "pending_match" ? "#d97706" : "#fffbeb", color: selectedStudent.status === "pending_match" ? "#fff" : "#d97706", fontWeight: 700, fontSize: "0.72rem", cursor: "pointer" }}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => updateStudentStatusApi(selectedStudent.id, "completed")}
                    style={{ padding: "0.35rem 0.7rem", borderRadius: "6px", border: "none", background: selectedStudent.status === "completed" ? "#0284c7" : "#e0f2fe", color: selectedStudent.status === "completed" ? "#fff" : "#0284c7", fontWeight: 700, fontSize: "0.72rem", cursor: "pointer" }}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Contact Information
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "0.65rem" }}>
                  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.65rem 0.85rem", display: "flex", alignItems: "center", gap: "0.55rem" }}>
                    <Mail size={15} color="#20b2a4" style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600 }}>Parent / Contact Email</div>
                      <a href={`mailto:${selectedStudent.email}`} style={{ fontSize: "0.82rem", color: "#0f172a", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                        {selectedStudent.email || "Not specified"}
                      </a>
                    </div>
                  </div>

                  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.65rem 0.85rem", display: "flex", alignItems: "center", gap: "0.55rem" }}>
                    <Phone size={15} color="#20b2a4" style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600 }}>Phone / WhatsApp</div>
                      <a href={selectedStudent.phone ? `tel:${selectedStudent.phone}` : undefined} style={{ fontSize: "0.82rem", color: "#0f172a", fontWeight: 600, textDecoration: "none" }}>
                        {selectedStudent.phone || "Not specified"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Subjects & Level */}
              <div>
                <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Required Subjects &amp; Level
                </h4>
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.85rem 1rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 600, marginBottom: "0.3rem" }}>Selected Level / Classification:</div>
                    <span style={{ fontSize: "0.78rem", background: "#f8fafc", color: "#1e293b", border: "1px solid #cbd5e1", padding: "0.25rem 0.75rem", borderRadius: "20px", fontWeight: 700 }}>
                      🎓 {selectedStudent.level || "Standard Level"}
                    </span>
                  </div>

                  <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.6rem" }}>
                    <div style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 600, marginBottom: "0.35rem" }}>Subjects:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                      {selectedStudent.subjects && selectedStudent.subjects.length > 0 ? (
                        selectedStudent.subjects.map((sub: string) => (
                          <span key={sub} style={{ fontSize: "0.75rem", background: "#f0fdf9", color: "#0d9488", border: "1px solid #99f6e4", padding: "0.2rem 0.6rem", borderRadius: "20px", fontWeight: 600 }}>
                            ✓ {sub}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>No subjects specified</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Tutors */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>
                    Assigned Tutor(s)
                  </h4>
                  {selectedStudent.assigned_tutors && selectedStudent.assigned_tutors.length > 0 && (
                    <span style={{ fontSize: "0.68rem", background: "#d1fae5", color: "#065f46", padding: "0.15rem 0.55rem", borderRadius: "20px", fontWeight: 700 }}>
                      {selectedStudent.assigned_tutors.length} assigned
                    </span>
                  )}
                </div>

                {!selectedStudent.assigned_tutors || selectedStudent.assigned_tutors.length === 0 ? (
                  <div style={{ background: "#fffbeb", border: "1px dashed #fcd34d", borderRadius: "10px", padding: "1rem", textAlign: "center" }}>
                    <GraduationCap size={24} color="#d97706" style={{ marginBottom: "0.35rem", opacity: 0.6 }} />
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#b45309" }}>No tutor assigned yet</div>
                    <div style={{ fontSize: "0.72rem", color: "#92400e", marginTop: "0.2rem" }}>Use the <strong>Assign Tutor(s)</strong> button below to match this student.</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                    {selectedStudent.assigned_tutors.map((tutor) => (
                      <div key={tutor.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.85rem 1rem", display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
                        {/* Avatar */}
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1rem", flexShrink: 0, boxShadow: "0 2px 8px rgba(13,148,136,0.25)" }}>
                          {tutor.name?.charAt(0) || "T"}
                        </div>
                        {/* Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.2rem" }}>
                            <span style={{ fontWeight: 800, fontSize: "0.88rem", color: "#0f172a" }}>{tutor.name}</span>
                            {tutor.subject && (
                              <span style={{ fontSize: "0.66rem", background: "#f0fdf9", color: "#0d9488", border: "1px solid #99f6e4", padding: "0.1rem 0.45rem", borderRadius: "20px", fontWeight: 700 }}>
                                {tutor.subject}
                              </span>
                            )}
                          </div>
                          {tutor.qualification && (
                            <div style={{ fontSize: "0.74rem", color: "#64748b", marginBottom: "0.2rem" }}>
                              🎓 {tutor.qualification}
                            </div>
                          )}
                          <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
                            {tutor.email && (
                              <a href={`mailto:${tutor.email}`} style={{ fontSize: "0.72rem", color: "#0d9488", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                                <Mail size={11} /> {tutor.email}
                              </a>
                            )}
                            {tutor.phone && (
                              <a href={`tel:${tutor.phone}`} style={{ fontSize: "0.72rem", color: "#475569", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                                <Phone size={11} /> {tutor.phone}
                              </a>
                            )}
                          </div>
                          {tutor.pivot_notes && (
                            <div style={{ marginTop: "0.45rem", fontSize: "0.74rem", color: "#334155", background: "#f8fafc", borderLeft: "2px solid #20b2a4", padding: "0.35rem 0.6rem", borderRadius: "4px", lineHeight: 1.5 }}>
                              📝 {tutor.pivot_notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes / Special Requests */}
              <div>
                <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Notes &amp; Learning Preferences
                </h4>
                <div style={{ background: "#f8fafc", borderLeft: "3px solid #20b2a4", borderRadius: "8px", padding: "0.85rem 1rem", fontSize: "0.84rem", color: "#334155", lineHeight: 1.65 }}>
                  {selectedStudent.notes || "No additional notes submitted with this registration."}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  updateStudentStatusApi(selectedStudent.id, "cancelled");
                  setIsStudentDetailOpen(false);
                }}
                style={{ padding: "0.5rem 0.85rem", background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5", borderRadius: "8px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
              >
                <XCircle size={14} /> Cancel Enrollment
              </button>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  onClick={() => {
                    setIsStudentDetailOpen(false);
                    openTimetableModal(selectedStudent);
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "linear-gradient(135deg,#0284c7,#0369a1)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    boxShadow: "0 2px 8px rgba(2,132,199,0.3)",
                  }}
                >
                  <Calendar size={14} /> Timetable &amp; Sessions
                </button>
                <button
                  onClick={openMatchModal}
                  style={{ padding: "0.5rem 1rem", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem", boxShadow: "0 2px 8px rgba(13,148,136,0.3)" }}
                >
                  <UserPlus size={14} /> Assign Tutor(s)
                </button>
                <button
                  onClick={() => setIsStudentDetailOpen(false)}
                  style={{ padding: "0.5rem 1.1rem", background: "#fff", border: "1.5px solid #cbd5e1", borderRadius: "8px", fontWeight: 600, fontSize: "0.8rem", color: "#475569", cursor: "pointer" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Match Tutors Sub-Modal ── */}
      {isMatchModalOpen && selectedStudent && (
        <div
          onClick={() => setIsMatchModalOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.7)", backdropFilter: "blur(4px)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", animation: "fadeUp 0.2s ease" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "520px", background: "#fff", borderRadius: "16px", boxShadow: "0 30px 80px rgba(0,0,0,0.3)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
          >
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg,#20b2a4,#0d9488)", padding: "1.1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                <UserPlus size={18} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1rem" }}>Assign Tutor(s)</div>
                  <div style={{ fontSize: "0.72rem", opacity: 0.85 }}>to {selectedStudent.student_name}</div>
                </div>
              </div>
              <button onClick={() => setIsMatchModalOpen(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={15} />
              </button>
            </div>

            {/* Tutor List */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                Select one or more <strong>approved tutors</strong> to assign. The student status will automatically be updated to <strong>Matched</strong>.
              </p>

              {approvedTutors.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8", fontSize: "0.85rem" }}>
                  <GraduationCap size={32} style={{ marginBottom: "0.5rem", opacity: 0.4 }} />
                  <div>No approved tutors found.</div>
                  <div style={{ fontSize: "0.72rem", marginTop: "0.25rem" }}>Approve tutors from the Tutors tab first.</div>
                </div>
              ) : (
                approvedTutors.map((tutor) => {
                  const selected = selectedTutorIds.has(tutor.id);
                  return (
                    <div
                      key={tutor.id}
                      onClick={() => toggleTutorSelection(tutor.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.85rem",
                        padding: "0.8rem 1rem",
                        borderRadius: "10px",
                        border: `2px solid ${selected ? "#0d9488" : "#e2e8f0"}`,
                        background: selected ? "#f0fdf9" : "#fff",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {/* Avatar */}
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: selected ? "linear-gradient(135deg,#20b2a4,#0d9488)" : "#f1f5f9", color: selected ? "#fff" : "#64748b", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1rem", flexShrink: 0, transition: "all 0.15s ease" }}>
                        {tutor.name.charAt(0)}
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0f172a" }}>{tutor.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {tutor.qualification || tutor.email}
                        </div>
                        {Array.isArray(tutor.subjects) && tutor.subjects.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginTop: "0.3rem" }}>
                            {tutor.subjects.map((s) => (
                              <span key={s} style={{ fontSize: "0.65rem", background: "#e0f2fe", color: "#0369a1", padding: "0.1rem 0.45rem", borderRadius: "20px", fontWeight: 600 }}>{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Checkbox */}
                      <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${selected ? "#0d9488" : "#cbd5e1"}`, background: selected ? "#0d9488" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s ease" }}>
                        {selected && <CheckCircle2 size={12} color="#fff" />}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Notes */}
              <div style={{ marginTop: "0.5rem" }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>Notes (optional)</label>
                <textarea
                  value={matchNotes}
                  onChange={(e) => setMatchNotes(e.target.value)}
                  placeholder="e.g. Starting lessons next Tuesday. Jane for Maths, David for Physics."
                  rows={3}
                  style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1.5px solid #d1d5db", borderRadius: "8px", fontSize: "0.83rem", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", color: "#1e293b" }}
                />
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
              <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                {selectedTutorIds.size === 0 ? "No tutors selected" : `${selectedTutorIds.size} tutor${selectedTutorIds.size === 1 ? "" : "s"} selected`}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => setIsMatchModalOpen(false)}
                  style={{ padding: "0.5rem 1rem", background: "#f1f5f9", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "0.8rem", color: "#475569", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={submitMatchTutors}
                  disabled={selectedTutorIds.size === 0 || isMatchingLoading}
                  style={{ padding: "0.5rem 1.2rem", background: selectedTutorIds.size === 0 || isMatchingLoading ? "#94a3b8" : "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.8rem", cursor: selectedTutorIds.size === 0 || isMatchingLoading ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: "0.4rem", boxShadow: selectedTutorIds.size > 0 ? "0 2px 8px rgba(13,148,136,0.3)" : "none", transition: "all 0.15s ease" }}
                >
                  {isMatchingLoading ? (
                    <><span style={{ display: "inline-block", width: "12px", height: "12px", border: "2px solid rgba(255,255,255,0.5)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Matching...</>
                  ) : (
                    <><CheckCircle2 size={14} /> Confirm Match</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Student Timetable & Calendar Sessions Modal ── */}
      {isTimetableModalOpen && timetableStudent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            animation: "fadeUp 0.2s ease",
          }}
          onClick={() => setIsTimetableModalOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "840px",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px -15px rgba(0,0,0,0.3)",
              border: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", color: "#fff", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "linear-gradient(135deg,#0284c7,#0369a1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  <Calendar size={22} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>
                      {timetableStudent.student_name || timetableStudent.student || "Student Timetable"}
                    </h3>
                    <span style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "#38bdf8", background: "rgba(56,189,248,0.15)", padding: "0.1rem 0.45rem", borderRadius: "4px" }}>
                      ID: #{timetableStudent.id}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "#94a3b8", marginTop: "0.15rem" }}>
                    Parent: {timetableStudent.parent_name || timetableStudent.parent || "—"} • {timetableStudent.phone || "—"}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "rgba(255,255,255,0.1)", padding: "0.25rem 0.6rem", borderRadius: "8px" }}>
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600 }}>Extend:</span>
                  {[4, 8, 12].map((w) => (
                    <button
                      key={w}
                      onClick={() => generateFutureSessions(w)}
                      disabled={generatingSessions}
                      style={{
                        padding: "0.2rem 0.45rem",
                        background: "rgba(255,255,255,0.15)",
                        border: "none",
                        borderRadius: "4px",
                        color: "#fff",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        cursor: generatingSessions ? "not-allowed" : "pointer",
                      }}
                      title={`Generate sessions for next ${w} weeks`}
                    >
                      +{w}w
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsTimetableModalOpen(false)}
                  style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Sub-Header Navigation Tabs */}
            <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "0.5rem 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              {[
                { id: "recurring", label: `Weekly Timetable (${timetableSlots.length})`, icon: <Clock size={14} /> },
                { id: "sessions", label: `Calendar Sessions (${calendarSessions.length})`, icon: <CalendarDays size={14} /> },
                { id: "add_slot", label: "+ Assign / Add Slot", icon: <Plus size={14} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTimetableTab(tab.id as any)}
                  style={{
                    padding: "0.45rem 0.95rem",
                    borderRadius: "8px",
                    border: "none",
                    background: timetableTab === tab.id ? "#0284c7" : "transparent",
                    color: timetableTab === tab.id ? "#fff" : "#475569",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div style={{ padding: "1.5rem", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* ── TAB 1: Recurring Weekly Slots ── */}
              {timetableTab === "recurring" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 800, color: "#0f172a" }}>
                        Recurring Weekly Lesson Slots
                      </h4>
                      <p style={{ margin: "0.15rem 0 0", fontSize: "0.74rem", color: "#64748b" }}>
                        Active weekly time slots assigned to this student ({timetableSlots.length} slot{timetableSlots.length === 1 ? "" : "s"}).
                      </p>
                    </div>

                    <button
                      onClick={() => setTimetableTab("add_slot")}
                      style={{
                        padding: "0.4rem 0.85rem",
                        background: "linear-gradient(135deg,#0284c7,#0369a1)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <Plus size={13} /> Add New Slot
                    </button>
                  </div>

                  {loadingTimetable ? (
                    <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                      <div style={{ width: "28px", height: "28px", border: "3px solid #0284c7", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 0.6rem" }} />
                      <span style={{ fontSize: "0.82rem" }}>Loading student timetable...</span>
                    </div>
                  ) : timetableSlots.length === 0 ? (
                    <div style={{ background: "#f8fafc", border: "2px dashed #cbd5e1", borderRadius: "12px", padding: "2.5rem 1.5rem", textAlign: "center" }}>
                      <Clock size={36} color="#94a3b8" style={{ marginBottom: "0.6rem" }} />
                      <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" }}>No Weekly Recurring Slots Assigned</div>
                      <p style={{ fontSize: "0.8rem", color: "#64748b", maxWidth: "420px", margin: "0.35rem auto 1rem" }}>
                        Assign weekly recurring timetable slots (e.g. Mondays 17:00 - 18:00) to automatically generate upcoming calendar sessions.
                      </p>
                      <button
                        onClick={() => setTimetableTab("add_slot")}
                        style={{
                          padding: "0.5rem 1.1rem",
                          background: "linear-gradient(135deg,#20b2a4,#0d9488)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                        }}
                      >
                        <Plus size={14} /> Assign Lesson Timetable
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.85rem" }}>
                      {timetableSlots.map((slot) => (
                        <div
                          key={slot.id}
                          style={{
                            background: "#fff",
                            border: "1.5px solid #e2e8f0",
                            borderRadius: "12px",
                            padding: "1rem",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: "0.75rem",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                          }}
                        >
                          <div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.45rem" }}>
                              <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#0284c7", background: "#f0f9ff", border: "1px solid #bae6fd", padding: "0.15rem 0.55rem", borderRadius: "20px" }}>
                                {slot.day_of_week}
                              </span>
                              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#0f172a", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                                <Clock size={12} color="#64748b" /> {slot.start_time?.slice(0, 5)} - {slot.end_time?.slice(0, 5)}
                              </span>
                            </div>

                            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" }}>
                              {slot.subject}
                            </div>

                            <div style={{ fontSize: "0.78rem", color: "#475569", marginTop: "0.35rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <GraduationCap size={13} color="#0d9488" />
                              <span>Tutor: <strong>{slot.tutor?.name || `ID #${slot.tutor_id}`}</strong></span>
                            </div>

                            {slot.notes && (
                              <div style={{ fontSize: "0.72rem", color: "#64748b", background: "#f8fafc", padding: "0.35rem 0.55rem", borderRadius: "6px", marginTop: "0.45rem", fontStyle: "italic" }}>
                                {slot.notes}
                              </div>
                            )}

                            {slot.meeting_link ? (
                              <div style={{ marginTop: "0.6rem" }}>
                                <a
                                  href={slot.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.35rem",
                                    fontSize: "0.72rem",
                                    color: "#0369a1",
                                    background: "#e0f2fe",
                                    padding: "0.25rem 0.55rem",
                                    borderRadius: "6px",
                                    textDecoration: "none",
                                    fontWeight: 700,
                                  }}
                                >
                                  <Video size={12} /> Join Lesson Room <ExternalLink size={11} />
                                </a>
                              </div>
                            ) : (
                              <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.5rem" }}>No meeting link attached</div>
                            )}
                          </div>

                          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.6rem", display: "flex", justifyContent: "flex-end" }}>
                            <button
                              onClick={() => deleteTimetableSlot(slot.id)}
                              style={{
                                padding: "0.3rem 0.65rem",
                                background: "#fee2e2",
                                color: "#991b1b",
                                border: "1px solid #fca5a5",
                                borderRadius: "6px",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                              }}
                            >
                              <Trash2 size={12} /> Remove Slot
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 2: Calendar Sessions (Filtered & Editable) ── */}
              {timetableTab === "sessions" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* Sessions Filter Bar */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.85rem 1rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.65rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#475569" }}>Status:</span>
                        <select
                          value={sessionFilterStatus}
                          onChange={(e) => {
                            setSessionFilterStatus(e.target.value);
                            fetchStudentSessions(timetableStudent.id, { status: e.target.value });
                          }}
                          style={{ padding: "0.35rem 0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.75rem", fontWeight: 600, background: "#fff", outline: "none" }}
                        >
                          <option value="all">All Statuses</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="rescheduled">Rescheduled</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#475569" }}>From:</span>
                        <input
                          type="date"
                          value={sessionFromDate}
                          onChange={(e) => {
                            setSessionFromDate(e.target.value);
                            fetchStudentSessions(timetableStudent.id, { from_date: e.target.value });
                          }}
                          style={{ padding: "0.3rem 0.55rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.75rem", background: "#fff" }}
                        />
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#475569" }}>To:</span>
                        <input
                          type="date"
                          value={sessionToDate}
                          onChange={(e) => {
                            setSessionToDate(e.target.value);
                            fetchStudentSessions(timetableStudent.id, { to_date: e.target.value });
                          }}
                          style={{ padding: "0.3rem 0.55rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.75rem", background: "#fff" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <button
                        onClick={() => {
                          setSessionFilterStatus("all");
                          setSessionFromDate("");
                          setSessionToDate("");
                          setSessionTutorFilter("all");
                          fetchStudentSessions(timetableStudent.id, { status: "all", from_date: "", to_date: "", tutor_id: "all" });
                        }}
                        style={{ padding: "0.35rem 0.65rem", background: "#fff", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.72rem", color: "#64748b", fontWeight: 600, cursor: "pointer" }}
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>

                  {/* Sessions List */}
                  {calendarSessions.length === 0 ? (
                    <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "12px", padding: "3rem 1.5rem", textAlign: "center" }}>
                      <CalendarDays size={36} color="#94a3b8" style={{ marginBottom: "0.5rem" }} />
                      <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#0f172a" }}>No Calendar Sessions Found</div>
                      <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.3rem auto 1rem", maxWidth: "380px" }}>
                        Generate future calendar sessions from the student's recurring slots, or adjust your filter.
                      </p>
                      <button
                        onClick={() => generateFutureSessions(4)}
                        disabled={generatingSessions}
                        style={{ padding: "0.5rem 1rem", background: "linear-gradient(135deg,#0284c7,#0369a1)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                      >
                        {generatingSessions ? "Generating..." : "Generate Next 4 Weeks"}
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                      {calendarSessions.map((session) => {
                        const isScheduled = session.status === "scheduled";
                        const isCompleted = session.status === "completed";
                        const isCancelled = session.status === "cancelled";
                        const isRescheduled = session.status === "rescheduled";

                        const pillColor = isCompleted
                          ? { bg: "#d1fae5", text: "#065f46" }
                          : isCancelled
                          ? { bg: "#fee2e2", text: "#991b1b" }
                          : isRescheduled
                          ? { bg: "#fef3c7", text: "#b45309" }
                          : { bg: "#e0f2fe", text: "#0369a1" };

                        return (
                          <div
                            key={session.id}
                            style={{
                              background: "#fff",
                              border: "1px solid #e2e8f0",
                              borderRadius: "10px",
                              padding: "0.85rem 1rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              gap: "0.75rem",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                              <div style={{ textAlign: "center", padding: "0.4rem 0.65rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", minWidth: "75px" }}>
                                <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                                  {session.date ? new Date(session.date).toLocaleDateString("en-GB", { weekday: "short" }) : "Session"}
                                </div>
                                <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0f172a" }}>
                                  {session.date ? new Date(session.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : `ID #${session.id}`}
                                </div>
                              </div>

                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                  <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0f172a" }}>
                                    {session.subject}
                                  </span>
                                  <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "20px", background: pillColor.bg, color: pillColor.text, textTransform: "capitalize" }}>
                                    {session.status}
                                  </span>
                                </div>

                                <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.2rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                  <span><Clock size={11} style={{ display: "inline", verticalAlign: "middle" }} /> {session.start_time?.slice(0, 5)} - {session.end_time?.slice(0, 5)}</span>
                                  <span>•</span>
                                  <span>Tutor: <strong>{session.tutor?.name || `Tutor #${session.tutor_id}`}</strong></span>
                                </div>

                                {session.notes && (
                                  <div style={{ fontSize: "0.72rem", color: "#475569", marginTop: "0.3rem", fontStyle: "italic" }}>
                                    📝 {session.notes}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
                              {session.meeting_link && (
                                <a
                                  href={session.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    padding: "0.35rem 0.65rem",
                                    background: "#f0f9ff",
                                    border: "1px solid #bae6fd",
                                    color: "#0284c7",
                                    borderRadius: "6px",
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.3rem",
                                  }}
                                >
                                  <Video size={12} /> Meeting Link
                                </a>
                              )}

                              {isScheduled && (
                                <button
                                  onClick={() => quickUpdateSessionStatus(session.id, "completed")}
                                  title="Mark session completed"
                                  style={{
                                    padding: "0.35rem 0.65rem",
                                    background: "#f0fdf4",
                                    border: "1px solid #bbf7d0",
                                    color: "#16a34a",
                                    borderRadius: "6px",
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                  }}
                                >
                                  <Check size={12} /> Completed
                                </button>
                              )}

                              {isScheduled && (
                                <button
                                  onClick={() => quickUpdateSessionStatus(session.id, "cancelled")}
                                  title="Cancel lesson"
                                  style={{
                                    padding: "0.35rem 0.65rem",
                                    background: "#fef2f2",
                                    border: "1px solid #fecaca",
                                    color: "#dc2626",
                                    borderRadius: "6px",
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                  }}
                                >
                                  <XCircle size={12} /> Cancel
                                </button>
                              )}

                              <button
                                onClick={() => openEditSessionModal(session)}
                                title="Reschedule or update notes/link"
                                style={{
                                  padding: "0.35rem 0.75rem",
                                  background: "#fff",
                                  border: "1.5px solid #cbd5e1",
                                  color: "#334155",
                                  borderRadius: "6px",
                                  fontSize: "0.72rem",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.25rem",
                                }}
                              >
                                <Edit3 size={12} /> Reschedule / Edit
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 3: Assign / Add Timetable Slot Form ── */}
              {timetableTab === "add_slot" && (
                <form onSubmit={assignTimetableSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem" }}>
                    <h4 style={{ margin: "0 0 0.35rem", fontSize: "0.92rem", fontWeight: 800, color: "#0f172a" }}>
                      Assign Weekly Timetable Slot
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>
                      This will assign a recurring weekly slot to {timetableStudent.student_name || timetableStudent.student} and generate calendar dates automatically.
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                    {/* Tutor Picker */}
                    <div>
                      <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                        Assigned Tutor *
                      </label>
                      <select
                        required
                        value={slotTutorId}
                        onChange={(e) => setSlotTutorId(e.target.value)}
                        style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.85rem", background: "#fff", outline: "none" }}
                      >
                        <option value="">-- Select Tutor --</option>
                        {approvedTutors.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.qualification || t.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subject */}
                    <div>
                      <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                        Subject *
                      </label>
                      <input
                        required
                        value={slotSubject}
                        onChange={(e) => setSlotSubject(e.target.value)}
                        placeholder="e.g. Mathematics / Physics"
                        style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>

                    {/* Day of week */}
                    <div>
                      <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                        Day of Week *
                      </label>
                      <select
                        value={slotDayOfWeek}
                        onChange={(e) => setSlotDayOfWeek(e.target.value)}
                        style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.85rem", background: "#fff", outline: "none" }}
                      >
                        <option value="monday">Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thursday">Thursday</option>
                        <option value="friday">Friday</option>
                        <option value="saturday">Saturday</option>
                        <option value="sunday">Sunday</option>
                      </select>
                    </div>

                    {/* Start Time & End Time */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                          Start Time *
                        </label>
                        <input
                          type="time"
                          required
                          value={slotStartTime}
                          onChange={(e) => setSlotStartTime(e.target.value)}
                          style={{ width: "100%", padding: "0.55rem 0.65rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                          End Time *
                        </label>
                        <input
                          type="time"
                          required
                          value={slotEndTime}
                          onChange={(e) => setSlotEndTime(e.target.value)}
                          style={{ width: "100%", padding: "0.55rem 0.65rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Meeting link */}
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                      Video Meeting Link (Google Meet / Zoom URL)
                    </label>
                    <input
                      type="url"
                      value={slotMeetingLink}
                      onChange={(e) => setSlotMeetingLink(e.target.value)}
                      placeholder="https://meet.google.com/abc-defg-hij"
                      style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                      Lesson Schedule Notes
                    </label>
                    <textarea
                      value={slotNotes}
                      onChange={(e) => setSlotNotes(e.target.value)}
                      placeholder="e.g. Weekly GCSE Maths focus. Target algebra and exam papers."
                      rows={2}
                      style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                    />
                  </div>

                  {/* Schedule Options */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.85rem 1rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, color: "#334155" }}>
                      <input
                        type="checkbox"
                        checked={slotReplaceExisting}
                        onChange={(e) => setSlotReplaceExisting(e.target.checked)}
                      />
                      <span>Replace existing weekly recurring slots</span>
                    </label>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>Generate Calendar Sessions:</span>
                      <select
                        value={slotGenerateWeeks}
                        onChange={(e) => setSlotGenerateWeeks(Number(e.target.value))}
                        style={{ padding: "0.35rem 0.65rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.78rem", fontWeight: 700, background: "#fff" }}
                      >
                        <option value={2}>Next 2 Weeks</option>
                        <option value={4}>Next 4 Weeks (Standard)</option>
                        <option value={8}>Next 8 Weeks</option>
                        <option value={12}>Next 12 Weeks (Full Term)</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => setTimetableTab("recurring")}
                      style={{ padding: "0.55rem 1rem", background: "#f1f5f9", border: "none", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 600, color: "#475569", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingSlot}
                      style={{
                        padding: "0.55rem 1.35rem",
                        background: isSubmittingSlot ? "#94a3b8" : "linear-gradient(135deg,#0284c7,#0369a1)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        cursor: isSubmittingSlot ? "not-allowed" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        boxShadow: "0 2px 8px rgba(2,132,199,0.3)",
                      }}
                    >
                      {isSubmittingSlot ? "Assigning Timetable..." : "Save Timetable & Generate Sessions"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "0.85rem 1.5rem", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                Recurring Slots: <strong>{timetableSlots.length}</strong> • Generated Sessions: <strong>{calendarSessions.length}</strong>
              </div>
              <button
                onClick={() => setIsTimetableModalOpen(false)}
                style={{ padding: "0.45rem 1.1rem", background: "#fff", border: "1.5px solid #cbd5e1", borderRadius: "8px", fontWeight: 600, fontSize: "0.8rem", color: "#475569", cursor: "pointer" }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit / Reschedule Single Session Sub-Modal (PATCH /api/admin/sessions/{id}) ── */}
      {editingSession && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 1150,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            animation: "fadeUp 0.2s ease",
          }}
          onClick={() => setEditingSession(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "520px",
              boxShadow: "0 25px 60px -15px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)", color: "#fff", padding: "1.1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                <Edit3 size={18} />
                <div>
                  <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>Reschedule / Edit Session #{editingSession.id}</h3>
                  <div style={{ fontSize: "0.72rem", opacity: 0.85 }}>{editingSession.subject} • Tutor: {editingSession.tutor?.name || `#${editingSession.tutor_id}`}</div>
                </div>
              </div>
              <button onClick={() => setEditingSession(null)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={15} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submitUpdateSession} style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {/* Status */}
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                    Session Status *
                  </label>
                  <select
                    value={editSessionStatus}
                    onChange={(e) => setEditSessionStatus(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem 0.65rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.82rem", background: "#fff", outline: "none" }}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="rescheduled">Rescheduled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                    Lesson Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editSessionDate}
                    onChange={(e) => setEditSessionDate(e.target.value)}
                    style={{ width: "100%", padding: "0.45rem 0.65rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.82rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Start & End Time */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={editSessionStartTime}
                    onChange={(e) => setEditSessionStartTime(e.target.value)}
                    style={{ width: "100%", padding: "0.45rem 0.65rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.82rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                    End Time
                  </label>
                  <input
                    type="time"
                    value={editSessionEndTime}
                    onChange={(e) => setEditSessionEndTime(e.target.value)}
                    style={{ width: "100%", padding: "0.45rem 0.65rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.82rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Meeting link */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                  Meeting Link (Google Meet / Zoom)
                </label>
                <input
                  type="url"
                  value={editSessionMeetingLink}
                  onChange={(e) => setEditSessionMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.82rem", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Notes */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>
                  Session Feedback / Reschedule Notes
                </label>
                <textarea
                  value={editSessionNotes}
                  onChange={(e) => setEditSessionNotes(e.target.value)}
                  placeholder="e.g. Lesson conducted successfully. Covered quadratic equations."
                  rows={3}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.82rem", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
                />
              </div>

              {/* Footer */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", borderTop: "1px solid #f1f5f9", paddingTop: "0.85rem" }}>
                <button
                  type="button"
                  onClick={() => setEditingSession(null)}
                  style={{ padding: "0.5rem 1rem", background: "#f1f5f9", border: "none", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, color: "#475569", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingSession}
                  style={{
                    padding: "0.5rem 1.25rem",
                    background: isSavingSession ? "#94a3b8" : "linear-gradient(135deg,#0284c7,#0369a1)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: isSavingSession ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  {isSavingSession ? "Saving..." : "Save Session Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
