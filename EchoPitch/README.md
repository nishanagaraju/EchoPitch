# 🚀 EchoPitch

### Turn your ideas into a plan you can pitch.

<p align="center">
  <strong>A student-focused startup workspace to turn early ideas into structured business plans, practise pitches, and prepare for the entrepreneurial journey.</strong>
</p>

<p align="center">
  <img src="public/ai-student.png" alt="EchoPitch hero artwork" width="85%">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-2026-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-Fast%20Build-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/CSS-Responsive-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS">
  <img src="https://img.shields.io/badge/Storage-LocalStorage-2878F0?style=for-the-badge" alt="LocalStorage">
</p>

<p align="center">
  <a href="#-about-the-project">About</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a>
</p>

---

## 💡 About the Project

**EchoPitch** is a frontend demonstration of a startup development platform designed for students and early-stage entrepreneurs.

It brings essential startup preparation tools into one workspace, helping users organise ideas, create business plans, track preparation milestones, and practise pitching.

The platform provides nine main sections:

- 🏠 Home
- 💼 My Startups
- 📝 Business Plan
- ✅ Readiness Checklist
- 🎤 Pitch Arena
- 🤖 AI Tutor
- 🌱 Incubator
- 📊 Reports
- 👤 Profile

> **Our idea:** Before you pitch your startup to the world, prepare your idea with EchoPitch.

## ✨ Features

### 🧑‍💻 Student Workspace
- Clean, responsive dashboard.
- Nine dedicated workspace sections.
- Startup-specific workspaces.
- Empty states instead of fabricated progress or sample data.

### 🚀 Startup Management
- Create, edit, select, and delete startup workspaces.
- Search and manage startup ideas.
- Confirmation before deleting a startup.

### 📋 Business Planning
Organise your startup idea with structured sections covering:
- Problem and solution
- Target customers
- Market opportunity
- Revenue model
- Marketing strategy
- Competitor analysis
- Financial planning
- Future goals

### ✅ Readiness Checklist
- Track startup preparation milestones.
- Update checklist items.
- Calculate progress using actual selections.

### 🎤 Pitch Arena
- Practise with structured pitch questions.
- Save answers and practice sessions.
- Review saved practice history.

### 🤖 AI Tutor & 🌱 Incubator
- Educational guidance for startup planning and pitching.
- General incubator preparation guidance.
- Clear distinction between demo guidance and live AI services.

### 📊 Reports & 👤 Profile
- Reports based on saved workspace information.
- Editable profile details.
- Persistent browser-based workspace data.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development and build tooling |
| JavaScript / JSX | Application logic |
| CSS | Styling and responsive design |
| Lucide React | Interface icons |
| LocalStorage | Demo account and workspace persistence |

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/)
- npm
- [Visual Studio Code](https://code.visualstudio.com/)

### 1. Clone the repository

```bash
git clone https://github.com/nishanagaraju/EchoPitch.git
cd EchoPitch
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL shown in your terminal. It is usually:

```text
http://localhost:5173
```

### 4. Create a production build

```bash
npm run build
```

### 5. Preview the production build

```bash
npm run preview
```

## 📁 Project Structure

```text
EchoPitch/
│
├── public/
│   └── ai-student.png
│
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```

## 🔐 Data & Security

EchoPitch currently uses browser LocalStorage for its frontend demonstration.

- Workspace information is saved in the current browser.
- Data persists after refreshing the page.
- Different demo accounts have separate workspaces.
- Data does not automatically synchronise across devices.

**Important:** This is not production-grade authentication. LocalStorage is not a secure place for passwords or sensitive information. A production version would need secure backend authentication, password hashing, database storage, and appropriate access controls.

## 🗺️ Future Improvements

- Secure backend authentication and database integration.
- Live AI-powered startup guidance.
- Business plan and pitch report export.
- Verified incubator and entrepreneurship programme listings.
- Automated testing and deployment.

## 👩‍💻 Author

**Nisha Nagaraju**

Creator and sole developer of EchoPitch.

- GitHub: [@nishanagaraju](https://github.com/nishanagaraju)
- Project: [EchoPitch](https://github.com/nishanagaraju/EchoPitch)

---

<p align="center">
  <strong>EchoPitch 🚀</strong><br>
  <em>Before you face the room, prepare with purpose.</em>
</p>