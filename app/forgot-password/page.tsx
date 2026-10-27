"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowLeft,
  Send,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    setLoading(true);

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMsg(data?.message || `Failed to submit reset request (HTTP ${res.status}).`);
        return;
      }

      // 200 OK
      setSuccessMessage(
        data?.message || "If that email exists, a reset link has been sent."
      );
    } catch (err: any) {
      console.error("Forgot password request error:", err);
      setErrorMsg(err?.message || "An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        color: "#1e293b",
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "0.85rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid #20b2a4",
              flexShrink: 0,
            }}
          >
            <Image
              src="/images/samin_logo.jpeg"
              alt="Samin Home Tutors"
              width={32}
              height={32}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a", lineHeight: 1.2 }}>
              <span style={{ color: "#20b2a4" }}>Samin</span> Tutors
            </div>
            <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Password Recovery</div>
          </div>
        </Link>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.45rem 0.85rem",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            background: "#ffffff",
            color: "#475569",
            fontSize: "0.8rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={13} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content Card */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2.5rem 1rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 18px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)",
            padding: "2rem",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "#f0fdf9",
                border: "1px solid #ccfbf1",
                color: "#0d9488",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.85rem",
              }}
            >
              <KeyRound size={20} />
            </div>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.35rem" }}>
              Forgot Password
            </h1>
            <p style={{ fontSize: "0.83rem", color: "#64748b", margin: 0, lineHeight: 1.45 }}>
              Enter your registered email address to receive a secure password reset link.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "0.75rem 0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                marginBottom: "1.25rem",
                fontSize: "0.8rem",
                color: "#dc2626",
              }}
            >
              <AlertCircle size={15} color="#dc2626" style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success State */}
          {successMessage ? (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#ecfdf5",
                  border: "1.5px solid #a7f3d0",
                  color: "#059669",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                <CheckCircle2 size={26} />
              </div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.35rem" }}>
                Check Your Inbox
              </h2>
              <p style={{ fontSize: "0.83rem", color: "#475569", margin: "0 0 1rem", lineHeight: 1.5 }}>
                {successMessage}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <button
                  onClick={() => {
                    setSuccessMessage(null);
                    setEmail("");
                  }}
                  style={{
                    padding: "0.65rem 1rem",
                    borderRadius: "7px",
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    color: "#475569",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Send to a different email
                </button>
                <Link
                  href="/"
                  style={{
                    padding: "0.65rem 1rem",
                    borderRadius: "7px",
                    background: "#0d9488",
                    color: "#fff",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "0.35rem",
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    required
                    placeholder="e.g. tutor@samin.com or parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem 0.6rem 2.2rem",
                      borderRadius: "7px",
                      border: "1.5px solid #cbd5e1",
                      fontSize: "0.88rem",
                      outline: "none",
                      boxSizing: "border-box",
                      background: "#fff",
                      color: "#0f172a",
                    }}
                  />
                  <Mail
                    size={15}
                    color="#94a3b8"
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.75rem",
                  background: loading ? "#94a3b8" : "#0d9488",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "7px",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  pointerEvents: loading ? "none" : "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                }}
              >
                {loading ? "Sending Link…" : "Send Reset Link"}
              </button>

              <div style={{ textAlign: "center", marginTop: "0.25rem" }}>
                <Link
                  href="/"
                  style={{
                    fontSize: "0.8rem",
                    color: "#64748b",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Remembered your password? Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #e2e8f0",
          background: "#ffffff",
          padding: "1rem",
          textAlign: "center",
          fontSize: "0.75rem",
          color: "#94a3b8",
        }}
      >
        © {new Date().getFullYear()} Samin Home Tutors Ltd. All rights reserved.
      </footer>
    </div>
  );
}
