import { NextResponse } from "next/server";
import { getLunarDate, getSekki, getCurrentSekki, getRokuyo, getSeason, getEto } from "@/lib/japanese-calendar";
import { getMoonAge, getMoonPhaseLabel } from "@/lib/moon-phases";
import { getCurrentJunishiTime, getFuteijiTime, getKoTen, getTimeOfDay } from "@/lib/traditional-time";

export async function GET() {
  const now = new Date();
  const lunar = getLunarDate(now);
  const moonAge = getMoonAge(now);
  const moonPhase = getMoonPhaseLabel(moonAge);
  const todaySekki = getSekki(now);
  const currentSekki = getCurrentSekki(now);
  const rokuyo = getRokuyo(lunar.lunarMonth, lunar.lunarDay);
  const season = getSeason(now);
  const junishiTime = getCurrentJunishiTime(now);
  const futeijiTime = getFuteijiTime(now);
  const koTen = getKoTen(now);
  const timeOfDay = getTimeOfDay(now);
  const yearEto = getEto(now.getFullYear());

  return NextResponse.json({
    now: now.toISOString(),
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
