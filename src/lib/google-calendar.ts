import { google } from "googleapis";

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

export async function listCalendars(accessToken: string, refreshToken: string) {
  const oauth2 = getOAuth2Client();
  oauth2.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2 });
  const res = await calendar.calendarList.list();
  return res.data.items || [];
}

export interface CalendarEventInput {
  summary: string;
  description: string;
  date: string; // YYYY-MM-DD
  colorId?: string;
}

// Google Calendar の色ID
// 1=Lavender, 2=Sage, 3=Grape, 4=Flamingo, 5=Banana, 6=Tangerine, 7=Peacock, 8=Graphite, 9=Blueberry, 10=Basil, 11=Tomato
export const CALENDAR_COLORS = {
  sekki: "7",    // Peacock（節気）
  shingetsu: "8", // Graphite（新月）
  mangetsu: "5",  // Banana（満月）
  season: "6",    // Tangerine（季節）
};
