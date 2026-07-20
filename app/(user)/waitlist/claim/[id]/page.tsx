import { getWaitlist } from "@/actions/waitlist.action";
import { ClaimButton } from "@/components/waitlist/ClaimButton";
import {
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react";

const ClaimWaitlistPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const id = (await params).id;
  const token = (await searchParams).token;

  // ── Error states ──────────────────────────────────────────────────────────

  if (!id || !token) {
    return <ErrorScreen message="This claim link is invalid or incomplete." />;
  }

  const waitlist = await getWaitlist(id, token);

  if (!waitlist || waitlist instanceof Error) {
    return (
      <ErrorScreen message="We couldn't find a waitlist entry for this link. It may have expired or already been used." />
    );
  }

  // ── Derived state ────────────────────────────────────────────────────────

  const { class: gymClass, customerName, customerEmail, status, offerExpiresAt } =
    waitlist as Awaited<ReturnType<typeof getWaitlist>> & {
      class: { name: string; type: string; instructor: string; startsAt: Date; endsAt?: Date | null; location?: { name: string; address?: string | null } | null };
      customerName: string;
      customerEmail: string;
      status: string;
      offerExpiresAt: Date | null;
    };

  const isExpired =
    status !== "OFFERED" || (offerExpiresAt && offerExpiresAt < new Date());
  const isClaimed = status === "CONFIRMED";

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const dateStr = dateFormatter.format(new Date(gymClass.startsAt));
  const timeStr = `${timeFormatter.format(new Date(gymClass.startsAt))}${
    gymClass.endsAt ? ` – ${timeFormatter.format(new Date(gymClass.endsAt))}` : ""
  }`;

  // ── Page ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full">

        {/* Header */}
        <div className="text-center mb-10">
          {isClaimed ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-slate-900">
                Spot Claimed!
              </h1>
              <p className="text-slate-500 text-lg">
                You&apos;re confirmed. Check your email for details.
              </p>
            </>
          ) : isExpired ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-5">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-slate-900">
                Offer Expired
              </h1>
              <p className="text-slate-500 text-lg">
                This spot offer is no longer available.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-5">
                <Hourglass className="w-8 h-8 text-amber-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-slate-900">
                A Spot Opened Up!
              </h1>
              <p className="text-slate-500 text-lg">
                Claim your reserved spot before the timer runs out.
              </p>
            </>
          )}
        </div>

        {/* Card */}
        <div className="relative group">
          {/* Glow */}
          <div
            className={`absolute -inset-1 rounded-3xl blur opacity-50 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 ${
              isClaimed
                ? "bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100"
                : isExpired
                  ? "bg-gradient-to-r from-red-100 via-slate-100 to-slate-100"
                  : "bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100"
            }`}
          />

          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xl">

            {/* Class title + status badge */}
            <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                  {gymClass.name}
                </h2>
                <p className="text-slate-500 mt-1 font-medium">
                  {gymClass.type} &bull; with {gymClass.instructor}
                </p>
              </div>
              <StatusBadge status={status} isExpired={!!isExpired} />
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

            {/* Details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-6">
                <DetailRow
                  icon={<Calendar className="w-6 h-6 text-indigo-600" />}
                  iconBg="bg-indigo-50"
                  label="Date"
                  value={dateStr}
                />
                <DetailRow
                  icon={<Clock className="w-6 h-6 text-purple-600" />}
                  iconBg="bg-purple-50"
                  label="Time"
                  value={timeStr}
                />
              </div>
              <div className="space-y-6">
                <DetailRow
                  icon={<MapPin className="w-6 h-6 text-pink-600" />}
                  iconBg="bg-pink-50"
                  label="Location"
                  value={gymClass.location?.name || "Mercer Fitness"}
                  sub={gymClass.location?.address ?? undefined}
                />
                <DetailRow
                  icon={<User className="w-6 h-6 text-blue-600" />}
                  iconBg="bg-blue-50"
                  label="Reserved For"
                  value={customerName}
                  sub={customerEmail}
                />
              </div>
            </div>

            {/* Action area */}
            <div className="pt-8 border-t border-slate-100">
              {isClaimed ? (
                <div className="w-full py-4 px-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-emerald-700 font-semibold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Your spot is confirmed — see you there!
                </div>
              ) : isExpired ? (
                <div className="w-full py-4 px-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500 font-medium">
                  This offer is no longer active.
                </div>
              ) : (
                <>
                  <ClaimButton
                    waitlistId={id}
                    token={token}
                    offerExpiresAt={offerExpiresAt!}
                  />
                  <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                    Claiming this spot will convert your waitlist entry into a
                    confirmed booking. A confirmation email will be sent to{" "}
                    <span className="text-slate-600">{customerEmail}</span>.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Sub-components ──────────────────────────────────────────────────────────

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-slate-900 p-4">
      <div className="max-w-md w-full p-8 border border-red-500/20 bg-red-50 rounded-3xl text-center shadow-xl">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-semibold mb-3 tracking-tight">
          Invalid Link
        </h1>
        <p className="text-slate-500">{message}</p>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  isExpired,
}: {
  status: string;
  isExpired: boolean;
}) {
  if (status === "CONFIRMED") {
    return (
      <span className="px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 border bg-emerald-50 text-emerald-700 border-emerald-200">
        <CheckCircle2 className="w-4 h-4" />
        Claimed
      </span>
    );
  }
  if (isExpired || status !== "OFFERED") {
    return (
      <span className="px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 border bg-red-50 text-red-600 border-red-200">
        <XCircle className="w-4 h-4" />
        Expired
      </span>
    );
  }
  return (
    <span className="px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 border bg-amber-50 text-amber-700 border-amber-200">
      <Hourglass className="w-4 h-4" />
      Offer Active
    </span>
  );
}

function DetailRow({
  icon,
  iconBg,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className={`p-3 ${iconBg} rounded-2xl shrink-0`}>{icon}</div>
      <div>
        <p className="text-sm text-slate-500 mb-1 font-medium">{label}</p>
        <p className="font-semibold text-slate-900">{value}</p>
        {sub && <p className="text-sm text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default ClaimWaitlistPage;
