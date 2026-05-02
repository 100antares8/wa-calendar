"use client";

import { SEKKI_24, KOFU_72, getSeason } from "@/lib/japanese-calendar";

const SEASON_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  "春": { bg: "#fce7f3", text: "#9d174d", border: "#fbcfe8" },
  "夏": { bg: "#d1fae5", text: "#065f46", border: "#a7f3d0" },
  "秋": { bg: "#fef3c7", text: "#92400e", border: "#fde68a" },
  "冬": { bg: "#dbeafe", text: "#1e3a5f", border: "#bfdbfe" },
};

// 節気から季節を判定
function sekkiToSeason(longitude: number): string {
  if (longitude >= 315 || longitude < 45) return "春";
  if (longitude >= 45 && longitude < 135) return "夏";
  if (longitude >= 135 && longitude < 225) return "秋";
  return "冬";
}

export default function SekkiPanel() {
  const now = new Date();
  const currentSunLon = (() => {
    // 現在の太陽黄経の簡易計算
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    return ((dayOfYear - 80) * (360 / 365.25) + 360) % 360;
  })();

  // 現在どの節気か
  let currentSekkiIdx = 0;
  for (let i = 0; i < SEKKI_24.length; i++) {
    if (currentSunLon >= SEKKI_24[i].longitude) currentSekkiIdx = i;
  }

  // 季節グループ
  const seasons = ["春", "夏", "秋", "冬"];
  const seasonGroups: Record<string, typeof SEKKI_24> = { "春": [], "夏": [], "秋": [], "冬": [] };
  // 春から順に並べる
  const ordered = [
    ...SEKKI_24.slice(1), // 立春以降
    SEKKI_24[0],          // 大寒を最後に
  ];
  for (const s of ordered) {
    seasonGroups[sekkiToSeason(s.longitude)].push(s);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2 style={{ fontSize: "1rem", fontWeight: "500", color: "var(--text2)", letterSpacing: "0.1em" }}>
        二十四節気
      </h2>

      {seasons.map(season => {
        const style = SEASON_STYLE[season];
        return (
          <div key={season} style={{
            border: `1px solid ${style.border}`,
            borderRadius: "8px",
            overflow: "hidden",
          }}>
            <div style={{
              background: style.bg, color: style.text,
              padding: "0.4rem 0.75rem",
              fontSize: "0.85rem", fontWeight: "500",
            }}>
              {season === "春" ? "🌸 春" : season === "夏" ? "🌿 夏" : season === "秋" ? "🍁 秋" : "❄️ 冬"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0" }}>
              {seasonGroups[season].map((s, i) => {
                const isCurrent = s.longitude === SEKKI_24[currentSekkiIdx].longitude;
                const kos = KOFU_72.filter(k => k.sekki === s.name);
                return (
                  <div key={s.name} style={{
                    padding: "0.6rem 0.75rem",
                    borderBottom: i < seasonGroups[season].length - 2 ? `1px solid ${style.border}` : "none",
                    borderRight: i % 2 === 0 ? `1px solid ${style.border}` : "none",
                    background: isCurrent ? style.bg : "transparent",
                  }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                      {isCurrent && <span style={{ fontSize: "0.6rem", background: style.text, color: "#fff", borderRadius: "2px", padding: "1px 4px" }}>現在</span>}
                      <span style={{ fontSize: "1rem", fontWeight: isCurrent ? "700" : "400", color: isCurrent ? style.text : "var(--text)" }}>
                        {s.kanji}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text2)" }}>{s.reading}</span>
                    </div>
                    {kos.length > 0 && (
                      <div style={{ marginTop: "0.2rem" }}>
                        {kos.map(k => (
                          <div key={k.ko} style={{ fontSize: "0.62rem", color: "var(--text2)", lineHeight: 1.5 }}>
                            · {k.ko}（{k.reading}）
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
