"use client";

import { useState, useEffect, ReactNode, type CSSProperties } from "react";

const TAB_IDS = ["today", "clock", "calendar", "kigo", "guide-sync", "lunar-year"] as const;

function normalizeTabFromQuery(tab: string | undefined): string {
  if (!tab) return "today";
  if (tab === "guide") return "guide-sync";
  if (tab === "sekki" || tab === "sync") return "guide-sync";
  if (TAB_IDS.includes(tab as (typeof TAB_IDS)[number])) return tab;
  return "today";
}

interface Props {
  initialTab?: string;
  todayPanel: ReactNode;
  todayPhoneStack: ReactNode;
  ipadTodayClock: ReactNode;
  clock: ReactNode;
  calendar: ReactNode;
  calendarForTabletToday?: ReactNode;
  guideSync: ReactNode;
  seasonalKigo: ReactNode;
  lunarYearView: ReactNode;
}

const TABS = [
  { id: "today",       label: "今日",       emoji: "☀️" },
  { id: "clock",       label: "時刻",       emoji: "⏰" },
  { id: "calendar",    label: "暦",         emoji: "🗓" },
  { id: "kigo",        label: "季語",       emoji: "🎋" },
  { id: "lunar-year",  label: "旧暦年",     emoji: "📿" },
  { id: "guide-sync",  label: "節気・同期", emoji: "🌿" },
];

export default function TabLayout({
  initialTab,
  todayPanel,
  todayPhoneStack,
  ipadTodayClock,
  clock,
  calendar,
  calendarForTabletToday,
  guideSync,
  seasonalKigo,
  lunarYearView,
}: Props) {
  const [activeTab, setActiveTab] = useState(() => normalizeTabFromQuery(initialTab));
  const [isIpad, setIsIpad]       = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("tab");
    const normalized = normalizeTabFromQuery(fromUrl ?? initialTab);
    if (TABS.some(t => t.id === normalized)) setActiveTab(normalized);

    const mq = window.matchMedia("(min-width: 768px)");
    setIsIpad(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsIpad(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [initialTab]);

  const switchTab = (id: string) => {
    setActiveTab(id);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", id);
    window.history.replaceState({}, "", url.toString());
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const content: Record<string, ReactNode> = {
    today: todayPhoneStack,
    clock,
    calendar,
    kigo: seasonalKigo,
    "guide-sync": guideSync,
    "lunar-year": lunarYearView,
  };

  if (isIpad) {
    return (
      <div style={{
        display: "flex",
        gap: "0",
        minHeight: "calc(100dvh - 48px)",
      }}>
        <nav style={{
          width: "100px",
          flexShrink: 0,
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "0.65rem",
          gap: "0.35rem",
          position: "sticky",
          top: "48px",
          height: "calc(100dvh - 48px)",
          overflowY: "auto",
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchTab(tab.id)}
              style={{
                width: "84px",
                minHeight: "60px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                background: activeTab === tab.id ? "var(--indigo)" : "transparent",
                color: activeTab === tab.id ? "#f0e6d3" : "var(--text2)",
                border: "none",
                borderRadius: "12px",
                fontSize: "0.54rem",
                fontFamily: "'Noto Sans JP', sans-serif",
                transition: "all 0.15s",
                padding: "8px 5px",
              }}
            >
              <span style={{ fontSize: "1.45rem", lineHeight: 1 }}>{tab.emoji}</span>
              <span style={{ textAlign: "center", lineHeight: 1.15 }}>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div
          style={{
            flex: 1,
            padding: "0.85rem 1rem",
            overflowY: "auto",
            minHeight: 0,
            minWidth: 0,
            WebkitOverflowScrolling: "touch" as never,
          } as CSSProperties}
          className="fade-in"
        >
          {activeTab === "today" ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: "1.1rem",
              width: "100%",
              maxWidth: "min(1280px, 100%)",
              margin: "0 auto",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", minWidth: 0 }}>
                {todayPanel}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "stretch", width: "100%" }}>{ipadTodayClock}</div>
                {calendarForTabletToday ?? calendar}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: activeTab === "lunar-year" ? "980px" : "960px", margin: "0 auto" }}>
              {content[activeTab]}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100dvh - 48px)" }}>
      <div
        className="fade-in"
        style={{
          flex: 1,
          padding: "0.55rem 0.65rem",
          paddingBottom: "calc(68px + env(safe-area-inset-bottom))",
          overflowY: "auto",
          minHeight: 0,
          WebkitOverflowScrolling: "touch" as never,
        } as CSSProperties}
      >
        {content[activeTab]}
      </div>

      <nav style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "calc(52px + env(safe-area-inset-bottom))",
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "rgba(253, 246, 227, 0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "flex-start",
        paddingTop: "5px",
        zIndex: 100,
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => switchTab(tab.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1px",
              background: "none",
              border: "none",
              color: activeTab === tab.id ? "var(--indigo)" : "var(--text2)",
              fontSize: "0.44rem",
              fontFamily: "'Noto Sans JP', sans-serif",
              padding: "3px 0",
              transition: "color 0.15s",
            }}
          >
            <span style={{
              fontSize: "1.1rem",
              lineHeight: 1,
              filter: activeTab === tab.id ? "none" : "grayscale(30%)",
              transform: activeTab === tab.id ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.15s",
              display: "block",
            }}>
              {tab.emoji}
            </span>
            <span style={{
              fontWeight: activeTab === tab.id ? "500" : "300",
              textAlign: "center",
              lineHeight: 1.05,
              padding: "0 1px",
            }}>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
