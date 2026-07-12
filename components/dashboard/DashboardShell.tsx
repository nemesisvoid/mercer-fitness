"use client";

import { motion } from "framer-motion";
import { Activity, BarChart3, Bell, Calendar, CheckCircle2, Clock, Copy, Edit, Eye, Filter, LayoutDashboard, Menu, MoreHorizontal, Search, Settings, User, Users, XCircle } from "lucide-react";
import { bookings, classes } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CapacityBadge } from "@/components/ui/CapacityBadge";

const nav = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Calendar, label: "Manage Classes" },
  { icon: Users, label: "Bookings" },
  { icon: Clock, label: "Waitlist" },
  { icon: Settings, label: "Settings" }
];

export function DashboardShell() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <aside className="hidden min-h-screen border-r border-slate-200 bg-white p-5 lg:block">
          <div className="flex items-center gap-3 font-heading text-lg font-bold text-slate-950">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Activity className="h-5 w-5" />
            </span>
            Mercer Admin
          </div>
          <nav className="mt-8 grid gap-2">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.label} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left font-heading text-sm font-medium transition ${item.active ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100"}`}>
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section>
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden">
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="font-heading text-xl font-bold text-slate-950">Dashboard overview</h1>
                  <p className="text-sm text-slate-500">Today across all Mercer studios</p>
                </div>
              </div>
              <div className="hidden flex-1 justify-center md:flex">
                <label className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Search bookings, members, classes" />
                </label>
              </div>
              <div className="flex items-center gap-3">
                <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500" />
                </button>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">MF</span>
              </div>
            </div>
          </header>

          <div className="px-4 py-8 sm:px-6 lg:px-8">
            <DashboardOverview />
            <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_380px]">
              <ManageClasses />
              <RightRail />
            </div>
            <BookingManagement />
            <WaitlistManagement />
          </div>
        </section>
      </div>
    </main>
  );
}

function DashboardOverview() {
  const cards = [
    { icon: Calendar, label: "Upcoming classes", value: "42", badge: "+8%" },
    { icon: CheckCircle2, label: "Today's bookings", value: "318", badge: "+14%" },
    { icon: Clock, label: "Waitlist count", value: "27", badge: "Live" },
    { icon: XCircle, label: "Cancelled classes", value: "2", badge: "Low" }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div key={card.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Icon className="h-6 w-6" />
                </span>
                <Badge variant={index === 2 ? "amber" : "emerald"}>{card.badge}</Badge>
              </div>
              <p className="mt-5 font-heading text-3xl font-bold text-slate-950">{card.value}</p>
              <p className="mt-1 text-sm text-slate-500">{card.label}</p>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

function ManageClasses() {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-slate-950">Manage classes</h2>
          <p className="mt-1 text-sm text-slate-500">Search, duplicate, edit, cancel, or inspect capacity.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary"><Filter className="h-4 w-4" /> Filter</Button>
          <Button>Create Class</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Class</th>
              <th className="px-5 py-3">Instructor</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3">Capacity</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {classes.map((item) => (
              <tr key={item.title} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-heading text-sm font-semibold text-slate-950">{item.title}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{item.instructor}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{item.location}</td>
                <td className="px-5 py-4"><div className="w-36"><CapacityBadge remaining={item.remaining} capacity={item.capacity} /></div></td>
                <td className="px-5 py-4"><Badge variant={item.remaining === 0 ? "amber" : "emerald"}>{item.remaining === 0 ? "Waitlist" : "Active"}</Badge></td>
                <td className="px-5 py-4">
                  <div className="flex gap-2 text-slate-500">
                    <button className="rounded-lg p-2 hover:bg-slate-100" aria-label="View"><Eye className="h-4 w-4" /></button>
                    <button className="rounded-lg p-2 hover:bg-slate-100" aria-label="Edit"><Edit className="h-4 w-4" /></button>
                    <button className="rounded-lg p-2 hover:bg-slate-100" aria-label="Duplicate"><Copy className="h-4 w-4" /></button>
                    <button className="rounded-lg p-2 hover:bg-slate-100" aria-label="More"><MoreHorizontal className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function RightRail() {
  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-slate-950">Mini analytics</h2>
          <BarChart3 className="h-5 w-5 text-slate-400" />
        </div>
        <div className="mt-6 flex h-48 items-end gap-3">
          {[42, 68, 52, 84, 73, 96, 88].map((height, index) => (
            <motion.div key={height} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: index * 0.06, duration: 0.55 }} className="flex-1 rounded-t-xl bg-gradient-to-t from-emerald-600 to-sky-400" />
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500">Booking conversion by day, placeholder data.</p>
      </Card>
      <Card className="p-5">
        <h2 className="font-heading text-xl font-semibold text-slate-950">Create / edit form</h2>
        <div className="mt-5 grid gap-3">
          {["Title", "Instructor", "Location", "Date", "Start Time", "Capacity"].map((field) => (
            <input key={field} className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder={field} />
          ))}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary">Cancel</Button>
            <Button>Save</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function BookingManagement() {
  return (
    <Card className="mt-8 overflow-hidden">
      <div className="border-b border-slate-200 p-5">
        <h2 className="font-heading text-xl font-semibold text-slate-950">Booking management</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Class</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {bookings.map((booking) => (
              <tr key={booking.email} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white"><User className="h-4 w-4" /></span>
                    <span className="font-heading text-sm font-semibold text-slate-950">{booking.customer}</span>
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{booking.email}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{booking.className}</td>
                <td className="px-5 py-4 text-sm text-slate-600">Mercer SoHo</td>
                <td className="px-5 py-4"><Badge variant={booking.status === "Cancelled" ? "red" : booking.status === "Waitlist" ? "amber" : "emerald"}>{booking.status}</Badge></td>
                <td className="px-5 py-4"><Button variant="ghost" className="px-3 py-2">View</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function WaitlistManagement() {
  return (
    <Card className="mt-8 p-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="font-heading text-xl font-semibold text-slate-950">Waitlist management</h2>
          <p className="mt-1 text-sm text-slate-500">Promote, remove, or resend 30-minute confirmation offers.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Resend Email</Button>
          <Button>Promote Next</Button>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {["Position #1 · HIIT Circuit", "Offer expires in 18m", "3 members waiting"].map((item) => (
          <div key={item} className="rounded-2xl bg-slate-50 p-4 font-heading text-sm font-medium text-slate-700">{item}</div>
        ))}
      </div>
    </Card>
  );
}
