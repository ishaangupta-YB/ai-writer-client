# AI Blog Writer — Client Reference

## Overview

React frontend for the AI blog writing pipeline. User enters a topic, watches real-time generation progress via SSE, then views the finished blog with plan, evidence, preview, and logs tabs.

**No auth. No persistence.** Blogs exist only in React state. Refresh = gone.

**Single API call:** `POST /api/generate` with `{ topic, as_of }` → SSE stream. That's the only backend interaction.

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 8 (beta) with `@vitejs/plugin-react` |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` plugin |
| UI Library | shadcn/ui (56 components in `src/components/ui/`, ~12 actively used) |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-raw` + `rehype-sanitize` |
| Routing | `react-router-dom` v7 |
| Icons | `lucide-react` |
| Toasts | `sonner` |
| Fonts | Space Grotesk (sans), Space Mono (mono) — loaded via Google Fonts |
| Pkg Manager | npm |

---

## Directory Structure

```
client/
├── .claude/
│   └── CLAUDE.md              ← YOU ARE HERE
├── src/
│   ├── App.tsx                 # HomeView (topic input + generation) + routing
│   ├── main.tsx                # React entry point (StrictMode + App)
│   ├── index.css               # Tailwind theme: brutalist design tokens, utilities
│   ├── vite-env.d.ts           # Vite type declarations (ImportMetaEnv)
│   ├── lib/
│   │   ├── api.ts              # startBlogGeneration() — SSE client (THE ONLY API FUNCTION)
│   │   ├── types.ts            # BlogResult, SSEEvent, ProgressEvent, FinalEvent, ErrorEvent
│   │   └── utils.ts            # cn() (tailwind merge), formatDate()
│   ├── context/
│   │   ├── AppContext.tsx       # Global state: currentBlog, currentBlogId (no persistence)
│   │   └── GenerationContext.tsx # SSE event handling, progress tracking, navigation on complete
│   ├── components/
│   │   ├── layout/
│   │   │   └── MainContent.tsx         # App shell — header ("Agent Writer") + scrollable content area
│   │   ├── generation/
│   │   │   ├── GenerationProgress.tsx  # Real-time 5-stage pipeline progress display
│   │   │   └── PipelineStep.tsx        # Single pipeline stage indicator (idle/active/done)
│   │   ├── blog/
│   │   │   ├── BlogView.tsx            # Tab container: Plan, Evidence, Preview, Logs
│   │   │   ├── PlanTab.tsx             # Section plan table + accordion with details
│   │   │   ├── EvidenceTab.tsx         # Research sources list with links
│   │   │   ├── PreviewTab.tsx          # Rendered markdown + copy-to-clipboard + download .md
│   │   │   ├── LogsTab.tsx             # Timestamped generation event log
│   │   │   └── MarkdownRenderer.tsx    # react-markdown with rehype-sanitize (XSS-safe)
│   │   ├── shared/                     # Empty — BlogCard, DownloadButton, EmptyState were deleted
│   │   └── ui/                         # 56 shadcn/ui components (KEEP for future use)
│   └── hooks/
│       └── use-mobile.ts       # shadcn media query hook
├── vite.config.ts              # Alias @→src, proxy /api → localhost:8000
├── components.json             # shadcn/ui config
├── eslint.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── package.json
├── package-lock.json
├── .env.example                # VITE_API_URL=/api
├── .gitignore
└── index.html                  # Title: "Agent Writer", meta description
```

---

## Data Flow

```
User types topic → HomeView form submit
    ↓
GenerationContext.startGeneration(topic, as_of)
    ↓
api.ts: startBlogGeneration() → POST /api/generate (ReadableStream SSE)
    ↓
SSE events parsed in streaming loop:
  - "progress" → update statusText, progress %, currentNode, logs[]
  - "complete" → AppContext.SET_CURRENT_BLOG + navigate(/blog/:id) + toast success
  - "error"    → toast error, stop generating
    ↓
BlogView reads currentBlog from AppContext → renders 4 tabs:
  Plan | Evidence | Preview | Logs
```

### Cancel Flow
`startBlogGeneration()` returns an abort function. HomeView stores it in a `useRef`. Cancel button calls it + `resetGeneration()`.

### No Blog in Context
`BlogView` redirects to `/` if `currentBlog` is null and not currently generating. No empty state component — just redirect.

---

## SSE Event Contract

The backend streams events in `data: {JSON}\n\n` format. The client parses 3 event types:

```typescript
type ProgressEvent = {
    type: "progress";
    node: "router" | "research" | "orchestrator" | "worker" | "reducer";
    data: {
        mode?: string;
        needs_research?: boolean;
        queries?: string[];
        evidence_count?: number;
        tasks_planned?: number;
        sections_done?: number;
        total_sections?: number;
        current_step?: string;
    };
};

type FinalEvent = {
    type: "complete";
    data: BlogResult;
};

type ErrorEvent = {
    type: "error";
    message: string;
};
```

Progress bar: maps the 5 `node` values to stages in order — `["router", "research", "orchestrator", "worker", "reducer"]`. Each stage = 20% progress.

---

## BlogResult Shape

This is what the `complete` event delivers and what the entire blog view renders:

```typescript
interface BlogResult {
    id: string;
    plan: {
        blog_title: string;
        audience: string;
        tone: string;
        blog_kind: "explainer" | "tutorial" | "news_roundup" | "comparison" | "system_design";
        constraints: string[];
        tasks: Array<{
            id: number;
            title: string;
            goal: string;
            bullets: string[];
            target_words: number;
            tags: string[];
            requires_research: boolean;
            requires_citations: boolean;
            requires_code: boolean;
        }>;
    };
    evidence: Array<{
        title: string;
        url: string;
        published_at: string | null;
        snippet: string | null;
        source: string | null;
    }>;
    image_specs: Array<{...}>;  // Always empty (image gen disabled on backend)
    final_markdown: string;
    created_at: string;
}
```

---

## API Layer

**File:** `src/lib/api.ts`

There is exactly **one** exported function:

```typescript
startBlogGeneration(topic, as_of, onEvent, onComplete, onError) → cancelFn
```

- `POST`s to `${API_BASE}/generate` with `{ topic, as_of }`
- Reads the response body as a `ReadableStream`
- Buffers chunks, splits on `\n`, parses `data:` lines as JSON
- Calls `onEvent(SSEEvent)` for each parsed event
- Calls `onComplete()` when stream ends
- Calls `onError(Error)` on fetch/parse failure
- Returns an abort function (calls `AbortController.abort()`)

`API_BASE` defaults to `/api` (proxied by Vite in dev). Override with `VITE_API_URL` env var.

**Do NOT add more API functions.** The backend only has `GET /health` and `POST /api/generate`.

---

## Context Providers

### AppContext (`src/context/AppContext.tsx`)
- **State:** `currentBlogId: string | null`, `currentBlog: BlogResult | null`
- **Actions:** `SET_CURRENT_BLOG_ID`, `SET_CURRENT_BLOG`
- Force-removes `dark` class on mount (light mode only)
- **No persistence.** No `pastBlogs`, no `localStorage`, no `IndexedDB`.

### GenerationContext (`src/context/GenerationContext.tsx`)
- **State:** `isGenerating`, `statusText`, `progress` (0-100), `currentNode`, `data`, `logs[]`
- **Methods:** `startGeneration(topic, as_of)` → returns cancel function, `resetGeneration()`
- Handles all 3 SSE event types internally
- On `complete`: dispatches `SET_CURRENT_BLOG` to AppContext, navigates to `/blog/:id`, shows toast
- On `error`: shows toast, stops generating

Provider hierarchy: `AppProvider > BrowserRouter > GenerationProvider > AppContent`

---

## Component Map

### `App.tsx` — HomeView
- Topic textarea with `maxLength={500}` (matches backend limit)
- Enter key submits (Shift+Enter for newline)
- Generate button (Wand2 icon) / Cancel button (X icon) during generation
- Shows `GenerationProgress` below input during generation
- Hero text hidden during generation

### `MainContent.tsx` — Layout Shell
- Sticky header with "Agent Writer" text (clickable → navigates to `/`)
- Scrollable content area below

### `GenerationProgress.tsx` — Pipeline Progress
- Shows 5 pipeline stages as `PipelineStep` components
- Status text from `GenerationContext`
- Scrollable log panel at the bottom

### `PipelineStep.tsx` — Stage Indicator
- 3 states: idle (gray), active (pulsing primary), done (primary with check)
- Shows node name + status text

### `BlogView.tsx` — Blog Tabs
- 4 tabs: Plan, Evidence, Preview, Logs (default: Preview)
- Redirects to `/` if no `currentBlog` and not generating
- Shows `GenerationProgress` if still generating

### `PreviewTab.tsx` — Rendered Blog
- Copy Markdown button: `navigator.clipboard.writeText(blog.final_markdown)`
- Download .md button: creates `Blob` + temporary anchor element for download
- Renders via `MarkdownRenderer`
- **No server-side download.** Everything is client-side.

### `MarkdownRenderer.tsx` — Safe Markdown Rendering
- Plugins: `remark-gfm`, `rehype-raw`, `rehype-sanitize`
- Custom components: `img` (figure + figcaption), `pre` (code block with copy button + traffic-light dots), `code` (inline vs block), `a` (external links with `rel="noopener noreferrer"`)
- `CopyButton` and `extractText` are module-scope helper components

### `PlanTab.tsx` — Section Plan
- `BoolIcon` helper at module scope (not inside PlanTab — avoids re-creation per render)
- Table showing sections with title, word target, research/cite/code booleans, tags
- Accordion for detailed section goals + key points

### `EvidenceTab.tsx` — Research Sources
- Lists evidence items with title, URL, snippet, published date
- External links open in new tab

### `LogsTab.tsx` — Generation Logs
- Renders `logs[]` from `GenerationContext`
- Each log: timestamp, node badge, message

---

## Design System

**Brutalist** — all border-radius set to 0px, offset shadows, bold uppercase typography, high-contrast.

### Color Tokens (oklch, defined in `index.css`)
| Token | Value | Description |
|-------|-------|-------------|
| `primary` | `oklch(0.55 0.15 145)` | Teal — buttons, links, accents |
| `secondary` | `oklch(0.94 0.02 260)` | Soft blue-gray |
| `accent` | `oklch(0.48 0.12 260)` | Indigo |
| `destructive` | `oklch(0.58 0.22 25)` | Red — errors, cancel |
| `border` | `oklch(0.82 0 0)` | Light gray borders |
| `background` | `oklch(0.97 0.01 90)` | Off-white page |
| `card` | `oklch(1 0 0)` | Pure white cards |

### Utility Classes (defined in `index.css`)
| Class | Usage |
|-------|-------|
| `brutal-card` | Static cards: `border-2 border-border bg-card shadow-brutal` |
| `brutal-card-interactive` | Clickable cards: adds hover lift + shadow grow |
| `brutal-btn` | Buttons: brutal shadow + hover/active states, bold uppercase |

### Shadows
- `--shadow-brutal`: `3px 3px 0px 0px oklch(0.13 0 0)`
- `--shadow-brutalHover`: `5px 5px 0px 0px oklch(0.13 0 0)`
- `--shadow-brutalActive`: `1px 1px 0px 0px oklch(0.13 0 0)`

### Fonts
- **Sans:** Space Grotesk — headings, body text
- **Mono:** Space Mono — code, technical labels, timestamps

---

## Environment Variables

```bash
# client/.env
VITE_API_URL=/api    # API base URL (default: /api, proxied to backend in dev)
```

In dev, Vite proxies `/api/*` → `http://localhost:8000`. In production, your CDN or load balancer should route `/api` to the backend.

---

## Dev Commands

```bash
npm install              # Install dependencies
npm run dev              # Dev server on :5173 (proxy /api → :8000)
npm run build            # Production build → dist/
npm run lint             # ESLint
npm run preview          # Preview production build locally
```

**Both servers for dev:**
```bash
# Terminal 1
cd server && uv run uvicorn app.main:app --reload --port 8000

# Terminal 2
cd client && npm run dev
```

Open `http://localhost:5173`. Vite proxy handles `/api` forwarding.

---

## Disabled Features (code deleted from client)

1. **Image generation tab** — `ImagesTab.tsx` deleted. Backend `image_specs` always returns empty array.
2. **Past blogs / persistence** — `usePastBlogs.ts` hook, `BlogCard.tsx`, `EmptyState.tsx` deleted. No `pastBlogs` state in AppContext.
3. **Server-side downloads** — `DownloadButton.tsx` deleted. Replaced with client-side copy/download in `PreviewTab.tsx`.
4. **Dark mode** — `AppProvider` force-removes `dark` class. Light mode only.

---

## Security

1. **XSS:** `rehype-sanitize` in the markdown pipeline sanitizes all LLM-generated HTML. **Do not remove it.**
2. **External links:** All `<a>` tags use `target="_blank" rel="noopener noreferrer"`.
3. **Input validation:** Textarea `maxLength={500}` matches backend's limit.
4. **No secrets:** Only `VITE_API_URL` in client env. AWS creds and API keys are backend-only.
5. **AbortController:** SSE connections properly cancelled on user cancel or unmount.

---

## Key Decisions

1. **Single API function.** `startBlogGeneration()` is the only function in `api.ts`. Don't add more — the backend has no other endpoints.
2. **Client-side download.** Copy/download markdown works without backend — `Blob` + clipboard API.
3. **Redirect over empty state.** BlogView redirects to `/` when no blog in context, rather than showing an empty state.
4. **shadcn/ui components kept.** 56 components in `ui/`, only ~12 used. Tree-shaking handles it. Keep them for future features.
5. **No dark mode.** Light only. Don't add theme toggles.
6. **Ephemeral state.** Blogs live in `AppContext.currentBlog` only. No localStorage, no IndexedDB, no caching.
7. **Vite proxy for dev.** `/api` → `:8000`. Must restart Vite dev server if `vite.config.ts` changes.

---

## Common Pitfalls

1. **Don't add API endpoints that don't exist.** Backend only has `/health` and `/api/generate`.
2. **Don't add persistence.** No localStorage, no saving blogs, no history.
3. **Don't remove shadcn/ui components.** They're kept for future use.
4. **Don't remove `rehype-sanitize`.** LLM output can contain arbitrary HTML.
5. **Restart Vite after config changes.** Proxy and plugin changes require dev server restart.
6. **Don't define components inside other components.** Causes re-creation every render (e.g., `BoolIcon` must stay at module scope in `PlanTab.tsx`).
7. **Don't add `autoFocus`.** The textarea has `autoFocus={false}` intentionally.
8. **`Sparkles` import in `MainContent.tsx` is unused.** Left intentionally after user edit. Don't re-add it to JSX or clean it up without asking.

---

## Related

For backend details (agents, Strands SDK patterns, Pydantic models, deployment, infra):

**See:** `server/.claude/CLAUDE.md`
