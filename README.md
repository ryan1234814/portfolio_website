# Portfolio Website — Ryan George Koickal

Personal portfolio for **Ryan George Koickal** — Python developer & data scientist (edge-AI, RAG, multi-agent LLMs, React, FastAPI).

## Stack

- React 19 + Vite 6 + Tailwind (CDN) + Framer Motion + Recharts + Lucide icons
- Build output: `docs/` (deployed via `gh-pages -d docs`)

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # outputs to docs/
npm run preview
```

## AI assistant — Ryo

- Chat widget docked **bottom-left** on every page (except 404).
- Name: **Ryo** (Ryan's assistant).
- **Fully offline — no LLM, no API key, no network calls.** Answers are rule-based and grounded only in `constants.js` (projects, experience, education, skills, certifications, achievements, contact). Out-of-scope questions get a polite redirect.
- Engine: `services/ryoAssistant.js` (`sendChatMessage` / `getRyoAnswer`).

## Deploy

```bash
npm run deploy
```

Live contact: **Rg05.koickal@gmail.com** · [GitHub](https://github.com/ryan1234814/) · [LinkedIn](https://linkedin.com/in/ryan-george-1a6161283/)
