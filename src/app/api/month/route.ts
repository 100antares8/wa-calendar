import { NextRequest, NextResponse } from "next/server";
import { getMoonPhaseEvents } from "@/lib/moon-phases";
import {
  getSekkiDatesForYear,
  getSeason,
  getLunarDate,
  getCurrentSekki,
  getRokuyo,
  getEto,
  LUNAR_DAY_NAMES,
} from "@/lib/japanese-calendar";
import { getMoonAge, getMoonPhaseLabel } from "@/lib/moon-phases";
import { getJstYmd, jstNoonUtc } from "@/lib/jst-date";
import { getJpHolidayName } from "@/lib/jp-holidays";
import { isTenshaDay, isToraDay, isIchiryuManbaiApprox, type SekkiDateEntry } from "@/lib/koyomi-auspicious";

export const dynamic = "force-dynamic";

function shortLunarDay(n: number): string {
  const s = LUNAR_DAY_NAMES[n];
  if (!s) return `${n}日`;
  const i = s.indexOf("（");
  return i > 0 ? s.slice(0, i) : s;
}

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

  const sekkiForTensha: SekkiDateEntry[] = [
    ...getSekkiDatesForYear(year),
    ...getSekkiDatesForYear(year + 1).filter(s => s.sekki.kanji === "立春"),
  ];

  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const jst = { y: year, m: month, d: day };
    const anchor = jstNoonUtc(jst);
    const anchorUtc = new Date(Date.UTC(year, month - 1, day, 3, 0, 0));
    const moonEventsDay = moonEvents.filter(e => e.jst.getDate() === day);
    const sekkiDay = sekkiThisMonth.find(s => {
      const j = getJstYmd(s.date);
      return j.d === day;
    });

    const lunar = getLunarDate(anchor);
    const moonAgeRaw = getMoonAge(anchor);
    const moonAge = Math.round(moonAgeRaw * 10) / 10;
    const moonPhase = getMoonPhaseLabel(moonAgeRaw);
    const currentSekki = getCurrentSekki(anchor);
    const rokuyo = getRokuyo(lunar.lunarMonth, lunar.lunarDay);
    const yearEto = getEto(jst.y);
    const holiday = getJpHolidayName(year, month, day);

    return {
      day,
      weekday: ["日", "月", "火", "水", "木", "金", "土"][anchorUtc.getUTCDay()],
      isWeekend: anchorUtc.getUTCDay() === 0 || anchorUtc.getUTCDay() === 6,
      moonEvents: moonEventsDay.map(e => ({
        phase: e.phase,
        emoji: e.emoji,
        time: `${e.jst.getHours().toString().padStart(2, "0")}:${e.jst.getMinutes().toString().padStart(2, "0")}`,
      })),
      sekki: sekkiDay ? { name: sekkiDay.sekki.kanji, reading: sekkiDay.sekki.reading } : null,
      season: getSeason(anchor).name,
      lunar: {
        lunarYear: lunar.lunarYear,
        lunarMonth: lunar.lunarMonth,
        lunarDay: lunar.lunarDay,
        monthName: lunar.monthName,
        monthReading: lunar.monthReading,
        dayLabel: shortLunarDay(lunar.lunarDay),
      },
      rokuyo: { name: rokuyo.name, color: rokuyo.color },
      yearEto: { eto: yearEto.eto, reading: yearEto.reading },
      moonAge,
      moonPhase: { name: moonPhase.name, emoji: moonPhase.emoji },
      currentSekki: {
        kanji: currentSekki.kanji,
        reading: currentSekki.reading,
        longitude: currentSekki.longitude,
      },
      marks: {
        holiday: holiday,
        tensha: isTenshaDay(jst, sekkiForTensha),
        tora: isToraDay(jst),
        ichimanApprox: isIchiryuManbaiApprox(lunar.lunarMonth, lunar.lunarDay, jst),
      },
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
