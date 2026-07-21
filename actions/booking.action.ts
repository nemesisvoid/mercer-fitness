"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { addToWaitlist, promoteNextOnWaitlist } from "./waitlist.action";
import { sendMail } from "@/utils/send-mail";
// import { revalidatePath } from "next/cache";

export const getBooking = async (bookingId: string) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        class: {
          include: {
            location: true,
          },
        },
      },
    });
    return booking;
  } catch (error) {
    return error;
  }
};

export const getAllBookings = async () => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        class: {
          include: {
            location: true,
            _count: {
              select: {
                Bookings: true,
              },
            },
          },
        },
      },
    });
    return bookings;
  } catch (error) {
    return error;
  }
};

export const createBooking = async (
  classId: string,
  {
    customerEmail,
    customerName,
  }: {
    customerEmail: string;
    customerName: string;
  },
) => {
  try {
    const futureDate = new Date();
    const existingBooking = await prisma.booking.findUnique({
      where: {
        customerEmail_classId: {
          customerEmail: customerEmail,
          classId: classId,
        },
      },
    });

    if (existingBooking) {
      return {
        success: false,
        message: "You have already booked this class",
      };
    }

    const getClass = await prisma.class.findUnique({
      where: {
        id: classId,
      },
      include: {
        _count: {
          select: {
            Bookings: {
              where: { status: "CONFIRMED" },
            },
            waitLists: {
              where: { status: { in: ["WAITING", "OFFERED"] } },
            },
          },
        },
        location: true,
      },
    });

    if (!getClass?.id) throw new Error("Class not found");

    if (getClass.status !== "SCHEDULED") throw new Error("Class is not active");

    if (getClass.startsAt < new Date())
      throw new Error("Class has already started");

    futureDate.setDate(futureDate.getDate() + 7);
    if (getClass.startsAt > futureDate) {
      throw new Error("Class is more than a week away");
    }

    const isFull = getClass._count.Bookings >= getClass.capacity;
    const hasActiveWaitlist = getClass._count.waitLists > 0;

    if (isFull || hasActiveWaitlist) {
      const waitlist = await addToWaitlist(classId, {
        customerName,
        customerEmail,
      });

      const message = isFull
        ? "Class is full, you have been added to the waitlist"
        : "A spot is currently being offered to someone ahead of you. You've been added to the queue.";

      await sendMail({
        to: customerEmail,
        from: process.env.EMAIL_USER!,
        subject: `Waitlist Confirmation: ${getClass.name}`,
        html: `
                            <h1>Waitlist Confirmation</h1>
                            <p>Thank you for joining the waitlist for a class with Mercer Fitness</p>
                            <p>Class: ${getClass.name}</p>
                            <p>Date: ${getClass.startsAt}</p>
                            <p>Time: ${getClass.endsAt}</p>
                            <p>Location: ${getClass.location.name}</p>
                            <p>You will be notified when a spot opens up</p>
                        `,
      });
      // revalidatePath("/schedule");
      // revalidatePath("/bookings");
      // revalidatePath("/classes");
      // revalidatePath("/dashboard");
      return {
        success: true,
        message,
        waitlist,
      };
    }

    const newBooking = await prisma.booking.create({
      data: {
        classId,
        customerName,
        customerEmail,
        cancelToken: crypto.randomUUID(),
        status: "CONFIRMED",
      },
    });

    await sendMail({
      to: customerEmail,
      from: process.env.EMAIL_USER!,
      subject: `Booking Confirmation: ${getClass.name}`,
      html: `
                        <h1>Booking Confirmation</h1>
                        <p>Thank you for booking a class with Mercer Fitness</p>
                        <p>Class: ${getClass.name}</p>
                        <p>Date: ${getClass.startsAt}</p>
                        <p>Location: ${getClass.location.name}</p>
                        <p>Please make sure to arrive early</p>
                        <p>Booking reference: ${newBooking.id}</p>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/booking/${newBooking.id}?cancelToken=${newBooking.cancelToken}">Cancel booking</a>
                    `,
    });

    // revalidatePath("/schedule");
    // revalidatePath("/dashboard");
    // revalidatePath("/bookings");
    // revalidatePath("/classes");
    return { success: true, message: "Booking confirmed", booking: newBooking };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred during booking",
    };
  }
};

export const cancelBooking = async (bookingId: string, cancelToken: string) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
        cancelToken,
      },
      include: {
        class: {
          include: {
            location: true,
          },
        },
      },
    });

    if (!booking) throw new Error("Booking not found");

    if (booking.class.startsAt < new Date(Date.now() + 2 * 60 * 60 * 1000))
      throw new Error(
        "Booking cannot be cancelled less than 2 hours before the class",
      );

    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "CANCELLED",
        cancelToken: null,
      },
    });

    await promoteNextOnWaitlist(booking.classId);

    await sendMail({
      to: booking.customerEmail,
      from: process.env.EMAIL_USER!,
      subject: `Booking Cancelled: ${booking.class.name}`,
      html: `
                <h1>Booking Cancelled</h1>
                <p>Thank you for booking a class with Mercer Fitness</p>
                <p>Class: ${booking.class.name}</p>
                <p>Date: ${booking.class.startsAt}</p>
                <p>Location: ${booking.class.location.name}</p>
                <p>Your booking has been cancelled</p>
            `,
    });

    // revalidatePath("/schedule");
    // revalidatePath("/dashboard");
    // revalidatePath("/bookings");
    // revalidatePath("/classes");
    return { success: true, message: "Booking cancelled" };
  } catch (error) {
    return {
      success: false,
      message: error.message || "An error occurred during cancellation",
    };
  }
};
