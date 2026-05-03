import { cookies } from "next/headers";
import TabLayout from "@/components/TabLayout";
import TodayPanel from "@/components/TodayPanel";
import MonthCalendar from "@/components/MonthCalendar";
import TraditionalClock from "@/components/TraditionalClock";
import SekkiGuidePanel from "@/components/SekkiGuidePanel";
import SeasonalKigoPanel from "@/components/SeasonalKigoPanel";
import GoogleCalendarSync from "@/components/GoogleCalendarSync";

export default function Home() {
  const cookieStore = cookies();
  const isAuthed = !!cookieStore.get("gc_access_token")?.value;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <header style={{
        borderBottom: "1px solid var(--border)",
        padding: "0.75rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "var(--paper)",
        zIndex: 10,
        backdropFilter: "blur(4px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.5rem" }}>🗓</span>
          <div>
            <h1 style={{ fontSize: "1.1rem", fontWeight: "700", lineHeight: 1 }}>和暦カレンダー</h1>
            <p style={{ fontSize: "0.65rem", color: "var(--text2)", letterSpacing: "0.08em" }}>
              旧暦・節気・月相・十二支時刻
            </p>
          </div>
        </div>
        {isAuthed && (
          <div style={{
            fontSize: "0.7rem", color: "var(--moss)",
            display: "flex", alignItems: "center", gap: "0.3rem",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--moss)", display: "inline-block" }} />
            Google連携中
          </div>
        )}
      </header>

      <main style={{ maxWidth: "1380px", margin: "0 auto", padding: "1rem" }}>
        <Tabs isAuthed={isAuthed} />
      </main>
    </div>
  );
}

function Tabs({ isAuthed }: { isAuthed: boolean }) {
  return (
    <TabLayout
      isAuthed={isAuthed}
      todayPanel={<TodayPanel compact comfortable />}
      todayPhoneStack={
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <TodayPanel compact />
          <TraditionalClock compact />
        </div>
      }
      ipadTodayClock={<TraditionalClock compact comfortable />}
      clock={<TraditionalClock />}
      calendar={<MonthCalendar />}
      calendarForTabletToday={<MonthCalendar showDailyAside={false} comfortable />}
      sekkiGuide={<SekkiGuidePanel />}
      seasonalKigo={<SeasonalKigoPanel />}
      sync={<GoogleCalendarSync isAuthed={isAuthed} />}
    />
  );
}
