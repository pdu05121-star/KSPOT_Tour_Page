import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, MapPin, Car, Sparkles } from "lucide-react";
import LangFormModal from "@/app/components/LangFormModal";

// Local Image Imports (동일한 수원 에셋 재사용)
import janganmunNightImg from "@/assets/carousel/janganmun_night.jpg";
import sunjaeSiljaImg from "@/assets/carousel/sunjae_silja.jpg";
import suwonHongwhamunImg from "@/assets/suwon/hwahongmun_v2.webp";
import bangwhasuryujeongPicnicImg from "@/assets/suwon/bangwhasuryujeong_v2.webp";
import haenggungdongMuralImg from "@/assets/suwon/haenggungdong_mural.png";
import suwonFortressWallImg from "@/assets/suwon/suwon_fortress_wall.png";
import nammanTongdakImg from "@/assets/suwon/namman_tongdak.jpg";
import jeongjiyoungStoreImg from "@/assets/suwon/jeongjiyoung_store.png";

// ─────────────────────────────────────────────
// 디자인 토큰 — "KSPOT 여행일기" 서브 브랜드 전용 팔레트
// ─────────────────────────────────────────────
const TOUR_RUST = "#B5502F";
const TOUR_INK_DEEP = "#20362F";
const TOUR_BODY_INK = "#3A342C";
const TOUR_PAPER = "#F5F0E6";
const TOUR_PAPER_DEEP = "#EAE1CC";
const TOUR_BORDER = "#DED2B8";
const TEAL = "#1D9E75";

const INK = TOUR_BODY_INK;
const PINE = TOUR_INK_DEEP;
const STAMP = TOUR_RUST;
const PAPER = TOUR_PAPER;
const PAPER_DEEP = TOUR_PAPER_DEEP;
const HAIRLINE = TOUR_BORDER;

type Lang = "ko" | "en" | "ja" | "zh" | "vi";
const LANGS: { code: Lang; label: string }[] = [
  { code: "ko", label: "한" },
  { code: "en", label: "EN" },
  { code: "ja", label: "日" },
  { code: "zh", label: "中" },
  { code: "vi", label: "VI" },
];

// 왕복 판단 프레임 — 코스템플릿_수원_선재_v4.md 기준 (2026-07-21, 판정 CONFIRMED)
const ROUND_TRIP = {
  departTime: "08:40", // 몽테드 카페 오픈(10:00) 기준 역산
  departConfirmed: false, // 출발 허브(서울역)는 v4에서도 "임시 확정 — 팀 최종 확인 권장" 상태
  suwonArriveTime: "09:40", // 서울역 출발 → 수원역 도착, 1호선 약 55분
  lastSpotDepartTime: "16:47", // 정지영커피 출발 = 코스 종료 시각
  estimatedStationArrival: "17:10",
  homeArriveTime: "17:40", // 수원역(17:10) → 서울역, 약 30분(팀 확인값)
  bufferMinutes: 360 as number | null, // v4 판정 근거: 여유 약 360분 → GO. 막차 정확 시각은 표시용 디테일이라 페이지에 노출 안 함.
};

// 판정 임계값 — 개발지시서 기준. 여기 숫자만 바꾸면 전 지역 코스에 동일 적용됨.
const VERDICT_THRESHOLD_GO = 90;
const VERDICT_THRESHOLD_CARE = 45;

type Verdict = "draft" | "go" | "care" | "reconsider" | "not_now";

function computeVerdict(bufferMinutes: number | null): Verdict {
  if (bufferMinutes === null) return "draft";
  if (bufferMinutes <= 0) return "not_now";
  if (bufferMinutes >= VERDICT_THRESHOLD_GO) return "go";
  if (bufferMinutes >= VERDICT_THRESHOLD_CARE) return "care";
  return "reconsider";
}

const GO_GREEN = "#2F7D5B";
const WARN_AMBER = "#B8893A";
const CARE_AMBER = "#B45309";
const RECONSIDER_ORANGE = "#9A3412";
const NOT_NOW_RED = "#922B21";

const VERDICT_COLOR: Record<Verdict, string> = {
  draft: WARN_AMBER,
  go: GO_GREEN,
  care: CARE_AMBER,
  reconsider: RECONSIDER_ORANGE,
  not_now: NOT_NOW_RED,
};
const VERDICT_LABEL: Record<Verdict, string> = {
  draft: "◐ DRAFT",
  go: "✓ GO",
  care: "⚠ GO WITH CARE",
  reconsider: "△ RECONSIDER",
  not_now: "✕ NOT NOW",
};
const VERDICT_SUB: Record<Lang, Record<Verdict, string>> = {
  ko: { draft: "판정 보류", go: "무사히 귀환", care: "시간 여유를 두고 움직이세요", reconsider: "코스 축소를 권장해요", not_now: "지금 조건에서는 어려워요" },
  en: { draft: "Verdict on hold", go: "Safe return", care: "Leave some extra time", reconsider: "Consider trimming the course", not_now: "Difficult under current conditions" },
  ja: { draft: "判定保留", go: "無事帰還できます", care: "時間に余裕を持って", reconsider: "コースを減らすことをお勧めします", not_now: "今の条件では難しいです" },
  zh: { draft: "判定暂缓", go: "可以安全返回", care: "请留出充足时间", reconsider: "建议精简行程", not_now: "目前条件下有困难" },
  vi: { draft: "Đang chờ xác nhận", go: "Về lại an toàn", care: "Hãy di chuyển với thời gian dư dả", reconsider: "Nên rút gọn lịch trình", not_now: "Khó khăn với điều kiện hiện tại" },
};

// 도착 시각 바로 뒤에 붙는 한 줄 결론 — 숫자(막차시각) 대신 "왜 안심해도 되는지"를 바로 말해줌
const VERDICT_ARRIVAL_HINT: Record<Lang, Record<Verdict, string>> = {
  ko: { draft: "막차 정보 확인 중이에요", go: "막차까지 여유 넉넉해요", care: "막차 전까지 서두르면 괜찮아요", reconsider: "막차 시간이 빠듯해요", not_now: "막차를 놓칠 수 있어요" },
  en: { draft: "Checking the last train info", go: "plenty of time before the last train", care: "you'll need to keep moving before the last train", reconsider: "cutting it close for the last train", not_now: "you may miss the last train" },
  ja: { draft: "終電情報を確認中です", go: "終電まで余裕があります", care: "終電まで少し急いだ方がいいです", reconsider: "終電まで時間がぎりぎりです", not_now: "終電に間に合わないかもしれません" },
  zh: { draft: "末班车信息确认中", go: "距末班车还很宽裕", care: "赶末班车需要抓紧时间", reconsider: "赶末班车时间比较紧", not_now: "可能赶不上末班车" },
  vi: { draft: "Đang xác nhận thông tin chuyến tàu cuối", go: "còn nhiều thời gian trước chuyến tàu cuối", care: "cần di chuyển nhanh trước chuyến tàu cuối", reconsider: "khá sát giờ chuyến tàu cuối", not_now: "có thể lỡ chuyến tàu cuối" },
};

const verdict = computeVerdict(ROUND_TRIP.bufferMinutes);

// 여유시간 표기 — v4 지시서: "가짜 정밀값(예: 5시간 39분) 금지, 여유 약 360분 형식(분 단위 + 라벨)으로 통일"
const BUFFER_APPROX: Record<Lang, { prefix: string; unit: string }> = {
  ko: { prefix: "약 ", unit: "분" },
  en: { prefix: "about ", unit: " min" },
  ja: { prefix: "約", unit: "分" },
  zh: { prefix: "约", unit: "分钟" },
  vi: { prefix: "khoảng ", unit: " phút" },
};
function formatBufferApprox(minutes: number, lang: Lang): string {
  const u = BUFFER_APPROX[lang];
  return `${u.prefix}${minutes}${u.unit}`;
}

// 구글맵 저장 버튼용 좌표 — 코스템플릿_수원_선재_v3.md 7곳 (행리단길은 좌표 미확인이라 제외)
const ROUTE_COORDS = [
  "37.2847710231129,127.013617036234",
  "37.2855291351344,127.01661296437",
  "37.2875267997459,127.018037812296",
  "37.285686283703,127.016560223438",
  "37.2818820191942,127.014394463798",
  "37.2794246460132,127.017499823481",
  "37.2848962630143,127.014416125317",
];
const GOOGLE_MAPS_ROUTE_URL = `https://www.google.com/maps/dir/?api=1&origin=${ROUTE_COORDS[0]}&destination=${ROUTE_COORDS[ROUTE_COORDS.length - 1]}&waypoints=${ROUTE_COORDS.slice(1, -1).join("|")}&travelmode=walking`;

// My Maps — 7곳이 담긴 지도. 팀이 mymaps.google.com에서 직접 생성·공유 설정한 링크.
// 길찾기 딥링크(위 GOOGLE_MAPS_ROUTE_URL)와 다르게, 사용자가 자기 구글 계정에 실제로 저장(즐겨찾기)할 수 있음.
const GOOGLE_MY_MAPS_URL = "https://www.google.com/maps/d/viewer?mid=1aWeZoTginTKzpvtjmGTbihFzFYPssus";

// ─────────────────────────────────────────────
// 카피 — 언어별 (⚠️ AI 초벌 번역. 배포 전 원어민(중국어·일본어) 검수 필수 — 개발지시서 규칙)
// ─────────────────────────────────────────────

const UI: Record<Lang, {
  backLink: string; brand: string;
  heroBadge: string; heroTitle1: string; heroTitle2: string; heroAlt: string;
  introSub: string; blockquote: string;
  frameHeading: string; departNote: string; hubWarning: string; startTransferNote: string; transferNote: string;
  arrivalLabel: string; scrollHint: string;
  verdictTitle: Record<Verdict, string>;
  courseSummary: string;
  verdictReasonPre: string; verdictReasonPost: string;
  evidenceItem1: string; evidenceItem2: string; evidenceItem3: string;
  timetableStartLabel: string; timetableStartDesc: string;
  timetableSuwonArriveDesc: string;
  timetableEndLabel: string; timetableEndDesc: string;
  timetableSeoulArriveLabel: string; timetableSeoulArriveDesc: string;
  ch1: string; ch2: string; ch3: string; ch4: string;
  secretCoord: string; moveLabel: string; tipLabel: string;
  recommendedMenu: string; tipLabel2: string;
  closingEyebrow: string; closingTitle1: string; closingTitle2: string; closingSub1: string; closingSub2: string;
  stickyBtn: string; stickySaveBtn: string; stickyHook: string;
  breakHeading: string; breakCond1: string;
}> = {
  ko: {
    backLink: "다른 투어 보기", brand: "KSPOT Travelog",
    heroBadge: "📍 수원 행궁동 · 당일치기 코스",
    heroTitle1: "수원에서 만나는", heroTitle2: "〈선재 업고 튀어〉 타임슬립 로드맵",
    heroAlt: "수원 화성 장안문 야경",
    introSub: "〈선재 업고 튀어〉 찐팬들만 아는 임솔♥류선재 타임슬립 성지 루트",
    blockquote: "인스타에도 없는 진짜 좌표, 현지인 보장 찐 맛집까지 — 이 페이지 하나로 수원 완전 정복.",
    frameHeading: "왕복 이동, 한눈에",
    verdictTitle: {
      go: "오늘 이 코스, 가도 됩니다",
      care: "오늘 이 코스, 서두르면 갈 수 있어요",
      reconsider: "오늘 이 코스, 축소가 필요해요",
      not_now: "오늘 이 코스, 지금은 어려워요",
      draft: "오늘 이 코스, 판정 확인 중이에요",
    },
    courseSummary: "5개 스팟 · 도보 중심 당일치기",
    evidenceItem1: "✓ 08:40 서울역 출발 → 17:40 서울역 귀환 (1호선 왕복)",
    evidenceItem2: "✓ 막차까지 여유 충분 (약 360분)",
    evidenceItem3: "✓ 전 스팟 운영시간 확인됨 (휴무·마감시간 문제없음)",
    departNote: "서울역 출발 · 1호선 약 55분",
    hubWarning: " [출발 허브 확정 필요]",
    startTransferNote: "09:40 수원역 도착 → 몽테드 카페, 약 20분",
    transferNote: "16:47 정지영커피 출발 → 수원역, 약 20분",
    arrivalLabel: "수원역 도착",
    scrollHint: "↓ 스팟별 자세한 일정은 아래로 스크롤",
    verdictReasonPre: "그래서 막차(자정 무렵)까지 여유 ", verdictReasonPost: " — 걱정 없이 돌아갈 수 있어요.",
    timetableStartLabel: "서울역 출발", timetableStartDesc: "1호선 타고 수원역까지 약 55분",
    timetableSuwonArriveDesc: "몽테드 카페까지 약 20분",
    timetableEndLabel: "수원역 도착", timetableEndDesc: "여기서 서울행 열차로 환승",
    timetableSeoulArriveLabel: "서울역 도착", timetableSeoulArriveDesc: "1호선 타고 무사히 하루 마무리",
    ch1: "과몰입 촬영지 BEST 5", ch2: "현지인 찐맛집", ch3: "카페", ch4: "한눈에 보는 당일치기 타임테이블",
    secretCoord: "시크릿 좌표.", moveLabel: "이동 · 주차.", tipLabel: "에디터 시크릿 꿀팁",
    recommendedMenu: "추천 메뉴.", tipLabel2: "꿀팁.",
    closingEyebrow: "✦ 아직 안 끝났어요",
    closingTitle1: "내 날짜에 맞춘 정확한 판단은", closingTitle2: "지금 요청해야 받을 수 있어요",
    closingSub1: "위 코스는 날짜를 정하지 않은 예시 시나리오예요.", closingSub2: "가고 싶은 지역과 날짜를 알려주시면, 막차까지 딱 맞게 새로 계산해드려요.",
    stickySaveBtn: "🗺️ 지도 저장",
    stickyHook: "내 날짜엔 다를 수 있어요",
    breakHeading: "⚠ 이 판단이 깨지는 조건",
    breakCond1: "수요일은 첫 스팟 휴무 — 평일(수요일 제외)·주말 방문 권장",
    stickyBtn: "요청하기 →",
  },
  en: {
    backLink: "See other tours", brand: "KSPOT Travelog",
    heroBadge: "📍 Suwon Haenggung-dong · Day Trip Course",
    heroTitle1: "A day in Suwon with", heroTitle2: "〈Lovely Runner〉's time-slip road",
    heroAlt: "Suwon Hwaseong Janganmun Gate at night",
    introSub: "The time-slip pilgrimage route only 〈Lovely Runner〉 diehards know — Sol ♥ Sun-jae",
    blockquote: "Real coordinates Instagram doesn't have, local-guaranteed favorites — conquer Suwon completely with this one page.",
    frameHeading: "Round trip, at a glance",
    verdictTitle: {
      go: "This course is a go today",
      care: "You can make it — just keep moving",
      reconsider: "This course needs trimming today",
      not_now: "This course isn't feasible today",
      draft: "Checking today's verdict...",
    },
    courseSummary: "5 spots · walk-friendly day trip",
    evidenceItem1: "✓ 08:40 Depart Seoul Station → 17:40 Return Seoul Station (Line 1)",
    evidenceItem2: "✓ Plenty of time before the last train (~360 min)",
    evidenceItem3: "✓ All spot hours confirmed (no closures or cutoffs)",
    departNote: "Depart Seoul Station · ~55 min on Line 1",
    hubWarning: " [Departure hub not finalized]",
    startTransferNote: "09:40 Arrive Suwon Station → Monde Café, about 20 min",
    transferNote: "16:47 Depart Jeong Jiyoung Coffee → Suwon Station, about 20 min",
    arrivalLabel: "Arrive Suwon Station",
    scrollHint: "↓ Scroll down for the spot-by-spot schedule",
    verdictReasonPre: "So you'll have ", verdictReasonPost: " before the last train (around midnight) — plenty of room to get back safely.",
    timetableStartLabel: "Depart Seoul Station", timetableStartDesc: "About 55 min to Suwon Station on Line 1",
    timetableSuwonArriveDesc: "About 20 min to Monde Café",
    timetableEndLabel: "Arrive Suwon Station", timetableEndDesc: "Transfer here for the train back to Seoul",
    timetableSeoulArriveLabel: "Arrive Seoul Station", timetableSeoulArriveDesc: "Back on Line 1 — day safely wrapped up",
    ch1: "Obsession-worthy filming spots BEST 5", ch2: "Local favorite restaurant", ch3: "Café", ch4: "Day-trip timetable at a glance",
    secretCoord: "Secret coordinates.", moveLabel: "Getting there / parking.", tipLabel: "Editor's secret tip",
    recommendedMenu: "Recommended.", tipLabel2: "Tip.",
    closingEyebrow: "✦ This isn't finished yet",
    closingTitle1: "An accurate verdict for your own dates", closingTitle2: "only comes when you request it",
    closingSub1: "The course above is a sample scenario with no date set.", closingSub2: "Tell us your dates and destination, and we'll recalculate it down to the last train — just for you.",
    stickySaveBtn: "🗺️ Save map",
    stickyHook: "Your dates might change this",
    breakHeading: "⚠ When this verdict breaks down",
    breakCond1: "The first spot is closed on Wednesdays — visit on a weekday (except Wed.) or weekend",
    stickyBtn: "Request →",
  },
  ja: {
    backLink: "他のツアーを見る", brand: "KSPOT Travelog",
    heroBadge: "📍 水原 行宮洞 · 日帰りコース",
    heroTitle1: "水原で出会う", heroTitle2: "〈ソンジェ背負って走れ〉タイムスリップロードマップ",
    heroAlt: "水原華城 長安門の夜景",
    introSub: "〈ソンジェ背負って走れ〉ガチ勢だけが知るソル♥ソンジェのタイムスリップ聖地ルート",
    blockquote: "インスタにもない本物の座標、地元民保証の名店まで — このページ一つで水原を完全制覇。",
    frameHeading: "往復の移動、ひと目で",
    verdictTitle: {
      go: "今日のコース、行けます",
      care: "今日のコース、急げば行けます",
      reconsider: "今日のコース、短縮が必要です",
      not_now: "今日のコース、今は難しいです",
      draft: "今日のコース、判定確認中です",
    },
    courseSummary: "5スポット・徒歩中心の日帰り",
    evidenceItem1: "✓ 08:40 ソウル駅出発 → 17:40 ソウル駅帰着（1号線往復）",
    evidenceItem2: "✓ 終電まで十分な余裕（約360分）",
    evidenceItem3: "✓ 全スポットの営業時間確認済み（休業・終了時間に問題なし）",
    departNote: "ソウル駅発 · 1号線約55分",
    hubWarning: " [出発ハブ未確定]",
    startTransferNote: "09:40 水原駅到着 → モンテドカフェ、約20分",
    transferNote: "16:47 ジョンジヨンコーヒー出発 → 水原駅、約20分",
    arrivalLabel: "水原駅到着",
    scrollHint: "↓ スポットごとの詳しい時間は下にスクロール",
    verdictReasonPre: "だから終電（深夜0時ごろ）まで", verdictReasonPost: "の余裕があります — 安心して帰れます。",
    timetableStartLabel: "ソウル駅出発", timetableStartDesc: "1号線で水原駅まで約55分",
    timetableSuwonArriveDesc: "モンテドカフェまで約20分",
    timetableEndLabel: "水原駅到着", timetableEndDesc: "ここでソウル行きの列車に乗り換え",
    timetableSeoulArriveLabel: "ソウル駅到着", timetableSeoulArriveDesc: "1号線で無事に一日を締めくくり",
    ch1: "過剰入魂ロケ地 BEST 5", ch2: "地元グルメ", ch3: "カフェ", ch4: "ひと目でわかる日帰りタイムテーブル",
    secretCoord: "シークレット座標.", moveLabel: "移動・駐車.", tipLabel: "エディター秘密の裏技",
    recommendedMenu: "おすすめ.", tipLabel2: "裏技.",
    closingEyebrow: "✦ まだ終わっていません",
    closingTitle1: "自分の日程に合わせた正確な判定は", closingTitle2: "リクエストしないと受け取れません",
    closingSub1: "上記のコースは日付を指定していないサンプルシナリオです。", closingSub2: "行きたい地域と日程を教えてください。終電まで正確に計算し直します。",
    stickySaveBtn: "🗺️ 地図を保存",
    stickyHook: "自分の日程では変わるかも",
    breakHeading: "⚠ この判定が崩れる条件",
    breakCond1: "水曜日は最初のスポットが休み — 平日(水曜以外)か週末の訪問がおすすめです",
    stickyBtn: "リクエストする →",
  },
  zh: {
    backLink: "查看其他路线", brand: "KSPOT Travelog",
    heroBadge: "📍 水原 行宫洞 · 一日游路线",
    heroTitle1: "在水原邂逅", heroTitle2: "〈背着善宰跑〉穿越时空路线",
    heroAlt: "水原华城长安门夜景",
    introSub: "只有〈背着善宰跑〉真爱粉才知道的Sol♥Sunjae穿越时空圣地路线",
    blockquote: "连Instagram都没有的真实坐标，本地人认证的美食——这一页带你彻底征服水原。",
    frameHeading: "往返交通一目了然",
    verdictTitle: {
      go: "今天这条路线，可以出发",
      care: "今天这条路线，抓紧时间能走",
      reconsider: "今天这条路线，需要缩减",
      not_now: "今天这条路线，暂时有困难",
      draft: "今天这条路线，判定确认中",
    },
    courseSummary: "5个景点 · 以步行为主的一日游",
    evidenceItem1: "✓ 08:40 首尔站出发 → 17:40 首尔站返回（1号线往返）",
    evidenceItem2: "✓ 距末班车还有充足时间（约360分钟）",
    evidenceItem3: "✓ 所有景点营业时间已确认（无休息日或截止时间问题）",
    departNote: "首尔站出发 · 1号线约55分钟",
    hubWarning: " [出发枢纽尚未确定]",
    startTransferNote: "09:40 到达水原站 → Monde咖啡，约20分钟",
    transferNote: "16:47 从Jeong Jiyoung咖啡出发 → 水原站，约20分钟",
    arrivalLabel: "到达水原站",
    scrollHint: "↓ 各景点详细时间请向下滚动查看",
    verdictReasonPre: "所以距末班车（接近午夜）还有", verdictReasonPost: "——可以放心返回。",
    timetableStartLabel: "首尔站出发", timetableStartDesc: "乘1号线到水原站约55分钟",
    timetableSuwonArriveDesc: "到Monde咖啡约20分钟",
    timetableEndLabel: "到达水原站", timetableEndDesc: "在这里换乘开往首尔的列车",
    timetableSeoulArriveLabel: "到达首尔站", timetableSeoulArriveDesc: "乘1号线平安结束一天",
    ch1: "沉浸式取景地 BEST 5", ch2: "本地人气美食", ch3: "咖啡店", ch4: "一目了然的一日游时间表",
    secretCoord: "秘密坐标.", moveLabel: "交通·停车.", tipLabel: "编辑私藏秘诀",
    recommendedMenu: "推荐.", tipLabel2: "小贴士.",
    closingEyebrow: "✦ 还没结束哦",
    closingTitle1: "根据你的日期做出的准确判断", closingTitle2: "只有提交请求才能获得",
    closingSub1: "以上路线是没有设定具体日期的示例场景。", closingSub2: "告诉我们你想去的地区和日期，我们会重新精确计算到末班车。",
    stickySaveBtn: "🗺️ 保存地图",
    stickyHook: "你的日期可能不同",
    breakHeading: "⚠ 这个判断会失效的情况",
    breakCond1: "周三第一站休息 — 建议选平日(周三除外)或周末前往",
    stickyBtn: "提交请求 →",
  },
  vi: {
    backLink: "Xem các tour khác", brand: "KSPOT Travelog",
    heroBadge: "📍 Suwon Haenggung-dong · Lịch trình 1 ngày",
    heroTitle1: "Gặp gỡ tại Suwon", heroTitle2: "Lịch trình du hành thời gian của 〈Cõng anh mà chạy〉",
    heroAlt: "Cảnh đêm Janganmun của Thành Suwon Hwaseong",
    introSub: "Lộ trình hành hương đến vùng thánh địa du hành thời gian của Sol♥Sun-jae mà chỉ fan cứng 〈Cõng anh mà chạy〉 mới biết",
    blockquote: "Tọa độ thực tế không có trên Instagram, các món ăn ngon địa phương được đảm bảo — chinh phục hoàn toàn Suwon chỉ với một trang này.",
    frameHeading: "Khứ hồi, trong nháy mắt",
    verdictTitle: {
      go: "Lịch trình hôm nay, được rồi đấy",
      care: "Lịch trình hôm nay, đi nhanh là được",
      reconsider: "Lịch trình hôm nay, cần rút gọn",
      not_now: "Lịch trình hôm nay, chưa khả thi",
      draft: "Đang xác nhận nhận định hôm nay...",
    },
    courseSummary: "5 điểm · lịch trình đi bộ trong ngày",
    evidenceItem1: "✓ 08:40 Xuất phát Ga Seoul → 17:40 Trở về Ga Seoul (Tuyến 1)",
    evidenceItem2: "✓ Còn nhiều thời gian trước chuyến tàu cuối (khoảng 360 phút)",
    evidenceItem3: "✓ Đã xác nhận giờ mở cửa tất cả các điểm (không có vấn đề đóng cửa)",
    departNote: "Ga Seoul khởi hành · Tuyến 1 khoảng 55 phút",
    hubWarning: " [Cần xác nhận trung tâm khởi hành]",
    startTransferNote: "09:40 Đến Ga Suwon → Monde Café, khoảng 20 phút",
    transferNote: "16:47 Cà phê Jeong Jiyoung khởi hành → Ga Suwon, khoảng 20 phút",
    arrivalLabel: "Đến Ga Suwon",
    scrollHint: "↓ Cuộn xuống để xem lịch trình từng địa điểm",
    verdictReasonPre: "Vì vậy bạn còn ", verdictReasonPost: " trước chuyến tàu cuối (khoảng nửa đêm) — có thể yên tâm quay về.",
    timetableStartLabel: "Khởi hành từ Ga Seoul", timetableStartDesc: "Đi Tuyến 1 đến Ga Suwon mất khoảng 55 phút",
    timetableSuwonArriveDesc: "Đến Monde Café khoảng 20 phút",
    timetableEndLabel: "Đến Ga Suwon", timetableEndDesc: "Chuyển tàu tại đây để về Seoul",
    timetableSeoulArriveLabel: "Đến Ga Seoul", timetableSeoulArriveDesc: "Đi Tuyến 1 kết thúc một ngày an toàn",
    ch1: "5 Điểm quay phim ấn tượng nhất", ch2: "Món ngon địa phương", ch3: "Quán cà phê", ch4: "Bảng giờ giấc đi trong ngày trong nháy mắt",
    secretCoord: "Tọa độ bí mật.", moveLabel: "Di chuyển · Đỗ xe.", tipLabel: "Mẹo bí mật từ Biên tập viên",
    recommendedMenu: "Món ăn khuyên dùng.", tipLabel2: "Mẹo.",
    closingEyebrow: "✦ Vẫn chưa kết thúc đâu",
    closingTitle1: "Nhận định chính xác cho ngày đi của bạn", closingTitle2: "chỉ có được khi bạn gửi yêu cầu",
    closingSub1: "Lịch trình trên là kịch bản mẫu không chỉ định ngày.", closingSub2: "Hãy cho chúng tôi biết ngày và khu vực bạn muốn đi, chúng tôi sẽ tính toán chính xác lại đến tận chuyến tàu cuối.",
    stickySaveBtn: "🗺️ Lưu bản đồ",
    stickyHook: "Lịch trình của tôi có thể khác",
    breakHeading: "⚠ Điều kiện nhận định này bị phá vỡ",
    breakCond1: "Thứ Tư điểm đầu tiên đóng cửa — Khuyên bạn nên ghé thăm vào ngày thường (trừ thứ Tư) hoặc cuối tuần",
    stickyBtn: "Yêu cầu →",
  },
};

type SpotItem = {
  no: string; emoji: string; title: string; subtitle: string; scene: string;
  coord: string; move: string; goldenHour: string; caution: string;
  image: string; imgPosition?: string; imgAspect?: string;
};

const SPOTS: Record<Lang, SpotItem[]> = {
  ko: [
    { no: "01", emoji: "🎬", title: "몽테드 카페", subtitle: "솔이네 비디오가게 앞 · 노란 우산씬",
      scene: "선재와 솔이의 노란 우산 장면이 촬영된 그 골목 앞 카페. 오픈 시간에 맞춰 여유 있게 하루를 시작해요.",
      coord: "경기 수원시 팔달구 화서문로48번길 14 1층", move: "몽테드 카페 → 화홍문, 도보 9분",
      goldenHour: "10시 오픈이라 그 전에 도착하면 골목 사진부터 찍고 들어가는 걸 추천해요.",
      caution: "영업시간 10:00–19:00 · 매주 수요일 휴무", image: sunjaeSiljaImg, imgAspect: "3 / 2" },
    { no: "02", emoji: "💌", title: "화홍문", subtitle: "솔이가 선재에게 고백한 곳",
      scene: "수원천 위 돌다리. 19살 솔이가 선재에게 마음을 고백하던 장면이 촬영된 곳이에요.",
      coord: "경기 수원시 팔달구 북수동", move: "화홍문 → 방화수류정, 도보 3분",
      goldenHour: "OST를 들으며 천천히 건너보세요 — 다리를 건너는 뒷모습과 화홍문 누각을 한 앵글에 담기 좋아요.",
      caution: "24시간 개방 · 휴무 없음", image: suwonHongwhamunImg, imgPosition: "top" },
    { no: "03", emoji: "🚲", title: "방화수류정", subtitle: "자전거를 가르쳐주던 그 자리",
      scene: "선재가 솔이에게 자전거 타는 법을 가르쳐주던 곳. 날씨 좋은 날엔 잠깐 앉아 쉬어가기 좋은 뷰예요.",
      coord: "경기 수원시 팔달구 매향동 151", move: "방화수류정 → 행궁동 벽화마을, 도보 3분",
      goldenHour: "정자와 용연 연못이 함께 담기는 각도가 정석이에요.",
      caution: "24시간 개방 · 휴무 없음", image: bangwhasuryujeongPicnicImg },
    { no: "04", emoji: "🧱", title: "행궁동 벽화마을", subtitle: "설레는 벽쿵씬 그 골목",
      scene: "성벽을 따라 걷다 만나는 벽화 골목. 선재와 솔이의 벽쿵씬이 촬영된 자리예요.",
      coord: "경기 수원시 팔달구 화서문로72번길 9-7", move: "행궁동 벽화마을 → 화성행궁, 도보 13분",
      goldenHour: "골목 자체가 24시간 개방이라 시간대 상관없이 들를 수 있어요.",
      caution: "개별 가게는 방문 시 영업 여부 확인 필요", image: haenggungdongMuralImg },
    { no: "05", emoji: "🏯", title: "화성행궁", subtitle: "조선시대로 타임슬립",
      scene: "골목에서 걸어 나와 만나는 궁궐. 정조가 머물던 화성행궁을 천천히 둘러보는 구간이에요.",
      coord: "경기 수원시 팔달구 정조로 825", move: "화성행궁 → 수원왕갈비통닭, 도보 11분",
      goldenHour: "야간개장 기간(5~11월 금~일·공휴일 18:00–21:30, 마감 21:00)엔 야경도 가능해요. 전각이 여러 채라 체류시간을 넉넉히(90분) 잡아두세요.",
      caution: "입장료 2,000원 · 09:00–18:00 (입장마감 1시간 전) · 휴무 없음", image: suwonFortressWallImg },
  ],
  en: [
    { no: "01", emoji: "🎬", title: "Monde Café", subtitle: "In front of Sol's video store · the yellow umbrella scene",
      scene: "The café by the alley where Sun-jae and Sol's yellow umbrella scene was filmed. Start your day at an easy pace, at opening time.",
      coord: "경기 수원시 팔달구 화서문로48번길 14 1층", move: "Monde Café → Hwahongmun, 9 min walk",
      goldenHour: "It opens at 10, so arriving early lets you get alley photos before going in.",
      caution: "Open 10:00–19:00 · Closed Wednesdays", image: sunjaeSiljaImg, imgAspect: "3 / 2" },
    { no: "02", emoji: "💌", title: "Hwahongmun", subtitle: "Where Sol confessed to Sun-jae",
      scene: "The stone bridge over Suwoncheon. Where 19-year-old Sol confessed her feelings to Sun-jae.",
      coord: "경기 수원시 팔달구 북수동", move: "Hwahongmun → Banghwasuryujeong, 3 min walk",
      goldenHour: "Cross slowly while listening to the OST — a great angle catches both your back and the Hwahongmun pavilion.",
      caution: "Open 24 hours · No closed days", image: suwonHongwhamunImg, imgPosition: "top" },
    { no: "03", emoji: "🚲", title: "Banghwasuryujeong", subtitle: "Where he taught her to ride a bike",
      scene: "Where Sun-jae taught Sol how to ride a bicycle. A nice view to sit and rest on a good-weather day.",
      coord: "경기 수원시 팔달구 매향동 151", move: "Banghwasuryujeong → Haenggung-dong Mural Village, 3 min walk",
      goldenHour: "The classic shot frames the pavilion together with Yongyeon Pond.",
      caution: "Open 24 hours · No closed days", image: bangwhasuryujeongPicnicImg },
    { no: "04", emoji: "🧱", title: "Haenggung-dong Mural Village", subtitle: "The alley of the flustering wall-kiss scene",
      scene: "A mural alley along the fortress wall. Where Sun-jae and Sol's wall-kiss scene was filmed.",
      coord: "경기 수원시 팔달구 화서문로72번길 9-7", move: "Haenggung-dong Mural Village → Hwaseong Haenggung Palace, 13 min walk",
      goldenHour: "The alley itself is open 24 hours, so any time of day works.",
      caution: "Check individual shop hours on visit", image: haenggungdongMuralImg },
    { no: "05", emoji: "🏯", title: "Hwaseong Haenggung Palace", subtitle: "Time-slip into the Joseon era",
      scene: "Walk out of the alley into a palace. A relaxed stroll through the palace where King Jeongjo once stayed.",
      coord: "경기 수원시 팔달구 정조로 825", move: "Hwaseong Haenggung Palace → Suwon Wang-galbi Tongdak, 11 min walk",
      goldenHour: "During the night-opening season (May–Nov, Fri–Sun & holidays 18:00–21:30, last entry 21:00) you can see it lit up at night. There are several halls, so budget plenty of time (90 min).",
      caution: "Admission ₩2,000 · 09:00–18:00 (last entry 1 hr before close) · No closed days", image: suwonFortressWallImg },
  ],
  ja: [
    { no: "01", emoji: "🎬", title: "モンテドカフェ", subtitle: "ソルの家のビデオ店前・黄色い傘のシーン",
      scene: "ソンジェとソルの黄色い傘のシーンが撮影された路地前のカフェ。オープン時間に合わせてゆったり一日を始めましょう。",
      coord: "경기 수원시 팔달구 화서문로48번길 14 1층", move: "モンテドカフェ→華虹門、徒歩9分",
      goldenHour: "10時オープンなので、その前に着けば路地の写真を撮ってから入れます。",
      caution: "営業時間10:00–19:00 · 毎週水曜休み", image: sunjaeSiljaImg, imgAspect: "3 / 2" },
    { no: "02", emoji: "💌", title: "華虹門", subtitle: "ソルがソンジェに告白した場所",
      scene: "水原川に架かる石橋。19歳のソルがソンジェに気持ちを告白したシーンが撮影された場所です。",
      coord: "경기 수원시 팔달구 북수동", move: "華虹門→訪花随柳亭、徒歩3分",
      goldenHour: "OSTを聴きながらゆっくり渡ってみて — 橋を渡る後ろ姿と華虹門の楼閣を一つのアングルに収めるのがおすすめです。",
      caution: "24時間開放 · 休みなし", image: suwonHongwhamunImg, imgPosition: "top" },
    { no: "03", emoji: "🚲", title: "訪花随柳亭", subtitle: "自転車を教えてもらったその場所",
      scene: "ソンジェがソルに自転車の乗り方を教えた場所。天気の良い日はちょっと座って休むのにいいビューです。",
      coord: "경기 수원시 팔달구 매향동 151", move: "訪花随柳亭→行宮洞壁画村、徒歩3分",
      goldenHour: "亭と龍淵池が一緒に収まる角度が定番です。",
      caution: "24時間開放 · 休みなし", image: bangwhasuryujeongPicnicImg },
    { no: "04", emoji: "🧱", title: "行宮洞壁画村", subtitle: "ドキドキする壁ドンシーンのあの路地",
      scene: "城壁沿いを歩いて出会う壁画の路地。ソンジェとソルの壁ドンシーンが撮影された場所です。",
      coord: "경기 수원시 팔달구 화서문로72번길 9-7", move: "行宮洞壁画村→華城行宮、徒歩13分",
      goldenHour: "路地自体が24時間開放なので時間帯を気にせず立ち寄れます。",
      caution: "個別の店舗は訪問時に営業確認が必要", image: haenggungdongMuralImg },
    { no: "05", emoji: "🏯", title: "華城行宮", subtitle: "朝鮮時代へタイムスリップ",
      scene: "路地を出て出会う宮殿。正祖が滞在した華城行宮をゆっくり見て回る区間です。",
      coord: "경기 수원시 팔달구 정조로 825", move: "華城行宮→水原ワンガルビトンダク、徒歩11分",
      goldenHour: "夜間開場期間(5〜11月金〜日・祝日18:00–21:30、最終入場21:00)は夜景も見られます。建物が多いので滞在時間を余裕を持って(90分)確保してください。",
      caution: "入場料2,000ウォン · 09:00–18:00(入場締め切り1時間前) · 休みなし", image: suwonFortressWallImg },
  ],
  zh: [
    { no: "01", emoji: "🎬", title: "Monde咖啡", subtitle: "Sol家录像店门前·黄色雨伞那场戏",
      scene: "Sunjae和Sol的黄色雨伞场景取景地附近的咖啡店。配合开店时间，从容开始一天。",
      coord: "경기 수원시 팔달구 화서문로48번길 14 1층", move: "Monde咖啡→花虹门，步行9分钟",
      goldenHour: "10点开门，提前到达可以先拍巷子照片再进店。",
      caution: "营业时间10:00–19:00 · 每周三休息", image: sunjaeSiljaImg, imgAspect: "3 / 2" },
    { no: "02", emoji: "💌", title: "花虹门", subtitle: "Sol向Sunjae表白的地方",
      scene: "水原川上的石桥。19岁的Sol向Sunjae表白心意的场景取景地。",
      coord: "경기 수원시 팔달구 북수동", move: "花虹门→访花随柳亭，步行3分钟",
      goldenHour: "边听OST边慢慢走过桥 — 背影配上花虹门楼阁的角度很出片。",
      caution: "24小时开放 · 无休息日", image: suwonHongwhamunImg, imgPosition: "top" },
    { no: "03", emoji: "🚲", title: "访花随柳亭", subtitle: "教她骑自行车的地方",
      scene: "Sunjae教Sol骑自行车的地方。天气好的时候坐着休息一下也很不错。",
      coord: "경기 수원시 팔달구 매향동 151", move: "访花随柳亭→行宫洞壁画村，步行3分钟",
      goldenHour: "亭子和龙渊池一起入镜的角度是经典构图。",
      caution: "24小时开放 · 无休息日", image: bangwhasuryujeongPicnicImg },
    { no: "04", emoji: "🧱", title: "行宫洞壁画村", subtitle: "心动壁咚场景的那条巷子",
      scene: "沿着城墙走会遇到的壁画小巷。Sunjae和Sol的壁咚场景取景地。",
      coord: "경기 수원시 팔달구 화서문로72번길 9-7", move: "行宫洞壁画村→华城行宫，步行13分钟",
      goldenHour: "巷子本身24小时开放，任何时间都能前往。",
      caution: "个别店铺需现场确认营业情况", image: haenggungdongMuralImg },
    { no: "05", emoji: "🏯", title: "华城行宫", subtitle: "穿越回朝鲜时代",
      scene: "走出巷子就能看到的宫殿。悠闲地逛一逛正祖曾居住过的华城行宫。",
      coord: "경기 수원시 팔달구 정조로 825", move: "华城行宫→水原王排骨炸鸡，步行11分钟",
      goldenHour: "夜间开放期间(5~11月周五至周日及公休日18:00–21:30，最晚入场21:00)还能看夜景。殿阁较多，建议多留点时间(90分钟)。",
      caution: "门票2,000韩元 · 09:00–18:00(截止入场为闭馆前1小时) · 无休息日", image: suwonFortressWallImg },
  ],
  vi: [
    { no: "01", emoji: "🎬", title: "Monde Café", subtitle: "Trước tiệm băng đĩa của Sol · Cảnh ô vàng",
      scene: "Quán cà phê trước con hẻm nơi cảnh che ô màu vàng của Sun-jae và Sol được quay. Hãy bắt đầu một ngày thảnh thơi theo giờ mở cửa của quán.",
      coord: "경기 수원시 팔달구 화서문로48번길 14 1층", move: "Monde Café → Hwahongmun, đi bộ 9 phút",
      goldenHour: "Vì quán mở lúc 10h, nên nếu đến sớm hơn, bạn nên chụp ảnh con hẻm trước rồi mới vào quán.",
      caution: "Giờ mở cửa 10:00–19:00 · Đóng cửa thứ Tư hàng tuần", image: sunjaeSiljaImg, imgAspect: "3 / 2" },
    { no: "02", emoji: "💌", title: "Cổng Hwahongmun", subtitle: "Nơi Sol tỏ tình với Sun-jae",
      scene: "Cây cầu đá bắc qua Suwoncheon. Đây là nơi Sol 19 tuổi tỏ tình với Sun-jae.",
      coord: "경기 수원시 팔달구 북수동", move: "Hwahongmun → Banghwasuryujeong, đi bộ 3 phút",
      goldenHour: "Hãy vừa nghe OST vừa thong thả băng qua cầu — Góc chụp bắt trọn lưng bạn cùng lầu gác Hwahongmun rất đẹp.",
      caution: "Mở cửa 24/24 · Không ngày nghỉ", image: suwonHongwhamunImg, imgPosition: "top" },
    { no: "03", emoji: "🚲", title: "Banghwasuryujeong", subtitle: "Nơi anh ấy dạy cô đi xe đạp",
      scene: "Nơi Sun-jae dạy Sol cách đi xe đạp. Vào ngày đẹp trời, ngồi nghỉ một chút ngắm view rất tuyệt.",
      coord: "경기 수원시 팔달구 매향동 151", move: "Banghwasuryujeong → Làng bích họa Haenggung-dong, đi bộ 3 phút",
      goldenHour: "Góc chụp lấy trọn cả đình và hồ Yongyeon là góc chuẩn nhất.",
      caution: "Mở cửa 24/24 · Không ngày nghỉ", image: bangwhasuryujeongPicnicImg },
    { no: "04", emoji: "🧱", title: "Làng bích họa Haenggung-dong", subtitle: "Con hẻm nhỏ với cảnh ép tường lãng mạn",
      scene: "Con hẻm bích họa chạy dọc theo thành lũy. Đây là nơi quay cảnh ép tường của Sun-jae và Sol.",
      coord: "경기 수원시 팔달구 화서문로72번길 9-7", move: "Làng bích họa Haenggung-dong → Cung điện Hwaseong Haenggung, đi bộ 13 phút",
      goldenHour: "Con hẻm mở cửa 24/24 nên bạn có thể ghé thăm bất cứ lúc nào.",
      caution: "Cần xác nhận giờ mở cửa của từng cửa hàng riêng lẻ khi ghé thăm", image: haenggungdongMuralImg },
    { no: "05", emoji: "🏯", title: "Cung điện Hwaseong Haenggung", subtitle: "Du hành thời gian về thời Joseon",
      scene: "Cung điện mở ra ngay khi bạn bước khỏi hẻm. Thong thả đi dạo qua cung điện nơi Vua Jeongjo từng nghỉ lại.",
      coord: "경기 수원시 팔달구 정조로 825", move: "Hwaseong Haenggung → Gà rán Wanggalbi Suwon, đi bộ 11 phút",
      goldenHour: "Vào đợt mở cửa ban đêm (Tháng 5~11, Thứ Sáu~Chủ Nhật và ngày lễ 18:00–21:30, lượt vào cuối 21:00) bạn có thể ngắm cảnh đêm rất đẹp. Có nhiều điện thờ nên hãy chừa thời gian tham quan rộng rãi (90 phút).",
      caution: "Vé vào cửa 2,000 KRW · 09:00–18:00 (Ngừng đón khách 1 tiếng trước khi đóng cửa) · Không ngày nghỉ", image: suwonFortressWallImg },
  ],
};

type EatItem = {
  section: "food" | "cafe"; emoji: string; category: string; title: string;
  coord: string; menu: string; tip: string; view: string; image: string;
};

const EATS: Record<Lang, EatItem[]> = {
  ko: [
    { section: "food", emoji: "🍗", category: "점심 · 통닭", title: "수원 왕갈비 통닭",
      coord: "경기 수원시 팔달구 정조로800번길 12", menu: "왕갈비 통닭 (워크인만 가능)",
      tip: "라스트오더 21:00. 웨이팅 있는 편이니 여유 있게 방문하세요.",
      view: "화성행궁에서 도보 11분 — 관람 끝나고 걸어갈 수 있는 로컬 맛집이에요.", image: nammanTongdakImg },
    { section: "cafe", emoji: "☕", category: "루프탑 카페 · 마무리", title: "정지영 커피 로스터즈",
      coord: "경기 수원시 팔달구 신풍로 42 (행궁본점)", menu: "시그니처 라떼 + 성곽 뷰 루프탑 좌석",
      tip: "루프탑 좌석은 선착순이라 도착하자마자 자리부터 잡는 걸 추천해요.",
      view: "행리단길 소품샵·골목을 구경하며 걸어오면 자연스럽게 도착하는 코스 마지막 스팟이에요.", image: jeongjiyoungStoreImg },
  ],
  en: [
    { section: "food", emoji: "🍗", category: "Lunch · Fried chicken", title: "Suwon Wang-galbi Tongdak",
      coord: "경기 수원시 팔달구 정조로800번길 12", menu: "Wang-galbi fried chicken (walk-ins only)",
      tip: "Last order 21:00. Expect some wait, so visit with time to spare.",
      view: "11-min walk from Hwaseong Haenggung Palace — a local favorite right after your visit.", image: nammanTongdakImg },
    { section: "cafe", emoji: "☕", category: "Rooftop café · finale", title: "Jeong Jiyoung Coffee Roasters",
      coord: "경기 수원시 팔달구 신풍로 42 (행궁본점)", menu: "Signature latte + rooftop seat with a fortress view",
      tip: "Rooftop seats go first-come, first-served — grab one as soon as you arrive.",
      view: "Wander through Haengridan-gil's shops and alleys on the way, and you'll naturally arrive at the final stop of the day.", image: jeongjiyoungStoreImg },
  ],
  ja: [
    { section: "food", emoji: "🍗", category: "ランチ・フライドチキン", title: "水原ワンガルビトンダク",
      coord: "경기 수원시 팔달구 정조로800번길 12", menu: "ワンガルビトンダク(ウォークインのみ)",
      tip: "ラストオーダー21:00。待ち時間があるので余裕を持って訪問してください。",
      view: "華城行宮から徒歩11分 — 観覧後にそのまま歩いて行けるローカルグルメです。", image: nammanTongdakImg },
    { section: "cafe", emoji: "☕", category: "ルーフトップカフェ・締め", title: "ジョンジヨンコーヒーロースターズ",
      coord: "경기 수원시 팔달구 신풍로 42 (행궁본점)", menu: "シグネチャーラテ+城郭ビューのルーフトップ席",
      tip: "ルーフトップ席は早い者勝ちなので、着いたらすぐ席を確保するのがおすすめです。",
      view: "行理団街の雑貨店・路地を眺めながら歩いてくると自然に到着する、一日の最後のスポットです。", image: jeongjiyoungStoreImg },
  ],
  zh: [
    { section: "food", emoji: "🍗", category: "午餐·炸鸡", title: "水原王排骨炸鸡",
      coord: "경기 수원시 팔달구 정조로800번길 12", menu: "王排骨炸鸡(仅接受现场排队)",
      tip: "最后点餐时间21:00。等位情况较多，建议留出充足时间前往。",
      view: "从华城行宫步行11分钟 — 逛完景点后可以直接走过去的本地美食。", image: nammanTongdakImg },
    { section: "cafe", emoji: "☕", category: "屋顶咖啡厅·收尾", title: "Jeong Jiyoung咖啡烘焙坊",
      coord: "경기 수원시 팔달구 신풍로 42 (행궁본점)", menu: "招牌拿铁+可看城墙景观的屋顶座位",
      tip: "屋顶座位先到先得，建议到达后立刻去占座。",
      view: "沿途逛逛行理团街的小店和巷子，自然就会走到这一天的最后一站。", image: jeongjiyoungStoreImg },
  ],
  vi: [
    { section: "food", emoji: "🍗", category: "Bữa trưa · Gà rán", title: "Gà rán Wanggalbi Suwon",
      coord: "경기 수원시 팔달구 정조로800번길 12", menu: "Gà rán Wanggalbi (chỉ đón khách vãng lai)",
      tip: "Nhận order cuối cùng lúc 21:00. Thường phải chờ, nên hãy ghé với thời gian dư dả.",
      view: "Đi bộ 11 phút từ Hwaseong Haenggung — quán địa phương được yêu thích ngay sau khi tham quan.", image: nammanTongdakImg },
    { section: "cafe", emoji: "☕", category: "Café sân thượng · Kết thúc", title: "Jeong Jiyoung Coffee Roasters",
      coord: "경기 수원시 팔달구 신풍로 42 (행궁본점)", menu: "Latte đặc trưng + chỗ ngồi sân thượng view thành quách",
      tip: "Chỗ ngồi sân thượng theo thứ tự đến trước — hãy giữ chỗ ngay khi vừa tới.",
      view: "Dạo qua các cửa hàng, con hẻm ở Haengridan-gil trên đường đi, bạn sẽ tự nhiên đến điểm dừng cuối cùng trong ngày.", image: jeongjiyoungStoreImg },
  ],
};

type TimetableItem = { time: string; emoji: string; label: string; desc: string; pin?: "hub" };

const TIMETABLE: Record<Lang, TimetableItem[]> = {
  ko: [
    { time: "10:00", emoji: "☕", label: "몽테드 카페", desc: "노란 우산씬 그 골목 앞에서 하루 시작" },
    { time: "10:39", emoji: "💌", label: "화홍문", desc: "고백씬 돌다리, OST 들으며 건너기" },
    { time: "11:12", emoji: "🚲", label: "방화수류정", desc: "자전거 가르쳐주던 그 자리에서 잠깐 휴식" },
    { time: "11:45", emoji: "🧱", label: "행궁동 벽화마을", desc: "벽쿵씬 골목 구경" },
    { time: "12:28", emoji: "🏯", label: "화성행궁", desc: "조선시대로 타임슬립 (입장료 2,000원)" },
    { time: "13:39", emoji: "🍗", label: "왕갈비 통닭", desc: "든든한 점심" },
    { time: "14:44", emoji: "🛍️", label: "행리단길", desc: "소품샵 골목 구경하며 이동" },
    { time: "15:47", emoji: "🌇", label: "정지영 커피", desc: "성곽 뷰 루프탑에서 마무리 티타임" },
  ],
  en: [
    { time: "10:00", emoji: "☕", label: "Monde Café", desc: "Start the day at the yellow umbrella alley" },
    { time: "10:39", emoji: "💌", label: "Hwahongmun", desc: "The confession bridge, crossed while listening to the OST" },
    { time: "11:12", emoji: "🚲", label: "Banghwasuryujeong", desc: "A quick rest where he taught her to bike" },
    { time: "11:45", emoji: "🧱", label: "Haenggung-dong Mural Village", desc: "Explore the wall-kiss alley" },
    { time: "12:28", emoji: "🏯", label: "Hwaseong Haenggung Palace", desc: "Time-slip into the Joseon era (₩2,000 admission)" },
    { time: "13:39", emoji: "🍗", label: "Wang-galbi Tongdak", desc: "A hearty lunch" },
    { time: "14:44", emoji: "🛍️", label: "Haengridan-gil", desc: "Browse shops on the way" },
    { time: "15:47", emoji: "🌇", label: "Jeong Jiyoung Coffee", desc: "Finish with rooftop tea and fortress views" },
  ],
  ja: [
    { time: "10:00", emoji: "☕", label: "モンテドカフェ", desc: "黄色い傘の路地前で一日をスタート" },
    { time: "10:39", emoji: "💌", label: "華虹門", desc: "告白シーンの石橋、OSTを聴きながら渡る" },
    { time: "11:12", emoji: "🚲", label: "訪花随柳亭", desc: "自転車を教えてもらった場所でひと休み" },
    { time: "11:45", emoji: "🧱", label: "行宮洞壁画村", desc: "壁ドンシーンの路地を散策" },
    { time: "12:28", emoji: "🏯", label: "華城行宮", desc: "朝鮮時代へタイムスリップ(入場料2,000ウォン)" },
    { time: "13:39", emoji: "🍗", label: "ワンガルビトンダク", desc: "しっかりランチ" },
    { time: "14:44", emoji: "🛍️", label: "行理団街", desc: "雑貨店の路地を眺めながら移動" },
    { time: "15:47", emoji: "🌇", label: "ジョンジヨンコーヒー", desc: "城郭ビューのルーフトップで締めのお茶時間" },
  ],
  zh: [
    { time: "10:00", emoji: "☕", label: "Monde咖啡", desc: "在黄色雨伞的巷子前开启一天" },
    { time: "10:39", emoji: "💌", label: "花虹门", desc: "边听OST边走过表白场景的石桥" },
    { time: "11:12", emoji: "🚲", label: "访花随柳亭", desc: "在教骑车的地方稍作休息" },
    { time: "11:45", emoji: "🧱", label: "行宫洞壁画村", desc: "逛壁咚场景的小巷" },
    { time: "12:28", emoji: "🏯", label: "华城行宫", desc: "穿越回朝鲜时代(门票2,000韩元)" },
    { time: "13:39", emoji: "🍗", label: "王排骨炸鸡", desc: "吃一顿丰盛的午餐" },
    { time: "14:44", emoji: "🛍️", label: "行理团街", desc: "边逛小店边移动" },
    { time: "15:47", emoji: "🌇", label: "Jeong Jiyoung咖啡", desc: "在城墙景观屋顶座位享用收尾茶点" },
  ],
  vi: [
    { time: "10:00", emoji: "☕", label: "Monde Café", desc: "Bắt đầu ngày mới tại con hẻm nhỏ của cảnh ô vàng" },
    { time: "10:39", emoji: "💌", label: "Cổng Hwahongmun", desc: "Vừa nghe OST vừa bước qua cầu đá tỏ tình" },
    { time: "11:12", emoji: "🚲", label: "Banghwasuryujeong", desc: "Nghỉ ngơi một lát tại nơi anh ấy dạy xe đạp" },
    { time: "11:45", emoji: "🧱", label: "Làng bích họa Haenggung-dong", desc: "Dạo quanh con hẻm của cảnh ép tường" },
    { time: "12:28", emoji: "🏯", label: "Hwaseong Haenggung", desc: "Du hành thời gian về thời Joseon (Vé vào cửa 2,000 KRW)" },
    { time: "13:39", emoji: "🍗", label: "Gà rán Wanggalbi Suwon", desc: "Ăn trưa thật no nê" },
    { time: "14:44", emoji: "🛍️", label: "Đường Haengridan-gil", desc: "Di chuyển và ngắm các cửa hàng lưu niệm" },
    { time: "15:47", emoji: "🌇", label: "Jeong Jiyoung Coffee", desc: "Thời gian thưởng trà cuối ngày tại sân thượng view thành quách" },
  ],
};

export default function SuwonTour() {
  const [lang, setLang] = useState<Lang>("ko");
  const [formModalOpen, setFormModalOpen] = useState(false);
  const t = UI[lang];
  const spots = SPOTS[lang];
  const eats = EATS[lang];
  const timetable = TIMETABLE[lang];
  const fullTimetable: TimetableItem[] = [
    { time: ROUND_TRIP.departTime, emoji: "🚆", label: t.timetableStartLabel, desc: t.timetableStartDesc, pin: "hub" },
    { time: ROUND_TRIP.suwonArriveTime, emoji: "🚉", label: t.arrivalLabel, desc: t.timetableSuwonArriveDesc },
    ...timetable,
    { time: ROUND_TRIP.estimatedStationArrival, emoji: "🚉", label: t.timetableEndLabel, desc: t.timetableEndDesc },
    { time: ROUND_TRIP.homeArriveTime, emoji: "🏠", label: t.timetableSeoulArriveLabel, desc: t.timetableSeoulArriveDesc, pin: "hub" },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: PAPER, color: INK, fontFamily: "'Noto Sans KR', sans-serif" }}
    >
      {/* NAV */}
      <nav className="sticky top-0 z-40 backdrop-blur-md border-b" style={{ backgroundColor: `${PAPER}CC`, borderColor: HAIRLINE }}>
        <div className="max-w-2xl mx-auto px-3 sm:px-5 py-3 sm:py-4 flex items-center justify-between gap-2">
          <Link
            to="/tour"
            className="flex items-center gap-0.5 text-[11px] sm:text-xs font-bold tracking-wide hover:opacity-70 transition-opacity whitespace-nowrap shrink-0"
            style={{ color: INK }}
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">{t.backLink}</span>
          </Link>
          <span
            className="text-xs sm:text-sm font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase whitespace-nowrap overflow-hidden text-ellipsis"
            style={{ color: PINE, fontFamily: "'Noto Serif KR', serif" }}
          >
            KSPOT<span className="hidden sm:inline"> Travelog</span>
          </span>
          <div className="flex gap-0.5 sm:gap-1 rounded-full p-0.5 shrink-0" style={{ backgroundColor: PAPER_DEEP }}>
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-1 rounded-full font-bold transition-colors whitespace-nowrap"
                style={
                  lang === l.code
                    ? { backgroundColor: STAMP, color: "#fff" }
                    : { backgroundColor: "transparent", color: INK, opacity: 0.6 }
                }
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative">
        <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden">
          <img src={janganmunNightImg} alt={t.heroAlt} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,51,43,0.75), rgba(20,51,43,0.05) 55%)" }} />
          <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 pb-8 sm:pb-10">
            <div className="max-w-2xl mx-auto">
              <span
                className="inline-block text-[11px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full mb-4"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)" }}
              >
                {t.heroBadge}
              </span>
              <h1
                className="text-[28px] sm:text-[38px] leading-[1.25] font-black text-white"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                {t.heroTitle1}<br />{t.heroTitle2}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* INTRO — 감성 후킹을 히어로 바로 아래로, 판단 근거는 그 다음에 */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14">
        <p className="text-sm sm:text-base font-bold mb-8" style={{ color: STAMP }}>
          {t.introSub}
        </p>

        <blockquote
          className="relative pl-6 sm:pl-8 py-1 mb-10"
          style={{ borderLeft: `3px solid ${STAMP}` }}
        >
          <span
            className="absolute -left-1 -top-4 text-6xl select-none"
            style={{ color: STAMP, opacity: 0.25, fontFamily: "'Noto Serif KR', serif" }}
            aria-hidden
          >
            "
          </span>
          <p
            className="text-[15px] sm:text-lg leading-relaxed"
            style={{ fontFamily: "'Noto Serif KR', serif", color: PINE }}
          >
            {t.blockquote}
          </p>
        </blockquote>
      </section>

      {/* EVIDENCE — 무사귀환 판단 (2-5) */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8">
        {/* 왕복 판단 프레임 */}
        <div
          className="rounded-md overflow-hidden mb-10"
          style={{ border: `1px solid ${HAIRLINE}` }}
        >
          <div
            className="px-4 py-3"
            style={{ backgroundColor: PAPER_DEEP }}
          >
            <div className="text-sm font-black flex items-center gap-2" style={{ color: PINE }}>
              {t.verdictTitle[verdict]}
            </div>
            <p className="text-[11px] font-semibold mt-1" style={{ color: PINE, opacity: 0.65 }}>
              {t.courseSummary}
            </p>
          </div>
          {/* 판정 결과 — GO '도장'이 아니라 판단 입력값을 같이 노출하는 근거 카드 (2-2) */}
          <div className="px-4 py-2.5 text-white" style={{ backgroundColor: VERDICT_COLOR[verdict] }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-black">{VERDICT_LABEL[verdict]}</span>
              <span className="text-[11px] font-semibold opacity-90">{VERDICT_SUB[lang][verdict]}</span>
            </div>
            <div
              className="text-[11px] font-semibold opacity-95 mt-1.5 pt-1.5 leading-relaxed"
              style={{ borderTop: "1px solid rgba(255,255,255,0.3)" }}
            >
              {t.verdictReasonPre}
              {ROUND_TRIP.bufferMinutes !== null ? formatBufferApprox(ROUND_TRIP.bufferMinutes, lang) : ""}
              {t.verdictReasonPost}
            </div>
            <p className="text-[11px] text-white/90 mt-1.5">{t.evidenceItem1}</p>
            <p className="text-[11px] text-white/90 mt-1">{t.evidenceItem2}</p>
            <p className="text-[11px] text-white/90 mt-1">{t.evidenceItem3}</p>
          </div>

          {/* 이 판단이 깨지는 조건 (2-1) — 코스템플릿 v4 확정 문구. 화성행궁 입장마감은 팀이 "이 코스는 문제없음"으로 확인해 제외 */}
          <div
            className="px-4 py-3 text-[12px] leading-relaxed"
            style={{ backgroundColor: PAPER_DEEP, borderTop: `1px solid ${HAIRLINE}` }}
          >
            <p className="font-black" style={{ color: CARE_AMBER }}>{t.breakHeading}</p>
            <p style={{ color: INK, opacity: 0.85 }}>· {t.breakCond1}</p>
          </div>
        </div>
      </section>

      {/* SPOTS */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: STAMP }}>Chapter 1</span>
          <div className="flex-1 h-px" style={{ backgroundColor: HAIRLINE }} />
          <span className="text-[11px] font-bold" style={{ color: INK, opacity: 0.5 }}>{t.ch1}</span>
        </div>

        <div className="space-y-16 sm:space-y-20">
          {spots.map((s) => (
            <article key={s.no}>
              <div className="relative mb-5">
                <div
                  className="relative overflow-hidden rounded-sm rotate-[-0.6deg]"
                  style={{ aspectRatio: s.imgAspect ?? "4 / 3", boxShadow: "0 10px 30px rgba(20,51,43,0.18)", border: `6px solid #fff` }}
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: s.imgPosition ?? "center" }}
                  />
                </div>
                <div
                  className="absolute -top-4 -left-3 sm:-left-5 w-16 h-16 rounded-full flex flex-col items-center justify-center rotate-[-8deg]"
                  style={{ backgroundColor: STAMP, color: "#fff", boxShadow: "0 6px 14px rgba(168,68,46,0.4)" }}
                >
                  <span className="text-[9px] font-bold tracking-widest uppercase leading-none">SPOT</span>
                  <span className="text-xl font-black leading-none mt-0.5" style={{ fontFamily: "'Noto Serif KR', serif" }}>{s.no}</span>
                </div>
              </div>

              <h3
                className="text-xl sm:text-2xl font-black mb-1 flex items-center gap-2"
                style={{ color: PINE, fontFamily: "'Noto Serif KR', serif" }}
              >
                <span>{s.emoji}</span> {s.title}
              </h3>
              <p className="text-xs font-bold mb-4" style={{ color: INK, opacity: 0.55 }}>{s.subtitle}</p>

              <p
                className="text-[15px] leading-relaxed mb-5 italic"
                style={{ fontFamily: "'Noto Serif KR', serif", color: INK }}
              >
                "{s.scene}"
              </p>

              <div className="space-y-3 text-[13px] leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 shrink-0" style={{ color: STAMP }} />
                  <span><b className="font-bold">{t.secretCoord}</b> {s.coord}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Car size={15} className="mt-0.5 shrink-0" style={{ color: STAMP }} />
                  <span><b className="font-bold">{t.moveLabel}</b> {s.move}</span>
                </div>
                <div
                  className="flex items-start gap-2.5 p-4 rounded-md mt-4"
                  style={{ backgroundColor: PAPER_DEEP }}
                >
                  <Sparkles size={15} className="mt-0.5 shrink-0" style={{ color: TEAL }} />
                  <div>
                    <p className="font-bold mb-1" style={{ color: PINE }}>{t.tipLabel}</p>
                    <p className="mb-1.5">{s.goldenHour}</p>
                    <p style={{ opacity: 0.75 }}>⚠️ {s.caution}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 현지인 찐맛집 */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8 mt-20 sm:mt-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: STAMP }}>Chapter 2</span>
          <div className="flex-1 h-px" style={{ backgroundColor: HAIRLINE }} />
          <span className="text-[11px] font-bold" style={{ color: INK, opacity: 0.5 }}>{t.ch2}</span>
        </div>

        {eats.filter((e) => e.section === "food").map((e, idx) => (
          <div key={idx}>
            <div
              className="relative aspect-[16/9] overflow-hidden rounded-sm mb-4"
              style={{ boxShadow: "0 8px 20px rgba(20,51,43,0.15)", border: "6px solid #fff" }}
            >
              <img src={e.image} alt={e.title} className="w-full h-full object-cover" />
            </div>
            <p className="text-[10px] font-black tracking-[0.15em] uppercase mb-1.5" style={{ color: STAMP }}>{e.category}</p>
            <h4 className="text-lg font-black mb-2" style={{ color: PINE, fontFamily: "'Noto Serif KR', serif" }}>
              {e.emoji} {e.title}
            </h4>
            <div className="space-y-2 text-[13px] leading-relaxed">
              <p><b className="font-bold">📍</b> {e.coord}</p>
              <p><b className="font-bold">{t.recommendedMenu}</b> {e.menu}</p>
              <p style={{ opacity: 0.8 }}><b className="font-bold" style={{ opacity: 1 }}>{t.tipLabel2}</b> {e.tip}</p>
              <p style={{ opacity: 0.8 }}>{e.view}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 카페 */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8 mt-20 sm:mt-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: STAMP }}>Chapter 3</span>
          <div className="flex-1 h-px" style={{ backgroundColor: HAIRLINE }} />
          <span className="text-[11px] font-bold" style={{ color: INK, opacity: 0.5 }}>{t.ch3}</span>
        </div>

        {eats.filter((e) => e.section === "cafe").map((e, idx) => (
          <div key={idx}>
            <div
              className="relative aspect-[16/9] overflow-hidden rounded-sm mb-4"
              style={{ boxShadow: "0 8px 20px rgba(20,51,43,0.15)", border: "6px solid #fff" }}
            >
              <img src={e.image} alt={e.title} className="w-full h-full object-cover" />
            </div>
            <p className="text-[10px] font-black tracking-[0.15em] uppercase mb-1.5" style={{ color: STAMP }}>{e.category}</p>
            <h4 className="text-lg font-black mb-2" style={{ color: PINE, fontFamily: "'Noto Serif KR', serif" }}>
              {e.emoji} {e.title}
            </h4>
            <div className="space-y-2 text-[13px] leading-relaxed">
              <p><b className="font-bold">📍</b> {e.coord}</p>
              <p><b className="font-bold">{t.recommendedMenu}</b> {e.menu}</p>
              <p style={{ opacity: 0.8 }}><b className="font-bold" style={{ opacity: 1 }}>{t.tipLabel2}</b> {e.tip}</p>
              <p style={{ opacity: 0.8 }}>{e.view}</p>
            </div>
          </div>
        ))}
      </section>

      {/* TIMETABLE */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8 mt-20 sm:mt-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: STAMP }}>Chapter 4</span>
          <div className="flex-1 h-px" style={{ backgroundColor: HAIRLINE }} />
          <span className="text-[11px] font-bold" style={{ color: INK, opacity: 0.5 }}>{t.ch4}</span>
        </div>

        <div className="relative pl-7">
          <div className="absolute top-1 bottom-1 left-[7px] w-px" style={{ backgroundColor: HAIRLINE }} />
          <div className="space-y-7">
            {fullTimetable.map((tt, idx) => (
              <div key={idx} className="relative">
                {tt.pin === "hub" ? (
                  <div
                    className="absolute -left-[29px] top-[1px] w-4 h-4 border-2 rotate-45"
                    style={{ backgroundColor: STAMP, borderColor: PAPER, boxShadow: `0 0 0 1.5px ${STAMP}` }}
                  />
                ) : (
                  <div
                    className="absolute -left-7 top-0.5 w-3.5 h-3.5 rounded-full border-2"
                    style={{ backgroundColor: PAPER, borderColor: STAMP }}
                  />
                )}
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-black tabular-nums" style={{ color: STAMP, fontFamily: "'Noto Serif KR', serif" }}>{tt.time}</span>
                  <span className="text-base font-bold" style={{ color: PINE }}>{tt.emoji} {tt.label}</span>
                </div>
                <p className="text-[13px] mt-1" style={{ opacity: 0.75 }}>{tt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="max-w-xl mx-auto px-5 sm:px-8 mt-28 sm:mt-36 pb-40 sm:pb-44 text-center">
        <div className="w-10 h-px mx-auto mb-7" style={{ backgroundColor: STAMP }} />
        <p className="text-[11px] font-black tracking-[0.2em] uppercase mb-6" style={{ color: STAMP }}>
          {t.closingEyebrow}
        </p>
        <h3
          className="text-2xl sm:text-3xl font-black mb-6 leading-snug"
          style={{ color: PINE, fontFamily: "'Noto Serif KR', serif" }}
        >
          {t.closingTitle1}<br className="hidden sm:block" /> {t.closingTitle2}
        </h3>
        <p className="text-sm sm:text-[15px] leading-relaxed" style={{ color: INK, opacity: 0.65 }}>
          {t.closingSub1}<br className="hidden sm:block" /> {t.closingSub2}
        </p>
      </section>

      {/* BOTTOM FIXED CTA BAR — 좌측 판단요약 + 우측 요청하기(메인)/구글맵저장(보조) (2-7) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-4 sm:px-5 py-3 shadow-2xl"
        style={{ backgroundColor: "#fff", borderTop: `1px solid ${HAIRLINE}` }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          <div className="text-[11px] sm:text-xs leading-tight min-w-0">
            <span className="font-black" style={{ color: VERDICT_COLOR[verdict] }}>{VERDICT_LABEL[verdict]}</span>
            <span className="font-semibold ml-1" style={{ color: STAMP, opacity: 0.9 }}>
              · {t.stickyHook}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={GOOGLE_MY_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3 sm:px-3.5 rounded-xl font-bold text-[11px] sm:text-xs border text-center whitespace-nowrap transition-colors"
              style={{ borderColor: HAIRLINE, color: PINE, backgroundColor: "#fff" }}
            >
              {t.stickySaveBtn}
            </a>
            <button
              type="button"
              onClick={() => setFormModalOpen(true)}
              className="py-3 px-4 sm:px-5 rounded-xl font-bold text-[11px] sm:text-sm shadow-md transition-opacity hover:opacity-90 text-center whitespace-nowrap"
              style={{ backgroundColor: STAMP, color: "#fff" }}
            >
              {t.stickyBtn}
            </button>
          </div>
        </div>
      </div>

      <LangFormModal open={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </div>
  );
}
