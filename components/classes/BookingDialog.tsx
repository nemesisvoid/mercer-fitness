import { DialogShell } from "@/components/ui/DialogShell";
import { Button } from "@/components/ui/Button";

export function BookingDialog({
  classData,
  customerEmail,
  customerName,
  setCustomerName,
  setCustomerEmail,
  handleBooking,
  isPending,
  onClose,
}: {
  classData: any;
  setCustomerName: (name: string) => void;
  setCustomerEmail: (email: string) => void;
  customerName: string;
  customerEmail: string;
  handleBooking: (
    classId: string,
    customerName: string,
    customerEmail: string,
  ) => void;
  isPending?: boolean;
  onClose: () => void;
}) {
  return (
    <DialogShell
      onClose={onClose}
      title={classData.remaining === 0 ? `Join Waitlist for ${classData.name}` : `Book ${classData.name}`}
      description={classData.remaining === 0 ? "This class is full. Add your name to the waitlist and we'll notify you if a spot opens up." : "Book you spot."}
    >
      <form
        className="mt-6 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          handleBooking(classData.id, customerName, customerEmail);
        }}
      >
        <input
          required
          className="h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
          placeholder="Full name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          disabled={isPending}
        />
        <input
          required
          type="email"
          className="h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
          placeholder="Email address"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          disabled={isPending}
        />
        <Button className="mt-2 w-full" disabled={isPending}>
          {isPending 
            ? "Processing..." 
            : classData.remaining === 0 
              ? "Join Waitlist" 
              : "Confirm Booking"}
        </Button>
      </form>
    </DialogShell>
  );
}
