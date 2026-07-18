"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { Card } from "@/components/ui/Card";
import type { Bookings } from "@/components/table/booking-column";

export function WeeklyBookingsChart({ bookings }: { bookings: Bookings[] }) {
  const data = useMemo(() => {
    // Get last 7 days
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      return startOfDay(d);
    });

    const counts = days.map((day) => {
      return {
        date: format(day, "MMM d"),
        bookings: 0,
        rawDate: day,
      };
    });

    bookings.forEach((b) => {
      if (!b.createdAt) return;
      const bDate = startOfDay(new Date(b.createdAt));
      const target = counts.find(
        (c) => c.rawDate.getTime() === bDate.getTime()
      );
      if (target) {
        target.bookings += 1;
      }
    });

    return counts;
  }, [bookings]);

  return (
    <Card className="p-5 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="font-heading text-xl font-semibold text-slate-950">
          Weekly Bookings Trend
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Booking activity over the last 7 days.
        </p>
      </div>
      <div className="h-72 w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#059669"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#059669" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
    );
  }

export function ClassPopularityChart({ bookings }: { bookings: Bookings[] }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach((b) => {
      const type = b.classType || "Unknown";
      counts[type] = (counts[type] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, bookings]) => ({ name, bookings }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5); // top 5
  }, [bookings]);

  return (
    <Card className="p-5 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="font-heading text-xl font-semibold text-slate-950">
          Class Popularity
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Top class types by total bookings.
        </p>
      </div>
      <div className="h-72 w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#334155', fontWeight: 500 }} width={75} />
            <Tooltip
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="bookings" fill="#38bdf8" radius={[0, 4, 4, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
