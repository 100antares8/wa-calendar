/**
 * 日本の年中行事・神社例祭・作法の目安（鑑賞・学習用）。
 * 旧暦はアプリと同じ簡易換算。地域・派閏・年によって実日は異なります。
 */

/** 一覧の季節分け（歳時の見やすさ用。天文上の四季とは一致しません） */
export type EventDisplaySeason = "spring" | "summer" | "autumn" | "winter";

export const SEASON_ORDER: EventDisplaySeason[] = ["spring", "summer", "autumn", "winter"];

export const SEASON_LABELS: Record<EventDisplaySeason, string> = {
  spring: "春",
  summer: "夏",
  autumn: "秋",
  winter: "冬",
};

export interface TraditionalEventEntry {
  id: string;
  title: string;
  reading?: string;
  /** 一覧の季節（春夏秋冬） */
  displaySeason: EventDisplaySeason;
  /** 新暦の目安表記（使用者向け） */
  gregorianLabel: string;
  /** 旧暦の目安表記 */
  lunarLabel: string;
  /** 連日・年変動の注記 */
  variability?: string;
  /** 学び・深堀りの解説 */
  explanation: string;
  /** 暦タブでセル背景に使う色 */
  highlightColor: string;
  /** マッチ：新暦 月・日（年によらず毎年同じ前提の行事） */
  matchGregorian?: { m: number; d: number }[];
  /** マッチ：旧暦 1日 */
  matchLunarDay?: { lm: number; ld: number };
  /** マッチ：旧暦 範囲（盂蘭盆など） */
  matchLunarRange?: { lm: number; from: number; to: number };
  /** 暦タブ遷移時に開く月（1–12）。お盆目安は 8 月など */
  openMonth: number;
}

/** 並び：その季節内でおよその新暦順 */
function eventSortKey(e: TraditionalEventEntry): number {
  const g = e.matchGregorian?.[0];
  if (g) return g.m * 40 + g.d;
  if (e.matchLunarDay) return e.openMonth * 40 + 12;
  if (e.matchLunarRange) return e.openMonth * 40 + e.matchLunarRange.from;
  return 500 + e.openMonth;
}

export function sortEventsForSeasonDisplay(list: TraditionalEventEntry[]): TraditionalEventEntry[] {
  return [...list].sort((a, b) => eventSortKey(a) - eventSortKey(b));
}

export function getTraditionalEventsBySeason(): {
  season: EventDisplaySeason;
  label: string;
  events: TraditionalEventEntry[];
}[] {
  const map: Record<EventDisplaySeason, TraditionalEventEntry[]> = {
    spring: [],
    summer: [],
    autumn: [],
    winter: [],
  };
  for (const e of TRADITIONAL_EVENTS) {
    map[e.displaySeason].push(e);
  }
  return SEASON_ORDER.map(s => ({
    season: s,
    label: SEASON_LABELS[s],
    events: sortEventsForSeasonDisplay(map[s]),
  }));
}

export const TRADITIONAL_EVENTS: TraditionalEventEntry[] = [
  {
    id: "oshogatsu",
    title: "正月・年神様（三が日）",
    reading: "しょうがつ",
    displaySeason: "winter",
    gregorianLabel: "新暦 1月1日〜3日（三が日）",
    lunarLabel: "旧正月を祝う文化圏も国内にあります",
    variability: "初詣の混雑ピーク・山車出しは宮ごとに一覧参照。",
    explanation:
      "年神を迎え歳徳神に祈る歳始。門松・注連縄で結界を示し鏡餅を供えるなど家ごとの作法があります。神社は歳旦祭・初詣で氏子縁を深める大繁忙期です。",
    highlightColor: "rgba(185,28,28,0.18)",
    matchGregorian: [{ m: 1, d: 1 }, { m: 1, d: 2 }, { m: 1, d: 3 }],
    openMonth: 1,
  },
  {
    id: "kagamibiraki",
    title: "鏡開き",
    reading: "かがみびらき",
    displaySeason: "winter",
    gregorianLabel: "新暦 1月11日を中心に地域・家庭で異なる",
    lunarLabel: "正月の餅の儀礼に連なる日取り",
    variability: "1月20日近辺で行う地方もあります。",
    explanation:
      "年神を奉った鏡餅を下し、雑煮にして食べるなど年の歳事を締める作法。刃物を当てず包丁で手で割る「手弱り」など所作の決まりを重んじる家庭もあります。",
    highlightColor: "rgba(180,83,9,0.2)",
    matchGregorian: [{ m: 1, d: 11 }],
    openMonth: 1,
  },
  {
    id: "koshogatsu",
    title: "小正月",
    reading: "こしょうがつ",
    displaySeason: "winter",
    gregorianLabel: "新暦 1月15日にあわせる地域が目安",
    lunarLabel: "旧暦 正月十五日に相当するころ",
    variability: "左義長・どんど焼きの時期は村・町ごとにずれます。",
    explanation:
      "正月飾りを下して火に送る左義長、若者の祝いのこんこん舞など、共同体の春を呼ぶ歳事が残る地方があります。桜の枝で粥をかき混ぜる「粥かき」など粥祈願の地方も。",
    highlightColor: "rgba(234,179,8,0.22)",
    matchGregorian: [{ m: 1, d: 15 }],
    openMonth: 1,
  },
  {
    id: "nanakusa",
    title: "七草がゆ",
    reading: "ななくさがゆ",
    displaySeason: "spring",
    gregorianLabel: "新暦 1月7日（人日の節句）",
    lunarLabel: "旧暦では年により正月七日付近",
    variability: "地方・家庭で粥の内容が異なります。",
    explanation:
      "正月の厄を払い、一年の無病息災を願って七種の若菜を入れた粥を食べる歳時記です。人日の節句にあたり、春の七草（セリ・ナズナ・ゴギョウ・ハコベラ・ホトケノザ・スズナ・スズシロの説が一般的）を摘む習いとも結びつきます。",
    highlightColor: "rgba(21,128,61,0.35)",
    matchGregorian: [{ m: 1, d: 7 }],
    openMonth: 1,
  },
  {
    id: "setsubun",
    title: "節分（豆まき・恵方巻）",
    reading: "せつぶん",
    displaySeason: "winter",
    gregorianLabel: "新暦 2月3日頃（立春の前日）",
    lunarLabel: "立春前夜の祭祀に対応",
    variability: "年によって2月2日となる場合があります。",
    explanation:
      "季節の変わり目の祓い。撒豆の「鬼は外福は内」は室町期の室礼に近い形で普及。恵方巻は近代以降の商俗が強い一方、方角信仰の楽しみとして定着しています。神社では節分祭で追儺の舞などがあります。",
    highlightColor: "rgba(217,119,6,0.24)",
    matchGregorian: [{ m: 2, d: 3 }, { m: 2, d: 2 }],
    openMonth: 2,
  },
  {
    id: "hina",
    title: "雛祭り（桃の節句）",
    reading: "ひなまつり",
    displaySeason: "spring",
    gregorianLabel: "新暦 3月3日",
    lunarLabel: "旧暦では三月ニ営む所も（地域差大）",
    variability: "雛人形をいつ飾るか・いつ納めるかは家ごとに異なります。",
    explanation:
      "女の子の健やかな成長を願い、ひな人形を飾り桃の花を供える節句。古代の上巳の祓に行曲水の流れをくみ、平安期には人形で身代わりに厄を流す信仰へ。神社では桃の節句祭が行われる例が多いです。",
    highlightColor: "rgba(190,18,60,0.22)",
    matchGregorian: [{ m: 3, d: 3 }],
    openMonth: 3,
  },
  {
    id: "ohigan_haru",
    title: "春の彼岸（中日の目安）",
    reading: "はるのひがん",
    displaySeason: "spring",
    gregorianLabel: "新暦 3月20日前後を中日とする所（春分に寄せる）",
    lunarLabel: "旧暦では年によりずれます",
    variability: "春分の日は年ごとに変わります。前三後七の寺もあります。",
    explanation:
      "春分を中日とする一週間前後の供養の期間。納骨・墓参りと結びつきやすく、ぼたもち・おはぎを供える風習があります。宗派・寺規により呼称・期間が異なります。",
    highlightColor: "rgba(52,211,153,0.22)",
    matchGregorian: [{ m: 3, d: 19 }, { m: 3, d: 20 }, { m: 3, d: 21 }],
    openMonth: 3,
  },
  {
    id: "shunbun",
    title: "春分の日（行事参考）",
    reading: "しゅんぶん",
    displaySeason: "spring",
    gregorianLabel: "新暦 3月20日前後（天文計算・年により前後）",
    lunarLabel: "旧暦は年によりずれます",
    variability: "祝日の日付は年ごとに官報で定まります。",
    explanation:
      "太陽が春分点を通る日で昼夜の長さがほぼ等しくなるころ。社寺では彼岸の中日にあたることが多く、春分を境に農事・年中行事の「一区切り」とする観もあります（本アプリの二十四節気表示とあわせてご覧ください）。",
    highlightColor: "rgba(52,211,153,0.28)",
    matchGregorian: [],
    openMonth: 3,
  },
  {
    id: "hanami",
    title: "花見・桜の季（俗信の目安）",
    reading: "はなみ",
    displaySeason: "spring",
    gregorianLabel: "新暦 3月下旬〜4月上旬（気象・地域差）",
    lunarLabel: "旧暦に固定日なし",
    variability: "開花・満開は年・地域で大きく変わります。",
    explanation:
      "桜の開花に合わせた行楽と酒宴の風習。鎌倉期以降に武士・町人文化で定着した面があり、神社境内の桜は神木・御神体の近くで花祭が行われる例もあります。作法としては騒ぎすぎない・ごみを残さないことが通念です。",
    highlightColor: "rgba(244,114,182,0.2)",
    matchGregorian: [],
    openMonth: 4,
  },
  {
    id: "hanamatsuri",
    title: "灌仏会（花まつり）",
    reading: "かんぶつえ・はなまつり",
    displaySeason: "spring",
    gregorianLabel: "新暦 4月8日に営む寺が目安",
    lunarLabel: "釈尊降誕会。宗派により日取りが異なります",
    variability: "甘茶で小仏像を灌ぐ「花御堂」の形態は寺によります。",
    explanation:
      "仏教の釈尊降誕を祝う法会。稚児行列や花まつりとして広く知られ、幼児の健やかな成長への願いとも結びつきます。寺観では駐車・混雑に留意してください。",
    highlightColor: "rgba(236,72,153,0.2)",
    matchGregorian: [{ m: 4, d: 8 }],
    openMonth: 4,
  },
  {
    id: "tango",
    title: "端午の節句・鯉のぼり",
    reading: "たんごのせっく",
    displaySeason: "summer",
    gregorianLabel: "新暦 5月5日",
    lunarLabel: "五月五日にあわせる所と旧暦五月に戻す所があります",
    variability: "菖蒲湯・柏餅は前日から連休にかけて行う家庭も。",
    explanation:
      "男の子の武運健全を願い、鎧兜・武者人形を飾り鯉のぼりを揚げる。中国の菖蒲の節句に由来し武家間で発達。アサダ・ショウブを湯に浮かべる菖蒲湯は邪気払いの俗信です。神社では端午祭・御田植前後の祈りが重なることがあります。",
    highlightColor: "rgba(180,83,9,0.28)",
    matchGregorian: [{ m: 5, d: 5 }],
    openMonth: 5,
  },
  {
    id: "nyubai",
    title: "入梅（季節目安）",
    reading: "にゅうばい",
    displaySeason: "summer",
    gregorianLabel: "新暦 6月上旬〜中旬（気象庁の入梅発表に準ずる所）",
    lunarLabel: "旧暦に固定日なし",
    variability: "年・地域で大きく変わります。本欄は暦上の目安日を便宜置いています。",
    explanation:
      "梅雨入りの目安として報じられるころ。農作·養生・衣替えの準備と結びつく感覚があります（実際の入梅は気象庁等の発表で確定します）。",
    highlightColor: "rgba(100,116,139,0.28)",
    matchGregorian: [{ m: 6, d: 10 }, { m: 6, d: 11 }, { m: 6, d: 12 }],
    openMonth: 6,
  },
  {
    id: "tanabata",
    title: "七夕",
    reading: "たなばた",
    displaySeason: "summer",
    gregorianLabel: "新暦 7月7日に祝う地域が多数",
    lunarLabel: "旧暦七月七日に合わせる祭（仙台など）も有名",
    variability: "笹飾り・短冊の時期は商家・地域で数日ずれます。",
    explanation:
      "織姫・彦星の星祭。乞巧奠（こっこうでん）などの大陸由来を経て日本の棚幡詣・星供の信仰と融合。神社では星祭・七夕祭で短冊奉納や神事がある例が多いです。",
    highlightColor: "rgba(37,99,235,0.2)",
    matchGregorian: [{ m: 7, d: 7 }],
    openMonth: 7,
  },
  {
    id: "hangesho",
    title: "半夏生（農事の目安）",
    reading: "はんげしょう",
    displaySeason: "summer",
    gregorianLabel: "新暦 7月1日〜2日頃（夏至から11日目の目安）",
    lunarLabel: "旧暦に一本化されないため暦注で確認が必要です",
    variability: "地域で「いつから田植えを止めるか」が異なり、直呼びの日付もばらつきます。",
    explanation:
      "昔の農村では田植えを控える目安とされたころ（半夏という薬草の花期の伝承など諸説）。沖縄では「ハリ」を祝う行事文化とも結びつきます。現代は旬の食材・郷土料理の話題として親しまれることが多いです。",
    highlightColor: "rgba(34,197,94,0.22)",
    matchGregorian: [{ m: 7, d: 1 }, { m: 7, d: 2 }],
    openMonth: 7,
  },
  {
    id: "nagoshi",
    title: "夏越の祓・茅の輪くぐり",
    reading: "なごしのはらえ・ちのわくぐり",
    displaySeason: "summer",
    gregorianLabel: "新暦 6月30日に行う神社が多い（六月晦日）",
    lunarLabel: "旧暦 六月晦日（大晦に相当）",
    variability: "茅の輪の設置期間・くぐり方は神社ごとに掲示あり。",
    explanation:
      "年の半ばの大祓い。人の罪穢れを人形（ひとがた）に移して水に流す形代の流しと結びつく信仰。神社の茅の輪は八字に結った茅で作り、左回り三匝など決まりがあります。作法は各社の通達に従って静粛に。",
    highlightColor: "rgba(13,148,136,0.25)",
    matchLunarDay: { lm: 6, ld: 30 },
    openMonth: 7,
  },
  {
    id: "obon",
    title: "お盆（盂蘭盆・墓参りの目安）",
    reading: "おぼん",
    displaySeason: "summer",
    gregorianLabel: "新暦 8月13日〜16日に行う地域が目安（東京盆・新盆など差）",
    lunarLabel: "旧暦 七月十三日〜十六日（または十五日中心）",
    variability:
      "「お盆はいつ」は旧盆・新盆・会社カレンダーで必ず一致しません。年・家柄で異なります。",
    explanation:
      "先祖の霊を迎え供養し、精霊棚・盆踊り・灯籠流しで送る一連の慶弔と共同体の祭。盂蘭盆経に由来する説と、農閑期の祖先祭祀が重なった説があります。墓参り・寺社参詣は交通・高温に留意し、各宗教者の指導に従ってください。",
    highlightColor: "rgba(202,138,4,0.3)",
    matchLunarRange: { lm: 7, from: 13, to: 16 },
    openMonth: 8,
  },
  {
    id: "tsukimi",
    title: "中秋の名月",
    reading: "ちゅうしゅうのめいげつ",
    displaySeason: "autumn",
    gregorianLabel: "新暦 旧暦八月十五夜に相当する日は年で移動（目安9〜10月）",
    lunarLabel: "旧暦 八月十五日（十五夜）",
    variability: "満月と完全一致しない年があります。",
    explanation:
      "芋・栗・豆の新穀と月を供える収穫感謝の行事。十六夜（いざよい）翌日に柱を立てる地方も。神社では観月会・中秋祭、茶室では月明かりの席が催されることがあります。",
    highlightColor: "rgba(30,58,95,0.32)",
    matchLunarDay: { lm: 8, ld: 15 },
    openMonth: 9,
  },
  {
    id: "choyo",
    title: "重陽の節句（菊の節句）",
    reading: "ちょうようのせっく",
    displaySeason: "autumn",
    gregorianLabel: "新暦 9月9日",
    lunarLabel: "九月九日に移す旧俗の残る地域あり",
    variability: "菊花展・長寿祈願の日取りは施設によります。",
    explanation:
      "奇数が重なる陽数の吉日として厄除け・長寿の祈り。茱萸を袋に入れて身に付けたり菊の露を拭う俗信があり、天皇陛下の長寿を祝う菊花展の文化とも通じます。",
    highlightColor: "rgba(234,88,12,0.22)",
    matchGregorian: [{ m: 9, d: 9 }],
    openMonth: 9,
  },
  {
    id: "ohigan_aki",
    title: "秋の彼岸（中日の目安）",
    reading: "あきのひがん",
    displaySeason: "autumn",
    gregorianLabel: "新暦 9月22日前後を中日とする所（秋分に寄せる）",
    lunarLabel: "旧暦では年によりずれます",
    variability: "秋分の日は年ごとに変わります。前三後七の寺もあります。",
    explanation:
      "秋分を中日とする供養の期間。おはぎ・ぼたもちを供えたり墓参りをする習慣が広く知られます。春彼岸とあわせて先祖供養の節目として捉えられることが多いです。",
    highlightColor: "rgba(251,146,60,0.2)",
    matchGregorian: [{ m: 9, d: 22 }, { m: 9, d: 23 }, { m: 9, d: 24 }],
    openMonth: 9,
  },
  {
    id: "kanname",
    title: "神嘗祭・新嘗祭（参考）",
    reading: "かんなめさい・にいなめさい",
    displaySeason: "autumn",
    gregorianLabel: "新嘗祭の祝日文化：新暦 11月23日",
    lunarLabel: "神嘗祭は旧暦九月十七日説など諸説あり（公式行事は所管庁参照）",
    variability: "宮中祭祀と神社本庁系の祭日は別系統で整理してください。",
    explanation:
      "新嘗祭（にいなめさい）は五穀成就を天皇が天照大御神に報告し新穀を供える大祭。国民の祝日「勤労感謝の日」の趣旨説明にも新嘗祭の精神が触れられます。地域神社の「新嘗祭」は日取り・規模が様々です。",
    highlightColor: "rgba(120,53,15,0.24)",
    matchGregorian: [{ m: 11, d: 23 }],
    openMonth: 11,
  },
  {
    id: "shichi",
    title: "七五三",
    reading: "しちごさん",
    displaySeason: "autumn",
    gregorianLabel: "新暦 11月15日を中心に前後の良日に参詣",
    lunarLabel: "旧暦十五夜にあわせる地域も",
    variability: "3歳・5歳・7歳のどれをいつ祝うかは家ごとです。",
    explanation:
      "幼児の成長を氏神・氏寺に報告し千歳飴や写真で祝う近世以降の風習。髪切り・袴着初めの年齢節目と結びつきます。混雑時期は予約・服装・感染対策に留意してください。",
    highlightColor: "rgba(126,34,206,0.2)",
    matchGregorian: [{ m: 11, d: 15 }],
    openMonth: 11,
  },
  {
    id: "toji",
    title: "冬至（行事的目安）",
    reading: "とうじ",
    displaySeason: "winter",
    gregorianLabel: "新暦 12月21日〜22日頃（天文計算）",
    lunarLabel: "旧暦では十一月前後",
    variability: "年ごとに日付がずれます。かぼちゃ・柚子湯の習慣は地域差大。",
    explanation:
      "一年で夜が最も長いころ。陰極まって陽生ずるとして、厄除けに柚子湯に入る・かぼちゃを食べる俗があります（アプリの二十四節気表示の「冬至」と併せてご覧ください）。",
    highlightColor: "rgba(14,116,144,0.24)",
    matchGregorian: [{ m: 12, d: 21 }, { m: 12, d: 22 }],
    openMonth: 12,
  },
  {
    id: "omisoka",
    title: "大晦日",
    reading: "おおみそか",
    displaySeason: "winter",
    gregorianLabel: "新暦 12月31日",
    lunarLabel: "旧暦では年により十一月〜正月前後",
    variability: "除夜の鐘の時刻・回数は寺により掲示あり。",
    explanation:
      "一年の最終日に家を掃き歳神を送り、除夜の鐘で煩悩を払う俗に結びつく夜。そばを食べる「年越し蕎麦」や神社の年越し参拝は近世以降に整った面があります。",
    highlightColor: "rgba(55,48,163,0.22)",
    matchGregorian: [{ m: 12, d: 31 }],
    openMonth: 12,
  },
];

export function traditionalEventsMatchingDay(
  _y: number,
  m: number,
  d: number,
  lunarMonth: number,
  lunarDay: number,
): TraditionalEventEntry[] {
  return TRADITIONAL_EVENTS.filter(e => {
    if (e.matchGregorian?.some(x => x.m === m && x.d === d)) return true;
    if (e.matchLunarDay && e.matchLunarDay.lm === lunarMonth && e.matchLunarDay.ld === lunarDay) return true;
    if (
      e.matchLunarRange
      && e.matchLunarRange.lm === lunarMonth
      && lunarDay >= e.matchLunarRange.from
      && lunarDay <= e.matchLunarRange.to
    ) return true;
    return false;
  });
}

export function getEventById(id: string): TraditionalEventEntry | undefined {
  return TRADITIONAL_EVENTS.find(e => e.id === id);
}

/** 行事タップ時に開く年・月（現在の欧米暦年を基準） */
export function getCalendarJumpForEvent(eventId: string, currentY: number): { y: number; m: number } {
  const e = getEventById(eventId);
  if (!e) return { y: currentY, m: 1 };
  return { y: currentY, m: e.openMonth };
}
