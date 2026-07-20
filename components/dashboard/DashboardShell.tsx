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
import { createClass, updateClass, deleteClass } from "@/actions/class-action";
import { DialogShell } from "@/components/ui/DialogShell";
import toast from "react-hot-toast";
import { WeeklyBookingsChart, ClassPopularityChart } from "./AnalyticsCharts";

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
  const [deletingClass, setDeletingClass] = useState<Classes | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deletingClass) return;
    setIsDeleting(true);
    try {
      await deleteClass(userId, deletingClass.id);
      toast.success("Class deleted successfully");
      setDeletingClass(null);
    } catch (error) {
      toast.error("Failed to delete class");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 w-full">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <DashboardOverview
          classData={classData}
          bookings={bookings}
          waitlist={waitlist}
        />
        <div className="mt-8">
          <WeeklyBookingsChart bookings={bookings} />
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_380px]">
          <ManageClasses
            onCreate={() => setIsCreateOpen(true)}
            onEdit={(cls) => setEditingClass(cls)}
            onDelete={(cls) => setDeletingClass(cls)}
            classData={classData}
          />
          <ClassPopularityChart bookings={bookings} />
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
                startsAt:
                  editingClass.startsAt instanceof Date
                    ? editingClass.startsAt.toISOString()
                    : editingClass.startsAt,
                endsAt:
                  editingClass.endsAt instanceof Date
                    ? editingClass.endsAt.toISOString()
                    : editingClass.endsAt,
                description: editingClass.description,
                type: editingClass.type,
                locationId: editingClass.locationId,
                status: editingClass.status,
                image: editingClass.image,
              }
            : undefined
        }
        onSubmit={async (values) => {
          if (!editingClass)
            return { success: false, message: "No class selected" };
          const res = await updateClass(editingClass.id, values);
          setEditingClass(null);
          return res;
        }}
      />

      {deletingClass && (
        <DialogShell
          onClose={() => !isDeleting && setDeletingClass(null)}
          title="Delete Class"
          description="Confirm deletion"
        >
          <div className="p-6">
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                {deletingClass?.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setDeletingClass(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? "Deleting..." : "Delete Class"}
              </Button>
            </div>
          </div>
        </DialogShell>
      )}
    </div>
  );
}

function DashboardOverview({
  classData,
  bookings,
  waitlist,
}: {
  classData: Classes[];
  bookings: Bookings[];
  waitlist: Waitlist[];
}) {
  const upcomingClasses = classData.filter(
    (c) => new Date(c.startsAt) > new Date() && c.status === "SCHEDULED",
  ).length;

  const todaysBookings = bookings.filter(
    (b) =>
      b.createdAt &&
      new Date(b.createdAt).toDateString() === new Date().toDateString(),
  ).length;

  const waitlistCount = waitlist.length;

  const cancelledClasses = classData.filter(
    (c) => c.status === "CANCELLED",
  ).length;

  const cards = [
    {
      icon: Calendar,
      label: "Upcoming classes",
      value: upcomingClasses.toString(),
      badge: "Scheduled",
    },
    {
      icon: CheckCircle2,
      label: "Today's bookings",
      value: todaysBookings.toString(),
      badge: "Today",
    },
    {
      icon: Clock,
      label: "Waitlist count",
      value: waitlistCount.toString(),
      badge: "Total",
    },
    {
      icon: XCircle,
      label: "Cancelled classes",
      value: cancelledClasses.toString(),
      badge: "Total",
    },
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
  onDelete,
  classData,
}: {
  onCreate: () => void;
  onEdit: (cls: Classes) => void;
  onDelete: (cls: Classes) => void;
  classData: Classes[];
}) {
  const columns = createColumns({ onEdit, onDelete });

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-slate-950">
            Manage classes
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Search, edit, cancel and delete classes.
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
