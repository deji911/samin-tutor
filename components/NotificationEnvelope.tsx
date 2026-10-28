"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mail,
  MailOpen,
  CheckCheck,
  Trash2,
  Calendar,
  AlertCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  X,
  Check,
  Bell,
  Sparkles,
} from "lucide-react";

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  action_url?: string | null;
  metadata?: Record<string, any> | null;
  read_at?: string | null;
  is_read: boolean;
  created_at: string;
  created_at_human?: string;
}

interface NotificationEnvelopeProps {
  /** Optional callback when a notification action URL is clicked, e.g. switching tabs inside a dashboard */
  onActionClick?: (actionUrl: string, notification: AppNotification) => void;
  /** Visual theme for the envelope button icon */
  theme?: "light" | "dark" | "teal";
}

export default function NotificationEnvelope({
  onActionClick,
  theme = "light",
}: NotificationEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  /* ── 1. Fetch unread count: GET /api/notifications/unread-count ── */
  const fetchUnreadCount = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
    if (!token) return;

    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/notifications/unread-count`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (typeof data?.unread_count === "number") {
          setUnreadCount(data.unread_count);
        }
      }
    } catch (err) {
      console.warn("Error fetching unread notification count:", err);
    }
  }, []);

  /* ── 2. Fetch notifications list: GET /api/notifications?filter={filter}&per_page=15 ── */
  const fetchNotifications = useCallback(
    async (currentFilter: "all" | "unread" = filter) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("samin_auth_token") : null;
      if (!token) return;

      setLoading(true);
      try {
        const baseUrl = getBackendApiUrl();
        const res = await fetch(
          `${baseUrl}/api/notifications?filter=${currentFilter}&per_page=20&page=1`,
          {
            headers: getAuthHeaders(),
          }
        );
        if (res.ok) {
          const data = await res.json().catch(() => null);
          const list = data?.notifications?.data || (Array.isArray(data?.notifications) ? data.notifications : []);
          setNotifications(list);
          if (typeof data?.unread_count === "number") {
            setUnreadCount(data.unread_count);
          }
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    },
    [filter]
  );

  /* ── 3. Mark single notification as read: PATCH /api/notifications/{id}/read ── */
  const markAsRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActionInProgressId(id);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
        );
        if (typeof data?.unread_count === "number") {
          setUnreadCount(data.unread_count);
        } else {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    } finally {
      setActionInProgressId(null);
    }
  };

  /* ── 4. Mark single notification as unread: PATCH /api/notifications/{id}/unread ── */
  const markAsUnread = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActionInProgressId(id);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/notifications/${id}/unread`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: false, read_at: null } : n))
        );
        if (typeof data?.unread_count === "number") {
          setUnreadCount(data.unread_count);
        } else {
          setUnreadCount((c) => c + 1);
        }
      }
    } catch (err) {
      console.error("Error marking notification as unread:", err);
    } finally {
      setActionInProgressId(null);
    }
  };

  /* ── 5. Mark all as read: POST /api/notifications/mark-all-read ── */
  const markAllAsRead = async () => {
    if (markingAll || unreadCount === 0) return;
    setMarkingAll(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/notifications/mark-all-read`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  /* ── 6. Delete notification: DELETE /api/notifications/{id} ── */
  const deleteNotification = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActionInProgressId(id);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/api/notifications/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (typeof data?.unread_count === "number") {
          setUnreadCount(data.unread_count);
        }
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    } finally {
      setActionInProgressId(null);
    }
  };

  /* ── Handle notification item click ── */
  const handleItemClick = (notification: AppNotification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    if (notification.action_url) {
      if (onActionClick) {
        onActionClick(notification.action_url, notification);
      } else if (typeof window !== "undefined") {
        window.location.href = notification.action_url;
      }
      setIsOpen(false);
    }
  };

  /* Initial fetch & Polling every 35s */
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 35000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  /* Fetch list whenever popover is opened or filter changes */
  useEffect(() => {
    if (isOpen) {
      fetchNotifications(filter);
    }
  }, [isOpen, filter, fetchNotifications]);

  /* Close dropdown when clicked outside */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  /* Get icon helper based on notification type */
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "session_change_request":
        return <Calendar size={16} color="#d97706" />;
      case "tutor_approved":
      case "tutor_status":
        return <Sparkles size={16} color="#0d9488" />;
      case "report":
      case "lesson_session":
        return <Clock size={16} color="#0284c7" />;
      default:
        return <Bell size={16} color="#6366f1" />;
    }
  };

  const buttonStyles: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: theme === "dark" ? "1px solid rgba(255,255,255,0.2)" : "1px solid #e2e8f0",
    background: theme === "dark" ? "rgba(255,255,255,0.08)" : "#fff",
    color: theme === "dark" ? "#fff" : "#475569",
    cursor: "pointer",
    transition: "all 0.15s ease",
    padding: 0,
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      {/* ── Letter Envelope Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={buttonStyles}
        title={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "Notifications"}
        aria-label="Notifications"
      >
        <Mail size={18} />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "#ef4444",
              color: "#fff",
              fontSize: "0.65rem",
              fontWeight: 800,
              minWidth: "18px",
              height: "18px",
              lineHeight: "18px",
              borderRadius: "9px",
              textAlign: "center",
              padding: "0 4px",
              boxShadow: "0 2px 5px rgba(239,68,68,0.4)",
              boxSizing: "border-box",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Notification Dropdown Flyout ── */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "380px",
            maxWidth: "calc(100vw - 24px)",
            background: "#ffffff",
            borderRadius: "14px",
            boxShadow: "0 20px 40px -10px rgba(15,23,42,0.22), 0 0 0 1px rgba(0,0,0,0.06)",
            zIndex: 1050,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "fadeUp 0.18s ease-out",
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "0.85rem 1rem",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#fafafa",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  background: "#e0f2fe",
                  color: "#0284c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Mail size={15} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "0.88rem", fontWeight: 800, color: "#0f172a" }}>
                  Notifications
                </h4>
                <div style={{ fontSize: "0.7rem", color: "#64748b" }}>
                  {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "All caught up"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  disabled={markingAll}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.28rem 0.55rem",
                    borderRadius: "6px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    color: "#166534",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    cursor: markingAll ? "not-allowed" : "pointer",
                  }}
                  title="Mark all as read"
                >
                  <CheckCheck size={12} />
                  <span>{markingAll ? "Marking…" : "Mark all read"}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => fetchNotifications(filter)}
                disabled={loading}
                style={{
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  padding: "0.3rem",
                  cursor: "pointer",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Refresh notifications"
              >
                <RefreshCw size={13} style={{ animation: loading ? "spin 0.8s linear infinite" : "none" }} />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div
            style={{
              padding: "0.4rem 0.85rem",
              background: "#fff",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              gap: "0.4rem",
            }}
          >
            <button
              type="button"
              onClick={() => setFilter("all")}
              style={{
                padding: "0.25rem 0.65rem",
                borderRadius: "20px",
                fontSize: "0.74rem",
                fontWeight: filter === "all" ? 700 : 500,
                border: "none",
                background: filter === "all" ? "#0f172a" : "#f1f5f9",
                color: filter === "all" ? "#fff" : "#475569",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              style={{
                padding: "0.25rem 0.65rem",
                borderRadius: "20px",
                fontSize: "0.74rem",
                fontWeight: filter === "unread" ? 700 : 500,
                border: "none",
                background: filter === "unread" ? "#0d9488" : "#f1f5f9",
                color: filter === "unread" ? "#fff" : "#475569",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                transition: "all 0.15s ease",
              }}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: filter === "unread" ? "rgba(255,255,255,0.3)" : "#ef4444",
                    color: "#fff",
                    borderRadius: "10px",
                    padding: "0 0.35rem",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Notifications List */}
          <div
            style={{
              maxHeight: "360px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {loading && notifications.length === 0 ? (
              <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#64748b" }}>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    border: "2px solid #0d9488",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.75s linear infinite",
                    margin: "0 auto 0.6rem",
                  }}
                />
                <span style={{ fontSize: "0.78rem" }}>Loading notifications…</span>
              </div>
            ) : notifications.length === 0 ? (
              <div
                style={{
                  padding: "2.75rem 1.5rem",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "#f0fdf4",
                    color: "#16a34a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MailOpen size={24} />
                </div>
                <h5 style={{ margin: 0, fontSize: "0.88rem", fontWeight: 700, color: "#1e293b" }}>
                  {filter === "unread" ? "No unread notifications" : "Inbox is empty"}
                </h5>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b", maxWidth: "240px", lineHeight: 1.45 }}>
                  {filter === "unread"
                    ? "You've read all your notifications."
                    : "You're completely up to date. We'll alert you here when new events occur."}
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const isItemBusy = actionInProgressId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    style={{
                      padding: "0.75rem 1rem",
                      borderBottom: "1px solid #f8fafc",
                      background: item.is_read ? "#ffffff" : "#f0fdfa",
                      cursor: item.action_url ? "pointer" : "default",
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "flex-start",
                      position: "relative",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!item.is_read) {
                        e.currentTarget.style.background = "#e6fffa";
                      } else {
                        e.currentTarget.style.background = "#f8fafc";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = item.is_read ? "#ffffff" : "#f0fdfa";
                    }}
                  >
                    {/* Category icon */}
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: item.is_read ? "#f1f5f9" : "#ccfbf1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: "0.1rem",
                      }}
                    >
                      {getNotificationIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                        <span
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: item.is_read ? 600 : 800,
                            color: item.is_read ? "#334155" : "#0f172a",
                            lineHeight: 1.3,
                          }}
                        >
                          {item.title}
                        </span>
                        {!item.is_read && (
                          <span
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "50%",
                              background: "#0d9488",
                              flexShrink: 0,
                            }}
                            title="Unread"
                          />
                        )}
                      </div>

                      <p
                        style={{
                          margin: "0.2rem 0 0.35rem",
                          fontSize: "0.75rem",
                          color: "#475569",
                          lineHeight: 1.45,
                          wordBreak: "break-word",
                        }}
                      >
                        {item.message}
                      </p>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.25rem" }}>
                        <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>
                          {item.created_at_human || new Date(item.created_at).toLocaleDateString()}
                        </span>

                        {/* Card mini-actions */}
                        <div
                          style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.action_url && (
                            <button
                              type="button"
                              onClick={() => handleItemClick(item)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#0d9488",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.2rem",
                                padding: "0.15rem 0.35rem",
                              }}
                              title="Go to details"
                            >
                              <span>View</span>
                              <ExternalLink size={10} />
                            </button>
                          )}

                          {/* Toggle read / unread */}
                          {item.is_read ? (
                            <button
                              type="button"
                              disabled={isItemBusy}
                              onClick={(e) => markAsUnread(item.id, e)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#64748b",
                                padding: "0.2rem",
                                cursor: isItemBusy ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                              }}
                              title="Mark as unread"
                            >
                              <Mail size={12} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={isItemBusy}
                              onClick={(e) => markAsRead(item.id, e)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#0d9488",
                                padding: "0.2rem",
                                cursor: isItemBusy ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                              }}
                              title="Mark as read"
                            >
                              <Check size={13} />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            disabled={isItemBusy}
                            onClick={(e) => deleteNotification(item.id, e)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#ef4444",
                              opacity: 0.75,
                              padding: "0.2rem",
                              cursor: isItemBusy ? "not-allowed" : "pointer",
                              display: "flex",
                              alignItems: "center",
                            }}
                            title="Delete notification"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "0.65rem 1rem",
              background: "#fafafa",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
              Total: {notifications.length} notification{notifications.length === 1 ? "" : "s"}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#64748b",
                fontSize: "0.74rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
