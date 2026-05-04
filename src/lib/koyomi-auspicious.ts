/**
 * 暦注（参考表示）
 * 天赦日：季節区間ごとの特定の干支日
 * 寅の日：日支が寅
 * 一粒万倍日：通書の算法は複数あるため、ここでは「日支が子かつ六曜が大安」を目安として表示（公式告知と異なる場合があります）
 */

import { JIKKAN, JUNISHI, getRokuyo } from "@/lib/japanese-calendar";
import { jstNoonUtc } from "@/lib/jst-date";

export type SekkiDateEntry = { date: Date; sekki: { kanji: string; reading: string; longitude: number; name: string } };

function noonTs(jst: { y: number; m: number; d: number }): number {
  return jstNoonUtc(jst).getTime();
}

function tenshaSeason(
  jst: { y: number; m: number; d: number },
  sekkiList: SekkiDateEntry[],
): "spring" | "summer" | "autumn" | "winter" | null {
  const t = noonTs(jst);
  const pick = (kanji: string) => sekkiList.find(s => s.sekki.kanji === kanji)?.date.getTime();
  const risshun = pick("立春");
  const rikka = pick("立夏");
  const risshu = pick("立秋");
  const ritto = pick("立冬");
  if (!risshun || !rikka || !risshu || !ritto) return null;
  if (t >= risshun && t < rikka) return "spring";
  if (t >= rikka && t < risshu) return "summer";
  if (t >= risshu && t < ritto) return "autumn";
  return "winter";
}

export function isTenshaDay(jst: { y: number; m: number; d: number }, sekkiList: SekkiDateEntry[]): boolean {
  const { kan, shi } = getDayPillar(jst.y, jst.m, jst.d);
  const season = tenshaSeason(jst, sekkiList);
  if (!season) return false;
  if (season === "spring") return kan === "戊" && shi === "寅";
  if (season === "summer") return kan === "甲" && shi === "午";
  if (season === "autumn") return kan === "戊" && shi === "申";
  return kan === "甲" && shi === "子";
}

export function gregorianToJulianDayNumber(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  );
}

export function getDayPillar(y: number, m: number, d: number): { kan: string; shi: string } {
  const jdn = gregorianToJulianDayNumber(y, m, d);
  const idx = ((jdn + 49) % 60 + 60) % 60;
  return { kan: JIKKAN[idx % 10], shi: JUNISHI[idx % 12] };
}

export function isToraDay(jst: { y: number; m: number; d: number }): boolean {
  return getDayPillar(jst.y, jst.m, jst.d).shi === "寅";
}

export function isIchiryuManbaiApprox(lunarMonth: number, lunarDay: number, jst: { y: number; m: number; d: number }): boolean {
  const { shi } = getDayPillar(jst.y, jst.m, jst.d);
  const rokuyo = getRokuyo(lunarMonth, lunarDay);
  return shi === "子" && rokuyo.name === "大安";
}
