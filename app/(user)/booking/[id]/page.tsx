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
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-900 p-4">
        <div className="max-w-md w-full p-8 border border-red-500/20 bg-red-50 rounded-3xl text-center shadow-xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-semibold mb-3 tracking-tight">
            Booking Not Found
          </h1>
          <p className="text-slate-500">
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">
            Booking Details
          </h1>
          <p className="text-slate-500 text-lg">
            Manage your class reservation below.
          </p>
        </div>

        {/* Card Container */}
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 rounded-3xl blur opacity-50 group-hover:opacity-70 transition duration-1000 group-hover:duration-200" />

          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xl">
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                  {gymClass.name}
                </h2>
                <p className="text-slate-500 mt-1 font-medium">
                  {gymClass.type} • with {gymClass.instructor}
                </p>
              </div>
              <div
                className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 border ${isCancelled ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}
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
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Date & Time */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 rounded-2xl">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1 font-medium">
                      Date
                    </p>
                    <p className="font-semibold text-slate-900">{dateStr}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50 rounded-2xl">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1 font-medium">
                      Time
                    </p>
                    <p className="font-semibold text-slate-900">{timeStr}</p>
                  </div>
                </div>
              </div>

              {/* Location & User */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-50 rounded-2xl">
                    <MapPin className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1 font-medium">
                      Location
                    </p>
                    <p className="font-semibold text-slate-900">
                      {gymClass.location?.name || "Mercer Fitness"}
                    </p>
                    {gymClass.location?.address && (
                      <p className="text-sm text-slate-500 mt-0.5">
                        {gymClass.location.address}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1 font-medium">
                      Booked For
                    </p>
                    <p className="font-semibold text-slate-900">
                      {customerName}
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {customerEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {!isCancelled && token && (
              <div className="pt-8 border-t border-slate-100">
                <CancelButton bookingId={bookingId} token={token} />
                <p className="text-center text-xs text-slate-500 mt-4 font-medium">
                  Are you sure? This action cannot be undone and your spot will
                  be given to the next person on the waitlist.
                </p>
              </div>
            )}

            {isCancelled && (
              <div className="pt-8 border-t border-slate-100">
                <div className="w-full py-4 px-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500 font-medium">
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
