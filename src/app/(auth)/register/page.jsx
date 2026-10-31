"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Camera,
  GraduationCap,
  BookOpen,
  Briefcase,
  Building2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  ShieldCheck,
  Users,
  Award,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  const [role, setRole] = useState("Graduate");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      avatarUrl: "",
      department: "",
      graduationYear: "",
      batch: "",
      currentSemester: "",
      designation: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
    mode: "onChange",
  });

  const passwordValue = watch("password", "");

  // Password validation rules according to prompt:
  // 1. Must have an uppercase letter
  // 2. Must have a lowercase letter
  // 3. Length must be at least 6 characters
  const hasMinLength = passwordValue.length >= 6;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);

  const onSubmit = async (data) => {
    // Combine selected role with form data
    const payload = {
      ...data,
      role,
    };
    console.log("Registration Payload:", payload);

    // Simulate network API submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSuccess(true);
    reset();
  };

  const departments = [
    "Computer Science & Engineering (CSE)",
    "Electrical & Electronic Engineering (EEE)",
    "Electronic & Telecommunication Engineering (ETE)",
    "Civil Engineering (CE)",
    "Pharmacy",
    "Business Administration (BBA)",
    "Economics & Banking",
    "English Language & Literature (ELL)",
    "Law",
    "Quranic Sciences & Islamic Studies (QSIS)",
    "Da'wah & Islamic Studies (DIS)",
    "Shari'ah & Islamic Studies",
  ];

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 32 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-[#f3f6fa] text-slate-800 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Bar Navigation */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between mb-4 sm:mb-6 text-xs sm:text-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:text-blue-900 transition-colors py-1 px-2 rounded-lg hover:bg-slate-200/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full font-medium shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official IIUC Portal Access</span>
          </div>
          <a
            href="mailto:support@iiuc.ac.bd"
            className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-900 font-medium transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Need Help?</span>
          </a>
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Visual Hero Banner (Matching Reference Image) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0c235c] via-[#0b286d] to-[#071941] p-6 sm:p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow effect */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-medium tracking-wide uppercase text-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              International Islamic University Chittagong
            </div>

            {/* Headline & Subtitle */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
                Join the Global <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-sky-100 to-white">
                  IIUC Community
                </span>
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-blue-100/80 leading-relaxed font-light">
                Step into an empowered ecosystem uniting visionary undergraduates,
                distinguished alumni, and pioneering faculty across the globe.
              </p>
            </div>

            {/* Image Showcase Card */}
            <div className="rounded-2xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-md p-2 shadow-lg">
              <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden aspect-[16/9] relative">
                <div className="relative h-full w-full">
                  <Image
                    src="/IIUC_CENTRAL_LIBRARY_2.jpg"
                    alt="IIUC Campus Central Library"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="relative h-full w-full">
                  <Image
                    src="/alumni-Bt56BcwN.png"
                    alt="IIUC Alumni Graduates"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
              <div className="mt-2.5 px-2 pb-1 flex items-center justify-between text-[11px] text-blue-200/90 font-medium">
                <span>Sitakunda Campus &amp; Worldwide Hubs</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Connected
                </span>
              </div>
            </div>

            {/* Value Proposition List */}
            <div className="space-y-4 pt-2">
              {/* Feature 1 */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0 text-blue-300">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-semibold text-white">
                    14,200+ Verified Alumni
                  </h2>
                  <p className="text-[11px] text-blue-200/70 leading-snug">
                    Expanding across 42 countries in premier tech companies, academia, and global enterprises.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0 text-blue-300">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-semibold text-white">
                    Career Referrals &amp; Mentorship
                  </h2>
                  <p className="text-[11px] text-blue-200/70 leading-snug">
                    Direct pipeline for internships, thesis co-supervision, competitive mock interviews, and research grants.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0 text-blue-300">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-semibold text-white">
                    Lifelong Academic Affiliation
                  </h2>
                  <p className="text-[11px] text-blue-200/70 leading-snug">
                    Official digitized profile linked directly to your department and verified graduation credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Left Footer: Campus Info */}
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-blue-200/75 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20">
                <Image
                  src="/images.jpg"
                  alt="Kumira Campus"
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <div>
                <p className="font-medium text-white text-[11px]">Kumira Permanent Campus</p>
                <p className="text-[10px] text-blue-200/60">Chattogram, Bangladesh</p>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-blue-300/80" />
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Logo Aligned Center On Top (User Requirement) */}
            <div className="flex flex-col items-center justify-center text-center mb-6">
              <Link href="/" className="group inline-flex flex-col items-center">
                <Image
                  src="/official_logo.png"
                  alt="IIUC Connect Official Logo"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                  priority
                />
                <span className="text-xl font-bold tracking-tight text-blue-900 mt-1">
                  IIUC Connect
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Alumni &amp; Student Network
                </span>
              </Link>
            </div>

            {/* Form Header with Login Link */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-100 pb-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Create Your Account
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Enter your academic credentials to connect with peers, seniors, and faculties.
                </p>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 flex-shrink-0">
                Already a member?{" "}
                <Link
                  href="/login"
                  className="text-blue-700 hover:text-blue-900 font-semibold hover:underline"
                >
                  Login
                </Link>
              </div>
            </div>

            {/* Success Message Banner */}
            {isSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-900">Registration Successful!</p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Your account has been submitted for university verification. You can now login.
                  </p>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Minhazul Alam"
                    {...register("fullName", {
                      required: "Full Name is required",
                      minLength: { value: 3, message: "Name must be at least 3 characters" },
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all ${errors.fullName ? "border-red-400 bg-red-50/20" : "border-slate-200"
                      }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    University / Personal Email <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Domain verification prioritized
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    {...register("email", {
                      required: "Email address is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all ${errors.email ? "border-red-400 bg-red-50/20" : "border-slate-200"
                      }`}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  University domain (@iiuc.ac.bd) or primary personal email.
                </p>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Profile Picture / Avatar URL */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Profile Picture / Avatar URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Camera className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    {...register("avatarUrl")}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Provide a publicly accessible URL for your profile picture, or update later.
                </p>
              </div>

              {/* Institutional Role Selector (Selectable Cards) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Institutional Role <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Graduate (Alumni) */}
                  <button
                    type="button"
                    onClick={() => setRole("Graduate")}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${role === "Graduate"
                        ? "border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-600 text-blue-900"
                        : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 text-slate-600"
                      }`}
                  >
                    <GraduationCap className={`w-5 h-5 mb-1 ${role === "Graduate" ? "text-blue-700" : "text-slate-500"}`} />
                    <span className="text-xs font-bold leading-tight">Graduate</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Alumni</span>
                  </button>

                  {/* Undergraduate (Current Student) */}
                  <button
                    type="button"
                    onClick={() => setRole("Undergraduate")}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${role === "Undergraduate"
                        ? "border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-600 text-blue-900"
                        : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 text-slate-600"
                      }`}
                  >
                    <BookOpen className={`w-5 h-5 mb-1 ${role === "Undergraduate" ? "text-blue-700" : "text-slate-500"}`} />
                    <span className="text-xs font-bold leading-tight">Undergraduate</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Current Student</span>
                  </button>

                  {/* Faculty (Academic Staff) */}
                  <button
                    type="button"
                    onClick={() => setRole("Faculty")}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${role === "Faculty"
                        ? "border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-600 text-blue-900"
                        : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 text-slate-600"
                      }`}
                  >
                    <Briefcase className={`w-5 h-5 mb-1 ${role === "Faculty" ? "text-blue-700" : "text-slate-500"}`} />
                    <span className="text-xs font-bold leading-tight">Faculty</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Academic Staff</span>
                  </button>
                </div>
              </div>

              {/* CONDITIONAL SECTION 1: Graduate Selected -> Graduation Year & Batch */}
              {role === "Graduate" && (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/70 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
                  {/* Graduation Year */}
                  <div>
                    <label className="block text-xs font-semibold text-blue-950 mb-1.5">
                      Graduation Year <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <select
                        {...register("graduationYear", {
                          required: role === "Graduate" ? "Graduation Year is required" : false,
                        })}
                        className="w-full pl-9 pr-8 py-2.5 bg-white border border-blue-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 appearance-none transition-all cursor-pointer"
                      >
                        <option value="">Select Passing Year</option>
                        {graduationYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.graduationYear && (
                      <p className="text-xs text-red-500 mt-1 font-medium">
                        {errors.graduationYear.message}
                      </p>
                    )}
                  </div>

                  {/* Batch */}
                  <div>
                    <label className="block text-xs font-semibold text-blue-950 mb-1.5">
                      Batch / Session <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                        <Layers className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. 45th Batch / Autumn 2018"
                        {...register("batch", {
                          required: role === "Graduate" ? "Batch is required" : false,
                        })}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-blue-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                      />
                    </div>
                    {errors.batch && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.batch.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* CONDITIONAL SECTION 2: Undergraduate Selected -> Current Semester */}
              {role === "Undergraduate" && (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/70 animate-in fade-in duration-200">
                  <label className="block text-xs font-semibold text-blue-950 mb-1.5">
                    Current Semester <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <select
                      {...register("currentSemester", {
                        required: role === "Undergraduate" ? "Current semester is required" : false,
                      })}
                      className="w-full pl-10 pr-8 py-2.5 bg-white border border-blue-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 appearance-none transition-all cursor-pointer"
                    >
                      <option value="">Select your current semester</option>
                      <option value="1st Semester">1st Semester (Freshman)</option>
                      <option value="2nd Semester">2nd Semester</option>
                      <option value="3rd Semester">3rd Semester (Sophomore)</option>
                      <option value="4th Semester">4th Semester</option>
                      <option value="5th Semester">5th Semester (Junior)</option>
                      <option value="6th Semester">6th Semester</option>
                      <option value="7th Semester">7th Semester (Senior)</option>
                      <option value="8th Semester">8th Semester (Final Year)</option>
                      <option value="Internship / Thesis">Internship / Thesis Phase</option>
                    </select>
                  </div>
                  {errors.currentSemester && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {errors.currentSemester.message}
                    </p>
                  )}
                </div>
              )}

              {/* CONDITIONAL SECTION 3: Faculty Selected -> Academic Designation */}
              {role === "Faculty" && (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/70 animate-in fade-in duration-200">
                  <label className="block text-xs font-semibold text-blue-950 mb-1.5">
                    Academic Designation <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <select
                      {...register("designation", {
                        required: role === "Faculty" ? "Academic designation is required" : false,
                      })}
                      className="w-full pl-10 pr-8 py-2.5 bg-white border border-blue-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 appearance-none transition-all cursor-pointer"
                    >
                      <option value="">Select academic designation</option>
                      <option value="Professor">Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Lecturer">Lecturer</option>
                      <option value="Adjunct Faculty">Adjunct Faculty</option>
                    </select>
                  </div>
                  {errors.designation && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {errors.designation.message}
                    </p>
                  )}
                </div>
              )}

              {/* Department / Program Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Department / Program <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <select
                    {...register("department", {
                      required: "Department is required",
                    })}
                    className={`w-full pl-10 pr-8 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 appearance-none transition-all cursor-pointer ${errors.department ? "border-red-400 bg-red-50/20" : "border-slate-200"
                      }`}
                  >
                    <option value="">Select your department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.department && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.department.message}</p>
                )}
              </div>

              {/* Password & Confirm Password (Grid Layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                        validate: {
                          hasUppercase: (v) =>
                            /[A-Z]/.test(v) || "Must contain at least 1 uppercase letter",
                          hasLowercase: (v) =>
                            /[a-z]/.test(v) || "Must contain at least 1 lowercase letter",
                        },
                      })}
                      className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all ${errors.password ? "border-red-400 bg-red-50/20" : "border-slate-200"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (val) => val === passwordValue || "Passwords do not match",
                      })}
                      className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all ${errors.confirmPassword ? "border-red-400 bg-red-50/20" : "border-slate-200"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Validation Indicator Chips (Matching Reference Image) */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                {/* 6+ Characters */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors ${hasMinLength
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-medium"
                      : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}
                >
                  {hasMinLength ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span>6+ Characters</span>
                </div>

                {/* 1+ Uppercase */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors ${hasUppercase
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-medium"
                      : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}
                >
                  {hasUppercase ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span>1+ Uppercase</span>
                </div>

                {/* 1+ Lowercase */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors ${hasLowercase
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-medium"
                      : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}
                >
                  {hasLowercase ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span>1+ Lowercase</span>
                </div>
              </div>

              {/* Terms of Service Checkbox */}
              <div>
                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register("agreeTerms", {
                      required: "You must agree to the guidelines and terms of service",
                    })}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                  />
                  <span>
                    I agree to the{" "}
                    <span className="font-semibold text-slate-900 hover:underline">
                      IIUC Alumni Community Guidelines
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-slate-900 hover:underline">
                      Terms of Service
                    </span>
                    .
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.agreeTerms.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-2xl text-white font-semibold text-sm bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Registration...</span>
                  </>
                ) : (
                  <>
                    <span>Join Community &amp; Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Institutional Verification Notice Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5 text-emerald-900 text-xs leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p>
                  <strong className="font-semibold">Institutional Verification:</strong> An
                  authenticated university crest will be automatically attached to your profile upon
                  validation against registered student/alumni academic records.
                </p>
              </div>
            </form>
          </div>

          {/* Form Bottom Security Footer */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" /> 256-Bit SSL Encrypted
              </span>
              <span className="inline-flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" /> Official University Server
              </span>
            </div>
            <a
              href="mailto:support@iiuc.ac.bd"
              className="text-slate-500 hover:text-blue-900 transition-colors"
            >
              Questions? Contact support@iiuc.ac.bd
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
