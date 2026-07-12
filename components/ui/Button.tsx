"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:ring-emerald-500",
  secondary: "border border-slate-200 bg-white text-slate-900 shadow-sm hover:border-emerald-200 hover:bg-emerald-50 focus-visible:ring-emerald-500",
  ghost: "text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400",
  danger: "bg-red-500 text-white shadow-sm hover:bg-red-600 focus-visible:ring-red-500"
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 font-heading text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
