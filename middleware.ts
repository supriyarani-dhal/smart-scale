import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoute = createRouteMatcher(["/", "/sign-in", "/sign-up", "/home"]);

const publicApiRoute = createRouteMatcher(["/api/videos"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currUrl = new URL(req.url);
  const isAccessingDashboard = currUrl.pathname === "/";
  const isAccessingHome = currUrl.pathname === "/home";
  const isApiRequest = currUrl.pathname.startsWith("/api");

  //if user is logged in then redirect them to home page
  if (userId && publicRoute(req) && !isAccessingHome) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  //if not logged in
  if (!userId) {
    //if the user is trying to access the protected route
    if (!publicRoute(req) && !publicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    //if the user is trying to access the protected api route
    if (isApiRequest && !publicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    //if the user is trying to access the dashboard
    if (isAccessingDashboard) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
