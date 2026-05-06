"use client";

import { useEffect, type CSSProperties } from "react";
import { getJstYmd, jstNoonUtc } from "@/lib/jst-date";
import { getSekki, getCurrentSekki, getLunarDate } from "@/lib/japanese-calendar";
import { getCurrentJunishiTime } from "@/lib/traditional-time";
import { traditionalEventsMatchingDay, getTraditionalEventsBySeason, type EventDisplaySeason } from "@/lib/traditional-events-catalog";
import { goToCalendarForEvent, TAB_SYNC_EVENT } from "@/lib/calendar-nav";
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

const SEASON_HEAD: Record<EventDisplaySeason, string> = {
  spring: "春",
  summer: "夏",
  autumn: "秋",
  winter: "冬",
};

function openLearningSection(sectionId: string) {
  const d = document.getElementById(sectionId) as HTMLDetailsElement | null;
  if (d) d.open = true;
  requestAnimationFrame(() => {
    d?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

export default function LearningGuidePanel() {
  const now = new Date();
  const j = getJstYmd(now);
  const noon = jstNoonUtc(j);
  const ld = getLunarDate(noon);
  const todayEvents = traditionalEventsMatchingDay(j.y, j.m, j.d, ld.lunarMonth, ld.lunarDay);
  const sekkiEntryToday = getSekki(noon);
  const currentSekki = getCurrentSekki(noon);
  const jn = getCurrentJunishiTime(now);
  const groups = getTraditionalEventsBySeason();

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    const run = () => {
      const raw = window.location.hash.replace(/^#/, "");
      if (!raw) return;
      const trad = document.getElementById("trad-events") as HTMLDetailsElement | null;
      if (raw === "trad-events") {
        if (trad) trad.open = true;
        t = setTimeout(() => trad?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
        return;
      }
      if (raw.startsWith("trad-event-")) {
        if (trad) trad.open = true;
        t = setTimeout(() => {
          const el = document.getElementById(raw);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.remove("wa-guide-flash");
            void el.offsetWidth;
            el.classList.add("wa-guide-flash");
            window.setTimeout(() => el.classList.remove("wa-guide-flash"), 2400);
          }
        }, 100);
      }
    };
    run();
    window.addEventListener("hashchange", run);
    window.addEventListener(TAB_SYNC_EVENT, run);
    return () => {
      window.removeEventListener("hashchange", run);
      window.removeEventListener(TAB_SYNC_EVENT, run);
      if (t) clearTimeout(t);
    };
  }, []);

  const tocCell = (sectionId: string, label: string, sub: string, active: boolean) => (
    <button
      type="button"
      key={sectionId}
      onClick={() => openLearningSection(sectionId)}
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

      <details
        className="wa-learning-details"
        style={{ ...detailsStyle, marginBottom: "0.35rem" }}
        id="learning-toc-wrap"
      >
        <summary style={{ ...summaryStyle, background: "rgba(30,58,95,0.06)" }}>
          目次（タップで開閉・各章へジャンプ）
        </summary>
        <nav aria-label="目次" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", padding: "0.55rem 0.65rem 0.75rem" }}>
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
      </details>

      <details className="wa-learning-details" style={detailsStyle} id="trad-events">
        <summary style={{ ...summaryStyle, background: todayEvents.length ? "rgba(30,58,95,0.08)" : undefined }}>
          日本古来の暦の行事・神社祭事・作法（ラインナップ）
        </summary>
        <div style={{ padding: "0.65rem 0.85rem 0.9rem", borderTop: "1px solid var(--border)", fontSize: "0.72rem", lineHeight: 1.55 }}>
          <p style={{ margin: "0 0 0.75rem", color: "var(--text2)" }}>
            各行をタップすると「暦」の月表示へ移動し、該当日が<strong>カタログの色</strong>で示されます。旧暦年ビューから来た場合も同じ色で強調します。
          </p>
          {groups.map(({ season, label, events }) => (
            <section key={season} style={{ marginBottom: season === "winter" ? 0 : "1.15rem" }}>
              <h3 style={{
                fontSize: "0.88rem",
                fontWeight: 700,
                color: "var(--indigo)",
                margin: "0 0 0.55rem",
                letterSpacing: "0.12em",
                borderBottom: "1px solid rgba(30,58,95,0.15)",
                paddingBottom: "0.35rem",
              }}>
                {SEASON_HEAD[season]}（{label}）の行事
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {events.map(ev => {
                  const isTodayRow = todayEvents.some(te => te.id === ev.id);
                  return (
                    <li
                      key={ev.id}
                      id={`trad-event-${ev.id}`}
                      style={{ scrollMarginTop: "72px" }}
                    >
                      <button
                        type="button"
                        onClick={() => goToCalendarForEvent(ev.id, j.y)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "0.65rem 0.75rem",
                          borderRadius: "8px",
                          border: isTodayRow ? "2px solid var(--indigo)" : "1px solid var(--border)",
                          boxShadow: isTodayRow
                            ? "inset 4px 0 0 0 var(--indigo)"
                            : `inset 4px 0 0 0 ${ev.highlightColor}`,
                          background: isTodayRow ? "rgba(30,58,95,0.06)" : `linear-gradient(90deg, ${ev.highlightColor} 0%, var(--paper) 22%)`,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          boxSizing: "border-box",
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
            </section>
          ))}
        </div>
      </details>

      <details className="wa-learning-details" style={detailsStyle} id="learn-sekki">
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

      <details className="wa-learning-details" style={detailsStyle} id="learn-reki">
        <summary style={summaryStyle}>暦の解説（旧暦・二十四節気一覧・六曜）</summary>
        <div style={{ padding: "0.5rem 0.75rem 0.85rem", borderTop: "1px solid var(--border)" }}>
          <GuideRekiExplain embedded />
        </div>
      </details>

      <details className="wa-learning-details" style={detailsStyle} id="learn-junishi">
        <summary style={summaryStyle}>十二支の刻</summary>
        <div style={{ padding: "0.5rem 0.75rem 0.85rem", borderTop: "1px solid var(--border)" }}>
          <GuideJunishiExplain embedded />
        </div>
      </details>
    </div>
  );
}
