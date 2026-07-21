"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { format, isToday, isTomorrow, isPast, formatDistanceToNow } from "date-fns";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CapacityBadge } from "@/components/ui/CapacityBadge";
import { Card } from "@/components/ui/Card";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { createBooking } from "@/actions/booking.action";
import toast from "react-hot-toast";
import { BookingDialog } from "./BookingDialog";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ScheduleClass({ classData = [] }: { classData?: any[] }) {
  const [modal, setModal] = useState<"booking" | null>(null);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("All locations");
  const [typeFilter, setTypeFilter] = useState("All class types");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const uniqueLocations = Array.from(
    new Set(classData.map((cls) => cls.location).filter(Boolean)),
  );
  const uniqueTypes = Array.from(
    new Set(classData.map((cls) => cls.type).filter(Boolean)),
  );

  const filteredClasses = classData.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      locationFilter === "All locations" || cls.location === locationFilter;
    const matchesType =
      typeFilter === "All class types" || cls.type === typeFilter;
    
    const isUpcoming = cls.startsAt && !isPast(new Date(cls.startsAt));

    return matchesSearch && matchesLocation && matchesType && isUpcoming;
  });

  const totalPages = Math.ceil(filteredClasses.length / ITEMS_PER_PAGE);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleBooking = async (
    classId: string,
    customerName: string,
    customerEmail: string,
  ) => {
    setIsPending(true);
    try {
      const res = await createBooking(classId, {
        customerName,
        customerEmail,
      });

      if (res.success) {
        toast.success("Booking confirmed");
        setModal(null);
        setCustomerName("");
        setCustomerEmail("");
      } else {
        console.log(res.message);
        toast.error(res.message || "Booking failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong, try again later");
      console.log(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white pt-24 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Badge variant="emerald">Weekly schedule</Badge>
              <h1 className="mt-4 font-heading text-4xl font-bold tracking-normal text-slate-950 md:text-5xl">
                Find the right class for your week.
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                Search live capacity, compare class formats, and reserve a spot
                without losing context.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="p-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <label className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Search class, instructor, or studio"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </label>
            <select
              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All locations">All locations</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <select
              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All class types">All class types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          {/* <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {days.map((day, index) => (
              <button
                key={day}
                className={`min-w-20 rounded-xl border px-4 py-3 font-heading text-sm font-medium transition ${index === 0 ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}
              >
                {day}
              </button>
            ))}
          </div> */}
        </Card>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4">
            {filteredClasses.length === 0 ? (
              <Card className="p-8 text-center border border-dashed border-slate-300">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-slate-900">
                  No classes found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  We couldn't find anything matching your current filters.
                </p>
                <Button
                  className="mt-5"
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setLocationFilter("All locations");
                    setTypeFilter("All class types");
                    setCurrentPage(1);
                  }}
                >
                  Reset all filters
                </Button>
              </Card>
            ) : (
              paginatedClasses.map((item, index) => {
                const startsAt = item.startsAt ? new Date(item.startsAt) : null;
                const formattedTime = startsAt
                  ? isPast(startsAt)
                    ? formatDistanceToNow(startsAt, { addSuffix: true })
                    : isToday(startsAt)
                      ? `Today, ${format(startsAt, "h:mm a")}`
                      : isTomorrow(startsAt)
                        ? `Tomorrow, ${format(startsAt, "h:mm a")}`
                        : format(startsAt, "EEE, MMM d, h:mm a")
                  : "—";

                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="grid gap-5 p-4 md:grid-cols-[180px_1fr_auto] md:items-center">
                      <div
                        className={`relative h-36 overflow-hidden rounded-2xl bg-slate-100`}
                      >
                        <Image
                          src={item.image || "/mercer-hero.png"}
                          alt={item.name}
                          fill
                          className="object-cover opacity-90"
                          sizes="180px"
                        />
                        <div className="absolute inset-0 bg-slate-950/15" />
                        <Badge
                          variant="slate"
                          className="absolute left-3 top-3"
                        >
                          {item.type}
                        </Badge>
                      </div>
                      <div>
                        <h2 className="font-heading text-xl font-semibold text-slate-950">
                          {item.name}
                        </h2>
                        <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                          <span className="flex items-center gap-2">
                            <User className="h-4 w-4 text-emerald-600" />{" "}
                            {item.instructor}
                          </span>
                          <span className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-emerald-600" />{" "}
                            {formattedTime}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-emerald-600" />{" "}
                            {item.location}
                          </span>
                          <span className="text-slate-500">
                            60 min · {item.capacity} seats
                          </span>
                        </div>
                        <div className="mt-4 max-w-sm">
                          <CapacityBadge
                            remaining={item.remaining}
                            capacity={item.capacity}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 md:w-36">
                        <Button
                          onClick={() => {
                            setSelectedClass(item);
                            setModal("booking");
                          }}
                          variant={
                            item.remaining === 0 ? "secondary" : "primary"
                          }
                        >
                          {item.remaining === 0 ? "Join Waitlist" : "Book"}
                        </Button>
                        <Button variant="ghost">Details</Button>
                      </div>
                    </div>
                  </motion.article>
                );
              })
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
                <Button
                  variant="secondary"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {modal === "booking" && selectedClass && (
          <BookingDialog
            classData={selectedClass}
            customerName={customerName}
            customerEmail={customerEmail}
            setCustomerName={setCustomerName}
            setCustomerEmail={setCustomerEmail}
            handleBooking={handleBooking}
            isPending={isPending}
            onClose={() => setModal(null)}
            onSuccess={() => {
              setModal(null);
              setCustomerName("");
              setCustomerEmail("");
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
