import emblemImg from "@/assets/brand/logo-emblem.png";
import wordmarkImg from "@/assets/brand/logo-wordmark.png";

interface Props {
  /** 엠블럼 이미지 높이(px). 워드마크는 이 값에 비례해 자동으로 맞춰짐 */
  size?: number;
  className?: string;
}

// 전 페이지 공통 로고 lockup — 엠블럼 + 금색 워드마크만, 배지 배경 없음
// (수원상세페이지는 자체 "KSPOT Travelog" 스타일을 유지하므로 이 컴포넌트를 쓰지 않음, 2026-07-23)
export default function BrandLogo({ size = 28, className }: Props) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.3,
      }}
    >
      <img src={emblemImg} alt="KSPOT" style={{ height: size, width: "auto", display: "block" }} />
      <img src={wordmarkImg} alt="KSPOT" style={{ height: size * 0.46, width: "auto", display: "block" }} />
    </span>
  );
}
