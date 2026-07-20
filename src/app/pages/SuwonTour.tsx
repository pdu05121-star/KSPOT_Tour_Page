import { Link } from "react-router";
import { ChevronLeft, MapPin, Car, Sparkles } from "lucide-react";
import { SURVEY_FORM_URL } from "@/app/surveyConfig";

// Local Image Imports (동일한 수원 에셋 재사용)
import janganmunNightImg from "@/assets/carousel/janganmun_night.jpg";
import sunjaeSiljaImg from "@/assets/carousel/sunjae_silja.jpg";
import suwonHongwhamunImg from "@/assets/suwon/suwon_hongwhamun.jpg";
import bangwhasuryujeongPicnicImg from "@/assets/suwon/bangwhasuryujeong_picnic.jpg";
import nammanTongdakImg from "@/assets/suwon/namman_tongdak.jpg";
import jeongjiyoungLatteImg from "@/assets/suwon/jeongjiyoung_latte.jpg";

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

// 왕복 판단 프레임 — 값은 전부 예시(placeholder).
// 실제 값은 마스터 코스 템플릿(막차·소요시간 확정본)이 나오면 교체.
// course_detail.html 시안의 "목차형 왕복 프레임" — KSPOT 핵심 기능이라 최우선 반영.
const ROUND_TRIP = {
  departTime: "08:40",
  departNote: "서울역 · 1호선 약 55분 [예시 — 템플릿 확정 전]",
  lastTrainTime: "23:12",
  lastTrainNote: "수원역 → 서울행 막차 [예시]",
  bufferMinutes: 277,
  verdict: "GO" as const,
};
const GO_GREEN = "#2F7D5B"; // 판단 신호는 서브 브랜드와 무관하게 전면 공통 색 유지

const spots = [
  {
    no: "01",
    emoji: "🎬",
    title: "몽테드 골목",
    subtitle: "솔이네 & 선재네 집 골목",
    scene: "선재가 매일 밤 솔이 몰래 지켜보던 그 골목. 소나기 우산씬이 시작된 자리.",
    coord: "수원시 팔달구 화서문로48번길 일대 (화성행궁 도보 5분)",
    move: "화성행궁 정문에서 도보 5분. 근처 노상주차는 협소하니 화성행궁 노상주차장 이용 추천.",
    goldenHour: "오전 10시 이전 방문 시 골목이 한산해요. 대문 정면보다 골목 아래에서 위로 올려다보듯(0.5배 광각) 찍으면 드라마 포스터 구도가 나옵니다.",
    caution: "실제 거주지라 셔터음은 무음으로, 오전 10시~오후 6시 사이 매너 방문 필수예요.",
    image: sunjaeSiljaImg,
  },
  {
    no: "02",
    emoji: "🚲",
    title: "화홍문 징검다리",
    subtitle: "화홍문 & 방화수류정 돌다리",
    scene: "19살 솔과 선재가 자전거를 끌고 함께 건너던 그 징검다리. 이어폰 꽂으면 자동으로 '소나기'가 재생되는 구간.",
    coord: "수원시 팔달구 매향동 수원천로392번길 44-6",
    move: "몽테드 골목에서 도보 12분. '화홍문 공영주차장'이 하루 최대 3,500원으로 가장 편해요.",
    goldenHour: "수원천 건너편 둔치로 내려가서, 다리를 건너는 뒷모습과 화홍문 누각을 한 앵글에 담아보세요.",
    caution: "발밑 물가가 미끄러울 수 있어요 — 사진에 몰입하다 보면 꼭 한 명은 발을 헛디딥니다.",
    image: suwonHongwhamunImg,
  },
  {
    no: "03",
    emoji: "🌿",
    title: "방화수류정 피크닉",
    subtitle: "용연 연못가 로컬 힐링 스팟",
    scene: "드라마엔 안 나오지만 몽테드 골목에서 도보 7분, 수원 사람들의 영원한 힐링 아지트.",
    coord: "수원시 팔달구 수원천로 392",
    move: "돗자리 하나면 충분. 근처 편의점에서 간단한 간식 사서 들어가는 걸 추천해요.",
    goldenHour: "일몰 30분 전 도착이 황금 타이밍 — 연못 건너편에서 정자가 물에 데칼코마니처럼 비치는 각도가 정석입니다.",
    caution: "밤에는 성곽 라이트업으로 낮과 완전히 다른 얼굴이 돼요. 노을과 야경 둘 다 노린다면 여유롭게 1시간은 잡아두세요.",
    image: bangwhasuryujeongPicnicImg,
  },
];

const eats = [
  {
    emoji: "🍗",
    category: "로컬 맛집 · 통닭",
    title: "수원 왕갈비 통닭",
    coord: "수원 팔달구 남문 치킨 골목 일대",
    menu: "왕갈비 통닭 (2인 기준 약 2.3만원)",
    tip: "오후 1시 30분 이후 방문하거나, 원격 줄서기 앱으로 미리 이름 올려두세요.",
    view: "성곽길 걷느라 떨어진 당을 채우기 딱 좋은 위치 — 골목 안쪽 자리가 대기 없이 빠르게 앉을 수 있어요.",
    image: nammanTongdakImg,
  },
  {
    emoji: "☕",
    category: "루프탑 카페",
    title: "정지영 커피 로스터즈",
    coord: "수원 팔달구 행리단길 내 루프탑",
    menu: "시그니처 라떼 + 성곽뷰 루프탑 좌석",
    tip: "일몰 40분 전 도착해서 루프탑 야외 자리를 미리 찜해두는 게 핵심이에요.",
    view: "관광객들이 몰리는 카페 대신, 현지인들이 노을 보러 가는 진짜 숨은 명소.",
    image: jeongjiyoungLatteImg,
  },
];

const timetable = [
  { time: "11:00", emoji: "🏃‍♂️", label: "몽테드 골목", desc: "인파 몰리기 전 대문 앞 인증샷부터 호다닥" },
  { time: "12:30", emoji: "🍗", label: "왕갈비 통닭", desc: "뷰 명당 자리에서 든든한 점심" },
  { time: "14:30", emoji: "🚲", label: "화홍문 징검다리", desc: "OST 들으며 19살 감성으로 징검다리 건너기" },
  { time: "16:00", emoji: "🛍️", label: "행리단길 · 벽화골목", desc: "골목 구경하며 소품샵 득템" },
  { time: "17:30", emoji: "🌅", label: "정지영 커피", desc: "루프탑에서 노을 보며 완벽하게 마무리" },
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
          아직도 사람 바글바글한 전주·경주만 가? '선업튀' 찐팬들만 아는 임솔♥류선재 타임슬립 성지 루트
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
              <span>{ROUND_TRIP.departTime} 출발 · {ROUND_TRIP.departNote}</span>
            </div>
            <div className="pl-5 mt-1.5 space-y-1" style={{ borderLeft: `1.5px dashed ${HAIRLINE}`, marginLeft: 6 }}>
              {timetable.map((t, idx) => (
                <div key={idx} className="pl-3 text-[12px]" style={{ color: INK, opacity: 0.7 }}>
                  {t.time} · {t.label}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 font-bold mt-1.5" style={{ color: "#92400E" }}>
              <span>🕚</span>
              <span>{ROUND_TRIP.lastTrainNote} {ROUND_TRIP.lastTrainTime}</span>
            </div>
          </div>
          <div
            className="px-4 py-2.5 flex items-center justify-between text-white"
            style={{ backgroundColor: GO_GREEN }}
          >
            <span className="text-sm font-black">✓ {ROUND_TRIP.verdict}</span>
            <span className="text-[11px] font-semibold opacity-90">
              막차까지 여유 {ROUND_TRIP.bufferMinutes}분 · 무사히 귀환
            </span>
          </div>
        </div>
        <p className="text-[10.5px] -mt-8 mb-10" style={{ color: INK, opacity: 0.55 }}>
          ⚠️ 시각·여유시간은 마스터 코스 템플릿 확정 전 예시값입니다. 실제 배차·막차는 현지 사정에 따라 달라질 수 있어요.
        </p>
      </section>

      {/* SPOTS */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: STAMP }}>Chapter 1</span>
          <div className="flex-1 h-px" style={{ backgroundColor: HAIRLINE }} />
          <span className="text-[11px] font-bold" style={{ color: INK, opacity: 0.5 }}>과몰입 촬영지 BEST 3</span>
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
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                </div>
                {/* 우표/도장 넘버 배지 */}
                <div
                  className="absolute -top-4 -right-3 sm:-right-5 w-16 h-16 rounded-full flex flex-col items-center justify-center rotate-[8deg]"
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

      {/* EAT & DRINK */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8 mt-20 sm:mt-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: STAMP }}>Chapter 2</span>
          <div className="flex-1 h-px" style={{ backgroundColor: HAIRLINE }} />
          <span className="text-[11px] font-bold" style={{ color: INK, opacity: 0.5 }}>현지인 찐맛집 & 카페</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-6">
          {eats.map((e, idx) => (
            <div key={idx}>
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-sm mb-4"
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
        </div>
      </section>

      {/* TIMETABLE */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8 mt-20 sm:mt-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: STAMP }}>Chapter 3</span>
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
        className="fixed bottom-0 left-0 right-0 z-50 px-5 py-5 flex items-center justify-center shadow-2xl"
        style={{ backgroundColor: "#fff", borderTop: `1px solid ${HAIRLINE}` }}
      >
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
  );
}
