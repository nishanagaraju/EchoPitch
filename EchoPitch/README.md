<div align="center">

# EchoPitch 🚀

### Turn your ideas into a plan you can pitch.

A student-focused startup workspace to organise business ideas, build a business plan, track preparation milestones and practise a pitch.

![EchoPitch hero artwork](public/ai-student.png)

**React · Vite · JavaScript · LocalStorage · Lucide React**

[Getting Started](#-getting-started) · [Features](#-features) · [Project Structure](#-project-structure) · [Data & Security](#-data-and-security) · [Roadmap](#-possible-next-steps)

</div>

---

## Overview

EchoPitch is a frontend demonstration of a student entrepreneurship platform. It brings early-stage startup planning tools into one workspace, with a simple blue-and-white interface and a responsive layout.

Each account starts with an empty workspace. Startup details, business plan content, checklist progress, pitch practice sessions, tutor questions and profile details are stored locally in the browser.

> **Project status:** Frontend prototype. Authentication and persistence are implemented with browser LocalStorage for demonstration purposes. This is not production-grade authentication or cloud storage.

## Features

### Student workspace
- Nine navigation areas: Home, My Startups, Business Plan, Readiness Checklist, Pitch Arena, AI Tutor, Incubator, Reports and Profile.
- Dashboard hero uses the supplied `public/ai-student.png` asset.
- Responsive sidebar navigation for desktop, tablet and mobile.
- Empty states instead of fabricated startup data or progress.

### Startup management
- Create, edit, select, search and delete startup workspaces.
- Confirmation before deleting a startup.
- Each startup has its own business plan, checklist, pitch answers and saved sessions.

### Business planning
- Structured editor for startup overview, problem, solution, customers, market opportunity, revenue, marketing, competitors, financial planning and future goals.
- Save and continue editing after refresh.

### Readiness checklist
- Milestones begin unchecked.
- Completion percentage is calculated from the student's actual checklist selections.

### Pitch Arena
- Eight practical pitch prompts.
- Save answers as dated practice sessions.
- No invented pitch scores or automatic evaluations.

### AI Tutor and Incubator
- Prepared learning guidance across business ideas, planning, marketing, finance, research and pitching.
- Tutor clearly identifies itself as guidance mode, not a connected live AI model.
- Incubator section explains support categories and preparation steps without claiming real partnerships, mentors or funding offers.

### Reports and profile
- Reports calculate startup count, saved plan completion, checklist completion and saved pitch sessions from actual workspace data.
- Edit profile details and sign out.
- No sample accounts, sample startups or preloaded progress.

## Tech stack

| Technology | Purpose |
| --- | --- |
| React | Component-based user interface |
| Vite | Development server and production build |
| JavaScript / JSX | Application logic and components |
| CSS | Responsive styling and design system |
| Lucide React | Interface icons |
| LocalStorage | Demo account and workspace persistence |

No TypeScript or Tailwind CSS is used.

## Getting started

### Prerequisites

- Node.js (current LTS version recommended)
- npm
- Visual Studio Code or another code editor

### 1. Download or clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/echopitch.git
cd echopitch
```

If you downloaded the project ZIP, extract it and open the `EchoPitch` folder — the folder containing `package.json` — in VS Code.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed in the terminal (usually `http://localhost:5173`).

### 4. Create a production build

```bash
npm run build
```

### 5. Preview the production build

```bash
npm run preview
```

## Project structure

```text
EchoPitch/
├── public/
│   └── ai-student.png       # Supplied dashboard hero image
├── src/
│   ├── App.jsx               # App, navigation, pages and interactions
│   ├── main.jsx              # React entry point
│   └── styles.css            # Design system and responsive styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Data and security

This project uses LocalStorage to demonstrate account-specific workspaces.

- Account records are stored under an email-based key.
- A signed-in session is stored in the browser.
- Each new account receives an empty workspace.
- Data remains in the same browser profile after refresh.
- Signing out removes the active session, not the saved account data.
- Clearing browser storage or using another browser/device will remove or not carry over this local data.

**Important security limitations:** LocalStorage is accessible to scripts running on the same origin. The demo stores passwords in browser storage and does not provide server-side identity verification, secure password hashing, authorization, backups or cross-device synchronisation. Do not use a real or reused password. Before public production use, replace this demo authentication with a secure backend, hashed passwords, server-side sessions or a trusted identity provider, database authorization and appropriate security controls.

## Quality checks

Before publishing changes, run:

```bash
npm install
npm run build
```

Then manually verify:
- Sign-up, sign-in and sign-out.
- Two separate accounts with different workspace data.
- Startup creation, editing, selection and deletion.
- Business plan save and refresh persistence.
- Checklist updates and calculated progress.
- Pitch answer saving and session history.
- Profile editing.
- The supplied hero image at `/ai-student.png`.
- Mobile navigation and narrow-screen layouts.

## Known limitations

- The AI Tutor is prepared educational guidance, not a live AI integration.
- Incubator content is general guidance, not a directory of verified programmes.
- Reports are local summaries of saved inputs, not independent startup evaluations.
- Data is stored only in the current browser's LocalStorage.

## Possible next steps

- Add secure backend authentication and a database.
- Add export to PDF for business plans and pitch notes.
- Connect an AI service with transparent consent, usage limits and error handling.
- Add verified incubator listings with official links and last-checked dates.
- Add automated component and end-to-end tests.
- Add deployment configuration and a public demo URL.

## Contributing

Suggestions and improvements are welcome. For substantial changes, open an issue first to discuss the proposed update, then submit a pull request with a clear description and testing notes.

## License

No license has been assigned yet. Add a `LICENSE` file before allowing reuse, modification or redistribution under specific terms.

---

<div align="center">

**EchoPitch — Before you face the room, prepare with purpose.**

Built as a student entrepreneurship platform project.

</div>
