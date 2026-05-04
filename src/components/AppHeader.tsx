"use client";

import Link from "next/link";

interface Props {
  isAuthed: boolean;
}

export default function AppHeader({ isAuthed }: Props) {
  return (
    <header className="wa-app-header" style={{
      borderBottom: "1px solid var(--border)",
      padding: "0.4rem 0.75rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.5rem",
      position: "sticky",
      top: 0,
      background: "var(--paper)",
      zIndex: 10,
      backdropFilter: "blur(4px)",
      flexWrap: "wrap",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", minWidth: 0, flex: "1 1 auto" }}>
        <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>🗓</span>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: "0.92rem", fontWeight: "700", lineHeight: 1.15 }}>和暦カレンダー</h1>
          <p className="wa-header-sub" style={{ fontSize: "0.58rem", color: "var(--text2)", letterSpacing: "0.06em", marginTop: "1px" }}>
            旧暦・節気・月相・十二支時刻（JST）
          </p>
        </div>
      </div>
      <nav style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap", flexShrink: 0 }}>
        <Link
          href="/?tab=lunar-year"
          className="wa-header-link"
          style={{
            fontSize: "0.68rem",
            color: "var(--indigo)",
            fontFamily: "'Noto Sans JP', sans-serif",
            textDecoration: "none",
            padding: "0.25rem 0.45rem",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            whiteSpace: "nowrap",
          }}
        >
          旧暦の年
        </Link>
        {isAuthed && (
          <div style={{
            fontSize: "0.62rem", color: "var(--moss)",
            display: "flex", alignItems: "center", gap: "0.25rem",
          }} title="Googleカレンダー連携中">
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--moss)", display: "inline-block" }} />
            <span className="wa-google-status">連携中</span>
          </div>
        )}
      </nav>
    </header>
  );
}
