"use client";

import { useState } from "react";

interface SyncResult { ok: number; fail: number; total: number; error?: string; firstError?: string }

export default function GoogleCalendarSync({ isAuthed }: { isAuthed: boolean }) {
  const [year,    setYear]    = useState(new Date().getFullYear());
  const [types,   setTypes]   = useState({ sekki: true, moon: true });
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<SyncResult | null>(null);

  const toggleType = (t: keyof typeof types) => setTypes(prev => ({ ...prev, [t]: !prev[t] }));

  const sync = async () => {
    setLoading(true);
    setResult(null);
    try {
      const selectedTypes = Object.entries(types).filter(([,v]) => v).map(([k]) => k);
      const res = await fetch("/api/calendar/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, types: selectedTypes }),
      });
      setResult(await res.json());
    } catch (e) {
      setResult({ ok: 0, fail: 0, total: 0, error: String(e) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wa-card">
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "1.2rem" }}>📅</span>
        <h3 style={{ fontSize: "0.95rem", fontWeight: "500" }}>Googleカレンダーに同期</h3>
      </div>

      {!isAuthed ? (
        <div>
          <p style={{ fontSize: "0.8rem", color: "var(--text2)", marginBottom: "0.75rem" }}>
            節気・月相をGoogleカレンダーに追加するには、まずGoogleアカウントでログインしてください。
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

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {[
              { key: "sekki", label: "二十四節気", emoji: "🌿" },
              { key: "moon",  label: "新月・満月", emoji: "🌕" },
            ].map(({ key, label, emoji }) => (
              <label key={key} style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                fontSize: "0.85rem", cursor: "pointer",
              }}>
                <input
                  type="checkbox"
                  checked={types[key as keyof typeof types]}
                  onChange={() => toggleType(key as keyof typeof types)}
                  style={{ accentColor: "var(--indigo)" }}
                />
                {emoji} {label}
              </label>
            ))}
          </div>

          <button
            onClick={sync}
            disabled={loading || Object.values(types).every(v => !v)}
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
                : `✓ ${result.ok}件を追加しました（全${result.total}件${result.fail > 0 ? `、${result.fail}件失敗` : ""}）`
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
}
