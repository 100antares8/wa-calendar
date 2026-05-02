import { NextRequest, NextResponse } from "next/server";
import { getMoonPhaseEvents } from "@/lib/moon-phases";
import { getSekkiDatesForYear, getSeason } from "@/lib/japanese-calendar";

export async function GET(req: NextRequest) {
  const year  = parseInt(req.nextUrl.searchParams.get("year")  || String(new Date().getFullYear()));
  const month = parseInt(req.nextUrl.searchParams.get("month") || String(new Date().getMonth() + 1));

  const moonEvents = getMoonPhaseEvents(year, month);
  const sekkiAll   = getSekkiDatesForYear(year);
  const sekkiThisMonth = sekkiAll.filter(s => {
    const jst = new Date(s.date.getTime() + 9 * 3600000);
    return jst.getMonth() + 1 === month;
  });

  // 月の各日情報
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month - 1, i + 1);
    const moonEventsDay = moonEvents.filter(e => e.jst.getDate() === i + 1);
    const sekkiDay = sekkiThisMonth.find(s => {
      const jst = new Date(s.date.getTime() + 9 * 3600000);
      return jst.getDate() === i + 1;
    });
    return {
      day: i + 1,
      weekday: ["日", "月", "火", "水", "木", "金", "土"][date.getDay()],
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      moonEvents: moonEventsDay.map(e => ({ phase: e.phase, emoji: e.emoji,
        time: `${e.jst.getHours().toString().padStart(2,"0")}:${e.jst.getMinutes().toString().padStart(2,"0")}` })),
      sekki: sekkiDay ? { name: sekkiDay.sekki.kanji, reading: sekkiDay.sekki.reading } : null,
      season: getSeason(date).name,
    };
  });

  return NextResponse.json({ year, month, days, moonEvents: moonEvents.map(e => ({
    phase: e.phase, emoji: e.emoji, day: e.jst.getDate(),
    time: `${e.jst.getHours().toString().padStart(2,"0")}:${e.jst.getMinutes().toString().padStart(2,"0")}`,
  })) });
}
