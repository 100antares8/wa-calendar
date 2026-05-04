import { NextRequest, NextResponse } from "next/server";
import { getLunarDate, LUNAR_DAY_NAMES } from "@/lib/japanese-calendar";
import { getJstYmd, jstNoonUtc } from "@/lib/jst-date";

export const dynamic = "force-dynamic";

function shortLunarDay(n: number): string {
  const s = LUNAR_DAY_NAMES[n];
  if (!s) return `${n}日`;
  const i = s.indexOf("（");
  return i > 0 ? s.slice(0, i) : s;
}

export async function GET(req: NextRequest) {
  const jDefault = getJstYmd(new Date());
  const year = parseInt(req.nextUrl.searchParams.get("year") || String(jDefault.y), 10);

  const days: {
    gregorian: { y: number; m: number; d: number };
    lunarYear: number;
    lunarMonth: number;
    lunarDay: number;
    monthName: string;
    monthReading: string;
    dayLabel: string;
  }[] = [];

  for (let m = 1; m <= 12; m++) {
    const dim = new Date(Date.UTC(year, m, 0)).getUTCDate();
    for (let d = 1; d <= dim; d++) {
      const anchor = jstNoonUtc({ y: year, m, d });
      const lunar = getLunarDate(anchor);
      days.push({
        gregorian: { y: year, m, d },
        lunarYear: lunar.lunarYear,
        lunarMonth: lunar.lunarMonth,
        lunarDay: lunar.lunarDay,
        monthName: lunar.monthName,
        monthReading: lunar.monthReading,
        dayLabel: shortLunarDay(lunar.lunarDay),
      });
    }
  }

  return NextResponse.json({ year, days });
}
