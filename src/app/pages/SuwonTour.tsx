import { useState } from "react";
import { Link } from "react-router";
import { 
  MapPin, 
  ArrowRight, 
  ChevronLeft, 
  Star,
  Clock, 
  CheckCircle2, 
  Footprints, 
  Flame, 
  HelpCircle 
} from "lucide-react";

// UI Components
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/app/components/ui/accordion";
import { Badge } from "@/app/components/ui/badge";

// Local Image Imports
import suwonFortressWallImg from "@/assets/suwon/suwon_fortress_wall.png";
import janganmunNightImg from "@/assets/carousel/janganmun_night.jpg";
import sunjaeSiljaImg from "@/assets/carousel/sunjae_silja.jpg";
import suwonHongwhamunImg from "@/assets/suwon/suwon_hongwhamun.jpg";
import bangwhasuryujeongPicnicImg from "@/assets/suwon/bangwhasuryujeong_picnic.jpg";
import nammanTongdakImg from "@/assets/suwon/namman_tongdak.jpg";
import haenggungdongMuralImg from "@/assets/suwon/haenggungdong_mural.png";
import jeongjiyoungLatteImg from "@/assets/suwon/jeongjiyoung_latte.jpg";
import { SURVEY_FORM_URL } from "@/app/surveyConfig";

// 왕복 판단 프레임 — 값은 전부 예시(placeholder).
// 실제 값은 마스터 코스 템플릿(막차·소요시간 확정본)이 나오면 교체.
const ROUND_TRIP = {
  departTime: "08:40",
  departNote: "서울역 · 1호선 약 55분 [예시 — 템플릿 확정 전]",
  lastTrainTime: "23:12",
  lastTrainNote: "수원역 → 서울행 막차 [예시]",
  bufferMinutes: 277,
  verdict: "GO" as const,
};

const TEAL = "#1D9E75";
const TEAL_DARK = "#0F6E56";
const TEXT_PRIMARY = "#111827";
const TEXT_MUTED = "#9CA3AF";

// 카테고리별 테마: 드라마 스팟(Teal) / 로컬 힐링 스팟(Emerald) / 문화유산 스팟(Blue)
const CATEGORY_THEME: Record<string, { label: string; text: string; bg: string; border: string }> = {
  drama: { label: "🎬 드라마 속 그 장면", text: "#1D9E75", bg: "#E8F5F0", border: "#1D9E75" },
  local: { label: "🌿 로컬 힐링 포인트", text: "#10B981", bg: "#ECFDF5", border: "#10B981" },
  heritage: { label: "🧱 스팟 매력 포인트", text: "#3B82F6", bg: "#EFF6FF", border: "#3B82F6" },
};

const galleryImages = [
  janganmunNightImg,
  sunjaeSiljaImg,
  suwonHongwhamunImg,
  jeongjiyoungLatteImg
];

const spots = [
  {
    id: 1,
    emoji: "🎬",
    tag: "드라마 스팟 1",
    category: "drama",
    title: "솔이네 & 선재네 집 골목",
    scene: "선재가 솔이에게 우산을 씌워주던 파란 대문 앞 소나기 우산 씬 ☂️",
    reality: "실제로는 예쁜 카페와 주택이 마주한 한적한 골목. 대문 앞에 서면 OST가 자동 재생돼요!",
    coord: "수원시 팔달구 화서문로48번길 일대 (화성행궁 도보 5분)",
    photoTip: "대문 정면보다 골목 아래에서 위로 올려다보듯 (0.5배 광각) 찍어야 드라마 포스터 구도가 나와요!",
    warning: "실제 거주지이므로 오전 10시~오후 6시 방문 추천, 셔터음 무음 매너는 기본! 🤫",
    syncRate: "99.9%",
    image: sunjaeSiljaImg,
  },
  {
    id: 2,
    emoji: "🚲",
    tag: "드라마 스팟 2",
    category: "drama",
    title: "화홍문 & 방화수류정 돌다리",
    scene: "솔과 선재가 자전거를 끌고 건너던 화홍문 징검다리 고백 씬 🚲",
    reality: "시원한 수원천 물소리와 휘날리는 버드나무가 매력적인 곳. 이어폰 꽂고 '소나기' 재생 필수!",
    coord: "수원시 팔달구 매향동 수원천로392번길 44-6",
    photoTip: "다리 정면 말고, 수원천 건너편 둔치로 내려가서 다리 건너는 내 뒷모습과 화홍문 누각을 한 앵글에 담아보세요.",
    warning: "촬영 중 발밑 물가 조심! 자차 이용 시 '화홍문 공영주차장(하루 최대 3,500원)'이 제일 편해요.",
    syncRate: "99.9%",
    image: suwonHongwhamunImg,
  },
  {
    id: 3,
    emoji: "🌿",
    tag: "로컬 힐링 스팟",
    category: "local",
    title: "방화수류정 피크닉",
    scene: "용연 연못가에 돗자리를 펴고 아름다운 성곽 정자를 바라보는 힐링 피크닉 🧺",
    reality: "낮에는 청량한 피크닉, 밤에는 환상적인 성곽 라이트업으로 180도 반전 매력을 선사해요.",
    coord: "수원시 팔달구 수원천로 392",
    photoTip: "연못 건너편에서 정자 전체가 물속에 거울처럼 완벽하게 비치는 데칼코마니 각도가 정석!",
    warning: "노을과 야경을 모두 잡으려면 '일몰 30분 전' 도착이 황금 타이밍입니다.",
    syncRate: "",
    image: bangwhasuryujeongPicnicImg,
  },
  {
    id: 4,
    emoji: "🛍️",
    tag: "드라마 스팟 3",
    category: "drama",
    title: "행궁동 벽화골목 & 행리단길",
    scene: "골목길 자전거 옆을 지나며 마주한 솔선재 벽쿵씬 📸",
    reality: "주말엔 SNS 감성 팝업과 플리마켓이 열리는 핫플. 아기자기한 벽화들로 끝없는 인생샷 갤러리!",
    coord: "화성행궁 ~ 화서문 일대 골목길",
    photoTip: "한낮 정오 즈음 방문하면 그림자가 짧아져 벽화골목의 다채로운 파스텔톤 컬러가 가장 선명하게 찍혀요.",
    warning: "주말 골목길은 매우 혼잡하니 주차는 '화성행궁 노상 주차장'을 추천합니다.",
    syncRate: "",
    image: haenggungdongMuralImg,
  },
  {
    id: 5,
    emoji: "🧱",
    tag: "문화유산",
    category: "heritage",
    title: "화성행궁 성벽길",
    scene: "성벽길을 따라 걸으며 내려다보는 행궁동 전경과 아름다운 성곽 노을의 장관 🧱",
    reality: "유네스코 세계문화유산. 봄엔 벚꽃, 가을엔 단풍, 겨울엔 설경까지 — 사계절 모두 장관입니다.",
    coord: "수원시 팔달구 남창동 6-2 (수원화성)",
    photoTip: "성벽 언덕에 올라가 행궁동 마을 전체가 발밑으로 내려다보이는 와이드 구도로 찍어보세요.",
    warning: "입장료 1,500원. 걷기 힘들 땐 귀여운 '화성어차' 순환 열차를 미리 현장 예매해 타고 둘러보세요.",
    syncRate: "",
    image: suwonFortressWallImg,
  },
];

const timeline = [
  { time: "11:30", emoji: "🏃‍♂️", spot: "Spot 1", title: "솔이네 & 선재네 골목", desc: "인파 몰리기 전 대문 샷 찍고 조용히 동네 둘러보기", dotColor: TEAL },
  { time: "12:30", emoji: "🍽️", spot: "맛집", title: "벽화 골목 & 수원 왕갈비 통닭", desc: "골목 구경하고 달콤 짭조름한 통닭으로 든든한 점심", dotColor: "#F59E0B" },
  { time: "14:30", emoji: "🚲", spot: "Spot 2", title: "화홍문 징검다리", desc: "이어폰 꽂고 '소나기' 들으며 19살 감성 징검다리 건너기", dotColor: "#3B82F6" },
  { time: "16:00", emoji: "🧱", spot: "Spot 5", title: "수원 화성 성벽길", desc: "성곽 위로 불어오는 시원한 바람 맞으며 행궁동 전경 감상", dotColor: TEXT_MUTED },
  { time: "17:30", emoji: "🌅", spot: "Spot 3 + 카페", title: "방화수류정 피크닉 & 루프탑 카페", desc: "노을 피크닉 후 야경 보며 뷰 충전으로 마무리", dotColor: "#D85A30" },
];

const checks = [
  "〈선재 업고 튀어〉 여운에서 못 헤어난 과몰입 찐팬 분",
  "서울 근교 당일치기로 힐링하고 싶으신 분",
  "길 헤매지 않고 알짜 동선으로 완벽하게 돌고 싶으신 분",
  "SNS 피드를 빛낼 인생샷 구도가 필요하신 분",
];

const includes = [
  "드라마 스팟 3곳 + 로컬 명소 2곳",
  "현지인 찐맛집 & 루프탑 카페 추천",
  "인생샷 보장 구도 팁 (싱크로율 99.9%)",
  "완벽 당일치기 타임테이블",
  "구글맵 핀 리스트 공유",
  "실시간 안심 지도 서비스",
];

const steps = [
  { label: "신청", desc: "이름/이메일 남기기" },
  { label: "안내", desc: "10분 내 투어 가이드 메일 발송" },
  { label: "확인", desc: "완벽 동선 구글맵 핀 + 가이드북 수령" },
  { label: "출발", desc: "가벼운 마음으로 당일 출발!" },
];

const reviews = [
  {
    id: 1,
    author: "선재야사랑해",
    rating: 5,
    date: "2026-07-10",
    content: "솔선 대문 앞에서 소나기 들으면서 사진 찍는데 가슴이 웅장해졌어요ㅠㅠ 가이드북에 나와있는 촬영 팁 구도 그대로 찍으니까 진짜 인생샷 건졌습니다! 수원 갈비 통닭 꿀팁도 정말 요긴하게 썼어요. 완전 강추합니다!!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format",
    tag: "과몰입러",
  },
  {
    id: 2,
    author: "동네방네여행가",
    rating: 5,
    date: "2026-07-08",
    content: "구글맵 핀 리스트가 진짜 대박이에요. 평소에 길치라서 네이버지도 켜도 헤맸는데, 이 가이드 핀만 찍고 따라가니까 최적의 동선으로 방화수류정 노을까지 완벽히 감상했습니다. 무료라는 게 믿기지 않는 퀄리티입니다.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
    tag: "당일치기 전문가",
  },
  {
    id: 3,
    author: "유송이",
    rating: 4,
    date: "2026-07-05",
    content: "드라마를 안 본 친구랑 같이 갔는데도 성곽길 걷고 예쁜 카페 투어하는 것만으로도 너무 좋아하더라구요! 주말이라 확실히 사람이 많았지만 알려주신 주차 팁 덕분에 고생 덜했습니다. 주말 행리단길은 확실히 원격줄서기 필수네요.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format",
    tag: "친구와함께",
  }
];

const faqs = [
  {
    q: "가이드북 신청 후 메일은 언제 발송되나요?",
    a: "신청 완료 후 입력하신 이메일로 10분 내에 자동 발송됩니다. 만약 메일을 받지 못하셨다면 스팸 메일함을 확인해 주시거나 고객센터로 문의 주세요."
  },
  {
    q: "구글맵 핀 리스트는 어떻게 등록하나요?",
    a: "발송되는 이메일에 포함된 구글맵 링크를 클릭하시면 본인의 구글 지도 앱에 'KSPOT 수원 행궁동 코스'가 자동으로 저장 및 표기되어 간편하게 사용하실 수 있습니다."
  },
  {
    q: "드라마를 보지 않았어도 투어를 즐길 수 있나요?",
    a: "물론입니다! 유네스코 세계문화유산인 수원화성 성곽길, 방화수류정 피크닉, 힙한 행리단길 카페 및 벽화거리 등은 드라마를 보지 않으신 분들도 충분히 힐링하고 매력을 느낄 수 있는 대표 힐링 코스입니다."
  },
  {
    q: "도보 이동 거리는 어느 정도 되나요? 유모차나 휠체어도 가능한가요?",
    a: "총 도보 이동 거리는 약 3.5km 내외이며 완만한 경사와 평지로 이루어져 있어 걷기에 무리가 없습니다. 다만 성곽길 일부 오르막 구간에서는 휠체어나 유모차의 이동이 다소 제한될 수 있어 우회 동선을 권장합니다."
  }
];

export default function SuwonTour() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div
      className="min-h-screen bg-gray-50 text-[#111827] selection:bg-[#E8F5F0]"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif',
      }}
    >
      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-3">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link
            to="/tour"
            className="flex items-center gap-1 text-sm font-semibold hover:text-emerald-600 transition-colors"
            style={{ color: TEXT_MUTED }}
          >
            <ChevronLeft size={16} />
            다른 투어 보기
          </Link>
          <span className="text-xl font-extrabold tracking-wider uppercase text-gray-900 font-sans" style={{ color: TEAL_DARK }}>
            KSPOT
          </span>
          <div style={{ width: 80 }} />
        </div>
      </nav>

      {/* TOP SECTION: 2-COLUMN LAYOUT (PRODUCT DETAIL STYLE) */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-sm bg-gray-100">
              <img
                src={galleryImages[activeImageIndex]}
                alt="수원 투어 갤러리 이미지"
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-[#1D9E75] text-white hover:bg-[#15805d] border-none font-bold px-3 py-1 text-xs">
                  📍 수원 행궁동
                </Badge>
                <Badge className="bg-orange-500 text-white hover:bg-orange-600 border-none font-bold px-3 py-1 text-xs flex gap-1 items-center">
                  <Flame size={12} className="animate-pulse" />
                  실시간 핫플
                </Badge>
              </div>
            </div>
            
            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-video rounded-xl overflow-hidden border-2 transition-all bg-gray-100 cursor-pointer ${
                    activeImageIndex === idx ? "border-[#1D9E75] ring-2 ring-[#E8F5F0]" : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img src={img} alt={`썸네일 ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: 왕복 판단 카드 */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="lg:sticky lg:top-20 bg-white rounded-2xl p-6 border border-gray-100 shadow-md">
              <h1 className="text-xl sm:text-2xl font-black leading-tight text-gray-900 mb-3 tracking-tight">
                [선업튀 성지 순례] 임솔♥류선재 타임슬립 수원 행궁동 당일치기 코스
              </h1>

              <p className="text-xs font-semibold text-gray-500 mb-5 leading-relaxed">
                서울 근교 1시간, 풋풋한 19살 그 시절 감성 그대로 걷는 완벽 동선 가이드북 & 실시간 길 찾기 구글맵 핀 패키지 💛
              </p>

              {/* 왕복 판단 프레임 — KSPOT 핵심 기능 */}
              <div className="rounded-2xl border border-gray-100 overflow-hidden mb-5">
                <div className="bg-gray-50 px-4 py-2.5 text-xs font-extrabold text-gray-700">
                  ☰ 이 하루, 한눈에
                </div>
                <div className="px-4 py-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F6E56]">
                    <span>🚆</span>
                    <span>{ROUND_TRIP.departTime} 출발 · {ROUND_TRIP.departNote}</span>
                  </div>
                  <div className="pl-5 border-l-2 border-dashed border-gray-200 ml-1.5 space-y-1">
                    {timeline.map((t, idx) => (
                      <div key={idx} className="text-[11px] font-semibold text-gray-500">
                        {t.time} · {t.title}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#92400E]">
                    <span>🕚</span>
                    <span>{ROUND_TRIP.lastTrainNote} {ROUND_TRIP.lastTrainTime}</span>
                  </div>
                </div>
                <div className="bg-[#1D9E75] text-white px-4 py-2.5 flex items-center justify-between">
                  <span className="text-sm font-extrabold">✓ {ROUND_TRIP.verdict}</span>
                  <span className="text-[11px] font-semibold opacity-90">
                    막차까지 여유 {ROUND_TRIP.bufferMinutes}분 · 무사히 귀환
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-semibold mb-5 -mt-3">
                ⚠️ 시각·여유시간은 마스터 코스 템플릿 확정 전 예시값입니다. 실제 배차·막차는 현지 사정에 따라 달라질 수 있어요.
              </p>

              {/* 스펙 리스트 */}
              <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl text-xs font-bold text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
                    <Clock size={14} /> 소요 시간
                  </span>
                  <span className="text-gray-700">약 6시간 (당일치기)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
                    <Footprints size={14} /> 여행 난이도
                  </span>
                  <span className="text-gray-700">보통 (완만한 성곽길 도보 위주)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 size={14} /> 포함 혜택
                  </span>
                  <span className="text-[#1D9E75]">구글맵 핀 + 가이드북 PDF</span>
                </div>
              </div>

              {/* 다른 지역 신청 (수요조사 구글폼 링크) */}
              <div className="hidden md:block bg-[#F7EDE9] rounded-xl p-4 text-center">
                <p className="text-xs font-extrabold text-gray-800 mb-1">여기 없는 지역에 가고 싶으세요?</p>
                <p className="text-[11px] text-gray-500 font-semibold mb-3 leading-relaxed">
                  원하는 지역도 이 코스처럼 막차까지 계산해서 무료로 만들어 드려요.
                </p>
                <a
                  href={SURVEY_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-[#1D9E75] hover:bg-[#15805d] text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
                >
                  내가 가고 싶은 지역 신청하기 →
                </a>
                <p className="text-[10px] text-gray-400 font-semibold mt-2">수요조사 폼으로 이동합니다 (2분)</p>
              </div>

              {/* 모바일 화면용 간단 텍스트 */}
              <div className="block md:hidden text-center bg-gray-50 py-2.5 rounded-xl text-xs font-bold text-gray-600">
                👇 하단의 버튼으로 다른 지역도 신청할 수 있어요
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* DETAIL TABS SECTION */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <Tabs defaultValue="spots" className="w-full">
            
            {/* Sticky Tabs Header */}
            <TabsList className="sticky top-[53px] z-30 w-full justify-start overflow-x-auto gap-1 bg-white border-b border-gray-100 rounded-none h-12 p-0 mb-8 flex whitespace-nowrap scrollbar-none">
              <TabsTrigger value="spots" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1D9E75] data-[state=active]:text-[#1D9E75] data-[state=active]:bg-transparent font-bold text-xs sm:text-sm px-4 h-full cursor-pointer">
                코스 상세소개
              </TabsTrigger>
              <TabsTrigger value="timeline" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1D9E75] data-[state=active]:text-[#1D9E75] data-[state=active]:bg-transparent font-bold text-xs sm:text-sm px-4 h-full cursor-pointer">
                추천 일정
              </TabsTrigger>
              <TabsTrigger value="food" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1D9E75] data-[state=active]:text-[#1D9E75] data-[state=active]:bg-transparent font-bold text-xs sm:text-sm px-4 h-full cursor-pointer">
                맛집 & 카페
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1D9E75] data-[state=active]:text-[#1D9E75] data-[state=active]:bg-transparent font-bold text-xs sm:text-sm px-4 h-full cursor-pointer">
                이용후기 (128)
              </TabsTrigger>
              <TabsTrigger value="info" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1D9E75] data-[state=active]:text-[#1D9E75] data-[state=active]:bg-transparent font-bold text-xs sm:text-sm px-4 h-full cursor-pointer">
                이용안내 & FAQ
              </TabsTrigger>
            </TabsList>

            {/* TAB CONTENT 1: SPOTS */}
            <TabsContent value="spots" className="space-y-8 focus-visible:outline-none">
              <div className="max-w-3xl">
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">🎬 드라마 촬영지 & 명소 상세</h2>
                <p className="text-xs text-gray-500 font-semibold mb-6">수원의 숨은 뷰 포인트와 카메라 앵글 잡는 가이드까지 함께 담았습니다.</p>
                
                <div className="space-y-8">
                  {spots.map((s, idx) => {
                    const theme = CATEGORY_THEME[s.category];
                    return (
                    <div
                      key={s.id}
                      className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 px-5 py-3 border-b border-gray-100 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-[#0F6E56]">SPOT {idx + 1}</span>
                          <span className="bg-white border border-gray-200 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-gray-600">
                            {s.tag}
                          </span>
                        </div>
                        {s.syncRate && (
                          <span className="text-[10px] font-extrabold text-[#1D9E75] flex items-center gap-0.5">
                            ⚡ 싱크로율 {s.syncRate}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <div className="relative aspect-[16/9] w-full bg-gray-100">
                          <img src={s.image} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                          <h3 className="text-base font-extrabold text-gray-900">
                            {s.emoji} {s.title}
                          </h3>
                          
                          <div className="space-y-3.5 text-xs font-semibold leading-relaxed">
                            <div>
                              <p className="text-[10px] font-bold mb-1" style={{ color: theme.text }}>{theme.label}</p>
                              <p className="text-gray-800 p-2.5 rounded-xl border-l-4" style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
                                {s.scene}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 mb-1">🔍 현실 팩트체크</p>
                              <p className="text-gray-600 pl-1 font-medium">{s.reality}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 bg-gray-50 rounded-xl px-4 py-3 text-[11px] font-semibold text-gray-700">
                            <MapPin size={14} className="mt-0.5 shrink-0 text-[#1D9E75]" />
                            <span>{s.coord}</span>
                          </div>

                          <div className="bg-[#E8F5F0] border border-[#c3e8da] rounded-xl px-4 py-3 text-[11px] font-bold text-[#0F6E56] leading-relaxed">
                            <p className="text-[10px] uppercase tracking-wider mb-1">📸 포토존 연출 가이드</p>
                            <p className="font-semibold text-emerald-800">{s.photoTip}</p>
                          </div>

                          <div className="bg-[#FFFBEB] border border-[#fde68a] rounded-xl px-4 py-3 text-[11px] font-bold text-[#78350f] leading-relaxed">
                            <p className="text-[10px] uppercase tracking-wider mb-1">⚠️ 안심 체크포인트</p>
                            <p className="font-semibold text-amber-800">{s.warning}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* TAB CONTENT 2: TIMELINE */}
            <TabsContent value="timeline" className="space-y-8 focus-visible:outline-none">
              <div className="max-w-3xl">
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">⏱️ 완벽 동선 추천 타임라인</h2>
                <p className="text-xs text-gray-500 font-semibold mb-8">오전부터 일몰 야경까지 가장 부드럽게 이어지는 로컬 가이드 픽 동선입니다.</p>

                <div className="relative pl-8 sm:pl-28">
                  <div className="absolute top-0 bottom-0 left-8 sm:left-28 w-[2px] bg-gray-100" />
                  <div className="space-y-6">
                    {timeline.map((t, idx) => (
                      <div key={idx} className="relative flex flex-col sm:flex-row items-start gap-4">
                        <div className="absolute left-0 w-8 sm:w-24 text-left sm:text-right font-extrabold text-xs sm:text-sm pt-2 text-gray-400 font-sans">
                          {t.time}
                        </div>
                        <div className="absolute left-8 sm:left-28 z-10 shrink-0 mt-3 -translate-x-[5px]">
                          <div
                            className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: t.dotColor }}
                          />
                        </div>
                        <div className="flex-1 w-full pl-6 sm:pl-8">
                          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-lg">{t.emoji}</span>
                              <Badge className="bg-[#E8F5F0] text-[#0F6E56] hover:bg-[#c3e8da] border-none font-bold text-[10px]">
                                {t.spot}
                              </Badge>
                            </div>
                            <h4 className="font-extrabold text-sm text-gray-900">{t.title}</h4>
                            <p className="text-xs font-semibold text-gray-500 mt-1 leading-relaxed">{t.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB CONTENT 3: FOOD */}
            <TabsContent value="food" className="space-y-8 focus-visible:outline-none">
              <div className="max-w-3xl">
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">🍽️ 투어 맛과 감성을 더해줄 로컬 명소</h2>
                <p className="text-xs text-gray-500 font-semibold mb-6">투어 코스 중간에 쉽게 방문할 수 있는 수원 대표 맛집과 감성 노을 루프탑 카페입니다.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* 맛집 */}
                  <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm flex flex-col">
                    <div className="relative aspect-video bg-gray-100">
                      <img
                        src={nammanTongdakImg}
                        alt="수원 왕갈비 통닭"
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-orange-550 border-none text-white font-bold">맛집</Badge>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-extrabold text-sm text-gray-900 mb-2">🍗 수원 왕갈비 통닭</h3>
                        <p className="text-xs font-semibold text-gray-500 leading-relaxed mb-4">
                          성곽 길을 걷느라 떨어진 당과 체력을 단번에 올려줄 바삭하고 달콤 짭조름한 대표 통닭!
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-1.5 bg-gray-50 rounded-xl p-2.5 text-[11px] font-semibold text-gray-700">
                          <MapPin size={13} className="mt-0.5 shrink-0 text-[#1D9E75]" />
                          <span>수원 팔달구 남문 치킨 골목 일대</span>
                        </div>
                        <div className="bg-[#FFFBEB] border border-[#fde68a] rounded-xl p-2.5 text-[11px] font-bold text-[#78350f] leading-normal">
                          <span className="font-bold text-[#92400e]">⚠️ 웨이팅 팁: </span>
                          오후 1시 30분 이후 방문 또는 원격 줄서기 앱을 미리 확인하세요!
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 카페 */}
                  <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm flex flex-col">
                    <div className="relative aspect-video bg-gray-100">
                      <img
                        src={jeongjiyoungLatteImg}
                        alt="정지영 커피 로스터즈"
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-gray-950 border-none text-white font-bold">카페</Badge>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-extrabold text-sm text-gray-900 mb-2">☕ 행궁 대표 카페 '정지영 커피'</h3>
                        <p className="text-xs font-semibold text-gray-500 leading-relaxed mb-4">
                          오래된 벽돌 주택을 개조한 빈티지한 감성과 성곽길이 내려다보이는 노을 맛집 루프탑 ☕
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-1.5 bg-gray-50 rounded-xl p-2.5 text-[11px] font-semibold text-gray-700">
                          <MapPin size={13} className="mt-0.5 shrink-0 text-[#1D9E75]" />
                          <span>수원 팔달구 행리단길 내 루프탑</span>
                        </div>
                        <div className="bg-[#FFFBEB] border border-[#fde68a] rounded-xl p-2.5 text-[11px] font-bold text-[#78350f] leading-normal">
                          <span className="font-bold text-[#92400e]">⚠️ 루프탑 팁: </span>
                          일몰 40분 전 미리 도착해 루프탑 야외 자리를 찜해두는 게 꿀팁!
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </TabsContent>

            {/* TAB CONTENT 4: REVIEWS */}
            <TabsContent value="reviews" className="space-y-8 focus-visible:outline-none">
              <div className="max-w-3xl">
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">⭐ 고객 생생 리뷰</h2>
                <p className="text-xs text-gray-500 font-semibold mb-6">실제 가이드를 이용해 수원을 다녀오신 분들의 후기입니다.</p>

                {/* 평점 통계 대시보드 */}
                <div className="grid grid-cols-1 md:grid-cols-3 bg-gray-50 rounded-2xl p-6 border border-gray-100 gap-6 text-center md:text-left mb-8 items-center">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-black text-gray-900">4.9</span>
                    <div className="flex items-center gap-0.5 text-yellow-400 my-1 font-sans">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 font-bold">128개의 만족 후기</span>
                  </div>
                  
                  <div className="md:col-span-2 space-y-2 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 text-xs font-bold text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="w-10">5점</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: "92%" }} />
                      </div>
                      <span className="w-8 text-right font-semibold">92%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-10">4점</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: "8%" }} />
                      </div>
                      <span className="w-8 text-right font-semibold">8%</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="w-10">3점 이하</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full" />
                      <span className="w-8 text-right">0%</span>
                    </div>
                  </div>
                </div>

                {/* 리뷰 리스트 */}
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="border border-gray-100 rounded-2xl p-5 shadow-sm bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img src={r.avatar} alt={r.author} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <div className="flex items-center gap-1.5 font-sans">
                              <span className="font-extrabold text-xs text-gray-900">{r.author}</span>
                              <Badge className="bg-gray-100 hover:bg-gray-250 border-none text-gray-600 font-bold text-[9px] px-1.5 py-0.5">
                                {r.tag}
                              </Badge>
                            </div>
                            <span className="text-[10px] text-gray-400 font-semibold">{r.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 text-yellow-400 font-sans">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} size={12} fill={idx < r.rating ? "currentColor" : "none"} className={idx < r.rating ? "" : "text-gray-200"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-gray-600 leading-relaxed">
                        {r.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* TAB CONTENT 5: INFO */}
            <TabsContent value="info" className="space-y-8 focus-visible:outline-none">
              <div className="max-w-3xl space-y-8">
                
                {/* 추천 대상 */}
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-[#1D9E75]" /> 이런 분들께 강력 추천드려요!
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                    {checks.map((c, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-gray-50 border border-gray-100 p-3 rounded-xl">
                        <span className="font-black text-[#1D9E75] text-xs mt-0.5">✓</span>
                        <span className="text-xs font-bold text-gray-700">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 투어 혜택 */}
                <div className="border-t border-gray-100 pt-6">
                  <h2 className="text-lg font-extrabold text-gray-900 mb-4">🎁 코스 포함 혜택 패키지</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-sans">
                    {includes.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-[#E8F5F0] rounded-xl p-3 border border-[#c3e8da]">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-white bg-[#1D9E75] font-black text-[9px] shrink-0">
                          ✓
                        </span>
                        <span className="text-[10px] font-bold text-[#0F6E56]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 진행 단계 */}
                <div className="border-t border-gray-100 pt-6 font-sans">
                  <h2 className="text-lg font-extrabold text-gray-900 mb-4">🚶 가이드 수령 및 이용 방법</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {steps.map((s, idx) => (
                      <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4 relative shadow-sm hover:shadow transition-shadow">
                        <span className="absolute top-4 right-4 text-2xl font-black text-gray-100">0{idx + 1}</span>
                        <span className="w-6 h-6 rounded-full bg-[#1D9E75] text-white flex items-center justify-center font-bold text-xs mb-3">
                          {idx + 1}
                        </span>
                        <p className="font-extrabold text-xs text-gray-900 mb-1">[{s.label}]</p>
                        <p className="text-[10px] font-semibold text-gray-500 leading-relaxed">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ */}
                <div className="border-t border-gray-100 pt-6 font-sans">
                  <h2 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                    <HelpCircle size={18} className="text-[#1D9E75]" /> 자주 묻는 질문 (FAQ)
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, idx) => (
                      <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-gray-100">
                        <AccordionTrigger className="text-xs font-bold text-gray-800 hover:text-[#1D9E75] font-sans">
                          Q. {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-gray-600 font-semibold leading-relaxed font-sans">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

              </div>
            </TabsContent>

          </Tabs>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-white py-12 px-4 pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between font-sans">
          <span className="font-black text-base tracking-wider uppercase" style={{ color: TEAL_DARK }}>
            KSPOT
          </span>
          <Link
            to="/tour"
            className="flex items-center gap-1 font-bold text-xs hover:underline text-[#1D9E75]"
          >
            다른 투어 더 보기 <ArrowRight size={14} />
          </Link>
        </div>
      </footer>

      {/* MOBILE STICKY BOTTOM CTA BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-5 py-3.5 flex items-center justify-between shadow-2xl font-sans gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-bold">막차까지 여유</span>
          <span className="text-base font-extrabold text-[#1D9E75]">{ROUND_TRIP.bufferMinutes}분 · GO</span>
        </div>
        <a
          href={SURVEY_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#1D9E75] hover:bg-[#15805d] text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-colors whitespace-nowrap"
        >
          다른 지역 신청하기
        </a>
      </div>

    </div>
  );
}
