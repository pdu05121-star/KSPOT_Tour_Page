import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, MapPin, Sparkles } from "lucide-react";
import LangFormModal from "@/app/components/LangFormModal";
import BrandLogo from "@/app/components/BrandLogo";

// TODO: 실제 춘천 스팟/맛집/카페 사진으로 교체 필요. 현재는 임시 placeholder 이미지 사용.
import chuncheonPlaceholderImg from "@/assets/chuncheon/placeholder.png";

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

const WARN_AMBER = "#B8893A";

// 왕복 판단 — 춘천은 아직 왕복 교통시간(열차/버스)이 확정되지 않아 DRAFT 상태.
// 실제 이동시간이 확정되면 이 값을 채우고 수원 페이지처럼 GO/CARE 판정을 계산하면 됩니다.
const ROUND_TRIP_CONFIRMED = false;

type SpotItem = {
  no: string; emoji: string; tag: string; title: string; subtitle: string;
  scene: string; reality: string; coord: string; tip: string; caution: string; image: string;
};

const SPOTS: SpotItem[] = [
  {
    no: "01", emoji: "🚲", tag: "드라마 스팟", title: "남이섬 메타세쿼이아길",
    subtitle: "겨울연가 촬영지",
    scene: "겨울연가 배용준·최지우가 자전거를 타고 달리던 그 낭만적인 가로수길.",
    reality: "사계절 내내 사랑받는 남이섬 대표 포토존. 겨울엔 눈꽃, 가을엔 단풍이 가로수길을 가득 채워요.",
    coord: "춘천시 남산면 남이섬길 1 남이섬 내 메타세쿼이아길",
    tip: "가로수 한가운데 서서 길게 뻗은 길을 따라 소실점 구도로 찍으면 드라마 장면과 똑같은 앵글이 나와요.",
    caution: "남이섬은 배편 입장이라 마지막 배 시간을 미리 확인하고 여유 있게 이동해 주세요.",
    image: chuncheonPlaceholderImg,
  },
  {
    no: "02", emoji: "🏃‍♀️", tag: "드라마 스팟", title: "춘천대교 & 공지천",
    subtitle: "스물다섯 스물하나 촬영지",
    scene: "스물다섯 스물하나 나희도와 백이진이 함께 달리던 강변 러닝 코스.",
    reality: "의암호를 따라 이어지는 산책·러닝 코스. 노을 질 무렵 강물에 비치는 다리 조명이 특히 아름다워요.",
    coord: "춘천시 근화동 공지천 산책로 일대",
    tip: "춘천대교를 배경으로 강변 산책로를 따라 달리는 듯한 역동적인 뒷모습 컷을 찍어보세요.",
    caution: "강변 산책로는 자전거·러너와 동선이 겹치니 사진 찍을 땐 잠시 가장자리로 비켜서 주세요.",
    image: chuncheonPlaceholderImg,
  },
  {
    no: "03", emoji: "🌿", tag: "로컬 힐링 포인트", title: "소양강 스카이워크",
    subtitle: "유리 바닥 호수 산책",
    scene: "수면 위 유리 바닥을 걸으며 즐기는 짜릿한 호수 산책.",
    reality: "발밑으로 소양강이 그대로 내려다보이는 유리 다리. 짧지만 강렬한 포인트로 인기가 많아요.",
    coord: "춘천시 근화동 소양강 스카이워크",
    tip: "유리 바닥 위에 서서 발과 강물이 함께 나오게 아래쪽 앵글로 찍으면 스릴 넘치는 사진이 나와요.",
    caution: "우천 시 바닥이 미끄러울 수 있어 슬리퍼보다는 운동화 착용을 추천드려요.",
    image: chuncheonPlaceholderImg,
  },
  {
    no: "04", emoji: "🚴", tag: "로컬 힐링 포인트", title: "김유정역 레일바이크",
    subtitle: "폐선로 레트로 라이딩",
    scene: "경춘선 옛 폐선로를 따라 페달을 밟으며 달리는 레트로 감성 라이딩.",
    reality: "더 이상 기차가 다니지 않는 옛 철길을 레일바이크로 달리는 이색 체험. 터널 구간에서는 조명쇼도 즐길 수 있어요.",
    coord: "춘천시 신동면 김유정역길 1 김유정역 레일바이크",
    tip: "터널 진입 전, 옛 철길 표지판과 레일바이크를 함께 담으면 레트로한 감성 사진이 완성돼요.",
    caution: "회차별 정원과 출발 시간이 정해져 있으니 미리 온라인 예약을 추천드려요.",
    image: chuncheonPlaceholderImg,
  },
  {
    no: "05", emoji: "🌸", tag: "로컬 힐링 포인트", title: "아침고요수목원",
    subtitle: "사계절 정원 산책",
    scene: "사계절 내내 다른 얼굴을 보여주는 화려한 꽃 정원 산책.",
    reality: "춘천 동선에 포함되는 가평의 대표 정원. 계절마다 테마 정원이 바뀌어 언제 가도 새로운 풍경을 만날 수 있어요.",
    coord: "가평군 상면 수목원로 432 아침고요수목원",
    tip: "정원 중앙 분수대를 배경으로 계절 꽃이 가득한 화단을 함께 담으면 화보 같은 사진이 나와요.",
    caution: "야간 개장 시즌(오색별빛정원전)에는 조명 연출이 다르니 방문 전 운영 시간을 확인해 주세요.",
    image: chuncheonPlaceholderImg,
  },
];

type EatItem = {
  section: "food" | "cafe"; emoji: string; category: string; title: string;
  coord: string; tip: string; view: string; image: string;
};

const EATS: EatItem[] = [
  {
    section: "food", emoji: "🍗", category: "점심 · 닭갈비", title: "춘천 명동닭갈비골목",
    coord: "춘천시 명동길 닭갈비골목 일대",
    tip: "주말 점심에는 웨이팅이 있으니 11시 30분 이전 방문을 추천해요.",
    view: "레일바이크 라이딩으로 떨어진 당과 체력을 단번에 올려줄 매콤 달콤 춘천 원조 닭갈비.",
    image: chuncheonPlaceholderImg,
  },
  {
    section: "cafe", emoji: "☕", category: "카페 · 마무리", title: "강촌 막국수 카페",
    coord: "춘천시 남산면 강촌로 일대",
    tip: "여름철 성수기에는 대기 시간이 길 수 있어 오후 4시 이전 방문을 추천해요.",
    view: "시원한 막국수와 감성 커피를 한 공간에서 즐기는 강촌의 이색 로컬 카페.",
    image: chuncheonPlaceholderImg,
  },
];

type TimetableItem = { time: string; emoji: string; label: string; desc: string };

// 참고용 제안 동선 — 왕복 교통시간이 아직 확정되지 않아 "판정"이 아닌 "참고 일정"으로만 안내합니다.
const TIMETABLE: TimetableItem[] = [
  { time: "09:00", emoji: "🚲", label: "남이섬 메타세쿼이아길", desc: "인파 몰리기 전 이른 배편으로 입도해 가로수길 사진 찍기" },
  { time: "10:30", emoji: "🏃‍♀️", label: "춘천대교 & 공지천", desc: "강변을 따라 걸으며 러닝 씬 인증샷 남기기" },
  { time: "12:00", emoji: "🍗", label: "명동닭갈비골목", desc: "매콤 달콤 원조 닭갈비로 든든한 점심" },
  { time: "14:00", emoji: "🌿", label: "소양강 스카이워크", desc: "유리 바닥 위를 걸으며 호수 전망 즐기기" },
  { time: "15:30", emoji: "🚴", label: "김유정역 레일바이크", desc: "폐선로 따라 달리는 레트로 라이딩" },
  { time: "17:00", emoji: "🌸", label: "아침고요수목원 & 강촌 막국수 카페", desc: "꽃 정원 산책 후 막국수와 커피로 하루 마무리" },
];

export default function ChuncheonTour() {
  const [formModalOpen, setFormModalOpen] = useState(false);
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
            <span className="hidden sm:inline">다른 투어 보기</span>
          </Link>
          <Link to="/">
            <BrandLogo size={22} />
          </Link>
          <div style={{ width: 60 }} />
        </div>
      </nav>

      {/* HERO */}
      <header className="relative">
        <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden">
          <img src={chuncheonPlaceholderImg} alt="춘천 남이섬 메타세쿼이아길" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,51,43,0.75), rgba(20,51,43,0.05) 55%)" }} />
          <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 pb-8 sm:pb-10">
            <div className="max-w-2xl mx-auto">
              <span
                className="inline-block text-[11px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full mb-4"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)" }}
              >
                📍 춘천 · 남이섬 · 당일치기 코스
              </span>
              <h1
                className="text-[28px] sm:text-[38px] leading-[1.25] font-black text-white"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                춘천에서 만나는<br />〈겨울연가〉·〈스물다섯 스물하나〉 로드맵
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* INTRO */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14">
        <p className="text-sm sm:text-base font-bold mb-8" style={{ color: STAMP }}>
          레트로와 청춘이 공존하는 춘천 당일치기 로드맵
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
            남이섬 가로수길부터 소양강 스카이워크까지 — 드라마 성지와 로컬 힐링 스팟을 한 번에 도는 코스.
          </p>
        </blockquote>

        {/* 왕복 판단 프레임 — 아직 DRAFT */}
        <div
          className="rounded-md overflow-hidden mb-10"
          style={{ border: `1px solid ${HAIRLINE}` }}
        >
          <div
            className="px-4 py-3 text-sm font-black flex items-center gap-2"
            style={{ backgroundColor: PAPER_DEEP, color: PINE }}
          >
            오늘 일정 한눈에
          </div>
          <div className="px-4 py-3.5 text-[13px] leading-relaxed" style={{ color: INK }}>
            <div className="pl-1 space-y-1">
              {TIMETABLE.map((tt, idx) => (
                <div key={idx} className="text-[12px]" style={{ color: INK, opacity: 0.7 }}>
                  {tt.time} · {tt.emoji} {tt.label}
                </div>
              ))}
            </div>
          </div>

          {/* 판정 결과 — 왕복 교통시간 미확정 */}
          {!ROUND_TRIP_CONFIRMED && (
            <div
              className="px-4 py-2.5 flex items-center justify-between text-white"
              style={{ backgroundColor: WARN_AMBER }}
            >
              <span className="text-sm font-black">◐ DRAFT</span>
              <span className="text-[11px] font-semibold opacity-90">
                왕복 교통시간(열차·버스) 확인 전 — 위 일정은 참고용 제안이에요
              </span>
            </div>
          )}
        </div>
      </section>

      {/* SPOTS */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: STAMP }}>Chapter 1</span>
          <div className="flex-1 h-px" style={{ backgroundColor: HAIRLINE }} />
          <span className="text-[11px] font-bold" style={{ color: INK, opacity: 0.5 }}>과몰입 촬영지 & 로컬 힐링 포인트</span>
        </div>

        <div className="space-y-16 sm:space-y-20">
          {SPOTS.map((s) => (
            <article key={s.no}>
              <div className="relative mb-5">
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-sm rotate-[-0.6deg]"
                  style={{ boxShadow: "0 10px 30px rgba(20,51,43,0.18)", border: `6px solid #fff` }}
                >
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
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
                  <span><b className="font-bold">시크릿 좌표.</b> {s.coord}</span>
                </div>
                <div
                  className="flex items-start gap-2.5 p-4 rounded-md mt-4"
                  style={{ backgroundColor: PAPER_DEEP }}
                >
                  <Sparkles size={15} className="mt-0.5 shrink-0" style={{ color: TEAL }} />
                  <div>
                    <p className="font-bold mb-1" style={{ color: PINE }}>에디터 시크릿 꿀팁</p>
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
          <span className="text-[11px] font-bold" style={{ color: INK, opacity: 0.5 }}>현지인 찐맛집</span>
        </div>

        {EATS.filter((e) => e.section === "food").map((e, idx) => (
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
              <p style={{ opacity: 0.8 }}>{e.view}</p>
              <p style={{ opacity: 0.8 }}><b className="font-bold" style={{ opacity: 1 }}>꿀팁.</b> {e.tip}</p>
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

        {EATS.filter((e) => e.section === "cafe").map((e, idx) => (
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
              <p style={{ opacity: 0.8 }}>{e.view}</p>
              <p style={{ opacity: 0.8 }}><b className="font-bold" style={{ opacity: 1 }}>꿀팁.</b> {e.tip}</p>
            </div>
          </div>
        ))}
      </section>

      {/* TIMETABLE */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8 mt-20 sm:mt-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: STAMP }}>Chapter 4</span>
          <div className="flex-1 h-px" style={{ backgroundColor: HAIRLINE }} />
          <span className="text-[11px] font-bold" style={{ color: INK, opacity: 0.5 }}>한눈에 보는 참고 동선</span>
        </div>
        <p className="text-[11px] mb-6" style={{ color: INK, opacity: 0.55 }}>
          ※ 왕복 교통시간이 아직 확정되지 않아, 아래 시간은 참고용 제안 동선입니다. 실제 왕복 판정은 이동시간 확정 후 업데이트됩니다.
        </p>

        <div className="relative pl-7">
          <div className="absolute top-1 bottom-1 left-[7px] w-px" style={{ backgroundColor: HAIRLINE }} />
          <div className="space-y-7">
            {TIMETABLE.map((tt, idx) => (
              <div key={idx} className="relative">
                <div
                  className="absolute -left-7 top-0.5 w-3.5 h-3.5 rounded-full border-2"
                  style={{ backgroundColor: PAPER, borderColor: STAMP }}
                />
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

      {/* BOTTOM FIXED CTA BAR */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-5 py-4 shadow-2xl"
        style={{ backgroundColor: "#fff", borderTop: `1px solid ${HAIRLINE}` }}
      >
        <p className="text-center text-[11px] font-bold mb-2" style={{ color: PINE }}>
          여기 없는 지역도 이 코스처럼 만들어 드려요
        </p>
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => setFormModalOpen(true)}
            className="w-full max-w-md py-4 rounded-[14px] font-bold text-sm shadow-md transition-opacity hover:opacity-90 text-center"
            style={{ backgroundColor: STAMP, color: "#fff" }}
          >
            요청하기 →
          </button>
        </div>
      </div>

      <LangFormModal open={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </div>
  );
}
