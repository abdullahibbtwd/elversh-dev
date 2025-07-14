import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const url = req.nextUrl;
 console.log("userId:", userId);
  console.log("sessionClaims:", sessionClaims);
 
 
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  console.log("role:", role);
  // Block unauthenticated users from /admin
  if (!userId && url.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

 
  if (
    userId &&
    url.pathname.startsWith("/admin") &&
    role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/admin(.*)',
    // Exclude Clerk auth routes
    '/((?!_next|sign-in|sign-up|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
