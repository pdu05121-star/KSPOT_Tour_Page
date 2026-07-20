import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import "@/styles/landing.css";
import logoEmblem from "@/assets/logo.png";
import logoWordmark from "@/assets/landing_img_1.png";
import kspotBrandingVideo from "@/assets/kspot-branding.mp4";
import { SURVEY_FORM_URL } from "@/app/surveyConfig";

export default function Landing() {
  // Scrolled Navbar State
  const [scrolled, setScrolled] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Typing Effect States
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  // SVG Timeline Line Ref
  const tlLineRef = useRef<SVGLineElement | null>(null);

  // Typing effect logic
  useEffect(() => {
    const fullText = "도착하면 괜찮은데,\n거기까지 가는 과정이 불안해요.";
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const typeChar = () => {
      if (currentIndex < fullText.length) {
        const char = fullText[currentIndex];
        setTypedText(prev => prev + char);
        currentIndex++;

        let delay = 62;
        if (char === ",") delay = 380;
        else if (char === ".") delay = 500;
        else if (char === "\n") delay = 320;

        timeoutId = setTimeout(typeChar, delay);
      } else {
        setTypingDone(true);
      }
    };

    const startTimeout = setTimeout(typeChar, 400);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeoutId);
    };
  }, []);

  // Timeline path draw animation trigger
  useEffect(() => {
    if (tlLineRef.current) {
      const timer = setTimeout(() => {
        if (tlLineRef.current) {
          tlLineRef.current.style.transition = "stroke-dashoffset 2.4s ease";
          tlLineRef.current.style.strokeDashoffset = "0";
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Navbar scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fade up animation IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
          }
        });
      },
      { threshold: 0.15 }
    );

    const fadeElements = document.querySelectorAll(".fade-up");
    fadeElements.forEach((el) => observer.observe(el));

    return () => {
      fadeElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`topnav ${scrolled ? "scrolled" : ""}`} id="topnav">
        <Link to="/" className="logo">
          <img src={logoEmblem} alt="KSPOT Logo Emblem" className="logo-emblem" />
          <img src={logoWordmark} alt="KSPOT" className="logo-wordmark" />
        </Link>
        <Link to="/tour/suwon" className="cta-small">
          서비스 시작하기
        </Link>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-photo"></div>
        <svg className="hero-ui-pattern" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(1320,140)">
            <line
              ref={tlLineRef}
              id="tlLine"
              x1="20"
              y1="0"
              x2="20"
              y2="560"
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeDasharray="560"
              strokeDashoffset="560"
            />
            <circle className="tl-dot" cx="20" cy="0" r="13" fill="none" stroke="#1D9E75" strokeWidth="2" style={{ animationDelay: ".2s" }} />
            <circle className="tl-dot" cx="20" cy="160" r="9" fill="none" stroke="#1D9E75" strokeWidth="2" style={{ animationDelay: ".9s" }} />
            <circle className="tl-dot" cx="20" cy="320" r="9" fill="none" stroke="#F59E0B" strokeWidth="2" style={{ animationDelay: "1.5s" }} />
            <circle className="tl-dot" cx="20" cy="480" r="9" fill="none" stroke="#1D9E75" strokeWidth="2" style={{ animationDelay: "2.1s" }} />
            <circle className="tl-dot" cx="20" cy="560" r="13" fill="none" stroke="#D85A30" strokeWidth="2" style={{ animationDelay: "2.6s" }} />
            <circle className="tl-beacon" cx="20" cy="560" r="13" />
          </g>
        </svg>

        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-eyebrow">KSPOT — 지방 소도시 여행, 판단부터 실행까지</div>
            <p className="quote-line" id="typeTarget">
              <span className="quote-mark">“</span>
              <span id="typeText">
                {typedText.split("\n").map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < typedText.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </span>
              <span className={`caret ${typingDone ? "done" : ""}`}>|</span>
              <span className={`quote-mark hide-until-done ${typingDone ? "show" : ""}`}>”</span>
            </p>
            <div className="hero-foot seq" style={{ "--d": "0.2s" } as React.CSSProperties}>
              <a href={SURVEY_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                원하는 코스 받아보기 →
              </a>
              <a href="#tour" className="btn-ghost">수원 코스 먼저 보기</a>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM / DATA */}
      <section className="problem" id="problem">
        <div className="wrap fade-up">
          <div className="sec-eyebrow">Problem — 실행 격차</div>
          <h2 className="sec-title">'갈 곳을 모르는 것'이 아닙니다.<br />'무사히 돌아올 수 있을까'라는 두려움입니다.</h2>
          <p className="sec-lead">가고 싶은 마음은 있습니다. 정보도 어느 정도 있습니다. 하지만 낯선 교통, 언어의 벽, 혼자 길을 잃었을 때의 막막함 — 그 현장의 공포가 발걸음을 멈추게 합니다.</p>

          <div className="problem-cards">
            <div className="problem-card fade-up">
              <div className="pc-icon">🔍</div>
              <div className="pc-title">정보는 있지만 확신이 없어요</div>
              <div className="pc-quote">"트위터, 인스타, 네이버 다 뒤지다가 1시간 넘게 하다 지쳐서 포기해요."<br />— 미사, 일본인 인터뷰 참여자</div>
            </div>
            <div className="problem-card fade-up">
              <div className="pc-icon">🚕</div>
              <div className="pc-title">이동 자체가 두려워요</div>
              <div className="pc-quote">"택시는 사기 있다고 들어서 아예 안 타요."<br />— 야마가, 일본인 인터뷰 참여자</div>
            </div>
            <div className="problem-card fade-up">
              <div className="pc-icon">💬</div>
              <div className="pc-title">말이 안 통할까 봐 미리 포기해요</div>
              <div className="pc-quote">"사람한테 직접 안 물어봐도 되는 거요."<br />— 미사, 일본인 인터뷰 참여자</div>
            </div>
          </div>
        </div>
      </section>

      {/* MOOD BREAK 1 */}
      <section className="mood-break mb-1">
        <div className="mb-inner fade-up">
          <div className="mb-eyebrow">Moment</div>
          <p className="mb-quote">정보는 다 찾아봤는데,<br />정류장 앞에 서니 또 막막해졌어요.</p>
          <div className="mb-cta">
            <Link to="/tour/suwon" className="btn-primary-dark">
              지금 코스 확인해보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="solution" id="solution">
        <div className="wrap-wide fade-up">
          <div className="sec-eyebrow">Solution — 판단부터 실행까지</div>
          <h2 className="sec-title">KSPOT은 추천보다 먼저,<br />갈 수 있는지를 판단합니다.</h2>
          <p className="sec-lead">판단 → 코스 조정 → 현장 대응까지, 하나의 흐름으로 이어집니다.</p>

          {/* 01 판단 엔진 */}
          <div className="feature-row fade-up">
            <div className="feature-text">
              <div className="sf-num">01 · 판단 엔진</div>
              <div className="sf-title">지금 가도 되는지, 먼저 판단합니다</div>
              <p className="sf-desc">배차 간격, 환승 횟수, 막차 시간, 날씨까지 종합해 4단계로 알려드려요. AUTO 코스는 이미 검증된 조합이고, CUSTOM으로 직접 구성한 일정은 이 판단을 거쳐요.</p>
              <div className="verdict-chip-row">
                <span className="verdict-chip go">GO</span>
                <span className="verdict-chip care">GO WITH CARE</span>
                <span className="verdict-chip recon">RECONSIDER</span>
                <span className="verdict-chip not">NOT NOW</span>
              </div>
              <div className="sf-caption">TourAPI · ODsay · 카카오모빌리티 데이터 기반 — 배차·도착 시간은 현지 사정에 따라 실제와 다를 수 있어요.</div>
            </div>
            <div className="phone-mock">
              <div className="pm-hdr"><div class="pm-logo">KSPOT</div><div className="pm-lang">🌐 日本語 ▾</div></div>
              <div className="pm-sub"><div className="pm-back">‹</div><div className="pm-title">AI 판단 결과</div></div>
              <div className="pm-body">
                <div className="pm-verdict care">
                  <div style={{ flex: 1 }}>
                    <div className="pm-vtag">GO WITH CARE</div>
                    <div className="pm-vdesc">⚠️ 버스 배차 간격 40분 주의</div>
                  </div>
                  <div className="pm-weather">
                    <div className="em">⛅</div>
                    <div className="tmp">26° / 18°</div>
                    <div className="wline"></div>
                    <div className="ok">기상특보 없음</div>
                  </div>
                </div>
                <div className="pm-timeline">
                  <div className="pm-trow">
                    <div className="pm-node">1</div>
                    <div className="pm-spotcard">
                      <div className="nm">서울역 → 불국사</div>
                      <div className="tm">예상 소요 2시간 37분 · 이동 난이도 보통</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 02 코스 편집 */}
          <div className="feature-row reverse fade-up">
            <div className="feature-text">
              <div className="sf-num">02 · 코스 편집</div>
              <div className="sf-title">원하는 곳만 골라도, 코스가 다시 정리됩니다</div>
              <p className="sf-desc">AUTO는 이미 검증된 코스 그대로 따라가고, CUSTOM은 가고 싶은 곳을 직접 넣거나 빼면 이동 시간과 순서가 자동으로 다시 계산돼요.</p>
            </div>
            <div className="phone-mock">
              <div className="pm-hdr"><div className="pm-logo">KSPOT</div><div className="pm-lang">🌐 日本語 ▾</div></div>
              <div className="pm-sub"><div className="pm-back">‹</div><div className="pm-title">코스 편집</div></div>
              <div className="pm-edit-body">
                <div className="pm-edit-row">
                  <div className="pm-edit-drag"><span></span><span></span><span></span></div>
                  <div className="pm-edit-info">
                    <div className="pm-edit-name">불국사</div>
                    <div className="pm-edit-cat">관광명소 · 경주</div>
                  </div>
                </div>
                <div className="pm-edit-row">
                  <div className="pm-edit-drag"><span></span><span></span><span></span></div>
                  <div className="pm-edit-info">
                    <div className="pm-edit-name">황리단길</div>
                    <div className="pm-edit-cat">거리·쇼핑 · 경주</div>
                  </div>
                  <div className="pm-edit-retry">↺ 재추천</div>
                  <div className="pm-edit-del">✕</div>
                </div>
                <div className="pm-edit-row">
                  <div className="pm-edit-drag"><span></span><span></span><span></span></div>
                  <div className="pm-edit-info">
                    <div className="pm-edit-name">첨성대</div>
                    <div className="pm-edit-cat">관광명소 · 경주</div>
                  </div>
                  <div className="pm-edit-retry">↺ 재추천</div>
                  <div className="pm-edit-del">✕</div>
                </div>
              </div>
            </div>
          </div>

          {/* 03 안심 카드 */}
          <div className="feature-row fade-up">
            <div className="feature-text">
              <div className="sf-num">03 · 안심 카드</div>
              <div className="sf-title">말이 안 통하는 순간, 보여주면 됩니다</div>
              <p className="sf-desc">"버스를 잘못 탔는데 어디인지도 모르겠고, 택시는 무서워서 탈 엄두도 못 냈어요." 안심 카드는 그 순간을 위해 만들어졌습니다.</p>
              <ul className="safety-list">
                <li>목적지와 예상 요금을 큰 글씨로 — 보여주는 순간 대화가 끝납니다</li>
                <li>예상 요금을 미리 확인할 수 있어 바가지 우려를 사전 차단</li>
                <li>관광통역안내센터(1330) · 경찰(112) — 즉시 연결 안전망</li>
              </ul>
            </div>
            <div className="phone-mock">
              <div className="pm-hdr"><div className="pm-logo">KSPOT</div><div className="pm-lang">🌐 日本語 ▾</div></div>
              <div className="pm-safety-sheet">
                <div style={{ padding: "16px 14px 18px" }}>
                  <div className="pm-safety-label">안심 카드</div>
                  <div className="pm-safety-route">경주역 → 불국사</div>
                  <div className="pm-dest-card">
                    <div className="pm-dest-eyebrow">기사님께 보여주세요</div>
                    <div className="pm-dest-name">불국사</div>
                    <div className="pm-dest-sub">여기로 가고 싶어요</div>
                    <div className="pm-dest-addr">
                      <span>경북 경주시 불국로 385</span>
                      <div className="pm-nav-pill"><span className="n">N</span>길찾기</div>
                    </div>
                  </div>
                  <div className="pm-note"><span>🚌</span><span>버스는 현지 사정으로 도착 시간이 정확하지 않을 수 있습니다. 출발 10분 전 정류장에서 대기하세요.</span></div>
                  <div className="pm-taxi-row">
                    <span>🚕 택시로 대신 갈 경우 · 약 8분 · 6,500원</span>
                  </div>
                  <div style={{ marginTop: "6px" }}><span className="pm-kakao">Kakao T</span></div>
                  <div className="pm-help">
                    <div><div className="ht">관광통역안내센터</div><div className="hs">여행 중 불편사항, 언어 소통</div></div>
                    <div className="hicon" style={{ backgroundColor: "#BFDBFE" }}>📞</div>
                  </div>
                  <div className="pm-help">
                    <div><div className="ht">경찰</div><div className="hs">위험하거나 범죄 피해 발생 시</div></div>
                    <div className="hicon" style={{ backgroundColor: "#FECACA" }}>📞</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USER FLOW */}
      <section className="howto" id="flow">
        <div className="wrap-wide fade-up">
          <div className="sec-eyebrow">User Flow</div>
          <h2 className="sec-title">지역 선택부터 AI 판단까지,<br />5단계로 이어집니다.</h2>

          <div className="howto-steps steps-5 fade-up">
            <div className="howto-step">
              <div className="howto-node"><span className="step-num">S1</span>📍</div>
              <div className="howto-title">지역 선택</div>
              <div className="howto-desc">가고 싶은 소도시를 골라요.</div>
            </div>
            <div className="howto-step">
              <div className="howto-node"><span class="step-num">S2</span>📝</div>
              <div className="howto-title">여행 조건 입력</div>
              <div className="howto-desc">출발지, 시간, 여행 스타일을 입력해요.</div>
            </div>
            <div className="howto-step">
              <div className="howto-node"><span className="step-num">S3</span>🕒</div>
              <div className="howto-title">타임라인</div>
              <div className="howto-desc">시간대별 코스가 자동으로 짜여요.</div>
            </div>
            <div className="howto-step">
              <div className="howto-node"><span className="step-num">S4</span>✏️</div>
              <div className="howto-title">코스 편집</div>
              <div className="howto-desc">삭제·재추천으로 원하는 대로 조정해요.</div>
            </div>
            <div className="howto-step">
              <div className="howto-node"><span className="step-num">S5</span>✅</div>
              <div className="howto-title">AI 판단</div>
              <div className="howto-desc">GO/GO WITH CARE/RECONSIDER/NOT NOW로 확인해요.</div>
            </div>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATION */}
      <section className="diff" id="diff">
        <div className="wrap-wide fade-up">
          <div className="sec-eyebrow">Difference</div>
          <h2 className="sec-title">지도 앱과 여행 정보 앱 사이,<br />KSPOT은 '판단'의 빈틈을 채웁니다.</h2>

          <div className="diff-grid">
            <div className="diff-item fade-up">
              <div className="di-label">지도 앱</div>
              <div className="di-desc">길은 보여주지만, 이 코스가 지금 여행자에게 괜찮은지는 판단하지 않아요.</div>
            </div>
            <div className="diff-item fade-up">
              <div className="di-label">여행 정보 앱</div>
              <div className="di-desc">장소는 추천하지만, 지금 실제로 갈 수 있는지는 알려주지 않아요.</div>
            </div>
            <div className="diff-item fade-up">
              <div className="di-label">번역 앱</div>
              <div className="di-desc">문장은 번역하지만, 목적지 카드나 긴급 연결까지는 제공하지 않아요.</div>
            </div>
            <div className="diff-item highlight fade-up">
              <div className="di-label">KSPOT</div>
              <div className="di-desc">교통·날씨·배차·언어 리스크를 한 번에 판단하고, 실행 가능한 코스와 현장 대응 카드까지 연결해요.</div>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="philosophy">
        <div className="wrap fade-up">
          <div className="phil-eyebrow">Philosophy</div>
          <p className="phil-main">대부분의 여행 서비스는 "떠나라"고 합니다.<br /><span className="accent">KSPOT은 가끔, "지금은 가지 마세요"라고 말합니다.</span></p>
          <div className="phil-divider"></div>
          <p className="phil-sub">아름다운 풍경보다, 안전한 귀가를 먼저 생각합니다. 무리한 일정이라면 과감히 말립니다. '안심'과 '확신' — KSPOT이 서비스의 중심에 두는 가치입니다.</p>
        </div>

        <div className="phil-video fade-up">
          <video controls preload="metadata" playsInline>
            <source src={kspotBrandingVideo} type="video/mp4" />
          </video>
        </div>
      </section>

      {/* TOUR APPLICATION (pilot) */}
      <section className="tour" id="tour">
        <div className="wrap fade-up">
          <div className="sec-eyebrow">Pilot Program — 파일럿 프로그램</div>
          <h2 className="sec-title">🎬 K-드라마 로케이션 투어</h2>
          
          <div className="tour-featured-card">
            <p className="sec-lead">
              선재네 대문 앞부터 방화수류정 피크닉까지, <br />
              드라마 속 명장면을 그대로 따라 걷는 맞춤 가이드북과 디테일한 투어 코스가 준비되어 있습니다.
            </p>
            
            <div className="tour-highlights">
              <div className="th-item">✨ 선재 업고 튀어 주요 촬영지 실물 코스 완벽 가이드</div>
              <div className="th-item">🗺️ 행궁동 피크닉 & 명소 상세 분석 수제 가이드북 제공</div>
              <div className="th-item">🚕 대중교통 배차 간격 및 이동 리스크 실시간 판단 연동</div>
            </div>

            <div className="tour-btn-wrap">
              <Link to="/tour" className="btn-primary">
                투어 코스 보러가기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <div className="wrap fade-up">
          <div className="sec-eyebrow">FAQ</div>
          <h2 className="sec-title">궁금한 점, 미리 답해드릴게요</h2>

          <div className="faq-list">
            {[
              {
                q: "AUTO와 CUSTOM은 뭐가 다른가요?",
                a: "AUTO는 검증된 코스를 그대로 따라가는 방식이고, CUSTOM은 직접 구성한 일정에 판단 엔진이 실행 가능성을 확인해드려요."
              },
              {
                q: "판단 결과가 실제 상황과 다르면 어떻게 하나요?",
                a: "배차·도착 시간은 현장 사정으로 달라질 수 있어요. 그런 경우를 위해 안심 카드에 대체 이동수단(택시 등) 안내를 함께 제공해요."
              },
              {
                q: "어떤 지역까지 지원하나요?",
                a: "서울 외 지방 소도시 위주로 지원하며, 지원 지역은 계속 늘려가고 있어요."
              }
            ].map((faq, idx) => (
              <div key={idx} className={`faq-item ${openFaq === idx ? "open" : ""}`}>
                <button className="faq-q" type="button" onClick={() => toggleFaq(idx)}>
                  <span><span className="q-mark">Q.</span>{faq.q}</span>
                  <span className="faq-icon"></span>
                </button>
                <div className="faq-a">
                  <div className="faq-a-inner">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-final" id="cta">
        <div className="wrap fade-up">
          <div className="sec-eyebrow">KSPOT</div>
          <p className="cta-final-title">이제, <span className="accent">서울 밖으로</span><br />한 걸음 내딛을 시간입니다.</p>
          <div className="cta-actions">
            <a href={SURVEY_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn-primary-dark">
              원하는 코스 받아보기 →
            </a>
            <Link to="/tour/suwon" className="btn-ghost-dark">
              수원 코스 먼저 체험하기
            </Link>
            <a href="mailto:kspot02026@gmail.com" className="btn-ghost-dark">팀에게 문의하기</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-inner">
          <div className="footer-icons">
            <a href="mailto:kspot02026@gmail.com" aria-label="Email">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></svg>
            </a>
            <a href="https://instagram.com/kspot02026" target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" /></svg>
            </a>
          </div>
          <div className="footer-brand"><span className="footer-copy">KSPOT © 2026</span></div>
        </div>
      </footer>
    </div>
  );
}
