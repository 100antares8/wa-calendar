import { google } from "googleapis";
import type { MoonPhaseName } from "@/lib/moon-phases";

/** Google Console の「承認済みリダイレクト URI」と完全一致させること */
export function getGoogleRedirectUri(): string {
  const explicit = process.env.GOOGLE_REDIRECT_URI?.trim();
  if (explicit) return explicit;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api/auth/callback`;
  return "http://localhost:3333/api/auth/callback";
}

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    getGoogleRedirectUri(),
  );
}

export function getAuthUrl(): string {
  const oauth2 = getOAuth2Client();
  return oauth2.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
    prompt: "consent",
  });
}

export async function getTokenFromCode(code: string) {
  const oauth2 = getOAuth2Client();
  const { tokens } = await oauth2.getToken(code);
  return tokens;
}

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

export async function createCalendarEvents(
  accessToken: string,
  refreshToken: string,
  events: CalendarEventInput[],
) {
  const oauth2 = getOAuth2Client();
  oauth2.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2 });

  const concurrency = 6;
  const results: (
    | { ok: true; id?: string | null; summary: string }
    | { ok: false; summary: string; error: string }
  )[] = [];

  async function insertOne(ev: CalendarEventInput) {
    try {
      const endDate = exclusiveEndDateForAllDay(ev.date);
      const res = await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: ev.summary,
          description: ev.description,
          start: { date: ev.date },
          end: { date: endDate },
          colorId: ev.colorId,
          transparency: "transparent",
          extendedProperties: ev.waTag
            ? { private: { wc: WA_CALENDAR_WC, wa: ev.waTag } }
            : undefined,
        },
      });
      return { ok: true as const, id: res.data.id, summary: ev.summary };
    } catch (e) {
      return { ok: false as const, summary: ev.summary, error: String(e) };
    }
  }

  for (let i = 0; i < events.length; i += concurrency) {
    const slice = events.slice(i, i + concurrency);
    const batch = await Promise.all(slice.map(insertOne));
    results.push(...batch);
  }
  return results;
}

/** 指定年・種類について、当アプリが以前追加したイベントを削除（再同期時の重複防止） */
export async function deleteWaCalendarEventsForKinds(
  accessToken: string,
  refreshToken: string,
  year: number,
  kinds: Set<"sekki" | "moon" | "kyureki">,
): Promise<{ deleted: number }> {
  if (kinds.size === 0) return { deleted: 0 };
  const oauth2 = getOAuth2Client();
  oauth2.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2 });
  const timeMin = new Date(`${year}-01-01T00:00:00+09:00`).toISOString();
  const timeMax = new Date(`${year + 1}-02-01T00:00:00+09:00`).toISOString();

  const toDelete: string[] = [];
  let pageToken: string | undefined;
  do {
    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin,
      timeMax,
      privateExtendedProperty: [`wc=${WA_CALENDAR_WC}`],
      singleEvents: true,
      maxResults: 250,
      pageToken,
    });
    for (const ev of res.data.items || []) {
      const wa = ev.extendedProperties?.private?.wa;
      if (!wa || !ev.id) continue;
      const parts = wa.split("|");
      if (parts.length < 3) continue;
      const y = parseInt(parts[0], 10);
      const kind = parts[1];
      if (y !== year) continue;
      if (kind === "sekki" && kinds.has("sekki")) toDelete.push(ev.id);
      else if (kind === "moon" && kinds.has("moon")) toDelete.push(ev.id);
      else if (kind === "kyureki" && kinds.has("kyureki")) toDelete.push(ev.id);
    }
    pageToken = res.data.nextPageToken || undefined;
  } while (pageToken);

  let deleted = 0;
  const batchN = 8;
  for (let i = 0; i < toDelete.length; i += batchN) {
    await Promise.all(
      toDelete.slice(i, i + batchN).map(id =>
        calendar.events.delete({ calendarId: "primary", eventId: id }).then(() => {
          deleted++;
        }).catch(() => {}),
      ),
    );
  }
  return { deleted };
}

export async function listCalendars(accessToken: string, refreshToken: string) {
  const oauth2 = getOAuth2Client();
  oauth2.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2 });
  const res = await calendar.calendarList.list();
  return res.data.items || [];
}

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
