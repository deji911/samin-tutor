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

type BookingStatus = "New Inquiry" | "Diagnostic Scheduled" | "Tutor Matched" | "Active Student";

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
  date: string;
  tutorAssigned: string;
};

type NavTab = "overview" | "applicants" | "tutors" | "bookings";

/* ─── Seed data ───────────────────────────────────────────── */
const seedApplicants: Applicant[] = [
  {
    id: "APP-101",
    name: "Dr. Evelyn Reed",
    email: "evelyn.reed@oxfordalumni.org",
    phone: "+44 7922 419283",
    degree: "PhD Astrophysics \u00b7 Oxford University",
    subjects: ["Physics", "Mathematics"],
    levels: ["GCSE preparation", "A level preparation"],
    appliedAt: "Today, 11:20 AM",
    notes: "Over 6 years tutoring A-Level Physics and Further Maths with a 94% A*/A track record.",
  },
  {
    id: "APP-102",
    name: "Marcus Vance",
    email: "m.vance@ucl.ac.uk",
    phone: "+44 7710 882910",
    degree: "BSc Computer Science \u00b7 UCL",
    subjects: ["Computer Science", "Mathematics"],
    levels: ["Year 7-11", "GCSE preparation"],
    appliedAt: "Yesterday, 3:45 PM",
    notes: "Software engineer and seasoned coding tutor for Python, GCSE CS and algebra.",
  },
];

const seedTutors: Tutor[] = [
  { id: "TUT-01", name: "David Zhang, MSc", school: "Imperial College London", subject: "Pure & Further Maths", students: 18, region: "UK & Canada", img: "/images/tutor-1.jpg", rate: "\u00a345/hr" },
  { id: "TUT-02", name: "Dr. Sophia Ramirez, PhD", school: "Oxford University", subject: "Chemistry, Biology & Med", students: 22, region: "UK & USA", img: "/images/tutor-2.jpg", rate: "\u00a355/hr" },
  { id: "TUT-03", name: "Marcus Sterling, MA", school: "Cambridge University", subject: "English Lit & 11+", students: 16, region: "All Timezones", img: "/images/tutor-3.jpg", rate: "\u00a340/hr" },
];

const seedBookings: Booking[] = [
  { id: "SAM-8021", parent: "Sarah Jenkins", student: "Liam (Year 11)", subject: "Higher Mathematics", level: "GCSE preparation", country: "\ud83c\uddec\ud83c\udde7 UK (London)", phone: "+44 7911 123456", email: "sarah.j@email.com", status: "Diagnostic Scheduled", date: "Today, 10:30 AM", tutorAssigned: "David Zhang, MSc" },
  { id: "SAM-8022", parent: "Dr. Matthew Cole", student: "Emily (Grade 12)", subject: "Pure Maths & Calculus", level: "A level preparation", country: "\ud83c\udde8\ud83c\udde6 Canada (Toronto)", phone: "+1 416 555 0192", email: "m.cole@email.com", status: "New Inquiry", date: "Today, 09:15 AM", tutorAssigned: "Pending Match" },
  { id: "SAM-8023", parent: "Olivia Fraser", student: "Callum (S4)", subject: "Nat 5 Physics & Maths", level: "National 5 preparation", country: "\ud83c\uddec\ud83c\udde7 UK (Edinburgh)", phone: "+44 7700 900821", email: "o.fraser@email.com", status: "Tutor Matched", date: "Yesterday", tutorAssigned: "Dr. Sophia Ramirez" },
  { id: "SAM-8024", parent: "Robert Vance", student: "Alexander (Grade 5)", subject: "Numeracy & Phonics", level: "Year 1-6", country: "\ud83c\uddfa\ud83c\uddf8 USA (New York)", phone: "+1 212 555 7834", email: "r.vance@email.com", status: "Active Student", date: "2 days ago", tutorAssigned: "Marcus Sterling, MA" },
  { id: "SAM-8025", parent: "Grace Adebayo", student: "Tobi (Year 5)", subject: "Verbal & Non-Verbal Logic", level: "11 Plus preparation", country: "\ud83c\uddec\ud83c\udde7 UK (Birmingham)", phone: "+44 7820 445566", email: "g.adebayo@email.com", status: "New Inquiry", date: "3 days ago", tutorAssigned: "Pending Match" },
];

const statusStyle: Record<BookingStatus, { bg: string; color: string }> = {
  "New Inquiry": { bg: "#fef3c7", color: "#b45309" },
  "Diagnostic Scheduled": { bg: "#dbeafe", color: "#1d4ed8" },
  "Tutor Matched": { bg: "#d1fae5", color: "#065f46" },
  "Active Student": { bg: "#e0f2fe", color: "#0369a1" },
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

  // Dashboard
  const [activeTab, setActiveTab] = useState<NavTab>("overview");
  const [applicants, setApplicants] = useState<Applicant[]>(seedApplicants);
  const [tutors, setTutors] = useState<Tutor[]>(seedTutors);
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);
  const [searchApplicants, setSearchApplicants] = useState("");
  const [searchTutors, setSearchTutors] = useState("");
  const [searchBookings, setSearchBookings] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedApplicant, setExpandedApplicant] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isAddTutorOpen, setIsAddTutorOpen] = useState(false);
  const [newTutor, setNewTutor] = useState({
    name: "",
    school: "University of Cambridge",
    subject: "Mathematics",
    rate: "£45/hr",
    region: "UK 🇬🇧",
    img: "/images/tutor-1.jpg",
  });

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("samin_admin_logged_in") : null;
    if (stored === "true") setIsAuthed(true);
    setChecking(false);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      const cleanEmail = loginEmail.trim().toLowerCase();
      if ((cleanEmail === ADMIN_EMAIL.toLowerCase() || cleanEmail === "admin@samin.edu") && loginPassword === ADMIN_PASSWORD) {
        localStorage.setItem("samin_admin_logged_in", "true");
        setIsAuthed(true);
      } else {
        setLoginError("Invalid credentials");
      }
    }, 700);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("samin_admin_logged_in");
      window.location.href = "/";
    }
  };

  const approveApplicant = (id: string) => {
    const app = applicants.find((a) => a.id === id);
    if (!app) return;
    const newTutor: Tutor = {
      id: `TUT-0${tutors.length + 1}`,
      name: app.name,
      school: app.degree,
      subject: app.subjects.join(", "),
      students: 0,
      region: "UK \ud83c\uddec\ud83c\udde7",
      img: "/images/tutor-1.jpg",
      rate: "\u00a345/hr",
    };
    setTutors((prev) => [newTutor, ...prev]);
    setApplicants((prev) => prev.filter((a) => a.id !== id));
    setExpandedApplicant(null);
    showToast(`\u2705 ${app.name} approved and added to the tutor roster!`);
  };

  const declineApplicant = (id: string) => {
    const app = applicants.find((a) => a.id === id);
    setApplicants((prev) => prev.filter((a) => a.id !== id));
    setExpandedApplicant(null);
    if (app) showToast(`\u274c ${app.name}'s application has been declined.`);
  };

  const removeTutor = (id: string) => {
    const t = tutors.find((x) => x.id === id);
    setTutors((prev) => prev.filter((x) => x.id !== id));
    if (t) showToast(`🗑️ ${t.name} removed from the roster.`);
  };

  const handleAddTutorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTutor.name.trim()) return;
    const created: Tutor = {
      id: `TUT-0${tutors.length + 1}`,
      name: newTutor.name.trim(),
      school: newTutor.school,
      subject: newTutor.subject,
      students: 0,
      region: newTutor.region,
      img: newTutor.img,
      rate: newTutor.rate,
    };
    setTutors((prev) => [created, ...prev]);
    setIsAddTutorOpen(false);
    setNewTutor({
      name: "",
      school: "University of Cambridge",
      subject: "Mathematics",
      rate: "£45/hr",
      region: "UK 🇬🇧",
      img: "/images/tutor-1.jpg",
    });
    showToast(`✅ ${created.name} successfully registered to roster!`);
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
  const filteredBookings = bookings.filter((b) =>
    `${b.parent} ${b.student} ${b.subject} ${b.status}`.toLowerCase().includes(searchBookings.toLowerCase())
  );

  const newInquiries = bookings.filter((b) => b.status === "New Inquiry").length;

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
              <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="saminhometutors@gmail.com"
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
    { tab: "applicants",  icon: <UserPlus size={18} />,        label: "Applicants",  badge: applicants.length },
    { tab: "tutors",      icon: <GraduationCap size={18} />,   label: "Tutors",      badge: tutors.length },
    { tab: "bookings",    icon: <Calendar size={18} />,        label: "Bookings",    badge: newInquiries },
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
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.85rem", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
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
                {activeTab === "bookings" && "Trial Booking Requests"}
              </h1>
              <p style={{ fontSize: "0.73rem", color: "#94a3b8", margin: 0 }}>
                {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#f0fdf9", border: "1px solid #99f6e4", borderRadius: "8px", padding: "0.38rem 0.75rem" }}>
              <ShieldCheck size={14} color="#0d9488" />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0d9488" }}>Admin Active</span>
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

          {/* ── OVERVIEW ─────────────────────────────────── */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(185px,1fr))", gap: "1rem" }}>
                {[
                  { icon: <GraduationCap size={22} color="#20b2a4" />, label: "Active Tutors", value: tutors.length, bg: "#f0fdf9", border: "#99f6e4" },
                  { icon: <UserPlus size={22} color="#d97706" />, label: "Pending Applicants", value: applicants.length, bg: "#fffbeb", border: "#fde68a" },
                  { icon: <Calendar size={22} color="#3b82f6" />, label: "Trial Requests", value: bookings.length, bg: "#eff6ff", border: "#bfdbfe" },
                  { icon: <Star size={22} color="#8b5cf6" />, label: "Satisfaction Rate", value: "98%", bg: "#f5f3ff", border: "#ddd6fe" },
                  { icon: <TrendingUp size={22} color="#10b981" />, label: "Students Helped", value: "5k+", bg: "#ecfdf5", border: "#a7f3d0" },
                ].map(({ icon, label, value, bg, border }) => (
                  <div key={label} className="dash-card" style={{ padding: "1.15rem 1.3rem", display: "flex", alignItems: "center", gap: "1rem", border: `1.5px solid ${border}`, background: bg }}>
                    <div style={{ width: "2.8rem", height: "2.8rem", borderRadius: "10px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{value}</div>
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
                  <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>Recent Trial Requests</h3>
                  <button onClick={() => setActiveTab("bookings")} style={{ background: "none", border: "none", color: "#20b2a4", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                    View all <ChevronRight size={14} />
                  </button>
                </div>
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
              </div>
            </div>
          )}

          {/* ── APPLICANTS ───────────────────────────────── */}
          {activeTab === "applicants" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="page-enter">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                <div className="search-box" style={{ flex: 1, maxWidth: "340px" }}>
                  <Search size={15} color="#94a3b8" />
                  <input value={searchApplicants} onChange={(e) => setSearchApplicants(e.target.value)} placeholder="Search applicants\u2026" />
                </div>
                <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>{filteredApplicants.length} pending</span>
              </div>

              {filteredApplicants.length === 0 ? (
                <div className="dash-card" style={{ padding: "3.5rem 2rem", textAlign: "center" }}>
                  <CheckCircle2 size={40} color="#20b2a4" style={{ marginBottom: "0.75rem" }} />
                  <p style={{ fontWeight: 700, color: "#0f172a", margin: "0 0 0.3rem" }}>All clear!</p>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>No pending applicants right now.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))", gap: "1rem" }}>
                  {filteredApplicants.map((app) => (
                    <div key={app.id} className="dash-card" style={{ padding: "1.2rem", border: "1.5px solid #e2e8f0", cursor: "pointer" }}
                      onClick={() => setExpandedApplicant(expandedApplicant === app.id ? null : app.id)}>
                      {/* Header */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem", marginBottom: "0.8rem" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", flexShrink: 0 }}>
                          {app.name.charAt(0)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: "0.93rem", color: "#0f172a" }}>{app.name}</div>
                          <div style={{ fontSize: "0.76rem", color: "#64748b" }}>{app.degree}</div>
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

                      {/* Email */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.76rem", color: "#64748b", marginBottom: "0.8rem" }}>
                        <Mail size={12} /> {app.email}
                      </div>

                      {/* Expanded bio */}
                      {expandedApplicant === app.id && (
                        <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "0.7rem 0.85rem", marginBottom: "0.8rem", fontSize: "0.78rem", color: "#475569", lineHeight: 1.65, borderLeft: "3px solid #20b2a4" }}>
                          {app.notes}
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: "flex", gap: "0.45rem" }}>
                        <button onClick={(e) => { e.stopPropagation(); approveApplicant(app.id); }}
                          className="action-btn" style={{ background: "#d1fae5", color: "#065f46", flex: 1, justifyContent: "center" }}>
                          <CheckCircle2 size={13} /> Approve & Onboard
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
                    <Plus size={15} />
                    <span>Add New Tutor</span>
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: "1rem" }}>
                {filteredTutors.map((t) => (
                  <div key={t.id} className="dash-card" style={{ padding: "1.2rem", border: "1.5px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.85rem" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "50%", overflow: "hidden", border: "2px solid #20b2a4", flexShrink: 0 }}>
                        <Image src={t.img} alt={t.name} width={48} height={48} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: "0.88rem", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                        <div style={{ fontSize: "0.73rem", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.school}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem" }}>
                      {t.subject.split(",").map((s) => (
                        <span key={s} style={{ fontSize: "0.7rem", background: "#f0fdf9", color: "#0d9488", border: "1px solid #99f6e4", padding: "0.12rem 0.45rem", borderRadius: "20px", fontWeight: 600 }}>{s.trim()}</span>
                      ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "0.85rem" }}>
                      {[
                        { l: "Students", v: `${t.students} active` },
                        { l: "Rate", v: t.rate },
                        { l: "Region", v: t.region },
                        { l: "ID", v: t.id },
                      ].map(({ l, v }) => (
                        <div key={l} style={{ background: "#f8fafc", borderRadius: "6px", padding: "0.32rem 0.55rem" }}>
                          <div style={{ fontSize: "0.62rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{l}</div>
                          <div style={{ fontSize: "0.76rem", color: "#0f172a", fontWeight: 700 }}>{v}</div>
                        </div>
                      ))}
                    </div>

                    <button onClick={() => removeTutor(t.id)}
                      className="action-btn" style={{ background: "#fee2e2", color: "#991b1b", width: "100%", justifyContent: "center" }}>
                      <Trash2 size={13} /> Remove from Roster
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BOOKINGS ─────────────────────────────────── */}
          {activeTab === "bookings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="page-enter">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                <div className="search-box" style={{ flex: 1, maxWidth: "340px" }}>
                  <Search size={15} color="#94a3b8" />
                  <input value={searchBookings} onChange={(e) => setSearchBookings(e.target.value)} placeholder="Search bookings\u2026" />
                </div>
                <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>{filteredBookings.length} request{filteredBookings.length !== 1 ? "s" : ""}</span>
              </div>

              {/* Desktop table */}
              <div className="dash-card" style={{ overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                        {["ID", "Parent / Student", "Subject & Level", "Country", "Tutor Assigned", "Status", "Date"].map((h) => (
                          <th key={h} style={{ padding: "0.7rem 1rem", fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((b, i) => (
                        <tr key={b.id} className="table-row" style={{ borderBottom: i < filteredBookings.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                          <td style={{ padding: "0.85rem 1rem", fontSize: "0.72rem", fontWeight: 700, color: "#64748b", fontFamily: "monospace" }}>{b.id}</td>
                          <td style={{ padding: "0.85rem 1rem" }}>
                            <div style={{ fontWeight: 700, fontSize: "0.83rem", color: "#0f172a" }}>{b.parent}</div>
                            <div style={{ fontSize: "0.73rem", color: "#64748b" }}>{b.student}</div>
                          </td>
                          <td style={{ padding: "0.85rem 1rem" }}>
                            <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "#0f172a" }}>{b.subject}</div>
                            <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{b.level}</div>
                          </td>
                          <td style={{ padding: "0.85rem 1rem", fontSize: "0.8rem", color: "#0f172a", whiteSpace: "nowrap" }}>{b.country}</td>
                          <td style={{ padding: "0.85rem 1rem", fontSize: "0.8rem" }}>
                            <select
                              value={b.tutorAssigned}
                              onChange={(e) => assignTutorToBooking(b.id, e.target.value)}
                              style={{
                                padding: "0.25rem 0.5rem",
                                borderRadius: "6px",
                                border: "1px solid #d1d5db",
                                fontSize: "0.78rem",
                                fontWeight: b.tutorAssigned === "Pending Match" ? 700 : 500,
                                color: b.tutorAssigned === "Pending Match" ? "#d97706" : "#0f172a",
                                background: "#fff",
                                cursor: "pointer",
                              }}
                            >
                              <option value="Pending Match">Pending Match</option>
                              {tutors.map((t) => (
                                <option key={t.id} value={t.name}>{t.name}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: "0.85rem 1rem" }}>
                            <select
                              value={b.status}
                              onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                              style={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                padding: "0.2rem 0.55rem",
                                borderRadius: "20px",
                                border: "none",
                                cursor: "pointer",
                                ...statusStyle[b.status],
                              }}
                            >
                              <option value="New Inquiry">New Inquiry</option>
                              <option value="Diagnostic Scheduled">Diagnostic Scheduled</option>
                              <option value="Tutor Matched">Tutor Matched</option>
                              <option value="Active Student">Active Student</option>
                            </select>
                          </td>
                          <td style={{ padding: "0.85rem 1rem", fontSize: "0.73rem", color: "#94a3b8", whiteSpace: "nowrap" }}>{b.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── Add New Tutor Modal (Admin only) ── */}
      {isAddTutorOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "480px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ background: "linear-gradient(135deg,#20b2a4,#0d9488)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <UserPlus size={20} />
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Register New Tutor</h3>
              </div>
              <button onClick={() => setIsAddTutorOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddTutorSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>Full Name & Qualifications</label>
                <input
                  required
                  placeholder="e.g. Dr. Alexander Bell, PhD"
                  value={newTutor.name}
                  onChange={(e) => setNewTutor({ ...newTutor, name: e.target.value })}
                  style={{ width: "100%", padding: "0.55rem 0.75rem", border: "1.5px solid #d1d5db", borderRadius: "8px", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>University / Academic Institution</label>
                <input
                  required
                  placeholder="e.g. Oxford University / Imperial College London"
                  value={newTutor.school}
                  onChange={(e) => setNewTutor({ ...newTutor, school: e.target.value })}
                  style={{ width: "100%", padding: "0.55rem 0.75rem", border: "1.5px solid #d1d5db", borderRadius: "8px", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>Specialist Subjects</label>
                  <input
                    required
                    placeholder="e.g. Mathematics, Further Maths"
                    value={newTutor.subject}
                    onChange={(e) => setNewTutor({ ...newTutor, subject: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.75rem", border: "1.5px solid #d1d5db", borderRadius: "8px", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>Hourly Rate</label>
                  <input
                    required
                    placeholder="e.g. £45/hr"
                    value={newTutor.rate}
                    onChange={(e) => setNewTutor({ ...newTutor, rate: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.75rem", border: "1.5px solid #d1d5db", borderRadius: "8px", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: "0.35rem" }}>Region / Timezone</label>
                <input
                  required
                  placeholder="e.g. UK 🇬🇧 & USA 🇺🇸"
                  value={newTutor.region}
                  onChange={(e) => setNewTutor({ ...newTutor, region: e.target.value })}
                  style={{ width: "100%", padding: "0.55rem 0.75rem", border: "1.5px solid #d1d5db", borderRadius: "8px", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="submit"
                  style={{ flex: 1, padding: "0.7rem", background: "linear-gradient(135deg,#20b2a4,#0d9488)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
                >
                  Save &amp; Enroll Tutor
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddTutorOpen(false)}
                  style={{ padding: "0.7rem 1.2rem", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
