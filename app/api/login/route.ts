import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  getSessionCookieName,
  getSessionMaxAge,
} from "../../../lib/auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/");
  const expectedPassword = process.env.APP_PASSWORD;
  const sessionSecret = process.env.APP_SESSION_SECRET;

  if (!expectedPassword || !sessionSecret) {
    return NextResponse.redirect(new URL("/login?error=config", request.url));
  }

  if (password !== expectedPassword) {
    const loginUrl = new URL("/login?error=invalid", request.url);
    if (next && next !== "/") {
      loginUrl.searchParams.set("next", next);
    }
    return NextResponse.redirect(loginUrl);
  }

  const token = await createSessionToken(sessionSecret);
  const cookieStore = await cookies();

  cookieStore.set(getSessionCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: getSessionMaxAge(),
  });

  return NextResponse.redirect(new URL(next || "/", request.url));
}
