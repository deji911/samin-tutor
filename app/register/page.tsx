"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Briefcase,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  Info,
} from "lucide-react";
import { getBackendApiUrl, saveAuthSession } from "../utils/auth";
import { QUALIFICATIONS_LIST } from "../constants/qualifications";

const AVAILABLE_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Science",
  "English",
  "Economic",
  "Geography",
  "Computer science",
];

const AVAILABLE_LEVELS = [
  "Year 1-6",
  "11 Plus preparation",
  "Sat preparation",
  "Year 7-11",
  "GCSE preparation",
  "A level preparation",
  "National 5 preparation",
];

export default function RegisterPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"student" | "tutor">("student");

  /* ─── Student Form State ─── */
  const [studentName, setStudentName] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["Mathematics"]);
  const [selectedLevel, setSelectedLevel] = useState<string>("GCSE preparation");
  const [studentNotes, setStudentNotes] = useState("");

  /* ─── Tutor Form State ─── */
  const [tutorName, setTutorName] = useState("");
  const [tutorEmail, setTutorEmail] = useState("");
  const [tutorPhone, setTutorPhone] = useState("");
  const [tutorQualification, setTutorQualification] = useState("");
  const [tutorSubjects, setTutorSubjects] = useState<string[]>(["Mathematics"]);
  const [tutorLevels, setTutorLevels] = useState<string[]>(["GCSE preparation"]);
  const [tutorExperience, setTutorExperience] = useState("");
  const [tutorBio, setTutorBio] = useState("");

  /* ─── Common UI State ─── */
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [registrationResult, setRegistrationResult] = useState<{
    type: "student" | "tutor";
    message: string;
    user?: any;
    credentials?: any;
    token?: string;
  } | null>(null);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleStudentSubject = (sub: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const toggleTutorSubject = (sub: string) => {
    setTutorSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const toggleTutorLevel = (lvl: string) => {
    setTutorLevels((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
    );
  };

  /* ─── Submit Student Registration ─── */
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg(null);
    setFieldErrors({});

    if (!studentName.trim()) {
      setErrorMsg("Student name is required.");
      return;
    }
    if (selectedSubjects.length === 0) {
      setErrorMsg("Please select at least one subject.");
      return;
    }

    setLoading(true);

    const payload: any = {
      student_name: studentName.trim(),
      parent_name: parentName.trim(),
      parent_email: parentEmail.trim(),
      phone: studentPhone.trim() || undefined,
      subjects: selectedSubjects,
      level: selectedLevel,
      notes: studentNotes.trim() || undefined,
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
        if (res.status === 422 && data?.errors) {
          setFieldErrors(data.errors);
          setErrorMsg(data.message || "Please fix the validation errors below.");
        } else {
          setErrorMsg(data?.message || `Registration failed (HTTP ${res.status}).`);
        }
        return;
      }

      // Do not auto-login or store student session on public registration
      setRegistrationResult({
        type: "student",
        message: "Thank you for registering with Samin Home Tutors! Your application has been received, and our admissions team will contact you shortly regarding the progress of your registration and tutor matching.",
        user: data?.user,
      });
    } catch (err: any) {
      console.error("Student registration error:", err);
      setErrorMsg(err?.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Submit Tutor Registration ─── */
  const handleTutorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg(null);
    setFieldErrors({});

    if (!tutorName.trim() || !tutorEmail.trim() || !tutorQualification.trim()) {
      setErrorMsg("Please complete all required fields (Name, Email, Qualification).");
      return;
    }
    if (tutorSubjects.length === 0) {
      setErrorMsg("Please select at least one subject you can teach.");
      return;
    }
    if (tutorLevels.length === 0) {
      setErrorMsg("Please select at least one level.");
      return;
    }

    setLoading(true);

    const payload: any = {
      name: tutorName.trim(),
      email: tutorEmail.trim(),
      qualification: tutorQualification.trim(),
      subjects: tutorSubjects,
      levels: tutorLevels,
    };

    if (tutorPhone.trim()) payload.phone = tutorPhone.trim();
    if (tutorExperience.trim()) payload.years_of_experience = parseInt(tutorExperience.trim(), 10) || tutorExperience.trim();
    if (tutorBio.trim()) payload.bio = tutorBio.trim();

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
        if (res.status === 422 && data?.errors) {
          setFieldErrors(data.errors);
          setErrorMsg(data.message || "Please fix the validation errors below.");
        } else {
          setErrorMsg(data?.message || `Registration failed (HTTP ${res.status}).`);
        }
        return;
      }


      setRegistrationResult({
        type: "tutor",
        message: data?.message || "Tutor application submitted successfully. If your application is accepted, our admin team will reach out to you with your login details.",
      });
    } catch (err: any) {
      console.error("Tutor registration error:", err);
      setErrorMsg(err?.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0fdfa 0%, #f8fafc 50%, #f1f5f9 100%)",
        color: "#0f172a",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        padding: "2.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Brand Header */}
      <div style={{ marginBottom: "1.75rem", textAlign: "center" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            textDecoration: "none",
            color: "#0f172a",
          }}
        >
          <div
            style={{
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid #20b2a4",
              boxShadow: "0 4px 12px rgba(32,178,164,0.25)",
            }}
          >
            <Image
              src="/images/samin_logo.jpeg"
              alt="Samin Tutors"
              width={44}
              height={44}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              priority
            />
          </div>
          <span style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#20b2a4" }}>Samin</span>Tutors
          </span>
        </Link>
      </div>

      {/* Main Container Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "18px",
          boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)",
          padding: "2.25rem 2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent top gradient line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #20b2a4 0%, #0d9488 100%)",
          }}
        />

        {/* ── SUCCESS STATE ── */}
        {registrationResult ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div
              style={{
                width: "4.5rem",
                height: "4.5rem",
                borderRadius: "50%",
                background: "#f0fdfa",
                border: "2px solid #20b2a4",
                color: "#20b2a4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              <CheckCircle2 size={44} />
            </div>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>
              {registrationResult.type === "student" ? "Registration Successful! 🎉" : "Tutor Application Submitted! 🚀"}
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.92rem", maxWidth: "520px", margin: "0 auto 1.5rem", lineHeight: 1.5 }}>
              {registrationResult.message}
            </p>



            {/* Direct Action Buttons */}
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              {registrationResult.type === "student" ? (
                <Link
                  href="/"
                  style={{
                    padding: "0.85rem 1.8rem",
                    background: "linear-gradient(135deg, #20b2a4 0%, #0d9488 100%)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    boxShadow: "0 4px 14px rgba(32, 178, 164, 0.3)",
                  }}
                >
                  <span>Return to Home</span>
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <Link
                  href="/"
                  style={{
                    padding: "0.85rem 1.8rem",
                    background: "linear-gradient(135deg, #20b2a4 0%, #0d9488 100%)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    boxShadow: "0 4px 14px rgba(32, 178, 164, 0.3)",
                  }}
                >
                  <span>Return to Home</span>
                  <ArrowRight size={16} />
                </Link>
              )}

              <Link
                href="/login"
                style={{
                  padding: "0.85rem 1.4rem",
                  background: "#ffffff",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "8px",
                  color: "#334155",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                Sign In Page
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Header / Intro */}
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.35rem" }}>
                Create Your Account
              </h1>
              <p style={{ color: "#64748b", fontSize: "0.88rem" }}>
                Join Samin Tutors for customized 1-on-1 UK, US &amp; Canadian curriculum tutoring.
              </p>
            </div>

            {/* Role Tabs */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                background: "#f1f5f9",
                padding: "0.35rem",
                borderRadius: "10px",
                marginBottom: "1.75rem",
                border: "1px solid #e2e8f0",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveTab("student");
                  setErrorMsg(null);
                  setFieldErrors({});
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  transition: "all 0.2s",
                  background: activeTab === "student" ? "linear-gradient(135deg, #20b2a4 0%, #0d9488 100%)" : "transparent",
                  color: activeTab === "student" ? "#fff" : "#64748b",
                  boxShadow: activeTab === "student" ? "0 4px 12px rgba(32, 178, 164, 0.25)" : "none",
                }}
              >
                <GraduationCap size={18} />
                <span>Student / Parent</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("tutor");
                  setErrorMsg(null);
                  setFieldErrors({});
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  transition: "all 0.2s",
                  background: activeTab === "tutor" ? "linear-gradient(135deg, #20b2a4 0%, #0d9488 100%)" : "transparent",
                  color: activeTab === "tutor" ? "#fff" : "#64748b",
                  boxShadow: activeTab === "tutor" ? "0 4px 12px rgba(32, 178, 164, 0.25)" : "none",
                }}
              >
                <Briefcase size={18} />
                <span>Become a Tutor</span>
              </button>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "10px",
                  padding: "0.75rem 1rem",
                  color: "#b91c1c",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.6rem",
                  marginBottom: "1.5rem",
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ── STUDENT REGISTRATION FORM ── */}
            {activeTab === "student" && (
              <form onSubmit={handleStudentSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                    Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam Jenkins"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.85rem",
                      background: "#ffffff",
                      border: fieldErrors.student_name ? "1.5px solid #ef4444" : "1.5px solid #cbd5e1",
                      borderRadius: "8px",
                      color: "#0f172a",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                  {fieldErrors.student_name && (
                    <p style={{ color: "#ef4444", fontSize: "0.76rem", marginTop: "0.25rem" }}>
                      {fieldErrors.student_name[0]}
                    </p>
                  )}
                </div>

                {/* Parent Information Section */}
                <div
                  style={{
                    padding: "1rem 1.15rem",
                    background: "#f8fafc",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0d9488", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Info size={14} />
                    <span>Parent / Guardian Information (Optional)</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "0.75rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#475569", fontWeight: 600, marginBottom: "0.3rem" }}>
                        Parent / Guardian Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sarah Jenkins"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.65rem 0.8rem",
                          background: "#ffffff",
                          border: "1px solid #cbd5e1",
                          borderRadius: "6px",
                          color: "#0f172a",
                          fontSize: "0.88rem",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#475569", fontWeight: 600, marginBottom: "0.3rem" }}>
                        Parent Email
                      </label>
                      <input
                        type="email"
                        placeholder="sarah@example.com"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.65rem 0.8rem",
                          background: "#ffffff",
                          border: fieldErrors.parent_email ? "1.5px solid #ef4444" : "1px solid #cbd5e1",
                          borderRadius: "6px",
                          color: "#0f172a",
                          fontSize: "0.88rem",
                          outline: "none",
                        }}
                      />
                      {fieldErrors.parent_email && (
                        <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.2rem" }}>
                          {fieldErrors.parent_email[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "#475569", fontWeight: 600, marginBottom: "0.3rem" }}>
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="text"
                      placeholder="+44 7911 123456"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.8rem",
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        color: "#0f172a",
                        fontSize: "0.88rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                {/* Level / Grade Selection */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                    Academic Level / Grade *
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.85rem",
                      background: "#ffffff",
                      border: "1.5px solid #cbd5e1",
                      borderRadius: "8px",
                      color: "#0f172a",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  >
                    {AVAILABLE_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subjects Multi-select */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155" }}>
                      Subjects Needed * <span style={{ color: "#94a3b8", fontWeight: 400 }}>(Select all that apply)</span>
                    </label>
                    <span style={{ fontSize: "0.76rem", color: "#0d9488", fontWeight: 700 }}>
                      {selectedSubjects.length} selected
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                    {AVAILABLE_SUBJECTS.map((subj) => {
                      const isSelected = selectedSubjects.includes(subj);
                      return (
                        <button
                          key={subj}
                          type="button"
                          onClick={() => toggleStudentSubject(subj)}
                          style={{
                            padding: "0.45rem 0.8rem",
                            borderRadius: "6px",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s",
                            border: isSelected ? "1.5px solid #20b2a4" : "1px solid #cbd5e1",
                            background: isSelected ? "#f0fdfa" : "#ffffff",
                            color: isSelected ? "#0d9488" : "#475569",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                          }}
                        >
                          {isSelected && <Check size={13} />}
                          <span>{subj}</span>
                        </button>
                      );
                    })}
                  </div>
                  {fieldErrors.subjects && (
                    <p style={{ color: "#ef4444", fontSize: "0.76rem", marginTop: "0.3rem" }}>
                      {fieldErrors.subjects[0]}
                    </p>
                  )}
                </div>


                {/* Additional Notes */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                    Learning Goals &amp; Preferences <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Prefers weekday evenings. Needs help preparing for GCSE Algebra."
                    value={studentNotes}
                    onChange={(e) => setStudentNotes(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.85rem",
                      background: "#ffffff",
                      border: "1.5px solid #cbd5e1",
                      borderRadius: "8px",
                      color: "#0f172a",
                      fontSize: "0.88rem",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>

                {/* Submit Student Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "0.85rem",
                    background: "linear-gradient(135deg, #20b2a4 0%, #0d9488 100%)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 14px rgba(32, 178, 164, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    opacity: loading ? 0.75 : 1,
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        style={{
                          display: "inline-block",
                          width: "1rem",
                          height: "1rem",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      <span>Registering Student...</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap size={18} />
                      <span>Complete Student Registration</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ── TUTOR APPLICATION FORM ── */}
            {activeTab === "tutor" && (
              <form onSubmit={handleTutorSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Sarah Connor"
                      value={tutorName}
                      onChange={(e) => setTutorName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.85rem",
                        background: "#ffffff",
                        border: fieldErrors.name ? "1.5px solid #ef4444" : "1.5px solid #cbd5e1",
                        borderRadius: "8px",
                        color: "#0f172a",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                    {fieldErrors.name && (
                      <p style={{ color: "#ef4444", fontSize: "0.76rem", marginTop: "0.25rem" }}>
                        {fieldErrors.name[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sarah.connor@example.com"
                      value={tutorEmail}
                      onChange={(e) => setTutorEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.85rem",
                        background: "#ffffff",
                        border: fieldErrors.email ? "1.5px solid #ef4444" : "1.5px solid #cbd5e1",
                        borderRadius: "8px",
                        color: "#0f172a",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                    {fieldErrors.email && (
                      <p style={{ color: "#ef4444", fontSize: "0.76rem", marginTop: "0.25rem" }}>
                        {fieldErrors.email[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                      Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      placeholder="+44 7700 900123"
                      value={tutorPhone}
                      onChange={(e) => setTutorPhone(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.85rem",
                        background: "#ffffff",
                        border: "1.5px solid #cbd5e1",
                        borderRadius: "8px",
                        color: "#0f172a",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      placeholder="e.g. 5"
                      value={tutorExperience}
                      onChange={(e) => setTutorExperience(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.85rem",
                        background: "#ffffff",
                        border: "1.5px solid #cbd5e1",
                        borderRadius: "8px",
                        color: "#0f172a",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                {/* Qualification */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                    Highest Qualification / Degree *
                  </label>
                  <input
                    type="text"
                    required
                    list="qualifications-list"
                    placeholder="e.g. PhD in Pure Mathematics, Oxford"
                    value={tutorQualification}
                    onChange={(e) => setTutorQualification(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.85rem",
                      background: "#ffffff",
                      border: fieldErrors.qualification ? "1.5px solid #ef4444" : "1.5px solid #cbd5e1",
                      borderRadius: "8px",
                      color: "#0f172a",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                  <datalist id="qualifications-list">
                    {QUALIFICATIONS_LIST.map((q) => (
                      <option key={q.code} value={`${q.code} - ${q.name}`} />
                    ))}
                  </datalist>
                  {fieldErrors.qualification && (
                    <p style={{ color: "#ef4444", fontSize: "0.76rem", marginTop: "0.25rem" }}>
                      {fieldErrors.qualification[0]}
                    </p>
                  )}
                </div>

                {/* Subjects Multi-select */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155" }}>
                      Subjects You Can Teach *
                    </label>
                    <span style={{ fontSize: "0.76rem", color: "#0d9488", fontWeight: 700 }}>
                      {tutorSubjects.length} selected
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                    {AVAILABLE_SUBJECTS.map((subj) => {
                      const isSelected = tutorSubjects.includes(subj);
                      return (
                        <button
                          key={subj}
                          type="button"
                          onClick={() => toggleTutorSubject(subj)}
                          style={{
                            padding: "0.45rem 0.8rem",
                            borderRadius: "6px",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s",
                            border: isSelected ? "1.5px solid #20b2a4" : "1px solid #cbd5e1",
                            background: isSelected ? "#f0fdfa" : "#ffffff",
                            color: isSelected ? "#0d9488" : "#475569",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                          }}
                        >
                          {isSelected && <Check size={13} />}
                          <span>{subj}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Levels Multi-select */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155" }}>
                      Curriculum Levels Covered *
                    </label>
                    <span style={{ fontSize: "0.76rem", color: "#0d9488", fontWeight: 700 }}>
                      {tutorLevels.length} selected
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                    {AVAILABLE_LEVELS.map((lvl) => {
                      const isSelected = tutorLevels.includes(lvl);
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => toggleTutorLevel(lvl)}
                          style={{
                            padding: "0.4rem 0.75rem",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s",
                            border: isSelected ? "1.5px solid #20b2a4" : "1px solid #cbd5e1",
                            background: isSelected ? "#f0fdfa" : "#ffffff",
                            color: isSelected ? "#0d9488" : "#475569",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                          }}
                        >
                          {isSelected && <Check size={12} />}
                          <span>{lvl}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bio */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                    Bio &amp; Teaching Philosophy <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell prospective students about your background, teaching methods, and exam track record..."
                    value={tutorBio}
                    onChange={(e) => setTutorBio(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.85rem",
                      background: "#ffffff",
                      border: "1.5px solid #cbd5e1",
                      borderRadius: "8px",
                      color: "#0f172a",
                      fontSize: "0.88rem",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>


                {/* Submit Tutor Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "0.85rem",
                    background: "linear-gradient(135deg, #20b2a4 0%, #0d9488 100%)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 14px rgba(32, 178, 164, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    opacity: loading ? 0.75 : 1,
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        style={{
                          display: "inline-block",
                          width: "1rem",
                          height: "1rem",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      <span>Submitting Tutor Application...</span>
                    </>
                  ) : (
                    <>
                      <Briefcase size={18} />
                      <span>Submit Tutor Application</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Bottom link to Login */}
            <div
              style={{
                marginTop: "1.75rem",
                paddingTop: "1.25rem",
                borderTop: "1px solid #f1f5f9",
                textAlign: "center",
                fontSize: "0.88rem",
                color: "#64748b",
              }}
            >
              <span>Already registered? </span>
              <Link
                href="/login"
                style={{
                  color: "#0d9488",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Sign In to Portal
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Footer Back Link */}
      <div style={{ marginTop: "1.5rem", fontSize: "0.85rem" }}>
        <Link href="/" style={{ color: "#64748b", textDecoration: "none", fontWeight: 600 }}>
          ← Back to Homepage
        </Link>
      </div>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
