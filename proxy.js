import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth(async function middleware(req) {}, {
  isReturnToCurrentPage: true,
  protectedPaths: ["/tools", "/tools/(.*)"],
  publicPaths: ["/", "/#ai-content"],
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}