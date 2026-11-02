
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Users,
  BadgeCheck,
  ArrowRight,
  HelpCircle,
  MapPin,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

const [formData, setFormData] = useState({
  registrationNumber: "",
  email: "",
  password: "",
});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error: signInError } =
        await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
          rememberMe,
        });

      if (signInError) {
        setError(
          signInError.message ||
            "Sign in failed. Please check your credentials."
        );
        return;
      }

      if (data) {
        router.push("/");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12">

          {/* Left Panel */}
          <div className="md:col-span-5 relative flex flex-col justify-between min-h-[420px] md:min-h-[560px] overflow-hidden">

            <div className="absolute inset-0">
              <Image
                src="/IIUC_CENTRAL_LIBRARY_2.jpg"
                alt="Kumira Permanent Campus"
                fill
                className="object-contain object-top"
                priority
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#061535]/95 via-[#0b2060]/60 to-[#0f2a6d]/25" />
            </div>

            {/* Location */}
            <div className="relative z-10 p-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white text-[11px] font-medium">
                <MapPin className="w-3 h-3 text-blue-300" />
                Kumira Permanent Campus
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 p-6 sm:p-8 space-y-5">
              <div>
                <p className="text-blue-300 text-[11px] font-semibold uppercase tracking-widest mb-1">
                  Academic Heritage
                </p>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Welcome to <br />IIUC Connect
                </h2>

                <p className="text-sm text-blue-100/75 mt-2 leading-relaxed">
                  Bridging students and alumni across the globe.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <Users className="w-4 h-4 text-blue-300" />
                  </div>

                  <p className="text-xl font-extrabold text-white">
                    25,000+
                  </p>

                  <p className="text-[11px] text-blue-200/80">
                    Alumni Worldwide
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  </div>

                  <p className="text-xl font-extrabold text-white">
                    100%
                  </p>

                  <p className="text-[11px] text-blue-200/80">
                    Verified Network
                  </p>
                </div>
              </div>

              {/* Help */}
              <div className="flex items-center justify-between bg-white/10 backdrop-blur border border-white/15 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-white/80" />
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-white">
                      Need Help?
                    </p>

                    <p className="text-[10px] text-blue-200/70">
                      Kumira IT Support Desk
                    </p>
                  </div>
                </div>

                <a
                  href="mailto:support@iiuc.ac.bd"
                  className="text-xs font-semibold text-blue-300 hover:text-white transition-colors"
                >
                  Get Support
                </a>
              </div>
            </div>
          </div>

          {/* Right Panel: Login Form */}
          <div className="md:col-span-7 flex flex-col justify-center p-7 sm:p-10 lg:p-12">

            {/* Secure Badge */}
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-5 self-start">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure Portal Access
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
              Sign In to IIUC Connect
            </h1>

            <p className="text-sm text-slate-500 mb-7">
              Enter your credentials to access your account.
            </p>

            {/* Error */}
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Registration Number */}
<div>
  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
    Registration Number <span className="text-red-500">*</span>
  </label>

  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
      <Building2 className="w-4 h-4" />
    </div>

    <input
      type="text"
      name="registrationNumber"
      value={formData.registrationNumber}
      onChange={handleChange}
      required
      placeholder="Enter your registration number"
      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
    />
  </div>
</div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me + Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 rounded-2xl text-white font-semibold text-sm bg-gradient-to-r from-[#0f2a70] via-[#1d4ed8] to-[#2563eb] shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium flex-shrink-0">
                  OR SIGN IN WITH
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>


              {/* Register */}
              <p className="text-center text-sm text-slate-600 pt-2">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-700 hover:text-blue-900 font-semibold hover:underline transition-colors"
                >
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
