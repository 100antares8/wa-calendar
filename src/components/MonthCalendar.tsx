"use client";

import { useState, useEffect, useRef, type TouchEvent } from "react";
import { getJstYmd } from "@/lib/jst-date";
import DailySeasonalAside from "./DailySeasonalAside";

interface DayData {
  day: number;
  weekday: string;
  isWeekend: boolean;
  moonEvents: { phase: string; emoji: string; time: string }[];
  sekki: { name: string; reading: string } | null;
  season: string;
}

interface MonthData {
  year: number;
  month: number;
  days: DayData[];
}

const SEASON_COLORS: Record<string, string> = {
  "春": "#fce7f3", "夏": "#d1fae5", "秋": "#fef3c7", "冬": "#dbeafe",
};

export default function MonthCalendar({
  showDailyAside = true,
  comfortable = false,
}: { showDailyAside?: boolean; comfortable?: boolean } = {}) {
  const j0 = getJstYmd(new Date());
  const [year,  setYear]  = useState(j0.y);
  const [month, setMonth] = useState(j0.m);
  const [data,  setData]  = useState<MonthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [wide, setWide] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 880px)");
    setWide(mq.matches);
    const h = () => setWide(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/month?year=${year}&month=${month}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [year, month]);

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  const onTouchStart = (e: TouchEvent) => {
    const t = e.targetTouches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx > 0) prevMonth();
    else nextMonth();
  };

  const firstWeekdaySunday0 = data ? new Date(Date.UTC(year, month - 1, 1, 3, 0, 0)).getUTCDay() : 0;
  const leadingBlanks = (firstWeekdaySunday0 + 6) % 7;
  const WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日"];

  const jstToday = getJstYmd(new Date());
  const cellMinH = comfortable ? 62 : 52;
  const gridGap = comfortable ? 4 : 2;
  const titleFs = comfortable ? "1.45rem" : "1.3rem";
  const subtitleFs = comfortable ? "0.76rem" : "0.7rem";
  const weekHdrFs = comfortable ? "0.78rem" : "0.7rem";
  const dayNumFs = comfortable ? "0.95rem" : "0.85rem";
  const sekkiFs = comfortable ? "0.62rem" : "0.55rem";
  const moonEmojiFs = comfortable ? "1rem" : "0.9rem";
  const legendFs = comfortable ? "0.76rem" : "0.7rem";
  const hintFs = comfortable ? "0.72rem" : "0.65rem";
  const navBtnPad = comfortable ? "0.35rem 0.85rem" : "0.25rem 0.75rem";
  const navBtnFs = comfortable ? "1.05rem" : "1rem";

  const gridCard = (
    <div
      className="wa-card fade-in"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: "pan-y", flex: wide ? (comfortable ? "1 1 420px" : "1 1 360px") : undefined, minWidth: 0 }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: comfortable ? "1.1rem" : "1rem" }}>
        <button type="button" onClick={prevMonth} style={{
          background: "none", border: "1px solid var(--border)",
          borderRadius: "4px", padding: navBtnPad,
          cursor: "pointer", color: "var(--text2)", fontSize: navBtnFs,
        }}>‹</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: titleFs, fontWeight: "500" }}>{year}年{month}月</div>
          <div style={{ fontSize: subtitleFs, color: "var(--text2)", letterSpacing: "0.1em" }}>
            {["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"][month-1]}
          </div>
        </div>
        <button type="button" onClick={nextMonth} style={{
          background: "none", border: "1px solid var(--border)",
          borderRadius: "4px", padding: navBtnPad,
          cursor: "pointer", color: "var(--text2)", fontSize: navBtnFs,
        }}>›</button>
      </div>

      {loading && <div style={{ textAlign: "center", padding: "2rem", color: "var(--text2)" }}>読み込み中…</div>}

      {data && !loading && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: gridGap, marginBottom: "4px" }}>
            {WEEKDAYS.map((w, i) => (
              <div key={w} style={{
                textAlign: "center", fontSize: weekHdrFs, padding: comfortable ? "6px 0" : "4px 0",
                color: i === 5 ? "#1e3a5f" : i === 6 ? "#c0392b" : "var(--text2)",
                fontFamily: "var(--font-sans, sans-serif)",
              }}>{w}</div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: gridGap }}>
            {Array.from({ length: leadingBlanks }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {data.days.map(d => {
              const isToday = year === jstToday.y && month === jstToday.m && d.day === jstToday.d;
              const weekdayIdxMon0 = (leadingBlanks + d.day - 1) % 7;
              const isSun = weekdayIdxMon0 === 6;
              const isSat = weekdayIdxMon0 === 5;
              const seasonBg = SEASON_COLORS[d.season] || "transparent";

              return (
                <div key={d.day} style={{
                  minHeight: `${cellMinH}px`, padding: comfortable ? "5px" : "3px",
                  background: isToday ? "var(--indigo)" : seasonBg,
                  borderRadius: "4px",
                  border: isToday ? "none" : "1px solid rgba(0,0,0,0.05)",
                  position: "relative",
                }}>
                  <div style={{
                    fontSize: dayNumFs, fontWeight: isToday ? "700" : "400",
                    color: isToday ? "#f0e6d3" : isSun ? "#c0392b" : isSat ? "#1e3a5f" : "var(--text)",
                    textAlign: "center", lineHeight: 1.4,
                  }}>
                    {d.day}
                  </div>

                  {d.sekki && (
                    <div style={{
                      fontSize: sekkiFs,
                      background: "#1e3a5f",
                      color: "#f0e6d3",
                      borderRadius: "2px",
                      padding: comfortable ? "2px 4px" : "1px 3px",
                      textAlign: "center",
                      marginTop: "1px",
                      lineHeight: 1.3,
                    }}>
                      {d.sekki.name}
                    </div>
                  )}

                  {d.moonEvents.map((me, i) => (
                    <div key={i} title={`${me.phase} ${me.time}`} style={{
                      fontSize: moonEmojiFs,
                      textAlign: "center",
                      lineHeight: 1,
                      marginTop: "1px",
                    }}>
                      {me.emoji}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", fontSize: legendFs, color: "var(--text2)" }}>
              {[
                { emoji: "🌑", label: "新月" }, { emoji: "🌓", label: "上弦" },
                { emoji: "🌕", label: "満月" }, { emoji: "🌗", label: "下弦" },
              ].map(l => (
                <span key={l.label}>{l.emoji} {l.label}</span>
              ))}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                <span style={{ display: "inline-block", width: "12px", height: "12px", background: "#1e3a5f", borderRadius: "2px" }} />
                節気
              </span>
            </div>
            <div style={{ fontSize: hintFs, color: "var(--text2)", marginTop: "0.5rem" }}>
              カレンダー上を左右にスワイプすると前月・翌月に移動します（矢印ボタンでも操作可）。
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (wide && showDailyAside) {
    return (
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", maxWidth: comfortable ? "1120px" : "980px" }}>
        {gridCard}
        <div style={{ flex: comfortable ? "0 0 300px" : "0 0 280px", position: "sticky", top: "1rem" }} className="fade-in">
          <DailySeasonalAside />
        </div>
      </div>
    );
  }

  if (wide) {
    return gridCard;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {gridCard}
      {showDailyAside && <DailySeasonalAside />}
    </div>
  );
}
