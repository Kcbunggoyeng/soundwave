import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PROTECTED_ROUTES = [
  "/home", "/music", "/playlists", "/favorites",
  "/creator", "/profile", "/subscription", "/superfan",
  "/admin", "/video", "/search",
];

const PUBLIC_ROUTES = ["/", "/login", "/register", "/creator-register"];

export default auth(async (req) => {
  const { nextUrl, auth: session } = req as any;
  const pathname = nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthPage = ["/login", "/register"].some((r) => pathname.startsWith(r));
  const isPublic = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r));

  if (isPublic && !isProtected) return NextResponse.next();

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/home", nextUrl));
  }

  if (!session && isProtected) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)"],
};