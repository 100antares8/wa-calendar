import { cookies } from "next/headers";
import TabLayout from "@/components/TabLayout";
import TodayPanel from "@/components/TodayPanel";
import MonthCalendar from "@/components/MonthCalendar";
import TraditionalClock from "@/components/TraditionalClock";
import SeasonalKigoPanel from "@/components/SeasonalKigoPanel";
import GuideSyncPanel from "@/components/GuideSyncPanel";
import LunarYearView from "@/components/LunarYearView";
import AppHeader from "@/components/AppHeader";

type SearchParams = Record<string, string | string[] | undefined>;

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  const cookieStore = cookies();
  const isAuthed = !!cookieStore.get("gc_access_token")?.value;
  const tabRaw = searchParams.tab;
  const initialTab = typeof tabRaw === "string" ? tabRaw : undefined;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <AppHeader isAuthed={isAuthed} />

      <main style={{ maxWidth: "1380px", margin: "0 auto", padding: "0.55rem 0.65rem 0.75rem" }}>
        <Tabs initialTab={initialTab} isAuthed={isAuthed} />
      </main>
    </div>
  );
}

function Tabs({ initialTab, isAuthed }: { initialTab?: string; isAuthed: boolean }) {
  return (
    <TabLayout
      initialTab={initialTab}
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
      lunarYearView={<LunarYearView />}
    />
  );
}
