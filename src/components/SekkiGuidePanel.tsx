"use client";

import SekkiPanel from "./SekkiPanel";
import GuidePanel from "./GuidePanel";

/** 二十四節気の一覧と暦・十二支の解説を一画面にまとめたタブ用 */
export default function SekkiGuidePanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "780px" }}>
      <p style={{ fontSize: "0.75rem", color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>
        節気の一覧・七十二候、および旧暦・六曜・十二支の刻の参照表です。
      </p>
      <SekkiPanel />
      <GuidePanel />
    </div>
  );
}
