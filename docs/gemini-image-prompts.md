# Gemini 用画像プロンプト（和暦カレンダー）— 正方形・日月強調版

## 狙い

- **1:1（正方形）**を基準に生成し、必要なら端末向けに中央トリミングする想定。
- **太陽**と**月**を画面の主役にする（大きな円・円弧、明暗のコントラスト、軌道の暗示）。
- **日本の暦・季節**（太陽暦・月の満ち欠け・二十四節気のリズム）を、**遠目・ファビコンサイズでも一目で伝わる**シルエットと構図に落とす。
- 細かい模様より **2〜3 個の大胆な図形**（太陽＋月、または太陽と月齢の弧）を優先。

アプリのトーン: 生成り・藍鉄・墨・金泥の **和モダン**。写真より **絵画/ロゴに近いクリーンな図像**（ただし質感は和紙の微粒子）。

---

## 全プロンプト末尾に付ける共通サフィックス（推奨）

英語でそのまま Gemini に渡す:

```text
Square composition 1:1 aspect ratio exactly. Large readable sun disk and moon as bold graphic shapes — high contrast silhouette, not tiny details. Theme: Japanese traditional calendar: solar year, lunar phases, twenty-four sekki rhythm — suggest with simple arcs or phase icons, not cluttered. Icon-like clarity: must remain recognizable when scaled down to 64px favicon. Cream washi paper texture background, indigo and sumi, tiny gold accent only. No text, no letters, no watermark, no UI mockup, no outer frame border, centered focal mass, generous margin around main motif, high resolution, soft paper grain.
```

**色の指示を足す場合（任意）:**

```text
Color palette: background #fdf6e3 warm cream, sun warm gold #e8b54a or soft amber glow, moon cool white or pale indigo #e8eef5, deep accents #1e3a5f navy indigo, black ink #1a1a18 for eclipse edges, moss #065f46 optional thin accent only.
```

---

## 1. メインアート（正方形 1024×1024 〜 2048×2048 推奨）

**プロンプト（本文）:**

```text
Master square illustration for a Japanese lunisolar calendar app. Dominant composition: a LARGE warm sun circle (lower or upper third, partial crop OK) and a LARGE moon showing clear phase (crescent or fat gibbous) overlapping or orbiting along a subtle thin arc — the arc hints at ecliptic / yearly cycle without text. Optional: very small 24 tiny tick marks along outer ring like a minimal sekki dial, extremely simplified, not busy. Japanese aesthetic: sumi ink softness on edges, washi paper base, quiet wabi-sabi. Visual hierarchy: sun and moon shapes are the first read at thumbnail size; everything else secondary. No seasons-specific flowers in detail — keep seasonal feeling abstract via color temperature (warm sun vs cool moon).
```

---

## 2. アプリアイコン / Favicon 原画（正方形 512×512 / 1024×1024）

**プロンプト:**

```text
Square app icon artwork 1:1, flat graphic with slight layered depth. Rounded-square safe zone: main symbol occupies central 70% so it survives iOS mask. Bold icon design: golden sun disc (solid or soft gradient) paired with white or silver crescent moon — two clear silhouettes, no thin lines under 3px at export size. Single circular orbit stroke or phase sequence of 3–4 minimal moon icons in a row ONLY if still readable at 32px; prefer fewer elements. Style: Japanese modern emblem, not emoji, not 3D glossy. Noh drama simplicity. Center-weighted, high legibility at small size.
```

---

## 3. スプラッシュ・ヒーロー用（正方形→端末へセンタークロップ）

同じ **§1 のマスター**を使い、次を追記して「縦スプラッシュ向け」の余白を指示する場合:

```text
Important: keep sun and moon motif clustered in CENTER 80% square — leave extra quiet margin top and bottom within the square so the same file can be center-cropped to 9:19 phone splash without cutting the sun or moon.
```

横長ヒーロー用にクロップする場合:

```text
Center-weighted composition within square — when cropped to 16:9 landscape, sun and moon remain fully visible in the middle third.
```

---

## 4. 「暦・季節」を強める別バリエーション（正方形）

季節感を色だけで示したいとき用（春夏秋冬の具体物は描きすぎない）:

```text
Square 1:1. Same bold sun + moon hero layout. Four very soft color quadrants in corners suggesting spring pink mist, summer green haze, autumn amber, winter blue-gray — ultra subtle, low saturation, like weather on washi; quadrants must not compete with sun/moon. Calendar feeling through light and air, not literal scenery. Icon-readable at distance.
```

---

## 5. NG・避けたい指定（プロンプトに混ぜてもよい）

```text
Avoid: cluttered flower fields, tiny illegible kanji texture, photorealistic telescope moon, busy anime characters, multiple small moons, rainbow gradients, harsh neon, 3D glassmorphism, European zodiac wheel, clock numerals, Roman letters.
```

---

## 使い方のメモ

1. まず **§1 + 共通サフィックス** で 1024 または 1536 の正方形を数枚生成。
2. アイコン用は **§2** を単独で回し、**中央 70%** に日月が収まっているか確認。
3. iPhone スプラッシュは正方形を **上下トリミング**（中央基準）。必要なら §3 の余白指示を足す。
4. Gemini で解像度が足りない場合は、同じプロンプトでアップスケール指示を別途付与。

---

*最終更新: 和暦カレンダー用 — 正方形・日月インパクト・縮小判読性優先。*
