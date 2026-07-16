"use client";

import { Activity, Calendar, Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/schedule", label: "Schedule" },
  { href: "/#locations", label: "Studios" },
  { href: "/auth/login", label: "Login" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Detect scroll for dynamic navbar styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/50 bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link 
          href="/" 
          className="group flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
            <Activity className="h-5 w-5" />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight text-slate-900">
            Mercer<span className="text-emerald-600">Fitness</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 md:flex bg-white/50 border border-slate-200/60 rounded-full px-2 py-1.5 backdrop-blur-sm shadow-sm">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href) && !link.href.startsWith('/#'));
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                  isActive 
                    ? "text-emerald-700 bg-emerald-50/80" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Button 
            onClick={() => router.push('/schedule')}
            className="h-10 px-5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <Calendar className="h-4 w-4 mr-1.5 opacity-80" />
            Book a Class
            <ArrowRight className="h-3.5 w-3.5 ml-1 -mr-1 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 md:hidden outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-95 transition-transform"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full border-b border-slate-200 bg-white/95 px-4 py-6 shadow-xl backdrop-blur-md md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="flex items-center rounded-xl px-4 py-3 font-heading text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors" 
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px w-full bg-slate-100" />
            <Link 
              href="/auth" 
              className="flex items-center rounded-xl px-4 py-3 font-heading text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
              onClick={() => setOpen(false)}
            >
              Log in
            </Link>
            <Button 
              className="mt-2 w-full justify-center rounded-xl"
              onClick={() => {
                setOpen(false);
                router.push('/schedule');
              }}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book a Class
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
