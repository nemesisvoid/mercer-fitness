"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendMail } from "@/utils/send-mail";

export const getWaitlist = async (id: string, token: string) => {
  try {
    const waitlist = await prisma.waitList.findUnique({
      where: {
        id: id,
        confirmationToken: token,
      },
      include: {
        class: {
          include: {
            location: true,
          },
        },
      },
    });
    return waitlist;
  } catch (error) {
    return error;
  }
};

export const claimWaitlistSpot = async (id: string, token: string) => {
  try {
    const entry = await prisma.waitList.findUnique({
      where: { id, confirmationToken: token },
      include: {
        class: {
          include: { location: true },
        },
      },
    });

    if (!entry) {
      return { success: false, message: "Invalid or expired claim link" };
    }

    if (entry.status === "CONFIRMED") {
      return { success: false, message: "You have already claimed this spot" };
    }

    if (entry.status !== "OFFERED") {
      return { success: false, message: "This offer is no longer available" };
    }

    if (entry.offerExpiresAt && entry.offerExpiresAt < new Date()) {
      return { success: false, message: "This offer has expired" };
    }

    // Create a confirmed booking
    const booking = await prisma.booking.create({
      data: {
        classId: entry.classId,
        customerName: entry.customerName,
        customerEmail: entry.customerEmail,
        cancelToken: crypto.randomUUID(),
        status: "CONFIRMED",
      },
    });

    // Mark waitlist entry as confirmed
    await prisma.waitList.update({
      where: { id },
      data: { status: "CONFIRMED", confirmationToken: null },
    });

    await sendMail({
      to: entry.customerEmail,
      from: process.env.EMAIL_USER!,
      subject: `Booking Confirmed: ${entry.class.name}`,
      html: `
        <h1>You're booked!</h1>
        <p>Hi ${entry.customerName},</p>
        <p>Your spot for <strong>${entry.class.name}</strong> has been confirmed.</p>
        <p>Date: ${new Date(entry.class.startsAt).toLocaleString()}</p>
        <p>Location: ${entry.class.location?.name || "Mercer Fitness"}</p>
        <p>Booking reference: ${booking.id}</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/booking/${booking.id}?cancelToken=${booking.cancelToken}">View or cancel booking</a>
      `,
    });

    revalidatePath("/schedule");
    revalidatePath("/classes");
    revalidatePath("/bookings");
    revalidatePath("/dashboard");
    revalidatePath("/waitlist");

    return { success: true, message: "Spot claimed successfully" };
  } catch (error) {
    console.error("Error claiming waitlist spot:", error);
    return { success: false, message: "Failed to claim spot" };
  }
};

export const getAllWaitListEntries = async () => {
  try {
    const waitList = await prisma.waitList.findMany({
      orderBy: {
        position: "desc",
      },
      include: {
        class: {
          include: {
            location: true,
            _count: {
              select: {
                waitLists: {
                  where: {
                    status: "WAITING",
                  },
                },
              },
            },
          },
        },
      },
    });
    return waitList;
  } catch (error) {
    return error;
  }
};

export const addToWaitlist = async (
  classId: string,
  {
    customerName,
    customerEmail,
  }: { customerName: string; customerEmail: string },
) => {
  try {
    const existingClass = await prisma.class.findUnique({
      where: {
        id: classId,
      },
    });

    if (!existingClass) {
      return {
        success: false,
        message: "Class not found",
      };
    }

    const existingWaitlistEntry = await prisma.waitList.findUnique({
      where: {
        classId_customerEmail: {
          classId: classId,
          customerEmail: customerEmail,
        },
      },
    });

    if (existingWaitlistEntry) {
      return {
        success: false,
        message: "You are already on the waitlist for this class",
      };
    }

    const lastEntry = await prisma.waitList.findFirst({
      where: { classId: classId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const nextPosition = lastEntry ? lastEntry.position + 1 : 1;

    const res = await prisma.waitList.create({
      data: {
        customerEmail: customerEmail,
        customerName: customerName,
        classId: classId,
        position: nextPosition,
        status: "WAITING",
      },
    });
  } catch (err) {
    console.log("an error occured", err);
    return {
      success: false,
      message: "An error occured",
    };
  }
};

export const promoteNextOnWaitlist = async (classId: string) => {
  try {
    const nextPerson = await prisma.waitList.findFirst({
      where: {
        status: "WAITING",
        classId: classId,
      },
      orderBy: {
        position: "asc",
      },
      include: {
        class: {
          include: {
            location: true,
          },
        },
      },
    });

    if (nextPerson) {
      const confirmationToken = crypto.randomUUID();
      await prisma.waitList.update({
        where: { id: nextPerson.id },
        data: {
          status: "OFFERED",
          offerSentAt: new Date(),
          offerExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
          confirmationToken,
        },
      });

      await sendMail({
        to: nextPerson.customerEmail,
        from: process.env.EMAIL_USER!,
        subject: `A spot opened up for ${nextPerson.class.name}!`,
        html: `
                    <h1>Good news! A spot opened up!</h1>
                    <p>Hi ${nextPerson.customerName},</p>
                    <p>A spot has opened up for the class <strong>${nextPerson.class.name}</strong> at ${nextPerson.class.location?.name || "Mercer Fitness"}.</p>
                    <p>You have 30 minutes to claim your spot.</p>
                    <p>Claim your spot here:</p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/waitlist/claim/${nextPerson.id}?token=${confirmationToken}">Claim Reservation</a>
                `,
      });
      return { success: true, message: "Promoted next person on waitlist" };
    }
    return { success: false, message: "No one on waitlist" };
  } catch (error) {
    console.error("Error promoting next on waitlist:", error);
    return { success: false, message: "Error promoting next on waitlist" };
  }
};
