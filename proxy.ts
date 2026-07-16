import { NextRequest, NextResponse } from 'next/server';

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();

  const { nextUrl } = req;

  // const session= await
}
