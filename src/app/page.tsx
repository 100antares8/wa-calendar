import { cookies } from "next/headers";
import TabLayout from "@/components/TabLayout";
import TodayPanel from "@/components/TodayPanel";
import MonthCalendar from "@/components/MonthCalendar";
import TraditionalClock from "@/components/TraditionalClock";
import SeasonalKigoPanel from "@/components/SeasonalKigoPanel";
import GuideSyncPanel from "@/components/GuideSyncPanel";

export default function Home() {
  const cookieStore = cookies();
  const isAuthed = !!cookieStore.get("gc_access_token")?.value;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <header className="wa-app-header" style={{
        borderBottom: "1px solid var(--border)",
        padding: "0.4rem 0.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.5rem",
        position: "sticky",
        top: 0,
        background: "var(--paper)",
        zIndex: 10,
        backdropFilter: "blur(4px)",
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", minWidth: 0 }}>
          <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>🗓</span>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: "0.92rem", fontWeight: "700", lineHeight: 1.15 }}>和暦カレンダー</h1>
            <p className="wa-header-sub" style={{ fontSize: "0.58rem", color: "var(--text2)", letterSpacing: "0.06em", marginTop: "1px" }}>
              旧暦・節気・月相・十二支時刻（JST）
            </p>
          </div>
        </div>
        {isAuthed && (
          <div style={{
            fontSize: "0.62rem", color: "var(--moss)",
            display: "flex", alignItems: "center", gap: "0.25rem",
            flexShrink: 0,
          }} title="Googleカレンダー連携中">
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--moss)", display: "inline-block" }} />
            <span className="wa-google-status">連携中</span>
          </div>
        )}
      </header>

      <main style={{ maxWidth: "1380px", margin: "0 auto", padding: "0.55rem 0.65rem 0.75rem" }}>
        <Tabs isAuthed={isAuthed} />
      </main>
    </div>
  );
}

function Tabs({ isAuthed }: { isAuthed: boolean }) {
  return (
    <TabLayout
      todayPanel={<TodayPanel compact comfortable />}
      todayPhoneStack={
        <div style={{ display: "flex", flexDirection: "column", gap: "0.28rem" }}>
          <TodayPanel compact />
          <TraditionalClock compact />
        </div>
      }
      ipadTodayClock={<TraditionalClock compact comfortable />}
      clock={<TraditionalClock />}
      calendar={<MonthCalendar comfortable />}
      calendarForTabletToday={<MonthCalendar comfortable />}
      guideSync={<GuideSyncPanel isAuthed={isAuthed} />}
      seasonalKigo={<SeasonalKigoPanel />}
    />
  );
}
