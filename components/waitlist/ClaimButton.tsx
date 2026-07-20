"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { claimWaitlistSpot } from "@/actions/waitlist.action";

function formatTimeLeft(expiresAt: Date): string {
  const diff = expiresAt.getTime() - Date.now();
  if (diff <= 0) return "00:00";
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function ClaimButton({
  waitlistId,
  token,
  offerExpiresAt,
}: {
  waitlistId: string;
  token: string;
  offerExpiresAt: Date;
}) {
  const [isPending, setIsPending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() =>
    formatTimeLeft(new Date(offerExpiresAt)),
  );
  const [isExpired, setIsExpired] = useState(
    () => new Date(offerExpiresAt).getTime() <= Date.now(),
  );
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      const expires = new Date(offerExpiresAt);
      if (expires.getTime() <= Date.now()) {
        setIsExpired(true);
        setTimeLeft("00:00");
        clearInterval(interval);
      } else {
        setTimeLeft(formatTimeLeft(expires));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [offerExpiresAt]);

  const handleClaim = async () => {
    if (isExpired) return;
    setIsPending(true);
    try {
      const result = await claimWaitlistSpot(waitlistId, token);
      if (result?.success) {
        toast.success("🎉 Spot claimed! Check your email for confirmation.");
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to claim spot");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong, please try again");
    } finally {
      setIsPending(false);
    }
  };

  const urgentRed =
    !isExpired &&
    new Date(offerExpiresAt).getTime() - Date.now() < 5 * 60 * 1000;

  return (
    <div className="space-y-4">
      {/* Countdown */}
      <div
        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border font-mono text-sm font-semibold transition-colors duration-500 ${
          isExpired
            ? "bg-red-50 border-red-200 text-red-500"
            : urgentRed
              ? "bg-red-50 border-red-200 text-red-600 animate-pulse"
              : "bg-amber-50 border-amber-200 text-amber-700"
        }`}
      >
        <Clock className="w-4 h-4" />
        <span>
          {isExpired ? "Offer expired" : `Offer expires in ${timeLeft}`}
        </span>
      </div>

      {/* Claim button */}
      <button
        type="button"
        onClick={handleClaim}
        disabled={isPending || isExpired}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold text-base shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <CheckCircle className="w-5 h-5" />
        )}
        {isPending
          ? "Claiming your spot..."
          : isExpired
            ? "Offer Expired"
            : "Claim My Spot"}
      </button>
    </div>
  );
}
