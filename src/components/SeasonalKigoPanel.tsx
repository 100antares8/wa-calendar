"use client";

import { useMemo, useState, useCallback } from "react";
import type { CSSProperties } from "react";
import { getJstYmd } from "@/lib/jst-date";
import { getDailySeasonalBundle, type SeasonalLine } from "@/lib/daily-seasonal-wisdom";

const STORAGE_KEY = "wa-calendar-kigo-saved-v1";

type KigoKind = "proverb" | "figure" | "tea" | "nature";

const blockStyle: CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "0.65rem 0.85rem",
  background: "rgba(255,255,255,0.45)",
};

function saveKey(y: number, m: number, d: number, kind: KigoKind): string {
  return `${y}-${m}-${d}-${kind}`;
}

function parseKey(key: string): { y: number; m: number; d: number; kind: KigoKind } | null {
  const parts = key.split("-");
  if (parts.length < 4) return null;
  const y = Number(parts[0]), m = Number(parts[1]), d = Number(parts[2]);
  const kind = parts[3] as KigoKind;
  if (!y || !m || !d || !["proverb", "figure", "tea", "nature"].includes(kind)) return null;
  return { y, m, d, kind };
}

function loadSavedSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function persistSavedSet(s: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(s)));
}

function shiftJstDate(j: { y: number; m: number; d: number }, delta: number): { y: number; m: number; d: number } {
  const utc = Date.UTC(j.y, j.m - 1, j.d + delta, 12, 0, 0);
  return getJstYmd(new Date(utc));
}

function formatJstHeading(j: { y: number; m: number; d: number }): string {
  return `${j.y}年${j.m}月${j.d}日`;
}

function jstToInputValue(j: { y: number; m: number; d: number }): string {
  return `${j.y}-${String(j.m).padStart(2, "0")}-${String(j.d).padStart(2, "0")}`;
}

function LineBlock({
  title,
  sub,
  line,
  saved,
  onToggleSave,
}: {
  title: string;
  sub: string;
  line: SeasonalLine;
  saved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <section style={blockStyle} className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: "0.68rem", color: "var(--indigo)", fontWeight: 700, letterSpacing: "0.08em" }}>{title}</div>
          <div style={{ fontSize: "0.62rem", color: "var(--text2)", marginBottom: "0.35rem" }}>{sub}</div>
        </div>
        <label
          style={{
            display: "flex", alignItems: "center", gap: "5px",
            fontSize: "0.62rem", color: "var(--text2)", whiteSpace: "nowrap",
            cursor: "pointer", flexShrink: 0,
          }}
        >
          <input
            type="checkbox"
            checked={saved}
            onChange={onToggleSave}
            aria-label={`${title}を保存`}
          />
          保存
        </label>
      </div>
      <p style={{ fontSize: "0.88rem", lineHeight: 1.55, margin: "0 0 0.35rem", fontWeight: 500 }}>
        {line.text}
      </p>
      {line.attribution && (
        <div style={{ fontSize: "0.72rem", color: "var(--text2)", marginBottom: "0.35rem" }}>— {line.attribution}</div>
      )}
      <p style={{ fontSize: "0.72rem", color: "var(--text2)", lineHeight: 1.55, margin: 0 }}>
        {line.note}
      </p>
    </section>
  );
}

export default function SeasonalKigoPanel() {
  const [viewDate, setViewDate] = useState(() => getJstYmd(new Date()));
  const [saved, setSaved] = useState<Set<string>>(() => loadSavedSet());

  const bundle = useMemo(() => getDailySeasonalBundle(viewDate), [viewDate.y, viewDate.m, viewDate.d]);

  const toggleSave = useCallback((kind: KigoKind) => {
    const k = saveKey(viewDate.y, viewDate.m, viewDate.d, kind);
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      persistSavedSet(next);
      return next;
    });
  }, [viewDate.y, viewDate.m, viewDate.d]);

  const savedDates = useMemo(() => {
    const map = new Map<string, { y: number; m: number; d: number }>();
    for (const key of Array.from(saved)) {
      const p = parseKey(key);
      if (!p) continue;
      const label = `${p.y}-${p.m}-${p.d}`;
      map.set(label, { y: p.y, m: p.m, d: p.d });
    }
    return Array.from(map.values()).sort((a, b) =>
      b.y !== a.y ? b.y - a.y : b.m !== a.m ? b.m - a.m : b.d - a.d,
    );
  }, [saved]);

  const today = getJstYmd(new Date());
  const isToday =
    viewDate.y === today.y && viewDate.m === today.m && viewDate.d === today.d;

  return (
    <div style={{ maxWidth: "720px", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: 0, letterSpacing: "0.06em" }}>
        季語・名話
      </h2>
      <p style={{ fontSize: "0.74rem", color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>
        日本の季節暦に関連することわざ・熟語、和の先人の言葉や俳句趣、茶の相承に関する言い伝え・心得、
        山野の草花や水の一句です。日付（日本標準時）を変えるとその日の内容が表示されます。気に入った欄はチェックで端末に保存できます。
      </p>

      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.45rem",
        padding: "0.5rem 0.65rem", borderRadius: "8px", border: "1px solid var(--border)",
        background: "rgba(30,58,95,0.04)",
      }}>
        <button
          type="button"
          onClick={() => setViewDate(shiftJstDate(viewDate, -1))}
          style={{
            border: "1px solid var(--border)", borderRadius: "6px", padding: "0.25rem 0.6rem",
            background: "var(--paper)", cursor: "pointer", fontSize: "0.8rem", color: "var(--text)",
          }}
        >前日</button>
        <button
          type="button"
          onClick={() => setViewDate(shiftJstDate(viewDate, 1))}
          style={{
            border: "1px solid var(--border)", borderRadius: "6px", padding: "0.25rem 0.6rem",
            background: "var(--paper)", cursor: "pointer", fontSize: "0.8rem", color: "var(--text)",
          }}
        >翌日</button>
        <span style={{ fontSize: "0.85rem", fontWeight: 600, marginLeft: "0.15rem" }}>
          {formatJstHeading(viewDate)}
          {!isToday && (
            <span style={{ fontSize: "0.7rem", color: "var(--text2)", fontWeight: 400, marginLeft: "0.35rem" }}>（選択中）</span>
          )}
        </span>
        <button
          type="button"
          onClick={() => setViewDate(getJstYmd(new Date()))}
          disabled={isToday}
          style={{
            marginLeft: "auto",
            border: "1px solid var(--border)", borderRadius: "6px", padding: "0.25rem 0.6rem",
            background: isToday ? "var(--border)" : "var(--paper)",
            cursor: isToday ? "default" : "pointer",
            fontSize: "0.75rem", color: "var(--text2)",
            opacity: isToday ? 0.65 : 1,
          }}
        >今日に戻る</button>
        <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.72rem", color: "var(--text2)" }}>
          日付指定
          <input
            type="date"
            value={jstToInputValue(viewDate)}
            onChange={e => {
              const v = e.target.value;
              if (!v) return;
              const [yy, mm, dd] = v.split("-").map(Number);
              if (yy && mm && dd) setViewDate({ y: yy, m: mm, d: dd });
            }}
            style={{
              border: "1px solid var(--border)", borderRadius: "4px",
              padding: "0.2rem 0.35rem", background: "var(--paper)", fontSize: "0.75rem",
            }}
          />
        </label>
      </div>

      {savedDates.length > 0 && (
        <div style={{ fontSize: "0.72rem", color: "var(--text2)" }}>
          <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: "0.35rem" }}>保存のある日</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
            {savedDates.slice(0, 24).map(j => (
              <button
                key={`${j.y}-${j.m}-${j.d}`}
                type="button"
                onClick={() => setViewDate(j)}
                style={{
                  border: "1px solid var(--border)", borderRadius: "999px",
                  padding: "0.15rem 0.55rem", background:
                    viewDate.y === j.y && viewDate.m === j.m && viewDate.d === j.d
                      ? "var(--indigo)" : "var(--paper)",
                  color:
                    viewDate.y === j.y && viewDate.m === j.m && viewDate.d === j.d
                      ? "#f0e6d3" : "var(--text)",
                  cursor: "pointer", fontSize: "0.7rem",
                }}
              >{formatJstHeading(j)}</button>
            ))}
          </div>
        </div>
      )}

      <LineBlock
        title="季節暦のことわざ・熟語"
        sub="暦や季節を味わう言葉"
        line={bundle.proverb}
        saved={saved.has(saveKey(viewDate.y, viewDate.m, viewDate.d, "proverb"))}
        onToggleSave={() => toggleSave("proverb")}
      />
      <LineBlock
        title="先人の言葉・俳句趣"
        sub="歌・俳諧・随筆などの心象にふれる一句"
        line={bundle.figure}
        saved={saved.has(saveKey(viewDate.y, viewDate.m, viewDate.d, "figure"))}
        onToggleSave={() => toggleSave("figure")}
      />
      <LineBlock
        title="茶・茶湯に関する言葉"
        sub="千利休・表千家・裏千家・江戸千家の系統をふまえた教訓・見立て"
        line={bundle.tea}
        saved={saved.has(saveKey(viewDate.y, viewDate.m, viewDate.d, "tea"))}
        onToggleSave={() => toggleSave("tea")}
      />
      <LineBlock
        title="自然の一句"
        sub="花・川・山など、季の景色を一首に凝縮"
        line={bundle.nature}
        saved={saved.has(saveKey(viewDate.y, viewDate.m, viewDate.d, "nature"))}
        onToggleSave={() => toggleSave("nature")}
      />
    </div>
  );
}
