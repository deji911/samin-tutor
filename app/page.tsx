"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Star,
  Users,
  Award,
  Video,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Phone,
  Mail,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  X,
  Menu,
  Laptop,
  TrendingUp,
  FileCheck2,
} from "lucide-react";

type LearnerCategory =
  | "reception"
  | "year1_6"
  | "eleven_plus"
  | "year7_12"
  | "gcse"
  | "nat5"
  | "alevel";

export default function Home() {
  // Mobile drawer state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    parentName: "",
    studentName: "",
    email: "",
    phone: "",
    gradeLevel: "GCSE preparation",
    subject: "Mathematics",
    mode: "100% Live Online 1-on-1",
    notes: "",
  });

  // Level selector state
  const [activeLevelTab, setActiveLevelTab] = useState<LearnerCategory>("gcse");

  // Calculator states
  const [calcLevel, setCalcLevel] = useState<LearnerCategory>("gcse");
  const [calcFormat, setCalcFormat] = useState<"1on1" | "pod">("1on1");
  const [calcHours, setCalcHours] = useState<number>(2);

  // FAQ accordion state
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Dynamic pricing calculation (100% Online)
  const baseRates: Record<LearnerCategory, { "1on1": number; pod: number }> = {
    reception: { "1on1": 28, pod: 18 },
    year1_6: { "1on1": 32, pod: 22 },
    eleven_plus: { "1on1": 36, pod: 24 },
    year7_12: { "1on1": 36, pod: 24 },
    gcse: { "1on1": 40, pod: 28 },
    nat5: { "1on1": 40, pod: 28 },
    alevel: { "1on1": 48, pod: 34 },
  };

  const currentHourlyRate = baseRates[calcLevel][calcFormat];
  const weeklyTotal = currentHourlyRate * calcHours;
  const monthlyTotal = weeklyTotal * 4;
  const discountMultiplier = calcHours >= 4 ? 0.9 : calcHours >= 2 ? 0.95 : 1;
  const discountedMonthlyTotal = Math.round(monthlyTotal * discountMultiplier);
  const savings = monthlyTotal - discountedMonthlyTotal;

  const handleOpenBooking = (tutorName?: string) => {
    if (tutorName) {
      setSelectedTutorForBooking(tutorName);
    } else {
      setSelectedTutorForBooking(null);
    }
    setBookingSuccess(false);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a2e] overflow-x-hidden w-full max-w-full relative">
      {/* Top Announcement Banner */}
      <div className="bg-[#0f2055] py-2.5 px-4 text-center text-xs sm:text-sm text-white flex flex-wrap items-center justify-center gap-2 shadow-inner w-full">
        <span className="flex h-2 w-2 rounded-full bg-[#d4a017] animate-ping" />
        <span className="font-semibold text-white/95">Serving Students Across 🇨🇦 Canada • 🇺🇸 USA • 🇬🇧 UK:</span>
        <span className="text-[#ffd56b] font-medium hidden sm:inline">Free Diagnostic Assessment &amp; Lesson Plan Included</span>
        <button
          onClick={() => handleOpenBooking()}
          className="ml-1 sm:ml-2 underline font-bold text-[#ffd56b] hover:text-white transition-colors cursor-pointer"
        >
          Enroll Today &rarr;
        </button>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#0f2055]/10 shadow-[0_2px_12px_rgba(15,32,85,0.06)] w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <a href="#" className="flex items-center gap-2 sm:gap-3 group min-w-0 pr-2">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-md shadow-[#0f2055]/15 border-2 border-[#d4a017]/40 bg-white p-0.5 shrink-0 group-hover:border-[#d4a017] transition-all">
              <Image
                src="/images/samin_logo.jpeg"
                alt="Samin Home Tutors Logo"
                width={48}
                height={48}
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <div className="text-sm sm:text-base lg:text-xl font-black tracking-tight leading-snug text-[#0f2055] whitespace-nowrap">
                <span className="text-[#1e3a8a]">SAMIN</span>{" "}
                <span>HOME TUTORS</span>
              </div>
              <div className="text-[8px] sm:text-[9px] lg:text-[10px] tracking-wider text-[#b8860b] font-bold uppercase whitespace-nowrap">
                Canada • USA • UK Online Tutoring
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-semibold text-[#1a1a2e] ml-6 lg:ml-8">
            <a href="#levels" className="hover:text-[#b8860b] transition-colors whitespace-nowrap">
              Programs &amp; Levels
            </a>
            <a href="#method" className="hover:text-[#b8860b] transition-colors whitespace-nowrap">
              The Samin Method
            </a>
            <a href="#tutors" className="hover:text-[#b8860b] transition-colors whitespace-nowrap">
              Our Tutors
            </a>
            <a href="#calculator" className="hover:text-[#b8860b] transition-colors whitespace-nowrap">
              Tuition Calculator
            </a>
            <a href="#virtual-classroom" className="hover:text-[#b8860b] transition-colors whitespace-nowrap">
              Online Classroom
            </a>
            <a href="#faqs" className="hover:text-[#b8860b] transition-colors whitespace-nowrap">
              FAQs
            </a>
          </nav>

          {/* Action CTAs: Desktop shows WhatsApp + Admin; Mobile shows ONLY the firm Hamburger Menu button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="https://wa.me/2347059655382"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
            <a
              href="/admin/login"
              className="hidden lg:inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-[#faf9f6] text-[#0f2055] border border-[#0f2055]/15 hover:border-[#b8860b] hover:text-[#b8860b] transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>Admin</span>
            </a>
            {/* Mobile Hamburger Toggle - firmly visible and always within viewport */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#0f2055] bg-[#f5f3ef] hover:bg-[#edeae3] transition-colors cursor-pointer shrink-0 border border-[#0f2055]/10"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5 text-[#0f2055]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileNavOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileNavOpen(false)}>
          <div className="mobile-nav-panel" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#edeae3]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#d4a017]/40 p-0.5 bg-white shrink-0">
                  <Image src="/images/samin_logo.jpeg" alt="Samin Logo" width={40} height={40} className="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <div className="text-sm font-black text-[#0f2055] leading-none"><span className="text-[#1e3a8a]">SAMIN</span> HOME TUTORS</div>
                  <div className="text-[9px] text-[#b8860b] font-bold uppercase tracking-wider mt-1">Canada • USA • UK</div>
                </div>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-2 rounded-lg bg-[#f5f3ef] hover:bg-[#edeae3] text-[#0f2055] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 flex-1 py-1">
              {[
                { href: "#levels", label: "Programs & Levels" },
                { href: "#method", label: "The Samin Method" },
                { href: "#tutors", label: "Our Tutors" },
                { href: "#calculator", label: "Tuition Calculator" },
                { href: "#virtual-classroom", label: "Online Classroom" },
                { href: "#faqs", label: "FAQs" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl text-[#1a1a2e] font-semibold text-sm hover:bg-[#f0eeeb] hover:text-[#0f2055] transition-all"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Mobile Actions: WhatsApp, Admin, and Enroll placed prominently in menu drawer */}
            <div className="pt-4 border-t border-[#edeae3] mt-auto space-y-2.5">
              <a
                href="https://wa.me/2347059655382"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs sm:text-sm hover:bg-emerald-100 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp: +234 705 965 5382</span>
              </a>

              <a
                href="/admin/login"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#faf9f6] text-[#0f2055] border border-[#0f2055]/15 font-bold text-xs sm:text-sm hover:border-[#b8860b] hover:text-[#b8860b] transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-[#b8860b]" />
                <span>Staff &amp; Admin Portal</span>
              </a>

              <button
                onClick={() => { setMobileNavOpen(false); handleOpenBooking(); }}
                className="w-full btn-primary py-3 text-xs sm:text-sm cursor-pointer"
              >
                Enroll Now • Free Trial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-10 pb-16 sm:pt-20 sm:pb-28 overflow-hidden bg-hero-pattern">
        <div className="absolute inset-0 bg-grid-dots opacity-100 pointer-events-none" />

        {/* Soft orb accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[#1e3a8a]/05 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[300px] bg-[#d4a017]/06 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Value Proposition & Brand Pitch */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#d4a017]/30 shadow-sm">
                <div className="flex text-[#d4a017]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#3a3a5c]">
                  <span className="font-bold text-[#0f2055]">4.98 / 5 Rating</span> from 1,200+ Ambitious Families
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-[#0f2055]">
                World-Class 1-on-1 Lessons That Turn Academic{" "}
                <span className="text-gradient-gold-navy">Potential Into Mastery</span>
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-[#3a3a5c] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                At <span className="font-bold text-[#0f2055]">Samin Home Tutors</span>, we provide 100% interactive live online
                tutoring tailored specifically for students in{" "}
                <span className="font-bold text-[#1e3a8a]">Canada 🇨🇦</span>,{" "}
                <span className="font-bold text-[#b8860b]">the USA 🇺🇸</span>, and{" "}
                <span className="font-bold text-[#1e3a8a]">the UK 🇬🇧</span>. Matched with vetted subject specialists,
                our students build confidence, master core concepts, and achieve top grades.
              </p>

              {/* Dual Action CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => handleOpenBooking()}
                  className="w-full sm:w-auto btn-primary text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4"
                >
                  <Sparkles className="w-5 h-5 text-[#d4a017]" />
                  <span>Book Free Consultation &amp; Diagnostic</span>
                </button>
                <a
                  href="#calculator"
                  className="w-full sm:w-auto btn-outline text-sm sm:text-base px-6 sm:px-7 py-3.5 sm:py-4"
                >
                  <span>Tuition Calculator</span>
                  <ArrowRight className="w-4 h-4 text-[#b8860b]" />
                </a>
              </div>

              {/* Mini Trust Highlights */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#0f2055]/10 text-left">
                {[
                  "Top 3% Vetted Tutors",
                  "100% Tutor Match Guarantee",
                  "Weekly Parent Progress Log",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#b8860b] shrink-0" />
                    <span className="text-xs sm:text-sm text-[#3a3a5c] font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Visual */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow border ring */}
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-[#2563eb] via-[#00d2c4] to-[#ff6b4a] opacity-40 blur-lg" />

                {/* Main Card Container */}
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#0a1426] shadow-2xl">
                  {/* Window Bar Header */}
                  <div className="bg-[#0c1830] px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="text-xs font-mono text-slate-400 ml-2">Samin Virtual Classroom HD</span>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      LIVE SESSION
                    </div>
                  </div>

                  {/* High Quality Student Photo */}
                  <div className="relative h-72 sm:h-84 w-full overflow-hidden bg-slate-900">
                    <Image
                      src="/images/hero-student.jpg"
                      alt="Student engaged in an interactive Samin Home Tutors online lesson"
                      fill
                      className="object-cover object-center"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060b17] via-transparent to-transparent opacity-80" />

                    {/* On-image badge: Subject topic */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="bg-[#070e1c]/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
                        <div className="text-[11px] text-[#00d2c4] font-semibold uppercase">Current Focus</div>
                        <div className="text-sm font-bold text-white">Calculus & Mechanics • Past Paper Drill</div>
                      </div>
                      <div className="bg-[#070e1c]/85 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15 text-center">
                        <div className="text-[11px] text-slate-400">Tutor Match</div>
                        <div className="text-sm font-bold text-amber-400">100% Fit</div>
                      </div>
                    </div>
                  </div>

                  {/* Lesson Meta bar */}
                  <div className="p-4 bg-white/95 border-t border-[#0f2055]/10 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#3a3a5c]">
                      <span className="flex items-center gap-1.5 font-semibold text-[#0f2055]">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Enhanced DBS Checked Tutor
                      </span>
                      <span className="text-[#b8860b] font-bold">Grade 9 / A* Track</span>
                    </div>

                    {/* Progress Bar Snippet */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#5a6070] font-medium">Curriculum Mastery (Edexcel Pure Maths)</span>
                        <span className="font-bold text-[#0f2055]">94%</span>
                      </div>
                      <div className="w-full bg-[#edeae3] h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#d4a017] h-full rounded-full w-[94%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Grade Boost Card */}
                <div className="absolute -bottom-6 -left-6 hidden sm:flex bg-white/95 backdrop-blur-lg border border-[#0f2055]/10 p-4 rounded-2xl shadow-xl shadow-[#0f2055]/15 items-center gap-3.5 max-w-[240px]">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#0f2055] flex items-center justify-center text-white shrink-0 shadow-md">
                    <TrendingUp className="w-6 h-6 text-[#ffd56b]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#b8860b] uppercase tracking-wider">Proven Boost</div>
                    <div className="text-sm font-black text-[#0f2055]">Grade 5 ➔ Grade 9</div>
                    <div className="text-[11px] text-[#5a6070]">Within 12 Weeks</div>
                  </div>
                </div>

                {/* Floating Tutor Rating Card */}
                <div className="absolute -top-6 -right-4 hidden sm:flex bg-white/95 backdrop-blur-lg border border-[#0f2055]/10 p-3.5 rounded-2xl shadow-xl shadow-[#0f2055]/15 items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0f2055] to-[#1e3a8a] flex items-center justify-center text-[#ffd56b] font-black text-sm border border-[#d4a017]/40">
                    OX
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0f2055]">Oxbridge &amp; Ivy Mentors</div>
                    <div className="text-[11px] text-[#b8860b] font-semibold flex items-center gap-1">
                      <span>Top 3% Acceptance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Proof Bar */}
      <section className="border-y border-[#0f2055]/10 bg-white py-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0f2055]">99.4%</div>
              <div className="text-xs sm:text-sm font-bold text-[#1a1a2e]">Exam Pass &amp; Target Grade Rate</div>
              <div className="text-[11px] text-[#5a6070]">Across GCSE, IGCSE &amp; A-Levels</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#b8860b]">500+</div>
              <div className="text-xs sm:text-sm font-bold text-[#1a1a2e]">Elite Specialist Tutors</div>
              <div className="text-[11px] text-[#5a6070]">All Enhanced DBS &amp; Verified</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0f2055]">45,000+</div>
              <div className="text-xs sm:text-sm font-bold text-[#1a1a2e]">Online Lessons Delivered</div>
              <div className="text-[11px] text-[#5a6070]">Live Across Canada 🇨🇦, USA 🇺🇸 &amp; UK 🇬🇧 Timezones</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#b8860b]">100%</div>
              <div className="text-xs sm:text-sm font-bold text-[#1a1a2e]">Tutor Match Guarantee</div>
              <div className="text-[11px] text-[#5a6070]">Free switch if not completely delighted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs & Academic Levels Explorer */}
      <section id="levels" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-4">
            <div className="badge-gold mx-auto">Comprehensive Curriculum</div>
            <div className="divider-gold mx-auto" />
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f2055]">
              Tailored Programs for Every Academic Milestone
            </h2>
            <p className="text-[#5a6070] text-sm sm:text-lg leading-relaxed">
              From early Reception phonics and Year 1-6 foundations to 11 Plus preparation, Year 7-12 transition, GCSEs,
              Scottish National 5, and A Level exam excellence, our specialist educators provide laser-focused online guidance.
            </p>

            {/* Level Tabs */}
            <div className="flex items-center justify-start sm:justify-center gap-2 pt-4 overflow-x-auto pb-2 px-1 max-w-full no-scrollbar">
              {[
                { id: "reception", label: "Reception" },
                { id: "year1_6", label: "Year 1-6" },
                { id: "eleven_plus", label: "11 plus preparation" },
                { id: "year7_12", label: "Year 7-12" },
                { id: "gcse", label: "GCSE preparation" },
                { id: "nat5", label: "National 5" },
                { id: "alevel", label: "A level preparation" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveLevelTab(tab.id as LearnerCategory)}
                  className={`tab-pill ${activeLevelTab === tab.id ? "active" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Level Details View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Reception */}
            {activeLevelTab === "reception" && (
              <>
                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🔤
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">Early Phonics & Guided Reading</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Letter-sound recognition, phonics blending, sight words, and playful storytelling that builds
                    early literacy confidence and a joyful love for reading.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Phonics Phases 1-3</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Letter Blending</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Storytelling</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match Reception Specialist &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🔢
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">Early Number Sense & Shapes</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Hands-on digital math games, counting, number patterns, 2D/3D shapes, and basic addition using
                    fun visual manipulatives on our live interactive whiteboard.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Number Bonds</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Visual Math</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Patterns</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match Early Math Tutor &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🌟
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">School Readiness & Focus Coaching</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Developing listening stamina, pencil grip coordination, positive communication, and confidence for
                    a seamless transition into formal school learning.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Focus Stamina</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Confidence</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Gentle Mentoring</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Book Free Consultation &rarr;
                  </button>
                </div>
              </>
            )}

            {/* 2. Year 1-6 */}
            {activeLevelTab === "year1_6" && (
              <>
                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    📐
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">Primary Numeracy & Times Tables</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Mastery of multiplication tables, fractions, decimals, place value, and multi-step word problems
                    using proven visual problem-solving techniques.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Mental Arithmetic</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Fractions & Decimals</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Word Problems</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match Primary Math Tutor &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    📖
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">Reading Comprehension & Grammar</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Deep textual analysis, punctuation accuracy, sentence expansion, and vocabulary enrichment that
                    accelerates reading age and written expression.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Vocabulary Expansion</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Grammar & Punctuation</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Text Analysis</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match English Tutor &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🏆
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">KS1 & KS2 SATs Acceleration</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Targeted practice for Year 2 and Year 6 SATs. Diagnostic assessments identify knowledge gaps early,
                    ensuring students exceed expected standards.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">SATs Past Papers</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Exceeding Standards</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Confidence Booster</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Book SATs Prep &rarr;
                  </button>
                </div>
              </>
            )}

            {/* 3. 11 Plus Preparation */}
            {activeLevelTab === "eleven_plus" && (
              <>
                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-[#00d2c4] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🧩
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">Verbal & Non-Verbal Reasoning</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Code breaking, spatial patterns, cube nets, analogies, and logical deduction designed for GL
                    Assessment, CEM, and bespoke consortium exam formats.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">GL & CEM Formats</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Spatial Reasoning</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Speed Techniques</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match 11+ Reasoning Tutor &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🎯
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">11+ Advanced Maths & Logic</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    High-speed numerical fluency, fractions, percentages, ratios, algebra, and tough multi-step problem
                    solving required by top grammar schools.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Multi-Step Problems</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Speed Drills</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Grammar Thresholds</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match 11+ Maths Specialist &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    ✍️
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">Creative Writing & Comprehension</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Writing flair, figurative language, compelling openings, and unseen comprehension with rigorous
                    timed mock exam practice.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">ISEB Common Pre-Test</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Creative Essays</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Mock Exam Drills</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match 11+ English Mentor &rarr;
                  </button>
                </div>
              </>
            )}

            {/* 4. Year 7-12 */}
            {activeLevelTab === "year7_12" && (
              <>
                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🌉
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">Secondary Bridge & KS3 Mastery</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Navigating the jump from primary to secondary school. Consolidating algebraic thinking, scientific
                    enquiry, and formal essay structuring.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Algebra Foundations</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Scientific Enquiry</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">KS3 Curriculum</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match Secondary Mentor &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-[#00d2c4] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🔬
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">Year 7-9 Core Sciences & Maths</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Building a rock-solid conceptual runway across Physics, Chemistry, Biology, and pure mathematics
                    before GCSE option choices.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Physics & Forces</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Chemical Reactions</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Linear Equations</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Book STEM Specialist &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    📚
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">Analytical English & Study Habits</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Literary analysis, thesis crafting, critical thinking, active revision strategies, and homework
                    coaching for academic confidence.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Essay Architecture</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Revision Strategies</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Study Skills</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match Humanities Tutor &rarr;
                  </button>
                </div>
              </>
            )}

            {/* 5. GCSE preparation */}
            {activeLevelTab === "gcse" && (
              <>
                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    ∑x
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">GCSE / IGCSE Mathematics</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Higher & Foundation tiers. Step-by-step mastery of algebra, circle theorems, trigonometry, and exam
                    technique for Edexcel, AQA & OCR. Target Grade 7-9.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Edexcel</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">AQA</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Grade 8/9 Target</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match with a Maths Tutor &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-[#00d2c4] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    ⚗️
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">GCSE Sciences (Triple & Combined)</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Physics, Chemistry, and Biology. Deep understanding of chemical equations, energy transfers,
                    genetics, and required practicals with examiner mark schemes.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Physics</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Chemistry</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Biology</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match with a Science Specialist &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    📖
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">GCSE English Language & Literature</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Analytical essay writing, Shakespeare, 19th-century prose, unseen poetry, and rhetoric structure to
                    secure top Grade 8 and 9 marks.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Essay Mastery</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Poetry Anthology</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">AQA / Edexcel</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match with an English Specialist &rarr;
                  </button>
                </div>
              </>
            )}

            {/* 6. National 5 */}
            {activeLevelTab === "nat5" && (
              <>
                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🏴󠁧󠁢󠁳󠁣󠁴󠁿
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">National 5 Mathematics (SQA)</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Complete coverage of SQA National 5 Maths: algebraic operations, quadratics, arcs & sectors,
                    trigonometric equations, and Paper 1 (Non-Calculator) & Paper 2 mastery.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">SQA Curriculum</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Paper 1 & Paper 2</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Grade A Strategy</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match National 5 Maths Tutor &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🧪
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">National 5 Physics, Chemistry & Biology</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Scottish Curriculum for Excellence science courses, assignment report coaching, experimental
                    data evaluation, and SQA past-paper drill.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Nat 5 Physics</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Nat 5 Chemistry</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Nat 5 Biology</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match National 5 Science Specialist &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    ✍️
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">National 5 English (RUAE & Essays)</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Reading for Understanding, Analysis and Evaluation (RUAE) formulas, Scottish text extract questions,
                    and Critical Essay structuring to secure Band 1 / Grade A.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">RUAE Formulas</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Scottish Texts</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Critical Essays</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match National 5 English Tutor &rarr;
                  </button>
                </div>
              </>
            )}

            {/* 7. A Level Preparation */}
            {activeLevelTab === "alevel" && (
              <>
                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    ∫dx
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">A-Level Pure & Further Maths</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Differential equations, calculus, vectors, complex numbers, matrices, and mechanics tailored for
                    high-achieving STEM aspirants and top university offers.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Edexcel</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">OCR MEI</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">AQA Further Maths</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Book A-Level Maths Mentor &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-[#00d2c4] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    ⚡
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">A-Level & IB Chemistry / Physics / Biology</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Organic synthesis, thermodynamics, quantum phenomena, and IB internal assessments guided by PhD
                    and Master’s educators.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">AQA Chemistry</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">OCR Physics</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Edexcel Biology</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Book Science Specialist &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    📊
                  </div>
                  <h3 className="text-xl font-black text-[#0f2055]">A-Level Economics, English & Humanities</h3>
                  <p className="text-sm text-[#4a4f60] leading-relaxed">
                    Macroeconomics, micro market failures, real-world data evaluation, and high-scoring 25-mark essay
                    architecture for top grades (A* / A).
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Economics</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">English Literature</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">History</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-bold text-[#b8860b] hover:text-[#0f2055] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Book Humanities Tutor &rarr;
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* The Samin 4-Step Academic Mastery Method */}
      <section id="method" className="py-16 sm:py-24 bg-[#faf9f6] border-t border-[#0f2055]/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
            <div className="badge-gold mx-auto">The Samin Standard</div>
            <div className="divider-gold mx-auto" />
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f2055]">
              A Scientific, 4-Step Framework for Guaranteed Progress
            </h2>
            <p className="text-[#5a6070] text-sm sm:text-lg leading-relaxed">
              Generic tutoring often repeats textbook problems. Our bespoke pedagogy diagnoses the exact obstacles
              blocking higher marks and systematically builds unbreakable mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-white border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-[#0f2055] text-[#ffd56b] font-black text-lg flex items-center justify-center border border-[#d4a017]/30 shadow-md">
                01
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0f2055]">Diagnostic &amp; Gap Assessment</h3>
              <p className="text-sm text-[#4a4f60] leading-relaxed">
                Before the first lesson, we pinpoint hidden gaps in prerequisite knowledge, test anxiety triggers, and
                specific exam board weaknesses.
              </p>
              <div className="text-xs font-bold text-[#b8860b] flex items-center gap-1">
                <span>Free $120 Evaluation</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-white border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-[#0f2055] text-[#ffd56b] font-black text-lg flex items-center justify-center border border-[#d4a017]/30 shadow-md">
                02
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0f2055]">Elite Personality &amp; Subject Match</h3>
              <p className="text-sm text-[#4a4f60] leading-relaxed">
                We pair your student with a handpicked mentor from our top 3% who matches both their learning pace,
                temperament, and specific curriculum board.
              </p>
              <div className="text-xs font-bold text-[#b8860b] flex items-center gap-1">
                <span>100% Fit Guarantee</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-white border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-[#0f2055] text-[#ffd56b] font-black text-lg flex items-center justify-center border border-[#d4a017]/30 shadow-md">
                03
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0f2055]">Active Mastery &amp; Exam Drills</h3>
              <p className="text-sm text-[#4a4f60] leading-relaxed">
                Sessions use dual-pen digital whiteboards, real past papers, examiner mark schemes, and spaced
                repetition so techniques become second nature under time pressure.
              </p>
              <div className="text-xs font-bold text-[#b8860b] flex items-center gap-1">
                <span>Recorded for 24/7 Revision</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-white border border-[#0f2055]/10 hover:border-[#d4a017] hover:shadow-lg transition-all space-y-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-[#0f2055] text-[#ffd56b] font-black text-lg flex items-center justify-center border border-[#d4a017]/30 shadow-md">
                04
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0f2055]">Weekly Transparency &amp; Parent Reports</h3>
              <p className="text-sm text-[#4a4f60] leading-relaxed">
                Parents receive concise weekly updates on syllabus milestones covered, homework completion rates, and
                projected grade trajectory.
              </p>
              <div className="text-xs font-bold text-[#b8860b] flex items-center gap-1">
                <span>Complete Peace of Mind</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Elite Tutors Roster */}
      <section id="tutors" className="py-16 sm:py-24 relative bg-white border-t border-[#0f2055]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="badge-gold">
                Dedicated Educators • Canada 🇨🇦 • USA 🇺🇸 • UK 🇬🇧
              </div>
              <div className="divider-gold" />
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f2055]">
                Meet Our Samin Tutors
              </h2>
              <p className="text-[#5a6070] text-sm sm:text-lg leading-relaxed">
                Our vetted specialist tutors teach students across Canada, the USA, and the UK. They aren&apos;t just
                brilliant scholars from top universities—they are empathetic, trained mentors who unlock your child&apos;s
                academic confidence and true potential.
              </p>
            </div>
            <button
              onClick={() => handleOpenBooking()}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#b8860b] hover:text-[#0f2055] transition-colors cursor-pointer"
            >
              <span>Explore All 500+ Verified Tutors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Tutor 1: David Zhang */}
            <div className="rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 overflow-hidden hover:border-[#d4a017] hover:shadow-xl transition-all flex flex-col justify-between group shadow-sm">
              <div>
                <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src="/images/tutor-1.jpg"
                    alt="David Zhang - Mathematics Tutor"
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-[#0f2055]/10 text-xs font-bold text-[#0f2055] flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Imperial College London
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#0f2055]/10 text-xs font-bold text-[#b8860b] flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    5.0 (94 reviews)
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-[#0f2055]">David Zhang, MSc</h3>
                    <p className="text-xs font-bold text-[#b8860b]">
                      Senior Tutor • Pure Maths, Further Maths &amp; STEP
                    </p>
                  </div>

                  <p className="text-xs text-[#4a4f60] leading-relaxed">
                    Specialized in transforming students who struggle with abstract algebraic concepts and calculus
                    into confident top-grade achievers. 98% of his GCSE &amp; A-Level students achieve Grades 8-9 / A*.
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">1,400+ Hours</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Edexcel &amp; OCR Specialist</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-emerald-700 font-medium">DBS Enhanced</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[#0f2055]/10 mt-4 bg-white/50">
                <button
                  onClick={() => handleOpenBooking("David Zhang (Mathematics)")}
                  className="w-full btn-primary text-xs py-3"
                >
                  Enroll
                </button>
              </div>
            </div>

            {/* Tutor 2: Dr. Sophia Ramirez */}
            <div className="rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 overflow-hidden hover:border-[#d4a017] hover:shadow-xl transition-all flex flex-col justify-between group shadow-sm">
              <div>
                <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src="/images/tutor-2.jpg"
                    alt="Dr. Sophia Ramirez - Science & Chemistry Tutor"
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-[#0f2055]/10 text-xs font-bold text-[#0f2055] flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Oxford University
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#0f2055]/10 text-xs font-bold text-[#b8860b] flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    5.0 (112 reviews)
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-[#0f2055]">Dr. Sophia Ramirez, PhD</h3>
                    <p className="text-xs font-bold text-[#b8860b]">
                      Head of Sciences • Chemistry, Biology &amp; UCAT
                    </p>
                  </div>

                  <p className="text-xs text-[#4a4f60] leading-relaxed">
                    PhD in Biochemistry from Oxford. Combines passionate storytelling with rigorous past paper mark
                    schemes, preparing aspiring doctors and biomedical engineers for medical school entry.
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">2,100+ Hours</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">Medical Admissions Coach</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-emerald-700 font-medium">AQA &amp; IB Expert</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[#0f2055]/10 mt-4 bg-white/50">
                <button
                  onClick={() => handleOpenBooking("Dr. Sophia Ramirez (Sciences)")}
                  className="w-full btn-primary text-xs py-3"
                >
                  Enroll
                </button>
              </div>
            </div>

            {/* Tutor 3: Marcus Sterling */}
            <div className="rounded-2xl bg-[#faf9f6] border border-[#0f2055]/10 overflow-hidden hover:border-[#d4a017] hover:shadow-xl transition-all flex flex-col justify-between group shadow-sm">
              <div>
                <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src="/images/tutor-3.jpg"
                    alt="Marcus Sterling - English & Humanities Tutor"
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-[#0f2055]/10 text-xs font-bold text-[#0f2055] flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Cambridge University
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#0f2055]/10 text-xs font-bold text-[#b8860b] flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    4.97 (88 reviews)
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-[#0f2055]">Marcus Sterling, MA</h3>
                    <p className="text-xs font-bold text-[#b8860b]">
                      Senior Humanities Tutor • English Lit, Lang &amp; 11+
                    </p>
                  </div>

                  <p className="text-xs text-[#4a4f60] leading-relaxed">
                    Cambridge graduate with 8 years of private tutoring excellence. Specializes in building confident,
                    sophisticated essay writers who stand out to top grammar schools and competitive university panels.
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">1,800+ Hours</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-[#1e3a8a] font-medium">11+ Entrance Specialist</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#0f2055]/10 text-emerald-700 font-medium">DBS Enhanced</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[#0f2055]/10 mt-4 bg-white/50">
                <button
                  onClick={() => handleOpenBooking("Marcus Sterling (English & 11+)")}
                  className="w-full btn-primary text-xs py-3"
                >
                  Enroll
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tuition & Package Calculator */}
      <section id="calculator" className="py-16 sm:py-24 bg-[#faf9f6] border-t border-[#0f2055]/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
            <div className="badge-gold mx-auto">Transparent Investment</div>
            <div className="divider-gold mx-auto" />
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f2055]">
              Interactive Tuition Estimator
            </h2>
            <p className="text-[#5a6070] text-sm sm:text-lg leading-relaxed">
              Tailor your weekly lesson hours, learning environment, and academic tier with zero hidden fees. All plans
              include full access to recorded sessions, lesson notes, and our diagnostic assessment.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white border border-[#0f2055]/10 rounded-3xl p-6 sm:p-10 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Controls */}
              <div className="lg:col-span-7 space-y-8">
                {/* Stage selector */}
                <div>
                  <label className="block text-xs font-bold text-[#0f2055] uppercase tracking-wider mb-3">
                    1. Academic Level
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "reception", name: "Reception" },
                      { id: "year1_6", name: "Year 1-6" },
                      { id: "eleven_plus", name: "11 Plus Prep" },
                      { id: "year7_12", name: "Year 7-12" },
                      { id: "gcse", name: "GCSE Prep" },
                      { id: "nat5", name: "National 5" },
                      { id: "alevel", name: "A Level Prep" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCalcLevel(item.id as LearnerCategory)}
                        className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                          calcLevel === item.id
                            ? "bg-[#0f2055] border-[#0f2055] text-white shadow-md font-bold"
                            : "bg-[#faf9f6] border-[#0f2055]/15 text-[#1a1a2e] hover:border-[#b8860b]"
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Format selector */}
                <div>
                  <label className="block text-xs font-bold text-[#0f2055] uppercase tracking-wider mb-3">
                    2. Online Delivery Format
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCalcFormat("1on1")}
                      className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        calcFormat === "1on1"
                          ? "bg-[#0f2055] border-[#0f2055] text-white shadow-md font-bold"
                          : "bg-[#faf9f6] border-[#0f2055]/15 text-[#1a1a2e] hover:border-[#b8860b]"
                      }`}
                    >
                      <Laptop className={`w-4 h-4 ${calcFormat === "1on1" ? "text-[#ffd56b]" : "text-[#1e3a8a]"}`} />
                      <span>1-on-1 Dedicated Online</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcFormat("pod")}
                      className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        calcFormat === "pod"
                          ? "bg-[#0f2055] border-[#0f2055] text-white shadow-md font-bold"
                          : "bg-[#faf9f6] border-[#0f2055]/15 text-[#1a1a2e] hover:border-[#b8860b]"
                      }`}
                    >
                      <Users className={`w-4 h-4 ${calcFormat === "pod" ? "text-[#ffd56b]" : "text-[#1e3a8a]"}`} />
                      <span>Small Online Pod (Max 3)</span>
                    </button>
                  </div>
                </div>

                {/* Hours slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold text-[#0f2055] uppercase tracking-wider">
                      3. Weekly Intensity
                    </label>
                    <span className="text-sm font-black text-[#b8860b]">{calcHours} Hours / Week</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={calcHours}
                    onChange={(e) => setCalcHours(parseInt(e.target.value))}
                    className="w-full accent-[#b8860b] bg-[#edeae3] h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#5a6070] mt-2 font-medium">
                    <span>1 hr/wk (Maintenance)</span>
                    <span>2 hrs/wk (Recommended)</span>
                    <span>4+ hrs/wk (Exam Sprint)</span>
                  </div>
                </div>
              </div>

              {/* Estimate Summary Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#0f2055] via-[#102244] to-[#070f2b] text-white border border-[#d4a017]/30 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
                <div className="border-b border-white/15 pb-4">
                  <div className="text-xs text-[#ffd56b] uppercase font-bold tracking-wider">Estimated Monthly Plan</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl sm:text-5xl font-black text-white">${discountedMonthlyTotal}</span>
                    <span className="text-xs text-white/70">/ 4-week cycle</span>
                  </div>
                  <div className="text-xs text-[#ffd56b] mt-1.5 font-semibold">
                    Equivalent to ${currentHourlyRate}/hr • {calcHours * 4} sessions per month
                  </div>
                </div>

                {savings > 0 && (
                  <div className="bg-white/10 border border-white/20 text-emerald-300 text-xs px-3 py-2 rounded-lg font-semibold flex items-center justify-between">
                    <span>Multi-hour package applied</span>
                    <span className="font-bold text-white">Save ${savings}/mo</span>
                  </div>
                )}

                <div className="space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffd56b] shrink-0" />
                    <span>Free Full Academic Diagnostic ($120 value)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffd56b] shrink-0" />
                    <span>Recorded interactive whiteboard access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffd56b] shrink-0" />
                    <span>Weekly progress reports to parents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffd56b] shrink-0" />
                    <span>Dedicated educational advisor support</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenBooking()}
                  className="w-full btn-gold text-sm py-3.5"
                >
                  Reserve Consultation for This Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Samin Virtual Classroom Experience */}
      <section id="virtual-classroom" className="py-16 sm:py-24 bg-white border-t border-[#0f2055]/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="badge-gold">Built For Seamless Learning</div>
              <div className="divider-gold" />
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f2055]">
                An Online Classroom Experience That Beats In-Person Tutoring
              </h2>
              <p className="text-[#5a6070] text-sm sm:text-base leading-relaxed">
                Gone are the days of boring video calls. Samin’s custom virtual environment lets students and tutors
                collaborate simultaneously with interactive stylus drawing, instant past paper imports, equation
                solvers, and synchronized graphing tools.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0f2055] text-[#ffd56b] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2055]">Full HD Recordings for Revision</h4>
                    <p className="text-xs text-[#5a6070] mt-0.5">
                      Every lesson is archived with high-definition audio and whiteboard exports. Students rewatch
                      before crucial tests anytime.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0f2055] text-[#ffd56b] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2055]">Instant Mark Scheme Breakdown</h4>
                    <p className="text-xs text-[#5a6070] mt-0.5">
                      Tutors pull authentic exam papers onto the board live, highlighting examiner trigger words that
                      secure the top marks.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0f2055] text-[#ffd56b] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2055]">Safe, Monitored &amp; Secure</h4>
                    <p className="text-xs text-[#5a6070] mt-0.5">
                      Compliant with international child safeguarding standards. Parents can join or review anytime
                      with complete transparency.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Classroom Preview Graphic */}
            <div className="lg:col-span-6">
              <div className="p-3 bg-[#faf9f6] border border-[#0f2055]/15 rounded-3xl shadow-xl relative">
                <div className="bg-white rounded-2xl p-5 border border-[#0f2055]/10 space-y-4">
                  {/* Top toolbar */}
                  <div className="flex items-center justify-between border-b border-[#0f2055]/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-[#0f2055]">Interactive Whiteboard #4</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded bg-[#faf9f6] border border-[#0f2055]/10 text-[#0f2055] font-semibold">Stylus Mode</span>
                      <span className="px-2.5 py-1 rounded bg-[#faf9f6] border border-[#0f2055]/10 text-[#0f2055] font-semibold">Graph Plotter</span>
                    </div>
                  </div>

                  {/* Math Formula Demo Visual */}
                  <div className="h-52 bg-[#faf9f6] rounded-xl border border-[#0f2055]/10 p-4 flex flex-col justify-center items-center text-center space-y-3">
                    <div className="font-mono text-lg sm:text-xl text-[#0f2055] font-black">
                      f&apos;(x) = lim[h→0] (f(x+h) - f(x)) / h
                    </div>
                    <div className="text-xs text-[#5a6070] font-mono font-medium">
                      ✓ Step 2 Verified: Differentiation from First Principles
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-semibold">
                      <span>Examiner Note: Awarded Full Method &amp; Accuracy Marks (5/5)</span>
                    </div>
                  </div>

                  {/* Tutor / Student Participants Bar */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#0f2055]/10 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0f2055] flex items-center justify-center text-xs font-bold text-[#ffd56b]">
                        DZ
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-[#0f2055]">David Zhang</div>
                        <div className="text-[10px] text-[#b8860b] font-bold">Tutor (Speaking)</div>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#0f2055]/10 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold text-white">
                        AM
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-[#0f2055]">Alex Morgan</div>
                        <div className="text-[10px] text-[#5a6070] font-medium">Student (Year 11)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parent & Student Reviews / Success Stories */}
      <section className="py-16 sm:py-24 bg-[#faf9f6] border-t border-[#0f2055]/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
            <div className="badge-gold mx-auto">Real Grade Transformations</div>
            <div className="divider-gold mx-auto" />
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f2055]">
              Loved by Over 1,200+ Discerning Families
            </h2>
            <p className="text-[#5a6070] text-sm sm:text-lg leading-relaxed">
              Here is what happens when passionate mentorship meets personalized academic roadmaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="review-card space-y-4">
              <div className="space-y-3">
                <div className="flex text-[#d4a017]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#3a3a5c] leading-relaxed italic">
                  &ldquo;Our daughter was predicted a Grade 5 in GCSE Maths and felt completely overwhelmed. Her Samin
                  tutor, David, restored her confidence within three weeks. She just received a Grade 9 on results day!
                  Unbelievable service.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#0f2055]/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#0f2055]">Claire H.</div>
                  <div className="text-[11px] text-[#5a6070]">Parent of GCSE Student, London</div>
                </div>
                <div className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  Grade 5 ➔ 9
                </div>
              </div>
            </div>

            <div className="review-card space-y-4">
              <div className="space-y-3">
                <div className="flex text-[#d4a017]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#3a3a5c] leading-relaxed italic">
                  &ldquo;The 1-on-1 chemistry sessions with Dr. Sophia were world class. Her explanations of organic
                  reaction pathways were clearer than anything taught at school. My son secured his offer for Imperial
                  Medicine.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#0f2055]/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#0f2055]">Tariq M.</div>
                  <div className="text-[11px] text-[#5a6070]">Parent of A-Level Candidate</div>
                </div>
                <div className="px-2.5 py-1 rounded bg-[#faf9f6] text-[#1e3a8a] border border-[#0f2055]/15 text-xs font-bold">
                  Accepted to Imperial
                </div>
              </div>
            </div>

            <div className="review-card space-y-4">
              <div className="space-y-3">
                <div className="flex text-[#d4a017]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#3a3a5c] leading-relaxed italic">
                  &ldquo;We tried multiple agency tutors before finding Samin Home Tutors. The difference in caliber and
                  communication is night and day. The weekly parent feedback and recorded classes gave us total peace of
                  mind.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#0f2055]/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#0f2055]">Eleanor B.</div>
                  <div className="text-[11px] text-[#5a6070]">Mother of 11+ Grammar Student</div>
                </div>
                <div className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                  Top 1% Score
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faqs" className="py-16 sm:py-24 bg-white border-t border-[#0f2055]/10 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <div className="badge-gold mx-auto">Common Questions</div>
            <div className="divider-gold mx-auto" />
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0f2055]">
              Everything Parents Want to Know
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How are Samin Home Tutors selected and vetted?",
                a: "Fewer than 3% of tutor applicants are accepted onto our roster. Every candidate undergoes academic credential verification (degrees from Oxbridge, Russell Group, or Ivy League universities), rigorous pedagogical mock lesson assessments, and an Enhanced DBS background security check.",
              },
              {
                q: "Can we switch tutors if the chemistry or teaching style isn't right?",
                a: "Yes, absolutely. We offer our 100% Tutor Match Guarantee. If for any reason the first session does not meet your highest expectations, we will arrange a replacement tutor and credit that session to your account with zero hassle.",
              },
              {
                q: "Why does Samin focus exclusively on 100% online tutoring?",
                a: "Online tutoring allows us to connect your child with the top 3% of vetted subject specialists from Oxford, Cambridge, and top institutions globally without geographical limits. With live collaborative digital whiteboards, instant exam past-paper annotations, and high-definition session recordings saved for revision, online learning is demonstrably more effective and flexible than traditional in-person home tutoring.",
              },
              {
                q: "How quickly can we begin our first lesson?",
                a: "Following your free consultation and diagnostic intake, we match and introduce your specialist tutor within 24 to 48 hours. Your student can often start their diagnostic trial before the end of the week.",
              },
              {
                q: "Do you cover all UK and international exam boards?",
                a: "Yes. Our curriculum specialists cover Edexcel, AQA, OCR, Cambridge (CIE), WJEC, the International Baccalaureate (IB), and US SAT/ACT examinations.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="faq-item"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-[#0f2055] text-sm sm:text-base cursor-pointer hover:text-[#b8860b] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#b8860b] shrink-0 transition-transform ${
                      activeFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#4a4f60] bg-[#faf9f6]/70 border-t border-[#0f2055]/10 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action Hero Box */}
      <section className="py-16 sm:py-20 relative overflow-hidden bg-[#faf9f6] border-t border-[#0f2055]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#0f2055] via-[#102244] to-[#070f2b] text-white border-2 border-[#d4a017] shadow-2xl relative space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#ffd56b] border border-white/20 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#ffd56b]" />
              Limited Intake for Upcoming Exam Cycles
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Give Your Child the Advantage of an Elite Private Tutor
            </h2>
            <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Book your complimentary diagnostic assessment and 30-minute academic consultation with our Senior
              Education Advisor today.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => handleOpenBooking()}
                className="w-full sm:w-auto btn-gold text-sm sm:text-base px-8 py-4 cursor-pointer"
              >
                Book Your Free Diagnostic Session
              </button>
              <a
                href="https://wa.me/2347059655382"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 flex items-center justify-center gap-2 border border-white/25 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: +234 705 965 5382</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* World-Class Footer */}
      <footer className="bg-[#070f2b] border-t-2 border-[#d4a017]/30 py-16 text-slate-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#d4a017] bg-white p-0.5 shadow-lg shrink-0">
                  <Image
                    src="/images/samin_logo.jpeg"
                    alt="Samin Home Tutors"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div>
                  <div className="text-xl font-black text-white leading-none">
                    <span className="text-[#38bdf8]">SAMIN</span> HOME TUTORS
                  </div>
                  <div className="text-[10px] tracking-widest text-[#ffd56b] font-bold uppercase mt-1">
                    Canada • USA • UK Online Tutoring
                  </div>
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
                Empowering students with personalized mastery curricula, handpicked Oxbridge &amp; Ivy League educators,
                and weekly transparent parental reporting.
              </p>
              <div className="text-slate-300 flex items-center gap-3 pt-2">
                <span className="text-white font-semibold">Accreditations:</span>
                <span className="bg-white/10 px-2 py-1 rounded border border-white/15 text-white font-medium">DBS Verified</span>
                <span className="bg-white/10 px-2 py-1 rounded border border-white/15 text-white font-medium">Tutors&apos; Association</span>
              </div>
            </div>

            {/* Col 2: Categories */}
            <div className="space-y-3">
              <h4 className="text-[#ffd56b] font-bold uppercase tracking-wider text-xs border-b border-[#d4a017]/30 pb-2">Learner Categories</h4>
              <ul className="space-y-2">
                <li><a href="#levels" className="hover:text-white transition-colors">Reception</a></li>
                <li><a href="#levels" className="hover:text-white transition-colors">Year 1-6</a></li>
                <li><a href="#levels" className="hover:text-white transition-colors">11 plus preparation</a></li>
                <li><a href="#levels" className="hover:text-white transition-colors">Year 7-12</a></li>
                <li><a href="#levels" className="hover:text-white transition-colors">GCSE preparation</a></li>
                <li><a href="#levels" className="hover:text-white transition-colors">National 5</a></li>
                <li><a href="#levels" className="hover:text-white transition-colors">A level preparation</a></li>
              </ul>
            </div>

            {/* Col 3: Programs */}
            <div className="space-y-3">
              <h4 className="text-[#ffd56b] font-bold uppercase tracking-wider text-xs border-b border-[#d4a017]/30 pb-2">Programs &amp; Admissions</h4>
              <ul className="space-y-2">
                <li><a href="#levels" className="hover:text-white transition-colors">Oxbridge Interview Prep</a></li>
                <li><a href="#levels" className="hover:text-white transition-colors">Medical School (UCAT / BMAT)</a></li>
                <li><a href="#levels" className="hover:text-white transition-colors">STEP &amp; MAT Mathematics</a></li>
                <li><a href="#virtual-classroom" className="hover:text-white transition-colors">1-on-1 Online Classroom</a></li>
                <li><a href="#virtual-classroom" className="hover:text-white transition-colors">Virtual Classroom HD</a></li>
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div className="space-y-3">
              <h4 className="text-[#ffd56b] font-bold uppercase tracking-wider text-xs border-b border-[#d4a017]/30 pb-2">Direct Support</h4>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="tel:+2347059655382"
                    className="text-slate-200 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#ffd56b]" />
                    <span>Hotline / Call: +234 705 965 5382</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/2347059655382"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1.5 font-medium"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp: +234 705 965 5382</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:saminhometutors@gmail.com?subject=Tutoring%20Inquiry%20-%20Samin%20Home%20Tutors"
                    className="text-[#ffd56b] hover:underline flex items-center gap-1.5 font-medium"
                    title="Click to compose an email to Samin Home Tutors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#ffd56b]" />
                    <span>Email: saminhometutors@gmail.com</span>
                  </a>
                </li>
                <li className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hours: Mon–Sun 8:00 AM – 9:00 PM GMT</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>&copy; {new Date().getFullYear()} Samin Home Tutors Ltd. All rights reserved.</div>
            <div className="flex flex-wrap gap-6 items-center">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Safeguarding Code</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Tuition</a>
              <a href="/admin/login" className="text-[#ffd56b] hover:underline font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ffd56b]" />
                <span>Admin Login</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Interactive "Enroll" Action Button with Samin Logo */}
      <aside aria-label="Quick Enroll" className="fixed bottom-6 right-6 z-40 group">
        <button
          onClick={() => handleOpenBooking()}
          className="relative flex items-center gap-3 p-1.5 pr-4 rounded-full bg-[#0f2055] border-2 border-[#d4a017] shadow-2xl shadow-[#0f2055]/50 hover:shadow-[#0f2055]/80 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md"
          title="Click to Enroll - Free Diagnostic Trial"
        >
          {/* Glowing Animated Ring */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#d4a017] via-[#ffd56b] to-[#b8860b] opacity-25 group-hover:opacity-75 blur-sm transition-opacity duration-300 pointer-events-none" />

          {/* Logo Badge Container */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#d4a017] bg-white p-0.5 shrink-0 shadow-inner group-hover:rotate-6 transition-transform duration-300">
            <Image
              src="/images/samin_logo.jpeg"
              alt="Samin Home Tutors Emblem"
              width={48}
              height={48}
              className="w-full h-full object-cover rounded-full"
            />
            {/* Live Indicator Dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0f2055]" />
          </div>

          {/* Text Label that highlights */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black tracking-wide text-white group-hover:text-[#ffd56b] transition-colors uppercase">
                Enroll Now
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#ffd56b] animate-pulse" />
            </div>
            <span className="text-[9px] font-bold text-[#ffd56b] uppercase tracking-wider">
              Free Trial • 🇨🇦 🇺🇸 🇬🇧
            </span>
          </div>
        </button>
      </aside>

      {/* Interactive Consultation / Trial Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-[#0f2055]/15 p-6 sm:p-8 shadow-2xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-[#0f2055] hover:bg-[#faf9f6] p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingSuccess ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="text-left space-y-1">
                  <div className="text-xs font-bold text-[#b8860b] uppercase tracking-wider">
                    {selectedTutorForBooking ? `Booking with ${selectedTutorForBooking}` : "Fast-Track Consultation"}
                  </div>
                  <h3 className="text-2xl font-black text-[#0f2055]">Book Free Diagnostic Trial</h3>
                  <p className="text-xs text-[#5a6070]">
                    Complimentary 30-min student evaluation &amp; tutor matching plan ($120 value).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#0f2055] uppercase mb-1">
                      Parent / Guardian Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.parentName}
                      onChange={(e) => setBookingForm({ ...bookingForm, parentName: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#faf9f6] border border-[#0f2055]/15 text-[#1a1a2e] text-xs focus:border-[#d4a017] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#0f2055] uppercase mb-1">
                      Student Name &amp; Year
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.studentName}
                      onChange={(e) => setBookingForm({ ...bookingForm, studentName: e.target.value })}
                      placeholder="e.g. Liam (Year 11)"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#faf9f6] border border-[#0f2055]/15 text-[#1a1a2e] text-xs focus:border-[#d4a017] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#0f2055] uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      placeholder="sarah@example.com"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#faf9f6] border border-[#0f2055]/15 text-[#1a1a2e] text-xs focus:border-[#d4a017] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#0f2055] uppercase mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      placeholder="+234 705 965 5382"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#faf9f6] border border-[#0f2055]/15 text-[#1a1a2e] text-xs focus:border-[#d4a017] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#0f2055] uppercase mb-1">
                      Target Level
                    </label>
                    <select
                      value={bookingForm.gradeLevel}
                      onChange={(e) => setBookingForm({ ...bookingForm, gradeLevel: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#faf9f6] border border-[#0f2055]/15 text-[#1a1a2e] text-xs focus:border-[#d4a017] focus:outline-none transition-colors"
                    >
                      <option>Reception</option>
                      <option>Year 1-6</option>
                      <option>11 plus preparation</option>
                      <option>Year 7-12</option>
                      <option>GCSE preparation</option>
                      <option>National 5</option>
                      <option>A level preparation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#0f2055] uppercase mb-1">
                      Preferred Online Format
                    </label>
                    <select
                      value={bookingForm.mode}
                      onChange={(e) => setBookingForm({ ...bookingForm, mode: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#faf9f6] border border-[#0f2055]/15 text-[#1a1a2e] text-xs focus:border-[#d4a017] focus:outline-none transition-colors"
                    >
                      <option>100% Live Online 1-on-1</option>
                      <option>Online Small Study Pod (2-3 Students)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0f2055] uppercase mb-1">
                    Specific Subject &amp; Goal (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="e.g. Struggling with Edexcel Maths grade 5, wants grade 8 or 9."
                    className="w-full px-3 py-2 rounded-xl bg-[#faf9f6] border border-[#0f2055]/15 text-[#1a1a2e] text-xs focus:border-[#d4a017] focus:outline-none resize-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-3.5 text-sm cursor-pointer"
                >
                  Confirm Diagnostic Session Booking
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#0f2055]">Consultation Request Received!</h3>
                <p className="text-xs text-[#5a6070] max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="font-bold text-[#0f2055]">{bookingForm.parentName || "Parent"}</span>.
                  One of our Senior Academic Advisors will contact you at{" "}
                  <span className="font-bold text-[#b8860b]">{bookingForm.phone || bookingForm.email}</span> within 4
                  business hours to schedule your student&apos;s free diagnostic assessment.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#0f2055] text-white text-xs font-semibold hover:bg-[#1a3275] transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
