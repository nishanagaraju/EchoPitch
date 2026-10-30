# EchoPitch — Startup Support Dashboard

A responsive React + Vite frontend inspired by the supplied EchoPitch reference image. Includes interactive startup workspaces, business-plan sections, readiness checklist, pitch practice, AI Tutor demo, incubator program cards, reports, profile editing, and a sign-in/register modal.

## Requirements
- Node.js 18+ (Node.js 20+ recommended)
- npm

## Run locally in VS Code
1. Extract the ZIP file.
2. Open the `echopitch-project` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Run:
   ```bash
   npm install
   npm run dev
   ```
5. Open the local URL printed by Vite (usually `http://localhost:5173`).

To create a production build:
```bash
npm run build
npm run preview
```

## What's interactive
- Sidebar navigation to all dashboard areas.
- Create, open and delete startup workspaces.
- Editable business-plan sections with browser-local autosave.
- Readiness checklist with persisted progress and score.
- Pitch Arena with question navigation, saved answers, score and coaching feedback.
- AI Tutor chat with helpful, topic-aware demo responses and suggested prompts.
- Incubator program interest toggles.
- Reports based on your current local demo data.
- Profile editing and sign-in/register UI.
- Search, notifications dropdown, responsive mobile navigation, animated feedback toasts.

## Important notes
This is a full frontend starter project, not a production backend. Startup data, checklist, business plan, and demo profile are saved in the current browser using `localStorage`. The login/register form is a UI demonstration and does **not** provide real authentication or secure accounts. The AI Tutor currently uses local demo responses, not a live AI API. For production, connect a backend/database, secure authentication, and an AI provider through a server-side API (never expose private API keys in frontend code).

The hero illustration is cropped from the reference image you supplied so the local demo keeps a similar visual style.
