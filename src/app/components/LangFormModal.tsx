import { useEffect, useRef, useState } from "react";
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
const INK = "#3A342C";
const HAIRLINE = "#DED2B8";

export default function LangFormModal({ open, onClose }: Props) {
  const recommended = detectFormLang();
  const [selected, setSelected] = useState<FormLang>(recommended);
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setSelected(recommended);
      firstRef.current?.focus();
    }
  }, [open, recommended]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleConfirm() {
    window.open(FORM_URLS[selected], "_blank", "noopener");
    onClose();
  }

  return (
    <>
      <style>{`
        @keyframes kspot-modal-up {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
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
        .kspot-radio-row {
          transition: background-color 0.1s ease;
        }
        .kspot-radio-row:hover {
          background-color: rgba(32,54,47,0.05);
        }
        .kspot-radio-row:focus-visible {
          outline: 2px solid ${PINE};
          outline-offset: -2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .kspot-modal-panel, .kspot-backdrop { animation: none; }
          .kspot-radio-row { transition: none; }
        }
      `}</style>

      <div
        className="kspot-backdrop fixed inset-0 z-50 flex items-center justify-center px-8 py-10"
        role="dialog"
        aria-modal="true"
        aria-label="언어 선택"
        style={{ backgroundColor: "rgba(16,28,24,0.45)", backdropFilter: "blur(3px)" }}
      >
        <div className="absolute inset-0" onClick={onClose} />

        <div
          className="kspot-modal-panel relative w-full mx-auto rounded-2xl overflow-hidden"
          style={{ backgroundColor: PAPER, maxWidth: 380 }}
        >
          {/* 타이틀 */}
          <div className="px-8 pt-8 pb-5">
            <p className="text-[18px] font-bold" style={{ color: INK }}>
              {PROMPT[recommended]}
            </p>
          </div>

          {/* 라디오 목록 */}
          <div>
            {LANG_OPTIONS.map(({ code, flag, label }, i) => {
              const isSelected = code === selected;
              return (
                <button
                  key={code}
                  ref={i === 0 ? firstRef : undefined}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelected(code)}
                  className="kspot-radio-row w-full flex items-center gap-4 px-8"
                  style={{ height: 54, color: INK }}
                >
                  {/* 라디오 서클 */}
                  <span
                    className="flex-shrink-0 flex items-center justify-center rounded-full"
                    style={{
                      width: 22,
                      height: 22,
                      border: isSelected ? `6px solid ${PINE}` : `2px solid ${HAIRLINE}`,
                      backgroundColor: "transparent",
                      transition: "border 0.12s ease",
                    }}
                  />
                  <span className="text-lg leading-none">{flag}</span>
                  <span className="text-[15px] font-medium">{label}</span>
                </button>
              );
            })}
          </div>

          {/* 하단 버튼 */}
          <div
            className="flex justify-end gap-2 px-6 py-4"
            style={{ borderTop: `1px solid ${HAIRLINE}`, marginTop: 12 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-[13px] font-bold tracking-wide uppercase transition-opacity hover:opacity-60"
              style={{ color: PINE, opacity: 0.55 }}
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-lg text-[13px] font-bold tracking-wide uppercase transition-opacity hover:opacity-80"
              style={{ color: PINE }}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
