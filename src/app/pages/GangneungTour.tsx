import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { ChevronLeft, MapPin, Sparkles } from "lucide-react";
import { FormLang, isFormLang, getStoredLang, setStoredLang } from "@/app/surveyConfig";
import LangFormModal from "@/app/components/LangFormModal";
import BrandLogo from "@/app/components/BrandLogo";
import { trackEvent } from "@/app/analytics";

import gangneungHeroImg from "@/assets/gangneung/경포해수욕장.jpg";
import spotBtsImg from "@/assets/gangneung/spot_bts.jpg";
import spotBtsPip from "@/assets/gangneung/spot_bts_pip.png";
import spotDokkaebIImg from "@/assets/gangneung/spot_dokkaebi.png";
import spotDokkaebIPip from "@/assets/gangneung/spot_dokkaebi_pip.jpeg";
import spotThegloryImg from "@/assets/gangneung/spot_theglory.jpg";
import spotThegloryPip from "@/assets/gangneung/spot_theglory_pip.jpeg";
import spotGangmunImg from "@/assets/gangneung/spot_gangmun.png";
import spotGangmunPip from "@/assets/gangneung/spot_gangmun_pip.png";
import eatBaengnyeonImg from "@/assets/gangneung/eat_baengnyeon_pip.png";
import eatMarketImg from "@/assets/gangneung/eat_market_pip.png";
import cafeBossanovaImg from "@/assets/gangneung/cafe_bossanova_pip.webp";

// ─────────────────────────────────────────────
// 디자인 토큰 — "KSPOT Travelog" 서브 브랜드 팔레트 (SuwonTour.tsx와 동일 체계)
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

const CARE_AMBER = "#B45309";
const CARE_BG = "#B8893A";

type Lang = FormLang;

// 언어 우선순위: query lang → localStorage kspot_lang → en
function resolveInitialLang(searchParams: URLSearchParams): Lang {
  const queryLang = searchParams.get("lang");
  if (isFormLang(queryLang)) {
    setStoredLang(queryLang);
    return queryLang;
  }
  return getStoredLang() ?? "en";
}

const LANGS: { code: Lang; label: string }[] = [
  { code: "ko", label: "한" },
  { code: "en", label: "EN" },
  { code: "ja", label: "日" },
  { code: "zh", label: "中" },
  { code: "vi", label: "VI" },
];

// 왕복 판단 — 팀 현장 실측 완료 동선 (2026-07-29 기준)
// KTX-이음 807(서울역 08:57 → 강릉역 10:58) / 824(강릉역 20:30 → 서울역 22:32)
// 강릉역 최종 도착 약 19:16 → KTX 탑승(20:30)까지 여유 약 74분 → GO WITH CARE 판정.
const HUB_STATION_CODE: Record<Lang, string> = {
  ko: "서울역",
  en: "Seoul Station",
  ja: "ソウル駅",
  zh: "首尔站",
  vi: "Ga Seoul",
};
const GOOGLE_MY_MAPS_URL = "https://www.google.com/maps/d/viewer?mid=1hMjMYg8PWnbvlsGb_8YxHyR476N3Ysk";

// ─────────────────────────────────────────────
// 카피 — 언어별 (⚠️ AI 초벌 번역. 배포 전 원어민(중국어·일본어·베트남어) 검수 필수)
// ─────────────────────────────────────────────
const UI: Record<Lang, {
  backLink: string;
  heroBadge: string; heroTitle1: string; heroTitle2: string;
  introSub: string; blockquote: string;
  verdictHeading: string; verdictCourseMeta: string;
  verdictBarRight: string; verdictDesc: string;
  evidenceItem1: string; evidenceItem2: string; evidenceItem3: string;
  breakHeading: string; breakCond1: string;
  disclaimer: string;
  ch1: string; ch2: string; ch3: string; ch4: string;
  timetableNote: string;
  secretCoord: string; tipLabel: string; tipLabel2: string;
  closingEyebrow: string; closingTitle: string; closingSub: string;
  stickyHook: string; mapSaveBtn: string; requestBtn: string;
}> = {
  ko: {
    backLink: "다른 투어 보기",
    heroBadge: "📍 강릉 · 주문진 · 당일치기 코스",
    heroTitle1: "도깨비부터 BTS까지,",
    heroTitle2: "동해안을 따라 강릉 성지 완전 정복",
    introSub: "동해안에서 만나는 도깨비·더 글로리·BTS 성지 루트",
    blockquote: "버스만으로 성지 4곳, 낭비 없는 동선 — 이 페이지 하나로 강릉 완전 정복.",
    verdictHeading: "⚠️ GO WITH CARE — 강릉 당일치기 판정",
    verdictCourseMeta: "4개 성지 스팟 · 서울역 출발 당일치기",
    verdictBarRight: "KTX 탑승까지 여유 74분 · 버스 환승 주의",
    verdictDesc: "KTX 824편(20:30)까지 여유 약 74분. 버스가 조금 늦어도 막차 826편(21:33)으로 귀환 가능해요.",
    evidenceItem1: "✓ 서울역 08:57 출발 → 강릉역 20:30 출발 → 서울역 22:32 도착 (KTX-이음 실제 시간표)",
    evidenceItem2: "✓ 전 구간 버스+도보 동선 팀 사전 검증 완료 (도깨비→더글로리→BTS→강문해변→보사노바→중앙시장→강릉역)",
    evidenceItem3: "✓ 식당·카페 운영시간 확정 (백년횟집 · 보사노바 커피로스터스 · 강릉중앙시장)",
    breakHeading: "⚠ 이 판단이 깨지는 조건",
    breakCond1: "· 시티1 버스가 40분 이상 지연될 경우 — KTX 824편(20:30) 탑승이 어려울 수 있어요",
    disclaimer: "위 코스는 날짜를 정하지 않은 예시 시나리오예요. 가고 싶은 날짜를 알려주시면, 그날 날씨·운행·혼잡도까지 계산해 새로 판정해드려요.",
    ch1: "드라마·K팝 성지",
    ch2: "현지인 찐맛집",
    ch3: "카페",
    ch4: "한눈에 보는 당일치기 타임테이블",
    timetableNote: "※ KTX 및 현지 대중교통 전 구간은 팀이 버스 시간표·지도를 기반으로 사전 검증한 참고값입니다. 시티1(도깨비→더글로리·BTS→강문해변→보사노바)은 약 40분 배차이므로 현장 시간표 확인 필수. 식당: 백년횟집(주문진항, 11:00~21:20, 정기휴무 없음) · 보사노바(안목해변, 07:00~22:00).",
    secretCoord: "시크릿 좌표.",
    tipLabel: "에디터 시크릿 꿀팁",
    tipLabel2: "꿀팁.",
    closingEyebrow: "✦ 여기 없는 지역도 궁금하신가요",
    closingTitle: "원하는 지역도 이 코스처럼\n막차까지 계산해서 만들어 드려요",
    closingSub: "가고 싶은 지역이 궁금하면 알려주세요.\n신청 많은 곳부터 순서대로 다음 이야기를 만들어요.",
    stickyHook: "여기 없는 지역도 이 코스처럼 만들어 드려요",
    mapSaveBtn: "🗺️ 지도 저장",
    requestBtn: "요청하기 →",
  },
  en: {
    backLink: "See other tours",
    heroBadge: "📍 Gangneung · Jumunjin · Day Trip",
    heroTitle1: "From Goblin to BTS —",
    heroTitle2: "the complete Gangneung pilgrimage along the East Sea",
    introSub: "Goblin · The Glory · BTS pilgrimage route along the East Sea coast",
    blockquote: "Four pilgrimage spots, bus only, zero wasted steps — conquer Gangneung completely with this one page.",
    verdictHeading: "⚠️ GO WITH CARE — Gangneung Day Trip Verdict",
    verdictCourseMeta: "4 pilgrimage spots · Day trip from Seoul Station",
    verdictBarRight: "74 min to KTX · Watch bus connections",
    verdictDesc: "About 74 min before KTX 824 (20:30). Even if buses run late, the last train 826 (21:33) is your safety net.",
    evidenceItem1: "✓ Seoul Station 08:57 depart → Gangneung Station 20:30 depart → Seoul Station 22:32 arrive (actual KTX-eum timetable)",
    evidenceItem2: "✓ Full route by bus + walking team-verified via transit schedules and mapping (Goblin→The Glory→BTS→Gangmun Beach→Bossanova→Jungang Market→Gangneung Station)",
    evidenceItem3: "✓ Restaurant & café hours confirmed (Baengnyeon Hoejip · Bossanova Coffee Roasters · Gangneung Jungang Market)",
    breakHeading: "⚠ When this verdict breaks down",
    breakCond1: "· If City 1 bus delays exceed 40 min — catching KTX 824 (20:30) may become difficult",
    disclaimer: "The course above is a sample scenario with no date set. Tell us your dates and we'll recalculate — weather, schedules, and crowd levels included.",
    ch1: "Drama & K-pop Spots",
    ch2: "Local favorite restaurant",
    ch3: "Café",
    ch4: "Day-trip timetable at a glance",
    timetableNote: "※ All KTX and local transit times are team-verified via transit schedules and map routing. City 1 bus (Goblin→The Glory·BTS→Gangmun→Bossanova) runs ~every 40 min — check the schedule at the stop. Restaurants: Baengnyeon Hoejip (Jumunjin Port, 11:00~21:20, no regular holiday) · Bossanova (Anmok Beach, 07:00~22:00).",
    secretCoord: "Secret coordinates.",
    tipLabel: "Editor's secret tip",
    tipLabel2: "Tip.",
    closingEyebrow: "✦ Curious about other cities?",
    closingTitle: "We can build a course like this\nfor any city — down to the last train",
    closingSub: "Tell us the city you want to visit.\nThe most-requested places get their story next.",
    stickyHook: "We can plan a course like this for any city",
    mapSaveBtn: "🗺️ Save map",
    requestBtn: "Request →",
  },
  ja: {
    backLink: "他のツアーを見る",
    heroBadge: "📍 江陵・注文津・日帰りコース",
    heroTitle1: "〈トッケビ〉からBTSまで、",
    heroTitle2: "東海岸に沿って江陵聖地を完全制覇",
    introSub: "東海岸で出会う〈トッケビ〉·〈ザ・グローリー〉·BTSの聖地ルート",
    blockquote: "バスだけで聖地4か所、無駄のない動線 — このページ一つで江陵を完全制覇。",
    verdictHeading: "⚠️ GO WITH CARE — 江陵日帰り判定",
    verdictCourseMeta: "4か所の聖地スポット・ソウル駅発日帰り",
    verdictBarRight: "KTX乗車まで74分の余裕・バス乗り換え注意",
    verdictDesc: "KTX 824便(20:30)まで約74分の余裕。バスが少し遅れても、最終便826便(21:33)で帰れます。",
    evidenceItem1: "✓ ソウル駅08:57出発 → 江陵駅20:30出発 → ソウル駅22:32到着（KTX-イウム実際の時刻表）",
    evidenceItem2: "✓ 全区間バス＋徒歩の動線をチームが事前に検証済み（トッケビ→ザ・グローリー→BTS→江門海水浴場→ボサノバ→中央市場→江陵駅）",
    evidenceItem3: "✓ 食堂・カフェの営業時間確認済み（百年フェ屋・ボサノバコーヒーロースターズ・江陵中央市場）",
    breakHeading: "⚠ この判定が崩れる条件",
    breakCond1: "· シティ1バスが40分以上遅れた場合 — KTX 824便(20:30)への乗車が難しくなる可能性があります",
    disclaimer: "上記のコースは日付を指定していないサンプルシナリオです。行きたい日程を教えてください。天気・運行・混雑度まで計算し直します。",
    ch1: "ドラマ・K-POP聖地",
    ch2: "地元グルメ",
    ch3: "カフェ",
    ch4: "ひと目でわかる日帰りタイムテーブル",
    timetableNote: "※ KTXおよび現地交通機関の全区間はチームが時刻表と地図で検証した参考値です。シティ1（トッケビ→ザ・グローリー・BTS→江門海水浴場→ボサノバ）は約40分間隔なので現地時刻表確認必須。食堂：百年フェ屋（注文津港、11:00〜21:20、定休日なし）・ボサノバ（安木海水浴場、07:00〜22:00）。",
    secretCoord: "シークレット座標.",
    tipLabel: "エディター秘密の裏技",
    tipLabel2: "裏技.",
    closingEyebrow: "✦ 他の地域も気になりますか",
    closingTitle: "ご希望の地域もこのコースのように\n最終便まで計算して作ります",
    closingSub: "行きたい地域があれば教えてください。\n申請の多い順に次のストーリーを作ります。",
    stickyHook: "ご希望の地域もこのコースのように作ります",
    mapSaveBtn: "🗺️ 地図を保存",
    requestBtn: "リクエストする →",
  },
  zh: {
    backLink: "查看其他路线",
    heroBadge: "📍 江陵·注文津·一日游路线",
    heroTitle1: "从《鬼怪》到BTS，",
    heroTitle2: "沿着东海海岸征服江陵圣地",
    introSub: "在东海海岸相遇的《鬼怪》·《黑暗荣耀》·BTS圣地路线",
    blockquote: "只坐公交就能打卡4个圣地，动线零浪费 — 一页搞定江陵之旅。",
    verdictHeading: "⚠️ GO WITH CARE — 江陵一日游判定",
    verdictCourseMeta: "4个圣地景点·从首尔站出发的一日游",
    verdictBarRight: "KTX出发前还有74分钟·注意公交换乘",
    verdictDesc: "KTX 824次(20:30)出发前约74分钟。就算公交稍有延误，还有末班车826次(21:33)可以返回。",
    evidenceItem1: "✓ 首尔站08:57出发 → 江陵站20:30出发 → 首尔站22:32到达（KTX-eum实际时刻表）",
    evidenceItem2: "✓ 全程公交+步行路线经团队事前验证（鬼怪→黑暗荣耀→BTS→江门海水浴场→Bossanova→中央市场→江陵站）",
    evidenceItem3: "✓ 餐厅·咖啡厅营业时间已确认（百年刺身店·Bossanova咖啡烘焙坊·江陵中央市场）",
    breakHeading: "⚠ 这个判断会失效的情况",
    breakCond1: "· 如果城市1路公交延误超过40分钟 — 可能难以赶上KTX 824次(20:30)",
    disclaimer: "以上路线是没有设定具体日期的示例场景。告诉我们您想去的日期，我们将重新计算当天的天气、运营情况和拥挤程度。",
    ch1: "韩剧·K-POP圣地",
    ch2: "本地人气美食",
    ch3: "咖啡店",
    ch4: "一目了然的一日游时间表",
    timetableNote: "※ KTX及当地交通全程均为团队通过时刻表和地图事前验证的参考数据。城市1路公交（鬼怪→黑暗荣耀·BTS→江门海水浴场→Bossanova）约40分钟一班，请务必提前确认时刻表。餐厅：百年刺身店（注文津港，11:00~21:20，无固定休息日）·Bossanova（安木海水浴场，07:00~22:00）。",
    secretCoord: "秘密坐标.",
    tipLabel: "编辑私藏秘诀",
    tipLabel2: "小贴士.",
    closingEyebrow: "✦ 还想了解其他地区吗",
    closingTitle: "我们可以为任何城市打造\n像这样的路线 — 精确到最后一班车",
    closingSub: "告诉我们您想去的地区。\n申请最多的地方将优先制作下一期内容。",
    stickyHook: "我们可以为任何地区制作这样的路线",
    mapSaveBtn: "🗺️ 保存地图",
    requestBtn: "提交请求 →",
  },
  vi: {
    backLink: "Xem các tour khác",
    heroBadge: "📍 Gangneung · Jumunjin · Lịch trình 1 ngày",
    heroTitle1: "Từ Goblin đến BTS —",
    heroTitle2: "hành trình hành hương hoàn chỉnh ở Gangneung dọc biển Đông",
    introSub: "Lộ trình hành hương Goblin · The Glory · BTS dọc bờ biển Đông",
    blockquote: "4 điểm hành hương chỉ bằng xe buýt, không lãng phí thời gian — chinh phục hoàn toàn Gangneung với một trang này.",
    verdictHeading: "⚠️ GO WITH CARE — Nhận định chuyến đi 1 ngày đến Gangneung",
    verdictCourseMeta: "4 điểm hành hương · Khởi hành từ Ga Seoul trong ngày",
    verdictBarRight: "74 phút trước KTX · Chú ý chuyển xe buýt",
    verdictDesc: "Khoảng 74 phút trước KTX 824 (20:30). Kể cả khi xe buýt trễ, vẫn còn chuyến tàu cuối 826 (21:33) đưa bạn về.",
    evidenceItem1: "✓ Ga Seoul 08:57 khởi hành → Ga Gangneung 20:30 khởi hành → Ga Seoul 22:32 đến (thời gian biểu KTX-eum thực tế)",
    evidenceItem2: "✓ Toàn bộ lộ trình bằng xe buýt + đi bộ đã được đội ngũ xác minh trước (Goblin→The Glory→BTS→Gangmun Beach→Bossanova→Chợ Jungang→Ga Gangneung)",
    evidenceItem3: "✓ Giờ mở cửa nhà hàng & quán cà phê đã xác nhận (Baengnyeon Hoejip · Bossanova Coffee Roasters · Chợ Jungang Gangneung)",
    breakHeading: "⚠ Điều kiện nhận định này bị phá vỡ",
    breakCond1: "· Nếu xe buýt City 1 trễ hơn 40 phút — có thể khó kịp KTX 824 (20:30)",
    disclaimer: "Lịch trình trên là kịch bản mẫu không có ngày cụ thể. Hãy cho chúng tôi biết ngày bạn muốn đi, chúng tôi sẽ tính lại — kể cả thời tiết, lịch chạy xe và mức độ đông đúc.",
    ch1: "Điểm phim & K-pop",
    ch2: "Ẩm thực địa phương được yêu thích",
    ch3: "Quán cà phê",
    ch4: "Bảng giờ giấc đi trong ngày trong nháy mắt",
    timetableNote: "※ Tất cả thời gian KTX và giao thông địa phương đã được đội ngũ xác minh trước qua lịch trình và bản đồ. Xe buýt City 1 (Goblin→The Glory·BTS→Gangmun→Bossanova) chạy ~mỗi 40 phút — hãy kiểm tra lịch khi đến điểm dừng. Nhà hàng: Baengnyeon Hoejip (Cảng Jumunjin, 11:00~21:20, không có ngày nghỉ định kỳ) · Bossanova (Bãi biển Anmok, 07:00~22:00).",
    secretCoord: "Tọa độ bí mật.",
    tipLabel: "Mẹo bí mật từ Biên tập viên",
    tipLabel2: "Mẹo.",
    closingEyebrow: "✦ Tò mò về những thành phố khác?",
    closingTitle: "Chúng tôi có thể tạo lịch trình như thế này\ncho bất kỳ thành phố nào — đến tận chuyến tàu cuối",
    closingSub: "Hãy cho chúng tôi biết thành phố bạn muốn đến.\nNơi được yêu cầu nhiều nhất sẽ được thực hiện tiếp theo.",
    stickyHook: "Chúng tôi có thể lên kế hoạch lịch trình như thế này cho bất kỳ thành phố nào",
    mapSaveBtn: "🗺️ Lưu bản đồ",
    requestBtn: "Yêu cầu →",
  },
};

type SpotItem = {
  no: string; emoji: string; tag: string; title: string; subtitle: string;
  scene: string; reality: string; coord: string; tip: string; caution: string;
  image: string; pip?: string;
};

const SPOTS: Record<Lang, SpotItem[]> = {
  ko: [
    {
      no: "01", emoji: "🌊", tag: "드라마 스팟", title: "도깨비 촬영지",
      subtitle: "도깨비 첫 만남 장소 (교항리 방파제)",
      scene: "도깨비와 지은탁의 운명적인 첫 만남이 이루어진 그 바다 방파제.",
      reality: "8년이 지난 지금도 팬들의 발걸음이 이어지는 성지. 2026년 tvN 〈도깨비 10주년 여행〉 특집에서 공유·김고은·이동욱·유인나가 다시 이 방파제를 찾았을 만큼, 세월이 지나도 그때 그 풍경 그대로예요.",
      coord: "강원 강릉시 주문진읍 교항리 81-151",
      tip: "방파제 끝에 서면 도깨비 속 지은탁 구도가 그대로 나와요.",
      caution: "방파제는 바람이 세고 파도가 튈 수 있으니 노란 안전선 안쪽에서만 촬영해 주세요.",
      image: spotDokkaebIImg, pip: spotDokkaebIPip,
    },
    {
      no: "02", emoji: "🌙", tag: "OTT 드라마 스팟", title: "더글로리 촬영지",
      subtitle: "넷플릭스 〈더 글로리〉 16화 촬영지 (소돌해변 인근)",
      scene: "문동은과 주여정이 함께 떠난 여행에서, 눈 내리는 밤 빨간 등대에 기대어 맥주를 마시던 그 방파제.",
      reality: "아들바위공원 바로 옆 작은 방파제로, 마을 모양이 소를 닮았다 해서 '소돌'이라는 이름이 붙었어요. 24시간 개방, 주차도 무료예요.",
      coord: "강원 강릉시 주문진읍 주문리 791-47 (시티1 더글로리촬영지 정류장 하차)",
      tip: "빨간 등대를 프레임 안에 넣으면 드라마 속 분위기가 살아요.",
      caution: "방파제 특성상 바닥이 미끄럽고 파도가 튈 수 있으니 안전선 안쪽에서만 촬영해 주세요.",
      image: spotThegloryImg, pip: spotThegloryPip,
    },
    {
      no: "03", emoji: "💜", tag: "K-POP 스팟", title: "BTS 버스정류장",
      subtitle: "\"You Never Walk Alone\" 앨범 재킷 촬영지",
      scene: "방탄소년단 리패키지 앨범 〈YOU NEVER WALK ALONE〉 재킷을 촬영한 그 버스정류장.",
      reality: "촬영 당시엔 임시로 세운 세트였는데, 철거된 걸 관광객을 위해 다시 재현해뒀어요. 보라색 벤치엔 멤버 이름이 적혀 있고, 옆엔 포토존 그네도 있어요.",
      coord: "강원도 강릉시 주문진읍 향호리 8-55",
      tip: "사진촬영 스팟에서 정류장을 찍으면 앨범 재킷 구도 완성. 보라색 벤치는 도로 쪽에 따로 있으니 챙겨서 찍어두세요.",
      caution: "실제 운행하는 버스정류장이 아니라 포토존 세트이니, 주변 도로 통행에 주의해 주세요.",
      image: spotBtsImg, pip: spotBtsPip,
    },
    {
      no: "04", emoji: "🌅", tag: "드라마 스팟", title: "강문해변",
      subtitle: "그녀는 예뻤다 촬영지",
      scene: "성준과 혜진이 화보 촬영 답사 출장을 갔던 곳 — MBC 〈그녀는 예뻤다〉 7화 촬영지.",
      reality: "경포해변과 안목해변 사이에 있는 조용한 해변. 강문해변과 경포해변을 잇는 솟대다리가 이 해변의 상징이에요.",
      coord: "강원도 강릉시 창해로 352",
      tip: "솟대다리 위에서 바다를 배경으로 찍으면 화보 같은 사진이 나와요.",
      caution: "안목해변으로 넘어가는 길목이라 해 질 무렵엔 산책객이 많으니 다리 위 통행에 주의해 주세요.",
      image: spotGangmunImg, pip: spotGangmunPip,
    },
  ],
  en: [
    {
      no: "01", emoji: "🌊", tag: "Drama Spot", title: "Goblin Filming Location",
      subtitle: "Goblin's first meeting (Gyohang-ri Breakwater)",
      scene: "The breakwater where the fateful first meeting between Goblin and Eun-tak took place.",
      reality: "Eight years on, fans still make the pilgrimage here. When tvN's 〈Goblin 10th Anniversary Journey〉 special aired in 2026, Gong Yoo, Kim Go-eun, Lee Dong-wook, and Yoo In-na returned to this very breakwater — and the scenery was exactly as it was.",
      coord: "81-151 Gyohang-ri, Jumunjin-eup, Gangneung-si, Gangwon",
      tip: "Stand at the end of the breakwater to recreate Eun-tak's iconic shot from Goblin.",
      caution: "The breakwater is windy and waves can splash — stay on the safe side of the yellow line when shooting.",
      image: spotDokkaebIImg, pip: spotDokkaebIPip,
    },
    {
      no: "02", emoji: "🌙", tag: "OTT Drama Spot", title: "The Glory Filming Location",
      subtitle: "Netflix 〈The Glory〉 Episode 16 filming location (near Sodol Beach)",
      scene: "The breakwater where Moon Dong-eun and Joo Yeo-jeong traveled together — leaning against a red lighthouse on a snowy night, drinking beer.",
      reality: "A small breakwater right next to Sodol Rock Park, named 'Sodol' because the village shape resembles a cow. Open 24 hours, free parking.",
      coord: "791-47 Jumun-ri, Jumunjin-eup, Gangneung-si, Gangwon (alight at City 1 'The Glory Filming Site' stop)",
      tip: "Frame the red lighthouse in your shot to capture the drama's atmosphere.",
      caution: "The breakwater surface can be slippery and waves may splash — only shoot within the safety line.",
      image: spotThegloryImg, pip: spotThegloryPip,
    },
    {
      no: "03", emoji: "💜", tag: "K-POP Spot", title: "BTS Bus Stop",
      subtitle: "\"You Never Walk Alone\" album jacket shooting location",
      scene: "The bus stop where BTS's repackaged album 〈YOU NEVER WALK ALONE〉 jacket was photographed.",
      reality: "The set was temporarily built for the shoot and later taken down, but it was rebuilt as a recreation for visitors. The purple bench has each member's name, and there's also a photo-zone swing nearby.",
      coord: "8-55 Hyangho-ri, Jumunjin-eup, Gangneung-si, Gangwon",
      tip: "Shoot the stop from the dedicated photo spot to recreate the album jacket framing. The purple bench is separately placed on the road side — don't forget that one.",
      caution: "This is a photo-zone recreation, not an actual bus stop — watch out for road traffic nearby.",
      image: spotBtsImg, pip: spotBtsPip,
    },
    {
      no: "04", emoji: "🌅", tag: "Drama Spot", title: "Gangmun Beach",
      subtitle: "She Was Pretty filming location",
      scene: "The beach where Sung-jun and Hye-jin went on a photo shoot scouting trip — MBC 〈She Was Pretty〉 Episode 7 filming location.",
      reality: "A quiet beach between Gyeongpo Beach and Anmok Beach. The Sotdae Bridge connecting Gangmun Beach and Gyeongpo Beach is the symbol of this beach.",
      coord: "352 Changhae-ro, Gangneung-si, Gangwon",
      tip: "Shooting from the Sotdae Bridge with the sea as backdrop gives you a magazine-worthy shot.",
      caution: "The bridge connects to Anmok Beach, so near sunset there are many walkers — be mindful of foot traffic on the bridge.",
      image: spotGangmunImg, pip: spotGangmunPip,
    },
  ],
  ja: [
    {
      no: "01", emoji: "🌊", tag: "ドラマスポット", title: "トッケビ撮影地",
      subtitle: "トッケビと殷卓の運命の初対面の場所（橋項里防波堤）",
      scene: "トッケビと殷卓の運命的な初対面の舞台となったあの海の防波堤。",
      reality: "8年が経った今も、ファンの足跡が絶えない聖地です。2026年にtvNの〈トッケビ10周年旅行〉特集でコン・ユ、キム・ゴウン、イ・ドンウク、ユ・インナがこの防波堤を再び訪れたほど、歳月が流れてもあの頃の風景のままです。",
      coord: "강원 강릉시 주문진읍 교항리 81-151",
      tip: "防波堤の先端に立つと、トッケビの中の殷卓と同じ構図の写真が撮れます。",
      caution: "防波堤は風が強く、波しぶきがかかることがあるので、黄色い安全線の内側のみで撮影してください。",
      image: spotDokkaebIImg, pip: spotDokkaebIPip,
    },
    {
      no: "02", emoji: "🌙", tag: "OTTドラマスポット", title: "ザ・グローリー撮影地",
      subtitle: "Netflix〈ザ・グローリー〉第16話撮影地（ソドル海岸付近）",
      scene: "ムン・ドンウンとチュ・ヨジョンが一緒に旅をした場所で、雪の降る夜に赤い灯台に寄りかかってビールを飲んでいたあの防波堤。",
      reality: "アドルバウィ公園のすぐ隣の小さな防波堤で、村の形が牛に似ているところから「ソドル」という名前がついています。24時間開放、駐車場も無料です。",
      coord: "강원 강릉시 주문진읍 주문리 791-47（シティ1「ザ・グローリー撮影地」停留所下車）",
      tip: "赤い灯台をフレームに収めると、ドラマの雰囲気が蘇ります。",
      caution: "防波堤の床は滑りやすく、波しぶきがかかることがあるので、安全線の内側のみで撮影してください。",
      image: spotThegloryImg, pip: spotThegloryPip,
    },
    {
      no: "03", emoji: "💜", tag: "K-POPスポット", title: "BTSバス停",
      subtitle: "「You Never Walk Alone」アルバムジャケット撮影地",
      scene: "防弾少年団のリパッケージアルバム〈YOU NEVER WALK ALONE〉ジャケットが撮影されたバス停。",
      reality: "撮影当時は仮設セットでしたが、解体後に観光客向けに再現されました。紫のベンチにはメンバーの名前が書かれており、隣にはフォトゾーンのブランコもあります。",
      coord: "강원도 강릉시 주문진읍 향호리 8-55",
      tip: "撮影スポットからバス停を撮ると、アルバムジャケットの構図が完成します。紫のベンチは道路側に別にあるので、そちらも忘れずに。",
      caution: "実際に運行しているバス停ではなくフォトゾーンのセットなので、周辺道路の通行に注意してください。",
      image: spotBtsImg, pip: spotBtsPip,
    },
    {
      no: "04", emoji: "🌅", tag: "ドラマスポット", title: "江門海水浴場",
      subtitle: "「彼女はキレイだった」撮影地",
      scene: "ソンジュンとヘジンが写真撮影のロケハン出張に行った場所 — MBC「彼女はキレイだった」第7話の撮影地。",
      reality: "鏡浦海水浴場と安木海水浴場の間にある静かなビーチ。江門海水浴場と鏡浦海水浴場を結ぶソッテ橋がこのビーチのシンボルです。",
      coord: "강원도 강릉시 창해로 352",
      tip: "ソッテ橋の上から海を背景に撮ると、雑誌のような写真が撮れます。",
      caution: "安木海水浴場に向かう橋の通り道なので、日暮れ頃には散歩客が多く、橋の上の通行に注意してください。",
      image: spotGangmunImg, pip: spotGangmunPip,
    },
  ],
  zh: [
    {
      no: "01", emoji: "🌊", tag: "剧中取景地", title: "《鬼怪》取景地",
      subtitle: "《鬼怪》初次相遇的地方（桥项里防波堤）",
      scene: "鬼怪与银卓命中注定的初遇发生在这片海的防波堤上。",
      reality: "8年过去了，粉丝们依然络绎不绝地来到这里。2026年tvN《鬼怪10周年旅行》特辑中，孔刘、金高银、李栋旭、刘仁娜再次踏上这片防波堤——这里的风景和当年一模一样。",
      coord: "강원 강릉시 주문진읍 교항리 81-151",
      tip: "站在防波堤尽头，就能还原剧中银卓的经典构图。",
      caution: "防波堤风大，浪花可能会飞溅，请在黄色安全线内侧拍照。",
      image: spotDokkaebIImg, pip: spotDokkaebIPip,
    },
    {
      no: "02", emoji: "🌙", tag: "OTT剧集取景地", title: "《黑暗荣耀》取景地",
      subtitle: "Netflix《黑暗荣耀》第16集取景地（素乭海边附近）",
      scene: "文东恩和朱汝情一起旅行时，在雪夜里靠着红色灯塔喝啤酒的那片防波堤。",
      reality: "位于石头岩石公园旁边的一个小防波堤，因村庄形状像牛而得名「素乭」。24小时开放，停车免费。",
      coord: "강원 강릉시 주문진읍 주문리 791-47（乘城市1路公交至「《黑暗荣耀》取景地」站下车）",
      tip: "将红色灯塔纳入画框，就能还原剧中的氛围。",
      caution: "防波堤地面湿滑，浪花可能飞溅，请在安全线内侧拍照。",
      image: spotThegloryImg, pip: spotThegloryPip,
    },
    {
      no: "03", emoji: "💜", tag: "K-POP打卡地", title: "BTS公交站",
      subtitle: "\"You Never Walk Alone\"专辑封面拍摄地",
      scene: "BTS重新包装专辑〈YOU NEVER WALK ALONE〉封面的拍摄地就是这个公交站。",
      reality: "拍摄时是临时搭建的布景，拆除后为了游客重新复原了。紫色长椅上刻有成员名字，旁边还有拍照区秋千。",
      coord: "강원도 강릉시 주문진읍 향호리 8-55",
      tip: "在专辑拍照点拍公交站，就能完美还原专辑封面的构图。紫色长椅在马路一侧单独放置，别忘了去拍一张。",
      caution: "这里是拍照区布景而非实际运营的公交站，请注意周边道路交通。",
      image: spotBtsImg, pip: spotBtsPip,
    },
    {
      no: "04", emoji: "🌅", tag: "剧中取景地", title: "江门海水浴场",
      subtitle: "《她很漂亮》取景地",
      scene: "成俊和惠珍出差做照片拍摄堪景的地方 — MBC《她很漂亮》第7集取景地。",
      reality: "位于镜浦海水浴场和安木海水浴场之间的安静海滩。连接江门海水浴场和镜浦海水浴场的索德桥是这片海滩的标志。",
      coord: "강원도 강릉시 창해로 352",
      tip: "站在索德桥上以大海为背景拍摄，能拍出杂志般的照片。",
      caution: "这里是通往安木海水浴场的必经之路，日落时分散步的人很多，过桥时请注意行人。",
      image: spotGangmunImg, pip: spotGangmunPip,
    },
  ],
  vi: [
    {
      no: "01", emoji: "🌊", tag: "Địa điểm phim", title: "Địa điểm quay Goblin",
      subtitle: "Nơi gặp gỡ đầu tiên của Goblin và Eun-tak (Đê chắn sóng Gyohang-ri)",
      scene: "Đê chắn sóng nơi cuộc gặp gỡ định mệnh đầu tiên giữa Goblin và Eun-tak diễn ra.",
      reality: "Dù 8 năm đã trôi qua, khách hành hương vẫn không ngừng đến đây. Năm 2026, khi đặc biệt 〈Hành trình kỷ niệm 10 năm Goblin〉 của tvN phát sóng, Gong Yoo, Kim Go-eun, Lee Dong-wook, Yoo In-na đã quay lại chính đê chắn sóng này — cảnh sắc vẫn y hệt như ngày nào.",
      coord: "81-151 Gyohang-ri, Jumunjin-eup, Gangneung-si, Gangwon",
      tip: "Đứng ở cuối đê để tái hiện góc chụp biểu tượng của Eun-tak trong Goblin.",
      caution: "Đê chắn sóng rất gió và sóng có thể bắn lên — chỉ chụp ảnh ở phía trong vạch vàng an toàn.",
      image: spotDokkaebIImg, pip: spotDokkaebIPip,
    },
    {
      no: "02", emoji: "🌙", tag: "Địa điểm phim OTT", title: "Địa điểm quay The Glory",
      subtitle: "Địa điểm quay phim Netflix 〈The Glory〉 tập 16 (gần bãi biển Sodol)",
      scene: "Đê chắn sóng nơi Moon Dong-eun và Joo Yeo-jeong cùng nhau du hành — tựa vào ngọn hải đăng đỏ trong đêm tuyết rơi, uống bia.",
      reality: "Đê chắn sóng nhỏ ngay bên cạnh Công viên Đá Sodol, được đặt tên 'Sodol' vì hình dạng ngôi làng giống con bò. Mở cửa 24/24, đỗ xe miễn phí.",
      coord: "791-47 Jumun-ri, Jumunjin-eup, Gangneung-si, Gangwon (xuống ở trạm City 1 'The Glory Filming Site')",
      tip: "Đặt ngọn hải đăng đỏ vào khung hình để tái hiện không khí của bộ phim.",
      caution: "Mặt đê có thể trơn và sóng có thể bắn lên — chỉ chụp ảnh trong phạm vi vạch an toàn.",
      image: spotThegloryImg, pip: spotThegloryPip,
    },
    {
      no: "03", emoji: "💜", tag: "Địa điểm K-POP", title: "Trạm xe buýt BTS",
      subtitle: "Địa điểm chụp bìa album \"You Never Walk Alone\"",
      scene: "Trạm xe buýt nơi chụp bìa album tái đóng gói 〈YOU NEVER WALK ALONE〉 của BTS.",
      reality: "Khi chụp hình, đây là bối cảnh tạm thời, sau đó bị tháo dỡ rồi được tái dựng lại cho khách tham quan. Ghế ngồi màu tím có tên của các thành viên, và còn có đu quay photo-zone ở bên cạnh.",
      coord: "8-55 Hyangho-ri, Jumunjin-eup, Gangneung-si, Gangwon",
      tip: "Chụp trạm xe buýt từ điểm chụp ảnh được chỉ định để tái hiện bố cục bìa album. Ghế tím được đặt riêng ở phía đường — đừng quên chụp chỗ đó.",
      caution: "Đây là bối cảnh photo-zone chứ không phải trạm xe buýt thực sự — cẩn thận phương tiện giao thông xung quanh.",
      image: spotBtsImg, pip: spotBtsPip,
    },
    {
      no: "04", emoji: "🌅", tag: "Địa điểm phim", title: "Bãi biển Gangmun",
      subtitle: "Địa điểm quay She Was Pretty",
      scene: "Bãi biển nơi Sung-jun và Hye-jin đi khảo sát địa điểm chụp ảnh — địa điểm quay phim tập 7 MBC 〈She Was Pretty〉.",
      reality: "Một bãi biển yên tĩnh giữa bãi biển Gyeongpo và bãi biển Anmok. Cầu Sotdae nối bãi biển Gangmun và bãi biển Gyeongpo là biểu tượng của bãi biển này.",
      coord: "352 Changhae-ro, Gangneung-si, Gangwon",
      tip: "Chụp từ cầu Sotdae với biển làm nền sẽ cho ra bức ảnh đẹp như tạp chí.",
      caution: "Đây là đường nối đến bãi biển Anmok, nên gần lúc hoàng hôn có nhiều người đi dạo — cẩn thận khi đi trên cầu.",
      image: spotGangmunImg, pip: spotGangmunPip,
    },
  ],
};

type EatItem = {
  section: "food" | "cafe"; emoji: string; category: string; title: string;
  coord: string; tip: string; view: string; image: string; pip?: string;
};

const EATS: Record<Lang, EatItem[]> = {
  ko: [
    {
      section: "food", emoji: "🐟", category: "점심 · 물회", title: "백년횟집",
      coord: "강릉시 주문진읍 해안로 1728 (주문진 수산시장 도보 3분)",
      tip: "살얼음 동동 물회가 대표 메뉴. 영업 11:00~21:20 (브레이크타임 16:00~16:30, 라스트오더 20:20), 정기휴무 없음.",
      view: "주문진항 인근 수산시장 앞 횟집. 물회·한치물회·회덮밥 등 동해 활어 메뉴 다양.",
      image: eatBaengnyeonImg,
    },
    {
      section: "food", emoji: "🏪", category: "귀환 전 · 시장", title: "강릉중앙시장",
      coord: "강릉시 성남동 일대 (강릉역 도보 약 15분)",
      tip: "📝 에디터 추천 먹거리: 오징어순대(강릉 특산, 꼭 한 꼬치), 명태회(동해 현지 스타일), 메밀부침·메밀전병(강릉 토속 간식). 식당 한 곳에 앉기보다 시장 골목을 돌아다니며 한 가지씩 맛보는 게 이 시장 제대로 즐기는 방법.",
      view: "KTX 탑승 전 마지막 코스. 강릉 현지인 단골 전통시장으로, 구경 자체가 목적. 시간이 넉넉하면 옛날 방식 순두부도 여기서 먹을 수 있어요.",
      image: eatMarketImg,
    },
    {
      section: "cafe", emoji: "☕", category: "카페 · 오션뷰", title: "보사노바 커피로스터스",
      coord: "강릉시 창해로14번길 28",
      tip: "옥상 자리가 뷰 맛집이니 날씨 좋으면 바로 올라가세요.",
      view: "라오스 자체 농장 원두를 직접 로스팅하는 안목해변 대표 커피 명소. 옥상에서 오션뷰를 즐길 수 있어요.",
      image: cafeBossanovaImg,
    },
  ],
  en: [
    {
      section: "food", emoji: "🐟", category: "Lunch · Hoe (raw fish dish)", title: "Baengnyeon Hoejip",
      coord: "1728 Haean-ro, Jumunjin-eup, Gangneung-si (3 min walk from Jumunjin Fish Market)",
      tip: "The icy slush mul-hoe is the signature dish. Open 11:00~21:20 (break 16:00~16:30, last order 20:20), no regular holiday.",
      view: "Hoe restaurant near Jumunjin Fish Market. Various East Sea live-fish menus including mul-hoe, squid hoe, and hoe-deopbap.",
      image: eatBaengnyeonImg,
    },
    {
      section: "food", emoji: "🏪", category: "Before returning · Traditional market", title: "Gangneung Jungang Market",
      coord: "Seongnam-dong, Gangneung-si (about 15 min walk from Gangneung Station)",
      tip: "📝 Editor's picks: ojingeo-sundae (squid sausage — a Gangneung specialty, get at least one skewer), myeongtae-hoe (East Sea style), and memil-buchim/memil-jeonbyeong (buckwheat pancakes — local snacks). Better to walk around the market stalls trying one thing at a time than sitting at one restaurant.",
      view: "The final stop before boarding the KTX. A traditional market popular with Gangneung locals — exploring it is the point. If you have extra time, you can also try old-style sundubu here.",
      image: eatMarketImg,
    },
    {
      section: "cafe", emoji: "☕", category: "Café · Ocean view", title: "Bossanova Coffee Roasters",
      coord: "28 Changhae-ro 14beon-gil, Gangneung-si",
      tip: "Grab a rooftop seat right away if the weather's good — the views are the whole point.",
      view: "Anmok Beach's premier coffee destination — they roast their own beans from a Laos farm. Ocean views from the rooftop.",
      image: cafeBossanovaImg,
    },
  ],
  ja: [
    {
      section: "food", emoji: "🐟", category: "ランチ・ムルフェ", title: "百年フェ屋",
      coord: "江陵市注文津邑海岸路1728（注文津水産市場から徒歩3分）",
      tip: "シャーベット入りのムルフェが看板メニュー。営業11:00〜21:20（ブレイク16:00〜16:30、ラストオーダー20:20）、定休日なし。",
      view: "注文津港近くの水産市場前の刺身屋。ムルフェ・ヤリイカムルフェ・フェドップバプなど東海の活魚メニューが豊富。",
      image: eatBaengnyeonImg,
    },
    {
      section: "food", emoji: "🏪", category: "帰路前・伝統市場", title: "江陵中央市場",
      coord: "江陵市城南洞一帯（江陵駅から徒歩約15分）",
      tip: "📝 エディター推薦グルメ：オジンゴスンデ（江陵名物いかソーセージ — 必ず1本）、明太フェ（東海の現地スタイル）、メミルブチム・メミルジョンビョン（そば粉のチヂミ — 江陵の郷土おやつ）。一ヵ所の食堂に座るより市場の路地を歩きながら一品ずつ味わうのがこの市場の正しい楽しみ方。",
      view: "KTX乗車前の最終コース。江陵の地元民が常連の伝統市場で、散策自体が目的。時間に余裕があれば、昔ながらのスンドゥブもここで食べられます。",
      image: eatMarketImg,
    },
    {
      section: "cafe", emoji: "☕", category: "カフェ・オーシャンビュー", title: "ボサノバコーヒーロースターズ",
      coord: "江陵市蒼海路14番街28",
      tip: "晴れていれば屋上の席に直行してください — ビューが醍醐味です。",
      view: "ラオスの自社農場の豆を直接ロースティングする、安木海水浴場を代表するコーヒーの名店。屋上からオーシャンビューが楽しめます。",
      image: cafeBossanovaImg,
    },
  ],
  zh: [
    {
      section: "food", emoji: "🐟", category: "午餐·水拌生鱼片", title: "百年刺身店",
      coord: "江陵市注文津邑海岸路1728（注文津水产市场步行3分钟）",
      tip: "冰爽的水拌生鱼片是招牌菜。营业时间11:00~21:20（休息16:00~16:30，最后点餐20:20），无固定休息日。",
      view: "注文津港旁边水产市场前的刺身店。水拌生鱼片、乌贼水拌、鱼生盖饭等东海活鱼菜单种类丰富。",
      image: eatBaengnyeonImg,
    },
    {
      section: "food", emoji: "🏪", category: "返程前·传统市场", title: "江陵中央市场",
      coord: "江陵市城南洞一带（江陵站步行约15分钟）",
      tip: "📝 编辑推荐美食：鱿鱼血肠（江陵特产，至少来一串）、明太鱼生（东海本地风格）、荞麦煎饼·荞麦卷（江陵特色小吃）。与其在一家餐厅坐下，不如走遍市场小巷每样尝一点，这才是体验这个市场的正确方式。",
      view: "乘坐KTX前的最后一站。江陵本地人常去的传统市场，逛市场本身就是目的。如果时间充裕，这里还可以吃到老式纯豆腐。",
      image: eatMarketImg,
    },
    {
      section: "cafe", emoji: "☕", category: "咖啡厅·海景", title: "Bossanova咖啡烘焙坊",
      coord: "江陵市蒼海路14巷28号",
      tip: "天气好的话直接上屋顶占位 — 风景就是全部意义。",
      view: "直接烘焙老挝自家农场咖啡豆的安木海水浴场代表性咖啡名店。可从屋顶享受海景。",
      image: cafeBossanovaImg,
    },
  ],
  vi: [
    {
      section: "food", emoji: "🐟", category: "Bữa trưa · Hoe (cá sống)", title: "Baengnyeon Hoejip",
      coord: "1728 Haean-ro, Jumunjin-eup, Gangneung-si (đi bộ 3 phút từ Chợ cá Jumunjin)",
      tip: "Mul-hoe đông đá là món đặc trưng. Mở cửa 11:00~21:20 (nghỉ 16:00~16:30, gọi món cuối 20:20), không có ngày nghỉ định kỳ.",
      view: "Nhà hàng hải sản gần Chợ cá Jumunjin. Nhiều món cá sống biển Đông như mul-hoe, hoe mực và hoe-deopbap.",
      image: eatBaengnyeonImg,
    },
    {
      section: "food", emoji: "🏪", category: "Trước khi về · Chợ truyền thống", title: "Chợ Jungang Gangneung",
      coord: "Seongnam-dong, Gangneung-si (đi bộ khoảng 15 phút từ Ga Gangneung)",
      tip: "📝 Gợi ý của biên tập viên: ojingeo-sundae (dồi mực — đặc sản Gangneung, phải thử ít nhất một xiên), myeongtae-hoe (phong cách biển Đông), và memil-buchim/memil-jeonbyeong (bánh kiều mạch — món ăn vặt địa phương). Nên đi vòng qua các gian hàng thử từng món một thay vì ngồi một chỗ.",
      view: "Chặng cuối trước khi lên KTX. Chợ truyền thống được người dân địa phương Gangneung ưa thích — việc đi dạo chợ bản thân nó đã là mục tiêu. Nếu có thêm thời gian, bạn có thể thử sundubu kiểu cũ tại đây.",
      image: eatMarketImg,
    },
    {
      section: "cafe", emoji: "☕", category: "Quán cà phê · View biển", title: "Bossanova Coffee Roasters",
      coord: "28 Changhae-ro 14beon-gil, Gangneung-si",
      tip: "Lên mái ngay khi đến nếu thời tiết đẹp — view là tất cả ý nghĩa của nơi này.",
      view: "Điểm đến cà phê hàng đầu ở bãi biển Anmok — họ tự rang cà phê từ trang trại của mình tại Lào. Ngắm biển từ mái sân thượng.",
      image: cafeBossanovaImg,
    },
  ],
};

type TimetableItem = { time: string; emoji: string; label: string; desc: string; pin?: "hub" };

const TIMETABLE: Record<Lang, TimetableItem[]> = {
  ko: [
    { time: "08:57", emoji: "🚄", label: "서울역 출발", desc: "KTX-이음 807 탑승", pin: "hub" },
    { time: "10:58", emoji: "🚉", label: "강릉역 도착", desc: "300번 버스로 환승, 도깨비촬영지 방면 이동 (버스+도보 총 1시간)" },
    { time: "11:58", emoji: "🌊", label: "도깨비 촬영지", desc: "교항리 방파제, 도깨비와 지은탁의 첫 만남이 이루어진 그 바다" },
    { time: "12:27", emoji: "🐟", label: "백년횟집 점심", desc: "주문진항 앞 물회 맛집, 동해 활어로 든든하게 (체류 약 1시간)" },
    { time: "14:00", emoji: "🌙", label: "더 글로리 촬영지", desc: "빨간 등대에 기대어 맥주를 마시던 그 소돌 방파제 (해변가 도보 24분)" },
    { time: "14:44", emoji: "💜", label: "BTS 버스정류장", desc: "보라색 벤치와 포토존 그네, 아미라면 알 그 장소" },
    { time: "15:52", emoji: "🌅", label: "강문해변", desc: "그녀는 예뻤다 촬영지, 솟대다리 따라 산책 (시티1 버스 37분)" },
    { time: "16:32", emoji: "☕", label: "보사노바 커피로스터스", desc: "안목해변 오션뷰 카페로 하루 마무리" },
    { time: "18:02", emoji: "🏪", label: "강릉중앙시장", desc: "오징어순대·명태회·메밀부침, KTX 전 마지막 현지 코스" },
    { time: "19:16", emoji: "🚉", label: "강릉역 도착", desc: "커피콩빵·기념품 가게 구경하며 여유롭게 마무리 (탑승까지 약 1시간 14분)" },
    { time: "20:30", emoji: "🚄", label: "서울역 방향 출발", desc: "KTX-이음 824 탑승" },
    { time: "22:32", emoji: "🏠", label: "서울역 도착", desc: "동해안 성지 4곳, 무사 귀환", pin: "hub" },
  ],
  en: [
    { time: "08:57", emoji: "🚄", label: "Depart Seoul Station", desc: "Board KTX-eum 807", pin: "hub" },
    { time: "10:58", emoji: "🚉", label: "Arrive Gangneung Station", desc: "Transfer to Bus 300, head toward Goblin filming site (bus + walk, total ~1 hour)" },
    { time: "11:58", emoji: "🌊", label: "Goblin Filming Site", desc: "Gyohang-ri Breakwater — the sea where Goblin and Eun-tak first met" },
    { time: "12:27", emoji: "🐟", label: "Lunch at Baengnyeon Hoejip", desc: "Mul-hoe spot near Jumunjin Port — a hearty East Sea meal (stay ~1 hour)" },
    { time: "14:00", emoji: "🌙", label: "The Glory Filming Site", desc: "The Sodol breakwater — leaning on the red lighthouse drinking beer (24-min beachside walk)" },
    { time: "14:44", emoji: "💜", label: "BTS Bus Stop", desc: "Purple bench and photo-zone swing — ARMY knows this place" },
    { time: "15:52", emoji: "🌅", label: "Gangmun Beach", desc: "She Was Pretty filming location — stroll along the Sotdae Bridge (City 1 bus, 37 min)" },
    { time: "16:32", emoji: "☕", label: "Bossanova Coffee Roasters", desc: "Wrap up the day at this ocean-view café on Anmok Beach" },
    { time: "18:02", emoji: "🏪", label: "Gangneung Jungang Market", desc: "Ojingeo-sundae, myeongtae-hoe, memil-buchim — the final local stop before KTX" },
    { time: "19:16", emoji: "🚉", label: "Arrive Gangneung Station", desc: "Browse coffee-bean bread and souvenir shops at a leisurely pace (~1 hr 14 min to boarding)" },
    { time: "20:30", emoji: "🚄", label: "Depart toward Seoul Station", desc: "Board KTX-eum 824" },
    { time: "22:32", emoji: "🏠", label: "Arrive Seoul Station", desc: "4 East Sea pilgrimage sites, safe return home", pin: "hub" },
  ],
  ja: [
    { time: "08:57", emoji: "🚄", label: "ソウル駅出発", desc: "KTX-イウム807乗車", pin: "hub" },
    { time: "10:58", emoji: "🚉", label: "江陵駅到着", desc: "300番バスに乗り換え、トッケビ撮影地方面へ（バス＋徒歩 計約1時間）" },
    { time: "11:58", emoji: "🌊", label: "トッケビ撮影地", desc: "橋項里防波堤 — トッケビと殷卓の運命の初対面の海" },
    { time: "12:27", emoji: "🐟", label: "百年フェ屋ランチ", desc: "注文津港前のムルフェ名店 — 東海の活魚でしっかりランチ（滞在約1時間）" },
    { time: "14:00", emoji: "🌙", label: "ザ・グローリー撮影地", desc: "赤い灯台に寄りかかってビールを飲んでいたあのソドル防波堤（海岸沿い徒歩24分）" },
    { time: "14:44", emoji: "💜", label: "BTSバス停", desc: "紫のベンチとフォトゾーンのブランコ — ARMYなら知っているあの場所" },
    { time: "15:52", emoji: "🌅", label: "江門海水浴場", desc: "「彼女はキレイだった」撮影地 — ソッテ橋に沿って散歩（シティ1バス37分）" },
    { time: "16:32", emoji: "☕", label: "ボサノバコーヒーロースターズ", desc: "安木海水浴場のオーシャンビューカフェで一日の締めくくり" },
    { time: "18:02", emoji: "🏪", label: "江陵中央市場", desc: "オジンゴスンデ・明太フェ・メミルブチム — KTX前の最後のローカルコース" },
    { time: "19:16", emoji: "🚉", label: "江陵駅到着", desc: "コーヒー豆パン・土産物店を眺めながらゆっくり締めくくり（乗車まで約1時間14分）" },
    { time: "20:30", emoji: "🚄", label: "ソウル駅方面出発", desc: "KTX-イウム824乗車" },
    { time: "22:32", emoji: "🏠", label: "ソウル駅到着", desc: "東海岸の聖地4か所、無事帰還", pin: "hub" },
  ],
  zh: [
    { time: "08:57", emoji: "🚄", label: "首尔站出发", desc: "乘坐KTX-eum 807次", pin: "hub" },
    { time: "10:58", emoji: "🚉", label: "到达江陵站", desc: "换乘300路公交，前往《鬼怪》取景地（公交+步行共约1小时）" },
    { time: "11:58", emoji: "🌊", label: "《鬼怪》取景地", desc: "桥项里防波堤 — 鬼怪与银卓命中注定初遇的那片海" },
    { time: "12:27", emoji: "🐟", label: "百年刺身店午餐", desc: "注文津港前的水拌生鱼片名店 — 用东海活鱼吃顿丰盛午餐（停留约1小时）" },
    { time: "14:00", emoji: "🌙", label: "《黑暗荣耀》取景地", desc: "靠着红色灯塔喝啤酒的那片素乭防波堤（沿海滩步行24分钟）" },
    { time: "14:44", emoji: "💜", label: "BTS公交站", desc: "紫色长椅和拍照区秋千 — 是ARMY都认识的那个地方" },
    { time: "15:52", emoji: "🌅", label: "江门海水浴场", desc: "《她很漂亮》取景地 — 沿着索德桥漫步（城市1路公交37分钟）" },
    { time: "16:32", emoji: "☕", label: "Bossanova咖啡烘焙坊", desc: "在安木海水浴场的海景咖啡厅画上完美句号" },
    { time: "18:02", emoji: "🏪", label: "江陵中央市场", desc: "鱿鱼血肠、明太鱼生、荞麦煎饼 — KTX前的最后本地体验" },
    { time: "19:16", emoji: "🚉", label: "到达江陵站", desc: "悠闲地逛逛咖啡豆面包和纪念品店（距离上车约1小时14分钟）" },
    { time: "20:30", emoji: "🚄", label: "出发前往首尔站", desc: "乘坐KTX-eum 824次" },
    { time: "22:32", emoji: "🏠", label: "到达首尔站", desc: "东海海岸4处圣地，平安回归", pin: "hub" },
  ],
  vi: [
    { time: "08:57", emoji: "🚄", label: "Khởi hành từ Ga Seoul", desc: "Lên KTX-eum 807", pin: "hub" },
    { time: "10:58", emoji: "🚉", label: "Đến Ga Gangneung", desc: "Chuyển sang xe buýt 300, di chuyển về phía địa điểm quay Goblin (xe buýt + đi bộ tổng khoảng 1 tiếng)" },
    { time: "11:58", emoji: "🌊", label: "Địa điểm quay Goblin", desc: "Đê chắn sóng Gyohang-ri — biển nơi Goblin và Eun-tak lần đầu gặp nhau" },
    { time: "12:27", emoji: "🐟", label: "Ăn trưa tại Baengnyeon Hoejip", desc: "Quán mul-hoe gần Cảng Jumunjin — bữa ăn no nê từ cá sống biển Đông (ở khoảng 1 tiếng)" },
    { time: "14:00", emoji: "🌙", label: "Địa điểm quay The Glory", desc: "Đê chắn sóng Sodol — tựa vào hải đăng đỏ uống bia (đi bộ ven biển 24 phút)" },
    { time: "14:44", emoji: "💜", label: "Trạm xe buýt BTS", desc: "Ghế tím và đu quay photo-zone — ARMY nào cũng biết nơi này" },
    { time: "15:52", emoji: "🌅", label: "Bãi biển Gangmun", desc: "Địa điểm quay She Was Pretty — dạo dọc cầu Sotdae (xe buýt City 1, 37 phút)" },
    { time: "16:32", emoji: "☕", label: "Bossanova Coffee Roasters", desc: "Kết thúc ngày dài tại quán cà phê view biển ở bãi biển Anmok" },
    { time: "18:02", emoji: "🏪", label: "Chợ Jungang Gangneung", desc: "Ojingeo-sundae, myeongtae-hoe, memil-buchim — chặng địa phương cuối cùng trước KTX" },
    { time: "19:16", emoji: "🚉", label: "Đến Ga Gangneung", desc: "Thảnh thơi ngắm các tiệm bánh mì đậu cà phê và quà lưu niệm (~1 tiếng 14 phút trước khi lên tàu)" },
    { time: "20:30", emoji: "🚄", label: "Khởi hành về phía Ga Seoul", desc: "Lên KTX-eum 824" },
    { time: "22:32", emoji: "🏠", label: "Đến Ga Seoul", desc: "4 địa điểm hành hương ven biển Đông, trở về an toàn", pin: "hub" },
  ],
};

export default function GangneungTour() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lang, setLang] = useState<Lang>(() => resolveInitialLang(searchParams));
  const [formModalOpen, setFormModalOpen] = useState(false);

  useEffect(() => {
    trackEvent('tour_detail_view', { region: 'gangneung' });
  }, []);

  function changeLang(l: Lang) {
    setStoredLang(l);
    setLang(l);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("lang", l);
      return next;
    }, { replace: true });
  }

  const t = UI[lang];
  const spots = SPOTS[lang];
  const eats = EATS[lang];
  const timetable = TIMETABLE[lang];

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
          <Link to="/">
            <BrandLogo size={22} />
          </Link>
          {/* 언어 토글 */}
          <div className="flex items-center gap-0.5 shrink-0">
            {LANGS.map((l_) => (
              <button
                key={l_.code}
                onClick={() => changeLang(l_.code)}
                className="px-1.5 py-0.5 rounded text-[10px] font-bold transition-all"
                style={{
                  backgroundColor: lang === l_.code ? STAMP : "transparent",
                  color: lang === l_.code ? "#fff" : INK,
                  opacity: lang === l_.code ? 1 : 0.5,
                }}
              >
                {l_.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative">
        <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden">
          <img src={gangneungHeroImg} alt="강릉 경포해수욕장" className="w-full h-full object-cover" />
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
                className="text-[22px] sm:text-[30px] leading-[1.3] font-black text-white"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                {t.heroTitle1}<br />{t.heroTitle2}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* INTRO */}
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

        {/* 왕복 판단 카드 */}
        <div
          className="rounded-md overflow-hidden mb-10"
          style={{ border: `1px solid ${HAIRLINE}` }}
        >
          {/* 헤더 */}
          <div className="px-4 py-3" style={{ backgroundColor: PAPER_DEEP }}>
            <div className="text-sm font-black flex items-center gap-2" style={{ color: PINE }}>
              {t.verdictHeading}
            </div>
            <p className="text-[11px] font-semibold mt-1" style={{ color: PINE, opacity: 0.65 }}>
              {t.verdictCourseMeta}
            </p>
          </div>

          {/* 판정 바 */}
          <div className="px-4 py-2.5 text-white" style={{ backgroundColor: CARE_BG }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-black">⚠️ GO WITH CARE</span>
              <span className="text-[11px] font-semibold opacity-90">{t.verdictBarRight}</span>
            </div>
            <div
              className="text-[11px] font-semibold opacity-95 mt-1.5 pt-1.5 leading-relaxed"
              style={{ borderTop: "1px solid rgba(255,255,255,0.3)" }}
            >
              {t.verdictDesc}
            </div>
            <p className="text-[11px] text-white/90 mt-1.5">{t.evidenceItem1}</p>
            <p className="text-[11px] text-white/90 mt-1">{t.evidenceItem2}</p>
            <p className="text-[11px] text-white/90 mt-1">{t.evidenceItem3}</p>
          </div>

          {/* 이 판단이 깨지는 조건 */}
          <div
            className="px-4 py-3 text-[12px] leading-relaxed"
            style={{ backgroundColor: PAPER_DEEP, borderTop: `1px solid ${HAIRLINE}` }}
          >
            <p className="font-black" style={{ color: CARE_AMBER }}>{t.breakHeading}</p>
            <p style={{ color: INK, opacity: 0.85 }}>{t.breakCond1}</p>
          </div>

          {/* 디스클레이머 */}
          <div
            className="px-4 py-3 text-[11px] leading-relaxed"
            style={{ backgroundColor: PAPER, borderTop: `1px solid ${HAIRLINE}`, color: INK, opacity: 0.55 }}
          >
            {t.disclaimer}
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
                  className="relative aspect-[4/3] overflow-hidden rounded-sm rotate-[-0.6deg]"
                  style={{ boxShadow: "0 10px 30px rgba(20,51,43,0.18)", border: `6px solid #fff` }}
                >
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                  {s.pip && (
                    <div
                      className="absolute"
                      style={{
                        top: 12, right: 12,
                        borderRadius: 6,
                        border: "1.5px solid #fff",
                        overflow: "hidden",
                        width: "42%",
                        zIndex: 10,
                      }}
                    >
                      <img src={s.pip} alt="" style={{ display: "block", width: "100%", height: "auto" }} />
                    </div>
                  )}
                </div>
                <div
                  className="absolute -top-4 -left-3 sm:-left-5 w-16 h-16 rounded-full flex flex-col items-center justify-center rotate-[-8deg]"
                  style={{ backgroundColor: STAMP, color: "#fff", boxShadow: "0 6px 14px rgba(168,68,46,0.4)" }}
                >
                  <span className="text-[9px] font-bold tracking-widest uppercase leading-none">SPOT</span>
                  <span className="text-xl font-black leading-none mt-0.5" style={{ fontFamily: "'Noto Serif KR', serif" }}>{s.no}</span>
                </div>
              </div>

              <p className="text-[10px] font-black tracking-[0.15em] uppercase mb-1.5" style={{ color: STAMP }}>{s.tag}</p>
              <h3
                className="text-xl sm:text-2xl font-black mb-1 flex items-center gap-2"
                style={{ color: PINE, fontFamily: "'Noto Serif KR', serif" }}
              >
                <span>{s.emoji}</span> {s.title}
              </h3>
              <p className="text-xs font-bold mb-4" style={{ color: INK, opacity: 0.55 }}>{s.subtitle}</p>

              <p
                className="text-[15px] leading-relaxed mb-3 italic"
                style={{ fontFamily: "'Noto Serif KR', serif", color: PINE }}
              >
                "{s.scene}"
              </p>
              <p className="text-[13px] leading-relaxed mb-5" style={{ color: INK, opacity: 0.75 }}>
                {s.reality}
              </p>

              <div className="space-y-3 text-[13px] leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 shrink-0" style={{ color: STAMP }} />
                  <span><b className="font-bold">{t.secretCoord}</b> {s.coord}</span>
                </div>
                <div
                  className="flex items-start gap-2.5 p-4 rounded-md mt-4"
                  style={{ backgroundColor: PAPER_DEEP }}
                >
                  <Sparkles size={15} className="mt-0.5 shrink-0" style={{ color: TEAL }} />
                  <div>
                    <p className="font-bold mb-1" style={{ color: PINE }}>{t.tipLabel}</p>
                    <p className="mb-1.5">{s.tip}</p>
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

        <div className="space-y-16">
          {eats.filter((e) => e.section === "food").map((e, idx) => (
            <div key={idx}>
              <div className="relative mb-4">
                <div
                  className="relative aspect-[16/9] overflow-hidden rounded-sm"
                  style={{ boxShadow: "0 8px 20px rgba(20,51,43,0.15)", border: "6px solid #fff" }}
                >
                  <img src={e.image} alt={e.title} className="w-full h-full object-cover" />
                </div>
              </div>
              <p className="text-[10px] font-black tracking-[0.15em] uppercase mb-1.5" style={{ color: STAMP }}>{e.category}</p>
              <h4 className="text-lg font-black mb-2" style={{ color: PINE, fontFamily: "'Noto Serif KR', serif" }}>
                {e.emoji} {e.title}
              </h4>
              <div className="space-y-2 text-[13px] leading-relaxed">
                <p><b className="font-bold">📍</b> {e.coord}</p>
                <p style={{ opacity: 0.8 }}>{e.view}</p>
                <p style={{ opacity: 0.8 }}><b className="font-bold" style={{ opacity: 1 }}>{t.tipLabel2}</b> {e.tip}</p>
              </div>
            </div>
          ))}
        </div>
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
            <div className="relative mb-4">
              <div
                className="relative aspect-[16/9] overflow-hidden rounded-sm"
                style={{ boxShadow: "0 8px 20px rgba(20,51,43,0.15)", border: "6px solid #fff" }}
              >
                <img src={e.image} alt={e.title} className="w-full h-full object-cover" />
              </div>
            </div>
            <p className="text-[10px] font-black tracking-[0.15em] uppercase mb-1.5" style={{ color: STAMP }}>{e.category}</p>
            <h4 className="text-lg font-black mb-2" style={{ color: PINE, fontFamily: "'Noto Serif KR', serif" }}>
              {e.emoji} {e.title}
            </h4>
            <div className="space-y-2 text-[13px] leading-relaxed">
              <p><b className="font-bold">📍</b> {e.coord}</p>
              <p style={{ opacity: 0.8 }}>{e.view}</p>
              <p style={{ opacity: 0.8 }}><b className="font-bold" style={{ opacity: 1 }}>{t.tipLabel2}</b> {e.tip}</p>
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
        <p className="text-[11px] mb-6" style={{ color: INK, opacity: 0.55 }}>
          {t.timetableNote}
        </p>

        <div className="relative pl-7">
          <div className="absolute top-1 bottom-1 left-[7px] w-px" style={{ backgroundColor: HAIRLINE }} />
          <div className="space-y-7">
            {timetable.map((tt, idx) => (
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
          className="text-2xl sm:text-3xl font-black mb-6 leading-snug whitespace-pre-line"
          style={{ color: PINE, fontFamily: "'Noto Serif KR', serif" }}
        >
          {t.closingTitle}
        </h3>
        <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-line" style={{ color: INK, opacity: 0.65 }}>
          {t.closingSub}
        </p>
      </section>

      {/* BOTTOM FIXED CTA BAR */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-4 sm:px-5 py-3 shadow-2xl"
        style={{ backgroundColor: "#fff", borderTop: `1px solid ${HAIRLINE}` }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          <div className="text-[11px] sm:text-xs leading-tight min-w-0">
            <span className="font-semibold" style={{ color: STAMP, opacity: 0.9 }}>
              {t.stickyHook}
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
              {t.mapSaveBtn}
            </a>
            <button
              type="button"
              onClick={() => {
                trackEvent('form_modal_open', { region: 'gangneung' });
                setFormModalOpen(true);
              }}
              className="py-3 px-4 sm:px-5 rounded-xl font-bold text-[11px] sm:text-sm shadow-md transition-opacity hover:opacity-90 text-center whitespace-nowrap"
              style={{ backgroundColor: STAMP, color: "#fff" }}
            >
              {t.requestBtn}
            </button>
          </div>
        </div>
      </div>

      <LangFormModal open={formModalOpen} onClose={() => setFormModalOpen(false)} pageLang={lang} region="gangneung" />
    </div>
  );
}
