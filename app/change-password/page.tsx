"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);

  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("samin_auth_token");
      if (!token) {
        // No authenticated session, redirect to home/login
        router.push("/");
        return;
      }

      const storedUser = localStorage.getItem("samin_user");
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          if (u.name) setUserName(u.name);
          if (u.email) setUserEmail(u.email);
        } catch {}
      }
    }
  }, [router]);

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

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("samin_admin_logged_in");
      localStorage.removeItem("samin_auth_token");
      localStorage.removeItem("samin_user");
      localStorage.removeItem("samin_must_change_password");
    }
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFieldErrors({});

    if (!currentPassword) {
      setErrorMsg("Please enter your current or temporary password.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirmation do not match.");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    if (!token) {
      setErrorMsg("Authentication session expired. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 401) {
          setErrorMsg(data?.message || "Current password is incorrect.");
        } else if (res.status === 422 && data?.errors) {
          setFieldErrors(data.errors);
          setErrorMsg(data?.message || "Please fix the validation errors below.");
        } else {
          setErrorMsg(data?.message || `Failed to update password (HTTP ${res.status}).`);
        }
        return;
      }

      // Success 200 OK
      setSuccess(true);
      if (typeof window !== "undefined") {
        localStorage.removeItem("samin_must_change_password");
        const storedUser = localStorage.getItem("samin_user");
        if (storedUser) {
          try {
            const u = JSON.parse(storedUser);
            u.must_change_password = false;
            localStorage.setItem("samin_user", JSON.stringify(u));
          } catch {}
        }
      }

      // Automatically redirect after brief celebration
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1600);
    } catch (err: any) {
      console.error("Change password request error:", err);
      setErrorMsg(err?.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const isMinLength = newPassword.length >= 8;
  const isMatch = Boolean(newPassword && confirmPassword && newPassword === confirmPassword);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #0f2744 0%, #061121 100%)",
        color: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        fontFamily: "inherit",
      }}
    >
      {/* Top Header */}
      <header
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backdropFilter: "blur(8px)",
          background: "rgba(6,17,33,0.5)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
            color: "#fff",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #20b2a4 0%, #0d9488 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(32,178,164,0.3)",
            }}
          >
            <ShieldCheck size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.02em" }}>
              Samin Online Tutoring
            </div>
            <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
              Account Security Portal
            </div>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#94a3b8",
            borderRadius: "8px",
            padding: "0.45rem 0.85rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#f87171";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          }}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Container */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            background: "rgba(15, 33, 60, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "20px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.45), 0 0 40px rgba(32,178,164,0.12)",
            overflow: "hidden",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Header Accent Bar */}
          <div
            style={{
              height: "4px",
              background: "linear-gradient(90deg, #20b2a4, #38bdf8, #818cf8)",
            }}
          />

          <div style={{ padding: "2rem 2.2rem" }}>
            {/* Icon & Title */}
            <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, rgba(32,178,164,0.2) 0%, rgba(13,148,136,0.1) 100%)",
                  border: "1px solid rgba(32,178,164,0.3)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                  boxShadow: "0 8px 24px rgba(32,178,164,0.2)",
                }}
              >
                <KeyRound size={28} color="#2dd4bf" />
              </div>
              <h1
                style={{
                  fontSize: "1.45rem",
                  fontWeight: 800,
                  margin: "0 0 0.4rem",
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                Set New Password
              </h1>
              <p style={{ fontSize: "0.86rem", color: "#94a3b8", margin: 0, lineHeight: 1.45 }}>
                {userName ? `Welcome, ${userName}! ` : ""}
                Please replace your temporary password with a secure personal password.
              </p>
            </div>

            {/* Notification Banner */}
            <div
              style={{
                background: "rgba(234, 179, 8, 0.12)",
                border: "1px solid rgba(234, 179, 8, 0.3)",
                borderRadius: "12px",
                padding: "0.85rem 1rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <AlertCircle size={18} color="#facc15" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div style={{ fontSize: "0.8rem", color: "#fef08a", lineHeight: 1.4 }}>
                <strong>Temporary Password Active:</strong> For your security, password change is required before you can access the dashboard and lesson calendar.
              </div>
            </div>

            {/* Top Error Alert */}
            {errorMsg && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  borderRadius: "12px",
                  padding: "0.85rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  marginBottom: "1.25rem",
                  fontSize: "0.83rem",
                  color: "#fca5a5",
                }}
              >
                <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success State */}
            {success ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "1.5rem 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "rgba(34, 197, 94, 0.2)",
                    border: "2px solid #22c55e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle2 size={32} color="#22c55e" />
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "#fff" }}>
                  Password Changed Successfully!
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>
                  Redirecting you to the dashboard…
                </p>
                <div
                  style={{
                    marginTop: "0.5rem",
                    width: "28px",
                    height: "28px",
                    border: "3px solid #20b2a4",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.15rem" }}>
                {/* Current Password Field */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#cbd5e1",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Current / Temporary Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showCurrent ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter temporary password from email"
                      style={{
                        width: "100%",
                        padding: "0.65rem 2.5rem 0.65rem 0.85rem",
                        background: "rgba(255,255,255,0.06)",
                        border: fieldErrors.current_password ? "1.5px solid #ef4444" : "1.5px solid rgba(255,255,255,0.14)",
                        borderRadius: "10px",
                        color: "#fff",
                        fontSize: "0.88rem",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => {
                        if (!fieldErrors.current_password) e.currentTarget.style.borderColor = "#20b2a4";
                      }}
                      onBlur={(e) => {
                        if (!fieldErrors.current_password) e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        padding: "4px",
                      }}
                    >
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.current_password && (
                    <div style={{ fontSize: "0.75rem", color: "#f87171", marginTop: "0.25rem" }}>
                      {fieldErrors.current_password[0]}
                    </div>
                  )}
                </div>

                {/* New Password Field */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#cbd5e1",
                      marginBottom: "0.4rem",
                    }}
                  >
                    New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showNew ? "text" : "password"}
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      style={{
                        width: "100%",
                        padding: "0.65rem 2.5rem 0.65rem 0.85rem",
                        background: "rgba(255,255,255,0.06)",
                        border: fieldErrors.password ? "1.5px solid #ef4444" : "1.5px solid rgba(255,255,255,0.14)",
                        borderRadius: "10px",
                        color: "#fff",
                        fontSize: "0.88rem",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => {
                        if (!fieldErrors.password) e.currentTarget.style.borderColor = "#20b2a4";
                      }}
                      onBlur={(e) => {
                        if (!fieldErrors.password) e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        padding: "4px",
                      }}
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <div style={{ fontSize: "0.75rem", color: "#f87171", marginTop: "0.25rem" }}>
                      {fieldErrors.password[0]}
                    </div>
                  )}

                  {/* Requirements Tracker */}
                  <div style={{ display: "flex", gap: "1rem", marginTop: "0.4rem", fontSize: "0.73rem" }}>
                    <span style={{ color: isMinLength ? "#4ade80" : "#94a3b8", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                      <CheckCircle2 size={12} color={isMinLength ? "#4ade80" : "#64748b"} /> 8+ characters
                    </span>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#cbd5e1",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Confirm New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      style={{
                        width: "100%",
                        padding: "0.65rem 2.5rem 0.65rem 0.85rem",
                        background: "rgba(255,255,255,0.06)",
                        border: confirmPassword && !isMatch ? "1.5px solid #ef4444" : "1.5px solid rgba(255,255,255,0.14)",
                        borderRadius: "10px",
                        color: "#fff",
                        fontSize: "0.88rem",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => {
                        if (!confirmPassword || isMatch) e.currentTarget.style.borderColor = "#20b2a4";
                      }}
                      onBlur={(e) => {
                        if (!confirmPassword || isMatch) e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        padding: "4px",
                      }}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmPassword && (
                    <div style={{ fontSize: "0.73rem", marginTop: "0.3rem", color: isMatch ? "#4ade80" : "#f87171", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <CheckCircle2 size={12} color={isMatch ? "#4ade80" : "#f87171"} />
                      {isMatch ? "Passwords match" : "Passwords do not match"}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: "0.75rem",
                    padding: "0.8rem 1.25rem",
                    background: "linear-gradient(135deg, #20b2a4 0%, #0d9488 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    boxShadow: "0 4px 14px rgba(32,178,164,0.35)",
                    opacity: loading ? 0.75 : 1,
                    transition: "all 0.2s ease",
                  }}
                >
                  {loading ? (
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
                      <span>Updating Password…</span>
                    </>
                  ) : (
                    <>
                      <span>Update Password &amp; Continue</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "1rem",
          textAlign: "center",
          fontSize: "0.75rem",
          color: "#64748b",
        }}
      >
        © {new Date().getFullYear()} Samin Home Tutors Ltd. All rights reserved.
      </footer>
    </div>
  );
}
