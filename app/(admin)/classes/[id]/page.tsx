import { getClassById } from "@/actions/class-action";
import AdminHeader from "@/components/admin-header";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  MapPin,
  Clock,
  Calendar,
  Dumbbell,
  ArrowLeft,
  User,
  Mail,
  ListOrdered,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock3,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { DataTable } from "@/components/table/DataTable";
import { columns as bookingColumns } from "@/components/table/booking-column";
import { columns as waitlistColumns } from "@/components/table/waitlist-column";

/* ─── helpers ─────────────────────────────────────────────── */
function formatDate(d: string | Date | null | undefined) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(d));
}

function formatTime(d: string | Date | null | undefined) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(d));
}

function durationMins(start: Date, end: Date | null | undefined) {
  if (!end) return null;
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
}

const STATUS_CONFIG = {
  SCHEDULED: {
    label: "Scheduled",
    variant: "emerald" as const,
    icon: CheckCircle2,
    dot: "bg-emerald-500",
  },
  COMPLETED: {
    label: "Completed",
    variant: "sky" as const,
    icon: CheckCircle2,
    dot: "bg-sky-500",
  },
  CANCELLED: {
    label: "Cancelled",
    variant: "red" as const,
    icon: XCircle,
    dot: "bg-red-500",
  },
};

const BOOKING_STATUS_CONFIG = {
  CONFIRMED: { label: "Confirmed", variant: "emerald" as const },
  CANCELLED: { label: "Cancelled", variant: "red" as const },
};

const WAITLIST_STATUS_CONFIG = {
  WAITING: { label: "Waiting", variant: "amber" as const },
  OFFERED: { label: "Offered", variant: "sky" as const },
  CONFIRMED: { label: "Confirmed", variant: "emerald" as const },
  EXPIRED: { label: "Expired", variant: "slate" as const },
  CANCELLED: { label: "Cancelled", variant: "red" as const },
};

const TYPE_COLORS: Record<string, string> = {
  YOGA: "from-emerald-500 to-teal-600",
  HIIT: "from-rose-500 to-orange-500",
  PILATES: "from-violet-500 to-purple-600",
  CYCLING: "from-sky-500 to-blue-600",
};

/* ─── stat card ────────────────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
          <p className={`mt-2 font-heading text-3xl font-bold ${accent ?? "text-slate-950"}`}>
            {value}
          </p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50">
          <Icon className="h-5 w-5 text-slate-500" />
        </div>
      </div>
    </div>
  );
}

/* ─── page ─────────────────────────────────────────────────── */
const AdminClassDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const result = await getClassById(id);

  if (!result.success || !result.data) return notFound();

  const cls = result.data as any;
  const statusCfg = STATUS_CONFIG[cls.status as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusCfg?.icon ?? AlertCircle;
  const typeGradient = TYPE_COLORS[cls.type] ?? "from-slate-600 to-slate-800";
  const duration = durationMins(cls.startsAt, cls.endsAt);
  const fillPct = Math.round((cls._count.Bookings / cls.capacity) * 100);

  const confirmedBookings = (cls.Bookings ?? []).filter(
    (b: any) => b.status === "CONFIRMED",
  );
  const cancelledBookings = (cls.Bookings ?? []).filter(
    (b: any) => b.status === "CANCELLED",
  );
  const activeWaitlist = (cls.waitLists ?? []).filter((w: any) =>
    ["WAITING", "OFFERED"].includes(w.status),
  );

  const bookingsData = (cls.Bookings ?? []).map((b: any) => ({
    customer: b.customerName,
    email: b.customerEmail,
    className: cls.name,
    status: b.status,
    createdAt: b.createdAt,
    classType: cls.type,
  }));

  const waitlistData = (cls.waitLists ?? []).map((w: any) => ({
    name: w.customerName,
    email: w.customerEmail,
    class: cls.name,
    location: cls.location?.name || "Unknown",
    status: w.status,
  }));

  return (
    <>
      <AdminHeader
        title="Class Details"
        description={`Viewing ${cls.name}`}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </AdminHeader>

      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* ── Hero Banner ─────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          {/* Background layer */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${typeGradient} opacity-90`}
          />
          {cls.image && (
            <Image
              src={cls.image}
              alt={cls.name}
              fill
              className="object-cover opacity-20 mix-blend-overlay"
            />
          )}

          <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between lg:p-8">
            <div className="flex items-start gap-4">
              {/* Type icon badge */}
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Dumbbell className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/20 px-3 py-0.5 font-heading text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
                    {cls.type}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-0.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${statusCfg?.dot ?? "bg-white"}`} />
                    {statusCfg?.label ?? cls.status}
                  </span>
                </div>
                <h1 className="mt-2 font-heading text-2xl font-bold text-white lg:text-3xl">
                  {cls.name}
                </h1>
                <p className="mt-1 flex items-center gap-2 text-sm text-white/80">
                  <User className="h-4 w-4" />
                  {cls.instructor}
                </p>
              </div>
            </div>

            {/* Quick meta chips */}
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm">
                <MapPin className="h-3.5 w-3.5" />
                {cls.location?.name ?? "—"}
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(cls.startsAt)}
              </span>
              {duration && (
                <span className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm">
                  <Clock className="h-3.5 w-3.5" />
                  {duration} min
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Stat Cards ──────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            label="Confirmed bookings"
            value={cls._count.Bookings}
            sub={`of ${cls.capacity} capacity`}
            accent="text-emerald-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Spots remaining"
            value={cls.remaining}
            sub={`${fillPct}% filled`}
            accent={cls.remaining === 0 ? "text-red-600" : "text-slate-950"}
          />
          <StatCard
            icon={Clock3}
            label="Waitlist"
            value={cls._count.waitLists}
            sub="active entries"
          />
          <StatCard
            icon={XCircle}
            label="Cancellations"
            value={cancelledBookings.length}
            sub="total cancelled"
          />
        </div>

        {/* ── Class Info & Description ───────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-base font-semibold text-slate-950">
            Class Info & Description
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Description
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {cls.description || "No description provided."}
              </p>
            </div>
            
            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {[
                { label: "Type", value: cls.type },
                { label: "Status", value: statusCfg?.label ?? cls.status },
                { label: "Instructor", value: cls.instructor },
                { label: "Location", value: cls.location?.name ?? "—" },
                {
                  label: "Address",
                  value:
                    [cls.location?.address, cls.location?.city, cls.location?.state]
                      .filter(Boolean)
                      .join(", ") || "—",
                },
                { label: "Starts", value: formatDate(cls.startsAt) },
                { label: "Ends", value: cls.endsAt ? formatTime(cls.endsAt) : "—" },
                { label: "Duration", value: duration ? `${duration} min` : "—" },
                { label: "Created", value: formatDate(cls.createdAt) },
                { label: "Last updated", value: formatDate(cls.updatedAt) },
              ].map(({ label, value, mono }: any) => (
                <div key={label} className="flex flex-col justify-between gap-1 border-b border-slate-50 pb-3 last:border-0 last:pb-0 sm:border-b-0 sm:pb-0">
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    {label}
                  </div>
                  <div
                    className={`text-sm text-slate-700 ${mono ? "break-all font-mono text-xs" : "font-medium"}`}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bookings Table ───────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              <h2 className="font-heading text-base font-semibold text-slate-950">
                Bookings
              </h2>
            </div>
            <Badge variant="emerald">{confirmedBookings.length} confirmed</Badge>
          </div>
          <DataTable columns={bookingColumns} data={bookingsData} pageSize={5} />
        </div>

        {/* ── Waitlist Table ───────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <ListOrdered className="h-5 w-5 text-amber-500" />
              <h2 className="font-heading text-base font-semibold text-slate-950">
                Waitlist
              </h2>
            </div>
            <Badge variant="amber">{activeWaitlist.length} active</Badge>
          </div>
          <DataTable columns={waitlistColumns} data={waitlistData} pageSize={5} />
        </div>
      </div>
    </>
  );
};

export default AdminClassDetailsPage;
