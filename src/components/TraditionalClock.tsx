"use client";

import { useEffect, useState } from "react";
import { JUNISHI_TIMES, getCurrentJunishiTime, getFuteijiTime, getTimeOfDay } from "@/lib/traditional-time";

export default function TraditionalClock() {
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

  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const R = cx - 12;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      {/* 和時計 */}
      <div style={{ position: "relative" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* 背景 */}
          <circle cx={cx} cy={cy} r={R} fill="#1a1008" />
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#c9a84c" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={R - 8} fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />

          {/* 十二支の目盛り（古い和時計は子から始まり時計回りの反対） */}
          {JUNISHI_TIMES.map((jTime, i) => {
            // 和時計: 子(0)が上、右回り（反時計まわり）
            // 子=上, 丑=右上... → 0,30,60...度 (反時計)
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const xMark = cx + (R - 18) * Math.cos(angle);
            const yMark = cy + (R - 18) * Math.sin(angle);
            const isCurrent = jTime.junishi === jt.junishi;
            return (
              <g key={jTime.junishi}>
                <circle
                  cx={xMark} cy={yMark} r={isCurrent ? 12 : 9}
                  fill={isCurrent ? jTime.color : "rgba(201,168,76,0.2)"}
                  stroke={isCurrent ? "#c9a84c" : "rgba(201,168,76,0.4)"}
                  strokeWidth="1"
                />
                <text
                  x={xMark} y={yMark + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={isCurrent ? "11" : "9"}
                  fill={isCurrent ? "#fff" : "#c9a84c"}
                  fontFamily="serif"
                >
                  {jTime.junishi}
                </text>
              </g>
            );
          })}

          {/* 鐘の数（外側） */}
          {JUNISHI_TIMES.map((jTime, i) => {
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
            x2={cx + (R - 50) * Math.sin(clockAngle * Math.PI / 180)}
            y2={cy - (R - 50) * Math.cos(clockAngle * Math.PI / 180)}
            stroke="#c9a84c" strokeWidth="3" strokeLinecap="round"
          />
          {/* 分針 */}
          <line
            x1={cx} y1={cy}
            x2={cx + (R - 30) * Math.sin(min * 6 * Math.PI / 180)}
            y2={cy - (R - 30) * Math.cos(min * 6 * Math.PI / 180)}
            stroke="#f0e6d3" strokeWidth="1.5" strokeLinecap="round"
          />
          {/* 秒針 */}
          <line
            x1={cx} y1={cy}
            x2={cx + (R - 20) * Math.sin(sec * 6 * Math.PI / 180)}
            y2={cy - (R - 20) * Math.cos(sec * 6 * Math.PI / 180)}
            stroke="#c0392b" strokeWidth="1" strokeLinecap="round"
          />
          {/* 中心 */}
          <circle cx={cx} cy={cy} r="5" fill="#c9a84c" />
          <circle cx={cx} cy={cy} r="2" fill="#1a1008" />
        </svg>
      </div>

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
