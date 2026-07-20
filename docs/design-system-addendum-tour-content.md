---
title: KSPOT Travelog (Tour Content) 서브 브랜드 컬러 — Design System v3 부록
tags: [design-system, sub-brand, tour-content]
status: proposed
created: 2026-07-17
related: [[Design_System_v3]]
---

> 이 문서는 `Design_System_v3.md`에 새 섹션으로 추가할 것을 제안하는 초안입니다.
> 검토 후 본 문서 원본에 병합해 주세요.

## 배경 — 왜 서브 브랜드 컬러가 필요한가

코어 앱(S1~S5, 판단 엔진)은 **"불안 → 안심"**이라는 감정 전환이 핵심이라 teal 계열의
차분하고 신뢰감 있는 톤을 사용한다. 반면 `/tour/*` 상세페이지(드라마 촬영지 성지순례,
여행 에디토리얼 콘텐츠)는 **"과몰입 → 힐링"**에 가까운 감성 콘텐츠이며, 잠재 고객 접점도
Instagram 캐러셀 → 랜딩 상세페이지 순으로 코어 앱과 별도 퍼널을 탄다.

두 톤을 같은 teal 하나로 밀어붙이면 투어 콘텐츠가 "판단 엔진 UI의 연장선"처럼 읽혀
정작 담아야 할 여행 에디토리얼 감성이 옅어진다. 그래서 투어 콘텐츠 전용 서브 브랜드
팔레트를 별도로 둔다. (코어 앱 컬러는 변경하지 않음 — 기존 `--teal` 체계 그대로 유지)

## 적용 범위

- 적용: `/tour/[지역명]` 상세페이지 전체 (수원·강릉·춘천 등, 블로그형/에디토리얼형 레이아웃)
- 미적용: S1~S5 판단 엔진 플로우, Storage, 홈 화면 — 기존 `--teal` 체계 그대로

## 컬러 토큰 — KSPOT Travelog (Tour Content)

```css
/* Travelog 서브 브랜드 — 코어 --teal 체계와 분리 */
--tour-rust:       #B5502F   /* 주요 CTA·포인트·스팟 넘버 배지. 여행 스탬프/필름 감성 */
--tour-ink-deep:   #20362F   /* 헤드라인. 짙은 잉크그린 — 코어 teal 계열과 톤은 이어가되 채도↓ */
--tour-body-ink:   #3A342C   /* 본문 텍스트. 완전 검정 아닌 따뜻한 다크 뉴트럴 */
--tour-paper:      #F5F0E6   /* 배경. 따뜻한 파피루스 톤 */
--tour-paper-deep: #EAE1CC   /* 하이라이트 박스(꿀팁 등) 배경 */
--tour-border:     #DED2B8   /* 헤어라인 구분선 */

/* 코어 브랜드와의 연결점 — 최소한으로만 사용 */
--teal: #1D9E75   /* 하단 nav 링크 등, KSPOT 소속임을 알리는 용도 한정 */
```

## 사용 원칙

1. **CTA 버튼**은 `--tour-rust`. 코어 앱의 `--teal` CTA와 시각적으로 구분되어야 한다.
2. **헤드라인/세리프 타이틀**은 `--tour-ink-deep`. 폰트도 코어 앱 시스템폰트 대신
   `Noto Serif KR`(헤드라인) + `Noto Sans KR`(본문) 조합을 사용해 에디토리얼 톤을 낸다.
3. 스팟 사진은 흰 프레임(6px) + 살짝 기울인(rotate) 스크랩북 배치, 우상단에
   `--tour-rust` 배경의 원형 "SPOT 0N" 배지를 시그니처 요소로 둔다.
4. `--teal`은 상단 nav의 "다른 투어 보기" 등 아주 제한적인 지점에만 남겨서
   "이것도 KSPOT 소속 콘텐츠"라는 최소한의 연결점만 유지한다.
5. 하단 고정 CTA 바는 코어 앱 CTA 스펙(`border-radius:14px`, `padding:16px`)의
   치수 규칙은 그대로 따르되, 색상만 `--tour-rust`로 교체한다.

## 참고 구현

- `src/app/pages/SuwonTour.tsx` (수원 · 선재 업고 튀어, 실제 서비스 중인 버전 — 이커머스형에서 이 서브 브랜드로 전환 완료)
- `src/app/pages/SuwonTourBlog.tsx` (`feature/suwon-blog-style` 브랜치의 별도 비교 시안 — 미병합)
- `src/app/pages/ChuncheonTour.tsx`, `GangneungTour.tsx` (2026-07-21, 틀만 전환 완료 — 아래 참고)

## 미결정 사항 (다음 논의 필요)

- [x] 기존 이커머스형도 이 서브 브랜드로 전환할지 → **전환하는 쪽으로 결정** (2026-07-21).
      단, 춘천·강릉은 **디자인 틀만** 전환했고 실제 콘텐츠(왕복 교통시간 확정·번역·사진·마이맵 링크)는
      아직 미작업 상태. 왕복 판단이 안 된 코스는 GO로 표시하지 않고 `◐ DRAFT`로 정직하게 노출하는 게
      새 원칙 — 자세한 내용은 [[worklog-2026-07-21]] 참고
- [x] 서브 브랜드 명칭 확정 → **KSPOT Travelog** (2026-07-17 확정. 추후 팀 협의로 변경 가능)
