"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getBackendApiUrl } from "../utils/auth";
import { QUALIFICATIONS_LIST } from "../constants/qualifications";

const AVAILABLE_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Science",
  "English",
  "Economics",
  "Geography",
  "Computer Science",
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
  const [activeTab, setActiveTab] = useState<"student" | "tutor">("student");

  /* ─── Student Form State ─── */
  const [studentForm, setStudentForm] = useState({
    studentName: "",
    parentName: "",
    email: "",
    phone: "",
    level: "Year 1-6",
    subjects: ["Mathematics"] as string[],
    notes: "",
  });
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [studentSuccess, setStudentSuccess] = useState(false);

  /* ─── Tutor Form State ─── */
  const [tutorForm, setTutorForm] = useState({
    name: "",
    email: "",
    phone: "",
    degree: "",
    experience: "",
    subjects: ["Mathematics"] as string[],
    levels: ["Year 1-6"] as string[],
    notes: "",
  });
  const [tutorLoading, setTutorLoading] = useState(false);
  const [tutorError, setTutorError] = useState<string | null>(null);
  const [tutorSuccess, setTutorSuccess] = useState(false);
  const [tutorSuccessMsg, setTutorSuccessMsg] = useState("");

  const toggleStudentSubject = (s: string) => {
    setStudentForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(s)
        ? prev.subjects.filter((sub) => sub !== s)
        : [...prev.subjects, s],
    }));
  };

  const toggleTutorSubject = (s: string) => {
    setTutorForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(s)
        ? prev.subjects.filter((sub) => sub !== s)
        : [...prev.subjects, s],
    }));
  };

  const toggleTutorLevel = (lvl: string) => {
    setTutorForm((prev) => ({
      ...prev,
      levels: prev.levels.includes(lvl)
        ? prev.levels.filter((l) => l !== lvl)
        : [...prev.levels, lvl],
    }));
  };

  /* ─── Handle Student Submit ─── */
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (studentLoading) return;
    setStudentError(null);

    if (!studentForm.studentName.trim()) {
      setStudentError("Please enter the student's name.");
      return;
    }
    if (!studentForm.email.trim() && !studentForm.phone.trim()) {
      setStudentError("Please provide an email or phone number.");
      return;
    }
    if (studentForm.subjects.length === 0) {
      setStudentError("Please select at least one subject.");
      return;
    }

    setStudentLoading(true);

    const payload = {
      student_name: studentForm.studentName.trim(),
      parent_name: studentForm.parentName.trim() || undefined,
      parent_email: studentForm.email.trim() || undefined,
      phone: studentForm.phone.trim() || undefined,
      subjects: studentForm.subjects,
      level: studentForm.level || "Year 1-6",
      notes: studentForm.notes.trim() || undefined,
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
        setStudentError(msg);
        return;
      }

      setStudentSuccess(true);
      setStudentForm({
        studentName: "",
        parentName: "",
        email: "",
        phone: "",
        level: "Year 1-6",
        subjects: ["Mathematics"],
        notes: "",
      });
    } catch (err: any) {
      console.error("Student registration error:", err);
      setStudentError("Unable to connect to the backend server. Please try again.");
    } finally {
      setStudentLoading(false);
    }
  };

  /* ─── Handle Tutor Submit ─── */
  const handleTutorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tutorLoading) return;
    setTutorError(null);

    const trimmedName = tutorForm.name.trim();
    const trimmedEmail = tutorForm.email.trim();
    const trimmedDegree = tutorForm.degree.trim();

    if (!trimmedName || !trimmedEmail || !trimmedDegree) {
      setTutorError("Please fill in your name, email, and highest qualification.");
      return;
    }
    if (tutorForm.subjects.length === 0) {
      setTutorError("Please select at least one subject you can teach.");
      return;
    }

    setTutorLoading(true);

    const payload: any = {
      name: trimmedName,
      email: trimmedEmail,
      qualification: trimmedDegree,
      subjects: tutorForm.subjects,
      levels: tutorForm.levels.length ? tutorForm.levels : ["Year 1-6"],
    };

    if (tutorForm.phone.trim()) payload.phone = tutorForm.phone.trim();
    if (tutorForm.experience.trim()) {
      payload.years_of_experience = parseInt(tutorForm.experience.trim(), 10) || tutorForm.experience.trim();
    }
    if (tutorForm.notes.trim()) payload.bio = tutorForm.notes.trim();

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
        let msg = data?.message || `Application submission failed (HTTP ${res.status})`;
        if (data?.errors && typeof data.errors === "object") {
          const firstField = Object.keys(data.errors)[0];
          if (firstField && Array.isArray(data.errors[firstField]) && data.errors[firstField].length > 0) {
            msg = data.errors[firstField][0];
          }
        }
        setTutorError(msg);
        return;
      }

      setTutorSuccessMsg(
        data?.message ||
          "Tutor application submitted successfully. If your application is accepted, our admin team will reach out to you with your login details."
      );
      setTutorSuccess(true);
      setTutorForm({
        name: "",
        email: "",
        phone: "",
        degree: "",
        experience: "",
        subjects: ["Mathematics"],
        levels: ["Year 1-6"],
        notes: "",
      });
    } catch (err: any) {
      console.error("Tutor registration error:", err);
      setTutorError("Unable to connect to the backend server. Please try again.");
    } finally {
      setTutorLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0fdfa 0%, #f8fafc 50%, #f1f5f9 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "2rem 1rem 4rem",
        color: "#0f172a",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Top Brand Logo */}
      <div style={{ marginBottom: "1.2rem", textAlign: "center" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            textDecoration: "none",
            color: "#0f172a",
          }}
        >
          <div
            style={{
              width: "2.1rem",
              height: "2.1rem",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid #20b2a4",
              boxShadow: "0 2px 6px rgba(32,178,164,0.25)",
            }}
          >
            <Image
              src="/images/samin_logo.jpeg"
              alt="Samin Tutors"
              width={34}
              height={34}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              priority
            />
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#20b2a4" }}>Samin</span>Tutors
          </span>
        </Link>
      </div>

      {/* Main Container Card — Compact & Classic */}
      <div
        style={{
          maxWidth: "620px",
          width: "100%",
          boxShadow: "0 8px 30px rgba(0,0,0,0.07)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          background: "#fff",
        }}
      >
        {/* Compact Header with segmented control */}
        <div
          style={{
            background: "#ffffff",
            color: "#0f172a",
            borderBottom: "1px solid #e2e8f0",
            padding: "0.85rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.6rem",
          }}
        >
          {/* Title & Subtitle */}
          <div>
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Sparkles size={16} color="#0d9488" />
              <span>{activeTab === "student" ? "Register as Student / Parent" : "Apply to Become a Tutor"}</span>
            </h2>
            <p style={{ margin: "0.1rem 0 0", fontSize: "0.74rem", color: "#64748b" }}>
              {activeTab === "student"
                ? "Book your 1-on-1 trial lesson with top university specialists"
                : "Join our distinguished faculty of expert online educators"}
            </p>
          </div>

          {/* Segmented Pill Track */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#f1f5f9",
              padding: "3px",
              borderRadius: "24px",
              border: "1px solid #cbd5e1",
              gap: "3px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab("student");
                setStudentSuccess(false);
                setStudentError(null);
              }}
              style={{
                padding: "0.32rem 0.85rem",
                borderRadius: "20px",
                border: "none",
                background: activeTab === "student" ? "#0d9488" : "transparent",
                color: activeTab === "student" ? "#ffffff" : "#475569",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                transition: "all 0.15s ease",
              }}
            >
              <GraduationCap size={13} />
              <span>Student / Parent</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("tutor");
                setTutorSuccess(false);
                setTutorError(null);
              }}
              style={{
                padding: "0.32rem 0.85rem",
                borderRadius: "20px",
                border: "none",
                background: activeTab === "tutor" ? "#0d9488" : "transparent",
                color: activeTab === "tutor" ? "#ffffff" : "#475569",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                transition: "all 0.15s ease",
              }}
            >
              <Briefcase size={13} />
              <span>Apply as Tutor</span>
            </button>
          </div>
        </div>

        {/* ═══════════════════ STUDENT TAB ═══════════════════ */}
        {activeTab === "student" && (
          <div style={{ padding: "1.15rem 1.25rem" }}>
            {studentSuccess ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <div
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    borderRadius: "50%",
                    background: "#f0fdfa",
                    border: "2px solid #20b2a4",
                    color: "#20b2a4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ color: "#0f172a", fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.35rem" }}>
                  Registration Submitted! 🎉
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.5, maxWidth: "440px", margin: "0 auto 1.25rem" }}>
                  Thank you for registering with Samin Home Tutors! Your application has been received, and our admissions team will contact you shortly regarding tutor matching and lesson scheduling.
                </p>
                <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center" }}>
                  <Link href="/" className="btn-enroll" style={{ padding: "0.5rem 1.5rem", fontSize: "0.85rem", textDecoration: "none" }}>
                    Back to Homepage
                  </Link>
                  <Link href="/login" className="btn-enroll" style={{ padding: "0.5rem 1.5rem", fontSize: "0.85rem", background: "#0f172a", textDecoration: "none" }}>
                    Go to Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleStudentSubmit}>
                {studentError && (
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#991b1b",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      marginBottom: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.45rem",
                    }}
                  >
                    <AlertCircle size={14} style={{ flexShrink: 0 }} />
                    <span>{studentError}</span>
                  </div>
                )}

                {/* 2-column Compact Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem 0.85rem" }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="student-name" style={{ fontSize: "0.78rem", marginBottom: "0.25rem" }}>Student Name *</label>
                    <input
                      id="student-name"
                      className="form-control"
                      required
                      placeholder="Student's full name"
                      value={studentForm.studentName}
                      onChange={(e) => setStudentForm({ ...studentForm, studentName: e.target.value })}
                      style={{ height: "36px", padding: "0.4rem 0.7rem", fontSize: "0.85rem" }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="parent-name" style={{ fontSize: "0.78rem", marginBottom: "0.25rem" }}>Parent / Guardian Name</label>
                    <input
                      id="parent-name"
                      className="form-control"
                      placeholder="Guardian's full name"
                      value={studentForm.parentName}
                      onChange={(e) => setStudentForm({ ...studentForm, parentName: e.target.value })}
                      style={{ height: "36px", padding: "0.4rem 0.7rem", fontSize: "0.85rem" }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="student-email" style={{ fontSize: "0.78rem", marginBottom: "0.25rem" }}>Parent Email *</label>
                    <input
                      id="student-email"
                      type="email"
                      required
                      className="form-control"
                      placeholder="parent@email.com"
                      value={studentForm.email}
                      onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                      style={{ height: "36px", padding: "0.4rem 0.7rem", fontSize: "0.85rem" }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="student-phone" style={{ fontSize: "0.78rem", marginBottom: "0.25rem" }}>Phone / WhatsApp</label>
                    <input
                      id="student-phone"
                      className="form-control"
                      placeholder="+1 / +44 / +234..."
                      value={studentForm.phone}
                      onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                      style={{ height: "36px", padding: "0.4rem 0.7rem", fontSize: "0.85rem" }}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
                    <label htmlFor="student-level" style={{ fontSize: "0.78rem", marginBottom: "0.25rem" }}>Level / Grade *</label>
                    <select
                      id="student-level"
                      className="form-control"
                      required
                      value={studentForm.level}
                      onChange={(e) => setStudentForm({ ...studentForm, level: e.target.value })}
                      style={{ height: "36px", padding: "0.4rem 0.7rem", fontSize: "0.85rem" }}
                    >
                      {AVAILABLE_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Compact Subjects Row */}
                <div className="form-group" style={{ marginTop: "0.7rem", marginBottom: "0.6rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <label style={{ margin: 0, fontSize: "0.78rem" }}>
                      Subjects Needed * <span style={{ fontWeight: 400, color: "#94a3b8" }}>(tap to select)</span>
                    </label>
                    <span style={{ fontSize: "0.72rem", color: "#20b2a4", fontWeight: 700 }}>
                      {studentForm.subjects.length} selected
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {AVAILABLE_SUBJECTS.map((s) => {
                      const checked = studentForm.subjects.includes(s);
                      return (
                        <button
                          type="button"
                          key={s}
                          onClick={() => toggleStudentSubject(s)}
                          className={`tag-badge ${checked ? "selected" : ""}`}
                          aria-pressed={checked}
                          style={{
                            padding: "0.22rem 0.55rem",
                            fontSize: "0.76rem",
                            borderRadius: "5px",
                            borderWidth: "1px",
                          }}
                        >
                          <span className="checkbox-indicator" style={{ width: "13px", height: "13px", fontSize: "9px" }}>
                            {checked ? "✓" : ""}
                          </span>
                          <span>{s}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Compact Notes */}
                <div className="form-group" style={{ marginBottom: "0.85rem" }}>
                  <label htmlFor="student-notes" style={{ fontSize: "0.78rem", marginBottom: "0.25rem" }}>Additional Notes</label>
                  <textarea
                    id="student-notes"
                    className="form-control"
                    rows={2}
                    placeholder="Current level, target grades, exam boards, specific concerns..."
                    value={studentForm.notes}
                    onChange={(e) => setStudentForm({ ...studentForm, notes: e.target.value })}
                    style={{ padding: "0.45rem 0.7rem", fontSize: "0.82rem", lineHeight: 1.4 }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={studentLoading}
                  style={{
                    padding: "0.65rem 1.25rem",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    borderRadius: "8px",
                    opacity: studentLoading ? 0.7 : 1,
                    cursor: studentLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.45rem",
                  }}
                >
                  {studentLoading ? (
                    <>
                      <span
                        style={{
                          display: "inline-block",
                          width: "0.95rem",
                          height: "0.95rem",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap size={15} />
                      <span>Register as Student</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ═══════════════════ TUTOR TAB ═══════════════════ */}
        {activeTab === "tutor" && (
          <div style={{ padding: "1.15rem 1.25rem" }}>
            {tutorSuccess ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <div
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    borderRadius: "50%",
                    background: "#f0fdfa",
                    border: "2px solid #20b2a4",
                    color: "#20b2a4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ color: "#0f172a", fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.35rem" }}>
                  Application Submitted! 🎉
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.85rem", maxWidth: "440px", margin: "0 auto 1.25rem", lineHeight: 1.5 }}>
                  {tutorSuccessMsg ||
                    "Tutor application submitted successfully. If your application is accepted, our admin team will reach out to you with your login details."}
                </p>
                <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center" }}>
                  <Link href="/" className="btn-enroll" style={{ padding: "0.5rem 1.5rem", fontSize: "0.85rem", textDecoration: "none" }}>
                    Back to Homepage
                  </Link>
                  <Link href="/login" className="btn-enroll" style={{ padding: "0.5rem 1.5rem", fontSize: "0.85rem", background: "#0f172a", textDecoration: "none" }}>
                    Go to Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleTutorSubmit}>
                {tutorError && (
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fca5a5",
                      borderRadius: "6px",
                      padding: "0.5rem 0.75rem",
                      marginBottom: "0.85rem",
                      fontSize: "0.8rem",
                      color: "#b91c1c",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.45rem",
                    }}
                  >
                    <span>⚠️</span>
                    <span style={{ flex: 1, lineHeight: 1.4 }}>{tutorError}</span>
                  </div>
                )}

                {/* 2-column Compact Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem 0.85rem" }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="tutor-name" style={{ fontSize: "0.78rem", marginBottom: "0.25rem" }}>Full Name *</label>
                    <input
                      id="tutor-name"
                      className="form-control"
                      required
                      placeholder="Your full name"
                      value={tutorForm.name}
                      onChange={(e) => setTutorForm({ ...tutorForm, name: e.target.value })}
                      style={{ height: "36px", padding: "0.4rem 0.7rem", fontSize: "0.85rem" }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="tutor-email" style={{ fontSize: "0.78rem", marginBottom: "0.25rem" }}>Email Address *</label>
                    <input
                      id="tutor-email"
                      type="email"
                      className="form-control"
                      required
                      placeholder="you@email.com"
                      value={tutorForm.email}
                      onChange={(e) => setTutorForm({ ...tutorForm, email: e.target.value })}
                      style={{ height: "36px", padding: "0.4rem 0.7rem", fontSize: "0.85rem" }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="tutor-phone" style={{ fontSize: "0.78rem", marginBottom: "0.25rem" }}>Phone / WhatsApp</label>
                    <input
                      id="tutor-phone"
                      className="form-control"
                      placeholder="+1 / +44 / +234 ..."
                      value={tutorForm.phone}
                      onChange={(e) => setTutorForm({ ...tutorForm, phone: e.target.value })}
                      style={{ height: "36px", padding: "0.4rem 0.7rem", fontSize: "0.85rem" }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="tutor-degree" style={{ fontSize: "0.78rem", marginBottom: "0.25rem" }}>Highest Qualification *</label>
                    <select
                      id="tutor-degree"
                      className="form-control"
                      required
                      value={tutorForm.degree}
                      onChange={(e) => setTutorForm({ ...tutorForm, degree: e.target.value })}
                      style={{ height: "36px", padding: "0.4rem 0.7rem", fontSize: "0.85rem" }}
                    >
                      <option value="">— Select qualification —</option>
                      {QUALIFICATIONS_LIST.map((q) => (
                        <option key={q.code} value={q.code}>
                          {q.code} — {q.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
                    <label htmlFor="tutor-exp" style={{ fontSize: "0.78rem", marginBottom: "0.25rem" }}>Years of Tutoring Experience</label>
                    <input
                      id="tutor-exp"
                      type="number"
                      min="0"
                      max="60"
                      step="1"
                      className="form-control"
                      placeholder="e.g. 3"
                      value={tutorForm.experience}
                      onChange={(e) => setTutorForm({ ...tutorForm, experience: e.target.value.replace(/\D/g, "") })}
                      style={{ height: "36px", padding: "0.4rem 0.7rem", fontSize: "0.85rem" }}
                    />
                  </div>
                </div>

                {/* Subjects */}
                <div className="form-group" style={{ marginTop: "0.7rem", marginBottom: "0.6rem" }}>
                  <label style={{ fontSize: "0.78rem", marginBottom: "0.25rem" }}>
                    Subjects You Can Teach <span style={{ fontWeight: 400, color: "#94a3b8" }}>(tap to select)</span>
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {AVAILABLE_SUBJECTS.map((sub) => {
                      const checked = tutorForm.subjects.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => toggleTutorSubject(sub)}
                          style={{
                            padding: "0.22rem 0.55rem",
                            borderRadius: "16px",
                            fontSize: "0.76rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            border: checked ? "1.5px solid var(--teal)" : "1px solid var(--border)",
                            background: checked ? "var(--teal-light)" : "#fff",
                            color: checked ? "var(--teal-dark)" : "var(--text-muted)",
                            transition: "all 0.15s",
                          }}
                        >
                          {checked ? "✓ " : ""}
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Levels */}
                <div className="form-group" style={{ marginBottom: "0.6rem" }}>
                  <label style={{ fontSize: "0.78rem", marginBottom: "0.25rem" }}>
                    Levels You Can Teach <span style={{ fontWeight: 400, color: "#94a3b8" }}>(tap to select)</span>
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {AVAILABLE_LEVELS.map((lvl) => {
                      const checked = tutorForm.levels.includes(lvl);
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => toggleTutorLevel(lvl)}
                          style={{
                            padding: "0.22rem 0.55rem",
                            borderRadius: "16px",
                            fontSize: "0.76rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            border: checked ? "1.5px solid var(--teal)" : "1px solid var(--border)",
                            background: checked ? "var(--teal-light)" : "#fff",
                            color: checked ? "var(--teal-dark)" : "var(--text-muted)",
                            transition: "all 0.15s",
                          }}
                        >
                          {checked ? "✓ " : ""}
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bio */}
                <div className="form-group" style={{ marginBottom: "0.85rem" }}>
                  <label htmlFor="tutor-bio" style={{ fontSize: "0.78rem", marginBottom: "0.25rem" }}>Tell Us About Yourself</label>
                  <textarea
                    id="tutor-bio"
                    className="form-control"
                    rows={2}
                    placeholder="Teaching background, style, achievements, availability..."
                    value={tutorForm.notes}
                    onChange={(e) => setTutorForm({ ...tutorForm, notes: e.target.value })}
                    style={{ padding: "0.45rem 0.7rem", fontSize: "0.82rem", lineHeight: 1.4 }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={tutorLoading}
                  style={{
                    padding: "0.65rem 1.25rem",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    borderRadius: "8px",
                    opacity: tutorLoading ? 0.75 : 1,
                    cursor: tutorLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.45rem",
                  }}
                >
                  {tutorLoading ? (
                    <>
                      <span
                        style={{
                          display: "inline-block",
                          width: "0.95rem",
                          height: "0.95rem",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      <span>Submitting...</span>
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
        )}

        {/* Card Footer: Switch to Login */}
        <div
          style={{
            padding: "0.75rem 1.25rem",
            background: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            textAlign: "center",
            fontSize: "0.82rem",
            color: "var(--text-muted)",
          }}
        >
          <span>Already have an account? </span>
          <Link
            href="/login"
            style={{
              color: "var(--teal)",
              fontWeight: 700,
              textDecoration: "underline",
            }}
          >
            Sign in here
          </Link>
        </div>
      </div>

      {/* Footer Back Link */}
      <div style={{ marginTop: "0.85rem", fontSize: "0.82rem" }}>
        <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none", fontWeight: 600 }}>
          ← Back to Homepage
        </Link>
      </div>

      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
