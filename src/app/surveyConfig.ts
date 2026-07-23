// KSPOT 수요조사 구글폼 — 언어별 URL 맵
export const SURVEY_FORM_URL = "#SURVEY_FORM_URL"; // 레거시 — 직접 쓰지 말 것, LangFormModal 사용

export type FormLang = "ko" | "zh" | "en" | "ja" | "vi";

export const SUPPORTED_LANGS: FormLang[] = ["ko", "en", "ja", "zh", "vi"];

// /tour, /tour/suwon 공통 언어 저장 키 — 2026-07-23 흐름 개편 명세 v2
export const KSPOT_LANG_STORAGE_KEY = "kspot_lang";

export const FORM_URLS: Record<FormLang, string> = {
  ko: "https://docs.google.com/forms/d/e/1FAIpQLScAXgPiahiHJz7q7_l6B4o6NM_1wI5uUhWpVIdjD7dUdgUTMQ/viewform",
  zh: "https://docs.google.com/forms/d/e/1FAIpQLSfUOHoSbq9bvFbbla_atxj1HLPUf4HSLtw2LgtcW6cufjbNgw/viewform",
  en: "https://docs.google.com/forms/d/e/1FAIpQLSe2QlPMRdTL7bSbdnthnvYn_cYb-E7M7h__sL9z0Y_IsRdt0g/viewform",
  ja: "https://docs.google.com/forms/d/e/1FAIpQLSdGa0mLt12HnsKRqQfslRXUV5fQMxvcVKKmeSU8Ol0M6_xP_Q/viewform",
  vi: "https://docs.google.com/forms/d/e/1FAIpQLSe3N5h0PMidstKKjaohUiQNRoKX-PcmvRS9K5tZYKEd0lw0fg/viewform",
};

export function detectFormLang(): FormLang {
  const l = (navigator.language || "en").slice(0, 2).toLowerCase();
  if (l === "ko") return "ko";
  if (l === "zh") return "zh";
  if (l === "ja") return "ja";
  if (l === "vi") return "vi";
  return "en";
}

/** 지원 언어인지 확인 (query lang 등 신뢰할 수 없는 입력 검증용) */
export function isFormLang(value: string | null | undefined): value is FormLang {
  return !!value && (SUPPORTED_LANGS as string[]).includes(value);
}

/** localStorage에 저장된 언어 조회. SSR/빌드 환경 등 window가 없으면 null. */
export function getStoredLang(): FormLang | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(KSPOT_LANG_STORAGE_KEY);
  return isFormLang(v) ? v : null;
}

/** localStorage에 언어 저장. SSR/빌드 환경 등 window가 없으면 아무 것도 하지 않음. */
export function setStoredLang(lang: FormLang): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KSPOT_LANG_STORAGE_KEY, lang);
}
