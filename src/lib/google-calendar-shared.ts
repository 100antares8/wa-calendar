import type { MoonPhaseName } from "@/lib/moon-phases";

/** Google Calendar 終日イベントの end.date は「翌日（排他的）」である必要がある */
export function exclusiveEndDateForAllDay(yyyyMmDd: string): string {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  t.setUTCDate(t.getUTCDate() + 1);
  return t.toISOString().slice(0, 10);
}

export interface CalendarEventInput {
  summary: string;
  description: string;
  date: string; // YYYY-MM-DD
  colorId?: string;
  /** 和暦アプリ同期の重複管理（extendedProperties.private.wa） */
  waTag?: string;
}

export const WA_CALENDAR_WC = "wa-calendar";

// Google Calendar の色ID（変えたいときはここだけ編集）
// 1=Lavender, 2=Sage, 3=Grape, 4=Flamingo, 5=Banana, 6=Tangerine, 7=Peacock, 8=Graphite, 9=Blueberry, 10=Basil, 11=Tomato
export const CALENDAR_COLORS = {
  sekki: "7",     // 節気（既定）
  shingetsu: "5", // 新月（月相は既定で黄色系に統一しやすいよう 5）
  jogen: "5",     // 上弦
  mangetsu: "5",  // 満月
  gekko: "5",     // 下弦
  kyureki: "2",   // 旧暦（日ごと）
  season: "6",
};

export function calendarColorForMoonPhase(phase: MoonPhaseName, moonColorId?: string): string {
  if (moonColorId) return moonColorId;
  switch (phase) {
    case "新月":
      return CALENDAR_COLORS.shingetsu;
    case "上弦":
      return CALENDAR_COLORS.jogen;
    case "満月":
      return CALENDAR_COLORS.mangetsu;
    case "下弦":
      return CALENDAR_COLORS.gekko;
  }
}

/** UI・API 用: Google カレンダー色プリセット */
export const GOOGLE_EVENT_COLOR_OPTIONS: { id: string; label: string }[] = [
  { id: "1", label: "ラベンダー" },
  { id: "2", label: "セージ" },
  { id: "3", label: "グレープ" },
  { id: "4", label: "フラミンゴ" },
  { id: "5", label: "バナナ（黄）" },
  { id: "6", label: "タンジェリン" },
  { id: "7", label: "ピーコック" },
  { id: "8", label: "グラファイト" },
  { id: "9", label: "ブルーベリー" },
  { id: "10", label: "バジル" },
  { id: "11", label: "トマト" },
];
