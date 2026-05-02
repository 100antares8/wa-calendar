import { NextRequest, NextResponse } from "next/server";
import { exclusiveEndDateForAllDay, getOAuth2Client } from "@/lib/google-calendar";
import { google } from "googleapis";

export async function GET(req: NextRequest) {
  const accessToken  = req.cookies.get("gc_access_token")?.value;
  const refreshToken = req.cookies.get("gc_refresh_token")?.value;

  if (!accessToken) return NextResponse.json({ authed: false, error: "no access token" });

  try {
    const oauth2 = getOAuth2Client();
    oauth2.setCredentials({ access_token: accessToken, refresh_token: refreshToken || undefined });
    const calendar = google.calendar({ version: "v3", auth: oauth2 });

    // 1件だけテスト挿入
    const testStart = "2026-01-01";
    const testEvent = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: "【テスト】和暦同期テスト",
        start: { date: testStart },
        end: { date: exclusiveEndDateForAllDay(testStart) },
      },
    });

    // 成功したら削除
    await calendar.events.delete({ calendarId: "primary", eventId: testEvent.data.id! });

    return NextResponse.json({ authed: true, tokenOk: true, message: "テスト成功" });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ authed: true, tokenOk: false, error: msg });
  }
}
