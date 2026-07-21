// KSPOT 수요조사 구글폼 — 언어별 URL 맵
export const SURVEY_FORM_URL = "#SURVEY_FORM_URL"; // 레거시 — 직접 쓰지 말 것, LangFormModal 사용

export type FormLang = "ko" | "zh" | "en" | "ja" | "vi";

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
