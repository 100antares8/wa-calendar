"use client";

import { useEffect, useState } from "react";
import { getJstYmd } from "@/lib/jst-date";
import { traditionalEventsMatchingDay, cellPaintForTraditionalEvents } from "@/lib/traditional-events-catalog";
import { goToGuideTradEvent } from "@/lib/calendar-nav";

const WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日"];

function toZenNum(n: number): string {
  return String(n).replace(/\d/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x30 + 0xff10));
}

interface DayRow {
  gregorian: { y: number; m: number; d: number };
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  monthName: string;
  monthReading: string;
  dayLabel: string;
}

interface Payload {
  year: number;
  days: DayRow[];
}

export default function LunarYearView() {
  const j0 = getJstYmd(new Date());
  const jstToday = j0;
  const [year, setYear] = useState(j0.y);
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/lunar-year?year=${year}`, { cache: "no-store" })
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [year]);

  const groups: { key: string; title: string; rows: DayRow[] }[] = [];
  if (data?.days?.length) {
    let curKey = "";
    let bucket: DayRow[] = [];
    for (const row of data.days) {
      const key = `${row.lunarYear}-${row.lunarMonth}-${row.monthName}`;
      if (key !== curKey) {
        if (bucket.length) {
          const first = bucket[0];
          groups.push({
            key: curKey,
            title: `旧${first.lunarYear}年　${first.monthName}（${first.monthReading}）`,
            rows: bucket,
          });
        }
        curKey = key;
        bucket = [row];
      } else {
        bucket.push(row);
      }
    }
    if (bucket.length) {
      const first = bucket[0];
      groups.push({
        key: curKey,
        title: `旧${first.lunarYear}年　${first.monthName}（${first.monthReading}）`,
        rows: bucket,
      });
    }
  }

  const gregorianWeekdayMon0 = (y: number, m: number, d: number) => {
    const sun0 = new Date(Date.UTC(y, m - 1, d, 3, 0, 0)).getUTCDay();
    return (sun0 + 6) % 7;
  };

  return (
    <div className="wa-card fade-in" style={{ maxWidth: "980px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>旧暦の年（参考表示）</h2>
      <p style={{ fontSize: "0.72rem", color: "var(--text2)", lineHeight: 1.5, marginBottom: "0.85rem" }}>
        グレゴリオ暦の1年を走査し、各日の旧暦をまとめています。各旧暦月を、月曜始まりの週グリッドに載せています。
        枠の主表示は旧暦日名です。補足としてその日の格里暦を示します。閏月は本アルゴリズムでは未対応のため、実物の旧暦とずれる場合があります。
        行事カタログに該当する日は<strong>マス全体</strong>を暦タブと<strong>同じ色</strong>で塗り、行事名を大きめに表示します。「地域別」は大区域の祭事例です。タップで「節気・同期」の該当解説へ移動します。
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <label style={{ fontSize: "0.78rem", color: "var(--text2)" }}>西暦年:</label>
        <select
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          style={{
            border: "1px solid var(--border)", borderRadius: "4px",
            padding: "0.25rem 0.5rem", background: "var(--paper)", fontSize: "0.85rem",
          }}
        >
          {[year - 1, year, year + 1, year + 2].map(y => (
            <option key={y} value={y}>{y}年</option>
          ))}
        </select>
      </div>

      {loading && <p style={{ color: "var(--text2)", fontSize: "0.85rem" }}>読み込み中…</p>}

      {!loading && groups.map(g => {
        const sorted = [...g.rows].sort((a, b) => {
          const ga = a.gregorian, gb = b.gregorian;
          return ga.m !== gb.m ? ga.m - gb.m : ga.d - gb.d;
        });
        const first = sorted[0];
        const lead = gregorianWeekdayMon0(first.gregorian.y, first.gregorian.m, first.gregorian.d);
        const total = lead + sorted.length;
        const trail = total % 7 === 0 ? 0 : 7 - (total % 7);
        const cells: (DayRow | null)[] = [
          ...Array.from({ length: lead }, () => null),
          ...sorted,
          ...Array.from({ length: trail }, () => null),
        ];
        return (
        <section key={g.key} style={{ marginBottom: "1.35rem" }}>
          <div style={{
            fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem",
            padding: "0.35rem 0.5rem", background: "rgba(30,58,95,0.08)", borderRadius: "6px",
          }}>
            {g.title} <span style={{ fontWeight: 400, fontSize: "0.72rem", color: "var(--text2)" }}>（{g.rows.length}日分）</span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: "4px",
            fontSize: "0.68rem",
            fontFamily: "var(--font-sans, sans-serif)",
          }}>
            {WEEKDAYS.map((w, i) => (
              <div key={w} style={{
                textAlign: "center", fontWeight: 600, padding: "4px 0",
                color: i === 5 ? "#1e3a5f" : i === 6 ? "#c0392b" : "var(--text2)",
                fontSize: "0.62rem",
              }}>{w}</div>
            ))}
            {cells.map((r, idx) => {
              const isTodayCell = r != null
                && r.gregorian.y === jstToday.y
                && r.gregorian.m === jstToday.m
                && r.gregorian.d === jstToday.d;
              const evts = r
                ? traditionalEventsMatchingDay(
                  r.gregorian.y,
                  r.gregorian.m,
                  r.gregorian.d,
                  r.lunarMonth,
                  r.lunarDay,
                )
                : [];
              const hasTrad = evts.length > 0;
              const paint = r
                ? cellPaintForTraditionalEvents(evts, "var(--paper)")
                : { background: "transparent" as const };
              return (
              <div
                key={r ? `${r.gregorian.m}-${r.gregorian.d}-${idx}` : `blank-${idx}`}
                style={{
                  minHeight: hasTrad ? "auto" : "64px",
                  padding: "4px",
                  borderRadius: "4px",
                  border: isTodayCell ? "2px solid var(--indigo)" : r ? "1px solid var(--border)" : "1px solid transparent",
                  ...paint,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  gap: "3px",
                  boxShadow: isTodayCell ? "0 0 0 1px rgba(30,58,95,0.08)" : undefined,
                }}
              >
                {r && (
                  <>
                    <div style={{
                      fontSize: "0.78rem", fontWeight: 600, lineHeight: 1.2,
                      fontFamily: "serif",
                      color: "var(--text)",
                    }}>{r.dayLabel}</div>
                    <div style={{ fontSize: "0.55rem", color: "var(--text2)", lineHeight: 1.25 }}>
                      {toZenNum(r.gregorian.m)}月{toZenNum(r.gregorian.d)}日
                    </div>
                    {hasTrad && evts.map(ev => (
                      <button
                        key={ev.id}
                        type="button"
                        onClick={() => goToGuideTradEvent(ev.id)}
                        title={`${ev.title}の解説へ`}
                        style={{
                          fontSize: "0.66rem",
                          fontWeight: 700,
                          lineHeight: 1.25,
                          textAlign: "left",
                          padding: "5px 4px",
                          borderRadius: "5px",
                          border: "1px solid rgba(0,0,0,0.18)",
                          background: "rgba(255,255,255,0.55)",
                          color: "#1a1008",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          marginTop: "2px",
                          width: "100%",
                          display: "block",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.07)",
                        }}
                      >
                        {ev.regionBlock && (
                          <>
                            <span style={{
                              display: "inline-block",
                              fontSize: "0.52rem",
                              fontWeight: 700,
                              marginRight: "3px",
                              padding: "0 3px",
                              borderRadius: "2px",
                              background: "#7c2d12",
                              color: "#fff",
                              verticalAlign: "0.08em",
                            }}>地域別</span>
                            <span style={{ fontSize: "0.58rem", fontWeight: 700, marginRight: "4px" }}>{ev.regionBlock}</span>
                          </>
                        )}
                        {ev.title}
                      </button>
                    ))}
                  </>
                )}
              </div>
            );
            })}
          </div>
        </section>
        );
      })}
    </div>
  );
}
