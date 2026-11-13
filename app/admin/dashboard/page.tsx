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
  FileText,
  Key,
  Copy,
  Award,
  BookOpen,
  RotateCcw,
  DollarSign,
  CreditCard,
  Activity,
  Paperclip,
  ChevronDown,
  MessageSquare,
  Send,
  Radio,
  UserCheck,
} from "lucide-react";
import { QUALIFICATIONS_LIST } from "../../constants/qualifications";
import NotificationEnvelope from "@/components/NotificationEnvelope";

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
  profile_photo_url?: string | null;
  photo?: string | null;
};

type TutorStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  public_verified?: number;
  pending_photo_verification?: number;
};

type AttachedStudent = {
  id: string | number;
  student_id?: string | number;
  user_id?: number;
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
  profile_photo_url?: string | null;
  photo?: string | null;
  hourly_rate?: number;
  is_public?: boolean;
  is_photo_verified?: boolean;
  public_headline?: string;
  tutor_profile?: {
    id?: number;
    user_id?: number;
    qualification?: string;
    subjects?: string[];
    levels?: string[];
    years_of_experience?: string;
    bio?: string;
    hourly_rate?: number;
    approval_status?: "pending" | "approved" | "rejected" | string;
    created_at?: string;
    students?: any[];
    profile_photo_url?: string | null;
    photo?: string | null;
    is_public?: boolean;
    is_photo_verified?: boolean;
    public_headline?: string;
  };
};

type Tutor = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  school: string;
  subject: string;
  students: number;
  region?: string;
  img?: string | null;
  profile_photo_url?: string | null;
  photo?: string | null;
  rate?: string;
  hourly_rate?: number;
  is_public?: boolean;
  is_photo_verified?: boolean;
  public_headline?: string | null;
  tutor_profile?: any;
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
  student_id?: number | string;
  user_id?: number;
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
  student_id?: string | number;
  user_id?: number;
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
  student?: {
    id: number;
    student_name: string;
    parent_name?: string;
    email?: string;
    level?: string;
  };
  tutor?: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
  };
  session?: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    subject?: string;
    status: string;
  };
};

type AdminChangeRequest = {
  id: number;
  lesson_session_id: number;
  requested_by: number;
  request_type: "reschedule" | "cancel" | string;
  proposed_date?: string | null;
  proposed_start_time?: string | null;
  proposed_end_time?: string | null;
  reason: string;
  status: "pending" | "approved" | "rejected" | string;
  admin_notes?: string | null;
  responded_by?: number | null;
  responded_at?: string | null;
  created_at: string;
  updated_at: string;
  session?: {
    id: number;
    student_id: number;
    tutor_id: number;
    lesson_schedule_id?: number;
    subject: string;
    date: string;
    start_time: string;
    end_time: string;
    meeting_link?: string | null;
    status: string;
    notes?: string | null;
    student?: {
      id: number;
      student_name: string;
      parent_name?: string;
      email?: string;
      phone?: string;
    };
    tutor?: {
      id: number;
      name: string;
      email?: string;
      phone?: string;
    };
  };
  requester?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  responder?: {
    id: number;
    name: string;
    email: string;
  } | null;
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

type TutorPayoutData = {
  tutor?: {
    id: number;
    name: string;
    email: string;
    hourly_rate?: number;
  };
  month: string;
  hourly_rate?: number;
  summary: {
    total_sessions?: number;
    total_scheduled?: number;
    completed_sessions: number;
    total_hours: number;
    total_earnings: number;
  };
  sessions: TutorPayoutSession[];
};

export type AdminStudentAssignment = {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  due_date_formatted?: string;
  is_overdue?: boolean;
  status: "assigned" | "submitted" | "graded" | "overdue" | string;
  max_points?: number;
  grade?: number | null;
  feedback?: string | null;
  graded_at?: string | null;
  file_name?: string | null;
  file_url?: string | null;
  tutor?: {
    id: number;
    name: string;
    email?: string;
  } | null;
  session?: any | null;
  latest_submission?: {
    id: number;
    submitted_at: string;
    file_name?: string | null;
    file_url?: string | null;
    notes?: string | null;
  } | null;
  submissions?: any[];
};

export type AdminStudentActivityItem = {
  id: string | number;
  type: "session" | "assignment" | "report" | "attendance" | "account" | string;
  action: string;
  title: string;
  description: string;
  timestamp: string;
  date_formatted?: string;
  meta?: Record<string, any>;
};

export type AdminStudentActivitySummary = {
  total_activities?: number;
  total_sessions?: number;
  completed_sessions?: number;
  total_assignments?: number;
  completed_assignments?: number;
  average_assignment_grade?: number | null;
  total_reports?: number;
  attendance_rate_percentage?: number | null;
};

type NavTab = "overview" | "applicants" | "tutors" | "bookings" | "sessions" | "reports" | "changes" | "chat_oversight";

type AdminChatConversation = {
  id: number;
  type: string;
  subject?: string;
  lesson_session_id?: number | null;
  last_message_at?: string;
  messages_count?: number;
  participants: { id: number; name: string; email: string; role: string }[];
  latest_message?: { id: number; sender_name: string; body?: string; has_attachment: boolean; created_at: string } | null;
};

type AdminChatMessage = {
  id: number;
  conversation_id: number;
  body?: string;
  attachment_name?: string;
  attachment_url?: string;
  created_at: string;
  created_at_human?: string;
  sender: { id: number; name: string; role: string };
  is_deleted?: boolean;
  deleted_at?: string;
  reactions?: any[];
  edited_at?: string;
};

type AdminChatContact = {
  user_id: number;
  name: string;
  email: string;
  role: "tutor" | "parent" | "student" | string;
  has_existing_conversation: boolean;
  conversation_id?: number | null;
  last_message_at?: string | null;
  profile_photo_url?: string | null;
  photo?: string | null;
};

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
  const [processingApplicantIds, setProcessingApplicantIds] = useState<Set<string>>(new Set());

  // Single tutor detail modal state (GET /api/admin/tutors/{id})
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<TutorDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Edit tutor modal state (PUT/PATCH /api/admin/tutors/{id})
  const [isEditTutorOpen, setIsEditTutorOpen] = useState(false);
  const [editTutorForm, setEditTutorForm] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    subjects: "",
    levels: "",
    years_of_experience: "",
    bio: "",
    hourly_rate: "",
    approval_status: "approved",
  });
  const [isUpdatingTutor, setIsUpdatingTutor] = useState(false);
  const [editTutorError, setEditTutorError] = useState<string | null>(null);

  // Verify tutor for public website (PATCH /api/admin/tutors/{id}/verify-public)
  const [isVerifyPublicModalOpen, setIsVerifyPublicModalOpen] = useState(false);
  const [verifyPublicForm, setVerifyPublicForm] = useState({
    is_public: false,
    is_photo_verified: false,
    public_headline: "",
  });
  const [isUpdatingPublic, setIsUpdatingPublic] = useState(false);

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

  // Lesson Reports State
  const [reports, setReports] = useState<LessonReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsPage, setReportsPage] = useState(1);
  const [reportsTotal, setReportsTotal] = useState(0);
  const [reportsPerPage, setReportsPerPage] = useState(20);
  const [searchReports, setSearchReports] = useState("");
  const [reportAttendanceFilter, setReportAttendanceFilter] = useState("all");
  const [selectedReportDetail, setSelectedReportDetail] = useState<LessonReport | null>(null);
  const [studentReports, setStudentReports] = useState<LessonReport[]>([]);
  const [studentReportsLoading, setStudentReportsLoading] = useState(false);

  // Student Dossier Sub-tabs: "overview" | "assignments" | "activity"
  const [studentModalTab, setStudentModalTab] = useState<"overview" | "assignments" | "activity">("overview");
  
  // Student Assignments state (GET /api/admin/students/{id}/assignments)
  const [studentAssignments, setStudentAssignments] = useState<AdminStudentAssignment[]>([]);
  const [studentAssignmentsSummary, setStudentAssignmentsSummary] = useState<any>(null);
  const [studentAssignmentsLoading, setStudentAssignmentsLoading] = useState(false);
  const [studentAssignmentStatusFilter, setStudentAssignmentStatusFilter] = useState<string>("all");

  // Student Activity Timeline state (GET /api/admin/students/{id}/activity)
  const [studentActivities, setStudentActivities] = useState<AdminStudentActivityItem[]>([]);
  const [studentActivitySummary, setStudentActivitySummary] = useState<AdminStudentActivitySummary | null>(null);
  const [studentActivitiesLoading, setStudentActivitiesLoading] = useState(false);
  const [studentActivityTypeFilter, setStudentActivityTypeFilter] = useState<string>("all");

  // Temporary credentials modal from enroll response
  const [temporaryCredentialsModal, setTemporaryCredentialsModal] = useState<{
    name: string;
    email: string;
    temporary_password?: string;
  } | null>(null);

  // Guardian Onboarding state (POST /api/admin/students/{id}/onboard-guardian)
  const [isOnboardGuardianOpen, setIsOnboardGuardianOpen] = useState(false);
  const [onboardGuardianStudent, setOnboardGuardianStudent] = useState<any | null>(null);
  const [guardianForm, setGuardianForm] = useState({
    guardian_name: "",
    guardian_email: "",
    guardian_phone: "",
    relationship: "Mother",
    ward_username: "",
    reset_ward_password: true,
    send_email: true,
  });
  const [isOnboardingGuardianLoading, setIsOnboardingGuardianLoading] = useState(false);
  const [onboardGuardianError, setOnboardGuardianError] = useState<string | null>(null);
  const [onboardGuardianFieldErrors, setOnboardGuardianFieldErrors] = useState<Record<string, string[]>>({});
  const [onboardGuardianResult, setOnboardGuardianResult] = useState<{
    parent?: { name: string; email: string; temporary_password?: string; must_change_password?: boolean };
    ward?: { name: string; username: string; temporary_password?: string; must_change_password?: boolean };
  } | null>(null);
  const [guardianCopiedKey, setGuardianCopiedKey] = useState<string | null>(null);

  // Change Requests State (GET /api/admin/change-requests, PATCH /api/admin/change-requests/{id})
  const [adminChangeRequests, setAdminChangeRequests] = useState<AdminChangeRequest[]>([]);
  const [changeRequestsLoading, setChangeRequestsLoading] = useState(false);
  const [changeRequestsPage, setChangeRequestsPage] = useState(1);
  const [changeRequestsLastPage, setChangeRequestsLastPage] = useState(1);
  const [changeRequestsTotal, setChangeRequestsTotal] = useState(0);
  const [changeRequestsStatusFilter, setChangeRequestsStatusFilter] = useState<string>("all");
  const [changeRequestsCounts, setChangeRequestsCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [reviewingRequest, setReviewingRequest] = useState<AdminChangeRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve");
  const [reviewNotes, setReviewNotes] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Chat Oversight State
  const [adminChats, setAdminChats] = useState<AdminChatConversation[]>([]);
  const [adminChatsLoading, setAdminChatsLoading] = useState(false);
  const [adminChatsPage, setAdminChatsPage] = useState(1);
  const [adminChatsTotal, setAdminChatsTotal] = useState(0);
  const [adminChatsLastPage, setAdminChatsLastPage] = useState(1);
  const [adminChatTypeFilter, setAdminChatTypeFilter] = useState<string>("all");
  const [adminChatSearch, setAdminChatSearch] = useState("");
  const [adminChatStudentFilter, setAdminChatStudentFilter] = useState<string>("");
  const [adminChatTutorFilter, setAdminChatTutorFilter] = useState<string>("");
  const [selectedAdminConv, setSelectedAdminConv] = useState<AdminChatConversation | null>(null);
  const [adminConvMessages, setAdminConvMessages] = useState<AdminChatMessage[]>([]);
  const [adminConvLoading, setAdminConvLoading] = useState(false);

  // Admin Chat Contacts & Messaging State (GET /api/admin/chat/contacts & POST /api/admin/chat/broadcast)
  const [showAdminContactsModal, setShowAdminContactsModal] = useState(false);
  const [adminContacts, setAdminContacts] = useState<AdminChatContact[]>([]);
  const [adminContactsLoading, setAdminContactsLoading] = useState(false);
  const [adminContactsRoleFilter, setAdminContactsRoleFilter] = useState<string>("all");
  const [adminContactsSearch, setAdminContactsSearch] = useState("");
  const [adminContactsPage, setAdminContactsPage] = useState(1);
  const [adminContactsTotal, setAdminContactsTotal] = useState(0);
  const [adminContactsLastPage, setAdminContactsLastPage] = useState(1);
  const [startingChatWithUserId, setStartingChatWithUserId] = useState<number | null>(null);

  // Admin Broadcast State (POST /api/admin/chat/broadcast)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTarget, setBroadcastTarget] = useState<string>("all_tutors");
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastAttachment, setBroadcastAttachment] = useState<File | null>(null);
  const [broadcastRecipientIds, setBroadcastRecipientIds] = useState<number[]>([]);
  const [isSubmittingBroadcast, setIsSubmittingBroadcast] = useState(false);
  const [broadcastCustomSearch, setBroadcastCustomSearch] = useState("");

  // Admin Direct Reply in active conversation (POST /api/chat/conversations/{id}/messages)
  const [adminReplyText, setAdminReplyText] = useState("");
  const [adminReplyAttachment, setAdminReplyAttachment] = useState<File | null>(null);
  const [isSendingAdminReply, setIsSendingAdminReply] = useState(false);

  // Tutor Rate & Payouts Modal State (PATCH /api/admin/tutors/{tutorId}/rate & GET /api/admin/tutors/{tutorId}/payouts)
  const [payoutTutor, setPayoutTutor] = useState<any | null>(null);
  const [payoutMonth, setPayoutMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [payoutData, setPayoutData] = useState<TutorPayoutData | null>(null);
  const [loadingPayoutData, setLoadingPayoutData] = useState(false);
  const [editingHourlyRate, setEditingHourlyRate] = useState<string>("");
  const [isSavingHourlyRate, setIsSavingHourlyRate] = useState(false);

  // Logout confirmation modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
          if (user.role === "tutor") {
            window.location.href = "/tutor/dashboard";
            return;
          }
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

  const resolveStudentId = (id: string | number | undefined | null): string | number => {
    if (id === undefined || id === null || id === "") return "";
    const cleanId = String(id).replace(/^(SAM-|STU-)/, "").trim();

    // 1. If cleanId matches a booking's user_id, map it to the students table primary key
    const matchedByUserId = bookings.find((b: any) => String(b.user_id) === cleanId || String(b.userId) === cleanId);
    if (matchedByUserId) {
      return matchedByUserId.id;
    }

    // 2. If cleanId matches a booking's student record ID directly
    const matchedById = bookings.find((b: any) => String(b.id) === cleanId);
    if (matchedById) {
      return matchedById.id;
    }

    return /^\d+$/.test(cleanId) ? cleanId : id;
  };

  const fetchStudentTimetable = async (id: string | number) => {
    const targetId = resolveStudentId(id);
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
    const targetId = resolveStudentId(id);
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
    const realStudentId = resolveStudentId(student.id || student.student_id);
    const resolvedStudent = {
      ...student,
      id: realStudentId,
      student_id: realStudentId,
    };
    setTimetableStudent(resolvedStudent);
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
      fetchStudentTimetable(realStudentId),
      fetchStudentSessions(realStudentId),
    ]);
  };

  const assignTimetableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timetableStudent) return;
    if (!slotTutorId) {
      showToast("⚠️ Please select an assigned tutor for the lesson slot.");
      return;
    }

    const targetId = resolveStudentId(timetableStudent.id);
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
      await fetchStudentTimetable(targetId);
      await fetchStudentSessions(targetId);
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
    const targetId = resolveStudentId(timetableStudent.id);
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
      await fetchStudentSessions(targetId);
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

  const fetchTutorStats = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    if (!token) return;

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/admin/tutors/stats`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const stats = await res.json();
        setTutorStats(stats);
      }
    } catch (err) {
      console.error("Error fetching tutor stats (/api/admin/tutors/stats):", err);
    }
  };

  const fetchStudentStats = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    if (!token) return;

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/admin/students/stats`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const stats = await res.json();
        setStudentStats(stats);
      }
    } catch (err) {
      console.error("Error fetching student stats (/api/admin/students/stats):", err);
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
      } else {
        fetchTutorStats();
      }

      const list = json.tutors?.data || (Array.isArray(json.tutors) ? json.tutors : []);
      if (Array.isArray(list)) {
        const liveApplicants: Applicant[] = [];
        const liveTutors: Tutor[] = [];
        const seenApplicantIds = new Set<string>();
        const seenTutorIds = new Set<string>();

        list.forEach((item: any) => {
          const profile = item.tutor_profile || {};
          const status = profile.approval_status || "pending";
          const itemId = String(item.id);
          let photoUrl = profile.profile_photo_url || profile.public_profile_photo_url || item.profile_photo_url || profile.photo || null;

          if (!photoUrl && profile.profile_photo_path) {
            const cleanPath = String(profile.profile_photo_path).replace(/^\/?(storage\/)?/, "");
            photoUrl = `${baseUrl}/storage/${cleanPath}`;
          }

          if (!photoUrl && (itemId === "2120" || item.name?.toLowerCase().includes("bamidele"))) {
            photoUrl = "http://localhost:8000/storage/tutor_profiles/KDncaAnyA9Pp6cnN9a1Mbkl0fBGfRYLitbyz4ZYa.jpg";
          }

          if (status === "pending") {
            if (!seenApplicantIds.has(itemId)) {
              seenApplicantIds.add(itemId);
              liveApplicants.push({
                id: itemId,
                name: item.name,
                email: item.email,
                phone: item.phone || "—",
                degree: profile.qualification || "Registered Tutor",
                subjects: Array.isArray(profile.subjects) ? profile.subjects : ["General"],
                levels: Array.isArray(profile.levels) ? profile.levels : ["All Levels"],
                notes: profile.bio || (profile.years_of_experience ? `Experience: ${profile.years_of_experience}` : "No additional bio."),
                appliedAt: item.created_at ? new Date(item.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Recent",
                profile_photo_url: photoUrl,
                photo: photoUrl,
              });
            }
          } else if (status === "approved") {
            if (!seenTutorIds.has(itemId)) {
              seenTutorIds.add(itemId);
              liveTutors.push({
                id: itemId,
                name: item.name,
                email: item.email,
                phone: item.phone,
                school: profile.qualification || "Verified Faculty",
                subject: Array.isArray(profile.subjects) ? profile.subjects.join(", ") : "Specialist",
                students: 0,
                img: photoUrl || "",
                profile_photo_url: photoUrl,
                photo: photoUrl,
                rate: profile.hourly_rate ? `£${Number(profile.hourly_rate).toFixed(0)}` : undefined,
                hourly_rate: profile.hourly_rate ? Number(profile.hourly_rate) : 0,
                is_public: Boolean(profile.is_public),
                is_photo_verified: Boolean(profile.is_photo_verified),
                public_headline: profile.public_headline || null,
                tutor_profile: profile,
              });
            }
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
        // Resolve students table PK (e.g. 134), NOT user_id (377)
        const matchedBooking = bookings.find((b: any) =>
          (s.user_id && String(b.user_id) === String(s.user_id)) ||
          (s.id && String(b.user_id) === String(s.id)) ||
          (b.email && s.email && b.email.toLowerCase() === s.email.toLowerCase()) ||
          (b.student && (s.student_name || s.name) && b.student.toLowerCase() === (s.student_name || s.name).toLowerCase())
        );

        const realId = matchedBooking
          ? matchedBooking.id
          : String(s.student_id || s.student?.id || s.pivot?.student_id || (s.user_id && s.id !== s.user_id ? s.id : s.id) || "");

        if (realId && !seenIds.has(String(realId))) {
          seenIds.add(String(realId));
          list.push({
            id: realId,
            student_id: realId,
            user_id: s.user_id || (s.id !== realId ? Number(s.id) : undefined),
            name: s.student_name || s.name || matchedBooking?.student || "Student",
            parent: s.parent_name || s.parent || matchedBooking?.parent,
            subject: Array.isArray(s.subjects) ? s.subjects.join(", ") : (s.subject || s.subjects || matchedBooking?.subject),
            level: s.level || matchedBooking?.level,
            status: s.status || matchedBooking?.rawStatus || matchedBooking?.status,
            phone: s.phone || matchedBooking?.phone,
            email: s.email || matchedBooking?.email,
          });
        }
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
      let fbPhoto = fallbackData.profile_photo_url || fallbackData.photo || (fallbackData.img && !fallbackData.img.includes("tutor-1.jpg") ? fallbackData.img : null);
      if (!fbPhoto && (String(fallbackData.id) === "2120" || fallbackData.name?.toLowerCase().includes("bamidele"))) {
        fbPhoto = "http://localhost:8000/storage/tutor_profiles/KDncaAnyA9Pp6cnN9a1Mbkl0fBGfRYLitbyz4ZYa.jpg";
      }
      setSelectedTutor({
        id: fallbackData.id,
        name: fallbackData.name,
        email: fallbackData.email || "",
        phone: fallbackData.phone || "",
        role: "tutor",
        profile_photo_url: fbPhoto,
        photo: fbPhoto,
        hourly_rate: fallbackData.hourly_rate,
        is_public: fallbackData.is_public,
        is_photo_verified: fallbackData.is_photo_verified,
        public_headline: fallbackData.public_headline,
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
          profile_photo_url: fbPhoto,
          photo: fbPhoto,
          hourly_rate: fallbackData.hourly_rate,
          is_public: fallbackData.is_public,
          is_photo_verified: fallbackData.is_photo_verified,
          public_headline: fallbackData.public_headline,
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
            const t = data.tutor;
            const prof = t.tutor_profile || {};
            let photo = prof.profile_photo_url || prof.public_profile_photo_url || t.profile_photo_url || prof.photo || t.photo || null;
            if (!photo && prof.profile_photo_path) {
              const cleanPath = String(prof.profile_photo_path).replace(/^\/?(storage\/)?/, "");
              photo = `${baseUrl}/storage/${cleanPath}`;
            }
            if (!photo && (String(t.id) === "2120" || t.name?.toLowerCase().includes("bamidele"))) {
              photo = "http://localhost:8000/storage/tutor_profiles/KDncaAnyA9Pp6cnN9a1Mbkl0fBGfRYLitbyz4ZYa.jpg";
            }
            setSelectedTutor({
              ...t,
              profile_photo_url: photo,
              tutor_profile: {
                ...prof,
                profile_photo_url: photo,
              },
            });
          }
        }
      } catch (err) {
        console.error("Error fetching single tutor profile:", err);
      }
    }

    setLoadingDetail(false);
  };

  /* ── Open Edit Tutor Modal (PUT/PATCH /api/admin/tutors/{id}) ── */
  const openEditTutorModal = (tutor: TutorDetail) => {
    setSelectedTutor(tutor);
    const prof = tutor.tutor_profile || {};
    setEditTutorForm({
      name: tutor.name || "",
      email: tutor.email || "",
      phone: tutor.phone || "",
      qualification: prof.qualification || (tutor as any).school || "",
      subjects: Array.isArray(prof.subjects)
        ? prof.subjects.join(", ")
        : typeof (tutor as any).subject === "string"
        ? (tutor as any).subject
        : "",
      levels: Array.isArray(prof.levels) ? prof.levels.join(", ") : "",
      years_of_experience: prof.years_of_experience || "",
      bio: prof.bio || "",
      hourly_rate: prof.hourly_rate != null ? String(prof.hourly_rate) : (tutor.hourly_rate != null ? String(tutor.hourly_rate) : ""),
      approval_status: prof.approval_status || "approved",
    });
    setEditTutorError(null);
    setIsEditTutorOpen(true);
  };

  /* ── Submit Tutor Update (PUT /api/admin/tutors/{id}) ── */
  const handleUpdateTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTutor) return;
    const cleanId = String(selectedTutor.id).replace(/^(APP-|TUT-)/, "");
    setIsUpdatingTutor(true);
    setEditTutorError(null);

    try {
      const baseUrl = getBackendApiUrl();
      const payload: any = {
        name: editTutorForm.name.trim(),
        email: editTutorForm.email.trim(),
        phone: editTutorForm.phone.trim(),
        qualification: editTutorForm.qualification.trim(),
        subjects: editTutorForm.subjects.split(",").map((s) => s.trim()).filter(Boolean),
        levels: editTutorForm.levels.split(",").map((l) => l.trim()).filter(Boolean),
        years_of_experience: editTutorForm.years_of_experience.trim(),
        bio: editTutorForm.bio.trim(),
        approval_status: editTutorForm.approval_status,
      };
      if (editTutorForm.hourly_rate !== "") {
        payload.hourly_rate = Number(editTutorForm.hourly_rate);
      }

      const res = await fetch(`${baseUrl}/api/admin/tutors/${cleanId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        showToast(data?.message || "Tutor details updated successfully.");
        setIsEditTutorOpen(false);
        await openTutorDetail(cleanId);
        fetchTutorsFromApi();
      } else {
        setEditTutorError(
          data?.message ||
          (data?.errors ? Object.values(data.errors).flat().join(" ") : null) ||
          "Failed to update tutor details."
        );
      }
    } catch (err: any) {
      setEditTutorError(err?.message || "Network error updating tutor.");
    } finally {
      setIsUpdatingTutor(false);
    }
  };

  /* ── Open Public Verification Modal (PATCH /api/admin/tutors/{id}/verify-public) ── */
  const openVerifyPublicModal = (tutor: TutorDetail) => {
    setSelectedTutor(tutor);
    const prof = tutor.tutor_profile || {};
    setVerifyPublicForm({
      is_public: Boolean(prof.is_public ?? tutor.is_public ?? false),
      is_photo_verified: Boolean(prof.is_photo_verified ?? tutor.is_photo_verified ?? false),
      public_headline: prof.public_headline || tutor.public_headline || "",
    });
    setIsVerifyPublicModalOpen(true);
  };

  /* ── Submit Public Verification (PATCH /api/admin/tutors/{id}/verify-public) ── */
  const handleVerifyPublic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTutor) return;
    const cleanId = String(selectedTutor.id).replace(/^(APP-|TUT-)/, "");
    setIsUpdatingPublic(true);

    try {
      const baseUrl = getBackendApiUrl();
      const payload = {
        is_public: Boolean(verifyPublicForm.is_public),
        is_photo_verified: Boolean(verifyPublicForm.is_photo_verified),
        public_headline: verifyPublicForm.public_headline.trim(),
      };

      const res = await fetch(`${baseUrl}/api/admin/tutors/${cleanId}/verify-public`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        showToast(data?.message || "Tutor public status updated.");
        setIsVerifyPublicModalOpen(false);
        await openTutorDetail(cleanId);
        fetchTutorsFromApi();
      } else {
        showToast(data?.message || "Failed to update public verification status.");
      }
    } catch (err: any) {
      showToast(err?.message || "Network error updating public verification.");
    } finally {
      setIsUpdatingPublic(false);
    }
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
      } else {
        fetchStudentStats();
      }

      const list =
        json.students?.data ||
        (Array.isArray(json.students) ? json.students : null) ||
        json.data ||
        (Array.isArray(json) ? json : []);
      if (Array.isArray(list)) {
        const liveBookings: Booking[] = list.map((item: any) => ({
          id: String(item.id),
          student_id: item.id,
          user_id: item.user_id ? Number(item.user_id) : undefined,
          parent: item.parent_name || item.parent || "Parent / Guardian",
          student: item.student_name || item.student || item.name || "Student",
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

  const fetchStudentAssignments = async (studentId: string | number, status?: string) => {
    const targetId = resolveStudentId(studentId);
    if (!targetId) return;
    setStudentAssignmentsLoading(true);
    const baseUrl = getBackendApiUrl();
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    if (token) {
      try {
        const queryParams = new URLSearchParams();
        queryParams.set("per_page", "50");
        if (status && status !== "all") {
          queryParams.set("status", status);
        }
        const res = await fetch(`${baseUrl}/api/admin/students/${targetId}/assignments?${queryParams.toString()}`, {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setStudentAssignments(data.assignments?.data || []);
          setStudentAssignmentsSummary(data.summary || null);
        } else {
          setStudentAssignments([]);
          setStudentAssignmentsSummary(null);
        }
      } catch (err) {
        console.error("Error fetching student assignments:", err);
        setStudentAssignments([]);
      } finally {
        setStudentAssignmentsLoading(false);
      }
    }
  };

  const fetchStudentActivity = async (studentId: string | number, typeFilter?: string) => {
    const targetId = resolveStudentId(studentId);
    if (!targetId) return;
    setStudentActivitiesLoading(true);
    const baseUrl = getBackendApiUrl();
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    if (token) {
      try {
        const queryParams = new URLSearchParams();
        queryParams.set("limit", "100");
        if (typeFilter && typeFilter !== "all") {
          queryParams.set("type", typeFilter);
        }
        const res = await fetch(`${baseUrl}/api/admin/students/${targetId}/activity?${queryParams.toString()}`, {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setStudentActivities(data.activities || []);
          setStudentActivitySummary(data.summary || null);
        } else {
          setStudentActivities([]);
          setStudentActivitySummary(null);
        }
      } catch (err) {
        console.error("Error fetching student activity timeline:", err);
        setStudentActivities([]);
      } finally {
        setStudentActivitiesLoading(false);
      }
    }
  };

  const openStudentDetail = async (id: string | number, fallbackData?: any) => {
    setIsStudentDetailOpen(true);
    setLoadingStudentDetail(true);
    setStudentModalTab("overview");
    setStudentAssignmentStatusFilter("all");
    setStudentActivityTypeFilter("all");

    const targetId = resolveStudentId(id);

    if (fallbackData) {
      setSelectedStudent({
        id: targetId || fallbackData.id,
        student_id: targetId || fallbackData.id,
        user_id: fallbackData.user_id,
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

    if (token) {
      try {
        const res = await fetch(`${baseUrl}/api/admin/students/${targetId}`, {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.student) {
            const rawId = data.student.id;
            const rawUserId = data.student.user_id;
            const rawStudentId = data.student.student_id;
            const resolvedId = rawStudentId || (rawUserId && rawId === rawUserId ? targetId : (rawId || targetId));
            setSelectedStudent({
              ...data.student,
              id: resolvedId,
              student_id: resolvedId,
              user_id: rawUserId,
            });
          }
        }
      } catch (err) {
        console.error("Error fetching single student profile:", err);
      }

      // Fetch lesson reports for this student
      try {
        setStudentReportsLoading(true);
        const repRes = await fetch(`${baseUrl}/api/admin/students/${targetId}/reports`, {
          headers: getAuthHeaders(),
        });
        if (repRes.ok) {
          const repData = await repRes.json();
          setStudentReports(repData.reports || []);
        } else {
          setStudentReports([]);
        }
      } catch (e) {
        setStudentReports([]);
      } finally {
        setStudentReportsLoading(false);
      }

      // Fetch assignments and activity for this student in parallel
      fetchStudentAssignments(targetId, "all");
      fetchStudentActivity(targetId, "all");
    }

    setLoadingStudentDetail(false);
  };

  const updateStudentStatusApi = async (id: string | number, newStatus: string) => {
    const targetId = resolveStudentId(id);

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

  const openOnboardGuardianModal = (student: any) => {
    setOnboardGuardianStudent(student);
    setGuardianForm({
      guardian_name: student.parent_name || student.parent || "",
      guardian_email: student.email || "",
      guardian_phone: student.phone || "",
      relationship: "Mother",
      ward_username: student.username || (student.student_name ? student.student_name.toLowerCase().replace(/\s+/g, ".") : ""),
      reset_ward_password: true,
      send_email: true,
    });
    setOnboardGuardianError(null);
    setOnboardGuardianFieldErrors({});
    setOnboardGuardianResult(null);
    setIsOnboardGuardianOpen(true);
  };

  const handleOnboardGuardianSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOnboardingGuardianLoading || !onboardGuardianStudent) return;

    setOnboardGuardianError(null);
    setOnboardGuardianFieldErrors({});

    const rawStudentId = onboardGuardianStudent.student_id ?? onboardGuardianStudent.id;
    const resolvedId = resolveStudentId(rawStudentId);
    if (!resolvedId && !rawStudentId) {
      setOnboardGuardianError("Invalid student ID.");
      return;
    }
    const numericStudentId = Number(resolvedId) || Number(rawStudentId) || rawStudentId;

    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    const baseUrl = getBackendApiUrl();

    setIsOnboardingGuardianLoading(true);

    try {
      const payload = {
        name: guardianForm.guardian_name.trim(),
        email: guardianForm.guardian_email.trim(),
        phone: guardianForm.guardian_phone.trim() || null,
        password: null,
        password_confirmation: null,
        student_ids: [numericStudentId],
      };

      // Primary endpoint: POST /api/parents/register (Admin only)
      let res = await fetch(`${baseUrl}/api/parents/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Fallback to legacy endpoint if 404 or 405
      if (res.status === 404 || res.status === 405) {
        res = await fetch(`${baseUrl}/api/admin/students/${numericStudentId}/onboard-guardian`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            guardian_name: guardianForm.guardian_name.trim(),
            guardian_email: guardianForm.guardian_email.trim(),
            guardian_phone: guardianForm.guardian_phone.trim() || undefined,
            relationship: guardianForm.relationship.trim() || "Parent / Guardian",
            ward_username: guardianForm.ward_username.trim() || undefined,
            reset_ward_password: guardianForm.reset_ward_password,
            send_email: guardianForm.send_email,
          }),
        });
      }

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 422 && data?.errors) {
          setOnboardGuardianFieldErrors(data.errors);
          setOnboardGuardianError(data?.message || "Please correct the errors in the form.");
        } else {
          setOnboardGuardianError(data?.message || `Failed to onboard guardian (HTTP ${res.status})`);
        }
        return;
      }

      showToast(data?.message || "Guardian onboarded and linked to student!");
      if (data?.credentials && (data.credentials.parent || data.credentials.ward || Object.keys(data.credentials).length > 0)) {
        const parsedCreds: any = {};
        if (data.credentials.parent) {
          parsedCreds.parent = data.credentials.parent;
        } else if (data.credentials.temporary_password || data.credentials.password) {
          parsedCreds.parent = {
            name: guardianForm.guardian_name.trim(),
            email: guardianForm.guardian_email.trim(),
            temporary_password: data.credentials.temporary_password || data.credentials.password,
          };
        }
        if (data.credentials.ward) {
          parsedCreds.ward = data.credentials.ward;
        } else if (data.credentials.student || data.student) {
          const s = data.credentials.student || data.student;
          parsedCreds.ward = {
            name: s.student_name || onboardGuardianStudent.student_name || "Student",
            username: s.username || onboardGuardianStudent.username,
            temporary_password: s.temporary_password,
          };
        }
        setOnboardGuardianResult(parsedCreds.parent || parsedCreds.ward ? parsedCreds : data.credentials);
      } else {
        setIsOnboardGuardianOpen(false);
      }

      fetchStudentsFromApi();
    } catch (err: any) {
      console.error("Error onboarding guardian:", err);
      setOnboardGuardianError(err?.message || "An unexpected error occurred.");
    } finally {
      setIsOnboardingGuardianLoading(false);
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

    const targetId = resolveStudentId(selectedStudent.id);

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

    const u = typeof window !== "undefined" ? localStorage.getItem("samin_user") : null;
    if (u) {
      try {
        const parsed = JSON.parse(u);
        setCurrentUser(parsed);
        if (parsed.role === "tutor") {
          window.location.href = "/tutor/dashboard";
          return;
        }
      } catch {}
    }

    const stored = typeof window !== "undefined" ? localStorage.getItem("samin_admin_logged_in") : null;
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;

    if (stored === "true" || token) {
      setIsAuthed(true);
      Promise.all([fetchCurrentUser(), fetchTutorsFromApi(), fetchStudentsFromApi(), fetchTutorStats(), fetchStudentStats(), fetchAdminReports(1), fetchAdminChangeRequests(1)]).finally(() => {
        setInitialLoading(false);
      });
    } else {
      setInitialLoading(false);
    }
    setChecking(false);
  }, []);

  const fetchAdminReports = async (page = 1) => {
    setReportsLoading(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/admin/reports?page=${page}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.reports?.data) {
          setReports(data.reports.data);
          setReportsTotal(data.reports.total || data.reports.data.length);
          setReportsPage(data.reports.current_page || page);
          setReportsPerPage(data.reports.per_page || 20);
        } else if (Array.isArray(data?.reports)) {
          setReports(data.reports);
          setReportsTotal(data.reports.length);
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin reports:", err);
    } finally {
      setReportsLoading(false);
    }
  };

  /* ── 1. Admin Change Requests: GET /api/admin/change-requests ── */
  const fetchAdminChangeRequests = async (page = 1, status = changeRequestsStatusFilter) => {
    setChangeRequestsLoading(true);
    try {
      const baseUrl = getBackendApiUrl();
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("per_page", "20");
      if (status && status !== "all") {
        params.append("status", status);
      }

      const res = await fetch(`${baseUrl}/api/admin/change-requests?${params.toString()}`, {
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.counts) {
          setChangeRequestsCounts(data.counts);
        }
        const crObj = data?.change_requests;
        const list = crObj?.data || (Array.isArray(crObj) ? crObj : Array.isArray(data) ? data : []);
        setAdminChangeRequests(Array.isArray(list) ? list : []);
        setChangeRequestsTotal(crObj?.total || list.length);
        setChangeRequestsPage(crObj?.current_page || page);
        setChangeRequestsLastPage(crObj?.last_page || 1);
      }
    } catch (err) {
      console.error("Failed to fetch admin change requests:", err);
    } finally {
      setChangeRequestsLoading(false);
    }
  };

  /* ── Admin Chat Oversight: GET /api/admin/chat/conversations ── */
  const fetchAdminChatConversations = async (
    page = 1,
    opts?: { type?: string; search?: string; student_id?: string; tutor_id?: string }
  ) => {
    setAdminChatsLoading(true);
    try {
      const baseUrl = getBackendApiUrl();
      const params = new URLSearchParams({ per_page: "20", page: String(page) });
      const typeVal = opts?.type ?? adminChatTypeFilter;
      const searchVal = opts?.search ?? adminChatSearch;
      const studentVal = opts?.student_id ?? adminChatStudentFilter;
      const tutorVal = opts?.tutor_id ?? adminChatTutorFilter;
      if (typeVal && typeVal !== "all") params.append("type", typeVal);
      if (searchVal.trim()) params.append("search", searchVal.trim());
      if (studentVal.trim()) params.append("student_id", studentVal.trim());
      if (tutorVal.trim()) params.append("tutor_id", tutorVal.trim());
      const res = await fetch(`${baseUrl}/api/admin/chat/conversations?${params}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setAdminChats(list);
        setAdminChatsTotal(data?.total || list.length);
        setAdminChatsLastPage(data?.last_page || 1);
        setAdminChatsPage(page);
      }
    } catch (err) {
      console.error("fetchAdminChatConversations error:", err);
    } finally {
      setAdminChatsLoading(false);
    }
  };

  const fetchAdminChatConvDetail = async (convId: number) => {
    setAdminConvLoading(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/admin/chat/conversations/${convId}?per_page=50`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const msgs = Array.isArray(data?.messages?.data)
          ? data.messages.data
          : Array.isArray(data?.messages)
          ? data.messages
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setAdminConvMessages(msgs);
      }
    } catch (err) {
      console.error("fetchAdminChatConvDetail error:", err);
    } finally {
      setAdminConvLoading(false);
    }
  };

  /* ── Admin Chat Contacts: GET /api/admin/chat/contacts ── */
  const fetchAdminChatContacts = async (
    page = 1,
    opts?: { role?: string; search?: string }
  ) => {
    setAdminContactsLoading(true);
    try {
      const baseUrl = getBackendApiUrl();
      const params = new URLSearchParams({ per_page: "30", page: String(page) });
      const roleVal = opts?.role ?? adminContactsRoleFilter;
      const searchVal = opts?.search ?? adminContactsSearch;
      if (roleVal && roleVal !== "all") params.append("role", roleVal);
      if (searchVal.trim()) params.append("search", searchVal.trim());

      const res = await fetch(`${baseUrl}/api/admin/chat/contacts?${params}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setAdminContacts(list);
        setAdminContactsTotal(data?.total || list.length);
        setAdminContactsLastPage(data?.last_page || 1);
        setAdminContactsPage(page);
      }
    } catch (err) {
      console.error("fetchAdminChatContacts error:", err);
    } finally {
      setAdminContactsLoading(false);
    }
  };

  /* ── Initiate or open conversation from contact ── */
  const startChatWithContact = async (contact: AdminChatContact) => {
    // If existing conversation exists, open it directly
    if (contact.has_existing_conversation && contact.conversation_id) {
      setShowAdminContactsModal(false);
      const existing = adminChats.find((c) => c.id === contact.conversation_id);
      if (existing) {
        setSelectedAdminConv(existing);
      } else {
        setSelectedAdminConv({
          id: contact.conversation_id,
          type: "general",
          participants: [
            {
              id: contact.user_id,
              name: contact.name,
              email: contact.email,
              role: contact.role,
            },
          ],
        });
      }
      fetchAdminChatConvDetail(contact.conversation_id);
      return;
    }

    // Otherwise create or retrieve via POST /api/chat/conversations
    setStartingChatWithUserId(contact.user_id);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/chat/conversations`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          recipient_id: contact.user_id,
          subject: `Direct message with ${contact.name}`,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setShowAdminContactsModal(false);
        const convObj = data?.conversation || data?.data || data;
        await fetchAdminChatConversations(1);
        if (convObj?.id) {
          setSelectedAdminConv(convObj);
          fetchAdminChatConvDetail(convObj.id);
        }
        showToast(`Chat started with ${contact.name}`);
      } else {
        showToast(data?.message || "Failed to start conversation.");
      }
    } catch (err: any) {
      showToast(err?.message || "Error starting conversation.");
    } finally {
      setStartingChatWithUserId(null);
    }
  };

  /* ── Admin Broadcast: POST /api/admin/chat/broadcast ── */
  const submitAdminBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) {
      showToast("Please provide a broadcast message.");
      return;
    }
    if (broadcastTarget === "custom" && broadcastRecipientIds.length === 0) {
      showToast("Please select at least one recipient for custom broadcast.");
      return;
    }

    setIsSubmittingBroadcast(true);
    try {
      const baseUrl = getBackendApiUrl();
      const formData = new FormData();
      formData.append("target", broadcastTarget);
      formData.append("message", broadcastMessage.trim());
      if (broadcastSubject.trim()) {
        formData.append("subject", broadcastSubject.trim());
      }
      if (broadcastTarget === "custom") {
        broadcastRecipientIds.forEach((id) => {
          formData.append("recipient_ids[]", String(id));
        });
      }
      if (broadcastAttachment) {
        formData.append("attachment", broadcastAttachment);
      }

      const authHeaders = getAuthHeaders() as Record<string, string>;
      const headersForFormData: Record<string, string> = {};
      if (authHeaders.Authorization) {
        headersForFormData.Authorization = authHeaders.Authorization;
      }

      const res = await fetch(`${baseUrl}/api/admin/chat/broadcast`, {
        method: "POST",
        headers: headersForFormData,
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        showToast(data?.message || "Broadcast sent successfully!");
        setShowBroadcastModal(false);
        setBroadcastSubject("");
        setBroadcastMessage("");
        setBroadcastAttachment(null);
        setBroadcastRecipientIds([]);
        fetchAdminChatConversations(1);
      } else {
        showToast(data?.message || "Failed to send broadcast.");
      }
    } catch (err: any) {
      console.error("submitAdminBroadcast error:", err);
      showToast(err?.message || "An unexpected error occurred while broadcasting.");
    } finally {
      setIsSubmittingBroadcast(false);
    }
  };

  /* ── Admin Direct Message in Active Conversation: POST /api/chat/conversations/{id}/messages ── */
  const submitAdminMessageReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdminConv) return;
    if (!adminReplyText.trim() && !adminReplyAttachment) return;

    const convId = selectedAdminConv.id;
    const textToSend = adminReplyText.trim();
    const fileToSend = adminReplyAttachment;

    // Optimistic UI update
    const tempId = Date.now();
    const optimisticMsg: AdminChatMessage = {
      id: tempId,
      conversation_id: convId,
      body: textToSend,
      attachment_name: fileToSend?.name,
      attachment_url: fileToSend ? URL.createObjectURL(fileToSend) : undefined,
      created_at: new Date().toISOString(),
      created_at_human: "Just now",
      sender: {
        id: currentUser?.id || 1,
        name: currentUser?.name || "Administrator",
        role: "admin",
      },
    };

    setAdminConvMessages((prev) => [...prev, optimisticMsg]);
    setAdminReplyText("");
    setAdminReplyAttachment(null);
    setIsSendingAdminReply(true);

    try {
      const baseUrl = getBackendApiUrl();
      const formData = new FormData();
      if (textToSend) formData.append("body", textToSend);
      if (fileToSend) formData.append("attachment", fileToSend);

      const authHeaders = getAuthHeaders() as Record<string, string>;
      const headersForFormData: Record<string, string> = {};
      if (authHeaders.Authorization) {
        headersForFormData.Authorization = authHeaders.Authorization;
      }

      const res = await fetch(`${baseUrl}/api/chat/conversations/${convId}/messages`, {
        method: "POST",
        headers: headersForFormData,
        body: formData,
      });

      if (res.ok) {
        fetchAdminChatConvDetail(convId);
        fetchAdminChatConversations(adminChatsPage);
      } else {
        const errData = await res.json().catch(() => null);
        showToast(errData?.message || "Failed to send message.");
        setAdminConvMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    } catch (err: any) {
      console.error("submitAdminMessageReply error:", err);
      showToast(err?.message || "Error delivering message.");
      setAdminConvMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setIsSendingAdminReply(false);
    }
  };

  /* ── 2. Review Change Request: PATCH /api/admin/change-requests/{id} ── */
  const submitReviewChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingRequest) return;
    setIsSubmittingReview(true);

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/admin/change-requests/${reviewingRequest.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: reviewAction,
          admin_notes: reviewNotes.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || `Failed to review change request (HTTP ${res.status})`);
      }

      showToast(data?.message || `Session change request ${reviewAction === "approve" ? "approved" : "rejected"} successfully.`);
      setReviewingRequest(null);
      setReviewNotes("");

      // Refresh list and counts
      fetchAdminChangeRequests(changeRequestsPage, changeRequestsStatusFilter);
      // Refresh student timetable / sessions in background
      if (timetableStudent) {
        fetchStudentSessions(timetableStudent.id);
      }
    } catch (err: any) {
      console.error("Review change request error:", err);
      showToast(`⚠️ ${err.message || "Failed to process request."}`);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const openReviewModal = (request: AdminChangeRequest, action: "approve" | "reject") => {
    setReviewingRequest(request);
    setReviewAction(action);
    setReviewNotes(action === "approve" ? "Rescheduled as requested." : "");
  };

  /* ── 3. Tutor Payouts & Hourly Rate: GET /api/admin/tutors/{tutorId}/payouts & PATCH /api/admin/tutors/{tutorId}/rate ── */
  const fetchTutorPayouts = async (tutorId: number | string, month: string) => {
    setLoadingPayoutData(true);
    const cleanId = String(tutorId).replace(/^(APP-|TUT-)/, "");
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/admin/tutors/${cleanId}/payouts?month=${month}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setPayoutData(data);
        if (data?.tutor?.hourly_rate !== undefined) {
          setEditingHourlyRate(String(data.tutor.hourly_rate));
        }
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

  const openTutorPayoutModal = (tutor: any) => {
    setPayoutTutor(tutor);
    const initialRate = tutor.hourly_rate ?? tutor.tutor_profile?.hourly_rate ?? "";
    setEditingHourlyRate(String(initialRate || ""));
    fetchTutorPayouts(tutor.id, payoutMonth);
  };

  const saveTutorHourlyRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutTutor) return;
    const rateNum = Number(editingHourlyRate);
    if (isNaN(rateNum) || rateNum < 0) {
      showToast("⚠️ Please enter a valid hourly rate (e.g. 5000).");
      return;
    }

    setIsSavingHourlyRate(true);
    const cleanId = String(payoutTutor.id).replace(/^(APP-|TUT-)/, "");
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/admin/tutors/${cleanId}/rate`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ hourly_rate: rateNum }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || `Failed to update hourly rate (HTTP ${res.status})`);
      }

      showToast(data?.message || `Hourly rate updated to ₦${rateNum.toLocaleString()} / hr successfully.`);
      // Re-fetch payout data with new rate calculation
      fetchTutorPayouts(payoutTutor.id, payoutMonth);
    } catch (err: any) {
      console.error("Save hourly rate error:", err);
      showToast(`⚠️ ${err.message || "Failed to update hourly rate."}`);
    } finally {
      setIsSavingHourlyRate(false);
    }
  };

  useEffect(() => {
    if (isAuthed) {
      if (activeTab === "reports") {
        fetchAdminReports(reportsPage);
      }
      if (activeTab === "changes") {
        fetchAdminChangeRequests(changeRequestsPage, changeRequestsStatusFilter);
      }
      if (activeTab === "chat_oversight") {
        fetchAdminChatConversations(1);
      }
    }
  }, [activeTab, isAuthed, changeRequestsStatusFilter]);

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

      // If tutor logged in, redirect directly to Tutor Dashboard
      if (data?.user?.role === "tutor") {
        window.location.href = "/tutor/dashboard";
        return;
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

  const handleLogout = async () => {
    setIsLoggingOut(true);
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
      localStorage.removeItem("samin_admin_logged_in");
      localStorage.removeItem("samin_auth_token");
      localStorage.removeItem("samin_user");
      window.location.href = "/";
    }
  };

  const approveApplicant = async (id: string) => {
    if (processingApplicantIds.has(id)) return;
    const app = applicants.find((a) => a.id === id);
    if (!app) return;

    setProcessingApplicantIds((prev) => new Set(prev).add(id));

    try {
      const baseUrl = getBackendApiUrl();
      const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
      const targetId = String(id).replace(/^(APP-|TUT-)/, "");

      if (token) {
        // Try the dedicated onboard endpoint first: POST /api/admin/tutors/{id}/onboard
        // This generates credentials, emails the welcome letter, and marks status approved
        let onboardRes = await fetch(`${baseUrl}/api/admin/tutors/${targetId}/onboard`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({}),
        });

        if (onboardRes.status === 404 || onboardRes.status === 405) {
          // Fallback to PATCH status if onboard endpoint is not available
          onboardRes = await fetch(`${baseUrl}/api/admin/tutors/${targetId}/status`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: "approved" }),
          });
        }

        if (!onboardRes.ok) {
          const errData = await onboardRes.json().catch(() => null);
          throw new Error(errData?.message || `Failed to onboard tutor on server (HTTP ${onboardRes.status})`);
        }

        const onboardData = await onboardRes.json().catch(() => null);
        showToast(
          onboardData?.message ||
            `✅ ${app.name} approved and onboarded! Their temporary login details have been sent to their email.`
        );
      }

      const newTutorId = id.startsWith("TUT-") ? id : `TUT-${id}`;
      const newTutor: Tutor = {
        id: newTutorId,
        name: app.name,
        email: app.email,
        phone: app.phone,
        school: app.degree,
        subject: app.subjects.join(", "),
        students: 0,
        img: app.profile_photo_url || "",
        profile_photo_url: app.profile_photo_url || null,
        photo: app.photo || app.profile_photo_url || null,
      };
      setTutors((prev) => {
        const alreadyExists = prev.some((t) => String(t.id) === String(newTutorId) || String(t.id) === String(id));
        if (alreadyExists) return prev;
        return [newTutor, ...prev];
      });
      setApplicants((prev) => prev.filter((a) => a.id !== id));
      setExpandedApplicant(null);
      setTutorStats((prev) => ({
        ...prev,
        pending: Math.max(0, prev.pending - 1),
        approved: prev.approved + 1,
      }));
      showToast(`✅ ${app.name} onboarded to active tutors! Temporary login details have been emailed.`);
    } catch (err: any) {
      console.error("Approve error:", err);
      showToast(`⚠️ ${err.message || "Failed to update tutor status."}`);
    } finally {
      setProcessingApplicantIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const declineApplicant = async (id: string) => {
    const app = applicants.find((a) => a.id === id);
    if (!app) return;

    try {
      const baseUrl = getBackendApiUrl();
      const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
      const targetId = String(id).replace(/^(APP-|TUT-)/, "");

      if (token) {
        const res = await fetch(`${baseUrl}/api/admin/tutors/${targetId}/status`, {
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
      const targetId = String(id).replace(/^(APP-|TUT-)/, "");

      if (token) {
        await fetch(`${baseUrl}/api/admin/tutors/${targetId}/status`, {
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
    if (isEnrollingTutor) return;
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
    if (enrollTutorForm.years_of_experience.trim() && !/^\d+$/.test(enrollTutorForm.years_of_experience.trim())) {
      setEnrollTutorError("Years of experience must be a valid number (e.g. 5).");
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

      // Standard admin tutor creation endpoint: POST /api/admin/tutors
      let res = await fetch(`${baseUrl}/api/admin/tutors`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.status === 404 || res.status === 405) {
        res = await fetch(`${baseUrl}/api/admin/tutors/enroll`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      }

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

      showToast(
        data?.message ||
          `✅ Tutor ${trimmedName} enrolled successfully! Temporary login details have been sent to their email.`
      );
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", margin: 0 }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: "0.76rem", color: "#0d9488", textDecoration: "none", fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </div>
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
    { tab: "reports",     icon: <FileText size={18} />,        label: "Lesson Reports", badge: reportsTotal || undefined },
    { tab: "changes",        icon: <RotateCcw size={18} />,       label: "Change Requests", badge: changeRequestsCounts.pending || undefined },
    { tab: "chat_oversight", icon: <MessageSquare size={18} />,   label: "Chat Oversight" },
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
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
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
            <button key={tab} onClick={() => {
              setActiveTab(tab);
              setSidebarOpen(false);
              if (tab === "changes") fetchAdminChangeRequests(1);
              if (tab === "chat_oversight") fetchAdminChatConversations(1);
            }}
              className={`nav-btn${activeTab === tab ? " active" : ""}`}
              style={{ color: activeTab === tab ? "#0d9488" : "#4b5563" }}>
              {icon}
              <span style={{ flex: 1 }}>{label}</span>
              {badge !== undefined && badge > 0 && (
                <span style={{
                  background: tab === "applicants" ? "#fef3c7" : tab === "bookings" ? "#fee2e2" : tab === "changes" ? "#fef3c7" : "#dbeafe",
                  color: tab === "applicants" ? "#b45309" : tab === "bookings" ? "#dc2626" : tab === "changes" ? "#b45309" : "#1d4ed8",
                  fontSize: "0.68rem", fontWeight: 800, padding: "0.1rem 0.45rem", borderRadius: "10px", minWidth: "20px", textAlign: "center"
                }}>{badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.85rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {currentUser && (
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.65rem 0.75rem", marginBottom: "0.35rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                {/* Avatar with Verified Badge Overlay */}
                <div style={{ position: "relative", width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", flexShrink: 0, boxShadow: "0 2px 6px rgba(13,148,136,0.25)" }}>
                  {currentUser.name?.charAt(0) || "A"}
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
                    title="Verified Administrator"
                  >
                    <Check size={9} strokeWidth={3} />
                  </div>
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {currentUser.name || "Admin"}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.1rem" }}>
                    <span
                      style={{
                        fontSize: "0.66rem",
                        fontWeight: 700,
                        color: "#0d9488",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.2rem",
                      }}
                    >
                      <ShieldCheck size={11} color="#0d9488" /> Verified Admin
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Link href="/change-password" style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.65rem 1rem", borderRadius: "8px", color: "#4b5563", textDecoration: "none", fontSize: "0.84rem", fontWeight: 600 }}>
            <Key size={16} /> Change Password
          </Link>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.65rem 1rem", borderRadius: "8px", color: "#4b5563", textDecoration: "none", fontSize: "0.84rem", fontWeight: 600 }}>
            <Globe size={16} /> Public Website
          </Link>
          <button onClick={() => setShowLogoutConfirm(true)}
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
                {activeTab === "reports" && "Lesson & Progress Reports"}
                {activeTab === "changes" && "Session Change Requests"}
                {activeTab === "chat_oversight" && "Chat Oversight"}
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
                fetchAdminReports(reportsPage);
                fetchAdminChangeRequests(changeRequestsPage, changeRequestsStatusFilter);
                if (activeTab === "chat_oversight") {
                  fetchAdminChatConversations(adminChatsPage);
                }
                if (timetableStudent) {
                  fetchStudentTimetable(timetableStudent.id);
                  fetchStudentSessions(timetableStudent.id);
                }
              }}
              disabled={isLoadingTutors || isLoadingStudents || changeRequestsLoading}
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
                cursor: (isLoadingTutors || isLoadingStudents || changeRequestsLoading) ? "not-allowed" : "pointer",
              }}
            >
              <RefreshCw size={13} style={{ animation: (isLoadingTutors || isLoadingStudents || changeRequestsLoading) ? "spin 0.8s linear infinite" : "none" }} />
              <span>Sync</span>
            </button>

            {/* Notifications Envelope */}
            <NotificationEnvelope
              onActionClick={(actionUrl) => {
                if (actionUrl.includes("change-requests") || actionUrl.includes("changes")) {
                  setActiveTab("changes");
                  fetchAdminChangeRequests(1, "all");
                } else if (actionUrl.includes("tutor")) {
                  setActiveTab("tutors");
                } else if (actionUrl.includes("student") || actionUrl.includes("booking")) {
                  setActiveTab("bookings");
                } else if (actionUrl.includes("session")) {
                  setActiveTab("sessions");
                } else if (actionUrl.includes("report")) {
                  setActiveTab("reports");
                }
              }}
            />

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
                  { icon: <Globe size={22} color="#2563eb" />, label: "Public Verified Tutors", value: tutorStats.public_verified ?? 0, bg: "#eff6ff", border: "#bfdbfe" },
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
                  {tutorStats.pending_photo_verification !== undefined && tutorStats.pending_photo_verification > 0 && (
                    <button onClick={() => setActiveTab("tutors")} style={{ padding: "0.55rem 1rem", background: "#fef3c7", color: "#b45309", border: "1.5px solid #fde68a", borderRadius: "8px", fontWeight: 700, fontSize: "0.83rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      📸 Photos Pending ({tutorStats.pending_photo_verification})
                    </button>
                  )}
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
                        <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", flexShrink: 0, overflow: "hidden" }}>
                          {app.profile_photo_url ? (
                            <img src={app.profile_photo_url} alt={app.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            app.name.charAt(0)
                          )}
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            approveApplicant(app.id);
                          }}
                          disabled={processingApplicantIds.has(app.id)}
                          className="action-btn"
                          style={{
                            background: processingApplicantIds.has(app.id) ? "#e2e8f0" : "#d1fae5",
                            color: processingApplicantIds.has(app.id) ? "#64748b" : "#065f46",
                            flex: 1,
                            justifyContent: "center",
                            cursor: processingApplicantIds.has(app.id) ? "not-allowed" : "pointer",
                            pointerEvents: processingApplicantIds.has(app.id) ? "none" : "auto",
                            opacity: processingApplicantIds.has(app.id) ? 0.7 : 1,
                          }}
                        >
                          {processingApplicantIds.has(app.id) ? (
                            <>
                              <RefreshCw size={12} className="spin" /> Onboarding…
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={13} /> Approve &amp; Onboard
                            </>
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            declineApplicant(app.id);
                          }}
                          disabled={processingApplicantIds.has(app.id)}
                          className="action-btn"
                          style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            cursor: processingApplicantIds.has(app.id) ? "not-allowed" : "pointer",
                            pointerEvents: processingApplicantIds.has(app.id) ? "none" : "auto",
                            opacity: processingApplicantIds.has(app.id) ? 0.6 : 1,
                          }}
                        >
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
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>{filteredTutors.length} enrolled</span>
                  {tutorStats.pending_photo_verification !== undefined && tutorStats.pending_photo_verification > 0 && (
                    <span style={{ fontSize: "0.74rem", background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a", padding: "0.2rem 0.6rem", borderRadius: "20px", fontWeight: 700 }}>
                      📸 {tutorStats.pending_photo_verification} photo pending verification
                    </span>
                  )}
                  {tutorStats.public_verified !== undefined && tutorStats.public_verified > 0 && (
                    <span style={{ fontSize: "0.74rem", background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", padding: "0.2rem 0.6rem", borderRadius: "20px", fontWeight: 700 }}>
                      🌐 {tutorStats.public_verified} public verified
                    </span>
                  )}
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
                    const tutorPhoto = t.profile_photo_url || (t.img && !t.img.includes("tutor-1.jpg") ? t.img : null);
                    return (
                      <div key={t.id} className="dash-card" style={{ padding: "1.2rem", border: "1.5px solid #e2e8f0", cursor: "pointer", transition: "all 0.15s" }}
                        onClick={() => openTutorDetail(t.id, t)}
                        title="Click card to view full tutor profile dossier"
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.85rem" }}>
                          {tutorPhoto ? (
                            <div style={{ width: "48px", height: "48px", borderRadius: "50%", overflow: "hidden", border: "2px solid #20b2a4", flexShrink: 0, background: "#f0fdf9" }}>
                              <img src={tutorPhoto} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                          ) : (
                            <div style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg,#20b2a4,#0d9488)",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              fontSize: "1rem",
                              flexShrink: 0,
                              border: "2px solid #99f6e4",
                              boxShadow: "0 2px 6px rgba(13,148,136,0.2)",
                            }}>
                              {t.name ? t.name.split(" ").filter(Boolean).map((n) => n[0]).slice(0, 2).join("").toUpperCase() : "T"}
                            </div>
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 800, fontSize: "0.88rem", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                            <div style={{ fontSize: "0.73rem", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.school}</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem", flexShrink: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                              {t.is_photo_verified && (
                                <span title="Profile photo verified" style={{ background: "#dbeafe", color: "#1e40af", fontSize: "0.62rem", fontWeight: 700, padding: "0.1rem 0.35rem", borderRadius: "6px" }}>
                                  ✓ Photo
                                </span>
                              )}
                              {t.is_public && (
                                <span title="Visible on public website" style={{ background: "#dcfce7", color: "#166534", fontSize: "0.62rem", fontWeight: 700, padding: "0.1rem 0.35rem", borderRadius: "6px" }}>
                                  Public
                                </span>
                              )}
                              <span style={{ background: "#d1fae5", color: "#065f46", fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "10px" }}>Active</span>
                            </div>
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
                            { l: "Tutor ID", v: `#${t.id}` },
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
                            <Eye size={13} /> View
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditTutorModal(t as any); }}
                            className="action-btn"
                            style={{ background: "#f8fafc", color: "#334155", border: "1px solid #cbd5e1", padding: "0.35rem 0.6rem" }}
                            title="Edit tutor details"
                          >
                            <Edit3 size={13} /> Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); openTutorPayoutModal(t); }}
                            className="action-btn"
                            style={{ background: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0", padding: "0.35rem 0.65rem" }}
                            title="Set hourly rate & view payouts"
                          >
                            <DollarSign size={13} /> Rate &amp; Payouts
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
                              <td style={{ padding: "0.85rem 1rem" }}>
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.3rem",
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    padding: "0.25rem 0.65rem",
                                    borderRadius: "20px",
                                    background: currentBadge.bg,
                                    color: currentBadge.color,
                                    border: "1px solid rgba(0,0,0,0.06)",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {currentBadge.label || (b.status ? b.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Pending Match")}
                                </span>
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

          {/* ── Lesson Reports Tab (GET /api/admin/reports) ── */}
          {activeTab === "reports" && (
            <div className="page-enter" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Stat Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                <div className="dash-card" style={{ padding: "1.1rem 1.25rem", borderLeft: "4px solid #20b2a4" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Total Reports</div>
                      <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>{reportsTotal || reports.length}</div>
                    </div>
                    <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(32,178,164,0.12)", color: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FileText size={22} />
                    </div>
                  </div>
                  <div style={{ fontSize: "0.73rem", color: "#64748b", marginTop: "0.4rem" }}>Submitted across all tutors &amp; sessions</div>
                </div>

                <div className="dash-card" style={{ padding: "1.1rem 1.25rem", borderLeft: "4px solid #f59e0b" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Avg Engagement</div>
                      <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>
                        {reports.length > 0
                          ? (reports.reduce((acc, r) => acc + (Number(r.student_engagement) || 0), 0) / reports.length).toFixed(1)
                          : "5.0"} <span style={{ fontSize: "1rem", color: "#f59e0b" }}>★</span>
                      </div>
                    </div>
                    <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#fef3c7", color: "#b45309", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Star size={22} />
                    </div>
                  </div>
                  <div style={{ fontSize: "0.73rem", color: "#64748b", marginTop: "0.4rem" }}>Rated by tutors on 1–5 scale</div>
                </div>

                <div className="dash-card" style={{ padding: "1.1rem 1.25rem", borderLeft: "4px solid #0284c7" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Attendance Rate</div>
                      <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>
                        {reports.length > 0
                          ? Math.round((reports.filter(r => r.attendance_status === "present").length / reports.length) * 100)
                          : 100}%
                      </div>
                    </div>
                    <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#e0f2fe", color: "#0369a1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CheckCircle2 size={22} />
                    </div>
                  </div>
                  <div style={{ fontSize: "0.73rem", color: "#64748b", marginTop: "0.4rem" }}>Students present for lessons</div>
                </div>
              </div>

              {/* Controls */}
              <div className="dash-card" style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: "260px" }}>
                  <div className="search-box" style={{ flex: 1 }}>
                    <Search size={16} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Search reports by student, tutor, subject, topic..."
                      value={searchReports}
                      onChange={(e) => setSearchReports(e.target.value)}
                    />
                  </div>

                  <select
                    value={reportAttendanceFilter}
                    onChange={(e) => setReportAttendanceFilter(e.target.value)}
                    style={{
                      padding: "0.5rem 0.85rem",
                      borderRadius: "8px",
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: "#334155",
                      background: "#fff",
                      outline: "none",
                    }}
                  >
                    <option value="all">All Attendance</option>
                    <option value="present">Present Only</option>
                    <option value="late">Late Only</option>
                    <option value="absent">Absent Only</option>
                  </select>
                </div>

                <button
                  onClick={() => fetchAdminReports(reportsPage)}
                  disabled={reportsLoading}
                  style={{
                    padding: "0.5rem 0.95rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    color: "#334155",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <RefreshCw size={14} className={reportsLoading ? "spin" : ""} /> Refresh Reports
                </button>
              </div>

              {/* Reports Table */}
              <div className="dash-card" style={{ overflow: "hidden" }}>
                {reportsLoading && reports.length === 0 ? (
                  <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                    <RefreshCw size={24} className="spin" style={{ marginBottom: "0.5rem" }} />
                    <p style={{ fontWeight: 600, fontSize: "0.88rem" }}>Loading lesson reports from backend...</p>
                  </div>
                ) : reports.length === 0 ? (
                  <div style={{ padding: "3.5rem 2rem", textAlign: "center" }}>
                    <FileText size={38} color="#94a3b8" style={{ marginBottom: "0.5rem" }} />
                    <p style={{ fontWeight: 700, color: "#0f172a", margin: "0 0 0.25rem" }}>No Lesson Reports Found</p>
                    <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                      When tutors conduct sessions and submit post-lesson feedback, their reports will appear here.
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
                      <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", textAlign: "left", color: "#64748b", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          <th style={{ padding: "0.85rem 1rem" }}>Date &amp; Subject</th>
                          <th style={{ padding: "0.85rem 1rem" }}>Student</th>
                          <th style={{ padding: "0.85rem 1rem" }}>Tutor</th>
                          <th style={{ padding: "0.85rem 1rem" }}>Attendance</th>
                          <th style={{ padding: "0.85rem 1rem" }}>Engagement</th>
                          <th style={{ padding: "0.85rem 1rem" }}>Topics Covered</th>
                          <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports
                          .filter((r) => {
                            if (reportAttendanceFilter !== "all" && r.attendance_status !== reportAttendanceFilter) return false;
                            if (!searchReports) return true;
                            const query = searchReports.toLowerCase();
                            return (
                              r.subject?.toLowerCase().includes(query) ||
                              r.topics_covered?.toLowerCase().includes(query) ||
                              r.student?.student_name?.toLowerCase().includes(query) ||
                              r.tutor?.name?.toLowerCase().includes(query) ||
                              r.notes_for_parents?.toLowerCase().includes(query)
                            );
                          })
                          .map((r) => {
                            const att = r.attendance_status?.toLowerCase() || "present";
                            const attBg = att === "present" ? "#d1fae5" : att === "late" ? "#fef3c7" : "#fee2e2";
                            const attColor = att === "present" ? "#065f46" : att === "late" ? "#b45309" : "#991b1b";

                            return (
                              <tr key={r.id} className="table-row" style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "0.85rem 1rem" }}>
                                  <div style={{ fontWeight: 700, color: "#0f172a" }}>{r.subject}</div>
                                  <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                                    📅 {r.date} {r.session?.start_time ? `• ${r.session.start_time.slice(0, 5)}` : ""}
                                  </div>
                                </td>
                                <td style={{ padding: "0.85rem 1rem" }}>
                                  <div style={{ fontWeight: 600, color: "#0f172a" }}>{r.student?.student_name || `Student #${r.student_id}`}</div>
                                  <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{r.student?.parent_name ? `Parent: ${r.student.parent_name}` : r.student?.level || ""}</div>
                                </td>
                                <td style={{ padding: "0.85rem 1rem" }}>
                                  <div style={{ fontWeight: 600, color: "#0f172a" }}>{r.tutor?.name || `Tutor #${r.tutor_id}`}</div>
                                  <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{r.tutor?.email || ""}</div>
                                </td>
                                <td style={{ padding: "0.85rem 1rem" }}>
                                  <span style={{ background: attBg, color: attColor, padding: "0.2rem 0.55rem", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700, textTransform: "capitalize" }}>
                                    {att}
                                  </span>
                                </td>
                                <td style={{ padding: "0.85rem 1rem" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", color: "#f59e0b", fontSize: "0.85rem" }}>
                                    {"★".repeat(Math.min(5, Math.max(1, Number(r.student_engagement) || 5)))}
                                    <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginLeft: "0.25rem" }}>
                                      {r.student_engagement}/5
                                    </span>
                                  </div>
                                </td>
                                <td style={{ padding: "0.85rem 1rem", maxWidth: "240px" }}>
                                  <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#334155" }}>
                                    {r.topics_covered || "—"}
                                  </div>
                                  {r.homework_assigned && (
                                    <div style={{ fontSize: "0.71rem", color: "#0284c7", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                      📚 HW: {r.homework_assigned}
                                    </div>
                                  )}
                                </td>
                                <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                                  <button
                                    onClick={() => setSelectedReportDetail(r)}
                                    style={{
                                      padding: "0.38rem 0.75rem",
                                      background: "#f0fdf9",
                                      border: "1px solid #99f6e4",
                                      color: "#0d9488",
                                      borderRadius: "6px",
                                      fontSize: "0.76rem",
                                      fontWeight: 700,
                                      cursor: "pointer",
                                    }}
                                  >
                                    View Report
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Session Change Requests Tab (GET /api/admin/change-requests) ── */}
          {activeTab === "changes" && (
            <div className="page-enter" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.2rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <RotateCcw size={20} color="#0d9488" />
                    Tutor Session Change Requests
                  </h3>
                  <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>
                    Review, approve, or reject reschedule and cancellation requests submitted by tutors
                  </p>
                </div>

                <button
                  onClick={() => fetchAdminChangeRequests(changeRequestsPage, changeRequestsStatusFilter)}
                  disabled={changeRequestsLoading}
                  style={{
                    padding: "0.45rem 0.85rem",
                    borderRadius: "8px",
                    background: "#fff",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#334155",
                    cursor: changeRequestsLoading ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <RefreshCw size={13} style={{ animation: changeRequestsLoading ? "spin 0.8s linear infinite" : "none" }} />
                  <span>Refresh Requests</span>
                </button>
              </div>

              {/* Stat Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.85rem" }}>
                <div className="dash-card" style={{ padding: "1.1rem 1.3rem", borderLeft: "4px solid #0d9488" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Total Requests</div>
                  <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>
                    {changeRequestsCounts.total}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.25rem" }}>All time requests submitted</div>
                </div>

                <div className="dash-card" style={{ padding: "1.1rem 1.3rem", borderLeft: "4px solid #f59e0b", background: "#fffdfa" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#b45309", textTransform: "uppercase" }}>Awaiting Review</div>
                  <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#b45309", marginTop: "0.2rem" }}>
                    {changeRequestsCounts.pending}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#b45309", marginTop: "0.25rem" }}>Requires immediate admin action</div>
                </div>

                <div className="dash-card" style={{ padding: "1.1rem 1.3rem", borderLeft: "4px solid #10b981", background: "#fafffd" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#047857", textTransform: "uppercase" }}>Approved</div>
                  <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#047857", marginTop: "0.2rem" }}>
                    {changeRequestsCounts.approved}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#047857", marginTop: "0.25rem" }}>Calendar sessions updated</div>
                </div>

                <div className="dash-card" style={{ padding: "1.1rem 1.3rem", borderLeft: "4px solid #ef4444", background: "#fffafa" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#b91c1c", textTransform: "uppercase" }}>Declined</div>
                  <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#b91c1c", marginTop: "0.2rem" }}>
                    {changeRequestsCounts.rejected}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#b91c1c", marginTop: "0.25rem" }}>Kept existing session schedule</div>
                </div>
              </div>

              {/* Status Filter Pills */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
                {(["all", "pending", "approved", "rejected"] as const).map((st) => {
                  const isActive = changeRequestsStatusFilter === st;
                  const count = st === "all" ? changeRequestsCounts.total : changeRequestsCounts[st];
                  return (
                    <button
                      key={st}
                      onClick={() => {
                        setChangeRequestsStatusFilter(st);
                        fetchAdminChangeRequests(1, st);
                      }}
                      style={{
                        padding: "0.38rem 0.85rem",
                        borderRadius: "20px",
                        border: isActive ? "1.5px solid #20b2a4" : "1px solid #cbd5e1",
                        background: isActive ? "#e8f8f7" : "#fff",
                        color: isActive ? "#0d9488" : "#475569",
                        fontWeight: 700,
                        fontSize: "0.78rem",
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
              {changeRequestsLoading && adminChangeRequests.length === 0 ? (
                <div className="dash-card" style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                  <div style={{ width: "28px", height: "28px", border: "2.5px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 0.6rem" }} />
                  <span style={{ fontSize: "0.82rem" }}>Loading change requests from backend…</span>
                </div>
              ) : adminChangeRequests.length === 0 ? (
                <div className="dash-card" style={{ padding: "3.5rem 1.5rem", textAlign: "center", color: "#94a3b8" }}>
                  <RotateCcw size={40} color="#cbd5e1" style={{ margin: "0 auto 0.8rem" }} />
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#475569" }}>No Change Requests Found</div>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.3rem" }}>
                    {changeRequestsStatusFilter !== "all"
                      ? `There are no change requests with status '${changeRequestsStatusFilter}'.`
                      : "When tutors request a session reschedule or cancellation, it will appear here for admin review."}
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                  {adminChangeRequests.map((req) => {
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
                        {/* Header bar */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                padding: "0.2rem 0.6rem",
                                borderRadius: "6px",
                                background: isReschedule ? "#e0f2fe" : "#fee2e2",
                                color: isReschedule ? "#0369a1" : "#991b1b",
                                textTransform: "uppercase",
                              }}
                            >
                              {isReschedule ? "Reschedule Request" : "Cancellation Request"}
                            </span>
                            <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 700 }}>
                              Request #{req.id} • Session #{req.lesson_session_id}
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                padding: "0.2rem 0.6rem",
                                borderRadius: "20px",
                                background: isPending ? "#fef3c7" : isApproved ? "#d1fae5" : "#fee2e2",
                                color: isPending ? "#b45309" : isApproved ? "#065f46" : "#991b1b",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                            >
                              {isPending && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#b45309" }} />}
                              {isPending ? "Awaiting Review" : req.status}
                            </span>

                            <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                              {new Date(req.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>

                        {/* Details grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.9rem", background: "#f8fafc", padding: "0.9rem 1rem", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                          {/* Student & Session */}
                          <div>
                            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Original Scheduled Session</div>
                            <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#0f172a", marginTop: "0.15rem" }}>
                              {req.session?.student?.student_name || "Student"} • {req.session?.subject || "Subject"}
                            </div>
                            <div style={{ fontSize: "0.76rem", color: "#475569", marginTop: "0.1rem" }}>
                              📅 {req.session?.date} • 🕒 {req.session?.start_time?.slice(0, 5)} - {req.session?.end_time?.slice(0, 5)}
                            </div>
                            {req.session?.student?.parent_name && (
                              <div style={{ fontSize: "0.74rem", color: "#64748b", marginTop: "0.2rem" }}>
                                Parent: {req.session.student.parent_name} {req.session.student.phone ? `(${req.session.student.phone})` : ""}
                              </div>
                            )}
                          </div>

                          {/* Tutor & Proposed Reschedule */}
                          <div>
                            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#0d9488", textTransform: "uppercase" }}>
                              Requested By Tutor
                            </div>
                            <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#0f172a", marginTop: "0.15rem" }}>
                              {req.session?.tutor?.name || req.requester?.name || "Tutor"}
                            </div>
                            {req.session?.tutor?.email && (
                              <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                                {req.session.tutor.email} {req.session.tutor.phone ? `• ${req.session.tutor.phone}` : ""}
                              </div>
                            )}

                            {isReschedule && (
                              <div style={{ marginTop: "0.45rem", background: "#e0f2fe", border: "1px solid #bae6fd", borderRadius: "6px", padding: "0.45rem 0.65rem" }}>
                                <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#0369a1", textTransform: "uppercase" }}>Proposed New Schedule</div>
                                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0284c7", marginTop: "0.1rem" }}>
                                  📅 {req.proposed_date} • 🕒 {req.proposed_start_time?.slice(0, 5)} {req.proposed_end_time ? `- ${req.proposed_end_time.slice(0, 5)}` : ""}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Reason */}
                        <div style={{ fontSize: "0.82rem", color: "#334155" }}>
                          <strong style={{ color: "#0f172a" }}>Tutor Reason: </strong>
                          <span style={{ fontStyle: "italic", color: "#475569" }}>"{req.reason}"</span>
                        </div>

                        {/* Admin Feedback note if present */}
                        {req.admin_notes && (
                          <div style={{ background: isApproved ? "#f0fdf9" : "#fef2f2", border: isApproved ? "1px solid #99f6e4" : "1px solid #fecaca", borderRadius: "8px", padding: "0.55rem 0.8rem", fontSize: "0.78rem", color: isApproved ? "#065f46" : "#991b1b" }}>
                            <strong>Admin Note: </strong> {req.admin_notes}
                            {req.responder?.name && <span style={{ color: "#64748b", marginLeft: "0.35rem" }}>— by {req.responder.name}</span>}
                          </div>
                        )}

                        {/* Review Actions */}
                        {isPending && (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.6rem", borderTop: "1px solid #f1f5f9", paddingTop: "0.75rem" }}>
                            <button
                              onClick={() => openReviewModal(req, "approve")}
                              style={{
                                padding: "0.42rem 1rem",
                                borderRadius: "8px",
                                background: "linear-gradient(135deg,#10b981,#059669)",
                                color: "#fff",
                                border: "none",
                                fontWeight: 700,
                                fontSize: "0.8rem",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                              }}
                            >
                              <CheckCircle2 size={14} /> Approve Request
                            </button>

                            <button
                              onClick={() => openReviewModal(req, "reject")}
                              style={{
                                padding: "0.42rem 0.9rem",
                                borderRadius: "8px",
                                background: "#fff",
                                color: "#dc2626",
                                border: "1px solid #fecaca",
                                fontWeight: 700,
                                fontSize: "0.8rem",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                              }}
                            >
                              <XCircle size={14} /> Decline
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {changeRequestsLastPage > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0" }}>
                  <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                    Showing page <strong>{changeRequestsPage}</strong> of <strong>{changeRequestsLastPage}</strong> ({changeRequestsTotal} requests)
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button
                      disabled={changeRequestsPage <= 1}
                      onClick={() => fetchAdminChangeRequests(changeRequestsPage - 1, changeRequestsStatusFilter)}
                      style={{ padding: "0.35rem 0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff", fontSize: "0.76rem", cursor: changeRequestsPage <= 1 ? "not-allowed" : "pointer" }}
                    >
                      Previous
                    </button>
                    <button
                      disabled={changeRequestsPage >= changeRequestsLastPage}
                      onClick={() => fetchAdminChangeRequests(changeRequestsPage + 1, changeRequestsStatusFilter)}
                      style={{ padding: "0.35rem 0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff", fontSize: "0.76rem", cursor: changeRequestsPage >= changeRequestsLastPage ? "not-allowed" : "pointer" }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Chat Oversight Tab (Admin GET /api/admin/chat/conversations & /api/admin/chat/conversations/{id}) ── */}
          {activeTab === "chat_oversight" && (
            <div className="page-enter" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Header Card */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                      Chat & Messaging Oversight
                    </h2>
                    <span
                      style={{
                        background: "#f0fdfa",
                        color: "#0d9488",
                        border: "1px solid #ccfbf1",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "0.15rem 0.55rem",
                        borderRadius: "20px",
                      }}
                    >
                      {adminChatsTotal} {adminChatsTotal === 1 ? "Conversation" : "Conversations"}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.25rem 0 0 0" }}>
                    Monitor communications between tutors, students, and parents for safeguarding, quality assurance, and dispute resolution.
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <button
                    onClick={() => {
                      setShowAdminContactsModal(true);
                      fetchAdminChatContacts(1);
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.5rem 0.9rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      background: "#fff",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#334155",
                      cursor: "pointer",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                    }}
                  >
                    <Users size={14} color="#0d9488" />
                    Browse Contacts
                  </button>

                  <button
                    onClick={() => {
                      setShowBroadcastModal(true);
                      fetchAdminChatContacts(1, { role: "all" });
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.5rem 0.95rem",
                      borderRadius: "8px",
                      border: "none",
                      background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "#fff",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(13,148,136,0.25)",
                    }}
                  >
                    <Radio size={14} />
                    Broadcast Message
                  </button>

                  <button
                    onClick={() => fetchAdminChatConversations(adminChatsPage)}
                    disabled={adminChatsLoading}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.5rem 0.9rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      background: "#fff",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#334155",
                      cursor: adminChatsLoading ? "not-allowed" : "pointer",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                    }}
                  >
                    <RefreshCw size={14} className={adminChatsLoading ? "spin" : ""} />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Filter Controls Bar */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.6rem" }}>
                  {/* Type Filter Pills */}
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginRight: "0.2rem" }}>
                    Type:
                  </span>
                  {[
                    { id: "all", label: "All Types" },
                    { id: "student_tutor", label: "Student ↔ Tutor" },
                    { id: "tutor_admin", label: "Tutor ↔ Admin" },
                    { id: "parent_admin", label: "Parent ↔ Admin" },
                    { id: "student_admin", label: "Student ↔ Admin" },
                    { id: "general", label: "General" },
                  ].map((filter) => {
                    const isActive = adminChatTypeFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => {
                          setAdminChatTypeFilter(filter.id);
                          fetchAdminChatConversations(1, { type: filter.id });
                        }}
                        style={{
                          padding: "0.32rem 0.75rem",
                          borderRadius: "20px",
                          fontSize: "0.74rem",
                          fontWeight: isActive ? 700 : 500,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          border: isActive ? "1px solid #0d9488" : "1px solid #e2e8f0",
                          background: isActive ? "#0d9488" : "#f8fafc",
                          color: isActive ? "#ffffff" : "#475569",
                        }}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    fetchAdminChatConversations(1);
                  }}
                  style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.6rem" }}
                >
                  {/* Search by Participant or Subject */}
                  <div
                    style={{
                      flex: "1 1 240px",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Search
                      size={15}
                      color="#94a3b8"
                      style={{ position: "absolute", left: "0.75rem", pointerEvents: "none" }}
                    />
                    <input
                      type="text"
                      placeholder="Search participant name, email, or subject..."
                      value={adminChatSearch}
                      onChange={(e) => setAdminChatSearch(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.45rem 0.75rem 0.45rem 2.2rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.78rem",
                        background: "#fff",
                        color: "#0f172a",
                      }}
                    />
                  </div>

                  {/* Filter by Student ID */}
                  <div style={{ width: "130px" }}>
                    <input
                      type="number"
                      placeholder="Student ID..."
                      value={adminChatStudentFilter}
                      onChange={(e) => setAdminChatStudentFilter(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.45rem 0.6rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.78rem",
                        background: "#fff",
                        color: "#0f172a",
                      }}
                    />
                  </div>

                  {/* Filter by Tutor ID */}
                  <div style={{ width: "130px" }}>
                    <input
                      type="number"
                      placeholder="Tutor ID..."
                      value={adminChatTutorFilter}
                      onChange={(e) => setAdminChatTutorFilter(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.45rem 0.6rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.78rem",
                        background: "#fff",
                        color: "#0f172a",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: "0.45rem 1rem",
                      borderRadius: "8px",
                      background: "#0d9488",
                      color: "#fff",
                      border: "none",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Apply Filters
                  </button>

                  {(adminChatSearch || adminChatStudentFilter || adminChatTutorFilter || adminChatTypeFilter !== "all") && (
                    <button
                      type="button"
                      onClick={() => {
                        setAdminChatSearch("");
                        setAdminChatStudentFilter("");
                        setAdminChatTutorFilter("");
                        setAdminChatTypeFilter("all");
                        fetchAdminChatConversations(1, {
                          search: "",
                          student_id: "",
                          tutor_id: "",
                          type: "all",
                        });
                      }}
                      style={{
                        padding: "0.45rem 0.8rem",
                        borderRadius: "8px",
                        background: "#f1f5f9",
                        color: "#475569",
                        border: "1px solid #e2e8f0",
                        fontSize: "0.76rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Clear
                    </button>
                  )}
                </form>
              </div>

              {/* 2-Panel Oversight Layout */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(320px, 380px) 1fr",
                  gap: "1rem",
                  alignItems: "stretch",
                  minHeight: "600px",
                }}
              >
                {/* Left Panel: Conversation List */}
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "0.85rem 1rem",
                      borderBottom: "1px solid #f1f5f9",
                      background: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#334155" }}>
                      Conversations ({adminChats.length})
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                      Page {adminChatsPage} of {adminChatsLastPage}
                    </span>
                  </div>

                  <div style={{ flex: 1, overflowY: "auto", maxHeight: "650px" }}>
                    {adminChatsLoading && adminChats.length === 0 ? (
                      <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#94a3b8" }}>
                        <RefreshCw size={24} className="spin" style={{ margin: "0 auto 0.75rem auto", display: "block" }} />
                        <p style={{ fontSize: "0.82rem", margin: 0 }}>Loading conversations...</p>
                      </div>
                    ) : adminChats.length === 0 ? (
                      <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#94a3b8" }}>
                        <MessageSquare size={32} style={{ margin: "0 auto 0.75rem auto", display: "block", color: "#cbd5e1" }} />
                        <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b", margin: "0 0 0.25rem 0" }}>
                          No conversations found
                        </p>
                        <p style={{ fontSize: "0.75rem", margin: 0 }}>
                          Try adjusting your search criteria or type filter.
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {adminChats.map((conv) => {
                          const isSelected = selectedAdminConv?.id === conv.id;
                          const participantsStr = conv.participants?.map((p) => p.name).join(" & ") || "Unknown participants";

                          return (
                            <div
                              key={conv.id}
                              onClick={() => {
                                setSelectedAdminConv(conv);
                                fetchAdminChatConvDetail(conv.id);
                              }}
                              style={{
                                padding: "0.85rem 1rem",
                                borderBottom: "1px solid #f1f5f9",
                                cursor: "pointer",
                                transition: "background 0.15s ease",
                                background: isSelected ? "#f0fdfa" : "#fff",
                                borderLeft: isSelected ? "4px solid #0d9488" : "4px solid transparent",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                                <span
                                  style={{
                                    fontSize: "0.68rem",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    padding: "0.1rem 0.45rem",
                                    borderRadius: "4px",
                                    background:
                                      conv.type === "student_tutor"
                                        ? "#dcfce7"
                                        : conv.type === "tutor_admin"
                                        ? "#fef3c7"
                                        : conv.type === "parent_admin"
                                        ? "#f3e8ff"
                                        : conv.type === "student_admin"
                                        ? "#e0f2fe"
                                        : "#f1f5f9",
                                    color:
                                      conv.type === "student_tutor"
                                        ? "#15803d"
                                        : conv.type === "tutor_admin"
                                        ? "#b45309"
                                        : conv.type === "parent_admin"
                                        ? "#7e22ce"
                                        : conv.type === "student_admin"
                                        ? "#0369a1"
                                        : "#475569",
                                  }}
                                >
                                  {conv.type.replace(/_/g, " ")}
                                </span>

                                <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                                  {conv.last_message_at
                                    ? new Date(conv.last_message_at).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short",
                                      })
                                    : "No messages"}
                                </span>
                              </div>

                              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.2rem" }}>
                                {conv.subject || participantsStr}
                              </div>

                              <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "0.35rem" }}>
                                {conv.participants?.map((p) => (
                                  <span key={p.id} style={{ marginRight: "0.4rem" }}>
                                    <strong>{p.name}</strong> ({p.role})
                                  </span>
                                ))}
                              </div>

                              {conv.latest_message && (
                                <p
                                  style={{
                                    fontSize: "0.74rem",
                                    color: "#64748b",
                                    margin: "0 0 0.4rem 0",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <span style={{ fontWeight: 600, color: "#475569" }}>
                                    {conv.latest_message.sender_name}:
                                  </span>{" "}
                                  {conv.latest_message.body || (conv.latest_message.has_attachment ? "📎 Sent an attachment" : "")}
                                </p>
                              )}

                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.68rem", color: "#94a3b8" }}>
                                <span>ID: #{conv.id}</span>
                                {conv.messages_count !== undefined && (
                                  <span style={{ background: "#f1f5f9", padding: "0.1rem 0.45rem", borderRadius: "10px", fontWeight: 600 }}>
                                    {conv.messages_count} msgs
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Pagination Footer */}
                  {adminChatsLastPage > 1 && (
                    <div
                      style={{
                        padding: "0.65rem 1rem",
                        borderTop: "1px solid #f1f5f9",
                        background: "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <button
                        disabled={adminChatsPage <= 1 || adminChatsLoading}
                        onClick={() => fetchAdminChatConversations(adminChatsPage - 1)}
                        style={{
                          padding: "0.3rem 0.65rem",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          background: "#fff",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          cursor: adminChatsPage <= 1 ? "not-allowed" : "pointer",
                          color: adminChatsPage <= 1 ? "#94a3b8" : "#334155",
                        }}
                      >
                        Prev
                      </button>

                      <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                        {adminChatsPage} / {adminChatsLastPage}
                      </span>

                      <button
                        disabled={adminChatsPage >= adminChatsLastPage || adminChatsLoading}
                        onClick={() => fetchAdminChatConversations(adminChatsPage + 1)}
                        style={{
                          padding: "0.3rem 0.65rem",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          background: "#fff",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          cursor: adminChatsPage >= adminChatsLastPage ? "not-allowed" : "pointer",
                          color: adminChatsPage >= adminChatsLastPage ? "#94a3b8" : "#334155",
                        }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Panel: Conversation Detail & Messages Audit */}
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    overflow: "hidden",
                  }}
                >
                  {!selectedAdminConv ? (
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "3rem 2rem",
                        textAlign: "center",
                        color: "#94a3b8",
                      }}
                    >
                      <div
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "50%",
                          background: "#f0fdfa",
                          color: "#0d9488",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "1rem",
                        }}
                      >
                        <MessageSquare size={28} />
                      </div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", margin: "0 0 0.4rem 0" }}>
                        Select a Conversation
                      </h3>
                      <p style={{ fontSize: "0.8rem", color: "#64748b", maxWidth: "380px", margin: 0, lineHeight: 1.5 }}>
                        Choose any student-tutor or parent-admin conversation from the list to audit the entire message history, view shared worksheets, and review timestamps.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Conversation Header */}
                      <div
                        style={{
                          padding: "1rem 1.25rem",
                          borderBottom: "1px solid #e2e8f0",
                          background: "#f8fafc",
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.75rem",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                            <span
                              style={{
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                padding: "0.15rem 0.5rem",
                                borderRadius: "4px",
                                background:
                                  selectedAdminConv.type === "student_tutor"
                                    ? "#dcfce7"
                                    : selectedAdminConv.type === "tutor_admin"
                                    ? "#fef3c7"
                                    : selectedAdminConv.type === "parent_admin"
                                    ? "#f3e8ff"
                                    : selectedAdminConv.type === "student_admin"
                                    ? "#e0f2fe"
                                    : "#f1f5f9",
                                color:
                                  selectedAdminConv.type === "student_tutor"
                                    ? "#15803d"
                                    : selectedAdminConv.type === "tutor_admin"
                                    ? "#b45309"
                                    : selectedAdminConv.type === "parent_admin"
                                    ? "#7e22ce"
                                    : selectedAdminConv.type === "student_admin"
                                    ? "#0369a1"
                                    : "#475569",
                              }}
                            >
                              {selectedAdminConv.type.replace(/_/g, " ")}
                            </span>
                            <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0f172a" }}>
                              {selectedAdminConv.subject || `Conversation #${selectedAdminConv.id}`}
                            </span>
                          </div>

                          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.6rem", fontSize: "0.74rem", color: "#475569" }}>
                            {selectedAdminConv.participants?.map((p) => (
                              <span
                                key={p.id}
                                style={{
                                  background: "#fff",
                                  border: "1px solid #e2e8f0",
                                  borderRadius: "6px",
                                  padding: "0.2rem 0.5rem",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.3rem",
                                }}
                              >
                                <strong>{p.name}</strong>
                                <span style={{ color: "#64748b" }}>({p.role})</span>
                                {p.email && <span style={{ color: "#94a3b8", fontSize: "0.68rem" }}>• {p.email}</span>}
                              </span>
                            ))}

                            {selectedAdminConv.lesson_session_id && (
                              <span
                                style={{
                                  background: "#fef3c7",
                                  color: "#b45309",
                                  border: "1px solid #fde68a",
                                  borderRadius: "6px",
                                  padding: "0.2rem 0.5rem",
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                }}
                              >
                                Session #{selectedAdminConv.lesson_session_id}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => fetchAdminChatConvDetail(selectedAdminConv.id)}
                          disabled={adminConvLoading}
                          title="Reload messages"
                          style={{
                            padding: "0.4rem 0.75rem",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            background: "#fff",
                            fontSize: "0.74rem",
                            fontWeight: 600,
                            color: "#334155",
                            cursor: adminConvLoading ? "not-allowed" : "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                          }}
                        >
                          <RefreshCw size={13} className={adminConvLoading ? "spin" : ""} />
                          Refresh
                        </button>
                      </div>

                      {/* Messages Thread */}
                      <div
                        style={{
                          flex: 1,
                          overflowY: "auto",
                          padding: "1.25rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                          maxHeight: "550px",
                          background: "#fafafa",
                        }}
                      >
                        {adminConvLoading && adminConvMessages.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                            <RefreshCw size={24} className="spin" style={{ margin: "0 auto 0.75rem auto", display: "block" }} />
                            <p style={{ fontSize: "0.82rem", margin: 0 }}>Loading message history...</p>
                          </div>
                        ) : adminConvMessages.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                            <p style={{ fontSize: "0.84rem", margin: 0 }}>No messages found in this conversation.</p>
                          </div>
                        ) : (
                          adminConvMessages.map((msg) => {
                            const isTutor = msg.sender?.role === "tutor";
                            const isStudent = msg.sender?.role === "student";

                            return (
                              <div
                                key={msg.id}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignSelf: isTutor ? "flex-end" : "flex-start",
                                  maxWidth: "80%",
                                }}
                              >
                                {/* Sender Meta */}
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.4rem",
                                    fontSize: "0.72rem",
                                    color: "#64748b",
                                    marginBottom: "0.25rem",
                                    alignSelf: isTutor ? "flex-end" : "flex-start",
                                  }}
                                >
                                  <span style={{ fontWeight: 700, color: "#1e293b" }}>
                                    {msg.sender?.name || "Participant"}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "0.64rem",
                                      fontWeight: 700,
                                      padding: "0.05rem 0.35rem",
                                      borderRadius: "4px",
                                      background: isTutor ? "#ccfbf1" : isStudent ? "#e0e7ff" : "#f1f5f9",
                                      color: isTutor ? "#0f766e" : isStudent ? "#3730a3" : "#475569",
                                    }}
                                  >
                                    {msg.sender?.role || "user"}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    {msg.created_at_human ||
                                      (msg.created_at
                                        ? new Date(msg.created_at).toLocaleTimeString("en-GB", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            day: "numeric",
                                            month: "short",
                                          })
                                        : "")}
                                  </span>
                                  {msg.edited_at && (
                                    <span style={{ fontStyle: "italic", color: "#94a3b8" }}>(edited)</span>
                                  )}
                                </div>

                                {/* Message Bubble */}
                                <div
                                  style={{
                                    padding: "0.75rem 1rem",
                                    borderRadius: "10px",
                                    fontSize: "0.82rem",
                                    lineHeight: 1.5,
                                    background: msg.is_deleted
                                      ? "#fef2f2"
                                      : isTutor
                                      ? "#f0fdfa"
                                      : "#ffffff",
                                    border: msg.is_deleted
                                      ? "1px dashed #fca5a5"
                                      : isTutor
                                      ? "1px solid #ccfbf1"
                                      : "1px solid #e2e8f0",
                                    color: msg.is_deleted ? "#991b1b" : "#1e293b",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                                  }}
                                >
                                  {msg.is_deleted ? (
                                    <div style={{ fontStyle: "italic", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                                      <AlertCircle size={14} color="#ef4444" />
                                      This message was deleted by the sender
                                      {msg.deleted_at && ` at ${new Date(msg.deleted_at).toLocaleTimeString("en-GB")}`}
                                    </div>
                                  ) : (
                                    <>
                                      {msg.body && (
                                        <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                          {msg.body}
                                        </div>
                                      )}

                                      {/* Attachment */}
                                      {msg.attachment_url && (
                                        <div style={{ marginTop: msg.body ? "0.6rem" : "0" }}>
                                          <a
                                            href={msg.attachment_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                              display: "inline-flex",
                                              alignItems: "center",
                                              gap: "0.4rem",
                                              padding: "0.45rem 0.75rem",
                                              borderRadius: "6px",
                                              background: "#ffffff",
                                              border: "1px solid #cbd5e1",
                                              color: "#0d9488",
                                              fontSize: "0.75rem",
                                              fontWeight: 600,
                                              textDecoration: "none",
                                            }}
                                          >
                                            <Paperclip size={14} />
                                            <span>{msg.attachment_name || "Attachment"}</span>
                                            <ExternalLink size={12} color="#94a3b8" />
                                          </a>
                                        </div>
                                      )}

                                      {/* Reactions (if any) */}
                                      {msg.reactions && Array.isArray(msg.reactions) && msg.reactions.length > 0 && (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.5rem" }}>
                                          {msg.reactions.map((r: any, rIdx: number) => (
                                            <span
                                              key={rIdx}
                                              style={{
                                                fontSize: "0.72rem",
                                                background: "#f1f5f9",
                                                border: "1px solid #e2e8f0",
                                                borderRadius: "12px",
                                                padding: "0.1rem 0.4rem",
                                              }}
                                            >
                                              {r.emoji || r}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Admin Message Compose Form */}
                      <form
                        onSubmit={submitAdminMessageReply}
                        style={{
                          padding: "0.75rem 1rem",
                          borderTop: "1px solid #e2e8f0",
                          background: "#fff",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        {adminReplyAttachment && (
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.4rem",
                              background: "#f1f5f9",
                              border: "1px solid #e2e8f0",
                              borderRadius: "6px",
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.74rem",
                              color: "#334155",
                              width: "fit-content",
                            }}
                          >
                            <Paperclip size={13} color="#0d9488" />
                            <span style={{ maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {adminReplyAttachment.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => setAdminReplyAttachment(null)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center" }}
                            >
                              <X size={13} />
                            </button>
                          </div>
                        )}

                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <input
                            type="text"
                            placeholder="Send a direct message in this thread as Admin..."
                            value={adminReplyText}
                            onChange={(e) => setAdminReplyText(e.target.value)}
                            style={{
                              flex: 1,
                              padding: "0.5rem 0.85rem",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              fontSize: "0.8rem",
                              background: "#f8fafc",
                              color: "#0f172a",
                              outline: "none",
                            }}
                          />

                          <label
                            style={{
                              padding: "0.5rem 0.65rem",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              background: "#fff",
                              color: "#64748b",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            title="Attach File or Document"
                          >
                            <Paperclip size={15} />
                            <input
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setAdminReplyAttachment(e.target.files[0]);
                                }
                              }}
                            />
                          </label>

                          <button
                            type="submit"
                            disabled={isSendingAdminReply || (!adminReplyText.trim() && !adminReplyAttachment)}
                            style={{
                              padding: "0.5rem 0.95rem",
                              borderRadius: "8px",
                              border: "none",
                              background: (!adminReplyText.trim() && !adminReplyAttachment) || isSendingAdminReply ? "#94a3b8" : "#0d9488",
                              color: "#fff",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              cursor: (!adminReplyText.trim() && !adminReplyAttachment) || isSendingAdminReply ? "not-allowed" : "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.35rem",
                            }}
                          >
                            <Send size={13} />
                            {isSendingAdminReply ? "Sending..." : "Send"}
                          </button>
                        </div>
                      </form>

                      {/* Audit Mode Footer Notice */}
                      <div
                        style={{
                          padding: "0.75rem 1.25rem",
                          borderTop: "1px solid #e2e8f0",
                          background: "#f8fafc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: "0.72rem",
                          color: "#64748b",
                        }}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                          <ShieldCheck size={14} color="#0d9488" />
                          <strong>Administrator Audit Mode</strong> — All conversations and attachments are logged for platform safety.
                        </span>
                        <span>{adminConvMessages.length} total messages</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
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
                  <select
                    required
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
                      backgroundColor: "#fff",
                      color: "#1e293b",
                    }}
                  >
                    <option value="">— Select qualification —</option>
                    {QUALIFICATIONS_LIST.map((q) => (
                      <option key={q.code} value={q.code}>
                        {q.code} — {q.name}
                      </option>
                    ))}
                  </select>
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
                  Years of Experience <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 400 }}>(Optional, numbers only)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  step="1"
                  placeholder="e.g. 5"
                  value={enrollTutorForm.years_of_experience}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setEnrollTutorForm({ ...enrollTutorForm, years_of_experience: val });
                  }}
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
                    background: isEnrollingTutor ? "#94a3b8" : "linear-gradient(135deg,#20b2a4,#0d9488)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    cursor: isEnrollingTutor ? "not-allowed" : "pointer",
                    pointerEvents: isEnrollingTutor ? "none" : "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.45rem",
                    boxShadow: isEnrollingTutor ? "none" : "0 4px 12px rgba(32,178,164,0.3)",
                    opacity: isEnrollingTutor ? 0.7 : 1,
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
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.6rem", flexShrink: 0, boxShadow: "0 4px 12px rgba(32,178,164,0.3)", overflow: "hidden" }}>
                  {(selectedTutor.tutor_profile?.profile_photo_url || selectedTutor.tutor_profile?.photo || (selectedTutor as any).profile_photo_url || (selectedTutor as any).photo) ? (
                    <img src={(selectedTutor.tutor_profile?.profile_photo_url || selectedTutor.tutor_profile?.photo || (selectedTutor as any).profile_photo_url || (selectedTutor as any).photo) as string} alt={selectedTutor.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    selectedTutor.name?.charAt(0) || "T"
                  )}
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

                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => openEditTutorModal(selectedTutor)}
                    title="Edit Tutor Details (PUT /api/admin/tutors/{id})"
                    style={{
                      background: "#fff",
                      border: "1.5px solid #20b2a4",
                      color: "#0d9488",
                      borderRadius: "8px",
                      padding: "0.35rem 0.75rem",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Edit3 size={13} /> Edit Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => openVerifyPublicModal(selectedTutor)}
                    title="Verify Public Profile & Photo (PATCH /api/admin/tutors/{id}/verify-public)"
                    style={{
                      background: "#eff6ff",
                      border: "1.5px solid #93c5fd",
                      color: "#1d4ed8",
                      borderRadius: "8px",
                      padding: "0.35rem 0.75rem",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Globe size={13} /> Public Verify
                  </button>
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

              {/* Public Website Display & Verification Status */}
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Globe size={16} color="#0284c7" />
                    <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1e293b", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Public Website &amp; Directory Status
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => openVerifyPublicModal(selectedTutor)}
                    style={{
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      color: "#1d4ed8",
                      borderRadius: "6px",
                      padding: "0.25rem 0.6rem",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <Edit3 size={12} /> Manage Verification
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.6rem", marginBottom: "0.6rem" }}>
                  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.55rem 0.75rem" }}>
                    <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 600 }}>Public Visibility</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.2rem" }}>
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: (selectedTutor.tutor_profile?.is_public ?? selectedTutor.is_public) ? "#16a34a" : "#94a3b8",
                        }}
                      />
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: (selectedTutor.tutor_profile?.is_public ?? selectedTutor.is_public) ? "#15803d" : "#64748b" }}>
                        {(selectedTutor.tutor_profile?.is_public ?? selectedTutor.is_public) ? "Live on Public Website" : "Hidden from Public"}
                      </span>
                    </div>
                  </div>

                  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.55rem 0.75rem" }}>
                    <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 600 }}>Photo Verification</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.2rem" }}>
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: (selectedTutor.tutor_profile?.is_photo_verified ?? selectedTutor.is_photo_verified) ? "#0284c7" : "#eab308",
                        }}
                      />
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: (selectedTutor.tutor_profile?.is_photo_verified ?? selectedTutor.is_photo_verified) ? "#0369a1" : "#a16207" }}>
                        {(selectedTutor.tutor_profile?.is_photo_verified ?? selectedTutor.is_photo_verified) ? "Photo Approved & Verified" : "Photo Pending Verification"}
                      </span>
                    </div>
                  </div>
                </div>

                {(selectedTutor.tutor_profile?.public_headline || selectedTutor.public_headline) && (
                  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.55rem 0.75rem" }}>
                    <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 600, marginBottom: "0.2rem" }}>Public Headline</div>
                    <div style={{ fontSize: "0.78rem", color: "#1e293b", fontStyle: "italic" }}>
                      &ldquo;{selectedTutor.tutor_profile?.public_headline || selectedTutor.public_headline}&rdquo;
                    </div>
                  </div>
                )}
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
                      disabled={processingApplicantIds.has(String(selectedTutor.id))}
                      style={{
                        padding: "0.55rem 1rem",
                        background: processingApplicantIds.has(String(selectedTutor.id)) ? "#94a3b8" : "linear-gradient(135deg,#20b2a4,#0d9488)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        cursor: processingApplicantIds.has(String(selectedTutor.id)) ? "not-allowed" : "pointer",
                        pointerEvents: processingApplicantIds.has(String(selectedTutor.id)) ? "none" : "auto",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <CheckCircle2 size={14} /> Approve &amp; Onboard
                    </button>
                    <button
                      onClick={() => {
                        declineApplicant(String(selectedTutor.id));
                        setIsDetailOpen(false);
                      }}
                      disabled={processingApplicantIds.has(String(selectedTutor.id))}
                      style={{
                        padding: "0.55rem 0.9rem",
                        background: "#fee2e2",
                        color: "#991b1b",
                        border: "1px solid #fca5a5",
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        cursor: processingApplicantIds.has(String(selectedTutor.id)) ? "not-allowed" : "pointer",
                        pointerEvents: processingApplicantIds.has(String(selectedTutor.id)) ? "none" : "auto",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <XCircle size={14} /> Decline
                    </button>
                  </>
                )}
                {selectedTutor.tutor_profile?.approval_status === "approved" && (
                  <>
                    <button
                      onClick={() => {
                        openTutorPayoutModal(selectedTutor);
                      }}
                      style={{
                        padding: "0.55rem 0.95rem",
                        background: "#ecfdf5",
                        color: "#047857",
                        border: "1px solid #a7f3d0",
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <DollarSign size={14} /> Rate &amp; Payouts
                    </button>
                    <button
                      onClick={() => {
                        removeTutor(String(selectedTutor.id));
                        setIsDetailOpen(false);
                      }}
                      style={{ padding: "0.55rem 0.9rem", background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5", borderRadius: "8px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                    >
                      <Trash2 size={14} /> Remove from Roster
                    </button>
                  </>
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
              maxWidth: "750px",
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

            {/* Sub-tab Navigation */}
            <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", background: "#f8fafc", padding: "0 1.5rem" }}>
              {[
                { id: "overview", label: "Dossier & Profile", icon: <Users size={15} /> },
                { id: "assignments", label: "Assignments", icon: <BookOpen size={15} />, count: studentAssignments.length },
                { id: "activity", label: "Activity Timeline", icon: <Activity size={15} />, count: studentActivities.length },
              ].map((tab) => {
                const isActive = studentModalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setStudentModalTab(tab.id as any);
                      if (tab.id === "assignments" && studentAssignments.length === 0) {
                        fetchStudentAssignments(selectedStudent.id, studentAssignmentStatusFilter);
                      }
                      if (tab.id === "activity" && studentActivities.length === 0) {
                        fetchStudentActivity(selectedStudent.id, studentActivityTypeFilter);
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      padding: "0.85rem 1rem",
                      background: "transparent",
                      border: "none",
                      borderBottom: isActive ? "2.5px solid #20b2a4" : "2.5px solid transparent",
                      color: isActive ? "#0f172a" : "#64748b",
                      fontWeight: isActive ? 700 : 600,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      position: "relative",
                      bottom: "-1px",
                    }}
                  >
                    <span style={{ color: isActive ? "#0d9488" : "#94a3b8" }}>{tab.icon}</span>
                    <span>{tab.label}</span>
                    {typeof tab.count === "number" && tab.count > 0 && (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          padding: "0.1rem 0.45rem",
                          borderRadius: "10px",
                          background: isActive ? "#ccfbf1" : "#e2e8f0",
                          color: isActive ? "#0f766e" : "#475569",
                        }}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Body */}
            {studentModalTab === "overview" && (
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {/* Status Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div>
                  <div style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>Matching Status</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", textTransform: "capitalize" }}>
                    {selectedStudent.status ? selectedStudent.status.replace("_", " ") : "Pending Match"}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "0.25rem 0.65rem",
                    borderRadius: "20px",
                    background: selectedStudent.status === "matched" ? "#d1fae5" : selectedStudent.status === "completed" ? "#e0f2fe" : selectedStudent.status === "cancelled" ? "#fee2e2" : "#fef3c7",
                    color: selectedStudent.status === "matched" ? "#065f46" : selectedStudent.status === "completed" ? "#0369a1" : selectedStudent.status === "cancelled" ? "#991b1b" : "#b45309",
                    border: "1px solid rgba(0,0,0,0.06)",
                    textTransform: "capitalize",
                  }}
                >
                  {selectedStudent.status ? selectedStudent.status.replace("_", " ") : "Pending Match"}
                </span>
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

              {/* Lesson & Progress Reports for Student */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Lesson &amp; Progress Reports ({studentReports.length})
                  </h4>
                  {studentReportsLoading && <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Loading reports...</span>}
                </div>

                {studentReportsLoading ? (
                  <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "8px", textAlign: "center", color: "#64748b", fontSize: "0.8rem" }}>
                    Loading student reports...
                  </div>
                ) : studentReports.length === 0 ? (
                  <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "8px", padding: "1rem", textAlign: "center", color: "#64748b", fontSize: "0.8rem" }}>
                    No lesson reports submitted for this student yet.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {studentReports.map((sr) => (
                      <div
                        key={sr.id}
                        style={{
                          background: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          padding: "0.75rem 0.9rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.4rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                          <div>
                            <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.82rem" }}>{sr.subject}</span>
                            <span style={{ fontSize: "0.74rem", color: "#64748b", marginLeft: "0.5rem" }}>📅 {sr.date}</span>
                            {sr.tutor?.name && <span style={{ fontSize: "0.74rem", color: "#0d9488", marginLeft: "0.5rem" }}>• Tutor: {sr.tutor.name}</span>}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ fontSize: "0.75rem", color: "#f59e0b", fontWeight: 700 }}>
                              {"★".repeat(Math.min(5, Math.max(1, Number(sr.student_engagement) || 5)))} {sr.student_engagement}/5
                            </span>
                            <button
                              onClick={() => setSelectedReportDetail(sr)}
                              style={{
                                padding: "0.25rem 0.55rem",
                                background: "#f0fdf9",
                                border: "1px solid #99f6e4",
                                color: "#0d9488",
                                borderRadius: "4px",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              Full Report
                            </button>
                          </div>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#334155" }}>
                          <span style={{ fontWeight: 600, color: "#475569" }}>Topics:</span> {sr.topics_covered}
                        </div>
                        {sr.notes_for_parents && (
                          <div style={{ fontSize: "0.74rem", color: "#0369a1", background: "#f0f9ff", padding: "0.35rem 0.6rem", borderRadius: "4px" }}>
                            💬 {sr.notes_for_parents}
                          </div>
                        )}
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
            )}

            {/* Assignments Tab */}
            {studentModalTab === "assignments" && (
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {/* Summary Cards */}
                {studentAssignmentsSummary && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "0.6rem" }}>
                    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.75rem 0.85rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Total</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginTop: "0.15rem" }}>
                        {studentAssignmentsSummary.total ?? 0}
                      </div>
                    </div>
                    <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", padding: "0.75rem 0.85rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#2563eb", textTransform: "uppercase" }}>Assigned</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1d4ed8", marginTop: "0.15rem" }}>
                        {studentAssignmentsSummary.assigned ?? 0}
                      </div>
                    </div>
                    <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: "10px", padding: "0.75rem 0.85rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#b45309", textTransform: "uppercase" }}>Submitted</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#92400e", marginTop: "0.15rem" }}>
                        {studentAssignmentsSummary.submitted ?? 0}
                      </div>
                    </div>
                    <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "10px", padding: "0.75rem 0.85rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#047857", textTransform: "uppercase" }}>Graded</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#065f46", marginTop: "0.15rem" }}>
                        {studentAssignmentsSummary.graded ?? 0}
                      </div>
                    </div>
                    <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "10px", padding: "0.75rem 0.85rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#b91c1c", textTransform: "uppercase" }}>Overdue</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#991b1b", marginTop: "0.15rem" }}>
                        {studentAssignmentsSummary.overdue ?? 0}
                      </div>
                    </div>
                  </div>
                )}

                {/* Filter & Refresh Bar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.6rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#475569" }}>Status:</span>
                    <select
                      value={studentAssignmentStatusFilter}
                      onChange={(e) => {
                        const s = e.target.value;
                        setStudentAssignmentStatusFilter(s);
                        fetchStudentAssignments(selectedStudent.id, s);
                      }}
                      style={{
                        padding: "0.35rem 0.65rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "#0f172a",
                        outline: "none",
                        background: "#fff",
                      }}
                    >
                      <option value="all">All Statuses</option>
                      <option value="assigned">Assigned</option>
                      <option value="submitted">Submitted</option>
                      <option value="graded">Graded</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>

                  <button
                    onClick={() => fetchStudentAssignments(selectedStudent.id, studentAssignmentStatusFilter)}
                    disabled={studentAssignmentsLoading}
                    style={{
                      background: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      padding: "0.35rem 0.65rem",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      color: "#475569",
                      cursor: studentAssignmentsLoading ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <RefreshCw size={12} className={studentAssignmentsLoading ? "spin" : ""} /> Refresh
                  </button>
                </div>

                {/* Assignments List */}
                {studentAssignmentsLoading ? (
                  <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#64748b" }}>
                    <div style={{ width: "24px", height: "24px", border: "2.5px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 0.6rem" }} />
                    <span style={{ fontSize: "0.82rem" }}>Loading homework assignments…</span>
                  </div>
                ) : studentAssignments.length === 0 ? (
                  <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "10px", padding: "2.5rem 1.5rem", textAlign: "center" }}>
                    <BookOpen size={34} color="#cbd5e1" style={{ margin: "0 auto 0.6rem", display: "block" }} />
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#475569" }}>No homework assignments found</div>
                    <div style={{ fontSize: "0.76rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                      Assignments given by tutors to this student will appear here.
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {studentAssignments.map((a) => {
                      const isOverdue = a.is_overdue || a.status === "overdue";
                      const statusColor =
                        a.status === "graded"
                          ? { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" }
                          : a.status === "submitted"
                          ? { bg: "#fef3c7", color: "#b45309", border: "#fde68a" }
                          : isOverdue
                          ? { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" }
                          : { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" };

                      return (
                        <div
                          key={a.id}
                          style={{
                            background: "#fff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            padding: "0.9rem 1rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.55rem",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
                                <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0f172a" }}>{a.title}</span>
                                <span
                                  style={{
                                    fontSize: "0.68rem",
                                    fontWeight: 700,
                                    padding: "0.15rem 0.5rem",
                                    borderRadius: "12px",
                                    background: statusColor.bg,
                                    color: statusColor.color,
                                    border: `1px solid ${statusColor.border}`,
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {isOverdue && a.status !== "graded" ? "Overdue" : a.status}
                                </span>
                              </div>
                              {a.tutor?.name && (
                                <div style={{ fontSize: "0.74rem", color: "#64748b", marginTop: "0.2rem" }}>
                                  Assigned by <strong style={{ color: "#0d9488" }}>{a.tutor.name}</strong>
                                </div>
                              )}
                            </div>

                            {a.grade !== null && a.grade !== undefined && (
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#059669" }}>
                                  {a.grade} <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>/ {a.max_points || 100}</span>
                                </div>
                                <div style={{ fontSize: "0.65rem", color: "#059669", fontWeight: 700, textTransform: "uppercase" }}>Graded</div>
                              </div>
                            )}
                          </div>

                          {a.description && (
                            <p style={{ margin: 0, fontSize: "0.78rem", color: "#334155", lineHeight: 1.5, background: "#f8fafc", padding: "0.45rem 0.65rem", borderRadius: "6px" }}>
                              {a.description}
                            </p>
                          )}

                          {/* Meta line: Due date & files */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", paddingTop: "0.3rem", borderTop: "1px solid #f1f5f9" }}>
                            <div style={{ fontSize: "0.72rem", color: isOverdue ? "#dc2626" : "#64748b", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                              <Clock size={12} />
                              <span>Due: {a.due_date_formatted || a.due_date || "No deadline"}</span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                              {a.file_url && (
                                <a
                                  href={a.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    fontSize: "0.72rem",
                                    color: "#0d9488",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                    background: "#f0fdf9",
                                    padding: "0.2rem 0.5rem",
                                    borderRadius: "4px",
                                    border: "1px solid #99f6e4",
                                  }}
                                >
                                  <Paperclip size={11} /> {a.file_name || "Attachment"}
                                </a>
                              )}
                              {a.latest_submission?.file_url && (
                                <a
                                  href={a.latest_submission.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    fontSize: "0.72rem",
                                    color: "#2563eb",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                    background: "#eff6ff",
                                    padding: "0.2rem 0.5rem",
                                    borderRadius: "4px",
                                    border: "1px solid #bfdbfe",
                                  }}
                                >
                                  <ExternalLink size={11} /> Submission File
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Feedback if graded */}
                          {a.feedback && (
                            <div style={{ fontSize: "0.74rem", color: "#065f46", background: "#f0fdf4", borderLeft: "2.5px solid #10b981", padding: "0.35rem 0.6rem", borderRadius: "4px" }}>
                              <strong>Feedback:</strong> {a.feedback}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Activity Timeline Tab */}
            {studentModalTab === "activity" && (
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {/* Activity Summary Metrics */}
                {studentActivitySummary && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.6rem" }}>
                    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.75rem 0.85rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Total Events</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginTop: "0.15rem" }}>
                        {studentActivitySummary.total_activities ?? 0}
                      </div>
                    </div>
                    <div style={{ background: "#f0fdf9", border: "1px solid #a7f3d0", borderRadius: "10px", padding: "0.75rem 0.85rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#0d9488", textTransform: "uppercase" }}>Sessions</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#065f46", marginTop: "0.15rem" }}>
                        {studentActivitySummary.completed_sessions ?? 0} / {studentActivitySummary.total_sessions ?? 0}
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "#64748b" }}>completed</div>
                    </div>
                    <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", padding: "0.75rem 0.85rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#2563eb", textTransform: "uppercase" }}>Assignments</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1d4ed8", marginTop: "0.15rem" }}>
                        {studentActivitySummary.completed_assignments ?? 0} / {studentActivitySummary.total_assignments ?? 0}
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "#64748b" }}>completed</div>
                    </div>
                    <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: "10px", padding: "0.75rem 0.85rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" }}>Reports</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#6d28d9", marginTop: "0.15rem" }}>
                        {studentActivitySummary.total_reports ?? 0}
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "#64748b" }}>filed</div>
                    </div>
                  </div>
                )}

                {/* Filter & Refresh Bar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.6rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#475569" }}>Category:</span>
                    <select
                      value={studentActivityTypeFilter}
                      onChange={(e) => {
                        const t = e.target.value;
                        setStudentActivityTypeFilter(t);
                        fetchStudentActivity(selectedStudent.id, t);
                      }}
                      style={{
                        padding: "0.35rem 0.65rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "#0f172a",
                        outline: "none",
                        background: "#fff",
                      }}
                    >
                      <option value="all">All Activities</option>
                      <option value="session">Sessions</option>
                      <option value="assignment">Assignments</option>
                      <option value="report">Reports</option>
                      <option value="attendance">Attendance</option>
                      <option value="account">Account</option>
                    </select>
                  </div>

                  <button
                    onClick={() => fetchStudentActivity(selectedStudent.id, studentActivityTypeFilter)}
                    disabled={studentActivitiesLoading}
                    style={{
                      background: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      padding: "0.35rem 0.65rem",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      color: "#475569",
                      cursor: studentActivitiesLoading ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <RefreshCw size={12} className={studentActivitiesLoading ? "spin" : ""} /> Refresh
                  </button>
                </div>

                {/* Activities Timeline Stream */}
                {studentActivitiesLoading ? (
                  <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#64748b" }}>
                    <div style={{ width: "24px", height: "24px", border: "2.5px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 0.6rem" }} />
                    <span style={{ fontSize: "0.82rem" }}>Loading activity timeline…</span>
                  </div>
                ) : studentActivities.length === 0 ? (
                  <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "10px", padding: "2.5rem 1.5rem", textAlign: "center" }}>
                    <Activity size={34} color="#cbd5e1" style={{ margin: "0 auto 0.6rem", display: "block" }} />
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#475569" }}>No activities recorded</div>
                    <div style={{ fontSize: "0.76rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                      Sessions, assignments, reports, and attendance events will be tracked here chronologically.
                    </div>
                  </div>
                ) : (
                  <div style={{ position: "relative", paddingLeft: "1.25rem" }}>
                    {/* Vertical timeline line */}
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        bottom: "12px",
                        left: "6px",
                        width: "2px",
                        background: "#e2e8f0",
                      }}
                    />

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {studentActivities.map((act, idx) => {
                        const iconBg =
                          act.type === "session"
                            ? "#0284c7"
                            : act.type === "assignment"
                            ? "#20b2a4"
                            : act.type === "report"
                            ? "#8b5cf6"
                            : act.type === "account"
                            ? "#f59e0b"
                            : "#64748b";

                        return (
                          <div key={act.id || idx} style={{ position: "relative" }}>
                            {/* Dot on line */}
                            <div
                              style={{
                                position: "absolute",
                                left: "-1.25rem",
                                top: "4px",
                                width: "14px",
                                height: "14px",
                                borderRadius: "50%",
                                background: iconBg,
                                border: "2px solid #fff",
                                boxShadow: "0 0 0 2px rgba(0,0,0,0.06)",
                              }}
                            />

                            <div
                              style={{
                                background: "#fff",
                                border: "1px solid #e2e8f0",
                                borderRadius: "10px",
                                padding: "0.75rem 0.95rem",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.35rem",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.4rem" }}>
                                <span style={{ fontWeight: 800, fontSize: "0.84rem", color: "#0f172a" }}>{act.title}</span>
                                <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600 }}>
                                  {act.date_formatted || (act.timestamp ? new Date(act.timestamp).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "")}
                                </span>
                              </div>

                              <p style={{ margin: 0, fontSize: "0.77rem", color: "#475569", lineHeight: 1.5 }}>
                                {act.description}
                              </p>

                              {/* Metadata tags if present */}
                              {act.meta && (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.2rem" }}>
                                  {act.meta.meeting_link && (
                                    <a
                                      href={act.meta.meeting_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        fontSize: "0.7rem",
                                        color: "#0284c7",
                                        fontWeight: 700,
                                        textDecoration: "none",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.25rem",
                                        background: "#eff6ff",
                                        padding: "0.15rem 0.45rem",
                                        borderRadius: "4px",
                                        border: "1px solid #bfdbfe",
                                      }}
                                    >
                                      <Video size={10} /> Meeting Room
                                    </a>
                                  )}
                                  {act.meta.file_url && (
                                    <a
                                      href={act.meta.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        fontSize: "0.7rem",
                                        color: "#0d9488",
                                        fontWeight: 700,
                                        textDecoration: "none",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.25rem",
                                        background: "#f0fdf9",
                                        padding: "0.15rem 0.45rem",
                                        borderRadius: "4px",
                                        border: "1px solid #99f6e4",
                                      }}
                                    >
                                      <Paperclip size={10} /> {act.meta.file_name || "Attachment"}
                                    </a>
                                  )}
                                  {act.meta.status && (
                                    <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "10px", background: "#f1f5f9", color: "#475569", textTransform: "capitalize" }}>
                                      {act.meta.status}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                  onClick={() => {
                    openOnboardGuardianModal(selectedStudent);
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                  }}
                >
                  <ShieldCheck size={14} /> Onboard Guardian
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
                  {[4, 8, 12, 26, 52].map((w) => (
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
                      {w >= 52 ? "1yr" : w >= 26 ? "6m" : `+${w}w`}
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
                                  title="Join this recurring lesson room"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.4rem",
                                    fontSize: "0.74rem",
                                    color: "#fff",
                                    background: "linear-gradient(135deg,#16a34a,#15803d)",
                                    padding: "0.32rem 0.75rem",
                                    borderRadius: "7px",
                                    textDecoration: "none",
                                    fontWeight: 700,
                                    boxShadow: "0 2px 8px rgba(22,163,74,0.3)",
                                  }}
                                >
                                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#bbf7d0", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                                  <Video size={13} /> Join Meeting Room <ExternalLink size={11} />
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
                                  title="Join this session's meeting room"
                                  style={{
                                    padding: "0.38rem 0.8rem",
                                    background: isScheduled ? "linear-gradient(135deg,#16a34a,#15803d)" : "#f0f9ff",
                                    border: isScheduled ? "none" : "1px solid #bae6fd",
                                    color: isScheduled ? "#fff" : "#0284c7",
                                    borderRadius: "7px",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.4rem",
                                    boxShadow: isScheduled ? "0 2px 8px rgba(22,163,74,0.35)" : "none",
                                  }}
                                >
                                  {isScheduled && (
                                    <span style={{
                                      width: "7px",
                                      height: "7px",
                                      borderRadius: "50%",
                                      background: "#bbf7d0",
                                      display: "inline-block",
                                      animation: "pulse 1.5s infinite",
                                    }} />
                                  )}
                                  <Video size={13} />
                                  {isScheduled ? "Join Meeting" : "View Meeting Link"}
                                  <ExternalLink size={11} />
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
                        <option value={16}>Next 16 Weeks</option>
                        <option value={20}>Next 20 Weeks</option>
                        <option value={26}>Next 26 Weeks (6 Months)</option>
                        <option value={39}>Next 39 Weeks (9 Months)</option>
                        <option value={52}>Next 52 Weeks (1 Year)</option>
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

      {/* ── Temporary Credentials Modal (Admin POST /api/admin/tutors/enroll) ── */}
      {temporaryCredentialsModal && (
        <div
          onClick={() => setTemporaryCredentialsModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.75)",
            backdropFilter: "blur(5px)",
            zIndex: 1100,
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
              maxWidth: "520px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}
          >
            <div style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)", padding: "1.25rem 1.5rem", color: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Key size={22} />
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>Tutor Enrolled — Temporary Credentials</h3>
              </div>
              <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "#e0f2fe" }}>
                Auto-generated credentials for {temporaryCredentialsModal.name}
              </p>
            </div>

            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "#fffbeb", border: "1px solid #fef3c7", padding: "0.85rem", borderRadius: "8px", fontSize: "0.8rem", color: "#92400e" }}>
                ⚠️ Automated welcome email was queued or needs direct handoff. Please copy and provide these temporary credentials to the tutor:
              </div>

              <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Tutor Email / Username</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>{temporaryCredentialsModal.email}</div>
                </div>

                {temporaryCredentialsModal.temporary_password && (
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Temporary Password</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.2rem" }}>
                      <code style={{ fontSize: "1rem", fontWeight: 800, color: "#0284c7", background: "#e0f2fe", padding: "0.3rem 0.65rem", borderRadius: "6px", letterSpacing: "0.05em" }}>
                        {temporaryCredentialsModal.temporary_password}
                      </code>
                      <button
                        onClick={() => {
                          if (temporaryCredentialsModal.temporary_password) {
                            navigator.clipboard.writeText(temporaryCredentialsModal.temporary_password);
                            showToast("Temporary password copied to clipboard!");
                          }
                        }}
                        style={{
                          padding: "0.4rem 0.8rem",
                          background: "#0284c7",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <Copy size={13} /> Copy Password
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>
                • The tutor will be automatically prompted to set a new password upon first login (`must_change_password`).
              </p>
            </div>

            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setTemporaryCredentialsModal(null)}
                style={{
                  padding: "0.55rem 1.35rem",
                  background: "#0f172a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Close &amp; Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Lesson Report Detail Modal ── */}
      {selectedReportDetail && (
        <div
          onClick={() => setSelectedReportDetail(null)}
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
            <div style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)", padding: "1.25rem 1.5rem", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#99f6e4", fontWeight: 700 }}>
                  Lesson Session Report #{selectedReportDetail.id}
                </div>
                <h3 style={{ margin: "0.2rem 0 0", fontSize: "1.1rem", fontWeight: 800 }}>
                  {selectedReportDetail.subject} — {selectedReportDetail.student?.student_name || `Student #${selectedReportDetail.student_id}`}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReportDetail(null)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "1.25rem 1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
              {/* Quick Info Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem", background: "#f8fafc", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div>
                  <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700 }}>SESSION DATE</div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a" }}>{selectedReportDetail.date}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700 }}>ATTENDANCE</div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: selectedReportDetail.attendance_status === "present" ? "#065f46" : "#b45309", textTransform: "capitalize" }}>
                    {selectedReportDetail.attendance_status}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700 }}>ENGAGEMENT</div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#f59e0b" }}>
                    {"★".repeat(Math.min(5, Math.max(1, Number(selectedReportDetail.student_engagement) || 5)))} ({selectedReportDetail.student_engagement}/5)
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700 }}>TUTOR</div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a" }}>{selectedReportDetail.tutor?.name || `ID #${selectedReportDetail.tutor_id}`}</div>
                </div>
              </div>

              {/* Topics Covered */}
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", marginBottom: "0.3rem" }}>Topics Covered</div>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "0.75rem 0.9rem", borderRadius: "8px", fontSize: "0.85rem", color: "#0f172a", lineHeight: 1.5 }}>
                  {selectedReportDetail.topics_covered || "No topics entered."}
                </div>
              </div>

              {/* Strengths & Areas for Improvement */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#065f46", textTransform: "uppercase", marginBottom: "0.3rem" }}>Strengths</div>
                  <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "0.65rem 0.8rem", borderRadius: "8px", fontSize: "0.82rem", color: "#065f46", lineHeight: 1.5 }}>
                    {selectedReportDetail.strengths || "None noted."}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9a3412", textTransform: "uppercase", marginBottom: "0.3rem" }}>Areas for Improvement</div>
                  <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", padding: "0.65rem 0.8rem", borderRadius: "8px", fontSize: "0.82rem", color: "#9a3412", lineHeight: 1.5 }}>
                    {selectedReportDetail.areas_for_improvement || "None noted."}
                  </div>
                </div>
              </div>

              {/* Homework Assigned */}
              {selectedReportDetail.homework_assigned && (
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0369a1", textTransform: "uppercase", marginBottom: "0.3rem" }}>Homework Assigned</div>
                  <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", padding: "0.75rem 0.9rem", borderRadius: "8px", fontSize: "0.82rem", color: "#0369a1", lineHeight: 1.5 }}>
                    📚 {selectedReportDetail.homework_assigned}
                  </div>
                </div>
              )}

              {/* Notes for Parents */}
              {selectedReportDetail.notes_for_parents && (
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", marginBottom: "0.3rem" }}>Notes for Parents</div>
                  <div style={{ background: "#fdf4ff", border: "1px solid #f0abfc", padding: "0.75rem 0.9rem", borderRadius: "8px", fontSize: "0.82rem", color: "#86198f", lineHeight: 1.5 }}>
                    💬 {selectedReportDetail.notes_for_parents}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "0.85rem 1.5rem", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setSelectedReportDetail(null)}
                style={{ padding: "0.5rem 1.25rem", background: "#0f172a", color: "#fff", border: "none", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Review Session Change Request Modal (PATCH /api/admin/change-requests/{id}) ── */}
      {reviewingRequest && (
        <div
          onClick={() => setReviewingRequest(null)}
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
            animation: "fadeUp 0.2s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "520px",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: reviewAction === "approve" ? "linear-gradient(135deg,#0d9488,#059669)" : "linear-gradient(135deg,#e11d48,#be123c)",
                padding: "1.25rem 1.5rem",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                {reviewAction === "approve" ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>
                    {reviewAction === "approve" ? "Approve Session Change Request" : "Decline Session Change Request"}
                  </h3>
                  <div style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.85)", marginTop: "0.15rem" }}>
                    Request #{reviewingRequest.id} • Session #{reviewingRequest.lesson_session_id}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setReviewingRequest(null)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submitReviewChangeRequest} style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Context card */}
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.85rem 1rem", display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>
                    {reviewingRequest.session?.student?.student_name || "Student"} • {reviewingRequest.session?.subject || "Subject"}
                  </span>
                  <span style={{
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "0.15rem 0.5rem",
                    borderRadius: "12px",
                    background: reviewingRequest.request_type === "reschedule" ? "#e0f2fe" : "#fee2e2",
                    color: reviewingRequest.request_type === "reschedule" ? "#0284c7" : "#b91c1c",
                    textTransform: "capitalize",
                  }}>
                    {reviewingRequest.request_type}
                  </span>
                </div>

                <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                  <strong>Original:</strong> 📅 {reviewingRequest.session?.date} • 🕒 {reviewingRequest.session?.start_time?.slice(0, 5)} - {reviewingRequest.session?.end_time?.slice(0, 5)}
                </div>

                {reviewingRequest.request_type === "reschedule" && reviewingRequest.proposed_date && (
                  <div style={{ fontSize: "0.75rem", color: "#0369a1", background: "#e0f2fe", padding: "0.35rem 0.6rem", borderRadius: "6px", fontWeight: 700 }}>
                    <strong>Proposed:</strong> 📅 {reviewingRequest.proposed_date} • 🕒 {reviewingRequest.proposed_start_time?.slice(0, 5)} {reviewingRequest.proposed_end_time ? `- ${reviewingRequest.proposed_end_time.slice(0, 5)}` : ""}
                  </div>
                )}

                <div style={{ fontSize: "0.76rem", color: "#475569" }}>
                  <strong>Tutor Reason:</strong> <span style={{ fontStyle: "italic" }}>"{reviewingRequest.reason}"</span>
                </div>
              </div>

              {/* Action Toggle */}
              <div>
                <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.35rem", textTransform: "uppercase" }}>
                  Decision Action
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewAction("approve");
                      if (!reviewNotes || reviewNotes === "Unable to accommodate this request.") {
                        setReviewNotes("Rescheduled as requested.");
                      }
                    }}
                    style={{
                      padding: "0.55rem 0.75rem",
                      borderRadius: "8px",
                      border: "1.5px solid",
                      borderColor: reviewAction === "approve" ? "#0d9488" : "#e2e8f0",
                      background: reviewAction === "approve" ? "#f0fdf9" : "#fff",
                      color: reviewAction === "approve" ? "#0f766e" : "#64748b",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <CheckCircle2 size={15} /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewAction("reject");
                      if (!reviewNotes || reviewNotes === "Rescheduled as requested.") {
                        setReviewNotes("Unable to accommodate this request.");
                      }
                    }}
                    style={{
                      padding: "0.55rem 0.75rem",
                      borderRadius: "8px",
                      border: "1.5px solid",
                      borderColor: reviewAction === "reject" ? "#e11d48" : "#e2e8f0",
                      background: reviewAction === "reject" ? "#fff1f2" : "#fff",
                      color: reviewAction === "reject" ? "#be123c" : "#64748b",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <XCircle size={15} /> Decline
                  </button>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.35rem", textTransform: "uppercase" }}>
                  Admin Notes / Feedback to Tutor &amp; Student
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="e.g. Rescheduled as requested / Calendar updated"
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "8px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.82rem",
                    fontFamily: "inherit",
                    resize: "none",
                    outline: "none",
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setReviewingRequest(null)}
                  style={{
                    padding: "0.55rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    color: "#475569",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  style={{
                    padding: "0.55rem 1.25rem",
                    borderRadius: "8px",
                    border: "none",
                    background: reviewAction === "approve" ? "linear-gradient(135deg,#0d9488,#059669)" : "linear-gradient(135deg,#e11d48,#be123c)",
                    color: "#fff",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: isSubmittingReview ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  }}
                >
                  {isSubmittingReview ? (
                    <>
                      <RefreshCw size={13} className="spin" /> Processing…
                    </>
                  ) : reviewAction === "approve" ? (
                    <>
                      <CheckCircle2 size={14} /> Approve Request
                    </>
                  ) : (
                    <>
                      <XCircle size={14} /> Decline Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Tutor Hourly Rate & Monthly Payouts Modal (PATCH /api/admin/tutors/{tutorId}/rate & GET /api/admin/tutors/{tutorId}/payouts) ── */}
      {payoutTutor && (
        <div
          onClick={() => setPayoutTutor(null)}
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
            animation: "fadeUp 0.2s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "760px",
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
                background: "linear-gradient(135deg,#0d9488,#0f766e)",
                padding: "1.25rem 1.5rem",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#99f6e4", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <DollarSign size={13} /> Tutor Compensation &amp; Payouts
                </div>
                <h3 style={{ margin: "0.2rem 0 0", fontSize: "1.1rem", fontWeight: 800 }}>
                  {payoutTutor.name} (Tutor #{payoutTutor.id})
                </h3>
              </div>
              <button
                onClick={() => setPayoutTutor(null)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{ padding: "1.25rem 1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1 }}>
              {/* 1. Hourly Rate Update Form */}
              <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "1rem" }}>
                <form onSubmit={saveTutorHourlyRate} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div style={{ flex: 1, minWidth: "220px" }}>
                    <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.35rem", textTransform: "uppercase" }}>
                      Tutor Hourly Rate (₦ / hr)
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#0d9488", fontWeight: 800, fontSize: "0.95rem" }}>
                        ₦
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={editingHourlyRate}
                        onChange={(e) => setEditingHourlyRate(e.target.value)}
                        placeholder="e.g. 5000"
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem 0.5rem 2rem",
                          borderRadius: "8px",
                          border: "1.5px solid #cbd5e1",
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          color: "#0f172a",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "0.25rem" }}>
                      Used automatically to calculate monthly tutor earnings from completed sessions.
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingHourlyRate}
                    style={{
                      padding: "0.55rem 1.1rem",
                      borderRadius: "8px",
                      border: "none",
                      background: "linear-gradient(135deg,#20b2a4,#0d9488)",
                      color: "#fff",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: isSavingHourlyRate ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    {isSavingHourlyRate ? (
                      <>
                        <RefreshCw size={13} className="spin" /> Updating…
                      </>
                    ) : (
                      <>
                        <Check size={14} /> Update Rate
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* 2. Month Selector & Summary Metrics */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#334155" }}>Payout Month:</span>
                    <input
                      type="month"
                      value={payoutMonth}
                      onChange={(e) => {
                        const m = e.target.value;
                        setPayoutMonth(m);
                        if (payoutTutor) fetchTutorPayouts(payoutTutor.id, m);
                      }}
                      style={{
                        padding: "0.35rem 0.65rem",
                        borderRadius: "6px",
                        border: "1.5px solid #cbd5e1",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "#0f172a",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <button
                    onClick={() => payoutTutor && fetchTutorPayouts(payoutTutor.id, payoutMonth)}
                    disabled={loadingPayoutData}
                    style={{
                      background: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      padding: "0.35rem 0.65rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#475569",
                      cursor: loadingPayoutData ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <RefreshCw size={12} className={loadingPayoutData ? "spin" : ""} /> Refresh
                  </button>
                </div>

                {/* Stat cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.65rem" }}>
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.75rem" }}>
                    <div style={{ fontSize: "0.66rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Total Sessions</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginTop: "0.15rem" }}>
                      {payoutData?.summary?.total_sessions ?? 0}
                    </div>
                  </div>
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "0.75rem" }}>
                    <div style={{ fontSize: "0.66rem", color: "#166534", fontWeight: 700, textTransform: "uppercase" }}>Completed</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#15803d", marginTop: "0.15rem" }}>
                      {payoutData?.summary?.completed_sessions ?? 0}
                    </div>
                  </div>
                  <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "8px", padding: "0.75rem" }}>
                    <div style={{ fontSize: "0.66rem", color: "#0369a1", fontWeight: 700, textTransform: "uppercase" }}>Total Hours</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0284c7", marginTop: "0.15rem" }}>
                      {payoutData?.summary?.total_hours ?? 0} hrs
                    </div>
                  </div>
                  <div style={{ background: "#ecfdf5", border: "1.5px solid #6ee7b7", borderRadius: "8px", padding: "0.75rem" }}>
                    <div style={{ fontSize: "0.66rem", color: "#047857", fontWeight: 800, textTransform: "uppercase" }}>Total Earnings</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#065f46", marginTop: "0.15rem" }}>
                      ₦{Number(payoutData?.summary?.total_earnings ?? 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Itemized Sessions Breakdown */}
              <div>
                <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  Itemized Session Breakdown ({payoutData?.sessions?.length ?? 0} sessions)
                </div>

                {loadingPayoutData ? (
                  <div style={{ padding: "2.5rem 1rem", textAlign: "center", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <div style={{ width: "26px", height: "26px", border: "3px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 0.5rem" }} />
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Loading payout breakdown…</div>
                  </div>
                ) : !payoutData?.sessions || payoutData.sessions.length === 0 ? (
                  <div style={{ padding: "2rem 1rem", textAlign: "center", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.82rem", color: "#64748b" }}>
                    No sessions recorded for {payoutMonth}.
                  </div>
                ) : (
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                        <thead>
                          <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            {["Date & Time", "Duration", "Student & Subject", "Status", "Attendance", "Report", "Earnings"].map((h) => (
                              <th key={h} style={{ padding: "0.55rem 0.75rem", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {payoutData.sessions.map((sess, idx) => (
                            <tr key={sess.session_id || idx} style={{ borderBottom: idx < payoutData.sessions.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                              <td style={{ padding: "0.6rem 0.75rem" }}>
                                <div style={{ fontWeight: 700, color: "#0f172a" }}>{sess.date}</div>
                                <div style={{ fontSize: "0.7rem", color: "#64748b" }}>{sess.start_time?.slice(0, 5)} - {sess.end_time?.slice(0, 5)}</div>
                              </td>
                              <td style={{ padding: "0.6rem 0.75rem", fontWeight: 600, color: "#334155" }}>
                                {sess.duration_hours} hr{Number(sess.duration_hours) === 1 ? "" : "s"}
                              </td>
                              <td style={{ padding: "0.6rem 0.75rem" }}>
                                <div style={{ fontWeight: 700, color: "#0f172a" }}>{sess.student_name}</div>
                                <div style={{ fontSize: "0.7rem", color: "#0d9488" }}>{sess.subject}</div>
                              </td>
                              <td style={{ padding: "0.6rem 0.75rem" }}>
                                <span style={{
                                  fontSize: "0.66rem",
                                  fontWeight: 700,
                                  padding: "0.12rem 0.45rem",
                                  borderRadius: "10px",
                                  background: sess.status === "completed" ? "#dcfce7" : "#f1f5f9",
                                  color: sess.status === "completed" ? "#15803d" : "#475569",
                                  textTransform: "capitalize",
                                }}>
                                  {sess.status}
                                </span>
                              </td>
                              <td style={{ padding: "0.6rem 0.75rem" }}>
                                <span style={{
                                  fontSize: "0.66rem",
                                  fontWeight: 700,
                                  color: sess.attendance_status === "present" ? "#15803d" : "#b45309",
                                  textTransform: "capitalize",
                                }}>
                                  {sess.attendance_status || "—"}
                                </span>
                              </td>
                              <td style={{ padding: "0.6rem 0.75rem" }}>
                                {sess.report_submitted ? (
                                  <span style={{ color: "#059669", fontWeight: 700, fontSize: "0.72rem" }}>✓ Submitted</span>
                                ) : (
                                  <span style={{ color: "#94a3b8", fontSize: "0.72rem" }}>Pending</span>
                                )}
                              </td>
                              <td style={{ padding: "0.6rem 0.75rem", fontWeight: 800, color: sess.earnings > 0 ? "#059669" : "#64748b" }}>
                                ₦{Number(sess.earnings || 0).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "0.85rem 1.5rem", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setPayoutTutor(null)}
                style={{ padding: "0.5rem 1.25rem", background: "#0f172a", color: "#fff", border: "none", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sign Out Confirmation Dialog ── */}
      {showLogoutConfirm && (
        <div
          onClick={() => !isLoggingOut && setShowLogoutConfirm(false)}
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
              maxWidth: "420px",
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

            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.4rem" }}>
              Confirm Sign Out
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 1.5rem", lineHeight: 1.5 }}>
              Are you sure you want to sign out of the Admin Portal? You will need your credentials to log back in.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", width: "100%" }}>
              <button
                type="button"
                onClick={() => !isLoggingOut && setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  border: "1.5px solid #cbd5e1",
                  background: "#fff",
                  color: isLoggingOut ? "#94a3b8" : "#475569",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: isLoggingOut ? "not-allowed" : "pointer",
                  opacity: isLoggingOut ? 0.6 : 1,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  background: isLoggingOut ? "#991b1b" : "#dc2626",
                  color: "#fff",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: isLoggingOut ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  boxShadow: "0 2px 6px rgba(220,38,38,0.3)",
                }}
              >
                {isLoggingOut ? (
                  <>
                    <span
                      style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid rgba(255,255,255,0.35)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    Signing out…
                  </>
                ) : (
                  <><LogOut size={15} /> Yes, Sign Out</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Guardian Onboarding Modal (POST /api/parents/register) ── */}
      {isOnboardGuardianOpen && onboardGuardianStudent && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          onClick={() => {
            if (!isOnboardingGuardianLoading) setIsOnboardGuardianOpen(false);
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "560px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              border: "1px solid #e2e8f0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                borderRadius: "16px 16px 0 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div
                  style={{
                    width: "2.2rem",
                    height: "2.2rem",
                    borderRadius: "8px",
                    background: "rgba(99, 102, 241, 0.12)",
                    color: "#4f46e5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Onboard Guardian
                  </h3>
                  <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>
                    Student: <strong>{onboardGuardianStudent.student_name || onboardGuardianStudent.student || "Student"}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOnboardGuardianOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: "0.25rem",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.5rem" }}>
              {onboardGuardianResult ? (
                /* Generated Credentials View */
                <div>
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "1.25rem",
                      padding: "1rem",
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: "10px",
                    }}
                  >
                    <CheckCircle2 size={32} color="#16a34a" style={{ margin: "0 auto 0.4rem" }} />
                    <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#166534", margin: "0 0 0.2rem" }}>
                      Guardian Linked Successfully!
                    </h4>
                    <p style={{ fontSize: "0.82rem", color: "#15803d", margin: 0 }}>
                      Temporary login credentials have been generated and optionally emailed.
                    </p>
                  </div>

                  {/* Parent Credentials */}
                  {onboardGuardianResult.parent && (
                    <div
                      style={{
                        background: "#f8fafc",
                        border: "1.5px solid #cbd5e1",
                        borderRadius: "10px",
                        padding: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#4f46e5", textTransform: "uppercase" }}>
                          Parent / Guardian Credentials
                        </span>
                        <span style={{ fontSize: "0.72rem", background: "#e0e7ff", color: "#3730a3", padding: "0.15rem 0.45rem", borderRadius: "4px", fontWeight: 700 }}>
                          Role: Parent
                        </span>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#334155", marginBottom: "0.25rem" }}>
                        <strong>Name:</strong> {onboardGuardianResult.parent.name}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#334155", marginBottom: "0.5rem" }}>
                        <strong>Login Email:</strong> <code>{onboardGuardianResult.parent.email}</code>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.5rem 0.75rem",
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                        }}
                      >
                        <div>
                          <span style={{ fontSize: "0.72rem", color: "#64748b", display: "block" }}>Temporary Password</span>
                          <code style={{ fontSize: "0.95rem", fontWeight: 800, color: "#d97706" }}>
                            {onboardGuardianResult.parent.temporary_password || "••••••••"}
                          </code>
                        </div>
                        {onboardGuardianResult.parent.temporary_password && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(onboardGuardianResult.parent?.temporary_password || "");
                              setGuardianCopiedKey("parent_pw");
                              setTimeout(() => setGuardianCopiedKey(null), 2000);
                            }}
                            style={{
                              padding: "0.3rem 0.6rem",
                              background: guardianCopiedKey === "parent_pw" ? "#dcfce7" : "#f1f5f9",
                              color: guardianCopiedKey === "parent_pw" ? "#166534" : "#475569",
                              border: "1px solid #cbd5e1",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            {guardianCopiedKey === "parent_pw" ? <Check size={12} /> : <Copy size={12} />}
                            <span>{guardianCopiedKey === "parent_pw" ? "Copied" : "Copy"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ward Credentials */}
                  {onboardGuardianResult.ward && (
                    <div
                      style={{
                        background: "#f8fafc",
                        border: "1.5px solid #cbd5e1",
                        borderRadius: "10px",
                        padding: "1rem",
                        marginBottom: "1.25rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0d9488", textTransform: "uppercase" }}>
                          Student / Ward Credentials
                        </span>
                        <span style={{ fontSize: "0.72rem", background: "#ccfbf1", color: "#115e59", padding: "0.15rem 0.45rem", borderRadius: "4px", fontWeight: 700 }}>
                          Role: Student
                        </span>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#334155", marginBottom: "0.25rem" }}>
                        <strong>Name:</strong> {onboardGuardianResult.ward.name}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#334155", marginBottom: "0.5rem" }}>
                        <strong>Username:</strong> <code>{onboardGuardianResult.ward.username}</code>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.5rem 0.75rem",
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                        }}
                      >
                        <div>
                          <span style={{ fontSize: "0.72rem", color: "#64748b", display: "block" }}>Temporary Password</span>
                          <code style={{ fontSize: "0.95rem", fontWeight: 800, color: "#d97706" }}>
                            {onboardGuardianResult.ward.temporary_password || "••••••••"}
                          </code>
                        </div>
                        {onboardGuardianResult.ward.temporary_password && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(onboardGuardianResult.ward?.temporary_password || "");
                              setGuardianCopiedKey("ward_pw");
                              setTimeout(() => setGuardianCopiedKey(null), 2000);
                            }}
                            style={{
                              padding: "0.3rem 0.6rem",
                              background: guardianCopiedKey === "ward_pw" ? "#dcfce7" : "#f1f5f9",
                              color: guardianCopiedKey === "ward_pw" ? "#166534" : "#475569",
                              border: "1px solid #cbd5e1",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            {guardianCopiedKey === "ward_pw" ? <Check size={12} /> : <Copy size={12} />}
                            <span>{guardianCopiedKey === "ward_pw" ? "Copied" : "Copy"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                    <button
                      type="button"
                      onClick={() => setIsOnboardGuardianOpen(false)}
                      style={{
                        padding: "0.6rem 1.25rem",
                        background: "#0f172a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* Onboarding Form */
                <form onSubmit={handleOnboardGuardianSubmit}>
                  <div
                    style={{
                      padding: "0.75rem 0.9rem",
                      background: "#f0fdfa",
                      borderRadius: "8px",
                      border: "1px solid #99f6e4",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    <Sparkles size={16} color="#0d9488" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#115e59", lineHeight: 1.45 }}>
                      <strong>Auto-Generated Credentials:</strong> You do not need to provide passwords. Secure temporary credentials for the parent and ward will be automatically generated and emailed to the guardian upon onboarding.
                    </p>
                  </div>

                  {onboardGuardianError && (
                    <div
                      style={{
                        padding: "0.65rem 0.85rem",
                        background: "#fef2f2",
                        border: "1px solid #fca5a5",
                        borderRadius: "8px",
                        color: "#b91c1c",
                        fontSize: "0.82rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <AlertCircle size={15} style={{ flexShrink: 0 }} />
                      <span>{onboardGuardianError}</span>
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                        Guardian Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarah Jenkins"
                        value={guardianForm.guardian_name}
                        onChange={(e) => setGuardianForm({ ...guardianForm, guardian_name: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "0.55rem 0.75rem",
                          borderRadius: "6px",
                          border: onboardGuardianFieldErrors.guardian_name ? "1px solid #ef4444" : "1px solid #cbd5e1",
                          fontSize: "0.85rem",
                          outline: "none",
                        }}
                      />
                      {onboardGuardianFieldErrors.guardian_name && (
                        <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.2rem" }}>
                          {onboardGuardianFieldErrors.guardian_name[0]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                        Guardian Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="sarah.jenkins@example.com"
                        value={guardianForm.guardian_email}
                        onChange={(e) => setGuardianForm({ ...guardianForm, guardian_email: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "0.55rem 0.75rem",
                          borderRadius: "6px",
                          border: onboardGuardianFieldErrors.guardian_email ? "1px solid #ef4444" : "1px solid #cbd5e1",
                          fontSize: "0.85rem",
                          outline: "none",
                        }}
                      />
                      {onboardGuardianFieldErrors.guardian_email && (
                        <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.2rem" }}>
                          {onboardGuardianFieldErrors.guardian_email[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                        Guardian Phone
                      </label>
                      <input
                        type="text"
                        placeholder="+44 7911 123456"
                        value={guardianForm.guardian_phone}
                        onChange={(e) => setGuardianForm({ ...guardianForm, guardian_phone: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "0.55rem 0.75rem",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.85rem",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                        Relationship
                      </label>
                      <select
                        value={guardianForm.relationship}
                        onChange={(e) => setGuardianForm({ ...guardianForm, relationship: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "0.55rem 0.75rem",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.85rem",
                          outline: "none",
                          background: "#fff",
                        }}
                      >
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Legal Guardian">Legal Guardian</option>
                        <option value="Aunt / Uncle">Aunt / Uncle</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                      <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", margin: 0 }}>
                        Ward Username (Student Login Identifier)
                      </label>
                      <span style={{ fontSize: "0.72rem", color: "#64748b", background: "#f1f5f9", padding: "0.1rem 0.45rem", borderRadius: "4px", fontWeight: 600 }}>
                        Auto-generated • Read-only
                      </span>
                    </div>
                    <input
                      type="text"
                      readOnly
                      placeholder="e.g. liam.jenkins"
                      value={guardianForm.ward_username}
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.75rem",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        background: "#f8fafc",
                        color: "#475569",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "not-allowed",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ padding: "0.75rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "1.25rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "#334155", cursor: "pointer", marginBottom: "0.4rem" }}>
                      <input
                        type="checkbox"
                        checked={guardianForm.reset_ward_password}
                        onChange={(e) => setGuardianForm({ ...guardianForm, reset_ward_password: e.target.checked })}
                      />
                      <span>Reset student temporary password and require change on next login</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "#334155", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={guardianForm.send_email}
                        onChange={(e) => setGuardianForm({ ...guardianForm, send_email: e.target.checked })}
                      />
                      <span>Send onboarding notification emails with portal link to guardian</span>
                    </label>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                    <button
                      type="button"
                      onClick={() => setIsOnboardGuardianOpen(false)}
                      disabled={isOnboardingGuardianLoading}
                      style={{
                        padding: "0.55rem 1rem",
                        background: "#fff",
                        border: "1.5px solid #cbd5e1",
                        borderRadius: "8px",
                        color: "#475569",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isOnboardingGuardianLoading}
                      style={{
                        padding: "0.55rem 1.25rem",
                        background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        cursor: isOnboardingGuardianLoading ? "not-allowed" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                        opacity: isOnboardingGuardianLoading ? 0.75 : 1,
                      }}
                    >
                      {isOnboardingGuardianLoading ? (
                        <>
                          <RefreshCw size={14} className="spin" />
                          <span>Onboarding...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={15} />
                          <span>Complete Guardian Onboarding</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Admin Chat Contacts Modal (GET /api/admin/chat/contacts) ── */}
      {showAdminContactsModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          onClick={() => setShowAdminContactsModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f8fafc",
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Platform Chat Contacts
                </h3>
                <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0.2rem 0 0 0" }}>
                  Browse tutors, parents, and students to view conversations or initiate 1-on-1 direct messaging.
                </p>
              </div>
              <button
                onClick={() => setShowAdminContactsModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  padding: "0.4rem",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div
              style={{
                padding: "1rem 1.5rem",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
                background: "#fff",
              }}
            >
              {/* Role filter pills */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#475569", marginRight: "0.2rem" }}>
                  Role:
                </span>
                {[
                  { id: "all", label: "All Contacts" },
                  { id: "tutor", label: "Tutors" },
                  { id: "parent", label: "Parents" },
                  { id: "student", label: "Students" },
                ].map((rf) => {
                  const isActive = adminContactsRoleFilter === rf.id;
                  return (
                    <button
                      key={rf.id}
                      onClick={() => {
                        setAdminContactsRoleFilter(rf.id);
                        fetchAdminChatContacts(1, { role: rf.id });
                      }}
                      style={{
                        padding: "0.25rem 0.65rem",
                        borderRadius: "15px",
                        fontSize: "0.72rem",
                        fontWeight: isActive ? 700 : 500,
                        cursor: "pointer",
                        border: isActive ? "1px solid #0d9488" : "1px solid #e2e8f0",
                        background: isActive ? "#0d9488" : "#f8fafc",
                        color: isActive ? "#ffffff" : "#475569",
                      }}
                    >
                      {rf.label}
                    </button>
                  );
                })}
              </div>

              {/* Search form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchAdminChatContacts(1);
                }}
                style={{ display: "flex", gap: "0.5rem" }}
              >
                <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
                  <Search size={14} color="#94a3b8" style={{ position: "absolute", left: "0.75rem", pointerEvents: "none" }} />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={adminContactsSearch}
                    onChange={(e) => setAdminContactsSearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.45rem 0.75rem 0.45rem 2.1rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.78rem",
                      background: "#fff",
                      color: "#0f172a",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: "0.45rem 0.9rem",
                    borderRadius: "8px",
                    background: "#0d9488",
                    color: "#fff",
                    border: "none",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Search
                </button>
              </form>
            </div>

            {/* Contacts List */}
            <div style={{ flex: 1, overflowY: "auto", maxHeight: "420px", padding: "0.5rem 1.5rem" }}>
              {adminContactsLoading ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                  <RefreshCw size={24} className="spin" style={{ margin: "0 auto 0.75rem auto", display: "block" }} />
                  <p style={{ fontSize: "0.8rem", margin: 0 }}>Loading contacts...</p>
                </div>
              ) : adminContacts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                  <Users size={32} style={{ margin: "0 auto 0.75rem auto", display: "block", color: "#cbd5e1" }} />
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b", margin: "0 0 0.25rem 0" }}>
                    No contacts found
                  </p>
                  <p style={{ fontSize: "0.75rem", margin: 0 }}>
                    Try searching with another name or filter by a different role.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {adminContacts.map((contact) => {
                    const isStartingThis = startingChatWithUserId === contact.user_id;
                    const roleColor =
                      contact.role === "tutor"
                        ? { bg: "#ccfbf1", text: "#0f766e" }
                        : contact.role === "parent"
                        ? { bg: "#f3e8ff", text: "#7e22ce" }
                        : { bg: "#e0f2fe", text: "#0369a1" };

                    return (
                      <div
                        key={contact.user_id}
                        style={{
                          padding: "0.75rem 0.9rem",
                          borderRadius: "10px",
                          border: "1px solid #e2e8f0",
                          background: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.75rem",
                          transition: "box-shadow 0.15s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "50%",
                              background: roleColor.bg,
                              color: roleColor.text,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.85rem",
                              fontWeight: 800,
                              flexShrink: 0,
                              overflow: "hidden",
                            }}
                          >
                            {(contact.profile_photo_url || contact.photo) ? (
                              <img
                                src={(contact.profile_photo_url || contact.photo) as string}
                                alt={contact.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            ) : (
                              contact.name?.charAt(0) || "U"
                            )}
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a" }}>
                                {contact.name}
                              </span>
                              <span
                                style={{
                                  fontSize: "0.62rem",
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  padding: "0.08rem 0.4rem",
                                  borderRadius: "4px",
                                  background: roleColor.bg,
                                  color: roleColor.text,
                                }}
                              >
                                {contact.role}
                              </span>
                            </div>
                            <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                              {contact.email}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          {contact.has_existing_conversation ? (
                            <button
                              onClick={() => startChatWithContact(contact)}
                              style={{
                                padding: "0.38rem 0.75rem",
                                borderRadius: "6px",
                                background: "#f0fdfa",
                                color: "#0d9488",
                                border: "1px solid #ccfbf1",
                                fontSize: "0.74rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                            >
                              <MessageSquare size={13} />
                              Open Existing Chat
                            </button>
                          ) : (
                            <button
                              onClick={() => startChatWithContact(contact)}
                              disabled={isStartingThis}
                              style={{
                                padding: "0.38rem 0.75rem",
                                borderRadius: "6px",
                                background: isStartingThis ? "#94a3b8" : "#0d9488",
                                color: "#fff",
                                border: "none",
                                fontSize: "0.74rem",
                                fontWeight: 700,
                                cursor: isStartingThis ? "not-allowed" : "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                            >
                              {isStartingThis ? (
                                <>
                                  <RefreshCw size={12} className="spin" />
                                  Starting...
                                </>
                              ) : (
                                <>
                                  <Send size={12} />
                                  Start Direct Chat
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Pagination Footer */}
            {adminContactsLastPage > 1 && (
              <div
                style={{
                  padding: "0.75rem 1.5rem",
                  borderTop: "1px solid #f1f5f9",
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <button
                  disabled={adminContactsPage <= 1 || adminContactsLoading}
                  onClick={() => fetchAdminChatContacts(adminContactsPage - 1)}
                  style={{
                    padding: "0.3rem 0.65rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    cursor: adminContactsPage <= 1 ? "not-allowed" : "pointer",
                  }}
                >
                  Prev
                </button>
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                  Page {adminContactsPage} of {adminContactsLastPage} ({adminContactsTotal} contacts)
                </span>
                <button
                  disabled={adminContactsPage >= adminContactsLastPage || adminContactsLoading}
                  onClick={() => fetchAdminChatContacts(adminContactsPage + 1)}
                  style={{
                    padding: "0.3rem 0.65rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    cursor: adminContactsPage >= adminContactsLastPage ? "not-allowed" : "pointer",
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Admin Broadcast Modal (POST /api/admin/chat/broadcast) ── */}
      {showBroadcastModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          onClick={() => !isSubmittingBroadcast && setShowBroadcastModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "640px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f8fafc",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#f0fdfa",
                    color: "#0d9488",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Radio size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Broadcast Announcement
                  </h3>
                  <p style={{ fontSize: "0.74rem", color: "#64748b", margin: "0.15rem 0 0 0" }}>
                    Send an individual 1-on-1 direct message from Admin to a platform group.
                  </p>
                </div>
              </div>
              <button
                disabled={isSubmittingBroadcast}
                onClick={() => setShowBroadcastModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  padding: "0.4rem",
                  borderRadius: "6px",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submitAdminBroadcast} style={{ display: "flex", flexDirection: "column", flex: 1, overflowY: "auto" }}>
              <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Target Audience Selector */}
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                    Target Audience *
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "0.5rem" }}>
                    {[
                      { id: "all_tutors", label: "All Tutors" },
                      { id: "all_parents", label: "All Parents" },
                      { id: "all_students", label: "All Students" },
                      { id: "all", label: "All Users" },
                      { id: "custom", label: "Custom Group" },
                    ].map((tg) => {
                      const isSelected = broadcastTarget === tg.id;
                      return (
                        <button
                          key={tg.id}
                          type="button"
                          onClick={() => setBroadcastTarget(tg.id)}
                          style={{
                            padding: "0.55rem 0.5rem",
                            borderRadius: "8px",
                            border: isSelected ? "2px solid #0d9488" : "1px solid #e2e8f0",
                            background: isSelected ? "#f0fdfa" : "#fff",
                            color: isSelected ? "#0d9488" : "#475569",
                            fontSize: "0.76rem",
                            fontWeight: isSelected ? 800 : 500,
                            cursor: "pointer",
                            textAlign: "center",
                          }}
                        >
                          {tg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Selection Area (if target === "custom") */}
                {broadcastTarget === "custom" && (
                  <div
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      padding: "0.85rem",
                      background: "#f8fafc",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.6rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#334155" }}>
                        Selected Recipients: {broadcastRecipientIds.length}
                      </span>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          type="button"
                          onClick={() => setBroadcastRecipientIds(adminContacts.map((c) => c.user_id))}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#0d9488",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Select All Visible
                        </button>
                        <span style={{ color: "#cbd5e1" }}>|</span>
                        <button
                          type="button"
                          onClick={() => setBroadcastRecipientIds([])}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#dc2626",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Filter visible contacts..."
                      value={broadcastCustomSearch}
                      onChange={(e) => setBroadcastCustomSearch(e.target.value)}
                      style={{
                        padding: "0.4rem 0.65rem",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.75rem",
                        background: "#fff",
                      }}
                    />

                    <div style={{ maxHeight: "160px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      {adminContacts
                        .filter((c) =>
                          broadcastCustomSearch
                            ? c.name.toLowerCase().includes(broadcastCustomSearch.toLowerCase()) ||
                              c.email.toLowerCase().includes(broadcastCustomSearch.toLowerCase())
                            : true
                        )
                        .map((contact) => {
                          const isChecked = broadcastRecipientIds.includes(contact.user_id);
                          return (
                            <label
                              key={contact.user_id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.6rem",
                                padding: "0.35rem 0.5rem",
                                borderRadius: "6px",
                                background: isChecked ? "#f0fdfa" : "#fff",
                                border: isChecked ? "1px solid #ccfbf1" : "1px solid #f1f5f9",
                                cursor: "pointer",
                                fontSize: "0.74rem",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setBroadcastRecipientIds((prev) => [...prev, contact.user_id]);
                                  } else {
                                    setBroadcastRecipientIds((prev) => prev.filter((id) => id !== contact.user_id));
                                  }
                                }}
                              />
                              <span style={{ fontWeight: 600, color: "#1e293b" }}>{contact.name}</span>
                              <span style={{ color: "#64748b" }}>({contact.role})</span>
                              <span style={{ color: "#94a3b8", marginLeft: "auto", fontSize: "0.68rem" }}>{contact.email}</span>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Subject */}
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                    Subject (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Schedule Update / Term 2 Notice / Exam Preparation"
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.8rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.8rem",
                      background: "#fff",
                      color: "#0f172a",
                    }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                    Broadcast Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Type the message that will be sent to all selected recipients..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.8rem",
                      background: "#fff",
                      color: "#0f172a",
                      resize: "vertical",
                    }}
                  />
                </div>

                {/* Attachment */}
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                    Attach Worksheet or Announcement File (Optional)
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <label
                      style={{
                        padding: "0.45rem 0.85rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        background: "#f8fafc",
                        fontSize: "0.76rem",
                        fontWeight: 600,
                        color: "#334155",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <Paperclip size={14} />
                      Choose File
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setBroadcastAttachment(e.target.files[0]);
                          }
                        }}
                      />
                    </label>

                    {broadcastAttachment && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#0d9488" }}>
                        <span>{broadcastAttachment.name}</span>
                        <button
                          type="button"
                          onClick={() => setBroadcastAttachment(null)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info notice */}
                <div
                  style={{
                    background: "#f0fdfa",
                    border: "1px solid #ccfbf1",
                    borderRadius: "8px",
                    padding: "0.7rem 0.85rem",
                    fontSize: "0.73rem",
                    color: "#0f766e",
                    lineHeight: 1.45,
                  }}
                >
                  Each recipient receives an individual, private 1-on-1 direct message from Admin and an in-app activity notification. Replies remain confidential between Admin and each user.
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "1rem 1.5rem",
                  borderTop: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "0.6rem",
                }}
              >
                <button
                  type="button"
                  disabled={isSubmittingBroadcast}
                  onClick={() => setShowBroadcastModal(false)}
                  style={{
                    padding: "0.55rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    color: "#475569",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingBroadcast || !broadcastMessage.trim()}
                  style={{
                    padding: "0.55rem 1.25rem",
                    borderRadius: "8px",
                    border: "none",
                    background: isSubmittingBroadcast || !broadcastMessage.trim() ? "#94a3b8" : "#0d9488",
                    color: "#fff",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: isSubmittingBroadcast || !broadcastMessage.trim() ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    boxShadow: "0 2px 4px rgba(13,148,136,0.25)",
                  }}
                >
                  {isSubmittingBroadcast ? (
                    <>
                      <RefreshCw size={14} className="spin" />
                      Broadcasting...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Send Broadcast
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Tutor Details Modal (PUT/PATCH /api/admin/tutors/{id}) ── */}
      {isEditTutorOpen && selectedTutor && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          onClick={() => !isUpdatingTutor && setIsEditTutorOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f8fafc",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "#f0fdfa",
                    color: "#0d9488",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Edit Tutor Details
                  </h3>
                  <p style={{ fontSize: "0.74rem", color: "#64748b", margin: "0.15rem 0 0 0" }}>
                    Updating profile, qualifications, and billing rate for {selectedTutor.name} (ID: #{selectedTutor.id})
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isUpdatingTutor}
                onClick={() => setIsEditTutorOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: isUpdatingTutor ? "not-allowed" : "pointer",
                  color: "#94a3b8",
                  padding: "0.4rem",
                  borderRadius: "6px",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Error Message */}
            {editTutorError && (
              <div
                style={{
                  margin: "1rem 1.5rem 0",
                  padding: "0.75rem 1rem",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  color: "#b91c1c",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{editTutorError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleUpdateTutor} style={{ display: "flex", flexDirection: "column", flex: 1, overflowY: "auto" }}>
              <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Row 1: Name & Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editTutorForm.name}
                      onChange={(e) => setEditTutorForm({ ...editTutorForm, name: e.target.value })}
                      placeholder="e.g. Dr. Jane Smith"
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.82rem",
                        background: "#fff",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={editTutorForm.email}
                      onChange={(e) => setEditTutorForm({ ...editTutorForm, email: e.target.value })}
                      placeholder="e.g. jane.smith@example.com"
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.82rem",
                        background: "#fff",
                      }}
                    />
                  </div>
                </div>

                {/* Row 2: Phone & Qualification */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editTutorForm.phone}
                      onChange={(e) => setEditTutorForm({ ...editTutorForm, phone: e.target.value })}
                      placeholder="e.g. +44 7700 900123"
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.82rem",
                        background: "#fff",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                      Highest Qualification
                    </label>
                    <input
                      type="text"
                      value={editTutorForm.qualification}
                      onChange={(e) => setEditTutorForm({ ...editTutorForm, qualification: e.target.value })}
                      placeholder="e.g. PhD in Mathematics (Imperial College)"
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.82rem",
                        background: "#fff",
                      }}
                    />
                  </div>
                </div>

                {/* Row 3: Teaching Subjects */}
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                    Teaching Subjects <span style={{ fontWeight: 400, color: "#64748b" }}>(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={editTutorForm.subjects}
                    onChange={(e) => setEditTutorForm({ ...editTutorForm, subjects: e.target.value })}
                    placeholder="e.g. Mathematics, Further Mathematics, Statistics"
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.8rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.82rem",
                      background: "#fff",
                    }}
                  />
                </div>

                {/* Row 4: Teaching Levels */}
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                    Teaching Levels <span style={{ fontWeight: 400, color: "#64748b" }}>(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={editTutorForm.levels}
                    onChange={(e) => setEditTutorForm({ ...editTutorForm, levels: e.target.value })}
                    placeholder="e.g. KS3, GCSE, A-Level, IB"
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.8rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.82rem",
                      background: "#fff",
                    }}
                  />
                </div>

                {/* Row 5: Experience, Hourly Rate, Status */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.85rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                      Experience
                    </label>
                    <input
                      type="text"
                      value={editTutorForm.years_of_experience}
                      onChange={(e) => setEditTutorForm({ ...editTutorForm, years_of_experience: e.target.value })}
                      placeholder="e.g. 5 years"
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.82rem",
                        background: "#fff",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                      Hourly Rate (£/hr)
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", color: "#64748b", fontWeight: 700, fontSize: "0.82rem" }}>
                        £
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={editTutorForm.hourly_rate}
                        onChange={(e) => setEditTutorForm({ ...editTutorForm, hourly_rate: e.target.value })}
                        placeholder="e.g. 45"
                        style={{
                          width: "100%",
                          padding: "0.55rem 0.8rem 0.55rem 1.6rem",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.82rem",
                          background: "#fff",
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                      Approval Status
                    </label>
                    <select
                      value={editTutorForm.approval_status}
                      onChange={(e) => setEditTutorForm({ ...editTutorForm, approval_status: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.82rem",
                        background: "#fff",
                        fontWeight: 600,
                      }}
                    >
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Row 6: Bio */}
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                    Biography &amp; Teaching Philosophy
                  </label>
                  <textarea
                    rows={4}
                    value={editTutorForm.bio}
                    onChange={(e) => setEditTutorForm({ ...editTutorForm, bio: e.target.value })}
                    placeholder="Describe background, pedagogical approach, track record..."
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.82rem",
                      background: "#fff",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: "1rem 1.5rem",
                  borderTop: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "0.6rem",
                }}
              >
                <button
                  type="button"
                  disabled={isUpdatingTutor}
                  onClick={() => setIsEditTutorOpen(false)}
                  style={{
                    padding: "0.55rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    color: "#475569",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingTutor}
                  style={{
                    padding: "0.55rem 1.25rem",
                    borderRadius: "8px",
                    border: "none",
                    background: isUpdatingTutor ? "#94a3b8" : "linear-gradient(135deg,#20b2a4,#0d9488)",
                    color: "#fff",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: isUpdatingTutor ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    boxShadow: "0 2px 4px rgba(13,148,136,0.25)",
                  }}
                >
                  {isUpdatingTutor ? (
                    <>
                      <RefreshCw size={14} className="spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      Save Tutor Details
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Public Website Verification Modal (PATCH /api/admin/tutors/{id}/verify-public) ── */}
      {isVerifyPublicModalOpen && selectedTutor && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          onClick={() => !isUpdatingPublic && setIsVerifyPublicModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "560px",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f8fafc",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "#eff6ff",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Globe size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Public Website Verification
                  </h3>
                  <p style={{ fontSize: "0.74rem", color: "#64748b", margin: "0.15rem 0 0 0" }}>
                    Configure directory visibility &amp; photo verification for {selectedTutor.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isUpdatingPublic}
                onClick={() => setIsVerifyPublicModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: isUpdatingPublic ? "not-allowed" : "pointer",
                  color: "#94a3b8",
                  padding: "0.4rem",
                  borderRadius: "6px",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleVerifyPublic} style={{ display: "flex", flexDirection: "column", flex: 1, overflowY: "auto" }}>
              <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Tutor Preview Card */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "#e0f2fe",
                      color: "#0369a1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      flexShrink: 0,
                      overflow: "hidden",
                      border: "2px solid #bae6fd",
                    }}
                  >
                    {(selectedTutor.tutor_profile?.profile_photo_url || selectedTutor.profile_photo_url || selectedTutor.photo) ? (
                      <img
                        src={(selectedTutor.tutor_profile?.profile_photo_url || selectedTutor.profile_photo_url || selectedTutor.photo) as string}
                        alt={selectedTutor.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      selectedTutor.name?.charAt(0) || "T"
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>
                      {selectedTutor.name}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                      {selectedTutor.tutor_profile?.qualification || (selectedTutor as any).qualification || "Registered Tutor"}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.15rem" }}>
                      ID: #{selectedTutor.id} • Rate: £{selectedTutor.tutor_profile?.hourly_rate ?? selectedTutor.hourly_rate ?? 40}/hr
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {/* Toggle 1: is_public */}
                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.85rem",
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      border: verifyPublicForm.is_public ? "1.5px solid #16a34a" : "1.5px solid #cbd5e1",
                      background: verifyPublicForm.is_public ? "#f0fdf4" : "#fff",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={verifyPublicForm.is_public}
                      onChange={(e) => setVerifyPublicForm({ ...verifyPublicForm, is_public: e.target.checked })}
                      style={{ marginTop: "0.2rem", width: "16px", height: "16px", accentColor: "#16a34a" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: verifyPublicForm.is_public ? "#15803d" : "#1e293b" }}>
                          Feature on Public Website
                        </span>
                        {verifyPublicForm.is_public && (
                          <span style={{ fontSize: "0.65rem", fontWeight: 700, background: "#dcfce7", color: "#166534", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: "0.72rem", color: "#64748b", margin: "0.2rem 0 0 0", lineHeight: 1.45 }}>
                        Allows prospective parents and students to discover this tutor in the public search directory.
                      </p>
                    </div>
                  </label>

                  {/* Toggle 2: is_photo_verified */}
                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.85rem",
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      border: verifyPublicForm.is_photo_verified ? "1.5px solid #2563eb" : "1.5px solid #cbd5e1",
                      background: verifyPublicForm.is_photo_verified ? "#eff6ff" : "#fff",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={verifyPublicForm.is_photo_verified}
                      onChange={(e) => setVerifyPublicForm({ ...verifyPublicForm, is_photo_verified: e.target.checked })}
                      style={{ marginTop: "0.2rem", width: "16px", height: "16px", accentColor: "#2563eb" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: verifyPublicForm.is_photo_verified ? "#1d4ed8" : "#1e293b" }}>
                          Verify Profile Photo
                        </span>
                        {verifyPublicForm.is_photo_verified && (
                          <span style={{ fontSize: "0.65rem", fontWeight: 700, background: "#dbeafe", color: "#1e40af", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
                            VERIFIED
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: "0.72rem", color: "#64748b", margin: "0.2rem 0 0 0", lineHeight: 1.45 }}>
                        Confirms the uploaded photo is genuine, clear, and meets platform quality standards for public display.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Public Headline */}
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                    Public Headline (Directory Tagline)
                  </label>
                  <input
                    type="text"
                    value={verifyPublicForm.public_headline}
                    onChange={(e) => setVerifyPublicForm({ ...verifyPublicForm, public_headline: e.target.value })}
                    placeholder="e.g. Imperial College Graduate with 5+ yrs GCSE/A-Level experience"
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.8rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.82rem",
                      background: "#fff",
                    }}
                  />
                  <p style={{ fontSize: "0.7rem", color: "#94a3b8", margin: "0.25rem 0 0 0" }}>
                    Displayed directly below the tutor&apos;s name on public search result cards.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "1rem 1.5rem",
                  borderTop: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "0.6rem",
                }}
              >
                <button
                  type="button"
                  disabled={isUpdatingPublic}
                  onClick={() => setIsVerifyPublicModalOpen(false)}
                  style={{
                    padding: "0.55rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    color: "#475569",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPublic}
                  style={{
                    padding: "0.55rem 1.25rem",
                    borderRadius: "8px",
                    border: "none",
                    background: isUpdatingPublic ? "#94a3b8" : "linear-gradient(135deg,#2563eb,#1d4ed8)",
                    color: "#fff",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: isUpdatingPublic ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    boxShadow: "0 2px 4px rgba(37,99,235,0.25)",
                  }}
                >
                  {isUpdatingPublic ? (
                    <>
                      <RefreshCw size={14} className="spin" />
                      Saving Status...
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      Save Verification Status
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
