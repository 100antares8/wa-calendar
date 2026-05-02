"use client";

import { useState, useEffect, ReactNode, type CSSProperties } from "react";

interface Props {
  isAuthed: boolean;
  todayPanel: ReactNode;
  /** iPhone「今日」: 日付と時計を1画面にまとめたコンテンツ */
  todayPhoneStack: ReactNode;
  /** iPad「今日」右カラム上部の時計（コンパクト推奨） */
  ipadTodayClock: ReactNode;
  clock: ReactNode;
  calendar: ReactNode;
  sekki: ReactNode;
  sync: ReactNode;
  guide: ReactNode;
}

const TABS = [
  { id: "today",    label: "今日",  emoji: "☀️" },
  { id: "clock",    label: "時刻",  emoji: "⏰" },
  { id: "calendar", label: "暦",    emoji: "🗓" },
  { id: "sekki",    label: "節気",  emoji: "🌿" },
  { id: "guide",    label: "解説",  emoji: "📖" },
  { id: "sync",     label: "同期",  emoji: "📅" },
];

export default function TabLayout({ isAuthed: _isAuthed, todayPanel, todayPhoneStack, ipadTodayClock, clock, calendar, sekki, sync, guide }: Props) {
  const [activeTab, setActiveTab] = useState("today");
  const [isIpad, setIsIpad]       = useState(false);

  useEffect(() => {
    // URLパラメータからタブを復元
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab && TABS.some(t => t.id === tab)) setActiveTab(tab);

    // iPad判定（768px以上）
    const mq = window.matchMedia("(min-width: 768px)");
    setIsIpad(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsIpad(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const switchTab = (id: string) => {
    setActiveTab(id);
    // URLを更新（ブックマーク対応）
    const url = new URL(window.location.href);
    url.searchParams.set("tab", id);
    window.history.replaceState({}, "", url.toString());
    // タップ時のバイブレーション（対応デバイスのみ）
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const content: Record<string, ReactNode> = {
    today: todayPhoneStack,
    clock,
    calendar,
    sekki,
    guide,
    sync,
  };

  // iPad以上: サイドバー + コンテンツ
  if (isIpad) {
    return (
      <div style={{
        display: "flex",
        gap: "0",
        minHeight: "calc(100dvh - 60px)",
      }}>
        {/* サイドバーナビ */}
        <nav style={{
          width: "80px",
          flexShrink: 0,
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "1rem",
          gap: "0.25rem",
          position: "sticky",
          top: "60px",
          height: "calc(100dvh - 60px)",
          overflowY: "auto",
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              style={{
                width: "64px",
                height: "64px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                background: activeTab === tab.id ? "var(--indigo)" : "transparent",
                color: activeTab === tab.id ? "#f0e6d3" : "var(--text2)",
                border: "none",
                borderRadius: "12px",
                fontSize: "0.65rem",
                fontFamily: "'Noto Sans JP', sans-serif",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* メインコンテンツ */}
        <div style={{ flex: 1, padding: "1.25rem", overflowY: "auto" }} key={activeTab} className="fade-in">
          {/* iPad: 2カラムグリッド（today と calendar のみ） */}
          {activeTab === "today" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", maxWidth: "900px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {todayPanel}
                {sync}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>{ipadTodayClock}</div>
                {calendar}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: "720px" }}>
              {content[activeTab]}
            </div>
          )}
        </div>
      </div>
    );
  }

  // iPhone: ボトムタブバー
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100dvh - 60px)" }}>
      {/* スクロール可能なコンテンツ */}
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

      {/* ボトムタブバー（iOS スタイル） */}
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
              fontSize: "0.6rem",
              fontFamily: "'Noto Sans JP', sans-serif",
              padding: "4px 0",
              transition: "color 0.15s",
            }}
          >
            <span style={{
              fontSize: "1.3rem",
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
            }}>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
