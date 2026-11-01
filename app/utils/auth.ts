// Authentication and API utilities for Samin Tutors

export const getBackendApiUrl = (): string => {
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

export interface AuthUser {
  id: number;
  name: string;
  email?: string;
  username?: string;
  role: "student" | "parent" | "tutor" | "admin" | "super_admin" | string;
  must_change_password?: boolean;
  phone?: string | null;
}

export const saveAuthSession = (data: {
  token?: string;
  user?: AuthUser;
  must_change_password?: boolean;
}): void => {
  if (typeof window === "undefined") return;

  if (data.token) {
    localStorage.setItem("samin_auth_token", data.token);
  }
  if (data.user) {
    localStorage.setItem("samin_user", JSON.stringify(data.user));
    localStorage.setItem("samin_admin_logged_in", "true");
  }

  const mustChange = data.must_change_password === true || data.user?.must_change_password === true;
  if (mustChange) {
    localStorage.setItem("samin_must_change_password", "true");
  } else {
    localStorage.removeItem("samin_must_change_password");
  }
};

export const clearAuthSession = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("samin_auth_token");
  localStorage.removeItem("samin_user");
  localStorage.removeItem("samin_admin_logged_in");
  localStorage.removeItem("samin_must_change_password");
  localStorage.removeItem("samin_tutor_token");
};

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("samin_auth_token");
};

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("samin_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const isMustChangePassword = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("samin_must_change_password") === "true";
};

export const getRoleDashboardPath = (role?: string): string => {
  switch (role) {
    case "student":
      return "/student/dashboard";
    case "parent":
      return "/parent/dashboard";
    case "tutor":
      return "/tutor/dashboard";
    case "admin":
    case "super_admin":
      return "/admin/dashboard";
    default:
      return "/";
  }
};
