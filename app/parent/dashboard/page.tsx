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

export default function ParentDashboard() {
  const router = useRouter();

  const [parentUser, setParentUser] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "sessions" | "homework" | "tutors">("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
            style={{
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              borderRadius: "8px",
              padding: "0.45rem 0.85rem",
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
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
        </div>

        {/* ── Upcoming Lessons Tab ── */}
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
