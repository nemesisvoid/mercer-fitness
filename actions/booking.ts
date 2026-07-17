"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { addToWaitlist, promoteNextOnWaitlist } from "./waitlist.action";
import { sendMail } from "@/utils/send-mail";

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

export const createBooking = async (
  userId: string,
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
    if (!userId) throw new Error("Unauthorized");

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
            Bookings: true,
          },
        },
      },
    });

    if (!getClass?.id) throw new Error("Class not found");

    if (getClass.status !== "SCHEDULED") throw new Error("Class is not active");

    if (getClass.startsAt < new Date())
      throw new Error("Class has already started");

    if (getClass._count.Bookings >= getClass.capacity) {
      const waitlist = await addToWaitlist(classId, {
        customerName,
        customerEmail,
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
                            <p>Time: ${getClass.endsAt}</p>
                            <p>Location: ${getClass.location.name}</p>
                            <p>Please make sure to arrive early</p>
                        `,
      });
      return {
        success: true,
        message: "Class is full, you have been added to the waitlist",
        waitlist,
      };
    }

    const newBooking = await prisma.booking.create({
      data: {
        userId,
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
                        <p>Time: ${getClass.endsAt}</p>
                        <p>Location: ${getClass.location.name}</p>
                        <p>Please make sure to arrive early</p>
                        <p>Booking reference: ${newBooking.id}</p>
                        <p>Cancel booking </p>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/bookings/${newBooking.id}?cancelToken=${newBooking.cancelToken}">Cancel booking</a>
                    `,
    });

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

    return { success: true, message: "Booking cancelled" };
  } catch (error) {
    return {
      success: false,
      message: error.message || "An error occurred during cancellation",
    };
  }
};
