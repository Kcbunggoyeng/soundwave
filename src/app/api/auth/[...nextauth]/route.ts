// src/app/api/auth/[...nextauth]/route.ts
// Satu file ini menangani SEMUA auth routes:
// GET/POST /api/auth/signin
// GET/POST /api/auth/signout
// GET/POST /api/auth/callback/google
// GET/POST /api/auth/session
// dll.

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
