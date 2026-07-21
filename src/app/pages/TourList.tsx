import { useState } from "react";
import { Link } from "react-router";
import "@/styles/router.css";
import { SURVEY_FORM_URL } from "@/app/surveyConfig";
import janganmunNightImg from "@/assets/carousel/janganmun_night.jpg";

type Lang = "ko" | "en" | "ja" | "zh";

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

// 잠금 카드 공통 정보 (도시명 표기만 언어별로 다름, 순서/태그/상태는 공통)
// 춘천·강릉: 7/21 팀장 언급대로 7월 내 오픈 목표라 "곧 오픈" + 드라마 태그 확정(춘천=겨울연가, 강릉=도깨비).
// 나머지 5곳(경주·부산·대구·여수·순천)은 드라마 페어링 미확정 — CLAUDE.md 원칙상 AI가 임의로 못 붙여서 태그 생략 유지.
const LOCKED_META: { id: string; order: string; status: "next" | "wait"; kTag?: string }[] = [
  { id: "chuncheon", order: "02", status: "next", kTag: "◉ 겨울연가" },
  { id: "gangneung", order: "03", status: "next", kTag: "◉ 도깨비" },
  { id: "jeonju", order: "04", status: "wait", kTag: "◉ 구르미 그린 달빛" },
  { id: "pohang", order: "05", status: "wait", kTag: "◉ 갯마을 차차차" },
  { id: "jeju", order: "06", status: "wait", kTag: "◉ 웰컴투 삼달리" },
  { id: "gyeongju", order: "07", status: "wait" },
  { id: "busan", order: "08", status: "wait" },
  { id: "daegu", order: "09", status: "wait" },
  { id: "yeosu", order: "10", status: "wait" },
  { id: "suncheon", order: "11", status: "wait" },
];

const LOCKED_CITYLINE: Record<string, Record<Lang, string>> = {
  chuncheon: { ko: "CHUNCHEON 춘천", en: "CHUNCHEON", ja: "CHUNCHEON 春川", zh: "CHUNCHEON 春川" },
  gangneung: { ko: "GANGNEUNG 강릉", en: "GANGNEUNG", ja: "GANGNEUNG 江陵", zh: "GANGNEUNG 江陵" },
  jeonju: { ko: "JEONJU 전주", en: "JEONJU", ja: "JEONJU 全州", zh: "JEONJU 全州" },
  pohang: { ko: "POHANG 포항", en: "POHANG", ja: "POHANG 浦項", zh: "POHANG 浦项" },
  jeju: { ko: "JEJU 제주", en: "JEJU", ja: "JEJU 済州", zh: "JEJU 济州" },
  gyeongju: { ko: "GYEONGJU 경주", en: "GYEONGJU", ja: "GYEONGJU 慶州", zh: "GYEONGJU 庆州" },
  busan: { ko: "BUSAN 부산", en: "BUSAN", ja: "BUSAN 釜山", zh: "BUSAN 釜山" },
  daegu: { ko: "DAEGU 대구", en: "DAEGU", ja: "DAEGU 大邱", zh: "DAEGU 大邱" },
  yeosu: { ko: "YEOSU 여수", en: "YEOSU", ja: "YEOSU 麗水", zh: "YEOSU 丽水" },
  suncheon: { ko: "SUNCHEON 순천", en: "SUNCHEON", ja: "SUNCHEON 順天", zh: "SUNCHEON 顺天" },
};

const LOCKED_TITLE: Record<string, Record<Lang, string>> = {
  chuncheon: { ko: "호수 따라 달리는 자전거길", en: "Lakeside cycling route", ja: "湖畔のサイクリングロード", zh: "沿湖骑行路线" },
  gangneung: { ko: "파도 소리 들리는 커피 해변", en: "Coffee beach by the waves", ja: "波音が聞こえるコーヒー海辺", zh: "听着海浪的咖啡海边" },
  jeonju: { ko: "다음 이야기, 준비 중이에요", en: "Next story, coming soon", ja: "次の物語、準備中です", zh: "下一个故事，准备中" },
  pohang: { ko: "다음 이야기, 준비 중이에요", en: "Next story, coming soon", ja: "次の物語、準備中です", zh: "下一个故事，准备中" },
  jeju: { ko: "다음 이야기, 준비 중이에요", en: "Next story, coming soon", ja: "次の物語、準備中です", zh: "下一个故事，准备中" },
  gyeongju: { ko: "다음 이야기, 준비 중이에요", en: "Next story, coming soon", ja: "次の物語、準備中です", zh: "下一个故事，准备中" },
  busan: { ko: "다음 이야기, 준비 중이에요", en: "Next story, coming soon", ja: "次の物語、準備中です", zh: "下一个故事，准备中" },
  daegu: { ko: "다음 이야기, 준비 중이에요", en: "Next story, coming soon", ja: "次の物語、準備中です", zh: "下一个故事，准备中" },
  yeosu: { ko: "다음 이야기, 준비 중이에요", en: "Next story, coming soon", ja: "次の物語、準備中です", zh: "下一个故事，准备中" },
  suncheon: { ko: "다음 이야기, 준비 중이에요", en: "Next story, coming soon", ja: "次の物語、準備中です", zh: "下一个故事，准备中" },
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
};

const COPY: Record<Lang, {
  eyebrow: string; heroTitle: string; heroPre: string; heroKk: string; heroPost: string;
  nowOpen: string; comingSoon: string; openCta: string; nextBadge: string; waitBadge: string; notify: string;
  askH3: string; askP: string; askBtn: string; askFine: string; stickyBtn: string;
}> = {
  ko: {
    eyebrow: "🔓 KSPOT 시크릿 언락",
    heroTitle: "한국에 이런 곳이 있다고? — 가도 괜찮은 곳인지, 저희가 먼저 확인했어요.",
    heroPre: "화면 속에서 보던 ",
    heroKk: "그 장소",
    heroPost: "부터 아무도 모르는 로컬 스팟까지, 무사히 다녀올 수 있는 코스만 열어드려요.",
    nowOpen: "NOW OPEN",
    comingSoon: "COMING SOON",
    openCta: "이 코스 열어보기 →",
    nextBadge: "곧 오픈", waitBadge: "대기 중",
    notify: "알림받기",
    askH3: "가고 싶은 곳이 여기 없나요?",
    askP: "어디가 궁금한지 알려주시면, 그곳을 다음 이야기로 만들어 공개해요.",
    askBtn: "가고 싶은 곳 알려주기 →",
    askFine: "30초면 끝나요 · 많이 찾는 곳부터 공개",
    stickyBtn: "요청하기 →",
  },
  en: {
    eyebrow: "🔓 KSPOT SECRET UNLOCK",
    heroTitle: "Korea has a place like THIS? — We checked if it's safe to visit, first.",
    heroPre: "From ",
    heroKk: "the places you saw on screen",
    heroPost: " to spots no one talks about, we only unlock courses you can safely make it back from.",
    nowOpen: "NOW OPEN",
    comingSoon: "COMING SOON",
    openCta: "Open this course →",
    nextBadge: "Opening soon", waitBadge: "In queue",
    notify: "Notify me",
    askH3: "Don't see where you want to go?",
    askP: "Tell us where you're curious about, and we'll make it the next story.",
    askBtn: "Tell us where →",
    askFine: "Takes 30 seconds · Most-requested opens first",
    stickyBtn: "Request →",
  },
  ja: {
    eyebrow: "🔓 KSPOT シークレット解禁",
    heroTitle: "韓国にこんな場所が? — 行っても大丈夫か、先に確認しました。",
    heroPre: "画面で見た",
    heroKk: "あの場所",
    heroPost: "から誰も知らないローカルスポットまで、無事に楽しめるコースだけを解禁します。",
    nowOpen: "NOW OPEN",
    comingSoon: "COMING SOON",
    openCta: "このコースを開く →",
    nextBadge: "まもなく公開", waitBadge: "準備中",
    notify: "通知を受け取る",
    askH3: "行きたい場所がここにない？",
    askP: "気になる場所を教えてください。次の物語としてお作りします。",
    askBtn: "行きたい場所を教える →",
    askFine: "30秒で完了 · リクエストの多い街から公開",
    stickyBtn: "リクエストする →",
  },
  zh: {
    eyebrow: "🔓 KSPOT 秘密解锁",
    heroTitle: "韩国竟然有这种地方? — 能不能去，我们先帮你确认了。",
    heroPre: "从",
    heroKk: "你在屏幕上看过的那个地方",
    heroPost: "到没人知道的本地秘境，只解锁能安全往返的路线。",
    nowOpen: "NOW OPEN",
    comingSoon: "COMING SOON",
    openCta: "打开这条路线 →",
    nextBadge: "即将开放", waitBadge: "排队中",
    notify: "通知我",
    askH3: "想去的地方不在这里？",
    askP: "告诉我们你想去哪里，我们会把它做成下一个故事。",
    askBtn: "告诉我们你想去哪 →",
    askFine: "30秒完成 · 从最多人想去的城市开始公开",
    stickyBtn: "提交请求 →",
  },
};

const LANGS: { code: Lang; label: string }[] = [
  { code: "ko", label: "한" },
  { code: "en", label: "EN" },
  { code: "ja", label: "日" },
  { code: "zh", label: "中" },
];

export default function TourList() {
  const [lang, setLang] = useState<Lang>("ko");
  const t = COPY[lang];
  const cards = TOURS[lang];

  return (
    <div className="router-page">
      <div className="router-wrap">
        <div className="router-narrow">
          <div className="router-topbar">
            <Link to="/" className="router-brand">K<span>SPOT</span></Link>
            <div className="router-lang">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className={lang === l.code ? "on" : ""}
                  onClick={() => setLang(l.code)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="router-hero">
            <span className="router-eyebrow">{t.eyebrow}</span>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroPre}<span className="kk">{t.heroKk}</span>{t.heroPost}</p>
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
            <div className="router-card locked" key={c.id}>
              <div className="thumb">
                <span className="ph">🔒</span>
                <span className={`router-badge ${c.status === "next" ? "next" : "wait"}`}>
                  {c.status === "next" ? t.nextBadge : `${c.order} · ${t.waitBadge}`}
                </span>
              </div>
              <div className="router-lockcol">
                <div className="router-cityline">{c.order} · {c.cityline}</div>
                {c.kTag && <div className="router-ktag">{c.kTag}</div>}
                <h2>{c.title}</h2>
                <a
                  className="router-notify"
                  href={SURVEY_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🔔 {t.notify}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="router-narrow">
          <div className="router-foot">KSPOT · 진짜 한국으로 안내합니다</div>
        </div>
      </div>

      {/* 하단 고정 CTA — 스크롤 내내 노출 */}
      <div className="router-sticky-cta">
        <div className="router-sticky-cta-inner">
          <span className="msg"><b>{t.askH3}</b></span>
          <a href={SURVEY_FORM_URL} target="_blank" rel="noopener noreferrer">
            {t.stickyBtn}
          </a>
        </div>
      </div>
    </div>
  );
}
