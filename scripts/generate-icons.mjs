/**
 * public/icon-source.png から PWA / Apple / favicon 用 PNG を生成する。
 * 新しいマスターに差し替えたら: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pub = path.join(root, "public");
const src = path.join(pub, "icon-source.png");

const outs = [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["apple-touch-icon.png", 180],
  ["apple-touch-icon-ipad.png", 167],
  ["favicon-32.png", 32],
  ["favicon-16.png", 16],
];

async function main() {
  const img = sharp(src);
  const meta = await img.metadata();
  if (!meta.width) throw new Error("icon-source.png を読めません");

  for (const [name, size] of outs) {
    await sharp(src)
      .resize(size, size, {
        fit: "contain",
        background: { r: 253, g: 246, b: 227, alpha: 1 },
      })
      .png()
      .toFile(path.join(pub, name));
    console.log("wrote", name, size);
  }

  // maskable 用: 512 正方形の内側 80% に収める（余白は背景色）
  const s = 512;
  const inner = Math.round(s * 0.8);
  const buf = await sharp(src)
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 253, g: 246, b: 227, alpha: 0 },
    })
    .toBuffer();

  await sharp({
    create: {
      width: s,
      height: s,
      channels: 4,
      background: { r: 253, g: 246, b: 227, alpha: 1 },
    },
  })
    .composite([{ input: buf, left: Math.floor((s - inner) / 2), top: Math.floor((s - inner) / 2) }])
    .png()
    .toFile(path.join(pub, "icon-512-maskable.png"));

  console.log("wrote icon-512-maskable.png (safe zone)");

  /** Apple startup images（layout.tsx の media と一致させる） */
  const splashes = [
    ["splash-iphone-x.png", 1125, 2436],
    ["splash-iphone-xr.png", 828, 1792],
    ["splash-ipad-pro.png", 2048, 2732],
    ["splash-ipad.png", 1536, 2048],
  ];

  for (const [name, w, h] of splashes) {
    const side = Math.round(Math.min(w, h) * 0.38);
    const iconBuf = await sharp(src)
      .resize(side, side, {
        fit: "contain",
        background: { r: 253, g: 246, b: 227, alpha: 0 },
      })
      .toBuffer();

    await sharp({
      create: {
        width: w,
        height: h,
        channels: 4,
        background: { r: 253, g: 246, b: 227, alpha: 1 },
      },
    })
      .composite([
        {
          input: iconBuf,
          left: Math.floor((w - side) / 2),
          top: Math.floor((h - side) / 2),
        },
      ])
      .png()
      .toFile(path.join(pub, name));
    console.log("wrote", name, w, h);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
