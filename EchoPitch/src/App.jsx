import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowRight, BookOpen, Building2, Check, CheckCircle2, ChevronDown,
  ClipboardCheck, FileText, GraduationCap, Home, Lightbulb, LogOut, Menu,
  MessageCircle, Pencil, Plus, Rocket, Save, Search, ShieldCheck, Sparkles,
  Target, Trash2, UserRound, X, BarChart3
} from "lucide-react";

const NAV = [
  ["Home", Home], ["My Startups", Rocket], ["Business Plan", FileText],
  ["Readiness Checklist", ClipboardCheck], ["Pitch Arena", MessageCircle],
  ["AI Tutor", Sparkles], ["Incubator", GraduationCap], ["Reports", BarChart3],
  ["Profile", UserRound]
];
const PLAN_FIELDS = [
  ["summary", "Startup overview", "Describe your idea in a few clear sentences."],
  ["problem", "Problem statement", "What problem are you solving, and for whom?"],
  ["solution", "Proposed solution", "How will your product or service solve it?"],
  ["customers", "Target customers", "Describe your ideal customers and their needs."],
  ["market", "Market opportunity", "What is the market size, demand and opportunity?"],
  ["revenue", "Revenue model", "How will the business earn revenue?"],
  ["marketing", "Marketing strategy", "How will you reach and retain customers?"],
  ["competitors", "Competitor analysis", "Who are the alternatives, and what makes you different?"],
  ["finance", "Financial plan", "Outline expected costs, pricing and funding needs."],
  ["goals", "Future goals", "What are your next milestones and longer-term goals?"]
];
const CHECKS = [
  "I can clearly explain the problem",
  "I have identified a specific customer group",
  "I have spoken to potential customers",
  "I have researched the market",
  "I have reviewed existing alternatives",
  "I can explain my proposed solution",
  "I have outlined a business model",
  "I have considered revenue and costs",
  "I have a customer acquisition plan",
  "I have identified key risks",
  "I have defined my next milestones",
  "I have prepared a short pitch"
];
const PITCH_QUESTIONS = [
  "What problem are you solving?",
  "Who experiences this problem most?",
  "What is your proposed solution?",
  "Why is your approach different?",
  "How will you reach your first customers?",
  "How will the business generate revenue?",
  "What is the biggest risk you need to address?",
  "What do you want to achieve next?"
];
const STORAGE_PREFIX = "echopitch-account:";
const SESSION_KEY = "echopitch-session";
const emptyWorkspace = () => ({ startups: [], tutorNotes: [] });
const accountKey = (email) => STORAGE_PREFIX + email.trim().toLowerCase();
const percentage = (done, total) => total ? Math.round((done / total) * 100) : 0;
const newStartup = (name, category, description) => ({
  id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
  name: name.trim(), category, description: description.trim(),
  plan: Object.fromEntries(PLAN_FIELDS.map(([key]) => [key, ""])),
  checks: CHECKS.map(() => false), pitchAnswers: {}, sessions: []
});
function readAccount(email) {
  try {
    const raw = localStorage.getItem(accountKey(email));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function normalizeAccount(account) {
  return {
    ...account,
    profile: { name: account?.profile?.name || account?.user?.name || "", email: account?.profile?.email || account?.user?.email || "" },
    workspace: { ...emptyWorkspace(), ...(account?.workspace || account?.data || {}) }
  };
}

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function submit(event) {
    event.preventDefault();
    setError("");
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must contain at least 6 characters.");
    const existing = readAccount(cleanEmail);
    if (mode === "signup") {
      if (!name.trim()) return setError("Enter your full name.");
      if (password !== confirm) return setError("The passwords do not match.");
      if (existing) return setError("An account with this email already exists. Please sign in.");
      const account = normalizeAccount({ profile: { name: name.trim(), email: cleanEmail }, password, workspace: emptyWorkspace() });
      localStorage.setItem(accountKey(cleanEmail), JSON.stringify(account));
      onLogin(cleanEmail, account);
    } else {
      if (!existing || existing.password !== password) return setError("Email or password is incorrect.");
      onLogin(cleanEmail, normalizeAccount(existing));
    }
  }

  return <div className="auth-page">
    <section className="auth-visual">
      <a className="brand" href="#" onClick={e => e.preventDefault()}><span className="brand-mark"><Activity size={21}/></span> EchoPitch</a>
      <div className="auth-copy">
        <span className="eyebrow">IDEA → PLAN → PITCH</span>
        <h1>Your idea deserves<br/><em>a real opportunity.</em></h1>
        <p>A focused workspace to shape your startup, prepare your business plan and practise communicating your vision.</p>
        <div className="auth-points"><span><CheckCircle2/> Build with clarity</span><span><CheckCircle2/> Track real progress</span><span><CheckCircle2/> Practise with purpose</span></div>
      </div>
      <span className="auth-foot">A workspace for the next generation of founders.</span>
    </section>
    <section className="auth-panel">
      <div className="auth-form-wrap">
        <a className="brand mobile-brand" href="#" onClick={e => e.preventDefault()}><span className="brand-mark"><Activity size={21}/></span> EchoPitch</a>
        <span className="eyebrow">{mode === "signup" ? "GET STARTED" : "WELCOME BACK"}</span>
        <h2>{mode === "signup" ? "Create your workspace" : "Sign in to EchoPitch"}</h2>
        <p className="muted">Your startup work stays in your own account on this device.</p>
        <form className="stack-form" onSubmit={submit}>
          {mode === "signup" && <label>Full name<input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoComplete="name" required/></label>}
          <label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/></label>
          <label>Password<div className="password-field"><input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete={mode === "signup" ? "new-password" : "current-password"} required/><button type="button" className="text-button" onClick={() => setShowPassword(v => !v)}>{showPassword ? "Hide" : "Show"}</button></div></label>
          {mode === "signup" && <label>Confirm password<input type={showPassword ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password" required/></label>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary button-full" type="submit">{mode === "signup" ? "Create account" : "Sign in"} <ArrowRight size={17}/></button>
        </form>
        <p className="auth-switch">{mode === "signup" ? "Already have an account?" : "New to EchoPitch?"} <button className="text-button" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); }}> {mode === "signup" ? "Sign in" : "Create an account"}</button></p>
        <p className="security-note"><ShieldCheck size={15}/> Demo authentication only. Passwords are stored locally and are not protected like a production account.</p>
      </div>
    </section>
  </div>;
}

function PageIntro({ eyebrow, title, description, action }) {
  return <div className="page-intro"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p className="muted">{description}</p></div>{action}</div>;
}
function EmptyState({ icon: Icon = Lightbulb, title, description, action }) {
  return <div className="empty-state"><span className="empty-icon"><Icon size={25}/></span><h3>{title}</h3><p>{description}</p>{action}</div>;
}
function MetricCard({ label, value, detail, icon: Icon }) {
  return <article className="metric-card"><span className="metric-icon"><Icon size={19}/></span><span className="metric-label">{label}</span><strong>{value}</strong><span className="metric-detail">{detail}</span></article>;
}
function StartupModal({ initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name || "");
  const [category, setCategory] = useState(initial?.category || "Technology");
  const [description, setDescription] = useState(initial?.description || "");
  const [error, setError] = useState("");
  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return setError("Startup name is required.");
    onSave({ name: name.trim(), category, description: description.trim() });
  }
  return <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <form className="modal-card" onSubmit={submit}>
      <button type="button" className="icon-button modal-close" onClick={onClose} aria-label="Close"><X/></button>
      <span className="eyebrow">{initial ? "EDIT WORKSPACE" : "NEW WORKSPACE"}</span>
      <h2>{initial ? "Update startup details" : "Create your startup"}</h2>
      <p className="muted">You can refine these details as your idea develops.</p>
      <label>Startup name<input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Enter a startup name" required/></label>
      <label>Business category<select value={category} onChange={e => setCategory(e.target.value)}>{["Technology","Education","Healthcare","Food & Agriculture","Finance","Retail & E-commerce","Sustainability","Other"].map(x => <option key={x}>{x}</option>)}</select></label>
      <label>Short description <span className="optional">(optional)</span><textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} placeholder="What are you building?"/></label>
      {error && <p className="form-error">{error}</p>}
      <div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit">{initial ? "Save changes" : "Create startup"}</button></div>
    </form>
  </div>;
}

export default function App() {
  const [email, setEmail] = useState(() => localStorage.getItem(SESSION_KEY) || "");
  const [account, setAccount] = useState(() => {
    const savedEmail = localStorage.getItem(SESSION_KEY);
    return savedEmail ? normalizeAccount(readAccount(savedEmail) || {}) : null;
  });
  const [page, setPage] = useState("Home");
  const [selectedId, setSelectedId] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [planDraft, setPlanDraft] = useState({});
  const [pitchDraft, setPitchDraft] = useState({});
  const [tutorQuestion, setTutorQuestion] = useState("");
  const [profileDraft, setProfileDraft] = useState({ name: "", course: "", college: "" });

  useEffect(() => {
    if (!email || !account) return;
    try {
      localStorage.setItem(accountKey(email), JSON.stringify(account));
      localStorage.setItem(SESSION_KEY, email);
    } catch { setToast("Unable to save. Check available browser storage."); }
  }, [email, account]);

  const startups = account?.workspace?.startups || [];
  const selected = startups.find(s => s.id === selectedId) || startups[0] || null;
  useEffect(() => {
    if (selected && selected.id !== selectedId) setSelectedId(selected.id);
    if (!selected && selectedId) setSelectedId("");
  }, [selected, selectedId]);

  const totals = useMemo(() => {
    const planCount = startups.reduce((sum, s) => sum + PLAN_FIELDS.filter(([k]) => (s.plan?.[k] || "").trim()).length, 0);
    const checkCount = startups.reduce((sum, s) => sum + (s.checks || []).filter(Boolean).length, 0);
    const pitchCount = startups.reduce((sum, s) => sum + (s.sessions || []).length, 0);
    return {
      plan: percentage(planCount, startups.length * PLAN_FIELDS.length),
      readiness: percentage(checkCount, startups.length * CHECKS.length),
      pitches: pitchCount
    };
  }, [startups]);

  const selectedPlanCount = selected ? PLAN_FIELDS.filter(([k]) => (selected.plan?.[k] || "").trim()).length : 0;
  const selectedChecks = selected ? (selected.checks || []) : [];
  const readiness = percentage(selectedChecks.filter(Boolean).length, CHECKS.length);

  function updateWorkspace(updater) {
    setAccount(old => {
      if (!old) return old;
      const current = old.workspace || emptyWorkspace();
      return { ...old, workspace: updater(current) };
    });
  }
  function notify(message) {
    setToast(message);
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => setToast(""), 2800);
  }
  function login(cleanEmail, nextAccount) {
    setEmail(cleanEmail);
    setAccount(nextAccount);
    localStorage.setItem(SESSION_KEY, cleanEmail);
    setPage("Home");
  }
  function signOut() {
    localStorage.removeItem(SESSION_KEY);
    setEmail("");
    setAccount(null);
    setSelectedId("");
    setPage("Home");
  }
  function saveStartup(details) {
    if (modal?.startupId) {
      updateWorkspace(w => ({ ...w, startups: w.startups.map(s => s.id === modal.startupId ? { ...s, ...details } : s) }));
      notify("Startup details updated.");
    } else {
      const startup = newStartup(details.name, details.category, details.description);
      updateWorkspace(w => ({ ...w, startups: [...w.startups, startup] }));
      setSelectedId(startup.id);
      setPage("My Startups");
      notify("Your startup workspace is ready.");
    }
    setModal(null);
  }
  function patchSelected(changes) {
    if (!selected) return;
    updateWorkspace(w => ({ ...w, startups: w.startups.map(s => s.id === selected.id ? { ...s, ...changes } : s) }));
  }
  function deleteStartup(id) {
    const target = startups.find(s => s.id === id);
    if (!target || !window.confirm(`Delete "${target.name}" and all its saved workspace data? This cannot be undone.`)) return;
    updateWorkspace(w => ({ ...w, startups: w.startups.filter(s => s.id !== id) }));
    if (selectedId === id) setSelectedId("");
    notify("Startup deleted.");
  }
  function savePlan() {
    patchSelected({ plan: { ...(selected?.plan || {}), ...planDraft } });
    setPlanDraft({});
    notify("Business plan saved.");
  }
  function savePitch() {
    if (!selected) return;
    const answers = Object.fromEntries(Object.entries(pitchDraft).filter(([, value]) => value.trim()));
    if (!Object.keys(answers).length) return notify("Add at least one pitch answer before saving.");
    patchSelected({ sessions: [...(selected.sessions || []), { id: `${Date.now()}`, createdAt: new Date().toISOString(), answers }] });
    setPitchDraft({});
    notify("Pitch practice saved.");
  }
  function askTutor(e) {
    e.preventDefault();
    const question = tutorQuestion.trim();
    if (!question) return;
    const response = "Start by narrowing the question to one customer group and one problem. Write down what you know, what you still need to validate, and the smallest practical test you can run. For market questions, compare existing alternatives and speak with potential customers. This is prepared learning guidance, not a live AI-generated answer.";
    updateWorkspace(w => ({ ...w, tutorNotes: [...(w.tutorNotes || []), { question, response, createdAt: new Date().toISOString() }] }));
    setTutorQuestion("");
  }
  function saveProfile(e) {
    e.preventDefault();
    if (!profileDraft.name.trim()) return notify("Your name cannot be empty.");
    setAccount(old => ({ ...old, profile: { ...old.profile, name: profileDraft.name.trim(), course: profileDraft.course.trim(), college: profileDraft.college.trim() } }));
    setModal(null);
    notify("Profile updated.");
  }
  function go(nextPage) {
    setPage(nextPage);
    setMobileOpen(false);
    setPlanDraft({});
  }

  if (!account || !email) return <AuthScreen onLogin={login}/>;

  const activeStartupSelect = selected && <div className="workspace-picker"><label htmlFor="active-startup">CURRENT STARTUP</label><div><select id="active-startup" value={selected.id} onChange={e => setSelectedId(e.target.value)}>{startups.map(s => <option value={s.id} key={s.id}>{s.name}</option>)}</select><ChevronDown size={16}/></div></div>;
  const createButton = <button className="button button-primary" onClick={() => setModal({ type: "startup" })}><Plus size={17}/> Create your startup</button>;

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <a className="brand sidebar-brand" href="#" onClick={e => e.preventDefault()}><span className="brand-mark"><Activity size={21}/></span><span>EchoPitch</span></a>
      <div className="sidebar-label">WORKSPACE</div>
      <nav className="nav-list" aria-label="Main navigation">{NAV.map(([label, Icon]) => <button key={label} className={`nav-link ${page === label ? "active" : ""}`} onClick={() => go(label)}><Icon size={19}/><span>{label}</span>{page === label && <span className="nav-indicator"/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-tip"><span><Lightbulb size={18}/></span><strong>Ideas grow with action.</strong><p>Take one clear step forward today.</p></div><button className="account-switch" onClick={() => go("Profile")}><span className="avatar">{(account.profile.name || "S").charAt(0).toUpperCase()}</span><span className="account-meta"><strong>{account.profile.name || "Student"}</strong><small>Student workspace</small></span><ChevronDown size={16}/></button></div>
    </aside>
    {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)}/>}
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu icon-button" onClick={() => setMobileOpen(v => !v)} aria-label="Toggle navigation"><Menu/></button><div className="breadcrumb">Workspace <span>/</span> <strong>{page}</strong></div><div className="topbar-right"><span className="topbar-greeting">Your ideas. Your progress.</span><span className="top-avatar">{(account.profile.name || "S").charAt(0).toUpperCase()}</span></div></header>
      <div className="page-content">
        {page === "Home" && <>
          <section className="dashboard-hero">
            <div className="hero-copy"><span className="welcome-badge"><Sparkles size={14}/> WELCOME TO ECHOPITCH</span><h1>Turn your ideas<br/><span>into reality.</span></h1><p>Build your business plan, practise your pitch and grow your startup with AI.</p>{createButton}<div className="hero-note"><ShieldCheck size={15}/> Your workspace starts with your ideas, not sample data.</div></div>
            <div className="hero-art"><img src="/ai-student.png" alt="Student using EchoPitch to practise communication and develop presentation skills" /></div>
          </section>
          <div className="section-heading"><div><span className="eyebrow">YOUR OVERVIEW</span><h2>Workspace at a glance</h2></div></div>
          <div className="metrics-grid"><MetricCard label="My startups" value={startups.length} detail="Workspaces you created" icon={Rocket}/><MetricCard label="Business plan" value={`${totals.plan}%`} detail="Across your workspaces" icon={FileText}/><MetricCard label="Readiness" value={`${totals.readiness}%`} detail="Based on completed tasks" icon={Target}/><MetricCard label="Pitch sessions" value={totals.pitches} detail="Saved practice sessions" icon={MessageCircle}/></div>
          <div className="home-grid"><section className="panel"><div className="panel-heading"><div><span className="eyebrow">YOUR IDEAS</span><h2>Startup workspaces</h2></div><button className="button button-quiet" onClick={() => go("My Startups")}>View all <ArrowRight size={16}/></button></div>
            {startups.length ? startups.slice(0, 4).map(s => <button className="startup-list-row" key={s.id} onClick={() => { setSelectedId(s.id); go("My Startups"); }}><span className="startup-icon"><Rocket size={19}/></span><span className="startup-row-copy"><strong>{s.name}</strong><small>{s.category}</small></span><ArrowRight size={17}/></button>) : <EmptyState icon={Rocket} title="Your first idea starts here" description="Create a startup workspace to begin shaping your idea." action={createButton}/>}
          </section><section className="panel"><span className="eyebrow">A SIMPLE JOURNEY</span><h2>Build with intention</h2><div className="journey-list">{[["01","Shape your idea","Define the problem and the people it affects.",Lightbulb],["02","Build your business plan","Think through customers, market and revenue.",FileText],["03","Check your readiness","Track the milestones you have completed.",ClipboardCheck],["04","Practise your pitch","Prepare clear answers to important questions.",MessageCircle]].map(([n,t,d,Icon]) => <button className="journey-item" key={n} onClick={() => go(n === "01" ? "My Startups" : n === "02" ? "Business Plan" : n === "03" ? "Readiness Checklist" : "Pitch Arena")}><span>{n}</span><div><strong>{t}</strong><small>{d}</small></div><Icon size={18}/></button>)}</div></section></div>
        </>}

        {page === "My Startups" && <>
          <PageIntro eyebrow="IDEA MANAGEMENT" title="My Startups" description="Create and manage a separate workspace for each idea." action={createButton}/>
          {startups.length === 0 ? <EmptyState icon={Rocket} title="No startups yet" description="Your workspace is empty. Create your first startup when you're ready." action={createButton}/> : <>
            <div className="list-toolbar"><div className="search-field"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your startups" aria-label="Search startups"/></div><span>{startups.length} {startups.length === 1 ? "workspace" : "workspaces"}</span></div>
            <div className="startup-grid">{startups.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map(s => <article className={`startup-card ${selected?.id === s.id ? "selected-card" : ""}`} key={s.id}><div className="startup-card-top"><span className="startup-icon"><Rocket size={20}/></span><span className="category-pill">{s.category}</span></div><h3>{s.name}</h3><p>{s.description || "Add a description to explain what you're building."}</p><div className="startup-stats"><span>Plan <strong>{percentage(PLAN_FIELDS.filter(([k]) => (s.plan?.[k] || "").trim()).length, PLAN_FIELDS.length)}%</strong></span><span>Readiness <strong>{percentage((s.checks || []).filter(Boolean).length, CHECKS.length)}%</strong></span></div><div className="mini-progress"><i style={{ width: `${percentage(PLAN_FIELDS.filter(([k]) => (s.plan?.[k] || "").trim()).length, PLAN_FIELDS.length)}%` }}/></div><div className="startup-card-actions"><button className="button button-secondary" onClick={() => setSelectedId(s.id)}>Open workspace</button><button className="icon-button" aria-label={`Edit ${s.name}`} onClick={() => setModal({ type: "startup", startupId: s.id })}><Pencil size={17}/></button><button className="icon-button danger-icon" aria-label={`Delete ${s.name}`} onClick={() => deleteStartup(s.id)}><Trash2 size={17}/></button></div></article>)}</div>
            {startups.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).length === 0 && <EmptyState icon={Search} title="No matching startups" description="Try a different search term."/>}
            {selected && <div className="selected-workspace panel"><div><span className="eyebrow">SELECTED WORKSPACE</span><h2>{selected.name}</h2><p>{selected.description || "Continue building your startup plan and pitch."}</p></div><div className="quick-actions"><button className="button button-secondary" onClick={() => go("Business Plan")}>Business plan <ArrowRight size={15}/></button><button className="button button-secondary" onClick={() => go("Readiness Checklist")}>Checklist <ArrowRight size={15}/></button></div></div>}
          </>}
        </>}

        {page === "Business Plan" && <>
          <PageIntro eyebrow="STRUCTURE YOUR IDEA" title="Business Plan" description="Work through each part of your business at your own pace."/>
          {selected ? <>{activeStartupSelect}<div className="progress-summary"><div><strong>{selectedPlanCount} of {PLAN_FIELDS.length} sections completed</strong><span>Completion is calculated from saved content.</span></div><b>{percentage(selectedPlanCount, PLAN_FIELDS.length)}%</b></div><div className="plan-grid">{PLAN_FIELDS.map(([key, title, hint], i) => <label className="plan-field" key={key}><span className="field-number">{String(i + 1).padStart(2, "0")}</span><span className="field-title">{title}</span><span className="field-hint">{hint}</span><textarea rows="4" value={planDraft[key] ?? selected.plan?.[key] ?? ""} onChange={e => setPlanDraft(old => ({ ...old, [key]: e.target.value }))} placeholder="Add your thoughts here..."/></label>)}</div><div className="save-row"><button className="button button-primary" onClick={savePlan}><Save size={17}/> Save business plan</button></div></> : <EmptyState icon={FileText} title="Choose an idea to begin" description="Create a startup workspace first. Your business plan will be saved inside it." action={createButton}/>}
        </>}

        {page === "Readiness Checklist" && <>
          <PageIntro eyebrow="TRACK YOUR MILESTONES" title="Readiness Checklist" description="Mark each task when you have genuinely completed it. Your progress updates automatically."/>
          {selected ? <>{activeStartupSelect}<section className="readiness-panel panel"><div className="readiness-ring" style={{"--progress": `${readiness * 3.6}deg`}}><div><strong>{readiness}%</strong><small>complete</small></div></div><div><span className="eyebrow">YOUR PROGRESS</span><h2>{selectedChecks.filter(Boolean).length} of {CHECKS.length} milestones completed</h2><p>There are no pre-completed tasks. Update this checklist as you make progress.</p></div></section><div className="checklist-panel panel">{CHECKS.map((item, i) => <label className="checklist-row" key={item}><input type="checkbox" checked={!!selectedChecks[i]} onChange={e => patchSelected({ checks: CHECKS.map((_, j) => j === i ? e.target.checked : !!selectedChecks[j]) })}/><span className="custom-check"><Check size={15}/></span><span className="check-copy"><strong>{item}</strong><small>{selectedChecks[i] ? "Marked as completed" : "Not completed yet"}</small></span><span className={`status-text ${selectedChecks[i] ? "done" : ""}`}>{selectedChecks[i] ? "Completed" : "To do"}</span></label>)}</div></> : <EmptyState icon={ClipboardCheck} title="Your checklist is waiting" description="Create a startup to get a dedicated readiness checklist." action={createButton}/>}
        </>}

        {page === "Pitch Arena" && <>
          <PageIntro eyebrow="PRACTISE YOUR STORY" title="Pitch Arena" description="Prepare thoughtful answers and save practice sessions for each startup."/>
          {selected ? <>{activeStartupSelect}<div className="pitch-guidance panel"><span className="guidance-icon"><MessageCircle size={22}/></span><div><h2>Make your idea easy to understand.</h2><p>Try to keep each answer specific. Explain the customer, the problem and the value of your solution. EchoPitch does not generate pitch scores or automatic evaluations.</p></div></div><div className="pitch-questions">{PITCH_QUESTIONS.map((question, i) => <label className="pitch-field" key={question}><span>QUESTION {String(i + 1).padStart(2, "0")}</span><strong>{question}</strong><textarea rows="3" value={pitchDraft[i] ?? selected.pitchAnswers?.[i] ?? ""} onChange={e => setPitchDraft(old => ({ ...old, [i]: e.target.value }))} placeholder="Write your answer in your own words..."/></label>)}</div><div className="save-row"><button className="button button-primary" onClick={savePitch}><Save size={17}/> Save practice session</button></div><section className="panel history-panel"><span className="eyebrow">YOUR PRACTICE</span><h2>Saved sessions</h2>{selected.sessions?.length ? [...selected.sessions].reverse().map((session, index) => <div className="history-row" key={session.id || index}><span className="history-icon"><CheckCircle2 size={18}/></span><span><strong>Practice session {selected.sessions.length - index}</strong><small>{new Date(session.createdAt).toLocaleString()}</small></span><span>{Object.keys(session.answers || {}).length} answers saved</span></div>) : <p className="muted">Your saved pitch sessions will appear here.</p>}</section></> : <EmptyState icon={MessageCircle} title="Start with a startup idea" description="Create a workspace before preparing your pitch." action={createButton}/>}
        </>}

        {page === "AI Tutor" && <>
          <PageIntro eyebrow="LEARN AT YOUR PACE" title="AI Tutor" description="A practical learning corner for common startup topics."/>
          <div className="tutor-disclaimer"><Sparkles size={18}/><p><strong>Guidance mode</strong><br/>This demo uses prepared learning guidance. It is not connected to a live AI model and does not produce personalised AI evaluations.</p></div>
          <div className="topic-grid">{[["Business ideas","Find a problem worth solving and test your assumptions.",Lightbulb],["Business plans","Understand the sections of a clear, useful business plan.",FileText],["Marketing","Learn about customer segments, positioning and channels.",Target],["Finance basics","Explore costs, pricing, cash flow and break-even thinking.",BarChart3],["Pitching","Structure a short pitch and communicate your value.",MessageCircle],["Market research","Plan interviews, surveys and competitor research.",Search]].map(([title, description, Icon]) => <article className="topic-card" key={title}><span><Icon size={20}/></span><h3>{title}</h3><p>{description}</p></article>)}</div>
          <section className="panel tutor-panel"><span className="eyebrow">ASK A LEARNING QUESTION</span><h2>What would you like to understand?</h2><form className="tutor-form" onSubmit={askTutor}><input value={tutorQuestion} onChange={e => setTutorQuestion(e.target.value)} placeholder="e.g. How do I identify my target customers?" aria-label="Ask a learning question"/><button className="button button-primary" type="submit">Get guidance <ArrowRight size={16}/></button></form>{(account.workspace.tutorNotes || []).length > 0 && <div className="tutor-history">{[...account.workspace.tutorNotes].reverse().map((note, i) => <article key={`${note.createdAt}-${i}`}><strong>{note.question}</strong><p>{note.response}</p><small>{new Date(note.createdAt).toLocaleString()}</small></article>)}</div>}</section>
        </>}

        {page === "Incubator" && <>
          <PageIntro eyebrow="EXPLORE YOUR NEXT STEP" title="Incubator" description="Learn what incubators can offer and how to prepare before approaching one."/>
          <div className="incubator-banner"><span><Building2 size={25}/></span><div><h2>Build a stronger foundation before you apply.</h2><p>Incubation programmes differ by institution, location and sector. Verify current details directly with each organisation.</p></div></div>
          <div className="incubator-grid">{[["Campus incubators","Ask your college entrepreneurship cell about mentoring, facilities, events and application cycles.",GraduationCap],["Startup support programmes","Look for structured support in customer discovery, business models, prototypes and founder skills.",Rocket],["Research and innovation centres","Explore support for testing technical ideas, building prototypes and connecting with subject experts.",Lightbulb]].map(([title, description, Icon]) => <article className="topic-card" key={title}><span><Icon size={21}/></span><h3>{title}</h3><p>{description}</p><small className="info-label">GUIDANCE · NOT A VERIFIED OPPORTUNITY</small></article>)}</div>
          <section className="panel incubator-check"><span className="eyebrow">BEFORE YOU APPLY</span><h2>Prepare these basics</h2><ul><li>Write a concise overview of the problem and solution.</li><li>Identify the customers you have spoken with.</li><li>Document your prototype or validation work, if any.</li><li>Prepare a short founder introduction and pitch.</li><li>Check eligibility, deadlines and terms on the official programme website.</li></ul></section>
        </>}

        {page === "Reports" && <>
          <PageIntro eyebrow="YOUR SAVED WORK" title="Reports" description="A factual snapshot calculated from the information in your workspaces."/>
          {startups.length ? <><div className="metrics-grid report-metrics"><MetricCard label="Startups created" value={startups.length} detail="Your saved workspaces" icon={Rocket}/><MetricCard label="Business plan" value={`${totals.plan}%`} detail="Saved sections across workspaces" icon={FileText}/><MetricCard label="Readiness" value={`${totals.readiness}%`} detail="Completed checklist items" icon={ClipboardCheck}/><MetricCard label="Pitch sessions" value={totals.pitches} detail="Saved practice sessions" icon={MessageCircle}/></div><section className="panel report-panel"><span className="eyebrow">WORKSPACE BREAKDOWN</span><h2>Progress by startup</h2>{startups.map(s => <div className="report-row" key={s.id}><div><strong>{s.name}</strong><small>{s.category}</small></div><span>Plan <b>{percentage(PLAN_FIELDS.filter(([k]) => (s.plan?.[k] || "").trim()).length, PLAN_FIELDS.length)}%</b></span><span>Readiness <b>{percentage((s.checks || []).filter(Boolean).length, CHECKS.length)}%</b></span><span>{(s.sessions || []).length} sessions</span></div>)}</section><p className="report-footnote">Percentages are calculated from saved text fields and checklist items. They are not investor-readiness scores or external assessments.</p></> : <EmptyState icon={BarChart3} title="No report data yet" description="Create a startup and save your work. Reports will appear here using your actual information." action={createButton}/>}
        </>}

        {page === "Profile" && <>
          <PageIntro eyebrow="YOUR DETAILS" title="Profile" description="Manage the basic details associated with your EchoPitch workspace."/>
          <section className="profile-card panel"><div className="profile-top"><span className="profile-avatar">{(account.profile.name || "S").charAt(0).toUpperCase()}</span><div><h2>{account.profile.name || "Student"}</h2><p>{account.profile.email}</p></div><button className="button button-secondary" onClick={() => { setProfileDraft({ name: account.profile.name, course: account.profile.course || "", college: account.profile.college || "" }); setModal({ type: "profile" }); }}><Pencil size={16}/> Edit profile</button></div><div className="profile-details"><div><small>FULL NAME</small><strong>{account.profile.name || "Not added"}</strong></div><div><small>EMAIL ADDRESS</small><strong>{account.profile.email}</strong></div><div><small>COURSE / PROGRAMME</small><strong>{account.profile.course || "Not added"}</strong></div><div><small>COLLEGE / INSTITUTION</small><strong>{account.profile.college || "Not added"}</strong></div><div><small>STARTUP WORKSPACES</small><strong>{startups.length}</strong></div></div><div className="profile-footer"><p><ShieldCheck size={17}/> Local demo account. Your workspace data is saved in this browser.</p><button className="button button-danger-outline" onClick={signOut}><LogOut size={16}/> Sign out</button></div></section>
          <div className="security-callout"><ShieldCheck size={19}/><p><strong>Demo security note</strong><br/>This frontend stores account details and passwords in LocalStorage. It is not production-grade authentication. Do not use a password you use elsewhere. A real launch needs a secure backend, password hashing, access controls and a database.</p></div>
        </>}
      </div>
      <footer className="app-footer"><span>© {new Date().getFullYear()} EchoPitch</span><span>Turn your ideas into a plan you can pitch.</span></footer>
    </main>
    {modal?.type === "startup" && <StartupModal initial={modal.startupId ? startups.find(s => s.id === modal.startupId) : null} onClose={() => setModal(null)} onSave={saveStartup}/>}
    {modal?.type === "profile" && <div className="modal-backdrop"><form className="modal-card" onSubmit={saveProfile}><button type="button" className="icon-button modal-close" onClick={() => setModal(null)} aria-label="Close"><X/></button><span className="eyebrow">PROFILE SETTINGS</span><h2>Edit your details</h2><label>Full name<input value={profileDraft.name} onChange={e => setProfileDraft(v => ({ ...v, name: e.target.value }))} required/></label><label>Course / programme<input value={profileDraft.course} onChange={e => setProfileDraft(v => ({ ...v, course: e.target.value }))} placeholder="e.g. MBA"/></label><label>College / institution<input value={profileDraft.college} onChange={e => setProfileDraft(v => ({ ...v, college: e.target.value }))} placeholder="Your institution"/></label><div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setModal(null)}>Cancel</button><button className="button button-primary">Save profile</button></div></form></div>}
    {toast && <div className="toast" role="status"><CheckCircle2 size={18}/>{toast}</div>}
  </div>;
}
