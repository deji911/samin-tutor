"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  GraduationCap,
  CheckCircle2,
  Star,
  Users,
  Award,
  Video,
  ChevronDown,
  X,
  Menu,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Send,
  BookOpen,
  Layers,
  Search,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";

// ─── Data ──────────────────────────────────────────────────────────────────

const heroSlides = [
  {
    img: "/images/hero-lecture.jpg",
    alt: "University lecture hall",
    title: "Taking the lead for education quality",
    sub: "Educating the mind without educating the heart is no education at all.",
  },
  {
    img: "/images/hero-graduation.jpg",
    alt: "Graduation ceremony",
    title: "Empowering students to reach their full potential",
    sub: "World-class 1-on-1 live online tutoring for GCSE, A-Level, and beyond.",
  },
  {
    img: "/images/hero-conference.jpg",
    alt: "Educational conference",
    title: "Access your lessons anytime, anywhere",
    sub: "Expert tutors matched to your child's needs — Canada, USA & UK.",
  },
];

const courses = [
  {
    img: "/images/hero-student.jpg",
    title: "GCSE Mathematics & Science Mastery",
    desc: "Intensive 1-on-1 sessions with subject specialists covering all GCSE exam boards — AQA, Edexcel, OCR.",
    price: "£40",
    rating: 4.9,
    votes: 128,
  },
  {
    img: "/images/hero-lecture.jpg",
    title: "A-Level Physics & Maths Specialist",
    desc: "Advanced tutoring for A-Level students targeting A/A* grades, including Mechanics and Further Maths.",
    price: "£48",
    rating: 4.8,
    votes: 94,
  },
  {
    img: "/images/tutor-1.jpg",
    title: "11+ & Grammar School Preparation",
    desc: "Comprehensive preparation for 11+ exams, covering verbal reasoning, non-verbal reasoning, English and Maths.",
    price: "£36",
    rating: 5.0,
    votes: 76,
  },
  {
    img: "/images/tutor-2.jpg",
    title: "Primary School Fundamentals",
    desc: "Building strong foundations in Literacy and Numeracy for Reception through Year 6 students.",
    price: "£32",
    rating: 4.9,
    votes: 112,
  },
  {
    img: "/images/tutor-3.jpg",
    title: "Canadian Curriculum Support",
    desc: "Ontario & BC curriculum aligned tutoring for all grades, including IB and AP programmes.",
    price: "CAD 55",
    rating: 4.8,
    votes: 63,
  },
  {
    img: "/images/hero-graduation.jpg",
    title: "University Admissions & Interview Prep",
    desc: "Oxbridge, Ivy League and medical school admissions coaching, personal statement writing and interview prep.",
    price: "£65",
    rating: 5.0,
    votes: 45,
  },
];

const instructors = [
  {
    img: "/images/tutor-1.jpg",
    name: "Aisha Omoruyi",
    role: "Mathematics & Physics • Oxford Graduate",
  },
  {
    img: "/images/tutor-2.jpg",
    name: "Daniel Okonkwo",
    role: "English & Humanities • Cambridge Graduate",
  },
  {
    img: "/images/tutor-3.jpg",
    name: "Priya Sharma",
    role: "Biology & Chemistry • Imperial College",
  },
  {
    img: "/images/hero-student.jpg",
    name: "James Whitfield",
    role: "Computer Science & Maths • UCL Graduate",
  },
];

const stats = [
  { icon: "📚", number: "47+", label: "Free Resources" },
  { icon: "👩‍🏫", number: "105", label: "Expert Tutors" },
  { icon: "💡", number: "5k+", label: "Students Helped" },
  { icon: "😊", number: "98%", label: "Satisfaction Rate" },
  { icon: "🏆", number: "21", label: "Awards Won" },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "£32",
    period: "/ hour",
    featured: false,
    features: [
      "1-on-1 Live Sessions",
      "Primary & KS3 Level",
      "Weekly Progress Report",
      "Email Support",
      "Learning Resources",
    ],
  },
  {
    name: "GCSE Pro",
    price: "£40",
    period: "/ hour",
    featured: true,
    features: [
      "1-on-1 Premium Sessions",
      "GCSE All Subjects",
      "Weekly Progress Report",
      "WhatsApp Support",
      "Past Paper Bank Access",
      "Tutor Match Guarantee",
    ],
  },
  {
    name: "A-Level Elite",
    price: "£48",
    period: "/ hour",
    featured: false,
    features: [
      "1-on-1 Elite Sessions",
      "A-Level & IB Subjects",
      "Weekly Parent Meeting",
      "Priority Support",
      "University Prep Included",
      "Oxbridge Coaching",
    ],
  },
];

const testimonials = [
  {
    text: "My daughter's GCSE Maths went from a Grade 4 to a Grade 8 in just 6 months. The tutor was patient, thorough, and really understood how she learns.",
    name: "Sarah Mitchell",
    role: "Parent, UK",
    img: "/images/tutor-1.jpg",
    stars: 5,
  },
  {
    text: "Samin Home Tutors changed everything. My son now loves Physics. His tutor makes it feel easy and his confidence has sky-rocketed.",
    name: "James Okafor",
    role: "Parent, Canada",
    img: "/images/tutor-2.jpg",
    stars: 5,
  },
  {
    text: "Excellent service from start to finish. The tutor matching was perfect and the online classroom tools are brilliant. Highly recommend!",
    name: "Priya Anand",
    role: "Parent, USA",
    img: "/images/tutor-3.jpg",
    stars: 5,
  },
];

const faqs = [
  {
    q: "How does the online tutoring work?",
    a: "All sessions are conducted via our HD virtual classroom. Tutors use interactive whiteboards, screen sharing, and breakout tools to deliver fully live 1-on-1 lessons. All you need is a device with a camera and internet connection.",
  },
  {
    q: "How are tutors vetted and selected?",
    a: "All tutors hold degrees from top universities and must pass our rigorous 5-stage screening process including subject knowledge tests, a mock lesson, and enhanced background checks. Only the top 3% are accepted.",
  },
  {
    q: "What curriculum do you cover?",
    a: "We cover UK (AQA, Edexcel, OCR, CIE), Canadian (Ontario, BC, AB) and US curricula across all key stages. This includes Reception through A-Level, IB, AP, and university preparation.",
  },
  {
    q: "Can I get a free trial lesson?",
    a: "Yes! We offer a free 30-minute diagnostic consultation and assessment session so you can meet your tutor, assess your child's current level, and plan a learning roadmap — all before committing.",
  },
  {
    q: "What happens if we are not happy with our tutor?",
    a: "We offer a 100% Tutor Match Guarantee. If you are not satisfied within the first two sessions, we will rematch you with another tutor at no extra cost.",
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [form, setForm] = useState({
    parentName: "",
    studentName: "",
    email: "",
    phone: "",
    subject: "Mathematics",
    level: "GCSE",
    notes: "",
  });

  // Auto-slide
  const nextSlide = useCallback(() => {
    setCurrentSlide((p) => (p + 1) % heroSlides.length);
  }, []);
  const prevSlide = () =>
    setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length);

  useEffect(() => {
    const t = setInterval(nextSlide, 5000);
    return () => clearInterval(t);
  }, [nextSlide]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  const StarRow = ({ count }: { count: number }) => (
    <span className="stars">
      {[...Array(5)].map((_, i) => (
        <span key={i}>{i < Math.floor(count) ? "★" : "☆"}</span>
      ))}
    </span>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>

      {/* ── Top Bar ── */}
      <div className="top-bar">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <span>🎓 Welcome to Samin Home Tutors — World-Class Live Online Tutoring</span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a href="/admin/login">🔐 Admin Login</a>
            <a href="https://wa.me/2347059655382?text=Hello%20Samin%20Home%20Tutors!%20%F0%9F%8E%93%0A%0AI%20found%20your%20website%20and%20I%E2%80%99m%20interested%20in%20booking%20a%20FREE%20trial%20lesson.%0A%0APlease%20could%20you%20help%20me%20with%20more%20information%20about%3A%0A%E2%80%A2%20Available%20tutors%0A%E2%80%A2%20Subjects%20%26%20levels%20covered%0A%E2%80%A2%20Pricing%20%26%20scheduling%0A%0AThank%20you!" target="_blank" rel="noopener noreferrer">💬 WhatsApp Us</a>
          </div>
        </div>
      </div>

      {/* ── Header ── */}
      <header className="site-header">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "70px" }}>
          {/* Logo */}
          <a href="#" className="logo-text">
            <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--teal)", flexShrink: 0 }}>
              <Image
                src="/images/samin_logo.jpeg"
                alt="Samin Home Tutors Logo"
                width={40}
                height={40}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                priority
              />
            </div>
            <span><span className="logo-edu">Samin</span>Tutors</span>
          </a>

          {/* Desktop nav */}
          <ul className="nav-menu">
            <li><a href="#courses">Courses</a></li>
            <li><a href="#features">Why Us</a></li>
            <li><a href="#instructors">Tutors</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#testimonials">Reviews</a></li>
            <li><a href="#faqs">FAQs</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>

          {/* CTA + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button className="btn-enroll" onClick={() => setIsModalOpen(true)}>
              Free Trial Lesson
            </button>
            <button
              className="btn-enroll"
              style={{ background: "transparent", color: "var(--dark)", border: "1px solid var(--border)", display: "none" }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              id="hamburger-btn"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              style={{ background: "none", border: "1px solid var(--border)", borderRadius: "4px", padding: "0.45rem", cursor: "pointer", display: "flex", alignItems: "center" }}
              className="mobile-menu-btn"
            >
              <Menu size={20} color="var(--dark)" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
              <span className="logo-text" style={{ fontSize: "1.1rem" }}><span className="logo-edu">Samin</span>Tutors</span>
              <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
              {["#courses", "#features", "#instructors", "#pricing", "#testimonials", "#faqs", "#contact"].map((href) => (
                <a key={href} href={href} onClick={() => setMobileOpen(false)}
                  style={{ padding: "0.75rem 0.5rem", color: "var(--dark)", textDecoration: "none", borderBottom: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: 500 }}>
                  {href.replace("#", "").charAt(0).toUpperCase() + href.slice(2)}
                </a>
              ))}
            </nav>
            <button className="btn-enroll" style={{ width: "100%", marginTop: "1rem", justifyContent: "center" }} onClick={() => { setMobileOpen(false); setIsModalOpen(true); }}>
              Book Free Trial
            </button>
          </div>
        </div>
      )}

      {/* ── Hero Slider ── */}
      <div className="hero-slider" id="home">
        {heroSlides.map((slide, i) => (
          <div key={i} className={`hero-slide ${i === currentSlide ? "active" : ""}`}>
            <Image src={slide.img} alt={slide.alt} fill style={{ objectFit: "cover", filter: "brightness(0.5)" }} priority={i === 0} />
            <div className="hero-content">
              <h1>{slide.title}</h1>
              <p>{slide.sub}</p>
              <button className="hero-btn" onClick={() => setIsModalOpen(true)}>
                Start A Course &nbsp; ›
              </button>
            </div>
          </div>
        ))}

        {/* Arrows */}
        <button className="slider-arrow prev" onClick={prevSlide} aria-label="Previous slide">
          <ChevronLeft size={18} />
        </button>
        <button className="slider-arrow next" onClick={nextSlide} aria-label="Next slide">
          <ChevronRight size={18} />
        </button>

        {/* Dots */}
        <div className="slider-dots">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`slider-dot ${i === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Search Section ── */}
      <section className="search-section" id="search">
        <div className="container">
          <h2>Find your perfect tutor or course</h2>
          <p>Search from 47+ specialised tutoring programmes across every curriculum and level.</p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Type your keywords..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
              <option value="">Choose Subject...</option>
              <option>Mathematics</option>
              <option>English</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Biology</option>
              <option>Computer Science</option>
              <option>History</option>
              <option>Economics</option>
            </select>
            <button>
              <Search size={16} style={{ display: "inline", marginRight: "0.4rem" }} />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ── Courses Section ── */}
      <section className="courses-section" id="courses">
        <div className="container">
          <div className="section-header">
            <h2>Our Tutoring Programmes</h2>
            <p>Hand-picked subject specialists from Oxford, Cambridge, Imperial and other top universities, delivering live 1-on-1 sessions tailored to your child&apos;s exact needs.</p>
          </div>
          <div className="grid-3" style={{ marginBottom: "2rem" }}>
            {courses.map((c, i) => (
              <div key={i} className="course-card">
                <Image src={c.img} alt={c.title} width={400} height={200} className="course-card-img" />
                <div className="course-card-body">
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
                <div className="course-card-footer">
                  <span className="course-price">{c.price} / hr</span>
                  <span className="course-rating">
                    <StarRow count={c.rating} /> ({c.votes} Reviews)
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <button className="btn-enroll" onClick={() => setIsModalOpen(true)}>
              Book Your Free Trial Lesson
            </button>
          </div>
        </div>
      </section>

      {/* ── Features / Why Us ── */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="two-col-layout">
            {/* Left: image with play overlay */}
            <div className="col-img">
              <Image
                src="/images/hero-lecture.jpg"
                alt="Samin virtual classroom"
                width={580}
                height={362}
                className="video-thumb"
              />
              <div className="play-btn" role="button" aria-label="Watch intro video">
                <div className="play-icon">▶</div>
              </div>
            </div>

            {/* Right: feature list */}
            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--dark)", marginBottom: "0.75rem" }}>
                  Why Choose Samin Home Tutors?
                </h2>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
                  We combine the rigour of elite university graduates with a warm, supportive teaching style to help every student thrive — academically and personally.
                </p>
              </div>
              <div className="features-list">
                {[
                  { icon: <TrendingUp size={22} />, title: "Highest Rated", desc: "Consistently rated 4.9/5 by families across Canada, USA and the UK." },
                  { icon: <Video size={22} />, title: "Live Online Training", desc: "100% interactive HD sessions — not pre-recorded. Real tutors, real time." },
                  { icon: <BookOpen size={22} />, title: "Large Resource Library", desc: "Access to 500+ past papers, revision notes, and mock exams included free." },
                  { icon: <ShieldCheck size={22} />, title: "Verified & DBS Checked", desc: "Every tutor is background-checked, interview-assessed and test-approved." },
                  { icon: <Lightbulb size={22} />, title: "Personalised Learning Plans", desc: "Your child gets a bespoke roadmap built around their goals and schedule." },
                ].map((f, i) => (
                  <div key={i} className="feature-item">
                    <div className="feature-icon">{f.icon}</div>
                    <div>
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-number">{s.number}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instructors ── */}
      <section className="instructors-section" id="instructors">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Expert Tutors</h2>
            <p>Every Samin tutor holds a degree from a world-leading university and has been personally vetted for academic excellence and teaching ability.</p>
          </div>
          <div className="grid-4">
            {instructors.map((t, i) => (
              <div key={i} className="instructor-card">
                <Image src={t.img} alt={t.name} width={90} height={90} style={{ borderRadius: "50%", objectFit: "cover", border: "3px solid var(--teal-light)", margin: "0 auto 1rem", display: "block" }} />
                <h3>{t.name}</h3>
                <span className="instructor-role">{t.role}</span>
                <div className="instructor-social">
                  <a href="#" className="social-icon" aria-label="Facebook">f</a>
                  <a href="#" className="social-icon" aria-label="Twitter">𝕏</a>
                  <a href="#" className="social-icon" aria-label="LinkedIn">in</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="pricing-section" id="pricing">
        <div className="container">
          <div className="section-header">
            <h2>Transparent Tuition Pricing</h2>
            <p>No hidden fees. Pay per hour with flexible scheduling. All plans include a free first consultation and diagnostic assessment.</p>
          </div>
          <div className="grid-3">
            {pricingPlans.map((plan, i) => (
              <div key={i} className="pricing-card">
                <div className={`pricing-header ${plan.featured ? "featured" : ""}`}>
                  <h3>{plan.name}</h3>
                  <div className="pricing-amount">{plan.price}</div>
                  <div className="pricing-period">{plan.period}</div>
                </div>
                <div className="pricing-body">
                  {plan.features.map((f, j) => (
                    <div key={j} className="pricing-feature">
                      <CheckCircle2 size={15} />
                      {f}
                    </div>
                  ))}
                </div>
                <button
                  className={`btn-pricing ${plan.featured ? "featured" : ""}`}
                  onClick={() => setIsModalOpen(true)}
                >
                  {plan.featured ? "Get Started Now" : "Choose Plan"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Families Say About Us</h2>
            <p>Over 1,200 families across Canada, USA and the UK trust Samin Home Tutors to guide their children to academic excellence.</p>
          </div>
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div style={{ marginBottom: "0.75rem" }}>
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} size={14} fill="#f5a623" color="#f5a623" style={{ display: "inline" }} />
                  ))}
                </div>
                <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author">
                  <Image src={t.img} alt={t.name} width={44} height={44} style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid var(--teal-light)", flexShrink: 0 }} />
                  <div className="testimonial-author-info">
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── App Banner ── */}
      <section className="app-section">
        <Image src="/images/hero-conference.jpg" alt="Access anywhere" fill className="app-bg" style={{ objectFit: "cover", filter: "brightness(0.35)" }} />
        <div className="container app-content">
          <h2>Access your lessons anytime, anywhere.</h2>
          <div className="app-badges">
            <a href="#" className="app-badge" aria-label="Get it on Google Play">
              <span style={{ fontSize: "1.8rem" }}>▶</span>
              <div className="app-badge-text">
                <span>GET IT ON</span>
                <span>Google Play</span>
              </div>
            </a>
            <a href="#" className="app-badge" aria-label="Download on App Store">
              <span style={{ fontSize: "1.8rem" }}>📱</span>
              <div className="app-badge-text">
                <span>Available on the</span>
                <span>App Store</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq-section" id="faqs">
        <div className="container" style={{ maxWidth: "760px" }}>
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Have a question? We have got you covered.</p>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button
                className={`faq-question ${activeFaq === i ? "open" : ""}`}
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                {faq.q}
                <ChevronDown size={18} className={`faq-chevron ${activeFaq === i ? "rotated" : ""}`} />
              </button>
              {activeFaq === i && (
                <div className="faq-answer">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer" id="contact">
        <div className="container">
          <div className="footer-grid">
            {/* About */}
            <div className="footer-col">
              <h4>About Samin Tutors</h4>
              <p>We are a world-class online tutoring platform connecting ambitious students across Canada, USA and the UK with elite subject specialists from top universities.</p>
              <p style={{ marginTop: "0.75rem" }}>Rated <strong style={{ color: "var(--teal)" }}>4.9 / 5</strong> by over 1,200 families.</p>
            </div>

            {/* Get in touch */}
            <div className="footer-col">
              <h4>Get In Touch</h4>
              <div className="footer-contact-item">
                <MapPin size={15} />
                <span>Serving Canada 🇨🇦, USA 🇺🇸 &amp; UK 🇬🇧 — fully online</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={15} />
                <a href="https://wa.me/2347059655382?text=Hello%20Samin%20Home%20Tutors!%20%F0%9F%8E%93%0A%0AI%20found%20your%20website%20and%20I%E2%80%99m%20interested%20in%20booking%20a%20FREE%20trial%20lesson.%0A%0APlease%20could%20you%20help%20me%20with%20more%20information%20about%3A%0A%E2%80%A2%20Available%20tutors%0A%E2%80%A2%20Subjects%20%26%20levels%20covered%0A%E2%80%A2%20Pricing%20%26%20scheduling%0A%0AThank%20you!" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)", textDecoration: "none" }}>WhatsApp: +234 705 965 5382</a>
              </div>
              <div className="footer-contact-item">
                <Mail size={15} />
                <a href="mailto:saminhometutors@gmail.com" style={{ color: "var(--text-muted)", textDecoration: "none" }}>saminhometutors@gmail.com</a>
              </div>
            </div>

            {/* Links */}
            <div className="footer-col">
              <h4>Useful Links</h4>
              <ul className="footer-links">
                {["#courses", "#features", "#instructors", "#pricing", "#testimonials", "#faqs"].map((href) => (
                  <li key={href}>
                    <a href={href}>› {href.replace("#", "").charAt(0).toUpperCase() + href.slice(2)}</a>
                  </li>
                ))}
                <li><a href="/admin/login">› Admin Portal</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="footer-col">
              <h4>Subscribe Newsletter</h4>
              <p>Get the latest study tips, free resources and exclusive offers delivered to your inbox.</p>
              <div className="newsletter-input">
                <input type="email" placeholder="Enter Your E-mail" />
                <button aria-label="Subscribe">
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            © {new Date().getFullYear()} Samin Home Tutors. All rights reserved. &nbsp;|&nbsp; Serving Canada, USA &amp; UK
          </div>
        </div>
      </footer>

      {/* ── Scroll to top ── */}
      <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll to top">
        ▲
      </button>

      {/* ── Booking Modal ── */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <GraduationCap size={18} style={{ display: "inline", marginRight: "0.5rem" }} />
                Book Your Free Trial Lesson
              </h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)} aria-label="Close modal">
                <X size={15} />
              </button>
            </div>

            <div className="modal-body">
              {bookingSuccess ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                  <h3 style={{ color: "var(--teal)", marginBottom: "0.5rem" }}>Enquiry Received!</h3>
                  <p style={{ color: "var(--text-muted)" }}>
                    Thank you! A member of our team will contact you within 24 hours to confirm your free trial session.
                  </p>
                  <button className="btn-enroll" style={{ marginTop: "1.5rem" }} onClick={() => { setIsModalOpen(false); setBookingSuccess(false); }}>
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="parentName">Parent / Guardian Name *</label>
                      <input id="parentName" className="form-control" required placeholder="Your full name" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="studentName">Student Name *</label>
                      <input id="studentName" className="form-control" required placeholder="Student's name" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input id="email" type="email" className="form-control" required placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone / WhatsApp</label>
                      <input id="phone" className="form-control" placeholder="+1 / +44 / +234..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="subject">Subject *</label>
                      <select id="subject" className="form-control" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                        {["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science", "History", "Economics", "Other"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="level">Level / Grade *</label>
                      <select id="level" className="form-control" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                        {["Reception–Year 6", "Year 7–9", "11+ Preparation", "GCSE / National 5", "A-Level / IB / AP", "University", "Other"].map((l) => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="notes">Additional Notes</label>
                    <textarea id="notes" className="form-control" rows={3} placeholder="Tell us about your child's current level, targets, and any specific concerns..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                  </div>
                  <button type="submit" className="btn-submit">
                    🎓 Request My Free Trial Lesson
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden style to show hamburger only on mobile */}
      <style>{`
        .mobile-menu-btn { display: none !important; }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
