"use client";

import type { CSSProperties } from "react";
import { getJstYmd, jstNoonUtc } from "@/lib/jst-date";
import { getSekki, getCurrentSekki, getLunarDate } from "@/lib/japanese-calendar";
import { getCurrentJunishiTime } from "@/lib/traditional-time";
import { TRADITIONAL_EVENTS, traditionalEventsMatchingDay } from "@/lib/traditional-events-catalog";
import { goToCalendarForEvent } from "@/lib/calendar-nav";
import SekkiPanel from "@/components/SekkiPanel";
import { GuideRekiExplain, GuideJunishiExplain } from "@/components/GuidePanel";

const detailsStyle: CSSProperties = {
  marginBottom: "0.85rem",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  overflow: "hidden",
  background: "rgba(253,246,227,0.35)",
};

const summaryStyle: CSSProperties = {
  padding: "0.65rem 0.85rem",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.88rem",
  listStyle: "none",
};

export default function LearningGuidePanel() {
  const now = new Date();
  const j = getJstYmd(now);
  const noon = jstNoonUtc(j);
  const ld = getLunarDate(noon);
  const todayEvents = traditionalEventsMatchingDay(j.y, j.m, j.d, ld.lunarMonth, ld.lunarDay);
  const sekkiEntryToday = getSekki(noon);
  const currentSekki = getCurrentSekki(noon);
  const jn = getCurrentJunishiTime(now);

  const tocCell = (id: string, label: string, sub: string, active: boolean) => (
    <button
      type="button"
      key={id}
      onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
      style={{
        flex: "1 1 140px",
        textAlign: "left",
        padding: "0.5rem 0.6rem",
        borderRadius: "8px",
        border: active ? "2px solid var(--indigo)" : "1px solid var(--border)",
        background: active ? "rgba(30,58,95,0.1)" : "var(--paper)",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: "0.65rem", color: "var(--text2)", marginTop: "2px", lineHeight: 1.35 }}>{sub}</div>
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "780px" }}>
      <section className="wa-card fade-in" style={{ padding: "0.85rem 1rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 0.35rem" }}>学び・深堀り</h2>
        <p style={{ fontSize: "0.74rem", color: "var(--text2)", lineHeight: 1.55, margin: 0 }}>
          年中行事・節句、二十四節気と七十二候、旧暦・六曜、十二支の刻について、意味と目安をまとめています。行事の新暦・旧暦は目安であり、地域・閏月・暦注により実日は異なります。
        </p>
      </section>

      <nav aria-label="目次" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {tocCell("trad-events", "行事・祭事", todayEvents.length ? `本日 ${todayEvents.length}件` : "本日の該当なし", todayEvents.length > 0)}
        {tocCell(
          "learn-sekki",
          "二十四節気",
          sekkiEntryToday ? `節入 ${sekkiEntryToday.kanji}` : `区間 ${currentSekki.kanji}`,
          !!sekkiEntryToday,
        )}
        {tocCell(
          "learn-reki",
          "暦・六曜",
          "旧暦・六曜の一覧",
          todayEvents.length > 0 || !!sekkiEntryToday,
        )}
        {tocCell("learn-junishi", "十二支の刻", `いま ${jn.junishi}の刻`, true)}
      </nav>

      <details style={detailsStyle} id="trad-events" open>
        <summary style={{ ...summaryStyle, background: todayEvents.length ? "rgba(30,58,95,0.08)" : undefined }}>
          日本古来の暦の行事・神社祭事・作法（ラインナップ）
        </summary>
        <div style={{ padding: "0.65rem 0.85rem 0.9rem", borderTop: "1px solid var(--border)", fontSize: "0.72rem", lineHeight: 1.55 }}>
          <p style={{ margin: "0 0 0.75rem", color: "var(--text2)" }}>
            各行をタップすると「暦」の月表示へ移動し、該当日が色で示されます。連日や旧盆・新盆のように年や地域でずれるものは各行に注記があります。
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {TRADITIONAL_EVENTS.map(ev => {
              const isTodayRow = todayEvents.some(te => te.id === ev.id);
              return (
              <li key={ev.id}>
                <button
                  type="button"
                  onClick={() => goToCalendarForEvent(ev.id, j.y)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.65rem 0.75rem",
                    borderRadius: "8px",
                    border: isTodayRow ? "2px solid var(--indigo)" : "1px solid var(--border)",
                    borderLeft: isTodayRow ? "5px solid var(--indigo)" : undefined,
                    background: isTodayRow ? "rgba(30,58,95,0.06)" : "var(--paper)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{ev.title}</span>
                    {ev.reading && <span style={{ fontSize: "0.68rem", color: "var(--text2)" }}>（{ev.reading}）</span>}
                  </div>
                  <div style={{ marginTop: "0.35rem", fontSize: "0.7rem", color: "var(--text)" }}>
                    <span style={{ fontWeight: 600 }}>新暦の目安：</span>
                    {ev.gregorianLabel}
                  </div>
                  <div style={{ marginTop: "0.2rem", fontSize: "0.7rem", color: "var(--text)" }}>
                    <span style={{ fontWeight: 600 }}>旧暦の目安：</span>
                    {ev.lunarLabel}
                  </div>
                  {ev.variability && (
                    <div style={{ marginTop: "0.35rem", fontSize: "0.66rem", color: "#b45309", lineHeight: 1.45 }}>
                      ※ {ev.variability}
                    </div>
                  )}
                  <p style={{ margin: "0.45rem 0 0", fontSize: "0.72rem", color: "var(--text2)", lineHeight: 1.5 }}>
                    {ev.explanation}
                  </p>
                </button>
              </li>
            );
            })}
          </ul>
        </div>
      </details>

      <details style={detailsStyle} id="learn-sekki">
        <summary
          style={{
            ...summaryStyle,
            background: sekkiEntryToday ? "rgba(52,211,153,0.14)" : "rgba(52,211,153,0.06)",
          }}
        >
          二十四節気と七十二候
        </summary>
        <div style={{ padding: "0.75rem 0.85rem", borderTop: "1px solid var(--border)" }}>
          <SekkiPanel />
        </div>
      </details>

      <details style={detailsStyle} id="learn-reki">
        <summary style={summaryStyle}>暦の解説（旧暦・二十四節気一覧・六曜）</summary>
        <div style={{ padding: "0.5rem 0.75rem 0.85rem", borderTop: "1px solid var(--border)" }}>
          <GuideRekiExplain embedded />
        </div>
      </details>

      <details style={detailsStyle} id="learn-junishi">
        <summary style={summaryStyle}>十二支の刻</summary>
        <div style={{ padding: "0.5rem 0.75rem 0.85rem", borderTop: "1px solid var(--border)" }}>
          <GuideJunishiExplain embedded />
        </div>
      </details>
    </div>
  );
}
