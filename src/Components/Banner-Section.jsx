"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  ShieldCheck,
  ArrowRight,
  Search,
  Zap,
  BookOpen,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Building,
  Users,
  Building2,
  Megaphone,
  GraduationCap,
  Award,
  CheckCircle2,
} from "lucide-react";

export default function BannerSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    // ─────────────── SLIDE 1 ───────────────
    {
      id: 1,
      badge: {
        text: "INTERNATIONAL ISLAMIC UNIVERSITY CHITTAGONG",
        icon: Globe,
        style: "bg-blue-50/80 border-blue-200/60 text-blue-900",
      },
      titleLine1: "One University.",
      titleLine2: "Endless Connections.",
      titleGradient:
        "from-blue-700 via-indigo-600 to-teal-600 bg-clip-text text-transparent",
      description:
        "Bringing IIUC students, distinguished alumni, faculty, and global researchers together to forge impactful relationships, share breakthroughs, and ascend career frontiers.",
      primaryBtn: {
        text: "Explore Community",
        href: "/community",
        icon: ArrowRight,
        style: "bg-[#0d2353] hover:bg-[#153272] text-white shadow-blue-950/20",
      },
      secondaryBtn: {
        text: "Join IIUC Connect",
        href: "/register",
        icon: ShieldCheck,
      },
      socialProofType: "members",
      socialProof: {
        count: "14,200+ Verified Members",
        sub: "Working at Google, AWS, bKash & 42 Countries",
      },
      rightCard: {
        type: "collage",
        mainImage: "/IIUC_CENTRAL_LIBRARY_2.jpg",
        subImageTop: "/alumni-Bt56BcwN.png",
        subImageBottom: "/images 1.jpg",
        floatingTop: {
          icon: Building,
          title: "Alumni at Top Tech",
          sub: "Amazon, Google, ShopUp",
        },
        floatingBottom: {
          text: "180+ Active Mentors Online",
        },
        caption: {
          pill: "Connecting IIUC",
          title: "Empowering 38,000+ Journeys",
          sub: "From Sitakunda Kumira campus to leadership worldwide.",
        },
      },
    },

    // ─────────────── SLIDE 2 ───────────────
    {
      id: 2,
      badge: {
        text: "DIRECT CAREER LADDERS",
        icon: Briefcase,
        style: "bg-teal-50 border-teal-200/80 text-teal-800",
      },
      titleLine1: "Discover Opportunities.",
      titleLine2: "Build Your Future.",
      titleGradient:
        "from-teal-700 via-emerald-600 to-blue-800 bg-clip-text text-transparent",
      description:
        "Unlock verified job referrals, paid internships, overseas research fellowships, and direct scholarship roadmaps shared by seasoned IIUC alumni.",
      primaryBtn: {
        text: "Explore Opportunities",
        href: "/career-hub",
        icon: Zap,
        style: "bg-[#065f46] hover:bg-[#047857] text-white shadow-emerald-950/20",
      },
      secondaryBtn: {
        text: "Browse 240+ Openings",
        href: "/career-hub",
        icon: Search,
      },
      socialProofType: "stats",
      socialProof: {
        stat: "2,450+",
        label: "Jobs & Fellowships Posted",
      },
      rightCard: {
        type: "single",
        mainImage: "/images 1.jpg",
        caption: {
          pill: "Faculty of Engineering",
          title: "Campus Recruitment Pipelines",
          sub: "Direct referrals from senior alumni engineering leads.",
        },
      },
    },

    // ─────────────── SLIDE 3 ───────────────
    {
      id: 3,
      badge: {
        text: "RESEARCH & MENTORSHIP",
        icon: BookOpen,
        style: "bg-indigo-50 border-indigo-200/80 text-indigo-800",
      },
      titleLine1: "Your Experience Can",
      titleLine2: "Inspire a Generation.",
      titleGradient:
        "from-blue-700 via-indigo-600 to-teal-500 bg-clip-text text-transparent",
      description:
        "Publish SCOPUS-indexed research findings, share insights from your doctoral journey, and offer 1-on-1 mentorship to current students navigating tech and science careers.",
      primaryBtn: {
        text: "Share Your Story",
        href: "/register",
        icon: ArrowRight,
        style: "bg-[#0d2353] hover:bg-[#153272] text-white shadow-blue-950/20",
      },
      secondaryBtn: {
        text: "Explore Research Showcase",
        href: "/network",
        icon: FlaskConical,
      },
      socialProofType: "none",
      rightCard: {
        type: "single",
        mainImage: "/IIUC_CENTRAL_LIBRARY_2.jpg",
        caption: {
          pill: "Academic Legacy",
          title: "Central Auditorium & Research Library",
          sub: "Connecting academic tradition with modern global breakthroughs.",
        },
      },
    },
  ];

  // Auto-play interval with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const slide = slides[currentSlide];
  const BadgeIcon = slide.badge.icon;
  const PrimaryIcon = slide.primaryBtn.icon;
  const SecondaryIcon = slide.secondaryBtn.icon;

  // Animation variants
  const slideVariants = {
    enter: (d) => ({
      x: d > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    exit: (d) => ({
      x: d > 0 ? -60 : 60,
      opacity: 0,
      transition: {
        duration: 0.35,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  };

  const itemStagger = {
    hidden: { opacity: 0, y: 18 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.45,
        ease: "easeOut",
      },
    }),
  };

  // ─────────────── ECOSYSTEM CARDS DATA ───────────────
  const ecosystemCards = [
    {
      id: "students",
      icon: GraduationCap,
      iconBg: "bg-blue-50 text-blue-700 border-blue-100",
      title: "Current Students",
      description:
        "Accelerate your university journey toward a competitive career.",
      bullets: [
        "Verified student portfolio",
        "Connect with alumni seniors",
        "Internships & project collabs",
        "Direct 1-on-1 mentorship",
      ],
      linkText: "Student Guide",
      linkHref: "/community",
      linkColor: "text-blue-700 hover:text-blue-900",
    },
    {
      id: "alumni",
      icon: Award,
      iconBg: "bg-teal-50 text-teal-700 border-teal-100",
      title: "Global Alumni",
      description:
        "Reconnect, share authority, and guide your alma mater community.",
      bullets: [
        "Reconnect with batchmates",
        "Post exclusive internal jobs",
        "Mentor talented junior cohorts",
        "City & chapter reunions",
      ],
      linkText: "Alumni Hub",
      linkHref: "/network",
      linkColor: "text-teal-700 hover:text-teal-900",
    },
    {
      id: "faculty",
      icon: BookOpen,
      iconBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
      title: "Faculty & Researchers",
      description:
        "Bridge academic scholarship with worldwide industry execution.",
      bullets: [
        "Share IEEE/SCOPUS papers",
        "Interdepartmental lab synergy",
        "Joint international grants",
        "Publish research pre-prints",
      ],
      linkText: "Research Hub",
      linkHref: "/community",
      linkColor: "text-indigo-700 hover:text-indigo-900",
    },
    {
      id: "employers",
      icon: Building2,
      iconBg: "bg-blue-50 text-blue-900 border-blue-100",
      title: "Employers & Partners",
      description:
        "Source verified, driven engineering, business & scientific minds.",
      bullets: [
        "Post targeted job openings",
        "Campus hackathon partnerships",
        "Fast-track hiring pipelines",
        "Sponsor university research",
      ],
      linkText: "Recruit at IIUC",
      linkHref: "/career-hub",
      linkColor: "text-blue-800 hover:text-blue-950",
    },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* ─────────────────────────────────────────────────────────────
          1. MAIN BANNER SLIDER SECTION
      ───────────────────────────────────────────────────────────── */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full overflow-hidden bg-gradient-to-b from-[#f8fafc] via-white to-[#f1f5f9] pt-8 pb-10 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-18"
      >
        {/* Background ambient lighting */}
        <div className="absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-teal-100/40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={slide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-[520px]"
            >
              {/* ────────────── LEFT CONTENT COLUMN ────────────── */}
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                {/* 1. Top Category Pill Badge */}
                <motion.div
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={itemStagger}
                >
                  <span
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-semibold tracking-wider uppercase shadow-2xs ${slide.badge.style}`}
                  >
                    <BadgeIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{slide.badge.text}</span>
                  </span>
                </motion.div>

                {/* 2. Headline */}
                <motion.div
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={itemStagger}
                >
                  <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                    {slide.titleLine1} <br />
                    <span className={`bg-gradient-to-r ${slide.titleGradient}`}>
                      {slide.titleLine2}
                    </span>
                  </h1>
                </motion.div>

                {/* 3. Description Paragraph */}
                <motion.div
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={itemStagger}
                >
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                    {slide.description}
                  </p>
                </motion.div>

                {/* 4. Action Buttons */}
                <motion.div
                  custom={3}
                  initial="hidden"
                  animate="visible"
                  variants={itemStagger}
                  className="flex flex-wrap items-center gap-3.5 pt-1"
                >
                  <Link
                    href={slide.primaryBtn.href}
                    className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 ${slide.primaryBtn.style}`}
                  >
                    <span>{slide.primaryBtn.text}</span>
                    <PrimaryIcon className="w-4 h-4" />
                  </Link>

                  <Link
                    href={slide.secondaryBtn.href}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-slate-700 bg-white/90 hover:bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm hover:scale-[1.02] active:scale-95 transition-all duration-200"
                  >
                    <SecondaryIcon className="w-4 h-4 text-blue-700" />
                    <span>{slide.secondaryBtn.text}</span>
                  </Link>
                </motion.div>

                {/* 5. Social Proof / Stats Section */}
                <motion.div
                  custom={4}
                  initial="hidden"
                  animate="visible"
                  variants={itemStagger}
                  className="pt-2"
                >
                  {slide.socialProofType === "members" && (
                    <div className="flex items-center gap-3.5">
                      {/* Overlapping Badges: IIU, CSE, EEE */}
                      <div className="flex -space-x-2.5 overflow-hidden">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white bg-[#0d2353] text-white font-bold text-[10px] shadow-xs">
                          IIU
                        </div>
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white bg-[#0f766e] text-white font-bold text-[10px] shadow-xs">
                          CSE
                        </div>
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white bg-[#4338ca] text-white font-bold text-[10px] shadow-xs">
                          EEE
                        </div>
                      </div>
                      {/* Label */}
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                          {slide.socialProof.count}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {slide.socialProof.sub}
                        </span>
                      </div>
                    </div>
                  )}

                  {slide.socialProofType === "stats" && (
                    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-blue-50/80 border border-blue-200/70 shadow-2xs">
                      <span className="text-base font-extrabold text-blue-900">
                        {slide.socialProof.stat}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {slide.socialProof.label}
                      </span>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* ────────────── RIGHT VISUAL CARD COLUMN ────────────── */}
              <div className="lg:col-span-6 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="relative w-full max-w-[560px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/60 border border-slate-200/80 bg-slate-900 group"
                >
                  {/* Collage Layout (Slide 1) */}
                  {slide.rightCard.type === "collage" ? (
                    <div className="grid grid-cols-12 h-full w-full">
                      {/* Main Left Image (60%) */}
                      <div className="col-span-7 relative h-full w-full overflow-hidden">
                        <Image
                          src={slide.rightCard.mainImage}
                          alt="IIUC Campus Central Library"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 1024px) 60vw, 30vw"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      </div>

                      {/* Sub Right Images (40% split into two rows) */}
                      <div className="col-span-5 grid grid-rows-2 h-full gap-0.5 border-l border-white/20">
                        {/* Top Right: Graduates */}
                        <div className="relative h-full w-full overflow-hidden">
                          <Image
                            src={slide.rightCard.subImageTop}
                            alt="IIUC Graduates Ceremony"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 1024px) 40vw, 20vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        {/* Bottom Right: Campus Building */}
                        <div className="relative h-full w-full overflow-hidden border-t border-white/20">
                          <Image
                            src={slide.rightCard.subImageBottom}
                            alt="IIUC Faculty Campus Building"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 1024px) 40vw, 20vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Single Main Image Layout (Slide 2 & Slide 3) */
                    <div className="relative h-full w-full overflow-hidden">
                      <Image
                        src={slide.rightCard.mainImage}
                        alt={slide.rightCard.caption.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    </div>
                  )}

                  {/* Floating Badge: Top-Left (Slide 1) */}
                  {slide.rightCard.floatingTop && (
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg px-3.5 py-2 rounded-2xl flex items-center gap-2.5 max-w-[210px]"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                        <Building className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-bold text-slate-800 leading-tight truncate">
                          {slide.rightCard.floatingTop.title}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate">
                          {slide.rightCard.floatingTop.sub}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Floating Badge: Bottom-Right (Slide 1) */}
                  {slide.rightCard.floatingBottom && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="absolute bottom-20 right-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg px-3 py-1.5 rounded-full flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-bold text-slate-700">
                        {slide.rightCard.floatingBottom.text}
                      </span>
                    </motion.div>
                  )}

                  {/* Bottom Overlay Info Banner on Card (All Slides) */}
                  <div className="absolute bottom-0 inset-x-0 z-10 p-5 sm:p-6 text-white flex flex-col justify-end pointer-events-none">
                    {slide.rightCard.caption.pill && (
                      <span className="inline-block self-start px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-semibold uppercase tracking-wider text-white mb-1.5">
                        {slide.rightCard.caption.pill}
                      </span>
                    )}
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight drop-shadow-sm leading-snug">
                      {slide.rightCard.caption.title}
                    </h3>
                    <p className="text-xs text-white/80 line-clamp-1 mt-0.5 drop-shadow-xs">
                      {slide.rightCard.caption.sub}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ────────────── SLIDER CONTROLS (PAGINATION & ARROWS) ────────────── */}
          <div className="mt-8 sm:mt-10 flex items-center justify-between border-t border-slate-200/60 pt-5">
            {/* Left: Indicator Dots / Pills */}
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentSlide ? 1 : -1);
                    setCurrentSlide(index);
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`transition-all duration-300 rounded-full h-2 cursor-pointer focus:outline-none ${
                    index === currentSlide
                      ? "w-7 bg-blue-900 shadow-xs"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            {/* Right: Previous & Next Circular Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => paginate(-1)}
                aria-label="Previous slide"
                className="w-10 h-10 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 flex items-center justify-center text-slate-700 hover:text-blue-900 shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer focus:outline-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => paginate(1)}
                aria-label="Next slide"
                className="w-10 h-10 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 flex items-center justify-center text-slate-700 hover:text-blue-900 shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer focus:outline-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. STATS BAR & TAILORED ECOSYSTEM SECTION (MATCHING SCREENSHOT)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#fafbfd] border-t border-slate-200/60 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
          {/* ─────── TOP STATS BAR (4 CARDS) ─────── */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {/* Stat 1: Total Students */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50/90 border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                  38,500+
                </span>
                <span className="text-xs font-bold text-slate-800 mt-1">
                  Total Students
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Undergraduates &amp; Postgraduates
                </span>
              </div>
            </div>

            {/* Stat 2: Verified Alumni */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50/90 border border-teal-100 flex items-center justify-center flex-shrink-0 text-teal-700">
                <Globe className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                  14,200+
                </span>
                <span className="text-xs font-bold text-teal-800 mt-1">
                  Verified Alumni
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Across 42 Global Nations
                </span>
              </div>
            </div>

            {/* Stat 3: Academic Faculties */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50/90 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-700">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                  16
                </span>
                <span className="text-xs font-bold text-slate-800 mt-1">
                  Academic Faculties
                </span>
                <span className="text-[11px] text-slate-500 font-medium truncate max-w-[190px]">
                  CSE, EEE, BBA, Shariah, Law, etc.
                </span>
              </div>
            </div>

            {/* Stat 4: Opportunities Shared */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50/90 border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700">
                <Megaphone className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 leading-none">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    2,450+
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-md">
                    +18% YoY
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-800 mt-1">
                  Opportunities Shared
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Jobs, Grants &amp; Fellowships
                </span>
              </div>
            </div>
          </motion.div>

          {/* ─────── TAILORED ECOSYSTEM HEADER ─────── */}
          <div className="text-center max-w-3xl mx-auto space-y-3.5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-[11px] font-bold text-blue-900 tracking-widest uppercase bg-blue-50 border border-blue-200/60 px-3.5 py-1 rounded-full inline-block">
                TAILORED ECOSYSTEM
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight"
            >
              One Community. Multiple <br className="hidden sm:inline" />
              Possibilities.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto"
            >
              Whether you&apos;re currently studying, launching your startup,
              guiding the next batch, or seeking world-class talent, IIUC Connect
              gives you a dedicated space to thrive.
            </motion.p>
          </div>

          {/* ─────── 4 FEATURE CARDS GRID ─────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
            {ecosystemCards.map((card, index) => {
              const CardIcon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Icon Badge */}
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${card.iconBg}`}
                    >
                      <CardIcon className="w-6 h-6" />
                    </div>

                    {/* Card Title */}
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">
                      {card.title}
                    </h3>

                    {/* Card Description */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 min-h-[40px]">
                      {card.description}
                    </p>

                    {/* Bullet Points with Checkmarks */}
                    <ul className="space-y-3 pt-2 border-t border-slate-100">
                      {card.bullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-2.5 text-xs text-slate-700 font-medium"
                        >
                          <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Action Link */}
                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <Link
                      href={card.linkHref}
                      className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-all ${card.linkColor}`}
                    >
                      <span>{card.linkText}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
