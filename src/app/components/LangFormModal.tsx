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

const CANCEL_LABEL: Record<FormLang, string> = {
  ko: "취소", en: "Cancel", ja: "キャンセル", zh: "取消", vi: "Hủy",
};
const CONFIRM_LABEL: Record<FormLang, string> = {
  ko: "확인", en: "Confirm", ja: "確認", zh: "确认", vi: "Xác nhận",
};

interface Props {
  open: boolean;
  onClose: () => void;
  /** 페이지에서 현재 보고 있는 언어. 전달하면 브라우저 언어 대신 이 언어를 우선 사용 */
  pageLang?: FormLang;
}

const PINE = "#20362F";
const PAPER = "#F5F0E6";
const INK = "#3A342C";
const HAIRLINE = "#DED2B8";

export default function LangFormModal({ open, onClose, pageLang }: Props) {
  const recommended = pageLang ?? detectFormLang();
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
        className="kspot-backdrop fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="언어 선택"
        style={{ backgroundColor: "rgba(16,28,24,0.45)", backdropFilter: "blur(3px)", padding: "48px 32px" }}
      >
        <div className="absolute inset-0" onClick={onClose} />

        <div
          className="kspot-modal-panel relative w-full mx-auto rounded-2xl overflow-hidden"
          style={{ backgroundColor: PAPER, maxWidth: 440 }}
        >
          {/* 타이틀 */}
          <div style={{ padding: "44px 44px 28px" }}>
            <p className="font-bold" style={{ color: INK, fontSize: 20 }}>
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
                  className="kspot-radio-row w-full flex items-center"
                  style={{ height: 68, color: INK, padding: "0 44px", gap: 20 }}
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
                  <span className="leading-none" style={{ fontSize: 20 }}>{flag}</span>
                  <span className="font-medium" style={{ fontSize: 16 }}>{label}</span>
                </button>
              );
            })}
          </div>

          {/* 하단 버튼 */}
          <div
            className="flex justify-end"
            style={{ borderTop: `1px solid ${HAIRLINE}`, marginTop: 20, padding: "20px 36px", gap: 12 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg font-bold tracking-wide uppercase transition-opacity hover:opacity-60"
              style={{ color: PINE, opacity: 0.55, fontSize: 13, padding: "10px 20px" }}
            >
              {CANCEL_LABEL[recommended]}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-lg font-bold tracking-wide uppercase transition-opacity hover:opacity-80"
              style={{ color: PINE, fontSize: 13, padding: "10px 20px" }}
            >
              {CONFIRM_LABEL[recommended]}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
