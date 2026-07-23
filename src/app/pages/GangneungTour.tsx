import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, MapPin, Sparkles } from "lucide-react";
import LangFormModal from "@/app/components/LangFormModal";
import BrandLogo from "@/app/components/BrandLogo";

// TODO: 실제 강릉 스팟/맛집/카페 사진으로 교체 필요. 현재는 임시 placeholder 이미지 사용.
import gangneungPlaceholderImg from "@/assets/gangneung/placeholder.png";

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

// 왕복 판단 — 강릉은 아직 왕복 교통시간(KTX/버스)이 확정되지 않아 DRAFT 상태.
// 실제 이동시간이 확정되면 이 값을 채우고 수원 페이지처럼 GO/CARE 판정을 계산하면 됩니다.
const ROUND_TRIP_CONFIRMED = false;

type SpotItem = {
  no: string; emoji: string; tag: string; title: string; subtitle: string;
  scene: string; reality: string; coord: string; tip: string; caution: string; image: string;
};

const SPOTS: SpotItem[] = [
  {
    no: "01", emoji: "🌊", tag: "드라마 스팟", title: "주문진 방파제",
    subtitle: "도깨비 촬영지",
    scene: "도깨비와 지은탁의 운명적인 첫 만남이 이루어진 그 바다 방파제.",
    reality: "8년이 지난 지금도 팬들의 발걸음이 이어지는 성지. 방파제 끝에 서면 그 시절 OST가 절로 떠올라요.",
    coord: "강릉시 주문진읍 주문리 방파제 일대",
    tip: "방파제 끝 등대를 배경으로 뒷모습을 담으면 드라마 포스터 감성 구도가 완성돼요.",
    caution: "방파제는 바람이 세고 파도가 튈 수 있으니 노란 안전선 안쪽에서만 촬영해 주세요.",
    image: gangneungPlaceholderImg,
  },
  {
    no: "02", emoji: "🚄", tag: "드라마 스팟", title: "강릉역 플랫폼",
    subtitle: "도깨비 촬영지",
    scene: "지은탁이 KTX를 타고 강릉에 내리던 그 플랫폼 장면.",
    reality: "실제 운행 중인 KTX역이라 열차 시간표를 확인하고 방문하면 플랫폼 전경을 여유롭게 담을 수 있어요.",
    coord: "강릉시 강릉대로 715 강릉역",
    tip: "플랫폼 안내판과 함께 찍으면 '강릉' 지명이 또렷하게 나와 인증샷으로 딱이에요.",
    caution: "실제 열차 운행 구역이므로 승하차 승객과 안전요원 안내에 유의해 주세요.",
    image: gangneungPlaceholderImg,
  },
  {
    no: "03", emoji: "🌿", tag: "로컬 힐링 포인트", title: "경포호 산책길",
    subtitle: "호수 둘레길",
    scene: "현지인들이 아침마다 즐기는 호수 둘레 힐링 산책 코스.",
    reality: "벚꽃, 소나무, 잔잔한 호수가 어우러진 산책로. 이른 아침에 걸으면 물안개까지 볼 수 있어요.",
    coord: "강릉시 경포호 순환도로 일대",
    tip: "호수 건너편 소나무 숲을 배경으로 담으면 잔잔한 수면 반사가 살아나요.",
    caution: "자전거 도로와 산책로가 함께 있으니 이동 시 자전거 통행에 주의해 주세요.",
    image: gangneungPlaceholderImg,
  },
  {
    no: "04", emoji: "🧱", tag: "문화유산", title: "오죽헌",
    subtitle: "500년 고택",
    scene: "500년 된 검은 대나무 숲과 5만원권 신사임당의 생가가 함께하는 고즈넉한 한옥.",
    reality: "보물로 지정된 조선 초기 건축물. 대나무 숲길을 걷다 보면 신사임당·율곡 이이의 흔적을 곳곳에서 만날 수 있어요.",
    coord: "강릉시 율곡로3139번길 24 오죽헌",
    tip: "검은 대나무(오죽) 숲길 한가운데서 위로 올려다보듯 찍으면 대나무의 색감이 가장 선명하게 나와요.",
    caution: "문화유산 보호구역이므로 대나무를 꺾거나 만지지 않도록 주의해 주세요.",
    image: gangneungPlaceholderImg,
  },
];

type EatItem = {
  section: "food" | "cafe"; emoji: string; category: string; title: string;
  coord: string; tip: string; view: string; image: string;
};

const EATS: EatItem[] = [
  {
    section: "food", emoji: "🐟", category: "점심 · 물회", title: "주문진 항구 물회",
    coord: "강릉 주문진읍 주문진항 일대",
    tip: "주말 점심에는 웨이팅이 있으니 12시 이전 방문을 추천해요.",
    view: "방파제 산책으로 떨어진 당과 체력을 단번에 올려줄 새콤달콤 동해 활어 물회.",
    image: gangneungPlaceholderImg,
  },
  {
    section: "cafe", emoji: "☕", category: "카페 · 오션뷰", title: "안목해변 커피거리",
    coord: "강릉시 창해로 14 안목해변 일대",
    tip: "일몰 30분 전 도착하면 노을과 함께 커피를 즐길 수 있어요.",
    view: "파도 소리를 들으며 즐기는 강릉 대표 커피 명소. 해변을 따라 늘어선 카페마다 색다른 오션뷰가 펼쳐져요.",
    image: gangneungPlaceholderImg,
  },
];

type TimetableItem = { time: string; emoji: string; label: string; desc: string };

// 참고용 제안 동선 — 왕복 교통시간이 아직 확정되지 않아 "판정"이 아닌 "참고 일정"으로만 안내합니다.
const TIMETABLE: TimetableItem[] = [
  { time: "09:00", emoji: "🌊", label: "주문진 방파제", desc: "인파 몰리기 전 이른 아침, 도깨비 첫 만남 장소에서 사진 찍기" },
  { time: "10:30", emoji: "🚄", label: "강릉역 플랫폼", desc: "지은탁이 내리던 그 플랫폼에서 인증샷 남기기" },
  { time: "12:00", emoji: "🐟", label: "주문진 항구 물회", desc: "동해 앞바다 활어로 만든 새콤달콤 물회로 든든한 점심" },
  { time: "14:00", emoji: "🌿", label: "경포호 산책길", desc: "잔잔한 호수를 따라 걷는 여유로운 힐링 산책" },
  { time: "16:00", emoji: "🧱", label: "오죽헌 & 안목해변 커피거리", desc: "500년 대나무 숲 산책 후 바다 보며 커피 한 잔으로 마무리" },
];

export default function GangneungTour() {
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
          <img src={gangneungPlaceholderImg} alt="강릉 주문진 방파제" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,51,43,0.75), rgba(20,51,43,0.05) 55%)" }} />
          <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 pb-8 sm:pb-10">
            <div className="max-w-2xl mx-auto">
              <span
                className="inline-block text-[11px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full mb-4"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)" }}
              >
                📍 강릉 · 주문진 · 당일치기 코스
              </span>
              <h1
                className="text-[28px] sm:text-[38px] leading-[1.25] font-black text-white"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                강릉에서 만나는<br />〈도깨비〉 10주년 로드맵
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* INTRO */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14">
        <p className="text-sm sm:text-base font-bold mb-8" style={{ color: STAMP }}>
          8년이 지나도 사라지지 않는 그 바다, 강릉 주문진 로드맵
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
            주문진 방파제부터 오죽헌까지 — 도깨비 성지와 동해안 힐링 스팟을 한 번에 도는 코스.
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
                왕복 교통시간(KTX·버스) 확인 전 — 위 일정은 참고용 제안이에요
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
