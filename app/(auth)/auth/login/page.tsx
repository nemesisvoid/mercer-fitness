"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowLeft, Calendar, Users, Activity, Star, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { signInUser } from "@/actions/auth.action";

export default function LoginPage() {
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await signInUser(email, password);
      if (res.success) {
        router.push("/dashboard"); // Redirect to the admin dashboard on success
      } else {
        setError(res.error || "Invalid email or password");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const floatAnimation = (delay: number) => ({
    animate: {
      y: [-8, 8, -8],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      },
    },
  });

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans">
      {/* LEFT SIDE - HERO IMAGE (Hidden on Mobile) */}
      <div className="relative hidden w-[60%] overflow-hidden lg:block">
        {/* Decorative Blurred Circles */}
        <div className="absolute -left-20 -top-20 z-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 z-0 h-[500px] w-[500px] rounded-full bg-sky-500/20 blur-[120px]" />

        {/* Hero Image */}
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/login-bg.png"
            alt="Mercer Fitness Studio"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-900/20" />
        </motion.div>

        {/* Floating Glassmorphism Cards */}
        <div className="absolute inset-0 z-10 flex flex-col items-start justify-center p-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 max-w-lg"
          >
            <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-sm">
              Manage the Mercer Experience.
            </h1>
            <p className="mt-4 text-lg text-slate-200 drop-shadow-sm">
              The premier platform for studio managers to orchestrate flawless fitness journeys.
            </p>
          </motion.div>

        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="relative flex w-full flex-col items-center justify-center px-4 py-12 lg:w-[40%] sm:px-6 lg:px-8">
        
        {/* Mobile Background Image (Hidden on Desktop) */}
        <div className="absolute inset-0 z-0 block lg:hidden">
          <Image
            src="/login-bg.png"
            alt="Mercer Fitness Studio"
            fill
            className="object-cover opacity-20 blur-xl"
            priority
          />
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="relative z-10 w-full max-w-md rounded-3xl border border-slate-100 bg-white/95 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-sm sm:p-10"
        >
          {/* Logo & Header */}
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <Link href="/" className="group inline-flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                <Activity className="h-5 w-5" />
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight text-slate-950">
                Mercer Fitness
              </span>
            </Link>
          </motion.div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}
            <motion.div variants={fadeUp}>
              <div className="relative">
                <label 
                  htmlFor="email" 
                  className={`pointer-events-none absolute left-10 top-3 z-10 px-1 text-sm transition-all duration-200 ${
                    emailFocus ? '-translate-y-[1.4rem] bg-white text-xs text-emerald-600 opacity-100' : 'text-slate-500 opacity-0'
                  }`}
                >
                  Email Address
                </label>
                <div className={`relative flex items-center rounded-xl border-2 transition-colors duration-200 ${
                  emailFocus ? 'border-emerald-500 bg-white' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
                }`}>
                  <Mail className={`ml-4 h-5 w-5 transition-colors duration-200 ${emailFocus ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder={emailFocus || email ? '' : 'Email address'}
                    className="w-full bg-transparent px-4 py-3.5 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    onFocus={() => setEmailFocus(true)}
                    onBlur={(e) => setEmailFocus(e.target.value !== '')}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="relative">
                <label 
                  htmlFor="password" 
                  className={`pointer-events-none absolute left-10 top-3 z-10 px-1 text-sm transition-all duration-200 ${
                    passwordFocus ? '-translate-y-[1.4rem] bg-white text-xs text-emerald-600 opacity-100' : 'text-slate-500 opacity-0'
                  }`}
                >
                  Password
                </label>
                <div className={`relative flex items-center rounded-xl border-2 transition-colors duration-200 ${
                  passwordFocus ? 'border-emerald-500 bg-white' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
                }`}>
                  <Lock className={`ml-4 h-5 w-5 transition-colors duration-200 ${passwordFocus ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder={passwordFocus || password ? '' : 'Password'}
                    className="w-full bg-transparent px-4 py-3.5 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={(e) => setPasswordFocus(e.target.value !== '')}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2 group">
                <div 
                  className={`flex h-5 w-5 items-center justify-center rounded border transition-all duration-200 ${
                    rememberMe ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-white group-hover:border-emerald-400'
                  }`}
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  {rememberMe && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm font-medium text-slate-600 transition-colors group-hover:text-slate-900">
                  Remember me
                </span>
              </label>
              <Link href="#" className="text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700">
                Forgot password?
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="pt-2">
              <motion.button
                type="submit"
                disabled={isLoading || !email || !password}
                whileHover={isLoading || !email || !password ? {} : { scale: 1.02, y: -2 }}
                whileTap={isLoading || !email || !password ? {} : { scale: 0.98 }}
                className="w-full flex justify-center items-center rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "Sign In"}
              </motion.button>
            </motion.div>
          </form>

          {/* Divider & Footer */}
          <motion.div variants={fadeUp} className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Secure Portal
                </span>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                href="/" 
                className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Website
              </Link>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}