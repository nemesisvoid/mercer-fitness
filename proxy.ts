import { NextRequest, NextResponse } from 'next/server';
import { adminRoutes, apiRoutes, authRoutes } from './routes';
import { auth } from './lib/auth';

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();

  
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const isLoggedIn= !!session;
  const isLoggedInUserAdmin= session?.user.role === 'ADMIN'

  const { nextUrl } = req;

  const isAdminRoute= adminRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isAuthRoute= authRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isApiAuthRoute= nextUrl.pathname.startsWith(apiRoutes);

  if(isApiAuthRoute) return res

  if(isAdminRoute){
    // If not logged in, send to auth page
    if(!isLoggedIn) return NextResponse.redirect(new URL('/auth', nextUrl));
    // If logged in but NOT admin, send to homepage (or non-admin dashboard) to prevent loop
    if(isLoggedIn && !isLoggedInUserAdmin) return NextResponse.redirect(new URL('/', nextUrl));
  }

  if(isAuthRoute){
    // If admin is logged in, send to dashboard
    if(isLoggedIn && isLoggedInUserAdmin) {return NextResponse.redirect(new URL('/dashboard', nextUrl))}
    // If normal user is logged in, send to home page (prevents loop)
    if(isLoggedIn && !isLoggedInUserAdmin) {return NextResponse.redirect(new URL('/', nextUrl))}
  }

  return res;
}


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
