"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LogOut,
  ArrowLeft,
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
  const [userRole, setUserRole] = useState<string>("admin");
  const [isMustChange, setIsMustChange] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("samin_auth_token");
      if (!token) {
        // No authenticated session, redirect to home
        router.push("/");
        return;
      }

      const must = localStorage.getItem("samin_must_change_password") === "true";
      setIsMustChange(must);

      const storedUser = localStorage.getItem("samin_user");
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          if (u.name) setUserName(u.name);
          if (u.email) setUserEmail(u.email);
          if (u.role) setUserRole(u.role);
          if (u.must_change_password) setIsMustChange(true);
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

  const handleLogout = async () => {
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
    if (loading) return;

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

      // Redirect to respective dashboard
      setTimeout(() => {
        let dest = "/admin/dashboard";
        if (typeof window !== "undefined") {
          try {
            const u = JSON.parse(localStorage.getItem("samin_user") || "{}");
            if (u?.role === "tutor") {
              dest = "/tutor/dashboard";
            }
          } catch {}
        }
        router.push(dest);
      }, 1400);
    } catch (err: any) {
      console.error("Change password request error:", err);
      setErrorMsg(err?.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const isMinLength = newPassword.length >= 8;
  const isMatch = Boolean(newPassword && confirmPassword && newPassword === confirmPassword);
  const dashboardHref = userRole === "tutor" ? "/tutor/dashboard" : "/admin/dashboard";

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
            <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Security Settings</div>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {!isMustChange && (
            <Link
              href={dashboardHref}
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
              <span>Back to Dashboard</span>
            </Link>
          )}

          <button
            onClick={handleLogout}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.45rem 0.85rem",
              borderRadius: "6px",
              border: "1px solid #fecaca",
              background: "#fff",
              color: "#dc2626",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
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
              <Lock size={20} />
            </div>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.35rem" }}>
              {isMustChange ? "Set Your New Password" : "Change Password"}
            </h1>
            <p style={{ fontSize: "0.83rem", color: "#64748b", margin: 0, lineHeight: 1.45 }}>
              {isMustChange
                ? "Please replace your temporary password with a permanent, secure password."
                : "Enter your current password to choose a new one."}
            </p>
          </div>

          {/* Temporary Password Notice */}
          {isMustChange && (
            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fef3c7",
                borderRadius: "8px",
                padding: "0.75rem 0.9rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.55rem",
                marginBottom: "1.25rem",
              }}
            >
              <AlertCircle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div style={{ fontSize: "0.78rem", color: "#92400e", lineHeight: 1.4 }}>
                A password change is required before you can access the dashboard.
              </div>
            </div>
          )}

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
          {success ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
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
                Password Updated!
              </h2>
              <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                Redirecting to your dashboard…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Current Password */}
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
                  {isMustChange ? "Temporary Password" : "Current Password"}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showCurrent ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={isMustChange ? "Temporary password from email" : "Your current password"}
                    style={{
                      width: "100%",
                      padding: "0.6rem 2.2rem 0.6rem 0.8rem",
                      borderRadius: "7px",
                      border: fieldErrors.current_password ? "1.5px solid #ef4444" : "1.5px solid #cbd5e1",
                      fontSize: "0.88rem",
                      outline: "none",
                      boxSizing: "border-box",
                      background: "#fff",
                      color: "#0f172a",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      padding: "4px",
                    }}
                    aria-label={showCurrent ? "Hide password" : "Show password"}
                  >
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {fieldErrors.current_password && (
                  <div style={{ fontSize: "0.73rem", color: "#ef4444", marginTop: "0.25rem" }}>
                    {fieldErrors.current_password[0]}
                  </div>
                )}
              </div>

              {/* New Password */}
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
                  New Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    style={{
                      width: "100%",
                      padding: "0.6rem 2.2rem 0.6rem 0.8rem",
                      borderRadius: "7px",
                      border: fieldErrors.password ? "1.5px solid #ef4444" : "1.5px solid #cbd5e1",
                      fontSize: "0.88rem",
                      outline: "none",
                      boxSizing: "border-box",
                      background: "#fff",
                      color: "#0f172a",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      padding: "4px",
                    }}
                    aria-label={showNew ? "Hide password" : "Show password"}
                  >
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <div style={{ fontSize: "0.73rem", color: "#ef4444", marginTop: "0.25rem" }}>
                    {fieldErrors.password[0]}
                  </div>
                )}
                <div style={{ fontSize: "0.72rem", color: isMinLength ? "#059669" : "#64748b", marginTop: "0.3rem" }}>
                  {isMinLength ? "✓ Meets minimum length (8+ characters)" : "Must be at least 8 characters"}
                </div>
              </div>

              {/* Confirm Password */}
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
                  Confirm New Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    style={{
                      width: "100%",
                      padding: "0.6rem 2.2rem 0.6rem 0.8rem",
                      borderRadius: "7px",
                      border: confirmPassword && !isMatch ? "1.5px solid #ef4444" : "1.5px solid #cbd5e1",
                      fontSize: "0.88rem",
                      outline: "none",
                      boxSizing: "border-box",
                      background: "#fff",
                      color: "#0f172a",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      padding: "4px",
                    }}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {confirmPassword && (
                  <div style={{ fontSize: "0.72rem", marginTop: "0.3rem", color: isMatch ? "#059669" : "#dc2626" }}>
                    {isMatch ? "✓ Passwords match" : "Passwords do not match"}
                  </div>
                )}
              </div>

              {/* Submit Button */}
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
                  transition: "background 0.15s ease",
                }}
              >
                {loading ? "Updating Password…" : "Save New Password"}
              </button>

              {/* Cancel / Dashboard link if not mandatory */}
              {!isMustChange && (
                <div style={{ textAlign: "center", marginTop: "0.25rem" }}>
                  <Link
                    href={dashboardHref}
                    style={{
                      fontSize: "0.8rem",
                      color: "#64748b",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Cancel and return to dashboard
                  </Link>
                </div>
              )}
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
