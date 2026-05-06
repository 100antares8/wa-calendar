/**
 * 今日の暦・年中行事のダイジェスト（鑑賞・目安表示）。
 * 旧暦は API と同じ簡易換算に依存（閏月未対応の限界あり）。
 */

export interface SeasonalCustomHighlight {
  title: string;
  subtitle?: string;
  background: string;
  color: string;
  border: string;
}

export function getSeasonalCustomsForToday(
  jst: { y: number; m: number; d: number },
  lunar: { lunarMonth: number; lunarDay: number },
  todaySekkiKanji: string | null | undefined,
): SeasonalCustomHighlight[] {
  const out: SeasonalCustomHighlight[] = [];
  const { m, d } = jst;
  const { lunarMonth: lm, lunarDay: ld } = lunar;

  const add = (h: SeasonalCustomHighlight) => out.push(h);

  if (m === 1 && d === 7) {
    add({
      title: "七草がゆ",
      subtitle: "人日の節句 · 七种の青菜の祝膳",
      background: "linear-gradient(135deg, rgba(220,252,231,0.95), rgba(187,247,208,0.85))",
      color: "#14532d",
      border: "1px solid rgba(21,128,61,0.35)",
    });
  }

  if (m === 3 && d === 3) {
    add({
      title: "雛祭り（桃の節句）",
      subtitle: "ひな人形 · 桃の花",
      background: "linear-gradient(135deg, rgba(254,242,242,0.95), rgba(252,231,243,0.9))",
      color: "#881337",
      border: "1px solid rgba(190,18,60,0.35)",
    });
  }

  if (m === 5 && d === 5) {
    add({
      title: "端午の節句 · 鯉のぼり",
      subtitle: "武者人形 · 菖蒲湯",
      background: "linear-gradient(135deg, rgba(254,243,199,0.95), rgba(253,224,71,0.75))",
      color: "#713f12",
      border: "1px solid rgba(180,83,9,0.4)",
    });
  }

  if (m === 7 && d === 7) {
    add({
      title: "七夕",
      subtitle: "星祭 · 短冊に願いを",
      background: "linear-gradient(135deg, rgba(224,242,254,0.95), rgba(199,210,254,0.88))",
      color: "#1e3a5f",
      border: "1px solid rgba(37,99,235,0.35)",
    });
  }

  if (lm === 6 && ld === 30) {
    add({
      title: "夏越の祓 · 茅の輪くぐり",
      subtitle: "六月晦日 · 半年の穢れを祓う",
      background: "linear-gradient(135deg, rgba(240,253,250,0.95), rgba(153,246,228,0.75))",
      color: "#134e4a",
      border: "1px solid rgba(13,148,136,0.4)",
    });
  }

  if (lm === 7 && ld >= 13 && ld <= 16) {
    add({
      title: "お盆 · 墓参りの頃（目安）",
      subtitle: "盂蘭盆 · 旧暦七月十三～十六日目安",
      background: "linear-gradient(135deg, rgba(254,249,231,0.98), rgba(253,230,138,0.85))",
      color: "#713f12",
      border: "1px solid rgba(202,138,4,0.45)",
    });
  }

  if (lm === 8 && ld === 15) {
    add({
      title: "中秋の名月",
      subtitle: "旧暦八月十五夜 · 月見",
      background: "linear-gradient(135deg, rgba(30,58,95,0.92), rgba(30,64,110,0.85))",
      color: "#fef9c3",
      border: "1px solid rgba(250,204,21,0.45)",
    });
  }

  if (m === 9 && d === 9) {
    add({
      title: "重陽の節句（菊の節句）",
      subtitle: "茱萸湯 · 長寿祈願",
      background: "linear-gradient(135deg, rgba(255,247,237,0.96), rgba(254,215,170,0.85))",
      color: "#7c2d12",
      border: "1px solid rgba(234,88,12,0.4)",
    });
  }

  if (m === 11 && d === 15) {
    add({
      title: "七五三",
      subtitle: "成長の祝い（目安日）",
      background: "linear-gradient(135deg, rgba(250,245,255,0.96), rgba(233,213,255,0.88))",
      color: "#581c87",
      border: "1px solid rgba(126,34,206,0.35)",
    });
  }

  if (m === 11 && d === 23) {
    add({
      title: "新嘗祭（にいなめさい）",
      subtitle: "新穀感謝 · 宮中の大祭に由来",
      background: "linear-gradient(135deg, rgba(255,251,235,0.98), rgba(254,215,170,0.9))",
      color: "#78350f",
      border: "1px solid rgba(180,83,9,0.45)",
    });
  }

  if (todaySekkiKanji === "冬至") {
    add({
      title: "冬至",
      subtitle: "一陽来復 · ゆず湯・かぼちゃなどの歳時",
      background: "linear-gradient(135deg, rgba(219,234,254,0.95), rgba(191,219,254,0.88))",
      color: "#1e3a5f",
      border: "1px solid rgba(30,58,95,0.35)",
    });
  }

  return out;
}
