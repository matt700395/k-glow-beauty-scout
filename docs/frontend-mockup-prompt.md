# K-Glow AI Search — 프론트엔드 목업 완결 싱글턴 프롬프트

────────────────────────────────────────────────────────

## 중요 선언

────────────────────────────────────────────────────────

이 프로젝트는 **UI/UX 테스트용 프론트엔드 목업**이다.

- 어떤 서버도 생성하지 않는다.
- 어떤 데이터베이스도 생성하지 않는다.
- 어떤 API route도 생성하지 않는다.
- 어떤 외부 요청도 하지 않는다.
- fetch/axios 같은 네트워크 코드를 만들지 않는다.
- 환경변수를 요구하지 않는다.
- 인증 시스템(Supabase Auth 등)을 자동 생성하지 않는다.
- 결제 SDK를 설치하지 않는다.

모든 데이터는 **로컬 JSON 더미 파일**에서만 가져온다.  
모든 인터랙션은 **로컬 상태 변화**로만 시뮬레이션한다.

────────────────────────────────────────────────────────

## 1) 프로젝트 메타

────────────────────────────────────────────────────────

- **프로젝트명**: K-Glow AI Search
- **목적**: K-뷰티 제품을 자연어로 검색하고 AI 맞춤 추천을 받는 서비스
- **서비스 유형**: AI 시맨틱 검색 + 큐레이션 커머스
- **MVP 범위**: 자연어 검색 → 제품 탐색 → 저장 → 프리미엄 리포트 구매
- **이 문서는 프론트엔드 목업 완결 전용**

────────────────────────────────────────────────────────

## 2) PRD 요약 (UI 기준)

────────────────────────────────────────────────────────

### What
한국 화장품(K-뷰티)에 특화된 AI 시맨틱 검색 서비스.
사용자가 원하는 무드·피부 고민·제형을 자연어로 입력하면 맞춤 제품을 추천한다.

### Value
- 성분 분석 기반 신뢰도 높은 추천
- 자연어 입력으로 복잡한 필터 없이 원하는 제품 발견
- AM/PM 루틴 리포트로 제품 조합 가이드 제공

### JTBD
"나에게 맞는 K-뷰티 제품을 빠르고 정확하게 찾고 싶다"

### Primary Personas
1. **뷰티 입문자(20대)**: 성분 지식 부족, 자연어로 원하는 느낌을 설명하고 싶음
2. **성분 민감 사용자(30대)**: 특정 성분 제외, 무향 선호 등 조건이 까다로움
3. **K-뷰티 해외 팬**: 한국 화장품에 관심 있지만 정보 접근이 어려움

### Non-Goals
- 직접 구매/결제 기능 (리포트 결제만 더미로 시뮬레이션)
- 소셜 기능 (리뷰, 댓글)
- 다국어 지원

### MVP Metrics
- 검색 → 제품 클릭 전환율
- 제품 저장 수
- 리포트 구매 전환율

────────────────────────────────────────────────────────

## 3) 기술 스택

────────────────────────────────────────────────────────

```
프레임워크:  React 18 + TypeScript + Vite
스타일링:    Tailwind CSS + CSS 변수 디자인 토큰
UI 라이브러리: shadcn/ui (Radix 기반)
애니메이션:  framer-motion
라우팅:      react-router-dom v6
상태관리:    React useState/useEffect (전역: React Context)
아이콘:      lucide-react
폰트:        Noto Sans KR (Google Fonts)
```

────────────────────────────────────────────────────────

## 4) 라우터 확정 (IA 고정)

────────────────────────────────────────────────────────

| # | Path | 접근 | 설명 |
|---|------|------|------|
| 1 | `/` | public | 홈 — 검색 랜딩 |
| 2 | `/search?q={query}` | public | 검색 결과 |
| 3 | `/p/:productId` | public | 제품 상세 |
| 4 | `/saved` | auth | 저장한 제품 목록 |
| 5 | `/account` | auth | 계정 — 내 조건 + 검색 로그 |
| 6 | `/report/:reportId` | auth | 프리미엄 루틴 리포트 |
| 7 | `/auth` | public | 로그인/회원가입 |

※ 어드민 라우터(`/admin/*`)는 이 문서 범위에 포함하지 않는다.

────────────────────────────────────────────────────────

## 5) 디자인 시스템

────────────────────────────────────────────────────────

### 5-1) 컬러 토큰 (HSL)

```css
:root {
  /* 라이트 모드 */
  --background: 30 30% 98%;
  --foreground: 240 10% 12%;
  --card: 30 20% 96%;
  --card-foreground: 240 10% 12%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 12%;
  --primary: 350 72% 55%;          /* 로즈 핑크 */
  --primary-foreground: 0 0% 100%;
  --secondary: 30 15% 92%;
  --secondary-foreground: 240 10% 20%;
  --muted: 30 10% 94%;
  --muted-foreground: 240 5% 46%;
  --accent: 20 85% 58%;            /* 코랄 */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 30 15% 90%;
  --input: 30 15% 88%;
  --ring: 350 72% 55%;
  --radius: 0.75rem;

  /* 커스텀 토큰 */
  --glow: 350 80% 70%;
  --glow-subtle: 350 60% 95%;
  --coral: 20 85% 58%;
  --coral-light: 20 80% 94%;
  --rose-mist: 340 40% 96%;
}

.dark {
  --background: 240 15% 8%;
  --foreground: 30 20% 92%;
  --card: 240 12% 12%;
  --card-foreground: 30 20% 92%;
  --popover: 240 12% 14%;
  --popover-foreground: 30 20% 92%;
  --primary: 350 65% 62%;
  --primary-foreground: 0 0% 100%;
  --secondary: 240 10% 18%;
  --secondary-foreground: 30 15% 85%;
  --muted: 240 10% 16%;
  --muted-foreground: 30 8% 55%;
  --accent: 20 75% 55%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 62% 30%;
  --destructive-foreground: 0 0% 100%;
  --border: 240 10% 18%;
  --input: 240 10% 20%;
  --ring: 350 65% 62%;
  --glow: 350 70% 55%;
  --glow-subtle: 350 40% 15%;
  --coral: 20 75% 55%;
  --coral-light: 20 60% 18%;
  --rose-mist: 340 30% 14%;
}
```

### 5-2) 유틸리티 클래스

```css
.glow-shadow     { box-shadow: 0 4px 30px -8px hsl(var(--primary) / 0.25); }
.glow-shadow-lg  { box-shadow: 0 8px 40px -10px hsl(var(--primary) / 0.35); }
.gradient-glow   { background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--coral))); }
.gradient-glow-subtle { background: linear-gradient(135deg, hsl(var(--glow-subtle)), hsl(var(--coral-light))); }
.gradient-text   { background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--coral)));
                   -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.glass           { backdrop-filter: blur(12px); background: hsl(var(--background) / 0.8); }
```

### 5-3) 폰트

```css
font-family: 'Noto Sans KR', system-ui, sans-serif;
```

Google Fonts import:
```
https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap
```

### 5-4) Button Variants (cva)

| variant | 설명 | 스타일 |
|---------|------|--------|
| `default` | 기본 | `bg-primary text-primary-foreground` |
| `destructive` | 삭제 | `bg-destructive text-destructive-foreground` |
| `outline` | 외곽선 | `border border-input bg-background` |
| `secondary` | 보조 | `bg-secondary text-secondary-foreground` |
| `ghost` | 투명 | `hover:bg-accent` |
| `link` | 링크 | `text-primary underline` |
| `glow` | 글로우 CTA | `gradient-glow text-primary-foreground glow-shadow` |
| `soft` | 소프트 | `bg-rose-mist text-primary` |
| `chip` | 칩/태그 | `bg-card border border-border text-xs rounded-full` |

Size: `default(h-10)`, `sm(h-9)`, `lg(h-11)`, `icon(h-10 w-10)`

### 5-5) 애니메이션 (tailwind keyframes)

```
float:   translateY(0) → translateY(-6px) → translateY(0), 3s infinite
shimmer: backgroundPosition -200% → 200%, 2s infinite
accordion-down/up: height transition 0.2s
```

────────────────────────────────────────────────────────

## 6) 공통 UI 규칙

────────────────────────────────────────────────────────

### Header

```
┌─────────────────────────────────────────────────┐
│ [K-Glow(gradient)]   [검색바(md이상)]   🌙 ❤저장 👤계정 │
└─────────────────────────────────────────────────┘
```

- `sticky top-0 z-50`, `glass` 배경 (블러 12px)
- 로고: `gradient-text` "K-Glow", 클릭 → `/`
- 검색바(md 이상): 홈이 아닌 페이지에서만 표시, 클릭 → `/`로 이동
- 우측 액션:
  - 다크모드 토글 (Moon/Sun 아이콘)
  - 로그인 시: 저장(Heart) / 계정(User) / 로그아웃(LogOut)
  - 비로그인 시: "로그인" 버튼 (variant=`soft`)

### Footer

```
┌─────────────────────────────────────────────────┐
│         서비스 소개 | 개인정보 처리방침 | 문의         │
└─────────────────────────────────────────────────┘
```

- `border-t border-border py-6 mt-auto`
- 텍스트만 표시 (링크 비활성)

### 공통 카드 (ProductCard)

```
┌────────────────────────────────────────┐
│ [☐] [이미지 80x80] 제품명        [카테고리] │
│                    브랜드                │
│                    추천 이유 (2줄 제한)     │
│                    ⚠ 주의 성분             │
│                    [상세보기] [♡]          │
└────────────────────────────────────────┘
```

- `rounded-xl bg-card border border-border hover:glow-shadow`
- 체크박스: `showCheckbox` prop일 때만 표시 (비교 모드용)
- 카테고리 배지: `bg-glow-subtle text-primary rounded-full`
- 저장 버튼: Heart 아이콘, 저장 시 `fill-current`
- framer-motion: `initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}`

### Loading UI (LoadingSteps)

```
┌─────────────────────────────────────┐
│          [=========>    ]            │
│    "맞춤 제품을 검색 중이에요..."       │
│  ┌──────────────────────────────┐   │
│  │ [▓▓] [████████████]          │   │ × 3 skeleton cards
│  │      [████]                  │   │
│  │      [████████]              │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

- 프로그레스 바: `gradient-glow`, 3단계 진행 (400ms 간격)
- 단계 텍스트: AnimatePresence fade transition
- 하단 스켈레톤: 3개 카드, `animate-pulse`

### Empty UI

- 중앙 정렬, 일러스트 이미지(32x32 contain), 메시지, 액션 버튼

### Error UI

- 중앙 정렬, `text-destructive` 메시지
- "다시 시도" (outline) + "홈으로" (ghost) 버튼

────────────────────────────────────────────────────────

## 7) 라우터별 JSON 더미 규격

────────────────────────────────────────────────────────

### 7-0) 파일 구조 및 데이터 로더

**파일 위치**: `/src/data/routes/{routeKey}.json`

```
src/
  data/
    routes/
      home.json            ← "/" 전용
      search.json          ← "/search" 전용
      product-detail.json  ← "/p/:productId" 전용
      saved.json           ← "/saved" 전용
      account.json         ← "/account" 전용
      report.json          ← "/report/:reportId" 전용
      auth.json            ← "/auth" 전용
```

**규칙**:
- 라우터 1개 = JSON 1개. 다른 JSON을 참조하지 않는다.
- 중복 데이터 허용. 정규화하지 않는다.
- `__mock.mode`로 상태 전이를 시뮬레이션할 수 있다 (`"success"` | `"empty"` | `"error"`).

**데이터 로더 패턴** (각 페이지 컴포넌트 상단):

```typescript
// 예: SearchPage.tsx
import searchData from "@/data/routes/search.json";

export default function SearchPage() {
  // JSON에서 직접 구조분해
  const { intent_summary, search_meta, results } = searchData;
  // loading 시뮬레이션이 필요하면 setTimeout + useState 사용
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  // ...
}
```

**저장/토글 등 쓰기 동작**: JSON은 읽기 전용. 모든 쓰기는 `useState`/`localStorage`로 시뮬레이션한다.

```typescript
// 저장 시뮬레이션 예시
const [savedIds, setSavedIds] = useState<string[]>(() => {
  return JSON.parse(localStorage.getItem("saved_ids") || "[]");
});
const toggleSave = (id: string) => {
  const next = savedIds.includes(id)
    ? savedIds.filter(x => x !== id)
    : [...savedIds, id];
  setSavedIds(next);
  localStorage.setItem("saved_ids", JSON.stringify(next));
};
```

────────────────────────────────────────────────────────

### 7-1) home.json

```json
{
  "__mock": { "mode": "success" },
  "page": { "title": "K-Glow AI Search" },
  "settings": {
    "example_chips": [
      "촉촉한 톤업 크림",
      "민감피부 진정 세럼",
      "글로우 쿠션 추천"
    ],
    "example_sentences": [
      "요즘 피부가 건조하고 당기는데 수분감 있는 세럼 추천해줘",
      "쿨톤에 맞는 데일리 립 제품 찾고 있어"
    ],
    "trend_tags": ["시카", "비타민C", "글루타치온", "병풀"]
  },
  "recent_searches": [
    { "query": "수분크림 추천", "created_at": "2025-06-20T10:00:00Z" },
    { "query": "톤업 선크림", "created_at": "2025-06-19T14:30:00Z" }
  ]
}
```

### 7-2) search.json

```json
{
  "__mock": { "mode": "success" },
  "intent_summary": "검색어 \"촉촉한 세럼\"에 대한 맞춤 추천 결과입니다. 수분 보충, 보습 기능 중심으로 분석했습니다.",
  "search_meta": {
    "model": "gte-small",
    "embedding_dim": 384,
    "match_threshold": 0.2,
    "candidates_found": 15,
    "results_after_filter": 8,
    "top_similarity": 0.847,
    "avg_similarity": 0.623,
    "top_brands": ["라운드랩", "이니스프리", "토리든"],
    "top_tags": ["수분", "히알루론산", "세럼", "보습"],
    "category_distribution": { "skincare": 6, "base": 1, "suncare": 1 }
  },
  "results": [
    {
      "id": "prod_001",
      "name": "독도 토너",
      "brand": "라운드랩",
      "category": "skincare",
      "price_band": "1-3만",
      "finish": "수분광",
      "tone_fit": "any",
      "tags": ["수분", "저자극", "토너"],
      "ingredients_top": ["히알루론산", "판테놀"],
      "ingredients_caution": [],
      "texture_desc": "묽은 워터 타입, 빠르게 흡수",
      "explain_short": "건조하고 당기는 피부에 즉각적인 수분 보충. 저자극 포뮬러.",
      "image_url": "/placeholder.svg",
      "similar_ids": ["prod_002", "prod_003"]
    },
    {
      "id": "prod_002",
      "name": "다이브인 세럼",
      "brand": "토리든",
      "category": "skincare",
      "price_band": "1-3만",
      "finish": "촉촉",
      "tone_fit": "any",
      "tags": ["히알루론산", "수분폭탄", "세럼"],
      "ingredients_top": ["5중 히알루론산", "판테놀"],
      "ingredients_caution": [],
      "texture_desc": "젤 타입, 겹겹이 수분 레이어링 가능",
      "explain_short": "5가지 분자 크기의 히알루론산으로 깊은 수분 공급.",
      "image_url": "/placeholder.svg",
      "similar_ids": ["prod_001"]
    },
    {
      "id": "prod_003",
      "name": "그린티 씨드 세럼",
      "brand": "이니스프리",
      "category": "skincare",
      "price_band": "1-3만",
      "finish": "촉촉",
      "tone_fit": "any",
      "tags": ["녹차", "항산화", "세럼"],
      "ingredients_top": ["녹차 씨 오일", "히알루론산"],
      "ingredients_caution": ["향료"],
      "texture_desc": "가벼운 에센스 제형",
      "explain_short": "항산화+수분 동시 케어. 단, 향료 포함.",
      "image_url": "/placeholder.svg",
      "similar_ids": ["prod_001", "prod_002"]
    }
  ]
}
```

### 7-3) product-detail.json

```json
{
  "__mock": { "mode": "success" },
  "product": {
    "id": "prod_001",
    "name": "독도 토너",
    "brand": "라운드랩",
    "category": "skincare",
    "price_band": "1-3만",
    "finish": "수분광",
    "tone_fit": "any",
    "tags": ["수분", "저자극", "토너", "민감피부"],
    "ingredients_top": ["히알루론산", "판테놀", "마데카소사이드"],
    "ingredients_caution": [],
    "texture_desc": "묽은 워터 타입으로 빠르게 흡수되며, 끈적임 없이 산뜻하게 마무리됩니다.",
    "explain_short": "건조하고 당기는 피부에 즉각적인 수분 보충. 저자극 포뮬러로 민감한 피부에도 적합합니다.",
    "image_url": "/placeholder.svg",
    "similar_ids": ["prod_002", "prod_003"]
  },
  "similar_products": [
    {
      "id": "prod_002",
      "name": "다이브인 세럼",
      "brand": "토리든",
      "image_url": "/placeholder.svg"
    },
    {
      "id": "prod_003",
      "name": "그린티 씨드 세럼",
      "brand": "이니스프리",
      "image_url": "/placeholder.svg"
    }
  ]
}
```

### 7-4) saved.json

```json
{
  "__mock": { "mode": "success" },
  "products": [
    {
      "id": "prod_001",
      "name": "독도 토너",
      "brand": "라운드랩",
      "category": "skincare",
      "price_band": "1-3만",
      "finish": "수분광",
      "tone_fit": "any",
      "tags": ["수분", "저자극"],
      "ingredients_top": ["히알루론산", "판테놀"],
      "ingredients_caution": [],
      "texture_desc": "묽은 워터 타입",
      "explain_short": "건조한 피부에 즉각 수분 보충",
      "image_url": "/placeholder.svg",
      "similar_ids": []
    },
    {
      "id": "prod_002",
      "name": "다이브인 세럼",
      "brand": "토리든",
      "category": "skincare",
      "price_band": "1-3만",
      "finish": "촉촉",
      "tone_fit": "any",
      "tags": ["히알루론산", "세럼"],
      "ingredients_top": ["5중 히알루론산"],
      "ingredients_caution": [],
      "texture_desc": "젤 타입",
      "explain_short": "깊은 수분 공급",
      "image_url": "/placeholder.svg",
      "similar_ids": []
    }
  ]
}
```

### 7-5) account.json

```json
{
  "__mock": { "mode": "success" },
  "preferences": {
    "skin_type": "건성",
    "tone": "쿨",
    "concerns": ["홍조", "속건조"],
    "fragrance_free": true,
    "exclude_ingredients": ["에탄올"],
    "budget_band": "1-3만"
  },
  "search_logs": [
    { "query": "촉촉한 세럼", "created_at": "2025-06-20T10:00:00Z", "result_count": 8 },
    { "query": "쿨톤 립틴트", "created_at": "2025-06-19T14:30:00Z", "result_count": 5 },
    { "query": "민감피부 선크림", "created_at": "2025-06-18T09:00:00Z", "result_count": 12 }
  ]
}
```

### 7-6) report.json

```json
{
  "__mock": { "mode": "success" },
  "report": {
    "reportId": "rpt_001",
    "title": "맞춤 루틴 리포트",
    "created_at": "2025-06-20T12:00:00Z",
    "summary": "건성·민감 피부 타입에 맞춘 수분 집중 루틴입니다. 히알루론산 기반 제품 위주로 구성했습니다.",
    "routine_am": [
      "1. 독도 토너로 피부결 정돈",
      "2. 다이브인 세럼으로 수분 레이어링",
      "3. 수분크림으로 밀봉",
      "4. 선크림 마무리"
    ],
    "routine_pm": [
      "1. 오일 클렌징",
      "2. 폼 클렌징",
      "3. 독도 토너 도포",
      "4. 다이브인 세럼 도포",
      "5. 수딩 크림으로 마무리"
    ],
    "reasoning": [
      "히알루론산 기반 제품끼리 조합하여 시너지 효과를 극대화합니다.",
      "토너→세럼→크림 순서로 분자 크기별 흡수율을 고려했습니다.",
      "모든 제품이 무향이므로 민감 피부에 적합합니다."
    ],
    "warnings": [
      "비타민C 세럼을 추가할 경우, 나이아신아마이드와의 pH 차이에 주의하세요."
    ],
    "alternatives": ["prod_003"]
  },
  "alt_products": [
    {
      "id": "prod_003",
      "name": "그린티 씨드 세럼",
      "brand": "이니스프리",
      "image_url": "/placeholder.svg"
    }
  ]
}
```

### 7-7) auth.json

```json
{
  "__mock": { "mode": "success" },
  "intent_messages": {
    "save": "제품을 저장하려면 로그인이 필요합니다",
    "buy_report": "프리미엄 리포트를 구매하려면 로그인이 필요합니다"
  },
  "value_props": [
    "저장 기능으로 마음에 드는 제품 관리",
    "내 조건 저장으로 추천 정확도 향상",
    "AI 루틴 리포트 구매 및 조회"
  ]
}
```

────────────────────────────────────────────────────────

## 8) 라우터별 상세 명세

────────────────────────────────────────────────────────

---

### Route: `/` (홈)

**목적**: 서비스 진입점. 자연어 검색 유도.

**진입 조건**: 없음 (public)

**레이아웃 (위→아래)**:
1. Header (검색바 숨김)
2. Hero 배경 이미지 (opacity 0.08)
3. 타이틀 + 서브타이틀
4. SearchBar (large 모드)
5. 예제 칩 버튼 목록
6. 예제 문장 목록 (카드형)
7. 최근 검색 (로그인 시만)
8. 인기 태그
9. Footer

**데이터 소스**: `src/data/routes/home.json` (직접 import)

```typescript
import homeData from "@/data/routes/home.json";
const { settings, recent_searches } = homeData;
```

- 예제 칩: `settings.example_chips[]`
- 예제 문장: `settings.example_sentences[]`
- 인기 태그: `settings.trend_tags[]`
- 최근 검색: `recent_searches[]` (로그인 시만, localStorage 기반 필터링)

**버튼 & 이벤트**:
| 요소 | 이벤트명 | 클릭 시 UI 변화 |
|------|---------|----------------|
| SearchBar "추천 받기" | `SEARCH_SUBMIT` | 2자 미만이면 에러 표시, 2자 이상이면 `/search?q={query}`로 이동 |
| 예제 칩 | `CLICK_EXAMPLE_CHIP` | 해당 칩 텍스트로 `/search?q={chip}`으로 이동 |
| 예제 문장 | `CLICK_EXAMPLE_CHIP` | 해당 문장 텍스트로 `/search?q={sentence}`로 이동 |
| 최근 검색 "다시 보기" | — | `/search?q={query}`로 이동 |
| 다크모드 토글 | — | `document.documentElement.classList.toggle("dark")` |

**상태 머신**:
- `initial` → 설정(칩/문장/태그) 로드 → `success` (항상 즉시)
- `empty`: 설정이 비어있을 경우 칩/문장/태그 섹션 숨김
- `error`: 없음 (로컬 JSON이므로)

**ASCII Layout**:
```
┌─────────────────────────────────────────────────────┐
│ HEADER: [K-Glow]                      🌙 [로그인]    │
├─────────────────────────────────────────────────────┤
│                                                     │
│              ✦ K-Glow AI Search                     │
│        원하는 무드·피부 상태를 자연어로 입력하세요          │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ 🔍 원하는 무드, 피부 고민, 제형을 자유롭게...   │    │
│  │                                    (2줄)     │    │
│  └─────────────────────────────────────────────┘    │
│                              [✨ 추천 받기]          │
│                                                     │
│  [촉촉한 톤업 크림] [민감피부 진정 세럼] [글로우 쿠션]   │
│                                                     │
│  💬 이렇게도 검색해 보세요                             │
│  ┌─────────────────────────────────────────────┐    │
│  │ "요즘 피부가 건조하고 당기는데..."         →    │    │
│  ├─────────────────────────────────────────────┤    │
│  │ "쿨톤에 맞는 데일리 립 제품..."            →    │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  최근 검색 (로그인 시)                                │
│  "수분크림 추천"                    [다시 보기]        │
│  "톤업 선크림"                     [다시 보기]        │
│                                                     │
│  인기: 시카  비타민C  글루타치온  병풀                   │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER: 서비스 소개 | 개인정보 처리방침 | 문의          │
└─────────────────────────────────────────────────────┘
```

---

### Route: `/search?q={query}` (검색 결과)

**목적**: 자연어 검색 결과 표시 + AI 분석 인사이트

**진입 조건**: `q` 파라미터 필수. 없으면 `/`로 리다이렉트.

**레이아웃 (위→아래)**:
1. Header (검색바 표시)
2. SearchBar (재검색용, 기존 쿼리 프리필)
3. SearchInsight 패널 (접이식)
4. FilterBar
5. 결과 목록 (ProductCard × N)
6. "더 보기" 버튼
7. 하단 CTA 영역
8. Footer
9. PaymentModal (오버레이)

**데이터 소스**: `src/data/routes/search.json` (직접 import)

```typescript
import searchData from "@/data/routes/search.json";
const { intent_summary, search_meta, results } = searchData;
```

- AI 요약: `intent_summary`
- 검색 메타: `search_meta` (모델명, 임베딩 차원, 유사도 분포, 카테고리 분포, 상위 태그/브랜드)
- 제품 목록: `results[]` (FilterBar 필터링은 로컬 state로 처리)

**FilterBar 옵션**:
| 필터 | 타입 | 옵션 |
|------|------|------|
| 카테고리 | select | 전체/스킨케어/베이스/립/아이/선케어 |
| 가격대 | select | 전체/1-3만/3-5만/5만+ |
| 무향 | toggle chip | on/off |
| 민감 | toggle chip | on/off |
| 제외 성분 | toggle chip × 3 | 향료 제외/에탄올 제외/실리콘 제외 |
| 필터 초기화 | ghost button | 모든 필터 리셋 |

**SearchInsight 패널 (접이식)**:
```
┌─────────────────────────────────────────────────────┐
│ 🧠 AI 벡터 검색 분석                          ▲/▼   │
├─────────────────────────────────────────────────────┤
│ "검색어에 대한 맞춤 추천 결과입니다..."                 │
│                                                     │
│ 모델: gte-small (384d)  임계값: 0.2                  │
│ 후보: 15개 → 필터 후: 8개                             │
│                                                     │
│ 유사도 분포 [███████████████████░░░░░]               │
│ Top: 0.847                    Avg: 0.623            │
│                                                     │
│ 카테고리 분포          │  상위 태그                    │
│ 스킨케어 [██████] 6   │  #수분 #히알루론산 #세럼       │
│ 베이스   [█]      1   │  #보습                       │
│ 선케어   [█]      1   │                              │
│                                                     │
│ 상위 브랜드: 라운드랩, 이니스프리, 토리든               │
└─────────────────────────────────────────────────────┘
```

**버튼 & 이벤트**:
| 요소 | 이벤트명 | 클릭 시 UI 변화 |
|------|---------|----------------|
| SearchBar "추천 받기" | `SEARCH_SUBMIT` | URL 파라미터 `q` 업데이트 → 재검색 |
| 필터 변경 | `FILTER_APPLY` | 필터 적용 → 재검색 |
| ProductCard 클릭 | `PRODUCT_OPEN` | `/p/{productId}`로 이동 |
| ProductCard 저장 ♡ | `SAVE_TOGGLE` | 비로그인: `/auth?next=...` 이동, 로그인: 토글 |
| "더 보기" | — | `visibleCount += 10`, 스크롤 없이 목록 확장 |
| "내 조건 저장" CTA | — | 비로그인: `/auth`, 로그인: `/account` |
| "프리미엄 루틴 리포트" CTA | — | 비로그인: `/auth`, 로그인: PaymentModal 열기 |
| PaymentModal "결제 완료" | `PAYMENT_START` | 더미 리포트 생성 → `/report/{reportId}` 이동 |

**상태 머신**:
```
initial ──(q 파라미터 존재)──→ loading
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
                 success      empty        error
               (결과 있음)  (결과 0건)   (검색 실패)
```

- `loading`: LoadingSteps 컴포넌트 (3단계 프로그레스 + 스켈레톤)
- `success`: 결과 카운트 + ProductCard 목록 + 하단 CTA
- `empty`: 일러스트 + "결과가 없습니다 😢" + 필터 초기화/새 검색 버튼
- `error`: "검색 중 오류가 발생했습니다." + 다시 시도/홈으로 버튼

**ASCII Layout (success 상태)**:
```
┌─────────────────────────────────────────────────────┐
│ HEADER: [K-Glow]  [🔍검색어를 입력하세요]  🌙 ❤ 👤   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ 🔍 촉촉한 세럼                [✨ 추천 받기] │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─ SearchInsight ──────────────────────────────┐   │
│  │ 🧠 AI 벡터 검색 분석                     ▲    │   │
│  │ (접이식 상세 내용)                             │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  [전체▾] [전체▾] [무향] [민감] [향료제외] [필터초기화]  │
│                                                     │
│  8개 결과                                           │
│  ┌──────────────────────────────────────────────┐   │
│  │ [IMG] 독도 토너                   [스킨케어]  │   │
│  │       라운드랩                                │   │
│  │       건조한 피부에 즉각 수분 보충...           │   │
│  │       [상세보기] [♡]                          │   │
│  ├──────────────────────────────────────────────┤   │
│  │ [IMG] 다이브인 세럼               [스킨케어]   │   │
│  │       토리든                                  │   │
│  │       5중 히알루론산으로 깊은 수분...           │   │
│  │       [상세보기] [♡]                          │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│                  [더 보기]                           │
│                                                     │
│  ┌──────────────────┬───────────────────────────┐   │
│  │ 👤 내 조건 저장    │ ✨ 프리미엄 루틴 리포트    │   │
│  │    더 정확해짐     │    만들기                  │   │
│  └──────────────────┴───────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

### Route: `/p/:productId` (제품 상세)

**목적**: 단일 제품의 상세 정보 + 유사 제품 + 리포트 CTA

**진입 조건**: `:productId` URL 파라미터

**레이아웃 (위→아래)**:
1. Header
2. ← 뒤로 버튼
3. 제품 이미지 + 기본 정보 (2컬럼, md 이상)
4. 추천 근거 섹션
5. 성분 요약 섹션 (접이식 전체 성분)
6. 사용감/제형 섹션
7. 유사 제품 그리드 (2~4컬럼)
8. 리포트 CTA 배너 (gradient-glow 배경)
9. Footer
10. PaymentModal (오버레이)

**데이터 소스**: `src/data/routes/product-detail.json` (직접 import)

```typescript
import detailData from "@/data/routes/product-detail.json";
const { product, similar_products } = detailData;
// productId 파라미터와 매칭 — 목업에서는 단일 제품만 표시
```

- 제품: `product.*`
- 유사 제품: `similar_products[]`

**기본 정보 영역**:
```
┌──────────┬───────────────────────────────────────┐
│          │ 제품명                                 │
│  [이미지  │ 브랜드                                │
│  320x320] │ [스킨케어] [수분광] [any] [1-3만]      │
│          │ [♡ 저장] [🔗 공유]                     │
│          │                                       │
└──────────┴───────────────────────────────────────┘
```

**버튼 & 이벤트**:
| 요소 | 이벤트명 | 클릭 시 UI 변화 |
|------|---------|----------------|
| ← 뒤로 | — | `navigate(-1)` |
| ♡ 저장 | `SAVE_TOGGLE` | 비로그인: `/auth?next=...&intent=save`, 로그인: 토글 |
| 🔗 공유 | — | `navigator.clipboard.writeText(URL)` + toast "링크가 복사되었습니다" |
| 전체 성분 보기 | — | 토글: 전체 성분 목록 표시/숨김 (ChevronDown 회전 애니메이션) |
| 유사 제품 카드 클릭 | — | `/p/{id}`로 이동 |
| 리포트 만들기 CTA | — | 비로그인: `/auth`, 로그인: PaymentModal 열기 |

**상태 머신**:
```
initial ──→ loading ──→ success | not_found
```

- `loading`: 스켈레톤 (h-64 bg-muted rounded-xl + h-6 w-1/3 + h-4 w-1/4)
- `success`: 전체 레이아웃 표시
- `not_found`: "제품을 찾을 수 없습니다." + "홈으로" 버튼

**ASCII Layout**:
```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
├─────────────────────────────────────────────────────┤
│ ← 뒤로                                             │
│                                                     │
│ ┌───────────┬──────────────────────────────────┐    │
│ │           │ 독도 토너                         │    │
│ │  [IMAGE]  │ 라운드랩                          │    │
│ │  320×320  │ [스킨케어] [수분광] [any] [1-3만]  │    │
│ │           │ [♡ 저장] [🔗 공유]                │    │
│ └───────────┴──────────────────────────────────┘    │
│                                                     │
│ ── 추천 근거 ──────────────────────────────────────  │
│ ┌─ gradient-glow-subtle ───────────────────────┐    │
│ │ 건조한 피부에 즉각적인 수분 보충...              │    │
│ │ • 수분                                       │    │
│ │ • 저자극                                     │    │
│ │ • 토너                                       │    │
│ │ • 민감피부                                    │    │
│ └──────────────────────────────────────────────┘    │
│                                                     │
│ ── 성분 요약 ──────────────────────────────────────  │
│ 핵심 성분: 히알루론산, 판테놀, 마데카소사이드          │
│ [전체 성분 보기 ▼]                                  │
│                                                     │
│ ── 사용감 / 제형 ─────────────────────────────────  │
│ [수분] [저자극] [토너] [민감피부]                     │
│ 묽은 워터 타입으로 빠르게 흡수되며...                  │
│                                                     │
│ ── 유사 제품 ──────────────────────────────────────  │
│ ┌────────┐ ┌────────┐ ┌────────┐                   │
│ │ [IMG]  │ │ [IMG]  │ │ [IMG]  │                   │
│ │ 다이브  │ │ 그린티  │ │ ...    │                   │
│ │ 토리든  │ │이니스프리│ │        │                   │
│ └────────┘ └────────┘ └────────┘                   │
│                                                     │
│ ┌─ gradient-glow ──────────────────────────────┐    │
│ │         ✨                                    │    │
│ │  이 제품 포함 루틴 리포트 만들기                 │    │
│ │  AI가 AM/PM 루틴, 주의 조합을 분석합니다        │    │
│ │       [리포트 만들기 — ₩4,900]                 │    │
│ └──────────────────────────────────────────────┘    │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

### Route: `/saved` (저장한 제품)

**목적**: 사용자가 저장한 제품 목록 관리 + 비교 기능

**진입 조건**: 로그인 필수 (ProtectedRoute). 비로그인 시 `/auth?next=/saved`로 리다이렉트.

**레이아웃 (위→아래)**:
1. Header
2. 타이틀 "저장한 제품" + 비교 모드 토글 버튼
3. (비교 모드 시) 선택 상태 바 ("N/3 선택됨" + "비교 보기" 버튼)
4. ProductCard 목록 (비교 모드에서는 체크박스 포함)
5. Footer
6. CompareModal (오버레이)

**데이터 소스**: `src/data/routes/saved.json` (직접 import)

```typescript
import savedData from "@/data/routes/saved.json";
const [products, setProducts] = useState(savedData.products);
// 저장 해제 시 로컬 state에서 제거 (JSON 원본 불변)
```

- 저장 제품: `products[]`

**비교 기능 상세**:
- 비교 모드 토글: `compareMode` state
- 비교 모드 시 각 ProductCard에 체크박스 표시
- 최대 3개 선택 가능 (`selected.length < 3`)
- 2개 이상 선택 시 "비교 보기" 버튼 활성화
- CompareModal: 선택된 제품을 테이블로 비교

**CompareModal 테이블 구조**:
```
┌──────────┬───────────┬───────────┬───────────┐
│ 항목      │ 제품A     │ 제품B     │ 제품C     │
├──────────┼───────────┼───────────┼───────────┤
│ 브랜드    │ ...       │ ...       │ ...       │
│ 카테고리  │ ...       │ ...       │ ...       │
│ 가격대    │ ...       │ ...       │ ...       │
│ 마무리감  │ ...       │ ...       │ ...       │
│ 톤       │ ...       │ ...       │ ...       │
│ 핵심 성분 │ ...       │ ...       │ ...       │
│ 주의 성분 │ ...       │ ...       │ ...       │
│ 추천 이유 │ ...       │ ...       │ ...       │
└──────────┴───────────┴───────────┴───────────┘
```

**버튼 & 이벤트**:
| 요소 | 이벤트명 | 클릭 시 UI 변화 |
|------|---------|----------------|
| "비교 모드" 토글 | — | 비교 모드 on/off, 선택 초기화 |
| 체크박스 | — | 선택/해제 (최대 3개) |
| "비교 보기" | — | CompareModal 열기 |
| ProductCard 저장 해제 | `SAVE_TOGGLE` | 목록에서 제거 + 재로드 |
| ProductCard 클릭 | `PRODUCT_OPEN` | `/p/{id}`로 이동 |

**상태 머신**:
```
initial ──→ loading ──→ success | empty
```

- `loading`: 3개 스켈레톤 카드 (h-24 bg-muted rounded-xl animate-pulse)
- `success`: ProductCard 목록
- `empty`: 일러스트 + "저장한 제품이 없습니다" + "검색하러 가기" 버튼

**ASCII Layout**:
```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  저장한 제품                        [🔀 비교 모드]   │
│                                                     │
│  ┌─ 비교 모드 상태바 (선택 시) ─────────────────┐    │
│  │ 2/3 선택됨                    [비교 보기]     │    │
│  └──────────────────────────────────────────────┘    │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │ [☐] [IMG] 독도 토너             [스킨케어]    │   │
│  │           라운드랩                            │   │
│  │           건조한 피부에 즉각...                │   │
│  │           [상세보기] [♡]                      │   │
│  ├──────────────────────────────────────────────┤   │
│  │ [☑] [IMG] 다이브인 세럼          [스킨케어]    │   │
│  │           토리든                              │   │
│  │           깊은 수분 공급...                   │   │
│  │           [상세보기] [♡]                      │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

### Route: `/account` (계정)

**목적**: 사용자 피부 조건 설정 + 검색 이력 조회

**진입 조건**: 로그인 필수 (ProtectedRoute)

**레이아웃 (위→아래)**:
1. Header
2. 타이틀 "계정"
3. 탭 바 (내 조건 | 검색 로그) — 커스텀 탭 (bg-muted 배경)
4. [내 조건 탭] 설정 폼 / [검색 로그 탭] 이력 목록
5. Footer

**[내 조건 탭] 설정 항목**:
| 항목 | 타입 | 옵션 |
|------|------|------|
| 피부 타입 | chip 선택 (단일) | 건성/지성/복합/민감 |
| 톤 | chip 선택 (단일) | 웜/쿨/뉴트럴/모름 |
| 고민 | chip 선택 (다중) | 홍조/트러블/속건조/모공/각질/잡티/주름/다크서클 |
| 무향 선호 | 토글 스위치 | on/off |
| 제외 성분 | chip 선택 (다중) | 향료/에탄올/실리콘/파라벤 |
| 예산 | chip 선택 (단일) | 1-3만/3-5만/5만+ |

- 선택된 chip: `variant="default"`, 미선택: `variant="chip"`
- 저장 버튼: `variant="glow"`, 초기화 버튼: `variant="outline"`
- 저장 시: toast "조건이 저장되었습니다" (sonner)

**[검색 로그 탭]**:
- 카드형 리스트 (divide-y)
- 각 항목: "쿼리" + 날짜 + "다시 보기" 버튼
- "다시 보기" 클릭 → `/search?q={query}`

**데이터 소스**: `src/data/routes/account.json` (직접 import)

```typescript
import accountData from "@/data/routes/account.json";
const [prefs, setPrefs] = useState(accountData.preferences);
const searchLogs = accountData.search_logs;
// 저장 버튼 → setPrefs 업데이트 + toast (서버 전송 없음)
```

- 내 조건: `preferences.*`
- 검색 로그: `search_logs[]`

**버튼 & 이벤트**:
| 요소 | 이벤트명 | 클릭 시 UI 변화 |
|------|---------|----------------|
| 탭 전환 | — | `tab` state 변경 ("prefs" | "logs") |
| 조건 chip 클릭 | — | 로컬 state 업데이트 (선택/해제) |
| 무향 토글 | — | `fragrance_free` 토글 |
| "저장" 버튼 | `PREFERENCES_SAVE` | toast 표시 |
| "초기화" 버튼 | `PREFERENCES_RESET` | 모든 조건 초기화 |
| "다시 보기" | `RERUN_SEARCH` | `/search?q={query}` 이동 |

**상태 머신**:
```
initial ──→ loading ──→ success
```

- `loading`: 스켈레톤 (h-48 bg-muted rounded-xl animate-pulse)
- `success`: 탭 + 폼/로그 표시

**ASCII Layout**:
```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  계정                                               │
│                                                     │
│  ┌──────────┬──────────┐                            │
│  │ ■ 내 조건 │  검색 로그 │  ← 커스텀 탭             │
│  └──────────┴──────────┘                            │
│                                                     │
│  ┌─ 내 조건 폼 ────────────────────────────────┐    │
│  │                                             │    │
│  │  피부 타입                                   │    │
│  │  [건성] [지성] [복합] [■민감■]                │    │
│  │                                             │    │
│  │  톤                                         │    │
│  │  [웜] [■쿨■] [뉴트럴] [모름]                 │    │
│  │                                             │    │
│  │  고민                                       │    │
│  │  [■홍조■] [트러블] [■속건조■] [모공]          │    │
│  │  [각질] [잡티] [주름] [다크서클]              │    │
│  │                                             │    │
│  │  무향 선호  [●━━━] ON                        │    │
│  │                                             │    │
│  │  제외 성분                                   │    │
│  │  [향료] [■에탄올■] [실리콘] [파라벤]           │    │
│  │                                             │    │
│  │  예산                                       │    │
│  │  [■1-3만■] [3-5만] [5만+]                   │    │
│  │                                             │    │
│  │  [✨ 저장]  [초기화]                          │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

### Route: `/report/:reportId` (프리미엄 루틴 리포트)

**목적**: AI 생성 맞춤 루틴 리포트 조회

**진입 조건**: 로그인 필수 (ProtectedRoute), `:reportId` URL 파라미터

**레이아웃 (위→아래)**:
1. Header
2. 리포트 제목 + 날짜 + 액션 버튼 (공유/PDF/새 검색)
3. 요약 섹션 (gradient-glow-subtle 배경)
4. AM/PM 루틴 (2컬럼 그리드)
5. 조합 근거 섹션
6. 주의 조합 섹션 (destructive 컬러)
7. 대체 제품 그리드
8. Footer

**데이터 소스**: `src/data/routes/report.json` (직접 import)

```typescript
import reportData from "@/data/routes/report.json";
const report = reportData.report;
// 대체 제품은 report.json 내부에 인라인으로 포함 (별도 JSON 참조 금지)
```

- 리포트: `report.*`
- 대체 제품: `report.alternatives[]` (제품 ID 목록, 같은 JSON 내 `alt_products[]`에서 매칭)

**버튼 & 이벤트**:
| 요소 | 이벤트명 | 클릭 시 UI 변화 |
|------|---------|----------------|
| "공유" | — | 클립보드 복사 + toast "링크 복사됨" |
| "PDF" | — | toast "PDF 다운로드는 준비 중입니다" |
| "새 검색" | — | `/`로 이동 |
| 대체 제품 클릭 | — | `/p/{id}`로 이동 |

**상태 머신**:
```
initial ──→ loading ──→ success | not_found
```

- `loading`: 스켈레톤 (h-64 bg-muted rounded-xl animate-pulse)
- `success`: 전체 리포트 표시
- `not_found`: "리포트를 찾을 수 없습니다." + "홈으로" 버튼

**ASCII Layout**:
```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  맞춤 루틴 리포트              [공유][PDF][🔍새검색]  │
│  2025.06.20                                         │
│                                                     │
│  ┌─ 요약 (gradient-glow-subtle) ───────────────┐    │
│  │ 건성·민감 피부 타입에 맞춘 수분 집중 루틴...    │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─ AM 루틴 ────────────┬─ PM 루틴 ────────────┐    │
│  │ ☀                    │ 🌙                    │    │
│  │ 1. 독도 토너 정돈     │ 1. 오일 클렌징        │    │
│  │ 2. 세럼 수분 레이어링 │ 2. 폼 클렌징          │    │
│  │ 3. 수분크림 밀봉     │ 3. 토너 도포           │    │
│  │ 4. 선크림 마무리     │ 4. 세럼 도포           │    │
│  │                      │ 5. 수딩 크림 마무리    │    │
│  └──────────────────────┴──────────────────────┘    │
│                                                     │
│  ── 조합 근거 ─────────────────────────────────────  │
│  • 히알루론산 기반 시너지 효과 극대화                   │
│  • 토너→세럼→크림 분자 크기별 흡수율 고려              │
│  • 모든 제품 무향, 민감 피부 적합                      │
│                                                     │
│  ── ⚠ 주의 조합 ───────────────────────────────────  │
│  ┌─ destructive border ────────────────────────┐    │
│  │ 비타민C 세럼 추가 시 나이아신아마이드와         │    │
│  │ pH 차이에 주의하세요.                         │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ── 대체 제품 ─────────────────────────────────────  │
│  ┌────────┐                                        │
│  │ [IMG]  │                                        │
│  │ 그린티  │                                        │
│  │이니스프리│                                        │
│  └────────┘                                        │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

### Route: `/auth` (로그인/회원가입)

**목적**: 인증 페이지 — 로그인과 회원가입 모드 전환

**진입 조건**: 없음 (public). `?next=` 파라미터로 인증 후 리다이렉트 경로 지정. `?intent=` 파라미터로 맥락 메시지 표시.

**레이아웃 (2컬럼, md 이상)**:
- 왼쪽: 가치 제안 일러스트 + 설명 (md 이상에서만 표시)
- 오른쪽: 인증 폼

**데이터 소스**: `src/data/routes/auth.json` (직접 import)

```typescript
import authData from "@/data/routes/auth.json";
const intentMsg = authData.intent_messages[intent]; // URL ?intent= 파라미터
const valueProps = authData.value_props;
```

- 인텐트 메시지: `intent_messages[intent]`
- 가치 제안: `value_props[]`

**인증 폼 구성**:
1. 제목 ("로그인" / "회원가입")
2. Google OAuth 버튼 (outline, 구글 SVG 아이콘)
3. 구분선 "또는"
4. (회원가입 모드) 이름 입력 (선택)
5. 이메일 입력
6. 비밀번호 입력
7. 에러 메시지 (text-destructive)
8. 제출 버튼 (variant=glow)
9. 모드 전환 링크

**회원가입 성공 시**:
- 폼 대신 "이메일을 확인해주세요 📧" 메시지 표시
- "로그인으로 돌아가기" 버튼

**유효성 검증**:
- 이메일/비밀번호 빈 값: "이메일과 비밀번호를 입력해주세요"
- 비밀번호 6자 미만: "비밀번호는 6자 이상이어야 합니다"

**버튼 & 이벤트**:
| 요소 | 이벤트명 | 클릭 시 UI 변화 |
|------|---------|----------------|
| Google 로그인 | `AUTH_SUCCESS` | 더미: 로그인 상태로 전환 → `next` 경로로 이동 |
| 이메일 로그인 | `AUTH_SUCCESS` | 유효성 검증 → 더미 로그인 → `next` 이동 |
| 회원가입 | — | 유효성 검증 → `signupSuccess` 화면 표시 |
| 모드 전환 | — | `mode` state 전환 ("login" ↔ "signup") |

**상태 머신**:
```
login_mode ←──→ signup_mode
     │                │
     ▼                ▼
  success        signup_success (이메일 확인 안내)
```

**ASCII Layout**:
```
┌─────────────────────────────────────────────────────┐
│ HEADER: [K-Glow]                                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──── 가치 제안 (md+) ────┬──── 인증 폼 ────────┐  │
│  │                         │                      │  │
│  │    [일러스트 이미지]      │    로그인             │  │
│  │                         │                      │  │
│  │  K-Glow와 함께           │  [G] Google로 로그인  │  │
│  │                         │                      │  │
│  │  • 저장 기능으로 제품관리  │  ────── 또는 ──────  │  │
│  │  • 내 조건 저장으로       │                      │  │
│  │    추천 정확도 향상       │  [이메일 입력]        │  │
│  │  • AI 루틴 리포트        │  [비밀번호 입력]      │  │
│  │    구매 및 조회           │                      │  │
│  │                         │  [✨ 로그인]           │  │
│  │  💡 제품을 저장하려면     │                      │  │
│  │     로그인이 필요합니다    │  계정이 없으신가요?   │  │
│  │     (intent 메시지)      │  회원가입             │  │
│  │                         │                      │  │
│  └─────────────────────────┴──────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

────────────────────────────────────────────────────────

## 9) 공통 모달

────────────────────────────────────────────────────────

### PaymentModal (결제 모달)

- 트리거: 검색 결과 CTA 또는 제품 상세 CTA
- 내용:
  - 제목: "프리미엄 루틴 리포트"
  - 설명: "AI가 맞춤 AM/PM 루틴, 주의 조합, 대체 제품을 분석합니다."
  - 미리보기 이미지
  - 포함 내용 리스트 (4항목, gradient-glow-subtle 배경)
  - 가격: "₩4,900"
  - 결제 버튼 (variant=glow, "결제 완료 (더미)")
  - 안내 문구: "데모 환경에서는 실제 결제가 발생하지 않습니다."
- 결제 완료 시: 더미 리포트 생성 → `/report/{reportId}`로 이동

### CompareModal (비교 모달)

- 트리거: 저장 페이지 비교 모드에서 "비교 보기" 버튼
- 내용: 선택된 2~3개 제품 비교 테이블
- 비교 항목: 브랜드/카테고리/가격대/마무리감/톤/핵심성분/주의성분/추천이유

────────────────────────────────────────────────────────

## 10) 인증 시뮬레이션 (로컬)

────────────────────────────────────────────────────────

```typescript
// AuthContext (React Context)
interface AuthContextType {
  user: AuthUser | null;        // { id, email, name, role }
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (method, email?, password?) => Promise<void>;
  signup: (email, password, name?) => Promise<void>;
  logout: () => Promise<void>;
}
```

**더미 구현 규칙**:
- `login("email", ...)`: localStorage에 더미 유저 저장 → `user` state 업데이트
- `login("google")`: 즉시 더미 유저로 로그인 (OAuth 리다이렉트 시뮬레이션)
- `signup(...)`: `signupSuccess` 화면 표시 (이메일 확인 안내)
- `logout()`: localStorage 클리어 → `user` null
- `ProtectedRoute`: `isLoggedIn === false`이면 `/auth?next=현재경로`로 리다이렉트

────────────────────────────────────────────────────────

## 11) 이벤트 로깅 (로컬)

────────────────────────────────────────────────────────

모든 이벤트는 `console.log`로만 출력. 서버 전송 없음.

```typescript
function logEvent(eventType: string, payload?: Record<string, unknown>) {
  console.log(`[EVENT] ${eventType}`, payload);
}
```

**이벤트 목록**:
| 이벤트명 | 발생 위치 | payload |
|---------|---------|---------|
| `PAGE_VIEW` | 모든 페이지 | `{ page }` |
| `SEARCH_SUBMIT` | SearchBar | `{ query, source }` |
| `CLICK_EXAMPLE_CHIP` | 홈 | `{ chip }` |
| `FILTER_APPLY` | FilterBar | `{ filters }` |
| `PRODUCT_OPEN` | ProductCard | `{ productId }` |
| `SAVE_TOGGLE` | ProductCard/Detail | `{ productId, action }` |
| `PREFERENCES_SAVE` | Account | `{ prefs }` |
| `PREFERENCES_RESET` | Account | — |
| `RERUN_SEARCH` | Account | `{ query }` |
| `PAYMENT_START` | PaymentModal | `{ source, sourceId }` |
| `AUTH_SUCCESS` | AuthPage | `{ method }` |
| `REPORT_VIEW` | ReportPage | `{ reportId }` |

────────────────────────────────────────────────────────

## 12) 핵심 사용자 플로우

────────────────────────────────────────────────────────

### Flow 1: 검색 → 제품 상세 → 저장

```
"/"
→ SEARCH_SUBMIT { query: "촉촉한 세럼" }
→ "/search?q=촉촉한 세럼"
→ PRODUCT_OPEN { productId: "prod_001" }
→ "/p/prod_001"
→ SAVE_TOGGLE { productId: "prod_001", action: "save" }
  (비로그인 시)
  → "/auth?next=/p/prod_001&intent=save"
  → AUTH_SUCCESS { method: "email" }
  → "/p/prod_001" (리다이렉트)
  → SAVE_TOGGLE { action: "save" }
```

### Flow 2: 검색 → 리포트 구매

```
"/"
→ SEARCH_SUBMIT { query: "민감피부 진정" }
→ "/search?q=민감피부 진정"
→ PAYMENT_START { source: "search", sourceId: "민감피부 진정" }
  (비로그인 시)
  → "/auth?next=/search?q=...&intent=buy_report"
  → AUTH_SUCCESS
  → "/search?q=..." (리다이렉트)
→ PaymentModal 열기
→ 결제 완료 (더미)
→ "/report/rpt_001"
→ REPORT_VIEW { reportId: "rpt_001" }
```

### Flow 3: 저장 제품 비교

```
"/saved"
→ 비교 모드 ON
→ 체크박스 선택 × 2~3
→ "비교 보기" 클릭
→ CompareModal 열기
→ 비교 테이블 확인
→ CompareModal 닫기
→ ProductCard 클릭
→ "/p/{id}"
```

### Flow 4: 내 조건 설정

```
"/"
→ "/account" (또는 검색 결과 CTA에서 이동)
→ 피부 타입, 톤, 고민, 제외 성분 선택
→ PREFERENCES_SAVE
→ toast "조건이 저장되었습니다"
→ "/"로 돌아가서 재검색
```

────────────────────────────────────────────────────────

## 13) TypeScript 인터페이스 참조

────────────────────────────────────────────────────────

```typescript
interface Product {
  id: string;
  name: string;
  brand: string;
  category: "skincare" | "base" | "lip" | "eye" | "suncare";
  price_band: "1-3만" | "3-5만" | "5만+";
  finish: string;
  tone_fit: "cool" | "warm" | "neutral" | "any";
  tags: string[];
  ingredients_top: string[];
  ingredients_caution: string[];
  texture_desc: string;
  explain_short: string;
  image_url: string;
  similar_ids: string[];
}

interface SearchMeta {
  model: string;
  embedding_dim: number;
  match_threshold: number;
  candidates_found: number;
  results_after_filter: number;
  top_similarity: number;
  avg_similarity: number;
  top_brands: string[];
  top_tags: string[];
  category_distribution: Record<string, number>;
}

interface UserPreferences {
  skin_type: string;
  tone: string;
  concerns: string[];
  fragrance_free: boolean;
  exclude_ingredients: string[];
  budget_band: string;
}

interface SearchLog {
  query: string;
  created_at: string;
  result_count?: number;
}

interface Report {
  reportId: string;
  title: string;
  created_at: string;
  summary: string;
  routine_am: string[];
  routine_pm: string[];
  reasoning: string[];
  warnings: string[];
  alternatives: string[];
}
```

────────────────────────────────────────────────────────

## 14) QA 체크리스트

────────────────────────────────────────────────────────

- [ ] 모든 7개 라우터 단위 진입 가능
- [ ] JSON 기반 렌더링 정상 동작
- [ ] 버튼 이벤트 → console.log 확인
- [ ] 상태 전이 확인 (loading → success/empty/error)
- [ ] 네비게이션 정상 (모든 링크, 뒤로가기)
- [ ] 다크모드 토글 정상
- [ ] 비로그인 → ProtectedRoute 리다이렉트 정상
- [ ] 로그인 시뮬레이션 → next 파라미터로 리다이렉트
- [ ] 검색 → 필터 적용 → 결과 변경 확인
- [ ] 저장 토글 → 하트 아이콘 변화 확인
- [ ] 비교 모드 → 체크박스 → CompareModal 정상
- [ ] PaymentModal → 더미 결제 → 리포트 이동
- [ ] 반응형: 모바일(sm) / 태블릿(md) / 데스크톱(lg) 확인
- [ ] framer-motion 애니메이션 정상 (fade-in, slide)
- [ ] LoadingSteps 3단계 프로그레스 애니메이션
- [ ] SearchInsight 패널 접기/펼치기
- [ ] 각 라우터 독립 수정 가능 (JSON 교체만으로 데이터 변경)

────────────────────────────────────────────────────────

## 끝

────────────────────────────────────────────────────────

이 문서를 Lovable 등 AI 코딩 도구에 그대로 입력하면,
K-Glow AI Search의 프론트엔드 목업이 완결 형태로 생성되어야 한다.
