// アイコン生成スクリプト（npm run gen-icons で実行）
import sharp from "sharp";
import { writeFileSync } from "fs";

// SVG で和風アイコンを定義
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <!-- 背景 -->
  <rect width="512" height="512" rx="80" fill="#1e3a5f"/>
  <!-- 外枠の飾り -->
  <rect x="24" y="24" width="464" height="464" rx="64" fill="none" stroke="#c9a84c" stroke-width="4" opacity="0.5"/>
  <!-- 月（外側リング） -->
  <circle cx="256" cy="210" r="110" fill="none" stroke="#c9a84c" stroke-width="3" opacity="0.4"/>
  <!-- 満月 -->
  <circle cx="256" cy="210" r="88" fill="#fffbe6" opacity="0.95"/>
  <!-- 月の模様 -->
  <circle cx="220" cy="185" r="18" fill="#e8dfc0" opacity="0.6"/>
  <circle cx="268" cy="230" r="12" fill="#e8dfc0" opacity="0.5"/>
  <circle cx="248" cy="175" r="8"  fill="#e8dfc0" opacity="0.4"/>
  <!-- 金の光輪 -->
  <circle cx="256" cy="210" r="92" fill="none" stroke="#c9a84c" stroke-width="2" opacity="0.7"/>
  <!-- 「暦」の文字 -->
  <text x="256" y="390" text-anchor="middle" font-family="serif" font-size="96"
        font-weight="bold" fill="#f0e6d3" letter-spacing="4">暦</text>
  <!-- 下部装飾 -->
  <line x1="100" y1="430" x2="412" y2="430" stroke="#c9a84c" stroke-width="1.5" opacity="0.5"/>
</svg>`;

const svgBuffer = Buffer.from(svg);

const sizes = [
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 167, name: "apple-touch-icon-ipad.png" },
];

for (const { size, name } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(`public/${name}`);
  console.log(`✓ public/${name} (${size}x${size})`);
}

// スプラッシュスクリーン用（iPhone・iPad）
const splashSizes = [
  { w: 1125, h: 2436, name: "splash-iphone-x.png" },
  { w: 2048, h: 2732, name: "splash-ipad-pro.png" },
  { w: 1536, h: 2048, name: "splash-ipad.png" },
  { w: 828,  h: 1792, name: "splash-iphone-xr.png" },
];

const splashSvg = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#1e3a5f"/>
  <!-- 背景の波紋 -->
  <circle cx="${w/2}" cy="${h/2 - 80}" r="${Math.min(w,h)*0.35}" fill="none" stroke="#c9a84c" stroke-width="1.5" opacity="0.2"/>
  <circle cx="${w/2}" cy="${h/2 - 80}" r="${Math.min(w,h)*0.28}" fill="none" stroke="#c9a84c" stroke-width="1" opacity="0.15"/>
  <!-- 月 -->
  <circle cx="${w/2}" cy="${h/2 - 80}" r="${Math.min(w,h)*0.18}" fill="#fffbe6"/>
  <circle cx="${w/2 - 30}" cy="${h/2 - 110}" r="${Math.min(w,h)*0.04}" fill="#e8dfc0" opacity="0.6"/>
  <circle cx="${w/2 + 20}" cy="${h/2 - 60}" r="${Math.min(w,h)*0.025}" fill="#e8dfc0" opacity="0.5"/>
  <!-- タイトル -->
  <text x="${w/2}" y="${h/2 + h*0.12}" text-anchor="middle"
        font-family="serif" font-size="${Math.min(w,h)*0.1}" font-weight="700"
        fill="#f0e6d3" letter-spacing="12">和暦</text>
  <text x="${w/2}" y="${h/2 + h*0.18}" text-anchor="middle"
        font-family="serif" font-size="${Math.min(w,h)*0.035}" fill="#c9a84c" letter-spacing="6">
    旧暦・節気・月相・時刻
  </text>
</svg>`;

for (const { w, h, name } of splashSizes) {
  await sharp(Buffer.from(splashSvg(w, h)))
    .resize(w, h)
    .png()
    .toFile(`public/${name}`);
  console.log(`✓ public/${name} (${w}x${h})`);
}

console.log("\n✅ アイコン生成完了！");
