import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PROTECTED_ROUTES = [
  "/home",
  "/music",
  "/playlists",
  "/favorites",
  "/creator",
  "/profile",
  "/account",
  "/subscription",
  "/superfan",
  "/admin",
  "/video",
  "/search",
];

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/creator-register",
];

export default auth(async (req) => {
  const { nextUrl, auth: session } = req as any;
  const pathname = nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthPage = ["/login", "/register"].some((r) => pathname.startsWith(r));
  const isPublic = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r));

  // Sudah login tapi akses halaman auth → redirect ke home
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/home", nextUrl));
  }

  // Belum login tapi akses halaman protected → redirect ke login
  if (!session && isProtected) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Halaman public bebas diakses
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};