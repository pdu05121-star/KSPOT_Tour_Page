import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronLeft, MapPin, Sparkles } from "lucide-react";
import LangFormModal from "@/app/components/LangFormModal";
import BrandLogo from "@/app/components/BrandLogo";
import { trackEvent } from "@/app/analytics";

// TODO: 실제 정동진 스팟/맛집/카페 사진으로 교체 필요. 현재는 임시 placeholder 이미지 사용.
import jeongdongjinPlaceholderImg from "@/assets/jeongdongjin/placeholder.png";

// ─────────────────────────────────────────────
// 디자인 토큰 — "KSPOT Travelog" 서브 브랜드 팔레트 (GangneungTour.tsx와 동일 체계)
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

// 왕복 판단 — 정동진은 아직 왕복 이동시간이 팀 최종 확정 전이라 DRAFT 상태.
// 2026-07-28 조사: 서울역↔정동진역 KTX-이음 직통 시간표는 확인 완료(출처: train.asamaru.net, 2026-07-28 조회 —
// 서울역 첫차 10:59 출발/13:07 도착 KTX-이음 843, 정동진역 막차 22:00 출발/00:12 도착 KTX-이음 848,
// 하루 왕복 4회뿐). 남은 미확정: 심곡항↔헌화로 실제 도보 거리, 스팟별 운영시간·휴무.
// ⚠️ 정동진 직통 KTX는 하루 4회뿐이라 첫차 도착이 13:07로 늦음 — 강릉역 경유(첫차 05:06)로 더 일찍 출발하는
// 대안이 있는지는 팀이 별도 확인 필요.
const ROUND_TRIP_CONFIRMED = false;
// 출발/귀환 허브 — 서울역 (KTX-이음 정동진역 직통 기준).
const HUB_STATION = "서울역";

type SpotItem = {
  no: string; emoji: string; tag: string; title: string; subtitle: string;
  scene: string; reality: string; coord: string; tip: string; caution: string; image: string;
};

const SPOTS: SpotItem[] = [
  {
    no: "01", emoji: "🌄", tag: "로컬 힐링 포인트", title: "정동진역 · 모래시계공원",
    subtitle: "한국에서 해가 가장 먼저 뜨는 곳",
    scene: "1995년 드라마 〈모래시계〉의 짧은 한 장면으로 전국구 관광지가 된 바닷가 간이역.",
    reality: "기차역이 해변과 가장 가까운 곳으로 기네스에 오른 곳. 모래시계나무(일명 '고현정 소나무')와 시간박물관이 있어요. 도깨비·BTS만큼 해외 팬덤 인지도는 없어 드라마 태그 없이 로컬 명소로 소개해요.",
    coord: "강원 강릉시 강동면 정동진리 (정동진역)",
    tip: "역 플랫폼에서 바다 쪽으로 바로 나오면 소나무와 철길, 파도를 한 프레임에 담을 수 있어요.",
    caution: "일출 시간대엔 사람이 몰리니, KTX 도착 직후 바로 방문하면 비교적 한산해요.",
    image: jeongdongjinPlaceholderImg,
  },
  {
    no: "02", emoji: "💌", tag: "드라마 스팟", title: "심곡항",
    subtitle: "남자친구 촬영지",
    scene: "송혜교·박보검 주연 tvN 〈남자친구〉 촬영지 — 강릉시 공식 관광포털 'TV속 강릉'에 등재된 촬영지.",
    reality: "정동진 바로 아래, 헌화로 초입에 있는 작은 어촌 항구. 방영 당시 전 세계 100개국 넘게 선판매될 만큼 두 주연의 해외 인지도가 높은 작품이에요.",
    coord: "강원 강릉시 강동면 헌화로 648-8",
    tip: "항구 방파제 끝에서 헌화로 절벽길을 배경으로 담으면 드라마 속 로맨틱한 구도가 나와요.",
    caution: "항구 특성상 바닥이 미끄러울 수 있고 어선 작업이 있을 수 있으니 통행에 주의해 주세요.",
    image: jeongdongjinPlaceholderImg,
  },
  {
    no: "03", emoji: "🚗", tag: "드라마 스팟", title: "헌화로 (심곡항~금진해변)",
    subtitle: "시그널 촬영지",
    scene: "바다를 바로 옆에 끼고 내달리는 〈시그널〉 마지막 회 엔딩 장면 — 트래비 매거진 등 복수 매체로 확인된 촬영지.",
    reality: "심곡항과 금진해변을 잇는, 바다와 가장 가까운 해안 드라이브 길로 꼽혀요. 이제훈·김혜수·조진웅 주연으로 일본·중국·태국에서 리메이크될 만큼 해외에서도 인정받은 작품이에요.",
    coord: "강원 강릉시 강동면 헌화로 일대 (심곡항~금진해변 구간)",
    tip: "도로 옆 정동심곡 바다부채길 전망대에서 내려다보면 드라마 속 앵글과 비슷한 해안선을 담을 수 있어요.",
    caution: "차량 통행이 있는 실제 도로이니, 사진은 지정된 전망대·인도에서만 찍어 주세요.",
    image: jeongdongjinPlaceholderImg,
  },
];

type EatItem = {
  section: "food" | "cafe"; emoji: string; category: string; title: string;
  coord: string; tip: string; view: string; image: string;
};

const EATS: EatItem[] = [
  {
    section: "food", emoji: "🍲", category: "점심 · 순두부", title: "정동진초당순두부",
    coord: "강원도 강릉시 강동면 헌화로 1096",
    tip: "이른 새벽부터 늦은 밤까지 영업(연중무휴)하지만, 방문 전 전화(033-644-8853)로 재확인 권장.",
    view: "정동진 해수욕장 바로 근처, 구수한 국물 맛으로 입소문난 시골 순두부 전문점.",
    image: jeongdongjinPlaceholderImg,
  },
  {
    section: "cafe", emoji: "🚢", category: "카페 · 오션뷰", title: "썬크루즈 스카이라운지",
    coord: "강원도 강릉시 강동면 헌화로 950-39",
    tip: "입장료(약 5,000원)의 절반은 음료 값으로 차감돼요. 회전식 라운지라 자리에서 바다 전망이 360도로 바뀌어요.",
    view: "절벽 위에 크루즈선 모양으로 지어진 정동진의 랜드마크 리조트. 스카이라운지에서 동해를 한눈에 내려다볼 수 있어요.",
    image: jeongdongjinPlaceholderImg,
  },
];

type TimetableItem = { time: string; emoji: string; label: string; desc: string };

// 참고용 제안 동선 — 왕복 KTX 시간표는 실측 반영했지만, 스팟 간 이동시간·운영시간은 아직 팀 최종 확인 전이라
// "판정"이 아닌 "참고 일정"으로만 안내합니다.
const TIMETABLE: TimetableItem[] = [
  { time: "10:59", emoji: "🚄", label: `${HUB_STATION} 출발`, desc: "KTX-이음 843 탑승 (실제 시간표 기준 — 정동진행 하루 4회 중 첫차)" },
  { time: "13:07", emoji: "🚄", label: "정동진역 도착", desc: "역에서 바로 모래시계공원 도보 이동" },
  { time: "13:20", emoji: "🌄", label: "정동진역 · 모래시계공원", desc: "역 바로 앞, 소나무·철길 사진 찍기" },
  { time: "14:00", emoji: "🍲", label: "정동진초당순두부", desc: "순두부로 늦은 점심" },
  { time: "15:00", emoji: "💌", label: "심곡항", desc: "헌화로 초입, 남자친구 촬영지 방파제 산책" },
  { time: "16:00", emoji: "🚗", label: "헌화로 (심곡항~금진해변)", desc: "시그널 엔딩 촬영지, 바다부채길 전망대 드라이브" },
  { time: "17:30", emoji: "🚢", label: "썬크루즈 스카이라운지", desc: "절벽 위 카페에서 동해 오션뷰로 마무리" },
  { time: "19:00", emoji: "🚄", label: "정동진역 도착", desc: "도보·택시로 환승 이동" },
  { time: "19:32", emoji: "🚄", label: `${HUB_STATION} 방향 출발`, desc: "KTX-이음 846 탑승 (실제 시간표 기준)" },
  { time: "21:49", emoji: "🏠", label: `${HUB_STATION} 도착`, desc: "귀환 (KTX 시간은 실측 반영, 스팟 간 이동시간은 팀 확인 필요)" },
];

export default function JeongdongjinTour() {
  const [formModalOpen, setFormModalOpen] = useState(false);

  useEffect(() => {
    trackEvent('tour_detail_view', { region: 'jeongdongjin' });
  }, []);

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
          <img src={jeongdongjinPlaceholderImg} alt="정동진 심곡항" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,51,43,0.75), rgba(20,51,43,0.05) 55%)" }} />
          <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 pb-8 sm:pb-10">
            <div className="max-w-2xl mx-auto">
              <span
                className="inline-block text-[11px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full mb-4"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)" }}
              >
                📍 강릉 정동진 · 당일치기 코스
              </span>
              <h1
                className="text-[28px] sm:text-[38px] leading-[1.25] font-black text-white"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                정동진에서 만나는<br />남자친구·시그널, 그리고 그 해돋이
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* INTRO */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14">
        <p className="text-sm sm:text-base font-bold mb-8" style={{ color: STAMP }}>
          남자친구·시그널 성지 2곳과 정동진 해돋이 명소를 함께 즐기는 코스
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
            정동진역 그 해돋이 명소에서 시작해 남자친구의 심곡항, 시그널의 헌화로까지 — 해외에서도 널리 알려진 드라마 성지 2곳과 정동진의 풍경을 함께 도는 코스. 강릉 도심 코스와는 별도로 즐기는 정동진 전용 코스예요.
          </p>
        </blockquote>

        {/* 왕복 판단 프레임 — GangneungTour.tsx와 동일한 카드 구조, verdict는 DRAFT 고정 (실측 전 GO 절대 금지) */}
        <div
          className="rounded-md overflow-hidden mb-10"
          style={{ border: `1px solid ${HAIRLINE}` }}
        >
          <div className="px-4 py-3" style={{ backgroundColor: PAPER_DEEP }}>
            <div className="text-sm font-black flex items-center gap-2" style={{ color: PINE }}>
              오늘 이 코스, 판정 확인 중이에요
            </div>
            <p className="text-[11px] font-semibold mt-1" style={{ color: PINE, opacity: 0.65 }}>
              5개 스팟 · {HUB_STATION} 출발 당일치기 (참고 제안)
            </p>
          </div>

          {/* 판정 결과 — 스팟 간 이동시간·운영시간 미확정이라 GO/CARE 대신 DRAFT + 확인 필요 항목 노출 */}
          {!ROUND_TRIP_CONFIRMED && (
            <div className="px-4 py-2.5 text-white" style={{ backgroundColor: WARN_AMBER }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-black">◐ DRAFT</span>
                <span className="text-[11px] font-semibold opacity-90">현지 이동시간 확인 전이에요</span>
              </div>
              <div
                className="text-[11px] font-semibold opacity-95 mt-1.5 pt-1.5 leading-relaxed"
                style={{ borderTop: "1px solid rgba(255,255,255,0.3)" }}
              >
                {HUB_STATION} ↔ 정동진역 KTX 시간표는 확인했지만(하루 왕복 4회뿐), 심곡항·헌화로 구간 실제 이동시간과 스팟 운영시간이 아직 확인되지 않아 GO 판정을 보여드릴 수 없어요.
              </div>
              <p className="text-[11px] text-white/90 mt-1.5">○ 정동진역 ↔ 심곡항 ↔ 헌화로 실제 이동시간(도보/택시) 확인 필요</p>
              <p className="text-[11px] text-white/90 mt-1">○ 스팟 운영시간·휴무 확인 필요</p>
              <p className="text-[11px] text-white/90 mt-1">○ 정동진역 직통 KTX가 하루 4회뿐이라, 강릉역 경유가 더 빠른지 팀 확인 필요</p>
            </div>
          )}

          {/* 가상 시나리오 디스클레이머 */}
          <div
            className="px-4 py-3 text-[11px] leading-relaxed"
            style={{ backgroundColor: PAPER, borderTop: `1px solid ${HAIRLINE}`, color: INK, opacity: 0.55 }}
          >
            위 코스는 날짜를 정하지 않은 예시 시나리오예요. 왕복 교통시간이 확정되면 정식 판정(GO/GO WITH CARE 등)으로 업데이트됩니다.
          </div>
        </div>
      </section>

      {/* SPOTS */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: STAMP }}>Chapter 1</span>
          <div className="flex-1 h-px" style={{ backgroundColor: HAIRLINE }} />
          <span className="text-[11px] font-bold" style={{ color: INK, opacity: 0.5 }}>드라마 성지 & 해돋이 명소</span>
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
          ※ KTX 구간은 실제 시간표를 반영했지만, 현지 이동시간과 스팟 운영시간이 아직 확정 전이라 아래 시간은 참고용 제안 동선입니다. 실제 왕복 판정은 확정 후 업데이트됩니다.
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
            onClick={() => {
              trackEvent('form_modal_open', { region: 'jeongdongjin' });
              setFormModalOpen(true);
            }}
            className="w-full max-w-md py-4 rounded-[14px] font-bold text-sm shadow-md transition-opacity hover:opacity-90 text-center"
            style={{ backgroundColor: STAMP, color: "#fff" }}
          >
            요청하기 →
          </button>
        </div>
      </div>

      <LangFormModal open={formModalOpen} onClose={() => setFormModalOpen(false)} region="jeongdongjin" />
    </div>
  );
}
