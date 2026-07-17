import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { promoteNextOnWaitlist } from "@/actions/waitlist.action";

export async function GET(request: Request) {
  // Security check to ensure only Vercel can trigger this route
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const expiredWaitlist = await prisma.waitList.findMany({
      where: {
        status: "OFFERED",
        offerExpiresAt: { lt: new Date() },
      },
    });

    for (const entry of expiredWaitlist) {
      await prisma.waitList.update({
        where: { id: entry.id },
        data: { status: "EXPIRED" },
      });

      await promoteNextOnWaitlist(entry.classId);
    }

    return NextResponse.json({
      success: true,
      processed: expiredWaitlist.length,
    });
  } catch (error) {
    console.error("Error processing waitlist cron:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 },
    );
  }
}
