import { useState } from "react";
import { Link } from "react-router";
import "@/styles/router.css";
import LangFormModal from "@/app/components/LangFormModal";
import BrandLogo from "@/app/components/BrandLogo";
import { FormLang, FORM_URLS, getStoredLang, setStoredLang } from "@/app/surveyConfig";
import janganmunNightImg from "@/assets/carousel/janganmun_night.jpg";
import tourHeroImg from "@/assets/tour/hero_traveler_hanok.jpg";

type Lang = FormLang;

// 도시 카드 데이터 — 배열로 관리 (개발지시서 지시사항: 하드코딩 금지, 도시 추가 잦을 예정)
// COMING SOON 목록은 RE_PRD_v1.1의 타겟 10개 지역(경주·포항·부산·대구·전주·강릉·제주·여수·순천·춘천) +
// 캐러셀_제작_프롬프트_가이드의 드라마 페어링 기준. 확정 안 된 도시는 K태그 생략.
type TourCard = {
  id: string;
  status: "open" | "next" | "wait";
  order: string; // "01", "02" ...
  cityline: string;
  kTag?: string; // K콘텐츠 태그, 없으면 생략
  title: string;
  desc: string;
  thumb?: string; // open 카드만 사용
  link?: string; // open 카드만 사용
};

const OPEN_KO: TourCard = {
  id: "suwon", status: "open", order: "01", cityline: "SUWON 수원",
  kTag: "◉ 선재 업고 튀어", title: "타임슬립 골목과 성곽 뷰",
  desc: "드라마 속 그 골목길, 로컬 통닭 성지, 노을 지는 루프탑까지 — 서울에서 다녀오는 하루",
  thumb: janganmunNightImg, link: "/tour/suwon",
};
const OPEN_EN: TourCard = {
  id: "suwon", status: "open", order: "01", cityline: "SUWON",
  kTag: "◉ Lovely Runner", title: "Time-slip alleys & fortress views",
  desc: "The alley from the show, a local fried-chicken spot, a rooftop at golden hour — a day trip from Seoul.",
  thumb: janganmunNightImg, link: "/tour/suwon",
};
const OPEN_JA: TourCard = {
  id: "suwon", status: "open", order: "01", cityline: "SUWON 水原",
  kTag: "◉ ソンジェ背負って走れ", title: "タイムスリップの路地と城郭ビュー",
  desc: "ドラマのあの路地、ローカルなチキンの名店、夕日のルーフトップまで — ソウルから行く日帰り。",
  thumb: janganmunNightImg, link: "/tour/suwon",
};
const OPEN_ZH: TourCard = {
  id: "suwon", status: "open", order: "01", cityline: "SUWON 水原",
  kTag: "◉ 背着善宰跑", title: "穿越时空的小巷与城郭美景",
  desc: "剧中那条小巷、本地炸鸡名店、夕阳下的天台 — 从首尔出发的一日游。",
  thumb: janganmunNightImg, link: "/tour/suwon",
};
const OPEN_VI: TourCard = {
  id: "suwon", status: "open", order: "01", cityline: "SUWON Suwon",
  kTag: "◉ Cõng anh mà chạy", title: "Ngõ phố du hành thời gian & View thành quách",
  desc: "Từ con hẻm nhỏ trong phim, thánh địa gà rán địa phương, đến sân thượng ngắm hoàng hôn — chuyến đi trong ngày từ Seoul.",
  thumb: janganmunNightImg, link: "/tour/suwon",
};

// 잠금 카드 공통 정보 (도시명 표기만 언어별로 다름, 순서/태그/상태는 공통)
// 춘천·강릉: 7/21 팀장 언급대로 7월 내 오픈 목표라 "곧 오픈" + 드라마 태그 확정(춘천=겨울연가, 강릉=도깨비).
// 전주·포항·제주·부산: 드라마 태그 확정된 곳만 노출(기획 결정, 2026-07-22, 부산=쌈,마이웨이 팀 확인 완료) —
// 태그 없는 나머지 4곳(경주·대구·여수·순천)은 드라마 페어링 미확정이라 CLAUDE.md 원칙상 AI가 임의로 못 붙여서 목록에서 제외.
const LOCKED_META: { id: string; order: string; status: "next" | "wait"; kTag?: string }[] = [
  { id: "chuncheon", order: "02", status: "next", kTag: "◉ 겨울연가" },
  { id: "gangneung", order: "03", status: "next", kTag: "◉ 도깨비" },
  { id: "jeonju", order: "04", status: "wait", kTag: "◉ 구르미 그린 달빛" },
  { id: "pohang", order: "05", status: "wait", kTag: "◉ 갯마을 차차차" },
  { id: "jeju", order: "06", status: "wait", kTag: "◉ 웰컴투 삼달리" },
  { id: "busan", order: "07", status: "wait", kTag: "◉ 쌈, 마이웨이" },
];

const LOCKED_CITYLINE: Record<string, Record<Lang, string>> = {
  chuncheon: { ko: "CHUNCHEON 춘천", en: "CHUNCHEON", ja: "CHUNCHEON 春川", zh: "CHUNCHEON 春川", vi: "CHUNCHEON Chuncheon" },
  gangneung: { ko: "GANGNEUNG 강릉", en: "GANGNEUNG", ja: "GANGNEUNG 江陵", zh: "GANGNEUNG 江陵", vi: "GANGNEUNG Gangneung" },
  jeonju: { ko: "JEONJU 전주", en: "JEONJU", ja: "JEONJU 全州", zh: "JEONJU 全州", vi: "JEONJU Jeonju" },
  pohang: { ko: "POHANG 포항", en: "POHANG", ja: "POHANG 浦項", zh: "POHANG 浦项", vi: "POHANG Pohang" },
  jeju: { ko: "JEJU 제주", en: "JEJU", ja: "JEJU 済州", zh: "JEJU 济州", vi: "JEJU Jeju" },
  busan: { ko: "BUSAN 부산", en: "BUSAN", ja: "BUSAN 釜山", zh: "BUSAN 釜山", vi: "BUSAN Busan" },
};

// 미공개 코스 타이틀 — "곧 열려요/공개 준비 중" 같은 오픈 예고 문구는 status 배지가 이미 담당하므로
// 여기서는 코스의 장면·분위기만 담아 궁금증을 유발 (2026-07-22 결정)
const LOCKED_TITLE: Record<string, Record<Lang, string>> = {
  chuncheon: { ko: "눈 내리던 그 겨울, 호숫가 가로수길", en: "That lakeside road under falling winter snow", ja: "雪降るその冬、湖畔の並木道", zh: "那个飘雪的冬天，湖边林荫道", vi: "Con đường ven hồ mùa đông tuyết rơi năm ấy" },
  gangneung: { ko: "파도 부서지던 그 방파제, 도깨비의 바다", en: "The breakwater where waves crash — Dokkaebi's sea", ja: "波が砕けるその防波堤、トッケビの海", zh: "浪花拍打的那道防波堤，鬼怪的大海", vi: "Con đê sóng vỗ, biển của Dokkaebi" },
  jeonju: { ko: "달빛 아래 그 궁궐 골목", en: "That palace alley under the moonlight", ja: "月明かりの下、あの宮殿の路地", zh: "月光下，那条宫殿小巷", vi: "Con hẻm cung điện dưới ánh trăng năm ấy" },
  pohang: { ko: "바닷마을 그 벤치, 방파제의 온기", en: "That seaside bench, warmth of the breakwater", ja: "海辺の村のあのベンチ、防波堤のぬくもり", zh: "海边小镇那张长椅，防波堤的温度", vi: "Chiếc ghế bên bờ biển, hơi ấm của con đê" },
  jeju: { ko: "섬마을 골목과 그 해안도로", en: "That island alley and coastal road", ja: "島の村の路地と、あの海岸道路", zh: "海岛小巷与那条海岸公路", vi: "Con hẻm làng đảo và con đường ven biển đó" },
  busan: { ko: "그 옥탑방 동네, 골목 계단 사이", en: "That rooftop neighborhood, between alley stairs", ja: "あの屋上部屋の町、路地の階段の間", zh: "那个屋顶房社区，巷子台阶之间", vi: "Khu xóm gác thượng đó, giữa những bậc thang trong hẻm" },
};

function buildLockedCards(lang: Lang): TourCard[] {
  return LOCKED_META.map((m) => ({
    id: m.id,
    status: m.status,
    order: m.order,
    cityline: LOCKED_CITYLINE[m.id][lang],
    kTag: m.kTag,
    title: LOCKED_TITLE[m.id][lang],
    desc: "",
  }));
}

const TOURS: Record<Lang, TourCard[]> = {
  ko: [OPEN_KO, ...buildLockedCards("ko")],
  en: [OPEN_EN, ...buildLockedCards("en")],
  ja: [OPEN_JA, ...buildLockedCards("ja")],
  zh: [OPEN_ZH, ...buildLockedCards("zh")],
  vi: [OPEN_VI, ...buildLockedCards("vi")],
};

const COPY: Record<Lang, {
  eyebrow: string; heroTitleLine1: string; heroTitleLine2: string; heroPre: string; heroKk: string; heroPost: string; heroAlt: string;
  nowOpen: string; comingSoon: string; openCta: string; nextBadge: string; waitBadge: string; notify: string;
}> = {
  ko: {
    eyebrow: "🔓 KSPOT 시크릿 언락",
    heroTitleLine1: "한국에 이런 곳이 있다고?",
    heroTitleLine2: "— 가도 괜찮은 곳인지, 저희가 먼저 확인했어요.",
    heroPre: "화면 속에서 보던 ",
    heroKk: "그 장소",
    heroPost: "부터 현지인들만 아는 스팟까지, 무사히 다녀올 수 있는 코스만 열어드려요.",
    heroAlt: "배낭을 멘 여행자가 한옥마을을 내려다보는 모습",
    nowOpen: "NOW OPEN",
    comingSoon: "COMING SOON",
    openCta: "이 코스 열어보기 →",
    nextBadge: "곧 오픈", waitBadge: "오픈 예정",
    notify: "알림받기",
  },
  en: {
    eyebrow: "🔓 KSPOT SECRET UNLOCK",
    heroTitleLine1: "Korea has a place like THIS?",
    heroTitleLine2: "— We checked if it's safe to visit, first.",
    heroPre: "From ",
    heroKk: "the places you saw on screen",
    heroPost: " to spots only locals know about, we only unlock courses you can safely make it back from.",
    heroAlt: "A traveler with a backpack looking out over a hanok village",
    nowOpen: "NOW OPEN",
    comingSoon: "COMING SOON",
    openCta: "Open this course →",
    nextBadge: "Opening soon", waitBadge: "Coming later",
    notify: "Notify me",
  },
  ja: {
    eyebrow: "🔓 KSPOT シークレット解禁",
    heroTitleLine1: "韓国にこんな場所が?",
    heroTitleLine2: "— 行っても大丈夫か、先に確認しました。",
    heroPre: "画面で見た",
    heroKk: "あの場所",
    heroPost: "から地元の人だけが知るスポットまで、無事に楽しめるコースだけを解禁します。",
    heroAlt: "リュックを背負った旅行者が韓屋村を見下ろす様子",
    nowOpen: "NOW OPEN",
    comingSoon: "COMING SOON",
    openCta: "このコースを開く →",
    nextBadge: "近日オープン", waitBadge: "今後公開予定",
    notify: "通知を受け取る",
  },
  zh: {
    eyebrow: "🔓 KSPOT 秘密解锁",
    heroTitleLine1: "韩国竟然有这种地方?",
    heroTitleLine2: "— 能不能去，我们先帮你确认了。",
    heroPre: "从",
    heroKk: "你在屏幕上看过的那个地方",
    heroPost: "到只有当地人才知道的秘境，只解锁能安全往返的路线。",
    heroAlt: "背着背包的旅行者俯瞰韩屋村的景象",
    nowOpen: "NOW OPEN",
    comingSoon: "COMING SOON",
    openCta: "打开这条路线 →",
    nextBadge: "即将开放", waitBadge: "敬请期待",
    notify: "通知我",
  },
  vi: {
    eyebrow: "🔓 MỞ KHÓA BÍ MẬT KSPOT",
    heroTitleLine1: "Hàn Quốc có một nơi như THẾ NÀY sao?",
    heroTitleLine2: "— Chúng tôi đã kiểm tra xem nơi đó có an toàn để đi trước đã.",
    heroPre: "Từ ",
    heroKk: "địa điểm bạn thấy trên màn ảnh",
    heroPost: " đến những góc phố chỉ người dân địa phương mới biết, chúng tôi chỉ mở khóa những lộ trình mà bạn có thể quay về an toàn.",
    heroAlt: "Một du khách đeo balo nhìn xuống ngôi làng hanok",
    nowOpen: "NOW OPEN",
    comingSoon: "COMING SOON",
    openCta: "Mở khóa lộ trình này →",
    nextBadge: "Sắp mở", waitBadge: "Dự kiến ra mắt",
    notify: "Nhận thông báo",
  },
};

const LANGS: { code: Lang; label: string }[] = [
  { code: "ko", label: "한" },
  { code: "en", label: "EN" },
  { code: "ja", label: "日" },
  { code: "zh", label: "中" },
  { code: "vi", label: "VI" },
];

// 최초 방문 언어 선택 게이트 — 신청서로 강제 이동시키지 않고, 언어부터 고르게 함 (2026-07-23 흐름 개편 v2)
const LANG_GATE_OPTIONS: { code: Lang; flag: string; label: string }[] = [
  { code: "ko", flag: "🇰🇷", label: "한국어" },
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "ja", flag: "🇯🇵", label: "日本語" },
  { code: "zh", flag: "🇨🇳", label: "中文" },
  { code: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
];

// 언어 선택 직후 같은 페이지에 표시하는 "행동 선택" 2버튼 — A(메인: 구글폼) / B(보조: 수원 코스 예시)
const ACTION_CTA: Record<Lang, { mainTitle: string; mainSub: string; secondaryTitle: string; secondarySub: string }> = {
  ko: { mainTitle: "내 최애 장소, 다음 코스로 만들기", mainSub: "약 2분 · 많이 찾는 곳부터 열려요", secondaryTitle: "화면 속 그 골목, 수원에서 하루", secondarySub: "막차까지 완벽 계산 끝난 진짜 코스" },
  en: { mainTitle: "Turn your bias's spot into the next course", mainSub: "About 2 min · Most-requested opens first", secondaryTitle: "That alley from the screen — a day in Suwon", secondarySub: "A real course, calculated down to the last train home" },
  ja: { mainTitle: "推しの聖地を、次のコースにする", mainSub: "約2分・リクエストの多い街から先に公開", secondaryTitle: "画面で見たあの路地、水原で過ごす一日", secondarySub: "終電まで計算し尽くした、本物のコース" },
  zh: { mainTitle: "把你的本命取景地，变成下一条路线", mainSub: "约2分钟 · 需求最多的地区优先开放", secondaryTitle: "屏幕里的那条小巷，水原的一天", secondarySub: "连末班车都算好的真实路线" },
  vi: { mainTitle: "Biến địa điểm bias của bạn thành lộ trình tiếp theo", mainSub: "Khoảng 2 phút · Khu vực được yêu cầu nhiều nhất sẽ mở trước", secondaryTitle: "Con hẻm bạn thấy trên màn ảnh — một ngày ở Suwon", secondarySub: "Lộ trình thực tế, đã tính toán đến tận chuyến tàu cuối" },
};

// 섹션 헤더 — 랜딩페이지의 eyebrow(영문 키워드 — 한글 설명) + title + lead 공식을 그대로 차용 (2026-07-23 섹션 분리)
const SECTIONS: Record<Lang, {
  decisionEyebrow: string; decisionTitle: string; decisionLead: string;
  routesEyebrow: string; routesTitle: string; routesLead: string;
}> = {
  ko: {
    decisionEyebrow: "START — 무엇부터 시작할까요",
    decisionTitle: "먼저, 하나만 골라주세요",
    decisionLead: "당신이 찾는 '그곳'이 다음 코스가 될 수 있어요. 아니면 이미 검증된 수원부터 먼저 만나보세요.",
    routesEyebrow: "ROUTES — 지역별 오픈 현황",
    routesTitle: "수원 다음은, 어디일까요?",
    routesLead: "정답은 당신이 정해요. 지금 열려 있는 곳부터, 곧 열릴 곳들까지 보여드릴게요.",
  },
  en: {
    decisionEyebrow: "START — Where to begin",
    decisionTitle: "Pick one to get started",
    decisionLead: "That place you're dying to see could be our next course. Or meet Suwon first — it's already verified and ready.",
    routesEyebrow: "ROUTES — Region rollout status",
    routesTitle: "What comes after Suwon?",
    routesLead: "You decide the answer. Here's what's open now, and what's opening next.",
  },
  ja: {
    decisionEyebrow: "START — まず何から始めますか",
    decisionTitle: "まず一つだけ選んでください",
    decisionLead: "あなたの「あの場所」が、次のコースになるかもしれません。まずは、もう検証済みの水原から。",
    routesEyebrow: "ROUTES — 地域別公開状況",
    routesTitle: "水原の次は、どこでしょう?",
    routesLead: "答えを決めるのは、あなたです。今開いている場所と、次に開く場所です。",
  },
  zh: {
    decisionEyebrow: "START — 先从哪里开始",
    decisionTitle: "先选一个开始吧",
    decisionLead: "你心心念念的\"那个地方\"，可能就是下一条路线。不如先从已验证的水原开始。",
    routesEyebrow: "ROUTES — 各地区开放状态",
    routesTitle: "水原之后，会是哪里？",
    routesLead: "答案由你决定。这里是现在开放的路线，和即将开放的路线。",
  },
  vi: {
    decisionEyebrow: "START — Bắt đầu từ đâu",
    decisionTitle: "Hãy chọn một cái để bắt đầu",
    decisionLead: "Nơi bạn hằng mong ước có thể là lộ trình tiếp theo. Hoặc gặp Suwon trước — đã được kiểm chứng và sẵn sàng.",
    routesEyebrow: "ROUTES — Tình trạng mở theo khu vực",
    routesTitle: "Sau Suwon, sẽ là nơi nào?",
    routesLead: "Câu trả lời do bạn quyết định. Đây là những nơi đang mở, và những nơi sắp mở.",
  },
};

export default function TourList() {
  // 재방문자는 저장된 언어가 있으면 언어 게이트를 건너뛰고 바로 행동 선택 화면(기존 콘텐츠+CTA)부터 봄
  const [lang, setLang] = useState<Lang>(() => getStoredLang() ?? "ko");
  const [langChosen, setLangChosen] = useState<boolean>(() => getStoredLang() !== null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const t = COPY[lang];
  const cards = TOURS[lang];

  function chooseLang(l: Lang) {
    setStoredLang(l);
    setLang(l);
    setLangChosen(true);
  }

  function changeLang(l: Lang) {
    setStoredLang(l);
    setLang(l);
  }

  if (!langChosen) {
    return (
      <div className="router-page">
        <div className="router-langgate">
          <Link to="/"><BrandLogo /></Link>
          <span className="caption">언어 선택 · Language · 言語 · 语言 · Ngôn ngữ</span>
          <div className="router-langgate-grid">
            {LANG_GATE_OPTIONS.map(({ code, flag, label }) => (
              <button key={code} type="button" onClick={() => chooseLang(code)}>
                <span>{flag}</span> <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="router-page">
      <div className="router-wrap tight">
        <div className="router-narrow">
          <div className="router-topbar">
            <Link to="/"><BrandLogo /></Link>
            <div className="router-lang">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className={lang === l.code ? "on" : ""}
                  onClick={() => changeLang(l.code)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HERO — 풀블리드 이미지 (2026-07-23, 데스크톱 첫인상 보강: 랜딩페이지 히어로컷 재사용) */}
      <div className="router-hero-media">
        <img src={tourHeroImg} alt={t.heroAlt} />
        <div className="router-hero-media-overlay" />
        <div className="router-hero-media-text">
          <div className="router-narrow">
            <span className="router-eyebrow">{t.eyebrow}</span>
            <h1>{t.heroTitleLine1}<br />{t.heroTitleLine2}</h1>
            <p>{t.heroPre}<span className="kk">{t.heroKk}</span>{t.heroPost}</p>
          </div>
        </div>
      </div>

      <div className="router-wrap">
        <div className="router-narrow">
          {/* 결정 섹션 — 히어로와 분리된 카드로 묶어서 스크롤하며 지나치지 않게 함 (2026-07-23 섹션 분리) */}
          <div className="router-sec">
            <p className="router-sec-eyebrow">{SECTIONS[lang].decisionEyebrow}</p>
            <h2 className="router-sec-title">{SECTIONS[lang].decisionTitle}</h2>
            <p className="router-sec-lead">{SECTIONS[lang].decisionLead}</p>
          </div>
          <div className="router-decision">
            <div className="router-action-panel">
              <a
                className="router-action-main"
                href={FORM_URLS[lang]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="router-action-icon" aria-hidden>📍</span>
                <span className="router-action-body">
                  <span className="router-action-title">{ACTION_CTA[lang].mainTitle}</span>
                  <span className="router-action-sub">{ACTION_CTA[lang].mainSub}</span>
                </span>
              </a>
              <Link className="router-action-secondary" to={`/tour/suwon?lang=${lang}`}>
                <span className="router-action-icon" aria-hidden>🗺️</span>
                <span className="router-action-body">
                  <span className="router-action-title">{ACTION_CTA[lang].secondaryTitle}</span>
                  <span className="router-action-sub">{ACTION_CTA[lang].secondarySub}</span>
                </span>
              </Link>
            </div>
          </div>

          {/* 코스 현황 섹션 — NOW OPEN + COMING SOON을 하나의 섹션으로 묶음 (2026-07-23 섹션 분리) */}
          <div className="router-sec">
            <p className="router-sec-eyebrow">{SECTIONS[lang].routesEyebrow}</p>
            <h2 className="router-sec-title">{SECTIONS[lang].routesTitle}</h2>
            <p className="router-sec-lead">{SECTIONS[lang].routesLead}</p>
          </div>

          <div className="router-divider">{t.nowOpen}</div>

          {cards.filter((c) => c.status === "open").map((c) => (
            <div className="router-card open" key={c.id}>
              <div
                className="thumb"
                style={c.thumb ? { backgroundImage: `url(${c.thumb})` } : undefined}
              >
                <span className="router-badge">{t.nowOpen}</span>
              </div>
              <div className="body">
                <div className="router-cityline">{c.order} · {c.cityline}</div>
                {c.kTag && <div className="router-ktag">{c.kTag}</div>}
                <h2>{c.title}</h2>
                <div className="desc">{c.desc}</div>
                <Link className="router-cta" to={c.link ?? "#"}>{t.openCta}</Link>
              </div>
            </div>
          ))}
        </div>

        <div className="router-divider router-divider-wide">{t.comingSoon}</div>

        {/* 준비 중인 지역 — 그리드로 "이만큼 준비돼 있다"를 한눈에 보여줌 (개별 순서 서사는 NOW OPEN 카드에서만 지킴) */}
        <div className="router-locked-grid">
          {cards.filter((c) => c.status !== "open").map((c) => (
            <div className={`router-card locked ${c.status}`} key={c.id}>
              <div className="thumb">
                <span className="coming-label">{t.comingSoon}</span>
                <span className={`router-badge ${c.status === "next" ? "next" : "wait"}`}>
                  {c.status === "next" ? t.nextBadge : `${c.order} · ${t.waitBadge}`}
                </span>
              </div>
              <div className="router-lockcol">
                <div className="router-cityline">{c.order} · {c.cityline}</div>
                {c.kTag && <div className="router-ktag">{c.kTag}</div>}
                <h2>{c.title}</h2>
                <button
                  type="button"
                  className="router-notify"
                  onClick={() => setFormModalOpen(true)}
                >
                  🔔 {t.notify}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="router-narrow">
          <div className="router-foot">KSPOT · 진짜 한국으로 안내합니다</div>
        </div>
      </div>

      <LangFormModal open={formModalOpen} onClose={() => setFormModalOpen(false)} pageLang={lang} />
    </div>
  );
}
