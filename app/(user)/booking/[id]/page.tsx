import { getBooking } from "@/actions/booking.action";
import { redirect } from "next/navigation";
import { CancelButton } from "@/components/classes/CancelButton";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsData = await searchParams;
  const token = searchParamsData?.cancelToken as string | undefined;
  const paramsData = await params;
  const bookingId = paramsData.id;

  const bookingData = await getBooking(bookingId);

  if (!bookingData || bookingData instanceof Error || !bookingData.class) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
        <div className="max-w-md w-full p-8 border border-red-500/20 bg-red-500/10 rounded-3xl backdrop-blur-xl text-center shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-semibold mb-3 tracking-tight">
            Booking Not Found
          </h1>
          <p className="text-zinc-400">
            The booking you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const { class: gymClass, customerName, customerEmail, status } = bookingData;
  const isCancelled = status === "CANCELLED";



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
  const timeStr = `${timeFormatter.format(new Date(gymClass.startsAt))} - ${gymClass.endsAt ? timeFormatter.format(new Date(gymClass.endsAt)) : "TBD"}`;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4 py-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            Booking Details
          </h1>
          <p className="text-zinc-400 text-lg">
            Manage your class reservation below.
          </p>
        </div>

        {/* Card Container */}
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />

          <div className="relative bg-zinc-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">
                  {gymClass.name}
                </h2>
                <p className="text-zinc-400 mt-1">
                  {gymClass.type} • with {gymClass.instructor}
                </p>
              </div>
              <div
                className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 border ${isCancelled ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}
              >
                {isCancelled ? (
                  <XCircle className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {isCancelled ? "Cancelled" : "Confirmed"}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Date & Time */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <Calendar className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Date</p>
                    <p className="font-medium">{dateStr}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <Clock className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Time</p>
                    <p className="font-medium">{timeStr}</p>
                  </div>
                </div>
              </div>

              {/* Location & User */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <MapPin className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Location</p>
                    <p className="font-medium">
                      {gymClass.location?.name || "Mercer Fitness"}
                    </p>
                    {gymClass.location?.address && (
                      <p className="text-sm text-zinc-400 mt-0.5">
                        {gymClass.location.address}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <User className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Booked For</p>
                    <p className="font-medium">{customerName}</p>
                    <p className="text-sm text-zinc-400 mt-0.5">
                      {customerEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {!isCancelled && token && (
              <div className="pt-8 border-t border-white/10">
                <CancelButton bookingId={bookingId} token={token} />
                <p className="text-center text-xs text-zinc-500 mt-4">
                  Are you sure? This action cannot be undone and your spot will
                  be given to the next person on the waitlist.
                </p>
              </div>
            )}

            {isCancelled && (
              <div className="pt-8 border-t border-white/10">
                <div className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-center text-zinc-400">
                  This reservation has been cancelled.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
