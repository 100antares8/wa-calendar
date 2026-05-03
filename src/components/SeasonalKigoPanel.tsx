"use client";

import { useMemo, useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { getJstYmd } from "@/lib/jst-date";
import { getDailySeasonalBundle, type SeasonalLine } from "@/lib/daily-seasonal-wisdom";

const blockStyle: CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "0.65rem 0.85rem",
  background: "rgba(255,255,255,0.45)",
};

function LineBlock({ title, sub, line }: { title: string; sub: string; line: SeasonalLine }) {
  return (
    <section style={blockStyle} className="fade-in">
      <div style={{ fontSize: "0.68rem", color: "var(--indigo)", fontWeight: 700, letterSpacing: "0.08em" }}>{title}</div>
      <div style={{ fontSize: "0.62rem", color: "var(--text2)", marginBottom: "0.35rem" }}>{sub}</div>
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
    <div style={{ maxWidth: "720px", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: 0, letterSpacing: "0.06em" }}>
        季語・名話
      </h2>
      <p style={{ fontSize: "0.74rem", color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>
        日本の季節暦に関連することわざ・熟語、和の先人の言葉や俳句趣、茶の相承に関する言い伝え・心得、
        山野の草花や水の一句です。日付（日本標準時）ごとに内容が替わります。
      </p>
      <LineBlock title="季節暦のことわざ・熟語" sub="暦や季節を味わう言葉" line={bundle.proverb} />
      <LineBlock title="先人の言葉・俳句趣" sub="歌・俳諧・随筆などの心象にふれる一句" line={bundle.figure} />
      <LineBlock title="茶・茶湯に関する言葉" sub="千利休・表千家・裏千家・江戸千家の系統をふまえた教訓・見立て" line={bundle.tea} />
      <LineBlock title="自然の一句" sub="花・川・山など、季の景色を一首に凝縮" line={bundle.nature} />
    </div>
  );
}
