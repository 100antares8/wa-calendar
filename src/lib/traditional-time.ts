// ============================================================
// 日本の伝統的な時刻体系
// 不定時法（江戸時代）・定時法・十二支時・刻・更
// ※ 表示はすべて日本標準時（JST）の時刻に基づく
// ============================================================

import { getJstYmd, getJstClock, getJstDecimalHour, jstNoonUtc } from "@/lib/jst-date";

// ---- 十二支の刻（定時法・明治以降基準） ----------------------------------------
export interface JunishiTime {
  junishi: string;
  reading: string;
  animal: string;
  start: number; // 時（0-23）
  end: number;
  period: string; // "夜半" など
  color: string;
}

export const JUNISHI_TIMES: JunishiTime[] = [
  { junishi: "子", reading: "ね",   animal: "鼠", start: 23, end:  1, period: "夜半",   color: "#1e3a5f" },
  { junishi: "丑", reading: "うし", animal: "牛", start:  1, end:  3, period: "鶏鳴",   color: "#2d4a7a" },
  { junishi: "寅", reading: "とら", animal: "虎", start:  3, end:  5, period: "平旦",   color: "#3d5a8a" },
  { junishi: "卯", reading: "う",   animal: "兔", start:  5, end:  7, period: "日出",   color: "#f97316" },
  { junishi: "辰", reading: "たつ", animal: "龍", start:  7, end:  9, period: "食時",   color: "#eab308" },
  { junishi: "巳", reading: "み",   animal: "蛇", start:  9, end: 11, period: "隅中",   color: "#84cc16" },
  { junishi: "午", reading: "うま", animal: "馬", start: 11, end: 13, period: "日中",   color: "#ef4444" },
  { junishi: "未", reading: "ひつじ", animal: "羊", start: 13, end: 15, period: "日昳",   color: "#f59e0b" },
  { junishi: "申", reading: "さる", animal: "猿", start: 15, end: 17, period: "哺時",   color: "#10b981" },
  { junishi: "酉", reading: "とり", animal: "鶏", start: 17, end: 19, period: "日入",   color: "#8b5cf6" },
  { junishi: "戌", reading: "いぬ", animal: "犬", start: 19, end: 21, period: "黄昏",   color: "#6366f1" },
  { junishi: "亥", reading: "い",   animal: "猪", start: 21, end: 23, period: "人定",   color: "#3730a3" },
];

export function getCurrentJunishiTime(date: Date): JunishiTime & { koku: number; subKoku: string } {
  const { hour: h, minute } = getJstClock(date);
  const min = minute;
  for (const jt of JUNISHI_TIMES) {
    const inRange = jt.start === 23
      ? h >= 23 || h < 1
      : h >= jt.start && h < jt.end;
    if (inRange) {
      const minFromStart = jt.start === 23
        ? h >= 23 ? (h - 23) * 60 + min : (h + 1) * 60 + min
        : (h - jt.start) * 60 + min;
      const koku = Math.floor(minFromStart / 30) + 1;
      const subKokuNames = ["", "一ノ刻", "二ノ刻", "三ノ刻", "四ノ刻"];
      return { ...jt, koku, subKoku: subKokuNames[Math.min(koku, 4)] };
    }
  }
  return { ...JUNISHI_TIMES[0], koku: 1, subKoku: "一ノ刻" };
}

/** 和時計盤：上向きの指に合わせて十二支リングが回るときの SVG 回転角（度・時計回りが正） */
export function getJunishiDiskRotationDegrees(date: Date): number {
  const jt = getCurrentJunishiTime(date);
  const { hour: h, minute: min } = getJstClock(date);
  const idxRaw = JUNISHI_TIMES.findIndex(x => x.junishi === jt.junishi);
  const idx = idxRaw >= 0 ? idxRaw : 0;
  const def = JUNISHI_TIMES[idx];
  const minFromStart = def.start === 23
    ? h >= 23 ? (h - 23) * 60 + min : (h + 1) * 60 + min
    : (h - def.start) * 60 + min;
  const frac = Math.min(1, Math.max(0, minFromStart / 120));
  return -(idx + frac) * 30;
}

// ---- 不定時法（江戸時代の時刻体系） ----------------------------------------
export interface FuteijiTime {
  name: string;
  reading: string;
  junishi: string;
  bellCount: number;
  isDay: boolean;
}

export const FUTEIJI_DAY: FuteijiTime[] = [
  { name: "明六つ", reading: "あけむつ",   junishi: "卯", bellCount: 6, isDay: true },
  { name: "朝五つ", reading: "あさいつつ", junishi: "辰", bellCount: 5, isDay: true },
  { name: "朝四つ", reading: "あさよつ",   junishi: "巳", bellCount: 4, isDay: true },
  { name: "昼九つ", reading: "ひるここのつ",junishi: "午", bellCount: 9, isDay: true },
  { name: "昼八つ", reading: "ひるやつ",   junishi: "未", bellCount: 8, isDay: true },
  { name: "夕七つ", reading: "ゆうなな",   junishi: "申", bellCount: 7, isDay: true },
];

export const FUTEIJI_NIGHT: FuteijiTime[] = [
  { name: "暮六つ", reading: "くれむつ",   junishi: "酉", bellCount: 6, isDay: false },
  { name: "夜五つ", reading: "よいつつ",   junishi: "戌", bellCount: 5, isDay: false },
  { name: "夜四つ", reading: "よよつ",     junishi: "亥", bellCount: 4, isDay: false },
  { name: "夜九つ", reading: "よここのつ", junishi: "子", bellCount: 9, isDay: false },
  { name: "夜八つ", reading: "よやつ",     junishi: "丑", bellCount: 8, isDay: false },
  { name: "暁七つ", reading: "あかつきなな",junishi: "寅", bellCount: 7, isDay: false },
];

// 東京の緯度・経度で日の出・日の入りを近似計算（JST 当日の暦日で dayOfYear を求める）
function getSunriseSunset(jst: { y: number; m: number; d: number }, lat = 35.6762, lon = 139.6503): { sunrise: number; sunset: number } {
  const noon = jstNoonUtc(jst);
  const jan1 = jstNoonUtc({ y: jst.y, m: 1, d: 1 });
  const dayOfYear = Math.round((noon.getTime() - jan1.getTime()) / 86400000) + 1;
  const B = (360 / 365) * (dayOfYear - 81) * (Math.PI / 180);
  const EqT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  const decl = 23.45 * Math.sin(B) * (Math.PI / 180);
  const latRad = lat * (Math.PI / 180);
  const cosHour = (Math.cos(90.833 * Math.PI / 180) - Math.sin(latRad) * Math.sin(decl))
    / (Math.cos(latRad) * Math.cos(decl));
  const hour = Math.acos(Math.max(-1, Math.min(1, cosHour))) * (180 / Math.PI) / 15;
  const solarNoon = 12 - EqT / 60 - (lon - 135) / 15; // JST
  return { sunrise: solarNoon - hour, sunset: solarNoon + hour };
}

export function getFuteijiTime(date: Date): { current: FuteijiTime; progress: number; nextChange: string } {
  const jst = getJstYmd(date);
  const { sunrise, sunset } = getSunriseSunset(jst);
  const h = getJstDecimalHour(date);
  const dayLen = sunset - sunrise;
  const nightLen = 24 - dayLen;
  const dayUnit = dayLen / 6;
  const nightUnit = nightLen / 6;

  let current: FuteijiTime;
  let progress: number;

  if (h >= sunrise && h < sunset) {
    const idx = Math.min(Math.floor((h - sunrise) / dayUnit), 5);
    current = FUTEIJI_DAY[idx];
    progress = ((h - sunrise) % dayUnit) / dayUnit;
  } else {
    const nightH = h >= sunset ? h - sunset : h + (24 - sunset);
    const idx = Math.min(Math.floor(nightH / nightUnit), 5);
    current = FUTEIJI_NIGHT[idx];
    progress = (nightH % nightUnit) / nightUnit;
  }

  return { current, progress, nextChange: "" };
}

// ---- 更（こう）・点（てん） ----------------------------------------
export function getKoTen(date: Date): { ko: number; ten: number; name: string } {
  const jst = getJstYmd(date);
  const { sunset } = getSunriseSunset(jst);
  const nextJst = { ...jst };
  const n = new Date(jstNoonUtc(jst).getTime() + 86400000);
  const jn = getJstYmd(n);
  nextJst.y = jn.y;
  nextJst.m = jn.m;
  nextJst.d = jn.d;
  const { sunrise: nextSunrise } = getSunriseSunset(nextJst);
  const h = getJstDecimalHour(date);
  const nightLen = (24 - sunset) + nextSunrise;

  let nightH: number;
  if (h >= sunset) nightH = h - sunset;
  else if (h < nextSunrise) nightH = h + (24 - sunset);
  else return { ko: 0, ten: 0, name: "昼間" };

  if (nightH >= nightLen) return { ko: 0, ten: 0, name: "昼間" };

  const unitLen = nightLen / 5;
  const ko = Math.floor(nightH / unitLen) + 1;
  const ten = Math.floor((nightH % unitLen) / (unitLen / 5)) + 1;
  const koNames = ["", "一更", "二更", "三更", "四更", "五更"];
  return { ko, ten, name: `${koNames[ko]}${ten}点` };
}

// ---- 寺の鐘の回数 ----------------------------------------
export function getBellCount(junishi: string): number {
  const map: Record<string, number> = {
    "子": 9, "丑": 8, "寅": 7, "卯": 6, "辰": 5, "巳": 4,
    "午": 9, "未": 8, "申": 7, "酉": 6, "戌": 5, "亥": 4,
  };
  return map[junishi] || 6;
}

// ---- 時刻の和名（時間帯の呼び方） ----------------------------------------
export const TIME_OF_DAY_NAMES: { from: number; to: number; name: string; reading: string; description: string }[] = [
  { from:  0, to:  2, name: "夜半",   reading: "やはん",     description: "夜の半ば。静寂の時" },
  { from:  2, to:  4, name: "暁",     reading: "あかつき",   description: "夜明け前の暗い時間" },
  { from:  4, to:  6, name: "夜明け", reading: "よあけ",     description: "夜が明け始める頃" },
  { from:  6, to:  8, name: "朝",     reading: "あさ",       description: "朝の清々しい時間" },
  { from:  8, to: 10, name: "午前",   reading: "ごぜん",     description: "朝の仕事の時間" },
  { from: 10, to: 12, name: "巳の刻", reading: "みのこく",   description: "午前中の終わり" },
  { from: 12, to: 14, name: "午",     reading: "うま",       description: "真昼。太陽が頂点" },
  { from: 14, to: 16, name: "昼下がり", reading: "ひるさがり", description: "午後の穏やかな時間" },
  { from: 16, to: 18, name: "夕",     reading: "ゆう",       description: "夕暮れ近く" },
  { from: 18, to: 20, name: "黄昏",   reading: "たそがれ",   description: "薄暗くなる夕方" },
  { from: 20, to: 22, name: "宵",     reading: "よい",       description: "夜の初め" },
  { from: 22, to: 24, name: "夜",     reading: "よる",       description: "深夜に向かう時間" },
];

export function getTimeOfDay(date: Date): typeof TIME_OF_DAY_NAMES[0] {
  const h = getJstClock(date).hour;
  return TIME_OF_DAY_NAMES.find(t => h >= t.from && h < t.to) || TIME_OF_DAY_NAMES[0];
}
