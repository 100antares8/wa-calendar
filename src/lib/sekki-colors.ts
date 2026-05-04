/** 二十四節気の黄経から、セル内ラベル用の配色 */

export function getSekkiLineColors(longitude: number): {
  background: string;
  color: string;
  border: string;
} {
  const lon = ((longitude % 360) + 360) % 360;
  if (lon >= 315 || lon < 45) {
    return { background: "rgba(244,114,182,0.22)", color: "#831843", border: "rgba(157,23,77,0.35)" };
  }
  if (lon < 135) {
    return { background: "rgba(52,211,153,0.2)", color: "#064e3b", border: "rgba(6,95,70,0.35)" };
  }
  if (lon < 225) {
    return { background: "rgba(251,191,36,0.28)", color: "#78350f", border: "rgba(180,83,9,0.4)" };
  }
  return { background: "rgba(96,165,250,0.22)", color: "#1e3a8a", border: "rgba(30,58,95,0.35)" };
}

export function getSekkiLineColorsToday(longitude: number): {
  background: string;
  color: string;
  border: string;
} {
  const base = getSekkiLineColors(longitude);
  return {
    background: "rgba(255,255,255,0.18)",
    color: "#fef3c7",
    border: base.border,
  };
}
