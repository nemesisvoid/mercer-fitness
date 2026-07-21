"use server";

import { prisma } from "@/lib/prisma";
import { ClassFormValues, classSchema } from "@/schemas";
import { sendMail } from "@/utils/send-mail";
import { revalidatePath } from "next/cache";

export const createClass = async (
  userId: string,
  classData: ClassFormValues,
) => {
  try {
    if (!userId) throw new Error("Unauthorized");

    const validatedData = classSchema.safeParse(classData);

    if (!validatedData.success) {
      throw new Error("Invalid class data");
    }

    await prisma.class.create({
      data: {
        name: validatedData.data.name,
        type: validatedData.data.type,
        instructor: validatedData.data.instructor,
        description: validatedData.data.description,
        image: validatedData.data.image,
        capacity: validatedData.data.capacity,
        status: validatedData.data.status,
        locationId: validatedData.data.locationId,
        startsAt: validatedData.data.startsAt,
        endsAt: validatedData.data.endsAt || undefined,
      },
    });

    revalidatePath("/schedule");
    revalidatePath("/classes");
    revalidatePath("/dashboard");
    return { success: true, message: "class created suscessfully" };
  } catch (error) {
    console.error("Error creating class:", error);
    return { success: false, message: "Failed to create class" };
  }
};

export const updateClass = async (
  classId: string,
  classData: ClassFormValues,
) => {
  const startsAtDate = new Date(classData.startsAt);

  const now = new Date();
  const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  // 1. Prevent cancellation if less than 2 hours away, or already started
  if (classData.status === "CANCELLED" && startsAtDate < twoHoursFromNow) {
    throw new Error(
      "Class cannot be cancelled less than 2 hours before it starts",
    );
  }

  // 2. Prevent completion if the class is still in the future
  if (classData.status === "COMPLETED" && startsAtDate > now) {
    throw new Error("Class cannot be marked as completed before it starts");
  }

  try {
    const data = await prisma.class.update({
      where: {
        id: classId,
      },
      data: {
        name: classData.name,
        type: classData.type,
        instructor: classData.instructor,
        description: classData.description,
        image: classData.image,
        capacity: classData.capacity,
        status: classData.status,
        locationId: classData.locationId,
        startsAt: classData.startsAt,
        endsAt: classData.endsAt || undefined,
      },
    });

    if (data.status === "CANCELLED") {
      const bookings = await prisma.booking.findMany({
        where: {
          classId: classId,
          status: "CONFIRMED",
        },
      });

      for (const booking of bookings) {
        await sendMail({
          to: booking.customerEmail,
          from: process.env.EMAIL_USER!,
          subject: `Class Cancellation: ${data.name}`,
          html: `
            <h1>Class Cancellation</h1>
            <p>Dear ${booking.customerName},</p>
            <p>We regret to inform you that the class <strong>${data.name}</strong> scheduled for ${new Date(data.startsAt).toLocaleString()} has been cancelled.</p>
            <p>We apologize for any inconvenience.</p>
          `,
        });
      }
    }
    revalidatePath("/schedule");
    revalidatePath("/classes");
    revalidatePath("/dashboard");
    return { success: true, message: "class updated successfully" };
  } catch (error) {
    console.error("Error updating class:", error);
    return { success: false, message: "Failed to update class" };
  }
};

export const deleteClass = async (userId: string, classId: string) => {
  try {
    if (!userId) throw new Error("Unauthorized");

    const existingClass = await prisma.class.findUnique({
      where: {
        id: classId,
      },
    });

    if (!existingClass) throw new Error("Class not found");

    await prisma.class.delete({
      where: {
        id: classId,
      },
    });

    revalidatePath("/schedule");
    revalidatePath("/classes");
    revalidatePath("/dashboard");
    return { message: "class deleted successfully" };
  } catch (error) {
    console.error("Error deleting class:", error);
    throw new Error("Failed to delete class");
  }
};

export const cancelClass = async (userId: string, classId: string) => {
  try {
    if (!userId) throw new Error("Unauthorized");

    const existingClass = await prisma.class.findUnique({
      where: {
        id: classId,
      },
    });

    if (!existingClass) throw new Error("Class not found");

    await prisma.class.update({
      where: {
        id: classId,
      },
      data: {
        status: "CANCELLED",
      },
    });

    revalidatePath("/schedule");
    revalidatePath("/classes");
    revalidatePath("/dashboard");
    return { message: "class cancelled successfully" };
  } catch (error) {
    console.error("Error cancelling class:", error);
    throw new Error("Failed to cancel class");
  }
};

export const getAllClasses = async () => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        location: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            Bookings: {
              where: {
                status: "CONFIRMED",
              },
            },
          },
        },
      },
      orderBy: {
        startsAt: "asc",
      },
    });

    const classData = classes.map((cls) => {
      const remaining = cls.capacity - cls._count.Bookings;
      return {
        ...cls,
        remaining,
      };
    });

    return { success: true, data: classData };
  } catch (error) {
    console.error("Error fetching classes:", error);
    return { success: false, error: "Failed to fetch classes" };
  }
};

export const getClassById = async (classId: string) => {
  try {
    const cls = await prisma.class.findUnique({
      where: {
        id: classId,
      },
      include: {
        location: true,
        Bookings: {
          orderBy: { createdAt: "desc" },
        },
        waitLists: {
          orderBy: { position: "asc" },
        },
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
      },
    });

    if (!cls) return { success: false, error: "Class not found" };

    const remaining = cls.capacity - cls._count.Bookings;
    return { success: true, data: { ...cls, remaining } };
  } catch (error) {
    console.error("Error fetching class:", error);
    return { success: false, error: "Failed to fetch class" };
  }
};

export const deleteClassImage = async (fileKey: string) => {
  try {
    const res = await fetch("/api/uploadthing/delete", {
      method: "POST",
      body: JSON.stringify({ fileKey }),
    });
    if (!res.ok) {
      throw new Error("Delete failed");
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file");
  }
};
