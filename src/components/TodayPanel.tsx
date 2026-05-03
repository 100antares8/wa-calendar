"use client";

import { useEffect, useState, useMemo } from "react";
import MoonSvg from "./MoonSvg";
import { getDailySeasonalBundle } from "@/lib/daily-seasonal-wisdom";

interface TodayData {
  now: string;
  jst: {
    y: number;
    m: number;
    d: number;
    weekdayShort: string;
    weekdayLabel: string;
  };
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

function useTodayData() {
  const [data, setData] = useState<TodayData | null>(null);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  const load = () => {
    fetch("/api/today")
      .then(r => r.json())
      .then(setData)
      .catch(() => setError("読み込みエラー"));
  };

  useEffect(() => {
    load();
  }, [tick]);

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

  return { data, error };
}

function TodayFeatured({ jst, comfortable = false }: { jst: { y: number; m: number; d: number }; comfortable?: boolean }) {
  const bundle = useMemo(() => getDailySeasonalBundle(jst), [jst.y, jst.m, jst.d]);
  const f = bundle.featured;
  const kindLabel =
    bundle.featuredKind === "proverb" ? "ことわざ・熟語"
    : bundle.featuredKind === "figure" ? "先人の一句"
    : bundle.featuredKind === "tea" ? "茶の言葉"
    : "自然の一句";

  const pad = comfortable ? "0.75rem 1rem" : "0.55rem 0.75rem";
  const fsLabel = comfortable ? "0.75rem" : "0.62rem";
  const fsMain = comfortable ? "1.05rem" : "0.88rem";
  const fsSub = comfortable ? "0.82rem" : "0.72rem";
  const borderW = comfortable ? 5 : 4;

  return (
    <div className="wa-card fade-in" style={{
      padding: pad,
      borderLeft: `${borderW}px solid var(--indigo)`,
      background: "rgba(30,58,95,0.05)",
    }}>
      <div style={{ fontSize: fsLabel, color: "var(--text2)", letterSpacing: "0.1em", marginBottom: comfortable ? "0.35rem" : "0.25rem" }}>
        今日の季語 · {kindLabel}
      </div>
      <p style={{ fontSize: fsMain, fontWeight: 600, lineHeight: 1.45, margin: "0 0 0.3rem" }}>{f.text}</p>
      {f.attribution && (
        <div style={{ fontSize: fsSub, color: "var(--text2)", marginBottom: "0.3rem" }}>— {f.attribution}</div>
      )}
      <p style={{ fontSize: fsSub, color: "var(--text2)", lineHeight: 1.55, margin: 0 }}>{f.note}</p>
    </div>
  );
}

export default function TodayPanel({ compact = false, comfortable = false }: { compact?: boolean; comfortable?: boolean }) {
  const { data, error } = useTodayData();

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!data?.jst) return (
    <div style={{ padding: "2rem", textAlign: "center", color: "var(--text2)" }} className="pulse">
      暦を紐解いています…
    </div>
  );

  const { jst } = data;
  const lunarDayName = LUNAR_DAY_NAMES[data.lunar.lunarDay] || `${data.lunar.lunarDay}日`;
  const heading = `${jst.y}年${jst.m}月${jst.d}日`;

  if (compact) {
    const g = comfortable ? "0.5rem" : "0.35rem";
    const cardPad = comfortable ? "0.65rem 0.85rem" : "0.5rem 0.65rem";
    const moonSize = comfortable ? 56 : 46;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: g }}>
        <TodayFeatured jst={jst} comfortable={comfortable} />

        {data.todaySekki && (
          <div style={{
            background: "var(--indigo)",
            color: "#f0e6d3",
            borderRadius: "5px",
            padding: comfortable ? "0.5rem 0.65rem" : "0.35rem 0.5rem",
            textAlign: "center",
          }} className="fade-in">
            <div style={{ fontSize: comfortable ? "0.65rem" : "0.55rem", letterSpacing: "0.12em", opacity: 0.85 }}>本日·二十四節気</div>
            <div style={{ fontSize: comfortable ? "1.35rem" : "1.15rem", fontWeight: 700, letterSpacing: "0.08em", lineHeight: 1.2 }}>
              {data.todaySekki.kanji}
            </div>
            <div style={{ fontSize: comfortable ? "0.75rem" : "0.65rem", opacity: 0.9 }}>{data.todaySekki.reading}</div>
          </div>
        )}

        <div className="wa-card fade-in" style={{ padding: cardPad }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
            <div style={{ fontSize: comfortable ? "1.02rem" : "0.88rem", fontWeight: 600, lineHeight: 1.3 }}>
              {heading}
              <span style={{ fontSize: comfortable ? "0.78rem" : "0.68rem", color: "var(--text2)", fontWeight: 400, marginLeft: "0.35rem" }}>
                {jst.weekdayShort}
              </span>
            </div>
            <div style={{
              background: data.season.color,
              borderRadius: "4px",
              padding: comfortable ? "0.22rem 0.55rem" : "0.15rem 0.45rem",
              fontSize: comfortable ? "0.88rem" : "0.78rem",
            }}>
              {data.season.emoji}{data.season.name}
            </div>
          </div>
          <div style={{ fontSize: comfortable ? "0.72rem" : "0.62rem", color: "var(--text2)", marginTop: "0.25rem" }}>
            グレゴリオ日付は日本標準時（JST）基準です。
          </div>
          <div className="wa-divider" style={{ margin: comfortable ? "0.45rem 0" : "0.35rem 0" }} />
          <div style={{ fontSize: comfortable ? "0.8rem" : "0.72rem", color: "var(--text2)", marginBottom: "0.2rem" }}>旧暦</div>
          <div style={{ fontSize: comfortable ? "0.9rem" : "0.78rem", lineHeight: 1.35 }}>
            {data.lunar.lunarYear}年 {data.lunar.monthName}
            <span style={{ color: "var(--text2)", fontSize: comfortable ? "0.76rem" : "0.68rem" }}>（{data.lunar.monthReading}）</span>
            {" "}{lunarDayName}
            <span style={{ color: "var(--text2)", fontSize: comfortable ? "0.76rem" : "0.68rem" }}>（{data.lunar.lunarDay}日）</span>
          </div>
          <div className="wa-divider" style={{ margin: comfortable ? "0.45rem 0" : "0.35rem 0" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 0.75rem", alignItems: "baseline", fontSize: comfortable ? "0.9rem" : "0.78rem" }}>
            <span>
              <span style={{ color: "var(--text2)", fontSize: comfortable ? "0.72rem" : "0.65rem" }}>年干支</span>{" "}
              <strong>{data.yearEto.eto}</strong>
              <span style={{ color: "var(--text2)", fontSize: comfortable ? "0.72rem" : "0.65rem", marginLeft: "0.2rem" }}>{data.yearEto.reading}</span>
            </span>
            <span>
              <span style={{ color: "var(--text2)", fontSize: comfortable ? "0.72rem" : "0.65rem" }}>六曜</span>{" "}
              <strong style={{ color: data.rokuyo.color }}>{data.rokuyo.name}</strong>
            </span>
          </div>
        </div>

        <div className="wa-card fade-in" style={{ display: "flex", alignItems: "center", gap: comfortable ? "0.65rem" : "0.5rem", padding: cardPad }}>
          <MoonSvg age={data.moonAge} size={moonSize} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: comfortable ? "0.72rem" : "0.65rem", color: "var(--text2)" }}>月相</div>
            <div style={{ fontSize: comfortable ? "0.98rem" : "0.88rem", fontWeight: 600, lineHeight: 1.25 }}>
              {data.moonPhase.emoji} {data.moonPhase.name}
              <span style={{ fontSize: comfortable ? "0.76rem" : "0.68rem", color: "var(--text2)", fontWeight: 400, marginLeft: "0.35rem" }}>
                月齢{data.moonAge.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="wa-card fade-in" style={{ padding: cardPad, fontSize: comfortable ? "0.82rem" : "0.72rem" }}>
          <span style={{ color: "var(--text2)" }}>現在の節気</span>{" "}
          <strong>{data.currentSekki.kanji}</strong>
          <span style={{ color: "var(--text2)", marginLeft: "0.35rem" }}>
            {data.currentSekki.reading} · 黄経{data.currentSekki.longitude}°
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

      <TodayFeatured jst={jst} />

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

      <div className="wa-card fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <div className="wa-heading">今日の日付</div>
            <div style={{ fontSize: "1.1rem", marginTop: "0.25rem" }}>
              {heading}
              <span style={{ fontSize: "0.8rem", color: "var(--text2)", marginLeft: "0.5rem" }}>
                {jst.weekdayLabel}
              </span>
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text2)", marginTop: "0.2rem" }}>
              グレゴリオ暦・日本標準時（JST）の「今日」です。
            </div>
          </div>
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
          <div style={{ height: "4px", background: "var(--border)", borderRadius: "2px", marginTop: "0.5rem" }}>
            <div style={{
              height: "100%", borderRadius: "2px",
              width: `${(data.moonAge / 29.53) * 100}%`,
              background: "linear-gradient(to right, #1a2030, #fffbe6)",
            }} />
          </div>
        </div>
      </div>

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
