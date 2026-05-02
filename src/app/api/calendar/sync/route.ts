import { NextRequest, NextResponse } from "next/server";
import { createCalendarEvents, CALENDAR_COLORS, CalendarEventInput } from "@/lib/google-calendar";
import { getSekkiDatesForYear } from "@/lib/japanese-calendar";
import { getMoonEventsForYear } from "@/lib/moon-phases";

/** Vercel Pro 等で長めの同期を許可（Hobby は最大 10s のまま） */
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const accessToken  = req.cookies.get("gc_access_token")?.value;
  const refreshToken = req.cookies.get("gc_refresh_token")?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: "未認証。Googleログインが必要です。" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const year  = body.year  || new Date().getFullYear();
  const types = body.types || ["sekki", "moon"];

  const events: CalendarEventInput[] = [];

  if (types.includes("sekki")) {
    const sekkiList = getSekkiDatesForYear(year);
    for (const { date, sekki } of sekkiList) {
      const jst = new Date(date.getTime() + 9 * 3600000);
      const dateStr = jst.toISOString().slice(0, 10);
      events.push({
        summary: `【節気】${sekki.kanji}（${sekki.reading}）`,
        description: `二十四節気「${sekki.kanji}」（${sekki.reading}）\n太陽黄経${sekki.longitude}°`,
        date: dateStr,
        colorId: CALENDAR_COLORS.sekki,
      });
    }
  }

  if (types.includes("moon")) {
    const moonEvents = getMoonEventsForYear(year);
    for (const ev of moonEvents) {
      const dateStr = ev.jst.toISOString().slice(0, 10);
      const timeStr = `${ev.jst.getHours().toString().padStart(2, "0")}:${ev.jst.getMinutes().toString().padStart(2, "0")}`;
      events.push({
        summary: `${ev.emoji}${ev.phase}（${timeStr} JST）`,
        description: `${ev.phase}は${dateStr} ${timeStr} JST`,
        date: dateStr,
        colorId: ev.phase === "満月" ? CALENDAR_COLORS.mangetsu : CALENDAR_COLORS.shingetsu,
      });
    }
  }

  try {
    const results = await createCalendarEvents(accessToken, refreshToken, events);
    const ok      = results.filter(r => r.ok).length;
    const failures = results.filter(r => !r.ok);
    const firstError = failures[0]?.error || null;
    console.log("Sync results:", ok, "ok,", failures.length, "fail. First error:", firstError);
    return NextResponse.json({ ok, fail: failures.length, total: events.length, firstError });
  } catch (e) {
    console.error("Sync route error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
