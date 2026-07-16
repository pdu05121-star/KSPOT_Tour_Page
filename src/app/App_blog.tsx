import { useState } from "react";
import { MapPin, ArrowRight, Mail, User, ChevronLeft, Heart, MessageSquare, Share2, CornerDownRight, Bookmark } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Badge } from "@/app/components/ui/badge";

import haenggungImg from "@/assets/suwon/haenggung.jpg";
import hwaseongImg from "@/assets/suwon/hwaseong.jpg";
import bangwhasuryujeongImg from "@/assets/suwon/bangwhasuryujeong.jpg";

const TEAL = "#1D9E75";
const TEAL_DARK = "#0F6E56";
const TEAL_DEEP = "#0A4A3A";
const TEXT_PRIMARY = "#111827";
const TEXT_SECONDARY = "#374151";
const TEXT_MUTED = "#6B7280";
const BORDER = "#E5E7EB";

// Supabase client initialization
const SUPABASE_URL = "https://egsvwegfanydbxvhetzl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnc3Z3ZWdmYW55ZGJ4dmhldHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTk2ODUsImV4cCI6MjA5OTUzNTY4NX0.yhhpZAFqCdHVXwUfacSpsLTGH04K7KrlN-ma3gg3KXg";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // 블로그 인터랙티브 상태
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(148);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "솔선수범",
      content: "와 템플릿 엄청 깔끔하네요! 이번 주말에 남자친구랑 선업튀 대문 골목 갈 때 이 코스 그대로 가봐야겠어요. 벌써 설레네요 ㅠㅠ",
      date: "방금 전",
    },
    {
      id: 2,
      author: "행궁동러버",
      content: "방화수류정 피크닉 돗자리 대여 정보도 가이드북에 들어있나요?? 맛집 우디38 성곽뷰 창가자리 팁 대박이네요 ㅋㅋㅋ 주말 꿀정보 감사해요!",
      date: "1시간 전",
    },
    {
      id: 3,
      author: "과몰입탈출지능순",
      content: "구글맵 핀 링크 신청했습니다. 길치라서 구글지도 찍고 가는 게 제일 편한데 요긴하게 잘 쓸게요!",
      date: "3시간 전",
    }
  ]);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      author: "방문자",
      content: commentText,
      date: "방금 전",
    };
    setComments(prev => [newComment, ...prev]);
    setCommentText("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const { error } = await supabase
        .from("tour_applications")
        .insert([{ name, email, course: "suwon" }]);

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
      className="min-h-screen bg-[#FCFCFA] text-[#2C2C2C] selection:bg-[#E8F5F0]"
      style={{
        fontFamily: 'Georgia, "Times New Roman", "Malgun Gothic", "맑은 고딕", sans-serif',
      }}
    >
      {/* NAV (Blog Header Style) */}
      <nav className="sticky top-0 z-50 bg-[#FCFCFA]/90 backdrop-blur-md border-b border-gray-100 py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-extrabold text-lg tracking-wider text-gray-900" style={{ fontFamily: 'sans-serif' }}>
              KSPOT MAGAZINE
            </span>
            <Badge className="bg-[#E8F5F0] text-[#0F6E56] hover:bg-[#E8F5F0] border-none text-[10px] font-bold">
              에디터 초이스 픽
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <button onClick={handleLike} className={`hover:text-red-500 transition-colors cursor-pointer ${liked ? 'text-red-500' : ''}`}>
              <Heart size={18} fill={liked ? "currentColor" : "none"} />
            </button>
            <button onClick={() => setBookmarked(!bookmarked)} className={`hover:text-amber-500 transition-colors cursor-pointer ${bookmarked ? 'text-amber-500' : ''}`}>
              <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </nav>

      {/* BLOG MAIN CONTAINER */}
      <main className="max-w-2xl mx-auto px-5 py-12 leading-relaxed">
        
        {/* [Section 1] 타이틀 & 도입부 (Intro) */}
        <header className="mb-12">
          {/* 에디터 태그 & 메타 */}
          <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold mb-4" style={{ fontFamily: 'sans-serif' }}>
            <span>수원 여행 코스</span>
            <span>•</span>
            <span>작성자 Editor K</span>
            <span>•</span>
            <span>읽는 시간 5분</span>
          </div>

          <h1 
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight"
            style={{ fontFamily: 'sans-serif' }}
          >
            수원 행궁동에서 만나는 〈선재 업고 튀어〉 타임슬립 로드맵 🎬
          </h1>

          <p 
            className="text-lg sm:text-xl text-gray-500 font-medium mb-8 leading-normal border-l-4 border-[#1D9E75] pl-4 italic"
          >
            아직도 바글바글하고 뻔한 전주·경주만 가시나요? <br />
            선업튀 찐팬들만 몰래 찾는 시크릿 성지 루트를 공개합니다.
          </p>

          {/* 에디터 코멘트 */}
          <div className="bg-[#F4F4F0] rounded-2xl p-6 border border-gray-200/60 my-6">
            <div className="flex gap-2 items-center mb-3">
              <span className="text-sm font-bold text-gray-800" style={{ fontFamily: 'sans-serif' }}>✍️ Editor K's Comment</span>
            </div>
            <blockquote className="text-sm font-medium text-gray-600 leading-relaxed italic">
              "인스타그램 릴스에서 다 알려주지 못한 〈선재 업고 튀어〉 속 진짜 촬영지 골목 좌표부터, 현지인들도 몰래 숨겨둔 웨이팅 ZERO 찐맛집과 루프탑 카페까지. 이 가이드 페이지 하나로 이번 주말 수원 행궁동 당일치기 완벽 졸업하세요. 💛"
            </blockquote>
          </div>
        </header>

        {/* [Section 2] 과몰입 200% K-콘텐츠 촬영지 스팟 (Best 3) */}
        <section className="space-y-16 mb-16">
          <div className="border-b-2 border-gray-900 pb-2 mb-8">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider" style={{ fontFamily: 'sans-serif' }}>
              📍 Part 1. 과몰입 200% K-콘텐츠 촬영지 스팟 (Best 3)
            </h2>
          </div>

          {/* SPOT 1 */}
          <article className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'sans-serif' }}>
              🎬 Spot 1. 솔이네 & 선재네 집 골목
            </h3>
            
            <div className="rounded-2xl overflow-hidden shadow-sm my-4 bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=500&fit=crop&auto=format" 
                alt="솔이네 & 선재네 집 골목" 
                className="w-full object-cover aspect-[16/10]"
              />
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs">
                <p className="font-bold text-[#1D9E75] text-xs uppercase tracking-wider mb-1" style={{ fontFamily: 'sans-serif' }}>🎬 드라마 속 명장면 기억하기</p>
                <p className="text-gray-700 leading-relaxed font-semibold">
                  열아홉 살 선재가 매일 밤 솔이네 집 파란 대문 앞을 수줍게 서성이며 비를 가려주던 그 풋풋하고 뭉클한 등하굣길 골목길입니다. ☂️
                </p>
              </div>

              <div className="flex items-start gap-2 bg-[#F9F9F6] border border-gray-200/50 rounded-xl p-3 text-xs font-semibold text-gray-600">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#1D9E75]" />
                <div>
                  <span className="font-bold text-gray-900">📍 시크릿 좌표: </span>
                  수원시 팔달구 화서문로48번길 일대 (화성행궁에서 도보 5분 거리)
                </div>
              </div>

              <div className="flex items-start gap-2 bg-[#F9F9F6] border border-gray-200/50 rounded-xl p-3 text-xs font-semibold text-gray-600">
                <span className="shrink-0 text-base">🚗</span>
                <div>
                  <span className="font-bold text-gray-900">이동 및 주차 꿀팁: </span>
                  골목길 폭이 좁아 차량 진입이 아예 불가능합니다. 차를 가져오셨다면 '화성행궁 공영주차장'에 차를 세우고 도보로 이동하는 것을 추천합니다.
                </div>
              </div>

              <div className="bg-[#E8F5F0] border border-[#c3e8da] rounded-xl p-4 text-xs text-[#0F6E56] space-y-2 leading-relaxed font-semibold">
                <p className="font-bold text-[11px] tracking-wider uppercase" style={{ fontFamily: 'sans-serif' }}>💡 K-SPOT 에디터 시크릿 꿀팁</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>골든아워 & 구도:</strong> 대문 바로 앞 정면 앵글보다는 골목 아래에서 위쪽(대문 방향)으로 카메라를 약간 올려다보듯 0.5배 광각으로 찍어야 드라마 공식 포스터 느낌이 제대로 살아요!</li>
                  <li><strong>현장 주의사항:</strong> 대문 건너편은 실제 거주 주택입니다. 셔터를 누를 땐 카메라 셔터음 무음 매너는 필수, 속삭이듯 대화해 주세요. 🤫</li>
                </ul>
              </div>
            </div>
          </article>

          <hr className="border-gray-200/70" />

          {/* SPOT 2 */}
          <article className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'sans-serif' }}>
              🎬 Spot 2. 화홍문 & 방화수류정 돌다리
            </h3>
            
            <div className="rounded-2xl overflow-hidden shadow-sm my-4 bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=500&fit=crop&auto=format" 
                alt="화홍문 & 방화수류정 돌다리" 
                className="w-full object-cover aspect-[16/10]"
              />
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs">
                <p className="font-bold text-[#1D9E75] text-xs uppercase tracking-wider mb-1" style={{ fontFamily: 'sans-serif' }}>🎬 드라마 속 명장면 기억하기</p>
                <p className="text-gray-700 leading-relaxed font-semibold">
                  19살 솔이와 선재가 자전거를 끌며 나란히 하교하다가, 수줍게 고백을 주고받던 그 수원천 변 돌다리 징검다리 코스입니다. 🚲
                </p>
              </div>

              <div className="flex items-start gap-2 bg-[#F9F9F6] border border-gray-200/50 rounded-xl p-3 text-xs font-semibold text-gray-600">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#1D9E75]" />
                <div>
                  <span className="font-bold text-gray-900">📍 시크릿 좌표: </span>
                  수원시 팔달구 매향동 수원천로392번길 44-6
                </div>
              </div>

              <div className="flex items-start gap-2 bg-[#F9F9F6] border border-gray-200/50 rounded-xl p-3 text-xs font-semibold text-gray-600">
                <span className="shrink-0 text-base">🚗</span>
                <div>
                  <span className="font-bold text-gray-900">이동 및 주차 꿀팁: </span>
                  Spot 1(골목길)에서 북동쪽 수원천 방향으로 약 도보 10분 소요됩니다. 자차 이용 시 바로 옆 '화홍문 공영주차장'을 활용하세요.
                </div>
              </div>

              <div className="bg-[#E8F5F0] border border-[#c3e8da] rounded-xl p-4 text-xs text-[#0F6E56] space-y-2 leading-relaxed font-semibold">
                <p className="font-bold text-[11px] tracking-wider uppercase" style={{ fontFamily: 'sans-serif' }}>💡 K-SPOT 에디터 시크릿 꿀팁</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>골든아워 & 구도:</strong> 다리 한가운데 서서 포즈를 취하고, 촬영자는 수원천 건너편 둔치로 약간 내려가 화홍문 누각과 물속 반영을 한 앵글에 다 같이 잡는 게 황금 구도입니다.</li>
                  <li><strong>과몰입 포인트:</strong> 귀에 이어폰을 꽂고 드라마 대표 OST인 Eclipse의 '소나기'를 들으면서 이 징검다리를 건너면 감동이 배가 됩니다!</li>
                </ul>
              </div>
            </div>
          </article>

          <hr className="border-gray-200/70" />

          {/* SPOT 3 */}
          <article className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'sans-serif' }}>
              🎬 Spot 3. 방화수류정 피크닉 연못
            </h3>
            
            <div className="rounded-2xl overflow-hidden shadow-sm my-4 bg-gray-100">
              <img 
                src={bangwhasuryujeongImg} 
                alt="방화수류정 피크닉 연못" 
                className="w-full object-cover aspect-[16/10]"
              />
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs">
                <p className="font-bold text-[#1D9E75] text-xs uppercase tracking-wider mb-1" style={{ fontFamily: 'sans-serif' }}>🎬 드라마 속 명장면 기억하기</p>
                <p className="text-gray-700 leading-relaxed font-semibold">
                  주인공 솔선 골목에서 수원 성곽길을 따라 걸어서 7분, 용연 연못 주변 푸른 잔디밭에서 가볍게 돗자리를 펴고 힐링할 수 있는 로컬 쉼터입니다. 🧺
                </p>
              </div>

              <div className="flex items-start gap-2 bg-[#F9F9F6] border border-gray-200/50 rounded-xl p-3 text-xs font-semibold text-gray-600">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#1D9E75]" />
                <div>
                  <span className="font-bold text-gray-900">📍 시크릿 좌표: </span>
                  수원시 팔달구 수원천로 392
                </div>
              </div>

              <div className="flex items-start gap-2 bg-[#F9F9F6] border border-gray-200/50 rounded-xl p-3 text-xs font-semibold text-gray-600">
                <span className="shrink-0 text-base">🚗</span>
                <div>
                  <span className="font-bold text-gray-900">이동 및 주차 꿀팁: </span>
                  Spot 2(화홍문)에서 동쪽으로 도보 2분 거리입니다. 화홍문 주차장을 그대로 이용하시는 편이 제일 저렴하고 동선이 잘 맞습니다.
                </div>
              </div>

              <div className="bg-[#E8F5F0] border border-[#c3e8da] rounded-xl p-4 text-xs text-[#0F6E56] space-y-2 leading-relaxed font-semibold">
                <p className="font-bold text-[11px] tracking-wider uppercase" style={{ fontFamily: 'sans-serif' }}>💡 K-SPOT 에디터 시크릿 꿀팁</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>골든아워 & 구도:</strong> 연못(용연) 건너편 언덕 아래에서 정자 전체와 주변 버드나무가 물에 거울처럼 비치는 각도로 촬영하면 완벽한 데칼코마니 샷이 나옵니다.</li>
                  <li><strong>함께 즐길 거리:</strong> 연못 주변 풀밭에서 돗자리를 펴고 누워 노을을 보거나, 밤에는 성곽 라이트업을 구경하며 고즈넉한 성벽 밤 산책을 즐겨보세요.</li>
                </ul>
              </div>
            </div>
          </article>
        </section>

        {/* [Section 3] 현지인이 숨겨둔 로컬 찐맛집 & 카페 (Best 2) */}
        <section className="space-y-16 mb-16">
          <div className="border-b-2 border-gray-900 pb-2 mb-8">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider" style={{ fontFamily: 'sans-serif' }}>
              🍽️ Part 2. 현지인이 숨겨둔 로컬 찐맛집 & 카페 (Best 2)
            </h2>
          </div>

          {/* FOOD 1 */}
          <article className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'sans-serif' }}>
              🍽️ 1. 수원 갈비 치킨 골목 '수원 왕갈비 통닭'
            </h3>

            <div className="rounded-2xl overflow-hidden shadow-sm my-4 bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&h=450&fit=crop&auto=format" 
                alt="수원 왕갈비 통닭" 
                className="w-full object-cover aspect-[16/9]"
              />
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex gap-2">
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none font-bold text-xs">한식/치킨</Badge>
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-none font-bold text-xs">현지인 맛집</Badge>
              </div>

              <div className="flex items-start gap-2 bg-[#F9F9F6] border border-gray-200/50 rounded-xl p-3 text-xs font-semibold text-gray-600">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#1D9E75]" />
                <div>
                  <span className="font-bold text-gray-900">📍 시크릿 좌표: </span>
                  수원 팔달구 남문 치킨 골목 일대
                </div>
              </div>

              <div className="flex items-start gap-2 bg-[#F9F9F6] border border-gray-200/50 rounded-xl p-3 text-xs font-semibold text-gray-600">
                <span className="shrink-0 text-base">🥩</span>
                <div>
                  <span className="font-bold text-gray-900">무조건 먹어야 할 추천 메뉴: </span>
                  수원왕갈비통닭 한 마리 (약 20,000원 ~ 22,000원 선)
                </div>
              </div>

              <div className="bg-[#FFFBEB] border border-[#fde68a] rounded-xl p-4 text-xs text-[#78350f] space-y-2 leading-relaxed font-semibold">
                <p className="font-bold text-[11px] text-[#92400e] tracking-wider uppercase" style={{ fontFamily: 'sans-serif' }}>💡 K-SPOT 에디터 시크릿 꿀팁</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>웨이팅 피하는 법:</strong> 주말 점심 및 저녁 피크시간대(12시, 18시)는 대기가 기므로, 오후 1시 30분 이후나 오후 5시 이전에 도착하면 여유롭게 자리를 잡을 수 있습니다.</li>
                  <li><strong>에디터의 팁:</strong> 성곽길 걷기로 소모된 에너지를 갈비 양념의 달콤 짭조름함과 바삭한 프라이드 튀김 옷으로 단번에 극복할 수 있는 최고의 코스입니다!</li>
                </ul>
              </div>
            </div>
          </article>

          <hr className="border-gray-200/70" />

          {/* CAFE 2 */}
          <article className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'sans-serif' }}>
              ☕ 2. 노을 맛집 루프탑 카페 '우디38'
            </h3>

            <div className="rounded-2xl overflow-hidden shadow-sm my-4 bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=450&fit=crop&auto=format" 
                alt="우디38 루프탑 카페" 
                className="w-full object-cover aspect-[16/9]"
              />
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex gap-2">
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none font-bold text-xs">루프탑 카페</Badge>
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-none font-bold text-xs">노을 뷰 명당</Badge>
              </div>

              <div className="flex items-start gap-2 bg-[#F9F9F6] border border-gray-200/50 rounded-xl p-3 text-xs font-semibold text-gray-600">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#1D9E75]" />
                <div>
                  <span className="font-bold text-gray-900">📍 시크릿 좌표: </span>
                  수원 팔달구 행리단길 내 루프탑
                </div>
              </div>

              <div className="flex items-start gap-2 bg-[#F9F9F6] border border-gray-200/50 rounded-xl p-3 text-xs font-semibold text-gray-600">
                <span className="shrink-0 text-base">🍰</span>
                <div>
                  <span className="font-bold text-gray-900">무조건 먹어야 할 추천 메뉴: </span>
                  시그니처 플랫화이트 & 크로플 디저트 세트 (약 6,000원 ~ 8,500원)
                </div>
              </div>

              <div className="bg-[#FFFBEB] border border-[#fde68a] rounded-xl p-4 text-xs text-[#78350f] space-y-2 leading-relaxed font-semibold">
                <p className="font-bold text-[11px] text-[#92400e] tracking-wider uppercase" style={{ fontFamily: 'sans-serif' }}>💡 K-SPOT 에디터 시크릿 꿀팁</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>방문 최적 시간대:</strong> 당일 일몰 정보 확인 후, 해가 지기 40분 전쯤 미리 도착하여 옥상 야외 루프탑 테라스 좌석을 선점하세요. 노을이 하늘을 붉게 채우기 시작하는 순간이 하이라이트입니다.</li>
                  <li><strong>에디터 한마디:</strong> 대로변 관광객 전용 소란스러운 카페 말고, 아기자기한 성곽길 지붕선이 한눈에 들어오는 이곳이 아는 로컬들만 노을 보며 힐링하는 진짜 숨은 스팟입니다.</li>
                </ul>
              </div>
            </div>
          </article>
        </section>

        {/* [Section 4] 한눈에 보는 완벽 당일치기 타임테이블 */}
        <section className="mb-16">
          <div className="border-b-2 border-gray-900 pb-2 mb-8">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider" style={{ fontFamily: 'sans-serif' }}>
              ⏱️ Part 3. 한눈에 보는 완벽 당일치기 타임테이블
            </h2>
          </div>

          <div className="relative pl-8 border-l-2 border-gray-100 space-y-8 font-semibold text-sm">
            <div className="relative">
              <span className="absolute -left-[41px] top-0.5 bg-white border-2 border-[#1D9E75] w-6 h-6 rounded-full flex items-center justify-center text-xs">
                🏃
              </span>
              <span className="text-xs text-gray-400 font-bold">11:30</span>
              <h4 className="font-extrabold text-gray-900 mt-1">솔이네 & 선재네 집 골목</h4>
              <p className="text-xs text-gray-500 font-medium mt-1">인파가 몰리기 시작하는 점심 전 한산한 타이밍에 골목에 들러 대문 앞 인생샷을 호다닥 촬영합니다.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[41px] top-0.5 bg-white border-2 border-orange-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                🍽️
              </span>
              <span className="text-xs text-gray-400 font-bold">12:30</span>
              <h4 className="font-extrabold text-gray-900 mt-1">수원 왕갈비 통닭 & 벽화거리</h4>
              <p className="text-xs text-gray-500 font-medium mt-1">점심때 갈비 통닭으로 든든하게 단백질을 충전하고 주변 아기자기한 벽화골목 소품샵을 둘러봅니다.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[41px] top-0.5 bg-white border-2 border-blue-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                🚲
              </span>
              <span className="text-xs text-gray-400 font-bold">14:30</span>
              <h4 className="font-extrabold text-gray-900 mt-1">화홍문 & 방화수류정 돌다리</h4>
              <p className="text-xs text-gray-500 font-medium mt-1">이어폰에 드라마 메인 OST를 켜두고 솔과 선재가 걷던 물 맑은 징검다리를 수줍게 건너 봅니다.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[41px] top-0.5 bg-white border-2 border-gray-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                🧱
              </span>
              <span className="text-xs text-gray-400 font-bold">16:00</span>
              <h4 className="font-extrabold text-gray-900 mt-1">수원 화성 성벽길</h4>
              <p className="text-xs text-gray-500 font-medium mt-1">성곽 위로 불어오는 시원한 그늘 바람을 맞으며 조선시대와 현대가 만나는 전망을 멍하니 감상해 보세요.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[41px] top-0.5 bg-white border-2 border-red-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                🌅
              </span>
              <span className="text-xs text-gray-400 font-bold">17:30</span>
              <h4 className="font-extrabold text-gray-900 mt-1">우디38 루프탑 노을 감상</h4>
              <p className="text-xs text-gray-500 font-medium mt-1">일몰 타이밍에 맞춰 루프탑에 앉아 붉게 물드는 하늘과 서서히 켜지는 수원 성곽 조명을 즐기며 당일치기 코스를 완성합니다.</p>
            </div>
          </div>
        </section>

        {/* 하단 투어 신청 폼 (CTA) */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 text-center my-12 shadow-xs">
          <span className="text-3xl">🚩</span>
          <h3 className="text-lg font-black text-gray-900 mt-4 mb-2" style={{ fontFamily: 'sans-serif' }}>
            KSPOT 수원 행궁동 투어 신청하기
          </h3>
          <p className="text-xs font-semibold text-gray-500 mb-6 leading-relaxed">
            성함과 이메일 주소를 남겨주시면 <strong className="text-[#1D9E75] font-bold">투어 상세 일정표</strong>와 <strong className="text-[#1D9E75] font-bold">모바일 구글맵 핀 패키지</strong>를 메일로 즉시 발송해 드립니다!
          </p>

          {submitted ? (
            <div className="bg-[#E8F5F0] rounded-xl p-5 border border-[#c3e8da] text-center my-4 font-semibold text-xs text-[#0F6E56]">
              🎉 투어 신청이 성공적으로 접수되었습니다! <br />
              <span className="text-xs font-semibold text-[#0F6E56]/70 mt-1.5 inline-block">작성하신 <strong>{email}</strong>로 투어 안내 메일이 곧 발송됩니다.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
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
                <div className="relative flex-[2]">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="메일 주소"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1D9E75] focus:bg-white transition-colors"
                  />
                </div>
              </div>
              {submitError && (
                <p className="text-red-500 text-xs font-semibold text-left">{submitError}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#1D9E75] hover:bg-[#15805d] text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                {submitting ? "접수 중..." : "🔒 지금 바로 투어 신청하기"}
              </button>
            </form>
          )}
        </section>

        {/* INTERACTIVE LIKE & BOOKMARK & SHARE */}
        <section className="flex justify-between items-center border-t border-b border-gray-100 py-4 my-8 text-xs font-bold text-gray-500" style={{ fontFamily: 'sans-serif' }}>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike} 
              className={`flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer ${liked ? 'text-red-500' : ''}`}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
              <span>좋아요 {likeCount}</span>
            </button>
            <div className="flex items-center gap-1.5">
              <MessageSquare size={16} />
              <span>댓글 {comments.length}</span>
            </div>
          </div>
          <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors cursor-pointer">
            <Share2 size={16} />
            <span>공유하기</span>
          </button>
        </section>

        {/* COMMENTS SECTION */}
        <section className="space-y-6 mb-12">
          <h4 className="text-base font-bold text-gray-900" style={{ fontFamily: 'sans-serif' }}>💬 댓글 ({comments.length})</h4>
          
          {/* 댓글 작성 폼 */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="따뜻한 댓글이나 의견을 남겨주세요."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1D9E75] focus:bg-white transition-colors"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-gray-800 cursor-pointer"
            >
              등록
            </button>
          </form>

          {/* 댓글 리스트 */}
          <div className="space-y-4">
            {comments.map(c => (
              <div key={c.id} className="text-xs border-b border-gray-100 pb-3 flex items-start gap-2.5">
                <CornerDownRight size={14} className="text-gray-300 mt-1 shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between font-bold text-gray-500">
                    <span className="text-gray-900">{c.author}</span>
                    <span className="text-[10px] text-gray-300 font-semibold">{c.date}</span>
                  </div>
                  <p className="text-gray-600 font-medium leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-12 px-6 bg-[#F4F4F0] text-xs font-semibold text-gray-400">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© 2026 KSPOT MAGAZINE. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">이용약관</a>
            <a href="#" className="hover:underline">개인정보처리방침</a>
          </div>
        </div>
      </footer>
    </div>
  );
}


