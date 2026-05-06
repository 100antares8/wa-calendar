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
  /**
   * 大区域名（東北・四国など）。未設定は全国的な目安。
   * UI では「地域別」ラベルと併記して区別します（神社個別にはしません）。
   */
  regionBlock?: string;
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
  return [...list].sort((a, b) => {
    const ra = a.regionBlock ? 1 : 0;
    const rb = b.regionBlock ? 1 : 0;
    if (ra !== rb) return ra - rb;
    return eventSortKey(a) - eventSortKey(b);
  });
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
  {
    id: "geshi_koyomi",
    title: "夏至（行事・养生の目安）",
    reading: "げし",
    displaySeason: "summer",
    gregorianLabel: "新暦 6月20日〜22日頃（天文計算）",
    lunarLabel: "旧暦では年により五月〜六月",
    variability: "祝日や夏至入りの定義は官報・天文と必ず一致しません。",
    explanation:
      "一年で昼が最も長いころ。半夏生や梅雨のちょい前後といった農事の目安とも結びつき、各地でそうめんを食べるなど季節の食が親しまれます。二十四節気の「夏至」と併せてご覧ください。",
    highlightColor: "rgba(250,204,21,0.38)",
    matchGregorian: [{ m: 6, d: 20 }, { m: 6, d: 21 }, { m: 6, d: 22 }],
    openMonth: 6,
  },
  {
    id: "jizo_nijusanya",
    title: "二十三夜（月待・地蔵縁日の目安）",
    reading: "にじゅうさんや",
    displaySeason: "summer",
    gregorianLabel: "旧八月二十三夜に相当する新暦は年で移動（目安8〜9月）",
    lunarLabel: "旧暦 八月二十三日",
    variability: "農閑の遊び・縁日として八月二十四日を重んじる地方も。",
    explanation:
      "月待と地蔵信仰が重なる縁日として知られる夜。里子ども会や蕎麦・豆ご飯の献立など地域の歳時に残ります。寺社の千灯会・縁日は掲示をご確認ください。",
    highlightColor: "rgba(139,92,246,0.26)",
    matchLunarDay: { lm: 8, ld: 23 },
    openMonth: 9,
  },
  {
    id: "reg_sendai_tanabata",
    title: "仙台七夕まつり（豪商七夕）",
    reading: "せんだいたなばたまつり",
    displaySeason: "summer",
    regionBlock: "東北",
    gregorianLabel: "新暦 8月6日〜8日が目安（仙台市の日程で要確認）",
    lunarLabel: "市内の笹飾りは飾付月初旬から",
    variability: "パレード・打ち上げの有無は年次第です。",
    explanation:
      "豪華な笹飾りと短冊で街を彩る東北を代表する夏祭。商人文化の七夕と短冊信仰が合体した景観として国内外にも知られます。混雑・交通規制にご注意ください。",
    highlightColor: "rgba(59,130,246,0.36)",
    matchGregorian: [{ m: 8, d: 6 }, { m: 8, d: 7 }, { m: 8, d: 8 }],
    openMonth: 8,
  },
  {
    id: "reg_aomori_nebuta",
    title: "青森ねぶた祭",
    reading: "あおもりねぶたまつり",
    displaySeason: "summer",
    regionBlock: "東北",
    gregorianLabel: "新暦 8月2日〜7日が目安（運行日は市の発表で要確認）",
    lunarLabel: "弘前・五所川原のねぷた・ねぷたは近接日程で別行事",
    variability: "見学者・交通は極めて混雑します。",
    explanation:
      "巨大灯籠を曳行する夏祭。津軽地方に根ざした造形と太鼓笛のリズムが特徴です。ラッセラー参加は安全対策と主催者のルールに従ってください。",
    highlightColor: "rgba(220,38,38,0.28)",
    matchGregorian: [{ m: 8, d: 2 }, { m: 8, d: 3 }, { m: 8, d: 4 }, { m: 8, d: 5 }, { m: 8, d: 6 }, { m: 8, d: 7 }],
    openMonth: 8,
  },
  {
    id: "reg_akita_kanto",
    title: "秋田竿燈まつり",
    reading: "あきたかんとうまつり",
    displaySeason: "summer",
    regionBlock: "東北",
    gregorianLabel: "新暦 8月3日〜6日が目安",
    lunarLabel: "五穀豊穣の祈りの竿燈が象徴",
    variability: "路上演舞・観覧エリアは主催者情報を確認してください。",
    explanation:
      "数メートルの竹竿に提灯を幾重にも吊し、手のひら・額・腰でささえる妙技が知られる祭。稲作信仰と見世物芸能が合体した東北の夏の風物詩です。",
    highlightColor: "rgba(249,115,22,0.3)",
    matchGregorian: [{ m: 8, d: 3 }, { m: 8, d: 4 }, { m: 8, d: 5 }, { m: 8, d: 6 }],
    openMonth: 8,
  },
  {
    id: "reg_morioka_sansa",
    title: "盛岡さんさ踊り",
    reading: "もりおかさんさおどり",
    displaySeason: "summer",
    regionBlock: "東北",
    gregorianLabel: "新暦 8月1日〜4日が目安",
    lunarLabel: "太鼓・鳴り物と輪踊り",
    variability: "参加型イベントの予約は市・協会の案内に従ってください。",
    explanation:
      "三つ打ちのさんさ太鼓に合わせて市内の至る所で輪踊りが広がる祭。厄除け伝承と城下町の商いの夏が合体した岩手を代表する行事です。",
    highlightColor: "rgba(244,63,94,0.26)",
    matchGregorian: [{ m: 8, d: 1 }, { m: 8, d: 2 }, { m: 8, d: 3 }, { m: 8, d: 4 }],
    openMonth: 8,
  },
  {
    id: "reg_kasedori",
    title: "カセ鳥（賽の鳥）・年取り行事",
    reading: "かせどり",
    displaySeason: "winter",
    regionBlock: "東北",
    gregorianLabel: "新暦 1月の夜に営む所（仙台・南東北など／日付は地域差大）",
    lunarLabel: "農村共同体の暦行事",
    variability: "口調・衣装・訪問形態は村ごとに異なります。",
    explanation:
      "藁の衣で訪問し祝福の言葉と交換に酒食をいただく行事の総称が近いイメージです（名称は地域で「ケセドリ」「年取」等）。無形民俗文化財として記録されている例もあります。",
    highlightColor: "rgba(120,53,15,0.22)",
    matchGregorian: [{ m: 1, d: 10 }, { m: 1, d: 11 }, { m: 1, d: 12 }, { m: 1, d: 13 }, { m: 1, d: 14 }, { m: 1, d: 15 }],
    openMonth: 1,
  },
  {
    id: "reg_gion_kyoto",
    title: "祇園祭（山鉾・還幸の目安）",
    reading: "ぎおんまつり",
    displaySeason: "summer",
    regionBlock: "近畿",
    gregorianLabel: "新暦 7月に京都市内で展開（山鉾巡行は7月17日が例年の重心）",
    lunarLabel: "祇園信仰に由来する氏祭",
    variability: "前祭・後祭・各山鉾の日程は八坂神社の公表に従ってください。",
    explanation:
      "豪華な山鉾と稚児役・囃子方で知られる日本三大祭のひとつ。町の自治と信仰が組み合わさった夏の京都の象徴です。猛暑・観客集中にご留意ください。",
    highlightColor: "rgba(217,70,239,0.26)",
    matchGregorian: [{ m: 7, d: 14 }, { m: 7, d: 15 }, { m: 7, d: 16 }, { m: 7, d: 17 }, { m: 7, d: 23 }, { m: 7, d: 24 }],
    openMonth: 7,
  },
  {
    id: "reg_tenjin_osaka",
    title: "天神祭（船渡御・奉納花火の目安）",
    reading: "てんじんまつり",
    displaySeason: "summer",
    regionBlock: "近畿",
    gregorianLabel: "新暦 7月24日〜25日が目安（大阪天満宮）",
    lunarLabel: "菅原道真を祀る夏祭",
    variability: "雨中決行・河畔の安全は主催者の指示に従ってください。",
    explanation:
      "陸渡御と船渡御、そして大川の花火で知られる大阪の夏祭。学問の神様への信仰と港町の見世物文化が結びついた光景です。",
    highlightColor: "rgba(236,72,153,0.28)",
    matchGregorian: [{ m: 7, d: 24 }, { m: 7, d: 25 }],
    openMonth: 7,
  },
  {
    id: "reg_awadori",
    title: "阿波踊り",
    reading: "あわおどり",
    displaySeason: "summer",
    regionBlock: "四国",
    gregorianLabel: "新暦 8月12日〜15日が目安（徳島市）",
    lunarLabel: "盆前後の街割踊り",
    variability: "演舞場・有料席は市の案内を確認してください。",
    explanation:
      "「踊る阿呆に見る阿呆—」で始まる掛け声でも知られる盆踊りの一大スタイル。地方都市に人が流入し経済効果も大きい例です。熱中症対策を。",
    highlightColor: "rgba(16,185,129,0.3)",
    matchGregorian: [{ m: 8, d: 12 }, { m: 8, d: 13 }, { m: 8, d: 14 }, { m: 8, d: 15 }],
    openMonth: 8,
  },
  {
    id: "reg_yosakoi",
    title: "よさこい祭り",
    reading: "よさこいまつり",
    displaySeason: "summer",
    regionBlock: "四国",
    gregorianLabel: "新暦 8月9日〜12日が目安（高知市）",
    lunarLabel: "鳴子と衣装のコンフェデレーション踊り",
    variability: "全国によさこい系イベントが波及していますが、ここでは発祥地の日程を示します。",
    explanation:
      "戦後に始まった市民参加型の祭で、鳴子リズムと独自編曲の楽曲が魅力です。「よさこい」という語は高知の看板から全国へ広がりました。",
    highlightColor: "rgba(245,158,11,0.32)",
    matchGregorian: [{ m: 8, d: 9 }, { m: 8, d: 10 }, { m: 8, d: 11 }, { m: 8, d: 12 }],
    openMonth: 8,
  },
  {
    id: "reg_hakata_yamakasa",
    title: "博多祇園山笠（追い山の目安）",
    reading: "はかたぎおんやまかさ",
    displaySeason: "summer",
    regionBlock: "九州",
    gregorianLabel: "新暦 7月1日〜15日（追い山は7月15日早朝が例）",
    lunarLabel: "博多の夏の氏祭",
    variability: "交通規制・見学の安全は福岡市の発表に従ってください。",
    explanation:
      "飾り山と走山で知られる博多の夏。献燈隊の朝の疾走は迫力がありますが非常に危険区域でもあるため主催者の立入区分を守ってください。",
    highlightColor: "rgba(239,68,68,0.26)",
    matchGregorian: [
      { m: 7, d: 1 }, { m: 7, d: 2 }, { m: 7, d: 3 }, { m: 7, d: 4 }, { m: 7, d: 5 },
      { m: 7, d: 6 }, { m: 7, d: 7 }, { m: 7, d: 8 }, { m: 7, d: 9 }, { m: 7, d: 10 },
      { m: 7, d: 11 }, { m: 7, d: 12 }, { m: 7, d: 13 }, { m: 7, d: 14 }, { m: 7, d: 15 },
    ],
    openMonth: 7,
  },
  {
    id: "reg_nagasaki_kunchi",
    title: "長崎くんち",
    reading: "ながさきくんち",
    displaySeason: "autumn",
    regionBlock: "九州",
    gregorianLabel: "新暦 10月7日〜9日が目安",
    lunarLabel: "諏訪神社の大祭・渡り芸",
    variability: "舁山・舁龍の運行ルートは地元案内を確認してください。",
    explanation:
      "豪華な曳物と洋風・郷土芸能のミックスで知られる長崎の秋祭。鎖国期の港町文化が祀りに色濃く残る例としても注目されます。",
    highlightColor: "rgba(168,85,247,0.28)",
    matchGregorian: [{ m: 10, d: 7 }, { m: 10, d: 8 }, { m: 10, d: 9 }],
    openMonth: 10,
  },
  {
    id: "reg_sapporo_yuki",
    title: "さっぽろ雪まつり",
    reading: "さっぽろゆきまつり",
    displaySeason: "winter",
    regionBlock: "北海道",
    gregorianLabel: "新暦 2月上旬（例年おおむね2月4日〜11日頃）",
    lunarLabel: "大雪像と氷像の国際イベント",
    variability: "会場分散・オンライン併用など形式は年で変わります。",
    explanation:
      "大雪像で賑わう北海道の冬の名物。防寒と足元に十分留意し、公式の混雑情報を確認してください。",
    highlightColor: "rgba(125,211,252,0.45)",
    matchGregorian: [
      { m: 2, d: 4 }, { m: 2, d: 5 }, { m: 2, d: 6 }, { m: 2, d: 7 },
      { m: 2, d: 8 }, { m: 2, d: 9 }, { m: 2, d: 10 }, { m: 2, d: 11 },
    ],
    openMonth: 2,
  },
  {
    id: "reg_okinawa_shiimii",
    title: "シーミー（清明祭・墓参の目安）",
    reading: "しーみー",
    displaySeason: "spring",
    regionBlock: "沖縄",
    gregorianLabel: "新暦 4月4日〜6日が目安に多い（旧清明に相当）",
    lunarLabel: "祖先祭祀と風習料理（ポーク卵など）",
    variability: "旧暦清明を取る家・村もあり実日は多様です。",
    explanation:
      "沖縄本島を中心に家族で御墓を掃除し杯を挙げる春の慶弔。日本本土の「彼岸」と異なる系統の日取り文化として理解されることが多いです。",
    highlightColor: "rgba(52,211,153,0.32)",
    matchGregorian: [{ m: 4, d: 4 }, { m: 4, d: 5 }, { m: 4, d: 6 }],
    openMonth: 4,
  },
  {
    id: "reg_takasaki_daruma",
    title: "高崎だるま市（鴻巣・高崎の縁日文化）",
    reading: "たかさきだるまいち",
    displaySeason: "winter",
    regionBlock: "関東",
    gregorianLabel: "新暦 1月6日〜7日が目安（達磨大師忌にちなむ商祭）",
    lunarLabel: "だるま供養・目入れの商い行事",
    variability: "鴻巣・藤岡など近県にも類似の縁日があります。",
    explanation:
      "福だるまの縁起物市として知られる群馬・関東の歳時。商売繁盛の祈りと破魔の象徴として幅広く親しまれます。交通安全と密集にご留意ください。",
    highlightColor: "rgba(185,28,28,0.22)",
    matchGregorian: [{ m: 1, d: 6 }, { m: 1, d: 7 }],
    openMonth: 1,
  },
  {
    id: "reg_chichibu_yomatsuri",
    title: "秩父夜祭",
    reading: "ちちぶよまつり",
    displaySeason: "autumn",
    regionBlock: "関東",
    gregorianLabel: "新暦 12月3日前後が山車曳行の目安（埼玉県秩父市）",
    lunarLabel: "寒宵の花火と屋台山車",
    variability: "観覧位置・交通は市の案内を優先してください。",
    explanation:
      "重厚な屋台軕と鉾先の花火で知られる冬祭。山間の宿場町に残る大規模な神幸行事として無形文化財にも登録されています。",
    highlightColor: "rgba(220,38,38,0.2)",
    matchGregorian: [{ m: 12, d: 2 }, { m: 12, d: 3 }, { m: 12, d: 4 }],
    openMonth: 12,
  },
  {
    id: "reg_takayama_matsuri_haru",
    title: "高山祭（春の山王祭・屋台曳行の目安）",
    reading: "たかやままつり・はる",
    displaySeason: "spring",
    regionBlock: "中部",
    gregorianLabel: "新暦 4月14日〜15日が目安",
    lunarLabel: "飛騨の春祭",
    variability: "夜祭・屋台の運行時間は町内規程を確認してください。",
    explanation:
      "精緻なからくり屋台が旧市街を巡る春と秋の二大祭のうち春祭。木匠文化と城下町の自治を象徴する風景として知られます。",
    highlightColor: "rgba(244,114,182,0.28)",
    matchGregorian: [{ m: 4, d: 14 }, { m: 4, d: 15 }],
    openMonth: 4,
  },
  {
    id: "reg_takayama_matsuri_aki",
    title: "高山祭（秋の八幡祭・屋台曳行の目安）",
    reading: "たかやままつり・あき",
    displaySeason: "autumn",
    regionBlock: "中部",
    gregorianLabel: "新暦 10月9日〜10日が目安",
    lunarLabel: "飛騨の秋祭",
    variability: "春祭と同様、混雑が非常に大きくなります。",
    explanation:
      "精緻なからくり屋台が旧市街を巡る秋の高山祭。木匠文化と城下町の神幸が結びついた景観として知られ、夜の屋台運行も迫力があります。",
    highlightColor: "rgba(251,113,133,0.28)",
    matchGregorian: [{ m: 10, d: 9 }, { m: 10, d: 10 }],
    openMonth: 10,
  },
  {
    id: "reg_hiroshima_hanafes",
    title: "ひろしまフラワーフェスティバル",
    reading: "ひろしまはなふぇす",
    displaySeason: "spring",
    regionBlock: "中国",
    gregorianLabel: "新暦 5月3日〜5日が目安（広島市）",
    lunarLabel: "平和記念公園一帯の大花市",
    variability: "屋台・交通規制は市の発表を確認してください。",
    explanation:
      "黄金週期に催される広島を代表する大花市と街路の賑わいです（祭礼そのものというより季の行事文化の代表例として掲載）。混雑と暑さにご注意ください。",
    highlightColor: "rgba(251,207,232,0.42)",
    matchGregorian: [{ m: 5, d: 3 }, { m: 5, d: 4 }, { m: 5, d: 5 }],
    openMonth: 5,
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

/** 暦・旧暦年グリッド：行事でマス全体を塗る（複数は斜め分割） */
export function cellPaintForTraditionalEvents(
  dayEvents: TraditionalEventEntry[],
  seasonOrPaperBg: string,
): { background: string; backgroundImage?: string } {
  if (dayEvents.length === 0) {
    return { background: seasonOrPaperBg };
  }
  if (dayEvents.length === 1) {
    return { background: dayEvents[0].highlightColor };
  }
  const [a, b, ...rest] = dayEvents;
  if (dayEvents.length === 2) {
    return {
      background: seasonOrPaperBg,
      backgroundImage:
        `linear-gradient(125deg, ${a.highlightColor} 0%, ${a.highlightColor} 47.5%, ${b.highlightColor} 52.5%, ${b.highlightColor} 100%)`,
    };
  }
  const c = rest[0] ?? b;
  return {
    background: seasonOrPaperBg,
    backgroundImage:
      `linear-gradient(125deg, ${a.highlightColor} 0%, ${a.highlightColor} 32%, ${b.highlightColor} 32%, ${b.highlightColor} 64%, ${c.highlightColor} 64%, ${c.highlightColor} 100%)`,
  };
}

/** 行事タップ時に開く年・月（現在の欧米暦年を基準） */
export function getCalendarJumpForEvent(eventId: string, currentY: number): { y: number; m: number } {
  const e = getEventById(eventId);
  if (!e) return { y: currentY, m: 1 };
  return { y: currentY, m: e.openMonth };
}
