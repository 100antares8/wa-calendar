import { NextResponse } from "next/server";
import {
  getLunarDate,
  getSekki,
  getCurrentSekki,
  getRokuyo,
  getSeason,
  getEto,
} from "@/lib/japanese-calendar";
import { getMoonAge, getMoonPhaseLabel } from "@/lib/moon-phases";
import { getCurrentJunishiTime, getFuteijiTime, getKoTen, getTimeOfDay } from "@/lib/traditional-time";
import { getJstYmd, jstNoonUtc, getJstWeekdayLabel, getJstWeekdayLabelLong } from "@/lib/jst-date";

export async function GET() {
  const now = new Date();
  const jst = getJstYmd(now);
  const anchor = jstNoonUtc(jst);

  const lunar = getLunarDate(anchor);
  const moonAge = getMoonAge(now);
  const moonPhase = getMoonPhaseLabel(moonAge);
  const todaySekki = getSekki(now);
  const currentSekki = getCurrentSekki(now);
  const rokuyo = getRokuyo(lunar.lunarMonth, lunar.lunarDay);
  const season = getSeason(anchor);
  const junishiTime = getCurrentJunishiTime(now);
  const futeijiTime = getFuteijiTime(now);
  const koTen = getKoTen(now);
  const timeOfDay = getTimeOfDay(now);
  const yearEto = getEto(jst.y);

  return NextResponse.json({
    now: now.toISOString(),
    jst: {
      y: jst.y,
      m: jst.m,
      d: jst.d,
      weekdayShort: getJstWeekdayLabel(now),
      weekdayLabel: getJstWeekdayLabelLong(now),
    },
    lunar,
    moonAge: Math.round(moonAge * 10) / 10,
    moonPhase,
    todaySekki,
    currentSekki,
    rokuyo,
    season,
    junishiTime,
    futeijiTime,
    koTen,
    timeOfDay,
    yearEto,
  });
}
