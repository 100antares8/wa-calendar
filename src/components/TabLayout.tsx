"use client";

import { useState, useEffect, ReactNode, type CSSProperties } from "react";

interface Props {
  isAuthed: boolean;
  todayPanel: ReactNode;
  todayPhoneStack: ReactNode;
  ipadTodayClock: ReactNode;
  clock: ReactNode;
  calendar: ReactNode;
  /** Right column on iPad「今日」; omit duplicate seasonal aside if calendar embeds it */
  calendarForTabletToday?: ReactNode;
  sekkiGuide: ReactNode;
  seasonalKigo: ReactNode;
  sync: ReactNode;
}

const TABS = [
  { id: "today",    label: "今日",    emoji: "☀️" },
  { id: "clock",    label: "時刻",    emoji: "⏰" },
  { id: "calendar", label: "暦",      emoji: "🗓" },
  { id: "sekki",    label: "節気・解説", emoji: "🌿" },
  { id: "kigo",     label: "季語",    emoji: "🎋" },
  { id: "sync",     label: "同期",    emoji: "📅" },
];

export default function TabLayout({
  isAuthed: _isAuthed,
  todayPanel,
  todayPhoneStack,
  ipadTodayClock,
  clock,
  calendar,
  calendarForTabletToday,
  sekkiGuide,
  seasonalKigo,
  sync,
}: Props) {
  const [activeTab, setActiveTab] = useState("today");
  const [isIpad, setIsIpad]       = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let tab = params.get("tab");
    if (tab === "guide") tab = "sekki";
    if (tab && TABS.some(t => t.id === tab)) setActiveTab(tab);

    const mq = window.matchMedia("(min-width: 768px)");
    setIsIpad(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsIpad(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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
    sekki: sekkiGuide,
    kigo: seasonalKigo,
    sync,
  };

  if (isIpad) {
    return (
      <div style={{
        display: "flex",
        gap: "0",
        minHeight: "calc(100dvh - 60px)",
      }}>
        <nav style={{
          width: "100px",
          flexShrink: 0,
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "1rem",
          gap: "0.35rem",
          position: "sticky",
          top: "60px",
          height: "calc(100dvh - 60px)",
          overflowY: "auto",
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchTab(tab.id)}
              style={{
                width: "84px",
                minHeight: "64px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                background: activeTab === tab.id ? "var(--indigo)" : "transparent",
                color: activeTab === tab.id ? "#f0e6d3" : "var(--text2)",
                border: "none",
                borderRadius: "12px",
                fontSize: "0.62rem",
                fontFamily: "'Noto Sans JP', sans-serif",
                transition: "all 0.15s",
                padding: "8px 5px",
              }}
            >
              <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{tab.emoji}</span>
              <span style={{ textAlign: "center", lineHeight: 1.2 }}>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ flex: 1, padding: "1.25rem", overflowY: "auto", minWidth: 0 }} key={activeTab} className="fade-in">
          {activeTab === "today" ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: "1.35rem",
              width: "100%",
              maxWidth: "min(1280px, 100%)",
              margin: "0 auto",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: 0 }}>
                {todayPanel}
                {sync}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "center" }}>{ipadTodayClock}</div>
                {calendarForTabletToday ?? calendar}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: "960px" }}>
              {content[activeTab]}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100dvh - 60px)" }}>
      <div
        key={activeTab}
        className="fade-in"
        style={{
          flex: 1,
          padding: "0.9rem",
          paddingBottom: "calc(72px + env(safe-area-inset-bottom))",
          overflowY: "auto",
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
        height: "calc(56px + env(safe-area-inset-bottom))",
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "rgba(253, 246, 227, 0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "flex-start",
        paddingTop: "6px",
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
              gap: "2px",
              background: "none",
              border: "none",
              color: activeTab === tab.id ? "var(--indigo)" : "var(--text2)",
              fontSize: "0.52rem",
              fontFamily: "'Noto Sans JP', sans-serif",
              padding: "4px 0",
              transition: "color 0.15s",
            }}
          >
            <span style={{
              fontSize: "1.25rem",
              lineHeight: 1,
              filter: activeTab === tab.id ? "none" : "grayscale(30%)",
              transform: activeTab === tab.id ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.15s",
              display: "block",
            }}>
              {tab.emoji}
            </span>
            <span style={{
              fontWeight: activeTab === tab.id ? "500" : "300",
              textAlign: "center",
              lineHeight: 1.1,
              padding: "0 2px",
            }}>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
