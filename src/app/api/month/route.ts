import { NextRequest, NextResponse } from "next/server";
import { getMoonPhaseEvents } from "@/lib/moon-phases";
import { getSekkiDatesForYear, getSeason } from "@/lib/japanese-calendar";
import { getJstYmd } from "@/lib/jst-date";

export async function GET(req: NextRequest) {
  const jDefault = getJstYmd(new Date());
  const year  = parseInt(req.nextUrl.searchParams.get("year")  || String(jDefault.y), 10);
  const month = parseInt(req.nextUrl.searchParams.get("month") || String(jDefault.m), 10);

  const moonEvents = getMoonPhaseEvents(year, month);
  const sekkiAll = getSekkiDatesForYear(year);
  const sekkiThisMonth = sekkiAll.filter(s => {
    const j = getJstYmd(s.date);
    return j.y === year && j.m === month;
  });

  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const anchor = new Date(Date.UTC(year, month - 1, day, 3, 0, 0));
    const moonEventsDay = moonEvents.filter(e => e.jst.getDate() === day);
    const sekkiDay = sekkiThisMonth.find(s => {
      const j = getJstYmd(s.date);
      return j.d === day;
    });
    return {
      day,
      weekday: ["日", "月", "火", "水", "木", "金", "土"][anchor.getUTCDay()],
      isWeekend: anchor.getUTCDay() === 0 || anchor.getUTCDay() === 6,
      moonEvents: moonEventsDay.map(e => ({
        phase: e.phase,
        emoji: e.emoji,
        time: `${e.jst.getHours().toString().padStart(2, "0")}:${e.jst.getMinutes().toString().padStart(2, "0")}`,
      })),
      sekki: sekkiDay ? { name: sekkiDay.sekki.kanji, reading: sekkiDay.sekki.reading } : null,
      season: getSeason(anchor).name,
    };
  });

  return NextResponse.json({
    year,
    month,
    days,
    moonEvents: moonEvents.map(e => ({
      phase: e.phase,
      emoji: e.emoji,
      day: e.jst.getDate(),
      time: `${e.jst.getHours().toString().padStart(2, "0")}:${e.jst.getMinutes().toString().padStart(2, "0")}`,
    })),
  });
}
