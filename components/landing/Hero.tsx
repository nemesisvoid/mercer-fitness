"use client";

import Image from "next/image";
import { CalendarCheck, CheckCircle2, ChevronRight, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MotionDiv, CountUp } from "@/components/landing/Motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 noise-layer">
      <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
        <div className="relative z-10">
          <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Badge variant="emerald" className="gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Premium fitness booking
            </Badge>
            <h1 className="mt-6 max-w-3xl font-heading text-5xl font-bold tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
              Book your next fitness class in seconds.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Mercer Fitness brings boutique studio energy, transparent class capacity, and effortless booking into one polished wellness experience.
            </p>
          </MotionDiv>
          <MotionDiv className="mt-8 flex flex-col gap-3 sm:flex-row" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
            <Button>
              Book a Class
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="secondary">View Schedule</Button>
          </MotionDiv>
          <MotionDiv className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}>
            {["Live capacity", "30-minute waitlist offers", "6 premium studios"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {item}
              </span>
            ))}
          </MotionDiv>
          <MotionDiv className="mt-10 grid max-w-xl grid-cols-3 gap-3" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.42 }}>
            {[
              ["4,800", "Members"],
              ["180", "Weekly classes"],
              ["6", "Studios"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                <div className="font-heading text-2xl font-bold text-slate-950">
                  <CountUp value={Number(value.replace(",", ""))} suffix="" />+
                </div>
                <p className="mt-1 text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </MotionDiv>
        </div>

        <MotionDiv
          className="relative"
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{ opacity: { duration: 0.75 }, scale: { duration: 0.75 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
        >
          <div className="absolute -left-8 -top-8 h-36 w-36 rounded-full bg-amber-300/30 blur-3xl" />
          <div className="absolute -right-10 bottom-8 h-48 w-48 rounded-full bg-sky-300/30 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white bg-white p-2 shadow-glow">
            <Image
              src="/mercer-hero.png"
              alt="Mercer Fitness group class in a bright modern studio"
              width={1600}
              height={900}
              priority
              className="h-[420px] w-full rounded-[1.35rem] object-cover md:h-[560px]"
            />
          </div>
          <div className="glass-panel absolute -left-4 top-10 hidden rounded-2xl p-4 shadow-sm sm:block">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="font-heading text-sm font-semibold text-slate-950">12 spots open</p>
                <p className="text-xs text-slate-500">Yoga Flow at 7:00 AM</p>
              </div>
            </div>
          </div>
          <div className="glass-panel absolute -bottom-5 right-4 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white">
                <CalendarCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="font-heading text-sm font-semibold text-slate-950">Booking confirmed</p>
                <p className="text-xs text-slate-500">Mercer SoHo, Studio A</p>
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}
