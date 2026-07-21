import { useEffect, useRef } from "react";
import { FORM_URLS, FormLang, detectFormLang } from "@/app/surveyConfig";

const LANG_OPTIONS: { code: FormLang; label: string; sub: string }[] = [
  { code: "ko", label: "한국어", sub: "Korean" },
  { code: "zh", label: "中文", sub: "Chinese" },
  { code: "en", label: "English", sub: "English" },
  { code: "ja", label: "日本語", sub: "Japanese" },
  { code: "vi", label: "Tiếng Việt", sub: "Vietnamese" },
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
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="언어 선택"
    >
      {/* 백드롭 */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* 모달 패널 */}
      <div
        className="relative w-full sm:max-w-sm mx-auto rounded-t-2xl sm:rounded-2xl px-5 pt-6 pb-8 sm:pb-6"
        style={{ backgroundColor: "#F5F0E6" }}
      >
        {/* 핸들 (모바일) */}
        <div className="w-10 h-1 rounded-full bg-black/20 mx-auto mb-5 sm:hidden" />

        <p className="text-sm font-black text-center mb-4" style={{ color: "#20362F" }}>
          {PROMPT[recommended]}
        </p>

        <div className="flex flex-col gap-2">
          {LANG_OPTIONS.map(({ code, label, sub }) => {
            const isRec = code === recommended;
            return (
              <button
                key={code}
                ref={isRec ? recBtnRef : undefined}
                type="button"
                onClick={() => handleSelect(code)}
                className="w-full flex items-center justify-between rounded-lg px-4 py-3 text-sm font-bold transition-colors"
                style={{
                  backgroundColor: isRec ? "#20362F" : "#EAE1CC",
                  color: isRec ? "#fff" : "#3A342C",
                  border: isRec ? "none" : "1px solid #DED2B8",
                }}
              >
                <span>{label}</span>
                <span className="text-xs font-normal opacity-60">{sub}{isRec ? " ✓" : ""}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-xs text-center opacity-40 hover:opacity-70 transition-opacity"
          style={{ color: "#3A342C" }}
        >
          닫기 / Close
        </button>
      </div>
    </div>
  );
}
