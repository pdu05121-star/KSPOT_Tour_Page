---
title: KSPOT Design System v3
tags: [design-system]
aliases: [Design System v3]
status: active
---

## 관련 노트
- [[Dev_Spec_v2]]
- [[KSPOT_mockup_v4.html|Mockup v4 (시각 자료)]]

---

# KSPOT Design System & Development Guide

> **버전:** Phase 2 (2026.06.26 업데이트)  
> **목업:** `KSPOT_mockup_v3.html`  
> **명세서:** `KSPOT_Dev_Spec_v1.docx`  
> ⚠️ Phase 1과 컬러·판정체계·용어가 변경됨. 반드시 이 파일 기준으로 작업할 것.

---

## 1. 서비스 개요

- **목적:** 일본인 여행자가 한국 소도시에서 택시를 안전하게 이용할 수 있도록 돕는 서비스
- **핵심 감정 전환:** 불안 → 안심. UI는 "다 알아서 정리해줬다"는 느낌을 줘야 함
- **플랫폼:** 모바일 웹 (PWA). 375px 기준. tap 인터랙션. hover 없음
- **전체 플로우:** HOME → S1 지역 선택 → S2 조건 입력 → S3 타임라인 → S4 코스 편집 → S5 판단 결과 → Storage

---

## 2. Color System

```css
/* 브랜드 */
--teal:           #1D9E75   /* 버튼, CTA, 핵심 액센트 */
--teal-dark:      #0F6E56   /* 브랜드 메인, 로고, GO 판정 텍스트 */
--teal-bg:        #E8F5F0   /* 뱃지 배경, 더보기 버튼 배경 */

/* 배경 */
--bg-base:        #FFFFFF   /* 서비스 전체 배경 */
--bg-surface:     #F3F4F6   /* 교통 블록, 섹션 구분 배경 */
--bg-elevated:    #E8EAED   /* 비활성 버튼, 강조 배경 */

/* 텍스트 */
--text-primary:   #111827   /* 제목, 강조 */
--text-secondary: #374151   /* 본문 */
--text-muted:     #9CA3AF   /* 보조, 라벨, 비활성 */

/* 테두리 */
--border:         #E8EAED
--border-mid:     #D1D5DB
```

**기타 고정 색상 (CSS 변수 없음)**

| 용도 | HEX |
| :--- | :--- |
| Train 교통 뱃지 원 | `#3B82F6` |
| Taxi 교통 뱃지 원 | `#F59E0B` |
| Start 원형 | `#3B82F6` |
| Finish 원형 | `#D85A30` |
| Kakao T 버튼 | `#FEE500` (텍스트 `#1C1C1A`) |
| 네이버 길찾기 N 뱃지 | `#03C75A` |
| 신고하기 버튼 | `#E74C3C` |
| 관광통역안내센터 배경 | `#EBF5FB` |
| 관광통역안내센터 전화 버튼 | `#2E86C1` |
| 경찰 배경 | `#FDEDEC` |
| 경찰 전화 버튼 | `#C0392B` |
| 안심 카드 목적지 배경 | `#FFFBEB` |
| 삭제 버튼 배경 | `#FEF2F2` (텍스트 `#DC2626`) |
| 캘린더 일요일/공휴일 | `#E53E3E` |
| 캘린더 토요일 | `#3B82F6` |

---

## 3. Typography

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
```

| 용도 | size | weight |
| :--- | :--- | :--- |
| 히어로 메인 | 22px | 800 |
| 지역명 오버레이 | 18px | 800 |
| 카드 제목 / 스팟명 | 14px | 700 |
| 안심 카드 목적지명 | 36px | 800 |
| 안심 카드 "기사님께 보여주세요" | 13px | 800 |
| 본문 | 13px | 400 |
| 라벨 / 뱃지 | 10–11px | 500–700 |
| 섹션 레이블 | 11px | 700 |

---

## 4. Layout 구조

### 화면 Flex 구조 (필수)

```
.phone (position:relative, display:flex, flex-direction:column)
  ├── .hdr (헤더 고정)
  ├── .phone-scroll (flex:1, overflow-y:auto)
  │     └── .body (콘텐츠)
  ├── .overlay (position:absolute, inset:0) ← 바텀시트 오버레이. phone-scroll 밖
  └── .nav (flex-shrink:0)
```

**오버레이 규칙**
- `position: absolute` (phone 기준) — `position: fixed` **절대 사용 금지**
- `inset: 0`, `z-index: 100`, `background: rgba(0,0,0,0.5)`
- **반드시 phone-scroll 밖에 위치** — phone-scroll 안에 넣으면 스크롤 따라 움직임

### Spacing

- 페이지 좌우 padding: `20px`
- 카드 내부 padding: `14–16px`
- 8px 격자 기본

---

## 5. 컴포넌트 상태

| 컴포넌트 | 기본 | 선택됨 / 활성 | 비활성 |
| :--- | :--- | :--- | :--- |
| CTA 버튼 | `--teal` bg, white text | — | `--bg-elevated` bg, `--text-muted` text, pointer-events:none |
| 지역 카드 | border 2px solid `--border` | border-color `--teal`, box-shadow teal | — |
| 여행 스타일 카드 | white bg, border `--border` | `--teal` bg, white text | — |
| 캘린더 날짜 | `--text-primary` | `--teal` bg, white, border-radius 50% | `--text-muted` (오늘 이전) |
| 북마크 아이콘 | stroke `--text-muted`, fill none | fill `--teal` | — |
| 더보기 버튼 | bg `--teal-bg`, color `--teal`, 10px/fw:600 | — | — |
| 교통 블록 자세히 버튼 | bg rgba(255,255,255,0.5), 10px/fw:700/teal-dark | — | — |

---

## 6. 핵심 컴포넌트 스펙

### CTA 버튼
```css
.cta-wrap { flex-shrink:0; padding:10px 20px 12px; background:white; border-top:0.5px solid var(--border); }
.cta-btn  { width:100%; padding:16px; background:var(--teal); color:white;
            border-radius:14px; font-size:14px; font-weight:700; border:none; }
.cta-btn.disabled { background:var(--bg-elevated); color:var(--text-muted); pointer-events:none; }
```
- S2 문구: **"Next"** 고정
- S3 버튼: **"코스 수정"** (outline) + **"저장"** (filled)
- S4 버튼: **"AI 판단"** (filled, full-width)
- S5 버튼: **"코스 수정"** (outline) + **"저장"** (filled) / NOT NOW시 **"코스 수정하기"** 단독

### 지역 카드 (S1)
- 카드 전체: `border-radius:14px`, `border:2.5px solid var(--border)`
- 이미지 영역: `aspect-ratio:16/9`, 그라디언트 배경
- 지역명: 이미지 **좌하단** 흰 텍스트 (박스 없음), `font-size:18px`, `font-weight:800`
- K콘텐츠 태그: 이미지 **우상단** `rgba(0,0,0,0.55)` 배경 pill
- 출처: TourAPI `contentTypeId=91` → `title` 필드

### 교통 뱃지 (S3 타임라인)
- 세로선: `border-left:2px dashed #CBD5E1`
- 🚆 Train: 원 `#3B82F6` (파랑)
- 🚕 Taxi: 원 `#F59E0B` (노랑)
- 원 크기: `10×10px`, `border-radius:50%`

### 하단 네비게이션
- HTML에 **고정** (JS innerHTML 주입 금지)
- `updateNav(screenId)` 함수로 색상·active 클래스만 교체
- **Home / Explore / Storage** 3탭 (Phase 1의 Tickets → Storage로 변경)
- 아이콘: SVG 인라인. 홈=house / Explore=compass / Storage=bookmark

### 바텀시트 공통
```css
border-radius: 20px 20px 0 0;
핸들: width:36px, height:4px, background:#CBD5E1, border-radius:2px, margin:10px auto 6px
box-shadow: 0 -8px 32px rgba(0,0,0,0.18);
```
- **반드시 phone-scroll 밖에 위치** (4장 Flex 구조 참고)
- overlay div: `position:absolute; inset:0; background:rgba(0,0,0,0.6)`
- bs div: `background:white; border-radius:20px 20px 0 0; width:100%`

### Storage 카드 (TRAVEL PASS)
- 카드 배경: `#1D9E75` (최근) / `#5bb89e` (중간) / `#8ecfbe` (뒤)
- border-radius: 16px
- 카드 탭 후 상태에서 **우측 상단 ✕ 삭제 버튼 노출**
  - 크기: 26×26px, border-radius:50%
  - bg: rgba(0,0,0,0.25), color: white, font-size: 13px
- ✕ 탭 → 삭제 확인 팝업
  - 팝업 배경: rgba(0,0,0,0.5), border-radius:40px (phone 기준)
  - 팝업 카드: white, border-radius:16px, padding:24px
  - 취소 버튼: outline border `--border`, color `--text-secondary`
  - 삭제 버튼: bg `#FEF2F2`, color `#DC2626`

---

## 7. 화면별 고정 텍스트

### HOME (언어 무관 한국어 고정)

```
히어로:   "처음이라서, 혼자라서,\n소통이 안 돼서"   [22px/800, text-primary]
액센트:   "로컬 여행이 두려우신가요?"               [26px/800, --teal]
서브:     "여행 코스부터 택시 이용 노하우까지\nKSPOT이 도와드리겠습니다."  [13px, text-secondary]

플로팅 CTA: "여행 코스 만들기" — position:sticky, bottom:70px, bg:teal, border-radius:14px

섹션:
  지금 인기 있는 여행지 — 원형 썸네일 (76×76px) 가로 스크롤. 탭 → S2 직행
  이번 달 축제 — TourAPI searchFestival2. 카드 탭 → 팝업
  K콘텐츠 섹션 — 이번 단계 미구현
```

⚠️ Phase 1의 기능카드(AI 코스 추천 / Survival Card / 택시 요금) 섹션 **제거됨**

---

## 8. 다국어 설정

**번역 불필요 고정 문구**

| 구분 | 항목 |
| :--- | :--- |
| 한국어 고정 | Survival Card 목적지 문구 (~로 가고 싶습니다) — 기사님이 읽는 문구 |
| 한국어 고정 | 주소 (경북 경주시 불국로 385 등) — TourAPI addr 그대로 |
| 영어 고정 | "Next", "Start", "Finish", "Train", "Taxi" |
| 영어 고정 | "Kakao T" (이모지 없음) |
| 영어 고정 | "ROUTE", "DEPART", "RETURN", "STYLE", "DATE" (Storage 카드) |
| 영어 고정 | "N" 뱃지 (네이버 길찾기) |
| 영어 고정 | "GO", "GO WITH CARE", "RECONSIDER", "NOT NOW" (판정 텍스트) |

나머지 모든 텍스트는 언어 선택에 따라 번역 적용.

**구현**
```js
window._currentLang = 'ja' // 기본값
// 지원: 'ko' | 'ja' | 'en' | 'zh-tw' | 'zh-cn'
```

**안심 카드 실제 문구 확정본** (Phase 1의 Survival Card → 안심 카드로 명칭 변경)

**기사 안내 문구 (언어별 번역 적용)** — `guideText[lang]`

| 언어 | 기사 안내 문구 |
| :--- | :--- |
| 🇰🇷 ko | 기사님께 보여주세요 |
| 🇯🇵 ja | 運転手さんに見せてください |
| 🇺🇸 en | Please show this to the driver |
| 🇹🇼 zh-tw | 請出示給司機看 |
| 🇨🇳 zh-cn | 请出示给司机看 |

**목적지 문구 (한국어 고정)** — 기사님이 읽는 문구, 번역 없음. 형식: "{스팟명}로 가고 싶습니다."

예시: 불국사로 가고 싶습니다. / 첨성대로 가고 싶습니다.

→ TourAPI title 필드 + "로 가고 싶습니다." 자동 조합

---

## 9. 안심 카드 바텀시트 구조

Phase 1의 "Survival Card" → Phase 2에서 **"안심 카드"** 로 명칭 변경.

**버스 구간 바텀시트**
```
핸들 (36×4px, #CBD5E1)
상단 라벨: "안심 카드" — 15px/fw:800/--teal
구간 텍스트: "경주역 → 불국사" — 13px/fw:700
거리·소요: "📍 N.Nkm · 도보 약 N분" — 10px/text-muted

목적지 카드 (bg:#FFFBEB, border-radius:12px):
  "기사님께 보여주세요" — 13px/fw:800/teal-dark, border-bottom teal
  목적지명 — 36px/fw:800 ★가장 크게
  "여기로 가고 싶습니다" — 14px/text-secondary
  주소 + 복사 아이콘 + [N 길찾기 버튼 (bg:white)] — border-top

버스 안내 문구 (bg:bg-surface, border-radius:8px):
  "버스는 현지 사정으로 도착 시간이 정확하지 않을 수 있습니다. 출발 10분 전 정류장에서 대기하세요."

택시 대안:
  🚕 약 N분 · N,000원 + [Kakao T] 버튼 (#FEE500)

긴급연락처: 관광통역안내센터(#2E86C1) + 경찰(#C0392B) 2개만
```

**택시 구간 바텀시트**
```
동일 구조. 차이점:
- N 길찾기 버튼 없음
- [Kakao T] 버튼 단독 (#FEE500, 13px/fw:700/#1C1C1A)
- 버스 안내 문구 없음 / 택시 대안 없음
```

---

## 10. 긴급전화 바텀시트 구조

```
핸들 (36×4px, #CBD5E1)

관광통역안내센터 카드 (background:#EBF5FB, border-radius:12px):
  좌: "관광통역안내센터" (font-weight:700, #1A5276)
      "여행 중 불편사항, 언어 소통 문제" (10px, #2E86C1)
  우: 원형 전화 버튼 (38×38px, #2E86C1) → href="tel:1330"
  ※ 좌측 아이콘 없음. 번호 텍스트 없음.

경찰 카드 (background:#FDEDEC, border-radius:12px):
  좌: "경찰" (font-weight:700, #922B21)
      "위험하거나 범죄 피해가 발생했을 때" (10px, #C0392B)
  우: 원형 전화 버튼 (38×38px, #C0392B) → href="tel:112"
  ※ 좌측 아이콘 없음. 번호 텍스트 없음.
```

---

## 11. 외부 API 연동

| 데이터 | 소스 | 비고 |
| :--- | :--- | :--- |
| 지역 이미지 | 한국관광공사 TourAPI | URL 직연동, base64 금지 |
| K콘텐츠 태그 작품명 | TourAPI `contentTypeId=91` → `title` 필드 | 없으면 태그 미노출 |
| 해시태그 | TourAPI contentTypeId 필터 | 명소 2–3 + 특산물 1 + 촬영지 1 |
| 스팟 주소 | TourAPI `addr1/addr2` | Survival Card에 그대로 사용 |
| 스팟 사진 | TourAPI `detailCommon2` | 더보기 팝업, 가로스크롤 3장 |
| 스팟 설명 | TourAPI `overview` | 더보기 팝업 내 3줄 |
| 스팟 운영시간·입장료·전화 | TourAPI `detailCommon2` | 더보기 팝업 |
| 축제 정보 | TourAPI `searchFestival2` | 홈화면 축제 섹션 |
| 축제 상세 | TourAPI `detailCommon2` | 축제 팝업 |
| 택시 요금/시간 | 카카오모빌리티 API | 지역 내 스팟 간만 |
| Kakao T 딥링크 | 카카오모빌리티 deeplink | 안심 카드 바텀시트 내 버튼 |
| 대중교통 길찾기 | 네이버 지도 딥링크 | `nmap://route/public?slat=...&dlat=...&appname=kspot` |
| 전화 연결 | `tel:1330` / `tel:112` | 외부 API 불필요 |

---

## 12. Fallback UI

| 위치 | 처리 |
| :--- | :--- |
| S1 지역 카드 이미지 | 그라디언트 배경 유지, 이모지 opacity:0.3 |
| S3 구경하기 팝업 슬라이더 | 이미지 없음: #E8E6DF bg + 🏛️ 이모지 중앙 |
| 로딩 중 스켈레톤 | `shimmer` 애니메이션, background: linear-gradient 90deg, 1.5s infinite |

---

## 13. 절대 하지 말 것

| 항목 | 이유 |
| :--- | :--- |
| `position:fixed` 오버레이 | phone 기준 `position:absolute` 사용 |
| 바텀시트를 phone-scroll 안에 넣기 | scroll 따라 움직임. 반드시 밖으로 분리 |
| CTA `position:fixed` | cta-wrap (flex-shrink:0) 사용 |
| nav innerHTML 동적 주입 | HTML 고정 + `updateNav()` 색상만 교체 |
| Confidence 배지 표시 | 제거됨. 판단 근거 카테고리로 대체 |
| 기능카드 섹션 (홈) | Phase 2에서 제거됨 |
| K콘텐츠 섹션 (홈) | 이번 단계 미구현 |
| 1박 이상 숙박 선택 UI | 당일치기 고정 |
| 2열 지역 카드 그리드 | 1열 full-width 확정 |
| 히어로 텍스트 한/일 병기 | 단일 언어 원칙 |
| 안심 카드에 전화번호 텍스트 표시 | 원형 버튼만 |
| Kakao T 버튼에 이모지 | 이모지 없이 "Kakao T" 텍스트만 |

---

## 14. Claude Code 프롬프트

모든 화면 작업 시 아래 공통 블록을 먼저 붙여넣고 화면별 요구사항 추가.

```
## KSPOT 디자인 시스템 — 공통 적용

서비스 목적: 일본인 여행자가 한국 소도시에서 택시를 안전하게 이용하도록 돕는 서비스.
핵심 감정 전환: 불안 → 안심.

플랫폼: 모바일 웹(PWA). 375px 기준. tap 인터랙션. hover 없음.

CSS 변수:
--bg-base:#FFFFFF; --bg-surface:#F3F4F6; --bg-elevated:#E8EAED;
--text-primary:#111827; --text-secondary:#374151; --text-muted:#9CA3AF;
--teal:#1D9E75; --teal-dark:#0F6E56; --teal-bg:#E8F5F0;
--border:#E8EAED; --border-mid:#D1D5DB;

화면 구조:
phone(position:relative, flex column)
├── hdr
├── phone-scroll(flex:1, overflow-y:auto) → body(콘텐츠)
├── overlay(position:absolute, inset:0) ← 바텀시트. phone-scroll 밖에 위치
└── nav(flex-shrink:0)

오버레이: position:absolute (phone 기준). position:fixed 절대 사용 금지.
바텀시트: 반드시 phone-scroll 밖. phone-scroll 안에 넣으면 스크롤 따라 움직임.

공통 규칙:
- CTA: flex-shrink:0. border-radius:14px. bg:--teal.
- 바텀시트: border-radius:20px 20px 0 0. phone-scroll 밖 position:absolute.
- 하단 nav: HTML 고정. updateNav()로 색상만 교체. Home/Explore/Storage 3탭.
- 다국어: window._currentLang 기본 'ja'. 안심 카드 기사 안내 문구만 번역.
- 히어로/지역명/주소/UI 레이블: 언어 무관 한국어 고정.
- 용어: Survival Card→안심 카드, Customize→코스 수정, 장소 추가→코스 추가, Tickets→Storage.

절대 하지 말 것:
- position:fixed (오버레이, CTA 모두)
- 바텀시트를 phone-scroll 안에 넣기
- nav innerHTML 동적 주입
- 숙박 선택 UI
- 2열 지역 카드
- Kakao T 버튼에 이모지
- Confidence 배지
---
위 시스템을 적용하여 아래 화면을 만들어주세요:
[여기에 화면별 요구사항 추가]
```

---

---

## 15. Phase 2 변경 사항 요약

### 용어 변경
| Phase 1 | Phase 2 |
| :--- | :--- |
| Survival Card | 안심 카드 |
| Customize | 코스 수정 |
| 장소 추가 | 코스 추가 |
| Tickets | Storage |
| S3 → Tickets | S3 → S4 → S5 → Storage |

### 판정 체계 변경
| Phase 1 (3단계) | Phase 2 (4단계) |
| :--- | :--- |
| GO | GO |
| — | GO WITH CARE (신규) |
| RECONSIDER | RECONSIDER |
| NOT NOW | NOT NOW |

- Confidence HIGH/MEDIUM/LOW 배지 **제거**
- 판단 근거 카테고리로 대체: 교통·이동 / 스팟 운영 / 전체 일정

### 여행 스타일 변경
| Phase 1 (4종) | Phase 2 (2종) |
| :--- | :--- |
| Chill / Wander / Explorer / Active | 🌿 여유롭게 / ⚡ 빡빡하게 |

### 바텀시트 구현 규칙 변경
- Phase 1: `position:absolute` (phone 기준)
- Phase 2: **phone-scroll 밖으로 분리** (스크롤 따라가지 않음)

```
.phone (position:relative)
  ├── .hdr
  ├── .phone-scroll (flex:1, overflow-y:auto)
  │     └── .body (콘텐츠)
  ├── .overlay (phone 기준 absolute, inset:0) ← 바텀시트 오버레이
  └── .nav
```

---

*Last Updated: 2026-06-26 | Phase 2 | 목업: KSPOT_mockup_v3.html | 명세서: KSPOT_Dev_Spec_v1.docx*
