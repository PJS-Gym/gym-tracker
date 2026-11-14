import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import { uiPreview } from "@/lib/ui-preview";

// Open without signing in: sign-in, sign-up, the public report at /r/<id>, and onboarding, which ends
// by creating the account. Everything else sends a guest to /sign-in?redirect_url=<where they were>,
// and Clerk brings them back there after signing in.
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/r/(.*)", "/onboarding", "/sso-callback"]);

// Set once someone has been signed in on this device, so only a first visit opens the welcome screen.
const RETURNING_COOKIE = "gym-tracker-konto";
const ONE_YEAR = 60 * 60 * 24 * 365;

const clerk = clerkMiddleware(
  async (auth, request) => {
    const { userId } = await auth();
    if (userId) {
      if (request.cookies.has(RETURNING_COOKIE)) return;
      const response = NextResponse.next();
      response.cookies.set(RETURNING_COOKIE, "1", {
        maxAge: ONE_YEAR,
        httpOnly: true,
        sameSite: "lax",
        secure: request.nextUrl.protocol === "https:",
      });
      return response;
    }
    if (isPublicRoute(request)) return;
    if (request.nextUrl.pathname === "/" && !request.cookies.has(RETURNING_COOKIE)) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    await auth.protect();
  },
  { signInUrl: "/sign-in", signUpUrl: "/onboarding" },
);

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  return uiPreview ? NextResponse.next() : clerk(request, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
};
