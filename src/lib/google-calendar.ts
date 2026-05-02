import { google } from "googleapis";
import {
  exclusiveEndDateForAllDay,
  WA_CALENDAR_WC,
  type CalendarEventInput,
} from "@/lib/google-calendar-shared";

export type { CalendarEventInput } from "@/lib/google-calendar-shared";
export {
  exclusiveEndDateForAllDay,
  WA_CALENDAR_WC,
  CALENDAR_COLORS,
  calendarColorForMoonPhase,
  GOOGLE_EVENT_COLOR_OPTIONS,
} from "@/lib/google-calendar-shared";

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
