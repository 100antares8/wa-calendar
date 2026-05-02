"use client";

import { useState, type CSSProperties } from "react";
import type { MoonPhaseName } from "@/lib/moon-phases";
import { GOOGLE_EVENT_COLOR_OPTIONS } from "@/lib/google-calendar-shared";

interface SyncResult {
  ok: number;
  fail: number;
  total: number;
  error?: string;
  firstError?: string;
  deleted_prior?: number;
}

const MOON_OPTIONS: { key: MoonPhaseName; label: string; emoji: string }[] = [
  { key: "新月", label: "新月", emoji: "🌑" },
  { key: "上弦", label: "上弦", emoji: "🌓" },
  { key: "満月", label: "満月", emoji: "🌕" },
  { key: "下弦", label: "下弦", emoji: "🌗" },
];

const selectStyle: CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: "4px",
  padding: "0.2rem 0.4rem",
  background: "var(--paper)",
  fontSize: "0.78rem",
  color: "var(--text)",
  maxWidth: "100%",
};

export default function GoogleCalendarSync({ isAuthed }: { isAuthed: boolean }) {
  const [year,    setYear]    = useState(new Date().getFullYear());
  const [sekki,   setSekki]   = useState(true);
  const [moonPhases, setMoonPhases] = useState<Record<MoonPhaseName, boolean>>({
    新月: true,
    上弦: true,
    満月: true,
    下弦: true,
  });
  const [kyureki, setKyureki] = useState(false);
  const [replaceExisting, setReplaceExisting] = useState(true);
  const [sekkiColorId, setSekkiColorId] = useState("7");
  const [moonColorId, setMoonColorId] = useState("5");
  const [kyurekiColorId, setKyurekiColorId] = useState("2");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<SyncResult | null>(null);

  const toggleMoon = (k: MoonPhaseName) =>
    setMoonPhases(prev => ({ ...prev, [k]: !prev[k] }));

  const selectedMoonCount = MOON_OPTIONS.filter(o => moonPhases[o.key]).length;

  const sync = async () => {
    setLoading(true);
    setResult(null);
    try {
      const types: string[] = [];
      if (sekki) types.push("sekki");
      const phases = MOON_OPTIONS.filter(o => moonPhases[o.key]).map(o => o.key);
      if (phases.length) types.push("moon");
      if (kyureki) types.push("kyureki");

      const res = await fetch("/api/calendar/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year,
          types,
          moonPhases: phases.length ? phases : undefined,
          replaceExisting,
          sekkiColorId,
          moonColorId,
          kyurekiColorId,
        }),
      });
      setResult(await res.json());
    } catch (e) {
      setResult({ ok: 0, fail: 0, total: 0, error: String(e) });
    } finally {
      setLoading(false);
    }
  };

  const nothingSelected = !sekki && selectedMoonCount === 0 && !kyureki;

  return (
    <div className="wa-card">
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "1.2rem" }}>📅</span>
        <h3 style={{ fontSize: "0.95rem", fontWeight: "500" }}>Googleカレンダーに同期</h3>
      </div>

      {!isAuthed ? (
        <div>
          <p style={{ fontSize: "0.8rem", color: "var(--text2)", marginBottom: "0.75rem" }}>
            節気・月相・旧暦をGoogleカレンダーに追加するには、まずGoogleアカウントでログインしてください。
          </p>
          <a href="/api/auth/google" className="btn-wa">
            Googleでログイン
          </a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ fontSize: "0.8rem", color: "var(--text2)" }}>年:</label>
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              style={{
                border: "1px solid var(--border)", borderRadius: "4px",
                padding: "0.25rem 0.5rem", background: "var(--paper)",
                fontSize: "0.85rem", color: "var(--text)",
              }}
            >
              {[year - 1, year, year + 1, year + 2].map(y => (
                <option key={y} value={y}>{y}年</option>
              ))}
            </select>
          </div>

          <label style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.4rem",
            fontSize: "0.78rem",
            cursor: "pointer",
            color: "var(--text2)",
          }}>
            <input
              type="checkbox"
              checked={replaceExisting}
              onChange={() => setReplaceExisting(!replaceExisting)}
              style={{ accentColor: "var(--indigo)", marginTop: "2px" }}
            />
            <span>再同期で<b>同じ年・今回選んだ種類</b>について、以前このアプリが追加した予定を先に削除（重複を防ぐ）</span>
          </label>

          <div style={{ fontSize: "0.75rem", color: "var(--text2)" }}>
            <div style={{ marginBottom: "0.35rem" }}>Googleカレンダーでの色（1〜11）</div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.35rem 0.75rem", alignItems: "center" }}>
              <span>節気</span>
              <select value={sekkiColorId} onChange={e => setSekkiColorId(e.target.value)} style={selectStyle}>
                {GOOGLE_EVENT_COLOR_OPTIONS.map(o => (
                  <option key={o.id} value={o.id}>{o.id}: {o.label}</option>
                ))}
              </select>
              <span>月相（4乗共通）</span>
              <select value={moonColorId} onChange={e => setMoonColorId(e.target.value)} style={selectStyle}>
                {GOOGLE_EVENT_COLOR_OPTIONS.map(o => (
                  <option key={o.id} value={o.id}>{o.id}: {o.label}</option>
                ))}
              </select>
              <span>旧暦（日ごと）</span>
              <select value={kyurekiColorId} onChange={e => setKyurekiColorId(e.target.value)} style={selectStyle}>
                {GOOGLE_EVENT_COLOR_OPTIONS.map(o => (
                  <option key={o.id} value={o.id}>{o.id}: {o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <label style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            fontSize: "0.85rem", cursor: "pointer",
          }}>
            <input
              type="checkbox"
              checked={sekki}
              onChange={() => setSekki(!sekki)}
              style={{ accentColor: "var(--indigo)" }}
            />
            🌿 二十四節気
          </label>

          <div>
            <div style={{ fontSize: "0.78rem", color: "var(--text2)", marginBottom: "0.35rem" }}>
              月の位相
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {MOON_OPTIONS.map(({ key, label, emoji }) => (
                <label key={key} style={{
                  display: "flex", alignItems: "center", gap: "0.35rem",
                  fontSize: "0.82rem", cursor: "pointer",
                }}>
                  <input
                    type="checkbox"
                    checked={moonPhases[key]}
                    onChange={() => toggleMoon(key)}
                    style={{ accentColor: "var(--indigo)" }}
                  />
                  {emoji} {label}
                </label>
              ))}
            </div>
          </div>

          <label style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            fontSize: "0.85rem", cursor: "pointer",
          }}>
            <input
              type="checkbox"
              checked={kyureki}
              onChange={() => setKyureki(!kyureki)}
              style={{ accentColor: "var(--indigo)" }}
            />
            📿 旧暦（日ごと・約365件／年）
          </label>

          <p style={{ fontSize: "0.72rem", color: "var(--text2)", margin: 0 }}>
            アプリ外で手入力した予定の削除は Google カレンダー上での操作になります。このアプリ経由で追加した分は上の「先に削除」で置き換えできます。
          </p>

          <button
            onClick={sync}
            disabled={loading || nothingSelected}
            className="btn-wa"
            style={{ alignSelf: "flex-start" }}
          >
            {loading ? "同期中…" : "カレンダーに追加"}
          </button>

          {result && (
            <div style={{
              padding: "0.6rem 0.75rem",
              borderRadius: "4px",
              background: result.error ? "rgba(192,57,43,0.1)" : "rgba(6,95,70,0.1)",
              border: `1px solid ${result.error ? "rgba(192,57,43,0.3)" : "rgba(6,95,70,0.3)"}`,
              fontSize: "0.8rem",
            }}>
              {result.error
                ? `エラー: ${result.error}`
                : result.fail > 0 && result.ok === 0
                ? `エラー: ${result.firstError || "不明なエラー"}`
                : <>
                    {result.deleted_prior != null && result.deleted_prior > 0
                      ? `（既存の同期分 ${result.deleted_prior} 件を削除）`
                      : null}
                    {` ✓ ${result.ok}件を追加しました（全${result.total}件${result.fail > 0 ? `、${result.fail}件失敗` : ""}）`}
                  </>
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
}
