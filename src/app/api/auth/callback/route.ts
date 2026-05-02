import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCode } from "@/lib/google-calendar";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", req.url));
  }

  try {
    const tokens = await getTokenFromCode(code);

    if (!tokens.access_token) {
      return NextResponse.redirect(new URL("/?error=no_token", req.url));
    }

    const res = NextResponse.redirect(new URL("/?login=success", req.url));
    const maxAge = 60 * 60 * 24 * 30;

    res.cookies.set("gc_access_token", tokens.access_token, {
      maxAge, httpOnly: true, path: "/", sameSite: "lax",
    });
    if (tokens.refresh_token) {
      res.cookies.set("gc_refresh_token", tokens.refresh_token, {
        maxAge, httpOnly: true, path: "/", sameSite: "lax",
      });
    }
    console.log("✅ Google login success, access_token:", tokens.access_token.slice(0, 20) + "...");
    return res;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("❌ Auth callback error:", msg);
    const url = new URL("/?error=" + encodeURIComponent(msg), req.url);
    return NextResponse.redirect(url);
  }
}
