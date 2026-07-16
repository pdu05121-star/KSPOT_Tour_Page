import { Link } from "react-router";
import { Star, ArrowRight, Flame } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import janganmunNightImg from "@/assets/carousel/janganmun_night.jpg";

export default function TourList() {
  const tours = [
    {
      id: "suwon",
      title: "〈선재 업고 튀어〉 타임슬립 수원 로드맵 🎬",
      desc: "임솔♥류선재 촬영지 골목길과 방화수류정 피크닉, 로컬 맛집 남문통닭과 정지영 커피까지 완벽한 당일치기 코스",
      tag: "인기 스팟",
      tagColor: "bg-red-500",
      rating: "4.9",
      reviews: "128",
      price: "0원",
      image: janganmunNightImg,
      status: "active",
    },
    {
      id: "chuncheon",
      title: "〈소도시 감성〉 춘천 호반 의암호 자전거 로드맵 🚲",
      desc: "푸르른 의암호 물길을 따라 달리는 자전거 코스와 춘천 닭갈비 원조 맛집, 호수 뷰 감성 카페 투어",
      tag: "오픈 준비 중",
      tagColor: "bg-gray-400",
      rating: "5.0",
      reviews: "0",
      price: "준비 중",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop&auto=format",
      status: "coming_soon",
    },
    {
      id: "gangneung",
      title: "〈푸른 바다〉 강릉 커피 해변 & 안목해변 로드맵 🌊",
      desc: "동해 바다의 파도 소리를 들으며 걷는 해변 해송길 산책 코스와 초당 순두부, 커피거리 찐 로컬 카페 투어",
      tag: "오픈 준비 중",
      tagColor: "bg-gray-400",
      rating: "4.8",
      reviews: "0",
      price: "준비 중",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&auto=format",
      status: "coming_soon",
    }
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFA] text-[#2C2C2C] py-16 px-6" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-[#E8F5F0] text-[#0F6E56] hover:bg-[#c3e8da] border-none text-[11px] font-bold px-3 py-1">
            KSPOT 에디터스 로드맵 투어
          </Badge>
          <h1 className="serif text-3xl sm:text-4xl md:text-5xl font-black text-gray-955 leading-tight tracking-tight">
            한국 소도시 로컬 투어 프로그램 🗺️
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
            외국인 여행객들이 한국의 아름다운 소도시를 편리하고 안전하게 방문할 수 있도록 엄선한 로컬 가이드 프로그램을 만나보세요.
          </p>
        </div>

        {/* Tour Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
          {tours.map((tour) => (
            <article 
              key={tour.id} 
              className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className={`absolute top-3 left-3 text-white font-bold border-none px-2.5 py-0.5 text-[10px] ${tour.tagColor} flex items-center gap-1`}>
                    {tour.id === "suwon" && <Flame size={10} className="animate-pulse" />}
                    {tour.tag}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 font-semibold text-xs leading-relaxed text-gray-600">
                  <div className="flex items-center gap-1.5 font-sans">
                    <div className="flex items-center text-yellow-400">
                      <Star size={13} fill="currentColor" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-800">{tour.rating}</span>
                    <span className="text-[10px] text-gray-400">({tour.reviews}개 리뷰)</span>
                  </div>

                  <h3 className="font-extrabold text-sm text-gray-955 font-sans leading-snug">
                    {tour.title}
                  </h3>

                  <p className="font-medium text-gray-500 line-clamp-3">
                    {tour.desc}
                  </p>
                </div>
              </div>

              {/* Footer / CTA */}
              <div className="p-5 pt-0 border-t border-gray-50 mt-4 flex items-center justify-between font-sans">
                <span className="text-sm font-black text-[#1D9E75]">{tour.price}</span>
                {tour.status === "active" ? (
                  <Link 
                    to={`/tour/${tour.id}`} 
                    className="flex items-center gap-1 bg-[#1D9E75] hover:bg-[#15805d] text-white px-3.5 py-2 rounded-xl text-[11px] font-bold shadow-xs transition-colors"
                  >
                    가이드 보기
                    <ArrowRight size={12} />
                  </Link>
                ) : (
                  <span className="text-gray-400 text-[11px] font-bold bg-gray-50 border border-gray-100 px-3.5 py-2 rounded-xl">
                    준비 중
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
