"use client";

import { useMemo, useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { getJstYmd } from "@/lib/jst-date";
import { getDailySeasonalBundle } from "@/lib/daily-seasonal-wisdom";

const box: CSSProperties = {
  borderLeft: "3px solid var(--indigo)",
  padding: "0.5rem 0 0.5rem 0.75rem",
  background: "rgba(30,58,95,0.04)",
  borderRadius: "0 6px 6px 0",
};

export default function DailySeasonalAside() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000);
    const onVis = () => {
      if (document.visibilityState === "visible") setTick(t => t + 1);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const bundle = useMemo(() => getDailySeasonalBundle(getJstYmd(new Date())), [tick]);

  return (
    <aside className="fade-in">
      <div style={{ fontSize: "0.65rem", color: "var(--text2)", letterSpacing: "0.12em", marginBottom: "0.35rem" }}>
        今日の一句（{bundle.featuredKind === "proverb" ? "ことわざ" : bundle.featuredKind === "figure" ? "先人" : bundle.featuredKind === "tea" ? "茶" : "自然"}）
      </div>
      <div style={box}>
        <p style={{ fontSize: "0.82rem", fontWeight: 600, lineHeight: 1.45, margin: "0 0 0.35rem" }}>
          {bundle.featured.text}
        </p>
        {bundle.featured.attribution && (
          <div style={{ fontSize: "0.7rem", color: "var(--text2)", marginBottom: "0.35rem" }}>
            — {bundle.featured.attribution}
          </div>
        )}
        <p style={{ fontSize: "0.72rem", color: "var(--text2)", lineHeight: 1.5, margin: 0 }}>
          {bundle.featured.note}
        </p>
      </div>
      <p style={{ fontSize: "0.62rem", color: "var(--text2)", marginTop: "0.5rem", lineHeight: 1.45 }}>
        ほかの季語・名話は「季語・名話」タブで四種すべて読めます。
      </p>
    </aside>
  );
}
