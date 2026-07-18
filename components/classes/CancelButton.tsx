"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle, Loader2 } from "lucide-react";
import { cancelBooking } from "@/actions/booking.action";
import toast from "react-hot-toast";

export function CancelButton({
  bookingId,
  token,
}: {
  bookingId: string;
  token: string;
}) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    setIsPending(true);
    try {
      const result = await cancelBooking(bookingId, token);
      if (result.success) {
        toast.success("Reservation cancelled successfully");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to cancel reservation");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong, try again later");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCancel}
      disabled={isPending}
      className="w-full py-4 px-6 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <XCircle className="w-5 h-5" />
      )}
      {isPending ? "Cancelling..." : "Cancel Reservation"}
    </button>
  );
}
