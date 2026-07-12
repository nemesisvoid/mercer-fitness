"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Filter, MapPin, Search, SlidersHorizontal, User, X } from "lucide-react";
import { useState } from "react";
import { classes } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CapacityBadge } from "@/components/ui/CapacityBadge";
import { Card } from "@/components/ui/Card";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ScheduleExperience() {
  const [modal, setModal] = useState<"booking" | "waitlist" | null>(null);
  const [toast, setToast] = useState(false);

  function finishBooking(kind: "booking" | "waitlist") {
    setModal(null);
    setToast(true);
    window.setTimeout(() => setToast(false), 3000);
    if (kind === "waitlist") setModal("waitlist");
  }

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Badge variant="emerald">Weekly schedule</Badge>
              <h1 className="mt-4 font-heading text-4xl font-bold tracking-normal text-slate-950 md:text-5xl">Find the right class for your week.</h1>
              <p className="mt-4 max-w-2xl leading-7 text-slate-600">Search live capacity, compare class formats, and reserve a spot without losing context.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary"><CalendarDays className="h-4 w-4" /> This week</Button>
              <Button><Filter className="h-4 w-4" /> Filters</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="p-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <label className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Search class, instructor, or studio" />
            </label>
            <select className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
              <option>All locations</option>
              <option>Mercer SoHo</option>
              <option>Mercer West</option>
            </select>
            <select className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
              <option>All class types</option>
              <option>Yoga</option>
              <option>HIIT</option>
              <option>Pilates</option>
            </select>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {days.map((day, index) => (
              <button key={day} className={`min-w-20 rounded-xl border px-4 py-3 font-heading text-sm font-medium transition ${index === 0 ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}>
                {day}
              </button>
            ))}
          </div>
        </Card>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4">
            {classes.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="grid gap-5 p-4 md:grid-cols-[180px_1fr_auto] md:items-center">
                  <div className={`relative h-36 overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient}`}>
                    <Image src="/mercer-hero.png" alt="" fill className="object-cover opacity-80 mix-blend-luminosity" sizes="180px" />
                    <div className="absolute inset-0 bg-slate-950/15" />
                    <Badge variant="slate" className="absolute left-3 top-3">{item.type}</Badge>
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-slate-950">{item.title}</h2>
                    <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      <span className="flex items-center gap-2"><User className="h-4 w-4 text-emerald-600" /> {item.instructor}</span>
                      <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-emerald-600" /> {item.time}</span>
                      <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-600" /> {item.location}</span>
                      <span className="text-slate-500">{item.duration} · {item.capacity} seats</span>
                    </div>
                    <div className="mt-4 max-w-sm">
                      <CapacityBadge remaining={item.remaining} capacity={item.capacity} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:w-36">
                    <Button onClick={() => setModal(item.remaining === 0 ? "waitlist" : "booking")} variant={item.remaining === 0 ? "secondary" : "primary"}>
                      {item.remaining === 0 ? "Join Waitlist" : "Book"}
                    </Button>
                    <Button variant="ghost">Details</Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <aside className="space-y-5">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-slate-950">Capacity mix</h2>
                <SlidersHorizontal className="h-5 w-5 text-slate-400" />
              </div>
              <div className="mt-5 space-y-4">
                <CapacityBadge remaining={24} capacity={80} />
                <CapacityBadge remaining={8} capacity={40} />
                <CapacityBadge remaining={0} capacity={18} />
              </div>
            </Card>
            <Card className="p-5">
              <h2 className="font-heading text-lg font-semibold text-slate-950">Loading state</h2>
              <div className="mt-5 space-y-3">
                <LoadingSkeleton className="h-4 w-3/4" />
                <LoadingSkeleton className="h-4 w-full" />
                <LoadingSkeleton className="h-20 w-full" />
              </div>
            </Card>
            <Card className="p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <Search className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-heading text-lg font-semibold text-slate-950">Empty state ready</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">When filters return no classes, members get a clear reset path.</p>
              <Button className="mt-5 w-full" variant="secondary">Reset filters</Button>
            </Card>
          </aside>
        </div>
      </section>

      <AnimatePresence>
        {modal === "booking" && (
          <BookingDialog onClose={() => setModal(null)} onSuccess={() => finishBooking("booking")} />
        )}
        {modal === "waitlist" && (
          <WaitlistDialog onClose={() => setModal(null)} onSuccess={() => finishBooking("waitlist")} />
        )}
        {toast && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} className="fixed bottom-5 right-5 z-50 rounded-2xl border border-emerald-200 bg-white p-4 shadow-md">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <p className="font-heading text-sm font-semibold text-slate-950">Booking saved successfully</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function BookingDialog({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  return (
    <DialogShell onClose={onClose} title="Book Morning Flow Yoga" description="Confirm your spot with a clean, accessible member form.">
      <form className="mt-6 grid gap-4" onSubmit={(event) => { event.preventDefault(); onSuccess(); }}>
        <input required className="h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Full name" />
        <input required type="email" className="h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Email address" />
        <Button className="mt-2 w-full">Confirm Booking</Button>
      </form>
    </DialogShell>
  );
}

function WaitlistDialog({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  return (
    <DialogShell onClose={onClose} title="Waitlist confirmation" description="You are position 3. If a spot opens, you will have 30 minutes to confirm before it moves to the next member.">
      <div className="mt-6 rounded-2xl bg-emerald-50 p-5 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <p className="mt-3 font-heading text-3xl font-bold text-slate-950">#3</p>
        <p className="mt-1 text-sm text-slate-600">Current waitlist position</p>
      </div>
      <Button className="mt-5 w-full" onClick={onSuccess}>Join Waitlist</Button>
    </DialogShell>
  );
}

function DialogShell({
  children,
  description,
  onClose,
  title
}: {
  children: React.ReactNode;
  description: string;
  onClose: () => void;
  title: string;
}) {
  return (
    <motion.div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 16 }} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-950">{title}</h2>
            <p className="mt-2 leading-7 text-slate-600">{description}</p>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500" onClick={onClose} aria-label="Close dialog">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
