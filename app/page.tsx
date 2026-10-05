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
    <div className="min-h-screen bg-[#060b17] text-slate-100 selection:bg-[#00d2c4]/20 selection:text-[#00d2c4]">
      {/* Top Banner Alert */}
      <div className="bg-gradient-to-r from-[#0c1830] via-[#102244] to-[#0c1830] border-b border-white/5 py-2 px-4 text-center text-xs sm:text-sm text-slate-300 flex flex-wrap items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-[#00d2c4] animate-ping" />
        <span className="font-semibold text-white">Serving Students Across 🇨🇦 Canada • 🇺🇸 USA • 🇬🇧 UK:</span>
        <span className="text-[#00d2c4] font-medium">Free Diagnostic Assessment & Lesson Plan Included</span>
        <button
          onClick={() => handleOpenBooking()}
          className="ml-2 underline font-semibold text-white hover:text-[#00d2c4] transition-colors cursor-pointer"
        >
          Enroll Today &rarr;
        </button>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#060b17]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <a href="#" className="flex items-center gap-4 group">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-xl shadow-[#00d2c4]/25 border-2 border-[#00d2c4]/40 bg-[#070e1c] p-0.5 shrink-0 group-hover:border-[#00d2c4] transition-colors">
              <Image
                src="/images/samin_logo.jpeg"
                alt="Samin Home Tutors Logo"
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                <span className="text-[#38bdf8]">SAMIN</span>{" "}
                <span className="text-white">HOME TUTORS</span>
              </div>
              <div className="text-[11px] tracking-widest text-[#00d2c4] font-bold uppercase mt-1">
                Canada • USA • UK Online Tutoring
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#levels" className="hover:text-[#00d2c4] transition-colors">
              Programs & Levels
            </a>
            <a href="#method" className="hover:text-[#00d2c4] transition-colors">
              The Samin Method
            </a>
            <a href="#tutors" className="hover:text-[#00d2c4] transition-colors">
              Elite Tutors
            </a>
            <a href="#calculator" className="hover:text-[#00d2c4] transition-colors">
              Tuition Calculator
            </a>
            <a href="#virtual-classroom" className="hover:text-[#00d2c4] transition-colors">
              Online Classroom
            </a>
            <a href="#faqs" className="hover:text-[#00d2c4] transition-colors">
              FAQs
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/2347059655382"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
            <a
              href="/admin/login"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl bg-slate-800/80 text-slate-300 border border-white/10 hover:text-white hover:border-[#00d2c4]/40 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#00d2c4]" />
              <span>Admin</span>
            </a>
            <button
              onClick={() => handleOpenBooking()}
              className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white transition-all bg-gradient-to-r from-[#2563eb] to-[#00d2c4] rounded-xl shadow-lg shadow-[#00d2c4]/20 hover:shadow-[#00d2c4]/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Book Free Trial
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden bg-radial-hero">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        {/* Ambient colored orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#00d2c4]/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-[#2563eb]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Value Proposition & Brand Pitch */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0c1830] border border-[#00d2c4]/30 shadow-md">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-200">
                  <span className="font-bold text-white">4.98 / 5 Rating</span> from 1,200+ Ambitious Families
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
                World-Class 1-on-1 Lessons That Turn Academic{" "}
                <span className="text-gradient-cyan-blue">Potential Into Mastery</span>
              </h1>

              {/* Sub-headline */}
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                At <span className="font-semibold text-white">Samin Home Tutors</span>, we provide 100% interactive live online
                tutoring tailored specifically for students in <span className="font-semibold text-[#00d2c4]">Canada 🇨🇦</span>,{" "}
                <span className="font-semibold text-[#38bdf8]">the USA 🇺🇸</span>, and{" "}
                <span className="font-semibold text-[#ff6b4a]">the UK 🇬🇧</span>. Matched with vetted subject specialists,
                our students build confidence, master core concepts, and achieve top grades.
              </p>

              {/* Dual Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => handleOpenBooking()}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#2563eb] via-[#0284c7] to-[#00d2c4] text-white font-bold text-base shadow-xl shadow-[#00d2c4]/25 hover:shadow-[#00d2c4]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-[#00d2c4]" />
                  <span>Book Free Consultation & Diagnostic</span>
                </button>
                <a
                  href="#calculator"
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#0c1830] border border-white/15 text-slate-200 font-semibold text-base hover:bg-[#132448] hover:border-[#00d2c4]/40 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <span>Tuition Calculator</span>
                  <ArrowRight className="w-4 h-4 text-[#00d2c4]" />
                </a>
              </div>

              {/* Mini Trust Highlights */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/10 text-left">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#00d2c4] shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-300 font-medium">Top 3% Vetted Tutors</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#00d2c4] shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-300 font-medium">100% Tutor Match Guarantee</span>
                </div>
                <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <CheckCircle2 className="w-5 h-5 text-[#00d2c4] shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-300 font-medium">Weekly Parent Progress Log</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual with Real Product Showcase */}
            <div className="lg:col-span-5 relative">
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
                  <div className="p-4 bg-[#0a1426] border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Enhanced DBS Checked Tutor
                      </span>
                      <span className="text-[#38bdf8] font-semibold">Grade 9 / A* Track</span>
                    </div>

                    {/* Progress Bar Snippet */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Curriculum Mastery (Edexcel Pure Maths)</span>
                        <span className="font-bold text-[#00d2c4]">94%</span>
                      </div>
                      <div className="w-full bg-[#132448] h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-[#2563eb] to-[#00d2c4] h-full rounded-full w-[94%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Grade Boost Card */}
                <div className="absolute -bottom-6 -left-6 bg-[#0c1830]/95 backdrop-blur-lg border border-[#00d2c4]/40 p-4 rounded-2xl shadow-xl shadow-black/50 flex items-center gap-3.5 max-w-[240px]">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Proven Boost</div>
                    <div className="text-sm font-bold text-white">Grade 5 ➔ Grade 9</div>
                    <div className="text-[11px] text-slate-400">Within 12 Weeks</div>
                  </div>
                </div>

                {/* Floating Tutor Rating Card */}
                <div className="absolute -top-6 -right-4 hidden sm:flex bg-[#0c1830]/95 backdrop-blur-lg border border-white/20 p-3.5 rounded-2xl shadow-xl shadow-black/50 items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2563eb] to-[#00d2c4] flex items-center justify-center text-white font-bold text-sm">
                    OX
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Oxbridge & Ivy Mentors</div>
                    <div className="text-[11px] text-[#00d2c4] flex items-center gap-1">
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
      <section className="border-y border-white/10 bg-[#070e1c] py-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#00d2c4]">99.4%</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200">Exam Pass & Target Grade Rate</div>
              <div className="text-[11px] text-slate-400">Across GCSE, IGCSE & A-Levels</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#38bdf8]">500+</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200">Elite Specialist Tutors</div>
              <div className="text-[11px] text-slate-400">All Enhanced DBS & Verified</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#ff6b4a]">45,000+</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200">Online Lessons Delivered</div>
              <div className="text-[11px] text-slate-400">Live Across Canada 🇨🇦, USA 🇺🇸 & UK 🇬🇧 Timezones</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">100%</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200">Tutor Match Guarantee</div>
              <div className="text-[11px] text-slate-400">Free switch if not completely delighted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs & Academic Levels Explorer */}
      <section id="levels" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00d2c4]/10 text-[#00d2c4] border border-[#00d2c4]/20 text-xs font-semibold uppercase tracking-wider">
              Comprehensive Curriculum
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Tailored Programs for Every Academic Milestone
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              From early Reception phonics and Year 1-6 foundations to 11 Plus preparation, Year 7-12 transition, GCSEs,
              Scottish National 5, and A Level exam excellence, our specialist educators provide laser-focused online guidance.
            </p>

            {/* Level Tabs */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
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
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeLevelTab === tab.id
                      ? "bg-[#00d2c4] text-[#060b17] shadow-lg shadow-[#00d2c4]/25 scale-105 font-bold"
                      : "bg-[#0c1830] text-slate-300 hover:text-white hover:bg-[#132448] border border-white/5"
                  }`}
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
                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🔤
                  </div>
                  <h3 className="text-xl font-bold text-white">Early Phonics & Guided Reading</h3>
                  <p className="text-sm text-slate-300">
                    Letter-sound recognition, phonics blending, sight words, and playful storytelling that builds
                    early literacy confidence and a joyful love for reading.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Phonics Phases 1-3</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Letter Blending</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Storytelling</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match Reception Specialist &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🔢
                  </div>
                  <h3 className="text-xl font-bold text-white">Early Number Sense & Shapes</h3>
                  <p className="text-sm text-slate-300">
                    Hands-on digital math games, counting, number patterns, 2D/3D shapes, and basic addition using
                    fun visual manipulatives on our live interactive whiteboard.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Number Bonds</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Visual Math</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Patterns</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match Early Math Tutor &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🌟
                  </div>
                  <h3 className="text-xl font-bold text-white">School Readiness & Focus Coaching</h3>
                  <p className="text-sm text-slate-300">
                    Developing listening stamina, pencil grip coordination, positive communication, and confidence for
                    a seamless transition into formal school learning.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Focus Stamina</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Confidence</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Gentle Mentoring</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Book Free Consultation &rarr;
                  </button>
                </div>
              </>
            )}

            {/* 2. Year 1-6 */}
            {activeLevelTab === "year1_6" && (
              <>
                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    📐
                  </div>
                  <h3 className="text-xl font-bold text-white">Primary Numeracy & Times Tables</h3>
                  <p className="text-sm text-slate-300">
                    Mastery of multiplication tables, fractions, decimals, place value, and multi-step word problems
                    using proven visual problem-solving techniques.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Mental Arithmetic</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Fractions & Decimals</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Word Problems</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match Primary Math Tutor &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    📖
                  </div>
                  <h3 className="text-xl font-bold text-white">Reading Comprehension & Grammar</h3>
                  <p className="text-sm text-slate-300">
                    Deep textual analysis, punctuation accuracy, sentence expansion, and vocabulary enrichment that
                    accelerates reading age and written expression.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Vocabulary Expansion</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Grammar & Punctuation</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Text Analysis</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match English Tutor &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🏆
                  </div>
                  <h3 className="text-xl font-bold text-white">KS1 & KS2 SATs Acceleration</h3>
                  <p className="text-sm text-slate-300">
                    Targeted practice for Year 2 and Year 6 SATs. Diagnostic assessments identify knowledge gaps early,
                    ensuring students exceed expected standards.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">SATs Past Papers</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Exceeding Standards</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Confidence Booster</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Book SATs Prep &rarr;
                  </button>
                </div>
              </>
            )}

            {/* 3. 11 Plus Preparation */}
            {activeLevelTab === "eleven_plus" && (
              <>
                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-[#00d2c4] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🧩
                  </div>
                  <h3 className="text-xl font-bold text-white">Verbal & Non-Verbal Reasoning</h3>
                  <p className="text-sm text-slate-300">
                    Code breaking, spatial patterns, cube nets, analogies, and logical deduction designed for GL
                    Assessment, CEM, and bespoke consortium exam formats.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">GL & CEM Formats</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Spatial Reasoning</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Speed Techniques</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match 11+ Reasoning Tutor &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🎯
                  </div>
                  <h3 className="text-xl font-bold text-white">11+ Advanced Maths & Logic</h3>
                  <p className="text-sm text-slate-300">
                    High-speed numerical fluency, fractions, percentages, ratios, algebra, and tough multi-step problem
                    solving required by top grammar schools.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Multi-Step Problems</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Speed Drills</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Grammar Thresholds</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match 11+ Maths Specialist &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    ✍️
                  </div>
                  <h3 className="text-xl font-bold text-white">Creative Writing & Comprehension</h3>
                  <p className="text-sm text-slate-300">
                    Writing flair, figurative language, compelling openings, and unseen comprehension with rigorous
                    timed mock exam practice.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">ISEB Common Pre-Test</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Creative Essays</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Mock Exam Drills</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match 11+ English Mentor &rarr;
                  </button>
                </div>
              </>
            )}

            {/* 4. Year 7-12 */}
            {activeLevelTab === "year7_12" && (
              <>
                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🌉
                  </div>
                  <h3 className="text-xl font-bold text-white">Secondary Bridge & KS3 Mastery</h3>
                  <p className="text-sm text-slate-300">
                    Navigating the jump from primary to secondary school. Consolidating algebraic thinking, scientific
                    enquiry, and formal essay structuring.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Algebra Foundations</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Scientific Enquiry</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">KS3 Curriculum</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match Secondary Mentor &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-[#00d2c4] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🔬
                  </div>
                  <h3 className="text-xl font-bold text-white">Year 7-9 Core Sciences & Maths</h3>
                  <p className="text-sm text-slate-300">
                    Building a rock-solid conceptual runway across Physics, Chemistry, Biology, and pure mathematics
                    before GCSE option choices.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Physics & Forces</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Chemical Reactions</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Linear Equations</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Book STEM Specialist &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    📚
                  </div>
                  <h3 className="text-xl font-bold text-white">Analytical English & Study Habits</h3>
                  <p className="text-sm text-slate-300">
                    Literary analysis, thesis crafting, critical thinking, active revision strategies, and homework
                    coaching for academic confidence.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Essay Architecture</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Revision Strategies</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Study Skills</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match Humanities Tutor &rarr;
                  </button>
                </div>
              </>
            )}

            {/* 5. GCSE preparation */}
            {activeLevelTab === "gcse" && (
              <>
                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    ∑x
                  </div>
                  <h3 className="text-xl font-bold text-white">GCSE / IGCSE Mathematics</h3>
                  <p className="text-sm text-slate-300">
                    Higher & Foundation tiers. Step-by-step mastery of algebra, circle theorems, trigonometry, and exam
                    technique for Edexcel, AQA & OCR. Target Grade 7-9.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Edexcel</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">AQA</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Grade 8/9 Target</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match with a Maths Tutor &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-[#00d2c4] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    ⚗️
                  </div>
                  <h3 className="text-xl font-bold text-white">GCSE Sciences (Triple & Combined)</h3>
                  <p className="text-sm text-slate-300">
                    Physics, Chemistry, and Biology. Deep understanding of chemical equations, energy transfers,
                    genetics, and required practicals with examiner mark schemes.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Physics</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Chemistry</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Biology</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match with a Science Specialist &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    📖
                  </div>
                  <h3 className="text-xl font-bold text-white">GCSE English Language & Literature</h3>
                  <p className="text-sm text-slate-300">
                    Analytical essay writing, Shakespeare, 19th-century prose, unseen poetry, and rhetoric structure to
                    secure top Grade 8 and 9 marks.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Essay Mastery</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Poetry Anthology</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">AQA / Edexcel</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match with an English Specialist &rarr;
                  </button>
                </div>
              </>
            )}

            {/* 6. National 5 */}
            {activeLevelTab === "nat5" && (
              <>
                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🏴󠁧󠁢󠁳󠁣󠁴󠁿
                  </div>
                  <h3 className="text-xl font-bold text-white">National 5 Mathematics (SQA)</h3>
                  <p className="text-sm text-slate-300">
                    Complete coverage of SQA National 5 Maths: algebraic operations, quadratics, arcs & sectors,
                    trigonometric equations, and Paper 1 (Non-Calculator) & Paper 2 mastery.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">SQA Curriculum</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Paper 1 & Paper 2</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Grade A Strategy</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match National 5 Maths Tutor &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    🧪
                  </div>
                  <h3 className="text-xl font-bold text-white">National 5 Physics, Chemistry & Biology</h3>
                  <p className="text-sm text-slate-300">
                    Scottish Curriculum for Excellence science courses, assignment report coaching, experimental
                    data evaluation, and SQA past-paper drill.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Nat 5 Physics</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Nat 5 Chemistry</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Nat 5 Biology</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match National 5 Science Specialist &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    ✍️
                  </div>
                  <h3 className="text-xl font-bold text-white">National 5 English (RUAE & Essays)</h3>
                  <p className="text-sm text-slate-300">
                    Reading for Understanding, Analysis and Evaluation (RUAE) formulas, Scottish text extract questions,
                    and Critical Essay structuring to secure Band 1 / Grade A.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">RUAE Formulas</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Scottish Texts</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Critical Essays</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Match National 5 English Tutor &rarr;
                  </button>
                </div>
              </>
            )}

            {/* 7. A Level Preparation */}
            {activeLevelTab === "alevel" && (
              <>
                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    ∫dx
                  </div>
                  <h3 className="text-xl font-bold text-white">A-Level Pure & Further Maths</h3>
                  <p className="text-sm text-slate-300">
                    Differential equations, calculus, vectors, complex numbers, matrices, and mechanics tailored for
                    high-achieving STEM aspirants and top university offers.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Edexcel</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">OCR MEI</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">AQA Further Maths</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Book A-Level Maths Mentor &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-[#00d2c4] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    ⚡
                  </div>
                  <h3 className="text-xl font-bold text-white">A-Level & IB Chemistry / Physics / Biology</h3>
                  <p className="text-sm text-slate-300">
                    Organic synthesis, thermodynamics, quantum phenomena, and IB internal assessments guided by PhD
                    and Master’s educators.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">AQA Chemistry</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">OCR Physics</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Edexcel Biology</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Book Science Specialist &rarr;
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    📊
                  </div>
                  <h3 className="text-xl font-bold text-white">A-Level Economics, English & Humanities</h3>
                  <p className="text-sm text-slate-300">
                    Macroeconomics, micro market failures, real-world data evaluation, and high-scoring 25-mark essay
                    architecture for top grades (A* / A).
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">Economics</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">English Literature</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#132448] text-slate-300">History</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="pt-2 text-xs font-semibold text-[#00d2c4] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
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
      <section id="method" className="py-24 bg-[#070e1c] border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563eb]/10 text-[#38bdf8] border border-[#2563eb]/30 text-xs font-semibold uppercase tracking-wider">
              The Samin Standard
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              A Scientific, 4-Step Framework for Guaranteed Progress
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Generic tutoring often repeats textbook problems. Our bespoke pedagogy diagnoses the exact obstacles
              blocking higher marks and systematically builds unbreakable mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#00d2c4]/10 text-[#00d2c4] font-black text-lg flex items-center justify-center border border-[#00d2c4]/20">
                01
              </div>
              <h3 className="text-xl font-bold text-white">Diagnostic & Gap Assessment</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Before the first lesson, we pinpoint hidden gaps in prerequisite knowledge, test anxiety triggers, and
                specific exam board weaknesses.
              </p>
              <div className="text-xs font-semibold text-[#00d2c4] flex items-center gap-1">
                <span>Free $120 Evaluation</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] font-black text-lg flex items-center justify-center border border-[#38bdf8]/20">
                02
              </div>
              <h3 className="text-xl font-bold text-white">Elite Personality & Subject Match</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We pair your student with a handpicked mentor from our top 3% who matches both their learning pace,
                temperament, and specific curriculum board.
              </p>
              <div className="text-xs font-semibold text-[#38bdf8] flex items-center gap-1">
                <span>100% Fit Guarantee</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#ff6b4a]/10 text-[#ff6b4a] font-black text-lg flex items-center justify-center border border-[#ff6b4a]/20">
                03
              </div>
              <h3 className="text-xl font-bold text-white">Active Mastery & Exam Drills</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Sessions use dual-pen digital whiteboards, real past papers, examiner mark schemes, and spaced
                repetition so techniques become second nature under time pressure.
              </p>
              <div className="text-xs font-semibold text-[#ff6b4a] flex items-center gap-1">
                <span>Recorded for 24/7 Revision</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-[#0c1830] border border-white/10 hover:border-[#00d2c4]/40 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 font-black text-lg flex items-center justify-center border border-emerald-500/20">
                04
              </div>
              <h3 className="text-xl font-bold text-white">Weekly Transparency & Parent Reports</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Parents receive concise weekly updates on syllabus milestones covered, homework completion rates, and
                projected grade trajectory.
              </p>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span>Complete Peace of Mind</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Elite Tutors Roster */}
      <section id="tutors" className="py-24 relative bg-[#060b17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00d2c4]/10 text-[#00d2c4] border border-[#00d2c4]/20 text-xs font-semibold uppercase tracking-wider">
                Dedicated Educators • Canada 🇨🇦 • USA 🇺🇸 • UK 🇬🇧
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Meet Our Samin Tutors
              </h2>
              <p className="text-slate-400 text-base sm:text-lg">
                Our vetted specialist tutors teach students across Canada, the USA, and the UK. They aren&apos;t just
                brilliant scholars from top universities—they are empathetic, trained mentors who unlock your child&apos;s
                academic confidence and true potential.
              </p>
            </div>
            <button
              onClick={() => handleOpenBooking()}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#00d2c4] hover:text-white transition-colors cursor-pointer"
            >
              <span>Explore All 500+ Verified Tutors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tutor 1: David Zhang */}
            <div className="rounded-2xl bg-[#0c1830] border border-white/10 overflow-hidden hover:border-[#00d2c4]/40 transition-all flex flex-col justify-between group shadow-xl">
              <div>
                <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
                  <Image
                    src="/images/tutor-1.jpg"
                    alt="David Zhang - Mathematics Tutor"
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#070e1c]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-semibold text-[#00d2c4] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Imperial College London
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#070e1c]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    5.0 (94 reviews)
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">David Zhang, MSc</h3>
                    <p className="text-xs font-semibold text-[#38bdf8]">
                      Senior Tutor • Pure Maths, Further Maths & STEP
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Specialized in transforming students who struggle with abstract algebraic concepts and calculus
                    into confident top-grade achievers. 98% of his GCSE & A-Level students achieve Grades 8-9 / A*.
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-[#132448] text-slate-300">1,400+ Hours</span>
                    <span className="px-2 py-0.5 rounded bg-[#132448] text-slate-300">Edexcel & OCR Specialist</span>
                    <span className="px-2 py-0.5 rounded bg-[#132448] text-slate-300">DBS Enhanced</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 mt-4">
                <button
                  onClick={() => handleOpenBooking("David Zhang (Mathematics)")}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#00d2c4] text-white font-bold text-xs hover:opacity-95 transition-opacity cursor-pointer shadow-md"
                >
                  Enroll
                </button>
              </div>
            </div>

            {/* Tutor 2: Dr. Sophia Ramirez */}
            <div className="rounded-2xl bg-[#0c1830] border border-white/10 overflow-hidden hover:border-[#00d2c4]/40 transition-all flex flex-col justify-between group shadow-xl">
              <div>
                <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
                  <Image
                    src="/images/tutor-2.jpg"
                    alt="Dr. Sophia Ramirez - Science & Chemistry Tutor"
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#070e1c]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-semibold text-[#00d2c4] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Oxford University
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#070e1c]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    5.0 (112 reviews)
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Dr. Sophia Ramirez, PhD</h3>
                    <p className="text-xs font-semibold text-[#00d2c4]">
                      Head of Sciences • Chemistry, Biology & UCAT
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    PhD in Biochemistry from Oxford. Combines passionate storytelling with rigorous past paper mark
                    schemes, preparing aspiring doctors and biomedical engineers for medical school entry.
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-[#132448] text-slate-300">2,100+ Hours</span>
                    <span className="px-2 py-0.5 rounded bg-[#132448] text-slate-300">Medical Admissions Coach</span>
                    <span className="px-2 py-0.5 rounded bg-[#132448] text-slate-300">AQA & IB Expert</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 mt-4">
                <button
                  onClick={() => handleOpenBooking("Dr. Sophia Ramirez (Sciences)")}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#00d2c4] text-white font-bold text-xs hover:opacity-95 transition-opacity cursor-pointer shadow-md"
                >
                  Enroll
                </button>
              </div>
            </div>

            {/* Tutor 3: Marcus Sterling */}
            <div className="rounded-2xl bg-[#0c1830] border border-white/10 overflow-hidden hover:border-[#00d2c4]/40 transition-all flex flex-col justify-between group shadow-xl">
              <div>
                <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
                  <Image
                    src="/images/tutor-3.jpg"
                    alt="Marcus Sterling - English & Humanities Tutor"
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#070e1c]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-semibold text-[#00d2c4] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Cambridge University
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#070e1c]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    4.97 (88 reviews)
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Marcus Sterling, MA</h3>
                    <p className="text-xs font-semibold text-amber-400">
                      Senior Humanities Tutor • English Lit, Lang & 11+
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Cambridge graduate with 8 years of private tutoring excellence. Specializes in building confident,
                    sophisticated essay writers who stand out to top grammar schools and competitive university panels.
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-[#132448] text-slate-300">1,800+ Hours</span>
                    <span className="px-2 py-0.5 rounded bg-[#132448] text-slate-300">11+ Entrance Specialist</span>
                    <span className="px-2 py-0.5 rounded bg-[#132448] text-slate-300">DBS Enhanced</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 mt-4">
                <button
                  onClick={() => handleOpenBooking("Marcus Sterling (English & 11+)")}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#00d2c4] text-white font-bold text-xs hover:opacity-95 transition-opacity cursor-pointer shadow-md"
                >
                  Enroll
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tuition & Package Calculator */}
      <section id="calculator" className="py-24 bg-[#070e1c] border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff6b4a]/10 text-[#ff6b4a] border border-[#ff6b4a]/20 text-xs font-semibold uppercase tracking-wider">
              Transparent Investment
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Interactive Tuition Estimator
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Tailor your weekly lesson hours, learning environment, and academic tier with zero hidden fees. All plans
              include full access to recorded sessions, lesson notes, and our diagnostic assessment.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-[#0c1830] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Controls */}
              <div className="lg:col-span-7 space-y-8">
                {/* Stage selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
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
                            ? "bg-[#00d2c4]/15 border-[#00d2c4] text-[#00d2c4]"
                            : "bg-[#132448]/60 border-white/5 text-slate-300 hover:border-white/20"
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Format selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                    2. Online Delivery Format
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCalcFormat("1on1")}
                      className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        calcFormat === "1on1"
                          ? "bg-[#2563eb]/20 border-[#38bdf8] text-white"
                          : "bg-[#132448]/60 border-white/5 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      <Laptop className="w-4 h-4 text-[#38bdf8]" />
                      <span>1-on-1 Dedicated Online</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcFormat("pod")}
                      className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        calcFormat === "pod"
                          ? "bg-[#2563eb]/20 border-[#38bdf8] text-white"
                          : "bg-[#132448]/60 border-white/5 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      <Users className="w-4 h-4 text-[#00d2c4]" />
                      <span>Small Online Pod (Max 3)</span>
                    </button>
                  </div>
                </div>

                {/* Hours slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      3. Weekly Intensity
                    </label>
                    <span className="text-sm font-bold text-[#00d2c4]">{calcHours} Hours / Week</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={calcHours}
                    onChange={(e) => setCalcHours(parseInt(e.target.value))}
                    className="w-full accent-[#00d2c4] bg-[#132448] h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                    <span>1 hr/wk (Maintenance)</span>
                    <span>2 hrs/wk (Recommended)</span>
                    <span>4+ hrs/wk (Exam Sprint)</span>
                  </div>
                </div>
              </div>

              {/* Estimate Summary Card */}
              <div className="lg:col-span-5 bg-[#070e1c] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d2c4]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="border-b border-white/10 pb-4">
                  <div className="text-xs text-slate-400 uppercase font-semibold">Estimated Monthly Plan</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold text-white">${discountedMonthlyTotal}</span>
                    <span className="text-xs text-slate-400">/ 4-week cycle</span>
                  </div>
                  <div className="text-xs text-[#00d2c4] mt-1 font-medium">
                    Equivalent to ${currentHourlyRate}/hr • {calcHours * 4} sessions per month
                  </div>
                </div>

                {savings > 0 && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-2 rounded-lg font-medium flex items-center justify-between">
                    <span>Multi-hour package applied</span>
                    <span className="font-bold">Save ${savings}/mo</span>
                  </div>
                )}

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00d2c4] shrink-0" />
                    <span>Free Full Academic Diagnostic ($120 value)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00d2c4] shrink-0" />
                    <span>Recorded interactive whiteboard access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00d2c4] shrink-0" />
                    <span>Weekly progress reports to parents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00d2c4] shrink-0" />
                    <span>Dedicated educational advisor support</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenBooking()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#00d2c4] text-white font-bold text-sm shadow-lg shadow-[#00d2c4]/20 hover:shadow-[#00d2c4]/40 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  Reserve Consultation for This Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Samin Virtual Classroom Experience */}
      <section id="virtual-classroom" className="py-24 bg-[#060b17] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00d2c4]/10 text-[#00d2c4] border border-[#00d2c4]/20 text-xs font-semibold uppercase tracking-wider">
                Built For Seamless Learning
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                An Online Classroom Experience That Beats In-Person Tutoring
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Gone are the days of boring video calls. Samin’s custom virtual environment lets students and tutors
                collaborate simultaneously with interactive stylus drawing, instant past paper imports, equation
                solvers, and synchronized graphing tools.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#00d2c4]/10 text-[#00d2c4] flex items-center justify-center shrink-0 mt-0.5">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Full HD Recordings for Revision</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Every lesson is archived with high-definition audio and whiteboard exports. Students rewatch
                      before crucial tests anytime.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Instant Mark Scheme Breakdown</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tutors pull authentic exam papers onto the board live, highlighting examiner trigger words that
                      secure the top marks.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#ff6b4a]/10 text-[#ff6b4a] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Safe, Monitored & Secure</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Compliant with international child safeguarding standards. Parents can join or review anytime
                      with complete transparency.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Classroom Preview Graphic */}
            <div className="lg:col-span-6">
              <div className="p-3 bg-[#0c1830] border border-white/10 rounded-3xl shadow-2xl relative">
                <div className="bg-[#070e1c] rounded-2xl p-5 border border-white/5 space-y-4">
                  {/* Top toolbar */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00d2c4]" />
                      <span className="text-xs font-semibold text-white">Interactive Whiteboard #4</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded bg-[#132448] text-slate-300">Stylus Mode</span>
                      <span className="px-2.5 py-1 rounded bg-[#132448] text-slate-300">Graph Plotter</span>
                    </div>
                  </div>

                  {/* Math Formula Demo Visual */}
                  <div className="h-52 bg-[#091222] rounded-xl border border-white/5 p-4 flex flex-col justify-center items-center text-center space-y-3">
                    <div className="font-mono text-lg sm:text-xl text-[#00d2c4] font-semibold">
                      f&apos;(x) = lim[h→0] (f(x+h) - f(x)) / h
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      ✓ Step 2 Verified: Differentiation from First Principles
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      <span>Examiner Note: Awarded Full Method & Accuracy Marks (5/5)</span>
                    </div>
                  </div>

                  {/* Tutor / Student Participants Bar */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-2.5 rounded-xl bg-[#0c1830] border border-white/5 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center text-xs font-bold text-white">
                        DZ
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white">David Zhang</div>
                        <div className="text-[10px] text-[#00d2c4]">Tutor (Speaking)</div>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0c1830] border border-white/5 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                        AM
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white">Alex Morgan</div>
                        <div className="text-[10px] text-slate-400">Student (Year 11)</div>
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
      <section className="py-24 bg-[#070e1c] border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider">
              Real Grade Transformations
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Loved by Over 1,200+ Discerning Families
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Here is what happens when passionate mentorship meets personalized academic roadmaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed italic">
                  &ldquo;Our daughter was predicted a Grade 5 in GCSE Maths and felt completely overwhelmed. Her Samin
                  tutor, David, restored her confidence within three weeks. She just received a Grade 9 on results day!
                  Unbelievable service.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Claire H.</div>
                  <div className="text-[11px] text-slate-400">Parent of GCSE Student, London</div>
                </div>
                <div className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                  Grade 5 ➔ 9
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed italic">
                  &ldquo;The 1-on-1 chemistry sessions with Dr. Sophia were world class. Her explanations of organic
                  reaction pathways were clearer than anything taught at school. My son secured his offer for Imperial
                  Medicine.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Tariq M.</div>
                  <div className="text-[11px] text-slate-400">Parent of A-Level Candidate</div>
                </div>
                <div className="px-2.5 py-1 rounded bg-[#38bdf8]/10 text-[#38bdf8] text-xs font-bold">
                  Accepted to Imperial
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c1830] border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed italic">
                  &ldquo;We tried multiple agency tutors before finding Samin Home Tutors. The difference in caliber and
                  communication is night and day. The weekly parent feedback and recorded classes gave us total peace of
                  mind.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Eleanor B.</div>
                  <div className="text-[11px] text-slate-400">Mother of 11+ Grammar Student</div>
                </div>
                <div className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-bold">
                  Top 1% Score
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faqs" className="py-24 bg-[#060b17] border-t border-white/10 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00d2c4]/10 text-[#00d2c4] border border-[#00d2c4]/20 text-xs font-semibold uppercase tracking-wider">
              Common Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Everything Parents Want to Know</h2>
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
                className="rounded-2xl bg-[#0c1830] border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white text-sm sm:text-base cursor-pointer hover:text-[#00d2c4] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                      activeFaq === idx ? "rotate-180 text-[#00d2c4]" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 border-t border-white/5 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action Hero Box */}
      <section className="py-20 relative overflow-hidden bg-radial-hero">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#0c1830] to-[#070e1c] border border-[#00d2c4]/40 shadow-2xl relative space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2c4]/10 text-[#00d2c4] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Limited Intake for Upcoming Exam Cycles
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Give Your Child the Advantage of an Elite Private Tutor
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Book your complimentary diagnostic assessment and 30-minute academic consultation with our Senior
              Education Advisor today.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => handleOpenBooking()}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#00d2c4] text-white font-bold text-sm shadow-xl shadow-[#00d2c4]/25 hover:shadow-[#00d2c4]/40 hover:scale-105 transition-all cursor-pointer"
              >
                Book Your Free Diagnostic Session
              </button>
              <a
                href="https://wa.me/2347059655382"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#132448] text-slate-200 font-semibold text-sm hover:text-white flex items-center justify-center gap-2 border border-white/10 hover:border-emerald-500/40 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: +234 705 965 5382</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* World-Class Footer */}
      <footer className="bg-[#040812] border-t border-white/10 py-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#00d2c4]/40 bg-[#070e1c] p-1 shadow-lg shrink-0">
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
                  <div className="text-[10px] tracking-widest text-[#00d2c4] font-bold uppercase mt-1">
                    Canada • USA • UK Online Tutoring
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Empowering students with personalized mastery curricula, handpicked Oxbridge & Ivy League educators,
                and weekly transparent parental reporting.
              </p>
              <div className="text-slate-400 flex items-center gap-3 pt-2">
                <span className="text-slate-200 font-semibold">Accreditations:</span>
                <span className="bg-[#0c1830] px-2 py-1 rounded border border-white/5">DBS Verified</span>
                <span className="bg-[#0c1830] px-2 py-1 rounded border border-white/5">Tutors&apos; Association</span>
              </div>
            </div>

            {/* Col 2: Categories */}
            <div className="space-y-3">
              <h4 className="text-white font-bold uppercase tracking-wider text-xs">Learner Categories</h4>
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
              <h4 className="text-white font-bold uppercase tracking-wider text-xs">Programs & Admissions</h4>
              <ul className="space-y-2">
                <li><a href="#levels" className="hover:text-white transition-colors">Oxbridge Interview Prep</a></li>
                <li><a href="#levels" className="hover:text-white transition-colors">Medical School (UCAT / BMAT)</a></li>
                <li><a href="#levels" className="hover:text-white transition-colors">STEP & MAT Mathematics</a></li>
                <li><a href="#virtual-classroom" className="hover:text-white transition-colors">1-on-1 Online Classroom</a></li>
                <li><a href="#virtual-classroom" className="hover:text-white transition-colors">Virtual Classroom HD</a></li>
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div className="space-y-3">
              <h4 className="text-white font-bold uppercase tracking-wider text-xs">Direct Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="tel:+2347059655382"
                    className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>Hotline / Call: +234 705 965 5382</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/2347059655382"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00d2c4] hover:underline flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp: +234 705 965 5382</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:saminhometutors@gmail.com?subject=Tutoring%20Inquiry%20-%20Samin%20Home%20Tutors"
                    className="text-[#00d2c4] hover:underline flex items-center gap-1.5"
                    title="Click to compose an email to Samin Home Tutors"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email: saminhometutors@gmail.com</span>
                  </a>
                </li>
                <li className="text-slate-300">Hours: Mon–Sun 8:00 AM – 9:00 PM GMT</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>&copy; {new Date().getFullYear()} Samin Home Tutors Ltd. All rights reserved.</div>
            <div className="flex flex-wrap gap-6">
              <a href="#" className="hover:text-slate-400">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400">Safeguarding Code</a>
              <a href="#" className="hover:text-slate-400">Terms of Tuition</a>
              <a href="/admin/login" className="text-[#00d2c4] hover:underline font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
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
          className="relative flex items-center gap-3 p-1.5 pr-4 rounded-full bg-gradient-to-r from-[#0c1830] via-[#102244] to-[#0c1830] border-2 border-[#00d2c4]/50 shadow-2xl shadow-[#00d2c4]/30 hover:border-[#00d2c4] hover:shadow-[#00d2c4]/60 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md"
          title="Click to Enroll - Free Diagnostic Trial"
        >
          {/* Glowing Animated Ring */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#2563eb] via-[#00d2c4] to-[#ff6b4a] opacity-30 group-hover:opacity-75 blur-sm transition-opacity duration-300 pointer-events-none" />

          {/* Logo Badge Container */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#00d2c4]/60 bg-[#070e1c] p-0.5 shrink-0 shadow-inner group-hover:rotate-6 transition-transform duration-300">
            <Image
              src="/images/samin_logo.jpeg"
              alt="Samin Home Tutors Emblem"
              width={56}
              height={56}
              className="w-full h-full object-cover rounded-full"
            />
            {/* Live Indicator Dot */}
            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#060b17]" />
          </div>

          {/* Text Label that expands and highlights */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black tracking-wide text-white group-hover:text-[#00d2c4] transition-colors uppercase">
                Enroll Now
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#00d2c4] animate-pulse" />
            </div>
            <span className="text-[9px] font-medium text-slate-300 group-hover:text-white transition-colors">
              Free Trial • 🇨🇦 🇺🇸 🇬🇧
            </span>
          </div>
        </button>
      </aside>

      {/* Interactive Consultation / Trial Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0c1830] border border-[#00d2c4]/40 p-6 sm:p-8 shadow-2xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingSuccess ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="text-left space-y-1">
                  <div className="text-xs font-semibold text-[#00d2c4] uppercase tracking-wider">
                    {selectedTutorForBooking ? `Booking with ${selectedTutorForBooking}` : "Fast-Track Consultation"}
                  </div>
                  <h3 className="text-2xl font-black text-white">Book Free Diagnostic Trial</h3>
                  <p className="text-xs text-slate-300">
                    Complimentary 30-min student evaluation & tutor matching plan ($120 value).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                      Parent / Guardian Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.parentName}
                      onChange={(e) => setBookingForm({ ...bookingForm, parentName: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#070e1c] border border-white/10 text-white text-xs focus:border-[#00d2c4] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                      Student Name & Year
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.studentName}
                      onChange={(e) => setBookingForm({ ...bookingForm, studentName: e.target.value })}
                      placeholder="e.g. Liam (Year 11)"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#070e1c] border border-white/10 text-white text-xs focus:border-[#00d2c4] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      placeholder="sarah@example.com"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#070e1c] border border-white/10 text-white text-xs focus:border-[#00d2c4] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      placeholder="+234 705 965 5382"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#070e1c] border border-white/10 text-white text-xs focus:border-[#00d2c4] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                      Target Level
                    </label>
                    <select
                      value={bookingForm.gradeLevel}
                      onChange={(e) => setBookingForm({ ...bookingForm, gradeLevel: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#070e1c] border border-white/10 text-white text-xs focus:border-[#00d2c4] focus:outline-none"
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
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                      Preferred Online Format
                    </label>
                    <select
                      value={bookingForm.mode}
                      onChange={(e) => setBookingForm({ ...bookingForm, mode: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#070e1c] border border-white/10 text-white text-xs focus:border-[#00d2c4] focus:outline-none"
                    >
                      <option>100% Live Online 1-on-1</option>
                      <option>Online Small Study Pod (2-3 Students)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                    Specific Subject & Goal (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="e.g. Struggling with Edexcel Maths grade 5, wants grade 8 or 9."
                    className="w-full px-3 py-2 rounded-xl bg-[#070e1c] border border-white/10 text-white text-xs focus:border-[#00d2c4] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#00d2c4] text-white font-bold text-sm shadow-xl shadow-[#00d2c4]/20 hover:shadow-[#00d2c4]/40 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  Confirm Diagnostic Session Booking
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Consultation Request Received!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-white">{bookingForm.parentName || "Parent"}</span>.
                  One of our Senior Academic Advisors will contact you at{" "}
                  <span className="font-semibold text-[#00d2c4]">{bookingForm.phone || bookingForm.email}</span> within 4
                  business hours to schedule your student&apos;s free diagnostic assessment.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#132448] text-white text-xs font-semibold hover:bg-[#1a3060] transition-colors cursor-pointer"
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
