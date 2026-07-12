import type { ReactNode } from "react";

const variants = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  sky: "bg-sky-50 text-sky-700 ring-sky-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  red: "bg-red-50 text-red-700 ring-red-200"
};

export function Badge({
  children,
  variant = "emerald",
  className = ""
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 font-heading text-xs font-medium ring-1 ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
