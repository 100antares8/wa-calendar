"use client";

import { useEffect, useState } from "react";
import { getJstYmd } from "@/lib/jst-date";

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

  return (
    <div className="wa-card fade-in" style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>旧暦の年（参考表示）</h2>
      <p style={{ fontSize: "0.72rem", color: "var(--text2)", lineHeight: 1.5, marginBottom: "0.85rem" }}>
        グレゴリオ暦の1年を走査し、各日の旧暦月をまとめています。閏月は本アルゴリズムでは未対応のため、実物の旧暦とずれる場合があります。
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

      {!loading && groups.map(g => (
        <section key={g.key} style={{ marginBottom: "1.25rem" }}>
          <div style={{
            fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem",
            padding: "0.35rem 0.5rem", background: "rgba(30,58,95,0.08)", borderRadius: "6px",
          }}>
            {g.title} <span style={{ fontWeight: 400, fontSize: "0.72rem", color: "var(--text2)" }}>（{g.rows.length}日分）</span>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "4px",
            fontSize: "0.68rem",
            fontFamily: "var(--font-sans, sans-serif)",
          }}>
            {g.rows.map(r => (
              <div
                key={`${r.gregorian.m}-${r.gregorian.d}`}
                style={{
                  padding: "4px 6px",
                  borderRadius: "4px",
                  border: "1px solid var(--border)",
                  background: "var(--paper)",
                }}
              >
                <span style={{ color: "var(--text2)" }}>{r.gregorian.m}/{r.gregorian.d}</span>
                {" · "}
                <strong>{r.dayLabel}</strong>
                <span style={{ color: "var(--text2)" }}>（{r.lunarDay}日）</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
