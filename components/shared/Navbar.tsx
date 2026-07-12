"use client";

import { Activity, Calendar, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/#classes", label: "Classes" },
  { href: "/#locations", label: "Studios" },
  { href: "/schedule", label: "Schedule" },
  { href: "/dashboard", label: "Admin" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-heading text-lg font-bold text-slate-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Activity className="h-5 w-5" />
          </span>
          Mercer Fitness
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="font-heading text-sm font-medium text-slate-600 transition hover:text-emerald-700">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden md:block">
          <Button className="px-4 py-2">
            <Calendar className="h-4 w-4" />
            Book a Class
          </Button>
        </div>
        <button
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="grid gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-xl px-3 py-3 font-heading text-sm font-medium text-slate-700 hover:bg-slate-100" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
