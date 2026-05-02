"use client";

interface Props {
  age: number;
  size?: number;
}

export default function MoonSvg({ age, size = 80 }: Props) {
  const phase = age / 29.53; // 0-1
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;

  // 照らされた側を計算
  // phase 0=新月, 0.5=満月
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;

  // SVGで月の形を描く
  // 右半分を描くか左半分を描くか
  const isWaxing = phase < 0.5; // 満月前は右から光る（北半球視点）

  let moonPath = "";
  if (illumination < 0.02) {
    // 新月：黒い円
    moonPath = `M ${cx},${cy - r} A ${r},${r} 0 1,1 ${cx},${cy + r} A ${r},${r} 0 1,1 ${cx},${cy - r}`;
  } else if (illumination > 0.98) {
    // 満月：光る円
    moonPath = "";
  } else {
    // 半月・三日月の形
    const ellipseRx = Math.abs(Math.cos(2 * Math.PI * phase)) * r;
    const direction = isWaxing ? 1 : -1;
    // 外側の弧（半円）
    const outerArc = `M ${cx},${cy - r} A ${r},${r} 0 1,${isWaxing ? 0 : 1} ${cx},${cy + r}`;
    // 内側の楕円弧
    const innerArc = `A ${ellipseRx},${r} 0 1,${isWaxing ? 1 : 0} ${cx},${cy - r}`;
    moonPath = `${outerArc} ${innerArc} Z`;
  }

  const darkColor = "#1a2030";
  const lightColor = "#fffbe6";
  const glowColor = illumination > 0.8 ? "#fff8c0" : "none";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* 影（暗い円） */}
      <circle cx={cx} cy={cy} r={r} fill={darkColor} />
      {/* 光っている部分 */}
      {illumination > 0.98 ? (
        <circle cx={cx} cy={cy} r={r} fill={lightColor} />
      ) : illumination > 0.02 ? (
        <path d={moonPath} fill={lightColor} />
      ) : null}
      {/* 外輪郭 */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,248,200,0.4)" strokeWidth="1" />
      {/* 満月グロー */}
      {illumination > 0.8 && (
        <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="rgba(255,248,192,0.3)" strokeWidth="6" />
      )}
    </svg>
  );
}
