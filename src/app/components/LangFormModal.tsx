import { useEffect, useRef } from "react";
import { FORM_URLS, FormLang, detectFormLang } from "@/app/surveyConfig";

const LANG_OPTIONS: { code: FormLang; flag: string; label: string; sub: string }[] = [
  { code: "ko", flag: "🇰🇷", label: "한국어", sub: "Korean" },
  { code: "en", flag: "🇺🇸", label: "English", sub: "English" },
  { code: "ja", flag: "🇯🇵", label: "日本語", sub: "Japanese" },
  { code: "zh", flag: "🇨🇳", label: "中文", sub: "Chinese" },
  { code: "vi", flag: "🇻🇳", label: "Tiếng Việt", sub: "Vietnamese" },
];

const PROMPT: Record<FormLang, string> = {
  ko: "어떤 언어로 신청할까요?",
  zh: "请选择您的语言",
  en: "Choose your language",
  ja: "言語を選んでください",
  vi: "Chọn ngôn ngữ của bạn",
};

interface Props {
  open: boolean;
  onClose: () => void;
}

const PINE = "#20362F";
const PAPER = "#F5F0E6";
const PAPER_DEEP = "#EAE1CC";
const INK = "#3A342C";
const HAIRLINE = "#DED2B8";
const RUST = "#B5502F";

export default function LangFormModal({ open, onClose }: Props) {
  const recommended = detectFormLang();
  const recBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) recBtnRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleSelect(lang: FormLang) {
    window.open(FORM_URLS[lang], "_blank", "noopener");
    onClose();
  }

  return (
    <>
      <style>{`
        @keyframes kspot-modal-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes kspot-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .kspot-modal-panel {
          animation: kspot-modal-up 0.22s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .kspot-backdrop {
          animation: kspot-backdrop-in 0.18s ease both;
        }
        .kspot-lang-btn {
          transition: box-shadow 0.12s ease, background-color 0.12s ease;
        }
        .kspot-lang-btn:hover:not(.kspot-lang-btn--rec) {
          background-color: #E2D8C4 !important;
        }
        .kspot-lang-btn:focus-visible {
          outline: 2px solid ${RUST};
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .kspot-modal-panel, .kspot-backdrop { animation: none; }
        }
      `}</style>

      <div
        className="kspot-backdrop fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
        role="dialog"
        aria-modal="true"
        aria-label="언어 선택"
        style={{ backgroundColor: "rgba(16,28,24,0.55)", backdropFilter: "blur(2px)" }}
      >
        {/* 백드롭 클릭 영역 */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* 패널 */}
        <div
          className="kspot-modal-panel relative w-full sm:max-w-[360px] mx-auto rounded-t-[20px] sm:rounded-[20px] overflow-hidden"
          style={{ backgroundColor: PAPER }}
        >
          {/* 핸들 바 (모바일) */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-8 h-[3px] rounded-full" style={{ backgroundColor: HAIRLINE }} />
          </div>

          {/* 헤더 */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3 sm:pt-5">
            <div>
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase opacity-50" style={{ color: INK }}>
                KSPOT
              </p>
              <p className="text-[15px] font-black mt-0.5" style={{ color: PINE }}>
                {PROMPT[recommended]}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-black/8"
              style={{ color: INK, opacity: 0.4 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="1" y1="1" x2="13" y2="13" />
                <line x1="13" y1="1" x2="1" y2="13" />
              </svg>
            </button>
          </div>

          {/* 구분선 */}
          <div style={{ height: 1, backgroundColor: HAIRLINE, margin: "0 20px" }} />

          {/* 언어 목록 */}
          <div className="px-4 py-3 flex flex-col gap-1.5">
            {LANG_OPTIONS.map(({ code, flag, label, sub }) => {
              const isRec = code === recommended;
              return (
                <button
                  key={code}
                  ref={isRec ? recBtnRef : undefined}
                  type="button"
                  onClick={() => handleSelect(code)}
                  className="kspot-lang-btn w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left"
                  style={isRec ? {
                    backgroundColor: PINE,
                    color: "#fff",
                    boxShadow: "0 2px 8px rgba(32,54,47,0.18)",
                  } : {
                    backgroundColor: PAPER_DEEP,
                    color: INK,
                    border: `1px solid ${HAIRLINE}`,
                  }}
                >
                  <span className="text-xl leading-none">{flag}</span>
                  <span className="flex-1 font-bold text-[14px]">{label}</span>
                  {isRec ? (
                    <span
                      className="text-[10px] font-black tracking-wide px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: RUST, color: "#fff" }}
                    >
                      추천
                    </span>
                  ) : (
                    <span className="text-[12px] opacity-40">{sub}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 하단 여백 + 안전 영역 */}
          <div className="pb-5 sm:pb-4" />
        </div>
      </div>
    </>
  );
}
