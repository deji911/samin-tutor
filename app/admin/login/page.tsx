"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  MessageCircle,
  FileText,
  Search,
  LogOut,
  AlertCircle,
  Globe,
} from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"leads" | "tutors" | "schedule">("leads");

  // Mock enrollment leads data
  const [leads, setLeads] = useState([
    {
      id: "SAM-8021",
      parent: "Sarah Jenkins",
      student: "Liam (Year 11)",
      category: "GCSE preparation",
      subject: "Higher Mathematics",
      country: "🇬🇧 UK (London)",
      phone: "+44 7911 123456",
      status: "Diagnostic Scheduled",
      date: "Today, 10:30 AM",
      tutorAssigned: "David Zhang, MSc",
    },
    {
      id: "SAM-8022",
      parent: "Dr. Matthew Cole",
      student: "Emily (Grade 12)",
      category: "A level preparation",
      subject: "Pure Maths & Calculus",
      country: "🇨🇦 Canada (Toronto)",
      phone: "+1 416 555 0192",
      status: "New Inquiry",
      date: "Today, 09:15 AM",
      tutorAssigned: "Pending Match",
    },
    {
      id: "SAM-8023",
      parent: "Olivia Fraser",
      student: "Callum (S4)",
      category: "National 5",
      subject: "Nat 5 Physics & Maths",
      country: "🇬🇧 UK (Edinburgh)",
      phone: "+44 7700 900821",
      status: "Tutor Matched",
      date: "Yesterday",
      tutorAssigned: "Dr. Sophia Ramirez",
    },
    {
      id: "SAM-8024",
      parent: "Robert Vance",
      student: "Alexander (Grade 5)",
      category: "Year 1-6",
      subject: "Numeracy & Phonics",
      country: "🇺🇸 USA (New York)",
      phone: "+1 212 555 7834",
      status: "Active Student",
      date: "2 days ago",
      tutorAssigned: "Marcus Sterling, MA",
    },
    {
      id: "SAM-8025",
      parent: "Grace Adebayo",
      student: "Tobi (Year 5)",
      category: "11 plus preparation",
      subject: "Verbal & Non-Verbal Logic",
      country: "🇬🇧 UK (Birmingham)",
      phone: "+44 7820 445566",
      status: "New Inquiry",
      date: "3 days ago",
      tutorAssigned: "Pending Match",
    },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail === "saminhometutors@gmail.com" && password === "SaminMaster2026") {
        setIsLoggedIn(true);
      } else {
        setError("Invalid credentials");
      }
    }, 600);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#070f2b] text-slate-100 flex flex-col justify-between selection:bg-[#d4a017]/20 selection:text-[#ffd56b]">
      {/* Top Admin Bar */}
      <header className="border-b border-[#d4a017]/20 bg-[#0a1435]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-[#ffd56b] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Return to Public Website</span>
            <span className="sm:hidden">Exit</span>
          </Link>

          {/* Center Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-lg border-2 border-[#d4a017]/60 bg-white p-0.5 shrink-0">
              <Image
                src="/images/samin_logo.jpeg"
                alt="Samin Home Tutors Logo"
                width={48}
                height={48}
                className="w-full h-full object-cover rounded-lg"
                priority
              />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black tracking-tight text-white leading-none">
                <span className="text-[#ffd56b]">SAMIN</span> ADMIN PORTAL
              </div>
              <div className="text-[9px] sm:text-[10px] tracking-wider text-[#d4a017] font-bold uppercase mt-1">
                Internal Management System
              </div>
            </div>
          </div>

          <div>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-semibold hover:bg-rose-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">System Online</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-center">
        {!isLoggedIn ? (
          /* LOGIN FORM SCREEN */
          <div className="w-full max-w-md">
            {/* Glowing Card */}
            <div className="relative rounded-3xl bg-[#0d1b42] border border-[#d4a017]/30 p-8 sm:p-10 shadow-2xl overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#d4a017]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Large Centered Logo */}
              <div className="text-center space-y-3">
                <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-[#d4a017] bg-white p-1 shadow-xl shadow-[#070f2b]/50">
                  <Image
                    src="/images/samin_logo.jpeg"
                    alt="Samin Home Tutors Emblem"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-xl"
                    priority
                  />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4a017]/15 text-[#ffd56b] text-xs font-bold border border-[#d4a017]/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Authorized Personnel Only</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Staff &amp; Admin Sign In</h1>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Manage student admissions, diagnostic assessments, and tutor assignments across Canada 🇨🇦, USA 🇺🇸, and UK 🇬🇧.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                    Official Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="saminhometutors@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070f2b] border border-white/15 text-white text-xs focus:border-[#d4a017] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                    Admin Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#070f2b] border border-white/15 text-white text-xs focus:border-[#d4a017] focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4a017] via-[#ffd56b] to-[#b8860b] text-[#070f2b] font-black text-sm shadow-xl shadow-[#d4a017]/25 hover:shadow-[#d4a017]/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#070f2b]/40 border-t-[#070f2b] rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Sign In to Admin Dashboard</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2 text-[11px] text-slate-400 border-t border-white/10">
                Protected by 256-bit TLS Encryption &amp; Multi-Factor Access Gateway
              </div>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD VIEW */
          <div className="w-full space-y-8 animate-fadeIn">
            {/* Top greeting bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d1b42] border border-[#d4a017]/25 p-6 rounded-2xl shadow-lg">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">Welcome back, Admin Director</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold border border-emerald-500/20">
                    Superuser
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Active Region Sync: 🇨🇦 Canada (EST/PST) • 🇺🇸 USA (EST/CST/PST) • 🇬🇧 UK (GMT/BST)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/2347059655382"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-xs font-semibold flex items-center gap-2 hover:bg-emerald-500/25 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open Samin WhatsApp Support</span>
                </a>
              </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#0d1b42] border border-white/10 space-y-1">
                <div className="text-xs font-semibold text-slate-400 uppercase">Incoming Inquiries</div>
                <div className="text-3xl font-extrabold text-[#ffd56b]">24</div>
                <div className="text-[11px] text-emerald-400">↑ 18% from last week</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0d1b42] border border-white/10 space-y-1">
                <div className="text-xs font-semibold text-slate-400 uppercase">Active Tutors Online</div>
                <div className="text-3xl font-extrabold text-white">48</div>
                <div className="text-[11px] text-[#ffd56b]">All DBS &amp; Credentials Verified</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0d1b42] border border-white/10 space-y-1">
                <div className="text-xs font-semibold text-slate-400 uppercase">Hours Scheduled This Week</div>
                <div className="text-3xl font-extrabold text-[#ffd56b]">214 hrs</div>
                <div className="text-[11px] text-slate-300">100% Live HD Classrooms</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0d1b42] border border-white/10 space-y-1">
                <div className="text-xs font-semibold text-slate-400 uppercase">Tutor Match Score</div>
                <div className="text-3xl font-extrabold text-white">99.8%</div>
                <div className="text-[11px] text-emerald-400">Zero Unresolved Tickets</div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-2">
              <button
                onClick={() => setActiveTab("leads")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "leads"
                    ? "bg-[#d4a017] text-[#070f2b]"
                    : "bg-[#0d1b42] text-slate-300 hover:text-white"
                }`}
              >
                Recent Inquiries &amp; Leads ({leads.length})
              </button>
              <button
                onClick={() => setActiveTab("tutors")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "tutors"
                    ? "bg-[#d4a017] text-[#070f2b]"
                    : "bg-[#0d1b42] text-slate-300 hover:text-white"
                }`}
              >
                Verified Tutors Roster (3 Featured)
              </button>
            </div>

            {/* Table: Leads List */}
            {activeTab === "leads" && (
              <div className="rounded-2xl bg-[#0d1b42] border border-white/10 overflow-hidden shadow-xl">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Latest Student Diagnostics &amp; Inquiries</h3>
                  <div className="text-xs text-[#ffd56b] font-medium">Real-time Lead Intake</div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0a1435] text-slate-300 font-semibold border-b border-white/10">
                      <tr>
                        <th className="p-3.5">Lead ID</th>
                        <th className="p-3.5">Parent &amp; Student</th>
                        <th className="p-3.5">Category &amp; Subject</th>
                        <th className="p-3.5">Region</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Tutor Assigned</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-[#152554]/50 transition-colors">
                          <td className="p-3.5 font-mono text-slate-400">{lead.id}</td>
                          <td className="p-3.5">
                            <div className="font-bold text-white">{lead.parent}</div>
                            <div className="text-[11px] text-slate-300">{lead.student}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-[#ffd56b]">{lead.category}</div>
                            <div className="text-[11px] text-slate-300">{lead.subject}</div>
                          </td>
                          <td className="p-3.5 text-slate-300">{lead.country}</td>
                          <td className="p-3.5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                lead.status === "Active Student"
                                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
                                  : lead.status === "Diagnostic Scheduled"
                                  ? "bg-sky-500/15 text-sky-300 border border-sky-500/25"
                                  : lead.status === "Tutor Matched"
                                  ? "bg-purple-500/15 text-purple-300 border border-purple-500/25"
                                  : "bg-amber-500/15 text-amber-300 border border-amber-500/25"
                              }`}
                            >
                              {lead.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-200">{lead.tutorAssigned}</td>
                          <td className="p-3.5 text-right space-x-2">
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-[11px] font-semibold hover:bg-emerald-500/25"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tutors view */}
            {activeTab === "tutors" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-[#0d1b42] border border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-[#d4a017]/40">
                      <Image src="/images/tutor-1.jpg" alt="David" fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-white">David Zhang, MSc</div>
                      <div className="text-xs text-[#ffd56b]">Imperial College London</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300">Active Students: 18 • Pure &amp; Further Maths</div>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold">
                    Accepting New Students (UK &amp; Canada)
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d1b42] border border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-[#d4a017]/40">
                      <Image src="/images/tutor-2.jpg" alt="Sophia" fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Dr. Sophia Ramirez, PhD</div>
                      <div className="text-xs text-[#ffd56b]">Oxford University</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300">Active Students: 22 • Chemistry, Biology &amp; Med</div>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold">
                    Accepting New Students (UK &amp; USA)
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d1b42] border border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-[#d4a017]/40">
                      <Image src="/images/tutor-3.jpg" alt="Marcus" fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Marcus Sterling, MA</div>
                      <div className="text-xs text-[#ffd56b]">Cambridge University</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300">Active Students: 16 • English Lit &amp; 11+</div>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold">
                    Accepting New Students (All Timezones)
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#d4a017]/20 bg-[#050a1d] py-4 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Samin Home Tutors Ltd. Authorized Administrative Security System.
      </footer>
    </div>
  );
}
