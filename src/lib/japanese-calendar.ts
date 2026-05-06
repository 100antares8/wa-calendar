// ============================================================
// 日本の伝統暦計算ライブラリ
// 旧暦・二十四節気・七十二候・十二支・干支・不定時法
// ============================================================

// ---- 二十四節気 ----------------------------------------
export const SEKKI_24: { name: string; kanji: string; longitude: number; reading: string }[] = [
  { name: "大寒",   kanji: "大寒",   longitude: 300, reading: "だいかん" },
  { name: "立春",   kanji: "立春",   longitude: 315, reading: "りっしゅん" },
  { name: "雨水",   kanji: "雨水",   longitude: 330, reading: "うすい" },
  { name: "啓蟄",   kanji: "啓蟄",   longitude: 345, reading: "けいちつ" },
  { name: "春分",   kanji: "春分",   longitude:   0, reading: "しゅんぶん" },
  { name: "清明",   kanji: "清明",   longitude:  15, reading: "せいめい" },
  { name: "穀雨",   kanji: "穀雨",   longitude:  30, reading: "こくう" },
  { name: "立夏",   kanji: "立夏",   longitude:  45, reading: "りっか" },
  { name: "小満",   kanji: "小満",   longitude:  60, reading: "しょうまん" },
  { name: "芒種",   kanji: "芒種",   longitude:  75, reading: "ぼうしゅ" },
  { name: "夏至",   kanji: "夏至",   longitude:  90, reading: "げし" },
  { name: "小暑",   kanji: "小暑",   longitude: 105, reading: "しょうしょ" },
  { name: "大暑",   kanji: "大暑",   longitude: 120, reading: "たいしょ" },
  { name: "立秋",   kanji: "立秋",   longitude: 135, reading: "りっしゅう" },
  { name: "処暑",   kanji: "処暑",   longitude: 150, reading: "しょしょ" },
  { name: "白露",   kanji: "白露",   longitude: 165, reading: "はくろ" },
  { name: "秋分",   kanji: "秋分",   longitude: 180, reading: "しゅうぶん" },
  { name: "寒露",   kanji: "寒露",   longitude: 195, reading: "かんろ" },
  { name: "霜降",   kanji: "霜降",   longitude: 210, reading: "そうこう" },
  { name: "立冬",   kanji: "立冬",   longitude: 225, reading: "りっとう" },
  { name: "小雪",   kanji: "小雪",   longitude: 240, reading: "しょうせつ" },
  { name: "大雪",   kanji: "大雪",   longitude: 255, reading: "たいせつ" },
  { name: "冬至",   kanji: "冬至",   longitude: 270, reading: "とうじ" },
  { name: "小寒",   kanji: "小寒",   longitude: 285, reading: "しょうかん" },
];

/** 各節気名の短文解説（学習用・一般的な意味づけ） */
export const SEKKI_MEANINGS: Record<string, string> = {
  大寒: "一年で最も厳しい寒さのころ。",
  立春: "暦の上で春に入り、陽気が立ち上がるころ。",
  雨水: "雪が雨にかわり、草木の芽動きがはっきりするころ。",
  啓蟄: "地中の虫が目を覚ます意で、春本番の兆し。",
  春分: "昼夜の長さがほぼ等しくなるころ。",
  清明: "万物がすみやかに生気を帯びる清らかなころ。",
  穀雨: "潤いが増し、田畑の穀物の成長が進むころ。",
  立夏: "夏の気が立ち、草木が伸び盛りになるころ。",
  小満: "万物が生気に満ち始めるが、まだ小さなころ。",
  芒種: "芒のある穀物に種をまく時期。初夏から盛夏へ。",
  夏至: "一年で昼が最も長いころ。",
  小暑: "暑さが本格的になり始めるころ。",
  大暑: "最も暑まって湿気もまとわりつくころ。",
  立秋: "暦の上で秋に入り、朝夕に涼風の気配。",
  処暑: "残暑が和らぎはじめるころ。",
  白露: "夜気が冷え、草花に朝露の白さが濃いころ。",
  秋分: "昼夜の長さが再びほぼ等しくなるころ。",
  寒露: "露が冷たくなり、菊や柿の色づきが深まるころ。",
  霜降: "霜が降りはじめ、落葉が進むころ。",
  立冬: "暦の上で冬に入り、万物の活動が沈むころ。",
  小雪: "初雪・細雪の気配が近づくころ。",
  大雪: "本格的な雪を迎えるころ。",
  冬至: "一年で夜が最も長いころ。陽の気は再び生じるとされる。",
  小寒: "厳しい寒さが本番に入るころ（大寒の手前）。",
};

export const KOFU_72: { sekki: string; ko: string; reading: string; description: string }[] = [
  // 立春
  { sekki: "立春", ko: "東風解凍",   reading: "はるかぜこおりをとく",   description: "春風が吹いて氷が溶け始める" },
  { sekki: "立春", ko: "黄鶯睍睆",   reading: "うぐいすなく",           description: "鶯が山里で鳴き始める" },
  { sekki: "立春", ko: "魚上氷",     reading: "うおこおりをいずる",     description: "割れた氷の間から魚が飛び出す" },
  // 雨水
  { sekki: "雨水", ko: "土脉潤起",   reading: "つちのしょううるおいおこる", description: "雨が降って土が湿り気を帯びる" },
  { sekki: "雨水", ko: "霞始靆",     reading: "かすみはじめてたなびく", description: "霞が空にたなびき始める" },
  { sekki: "雨水", ko: "草木萌動",   reading: "そうもくめばえいずる",   description: "草や木が芽を吹き始める" },
  // 啓蟄
  { sekki: "啓蟄", ko: "蟄虫啓戸",   reading: "すごもりむしとをひらく", description: "土中の虫が穴を開けて出てくる" },
  { sekki: "啓蟄", ko: "桃始笑",     reading: "もものはなはじめてわらう", description: "桃の花が咲き始める" },
  { sekki: "啓蟄", ko: "菜虫化蝶",   reading: "なむしちょうとなる",     description: "青虫が羽化して蝶になる" },
  // 春分
  { sekki: "春分", ko: "雀始巣",     reading: "すずめはじめてすくう",   description: "雀が巣を作り始める" },
  { sekki: "春分", ko: "桜始開",     reading: "さくらはじめてひらく",   description: "桜の花が咲き始める" },
  { sekki: "春分", ko: "雷乃発声",   reading: "かみなりすなわちこえをはっす", description: "遠くで雷が鳴り始める" },
  // 清明
  { sekki: "清明", ko: "玄鳥至",     reading: "つばめきたる",           description: "燕が南からやってくる" },
  { sekki: "清明", ko: "鴻雁北",     reading: "こうがんかえる",         description: "雁が北へ帰っていく" },
  { sekki: "清明", ko: "虹始見",     reading: "にじはじめてあらわる",   description: "雨上がりに虹が見え始める" },
  // 穀雨
  { sekki: "穀雨", ko: "葭始生",     reading: "あしはじめてしょうず",   description: "葦が芽を出し始める" },
  { sekki: "穀雨", ko: "霜止出苗",   reading: "しもやんでなえいづる",   description: "霜が終わり苗が育ち始める" },
  { sekki: "穀雨", ko: "牡丹華",     reading: "ぼたんはなさく",         description: "牡丹の花が咲く" },
  // 立夏
  { sekki: "立夏", ko: "蛙始鳴",     reading: "かわずはじめてなく",     description: "蛙が鳴き始める" },
  { sekki: "立夏", ko: "蚯蚓出",     reading: "みみずいずる",           description: "ミミズが地上に出てくる" },
  { sekki: "立夏", ko: "竹笋生",     reading: "たけのこしょうず",       description: "筍が生え出る" },
  // 小満
  { sekki: "小満", ko: "蚕起食桑",   reading: "かいこおきてくわをはむ", description: "蚕が桑を盛んに食べ始める" },
  { sekki: "小満", ko: "紅花栄",     reading: "べにばなさかう",         description: "紅花が咲き誇る" },
  { sekki: "小満", ko: "麦秋至",     reading: "むぎのときいたる",       description: "麦が熟し収穫期を迎える" },
  // 芒種
  { sekki: "芒種", ko: "螳螂生",     reading: "かまきりしょうず",       description: "カマキリが生まれる" },
  { sekki: "芒種", ko: "腐草為蛍",   reading: "くされたるくさほたるとなる", description: "蛍が飛び始める" },
  { sekki: "芒種", ko: "梅子黄",     reading: "うめのみきばむ",         description: "梅の実が黄色く熟す" },
  // 夏至
  { sekki: "夏至", ko: "乃東枯",     reading: "なつかれくさかるる",     description: "夏枯草が枯れる" },
  { sekki: "夏至", ko: "菖蒲華",     reading: "あやめはなさく",         description: "菖蒲の花が咲く" },
  { sekki: "夏至", ko: "半夏生",     reading: "はんげしょうず",         description: "半夏（烏柄杓）が生える" },
  // 小暑
  { sekki: "小暑", ko: "温風至",     reading: "あつかぜいたる",         description: "温かい風が吹いてくる" },
  { sekki: "小暑", ko: "蓮始開",     reading: "はすはじめてひらく",     description: "蓮の花が咲き始める" },
  { sekki: "小暑", ko: "鷹乃学習",   reading: "たかすなわちわざをならう", description: "鷹の雛が飛ぶ練習をする" },
  // 大暑
  { sekki: "大暑", ko: "桐始結花",   reading: "きりはじめてはなをむすぶ", description: "桐の花が実を結び始める" },
  { sekki: "大暑", ko: "土潤溽暑",   reading: "つちうるおうてむしあつし", description: "土が蒸れるように暑い" },
  { sekki: "大暑", ko: "大雨時行",   reading: "たいうときどきふる",     description: "夕立がよく降る" },
  // 立秋
  { sekki: "立秋", ko: "涼風至",     reading: "すずかぜいたる",         description: "涼しい風が吹いてくる" },
  { sekki: "立秋", ko: "寒蝉鳴",     reading: "ひぐらしなく",           description: "ヒグラシが鳴く" },
  { sekki: "立秋", ko: "蒙霧升降",   reading: "ふかきりまとう",         description: "深い霧が立ちこめる" },
  // 処暑
  { sekki: "処暑", ko: "綿柎開",     reading: "わたのはなしべひらく",   description: "綿の実が開き始める" },
  { sekki: "処暑", ko: "天地始粛",   reading: "てんちはじめてさむし",   description: "ようやく暑さが収まってくる" },
  { sekki: "処暑", ko: "禾乃登",     reading: "こくものすなわちみのる", description: "稲が実る" },
  // 白露
  { sekki: "白露", ko: "草露白",     reading: "くさのつゆしろし",       description: "草に白い露が宿る" },
  { sekki: "白露", ko: "鶺鴒鳴",     reading: "せきれいなく",           description: "鶺鴒が鳴き始める" },
  { sekki: "白露", ko: "玄鳥去",     reading: "つばめさる",             description: "燕が南へ帰っていく" },
  // 秋分
  { sekki: "秋分", ko: "雷乃収声",   reading: "かみなりすなわちこえをおさむ", description: "雷が鳴らなくなる" },
  { sekki: "秋分", ko: "蟄虫坏戸",   reading: "むしかくれてとをふさぐ", description: "虫が土中に隠れ始める" },
  { sekki: "秋分", ko: "水始涸",     reading: "みずはじめてかるる",     description: "田の水が涸れ始める" },
  // 寒露
  { sekki: "寒露", ko: "鴻雁来",     reading: "こうがんきたる",         description: "雁が北から渡ってくる" },
  { sekki: "寒露", ko: "菊花開",     reading: "きくのはなひらく",       description: "菊の花が咲く" },
  { sekki: "寒露", ko: "蟋蟀在戸",   reading: "きりぎりすとにあり",     description: "コオロギが戸口で鳴く" },
  // 霜降
  { sekki: "霜降", ko: "霜始降",     reading: "しもはじめてふる",       description: "霜が降り始める" },
  { sekki: "霜降", ko: "霎時施",     reading: "こさめときどきふる",     description: "小雨がちらつく" },
  { sekki: "霜降", ko: "楓蔦黄",     reading: "もみじつたきばむ",       description: "紅葉や蔦が黄葉する" },
  // 立冬
  { sekki: "立冬", ko: "山茶始開",   reading: "つばきはじめてひらく",   description: "山茶花が咲き始める" },
  { sekki: "立冬", ko: "地始凍",     reading: "ちはじめてこおる",       description: "大地が凍り始める" },
  { sekki: "立冬", ko: "金盞香",     reading: "きんせんかさく",         description: "水仙の花が咲く" },
  // 小雪
  { sekki: "小雪", ko: "虹蔵不見",   reading: "にじかくれてみえず",     description: "虹を見かけなくなる" },
  { sekki: "小雪", ko: "朔風払葉",   reading: "きたかぜこのはをはらう", description: "北風が木の葉を散らす" },
  { sekki: "小雪", ko: "橘始黄",     reading: "たちばなはじめてきばむ", description: "橘の実が黄色くなる" },
  // 大雪
  { sekki: "大雪", ko: "閉塞成冬",   reading: "そらさむくふゆとなる",   description: "天地が塞がれ冬となる" },
  { sekki: "大雪", ko: "熊蟄穴",     reading: "くまあなにこもる",       description: "熊が冬眠に入る" },
  { sekki: "大雪", ko: "鱖魚群",     reading: "さけのうおむらがる",     description: "鮭が川を遡上する" },
  // 冬至
  { sekki: "冬至", ko: "乃東生",     reading: "なつかれくさしょうず",   description: "夏枯草が芽を出す" },
  { sekki: "冬至", ko: "麋角解",     reading: "おおしかのつのおつる",   description: "大鹿の角が落ちる" },
  { sekki: "冬至", ko: "雪下出麦",   reading: "ゆきわたりてむぎいずる", description: "雪の下で麦が芽を出す" },
  // 小寒
  { sekki: "小寒", ko: "芹乃栄",     reading: "せりすなわちさかう",     description: "芹が盛んに茂る" },
  { sekki: "小寒", ko: "水泉動",     reading: "しみずあたたかをふくむ", description: "地下の泉が動き始める" },
  { sekki: "小寒", ko: "雉始雊",     reading: "きじはじめてなく",       description: "雉が鳴き始める" },
  // 大寒
  { sekki: "大寒", ko: "款冬華",     reading: "ふきのはなさく",         description: "款冬（蕗）の花が咲く" },
  { sekki: "大寒", ko: "水沢腹堅",   reading: "さわみずこおりつめる",   description: "沢の水が厚く凍る" },
  { sekki: "大寒", ko: "鶏始乳",     reading: "にわとりはじめてとやにつく", description: "鶏が卵を産み始める" },
];

// ---- 旧暦月の名前 ----------------------------------------
export const LUNAR_MONTH_NAMES = [
  "睦月", "如月", "弥生", "卯月", "皐月", "水無月",
  "文月", "葉月", "長月", "神無月", "霜月", "師走",
];

export const LUNAR_MONTH_READINGS = [
  "むつき", "きさらぎ", "やよい", "うづき", "さつき", "みなづき",
  "ふみつき", "はづき", "ながつき", "かんなづき", "しもつき", "しわす",
];

// ---- 干支 (十干十二支) ----------------------------------------
export const JIKKAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
export const JUNISHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
export const JUNISHI_READINGS = ["ね", "うし", "とら", "う", "たつ", "み", "うま", "ひつじ", "さる", "とり", "いぬ", "い"];
export const JUNISHI_ANIMALS = ["鼠", "牛", "虎", "兔", "龍", "蛇", "馬", "羊", "猿", "鶏", "犬", "猪"];

export function getEto(year: number): { jikkan: string; junishi: string; eto: string; reading: string } {
  // 甲子 = 1984 年
  const base = 1984;
  const diff = year - base;
  const jikkanIdx = ((diff % 10) + 10) % 10;
  const junishiIdx = ((diff % 12) + 12) % 12;
  return {
    jikkan: JIKKAN[jikkanIdx],
    junishi: JUNISHI[junishiIdx],
    eto: JIKKAN[jikkanIdx] + JUNISHI[junishiIdx],
    reading: ["こう","おつ","へい","てい","ぼ","き","こう","しん","じん","き"][jikkanIdx] + JUNISHI_READINGS[junishiIdx],
  };
}

// ---- 太陽黄経の計算 ----------------------------------------
function toRad(deg: number) { return deg * Math.PI / 180; }
function toDeg(rad: number) { return rad * 180 / Math.PI; }

function getSunLongitude(date: Date): number {
  const JD = dateToJD(date);
  const T = (JD - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = toRad(M);
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
          + 0.000289 * Math.sin(3 * Mrad);
  const sunLon = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const apparentLon = sunLon - 0.00569 - 0.00478 * Math.sin(toRad(omega));
  return ((apparentLon % 360) + 360) % 360;
}

function dateToJD(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + date.getUTCHours() / 24 + date.getUTCMinutes() / 1440;
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

export function getSekki(date: Date): (typeof SEKKI_24[0]) | null {
  const lon = getSunLongitude(date);
  const yesterday = new Date(date.getTime() - 86400000);
  const lonYesterday = getSunLongitude(yesterday);
  for (const sekki of SEKKI_24) {
    const target = sekki.longitude;
    const diff = ((lon - lonYesterday + 360) % 360);
    // 黄経が目標をまたいだか判定
    const crossedFrom = ((lonYesterday - target + 360) % 360);
    const crossedTo   = ((lon - target + 360) % 360);
    if (crossedFrom > 350 && crossedTo < 10) return sekki;
  }
  return null;
}

export function getCurrentSekki(date: Date): typeof SEKKI_24[0] {
  const lon = getSunLongitude(date);
  // 現在どの節気区間にいるか
  let current = SEKKI_24[SEKKI_24.length - 1];
  for (const sekki of SEKKI_24) {
    if (lon >= sekki.longitude) current = sekki;
  }
  return current;
}

export function getCurrentKo(sekkiName: string, date: Date, sekkiStartDate: Date): typeof KOFU_72[0] | null {
  const kos = KOFU_72.filter(k => k.sekki === sekkiName);
  if (kos.length === 0) return null;
  const daysSinceStart = Math.floor((date.getTime() - sekkiStartDate.getTime()) / 86400000);
  const koIndex = Math.min(Math.floor(daysSinceStart / 5), 2);
  return kos[koIndex] || kos[0];
}

// ---- 旧暦変換（天保暦アルゴリズム近似） ----------------------------------------
function getNewMoonJD(k: number): number {
  const T = k / 1236.85;
  const JDE = 2451550.09766
    + 29.530588861 * k
    + 0.00015437 * T * T
    - 0.000000150 * T * T * T
    + 0.00000000073 * T * T * T * T;

  const M = toRad(2.5534 + 29.10535670 * k - 0.0000014 * T * T);
  const Mp = toRad(201.5643 + 385.81693528 * k + 0.0107582 * T * T);
  const F = toRad(160.7108 + 390.67050284 * k - 0.0016118 * T * T);
  const Om = toRad(124.7746 - 1.56375588 * k + 0.0020672 * T * T);

  return JDE
    - 0.40720 * Math.sin(Mp)
    + 0.17241 * Math.sin(M)
    + 0.01608 * Math.sin(2 * Mp)
    + 0.01039 * Math.sin(2 * F)
    + 0.00739 * Math.sin(Mp - M)
    - 0.00514 * Math.sin(Mp + M)
    - 0.00111 * Math.sin(2 * F + Mp)
    + 0.00208 * Math.sin(2 * M)
    - 0.00057 * Math.sin(Mp - 2 * F)
    + 0.00056 * Math.sin(2 * Mp + M)
    - 0.00042 * Math.sin(3 * Mp)
    + 0.00042 * Math.sin(M + 2 * F)
    + 0.00038 * Math.sin(M - 2 * F)
    - 0.00024 * Math.sin(2 * Mp - M)
    - 0.00017 * Math.sin(Om)
    - 0.00007 * Math.sin(Mp + 2 * M);
}

function jdToDate(jd: number): Date {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let A = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    A = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);
  const day = B - D - Math.floor(30.6001 * E) + f;
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;
  const hours = (day - Math.floor(day)) * 24;
  return new Date(Date.UTC(year, month - 1, Math.floor(day), Math.floor(hours)));
}

// 指定年月のk値を求める
function getKForYearMonth(year: number, month: number): number {
  return (year + (month - 1) / 12 - 2000) * 12.3685;
}

export function getLunarDate(date: Date): {
  lunarYear: number; lunarMonth: number; lunarDay: number;
  isLeapMonth: boolean; monthName: string; monthReading: string;
  eto: { eto: string; reading: string };
} {
  const jd = dateToJD(date) + 9 / 24; // JST に合わせた補正
  const year = date.getUTCFullYear();

  // 今月・先月・来月の朔を探す
  let k = Math.floor(getKForYearMonth(year, date.getUTCMonth() + 1));
  const newMoons: number[] = [];
  for (let i = k - 2; i <= k + 14; i++) {
    newMoons.push(getNewMoonJD(i) + 9 / 24);
  }

  // 現在の月の朔を特定
  let moonStart = newMoons[0];
  for (let i = 0; i < newMoons.length - 1; i++) {
    if (newMoons[i] <= jd && jd < newMoons[i + 1]) {
      moonStart = newMoons[i];
      break;
    }
  }

  const lunarDay = Math.floor(jd - moonStart) + 1;

  // 旧暦月の推定（天保暦に基づく近似）
  const refNewMoon = getNewMoonJD(Math.floor(getKForYearMonth(year, 1))) + 9 / 24;
  const lunarMonthApprox = Math.round((moonStart - refNewMoon) / 29.53);
  const lunarMonth = ((lunarMonthApprox % 12) + 12) % 12 + 1;
  const lunarYear = year - (lunarMonth > 9 && date.getUTCMonth() < 3 ? 1 : 0);

  return {
    lunarYear,
    lunarMonth,
    lunarDay,
    isLeapMonth: false,
    monthName: LUNAR_MONTH_NAMES[lunarMonth - 1],
    monthReading: LUNAR_MONTH_READINGS[lunarMonth - 1],
    eto: getEto(lunarYear),
  };
}

// ---- 旧暦の日の呼び方 ----------------------------------------
export const LUNAR_DAY_NAMES: Record<number, string> = {
  1: "朔（ついたち）", 2: "二日", 3: "三日（みっか）", 4: "四日",
  5: "五日", 6: "六日", 7: "七日", 8: "八日", 9: "九日",
  10: "十日（とおか）", 11: "十一日", 12: "十二日", 13: "十三日",
  14: "十四日", 15: "望（もちづき）", 16: "十六夜（いざよい）",
  17: "立待月（たちまちづき）", 18: "居待月（いまちづき）",
  19: "寝待月（ねまちづき）", 20: "更待月（ふけまちづき）",
  21: "二十一日", 22: "二十二日", 23: "二十三夜", 24: "二十四日",
  25: "二十五日", 26: "二十六日", 27: "二十七日", 28: "二十八日",
  29: "二十九日", 30: "晦日（みそか）",
};

// ---- 六曜（六輝） ----------------------------------------
export const ROKUYO = ["先勝", "友引", "先負", "仏滅", "大安", "赤口"];
export const ROKUYO_READINGS = ["せんしょう", "ともびき", "せんぷ", "ぶつめつ", "たいあん", "しゃっく"];
export const ROKUYO_DESC = [
  "午前吉、午後凶。急ぐことは吉",
  "友を引く日。慶弔事は避けるべし",
  "午前凶、午後吉。急がず静かに",
  "全てが滅する日。凶日",
  "全てが大吉の日。最良の日",
  "午前・午後凶、正午のみ吉",
];
export const ROKUYO_COLORS = ["#d4a017", "#2e86ab", "#6b8e23", "#4a4a4a", "#c41e3a", "#b22222"];

export function getRokuyo(lunarMonth: number, lunarDay: number): {
  name: string; reading: string; description: string; color: string;
} {
  const idx = ((lunarMonth + lunarDay) % 6 + 6) % 6;
  return {
    name: ROKUYO[idx],
    reading: ROKUYO_READINGS[idx],
    description: ROKUYO_DESC[idx],
    color: ROKUYO_COLORS[idx],
  };
}

// ---- 季節 ----------------------------------------
export function getSeason(date: Date): { name: string; kanji: string; color: string; emoji: string } {
  const m = date.getUTCMonth() + 1;
  if (m >= 3 && m <= 5) return { name: "春", kanji: "春", color: "#f9a8d4", emoji: "🌸" };
  if (m >= 6 && m <= 8) return { name: "夏", kanji: "夏", color: "#6ee7b7", emoji: "🌿" };
  if (m >= 9 && m <= 11) return { name: "秋", kanji: "秋", color: "#fbbf24", emoji: "🍁" };
  return { name: "冬", kanji: "冬", color: "#bfdbfe", emoji: "❄️" };
}

// ---- 年間の二十四節気日程を計算 ----------------------------------------
export function getSekkiDatesForYear(year: number): { date: Date; sekki: typeof SEKKI_24[0] }[] {
  const results: { date: Date; sekki: typeof SEKKI_24[0] }[] = [];
  // 年の最初から366日間を走査
  for (let dayOffset = 0; dayOffset < 370; dayOffset++) {
    const d = new Date(Date.UTC(year, 0, 1 + dayOffset, 12, 0, 0));
    if (d.getFullYear() > year) break;
    const sekki = getSekki(d);
    if (sekki) {
      results.push({ date: d, sekki });
    }
  }
  return results;
}

/** グレゴリオ暦1年分の「その日の旧暦」（同期で約365件） */
export function getKyurekiDayEventsForYear(year: number): {
  date: string;
  summary: string;
  description: string;
}[] {
  const out: { date: string; summary: string; description: string }[] = [];
  for (let offset = 0; offset < 370; offset++) {
    const d = new Date(Date.UTC(year, 0, 1 + offset, 12, 0, 0));
    if (d.getUTCFullYear() !== year) break;
    const dateStr = d.toISOString().slice(0, 10);
    const ld = getLunarDate(d);
    const dayCall = LUNAR_DAY_NAMES[ld.lunarDay] || `${ld.lunarDay}日`;
    out.push({
      date: dateStr,
      summary: `【旧暦】${ld.monthName}${ld.lunarDay}日`,
      description:
        `旧暦 ${ld.lunarYear}年 ${ld.monthName}（${ld.monthReading}）${ld.lunarDay}日\n`
        + `${dayCall}\n`
        + `年干支: ${ld.eto.eto}（${ld.eto.reading}）`,
    });
  }
  return out;
}
