"use client";

import { useEffect, useState } from "react";
import { JUNISHI_TIMES, getCurrentJunishiTime, getFuteijiTime, getTimeOfDay } from "@/lib/traditional-time";

export default function TraditionalClock({ compact = false, comfortable = false }: { compact?: boolean; comfortable?: boolean }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const jt = getCurrentJunishiTime(now);
  const futeiji = getFuteijiTime(now);
  const tod = getTimeOfDay(now);
  const hour = now.getHours();
  const min  = now.getMinutes();
  const sec  = now.getSeconds();

  // 時計の角度（十二支は2時間ごと）
  const clockAngle = ((hour % 12) + min / 60) * 30; // 360/12=30°/時

  const tabletComfort = compact && comfortable;
  const size = compact ? (tabletComfort ? 168 : 132) : 220;
  const cx = size / 2;
  const cy = size / 2;
  const R = cx - 12;
  const markDist = R - (tabletComfort ? 16 : compact ? 14 : 18);
  const hLen = R - (tabletComfort ? 32 : compact ? 28 : 50);
  const mLen = R - (tabletComfort ? 18 : compact ? 16 : 30);
  const sLen = R - (tabletComfort ? 12 : compact ? 10 : 20);
  const markR = (cur: boolean) => (tabletComfort ? (cur ? 10 : 7) : compact ? (cur ? 8 : 6) : (cur ? 12 : 9));
  const markFs = (cur: boolean) => (tabletComfort ? (cur ? 11 : 8) : compact ? (cur ? 9 : 7) : (cur ? 11 : 9));

  const clockSvg = (
    <div style={{ position: "relative" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 背景 */}
        <circle cx={cx} cy={cy} r={R} fill="#1a1008" />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#c9a84c" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={R - 8} fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />

        {/* 十二支の目盛り（古い和時計は子から始まり時計回りの反対） */}
        {JUNISHI_TIMES.map((jTime, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const xMark = cx + markDist * Math.cos(angle);
          const yMark = cy + markDist * Math.sin(angle);
          const isCurrent = jTime.junishi === jt.junishi;
          return (
            <g key={jTime.junishi}>
              <circle
                cx={xMark} cy={yMark} r={markR(isCurrent)}
                fill={isCurrent ? jTime.color : "rgba(201,168,76,0.2)"}
                stroke={isCurrent ? "#c9a84c" : "rgba(201,168,76,0.4)"}
                strokeWidth="1"
              />
              <text
                x={xMark} y={yMark + 1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={markFs(isCurrent)}
                fill={isCurrent ? "#fff" : "#c9a84c"}
                fontFamily="serif"
              >
                {jTime.junishi}
              </text>
            </g>
          );
        })}

        {/* 鐘の数（外側） */}
        {!compact && JUNISHI_TIMES.map((jTime, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const xBell = cx + (R - 36) * Math.cos(angle);
          const yBell = cy + (R - 36) * Math.sin(angle);
          const bells = jTime.junishi === "午" || jTime.junishi === "子" ? 9 :
                        jTime.junishi === "丑" || jTime.junishi === "未" ? 8 :
                        jTime.junishi === "寅" || jTime.junishi === "申" ? 7 :
                        jTime.junishi === "卯" || jTime.junishi === "酉" ? 6 :
                        jTime.junishi === "辰" || jTime.junishi === "戌" ? 5 : 4;
          return (
            <text key={`bell-${i}`} x={xBell} y={yBell + 1}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="7" fill="rgba(201,168,76,0.6)" fontFamily="serif"
            >
              {bells}
            </text>
          );
        })}

        {/* 時針 */}
        <line
          x1={cx} y1={cy}
          x2={cx + hLen * Math.sin(clockAngle * Math.PI / 180)}
          y2={cy - hLen * Math.cos(clockAngle * Math.PI / 180)}
          stroke="#c9a84c" strokeWidth={tabletComfort ? 2.5 : compact ? 2 : 3} strokeLinecap="round"
        />
        {/* 分針 */}
        <line
          x1={cx} y1={cy}
          x2={cx + mLen * Math.sin(min * 6 * Math.PI / 180)}
          y2={cy - mLen * Math.cos(min * 6 * Math.PI / 180)}
          stroke="#f0e6d3" strokeWidth={tabletComfort ? 1.4 : compact ? 1.2 : 1.5} strokeLinecap="round"
        />
        {/* 秒針 */}
        <line
          x1={cx} y1={cy}
          x2={cx + sLen * Math.sin(sec * 6 * Math.PI / 180)}
          y2={cy - sLen * Math.cos(sec * 6 * Math.PI / 180)}
          stroke="#c0392b" strokeWidth="1" strokeLinecap="round"
        />
        {/* 中心 */}
        <circle cx={cx} cy={cy} r={tabletComfort ? "3.5" : compact ? "3" : "5"} fill="#c9a84c" />
        <circle cx={cx} cy={cy} r={tabletComfort ? "1.75" : compact ? "1.5" : "2"} fill="#1a1008" />
      </svg>
    </div>
  );

  if (compact) {
    return (
      <div className="wa-card fade-in" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: tabletComfort ? "0.5rem" : "0.35rem",
        padding: tabletComfort ? "0.55rem 0.7rem" : "0.4rem 0.5rem",
      }}>
        {clockSvg}
        <div style={{ textAlign: "center", width: "100%" }}>
          <div style={{ fontSize: tabletComfort ? "1.2rem" : "1.05rem", fontWeight: 600, color: jt.color, lineHeight: 1.15 }}>
            {jt.junishi}の刻 · <span style={{ color: "var(--text)", fontFamily: "var(--font-sans)" }}>
              {hour.toString().padStart(2, "0")}:{min.toString().padStart(2, "0")}
            </span>
            <span style={{ fontSize: tabletComfort ? "0.82rem" : "0.75rem", color: "var(--text2)", fontWeight: 400 }}>:{sec.toString().padStart(2, "0")}</span>
          </div>
          <div style={{ fontSize: tabletComfort ? "0.72rem" : "0.65rem", color: "var(--text2)", marginTop: "0.15rem", lineHeight: 1.35 }}>
            {jt.reading} · {jt.animal} · {jt.subKoku} · {jt.period}
          </div>
          <div style={{
            marginTop: "0.3rem",
            fontSize: tabletComfort ? "0.72rem" : "0.65rem",
            padding: tabletComfort ? "0.35rem 0.5rem" : "0.25rem 0.4rem",
            borderRadius: "4px",
            background: futeiji.current.isDay ? "rgba(251,191,36,0.12)" : "rgba(30,58,95,0.08)",
            color: futeiji.current.isDay ? "#92400e" : "#1e3a5f",
          }}>
            不定時 <strong>{futeiji.current.name}</strong>
            <span style={{ color: "var(--text2)", fontWeight: 400 }}> · 鐘{futeiji.current.bellCount}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      {clockSvg}

      {/* 現在の刻 */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2rem", fontWeight: "500", color: jt.color, lineHeight: 1 }}>
          {jt.junishi}の刻
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--text2)", marginTop: "0.25rem" }}>
          {jt.reading}のこく · {jt.animal} · {jt.period}
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text2)", marginTop: "0.25rem" }}>
          {jt.subKoku}（{hour.toString().padStart(2,"0")}:{min.toString().padStart(2,"0")}:{sec.toString().padStart(2,"0")}）
        </div>
      </div>

      {/* 不定時法 */}
      <div style={{
        background: futeiji.current.isDay ? "rgba(251,191,36,0.1)" : "rgba(30,58,95,0.1)",
        border: `1px solid ${futeiji.current.isDay ? "rgba(251,191,36,0.3)" : "rgba(30,58,95,0.3)"}`,
        borderRadius: "6px",
        padding: "0.6rem 1rem",
        textAlign: "center",
        width: "100%",
      }}>
        <div style={{ fontSize: "0.65rem", color: "var(--text2)", letterSpacing: "0.1em" }}>不定時法（江戸時代）</div>
        <div style={{ fontSize: "1.25rem", color: futeiji.current.isDay ? "#92400e" : "#1e3a5f", fontWeight: "500" }}>
          {futeiji.current.name}
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text2)" }}>
          {futeiji.current.reading} · 鐘{futeiji.current.bellCount}打
        </div>
        {/* プログレスバー */}
        <div style={{ height: "3px", background: "rgba(0,0,0,0.1)", borderRadius: "2px", marginTop: "0.5rem" }}>
          <div style={{
            height: "100%", borderRadius: "2px",
            width: `${futeiji.progress * 100}%`,
            background: futeiji.current.isDay ? "#f59e0b" : "#3b82f6",
          }} />
        </div>
      </div>

      {/* 時の呼び名 */}
      <div style={{ fontSize: "0.85rem", color: "var(--text2)", textAlign: "center" }}>
        <span style={{ fontWeight: "500" }}>「{tod.name}」</span>
        <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem" }}>{tod.reading}</span>
        <div style={{ fontSize: "0.72rem", marginTop: "0.2rem" }}>{tod.description}</div>
      </div>
    </div>
  );
}
