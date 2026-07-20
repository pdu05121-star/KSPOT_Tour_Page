import { Link } from "react-router";
import { ChevronLeft, MapPin, Car, Sparkles } from "lucide-react";
import { SURVEY_FORM_URL } from "@/app/surveyConfig";

// Local Image Imports (동일한 수원 에셋 재사용)
import janganmunNightImg from "@/assets/carousel/janganmun_night.jpg";
import sunjaeSiljaImg from "@/assets/carousel/sunjae_silja.jpg";
import suwonHongwhamunImg from "@/assets/suwon/hwahongmun_official.jpg";
import bangwhasuryujeongPicnicImg from "@/assets/suwon/bangwhasuryujeong_official.jpg";
import haenggungdongMuralImg from "@/assets/suwon/haenggungdong_mural.png";
import suwonFortressWallImg from "@/assets/suwon/suwon_fortress_wall.png";
import nammanTongdakImg from "@/assets/suwon/namman_tongdak.jpg";
import jeongjiyoungStoreImg from "@/assets/suwon/jeongjiyoung_store.png";

// ─────────────────────────────────────────────
// 디자인 토큰 — "KSPOT 여행일기" 서브 브랜드 전용 팔레트
// 코어 앱(안심/판단 엔진, teal 기반)과 의도적으로 분리한 컬러.
// 이 결정은 KSPOT-Vault > Design_System_v3.md 에 서브 브랜드 섹션으로 문서화 예정.
// ─────────────────────────────────────────────
const TOUR_RUST = "#B5502F";       // 주요 CTA·포인트 (여행 스탬프/필름 감성의 벽돌빛 러스트)
const TOUR_INK_DEEP = "#20362F";   // 헤드라인 (짙은 잉크 그린 — 코어 teal 계열과 톤은 이어가되 채도 낮춤)
const TOUR_BODY_INK = "#3A342C";  // 본문 텍스트 (완전 검정 아닌 따뜻한 다크 뉴트럴)
const TOUR_PAPER = "#F5F0E6";      // 배경 (따뜻한 파피루스 톤)
const TOUR_PAPER_DEEP = "#EAE1CC"; // 하이라이트 박스 배경
const TOUR_BORDER = "#DED2B8";     // 헤어라인 구분선
const TEAL = "#1D9E75";            // 코어 브랜드 틸 — 링크 등 최소한의 KSPOT 연결점으로만 사용

// 기존 코드 호환용 별칭
const INK = TOUR_BODY_INK;
const PINE = TOUR_INK_DEEP;
const STAMP = TOUR_RUST;
const PAPER = TOUR_PAPER;
const PAPER_DEEP = TOUR_PAPER_DEEP;
const HAIRLINE = TOUR_BORDER;

// 왕복 판단 프레임 — 코스템플릿_수원_선재_v3.md 기준 (2026-07-20) + 막차·귀환 이동 전부 확정
// 정지영커피 → 수원역: 버스 35번·13번, 15분 확인됨. 서울행 막차 23:31 확인됨.
const ROUND_TRIP = {
  departTime: "08:40",
  departNote: "서울역 출발 · 1호선 약 55분",
  departConfirmed: false, // 출발 허브만 아직 팀 결정 안 남 (막차·귀환 이동은 전부 확정)
  courseEndTime: "17:17",
  stationTransferNote: "17:17 정지영커피 출발 → 수원역, 버스(35번·13번) 15분 (확인됨)",
  estimatedStationArrival: "17:32",
  lastTrainTime: "23:31",
  lastTrainConfirmed: true,
  bufferMinutes: 359 as number | null, // null = 아직 계산 불가(귀환 정보 미확정) → DRAFT
};

// 판정 임계값 — 개발지시서 기준. 여기 숫자만 바꾸면 전 지역 코스에 동일 적용됨.
const VERDICT_THRESHOLD_GO = 90;   // 90분 이상 여유 → GO
const VERDICT_THRESHOLD_CARE = 45; // 45~90분 → GO WITH CARE, 45분 미만 → RECONSIDER, 0 이하 → NOT NOW

type Verdict = "draft" | "go" | "care" | "reconsider" | "not_now";

function computeVerdict(bufferMinutes: number | null): Verdict {
  if (bufferMinutes === null) return "draft";
  if (bufferMinutes <= 0) return "not_now";
  if (bufferMinutes >= VERDICT_THRESHOLD_GO) return "go";
  if (bufferMinutes >= VERDICT_THRESHOLD_CARE) return "care";
  return "reconsider";
}

const GO_GREEN = "#2F7D5B";
const WARN_AMBER = "#B8893A"; // DRAFT 전용
const CARE_AMBER = "#B45309";
const RECONSIDER_ORANGE = "#9A3412";
const NOT_NOW_RED = "#922B21";

const VERDICT_META: Record<Verdict, { label: string; color: string; sub: string }> = {
  draft: { label: "◐ DRAFT", color: WARN_AMBER, sub: "판정 보류" },
  go: { label: "✓ GO", color: GO_GREEN, sub: "무사히 귀환" },
  care: { label: "⚠ GO WITH CARE", color: CARE_AMBER, sub: "시간 여유를 두고 움직이세요" },
  reconsider: { label: "△ RECONSIDER", color: RECONSIDER_ORANGE, sub: "코스 축소를 권장해요" },
  not_now: { label: "✕ NOT NOW", color: NOT_NOW_RED, sub: "지금 조건에서는 어려워요" },
};

const verdict = computeVerdict(ROUND_TRIP.bufferMinutes);
const verdictMeta = VERDICT_META[verdict];

// 구글맵 저장 버튼용 좌표 — 코스템플릿_수원_선재_v3.md 8곳 중 좌표 확인된 7곳 순서대로.
// 행리단길은 템플릿에 좌표 없음(출처 미확인) — 경로에서 제외.
const ROUTE_COORDS = [
  "37.2847710231129,127.013617036234", // 01 몽테드 카페
  "37.2855291351344,127.01661296437",  // 02 화홍문
  "37.2875267997459,127.018037812296", // 03 방화수류정
  "37.285686283703,127.016560223438",  // 04 행궁동 벽화마을
  "37.2818820191942,127.014394463798", // 05 화성행궁
  "37.2794246460132,127.017499823481", // 06 수원 왕갈비 통닭
  "37.2848962630143,127.014416125317", // 08 정지영 커피 (마지막 스팟)
];
const GOOGLE_MAPS_ROUTE_URL = `https://www.google.com/maps/dir/?api=1&origin=${ROUTE_COORDS[0]}&destination=${ROUTE_COORDS[ROUTE_COORDS.length - 1]}&waypoints=${ROUTE_COORDS.slice(1, -1).join("|")}&travelmode=walking`;

// 촬영지 · 관광지 — Chapter 1 (v3 템플릿 SPOT 01~05)
const spots = [
  {
    no: "01",
    emoji: "🎬",
    title: "몽테드 카페",
    subtitle: "솔이네 비디오가게 앞 · 노란 우산씬",
    scene: "선재와 솔이의 노란 우산 장면이 촬영된 그 골목 앞 카페. 오픈 시간에 맞춰 여유 있게 하루를 시작해요.",
    coord: "경기 수원시 팔달구 화서문로48번길 14 1층",
    move: "몽테드 카페 → 화홍문, 도보 9분 (확인됨)",
    goldenHour: "10시 오픈이라 그 전에 도착하면 골목 사진부터 찍고 들어가는 걸 추천해요.",
    caution: "영업시간 10:00–19:00 · 매주 수요일 휴무",
    image: sunjaeSiljaImg,
  },
  {
    no: "02",
    emoji: "💌",
    title: "화홍문",
    subtitle: "솔이가 선재에게 고백한 곳",
    scene: "수원천 위 돌다리. 19살 솔이가 선재에게 마음을 고백하던 장면이 촬영된 곳이에요.",
    coord: "경기 수원시 팔달구 북수동",
    move: "화홍문 → 방화수류정, 도보 3분 (확인됨)",
    goldenHour: "OST를 들으며 천천히 건너보세요 — 다리를 건너는 뒷모습과 화홍문 누각을 한 앵글에 담기 좋아요.",
    caution: "24시간 개방 · 휴무 없음",
    image: suwonHongwhamunImg,
  },
  {
    no: "03",
    emoji: "🚲",
    title: "방화수류정",
    subtitle: "자전거를 가르쳐주던 그 자리",
    scene: "선재가 솔이에게 자전거 타는 법을 가르쳐주던 곳. 날씨 좋은 날엔 잠깐 앉아 쉬어가기 좋은 뷰예요.",
    coord: "경기 수원시 팔달구 매향동 151",
    move: "방화수류정 → 행궁동 벽화마을, 도보 3분 [추정 · 확인 필요]",
    goldenHour: "정자와 용연 연못이 함께 담기는 각도가 정석이에요.",
    caution: "24시간 개방 · 휴무 없음",
    image: bangwhasuryujeongPicnicImg,
  },
  {
    no: "04",
    emoji: "🧱",
    title: "행궁동 벽화마을",
    subtitle: "설레는 벽쿵씬 그 골목",
    scene: "성벽을 따라 걷다 만나는 벽화 골목. 선재와 솔이의 벽쿵씬이 촬영된 자리예요.",
    coord: "경기 수원시 팔달구 화서문로72번길 9-7",
    move: "행궁동 벽화마을 → 화성행궁, 도보 13분 [추정 · 확인 필요]",
    goldenHour: "골목 자체가 24시간 개방이라 시간대 상관없이 들를 수 있어요.",
    caution: "개별 가게는 방문 시 영업 여부 확인 필요",
    image: haenggungdongMuralImg,
  },
  {
    no: "05",
    emoji: "🏯",
    title: "화성행궁",
    subtitle: "조선시대로 타임슬립",
    scene: "골목에서 걸어 나와 만나는 궁궐. 정조가 머물던 화성행궁을 천천히 둘러보는 구간이에요.",
    coord: "경기 수원시 팔달구 정조로 825",
    move: "화성행궁 → 수원왕갈비통닭, 도보 11분 [추정 · 확인 필요]",
    goldenHour: "야간개장 기간(5~11월 금~일·공휴일 18:00–21:30, 마감 21:00)엔 야경도 가능해요. 전각이 여러 채라 체류시간을 넉넉히(90분) 잡아두세요.",
    caution: "입장료 2,000원 · 09:00–18:00 (입장마감 1시간 전) · 휴무 없음",
    image: suwonFortressWallImg,
  },
];

// 현지인 찐맛집 & 카페 — Chapter 2·3 (v3 템플릿 SPOT 06, 08 · 행리단길은 두 장소 사이 경유로 소개)
const eats = [
  {
    section: "food" as const,
    emoji: "🍗",
    category: "점심 · 통닭",
    title: "수원 왕갈비 통닭",
    coord: "경기 수원시 팔달구 정조로800번길 12",
    menu: "왕갈비 통닭 (워크인만 가능)",
    tip: "라스트오더 21:00. 웨이팅 있는 편이니 여유 있게 방문하세요.",
    view: "화성행궁에서 도보 11분 — 관람 끝나고 걸어갈 수 있는 로컬 맛집이에요.",
    image: nammanTongdakImg,
  },
  {
    section: "cafe" as const,
    emoji: "☕",
    category: "루프탑 카페 · 마무리",
    title: "정지영 커피 로스터즈",
    coord: "경기 수원시 팔달구 신풍로 42 (행궁본점)",
    menu: "시그니처 라떼 + 성곽 뷰 루프탑 좌석",
    tip: "루프탑 좌석은 선착순이라 도착하자마자 자리부터 잡는 걸 추천해요.",
    view: "행리단길 소품샵·골목을 구경하며 걸어오면 자연스럽게 도착하는 코스 마지막 스팟이에요.",
    image: jeongjiyoungStoreImg,
  },
];

// 한눈에 보는 당일치기 타임테이블 — v3 템플릿 실제 시각 그대로
const timetable = [
  { time: "10:00", emoji: "☕", label: "몽테드 카페", desc: "노란 우산씬 그 골목 앞에서 하루 시작" },
  { time: "10:39", emoji: "💌", label: "화홍문", desc: "고백씬 돌다리, OST 들으며 건너기" },
  { time: "11:12", emoji: "🚲", label: "방화수류정", desc: "자전거 가르쳐주던 그 자리에서 잠깐 휴식" },
  { time: "11:45", emoji: "🧱", label: "행궁동 벽화마을", desc: "벽쿵씬 골목 구경" },
  { time: "12:28", emoji: "🏯", label: "화성행궁", desc: "조선시대로 타임슬립 (입장료 2,000원)" },
  { time: "14:09", emoji: "🍗", label: "왕갈비 통닭", desc: "든든한 점심" },
  { time: "15:14", emoji: "🛍️", label: "행리단길", desc: "소품샵 골목 구경하며 이동" },
  { time: "16:17", emoji: "🌇", label: "정지영 커피", desc: "성곽 뷰 루프탑에서 마무리 티타임" },
];

export default function SuwonTour() {

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: PAPER, color: INK, fontFamily: "'Noto Sans KR', sans-serif" }}
    >
      {/* NAV */}
      <nav className="sticky top-0 z-40 backdrop-blur-md border-b" style={{ backgroundColor: `${PAPER}CC`, borderColor: HAIRLINE }}>
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link
            to="/tour"
            className="flex items-center gap-1 text-xs font-bold tracking-wide hover:opacity-70 transition-opacity"
            style={{ color: INK }}
          >
            <ChevronLeft size={15} />
            다른 투어 보기
          </Link>
          <span className="text-sm font-black tracking-[0.2em] uppercase" style={{ color: PINE, fontFamily: "'Noto Serif KR', serif" }}>
            KSPOT Travelog
          </span>
          <div style={{ width: 90 }} />
        </div>
      </nav>

      {/* HERO */}
      <header className="relative">
        <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden">
          <img src={janganmunNightImg} alt="수원 화성 장안문 야경" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,51,43,0.75), rgba(20,51,43,0.05) 55%)" }} />
          <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 pb-8 sm:pb-10">
            <div className="max-w-2xl mx-auto">
              <span
                className="inline-block text-[11px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full mb-4"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)" }}
              >
                📍 수원 행궁동 · 당일치기 로드맵
              </span>
              <h1
                className="text-[28px] sm:text-[38px] leading-[1.25] font-black text-white"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                수원에서 만나는<br />〈선재 업고 튀어〉 타임슬립 로드맵
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* INTRO */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14">
        <p className="text-sm sm:text-base font-bold mb-8" style={{ color: STAMP }}>
          〈선재 업고 튀어〉 찐팬들만 아는 임솔♥류선재 타임슬립 성지 루트
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
            인스타그램에서 다 알려주지 못한 〈선재 업고 튀어〉 속 진짜 촬영지 좌표부터, 현지인들도 몰래 숨겨둔
            웨이팅 ZERO 찐맛집과 카페까지. 이 페이지 하나로 수원 당일치기 완벽 졸업하세요.
          </p>
        </blockquote>

        {/* 왕복 판단 프레임 — KSPOT 핵심 기능. "이 코스 진짜 하루에 되네" 를 증명하는 자리 */}
        <div
          className="rounded-md overflow-hidden mb-10"
          style={{ border: `1px solid ${HAIRLINE}` }}
        >
          <div
            className="px-4 py-2.5 text-xs font-bold flex items-center gap-2"
            style={{ backgroundColor: PAPER_DEEP, color: PINE }}
          >
            ☰ 이 하루, 한눈에
          </div>
          <div className="px-4 py-3.5 text-[13px] leading-relaxed" style={{ color: INK }}>
            <div className="flex items-center gap-2 font-bold" style={{ color: GO_GREEN }}>
              <span>🚆</span>
              <span>
                {ROUND_TRIP.departTime} {ROUND_TRIP.departNote}
                {!ROUND_TRIP.departConfirmed && (
                  <span style={{ color: STAMP, fontWeight: 500 }}> [출발 허브 확정 필요]</span>
                )}
              </span>
            </div>
            <div className="pl-5 mt-1.5 space-y-1" style={{ borderLeft: `1.5px dashed ${HAIRLINE}`, marginLeft: 6 }}>
              {timetable.map((t, idx) => (
                <div key={idx} className="pl-3 text-[12px]" style={{ color: INK, opacity: 0.7 }}>
                  {t.time} · {t.label}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 font-bold mt-1.5" style={{ color: INK, opacity: 0.7 }}>
              <span>🚕</span>
              <span>{ROUND_TRIP.stationTransferNote}</span>
            </div>
            <div className="flex items-center gap-2 font-bold mt-1.5" style={{ color: verdictMeta.color }}>
              <span>🕚</span>
              <span>
                {ROUND_TRIP.estimatedStationArrival} 수원역 도착 → 서울행 막차{" "}
                <b>{ROUND_TRIP.lastTrainTime}</b>
              </span>
            </div>
          </div>
          <div
            className="px-4 py-2.5 flex items-center justify-between text-white"
            style={{ backgroundColor: verdictMeta.color }}
          >
            <span className="text-sm font-black">{verdictMeta.label}</span>
            <span className="text-[11px] font-semibold opacity-90">
              막차까지 여유 약 {ROUND_TRIP.bufferMinutes}분 · {verdictMeta.sub}
            </span>
          </div>
        </div>
        <p className="text-[10.5px] -mt-8 mb-10" style={{ color: INK, opacity: 0.55 }}>
          ✓ 왕복 정보 전체 확인 완료 — 서울행 막차(23:31), 정지영커피→수원역 버스 15분(35번·13번) 전부 확정된 값입니다.
        </p>
      </section>

      {/* SPOTS */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: STAMP }}>Chapter 1</span>
          <div className="flex-1 h-px" style={{ backgroundColor: HAIRLINE }} />
          <span className="text-[11px] font-bold" style={{ color: INK, opacity: 0.5 }}>과몰입 촬영지 BEST 5</span>
        </div>

        <div className="space-y-16 sm:space-y-20">
          {spots.map((s) => (
            <article key={s.no}>
              {/* 스크랩북 스타일 사진 프레임 */}
              <div className="relative mb-5">
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-sm rotate-[-0.6deg]"
                  style={{ boxShadow: "0 10px 30px rgba(20,51,43,0.18)", border: `6px solid #fff` }}
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: s.imgPosition ?? "center" }}
                  />
                </div>
                {/* 우표/도장 넘버 배지 */}
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
                “{s.scene}”
              </p>

              <div className="space-y-3 text-[13px] leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 shrink-0" style={{ color: STAMP }} />
                  <span><b className="font-bold">시크릿 좌표.</b> {s.coord}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Car size={15} className="mt-0.5 shrink-0" style={{ color: STAMP }} />
                  <span><b className="font-bold">이동 · 주차.</b> {s.move}</span>
                </div>
                <div
                  className="flex items-start gap-2.5 p-4 rounded-md mt-4"
                  style={{ backgroundColor: PAPER_DEEP }}
                >
                  <Sparkles size={15} className="mt-0.5 shrink-0" style={{ color: TEAL }} />
                  <div>
                    <p className="font-bold mb-1" style={{ color: PINE }}>에디터 시크릿 꿀팁</p>
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
          <span className="text-[11px] font-bold" style={{ color: INK, opacity: 0.5 }}>현지인 찐맛집</span>
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
              <p><b className="font-bold">추천 메뉴.</b> {e.menu}</p>
              <p style={{ opacity: 0.8 }}><b className="font-bold" style={{ opacity: 1 }}>꿀팁.</b> {e.tip}</p>
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
          <span className="text-[11px] font-bold" style={{ color: INK, opacity: 0.5 }}>카페</span>
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
              <p><b className="font-bold">추천 메뉴.</b> {e.menu}</p>
              <p style={{ opacity: 0.8 }}><b className="font-bold" style={{ opacity: 1 }}>꿀팁.</b> {e.tip}</p>
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
          <span className="text-[11px] font-bold" style={{ color: INK, opacity: 0.5 }}>한눈에 보는 당일치기 타임테이블</span>
        </div>

        <div className="relative pl-7">
          <div className="absolute top-1 bottom-1 left-[7px] w-px" style={{ backgroundColor: HAIRLINE }} />
          <div className="space-y-7">
            {timetable.map((t, idx) => (
              <div key={idx} className="relative">
                <div
                  className="absolute -left-7 top-0.5 w-3.5 h-3.5 rounded-full border-2"
                  style={{ backgroundColor: PAPER, borderColor: STAMP }}
                />
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-black tabular-nums" style={{ color: STAMP, fontFamily: "'Noto Serif KR', serif" }}>{t.time}</span>
                  <span className="text-base font-bold" style={{ color: PINE }}>{t.emoji} {t.label}</span>
                </div>
                <p className="text-[13px] mt-1" style={{ opacity: 0.75 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 저장 — 구글맵으로 코스 받기 (개발지시서: 구글맵 권장, 이미지 저장은 후순위) */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8 mt-14">
        <a
          href={GOOGLE_MAPS_ROUTE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-sm border transition-colors"
          style={{ borderColor: HAIRLINE, color: PINE, backgroundColor: "#fff" }}
        >
          🗺️ 구글맵으로 코스 받기
        </a>
        <p className="text-[10.5px] text-center mt-2" style={{ color: INK, opacity: 0.5 }}>
          몽테드 카페부터 정지영 커피까지, 스팟 7곳 순서대로 길찾기가 열려요.
        </p>
      </section>

      {/* CLOSING — 다른 지역도 궁금하면 수요조사로 연결 */}
      <section className="max-w-xl mx-auto px-5 sm:px-8 mt-28 sm:mt-36 pb-40 sm:pb-44 text-center">
        <div className="w-10 h-px mx-auto mb-7" style={{ backgroundColor: STAMP }} />
        <p className="text-[11px] font-black tracking-[0.2em] uppercase mb-6" style={{ color: STAMP }}>
          ✦ 여기 없는 지역도 궁금하신가요
        </p>
        <h3
          className="text-2xl sm:text-3xl font-black mb-6 leading-snug"
          style={{ color: PINE, fontFamily: "'Noto Serif KR', serif" }}
        >
          원하는 지역도 이 코스처럼<br className="hidden sm:block" /> 막차까지 계산해서 만들어 드려요
        </h3>
        <p className="text-sm sm:text-[15px] leading-relaxed" style={{ color: INK, opacity: 0.65 }}>
          가고 싶은 지역이 궁금하면 알려주세요.<br className="hidden sm:block" /> 신청 많은 곳부터 순서대로 다음 이야기를 만들어요.
        </p>
      </section>

      {/* BOTTOM FIXED CTA BAR — 수요조사 폼으로 연결 (개인정보 직접 수집 안 함) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-5 py-4 shadow-2xl"
        style={{ backgroundColor: "#fff", borderTop: `1px solid ${HAIRLINE}` }}
      >
        <p className="text-center text-[11px] font-bold mb-2" style={{ color: PINE }}>
          여기 없는 지역도 이 코스처럼 만들어 드려요
        </p>
        <div className="flex items-center justify-center">
          <a
            href={SURVEY_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-md py-4 rounded-[14px] font-bold text-sm shadow-md transition-opacity hover:opacity-90 text-center"
            style={{ backgroundColor: STAMP, color: "#fff" }}
          >
            가고 싶은 곳 알려주기 →
          </a>
        </div>
      </div>
    </div>
  );
}
