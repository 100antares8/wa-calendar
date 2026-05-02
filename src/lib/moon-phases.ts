// ============================================================
// 月相・月齢計算
// ============================================================

function toRad(deg: number) { return deg * Math.PI / 180; }

function dateToJD(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + date.getUTCHours() / 24 + date.getUTCMinutes() / 1440;
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

function jdToDate(jd: number): Date {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let A = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    A = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);
  const day = B - D - Math.floor(30.6001 * E) + f;
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;
  const hours = (day - Math.floor(day)) * 24;
  return new Date(Date.UTC(year, month - 1, Math.floor(day), Math.floor(hours)));
}

// 朔（新月）のユリウス日を返す（k は整数）
function getNewMoonJD(k: number): number {
  const T = k / 1236.85;
  const JDE = 2451550.09766
    + 29.530588861 * k
    + 0.00015437 * T * T
    - 0.000000150 * T * T * T
    + 0.00000000073 * T * T * T * T;
  const M  = toRad(2.5534  + 29.10535670 * k - 0.0000014 * T * T);
  const Mp = toRad(201.5643 + 385.81693528 * k + 0.0107582 * T * T);
  const F  = toRad(160.7108 + 390.67050284 * k - 0.0016118 * T * T);
  const Om = toRad(124.7746 - 1.56375588 * k + 0.0020672 * T * T);
  return JDE
    - 0.40720 * Math.sin(Mp)
    + 0.17241 * Math.sin(M)
    + 0.01608 * Math.sin(2 * Mp)
    + 0.01039 * Math.sin(2 * F)
    + 0.00739 * Math.sin(Mp - M)
    - 0.00514 * Math.sin(Mp + M)
    - 0.00111 * Math.sin(2 * F + Mp)
    + 0.00208 * Math.sin(2 * M)
    - 0.00057 * Math.sin(Mp - 2 * F)
    + 0.00056 * Math.sin(2 * Mp + M)
    - 0.00042 * Math.sin(3 * Mp)
    + 0.00042 * Math.sin(M + 2 * F)
    + 0.00038 * Math.sin(M - 2 * F)
    - 0.00024 * Math.sin(2 * Mp - M)
    - 0.00017 * Math.sin(Om)
    - 0.00007 * Math.sin(Mp + 2 * M);
}

// 上弦・満月・下弦のJDを返す（phase: 0.25/0.5/0.75）
function getMoonPhaseJD(k: number, phase: 0.25 | 0.5 | 0.75): number {
  const kp = k + phase;
  const T = kp / 1236.85;
  const JDE = 2451550.09766
    + 29.530588861 * kp
    + 0.00015437 * T * T
    - 0.000000150 * T * T * T;
  const M  = toRad(2.5534  + 29.10535670 * kp - 0.0000014 * T * T);
  const Mp = toRad(201.5643 + 385.81693528 * kp + 0.0107582 * T * T);
  const F  = toRad(160.7108 + 390.67050284 * kp - 0.0016118 * T * T);

  if (phase === 0.5) {
    return JDE
      - 0.40614 * Math.sin(Mp)
      + 0.17302 * Math.sin(M)
      + 0.01614 * Math.sin(2 * Mp)
      + 0.01043 * Math.sin(2 * F)
      + 0.00734 * Math.sin(Mp - M)
      - 0.00515 * Math.sin(Mp + M)
      - 0.00111 * Math.sin(2 * F + Mp)
      + 0.00205 * Math.sin(2 * M);
  }
  const sign = phase === 0.25 ? 1 : -1;
  return JDE
    - 0.62801 * Math.sin(Mp)
    + 0.17172 * Math.sin(M)
    - 0.01183 * Math.sin(Mp + M)
    + 0.00862 * Math.sin(2 * Mp)
    + 0.00804 * Math.sin(2 * F)
    + 0.00454 * Math.sin(Mp - M)
    + 0.00204 * Math.sin(2 * M)
    - 0.00180 * Math.sin(Mp - 2 * F)
    - 0.00070 * Math.sin(Mp + 2 * F)
    - 0.00040 * Math.sin(3 * Mp)
    + sign * (0.00306 - 0.00038 * Math.cos(M));
}

export type MoonPhaseName = "新月" | "上弦" | "満月" | "下弦";

export interface MoonPhaseEvent {
  date: Date;
  jst: Date;
  phase: MoonPhaseName;
  emoji: string;
  age: number;
}

const PHASE_EMOJI: Record<MoonPhaseName, string> = {
  "新月": "🌑", "上弦": "🌓", "満月": "🌕", "下弦": "🌗",
};

// 指定月前後の月相イベントを返す
export function getMoonPhaseEvents(year: number, month: number): MoonPhaseEvent[] {
  const events: MoonPhaseEvent[] = [];
  const kBase = Math.floor((year + (month - 1) / 12 - 2000) * 12.3685);

  for (let k = kBase - 1; k <= kBase + 2; k++) {
    const phases: { phase: MoonPhaseName; jd: number }[] = [
      { phase: "新月", jd: getNewMoonJD(k) },
      { phase: "上弦", jd: getMoonPhaseJD(k, 0.25) },
      { phase: "満月", jd: getMoonPhaseJD(k, 0.5) },
      { phase: "下弦", jd: getMoonPhaseJD(k, 0.75) },
    ];
    for (const { phase, jd } of phases) {
      const utc = jdToDate(jd);
      const jst = new Date(utc.getTime() + 9 * 3600000);
      if (jst.getFullYear() === year && jst.getMonth() + 1 === month) {
        const newMoonJD = getNewMoonJD(k);
        events.push({
          date: utc,
          jst,
          phase,
          emoji: PHASE_EMOJI[phase],
          age: jd - newMoonJD,
        });
      }
    }
  }

  events.sort((a, b) => a.date.getTime() - b.date.getTime());
  return events;
}

// 指定日の月齢を返す
export function getMoonAge(date: Date): number {
  const jd = dateToJD(date) + 9 / 24;
  const k = Math.floor((date.getFullYear() + date.getMonth() / 12 - 2000) * 12.3685);
  for (let i = k - 1; i <= k + 1; i++) {
    const newMoonJD = getNewMoonJD(i) + 9 / 24;
    const age = jd - newMoonJD;
    if (age >= 0 && age < 29.53) return age;
  }
  return 0;
}

// 月の見た目を SVG パスで返す（照らされた面）
export function getMoonIllumination(age: number): number {
  // 0-1: 0=新月, 0.5=満月, 1=新月
  return (1 - Math.cos(2 * Math.PI * age / 29.53)) / 2;
}

export function getMoonPhaseLabel(age: number): { name: string; emoji: string } {
  if (age < 1.5)  return { name: "新月",       emoji: "🌑" };
  if (age < 6)    return { name: "三日月",     emoji: "🌒" };
  if (age < 9)    return { name: "上弦前",     emoji: "🌒" };
  if (age < 12)   return { name: "上弦の月",   emoji: "🌓" };
  if (age < 14)   return { name: "十三夜月",   emoji: "🌔" };
  if (age < 16.5) return { name: "満月",       emoji: "🌕" };
  if (age < 20)   return { name: "十六夜",     emoji: "🌖" };
  if (age < 22)   return { name: "下弦の月",   emoji: "🌗" };
  if (age < 26)   return { name: "有明月",     emoji: "🌘" };
  return { name: "晦（つごもり）", emoji: "🌑" };
}

// 年間の新月・上弦・満月・下弦一覧
export function getMoonEventsForYear(year: number): MoonPhaseEvent[] {
  const events: MoonPhaseEvent[] = [];
  const kStart = Math.floor((year - 2000) * 12.3685) - 1;
  for (let k = kStart; k <= kStart + 14; k++) {
    const phases: { phase: MoonPhaseName; jd: number }[] = [
      { phase: "新月", jd: getNewMoonJD(k) },
      { phase: "上弦", jd: getMoonPhaseJD(k, 0.25) },
      { phase: "満月", jd: getMoonPhaseJD(k, 0.5) },
      { phase: "下弦", jd: getMoonPhaseJD(k, 0.75) },
    ];
    for (const { phase, jd } of phases) {
      const utc = jdToDate(jd);
      const jst = new Date(utc.getTime() + 9 * 3600000);
      if (jst.getFullYear() === year) {
        const newMoonJD = getNewMoonJD(k);
        events.push({
          date: utc,
          jst,
          phase,
          emoji: PHASE_EMOJI[phase],
          age: jd - newMoonJD,
        });
      }
    }
  }
  events.sort((a, b) => a.date.getTime() - b.date.getTime());
  return events;
}
