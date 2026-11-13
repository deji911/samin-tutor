"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ShieldCheck,
  UserCheck,
  Lock,
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  Trash2,
  Edit3,
} from "lucide-react";
import { getBackendApiUrl, clearAuthSession } from "../../utils/auth";
import NotificationEnvelope from "@/components/NotificationEnvelope";

type ChildWard = {
  id: number;
  name: string;
  username?: string;
  level: string;
  subjects: string[];
  attendanceRate: number;
  completedLessons: number;
  upcomingLessons: number;
};

type UpcomingSession = {
  id: number;
  subject: string;
  date: string;
  start_time: string;
  end_time: string;
  tutor_name: string;
  meeting_link?: string;
  status: string;
};

type ChildAssignment = {
  id: number;
  title: string;
  subject: string;
  due_date: string;
  status: "assigned" | "submitted" | "graded" | "late";
  grade?: string | number;
  feedback?: string;
};

type ChatReaction = {
  emoji: string;
  count: number;
  users: { id: number; name: string }[];
};

type ChatMessage = {
  id: number;
  conversation_id: number;
  body?: string;
  attachment_name?: string;
  attachment_url?: string;
  created_at: string;
  created_at_human?: string;
  edited_at?: string;
  is_deleted?: boolean;
  deleted_at?: string;
  sender: {
    id: number;
    name: string;
    role: string;
  };
  reactions?: Record<string, number> | ChatReaction[] | string[];
};

type ChatConversation = {
  id: number;
  type: string;
  subject?: string;
  lesson_session_id?: number | null;
  last_message_at?: string;
  unread_count?: number;
  latest_message?: {
    id: number;
    sender_name: string;
    body?: string;
    created_at: string;
  } | null;
  other_participants?: {
    id: number;
    name: string;
    role: string;
  }[];
};

type ChatContact = {
  user_id: number;
  name: string;
  subject?: string;
  role?: string;
  has_existing_conversation: boolean;
  conversation_id?: number | null;
  profile_photo_url?: string | null;
  photo?: string | null;
};

export default function ParentDashboard() {
  const router = useRouter();

  const [parentUser, setParentUser] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "sessions" | "homework" | "tutors" | "messages">("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Chat / Messaging State (GET /api/parent/chat-contacts & GET /api/chat/conversations)
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [chatContacts, setChatContacts] = useState<ChatContact[]>([]);
  const [loadingChatContacts, setLoadingChatContacts] = useState(false);
  const [adminSupportContact, setAdminSupportContact] = useState<any | null>(null);
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [messageFile, setMessageFile] = useState<File | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [chatUnreadCount, setChatUnreadCount] = useState(0);
  const [chatSearch, setChatSearch] = useState("");
  const [launchingChatId, setLaunchingChatId] = useState<number | string | null>(null);
  const [showNewConvModal, setShowNewConvModal] = useState(false);
  const [contactModalSearch, setContactModalSearch] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingMessageText, setEditingMessageText] = useState("");
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Wards / Children
  const [children, setChildren] = useState<ChildWard[]>([
    {
      id: 1,
      name: "Liam Jenkins",
      username: "liam.jenkins",
      level: "GCSE preparation",
      subjects: ["Mathematics", "Physics"],
      attendanceRate: 98,
      completedLessons: 14,
      upcomingLessons: 3,
    },
  ]);
  const [selectedChildId, setSelectedChildId] = useState<number>(1);

  // Upcoming sessions
  const [sessions, setSessions] = useState<UpcomingSession[]>([
    {
      id: 101,
      subject: "Mathematics - Algebra & Functions",
      date: "Tomorrow",
      start_time: "17:00",
      end_time: "18:00",
      tutor_name: "Dr. Sarah Connor",
      meeting_link: "https://meet.google.com/abc-defg-hij",
      status: "scheduled",
    },
    {
      id: 102,
      subject: "Physics - Forces & Newton's Laws",
      date: "Friday, Nov 1",
      start_time: "16:30",
      end_time: "17:30",
      tutor_name: "Marcus Vance",
      meeting_link: "https://meet.google.com/xyz-uvwx-rst",
      status: "scheduled",
    },
  ]);

  // Homework
  const [assignments, setAssignments] = useState<ChildAssignment[]>([
    {
      id: 201,
      title: "Algebra Worksheet 3 - Quadratic Equations",
      subject: "Mathematics",
      due_date: "2026-11-05 18:00",
      status: "assigned",
    },
    {
      id: 202,
      title: "Newton's Third Law Problem Set",
      subject: "Physics",
      due_date: "2026-10-30 20:00",
      status: "graded",
      grade: "94%",
      feedback: "Exceptional mastery of action-reaction pairs.",
    },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mustChange = localStorage.getItem("samin_must_change_password");
      if (mustChange === "true") {
        window.location.href = "/change-password";
        return;
      }

      const token = localStorage.getItem("samin_auth_token");
      const userStr = localStorage.getItem("samin_user");

      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          setParentUser(u);
        } catch {}
      }

      // Fetch dynamic parent data if endpoint available
      fetchParentOverview(token);
    }
  }, []);

  const fetchParentOverview = async (token: string | null) => {
    setLoading(true);
    try {
      const baseUrl = getBackendApiUrl();
      if (token) {
        const res = await fetch(`${baseUrl}/api/parent/overview`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.children?.length) setChildren(data.children);
          if (data?.upcoming_sessions?.length) setSessions(data.upcoming_sessions);
          if (data?.assignments?.length) setAssignments(data.assignments);
        }
      }
    } catch (err) {
      // Graceful fallback to initial mockup data
    } finally {
      setLoading(false);
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
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      } catch {}
    }
    clearAuthSession();
    router.push("/");
  };

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    return {
      Authorization: `Bearer ${token || ""}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  /* ── Fetch Chat Conversations (GET /api/chat/conversations) ── */
  const fetchConversations = async () => {
    setLoadingConversations(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/chat/conversations`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data?.conversations)
          ? data.conversations
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
        setConversations(list);
      }
    } catch (err) {
      console.error("fetchConversations error:", err);
    } finally {
      setLoadingConversations(false);
    }
  };

  /* ── Fetch Chat Contacts for Parent (GET /api/parent/chat-contacts) ── */
  const fetchChatContacts = async () => {
    setLoadingChatContacts(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/parent/chat-contacts`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data?.contacts)
          ? data.contacts
          : Array.isArray(data)
          ? data
          : [];
        const resolvedList = list.map((c: any) => {
          let photo = c.profile_photo_url || c.photo || c.tutor_profile?.profile_photo_url || null;
          if (!photo && (String(c.user_id) === "2120" || String(c.id) === "2120" || c.name?.toLowerCase().includes("bamidele"))) {
            photo = "http://localhost:8000/storage/tutor_profiles/KDncaAnyA9Pp6cnN9a1Mbkl0fBGfRYLitbyz4ZYa.jpg";
          }
          return { ...c, profile_photo_url: photo };
        });
        setChatContacts(resolvedList);
        if (data?.admin_support) {
          setAdminSupportContact(data.admin_support);
        }
      }
    } catch (err) {
      console.error("fetchChatContacts error:", err);
    } finally {
      setLoadingChatContacts(false);
    }
  };

  /* ── Fetch Total Unread Messages Count (GET /api/chat/unread-count) ── */
  const fetchUnreadCount = async () => {
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/chat/unread-count`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setChatUnreadCount(typeof data?.unread_count === "number" ? data.unread_count : 0);
      }
    } catch {}
  };

  /* ── Fetch Messages for active conversation (GET /api/chat/conversations/{id}/messages) ── */
  const fetchMessages = async (convId: number, silent: boolean = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/chat/conversations/${convId}/messages`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        const msgs = Array.isArray(data?.messages?.data)
          ? data.messages.data
          : Array.isArray(data?.messages)
          ? data.messages
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setMessages(msgs);
        fetch(`${baseUrl}/api/chat/conversations/${convId}/read`, {
          method: "PATCH",
          headers: getAuthHeaders(),
        }).catch(() => {});
        fetchUnreadCount();
      }
    } catch (err) {
      console.error("fetchMessages error:", err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  /* ── Send Message in Conversation (POST /api/chat/conversations/{id}/messages) ── */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation) return;
    if (!messageBody.trim() && !messageFile) return;

    const convId = activeConversation.id;
    const bodyText = messageBody.trim();
    const fileToSend = messageFile;

    const tempId = Date.now();
    const optimisticMsg: ChatMessage = {
      id: tempId,
      conversation_id: convId,
      body: bodyText,
      attachment_name: fileToSend?.name,
      attachment_url: fileToSend ? URL.createObjectURL(fileToSend) : undefined,
      created_at: new Date().toISOString(),
      created_at_human: "Just now",
      sender: {
        id: parentUser?.id || 1,
        name: parentUser?.name || "Parent",
        role: "parent",
      },
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setMessageBody("");
    setMessageFile(null);
    setIsSendingMessage(true);

    try {
      const baseUrl = getBackendApiUrl();
      const formData = new FormData();
      if (bodyText) formData.append("body", bodyText);
      if (fileToSend) formData.append("attachment", fileToSend);

      const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token || ""}`,
        Accept: "application/json",
      };

      const res = await fetch(`${baseUrl}/api/chat/conversations/${convId}/messages`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (res.ok) {
        fetchMessages(convId, true);
        fetchConversations();
      } else {
        const errData = await res.json().catch(() => null);
        showToast(errData?.message || "Failed to deliver message.");
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    } catch (err: any) {
      showToast(err?.message || "Error sending message.");
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setIsSendingMessage(false);
    }
  };

  /* ── Launch Directly into Chat with Contact (POST /api/chat/conversations) ── */
  const handleLaunchContactChat = async (contact: any) => {
    const isRecipientAdmin =
      contact.role === "admin" ||
      contact.user_id === "admin" ||
      contact.name === "Admin Support";

    const recipientId = isRecipientAdmin ? "admin" : contact.user_id;
    if (!recipientId) return;

    // 1. If existing conversation in loaded list
    const existingInList = conversations.find((c) => {
      if (contact.conversation_id && c.id === contact.conversation_id) return true;
      if (isRecipientAdmin) {
        return c.type === "parent_admin" || c.other_participants?.some((p) => p.role === "admin");
      }
      return c.other_participants?.some((p) => p.id === contact.user_id);
    });

    if (existingInList) {
      setShowNewConvModal(false);
      setActiveConversation(existingInList);
      fetchMessages(existingInList.id);
      showToast(`Chat opened with ${contact.name}`);
      return;
    }

    if (contact.has_existing_conversation && contact.conversation_id) {
      setShowNewConvModal(false);
      const convObj: ChatConversation = {
        id: contact.conversation_id,
        type: isRecipientAdmin ? "parent_admin" : "parent_tutor",
        subject: contact.subject || (isRecipientAdmin ? "Admin Support" : "Direct Message"),
        unread_count: 0,
        other_participants: [{ id: isRecipientAdmin ? 1 : contact.user_id, name: contact.name, role: isRecipientAdmin ? "admin" : "tutor" }],
      };
      setActiveConversation(convObj);
      fetchMessages(contact.conversation_id);
      fetchConversations();
      showToast(`Chat opened with ${contact.name}`);
      return;
    }

    // 2. Create/retrieve via POST /api/chat/conversations
    setLaunchingChatId(recipientId);
    try {
      const baseUrl = getBackendApiUrl();
      const bodyPayload: any = {
        recipient_id: isRecipientAdmin ? "admin" : recipientId,
        subject: contact.subject || (isRecipientAdmin ? "Parent Support Inquiry" : undefined),
      };
      if (isRecipientAdmin) {
        bodyPayload.recipient_role = "admin";
      }

      const res = await fetch(`${baseUrl}/api/chat/conversations`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        setShowNewConvModal(false);
        const convObj = data?.conversation || data?.data || data;
        await fetchConversations();
        fetchChatContacts();
        if (convObj?.id) {
          setActiveConversation(convObj);
          fetchMessages(convObj.id);
        }
        showToast(`Chat started with ${contact.name}`);
      } else {
        showToast(data?.message || "Failed to start conversation.");
      }
    } catch (err: any) {
      showToast(err?.message || "Error starting conversation.");
    } finally {
      setLaunchingChatId(null);
    }
  };

  /* ── Reaction Toggle (POST /api/chat/conversations/{id}/messages/{messageId}/react) ── */
  const handleToggleReaction = async (messageId: number, emoji: string) => {
    if (!activeConversation) return;
    const convId = activeConversation.id;

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const currentReactions: any[] = Array.isArray(m.reactions) ? [...m.reactions] : [];
        const existingIdx = currentReactions.findIndex(
          (r: any) => (typeof r === "string" ? r === emoji : r.emoji === emoji)
        );
        let updated: any[];
        if (existingIdx >= 0) {
          updated = currentReactions.filter((_, idx) => idx !== existingIdx);
        } else {
          updated = [...currentReactions, { emoji, count: 1, users: [{ id: parentUser?.id || 1, name: parentUser?.name || "Parent" }] }];
        }
        return { ...m, reactions: updated };
      })
    );
    setActiveReactionMessageId(null);

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/chat/conversations/${convId}/messages/${messageId}/react`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ emoji }),
      });
      if (!res.ok) {
        // Rollback on failure by re-syncing from server
        fetchMessages(convId, true);
      }
    } catch {
      fetchMessages(convId, true);
    }
  };

  /* ── Edit Message (PATCH /api/chat/conversations/{id}/messages/{messageId}) ── */
  const handleEditMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !editingMessageId || !editingMessageText.trim()) return;
    const convId = activeConversation.id;
    const msgId = editingMessageId;
    const newBody = editingMessageText.trim();

    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, body: newBody, edited_at: new Date().toISOString() } : m))
    );
    setEditingMessageId(null);
    setEditingMessageText("");
    setIsEditingMessage(false);

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/chat/conversations/${convId}/messages/${msgId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ body: newBody }),
      });
      if (res.ok) {
        showToast("Message updated.");
        // Optimistic update already applied — no refetch needed
      } else {
        // Rollback on error
        fetchMessages(convId, true);
      }
    } catch {
      fetchMessages(convId, true);
    }
  };

  /* ── Delete Message (DELETE /api/chat/conversations/{id}/messages/{messageId}) ── */
  const handleDeleteMessage = async (messageId: number) => {
    if (!activeConversation) return;
    if (!confirm("Are you sure you want to delete this message?")) return;
    const convId = activeConversation.id;

    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, is_deleted: true, deleted_at: new Date().toISOString(), body: undefined, attachment_url: undefined } : m))
    );

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/chat/conversations/${convId}/messages/${messageId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        showToast("Message deleted.");
        // Optimistic update already applied — no refetch needed
      } else {
        // Rollback on error
        fetchMessages(convId, true);
      }
    } catch {
      fetchMessages(convId, true);
    }
  };

  useEffect(() => {
    if (activeTab === "messages") {
      fetchConversations();
      fetchChatContacts();
      fetchUnreadCount();
    }
  }, [activeTab]);

  const currentChild = children.find((c) => c.id === selectedChildId) || children[0];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070f18",
        color: "#f8fafc",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* ── Top Navbar ── */}
      <nav
        style={{
          height: "68px",
          background: "rgba(11, 22, 34, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              textDecoration: "none",
              color: "#fff",
            }}
          >
            <div
              style={{
                width: "2.3rem",
                height: "2.3rem",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #20b2a4",
              }}
            >
              <Image
                src="/images/samin_logo.jpeg"
                alt="Samin Tutors"
                width={36}
                height={36}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <span style={{ fontSize: "1.2rem", fontWeight: 800 }}>
              <span style={{ color: "#20b2a4" }}>Samin</span> Guardian Portal
            </span>
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <NotificationEnvelope />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 0.8rem",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <ShieldCheck size={16} color="#20b2a4" />
            <div style={{ fontSize: "0.82rem", lineHeight: 1.2 }}>
              <div style={{ fontWeight: 700, color: "#fff" }}>{parentUser?.name || "Guardian"}</div>
              <div style={{ fontSize: "0.72rem", color: "#20b2a4", textTransform: "capitalize" }}>Parent / Guardian</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              borderRadius: "8px",
              padding: "0.45rem 0.85rem",
              cursor: isLoggingOut ? "not-allowed" : "pointer",
              fontSize: "0.82rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              opacity: isLoggingOut ? 0.7 : 1,
            }}
          >
            {isLoggingOut ? (
              <>
                <span
                  style={{
                    width: "13px",
                    height: "13px",
                    border: "2px solid rgba(252,165,165,0.35)",
                    borderTopColor: "#fca5a5",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <span>Signing out…</span>
              </>
            ) : (
              <>
                <LogOut size={14} />
                <span>Sign Out</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* ── Main Dashboard Body ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Child Selector & Welcome Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(32, 178, 164, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)",
            border: "1px solid rgba(32, 178, 164, 0.25)",
            borderRadius: "16px",
            padding: "1.75rem",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.25rem",
          }}
        >
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#20b2a4", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>
              <UserCheck size={14} />
              <span>Ward Overview</span>
            </div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff", margin: 0 }}>
              Monitoring: <span style={{ color: "#20b2a4" }}>{currentChild?.name}</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", marginTop: "0.3rem", marginBottom: 0 }}>
              Curriculum: <strong>{currentChild?.level}</strong> &bull; Subjects: {currentChild?.subjects.join(", ")}
            </p>
          </div>

          {/* Child Switcher Pills if multiple */}
          {children.length > 1 && (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {children.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => setSelectedChildId(child.id)}
                  style={{
                    padding: "0.5rem 0.9rem",
                    borderRadius: "8px",
                    border: selectedChildId === child.id ? "1px solid #20b2a4" : "1px solid rgba(255, 255, 255, 0.12)",
                    background: selectedChildId === child.id ? "#20b2a4" : "rgba(255, 255, 255, 0.05)",
                    color: selectedChildId === child.id ? "#070f18" : "#fff",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                  }}
                >
                  {child.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Key Metrics Cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "1.25rem",
            }}
          >
            <div style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600 }}>Lesson Attendance</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#20b2a4", marginTop: "0.3rem" }}>
              {currentChild?.attendanceRate}%
            </div>
            <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "0.2rem" }}>✓ Exemplary attendance</div>
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "1.25rem",
            }}
          >
            <div style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600 }}>Completed Lessons</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginTop: "0.3rem" }}>
              {currentChild?.completedLessons}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.2rem" }}>Total 1-on-1 hours</div>
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "1.25rem",
            }}
          >
            <div style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600 }}>Upcoming Scheduled</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#ffd56b", marginTop: "0.3rem" }}>
              {sessions.length}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.2rem" }}>Next: {sessions[0]?.date || "TBD"}</div>
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "1.25rem",
            }}
          >
            <div style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600 }}>Active Homework</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#38bdf8", marginTop: "0.3rem" }}>
              {assignments.filter((a) => a.status === "assigned").length}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.2rem" }}>Awaiting submission</div>
          </div>
        </div>

        {/* ── Tabs Navigation ── */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            marginBottom: "1.75rem",
            paddingBottom: "0.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            style={{
              padding: "0.6rem 1rem",
              background: activeTab === "overview" ? "rgba(32, 178, 164, 0.15)" : "transparent",
              color: activeTab === "overview" ? "#20b2a4" : "#94a3b8",
              border: "none",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
            }}
          >
            Upcoming Lessons
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("homework")}
            style={{
              padding: "0.6rem 1rem",
              background: activeTab === "homework" ? "rgba(32, 178, 164, 0.15)" : "transparent",
              color: activeTab === "homework" ? "#20b2a4" : "#94a3b8",
              border: "none",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
            }}
          >
            Homework &amp; Grades
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("messages")}
            style={{
              padding: "0.6rem 1rem",
              background: activeTab === "messages" ? "rgba(32, 178, 164, 0.15)" : "transparent",
              color: activeTab === "messages" ? "#20b2a4" : "#94a3b8",
              border: "none",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
            }}
          >
            <MessageSquare size={16} />
            <span>Messages &amp; Support</span>
            {chatUnreadCount > 0 && (
              <span
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  fontSize: "0.65rem",
                  padding: "0.1rem 0.45rem",
                  borderRadius: "10px",
                  fontWeight: 800,
                }}
              >
                {chatUnreadCount}
              </span>
            )}
          </button>
        </div>

        {/* ── Messages & Support Tab (GET /api/parent/chat-contacts & GET /api/chat/conversations) ── */}
        {activeTab === "messages" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(300px, 360px) 1fr",
              gap: "1.25rem",
              minHeight: "650px",
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {/* Left Column: Contacts & Conversations */}
            <div
              style={{
                borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
                background: "rgba(11, 22, 34, 0.6)",
              }}
            >
              {/* Sidebar Header & Search */}
              <div
                style={{
                  padding: "1rem 1.25rem",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#fff", margin: 0 }}>
                    Messages &amp; Tutors
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowNewConvModal(true)}
                    style={{
                      padding: "0.35rem 0.75rem",
                      borderRadius: "6px",
                      background: "rgba(32, 178, 164, 0.2)",
                      border: "1px solid #20b2a4",
                      color: "#20b2a4",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <MessageSquare size={13} />
                    New Message
                  </button>
                </div>

                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Search size={14} color="#64748b" style={{ position: "absolute", left: "0.7rem", pointerEvents: "none" }} />
                  <input
                    type="text"
                    placeholder="Search tutors or messages..."
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.45rem 0.75rem 0.45rem 2.1rem",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      background: "rgba(15, 23, 42, 0.6)",
                      color: "#f8fafc",
                      fontSize: "0.78rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Contacts / Conversations List */}
              <div style={{ flex: 1, overflowY: "auto", maxHeight: "560px" }}>
                {loadingConversations && loadingChatContacts ? (
                  <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#64748b" }}>
                    <RefreshCw size={22} className="spin" style={{ margin: "0 auto 0.5rem", display: "block" }} />
                    <p style={{ fontSize: "0.8rem", margin: 0 }}>Loading tutors &amp; messages…</p>
                  </div>
                ) : (() => {
                  const adminContact = adminSupportContact || {
                    user_id: "admin",
                    name: "Admin Support",
                    role: "admin",
                    subject: "Platform Support",
                    has_existing_conversation: conversations.some(
                      (c) => c.type === "parent_admin" || c.other_participants?.some((p) => p.role === "admin")
                    ),
                    conversation_id:
                      conversations.find(
                        (c) => c.type === "parent_admin" || c.other_participants?.some((p) => p.role === "admin")
                      )?.id || null,
                  };

                  const matchedAdminConv = conversations.find(
                    (c) =>
                      c.type === "parent_admin" ||
                      (adminContact.conversation_id && c.id === adminContact.conversation_id) ||
                      c.other_participants?.some((p) => p.role === "admin")
                  );

                  const adminItem = {
                    key: "contact-admin-support",
                    id: adminContact.conversation_id || matchedAdminConv?.id || null,
                    contact: adminContact,
                    conversation: matchedAdminConv || null,
                    hasHistory: Boolean(adminContact.has_existing_conversation || matchedAdminConv),
                    name: "Admin Support",
                    subject: "Platform & Account Support",
                    subtitle: matchedAdminConv?.latest_message?.body || "Direct line to Samin Admin Support",
                    unread_count: matchedAdminConv?.unread_count || 0,
                    last_message_at: matchedAdminConv?.last_message_at || matchedAdminConv?.latest_message?.created_at || null,
                    isAdmin: true,
                  };

                  const tutorItems = chatContacts.map((contact) => {
                    const matchedConv = conversations.find((c) => {
                      if (contact.conversation_id && c.id === contact.conversation_id) return true;
                      return c.other_participants?.some((p) => p.id === contact.user_id);
                    });

                    return {
                      key: `tutor-${contact.user_id}`,
                      id: contact.conversation_id || matchedConv?.id || null,
                      contact,
                      conversation: matchedConv || null,
                      hasHistory: Boolean(contact.has_existing_conversation || matchedConv),
                      name: contact.name,
                      subject: contact.subject || "Assigned Tutor",
                      subtitle: matchedConv?.latest_message?.body
                        ? matchedConv.latest_message.body
                        : matchedConv?.subject
                        ? matchedConv.subject
                        : contact.subject
                        ? `Tutor • ${contact.subject}`
                        : "Assigned Tutor",
                      unread_count: matchedConv?.unread_count || 0,
                      last_message_at: matchedConv?.last_message_at || matchedConv?.latest_message?.created_at || null,
                      isAdmin: false,
                    };
                  });

                  const otherConvItems = conversations
                    .filter((c) => {
                      const otherId = c.other_participants?.[0]?.id;
                      if (c.id === adminItem.id || c.type === "parent_admin" || c.other_participants?.some((p) => p.role === "admin")) return false;
                      return !tutorItems.some((ti) => ti.contact.user_id === otherId || ti.id === c.id);
                    })
                    .map((c) => ({
                      key: `conv-${c.id}`,
                      id: c.id,
                      contact: null,
                      conversation: c,
                      hasHistory: true,
                      name: c.other_participants?.[0]?.name || "Conversation",
                      subject: c.subject,
                      subtitle: c.latest_message?.body || c.subject || "Direct Message",
                      unread_count: c.unread_count || 0,
                      last_message_at: c.last_message_at || c.latest_message?.created_at || null,
                      isAdmin: false,
                    }));

                  const allItems = [adminItem, ...tutorItems, ...otherConvItems].filter((item) => {
                    if (!chatSearch.trim()) return true;
                    const q = chatSearch.toLowerCase();
                    return item.name.toLowerCase().includes(q) || (item.subject || "").toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q);
                  });

                  return (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {allItems.map((item) => {
                        const isSelected = activeConversation?.id === item.id;

                        return (
                          <div
                            key={item.key}
                            onClick={() => {
                              if (item.conversation) {
                                setActiveConversation(item.conversation);
                                fetchMessages(item.conversation.id);
                              } else if (item.contact) {
                                handleLaunchContactChat(item.contact);
                              }
                            }}
                            style={{
                              padding: "0.85rem 1.1rem",
                              borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                              cursor: "pointer",
                              background: isSelected ? "rgba(32, 178, 164, 0.15)" : "transparent",
                              borderLeft: isSelected ? "3px solid #20b2a4" : "3px solid transparent",
                              transition: "background 0.15s ease",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  background: item.isAdmin
                                    ? "linear-gradient(135deg,#0284c7,#0369a1)"
                                    : item.hasHistory
                                    ? "linear-gradient(135deg,#20b2a4,#0d9488)"
                                    : "rgba(255, 255, 255, 0.1)",
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 800,
                                  fontSize: "0.82rem",
                                  flexShrink: 0,
                                  overflow: "hidden",
                                }}
                              >
                                {item.isAdmin ? (
                                  <ShieldCheck size={18} />
                                ) : (item.contact?.profile_photo_url || (item.contact as any)?.photo) ? (
                                  <img src={item.contact?.profile_photo_url || (item.contact as any)?.photo} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                  item.name?.charAt(0) || "T"
                                )}
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.15rem" }}>
                                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {item.name}
                                  </span>
                                  {item.last_message_at && (
                                    <span style={{ fontSize: "0.68rem", color: "#64748b" }}>
                                      {new Date(item.last_message_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                    </span>
                                  )}
                                </div>

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <p
                                    style={{
                                      fontSize: "0.72rem",
                                      color: "#94a3b8",
                                      margin: 0,
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      maxWidth: "180px",
                                    }}
                                  >
                                    {item.subtitle}
                                  </p>

                                  {item.unread_count > 0 && (
                                    <span
                                      style={{
                                        background: "#ef4444",
                                        color: "#fff",
                                        fontSize: "0.62rem",
                                        fontWeight: 800,
                                        borderRadius: "10px",
                                        padding: "0.08rem 0.38rem",
                                        minWidth: "16px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {item.unread_count}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Right Column: Active Conversation */}
            <div style={{ display: "flex", flexDirection: "column", background: "rgba(11, 22, 34, 0.4)" }}>
              {!activeConversation ? (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "3rem 2rem",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "rgba(32, 178, 164, 0.15)",
                      color: "#20b2a4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <MessageSquare size={28} />
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", margin: "0 0 0.4rem 0" }}>
                    Select a Conversation
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "#94a3b8", maxWidth: "360px", margin: 0, lineHeight: 1.5 }}>
                    Choose your child&apos;s assigned tutor or Admin Support to discuss progress, schedule queries, or lesson materials.
                  </p>
                </div>
              ) : (
                <>
                  {/* Conversation Header */}
                  <div
                    style={{
                      padding: "0.9rem 1.25rem",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                      background: "rgba(15, 23, 42, 0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background:
                            activeConversation.type === "parent_admin"
                              ? "linear-gradient(135deg,#0284c7,#0369a1)"
                              : "linear-gradient(135deg,#20b2a4,#0d9488)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                        }}
                      >
                        {activeConversation.type === "parent_admin" ? (
                          <ShieldCheck size={18} />
                        ) : (
                          activeConversation.other_participants?.[0]?.name?.charAt(0) || "T"
                        )}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#fff" }}>
                            {activeConversation.other_participants?.[0]?.name || activeConversation.subject || "Chat"}
                          </span>
                          <span
                            style={{
                              fontSize: "0.64rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              padding: "0.1rem 0.4rem",
                              borderRadius: "4px",
                              background:
                                activeConversation.type === "parent_admin"
                                  ? "rgba(14, 165, 233, 0.2)"
                                  : "rgba(32, 178, 164, 0.2)",
                              color: activeConversation.type === "parent_admin" ? "#38bdf8" : "#20b2a4",
                            }}
                          >
                            {activeConversation.type === "parent_admin" ? "Admin Support" : "Tutor"}
                          </span>
                        </div>
                        <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                          {activeConversation.subject || "Direct Message Thread"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => fetchMessages(activeConversation.id)}
                      disabled={loadingMessages}
                      style={{
                        padding: "0.35rem 0.65rem",
                        borderRadius: "6px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "#94a3b8",
                        fontSize: "0.74rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <RefreshCw size={12} className={loadingMessages ? "spin" : ""} />
                      Sync
                    </button>
                  </div>

                  {/* Messages Scroll Area */}
                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      padding: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.85rem",
                      maxHeight: "480px",
                    }}
                  >
                    {loadingMessages && messages.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                        <RefreshCw size={20} className="spin" style={{ margin: "0 auto 0.5rem", display: "block" }} />
                        <p style={{ fontSize: "0.8rem", margin: 0 }}>Loading messages…</p>
                      </div>
                    ) : messages.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                        <p style={{ fontSize: "0.84rem", margin: 0 }}>No messages yet. Send a message to start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isOwn = msg.sender?.role === "parent";
                        const canModify = isOwn && !msg.is_deleted;

                        return (
                          <div
                            key={msg.id}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignSelf: isOwn ? "flex-end" : "flex-start",
                              maxWidth: "75%",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.4rem",
                                fontSize: "0.68rem",
                                color: "#64748b",
                                marginBottom: "0.2rem",
                                alignSelf: isOwn ? "flex-end" : "flex-start",
                              }}
                            >
                              <span style={{ fontWeight: 600, color: isOwn ? "#20b2a4" : "#94a3b8" }}>
                                {isOwn ? "You" : msg.sender?.name || "Participant"}
                              </span>
                              <span>•</span>
                              <span>
                                {msg.created_at_human ||
                                  (msg.created_at
                                    ? new Date(msg.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
                                    : "")}
                              </span>
                              {msg.edited_at && <span style={{ fontStyle: "italic" }}>(edited)</span>}
                            </div>

                            <div
                              style={{
                                padding: "0.7rem 0.95rem",
                                borderRadius: isOwn ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                                background: msg.is_deleted
                                  ? "rgba(239, 68, 68, 0.1)"
                                  : isOwn
                                  ? "#20b2a4"
                                  : "rgba(30, 41, 59, 0.85)",
                                border: msg.is_deleted
                                  ? "1px dashed rgba(239, 68, 68, 0.3)"
                                  : isOwn
                                  ? "none"
                                  : "1px solid rgba(255, 255, 255, 0.08)",
                                color: msg.is_deleted ? "#fca5a5" : "#fff",
                                fontSize: "0.82rem",
                                lineHeight: 1.45,
                                position: "relative",
                              }}
                            >
                              {msg.is_deleted ? (
                                <span style={{ fontStyle: "italic", fontSize: "0.76rem" }}>
                                  [Message deleted by sender]
                                </span>
                              ) : (
                                <>
                                  {msg.body && <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.body}</div>}

                                  {msg.attachment_url && (
                                    <div style={{ marginTop: msg.body ? "0.5rem" : "0" }}>
                                      <a
                                        href={msg.attachment_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "0.35rem",
                                          padding: "0.35rem 0.65rem",
                                          borderRadius: "6px",
                                          background: "rgba(0, 0, 0, 0.25)",
                                          color: "#fff",
                                          fontSize: "0.74rem",
                                          textDecoration: "none",
                                        }}
                                      >
                                        <Paperclip size={13} />
                                        <span>{msg.attachment_name || "Attachment"}</span>
                                      </a>
                                    </div>
                                  )}

                                  {/* Reactions list */}
                                  {msg.reactions && Array.isArray(msg.reactions) && msg.reactions.length > 0 && (
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginTop: "0.4rem" }}>
                                      {msg.reactions.map((r: any, rIdx: number) => (
                                        <span
                                          key={rIdx}
                                          onClick={() => handleToggleReaction(msg.id, r.emoji || r)}
                                          style={{
                                            fontSize: "0.7rem",
                                            background: "rgba(0,0,0,0.3)",
                                            padding: "0.1rem 0.35rem",
                                            borderRadius: "10px",
                                            cursor: "pointer",
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

                            {/* Action toolbar on hover / below */}
                            {canModify && (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "0.4rem",
                                  marginTop: "0.2rem",
                                  alignSelf: isOwn ? "flex-end" : "flex-start",
                                  fontSize: "0.68rem",
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMessageId(msg.id);
                                    setEditingMessageText(msg.body || "");
                                    setIsEditingMessage(true);
                                  }}
                                  style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "0.1rem 0.3rem" }}
                                >
                                  Edit
                                </button>
                                <span style={{ color: "rgba(255,255,255,0.1)" }}>•</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.1rem 0.3rem" }}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Message Composer */}
                  <form
                    onSubmit={isEditingMessage ? handleEditMessage : handleSendMessage}
                    style={{
                      padding: "0.85rem 1.1rem",
                      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                      background: "rgba(15, 23, 42, 0.8)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.45rem",
                    }}
                  >
                    {isEditingMessage && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.72rem", color: "#38bdf8" }}>
                        <span>Editing message...</span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingMessage(false);
                            setEditingMessageId(null);
                            setEditingMessageText("");
                          }}
                          style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {messageFile && !isEditingMessage && (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          background: "rgba(32, 178, 164, 0.15)",
                          border: "1px solid #20b2a4",
                          borderRadius: "6px",
                          padding: "0.2rem 0.5rem",
                          fontSize: "0.72rem",
                          color: "#20b2a4",
                          width: "fit-content",
                        }}
                      >
                        <Paperclip size={13} />
                        <span>{messageFile.name}</span>
                        <button
                          type="button"
                          onClick={() => setMessageFile(null)}
                          style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex" }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="text"
                        placeholder="Type a message to tutor or admin..."
                        value={isEditingMessage ? editingMessageText : messageBody}
                        onChange={(e) => (isEditingMessage ? setEditingMessageText(e.target.value) : setMessageBody(e.target.value))}
                        style={{
                          flex: 1,
                          padding: "0.55rem 0.85rem",
                          borderRadius: "8px",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          background: "rgba(7, 15, 24, 0.7)",
                          color: "#fff",
                          fontSize: "0.82rem",
                          outline: "none",
                        }}
                      />

                      {!isEditingMessage && (
                        <label
                          style={{
                            padding: "0.5rem 0.65rem",
                            borderRadius: "8px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            background: "rgba(255, 255, 255, 0.05)",
                            color: "#94a3b8",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title="Attach file"
                        >
                          <Paperclip size={15} />
                          <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) setMessageFile(e.target.files[0]);
                            }}
                          />
                        </label>
                      )}

                      <button
                        type="submit"
                        disabled={isSendingMessage || (!isEditingMessage && !messageBody.trim() && !messageFile)}
                        style={{
                          padding: "0.55rem 1rem",
                          borderRadius: "8px",
                          border: "none",
                          background: isSendingMessage || (!isEditingMessage && !messageBody.trim() && !messageFile) ? "rgba(255,255,255,0.1)" : "#20b2a4",
                          color: "#fff",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: isSendingMessage || (!isEditingMessage && !messageBody.trim() && !messageFile) ? "not-allowed" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                        }}
                      >
                        <Send size={13} />
                        {isSendingMessage ? "Sending..." : isEditingMessage ? "Save" : "Send"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── New Message / Contact Picker Modal ── */}
        {showNewConvModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
            onClick={() => setShowNewConvModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#0b1622",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "460px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#fff", margin: 0 }}>
                    Start New Conversation
                  </h3>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.2rem 0 0" }}>
                    Select your child&apos;s tutor or Admin Support to message.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewConvModal(false)}
                  style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
                >
                  <X size={18} />
                </button>
              </div>

              <input
                type="text"
                placeholder="Search contact by name..."
                value={contactModalSearch}
                onChange={(e) => setContactModalSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.8rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  background: "rgba(15, 23, 42, 0.6)",
                  color: "#fff",
                  fontSize: "0.8rem",
                  outline: "none",
                }}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "300px", overflowY: "auto" }}>
                {(() => {
                  const adminContact = adminSupportContact || {
                    user_id: "admin",
                    name: "Admin Support",
                    role: "admin",
                    subject: "Platform Support",
                    has_existing_conversation: false,
                    conversation_id: null,
                  };

                  const allContacts = [adminContact, ...chatContacts].filter((c) =>
                    contactModalSearch ? c.name.toLowerCase().includes(contactModalSearch.toLowerCase()) : true
                  );

                  return allContacts.map((contact) => {
                    const isAdmin = contact.role === "admin" || contact.user_id === "admin";
                    const isLaunching = launchingChatId === contact.user_id;

                    return (
                      <div
                        key={contact.user_id}
                        onClick={() => !isLaunching && handleLaunchContactChat(contact)}
                        style={{
                          padding: "0.75rem 0.9rem",
                          borderRadius: "10px",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          background: "rgba(15, 23, 42, 0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: isLaunching ? "wait" : "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: isAdmin
                                ? "linear-gradient(135deg,#0284c7,#0369a1)"
                                : "linear-gradient(135deg,#20b2a4,#0d9488)",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              fontSize: "0.82rem",
                            }}
                          >
                            {isAdmin ? <ShieldCheck size={18} /> : contact.name?.charAt(0) || "T"}
                          </div>
                          <div>
                            <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#fff" }}>{contact.name}</div>
                            <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                              {isAdmin ? "Samin Admin Support" : contact.subject || "Assigned Tutor"}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={isLaunching}
                          style={{
                            padding: "0.35rem 0.7rem",
                            borderRadius: "6px",
                            background: "#20b2a4",
                            color: "#fff",
                            border: "none",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            cursor: isLaunching ? "wait" : "pointer",
                          }}
                        >
                          {isLaunching ? "Opening..." : "Chat"}
                        </button>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ── Toast Notification ── */}
        {toastMessage && (
          <div
            style={{
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              background: "#0f172a",
              color: "#fff",
              border: "1px solid #20b2a4",
              borderRadius: "10px",
              padding: "0.75rem 1.25rem",
              fontSize: "0.82rem",
              fontWeight: 600,
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <CheckCircle2 size={16} color="#20b2a4" />
            <span>{toastMessage}</span>
          </div>
        )}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gap: "1rem" }}>
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  style={{
                    background: "rgba(15, 23, 42, 0.75)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          background: "rgba(32, 178, 164, 0.2)",
                          color: "#20b2a4",
                        }}
                      >
                        {sess.date} &bull; {sess.start_time} - {sess.end_time}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: "0.2rem 0" }}>
                      {sess.subject}
                    </h3>
                    <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0 }}>
                      Assigned Tutor: <strong style={{ color: "#f8fafc" }}>{sess.tutor_name}</strong>
                    </p>
                  </div>

                  {sess.meeting_link && (
                    <a
                      href={sess.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "0.6rem 1.1rem",
                        background: "rgba(32, 178, 164, 0.15)",
                        border: "1px solid #20b2a4",
                        color: "#20b2a4",
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <Video size={15} />
                      <span>Join Lesson Room</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Homework & Grades Tab ── */}
        {activeTab === "homework" && (
          <div>
            <div style={{ display: "grid", gap: "1rem" }}>
              {assignments.map((hw) => (
                <div
                  key={hw.id}
                  style={{
                    background: "rgba(15, 23, 42, 0.75)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    padding: "1.25rem 1.5rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                    <div>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          background: "rgba(255, 255, 255, 0.08)",
                          color: "#cbd5e1",
                          display: "inline-block",
                          marginBottom: "0.4rem",
                        }}
                      >
                        {hw.subject} &bull; Due: {hw.due_date}
                      </span>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: "0.2rem 0" }}>
                        {hw.title}
                      </h3>
                      {hw.feedback && (
                        <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.4rem" }}>
                          Tutor Feedback: &ldquo;<em>{hw.feedback}</em>&rdquo;
                        </p>
                      )}
                    </div>

                    <div style={{ textAlign: "right" }}>
                      {hw.grade ? (
                        <div
                          style={{
                            padding: "0.4rem 0.8rem",
                            borderRadius: "8px",
                            background: "rgba(16, 185, 129, 0.15)",
                            border: "1px solid #10b981",
                            color: "#10b981",
                            fontWeight: 800,
                            fontSize: "1rem",
                          }}
                        >
                          Grade: {hw.grade}
                        </div>
                      ) : (
                        <span
                          style={{
                            padding: "0.3rem 0.7rem",
                            borderRadius: "6px",
                            background: "rgba(234, 179, 8, 0.15)",
                            color: "#ffd56b",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                          }}
                        >
                          Assigned
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
