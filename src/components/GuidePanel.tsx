"use client";

import type { CSSProperties, ReactNode } from "react";
import { SEKKI_24, ROKUYO, ROKUYO_READINGS, ROKUYO_DESC } from "@/lib/japanese-calendar";
import { JUNISHI_TIMES } from "@/lib/traditional-time";

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.72rem",
  fontFamily: "'Noto Sans JP', var(--font-sans, sans-serif)",
};

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "6px 8px",
  borderBottom: "2px solid var(--border)",
  color: "var(--text2)",
  fontWeight: 600,
  background: "rgba(30,58,95,0.06)",
};

const tdStyle: CSSProperties = {
  padding: "5px 8px",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  verticalAlign: "top",
  color: "var(--text)",
};

function section(title: string, subtitle: string, children: ReactNode) {
  return (
    <section className="wa-card fade-in" style={{ marginBottom: "1rem" }}>
      <h2 style={{
        fontSize: "1rem",
        fontWeight: 700,
        margin: "0 0 0.15rem",
        letterSpacing: "0.06em",
      }}>
        {title}
      </h2>
      <p style={{ fontSize: "0.72rem", color: "var(--text2)", margin: "0 0 0.85rem", lineHeight: 1.5 }}>
        {subtitle}
      </p>
      {children}
    </section>
  );
}

function formatJunishiHours(j: (typeof JUNISHI_TIMES)[0]): string {
  if (j.start === 23) return "23:00〜01:00";
  return `${String(j.start).padStart(2, "0")}:00〜${String(j.end).padStart(2, "0")}:00`;
}

export default function GuidePanel() {
  return (
    <div style={{ maxWidth: "720px" }}>
      {section(
        "暦の解説",
        "このアプリで扱う旧暦・二十四節気・六曜の意味です。旧暦（太陰太陽暦）は月の満ち欠けと太陽年を組み合わせた暦で、朔望月により月日が定まります。二十四節気は太陽黄経15°ごとの季節の目安で、節入り日に切り替わります。",
        <>
          <h3 style={{ fontSize: "0.85rem", margin: "1rem 0 0.4rem", color: "var(--indigo)" }}>二十四節気</h3>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" } as CSSProperties}>
            <table style={{ ...tableStyle, minWidth: "320px" }}>
              <thead>
                <tr>
                  <th style={thStyle}>節気</th>
                  <th style={thStyle}>読み</th>
                  <th style={thStyle}>太陽黄経（°）</th>
                </tr>
              </thead>
              <tbody>
                {SEKKI_24.map(s => (
                  <tr key={s.kanji}>
                    <td style={tdStyle}>{s.kanji}</td>
                    <td style={tdStyle}>{s.reading}</td>
                    <td style={tdStyle}>{s.longitude}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: "0.85rem", margin: "1rem 0 0.4rem", color: "var(--indigo)" }}>六曜</h3>
          <p style={{ fontSize: "0.7rem", color: "var(--text2)", margin: "0 0 0.5rem" }}>
            旧暦の月日から算出される吉凶の目安（一般的な六輝順）。吉凶は信仰・風習であり、科学的な予測ではありません。
          </p>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" } as CSSProperties}>
            <table style={{ ...tableStyle, minWidth: "280px" }}>
              <thead>
                <tr>
                  <th style={thStyle}>六曜</th>
                  <th style={thStyle}>読み</th>
                  <th style={thStyle}>一般的な意味</th>
                </tr>
              </thead>
              <tbody>
                {ROKUYO.map((name, i) => (
                  <tr key={name}>
                    <td style={tdStyle}>{name}</td>
                    <td style={tdStyle}>{ROKUYO_READINGS[i]}</td>
                    <td style={tdStyle}>{ROKUYO_DESC[i]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>,
      )}

      {section(
        "十二支の解説",
        "定時法（現代の時刻表示）に対応する「十二支の刻」です。各刻はおおよそ2時間で、1刻は4分の1（約30分）としてアプリの「時刻」タブに反映しています。子の刻は23時〜1時のように日をまたぎます。鐘の数は寺鐘（時鐘）の伝統的な打数の一例です。",
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" } as CSSProperties}>
          <table style={{ ...tableStyle, minWidth: "340px" }}>
            <thead>
              <tr>
                <th style={thStyle}>十二支</th>
                <th style={thStyle}>読み</th>
                <th style={thStyle}>獣</th>
                <th style={thStyle}>時刻（目安）</th>
                <th style={thStyle}>時称</th>
              </tr>
            </thead>
            <tbody>
              {JUNISHI_TIMES.map(j => (
                <tr key={j.junishi}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{j.junishi}</td>
                  <td style={tdStyle}>{j.reading}</td>
                  <td style={tdStyle}>{j.animal}</td>
                  <td style={tdStyle}>{formatJunishiHours(j)}</td>
                  <td style={tdStyle}>{j.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )}
    </div>
  );
}
