import { useState } from "react";
import { Link } from "react-router";
import {
  MapPin,
  ArrowRight,
  Mail,
  User,
  Phone,
  ChevronLeft,
  Star,
  Clock,
  CheckCircle2,
  Footprints,
  Flame,
  HelpCircle
} from "lucide-react";
import { supabase } from "@/app/supabase";

// UI Components
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/app/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Badge } from "@/app/components/ui/badge";

// Local Image Imports
// TODO: 실제 춘천 스팟/맛집/카페 사진으로 교체 필요. 현재는 임시 placeholder 이미지 사용.
import chuncheonPlaceholderImg from "@/assets/chuncheon/placeholder.png";

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

// TODO: 실제 갤러리 사진 4장으로 교체 필요
const galleryImages = [
  chuncheonPlaceholderImg,
  chuncheonPlaceholderImg,
  chuncheonPlaceholderImg,
  chuncheonPlaceholderImg,
];

const spots = [
  {
    id: 1,
    emoji: "🚲",
    tag: "드라마 스팟 1",
    category: "drama",
    title: "남이섬 메타세쿼이아길",
    scene: "겨울연가 배용준·최지우가 자전거를 타고 달리던 그 낭만적인 가로수길 (싱크로율 99.9%) 🚲",
    reality: "사계절 내내 사랑받는 남이섬 대표 포토존. 겨울엔 눈꽃, 가을엔 단풍이 가로수길을 가득 채워요.",
    coord: "춘천시 남산면 남이섬길 1 남이섬 내 메타세쿼이아길",
    photoTip: "가로수 한가운데 서서 길게 뻗은 길을 따라 소실점 구도로 찍으면 드라마 장면과 똑같은 앵글이 나와요!",
    warning: "남이섬은 배편 입장이라 마지막 배 시간을 미리 확인하고 여유 있게 이동해 주세요.",
    syncRate: "99.9%",
    image: chuncheonPlaceholderImg,
  },
  {
    id: 2,
    emoji: "🏃‍♀️",
    tag: "드라마 스팟 2",
    category: "drama",
    title: "춘천대교 & 공지천",
    scene: "스물다섯 스물하나 나희도와 백이진이 함께 달리던 강변 러닝 코스 (싱크로율 99.9%) 🏃‍♀️",
    reality: "의암호를 따라 이어지는 산책·러닝 코스. 노을 질 무렵 강물에 비치는 다리 조명이 특히 아름다워요.",
    coord: "춘천시 근화동 공지천 산책로 일대",
    photoTip: "춘천대교를 배경으로 강변 산책로를 따라 달리는 듯한 역동적인 뒷모습 컷을 찍어보세요.",
    warning: "강변 산책로는 자전거·러너와 동선이 겹치니 사진 찍을 땐 잠시 가장자리로 비켜서 주세요.",
    syncRate: "99.9%",
    image: chuncheonPlaceholderImg,
  },
  {
    id: 3,
    emoji: "🌿",
    tag: "로컬 힐링 스팟",
    category: "local",
    title: "소양강 스카이워크",
    scene: "수면 위 유리 바닥을 걸으며 즐기는 짜릿한 호수 산책 🚶‍♂️",
    reality: "발밑으로 소양강이 그대로 내려다보이는 유리 다리. 짧지만 강렬한 인생샷 포인트로 인기가 많아요.",
    coord: "춘천시 근화동 소양강 스카이워크",
    photoTip: "유리 바닥 위에 서서 발과 강물이 함께 나오게 아래쪽 앵글로 찍으면 스릴 넘치는 사진이 나와요.",
    warning: "우천 시 바닥이 미끄러울 수 있어 슬리퍼보다는 운동화 착용을 추천드려요.",
    syncRate: "",
    image: chuncheonPlaceholderImg,
  },
  {
    id: 4,
    emoji: "🚴",
    tag: "로컬 힐링 스팟",
    category: "local",
    title: "김유정역 레일바이크",
    scene: "경춘선 옛 폐선로를 따라 페달을 밟으며 달리는 레트로 감성 라이딩 🚴",
    reality: "더 이상 기차가 다니지 않는 옛 철길을 레일바이크로 달리는 이색 체험. 터널 구간에서는 조명쇼도 즐길 수 있어요.",
    coord: "춘천시 신동면 김유정역길 1 김유정역 레일바이크",
    photoTip: "터널 진입 전, 옛 철길 표지판과 레일바이크를 함께 담으면 레트로한 감성 사진이 완성돼요.",
    warning: "회차별 정원과 출발 시간이 정해져 있으니 미리 온라인 예약을 추천드려요.",
    syncRate: "",
    image: chuncheonPlaceholderImg,
  },
  {
    id: 5,
    emoji: "🌸",
    tag: "로컬 힐링 스팟",
    category: "local",
    title: "아침고요수목원",
    scene: "사계절 내내 다른 얼굴을 보여주는 화려한 꽃 정원 산책 🌸",
    reality: "춘천 동선에 포함되는 가평의 대표 정원. 계절마다 테마 정원이 바뀌어 언제 가도 새로운 풍경을 만날 수 있어요.",
    coord: "가평군 상면 수목원로 432 아침고요수목원",
    photoTip: "정원 중앙 분수대를 배경으로 계절 꽃이 가득한 화단을 함께 담으면 화보 같은 사진이 나와요.",
    warning: "야간 개장 시즌(오색별빛정원전)에는 조명 연출이 다르니 방문 전 운영 시간을 확인해 주세요.",
    syncRate: "",
    image: chuncheonPlaceholderImg,
  },
];

const timeline = [
  { time: "09:00", emoji: "🚲", spot: "Spot 1", title: "남이섬 메타세쿼이아길", desc: "인파 몰리기 전 이른 배편으로 입도해 가로수길 인생샷 찍기", dotColor: TEAL },
  { time: "10:30", emoji: "🏃‍♀️", spot: "Spot 2", title: "춘천대교 & 공지천", desc: "강변을 따라 걸으며 나희도·백이진 러닝 씬 인증샷 남기기", dotColor: "#3B82F6" },
  { time: "12:00", emoji: "🍽️", spot: "맛집", title: "춘천 명동닭갈비골목", desc: "매콤 달콤 춘천 원조 닭갈비로 든든하게 채우는 점심", dotColor: "#F59E0B" },
  { time: "14:00", emoji: "🌿", spot: "Spot 3", title: "소양강 스카이워크", desc: "유리 바닥 위를 걸으며 짜릿한 호수 전망 즐기기", dotColor: "#10B981" },
  { time: "15:30", emoji: "🚴", spot: "Spot 4", title: "김유정역 레일바이크", desc: "폐선로 따라 달리는 레트로 감성 레일바이크 라이딩", dotColor: TEXT_MUTED },
  { time: "17:00", emoji: "🌸", spot: "Spot 5 + 카페", title: "아침고요수목원 & 강촌 막국수 카페", desc: "꽃 정원 산책 후 막국수와 커피로 여유롭게 하루 마무리", dotColor: "#D85A30" },
];

const checks = [
  "〈겨울연가〉·〈스물다섯 스물하나〉 여운이 남아있는 레트로 감성 애호가 분",
  "서울 근교 당일치기로 청춘 드라마 성지를 따라 걷고 싶으신 분",
  "길 헤매지 않고 알짜 동선으로 완벽하게 돌고 싶으신 분",
  "SNS 피드를 빛낼 인생샷 구도가 필요하신 분",
];

const includes = [
  "드라마 스팟 2곳 + 로컬 힐링 명소 3곳",
  "현지인 찐맛집 & 카페 추천",
  "인생샷 보장 구도 팁 (싱크로율 99.9%)",
  "완벽 당일치기 타임테이블",
  "구글맵 핀 리스트 공유",
  "실시간 안심 지도 서비스",
];

const steps = [
  { label: "신청", desc: "이름/연락처/이메일 남기기" },
  { label: "안내", desc: "10분 내 투어 가이드 메일 발송" },
  { label: "확인", desc: "완벽 동선 구글맵 핀 + 가이드북 수령" },
  { label: "출발", desc: "가벼운 마음으로 당일 출발!" },
];

const reviews = [
  {
    id: 1,
    author: "겨울연가덕후",
    rating: 5,
    date: "2026-07-11",
    content: "남이섬 메타세쿼이아길 걸으면서 진짜 겨울연가 그 장면 생각나서 울컥했어요ㅠㅠ 레일바이크도 아이랑 같이 타기 딱 좋았고, 닭갈비도 정말 맛있었습니다!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format",
    tag: "과몰입러",
  },
  {
    id: 2,
    author: "스물다섯러버",
    rating: 5,
    date: "2026-07-08",
    content: "공지천 러닝 코스에서 나희도 백이진 생각하면서 걸었는데 뷰가 진짜 예뻤어요. 구글맵 핀 리스트 덕분에 동선 안 헤매고 하루 알차게 다녀왔습니다.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
    tag: "당일치기 전문가",
  },
  {
    id: 3,
    author: "레트로감성",
    rating: 4,
    date: "2026-07-04",
    content: "드라마를 몰라도 소양강 스카이워크랑 아침고요수목원만으로 힐링 제대로 했어요! 레일바이크는 인기가 많아서 미리 예약하고 가시길 추천합니다.",
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
    a: "발송되는 이메일에 포함된 구글맵 링크를 클릭하시면 본인의 구글 지도 앱에 'KSPOT 춘천 코스'가 자동으로 저장 및 표기되어 간편하게 사용하실 수 있습니다."
  },
  {
    q: "드라마를 보지 않았어도 투어를 즐길 수 있나요?",
    a: "물론입니다! 소양강 스카이워크, 김유정역 레일바이크, 아침고요수목원은 드라마를 보지 않으신 분들도 충분히 즐기고 힐링할 수 있는 대표 명소입니다."
  },
  {
    q: "레일바이크는 예약이 꼭 필요한가요? 아침고요수목원까지 이동은 어떻게 하나요?",
    a: "레일바이크는 회차별 정원이 정해져 있어 온라인 사전 예약을 강력히 추천드립니다. 아침고요수목원은 가평 소재로 춘천 동선상에 자연스럽게 포함되며, 차량 이동 기준 약 30~40분 소요됩니다."
  }
];

export default function ChuncheonTour() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const fullNameWithPhone = `${name.trim()} (${phone.trim()})`;
      const { error } = await supabase
        .from("tour_applications")
        .insert([{ name: fullNameWithPhone, email: email.trim(), course: "chuncheon" }]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      console.error("Supabase insert error:", err);
      setSubmitError("신청서 제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

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
                alt="춘천 투어 갤러리 이미지"
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-[#1D9E75] text-white hover:bg-[#15805d] border-none font-bold px-3 py-1 text-xs">
                  📍 춘천
                </Badge>
                <Badge className="bg-orange-500 text-white hover:bg-orange-600 border-none font-bold px-3 py-1 text-xs flex gap-1 items-center">
                  <Flame size={12} className="animate-pulse" />
                  레트로 성지
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

          {/* RIGHT: Product Box & Booking Card */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="lg:sticky lg:top-20 bg-white rounded-2xl p-6 border border-gray-100 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5 text-yellow-400 font-sans">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-700">5.0</span>
                <span className="text-xs text-gray-400 font-semibold">(후기 74개)</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black leading-tight text-gray-900 mb-3 tracking-tight">
                [겨울연가 × 스물다섯 스물하나] 레트로와 청춘이 공존하는 춘천 당일치기 코스 가이드
              </h1>

              <p className="text-xs font-semibold text-gray-500 mb-5 leading-relaxed">
                레트로와 청춘이 공존하는 당일치기 최적 코스, 남이섬부터 소양강 스카이워크까지 이어지는 완벽 동선 가이드북 & 실시간 길 찾기 구글맵 핀 패키지 🚲
              </p>

              {/* 스펙 리스트 */}
              <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl text-xs font-bold text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
                    <Clock size={14} /> 소요 시간
                  </span>
                  <span className="text-gray-700">약 8시간 (당일치기)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
                    <Footprints size={14} /> 여행 난이도
                  </span>
                  <span className="text-gray-700">보통 (도보 + 레일바이크 병행)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 size={14} /> 포함 혜택
                  </span>
                  <span className="text-[#1D9E75]">구글맵 핀 + 가이드북 PDF</span>
                </div>
              </div>

              {/* 가격/무료 명시 영역 */}
              <div className="flex justify-between items-center mb-6 border-t border-gray-100 pt-4">
                <span className="text-xs font-bold text-gray-500">가이드 비용</span>
                <span className="text-lg font-black text-[#1D9E75]">무료</span>
              </div>

              {/* 신청 폼 (데스크톱 전용) */}
              <div className="hidden md:block">
                {submitted ? (
                  <div className="bg-[#E8F5F0] rounded-xl p-5 border border-[#c3e8da] text-center">
                    <p className="text-2xl mb-1">🎉</p>
                    <p className="font-extrabold text-[#0F6E56] text-xs">투어 프로그램 신청 완료!</p>
                    <p className="text-[10px] text-[#0F6E56]/80 mt-1 font-semibold leading-relaxed">
                      작성해주신 정보를 확인하여<br />빠른 시일 내에 연락드리겠습니다.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3 font-sans">
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="이름을 입력해 주세요"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1D9E75] focus:bg-white transition-colors"
                        />
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <input
                          type="tel"
                          placeholder="연락처 (예: 010-1234-5678)"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1D9E75] focus:bg-white transition-colors"
                        />
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="가이드를 받을 이메일 주소"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1D9E75] focus:bg-white transition-colors"
                        />
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    {submitError && (
                      <p className="text-red-500 text-[10px] font-semibold text-left">{submitError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-[#1D9E75] hover:bg-[#15805d] text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer"
                    >
                      {submitting ? "신청 처리 중..." : "🔒 투어 프로그램 신청하기"}
                    </button>
                  </form>
                )}
              </div>

              {/* Social Proof Rest limit progress bar */}
              <div className="mt-4 space-y-1.5 text-gray-600 font-sans">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>신청 인원 47명</span>
                  <span className="text-red-500 animate-pulse">오늘 남은 혜택 수량 5개!</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 rounded-full" style={{ width: "47%" }} />
                </div>
              </div>

              {/* 모바일 화면용 간단 텍스트 */}
              <div className="block md:hidden text-center bg-gray-50 py-2.5 rounded-xl text-xs font-bold text-gray-600">
                👇 하단의 '무료로 받기' 버튼으로 바로 신청하세요!
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
                이용후기 (74)
              </TabsTrigger>
              <TabsTrigger value="info" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1D9E75] data-[state=active]:text-[#1D9E75] data-[state=active]:bg-transparent font-bold text-xs sm:text-sm px-4 h-full cursor-pointer">
                이용안내 & FAQ
              </TabsTrigger>
            </TabsList>

            {/* TAB CONTENT 1: SPOTS */}
            <TabsContent value="spots" className="space-y-8 focus-visible:outline-none">
              <div className="max-w-3xl">
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">🎬 드라마 촬영지 & 명소 상세</h2>
                <p className="text-xs text-gray-500 font-semibold mb-6">춘천의 숨은 뷰 포인트와 카메라 앵글 잡는 가이드까지 함께 담았습니다.</p>

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
                <p className="text-xs text-gray-500 font-semibold mb-8">이른 아침 남이섬부터 저녁 꽃 정원까지 가장 부드럽게 이어지는 로컬 가이드 픽 동선입니다.</p>

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
                <p className="text-xs text-gray-500 font-semibold mb-6">투어 코스 중간에 쉽게 방문할 수 있는 춘천 대표 맛집과 강촌 감성 카페입니다.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* 맛집 */}
                  <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm flex flex-col">
                    <div className="relative aspect-video bg-gray-100">
                      <img
                        src={chuncheonPlaceholderImg}
                        alt="춘천 명동닭갈비골목"
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-orange-550 border-none text-white font-bold">맛집</Badge>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-extrabold text-sm text-gray-900 mb-2">🍗 춘천 명동닭갈비골목</h3>
                        <p className="text-xs font-semibold text-gray-500 leading-relaxed mb-4">
                          레일바이크 라이딩으로 떨어진 당과 체력을 단번에 올려줄 매콤 달콤 춘천 원조 닭갈비!
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-1.5 bg-gray-50 rounded-xl p-2.5 text-[11px] font-semibold text-gray-700">
                          <MapPin size={13} className="mt-0.5 shrink-0 text-[#1D9E75]" />
                          <span>춘천시 명동길 닭갈비골목 일대</span>
                        </div>
                        <div className="bg-[#FFFBEB] border border-[#fde68a] rounded-xl p-2.5 text-[11px] font-bold text-[#78350f] leading-normal">
                          <span className="font-bold text-[#92400e]">⚠️ 웨이팅 팁: </span>
                          주말 점심에는 웨이팅이 있으니 11시 30분 이전 방문을 추천해요!
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 카페 */}
                  <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm flex flex-col">
                    <div className="relative aspect-video bg-gray-100">
                      <img
                        src={chuncheonPlaceholderImg}
                        alt="강촌 막국수 카페"
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-gray-950 border-none text-white font-bold">카페</Badge>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-extrabold text-sm text-gray-900 mb-2">☕ 강촌 막국수 카페</h3>
                        <p className="text-xs font-semibold text-gray-500 leading-relaxed mb-4">
                          시원한 막국수와 감성 커피를 한 공간에서 즐기는 강촌의 이색 로컬 카페 ☕
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-1.5 bg-gray-50 rounded-xl p-2.5 text-[11px] font-semibold text-gray-700">
                          <MapPin size={13} className="mt-0.5 shrink-0 text-[#1D9E75]" />
                          <span>춘천시 남산면 강촌로 일대</span>
                        </div>
                        <div className="bg-[#FFFBEB] border border-[#fde68a] rounded-xl p-2.5 text-[11px] font-bold text-[#78350f] leading-normal">
                          <span className="font-bold text-[#92400e]">⚠️ 방문 팁: </span>
                          여름철 성수기에는 대기 시간이 길 수 있어 오후 4시 이전 방문을 추천해요!
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
                <p className="text-xs text-gray-500 font-semibold mb-6">실제 가이드를 이용해 춘천을 다녀오신 분들의 후기입니다.</p>

                {/* 평점 통계 대시보드 */}
                <div className="grid grid-cols-1 md:grid-cols-3 bg-gray-50 rounded-2xl p-6 border border-gray-100 gap-6 text-center md:text-left mb-8 items-center">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-black text-gray-900">5.0</span>
                    <div className="flex items-center gap-0.5 text-yellow-400 my-1 font-sans">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 font-bold">74개의 만족 후기</span>
                  </div>

                  <div className="md:col-span-2 space-y-2 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 text-xs font-bold text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="w-10">5점</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: "95%" }} />
                      </div>
                      <span className="w-8 text-right font-semibold">95%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-10">4점</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: "5%" }} />
                      </div>
                      <span className="w-8 text-right font-semibold">5%</span>
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-5 py-3.5 flex items-center justify-between shadow-2xl font-sans">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-bold">가이드 비용</span>
          <span className="text-base font-extrabold text-[#1D9E75]">무료</span>
        </div>

        {/* 모바일 예약 팝업용 Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="bg-[#1D9E75] hover:bg-[#15805d] text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md cursor-pointer transition-colors">
              투어 신청하기
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-base font-extrabold text-gray-900 font-sans">
                🎁 투어 프로그램 신청하기
              </DialogTitle>
              <DialogDescription className="text-xs font-semibold text-gray-500 font-sans">
                성함, 연락처, 이메일을 남겨주시면 담당자가 빠른 시일 내에 연락을 드립니다.
              </DialogDescription>
            </DialogHeader>

            {submitted ? (
              <div className="bg-[#E8F5F0] rounded-xl p-5 border border-[#c3e8da] text-center my-4 font-sans">
                <p className="text-2xl mb-1">🎉</p>
                <p className="font-extrabold text-[#0F6E56] text-xs">신청이 정상 접수되었습니다!</p>
                <p className="text-[10px] text-[#0F6E56]/80 mt-1 font-semibold leading-relaxed">
                  남겨주신 정보를 확인하여<br />빠른 시일 내에 연락드리겠습니다.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 py-4 font-sans">
                <div className="space-y-3">
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="이름"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1D9E75] focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="연락처 (예: 010-1234-5678)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1D9E75] focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="이메일 주소"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1D9E75] focus:bg-white transition-colors"
                    />
                  </div>
                </div>
                {submitError && (
                  <p className="text-red-500 text-[10px] font-semibold text-left">{submitError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#1D9E75] hover:bg-[#15805d] text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  {submitting ? "접수 중..." : "🔒 신청 완료하기"}
                </button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

    </div>
  );
}
