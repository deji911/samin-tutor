"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  CheckCircle2,
  Star,
  Users,
  Award,
  Video,
  ChevronDown,
  X,
  Menu,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Send,
  BookOpen,
  Layers,
  Search,
  Lightbulb,
  ShieldCheck,
  Lock,
  LogOut,
  UserPlus,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  Plus,
} from "lucide-react";
import { QUALIFICATIONS_LIST } from "./constants/qualifications";

// ─── Data ──────────────────────────────────────────────────────────────────

const heroSlides = [
  {
    img: "/images/hero-lecture.jpg",
    alt: "University lecture hall",
    title: "Taking the lead for education quality",
    sub: "Educating the mind without educating the heart is no education at all.",
  },
  {
    img: "/images/hero-graduation.jpg",
    alt: "Graduation ceremony",
    title: "Empowering students to reach their full potential",
    sub: "World-class 1-on-1 live online tutoring for GCSE, A-Level, and beyond.",
  },
  {
    img: "/images/hero-conference.jpg",
    alt: "Educational conference",
    title: "Access your lessons anytime, anywhere",
    sub: "Expert tutors matched to your child's needs — Canada, USA & UK.",
  },
];

const courses = [
  {
    img: "/images/hero-student.jpg",
    title: "GCSE Mathematics & Science Mastery",
    desc: "Intensive 1-on-1 sessions with subject specialists covering all GCSE exam boards — AQA, Edexcel, OCR.",
    price: "£40",
    rating: 4.9,
    votes: 128,
  },
  {
    img: "/images/hero-lecture.jpg",
    title: "A-Level Physics & Maths Specialist",
    desc: "Advanced tutoring for A-Level students targeting A/A* grades, including Mechanics and Further Maths.",
    price: "£48",
    rating: 4.8,
    votes: 94,
  },
  {
    img: "/images/tutor-1.jpg",
    title: "11+ & Grammar School Preparation",
    desc: "Comprehensive preparation for 11+ exams, covering verbal reasoning, non-verbal reasoning, English and Maths.",
    price: "£36",
    rating: 5.0,
    votes: 76,
  },
  {
    img: "/images/tutor-2.jpg",
    title: "Primary School Fundamentals",
    desc: "Building strong foundations in Literacy and Numeracy for Reception through Year 6 students.",
    price: "£32",
    rating: 4.9,
    votes: 112,
  },
  {
    img: "/images/tutor-3.jpg",
    title: "Canadian Curriculum Support",
    desc: "Ontario & BC curriculum aligned tutoring for all grades, including IB and AP programmes.",
    price: "CAD 55",
    rating: 4.8,
    votes: 63,
  },
  {
    img: "/images/hero-graduation.jpg",
    title: "University Admissions & Interview Prep",
    desc: "Oxbridge, Ivy League and medical school admissions coaching, personal statement writing and interview prep.",
    price: "£65",
    rating: 5.0,
    votes: 45,
  },
];

const initialInstructors = [
  {
    img: "/images/tutor-1.jpg",
    name: "Aisha Omoruyi",
    role: "Mathematics & Physics • Oxford Graduate",
    isNew: false,
  },
  {
    img: "/images/tutor-2.jpg",
    name: "Daniel Okonkwo",
    role: "English & Humanities • Cambridge Graduate",
    isNew: false,
  },
  {
    img: "/images/tutor-3.jpg",
    name: "Priya Sharma",
    role: "Biology & Chemistry • Imperial College",
    isNew: false,
  },
  {
    img: "/images/hero-student.jpg",
    name: "James Whitfield",
    role: "Computer Science & Maths • UCL Graduate",
    isNew: false,
  },
];

const initialApplicants = [
  {
    id: "APP-101",
    name: "Dr. Evelyn Reed",
    email: "evelyn.reed@oxfordalumni.org",
    phone: "+44 7922 419283",
    degree: "PhD Astrophysics • Oxford University",
    curriculum: "UK GCSE & A-Level 🇬🇧",
    subjects: ["Physics", "Mathematics"],
    levels: ["GCSE preparation", "A level preparation"],
    rate: "£48 / hour",
    img: "/images/tutor-1.jpg",
    dbsVerified: true,
    appliedAt: "Today, 11:20 AM",
    notes: "Over 6 years tutoring A-Level Physics and Further Maths with a 94% A*/A track record.",
  },
  {
    id: "APP-102",
    name: "Marcus Vance",
    email: "m.vance@ucl.ac.uk",
    phone: "+44 7710 882910",
    degree: "BSc Computer Science • UCL",
    curriculum: "UK & International 🇬🇧 🌐",
    subjects: ["Computer science", "Mathematics"],
    levels: ["Year 7-11", "GCSE preparation"],
    rate: "£40 / hour",
    img: "/images/hero-student.jpg",
    dbsVerified: true,
    appliedAt: "Yesterday, 3:45 PM",
    notes: "Software engineer and seasoned coding tutor for Python, GCSE CS and algebra.",
  },
];

const stats = [
  { icon: "📚", number: "47+", label: "Free Resources" },
  { icon: "👩‍🏫", number: "105", label: "Expert Tutors" },
  { icon: "💡", number: "5k+", label: "Students Helped" },
  { icon: "😊", number: "98%", label: "Satisfaction Rate" },
  { icon: "🏆", number: "21", label: "Awards Won" },
];


const testimonials = [
  {
    text: "My daughter's GCSE Maths went from a Grade 4 to a Grade 8 in just 6 months. The tutor was patient, thorough, and really understood how she learns.",
    name: "Sarah Mitchell",
    role: "Parent, UK",
    img: "/images/tutor-1.jpg",
    stars: 5,
  },
  {
    text: "Samin Home Tutors changed everything. My son now loves Physics. His tutor makes it feel easy and his confidence has sky-rocketed.",
    name: "James Okafor",
    role: "Parent, Canada",
    img: "/images/tutor-2.jpg",
    stars: 5,
  },
  {
    text: "Excellent service from start to finish. The tutor matching was perfect and the online classroom tools are brilliant. Highly recommend!",
    name: "Priya Anand",
    role: "Parent, USA",
    img: "/images/tutor-3.jpg",
    stars: 5,
  },
];

const faqs = [
  {
    q: "How does the online tutoring work?",
    a: "All sessions are conducted via our HD virtual classroom. Tutors use interactive whiteboards, screen sharing, and breakout tools to deliver fully live 1-on-1 lessons. All you need is a device with a camera and internet connection.",
  },
  {
    q: "How are tutors vetted and selected?",
    a: "All tutors hold degrees from top universities and must pass our rigorous 5-stage screening process including subject knowledge tests, a mock lesson, and enhanced background checks. Only the top 3% are accepted.",
  },
  {
    q: "What curriculum do you cover?",
    a: "We cover UK (AQA, Edexcel, OCR, CIE), Canadian (Ontario, BC, AB) and US curricula across all key stages. This includes Reception through A-Level, IB, AP, and university preparation.",
  },
  {
    q: "Can I get a free trial lesson?",
    a: "Yes! We offer a free 30-minute diagnostic consultation and assessment session so you can meet your tutor, assess your child's current level, and plan a learning roadmap — all before committing.",
  },
  {
    q: "What happens if we are not happy with our tutor?",
    a: "We offer a 100% Tutor Match Guarantee. If you are not satisfied within the first two sessions, we will rematch you with another tutor at no extra cost.",
  },
];

const availableSubjects = [
  "Science",
  "English",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economic",
  "Geography",
  "Computer science",
];

const availableLevels = [
  "Year 1-6",
  "11 Plus preparation",
  "Sat preparation",
  "Year 7-11",
  "GCSE preparation",
  "A level preparation",
  "National 5 preparation",
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [form, setForm] = useState({
    parentName: "",
    studentName: "",
    email: "",
    phone: "",
    subjects: ["Mathematics"] as string[],
    level: "Year 1-6",
    notes: "",
  });

  // Tutor roster state
  const [tutorsList, setTutorsList] = useState(initialInstructors);

  // Applicant queue (tutor applications from public + admin-added)
  const [applicantsList, setApplicantsList] = useState(initialApplicants);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);

  // Public "Become a Tutor" application modal
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccessMsg, setApplySuccessMsg] = useState("");
  const [applyForm, setApplyForm] = useState({
    name: "",
    email: "",
    phone: "",
    subjects: [] as string[],
    levels: ["Year 1-6"] as string[],
    degree: "",
    experience: "",
    notes: "",
  });

  // Admin & Tutor authentication state & dialogues
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>("admin");
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);
  const [adminLoginSuccess, setAdminLoginSuccess] = useState(false);

  // Admin "Approve & Onboard" tutor dialogue state
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [isOnboardingSubmitting, setIsOnboardingSubmitting] = useState(false);
  const [onboardSuccess, setOnboardSuccess] = useState(false);
  const [onboardedTutorName, setOnboardedTutorName] = useState("");
  const [tutorForm, setTutorForm] = useState({
    name: "",
    email: "",
    phone: "",
    subjects: ["Mathematics"] as string[],
    degree: "B.Sc.",
    curriculum: "UK GCSE & A-Level 🇬🇧",
    levels: ["GCSE preparation", "A level preparation"] as string[],
    rate: "£45 / hour",
    img: "/images/tutor-1.jpg",
    dbsVerified: true,
    notes: "Specialist in pure mathematics and step-by-step problem solving for exam excellence.",
  });

  // Restore login session from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mustChange = localStorage.getItem("samin_must_change_password");
      if (mustChange === "true") {
        window.location.href = "/change-password";
        return;
      }
      const saved = localStorage.getItem("samin_admin_logged_in");
      if (saved === "true") {
        setIsAdminLoggedIn(true);
        try {
          const u = JSON.parse(localStorage.getItem("samin_user") || "{}");
          if (u.role) setUserRole(u.role);
        } catch {}
      }
    }
  }, []);

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

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError(null);
    setAdminLoginLoading(true);

    const cleanEmail = adminEmail.trim();
    const cleanPassword = adminPassword;

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
        // Fallback for hardcoded master credentials if backend is offline/mock
        if (
          (cleanEmail.toLowerCase() === "saminhometutors@gmail.com" || cleanEmail.toLowerCase() === "admin@samin.edu") &&
          cleanPassword === "SaminMaster2026"
        ) {
          setIsAdminLoggedIn(true);
          if (typeof window !== "undefined") {
            localStorage.setItem("samin_admin_logged_in", "true");
            localStorage.removeItem("samin_must_change_password");
            window.location.href = "/admin/dashboard";
          }
          return;
        }

        const msg = data?.message || "Invalid email or password.";
        setAdminLoginError(msg);
        setAdminLoginLoading(false);
        return;
      }

      // Successful login from backend
      setIsAdminLoggedIn(true);
      setAdminLoginSuccess(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("samin_admin_logged_in", "true");
        if (data?.token) {
          localStorage.setItem("samin_auth_token", data.token);
        }
        if (data?.user) {
          localStorage.setItem("samin_user", JSON.stringify(data.user));
        }

        // Check if user is required to change their temporary password
        if (data?.must_change_password === true || data?.user?.must_change_password === true) {
          localStorage.setItem("samin_must_change_password", "true");
          window.location.href = "/change-password";
          return;
        } else {
          localStorage.removeItem("samin_must_change_password");
          if (data?.user?.role === "tutor") {
            window.location.href = "/tutor/dashboard";
          } else {
            window.location.href = "/admin/dashboard";
          }
        }
      }
    } catch (err: any) {
      console.error("Login request error:", err);
      // Fallback for hardcoded master credentials if backend is offline/mock
      if (
        (cleanEmail.toLowerCase() === "saminhometutors@gmail.com" || cleanEmail.toLowerCase() === "admin@samin.edu") &&
        cleanPassword === "SaminMaster2026"
      ) {
        setIsAdminLoggedIn(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("samin_admin_logged_in", "true");
          window.location.href = "/admin/dashboard";
        }
        return;
      }

      const isNetworkError =
        err?.message?.includes("Failed to fetch") ||
        err?.message?.includes("NetworkError") ||
        err?.name === "TypeError";

      setAdminLoginError(
        isNetworkError
          ? `Unable to connect to backend server (${getBackendApiUrl()}). Please ensure it is running.`
          : (err?.message || "Login failed. Please try again.")
      );
    } finally {
      setAdminLoginLoading(false);
    }
  };


  const handleAdminLogout = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    const baseUrl = getBackendApiUrl();

    if (token) {
      try {
        await fetch(`${baseUrl}/api/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("Logout error (/api/logout):", err);
      }
    }

    setIsAdminLoggedIn(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("samin_admin_logged_in");
      localStorage.removeItem("samin_auth_token");
      localStorage.removeItem("samin_user");
    }
  };

  const resetOnboardForm = () => {
    setTutorForm({
      name: "",
      email: "",
      phone: "",
      subjects: ["Mathematics"],
      degree: "B.Sc.",
      curriculum: "UK GCSE & A-Level 🇬🇧",
      levels: ["GCSE preparation", "A level preparation"],
      rate: "£45 / hour",
      img: "/images/tutor-1.jpg",
      dbsVerified: true,
      notes: "Specialist in pure mathematics and step-by-step problem solving for exam excellence.",
    });
    setOnboardSuccess(false);
    setSelectedApplicantId(null);
  };

  const handleOnboardTutorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOnboardingSubmitting) return;

    const trimmedName = tutorForm.name.trim();
    if (!trimmedName) return;

    setIsOnboardingSubmitting(true);

    const newTutor = {
      name: trimmedName,
      role: `${tutorForm.subjects.join(", ")} • ${tutorForm.degree}`,
      img: tutorForm.img || "/images/tutor-1.jpg",
      isNew: true,
    };

    setTutorsList((prev) => {
      if (prev.some((t) => t.name.toLowerCase() === trimmedName.toLowerCase())) {
        return prev;
      }
      return [newTutor, ...prev];
    });

    if (selectedApplicantId) {
      setApplicantsList((prev) => prev.filter((a) => a.id !== selectedApplicantId));
    }
    setOnboardedTutorName(trimmedName);
    setOnboardSuccess(true);
    setIsOnboardingSubmitting(false);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyError(null);

    const trimmedName = applyForm.name.trim();
    const trimmedEmail = applyForm.email.trim();
    const trimmedDegree = applyForm.degree.trim();

    if (!trimmedName || !trimmedEmail) {
      setApplyError("Please provide your full name and email address.");
      return;
    }

    if (!trimmedDegree) {
      setApplyError("Please enter your highest qualification.");
      return;
    }

    if (!applyForm.subjects.length) {
      setApplyError("Please select at least one subject you can teach.");
      return;
    }

    if (applyForm.experience.trim() && !/^\d+$/.test(applyForm.experience.trim())) {
      setApplyError("Years of experience must be a valid number (e.g. 3).");
      return;
    }

    const payload = {
      name: trimmedName,
      email: trimmedEmail,
      phone: applyForm.phone.trim() || undefined,
      qualification: trimmedDegree,
      subjects: applyForm.subjects,
      levels: applyForm.levels.length ? applyForm.levels : ["Year 1-6"],
      years_of_experience: applyForm.experience.trim() || undefined,
      bio: applyForm.notes.trim() || undefined,
    };

    setApplyLoading(true);

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/tutors/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        let errorMsg = data?.message || `Application submission failed (HTTP ${res.status})`;
        if (data?.errors && typeof data.errors === "object") {
          const firstField = Object.keys(data.errors)[0];
          if (firstField && Array.isArray(data.errors[firstField]) && data.errors[firstField].length > 0) {
            errorMsg = data.errors[firstField][0];
          }
        }
        setApplyError(errorMsg);
        setApplyLoading(false);
        return;
      }

      setApplySuccessMsg(data?.message || "Tutor application submitted successfully. Your profile is pending review.");

      // Sync with local applicants list so applicant is visible immediately in the admin dashboard
      const newApp = {
        id: data?.user?.id ? `APP-${data.user.id}` : `APP-${Date.now()}`,
        name: data?.user?.name || trimmedName,
        email: data?.user?.email || trimmedEmail,
        phone: data?.user?.phone || applyForm.phone,
        degree: data?.tutor_profile?.qualification || trimmedDegree,
        curriculum: "To be discussed",
        subjects: data?.tutor_profile?.subjects || applyForm.subjects,
        levels: data?.tutor_profile?.levels || (applyForm.levels.length ? applyForm.levels : ["Year 1-6"]),
        rate: "To be agreed",
        img: "/images/tutor-1.jpg",
        dbsVerified: false,
        appliedAt: new Date().toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
        notes: data?.tutor_profile?.bio || applyForm.notes,
      };
      setApplicantsList((prev) => [newApp, ...prev]);

      if (data?.token && typeof window !== "undefined") {
        localStorage.setItem("samin_tutor_token", data.token);
      }

      setApplySuccess(true);
    } catch (err: any) {
      console.error("Tutor registration error:", err);
      const isNetworkError =
        err?.message?.includes("Failed to fetch") ||
        err?.message?.includes("NetworkError") ||
        err?.name === "TypeError";

      setApplyError(
        isNetworkError
          ? `Unable to connect to the backend server (${getBackendApiUrl()}). Please ensure the server is running.`
          : (err?.message || "An unexpected network error occurred. Please try again.")
      );
    } finally {
      setApplyLoading(false);
    }
  };

  const toggleApplySubject = (sub: string) => {
    setApplyForm((prev) => {
      const exists = prev.subjects.includes(sub);
      return { ...prev, subjects: exists ? prev.subjects.filter((s) => s !== sub) : [...prev.subjects, sub] };
    });
  };

  const toggleApplyLevel = (lvl: string) => {
    setApplyForm((prev) => {
      const exists = prev.levels.includes(lvl);
      return {
        ...prev,
        levels: exists ? prev.levels.filter((l) => l !== lvl) : [...prev.levels, lvl],
      };
    });
  };

  const toggleBookingSubject = (sub: string) => {
    setForm((prev) => {
      const exists = prev.subjects.includes(sub);
      return {
        ...prev,
        subjects: exists ? prev.subjects.filter((s) => s !== sub) : [...prev.subjects, sub],
      };
    });
  };

  const toggleTutorSubject = (sub: string) => {
    setTutorForm((prev) => {
      const exists = prev.subjects.includes(sub);
      return {
        ...prev,
        subjects: exists ? prev.subjects.filter((s) => s !== sub) : [...prev.subjects, sub],
      };
    });
  };

  const toggleTutorLevel = (lvl: string) => {
    setTutorForm((prev) => {
      const exists = prev.levels.includes(lvl);
      return {
        ...prev,
        levels: exists ? prev.levels.filter((l) => l !== lvl) : [...prev.levels, lvl],
      };
    });
  };

  // Auto-slide
  const nextSlide = useCallback(() => {
    setCurrentSlide((p) => (p + 1) % heroSlides.length);
  }, []);
  const prevSlide = () =>
    setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length);

  useEffect(() => {
    const t = setInterval(nextSlide, 5000);
    return () => clearInterval(t);
  }, [nextSlide]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    setBookingLoading(true);

    const payload = {
      parent_name: form.parentName.trim(),
      student_name: form.studentName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      subjects: form.subjects.length > 0 ? form.subjects : ["Mathematics"],
      level: form.level || "Year 1-6",
      notes: form.notes.trim() || null,
    };

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/students/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        let msg = data?.message || "Failed to register student. Please check your information.";
        if (data?.errors) {
          const detail = Object.values(data.errors).flat().join(" ");
          if (detail) msg = detail;
        }
        setBookingError(msg);
        return;
      }

      setBookingSuccessMsg(data?.message || "Student registered successfully.");
      setBookingSuccess(true);
      setForm({
        parentName: "",
        studentName: "",
        email: "",
        phone: "",
        subjects: ["Mathematics"],
        level: "Year 1-6",
        notes: "",
      });
    } catch (err: any) {
      console.error("Student registration error:", err);
      const isNetworkError =
        err?.message?.includes("Failed to fetch") ||
        err?.message?.includes("NetworkError") ||
        err?.name === "TypeError";

      setBookingError(
        isNetworkError
          ? `Unable to connect to backend server (${getBackendApiUrl()}). Please ensure it is running.`
          : (err?.message || "Registration failed. Please try again.")
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const StarRow = ({ count }: { count: number }) => (
    <span className="stars">
      {[...Array(5)].map((_, i) => (
        <span key={i}>{i < Math.floor(count) ? "★" : "☆"}</span>
      ))}
    </span>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>

      {/* ── Top Bar ── */}
      <div className="top-bar">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <span>🎓 Welcome to Samin Home Tutors — World-Class Live Online Tutoring</span>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            {isAdminLoggedIn ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                <a
                  href={userRole === "tutor" ? "/tutor/dashboard" : "/admin/dashboard"}
                  style={{ background: "#ffd56b", color: "#070f2b", border: "none", borderRadius: "4px", padding: "0.22rem 0.65rem", fontSize: "0.78rem", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                  title={userRole === "tutor" ? "Open Tutor Portal" : "Open Admin Dashboard"}
                >
                  <ShieldCheck size={13} />
                  <span>{userRole === "tutor" ? "Tutor Portal" : "Admin Dashboard"}</span>
                </a>
                <button
                  onClick={handleAdminLogout}
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: "4px", padding: "0.2rem 0.5rem", fontSize: "0.75rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
                  title="Sign out of Admin"
                >
                  <LogOut size={12} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAdminLoginError(null);
                  setIsAdminLoginOpen(true);
                }}
                style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: 0 }}
                title="Click to open Login Dialogue"
              >
                <Lock size={13} /> <span>Login</span>
              </button>
            )}
            {!isAdminLoggedIn && (
              <>
                <a
                  href="/student/dashboard"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: "4px",
                    padding: "0.22rem 0.65rem",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  Student Portal
                </a>
                <a
                  href="/tutor/dashboard"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: "4px",
                    padding: "0.22rem 0.65rem",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  Tutor Portal
                </a>
              </>
            )}
            <a href="https://wa.me/2347059655382?text=Hello%20Samin%20Home%20Tutors!%20%F0%9F%8E%93%0A%0AI%20found%20your%20website%20and%20I%E2%80%99m%20interested%20in%20booking%20a%20FREE%20trial%20lesson.%0A%0APlease%20could%20you%20help%20me%20with%20more%20information%20about%3A%0A%E2%80%A2%20Available%20tutors%0A%E2%80%A2%20Subjects%20%26%20levels%20covered%0A%E2%80%A2%20Pricing%20%26%20scheduling%0A%0AThank%20you!" target="_blank" rel="noopener noreferrer">💬 WhatsApp Us</a>
          </div>
        </div>
      </div>

      {/* ── Header ── */}
      <header className="site-header">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "70px" }}>
          {/* Logo */}
          <a href="#" className="logo-text">
            <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--teal)", flexShrink: 0 }}>
              <Image
                src="/images/samin_logo.jpeg"
                alt="Samin Home Tutors Logo"
                width={40}
                height={40}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                priority
              />
            </div>
            <span><span className="logo-edu">Samin</span>Tutors</span>
          </a>

          {/* Desktop nav with clean vertical square-edge dropdowns */}
          <ul className="nav-menu">
            {/* 1. Courses Dropdown */}
            <li className="nav-item">
              <a href="#courses" className="nav-link">
                <span>Courses</span>
                <ChevronDown size={14} className="dropdown-chevron" />
              </a>
              <div className="smart-dropdown">
                <a href="#courses" className="dropdown-item">Primary &amp; 11 Plus</a>
                <a href="#courses" className="dropdown-item">Key Stage 3</a>
                <a href="#courses" className="dropdown-item">GCSE Preparation</a>
                <a href="#courses" className="dropdown-item">A-Level Preparation</a>
                <a href="#courses" className="dropdown-item">Mathematics</a>
                <a href="#courses" className="dropdown-item">Sciences (Physics, Chem, Bio)</a>
                <a href="#courses" className="dropdown-item">English &amp; Coding</a>
              </div>
            </li>

            {/* 2. Tutor Dropdown (exactly 2 items: Meet our tutor & Become a tutor) */}
            <li className="nav-item">
              <a href="#instructors" className="nav-link">
                <span>Tutor</span>
                <ChevronDown size={14} className="dropdown-chevron" />
              </a>
              <div className="smart-dropdown">
                <a href="#instructors" className="dropdown-item">
                  Meet our tutor
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setApplySuccess(false);
                    setApplyError(null);
                    setApplyLoading(false);
                    setApplySuccessMsg("");
                    setApplyForm({ name: "", email: "", phone: "", subjects: [], levels: ["Year 1-6"], degree: "", experience: "", notes: "" });
                    setIsApplyOpen(true);
                  }}
                  className="dropdown-item"
                >
                  Become a tutor
                </button>
              </div>
            </li>

            {/* 3. FAQs Dropdown */}
            <li className="nav-item">
              <a href="#faqs" className="nav-link">
                <span>FAQs</span>
                <ChevronDown size={14} className="dropdown-chevron" />
              </a>
              <div className="smart-dropdown">
                <a href="#faqs" className="dropdown-item">How Lessons Work</a>
                <button type="button" onClick={() => setIsModalOpen(true)} className="dropdown-item">Register as Student</button>
                <a href="#faqs" className="dropdown-item">Tutor Matching</a>
                <a href="#faqs" className="dropdown-item">Flexible Scheduling</a>
              </div>
            </li>

            {/* 4. Contact Dropdown */}
            <li className="nav-item">
              <a href="#contact" className="nav-link">
                <span>Contact</span>
                <ChevronDown size={14} className="dropdown-chevron" />
              </a>
              <div className="smart-dropdown">
                <a href="https://wa.me/2347059655382" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                  WhatsApp Us
                </a>
                <a href="mailto:saminhometutors@gmail.com" className="dropdown-item">
                  Email Inquiries
                </a>
                <button type="button" onClick={() => setIsModalOpen(true)} className="dropdown-item">
                  Request Diagnostic Call
                </button>
              </div>
            </li>
          </ul>

          {/* CTA + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button className="btn-enroll" onClick={() => setIsModalOpen(true)}>
              Register as Student
            </button>
            <button
              className="btn-enroll"
              style={{ background: "transparent", color: "var(--dark)", border: "1px solid var(--border)", display: "none" }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              id="hamburger-btn"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              style={{ background: "none", border: "1px solid var(--border)", borderRadius: "4px", padding: "0.45rem", cursor: "pointer", display: "flex", alignItems: "center" }}
              className="mobile-menu-btn"
            >
              <Menu size={20} color="var(--dark)" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
              <span className="logo-text" style={{ fontSize: "1.1rem" }}><span className="logo-edu">Samin</span>Tutors</span>
              <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            {/* Mobile Admin Box */}
            {isAdminLoggedIn ? (
              <div style={{ marginBottom: "1.25rem", padding: "0.85rem", background: "linear-gradient(135deg, #0a1435 0%, #152554 100%)", borderRadius: "8px", border: "1.5px solid #d4a017" }}>
                <div style={{ fontSize: "0.72rem", color: "#ffd56b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <ShieldCheck size={14} />
                  <span>{userRole === "tutor" ? "Tutor Session Active" : "Admin Session Active"}</span>
                </div>
                <a
                  href={userRole === "tutor" ? "/tutor/dashboard" : "/admin/dashboard"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.65rem 0.8rem",
                    background: "#ffd56b",
                    color: "#070f2b",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    borderRadius: "6px",
                    textDecoration: "none",
                    marginBottom: "0.6rem",
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>{userRole === "tutor" ? "Tutor Portal" : "Admin Dashboard"}</span>
                </a>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", fontSize: "0.75rem" }}>
                  <button
                    onClick={() => {
                      handleAdminLogout();
                      setMobileOpen(false);
                    }}
                    style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem" }}
                  >
                    <LogOut size={12} />
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: "1rem" }}>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setAdminLoginError(null);
                    setIsAdminLoginOpen(true);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.6rem 0.8rem",
                    background: "#0a1435",
                    color: "#ffd56b",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    borderRadius: "6px",
                    border: "1px solid #d4a017",
                    cursor: "pointer",
                  }}
                >
                  <Lock size={14} />
                  <span>Login</span>
                </button>
                <a
                  href="/student/dashboard"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.6rem 0.8rem",
                    background: "#f0fdf9",
                    color: "#0d9488",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    borderRadius: "6px",
                    border: "1px solid #99f6e4",
                    textDecoration: "none",
                    marginTop: "0.4rem",
                  }}
                >
                  <Users size={14} />
                  <span>Student &amp; Parent Portal</span>
                </a>
              </div>
            )}

            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
              <a href="#courses" onClick={() => setMobileOpen(false)}
                style={{ padding: "0.75rem 0.5rem", color: "var(--dark)", textDecoration: "none", borderBottom: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: 500 }}>
                Courses
              </a>
              <a href="#instructors" onClick={() => setMobileOpen(false)}
                style={{ padding: "0.75rem 0.5rem", color: "var(--dark)", textDecoration: "none", borderBottom: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: 500 }}>
                Meet our tutor
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setApplySuccess(false);
                  setApplyError(null);
                  setApplyLoading(false);
                  setApplySuccessMsg("");
                  setApplyForm({ name: "", email: "", phone: "", subjects: [], levels: ["Year 1-6"], degree: "", experience: "", notes: "" });
                  setIsApplyOpen(true);
                }}
                style={{ padding: "0.75rem 0.5rem", color: "var(--dark)", background: "none", border: "none", borderBottom: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: 500, textAlign: "left", cursor: "pointer" }}
              >
                Become a tutor
              </button>
              <a href="#faqs" onClick={() => setMobileOpen(false)}
                style={{ padding: "0.75rem 0.5rem", color: "var(--dark)", textDecoration: "none", borderBottom: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: 500 }}>
                FAQs
              </a>
              <a href="#contact" onClick={() => setMobileOpen(false)}
                style={{ padding: "0.75rem 0.5rem", color: "var(--dark)", textDecoration: "none", borderBottom: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: 500 }}>
                Contact
              </a>
            </nav>
            <button className="btn-enroll" style={{ width: "100%", marginTop: "0.8rem", justifyContent: "center" }} onClick={() => { setMobileOpen(false); setIsModalOpen(true); }}>
              Register as Student
            </button>
          </div>
        </div>
      )}

      {/* ── Hero Slider ── */}
      <div className="hero-slider" id="home">
        {heroSlides.map((slide, i) => (
          <div key={i} className={`hero-slide ${i === currentSlide ? "active" : ""}`}>
            <Image src={slide.img} alt={slide.alt} fill style={{ objectFit: "cover", filter: "brightness(0.5)" }} priority={i === 0} />
            <div className="hero-content">
              <h1>{slide.title}</h1>
              <p>{slide.sub}</p>
              <button className="hero-btn" onClick={() => setIsModalOpen(true)}>
                Start A Course &nbsp; ›
              </button>
            </div>
          </div>
        ))}

        {/* Arrows */}
        <button className="slider-arrow prev" onClick={prevSlide} aria-label="Previous slide">
          <ChevronLeft size={18} />
        </button>
        <button className="slider-arrow next" onClick={nextSlide} aria-label="Next slide">
          <ChevronRight size={18} />
        </button>

        {/* Dots */}
        <div className="slider-dots">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`slider-dot ${i === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Search Section ── */}
      <section className="search-section" id="search">
        <div className="container">
          <h2>Find your perfect tutor or course</h2>
          <p>Search from 47+ specialised tutoring programmes across every curriculum and level.</p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Type your keywords..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
              <option value="">Choose Subject...</option>
              {availableSubjects.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button>
              <Search size={16} style={{ display: "inline", marginRight: "0.4rem" }} />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ── Courses Section ── */}
      <section className="courses-section" id="courses">
        <div className="container">
          <div className="section-header">
            <h2>Our Tutoring Programmes</h2>
            <p>Hand-picked subject specialists from Oxford, Cambridge, Imperial and other top universities, delivering live 1-on-1 sessions tailored to your child&apos;s exact needs.</p>
          </div>
          <div className="grid-3" style={{ marginBottom: "2rem" }}>
            {courses.map((c, i) => (
              <div key={i} className="course-card">
                <Image src={c.img} alt={c.title} width={400} height={200} className="course-card-img" />
                <div className="course-card-body">
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
                <div className="course-card-footer">
                  <span className="course-price">{c.price} / hr</span>
                  <span className="course-rating">
                    <StarRow count={c.rating} /> ({c.votes} Reviews)
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <button className="btn-enroll" onClick={() => setIsModalOpen(true)}>
              Register as Student
            </button>
          </div>
        </div>
      </section>

      {/* ── Features / Why Us ── */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="two-col-layout">
            {/* Left: image with play overlay */}
            <div className="col-img">
              <Image
                src="/images/hero-lecture.jpg"
                alt="Samin virtual classroom"
                width={580}
                height={362}
                className="video-thumb"
              />
              <div className="play-btn" role="button" aria-label="Watch intro video">
                <div className="play-icon">▶</div>
              </div>
            </div>

            {/* Right: feature list */}
            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--dark)", marginBottom: "0.75rem" }}>
                  Why Choose Samin Home Tutors?
                </h2>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
                  We combine the rigour of elite university graduates with a warm, supportive teaching style to help every student thrive — academically and personally.
                </p>
              </div>
              <div className="features-list">
                {[
                  { icon: <TrendingUp size={22} />, title: "Highest Rated", desc: "Consistently rated 4.9/5 by families across Canada, USA and the UK." },
                  { icon: <Video size={22} />, title: "Live Online Training", desc: "100% interactive HD sessions — not pre-recorded. Real tutors, real time." },
                  { icon: <BookOpen size={22} />, title: "Large Resource Library", desc: "Access to 500+ past papers, revision notes, and mock exams included free." },
                  { icon: <ShieldCheck size={22} />, title: "Verified & DBS Checked", desc: "Every tutor is background-checked, interview-assessed and test-approved." },
                  { icon: <Lightbulb size={22} />, title: "Personalised Learning Plans", desc: "Your child gets a bespoke roadmap built around their goals and schedule." },
                ].map((f, i) => (
                  <div key={i} className="feature-item">
                    <div className="feature-icon">{f.icon}</div>
                    <div>
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-number">{s.number}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instructors ── */}
      <section className="instructors-section" id="instructors">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Expert Tutors</h2>
            <p>Every Samin tutor holds a degree from a world-leading university and has been personally vetted for academic excellence and teaching ability.</p>
            {isAdminLoggedIn && (
              <div style={{ marginTop: "1.25rem" }}>
                <button
                  onClick={() => {
                    resetOnboardForm();
                    setIsOnboardOpen(true);
                  }}
                  className="admin-menu-item"
                  style={{ padding: "0.55rem 1.1rem", fontSize: "0.85rem" }}
                  id="instructors-enroll-btn"
                >
                  <UserPlus size={16} />
                  <span>Approve &amp; Onboard New Tutor</span>
                </button>
              </div>
            )}
          </div>
          <div className="grid-4">
            {tutorsList.map((t, i) => (
              <div key={i} className="instructor-card" style={{ position: "relative" }}>
                {t.isNew && (
                  <span style={{ position: "absolute", top: "12px", right: "12px", background: "var(--teal)", color: "#fff", fontSize: "0.68rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "12px", boxShadow: "0 2px 6px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                    <Sparkles size={11} /> Newly Enrolled
                  </span>
                )}
                <Image src={t.img} alt={t.name} width={90} height={90} style={{ borderRadius: "50%", objectFit: "cover", border: "3px solid var(--teal-light)", margin: "0 auto 1rem", display: "block" }} />
                <h3>{t.name}</h3>
                <span className="instructor-role">{t.role}</span>
                <div className="instructor-social">
                  <a href="#" className="social-icon" aria-label="Facebook">f</a>
                  <a href="#" className="social-icon" aria-label="Twitter">𝕏</a>
                  <a href="#" className="social-icon" aria-label="LinkedIn">in</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Families Say About Us</h2>
            <p>Over 1,200 families across Canada, USA and the UK trust Samin Home Tutors to guide their children to academic excellence.</p>
          </div>
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div style={{ marginBottom: "0.75rem" }}>
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} size={14} fill="#f5a623" color="#f5a623" style={{ display: "inline" }} />
                  ))}
                </div>
                <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author">
                  <Image src={t.img} alt={t.name} width={44} height={44} style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid var(--teal-light)", flexShrink: 0 }} />
                  <div className="testimonial-author-info">
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── App Banner ── */}
      <section className="app-section">
        <Image src="/images/hero-conference.jpg" alt="Access anywhere" fill className="app-bg" style={{ objectFit: "cover", filter: "brightness(0.35)" }} />
        <div className="container app-content">
          <h2>Access your lessons anytime, anywhere.</h2>
          <div className="app-badges">
            <a href="#" className="app-badge" aria-label="Get it on Google Play">
              <span style={{ fontSize: "1.8rem" }}>▶</span>
              <div className="app-badge-text">
                <span>GET IT ON</span>
                <span>Google Play</span>
              </div>
            </a>
            <a href="#" className="app-badge" aria-label="Download on App Store">
              <span style={{ fontSize: "1.8rem" }}>📱</span>
              <div className="app-badge-text">
                <span>Available on the</span>
                <span>App Store</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq-section" id="faqs">
        <div className="container" style={{ maxWidth: "760px" }}>
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Have a question? We have got you covered.</p>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button
                className={`faq-question ${activeFaq === i ? "open" : ""}`}
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                {faq.q}
                <ChevronDown size={18} className={`faq-chevron ${activeFaq === i ? "rotated" : ""}`} />
              </button>
              {activeFaq === i && (
                <div className="faq-answer">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer" id="contact">
        <div className="container">
          <div className="footer-grid">
            {/* About */}
            <div className="footer-col">
              <h4>About Samin Tutors</h4>
              <p>We are a world-class online tutoring platform connecting ambitious students across Canada, USA and the UK with elite subject specialists from top universities.</p>
              <p style={{ marginTop: "0.75rem" }}>Rated <strong style={{ color: "var(--teal)" }}>4.9 / 5</strong> by over 1,200 families.</p>
            </div>

            {/* Get in touch */}
            <div className="footer-col">
              <h4>Get In Touch</h4>
              <div className="footer-contact-item">
                <MapPin size={15} />
                <span>Serving Canada 🇨🇦, USA 🇺🇸 &amp; UK 🇬🇧 — fully online</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={15} />
                <a href="https://wa.me/2347059655382?text=Hello%20Samin%20Home%20Tutors!%20%F0%9F%8E%93%0A%0AI%20found%20your%20website%20and%20I%E2%80%99m%20interested%20in%20booking%20a%20FREE%20trial%20lesson.%0A%0APlease%20could%20you%20help%20me%20with%20more%20information%20about%3A%0A%E2%80%A2%20Available%20tutors%0A%E2%80%A2%20Subjects%20%26%20levels%20covered%0A%E2%80%A2%20Pricing%20%26%20scheduling%0A%0AThank%20you!" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)", textDecoration: "none" }}>WhatsApp: +234 705 965 5382</a>
              </div>
              <div className="footer-contact-item">
                <Mail size={15} />
                <a href="mailto:saminhometutors@gmail.com" style={{ color: "var(--text-muted)", textDecoration: "none" }}>saminhometutors@gmail.com</a>
              </div>
            </div>

            {/* Links */}
            <div className="footer-col">
              <h4>Useful Links</h4>
              <ul className="footer-links">
                {["#courses", "#instructors", "#faqs", "#contact"].map((href) => (
                  <li key={href}>
                    <a href={href}>› {href.replace("#", "").charAt(0).toUpperCase() + href.slice(2)}</a>
                  </li>
                ))}
                <li>
                  {isAdminLoggedIn ? (
                    <a href={userRole === "tutor" ? "/tutor/dashboard" : "/admin/dashboard"}>
                      › {userRole === "tutor" ? "Tutor Portal" : "Admin Portal"}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAdminLoginError(null);
                        setIsAdminLoginOpen(true);
                      }}
                    >
                      › Login
                    </button>
                  )}
                </li>
                <li>
                  <a href="/student/dashboard">› Student &amp; Parent Portal</a>
                </li>
              </ul>
              </div>

            {/* Newsletter */}
            <div className="footer-col">
              <h4>Subscribe Newsletter</h4>
              <p>Get the latest study tips, free resources and exclusive offers delivered to your inbox.</p>
              <div className="newsletter-input">
                <input type="email" placeholder="Enter Your E-mail" />
                <button aria-label="Subscribe">
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            © {new Date().getFullYear()} Samin Home Tutors. All rights reserved. &nbsp;|&nbsp; Serving Canada, USA &amp; UK
          </div>
        </div>
      </footer>

      {/* ── Scroll to top ── */}
      <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll to top">
        ▲
      </button>

      {/* ── Booking Modal ── */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsModalOpen(false); setBookingError(null); }}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <GraduationCap size={18} style={{ display: "inline", marginRight: "0.5rem" }} />
                Register as Student
              </h2>
              <button className="modal-close" onClick={() => { setIsModalOpen(false); setBookingError(null); }} aria-label="Close modal">
                <X size={15} />
              </button>
            </div>

            <div className="modal-body">
              {bookingSuccess ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                  <h3 style={{ color: "var(--teal)", marginBottom: "0.5rem" }}>Registration Received!</h3>
                  <p style={{ color: "var(--text-muted)" }}>
                    {bookingSuccessMsg || "Thank you! A member of our team will contact you within 24 hours to confirm your student registration."}
                  </p>
                  <button className="btn-enroll" style={{ marginTop: "1.5rem" }} onClick={() => { setIsModalOpen(false); setBookingSuccess(false); setBookingError(null); }}>
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {bookingError && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <AlertCircle size={16} style={{ flexShrink: 0 }} />
                      <span>{bookingError}</span>
                    </div>
                  )}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="parentName">Parent / Guardian Name *</label>
                      <input id="parentName" className="form-control" required placeholder="Your full name" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="studentName">Student Name *</label>
                      <input id="studentName" className="form-control" required placeholder="Student's name" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input id="email" type="email" className="form-control" required placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone / WhatsApp</label>
                      <input id="phone" className="form-control" placeholder="+1 / +44 / +234..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>
                  {/* Subjects Multi-select */}
                  <div className="form-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <label style={{ margin: 0 }}>Subjects Required * (Tick to select multiple)</label>
                      <span style={{ fontSize: "0.75rem", color: "var(--teal)", fontWeight: 700 }}>
                        {form.subjects.length} selected
                      </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", maxHeight: "150px", overflowY: "auto", padding: "0.2rem 0" }}>
                      {availableSubjects.map((s) => {
                        const checked = form.subjects.includes(s);
                        return (
                          <button
                            type="button"
                            key={s}
                            onClick={() => toggleBookingSubject(s)}
                            className={`tag-badge ${checked ? "selected" : ""}`}
                            aria-pressed={checked}
                          >
                            <span className="checkbox-indicator">{checked ? "✓" : ""}</span>
                            <span>{s}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Level / Grade Single Select Dropdown */}
                  <div className="form-group">
                    <label htmlFor="bookingLevel">Level / Grade Classification *</label>
                    <select
                      id="bookingLevel"
                      className="form-control"
                      required
                      value={form.level}
                      onChange={(e) => setForm({ ...form, level: e.target.value })}
                    >
                      {availableLevels.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="notes">Additional Notes</label>
                    <textarea id="notes" className="form-control" rows={3} placeholder="Tell us about your child's current level, targets, and any specific concerns..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                  </div>
                  <button type="submit" className="btn-submit" disabled={bookingLoading} style={{ opacity: bookingLoading ? 0.7 : 1, cursor: bookingLoading ? "not-allowed" : "pointer" }}>
                    {bookingLoading ? "Registering Student..." : "🎓 Register as Student"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Admin Login Dialogue ── */}
      {isAdminLoginOpen && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ overflow: "hidden" }}>
            <div className="modal-header">
              <h2>
                <Lock size={18} style={{ display: "inline", marginRight: "0.5rem" }} />
                Login
              </h2>
              <button className="modal-close" onClick={() => setIsAdminLoginOpen(false)} aria-label="Close modal">
                <X size={15} />
              </button>
            </div>

            <div className="modal-body">
              {adminLoginSuccess ? (
                <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                  <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%", background: "var(--teal-light)", border: "2px solid var(--teal)", color: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ color: "var(--dark)", fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.4rem" }}>
                    Authentication Successful!
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
                    Redirecting you to the <strong>Admin Dashboard</strong>...
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <a
                      href="/admin/dashboard"
                      className="btn-enroll"
                      style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                    >
                      <ShieldCheck size={16} />
                      <span>Open Admin Dashboard Now</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div>

                  {adminLoginError && (
                    <div style={{ padding: "0.65rem 0.85rem", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "6px", color: "#b91c1c", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                      <AlertCircle size={15} style={{ flexShrink: 0 }} />
                      <span>{adminLoginError}</span>
                    </div>
                  )}

                  <form onSubmit={handleAdminLoginSubmit}>
                    <div className="form-group">
                      <label htmlFor="adminEmail">Email</label>
                      <div className="password-input-wrap">
                        <input
                          id="adminEmail"
                          type="email"
                          required
                          placeholder="admin@samin.com"
                          className="form-control"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                        <label htmlFor="adminPassword" style={{ margin: 0 }}>Password</label>
                        <Link
                          href="/forgot-password"
                          onClick={() => setIsAdminLoginOpen(false)}
                          style={{ fontSize: "0.78rem", color: "var(--teal)", textDecoration: "none", fontWeight: 600 }}
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="password-input-wrap">
                        <input
                          id="adminPassword"
                          type={showAdminPassword ? "text" : "password"}
                          required
                          placeholder="••••••••••••"
                          className="form-control"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowAdminPassword(!showAdminPassword)}
                          aria-label={showAdminPassword ? "Hide password" : "Show password"}
                        >
                          {showAdminPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={adminLoginLoading}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                    >
                      {adminLoginLoading ? (
                        <>
                          <span style={{ display: "inline-block", width: "1rem", height: "1rem", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                          <span>Verifying Access...</span>
                        </>
                      ) : (
                        <>
                          <Lock size={15} />
                          <span>Log In</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ── Approve & Onboard Tutor Dialogue (Admin) ── */}
      {isOnboardOpen && (
        <div className="modal-overlay" onClick={() => setIsOnboardOpen(false)}>
          <div className="modal-box modal-box-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <UserPlus size={18} style={{ display: "inline", marginRight: "0.5rem" }} />
                Approve &amp; Onboard Tutor
              </h2>
              <button className="modal-close" onClick={() => setIsOnboardOpen(false)} aria-label="Close modal">
                <X size={15} />
              </button>
            </div>

            <div className="modal-body">
              {onboardSuccess ? (
                <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                  <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", background: "var(--teal-light)", border: "2px solid var(--teal)", color: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ color: "var(--dark)", fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.4rem" }}>
                    Tutor Successfully Enrolled! 🎉
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "460px", margin: "0 auto 1.5rem" }}>
                    <strong>{onboardedTutorName}</strong> has been approved and added to the official live Samin Tutors roster.
                  </p>

                  <div style={{ background: "var(--bg-light)", border: "1px solid var(--border)", borderRadius: "10px", padding: "1.2rem", maxWidth: "440px", margin: "0 auto 1.5rem", textAlign: "left", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Image src={tutorForm.img} alt={onboardedTutorName} width={64} height={64} style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid var(--teal)", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--dark)" }}>{onboardedTutorName}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--teal-dark)", fontWeight: 600 }}>{tutorForm.subjects.join(", ")}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{tutorForm.degree} • {tutorForm.curriculum}</div>
                      <div style={{ marginTop: "0.35rem", display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                        <span style={{ fontSize: "0.68rem", background: "var(--teal-light)", color: "var(--teal-dark)", padding: "0.15rem 0.45rem", borderRadius: "4px", fontWeight: 700 }}>✓ DBS Cleared</span>
                        <span style={{ fontSize: "0.68rem", background: "#fef3c7", color: "#b45309", padding: "0.15rem 0.45rem", borderRadius: "4px", fontWeight: 700 }}>{tutorForm.rate}</span>
                        {tutorForm.levels.map((lvl) => (
                          <span key={lvl} style={{ fontSize: "0.68rem", background: "#f1f5f9", color: "#475569", padding: "0.15rem 0.45rem", borderRadius: "4px", fontWeight: 600 }}>
                            {lvl}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <a
                      href="#instructors"
                      onClick={() => setIsOnboardOpen(false)}
                      className="btn-enroll"
                    >
                      View on Live Website ›
                    </a>
                    <button
                      className="btn-enroll"
                      onClick={resetOnboardForm}
                      style={{ background: "transparent", color: "var(--dark)", border: "1px solid var(--border)" }}
                    >
                      <Plus size={15} />
                      <span>Onboard Another Tutor</span>
                    </button>
                    <button
                      onClick={() => setIsOnboardOpen(false)}
                      style={{ padding: "0.6rem 1.2rem", background: "transparent", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--dark)", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleOnboardTutorSubmit}>
                  {/* Applicant Picker */}
                  {applicantsList.length > 0 && (
                    <div style={{ marginBottom: "1.2rem", background: "linear-gradient(135deg,#f0fdf9,#e6f7f5)", border: "1px solid var(--teal)", borderRadius: "8px", padding: "0.9rem 1rem" }}>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--teal-dark)", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span>📋</span>
                        <span>Pending Applicants ({applicantsList.length}) — Select to auto-fill form</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", maxHeight: "180px", overflowY: "auto" }}>
                        {applicantsList.map((app) => (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => {
                              setSelectedApplicantId(app.id);
                              setTutorForm({
                                name: app.name,
                                email: app.email,
                                phone: app.phone || "",
                                subjects: app.subjects,
                                degree: app.degree,
                                curriculum: app.curriculum || "UK GCSE & A-Level 🇬🇧",
                                levels: app.levels,
                                rate: app.rate || "£45 / hour",
                                img: app.img || "/images/tutor-1.jpg",
                                dbsVerified: false,
                                notes: app.notes || "",
                              });
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.6rem",
                              padding: "0.5rem 0.7rem",
                              borderRadius: "6px",
                              border: selectedApplicantId === app.id ? "2px solid var(--teal)" : "1.5px solid var(--border)",
                              background: selectedApplicantId === app.id ? "rgba(32,178,164,0.12)" : "#fff",
                              cursor: "pointer",
                              textAlign: "left",
                            }}
                          >
                            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--teal)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem", flexShrink: 0 }}>
                              {app.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--dark)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.name}</div>
                              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{app.email} · {app.subjects.join(", ")}</div>
                            </div>
                            {app.appliedAt && <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", flexShrink: 0 }}>{app.appliedAt}</span>}
                            {selectedApplicantId === app.id && <span style={{ fontSize: "0.7rem", background: "var(--teal)", color: "#fff", padding: "0.1rem 0.4rem", borderRadius: "4px", fontWeight: 700, flexShrink: 0 }}>Selected</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Row 1: Name and Email */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="tutorName">Full Name &amp; Academic Title *</label>
                      <input
                        id="tutorName"
                        className="form-control"
                        required
                        placeholder="e.g. Dr. David Sterling, PhD"
                        value={tutorForm.name}
                        onChange={(e) => setTutorForm({ ...tutorForm, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="tutorEmail">Official Contact Email *</label>
                      <input
                        id="tutorEmail"
                        type="email"
                        className="form-control"
                        required
                        placeholder="e.g. david.sterling@samin.edu"
                        value={tutorForm.email}
                        onChange={(e) => setTutorForm({ ...tutorForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Row 2: Phone and Hourly Rate */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="tutorPhone">Phone / WhatsApp Number *</label>
                      <input
                        id="tutorPhone"
                        className="form-control"
                        required
                        placeholder="e.g. +44 7911 123456"
                        value={tutorForm.phone}
                        onChange={(e) => setTutorForm({ ...tutorForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="tutorRate">Hourly Tuition Rate *</label>
                      <input
                        id="tutorRate"
                        className="form-control"
                        required
                        placeholder="e.g. £45 / hour or $60 / hour"
                        value={tutorForm.rate}
                        onChange={(e) => setTutorForm({ ...tutorForm, rate: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Row 3: Multi-select Subjects */}
                  <div className="form-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <label style={{ margin: 0 }}>Subjects Taught * (Tick to select multiple)</label>
                      <span style={{ fontSize: "0.75rem", color: "var(--teal)", fontWeight: 700 }}>
                        {tutorForm.subjects.length} selected
                      </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", maxHeight: "140px", overflowY: "auto", padding: "0.2rem 0" }}>
                      {availableSubjects.map((s) => {
                        const checked = tutorForm.subjects.includes(s);
                        return (
                          <button
                            type="button"
                            key={s}
                            onClick={() => toggleTutorSubject(s)}
                            className={`tag-badge ${checked ? "selected" : ""}`}
                            aria-pressed={checked}
                          >
                            <span className="checkbox-indicator">{checked ? "✓" : ""}</span>
                            <span>{s}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Row 4: Multi-select Level / Grade Classifications */}
                  <div className="form-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <label style={{ margin: 0 }}>Teaching Level / Grade Classifications * (Tick to select multiple)</label>
                      <span style={{ fontSize: "0.75rem", color: "var(--teal)", fontWeight: 700 }}>
                        {tutorForm.levels.length} selected
                      </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", padding: "0.2rem 0" }}>
                      {availableLevels.map((lvl) => {
                        const checked = tutorForm.levels.includes(lvl);
                        return (
                          <button
                            type="button"
                            key={lvl}
                            onClick={() => toggleTutorLevel(lvl)}
                            className={`tag-badge ${checked ? "selected" : ""}`}
                            aria-pressed={checked}
                          >
                            <span className="checkbox-indicator">{checked ? "✓" : ""}</span>
                            <span>{lvl}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Row 5: Curriculum & Degree */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="tutorCurriculum">Target Curriculum &amp; Region *</label>
                      <select
                        id="tutorCurriculum"
                        className="form-control"
                        value={tutorForm.curriculum}
                        onChange={(e) => setTutorForm({ ...tutorForm, curriculum: e.target.value })}
                      >
                        <option>UK GCSE &amp; A-Level 🇬🇧</option>
                        <option>Canada (Ontario &amp; BC) 🇨🇦</option>
                        <option>USA (Common Core &amp; AP) 🇺🇸</option>
                        <option>International Baccalaureate (IB) 🌍</option>
                        <option>Scottish National 5 &amp; Highers 🏴󠁧󠁢󠁳󠁣󠁴󠁿</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="tutorDegree">Highest Qualification *</label>
                      <select
                        id="tutorDegree"
                        className="form-control"
                        required
                        value={tutorForm.degree}
                        onChange={(e) => setTutorForm({ ...tutorForm, degree: e.target.value })}
                      >
                        <option value="">— Select highest qualification —</option>
                        {QUALIFICATIONS_LIST.map((q) => (
                          <option key={q.code} value={q.code}>
                            {q.code} — {q.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 6: Profile Photo Selection */}
                  <div className="form-group">
                    <label>Profile Avatar Selection</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.4rem" }}>
                      {[
                        { src: "/images/tutor-1.jpg", label: "Tutor 1" },
                        { src: "/images/tutor-2.jpg", label: "Tutor 2" },
                        { src: "/images/tutor-3.jpg", label: "Tutor 3" },
                        { src: "/images/hero-student.jpg", label: "Tutor 4" },
                      ].map((av) => (
                        <div
                          key={av.src}
                          onClick={() => setTutorForm({ ...tutorForm, img: av.src })}
                          className={`avatar-option ${tutorForm.img === av.src ? "selected" : ""}`}
                          title={`Select ${av.label}`}
                        >
                          <Image src={av.src} alt={av.label} fill style={{ objectFit: "cover" }} />
                        </div>
                      ))}
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        Selected official faculty photo
                      </span>
                    </div>
                  </div>

                  {/* Row 7: Vetting Checkboxes */}
                  <div className="form-group" style={{ background: "var(--bg-light)", padding: "0.75rem 1rem", borderRadius: "6px", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--dark)", marginBottom: "0.35rem" }}>
                      Compliance &amp; Verification Checks:
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--dark)", cursor: "pointer", marginBottom: "0.25rem" }}>
                      <input
                        type="checkbox"
                        checked={tutorForm.dbsVerified}
                        onChange={(e) => setTutorForm({ ...tutorForm, dbsVerified: e.target.checked })}
                      />
                      <span>Enhanced DBS / Criminal Record Background Check Verified</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--dark)", cursor: "pointer" }}>
                      <input type="checkbox" defaultChecked />
                      <span>Original University Degree Certificates &amp; Transcripts Authenticated</span>
                    </label>
                  </div>

                  {/* Row 8: Bio Notes */}
                  <div className="form-group">
                    <label htmlFor="tutorBio">Teaching Approach &amp; Bio</label>
                    <textarea
                      id="tutorBio"
                      className="form-control"
                      rows={2}
                      placeholder="Brief summary of teaching approach, student results, and availability..."
                      value={tutorForm.notes}
                      onChange={(e) => setTutorForm({ ...tutorForm, notes: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isOnboardingSubmitting}
                    className="btn-submit"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      cursor: isOnboardingSubmitting ? "not-allowed" : "pointer",
                      pointerEvents: isOnboardingSubmitting ? "none" : "auto",
                      opacity: isOnboardingSubmitting ? 0.7 : 1,
                    }}
                  >
                    <UserPlus size={16} />
                    <span>{isOnboardingSubmitting ? "Onboarding…" : "Complete Onboarding & Add to Faculty Roster"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Become a Tutor (Public Application) Modal ── */}
      {isApplyOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsApplyOpen(false); }}>
          <div className="modal-box modal-box-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <span style={{ marginRight: "0.5rem" }}>🎓</span>
                Apply to Become a Tutor
              </h2>
              <button className="modal-close" onClick={() => { setIsApplyOpen(false); setApplyError(null); }} aria-label="Close modal">
                <X size={15} />
              </button>
            </div>

            <div className="modal-body">
              {applySuccess ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <div style={{ width: "4.5rem", height: "4.5rem", borderRadius: "50%", background: "var(--teal-light)", border: "2px solid var(--teal)", color: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.2rem" }}>
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 style={{ color: "var(--dark)", fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.4rem" }}>Application Submitted! 🎉</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "440px", margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
                    {applySuccessMsg ? (
                      <>
                        <span style={{ fontWeight: 600, color: "var(--dark)" }}>{applySuccessMsg}</span>
                        <br />
                        <span style={{ fontSize: "0.83rem", color: "var(--text-muted)", marginTop: "0.35rem", display: "inline-block" }}>
                          Thank you, <strong>{applyForm.name}</strong>! We will review your application and contact you within 2–3 working days.
                        </span>
                      </>
                    ) : (
                      <>Thank you, <strong>{applyForm.name}</strong>! Your application has been received and is under review by the Samin Tutors team. We will be in touch within 2–3 working days.</>
                    )}
                  </p>
                  <button
                    onClick={() => { setIsApplyOpen(false); setApplyError(null); }}
                    className="btn-enroll"
                  >
                    Back to Website
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit}>
                  {applyError && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "0.8rem 1rem", marginBottom: "1.2rem", fontSize: "0.85rem", color: "#b91c1c", display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                      <span style={{ fontSize: "1rem" }}>⚠️</span>
                      <span style={{ flex: 1, lineHeight: 1.4 }}>{applyError}</span>
                    </div>
                  )}
                  <div style={{ background: "linear-gradient(135deg,#f0fdf9,#e6f7f5)", border: "1px solid var(--teal)", borderRadius: "8px", padding: "0.85rem 1rem", marginBottom: "1.2rem", fontSize: "0.82rem", color: "var(--teal-dark)", display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                    <span style={{ fontSize: "1.1rem" }}>ℹ️</span>
                    <span>Fill in your details below. Our team will review your application and contact you if you are shortlisted. All applications are strictly confidential.</span>
                  </div>

                  {/* Row 1 */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="applyName">Full Name *</label>
                      <input
                        id="applyName"
                        className="form-control"
                        required
                        placeholder="Your full name"
                        value={applyForm.name}
                        onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="applyEmail">Email Address *</label>
                      <input
                        id="applyEmail"
                        type="email"
                        className="form-control"
                        required
                        placeholder="you@email.com"
                        value={applyForm.email}
                        onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="applyPhone">Phone / WhatsApp</label>
                      <input
                        id="applyPhone"
                        className="form-control"
                        placeholder="+1 / +44 / +234 ..."
                        value={applyForm.phone}
                        onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="applyDegree">Highest Qualification *</label>
                      <select
                        id="applyDegree"
                        className="form-control"
                        required
                        value={applyForm.degree}
                        onChange={(e) => setApplyForm({ ...applyForm, degree: e.target.value })}
                      >
                        <option value="">— Select your highest qualification —</option>
                        {QUALIFICATIONS_LIST.map((q) => (
                          <option key={q.code} value={q.code}>
                            {q.code} — {q.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Subjects */}
                  <div className="form-group">
                    <label>Subjects You Can Teach (select all that apply)</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.35rem" }}>
                      {["Science","English","Mathematics","Physics","Chemistry","Biology","Economics","Geography","Computer Science"].map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => toggleApplySubject(sub)}
                          style={{
                            padding: "0.35rem 0.8rem",
                            borderRadius: "20px",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            border: applyForm.subjects.includes(sub) ? "2px solid var(--teal)" : "1.5px solid var(--border)",
                            background: applyForm.subjects.includes(sub) ? "var(--teal-light)" : "#fff",
                            color: applyForm.subjects.includes(sub) ? "var(--teal-dark)" : "var(--text-muted)",
                            transition: "all 0.15s",
                          }}
                        >
                          {applyForm.subjects.includes(sub) ? "✓ " : ""}{sub}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Row 4: Level (Multi-select) */}
                  <div className="form-group">
                    <label>Level You Can Teach (select all that apply)</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.35rem" }}>
                      {availableLevels.map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => toggleApplyLevel(lvl)}
                          style={{
                            padding: "0.35rem 0.8rem",
                            borderRadius: "20px",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            border: applyForm.levels.includes(lvl) ? "2px solid var(--teal)" : "1.5px solid var(--border)",
                            background: applyForm.levels.includes(lvl) ? "var(--teal-light)" : "#fff",
                            color: applyForm.levels.includes(lvl) ? "var(--teal-dark)" : "var(--text-muted)",
                            transition: "all 0.15s",
                          }}
                        >
                          {applyForm.levels.includes(lvl) ? "✓ " : ""}{lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Row 5: Experience */}
                  <div className="form-group">
                    <label htmlFor="applyExp">Years of Teaching Experience (numbers only)</label>
                    <input
                      id="applyExp"
                      type="number"
                      min="0"
                      max="60"
                      step="1"
                      className="form-control"
                      placeholder="e.g. 3"
                      value={applyForm.experience}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setApplyForm({ ...applyForm, experience: val });
                      }}
                    />
                  </div>

                  {/* Row 5: Notes */}
                  <div className="form-group">
                    <label htmlFor="applyNotes">Tell Us About Yourself</label>
                    <textarea
                      id="applyNotes"
                      className="form-control"
                      rows={3}
                      placeholder="Brief background, teaching style, student achievements, availability..."
                      value={applyForm.notes}
                      onChange={(e) => setApplyForm({ ...applyForm, notes: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={applyLoading}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      opacity: applyLoading ? 0.75 : 1,
                      cursor: applyLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    {applyLoading ? (
                      <>
                        <span style={{ display: "inline-block", width: "1rem", height: "1rem", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>🎓</span>
                        <span>Submit My Application</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden style to show hamburger only on mobile */}
      <style>{`
        .mobile-menu-btn { display: none !important; }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
