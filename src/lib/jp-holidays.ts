/** 日本の祝日（振替休日・ハッピーマンデー含む、2024–2032 年中心の静的定義） */

export function getJpHolidayName(y: number, m: number, d: number): string | null {
  const key = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  return JP_HOLIDAYS[key] ?? null;
}

const JP_HOLIDAYS: Record<string, string> = {};

function add(y: number, m: number, d: number, name: string) {
  JP_HOLIDAYS[`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`] = name;
}

function nthMonday(y: number, month: number, n: number): number {
  let count = 0;
  for (let d = 1; d <= 31; d++) {
    const t = new Date(Date.UTC(y, month - 1, d, 12, 0, 0));
    if (t.getUTCMonth() !== month - 1) break;
    if (t.getUTCDay() === 1) {
      count++;
      if (count === n) return d;
    }
  }
  return 0;
}

function springEquinox(y: number): number {
  if (y % 4 === 0 && y % 100 !== 0) return 20;
  if (y % 4 === 2 || y % 4 === 1) return 20;
  return 21;
}

function autumnEquinox(y: number): number {
  const r = y % 4;
  if (r === 0 && y % 100 !== 0) return 22;
  if (r === 3 || r === 2) return 23;
  return 23;
}

/** 日曜なら翌平日へ振替（最大で火曜まで想定） */
function addWithSubstitute(y: number, m: number, d: number, name: string) {
  const wd = new Date(Date.UTC(y, m - 1, d, 12, 0, 0)).getUTCDay();
  if (wd !== 0) {
    add(y, m, d, name);
    return;
  }
  for (let k = 1; k <= 3; k++) {
    const dd = d + k;
    const t = new Date(Date.UTC(y, m - 1, dd, 12, 0, 0));
    if (t.getUTCMonth() !== m - 1) break;
    const w = t.getUTCDay();
    if (w === 0 || getJpHolidayName(y, m, dd)) continue;
    add(y, m, dd, "振替休日");
    return;
  }
  add(y, m, d, name);
}

function fillYear(y: number) {
  addWithSubstitute(y, 1, 1, "元日");
  const jan2m = nthMonday(y, 1, 2);
  if (jan2m) addWithSubstitute(y, 1, jan2m, "成人の日");
  addWithSubstitute(y, 2, 11, "建国記念の日");
  addWithSubstitute(y, 2, 23, "天皇誕生日");
  const feq = springEquinox(y);
  addWithSubstitute(y, 3, feq, "春分の日");
  addWithSubstitute(y, 4, 29, "昭和の日");
  addWithSubstitute(y, 5, 3, "憲法記念日");
  addWithSubstitute(y, 5, 4, "みどりの日");
  addWithSubstitute(y, 5, 5, "こどもの日");
  const jul3m = nthMonday(y, 7, 3);
  if (jul3m) addWithSubstitute(y, 7, jul3m, "海の日");
  addWithSubstitute(y, 8, 11, "山の日");
  const sep3m = nthMonday(y, 9, 3);
  if (sep3m) addWithSubstitute(y, 9, sep3m, "敬老の日");
  const aeq = autumnEquinox(y);
  addWithSubstitute(y, 9, aeq, "秋分の日");
  const oct2m = nthMonday(y, 10, 2);
  if (oct2m) addWithSubstitute(y, 10, oct2m, "スポーツの日");
  addWithSubstitute(y, 11, 3, "文化の日");
  addWithSubstitute(y, 11, 23, "勤労感謝の日");
}

for (let y = 2024; y <= 2032; y++) fillYear(y);
