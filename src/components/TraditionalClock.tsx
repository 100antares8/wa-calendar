"use client";

import { useEffect, useState } from "react";
import {
  JUNISHI_TIMES,
  getCurrentJunishiTime,
  getFuteijiTime,
  getTimeOfDay,
  getJunishiDiskRotationDegrees,
} from "@/lib/traditional-time";
import { getJstClock } from "@/lib/jst-date";

function useLayoutWide(breakpoint: number) {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [breakpoint]);
  return wide;
}

function westernHourLabelAngle(clockHour: number): number {
  const h = clockHour === 12 ? 0 : clockHour;
  return (h * 30 - 90) * (Math.PI / 180);
}

function WesternClockFace({ now, size, labelFs }: { now: Date; size: number; labelFs: number }) {
  const { hour, minute: min, second: sec } = getJstClock(now);
  const cx = size / 2;
  const cy = size / 2;
  const R = cx - 12;
  const markDist = R - 16;
  const hLen = R - 26;
  const mLen = R - 14;
  const sLen = R - 9;
  const clockAngle = ((hour % 12) + min / 60) * 30;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={R} fill="#fdf6e3" />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#3d2c1e" strokeWidth="2" />
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => {
        const ang = westernHourLabelAngle(n);
        const xm = cx + markDist * Math.cos(ang);
        const ym = cy + markDist * Math.sin(ang);
        return (
          <text
            key={n}
            x={xm}
            y={ym + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={labelFs}
            fill="#3d2c1e"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight={600}
          >
            {n}
          </text>
        );
      })}
      <line
        x1={cx}
        y1={cy}
        x2={cx + hLen * Math.sin(clockAngle * Math.PI / 180)}
        y2={cy - hLen * Math.cos(clockAngle * Math.PI / 180)}
        stroke="#5c4033"
        strokeWidth={size > 160 ? 3 : 2.2}
        strokeLinecap="round"
      />
      <line
        x1={cx}
        y1={cy}
        x2={cx + mLen * Math.sin(min * 6 * Math.PI / 180)}
        y2={cy - mLen * Math.cos(min * 6 * Math.PI / 180)}
        stroke="#1a1008"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <line
        x1={cx}
        y1={cy}
        x2={cx + sLen * Math.sin(sec * 6 * Math.PI / 180)}
        y2={cy - sLen * Math.cos(sec * 6 * Math.PI / 180)}
        stroke="#b45309"
        strokeWidth={1}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={size > 160 ? 4 : 3} fill="#5c4033" />
    </svg>
  );
}

function WaRotatingClockFace({ now, size, labelFs }: { now: Date; size: number; labelFs: number }) {
  const jt = getCurrentJunishiTime(now);
  const cx = size / 2;
  const cy = size / 2;
  const R = cx - 12;
  const markDist = R - 16;
  const rot = getJunishiDiskRotationDegrees(now);
  const handLen = R - 20;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={R} fill="#1a1008" />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#c9a84c" strokeWidth="2" />
      <g transform={`rotate(${rot} ${cx} ${cy})`}>
        {JUNISHI_TIMES.map((jTime, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const xMark = cx + markDist * Math.cos(angle);
          const yMark = cy + markDist * Math.sin(angle);
          const isCurrent = jTime.junishi === jt.junishi;
          return (
            <text
              key={jTime.junishi}
              x={xMark}
              y={yMark + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={labelFs}
              fill={isCurrent ? "#ffffff" : "#c9a84c"}
              fontFamily="serif"
              fontWeight={isCurrent ? 800 : 600}
            >
              {jTime.junishi}
            </text>
          );
        })}
      </g>
      <line
        x1={cx}
        y1={cy + 4}
        x2={cx}
        y2={cy - handLen}
        stroke="#f0d78c"
        strokeWidth={size > 160 ? 3 : 2.4}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={size > 160 ? 4.5 : 3.5} fill="#c9a84c" />
      <circle cx={cx} cy={cy} r={size > 160 ? 2 : 1.5} fill="#1a1008" />
    </svg>
  );
}

export default function TraditionalClock({
  compact = false,
  comfortable = false,
}: { compact?: boolean; comfortable?: boolean }) {
  const [now, setNow] = useState(new Date());
  const layoutPairWide = useLayoutWide(768);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const jt = getCurrentJunishiTime(now);
  const futeiji = getFuteijiTime(now);
  const tod = getTimeOfDay(now);
  const { hour, minute: min, second: sec } = getJstClock(now);

  const tabletComfort = compact && comfortable;
  const sizeCompact = layoutPairWide ? 156 : 132;
  const sizeFull = layoutPairWide ? 208 : 188;
  const size = compact ? sizeCompact : sizeFull;
  const labelFs = compact ? 11 : 12;

  const dualFaces = (
    <div
      style={{
        display: "flex",
        flexDirection: layoutPairWide ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        gap: layoutPairWide ? "0.65rem" : "0.45rem",
        flexShrink: 0,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "0.62rem", color: "var(--text2)", marginBottom: "0.15rem", letterSpacing: "0.1em" }}>
          西洋時計
        </div>
        <WesternClockFace now={now} size={size} labelFs={labelFs} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "0.62rem", color: "var(--text2)", marginBottom: "0.15rem", letterSpacing: "0.1em" }}>
          和時計（十二支が回る）
        </div>
        <WaRotatingClockFace now={now} size={size} labelFs={labelFs} />
      </div>
    </div>
  );

  if (compact) {
    return (
      <div
        className="wa-card fade-in"
        style={{
          display: "flex",
          flexDirection: tabletComfort ? "row" : "column",
          alignItems: tabletComfort ? "center" : "center",
          justifyContent: tabletComfort ? "flex-start" : "center",
          gap: tabletComfort ? "0.85rem" : "0.4rem",
          padding: tabletComfort ? "0.55rem 0.85rem" : "0.45rem 0.5rem",
          width: tabletComfort ? "100%" : undefined,
          boxSizing: "border-box",
        }}
      >
        {dualFaces}
        <div
          style={{
            textAlign: tabletComfort ? "left" : "center",
            width: tabletComfort ? "auto" : "100%",
            flex: tabletComfort ? "1" : undefined,
            minWidth: 0,
          }}
        >
          <div style={{ fontSize: tabletComfort ? "1.2rem" : "1.05rem", fontWeight: 600, color: jt.color, lineHeight: 1.15 }}>
            {jt.junishi}の刻 ·{" "}
            <span style={{ color: "var(--text)", fontFamily: "var(--font-sans)" }}>
              {hour.toString().padStart(2, "0")}:{min.toString().padStart(2, "0")}
            </span>
            <span style={{ fontSize: tabletComfort ? "0.82rem" : "0.75rem", color: "var(--text2)", fontWeight: 400 }}>
              :{sec.toString().padStart(2, "0")}
            </span>
          </div>
          <div style={{ fontSize: tabletComfort ? "0.72rem" : "0.65rem", color: "var(--text2)", marginTop: "0.15rem", lineHeight: 1.35 }}>
            {jt.reading} · {jt.animal} · {jt.subKoku} · {jt.period}
          </div>
          <div
            style={{
              marginTop: "0.3rem",
              fontSize: tabletComfort ? "0.72rem" : "0.65rem",
              padding: tabletComfort ? "0.35rem 0.5rem" : "0.25rem 0.4rem",
              borderRadius: "4px",
              background: futeiji.current.isDay ? "rgba(251,191,36,0.12)" : "rgba(30,58,95,0.08)",
              color: futeiji.current.isDay ? "#92400e" : "#1e3a5f",
            }}
          >
            不定時 <strong>{futeiji.current.name}</strong>
            <span style={{ color: "var(--text2)", fontWeight: 400 }}> · 鐘{futeiji.current.bellCount}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      {dualFaces}

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2rem", fontWeight: "500", color: jt.color, lineHeight: 1 }}>
          {jt.junishi}の刻
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--text2)", marginTop: "0.25rem" }}>
          {jt.reading}のこく · {jt.animal} · {jt.period}
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text2)", marginTop: "0.25rem" }}>
          {jt.subKoku}（{hour.toString().padStart(2, "0")}:{min.toString().padStart(2, "0")}:{sec.toString().padStart(2, "0")}）
        </div>
      </div>

      <div
        style={{
          background: futeiji.current.isDay ? "rgba(251,191,36,0.1)" : "rgba(30,58,95,0.1)",
          border: `1px solid ${futeiji.current.isDay ? "rgba(251,191,36,0.3)" : "rgba(30,58,95,0.3)"}`,
          borderRadius: "6px",
          padding: "0.6rem 1rem",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div style={{ fontSize: "0.65rem", color: "var(--text2)", letterSpacing: "0.1em" }}>不定時法（江戸時代）</div>
        <div style={{ fontSize: "1.25rem", color: futeiji.current.isDay ? "#92400e" : "#1e3a5f", fontWeight: "500" }}>
          {futeiji.current.name}
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text2)" }}>
          {futeiji.current.reading} · 鐘{futeiji.current.bellCount}打
        </div>
        <div style={{ height: "3px", background: "rgba(0,0,0,0.1)", borderRadius: "2px", marginTop: "0.5rem" }}>
          <div
            style={{
              height: "100%",
              borderRadius: "2px",
              width: `${futeiji.progress * 100}%`,
              background: futeiji.current.isDay ? "#f59e0b" : "#3b82f6",
            }}
          />
        </div>
      </div>

      <div style={{ fontSize: "0.85rem", color: "var(--text2)", textAlign: "center" }}>
        <span style={{ fontWeight: "500" }}>「{tod.name}」</span>
        <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem" }}>{tod.reading}</span>
        <div style={{ fontSize: "0.72rem", marginTop: "0.2rem" }}>{tod.description}</div>
      </div>
    </div>
  );
}
