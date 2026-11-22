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
  const [success, setSuccess] = useState(false);

  const [userRole, setUserRole] = useState<string>("admin");
  const [isMustChange, setIsMustChange] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("samin_auth_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const must = localStorage.getItem("samin_must_change_password") === "true";
      setIsMustChange(must);

      const storedUser = localStorage.getItem("samin_user");
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
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

    if (!currentPassword) {
      setErrorMsg("Please enter your current or temporary password.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirmation do not match.");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    if (!token) {
      setErrorMsg("Session expired. Please log in again.");
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
          const firstErr = Object.values(data.errors).flat()[0] as string;
          setErrorMsg(firstErr || data?.message || "Validation failed.");
        } else {
          setErrorMsg(data?.message || `Failed to update password (HTTP ${res.status}).`);
        }
        return;
      }

      setSuccess(true);
      if (typeof window !== "undefined") {
        // Clear all preexisting session, auth tokens, and cached roles
        localStorage.removeItem("samin_auth_token");
        localStorage.removeItem("samin_user");
        localStorage.removeItem("samin_admin_logged_in");
        localStorage.removeItem("samin_must_change_password");
        sessionStorage.clear();
      }

      setTimeout(() => {
        // Replace all preexisting routes and send cleanly to login page
        if (typeof window !== "undefined") {
          window.location.replace("/login");
        } else {
          router.replace("/login");
        }
      }, 1200);
    } catch (err: any) {
      console.error("Change password request error:", err);
      setErrorMsg("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const dashboardHref =
    userRole === "tutor"
      ? "/tutor/dashboard"
      : userRole === "student"
      ? "/student/dashboard"
      : userRole === "parent"
      ? "/parent/dashboard"
      : "/admin/dashboard";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0fdfa 0%, #f8fafc 50%, #f1f5f9 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem 1rem",
        color: "#0f172a",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Top Brand Logo */}
      <div style={{ marginBottom: "1.25rem", textAlign: "center" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.55rem",
            textDecoration: "none",
            color: "#0f172a",
          }}
        >
          <div
            style={{
              width: "2.4rem",
              height: "2.4rem",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid #20b2a4",
              boxShadow: "0 2px 8px rgba(32,178,164,0.25)",
            }}
          >
            <Image
              src="/images/samin_logo.jpeg"
              alt="Samin Tutors"
              width={38}
              height={38}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              priority
            />
          </div>
          <span style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#20b2a4" }}>Samin</span>Tutors
          </span>
        </Link>
      </div>

      {/* Main Card */}
      <div
        className="modal-box"
        style={{
          maxWidth: "420px",
          width: "100%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          background: "#fff",
        }}
      >
        <div className="modal-header">
          <h2>
            <Lock size={18} style={{ display: "inline", marginRight: "0.5rem" }} />
            {isMustChange ? "Set New Password" : "Change Password"}
          </h2>
        </div>

        <div className="modal-body" style={{ padding: "1.5rem" }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div
                style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  borderRadius: "50%",
                  background: "var(--teal-light)",
                  border: "2px solid var(--teal)",
                  color: "var(--teal)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ color: "var(--dark)", fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.4rem" }}>
                Password Updated!
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: 0 }}>
                Redirecting you to the login page...
              </p>
            </div>
          ) : (
            <div>
              {errorMsg && (
                <div
                  style={{
                    padding: "0.65rem 0.85rem",
                    background: "#fef2f2",
                    border: "1px solid #fca5a5",
                    borderRadius: "6px",
                    color: "#b91c1c",
                    fontSize: "0.82rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="currentPassword">
                    {isMustChange ? "Temporary Password" : "Current Password"}
                  </label>
                  <div className="password-input-wrap">
                    <input
                      id="currentPassword"
                      type={showCurrent ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="form-control"
                      placeholder={isMustChange ? "Enter temporary password" : "Enter current password"}
                      style={{ paddingRight: "2.5rem" }}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowCurrent(!showCurrent)}
                      aria-label={showCurrent ? "Hide password" : "Show password"}
                    >
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="password-input-wrap">
                    <input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="form-control"
                      placeholder="At least 8 characters"
                      style={{ paddingRight: "2.5rem" }}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowNew(!showNew)}
                      aria-label={showNew ? "Hide password" : "Show password"}
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <div className="password-input-wrap">
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-control"
                      placeholder="Re-enter new password"
                      style={{ paddingRight: "2.5rem" }}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                  style={{
                    opacity: loading ? 0.75 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
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
                      <span>Updating...</span>
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>

              {!isMustChange && (
                <div
                  style={{
                    marginTop: "1.25rem",
                    textAlign: "center",
                    fontSize: "0.82rem",
                  }}
                >
                  <Link
                    href={dashboardHref}
                    style={{
                      color: "var(--teal)",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    ← Back to Dashboard
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
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
