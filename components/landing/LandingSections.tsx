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
    <section id="why" className="bg-emerald-50/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Why choose Mercer" title="A calmer way to keep classes full." description="A polished booking experience for members, coaches, and studio operators, designed around clarity and momentum." />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Reveal key={benefit.title} delay={index * 0.08}>
                <Card className="h-full p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-semibold text-slate-950">{benefit.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{benefit.description}</p>
                </Card>
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
    <section className="bg-sky-50/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="How booking works" title="Three steps from intent to studio floor." description="Every interaction is designed to be fast, clear, and reassuring on mobile or desktop." />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={index * 0.08}>
                <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-8 flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="font-heading text-4xl font-bold text-slate-100">0{index + 1}</span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-slate-950">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{step.description}</p>
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
    <section className="bg-amber-50/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Members trust Mercer" title="Built for repeat bookings and real community." description="The product experience stays clean while the studio experience stays warm." />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.08}>
              <Card className="h-full p-6">
                <p className="leading-7 text-slate-700">"{item.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 font-heading text-sm font-bold text-white">
                    {item.name.slice(0, 1)}
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold text-slate-950">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.role}</p>
                  </div>
                </div>
              </Card>
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
