import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronLeft, MapPin, Sparkles } from "lucide-react";
import LangFormModal from "@/app/components/LangFormModal";
import BrandLogo from "@/app/components/BrandLogo";
import { trackEvent } from "@/app/analytics";

// TODO: 나머지 강릉 스팟/맛집/카페 사진은 팀이 직접 촬영/제공 필요. 현재는 임시 placeholder 이미지 사용.
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

// 왕복 판단 — 강릉은 아직 왕복 교통시간이 팀 최종 확정 전이라 DRAFT 상태.
// 2026-07-27 진행: KTX-이음 서울역↔강릉역 구간은 코레일 시간표 기준 실제 값으로 교체 완료
// (출처: train.asamaru.net, 2026-07-28 조회).
// 2026-07-29 진행: 강릉역↔주문진(향호리) 버스도 강릉 버스정보시스템(bis.gn.go.kr/schedule, 2026-07-29 조회,
//  평일 기준) 공식 배차표로 실제 값 확인 완료 — 300(동진버스, 공단↔향호리) 첫차 06:15/막차 21:25,
//  300(동해상사, 안목↔향호리) 첫차 06:18/막차 21:38, 300-2(동진버스, 향호리 기점) 첫차 06:50/막차 21:30.
//  ⚠️ 단, "강릉역"이 명시된 전용 계통(300-1(강릉역)/300-2(강릉역))은 각각 08:45~17:05, 10:15~15:30로 운행이
//  훨씬 짧음 — 일반 300/300-2가 강릉역을 실제로 지나는지·몇 분 걸리는지는 여전히 팀 현장 확인이 필요합니다.
//
// ★ 2026-07-29(2차) — 출발 시각 1차 조정(초안) ★
// 팀 피드백: 첫차(05:06)는 너무 이름 → 07:59(805편)으로 초안 적용.
// ★ 2026-07-29(5차) — 08:00 이후 출발로 재조정 ★
// 출발: 서울역 08:57 KTX-이음 807(실제 시간표, 출처: train.asamaru.net 2026-07-29 조회) → 강릉역 10:58 도착.
// 귀환: 기존 824편(강릉 20:30 → 서울 22:32)은 이 일정에서 강릉역 최종 도착이 약 20:13이라 17분 버퍼뿐 →
// 버스 지연 위험으로 826편(강릉 21:33 → 서울 23:26)으로 변경. 더 일찍 끝나면 824편도 탑승 가능.
// 10:58 도착 기준: 마지막 카페(보사노바) 종료 약 19:43 → 강릉역 약 20:13 → 826편(21:33) 탑승까지 80분 여유.
// 이동시간 추정치가 전부 미확정이라 위 계산도 잠정치이며, 현지 이동수단·정확한 소요시간이 팀 실측으로
// 확인되기 전까지 ROUND_TRIP_CONFIRMED을 true로 바꾸지 않습니다(절대규칙 1번).
//
// ★ 2026-07-29(4차) — 대중교통 실측 1차 + 코스 재설계 ★
// 기존 11개 스팟 → 주문진 3개+안목 2개로 축소. 1차 실측(Google Maps): 강릉역→BTS 1h40m.
// ⚠️ 아래 5차 팀 현장 실측에서 1h01m으로 정정됨.
//
// ★ 2026-07-29(5차) — 팀 현장 실측 완료 + 동선 B안 확정 ★
// 실측값(팀 현장 직접 확인):
//   강릉역→도깨비촬영지(교항리 81-151): 300번 버스+도보 총 1시간
//   도깨비→더글로리촬영지: 시티1 8분 (40분 배차)
//   더글로리→BTS(향호리): 도보 24분 (해변가)
//   BTS→강릉역: 300번 1시간 01분
// 동선 B안 확정: A안(BTS→더글로리→도깨비)은 더글로리→도깨비 방향 버스 없어 택시 필요.
//   B안(강릉역→도깨비→더글로리→BTS→강릉역)은 전 구간 버스+도보, 택시 없음.
// 도깨비촬영지 주소 정정: 기존 "해안로 1609(영진해변)" → "교항리 81-151"로 확정.
// 시티1 배차(현장 사진 확인): 안목커피거리↔주문진해변 각 16회, 약 40분 간격.
//   도깨비촬영지 통과 시각(안목발 + 32분): ...11:42 / 12:22 / 13:02...
//   TIMETABLE은 안목발 6회(11:50발, 도깨비 12:22 통과) 기준으로 작성.
// 귀환편: 826편(21:33→23:26) → 822편(18:48→21:00)으로 앞당김 (동선 효율화 덕분).
// BTS→강문해변: 시티1 직행 확인(실측) — 주문진해변발 13:40(8회) 탑승, 강문해변 정류장 37분 후 하차,
//   도보 5분 → 강문해변 14:22 도착. 강릉역 경유 불필요. 총 49분.
// 강릉역↔강문해변 확인 후 820편(17:01→19:13)으로 귀환 앞당기기도 가능.
// ⚠️ 남은 미확정: 강문해변→강릉역 이동시간(~30분 추정), 주문진항 물회집 팀 선정.
//
// ★ 2026-07-29(3차) — 남은 TODO 조사 결과 ★
// 1) 300번대 버스의 강릉역 실제 경유 여부: ✅ 확인 완료. 강릉 버스정보시스템 공식 공지(2025-12-01자,
//    bis.gn.go.kr 공지사항 "[필독] (주문진→강릉역) 경유 노선 증편 운행 알림")로 300-1, 300-2가 각각
//    "강릉역 경유" 전용 계통으로 하루 3회씩 운행함을 확인. 배차표에도 "300-1(강릉역)"(08:45~17:05),
//    "300-2(강릉역)"(10:15/12:40/15:30, 향호리 기점)로 별도 노선코드 등재됨(2026-07-29 재확인).
//    ⚠️ 단, 배차표엔 "향호리 기점발" 시각만 있고 강릉역 통과·도착 시각은 표기가 없어(첨부 PDF 필요),
//    10:04 강릉역 도착 직후 탈 수 있는 정확한 시각까지는 특정하지 못함 — 현장 확인 또는 첨부 PDF 확보 필요.
// 2) 주문진↔사천면 이동시간: Google 지도 대중교통 경로로 실측 시도 — 주문진 방파제(해안로 1609)→
//    사천항주문진물회(사천면 진리항구길 49) 대중교통(버스 300-1/300-2 환승→931) 기준 약 1시간 50분
//    (2026-07-29 조회). 이는 코드 타임테이블의 "이동 약 20분 추정"과 큰 차이가 있음 — 그 추정치는
//    택시/자차 기준으로 보이며, 대중교통만 이용할 경우 이 구간이 일정의 병목이 될 수 있음을 팀에 공유
//    필요(택시 이용을 사실상 전제해야 당일치기 시간표가 성립). 참고: 국내에서는 Google 지도가 자동차
//    길찾기를 지원하지 않아(정책상 제한) 도보/대중교통 경로만 확인 가능했음.
// 3) 좌표(위경도): Google 지도 길찾기 URL에 실제 지오코딩된 위경도가 포함되는 것을 확인
//    (예: 주문진 방파제 37.8794524, 128.8333659 / 사천항주문진물회 37.8374822, 128.875342 — 2026-07-29
//    확인). 다만 현재 코드에는 지도 기능이 없어 숫자 좌표를 쓸 곳이 없고(coord 필드는 주소 텍스트 표시용),
//    나머지 9곳까지 전부 채우는 건 지도 기능이 실제로 추가될 때 진행하는 게 낫다고 판단해 보류.
// 4) 신규 출처 링크 확보(2026-07-29): 임당동성당 = 국가유산포털 공식(heritage.go.kr, 국가등록문화재
//    제457호), 소돌아들바위공원 = 공식 사이트(sodolpark.co.kr), 강문해변 = 대한민국 구석구석(KTO 공식).
// 5) ⚠️ 주소 불일치 발견: 배니닭강정 — 코드엔 "금성로13번길 3-1"인데 배니닭강정 공식 홈페이지
//    (gsbaenni.modoo.at, baenni.com)엔 "금성로 13번길 5"로 표기됨. 어느 쪽이 최신 정보인지 팀 확인 필요
//    (임의로 수정하지 않음 — 환각 방지 원칙).
const ROUND_TRIP_CONFIRMED = false;
// 출발/귀환 허브 — 팀 결정: 서울역 (KTX-이음 기준). 출발 08:57(807편) / 귀환 18:48(822편) 확정(위 검증 참고).
const HUB_STATION = "서울역";

type SpotItem = {
  no: string; emoji: string; tag: string; title: string; subtitle: string;
  scene: string; reality: string; coord: string; tip: string; caution: string; image: string;
};

const SPOTS: SpotItem[] = [
  {
    no: "01", emoji: "🌊", tag: "드라마 스팟", title: "도깨비 촬영지",
    subtitle: "도깨비 첫 만남 장소 (교항리 방파제)",
    scene: "도깨비와 지은탁의 운명적인 첫 만남이 이루어진 그 바다 방파제.",
    reality: "8년이 지난 지금도 팬들의 발걸음이 이어지는 성지. 2026년 tvN 〈도깨비 10주년 여행〉 특집에서 공유·김고은·이동욱·유인나가 다시 이 방파제를 찾았을 만큼, 세월이 지나도 그때 그 풍경 그대로예요.",
    coord: "강원 강릉시 주문진읍 교항리 81-151",
    tip: "방파제 끝 등대를 배경으로 뒷모습을 담으면 드라마 포스터 감성 구도가 완성돼요.",
    caution: "방파제는 바람이 세고 파도가 튈 수 있으니 노란 안전선 안쪽에서만 촬영해 주세요.",
    image: gangneungPlaceholderImg,
  },
  {
    no: "02", emoji: "🌙", tag: "OTT 드라마 스팟", title: "더글로리 촬영지",
    subtitle: "넷플릭스 〈더 글로리〉 16화 촬영지 (소돌해변 인근)",
    scene: "문동은과 주여정이 함께 떠난 여행에서, 눈 내리는 밤 빨간 등대에 기대어 맥주를 마시던 그 방파제.",
    reality: "아들바위공원 바로 옆 작은 방파제로, 마을 모양이 소를 닮았다 해서 '소돌'이라는 이름이 붙었어요. 24시간 개방, 주차도 무료예요.",
    coord: "강원 강릉시 주문진읍 주문리 791-47 (시티1 더글로리촬영지 정류장 하차)",
    tip: "빨간 등대를 프레임 안에 넣고 해질녘에 방문하면 드라마 속 밤바다 분위기와 가장 비슷해요.",
    caution: "방파제 특성상 바닥이 미끄럽고 파도가 튈 수 있으니 안전선 안쪽에서만 촬영해 주세요.",
    image: gangneungPlaceholderImg,
  },
  {
    no: "03", emoji: "💜", tag: "K-POP 스팟", title: "BTS 버스정류장",
    subtitle: "\"You Never Walk Alone\" 앨범 재킷 촬영지",
    scene: "방탄소년단 리패키지 앨범 〈YOU NEVER WALK ALONE〉 재킷을 촬영한 그 버스정류장.",
    reality: "촬영 당시엔 임시로 세운 세트였는데, 철거된 걸 관광객을 위해 다시 재현해뒀어요. 보라색 벤치엔 멤버 이름이 적혀 있고, 옆엔 포토존 그네도 있어요.",
    coord: "강원도 강릉시 주문진읍 향호리 8-55",
    tip: "정류장 표지판과 보라색 벤치를 함께 프레임에 담고, 더글로리 촬영지에서 해변가를 따라 도보로 이동하면 산책 코스로도 손색없어요.",
    caution: "실제 운행하는 버스정류장이 아니라 포토존 세트이니, 주변 도로 통행에 주의해 주세요.",
    image: gangneungPlaceholderImg,
  },
  {
    no: "04", emoji: "🌅", tag: "드라마 스팟", title: "강문해변",
    subtitle: "그녀는 예뻤다 촬영지",
    scene: "성준과 혜진이 화보 촬영 답사 출장을 갔던 곳 — MBC 〈그녀는 예뻤다〉 7화 촬영지.",
    reality: "경포해변과 안목해변 사이에 있는 조용한 해변. 강문해변과 경포해변을 잇는 솟대다리 야경이 예쁘기로 유명해요.",
    coord: "강원도 강릉시 창해로 352",
    tip: "솟대다리 위에서 노을 질 무렵 바다를 배경으로 찍으면 화보 같은 사진이 나와요.",
    caution: "안목해변으로 넘어가는 길목이라 해 질 무렵엔 산책객이 많으니 다리 위 통행에 주의해 주세요.",
    image: gangneungPlaceholderImg,
  },
];

type EatItem = {
  section: "food" | "cafe"; emoji: string; category: string; title: string;
  coord: string; tip: string; view: string; image: string;
};

const EATS: EatItem[] = [
  {
    section: "food", emoji: "🐟", category: "점심 · 물회", title: "주문진항 물회 (팀 선정 예정)",
    coord: "강릉시 주문진읍 주문진항 일대",
    tip: "주문진항은 동해안 최대 어항 중 하나로, 방파제 바로 옆에 물회 전문점이 모여 있어요. 라스트오더 전 여유 있게 방문하세요.",
    view: "주문진 방파제 산책 후 바로 옆 항구에서 즐기는 동해 활어 물회. 이동 없이 도보로 이어지는 동선이에요.",
    image: gangneungPlaceholderImg,
  },
  {
    section: "cafe", emoji: "☕", category: "카페 · 오션뷰", title: "보사노바 커피로스터스",
    coord: "강릉시 창해로14번길 28",
    tip: "일몰 30분 전 도착하면 노을과 함께 커피를 즐길 수 있어요.",
    view: "라오스 자체 농장 원두를 직접 로스팅하는 안목해변 대표 커피 명소. 옥상에서 오션뷰를 즐길 수 있어요.",
    image: gangneungPlaceholderImg,
  },
];

type TimetableItem = { time: string; emoji: string; label: string; desc: string };

// 참고용 제안 동선 — 각 시각은 "스팟별 권장 체류시간 + 스팟 간 이동시간 추정치"를 순서대로 더해 계산한
// 것입니다(코스템플릿 문서의 권장 체류시간 기준: 방파제·성당류 20~30분, 문화유산·수목원류 40분, 식사·카페
// 60분 등). 이동시간은 아직 실측 전이라 전부 추정치이며, 강릉역 ↔ 주문진 현지 이동수단(버스/택시)과
// 스팟별 운영시간이 아직 팀 최종 확인 전이라 "판정"이 아닌 "참고 일정"으로만 안내합니다. KTX-이음 시각은
// 실제 코레일 시간표 기준(출처는 위 HUB_STATION 주석 참고).
const TIMETABLE: TimetableItem[] = [
  { time: "08:57", emoji: "🚄", label: `${HUB_STATION} 출발`, desc: "KTX-이음 807 탑승 (실제 시간표 기준)" },
  { time: "10:58", emoji: "🚄", label: "강릉역 도착", desc: "KTX 하차 → 300번 버스 탑승, 도깨비촬영지 방면 이동 (약 30분 버스+30분 도보 = 총 1시간, 실측)" },
  { time: "11:58", emoji: "🌊", label: "도깨비 촬영지", desc: "교항리 방파제, 도깨비 첫 만남 장소에서 사진 촬영 (체류 약 24분 — 시티1 12:22 탑승 기준)" },
  { time: "12:22", emoji: "🚌", label: "시티1 탑승 → 더글로리촬영지", desc: "안목발 6회(11:50 출발), 도깨비촬영지 12:22 통과 — 소요 8분 (실측). ⚠️ 40분 배차, 현장 시간표 확인 필수" },
  { time: "12:30", emoji: "🌙", label: "더글로리 촬영지", desc: "소돌해변 빨간 등대 배경 사진 (체류 약 20분)" },
  { time: "12:50", emoji: "🚶", label: "BTS로 도보 이동", desc: "해변가를 따라 도보 약 24분 (실측)" },
  { time: "13:14", emoji: "💜", label: "BTS 버스정류장", desc: "보라색 벤치·포토존 그네에서 사진 촬영 (체류 약 20분)" },
  { time: "13:34", emoji: "🚶", label: "주문진해변 정류장으로 이동", desc: "BTS에서 도보 6분 (실측)" },
  { time: "13:40", emoji: "🚌", label: "시티1 → 강문해변 직행", desc: "주문진해변발 8회(13:40 출발), 강문해변 정류장까지 37분 (실측) — 강릉역 경유 없음" },
  { time: "14:22", emoji: "🌅", label: "강문해변", desc: "그녀는 예뻤다 촬영지, 솟대다리 산책 (정류장 하차 후 도보 5분, 체류 약 20분)" },
  { time: "14:42", emoji: "☕", label: "보사노바 커피로스터스", desc: "강문해변에서 도보 이동, 오션뷰 커피로 하루 마무리 (체류 약 1시간)" },
  { time: "15:42", emoji: "🚌", label: "강릉역으로 이동", desc: "버스 약 30분 (추정, 팀 확인 필요)" },
  { time: "16:12", emoji: "🚄", label: "강릉역 도착", desc: "822편(18:48) 목표 — 강문해변↔강릉역 실측 후 820편(17:01→19:13)으로 앞당기기도 가능" },
  { time: "18:48", emoji: "🚄", label: `${HUB_STATION} 방향 출발`, desc: "KTX-이음 822 탑승 (실제 시간표 기준)" },
  { time: "21:00", emoji: "🏠", label: `${HUB_STATION} 도착`, desc: "귀환" },
];

export default function GangneungTour() {
  const [formModalOpen, setFormModalOpen] = useState(false);

  useEffect(() => {
    trackEvent('tour_detail_view', { region: 'gangneung' });
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
                강릉에서 만나는<br />도깨비·더 글로리·BTS, 그리고 동해 하루
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* INTRO */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14">
        <p className="text-sm sm:text-base font-bold mb-8" style={{ color: STAMP }}>
          도깨비·더 글로리·그녀는 예뻤다·BTS 성지 4곳을 대중교통으로 잇는 주문진·안목 당일치기 코스
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
            BTS 버스정류장·소돌 방파제(더 글로리)·주문진 방파제(도깨비)·강문해변(그녀는 예뻤다) — 4곳의 K콘텐츠 성지를 대중교통으로, 북쪽에서 남쪽으로 되돌아오는 구간 없이 잇는 코스.
          </p>
        </blockquote>

        {/* 왕복 판단 프레임 — 수원 페이지와 동일한 카드 구조, verdict는 DRAFT 고정 (실측 전 GO 절대 금지) */}
        <div
          className="rounded-md overflow-hidden mb-10"
          style={{ border: `1px solid ${HAIRLINE}` }}
        >
          <div className="px-4 py-3" style={{ backgroundColor: PAPER_DEEP }}>
            <div className="text-sm font-black flex items-center gap-2" style={{ color: PINE }}>
              오늘 이 코스, 판정 확인 중이에요
            </div>
            <p className="text-[11px] font-semibold mt-1" style={{ color: PINE, opacity: 0.65 }}>
              4개 스팟 · {HUB_STATION} 출발 당일치기 (참고 제안)
            </p>
          </div>

          {/* 판정 결과 — 왕복 교통시간 미확정이라 GO/CARE 대신 DRAFT + 확인 필요 항목 노출 */}
          {!ROUND_TRIP_CONFIRMED && (
            <div className="px-4 py-2.5 text-white" style={{ backgroundColor: WARN_AMBER }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-black">◐ DRAFT</span>
                <span className="text-[11px] font-semibold opacity-90">출발·귀환 확정, 현지 이동만 남았어요</span>
              </div>
              <div
                className="text-[11px] font-semibold opacity-95 mt-1.5 pt-1.5 leading-relaxed"
                style={{ borderTop: "1px solid rgba(255,255,255,0.3)" }}
              >
                {HUB_STATION} 08:57 출발 → 강릉역 18:48 출발/21:00 도착(KTX-이음 실제 시간표 기준)으로 당일치기 자체는 가능한 것으로 확인했어요. 대중교통 전구간 실측 완료(도깨비→더글로리→BTS 전 구간), 강릉역↔강문해변 구간과 주문진항 식당 팀 선정이 남아있어 GO 판정은 아직입니다.
              </div>
              <p className="text-[11px] text-white/90 mt-1.5">○ 강릉역↔주문진 현지 이동수단·소요시간 최종 확인 필요</p>
              <p className="text-[11px] text-white/90 mt-1">○ 스팟 운영시간·휴무 확인 필요</p>
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
          <span className="text-[11px] font-bold" style={{ color: INK, opacity: 0.5 }}>드라마·K팝 성지 & 로컬 힐링 포인트</span>
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
          ※ KTX 구간, 강릉역↔주문진(도깨비·더글로리·BTS), BTS→강문해변(시티1 직행 49분) 전 구간이 팀 현장 실측값입니다. 시티1(도깨비→더글로리·BTS→강문해변)은 40분 배차이므로 현장 시간표 확인 필수. 강문해변→강릉역(~30분)은 추정치, 팀 확인 필요. 주문진항 물회 식당은 팀 선정 예정입니다.
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
              trackEvent('form_modal_open', { region: 'gangneung' });
              setFormModalOpen(true);
            }}
            className="w-full max-w-md py-4 rounded-[14px] font-bold text-sm shadow-md transition-opacity hover:opacity-90 text-center"
            style={{ backgroundColor: STAMP, color: "#fff" }}
          >
            요청하기 →
          </button>
        </div>
      </div>

      <LangFormModal open={formModalOpen} onClose={() => setFormModalOpen(false)} region="gangneung" />
    </div>
  );
}
