"use client";

import { useState, useEffect, useRef, type TouchEvent } from "react";
import { getJstYmd, jstNoonUtc } from "@/lib/jst-date";
import { getSeason } from "@/lib/japanese-calendar";
import { getSekkiLineColors, getSekkiLineColorsToday } from "@/lib/sekki-colors";

interface DayData {
  day: number;
  weekday: string;
  isWeekend: boolean;
  moonEvents: { phase: string; emoji: string; time: string }[];
  sekki: { name: string; reading: string } | null;
  season: string;
  lunar: {
    lunarYear: number;
    lunarMonth: number;
    lunarDay: number;
    monthName: string;
    monthReading: string;
    dayLabel: string;
  };
  rokuyo: { name: string; color: string };
  yearEto: { eto: string; reading: string };
  moonAge: number;
  moonPhase: { name: string; emoji: string };
  currentSekki: { kanji: string; reading: string; longitude: number };
  marks: { holiday: string | null; tensha: boolean; tora: boolean; ichimanApprox: boolean };
}

interface MonthData {
  year: number;
  month: number;
  days: DayData[];
}

const SEASON_COLORS: Record<string, string> = {
  "春": "#fce7f3", "夏": "#d1fae5", "秋": "#fef3c7", "冬": "#dbeafe",
};

const SEASON_EMOJI: Record<string, string> = {
  "春": "🌸", "夏": "🌿", "秋": "🍁", "冬": "❄️",
};

export default function MonthCalendar({
  comfortable = false,
}: { comfortable?: boolean } = {}) {
  const j0 = getJstYmd(new Date());
  const [year, setYear] = useState(j0.y);
  const [month, setMonth] = useState(j0.m);
  const [data, setData] = useState<MonthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [wide, setWide] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const monthSeason = getSeason(jstNoonUtc({ y: year, m: month, d: 15 }));

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 880px)");
    setWide(mq.matches);
    const h = () => setWide(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/month?year=${year}&month=${month}`, { cache: "no-store" })
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
  const cellMinH = comfortable && wide ? 128 : wide ? 112 : 96;
  const gridGap = comfortable ? 4 : 3;
  const titleFs = comfortable ? "1.45rem" : "1.25rem";
  const subtitleFs = comfortable ? "0.76rem" : "0.68rem";
  const weekHdrFs = comfortable ? "0.72rem" : "0.65rem";
  const dayNumFs = comfortable ? "0.82rem" : "0.74rem";
  const sekkiFs = comfortable ? "0.55rem" : "0.5rem";
  const tinyFs = comfortable ? "0.5rem" : "0.46rem";
  const navBtnPad = comfortable ? "0.35rem 0.85rem" : "0.25rem 0.75rem";
  const navBtnFs = comfortable ? "1.05rem" : "1rem";

  const gridCard = (
    <div
      className="wa-card fade-in"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: "pan-y", flex: wide ? (comfortable ? "1 1 380px" : "1 1 340px") : undefined, minWidth: 0 }}
    >
      <p style={{ fontSize: tinyFs, color: "var(--text2)", lineHeight: 1.45, marginBottom: "0.65rem" }}>
        上部の季節はその月のおおまかな区分です。旧暦のみの年ビューはヘッダー「旧暦の年」から開けます。
      </p>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
        marginBottom: "0.65rem", flexWrap: "wrap",
        fontSize: comfortable ? "0.95rem" : "0.85rem", fontWeight: 600,
        color: "var(--text)",
      }}>
        <span>{SEASON_EMOJI[monthSeason.name]}{monthSeason.name}</span>
        <span style={{ fontWeight: 400, fontSize: tinyFs, color: "var(--text2)" }}>（カレンダー全体の季）</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: comfortable ? "1.1rem" : "0.85rem" }}>
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
                textAlign: "center", fontSize: weekHdrFs, padding: comfortable ? "5px 0" : "3px 0",
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
              const sekCols = isToday
                ? getSekkiLineColorsToday(d.currentSekki.longitude)
                : getSekkiLineColors(d.currentSekki.longitude);

              return (
                <div key={d.day} style={{
                  minHeight: `${cellMinH}px`, padding: "4px",
                  background: isToday ? "var(--indigo)" : seasonBg,
                  borderRadius: "4px",
                  border: isToday ? "none" : "1px solid rgba(0,0,0,0.06)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  overflow: "hidden",
                }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: "2px", flexWrap: "wrap",
                  }}>
                    <span style={{
                      fontSize: dayNumFs, fontWeight: isToday ? "700" : "600",
                      color: isToday ? "#f0e6d3" : isSun ? "#c0392b" : isSat ? "#1e3a5f" : "var(--text)",
                    }}>
                      {d.day}
                    </span>
                  </div>

                  {d.marks.holiday && (
                    <div style={{
                      fontSize: tinyFs, color: isToday ? "#fecaca" : "#b91c1c", fontWeight: 600, lineHeight: 1.2,
                    }}>
                      祝 {d.marks.holiday}
                    </div>
                  )}

                  {(d.marks.tensha || d.marks.tora || d.marks.ichimanApprox) && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "2px", fontSize: tinyFs, lineHeight: 1.2 }}>
                      {d.marks.tensha && (
                        <span style={{ background: isToday ? "rgba(255,255,255,0.2)" : "rgba(180,83,9,0.2)", borderRadius: "2px", padding: "0 2px" }}>天赦</span>
                      )}
                      {d.marks.tora && (
                        <span style={{ background: isToday ? "rgba(255,255,255,0.2)" : "rgba(30,58,95,0.15)", borderRadius: "2px", padding: "0 2px" }}>寅の日</span>
                      )}
                      {d.marks.ichimanApprox && (
                        <span style={{ background: isToday ? "rgba(255,255,255,0.2)" : "rgba(127,29,29,0.12)", borderRadius: "2px", padding: "0 2px" }}>一粒万倍・目安</span>
                      )}
                    </div>
                  )}

                  <div style={{ fontSize: tinyFs, color: isToday ? "rgba(240,230,211,0.95)" : "var(--text)", lineHeight: 1.25, fontWeight: 500 }}>
                    {d.lunar.monthName}{d.lunar.dayLabel}
                    <span style={{ fontSize: "0.92em", color: isToday ? "rgba(240,230,211,0.85)" : "var(--text2)" }}>
                      （{d.lunar.monthReading}）
                    </span>
                  </div>
                  <div style={{ fontSize: tinyFs, color: isToday ? "#f0e6d3" : "var(--text)", lineHeight: 1.25 }}>
                    {d.yearEto.eto}
                    <span style={{ color: isToday ? "rgba(240,230,211,0.9)" : "var(--text2)" }}>（{d.yearEto.reading}）</span>
                  </div>
                  <div style={{ fontSize: tinyFs, color: d.rokuyo.color, fontWeight: 600 }}>
                    六曜 {d.rokuyo.name}
                  </div>
                  <div style={{ fontSize: tinyFs, color: isToday ? "#f0e6d3" : "var(--text)", lineHeight: 1.2 }}>
                    {d.moonPhase.emoji}{" "}{d.lunar.dayLabel}{" "}
                    <span style={{ color: isToday ? "rgba(240,230,211,0.85)" : "var(--text2)", fontWeight: 400 }}>月齢{d.moonAge.toFixed(1)}</span>
                  </div>
                  <div style={{
                    fontSize: tinyFs,
                    lineHeight: 1.3,
                    background: sekCols.background,
                    color: sekCols.color,
                    border: `1px solid ${sekCols.border}`,
                    borderRadius: "4px",
                    padding: "3px 4px",
                    marginTop: "1px",
                  }}>
                    {d.currentSekki.kanji}{" "}{d.currentSekki.reading} · 黄経{d.currentSekki.longitude}°
                  </div>

                  {d.sekki && (
                    <div style={{
                      fontSize: sekkiFs,
                      background: isToday ? "rgba(255,255,255,0.25)" : "#1e3a5f",
                      color: "#f0e6d3",
                      borderRadius: "2px",
                      padding: "1px 3px",
                      textAlign: "center",
                      lineHeight: 1.25,
                    }}>
                      節入 {d.sekki.name}
                    </div>
                  )}

                  {d.moonEvents.map((me, i) => (
                    <div key={i} title={`${me.phase} ${me.time}`} style={{
                      fontSize: "0.78rem",
                      textAlign: "center",
                      lineHeight: 1,
                      opacity: 0.95,
                    }}>
                      {me.emoji}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "0.85rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 0.75rem", fontSize: tinyFs, color: "var(--text2)" }}>
              {[
                { emoji: "🌑", label: "新月" }, { emoji: "🌓", label: "上弦" },
                { emoji: "🌕", label: "満月" }, { emoji: "🌗", label: "下弦" },
              ].map(l => (
                <span key={l.label}>{l.emoji} {l.label}</span>
              ))}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                <span style={{ display: "inline-block", width: "10px", height: "10px", background: "#1e3a5f", borderRadius: "2px" }} />
                節入日
              </span>
              <span>節気帯は色で四季区分（各マス）</span>
            </div>
            <div style={{ fontSize: tinyFs, color: "var(--text2)", marginTop: "0.45rem" }}>
              カレンダー上を左右にスワイプすると前月・翌月に移動します（矢印ボタンでも操作可）。
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (wide) {
    return (
      <div style={{ width: "100%", maxWidth: comfortable ? "1200px" : "1080px", margin: "0 auto" }}>
        {gridCard}
      </div>
    );
  }

  return <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>{gridCard}</div>;
}
