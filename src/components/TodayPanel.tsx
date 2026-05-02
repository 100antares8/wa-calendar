"use client";

import { useEffect, useState } from "react";
import MoonSvg from "./MoonSvg";

interface TodayData {
  now: string;
  lunar: {
    lunarYear: number; lunarMonth: number; lunarDay: number;
    monthName: string; monthReading: string;
    eto: { eto: string; reading: string };
  };
  moonAge: number;
  moonPhase: { name: string; emoji: string };
  todaySekki: { name: string; kanji: string; reading: string; longitude: number } | null;
  currentSekki: { name: string; kanji: string; reading: string; longitude: number };
  rokuyo: { name: string; reading: string; description: string; color: string };
  season: { name: string; kanji: string; color: string; emoji: string };
  yearEto: { eto: string; reading: string; jikkan: string; junishi: string };
}

const LUNAR_DAY_NAMES: Record<number, string> = {
  1:"朔", 2:"二日", 3:"三日", 4:"四日", 5:"五日",
  6:"六日", 7:"七日", 8:"八日", 9:"九日", 10:"十日",
  11:"十一日", 12:"十二日", 13:"十三日", 14:"十四日", 15:"望",
  16:"十六夜", 17:"立待月", 18:"居待月", 19:"寝待月", 20:"更待月",
  21:"二十一日", 22:"二十二日", 23:"二十三夜", 24:"二十四日",
  25:"二十五日", 26:"二十六日", 27:"二十七日", 28:"二十八日",
  29:"二十九日", 30:"晦日",
};

export default function TodayPanel() {
  const [data, setData] = useState<TodayData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/today")
      .then(r => r.json())
      .then(setData)
      .catch(() => setError("読み込みエラー"));
  }, []);

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!data) return (
    <div style={{ padding: "2rem", textAlign: "center", color: "var(--text2)" }} className="pulse">
      暦を紐解いています…
    </div>
  );

  const date = new Date(data.now);
  const weekdays = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
  const lunarDayName = LUNAR_DAY_NAMES[data.lunar.lunarDay] || `${data.lunar.lunarDay}日`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

      {/* 今日の節気（あれば） */}
      {data.todaySekki && (
        <div style={{
          background: "var(--indigo)",
          color: "#f0e6d3",
          borderRadius: "6px",
          padding: "0.75rem 1rem",
          textAlign: "center",
        }} className="fade-in">
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", opacity: 0.7 }}>本日は二十四節気</div>
          <div style={{ fontSize: "1.75rem", fontWeight: "700", letterSpacing: "0.1em" }}>
            {data.todaySekki.kanji}
          </div>
          <div style={{ fontSize: "0.8rem", opacity: 0.85 }}>{data.todaySekki.reading}</div>
        </div>
      )}

      {/* 今日の日付情報 */}
      <div className="wa-card fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <div className="wa-heading">今日の日付</div>
            <div style={{ fontSize: "1.1rem", marginTop: "0.25rem" }}>
              {date.getFullYear()}年{date.getMonth()+1}月{date.getDate()}日
              <span style={{ fontSize: "0.8rem", color: "var(--text2)", marginLeft: "0.5rem" }}>
                {weekdays[date.getDay()]}
              </span>
            </div>
          </div>
          {/* 季節 */}
          <div style={{
            background: data.season.color,
            borderRadius: "6px",
            padding: "0.35rem 0.75rem",
            fontSize: "1rem",
          }}>
            {data.season.emoji} {data.season.name}
          </div>
        </div>

        <div className="wa-divider" />

        {/* 旧暦 */}
        <div className="wa-heading">旧暦</div>
        <div style={{ marginTop: "0.35rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "baseline" }}>
          <span style={{ fontSize: "0.9rem" }}>
            {data.lunar.lunarYear}年
          </span>
          <span style={{ fontSize: "1rem", fontWeight: "500" }}>
            {data.lunar.monthName}
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text2)" }}>
            ({data.lunar.monthReading})
          </span>
          <span style={{ fontSize: "1rem", fontWeight: "500" }}>
            {lunarDayName}
          </span>
          <span style={{ fontSize: "0.8rem", color: "var(--text2)" }}>
            ({data.lunar.lunarDay}日)
          </span>
        </div>

        <div className="wa-divider" />

        {/* 干支・六曜 */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <div className="wa-heading">干支（年）</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "500", marginTop: "0.2rem" }}>
              {data.yearEto.eto}
              <span style={{ fontSize: "0.75rem", color: "var(--text2)", marginLeft: "0.4rem" }}>
                {data.yearEto.reading}
              </span>
            </div>
          </div>
          <div>
            <div className="wa-heading">六曜</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "500", marginTop: "0.2rem" }}>
              <span style={{ color: data.rokuyo.color }}>{data.rokuyo.name}</span>
              <span style={{ fontSize: "0.7rem", color: "var(--text2)", display: "block" }}>
                {data.rokuyo.description}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 月 */}
      <div className="wa-card fade-in" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <MoonSvg age={data.moonAge} size={70} />
        <div style={{ flex: 1 }}>
          <div className="wa-heading">今日の月</div>
          <div style={{ fontSize: "1.2rem", fontWeight: "500", marginTop: "0.2rem" }}>
            {data.moonPhase.emoji} {data.moonPhase.name}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text2)" }}>
            月齢 {data.moonAge.toFixed(1)}
          </div>
          {/* 月齢バー */}
          <div style={{ height: "4px", background: "var(--border)", borderRadius: "2px", marginTop: "0.5rem" }}>
            <div style={{
              height: "100%", borderRadius: "2px",
              width: `${(data.moonAge / 29.53) * 100}%`,
              background: "linear-gradient(to right, #1a2030, #fffbe6)",
            }} />
          </div>
        </div>
      </div>

      {/* 現在の節気 */}
      <div className="wa-card fade-in">
        <div className="wa-heading">現在の節気</div>
        <div style={{ marginTop: "0.35rem" }}>
          <span style={{ fontSize: "1.1rem", fontWeight: "500" }}>{data.currentSekki.kanji}</span>
          <span style={{ fontSize: "0.8rem", color: "var(--text2)", marginLeft: "0.5rem" }}>
            {data.currentSekki.reading} · 太陽黄経 {data.currentSekki.longitude}°
          </span>
        </div>
      </div>
    </div>
  );
}
