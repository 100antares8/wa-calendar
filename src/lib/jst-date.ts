/** サーバー（UTC）でも日本の「暦上の今日」を一貫して扱う */

/** その瞬間の「日本の時刻」（壁時計）— 十二支時・不定時の基準に使う */
export function getJstClock(d: Date): { hour: number; minute: number; second: number } {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(d);
  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  return {
    hour: parseInt(map.hour, 10),
    minute: parseInt(map.minute, 10),
    second: parseInt(map.second, 10),
  };
}

export function getJstDecimalHour(d: Date): number {
  const { hour, minute, second } = getJstClock(d);
  return hour + minute / 60 + second / 3600;
}

export function getJstYmd(d: Date): { y: number; m: number; d: number } {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(d);
  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  return {
    y: parseInt(map.year, 10),
    m: parseInt(map.month, 10),
    d: parseInt(map.day, 10),
  };
}

/** その JST 日付の正午（12:00 JST）の瞬間。旧暦・季節の「日」の揃えに使う */
export function jstNoonUtc(jst: { y: number; m: number; d: number }): Date {
  return new Date(Date.UTC(jst.y, jst.m - 1, jst.d, 3, 0, 0));
}

const WD = ["日", "月", "火", "水", "木", "金", "土"] as const;

export function getJstWeekdayIndex(d: Date): number {
  const noon = jstNoonUtc(getJstYmd(d));
  return noon.getUTCDay();
}

export function getJstWeekdayLabel(d: Date): string {
  return WD[getJstWeekdayIndex(d)];
}

/** 表示用（今日は何曜日） */
export function getJstWeekdayLabelLong(d: Date): string {
  return `${WD[getJstWeekdayIndex(d)]}曜日`;
}
