// GA4 초기화·이벤트 전송 — 프로덕션 빌드에서만 실제로 동작합니다.
// 로컬 개발 서버(localhost)나 프리뷰 빌드에서 테스트할 때 내부 트래픽이 실제 GA4 데이터로
// 잡히는 걸 막기 위한 안전장치입니다 (IP 기반 내부 트래픽 필터는 원격/클라우드 실행 환경에서
// 등록된 사무실 IP와 불일치해 걸러지지 않을 수 있음).
const GA_MEASUREMENT_ID = "G-N9X3M46KR8";

// main.tsx에서 앱 렌더링 전 한 번만 호출합니다. 개발 빌드에서는 스크립트 자체를 아예 로드하지 않습니다.
export function initAnalytics() {
  if (!import.meta.env.PROD) return;
  if ((window as any).gtag) return; // 이미 초기화된 경우 중복 로드 방지

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: unknown[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!import.meta.env.PROD) return;
  (window as any).gtag?.("event", name, params);
}
