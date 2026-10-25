"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentPortalRoot() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/student/dashboard");
  }, [router]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "'Inter',system-ui,sans-serif", background: "#f8fafc" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid #20b2a4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 1rem" }} />
        <p style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>Loading Student &amp; Parent Portal…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}
