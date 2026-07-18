"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Edit,
  Eye,
  Filter,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CapacityBadge } from "@/components/ui/CapacityBadge";
import { ClassFormSheet } from "@/components/dashboard/ClassFormSheet";
import { DataTable } from "@/components/table/DataTable";
import { createColumns, type Classes } from "@/components/table/class-column";
import {
  columns as bookingColumns,
  type Bookings,
} from "@/components/table/booking-column";
import {
  columns as waitlistColumns,
  type Waitlist,
} from "@/components/table/waitlist-column";
import { createClass, updateClass } from "@/actions/class-action";

const nav = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Calendar, label: "Manage Classes" },
  { icon: Users, label: "Bookings" },
  { icon: Clock, label: "Waitlist" },
  { icon: Settings, label: "Settings" },
];

export function DashboardShell({
  userId,
  locations,
  classData,
  bookings,
  waitlist,
}: {
  userId: string;
  locations: Location[];
  classData: Classes[];
  bookings: Bookings[];
  waitlist: Waitlist[];
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Classes | null>(null);

  return (
    <div className="flex-1 w-full">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <DashboardOverview />
        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_380px]">
          <ManageClasses
            onCreate={() => setIsCreateOpen(true)}
            onEdit={(cls) => setEditingClass(cls)}
            classData={classData}
          />
          <RightRail />
        </div>
        <BookingManagement bookings={bookings} />
        <WaitlistManagement waitlist={waitlist} />
      </div>

      {/* Create sheet */}
      <ClassFormSheet
        locations={locations}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={async (values) => {
          const res = await createClass(userId, values);
          return res;
        }}
      />

      {/* Edit sheet — opens when a row's Edit button is clicked.
          The `key` forces a full remount whenever a different class is selected,
          so react-hook-form always re-initialises with the correct defaultValues. */}
      <ClassFormSheet
        key={editingClass?.id}
        locations={locations}
        open={Boolean(editingClass)}
        onOpenChange={(open) => {
          if (!open) setEditingClass(null);
        }}
        defaultValues={
          editingClass
            ? {
                name: editingClass.name,
                instructor: editingClass.instructor,
                capacity: editingClass.capacity,
                startsAt: editingClass.startsAt instanceof Date
                  ? editingClass.startsAt.toISOString()
                  : editingClass.startsAt,
                description: editingClass.description,
                type: editingClass.type,
                locationId: editingClass.locationId,
                status: editingClass.status,
                image: editingClass.image,
              }
            : undefined
        }
        onSubmit={async (values) => {
          if (!editingClass) return { success: false, message: "No class selected" };
          const res = await updateClass(editingClass.id, values);
          setEditingClass(null);
          return res;
        }}
      />
    </div>
  );
}

function DashboardOverview() {
  const cards = [
    { icon: Calendar, label: "Upcoming classes", value: "42", badge: "+8%" },
    {
      icon: CheckCircle2,
      label: "Today's bookings",
      value: "318",
      badge: "+14%",
    },
    { icon: Clock, label: "Waitlist count", value: "27", badge: "Live" },
    { icon: XCircle, label: "Cancelled classes", value: "2", badge: "Low" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Icon className="h-6 w-6" />
                </span>
                <Badge variant={index === 2 ? "amber" : "emerald"}>
                  {card.badge}
                </Badge>
              </div>
              <p className="mt-5 font-heading text-3xl font-bold text-slate-950">
                {card.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{card.label}</p>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

function ManageClasses({
  onCreate,
  onEdit,
  classData,
}: {
  onCreate: () => void;
  onEdit: (cls: Classes) => void;
  classData: Classes[];
}) {
  const columns = createColumns({ onEdit });

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-slate-950">
            Manage classes
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Search, duplicate, edit, cancel, or inspect capacity.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4" /> Create Class
          </Button>
        </div>
      </div>
      <div className="p-5">
        <DataTable columns={columns} data={classData as any} />
      </div>
    </Card>
  );
}

function RightRail() {
  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-slate-950">
            Mini analytics
          </h2>
          <BarChart3 className="h-5 w-5 text-slate-400" />
        </div>
        <div className="mt-6 flex h-48 items-end gap-3">
          {[42, 68, 52, 84, 73, 96, 88].map((height, index) => (
            <motion.div
              key={height}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: index * 0.06, duration: 0.55 }}
              className="flex-1 rounded-t-xl bg-gradient-to-t from-emerald-600 to-sky-400"
            />
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Booking conversion by day, placeholder data.
        </p>
      </Card>
    </div>
  );
}

function BookingManagement({ bookings }: { bookings: Bookings[] }) {
  return (
    <Card className="mt-8 overflow-hidden">
      <div className="border-b border-slate-200 p-5">
        <h2 className="font-heading text-xl font-semibold text-slate-950">
          Booking management
        </h2>
      </div>
      <div className="p-5">
        <DataTable columns={bookingColumns} data={bookings} />
      </div>
    </Card>
  );
}

function WaitlistManagement({ waitlist }: { waitlist: Waitlist[] }) {
  return (
    <Card className="mt-8 overflow-hidden">
      <div className="grid gap-5 border-b border-slate-200 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="font-heading text-xl font-semibold text-slate-950">
            Waitlist management
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Promote, remove, or resend 30-minute confirmation offers.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Resend Email</Button>
          <Button>Promote Next</Button>
        </div>
      </div>
      <div className="p-5">
        <DataTable columns={waitlistColumns} data={waitlist} />
      </div>
    </Card>
  );
}
