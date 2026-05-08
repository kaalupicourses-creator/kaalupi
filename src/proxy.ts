import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/access(.*)",
  "/onboarding",
  "/api/ai(.*)",
  "/api/checkout(.*)",
  "/api/code-review(.*)",
  "/api/course-materials(.*)",
  "/api/materials(.*)",
  "/api/certificates(.*)",
  "/api/blog(.*)",
]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/register(.*)",
  "/courses(.*)",
  "/about",
  "/blog(.*)",
  "/contact",
  "/komunitas",
  "/waitlist",
  "/notify",
  "/api/contact",
  "/api/waitlist",
  "/api/founding-slot(.*)",
  "/api/payment(.*)",
  "/api/cron(.*)",
]);

export const proxy = clerkMiddleware(async (auth, req) => {
  const session = await auth();
  const { userId } = session;

  if (!isPublicRoute(req) && !isProtectedRoute(req)) {
    return;
  }

  if (isProtectedRoute(req) && !userId) {
    return session.redirectToSignIn({ returnBackUrl: req.url });
  }

  if (userId && req.nextUrl.pathname === "/") {
    return;
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
