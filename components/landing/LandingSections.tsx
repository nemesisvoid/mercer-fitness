"use client";

import { ChevronDown, CheckCircle2, MapPin, Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { benefits, classes, faqs, locations, stats, testimonials } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ClassCard } from "@/components/classes/ClassCard";
import { Reveal } from "@/components/landing/Motion";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function StatsBand() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.08}>
            <Card className="p-6">
              <p className="font-heading text-3xl font-bold text-slate-950">{stat.value}</p>
              <p className="mt-2 font-heading text-sm font-semibold text-slate-700">{stat.label}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.detail}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Benefits() {
  return (
    <section
      id="why"
      className="relative overflow-hidden py-28"
      style={{
        background: "linear-gradient(135deg, #0a0f0d 0%, #0d1a14 50%, #080e0b 100%)",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(52,211,153,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow orbs */}
      <div
        className="pointer-events-none absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #059669, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -right-40 top-1/3 h-80 w-80 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal delay={0}>
          <div className="mb-16 max-w-2xl">
            <span
              className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
              style={{
                background: "rgba(16,185,129,0.12)",
                color: "#34d399",
                border: "1px solid rgba(52,211,153,0.25)",
              }}
            >
              The Mercer Experience
            </span>
            <h2
              className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
              style={{ color: "#f0fdf8" }}
            >
              Designed to elevate{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #34d399, #6ee7b7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                your daily routine.
              </span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: "#6b7f76" }}>
              Instant booking, world-class coaching, and a welcoming community built to keep you motivated every step of the way.
            </p>
          </div>
        </Reveal>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Reveal key={benefit.title} delay={index * 0.12}>
                <div
                  className="group relative h-full rounded-2xl p-px transition-all duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(52,211,153,0.2) 0%, rgba(52,211,153,0.04) 60%, transparent 100%)",
                  }}
                >
                  <div
                    className="relative h-full rounded-2xl p-8 transition-all duration-500 group-hover:translate-y-[-2px]"
                    style={{
                      background: "rgba(10,17,13,0.85)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    {/* Large step number */}
                    <span
                      className="absolute right-6 top-6 font-heading text-7xl font-black leading-none select-none"
                      style={{ color: "rgba(52,211,153,0.06)" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Icon badge */}
                    <div
                      className="relative mb-7 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(6,95,70,0.35))",
                        border: "1px solid rgba(52,211,153,0.25)",
                        boxShadow: "0 0 24px rgba(16,185,129,0.15)",
                      }}
                    >
                      <Icon className="h-6 w-6" style={{ color: "#34d399" }} />
                    </div>

                    <h3
                      className="font-heading text-xl font-semibold leading-snug"
                      style={{ color: "#ecfdf5" }}
                    >
                      {benefit.title}
                    </h3>
                    <p
                      className="mt-3 text-sm leading-relaxed"
                      style={{ color: "#5d7269" }}
                    >
                      {benefit.description}
                    </p>

                    {/* Bottom accent line */}
                    <div
                      className="mt-8 h-px w-10 rounded-full transition-all duration-500 group-hover:w-16"
                      style={{
                        background: "linear-gradient(90deg, #34d399, transparent)",
                      }}
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FeaturedClasses() {
  return (
    <section id="classes" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Featured classes" title="Studio energy for every training style." description="Browse real-time availability across yoga, Pilates, cycling, strength, HIIT, and recovery sessions." />
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {classes.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <ClassCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { icon: Search, title: "Find your class", description: "Filter by location, intensity, instructor, and available spots." },
    { icon: UserPlus, title: "Reserve or waitlist", description: "Book instantly or join a transparent waitlist when capacity is full." },
    { icon: CheckCircle2, title: "Arrive ready", description: "Get confirmation details, studio notes, and calendar reminders." }
  ];

  return (
    <section
      className="relative overflow-hidden py-28"
      style={{ background: "linear-gradient(160deg, #ffffff 0%, #f8fffe 50%, #f0fdf9 100%)" }}
    >
      {/* Subtle dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: "radial-gradient(circle, #d1fae5 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Soft emerald wash — top edge only */}
      <div
        className="pointer-events-none absolute left-1/2 -top-40 h-80 w-[700px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(ellipse, #a7f3d0, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal delay={0}>
          <div className="mb-20 text-center">
            <span
              className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
              style={{
                background: "rgba(16,185,129,0.10)",
                color: "#059669",
                border: "1px solid rgba(16,185,129,0.22)",
              }}
            >
              How booking works
            </span>
            <h2 className="mx-auto mt-4 max-w-2xl font-heading text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Three steps from intent{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #059669, #34d399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                to studio floor.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-500">
              Every interaction is designed to be fast, clear, and reassuring on mobile or desktop.
            </p>
          </div>
        </Reveal>


        {/* Steps */}
        <div className="relative grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={index * 0.14}>
                <div
                  className="group relative h-full rounded-2xl bg-white p-8 transition-all duration-500 hover:-translate-y-1"
                  style={{
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.06)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Large ghost step number */}
                  <span
                    className="absolute right-6 top-5 font-heading text-7xl font-black leading-none select-none transition-colors duration-500 group-hover:text-emerald-100"
                    style={{ color: "#f1f5f9" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Icon badge */}
                  <div
                    className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
                      border: "1px solid #a7f3d0",
                    }}
                  >
                    <Icon className="h-6 w-6 text-emerald-600" />
                  </div>

                  <h3 className="font-heading text-xl font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    {step.description}
                  </p>

                  {/* Bottom accent — expands on hover */}
                  <div className="mt-8 h-0.5 w-8 rounded-full bg-emerald-400 transition-all duration-500 group-hover:w-16" />

                  {/* Step connector arrow (not on last card) */}
                  {index < steps.length - 1 && (
                    <div
                      className="pointer-events-none absolute -right-3.5 top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white md:flex"
                      style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)" }}
                    >
                      <svg className="h-3 w-3 text-slate-400" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6h8M7 3l3 3-3 3" />
                      </svg>
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export function Locations() {
  return (
    <section id="locations" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading align="left" eyebrow="Studio locations" title="A Mercer studio near your daily rhythm." description="Each location keeps class rosters, capacity, and waitlists synced so members always know what to expect." />
          <div className="grid gap-4">
            {locations.map((location, index) => (
              <Reveal key={location.name} delay={index * 0.08}>
                <Card className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <MapPin className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-slate-950">{location.name}</h3>
                      <p className="text-sm text-slate-500">{location.address}</p>
                    </div>
                  </div>
                  <Badge variant="amber">{location.classes}</Badge>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section
      className="relative overflow-hidden py-28"
      style={{ background: "linear-gradient(150deg, #080d0a 0%, #0c1812 50%, #070c09 100%)" }}
    >
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(52,211,153,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Ambient orbs */}
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #059669, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-64 w-64 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal delay={0}>
          <div className="mb-16 text-center">
            <span
              className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
              style={{
                background: "rgba(16,185,129,0.12)",
                color: "#34d399",
                border: "1px solid rgba(52,211,153,0.25)",
              }}
            >
              Members trust Mercer
            </span>
            <h2
              className="mx-auto mt-4 max-w-2xl font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
              style={{ color: "#f0fdf8" }}
            >
              Built for{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #34d399, #6ee7b7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                real community.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed" style={{ color: "#6b7f76" }}>
              The product experience stays clean while the studio experience stays warm.
            </p>
          </div>
        </Reveal>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.12}>
              <div
                className="group relative h-full rounded-2xl p-px transition-all duration-500"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(52,211,153,0.18) 0%, rgba(52,211,153,0.04) 50%, transparent 100%)",
                }}
              >
                <div
                  className="relative flex h-full flex-col rounded-2xl p-7 transition-all duration-500 group-hover:translate-y-[-2px]"
                  style={{
                    background: "rgba(8,14,10,0.9)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  {/* Giant quotemark */}
                  <span
                    className="absolute right-5 top-4 font-heading text-8xl font-black leading-none select-none"
                    style={{ color: "rgba(52,211,153,0.05)" }}
                  >
                    &ldquo;
                  </span>

                  {/* Stars */}
                  <div className="mb-5 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill="#34d399">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="flex-1 text-sm leading-relaxed" style={{ color: "#8faaa0" }}>
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  {/* Divider */}
                  <div
                    className="my-6 h-px"
                    style={{ background: "linear-gradient(90deg, rgba(52,211,153,0.15), transparent)" }}
                  />

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-heading text-sm font-bold"
                      style={{
                        background: "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(6,78,59,0.5))",
                        border: "1px solid rgba(52,211,153,0.3)",
                        boxShadow: "0 0 16px rgba(16,185,129,0.18)",
                        color: "#34d399",
                      }}
                    >
                      {item.name.slice(0, 1)}
                    </div>
                    <div>
                      <p className="font-heading text-sm font-semibold" style={{ color: "#ecfdf5" }}>
                        {item.name}
                      </p>
                      <p className="text-xs" style={{ color: "#4a6358" }}>
                        {item.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="FAQ" title="Clear policies before members commit." description="Common booking and waitlist questions are surfaced without adding friction." />
        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => (
            <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white">
              <button className="flex w-full items-center justify-between gap-4 p-5 text-left font-heading font-semibold text-slate-950" onClick={() => setOpen(open === index ? -1 : index)}>
                {faq.question}
                <ChevronDown className={`h-5 w-5 shrink-0 transition ${open === index ? "rotate-180 text-emerald-600" : "text-slate-400"}`} />
              </button>
              <div className={`grid transition-all duration-300 ${open === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 leading-7 text-slate-600">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="bg-slate-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <Badge variant="emerald">Ready when you are</Badge>
            <h2 className="mt-4 font-heading text-3xl font-bold text-white md:text-4xl">Book a class that fits today.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">See real-time capacity, reserve your spot, or join a waitlist with a clear path to confirmation.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button>Book a Class</Button>
            <Button variant="secondary">View Schedule</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
