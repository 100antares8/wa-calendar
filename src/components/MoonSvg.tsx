"use client";

interface Props {
  age: number;
  size?: number;
}

export default function MoonSvg({ age, size = 80 }: Props) {
  const phase = age / 29.53;
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;

  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  const isWaxing = phase < 0.5;

  let moonPath = "";
  if (illumination < 0.02) {
    moonPath = `M ${cx},${cy - r} A ${r},${r} 0 1,1 ${cx},${cy + r} A ${r},${r} 0 1,1 ${cx},${cy - r}`;
  } else if (illumination > 0.98) {
    moonPath = "";
  } else {
    const ellipseRx = Math.abs(Math.cos(2 * Math.PI * phase)) * r;
    const outerArc = `M ${cx},${cy - r} A ${r},${r} 0 1,${isWaxing ? 0 : 1} ${cx},${cy + r}`;
    const innerArc = `A ${ellipseRx},${r} 0 1,${isWaxing ? 1 : 0} ${cx},${cy - r}`;
    moonPath = `${outerArc} ${innerArc} Z`;
  }

  const darkColor = "#0a0a0a";
  const lightColor = "#f5cc00";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill={darkColor} />
      {illumination > 0.98 ? (
        <circle cx={cx} cy={cy} r={r} fill={lightColor} />
      ) : illumination > 0.02 ? (
        <path d={moonPath} fill={lightColor} />
      ) : null}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(245,204,0,0.35)" strokeWidth="1" />
      {illumination > 0.8 && (
        <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke="rgba(245,204,0,0.25)" strokeWidth="4" />
      )}
    </svg>
  );
}
