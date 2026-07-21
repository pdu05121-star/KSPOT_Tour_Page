import { useEffect, useRef } from "react";
import { FORM_URLS, FormLang, detectFormLang } from "@/app/surveyConfig";

const LANG_OPTIONS: { code: FormLang; flag: string; label: string }[] = [
  { code: "ko", flag: "🇰🇷", label: "한국어" },
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "ja", flag: "🇯🇵", label: "日本語" },
  { code: "zh", flag: "🇨🇳", label: "中文" },
  { code: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
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
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes kspot-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .kspot-modal-panel {
          animation: kspot-modal-up 0.24s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .kspot-backdrop {
          animation: kspot-backdrop-in 0.18s ease both;
        }
        .kspot-lang-btn {
          transition: background-color 0.1s ease, box-shadow 0.1s ease, transform 0.1s ease;
        }
        .kspot-lang-btn:hover {
          transform: translateY(-1px);
        }
        .kspot-lang-btn:active {
          transform: translateY(0);
        }
        .kspot-lang-btn:focus-visible {
          outline: 2px solid ${RUST};
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .kspot-modal-panel, .kspot-backdrop, .kspot-lang-btn { animation: none; transition: none; }
        }
      `}</style>

      <div
        className="kspot-backdrop fixed inset-0 z-50 flex items-center justify-center px-6"
        role="dialog"
        aria-modal="true"
        aria-label="언어 선택"
        style={{ backgroundColor: "rgba(16,28,24,0.5)", backdropFilter: "blur(3px)" }}
      >
        <div className="absolute inset-0" onClick={onClose} />

        <div
          className="kspot-modal-panel relative w-full mx-auto rounded-2xl"
          style={{ backgroundColor: PAPER, maxWidth: 360 }}
        >
          {/* 닫기 */}
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-full"
            style={{ color: INK, opacity: 0.3 }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="11" y1="1" x2="1" y2="11" />
            </svg>
          </button>

          {/* 타이틀 */}
          <div className="text-center pt-10 pb-8 px-8">
            <p className="text-[22px] font-black leading-snug" style={{ color: PINE }}>
              {PROMPT[recommended]}
            </p>
          </div>

          {/* 버튼 목록 */}
          <div className="flex flex-col items-center gap-2 pb-8 px-8">
            {LANG_OPTIONS.map(({ code, flag, label }) => {
              const isRec = code === recommended;
              return (
                <button
                  key={code}
                  ref={isRec ? recBtnRef : undefined}
                  type="button"
                  onClick={() => handleSelect(code)}
                  className="kspot-lang-btn inline-flex items-center gap-2.5 rounded-full px-6 py-2.5"
                  style={isRec ? {
                    backgroundColor: PINE,
                    color: "#fff",
                    boxShadow: "0 4px 12px rgba(32,54,47,0.22)",
                  } : {
                    backgroundColor: PAPER_DEEP,
                    color: INK,
                    border: `1px solid ${HAIRLINE}`,
                  }}
                >
                  <span className="text-base leading-none">{flag}</span>
                  <span className="font-bold text-[14px]">{label}</span>
                  {isRec && (
                    <span
                      className="text-[9px] font-black tracking-wide px-1.5 py-0.5 rounded-full ml-0.5"
                      style={{ backgroundColor: RUST, color: "#fff" }}
                    >
                      추천
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 구분선 + 취소 */}
          <div style={{ borderTop: `1px solid ${HAIRLINE}` }}>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-4 text-[13px] font-semibold text-center transition-opacity hover:opacity-70"
              style={{ color: INK, opacity: 0.45 }}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
