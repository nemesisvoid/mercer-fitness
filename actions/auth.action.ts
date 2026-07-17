"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const signInUser = async (email: string, password: string) => {
  try {
    const res = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });

    return { success: true, data: res };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return { success: false, error: error.message || "Failed to sign in" };
  }
};