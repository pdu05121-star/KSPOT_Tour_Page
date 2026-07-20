import { useState } from "react";
import { Link } from "react-router";
import "@/styles/router.css";
import { SURVEY_FORM_URL } from "@/app/surveyConfig";
import janganmunNightImg from "@/assets/carousel/janganmun_night.jpg";

type Lang = "ko" | "en" | "ja" | "zh";

// 도시 카드 데이터 — 배열로 관리 (개발지시서 지시사항: 하드코딩 금지, 도시 추가 잦을 예정)
type TourCard = {
  id: string;
  status: "open" | "next" | "wait";
  order: string; // "01", "02" ...
  cityline: string; // "SUWON 수원"
  kTag?: string; // K콘텐츠 태그, 없으면 생략
  title: string;
  desc: string;
  thumb?: string; // open 카드만 사용
  link?: string; // open 카드만 사용
};

const TOURS: Record<Lang, TourCard[]> = {
  ko: [
    {
      id: "suwon",
      status: "open",
      order: "01",
      cityline: "SUWON 수원",
      kTag: "◉ 선재 업고 튀어",
      title: "타임슬립 골목과 성곽 노을",
      desc: "드라마 속 그 골목길, 로컬 통닭 성지, 노을 지는 루프탑까지 — 서울에서 다녀오는 하루",
      thumb: janganmunNightImg,
      link: "/tour/suwon",
    },
    { id: "chuncheon", status: "next", order: "02", cityline: "CHUNCHEON 춘천", title: "호수 따라 달리는 자전거길", desc: "" },
    { id: "gangneung", status: "wait", order: "03", cityline: "GANGNEUNG 강릉", title: "파도 소리 들리는 커피 해변", desc: "" },
  ],
  en: [
    {
      id: "suwon",
      status: "open",
      order: "01",
      cityline: "SUWON",
      kTag: "◉ Lovely Runner",
      title: "Time-slip alleys & fortress sunset",
      desc: "The alley from the show, a local fried-chicken spot, a rooftop at golden hour — a day trip from Seoul.",
      thumb: janganmunNightImg,
      link: "/tour/suwon",
    },
    { id: "chuncheon", status: "next", order: "02", cityline: "CHUNCHEON", title: "Lakeside cycling route", desc: "" },
    { id: "gangneung", status: "wait", order: "03", cityline: "GANGNEUNG", title: "Coffee beach by the waves", desc: "" },
  ],
  ja: [
    {
      id: "suwon",
      status: "open",
      order: "01",
      cityline: "SUWON 水原",
      kTag: "◉ ソンジェ背負って走れ",
      title: "タイムスリップの路地と城郭の夕焼け",
      desc: "ドラマのあの路地、ローカルなチキンの名店、夕日のルーフトップまで — ソウルから行く日帰り。",
      thumb: janganmunNightImg,
      link: "/tour/suwon",
    },
    { id: "chuncheon", status: "next", order: "02", cityline: "CHUNCHEON 春川", title: "湖畔のサイクリングロード", desc: "" },
    { id: "gangneung", status: "wait", order: "03", cityline: "GANGNEUNG 江陵", title: "波音が聞こえるコーヒー海辺", desc: "" },
  ],
  zh: [
    {
      id: "suwon",
      status: "open",
      order: "01",
      cityline: "SUWON 水原",
      kTag: "◉ 背着善宰跑",
      title: "穿越时空的小巷与城郭晚霞",
      desc: "剧中那条小巷、本地炸鸡名店、夕阳下的天台 — 从首尔出发的一日游。",
      thumb: janganmunNightImg,
      link: "/tour/suwon",
    },
    { id: "chuncheon", status: "next", order: "02", cityline: "CHUNCHEON 春川", title: "沿湖骑行路线", desc: "" },
    { id: "gangneung", status: "wait", order: "03", cityline: "GANGNEUNG 江陵", title: "听着海浪的咖啡海边", desc: "" },
  ],
};

const COPY: Record<Lang, {
  eyebrow: string; heroTitle: string; heroPre: string; heroKk: string; heroPost: string;
  nowOpen: string; comingSoon: string; openCta: string; nextBadge: string; waitBadge: string; notify: string;
  askH3: string; askP: string; askBtn: string; askFine: string;
}> = {
  ko: {
    eyebrow: "KSPOT 로컬 로드맵",
    heroTitle: "현지인만 아는 진짜 한국,",
    heroPre: "화면 속에서 보던 ",
    heroKk: "그 장소",
    heroPost: "부터, 낯선 도시도 실패 없이 즐기는 하루. 매번 하나씩 꺼내 공개합니다.",
    nowOpen: "NOW OPEN",
    comingSoon: "COMING SOON",
    openCta: "이 코스 열어보기 →",
    nextBadge: "NEXT · 곧 열려요",
    waitBadge: "대기 중",
    notify: "알림받기",
    askH3: "가고 싶은 곳이 여기 없나요?",
    askP: "어디가 궁금한지 알려주시면, 그곳을 다음 이야기로 만들어 공개해요.",
    askBtn: "가고 싶은 곳 알려주기 →",
    askFine: "30초면 끝나요 · 많이 찾는 곳부터 공개",
  },
  en: {
    eyebrow: "KSPOT LOCAL ROADMAP",
    heroTitle: "The real Korea only locals know",
    heroPre: "From ",
    heroKk: "the places you saw on screen",
    heroPost: " to unfamiliar towns, a day out without the misses. We open a new one each time.",
    nowOpen: "NOW OPEN",
    comingSoon: "COMING SOON",
    openCta: "Open this course →",
    nextBadge: "NEXT · Coming soon",
    waitBadge: "In queue",
    notify: "Notify me",
    askH3: "Don't see where you want to go?",
    askP: "Tell us where you're curious about, and we'll make it the next story.",
    askBtn: "Tell us where →",
    askFine: "Takes 30 seconds · Most-requested opens first",
  },
  ja: {
    eyebrow: "KSPOT ローカルロードマップ",
    heroTitle: "地元の人だけが知る本当の韓国、",
    heroPre: "画面で見た",
    heroKk: "あの場所",
    heroPost: "から、初めての街も失敗なく楽しむ一日。毎回ひとつずつ公開します。",
    nowOpen: "NOW OPEN",
    comingSoon: "COMING SOON",
    openCta: "このコースを開く →",
    nextBadge: "NEXT · まもなく公開",
    waitBadge: "準備中",
    notify: "通知を受け取る",
    askH3: "行きたい場所がここにない？",
    askP: "気になる場所を教えてください。次の物語としてお作りします。",
    askBtn: "行きたい場所を教える →",
    askFine: "30秒で完了 · リクエストの多い街から公開",
  },
  zh: {
    eyebrow: "KSPOT 本地路线图",
    heroTitle: "只有当地人知道的真韩国，",
    heroPre: "从",
    heroKk: "你在屏幕上看过的那个地方",
    heroPost: "，到陌生的城市，都能安心尽兴地玩上一天。每次公开一个。",
    nowOpen: "NOW OPEN",
    comingSoon: "COMING SOON",
    openCta: "打开这条路线 →",
    nextBadge: "NEXT · 即将开启",
    waitBadge: "排队中",
    notify: "通知我",
    askH3: "想去的地方不在这里？",
    askP: "告诉我们你想去哪里，我们会把它做成下一个故事。",
    askBtn: "告诉我们你想去哪 →",
    askFine: "30秒完成 · 从最多人想去的城市开始公开",
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

        <div className="router-divider">{t.comingSoon}</div>

        {cards.filter((c) => c.status !== "open").map((c) => (
          <div className="router-card locked" key={c.id}>
            <div className="thumb">
              <span className="ph">🔒</span>
              <span className={`router-badge ${c.status === "next" ? "next" : "wait"}`}>
                {c.status === "next" ? t.nextBadge : `${c.order} · ${t.waitBadge}`}
              </span>
            </div>
            <div className="router-lockrow">
              <div className="meta">
                <div className="router-cityline">{c.order} · {c.cityline}</div>
                <h2>{c.title}</h2>
              </div>
              <a
                className="router-notify"
                href={SURVEY_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                🔔<br />{t.notify}
              </a>
            </div>
          </div>
        ))}

        <div className="router-askbox">
          <h3>{t.askH3}</h3>
          <p>{t.askP}</p>
          <a className="router-askbtn" href={SURVEY_FORM_URL} target="_blank" rel="noopener noreferrer">
            {t.askBtn}
          </a>
          <div className="fine">{t.askFine}</div>
        </div>

        <div className="router-foot">KSPOT · 진짜 한국으로 안내합니다</div>
      </div>
    </div>
  );
}
