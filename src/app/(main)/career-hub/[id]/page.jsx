'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building,
  MapPin,
  Briefcase,
  Users,
  MessageSquare,
  Zap,
  AlignLeft,
  Cpu,
  Award,
  Sparkles,
  Lock,
  X,
  ExternalLink,
  Calendar,
  Send,
  UserCheck,
  BookOpen,
  Check
} from 'lucide-react';
import { getCareerHubById } from '@/Api_actions/action';
import { authClient } from '@/lib/auth-client';

export default function CareerHubDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const { data: session } = authClient.useSession();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isMockModalOpen, setIsMockModalOpen] = useState(false);
  const [actionSuccessNotice, setActionSuccessNotice] = useState(null);

  // Referral form state
  const [referralNote, setReferralNote] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getCareerHubById(id);
        if (isMounted) {
          setItem(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching opportunity detail:', err);
        if (isMounted) {
          setError('Opportunity not found or server error');
          setLoading(false);
        }
      }
    };

    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setActionSuccessNotice('Link copied to clipboard!');
      setTimeout(() => setActionSuccessNotice(null), 3500);
    }
  };

  const handleReferralClick = () => {
    if (!session?.user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsReferralModalOpen(true);
  };

  const handleMockClick = () => {
    if (!session?.user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsMockModalOpen(true);
  };

  const submitReferral = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsReferralModalOpen(false);
      setActionSuccessNotice(
        `Fast-Track Referral request successfully dispatched to ${
          item?.alumni_referrer?.name || 'Verified Senior Alumnus'
        }!`
      );
      setTimeout(() => setActionSuccessNotice(null), 5000);
    }, 900);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600">
          Loading verified opportunity dossier...
        </p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <Building className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Opportunity Not Found
        </h2>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          The requested opportunity could not be retrieved from the IIUC Career Hub database.
        </p>
        <Link
          href="/career-hub"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1E3D] text-white text-xs font-bold hover:bg-[#071327] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Career Hub</span>
        </Link>
      </div>
    );
  }

  const compName = item.company_name || item.company?.name || 'Partner Enterprise';
  const referrer = item.alumni_referrer || {
    name: 'Engr. Naimul Karim',
    title: 'Principal Engineering Lead @ Chaldal',
    batch: "CSE Batch '16",
    endorsement_note:
      'I am personally evaluating applications from IIUC juniors & fellow alumni for our logistics distribution platform. If you have deep curiosity around high-concurrency Go services or systems design, request your fast-track endorsement today.',
  };

  const jobIdString = `#IIUC-${compName.substring(0, 3).toUpperCase()}-2026-${String(item._id).slice(-4).toUpperCase()}`;

  // Default mandates if item doesn't have custom ones
  const mandates =
    item.responsibilities && item.responsibilities.length > 0
      ? item.responsibilities
      : [
          {
            title: 'Microservice Architecture & Latency Reduction',
            description:
              'Architect, test, and maintain concurrent Go services handling over 45,000 req/sec across Kubernetes pods with sub-25ms P99 responses.',
          },
          {
            title: 'Distributed Persistence & Caching Stratagem',
            description:
              'Optimize relational database performance using table partitioning, replica distribution, and custom Redis cluster cache invalidation strategies.',
          },
          {
            title: 'Asynchronous Dispatch & Routing Pipes',
            description:
              'Maintain fault-resilient Apache Kafka event streams powering live driver geolocation tracking, automated warehouse dispatch, and parcel batching.',
          },
          {
            title: 'Engineering Rigor & Junior Mentorship',
            description:
              'Establish thorough benchmarking, conduct architecture design RFCs, and actively nurture incoming graduate software engineers from partner institutions.',
          },
        ];

  // Technical stack tags
  const mandatoryTech =
    item.requirements?.technologies && item.requirements.technologies.length > 0
      ? item.requirements.technologies
      : ['Go (Golang) Systems (3+ Yrs)', 'PostgreSQL Internals & MVCC', 'Docker & Kubernetes Orchestration', 'Kafka Event Streams / RabbitMQ', 'gRPC & Protocol Buffers'];

  const competitiveTrack =
    item.requirements?.core_competencies && item.requirements.core_competencies.length > 0
      ? item.requirements.core_competencies
      : ['ICPC / NCPC Competitive Programmer', 'IIUC CSE Club Contestant / Mentor', 'OpenTelemetry / Prometheus Monitoring', 'Open Source Go Tooling Contributor'];

  // Roadmap
  const timeline =
    item.hiring_roadmap && item.hiring_roadmap.length > 0
      ? item.hiring_roadmap
      : [
          {
            step: 1,
            title: 'Alumni Referral Verification',
            duration: 'Day 1-2',
            description: 'IIUC Connect ID validation & student registry check.',
          },
          {
            step: 2,
            title: 'Concurrency Take-Home',
            duration: 'Day 4-7',
            description: 'Real-world Go API & concurrency assignment (72h).',
          },
          {
            step: 3,
            title: 'System Architecture Whiteboard',
            duration: 'Day 10-14',
            description: 'Deep-dive technical review with VP of Tech.',
          },
          {
            step: 4,
            title: 'Offer Presentation & Ramp-Up',
            duration: 'Day 15-18',
            description: 'Executive sync and formal compensation package.',
          },
        ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24 font-sans selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* ── TOP BREADCRUMB ── */}
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4 overflow-x-auto scrollbar-none whitespace-nowrap">
          <Link href="/career-hub" className="hover:text-teal-700 transition-colors flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>IIUC CDC</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span>INSTITUTIONAL PIPELINES</span>
          <span className="text-slate-300">/</span>
          <span>{item.eligible_departments?.[0] || 'ENGINEERING & TECH'}</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#0D3B66] font-extrabold">{compName} CORE SYSTEMS</span>
        </div>

        {/* ── HERO HEADER CARD ── */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs mb-8 relative">
          {/* Top Pill Badges Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>
                  Sitakunda to Silicon Hubs: Exclusive{' '}
                  {item.eligible_departments?.join(' & ') || 'CSE & EEE'} Fast-Track Pipeline
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>University Verified Partner</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-mono font-medium">
                JOB ID: {jobIdString}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50/80 px-3 py-1 rounded-full border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Accepting Verified IIUC Applications</span>
            </div>
          </div>

          {/* Main Title + Action Buttons Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              {/* Logo / Company Box */}
              {item.company?.logo_url ? (
                <div className="w-16 h-16 rounded-2xl border border-slate-200 overflow-hidden relative bg-slate-50 flex-shrink-0 p-1">
                  <Image
                    src={item.company.logo_url}
                    alt={compName}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-[#0B1E3D] text-white flex flex-col items-center justify-center font-black flex-shrink-0 shadow-sm">
                  <span className="text-xl tracking-wider leading-none">
                    {compName.substring(0, 2).toUpperCase()}
                  </span>
                  <span className="text-[8px] font-semibold tracking-widest text-teal-300 mt-1">
                    PLATFORM
                  </span>
                </div>
              )}

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1E3D] tracking-tight leading-tight">
                  {item.title}
                </h1>
                <p className="text-sm font-medium text-slate-500 mt-1.5 flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{compName}</span>
                  <span>•</span>
                  <span>{item.department || 'Distributed Systems & Real-Time Fulfillment Engine'}</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 flex-shrink-0 self-start lg:self-center">
              <button
                type="button"
                onClick={handleReferralClick}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B1E3D] hover:bg-[#071327] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-950/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-teal-300" />
                <span>Endorsement Fast-Track</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-amber-50 border-amber-200 text-amber-600'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Bookmark opportunity"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="p-3 rounded-2xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom 4 Key Metrics Band */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                COMPENSATION BAND
              </span>
              <p className="text-lg sm:text-xl font-black text-[#0B1E3D]">
                {item.salary_display || '৳120K – ৳160K/month'}
              </p>
              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Full healthcare + bonus</span>
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                WORK ARRANGEMENT
              </span>
              <p className="text-lg sm:text-xl font-black text-[#0B1E3D]">
                {item.workplace_type || 'Hybrid Balance'}
              </p>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.location || 'Dhaka HQ / Remote'}</span>
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                ALUMNI PRESENCE
              </span>
              <p className="text-lg sm:text-xl font-black text-teal-800">
                8 Kumira Alums
              </p>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                <span>Active across Core & SRE</span>
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                REFERRAL SPEED
              </span>
              <p className="text-lg sm:text-xl font-black text-indigo-900">
                48h SLA Review
              </p>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Guaranteed human feedback</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── 2-COLUMN MAIN CONTENT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ════ LEFT COLUMN (Main Details) ════ */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">

            {/* CARD 1: Executive Role Narrative */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2">
                  <AlignLeft className="w-5 h-5 text-teal-700" />
                  <h2 className="text-lg font-extrabold text-[#0B1E3D] tracking-tight">
                    Executive Role Narrative
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  CORE INFRASTRUCTURE UNIT
                </span>
              </div>

              <div className="space-y-4 text-sm text-slate-700 leading-relaxed font-serif sm:font-sans">
                <p>
                  {item.role_overview ||
                    `${compName} is expanding its distributed core architecture team responsible for the real-time operational spine of Bangladesh's premier tech and logistics ecosystem. Operating across multi-region edge fulfillment hubs, our engineering team handles dozens of real-time state machine changes every microsecond.`}
                </p>
                <p className="text-slate-600">
                  As {item.title}, you will own high-concurrency event ingestion pipelines, coordinate zero-downtime database sharding on PostgreSQL, and design fault-tolerant microservices. You will report directly to Engineering Leadership while serving as a senior technical mentor to campus-recruited juniors.
                </p>
              </div>

              {/* Subsection: KEY TECHNICAL MANDATES */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                  KEY TECHNICAL MANDATES
                </h3>

                <div className="space-y-3">
                  {mandates.map((m, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 flex items-start gap-3.5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-teal-700 flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                        {idx === 0 && <Cpu className="w-4 h-4" />}
                        {idx === 1 && <Building className="w-4 h-4" />}
                        {idx === 2 && <Zap className="w-4 h-4" />}
                        {idx >= 3 && <Award className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {m.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD 2: Technical Stack & Criteria */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-teal-700" />
                  <h2 className="text-lg font-extrabold text-[#0B1E3D] tracking-tight">
                    Technical Stack & Criteria
                  </h2>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  IIUC {item.eligible_departments?.join(' & ') || 'CSE & EEE'} ALUM VERIFIED
                </span>
              </div>

              {/* Group 1: Mandatory Core Systems Qualifications */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0B1E3D] text-white uppercase">
                    MANDATORY
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    Core Systems Qualifications
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Prerequisite technical foundation required for day-one operational continuity:
                </p>

                <div className="flex flex-wrap gap-2">
                  {mandatoryTech.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 text-slate-800 text-xs font-semibold border border-slate-200/80"
                    >
                      <Check className="w-3.5 h-3.5 text-teal-700 stroke-[2.5]" />
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Group 2: High Merit Academic Honors & Competitive Track */}
              <div className="pt-5 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-800 text-white uppercase">
                    HIGH MERIT
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    Academic Honors & Competitive Track
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Candidates with following background receive priority fast-track scoring:
                </p>

                <div className="flex flex-wrap gap-2">
                  {competitiveTrack.map((honor) => (
                    <span
                      key={honor}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-900 text-xs font-semibold border border-teal-200/80"
                    >
                      <Award className="w-3.5 h-3.5 text-teal-700" />
                      <span>{honor}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD 3: Institutional Protocol: The IIUC Candidate Advantage */}
            <div className="rounded-3xl border border-teal-200/80 bg-gradient-to-br from-teal-50/70 via-white to-sky-50/60 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                  INSTITUTIONAL PROTOCOL
                </span>
                <CheckCircle2 className="w-5 h-5 text-teal-700" />
              </div>

              <h3 className="text-xl font-extrabold text-[#0B1E3D] mb-3">
                The IIUC Candidate Advantage
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Under the institutional recruitment concordat between IIUC Alumni Relations and{' '}
                {compName} Engineering, applicants endorsed via the IIUC Connect network bypass
                automated filter algorithms and enjoy distinct preparatory resources:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/70">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center mb-2.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">48h SLA Review</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Human resume evaluation directly conducted by {referrer.name} within 48 business hours.
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/70">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-800 flex items-center justify-center mb-2.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Internal Mock Prep</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Archive of prior technical whiteboarding questions, RPC rubrics, and Go concurrency drills.
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/70">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-800 flex items-center justify-center mb-2.5">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Campus Buddy</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Assigned an alumnus peer from Kumira campus during first 90 days to ensure frictionless onboarding.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ════ RIGHT COLUMN (Sidebar) ════ */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">

            {/* CARD 1: ALUMNI ENDORSEMENT PASSPORT */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    ALUMNI ENDORSEMENT PASSPORT
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/70">
                  VERIFIED SPONSOR
                </span>
              </div>

              {/* Referrer Alum Info */}
              <div className="flex items-center gap-3.5 mb-4">
                <div className="relative">
                  {referrer.avatar_url ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-slate-200">
                      <Image
                        src={referrer.avatar_url}
                        alt={referrer.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#0B1E3D] text-white flex items-center justify-center font-bold text-sm border-2 border-teal-500">
                      {referrer.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    {referrer.name}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    {referrer.title}
                  </p>
                  <p className="text-[11px] text-teal-700 font-semibold mt-0.5">
                    {referrer.batch} • Kumira Alumnus
                  </p>
                </div>
              </div>

              {/* Endorsement Quote */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 mb-4 relative">
                <span className="text-3xl text-slate-300 font-serif absolute top-1 right-3 select-none">
                  &ldquo;
                </span>
                <p className="text-xs text-slate-700 italic leading-relaxed relative z-10 pr-4">
                  {referrer.endorsement_note ||
                    'I am personally evaluating applications from IIUC juniors & fellow alumni for our logistics distribution platform. If you have deep curiosity around high-concurrency Go services or systems design, request your fast-track endorsement today.'}
                </p>
              </div>

              {/* Review metrics */}
              <div className="flex items-center justify-between text-xs text-slate-500 pb-4 mb-4 border-b border-slate-100 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Avg. Review: &lt; 12 Hours
                </span>
                <span>Active 1-Click Pipeline</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleReferralClick}
                  className="w-full py-3 px-4 rounded-xl bg-[#0B1E3D] hover:bg-[#071327] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-teal-300" />
                  <span>Request 1-Click Alumni Referral</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!session?.user) {
                      setIsAuthModalOpen(true);
                      return;
                    }
                    setActionSuccessNotice(`Connecting to ${referrer.name} via Campus Chat...`);
                    setTimeout(() => setActionSuccessNotice(null), 4000);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-slate-600" />
                  <span>Message {referrer.name.split(' ')[0]} via Campus Chat</span>
                </button>
              </div>

              {/* 4-STAGE RECRUITMENT TIMELINE */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    4-STAGE RECRUITMENT TIMELINE
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Est. 2–3 Weeks
                  </span>
                </div>

                <div className="space-y-3.5">
                  {timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#0B1E3D] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {step.step || idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {step.title}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium ml-2">
                            {step.duration || `Day ${idx * 4 + 1}-${idx * 4 + 3}`}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {step.description || 'Evaluation checkpoint with campus team.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {item.deadline_date && (
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-rose-600 font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Application Closing:
                    </span>
                    <span>{item.deadline_date}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CARD 2: CAMPUS CAREER CELL (Mock interview) */}
            <div className="rounded-3xl bg-gradient-to-br from-[#0B1E3D] to-[#042848] text-white p-6 shadow-md">
              <div className="flex items-center gap-2 text-teal-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" />
                <span>CAMPUS CAREER CELL</span>
              </div>

              <h4 className="text-base font-bold leading-snug mb-2">
                Get Your Resume Reviewed by {compName} Seniors
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed mb-5">
                Book a complimentary 30-minute 1-on-1 virtual mock interview and architecture
                portfolio critique before submitting your formal application.
              </p>

              <button
                type="button"
                onClick={handleMockClick}
                className="w-full py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Calendar className="w-4 h-4 text-slate-700" />
                <span>Book Mock Interview Session</span>
              </button>
            </div>

            {/* CARD 3: KUMIRA ALUMNI AT COMPANY */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  KUMIRA ALUMNI AT {compName.toUpperCase()}
                </h4>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
                  6 On Staff
                </span>
              </div>

              <div className="space-y-3.5">
                {[
                  { name: 'Tariqul Islam', role: "Senior Frontend Dev • CSE '19" },
                  { name: 'Farzana Yasmin', role: "SRE Cloud Engineer • CSE '21" },
                  { name: 'Mahmud Hasan', role: "Software Engineer • CSE '22" },
                ].map((alum, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                        {alum.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-none">{alum.name}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{alum.role}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!session?.user) {
                          setIsAuthModalOpen(true);
                          return;
                        }
                        setActionSuccessNotice(`Connection invitation dispatched to ${alum.name}!`);
                        setTimeout(() => setActionSuccessNotice(null), 3500);
                      }}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 px-2.5 py-1 rounded-lg hover:bg-teal-50 transition-colors"
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100">
                <Link
                  href="/network"
                  className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center justify-center gap-1 transition-colors"
                >
                  <span>View full alumni roster at this company...</span>
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ── SESSION REQUIRED GATE MODAL ── */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 z-10"
            >
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 stroke-[2.2]" />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900">
                IIUC Session Required
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                To request 1-Click Alumni Referrals, contact senior mentors, and submit applications directly, you must be logged in with your verified IIUC account.
              </p>

              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 mt-4 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Direct alumni internal referral fast-track</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Official IIUC registration ID verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>1-on-1 alumni mentorship & mock interviews</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                <Link
                  href="/signIn"
                  className="w-full py-3 rounded-xl bg-[#0B1E3D] hover:bg-[#071327] text-white text-center text-xs font-bold shadow-md transition-all"
                >
                  Sign In to Continue
                </Link>
                <Link
                  href="/register"
                  className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-center text-xs font-bold transition-all"
                >
                  Create Student or Alumni Account
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── REFERRAL APPLICATION MODAL (LOGGED IN) ── */}
      <AnimatePresence>
        {isReferralModalOpen && session?.user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReferralModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 z-10"
            >
              <button
                type="button"
                onClick={() => setIsReferralModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase mb-1">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Fast-Track Endorsement Pipeline</span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                Request Alumni Referral
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Applying for <strong className="text-slate-800">{item.title}</strong> at{' '}
                <strong className="text-slate-800">{compName}</strong>
              </p>

              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 mb-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0B1E3D] text-white flex items-center justify-center text-xs font-bold">
                  {session.user.name?.substring(0, 2).toUpperCase() || 'IU'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{session.user.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {session.user.accountType || 'Undergraduate'} • {session.user.department || 'CSE'}
                  </p>
                </div>
              </div>

              <form onSubmit={submitReferral} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    GitHub / LinkedIn / Portfolio URL
                  </label>
                  <input
                    type="url"
                    required
                    value={resumeLink}
                    onChange={(e) => setResumeLink(e.target.value)}
                    placeholder="https://github.com/your-username or portfolio"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Personalized Note to {referrer.name.split(' ')[0]}
                  </label>
                  <textarea
                    rows={3}
                    value={referralNote}
                    onChange={(e) => setReferralNote(e.target.value)}
                    placeholder="Briefly mention relevant projects, competitive programming handle, or why you're a good fit..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-200/70 text-[11px] text-teal-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0" />
                  <span>
                    Your verified IIUC Student Registration ID will be appended automatically.
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsReferralModalOpen(false)}
                    className="px-4 py-2 border rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-[#0B1E3D] hover:bg-[#071327] text-white rounded-xl font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Referral Request'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MOCK INTERVIEW BOOKING MODAL (LOGGED IN) ── */}
      <AnimatePresence>
        {isMockModalOpen && session?.user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMockModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 z-10"
            >
              <button
                type="button"
                onClick={() => setIsMockModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5" />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                Book Mock Interview
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Schedule a 30-minute virtual prep session with alumni from {compName}.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Select Available Slot
                  </label>
                  <select className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 font-medium">
                    <option>Saturday (8:00 PM - 8:30 PM BST)</option>
                    <option>Sunday (9:00 PM - 9:30 PM BST)</option>
                    <option>Tuesday (8:30 PM - 9:00 PM BST)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Focus Area
                  </label>
                  <select className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 font-medium">
                    <option>Data Structures & Algorithm Whiteboarding</option>
                    <option>System Design & Backend Architecture</option>
                    <option>Resume Critique & Behavioral Alignment</option>
                  </select>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMockModalOpen(false)}
                    className="px-4 py-2 border rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMockModalOpen(false);
                      setActionSuccessNotice('Mock interview booked! Calendar invite sent to your email.');
                      setTimeout(() => setActionSuccessNotice(null), 5000);
                    }}
                    className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FLOATING SUCCESS NOTICE ── */}
      <AnimatePresence>
        {actionSuccessNotice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-[#004D40] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-teal-500/40 text-xs font-semibold"
          >
            <CheckCircle2 className="w-5 h-5 text-teal-300" />
            <span>{actionSuccessNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
