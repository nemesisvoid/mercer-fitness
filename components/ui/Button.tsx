"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "default" | "sm" | "lg" | "icon" | "icon-sm";

const variants: Record<Variant, string> = {
  primary: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:ring-emerald-500",
  secondary: "border border-slate-200 bg-white text-slate-900 shadow-sm hover:border-emerald-200 hover:bg-emerald-50 focus-visible:ring-emerald-500",
  ghost: "text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400",
  danger: "bg-red-500 text-white shadow-sm hover:bg-red-600 focus-visible:ring-red-500"
};

const sizes: Record<Size, string> = {
  default: "min-h-11 px-5 py-3",
  sm: "min-h-9 px-4 py-2 text-xs",
  lg: "min-h-12 px-6 py-3 text-base",
  icon: "h-10 w-10 p-0",
  "icon-sm": "h-7 w-7 p-0",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "default",
  ...props
}: HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-heading text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
