# Financial Chatbot — FUTURE AI

> A conversational financial-profiling assistant, **shipped to production** for a real Israeli financial-planning firm. Visitors are guided through a Hebrew questionnaire, classified into one of four investor archetypes, and routed into the firm's CRM as qualified leads.

🔗 **Live demo:** **[financialplanning.co.il/future-ai](https://www.financialplanning.co.il/future-ai/)**

Built solo, end-to-end — product, design, frontend, backend, and integrations — for **FUTURE תכנון ואחזקות בע"מ**.

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)
![Vercel AI SDK](https://img.shields.io/badge/AI%20SDK-5-black)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--5-412991?logo=openai)

---

## Highlights

- **Production traffic, real client.** Embedded in the firm's marketing site and converting real leads into the financial planner's calendar.
- **Google Sheets as a headless CMS** — the questionnaire (~17 questions, multi-type, with branching and per-answer scoring) is fully editable by non-developers without redeploying.
- **Branching questionnaire engine** with six input types (`text`, `number`, `sum`, `phone`, `email`, `multiple`), per-answer scoring, and `next_question` routing for non-linear flows.
- **Behavioral scoring → archetype mapping.** Cumulative scores are deterministically mapped to one of four investor profiles (*המתכנן / המחושב / המאוזן / המהמר*), each with hand-written, gender-aware Hebrew copy.
- **CRM hand-off** via a server-side webhook proxy — keeps the integration secret out of the browser, swappable between Make.com / Zapier / n8n.
- **Hebrew RTL UX** with iframe-aware embed support (`postMessage` to scroll the parent on mobile keyboard collapse).
- **Vercel AI SDK + OpenAI scaffolded** for streamed conversational mode; the production build runs a deterministic flow today, with the LLM path kept warm for the next iteration.

---

## How it works

```
┌──────────┐      GET /api/questions       ┌──────────────────┐
│  Browser │ ────────────────────────────▶ │  Google Sheets   │
│  /chat   │ ◀──────── questions JSON ──── │  (questions +    │
└────┬─────┘                                │   answers tabs)  │
     │ user answers each question, score accumulates
     ▼
┌──────────────────────────────┐
│  POST /api/chat/             │  computes profile from score
│       profile-selection      │  (deterministic mapping)
└────┬─────────────────────────┘
     │ profile description rendered in chat
     ▼
┌──────────────────────────────┐
│  POST /api/webhook           │  forwards { name, email, phone,
│  (server-side proxy)         │   conversation } to the CRM
└────┬─────────────────────────┘
     ▼
       redirect → thank-you page
```

**The four archetypes** (score range → profile):

| Score | Profile | Theme |
|-------|---------|-------|
| 10–17 | המתכנן  | Strategic, plan-driven |
| 18–25 | המחושב  | Conservative, stability-first |
| 26–33 | המהמר   | Risk-taker, opportunistic |
| 34–40 | המאוזן  | Balanced — discipline + enjoyment |

---

## Tech stack

| Layer            | Choice |
|------------------|--------|
| Framework        | Next.js 16 (App Router), React 19, TypeScript 5 |
| Styling          | Tailwind CSS 4 + CSS Modules |
| AI               | Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`) — GPT-5 |
| Data source      | Google Sheets API v4 (questionnaire as a no-code CMS) |
| CRM integration  | Generic outbound webhook (Make.com in production) |
| 3D / extras      | `three`, `@react-three/fiber`, `@react-three/drei` (optional avatar) |
| Doc parsing      | `mammoth` (extract profile copy from `.docx`) |
| Tooling          | ESLint 9, Next.js compiler, Vercel deployment |

---

## Architecture

### API routes

| Route                              | Method | Purpose |
|------------------------------------|--------|---------|
| `/api/questions`                   | GET    | Fetches and normalizes questions + answers from Google Sheets |
| `/api/chat/profile-selection`      | POST   | Maps cumulative score → investor profile + Hebrew copy |
| `/api/webhook`                     | POST   | Server-side proxy that forwards the lead to the CRM webhook |
| `/api/chat`                        | POST   | Streamed GPT-5 conversation (scaffolded for the next iteration) |

### Question schema (Google Sheets)

The Google Sheet has two tabs that drive the entire questionnaire:

**`questions`** — one row per question:

| id  | section | question         | type     | is_last_question |
|-----|---------|------------------|----------|------------------|
| q1  | intro   | מה שמך?          | text     | FALSE            |
| q3  | risk    | איך תגדיר/י…     | multiple | FALSE            |
| qN  | end     | מה כתובת המייל?  | email    | TRUE             |

Supported types: `text`, `number`, `sum`, `phone`, `email`, `multiple`.

**`answers`** — one row per multiple-choice option, with per-option scoring and branching:

| question_id | answer_id | answer            | next_question | score |
|-------------|-----------|-------------------|---------------|-------|
| q3          | q3_a1     | חיסכון יציב       | q4            | 1     |
| q3          | q3_a2     | השקעות סולידיות   | q4            | 2     |
| q3          | q3_a3     | מניות וקריפטו     | q4            | 4     |

This lets the firm's team A/B test wording, reorder questions, and tune the scoring model without a code change or redeploy.

---

## Project structure

```
financial-chatbot/
├── public/
│   ├── financial-profiles-images/   # PNGs for each profile
│   ├── fonts/, models/, textures/   # 3D + font assets
│   └── *.svg
├── src/
│   ├── app/
│   │   ├── page.tsx                 # redirects → /chat
│   │   ├── layout.tsx               # root layout, fonts, metadata
│   │   ├── chat/page.tsx            # main chat UI (client component)
│   │   └── api/
│   │       ├── questions/route.ts                  # GET — Google Sheets loader
│   │       ├── chat/route.ts                       # POST — streaming OpenAI
│   │       ├── chat/profile-selection/route.ts     # POST — score → profile
│   │       └── webhook/route.ts                    # POST — CRM forwarder
│   ├── components/                  # MessageBubble, MultipleChoice, *Input, Loader, RobotModel
│   ├── constants/                   # financial-profiles.ts (copy + scoring), messages.ts
│   ├── lib/google-sheets.ts         # Sheets v4 client
│   ├── prompts/                     # system / answer-feedback / profile-selection / financial-plan
│   ├── documents/                   # source .docx for profile copy
│   ├── utils/text.ts                # {{name}} placeholder replacer
│   └── types.ts                     # shared TS types
└── package.json
```

---

## Running locally

### Prerequisites
- Node.js ≥ 18.18
- A Google Sheets API key + spreadsheet structured as above
- An outbound webhook URL (Make.com / Zapier / n8n / your own)
- An OpenAI API key (only required if you enable the streaming AI mode)

### Setup

```bash
# 1. Install
npm install

# 2. Configure env vars
cat > .env.local <<'EOF'
OPENAI_API_KEY=sk-...
GOOGLE_SHEETS_API_KEY=AIza...
GOOGLE_SHEETS_ID=<your-spreadsheet-id>
WEBHOOK_URL=https://hook.eu1.make.com/xxxxxxxxxxxxxxxxxxxx
EOF

# 3. Run
npm run dev
# → http://localhost:3000  (redirects to /chat)
```

### Scripts

| Command         | What it does |
|-----------------|--------------|
| `npm run dev`   | Dev server with HMR |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint`  | ESLint |

### Deployment

Deploys cleanly to **Vercel** or any Node host. Configure the same four env vars in your hosting provider. The chat is designed to be **embeddable in an `<iframe>`** — it emits `postMessage({ action: "scrollTop" })` to the parent window on input blur so the host page can correct scroll when the mobile keyboard collapses.

---

## About

Built by **YARSON** — full-stack engineer working across React/Next.js, TypeScript, AI integrations, and conversational UX.

- 🌐 Portfolio — [yarson.dev](https://yarson.dev)
- 💼 LinkedIn — _add your URL here_
- 🐙 GitHub — [@YarsCode](https://github.com/YarsCode)

If you're a recruiter or hiring manager, I'm happy to walk through the architecture, the product decisions behind the questionnaire/scoring model, or the trade-offs of using Google Sheets as a CMS — feel free to reach out.
