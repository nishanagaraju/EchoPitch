import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Home, Lightbulb, FileText, CircleCheck, Trophy, Bot, Landmark, ChartNoAxesColumnIncreasing,
  UserRound, Search, Bell, ChevronDown, ArrowRight, Sparkles, GraduationCap, ClipboardCheck,
  BriefcaseBusiness, Send, Rocket, Leaf, Menu, X, Plus, MoreHorizontal, Target, TrendingUp,
  Check, ChevronRight, CalendarDays, Clock3, MessageCircle, Zap, LogOut, Eye, EyeOff,
  Mail, LockKeyhole, User, Save, Pencil, Trash2, CircleHelp, Star, WandSparkles
} from 'lucide-react';
import './styles.css';
import heroImage from './assets/hero-reference.png';

const navItems = [
  { label: 'Home', icon: Home }, { label: 'My Startups', icon: Lightbulb }, { label: 'Business Plan', icon: FileText },
  { label: 'Readiness Checklist', icon: CircleCheck }, { label: 'Pitch Arena', icon: Trophy }, { label: 'AI Tutor', icon: Bot },
  { label: 'Incubator', icon: Landmark }, { label: 'Reports', icon: ChartNoAxesColumnIncreasing }, { label: 'Profile', icon: UserRound },
];
const starterMessages = [
  { from: 'bot', text: "Hi there!!! 👋 I'm your AI Tutor. I'm here to help with startup ideas, business plans, pitch practice and more. What would you like to work on today?" },
];
const checklistItems = [
  { title: 'Define your problem', desc: 'Explain the customer problem your startup solves.' },
  { title: 'Identify your target customers', desc: 'Know who needs your solution most.' },
  { title: 'Validate your idea', desc: 'Talk to at least five potential customers.' },
  { title: 'Research your competitors', desc: 'Understand alternatives and your differentiator.' },
  { title: 'Draft your business model', desc: 'Map your costs, pricing and revenue streams.' },
  { title: 'Practice your pitch', desc: 'Communicate your idea clearly in 60 seconds.' },
];

const planSections = [
  'Overview', 'Problem', 'Solution', 'Market',
  'Business model', 'Go-to-market'
];

function calculateProgress(startup) {
  const checklistDone = (startup.checklist || []).filter(Boolean).length;
  const pitchDone = Object.values(startup.pitchAnswers || {})
    .filter(answer => String(answer).trim()).length;
  const planDone = planSections.filter(section =>
    String((startup.plan || {})[section] || '').trim().length >= 20
  ).length;

  const total = 6 + 5 + 6;
  return Math.round(
    ((checklistDone + pitchDone + planDone) / total) * 100
  );
}

function App() {
  const [active, setActive] = useState('Home');
  const [startups, setStartups] = useState(() => JSON.parse(localStorage.getItem('echopitch-startups') || '[]'));
  const [selectedStartupId, setSelectedStartupId] = useState(null);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('echopitch-user') || 'null'));
  const [authOpen, setAuthOpen] = useState(true);
  const [isRegister, setIsRegister] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const [messages, setMessages] = useState(starterMessages);
  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const [checklist, setChecklist] = useState(() => JSON.parse(localStorage.getItem('echopitch-checklist') || 'null') || [false, false, false, false, false, false]);
  const [pitchAnswers, setPitchAnswers] = useState({});
  const [pitchIndex, setPitchIndex] = useState(0);
  const [planTab, setPlanTab] = useState('Overview');
  const [newStartup, setNewStartup] = useState({ name: '', category: 'Technology', description: '' });
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => localStorage.setItem('echopitch-startups', JSON.stringify(startups)), [startups]);
  useEffect(() => localStorage.setItem('echopitch-user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('echopitch-checklist', JSON.stringify(checklist)), [checklist]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(''), 2800); return () => clearTimeout(t); } }, [toast]);

  const selectedStartup = startups.find(s => s.id === selectedStartupId);

const activeChecklist = selectedStartup?.checklist || [];
const completed = activeChecklist.filter(Boolean).length;
const readiness = activeChecklist.length
  ? Math.round((completed / activeChecklist.length) * 100)
  : 0;

const answeredPitch = Object.values(selectedStartup?.pitchAnswers || {})
  .filter(answer => String(answer).trim()).length;

const latestPitch = answeredPitch > 0
  ? Math.min(96, 62 + answeredPitch * 6)
  : 0;
  const filteredStartups = startups.filter(s => `${s.name} ${s.category} ${s.description}`.toLowerCase().includes(search.toLowerCase()));
  const changePage = (label) => { setActive(label); setMobileNav(false); setSearch(''); };
  
const addStartup = (e) => {
  e.preventDefault();

  if (!newStartup.name.trim()) return;

  const startup = {
    id: Date.now(),
    ...newStartup,
    stage: 'Idea validation',
    progress: 0,
    updated: 'Created just now',
    color: 'blue',
    checklist: Array(6).fill(false),
    pitchAnswers: {},
    plan: {}
  };

  setStartups(prev => [...prev, startup]);
  setSelectedStartupId(startup.id);
  setNewStartup({
    name: '',
    category: 'Technology',
    description: ''
  });
  setModal(null);
  notify('Startup workspace created.');
};

  const notify = (text) => setToast(text);


  const deleteStartup = (id) => { setStartups(prev => prev.filter(s => s.id !== id)); notify('Startup workspace removed.'); };
  const sendMessage = (text = chatInput) => {
    if (!text.trim() || chatBusy) return;
    const question = text.trim(); setMessages(prev => [...prev, { from: 'user', text: question }]); setChatInput(''); setChatBusy(true);
    setTimeout(() => { setMessages(prev => [...prev, { from: 'bot', text: tutorReply(question, startups[0]?.name || 'your idea') }]); setChatBusy(false); }, 650);
  };
  const handleAuth = (e) => {
    e.preventDefault();
    const name = isRegister ? (authForm.name.trim() || authForm.email.split('@')[0]) : (authForm.email.split('@')[0] || 'Nisha');
    setUser({ name: name.charAt(0).toUpperCase() + name.slice(1), email: authForm.email }); setAuthOpen(false); setAuthForm({ name: '', email: '', password: '' }); notify(isRegister ? 'Account created successfully.' : 'Welcome back!');
  };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Rocket size={25} strokeWidth={2.5}/></div><div><div className="brand-name">EchoPitch</div><div className="brand-tagline">Your Idea. Our Support.</div></div><button className="mobile-close icon-btn" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={20}/></button></div>
      <nav className="side-nav">{navItems.map(({label, icon: Icon}) => <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => changePage(label)}><Icon size={21}/><span>{label}</span>{label === 'AI Tutor' && <span className="nav-new">AI</span>}</button>)}</nav>
      <div className="sidebar-note"><div className="note-icon"><Leaf size={22}/></div><h3>Big ideas<br/>start with<br/>small steps.</h3><p>Keep going, you're building your future!</p><Rocket className="note-rocket" size={37}/></div>
      <div className="sidebar-bottom"><span className="online-dot"/> Your startup journey, together</div>
    </aside>
    {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation"/>}

    <main className="main-area">
      <header className="topbar"><button className="mobile-menu icon-btn" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu/></button>
        <div className="global-search"><Search size={19}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your startup, resources, or ask the AI tutor..." onKeyDown={e => { if(e.key === 'Enter' && search) changePage('My Startups'); }}/>{search && <button className="search-clear" onClick={() => setSearch('')}><X size={15}/></button>}</div>
        <div className="top-actions"><div className="popover-wrap"><button className="icon-btn notification-btn" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Notifications"><Bell size={21}/><span className="notification-dot"/></button>{notificationsOpen && <div className="dropdown notification-menu"><strong>You're all caught up</strong><p>We'll let you know when there's something new.</p></div>}</div><div className="top-divider"/><div className="popover-wrap"><button className="profile-trigger" onClick={() => setProfileOpen(!profileOpen)}><span className="avatar">{(user?.name || 'Guest').charAt(0).toUpperCase()}</span><span className="profile-name">{user?.name || 'Guest'}</span><ChevronDown size={16}/></button>{profileOpen && <div className="dropdown profile-menu"><div className="profile-summary"><strong>{user?.name || 'Guest'}</strong><span>{user?.email || ''}</span></div><button onClick={() => {setProfileOpen(false); changePage('Profile')}}><UserRound size={16}/> My profile</button><button onClick={() => {setProfileOpen(false); setAuthOpen(true); setIsRegister(false)}}><LogOut size={16}/> Switch account / sign in</button></div>}</div></div>
      </header>

      <div className="page-content">
        {search && <div className="search-results-banner"><Search size={16}/> Searching for <strong>“{search}”</strong><span>{filteredStartups.length} matching startup{filteredStartups.length === 1 ? '' : 's'}</span><button onClick={() => changePage('My Startups')}>View results <ArrowRight size={14}/></button></div>}
        {active === 'Home' && <Dashboard startups={startups} readiness={readiness} latestPitch={latestPitch} onNavigate={changePage} onNew={() => setModal('new-startup')} onTutor={sendMessage} />}
        {active === 'My Startups' && (
  <StartupsPage
    startups={filteredStartups}
    onNew={() => setModal('new-startup')}
    onOpen={(s) => {
      setSelectedStartupId(s.id);
      setModal({ type: 'startup-detail', startup: s });
    }}
    onDelete={deleteStartup}
  />
)}
        {active === 'Business Plan' && <BusinessPlan startups={startups} tab={planTab} setTab={setPlanTab} notify={notify} />}
        {active === 'Readiness Checklist' && (
  <ChecklistPage
    checklist={
      startups.find(s => s.id === selectedStartupId)?.checklist ||
      [false, false, false, false, false, false]
    }
    setChecklist={(nextChecklist) => {
      setStartups(prev => prev.map(s =>
        s.id === selectedStartupId
          ? {
              ...s,
              checklist: typeof nextChecklist === 'function'
                ? nextChecklist(s.checklist || Array(6).fill(false))
                : nextChecklist
            }
          : s
      ));
    }}
    readiness={Math.round(
      ((startups.find(s => s.id === selectedStartupId)?.checklist || Array(6).fill(false))
        .filter(Boolean).length / 6) * 100
    )}
    notify={notify}
  />
)}        
        {active === 'Pitch Arena' && <PitchArena pitchAnswers={pitchAnswers} setPitchAnswers={setPitchAnswers} pitchIndex={pitchIndex} setPitchIndex={setPitchIndex} notify={notify} />}
        {active === 'AI Tutor' && <TutorPage messages={messages} sendMessage={sendMessage} chatInput={chatInput} setChatInput={setChatInput} chatBusy={chatBusy} />}
        {active === 'Incubator' && <Incubator notify={notify} />}
        {active === 'Reports' && <Reports startups={startups} readiness={readiness} latestPitch={latestPitch} />}
        {active === 'Profile' && <ProfilePage user={user} setUser={setUser} notify={notify} onAuth={() => setAuthOpen(true)} />}
      </div>
      <footer className="footer"><div className="footer-brand"><span className="footer-logo"><Rocket size={17}/></span><strong>EchoPitch</strong><span className="footer-sep"/> <span>Build</span><b>·</b><span>Learn</span><b>·</b><span>Pitch</span><b>·</b><span>Grow</span></div><span className="footer-motto">Empowering the next generation of entrepreneurs <span>♥</span></span></footer>
    </main>

    {modal === 'new-startup' && <Modal title="Create your startup workspace" subtitle="Every great idea starts somewhere." onClose={() => setModal(null)}><form className="modal-form" onSubmit={addStartup}><label>Startup name<input autoFocus value={newStartup.name} onChange={e => setNewStartup({...newStartup, name:e.target.value})} placeholder="e.g. GreenLoop" required/></label><label>Industry<select value={newStartup.category} onChange={e => setNewStartup({...newStartup, category:e.target.value})}><option>Technology</option><option>Sustainability</option><option>Education</option><option>Health & wellness</option><option>Food & beverage</option><option>Finance</option><option>Other</option></select></label><label>One-line description<textarea value={newStartup.description} onChange={e => setNewStartup({...newStartup, description:e.target.value})} placeholder="What problem will your idea solve?" rows="3"/></label><button className="primary-btn full-btn" type="submit"><Plus size={17}/> Create workspace</button></form></Modal>}
    {modal?.type === 'startup-detail' && <Modal title={modal.startup.name} subtitle={`${modal.startup.category} · ${modal.startup.stage}`} onClose={() => setModal(null)}><div className="detail-progress"><div className="progress-label"><span>Startup progress</span><strong>{calculateProgress(startups.find(s => s.id === modal.startup.id) || modal.startup)}%</strong></div><div className="progress-track"><span style={{width:`${calculateProgress(startups.find(s => s.id === modal.startup.id) || modal.startup)}%`}}/></div></div><p className="detail-description">{modal.startup.description || 'Add a description to clarify the problem you want to solve and the people you want to help.'}</p><div className="detail-grid"><div><span>Next step</span><strong>Validate your idea</strong></div><div><span>Last activity</span><strong>{modal.startup.updated}</strong></div></div><button className="primary-btn full-btn" onClick={() => {setModal(null);changePage('Business Plan')}}>Continue business plan <ArrowRight size={16}/></button></Modal>}
    {authOpen && <Modal title={isRegister ? 'Create your EchoPitch account' : 'Welcome back'} subtitle={isRegister ? 'Your next big idea starts here.' : 'Sign in to pick up where you left off.'} onClose={() => setAuthOpen(false)}><form className="modal-form" onSubmit={handleAuth}>{isRegister && <label>Full name<div className="field-with-icon"><User size={17}/><input value={authForm.name} onChange={e => setAuthForm({...authForm,name:e.target.value})} placeholder="Your name" required/></div></label>}<label>Email address<div className="field-with-icon"><Mail size={17}/><input type="email" value={authForm.email} onChange={e => setAuthForm({...authForm,email:e.target.value})} placeholder="you@example.com" required/></div></label><label>Password<div className="field-with-icon"><LockKeyhole size={17}/><input type={showPassword?'text':'password'} value={authForm.password} onChange={e => setAuthForm({...authForm,password:e.target.value})} placeholder="At least 6 characters" minLength="6" required/><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></label><button className="primary-btn full-btn" type="submit">{isRegister?'Create account':'Sign in'} <ArrowRight size={16}/></button><p className="auth-switch">{isRegister?'Already have an account?':'New to EchoPitch?'} <button type="button" onClick={() => setIsRegister(!isRegister)}>{isRegister?'Sign in':'Create an account'}</button></p><p className="fine-print">Demo experience: account details are stored in this browser only.</p></form></Modal>}
    {toast && <div className="toast"><span className="toast-check"><Check size={15}/></span>{toast}</div>}
  </div>;
}

function Dashboard({ startups, readiness, latestPitch, onNavigate, onNew, onTutor }) {
  return <>
    <section className="hero"><div className="hero-copy"><div className="eyebrow"><Sparkles size={14}/> YOUR NEXT CHAPTER STARTS HERE</div><h1>Turn Your Ideas Into<br/><span>Impactful Startups</span></h1><p>Get guidance. Build your plan. Practice your pitch.<br/>Grow with EchoPitch.</p><button className="primary-btn hero-btn" onClick={onNew}>Start Your Journey <ArrowRight size={18}/></button><div className="hero-proof"><span><span className="proof-avatars">N&nbsp; A&nbsp; R</span></span><span>Built for dreamers and doers</span></div></div><div className="hero-art"><img src={heroImage} alt="A founder working with an AI companion"/><div className="floating-tip"><span className="tip-sparkle"><Sparkles size={17}/></span><div><strong>Great idea!</strong><span>Let's build it step by step.</span></div><span className="tip-bulb">✦</span></div><div className="hero-orb orb-one"/><div className="hero-orb orb-two"/></div></section>
    <div className="stats-grid"><StatCard icon={Lightbulb} label="My Startups" value={startups.length} foot="Active workspaces" tone="purple" onClick={() => onNavigate('My Startups')}/><StatCard icon={ClipboardCheck} label="Readiness Score" value={`${readiness}%`} foot={readiness >= 70 ? 'Looking good' : 'Room to grow'} tone="mint" onClick={() => onNavigate('Readiness Checklist')}/><StatCard icon={Trophy} label="Latest Pitch Score" value={`${latestPitch}%`} foot="Keep improving" tone="orange" onClick={() => onNavigate('Pitch Arena')}/><StatCard icon={GraduationCap} label="Incubator Access" value="0" foot="Programs joined" tone="violet" onClick={() => onNavigate('Incubator')}/></div>
    <section className="journey-panel"><div className="section-heading"><div><h2>Continue Your Journey</h2><p>Pick up where you left off or explore something new.</p></div><button className="text-link" onClick={() => onNavigate('Reports')}>View progress <ArrowRight size={15}/></button></div><div className="journey-grid"><JourneyCard icon={BriefcaseBusiness} title="My Startups" desc="Manage your ideas and build your business plans." tone="lavender" onClick={() => onNavigate('My Startups')}/><JourneyCard icon={ClipboardCheck} title="Readiness Checklist" desc="Track your progress and improve your startup readiness." tone="mint" onClick={() => onNavigate('Readiness Checklist')}/><JourneyCard icon={Trophy} title="Pitch Arena" desc="Practice with investor-style questions and get feedback." tone="peach" onClick={() => onNavigate('Pitch Arena')}/><JourneyCard icon={Bot} title="AI Tutor" desc="Get personalized guidance, feedback and tips." tone="blue" onClick={() => onNavigate('AI Tutor')}/><JourneyCard icon={Landmark} title="Incubator" desc="Explore programs and connect with opportunities." tone="pink" onClick={() => onNavigate('Incubator')}/><JourneyCard icon={ChartNoAxesColumnIncreasing} title="View Reports" desc="See your progress and performance insights." tone="sky" onClick={() => onNavigate('Reports')}/></div></section>
    <section className="bottom-cta"><div className="cta-icon"><WandSparkles size={22}/></div><div><strong>Not sure what to do next?</strong><p>Your AI Tutor can help you find your next best step.</p></div><button className="secondary-btn" onClick={() => {onNavigate('AI Tutor');onTutor('What should I focus on next to build my startup?')}}>Ask your AI Tutor <ArrowRight size={16}/></button></section>
  </>;
}
function StatCard({icon:Icon,label,value,foot,tone,onClick}) { return <button className="stat-card" onClick={onClick}><div className={`stat-icon ${tone}`}><Icon size={21}/></div><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className="stat-foot">{foot}</span><span className="stat-arrow"><ArrowRight size={17}/></span></button>; }
function JourneyCard({icon:Icon,title,desc,tone,onClick}) { return <button className={`journey-card ${tone}`} onClick={onClick}><span className="journey-icon"><Icon size={19}/></span><span className="journey-text"><strong>{title}</strong><span>{desc}</span></span><ArrowRight className="journey-arrow" size={16}/></button>; }
function PageHeader({eyebrow,title,subtitle,action,actionLabel}) { return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>{action && <button className="primary-btn" onClick={action}><Plus size={17}/>{actionLabel}</button>}</div>; }
function StartupsPage({startups,onNew,onOpen,onDelete}) { return <><PageHeader eyebrow="YOUR WORKSPACE" title="My Startups" subtitle="Keep your ideas organized and turn your plans into progress." action={onNew} actionLabel="New startup"/><div className="workspace-toolbar"><div className="toolbar-title"><strong>{startups.length} workspaces</strong><span>Your ideas, all in one place</span></div><span className="filter-chip"><span className="online-dot"/> All startups</span></div>{startups.length ? <div className="startup-grid">{startups.map(s => <article className="startup-card" key={s.id}><div className="startup-card-top"><div className={`startup-logo ${s.color}`}><Rocket size={22}/></div><button className="icon-btn subtle" title="Delete workspace" onClick={() => onDelete(s.id)}><Trash2 size={17}/></button></div><span className="category-label">{s.category}</span><h3>{s.name}</h3><p>{s.description || 'Your idea is taking shape. Add a description and start validating your concept.'}</p><div className="progress-label"><span>Overall progress</span><strong>{calculateProgress(s)}%</strong></div><div className="progress-track"><span style={{width:`${calculateProgress(s)}%`}}/></div><div className="startup-card-footer"><span><span className="stage-dot"/>{s.stage}</span><button className="text-link" onClick={() => onOpen(s)}>Open workspace <ArrowRight size={15}/></button></div></article>)}</div> : <EmptyState icon={Lightbulb} title="Your next big idea belongs here" desc="Create a startup workspace to begin shaping your idea into a business." action={onNew} actionLabel="Create your first startup"/>}</>; }
function BusinessPlan({startups,tab,setTab,notify}) { const sections = ['Overview','Problem','Solution','Market','Business model','Go-to-market']; const [fields,setFields] = useState(() => JSON.parse(localStorage.getItem('echopitch-plan')||'{}')); const update = (key,value) => setFields(prev => {const next={...prev,[key]:value};localStorage.setItem('echopitch-plan',JSON.stringify(next));return next;}); const prompts = {Overview:['Executive summary','Describe your startup in a few sentences.'],Problem:['The problem','What specific problem are you solving, and who experiences it?'],Solution:['Your solution','How does your product or service solve this problem?'],Market:['Target market','Who are your ideal customers? Estimate your market size.'],'Business model':['Revenue model','How will your startup earn money?'],'Go-to-market':['Marketing & growth','How will your first customers discover you?']}; const [heading,placeholder]=prompts[tab]; return <><PageHeader eyebrow="PLAN WITH PURPOSE" title="Business Plan" subtitle="Turn a promising idea into a clear, actionable business plan."/><div className="plan-layout"><aside className="plan-sidebar"><span className="small-label">YOUR PLAN</span>{sections.map((s,i)=><button className={`plan-nav ${tab===s?'selected':''}`} onClick={()=>setTab(s)} key={s}><span className="plan-step">{i+1}</span>{s}<ChevronRight size={15}/></button>)}<div className="plan-tip"><Sparkles size={17}/><strong>Make it specific</strong><p>Clear, concise plans are easier to test and improve.</p></div></aside><div className="plan-editor"><div className="editor-top"><div><span className="draft-tag"><span/> DRAFT</span><h2>{heading}</h2><p>{placeholder}</p></div><span className="editor-symbol"><FileText size={23}/></span></div><label className="editor-label">{tab === 'Overview' ? 'Executive summary' : heading}<textarea rows="8" value={fields[tab]||''} onChange={e=>update(tab,e.target.value)} placeholder={tab === 'Overview' ? 'We help [target customer] solve [problem] by offering [solution]...' : `Write your ${tab.toLowerCase()} here. Be clear, specific, and customer-focused.`}/></label><div className="editor-actions"><span><Save size={15}/> Saved automatically in this browser</span><button className="primary-btn" onClick={()=>notify(`${tab} section saved.`)}>Save section <Check size={16}/></button></div><div className="editor-next"><div><strong>{tab === 'Go-to-market'?'Your plan is taking shape':'Up next: '+sections[Math.min(sections.indexOf(tab)+1,sections.length-1)]}</strong><p>Build your plan one section at a time. You can come back anytime.</p></div><button className="round-arrow" onClick={()=>setTab(sections[(sections.indexOf(tab)+1)%sections.length])}><ArrowRight size={18}/></button></div></div></div></>; }
function ChecklistPage({checklist,setChecklist,readiness,notify}) { return <><PageHeader eyebrow="SMALL STEPS, BIG PROGRESS" title="Readiness Checklist" subtitle="A practical roadmap to help you move from idea to launch."/><div className="readiness-layout"><div className="readiness-card"><div className="readiness-score-ring" style={{'--score':`${readiness*3.6}deg`}}><div><strong>{readiness}%</strong><span>READY</span></div></div><div className="readiness-copy"><h2>You're making progress!</h2><p>Complete the steps below to strengthen your startup foundations. Progress is saved automatically.</p><div className="progress-track wide"><span style={{width:`${readiness}%`}}/></div><div className="progress-label"><span>{checklist.filter(Boolean).length} of {checklist.length} steps complete</span><strong>{readiness}%</strong></div></div></div><div className="checklist-panel"><div className="section-heading"><div><h2>Your action plan</h2><p>Check off each step as you complete it.</p></div><span className="count-pill">{checklist.filter(Boolean).length}/{checklist.length}</span></div><div className="checklist-items">{checklistItems.map((item,i)=><label className={`checklist-item ${checklist[i]?'done':''}`} key={item.title}><input type="checkbox" checked={!!checklist[i]} onChange={e=>{setChecklist(prev=>prev.map((v,j)=>i===j?e.target.checked:v));}}/><span className="custom-check"><Check size={15}/></span><span className="checklist-text"><strong>{item.title}</strong><span>{item.desc}</span></span><span className="check-number">{String(i+1).padStart(2,'0')}</span></label>)}</div><button className="secondary-btn" onClick={()=>{setChecklist(Array(6).fill(false));notify('Checklist reset. Start fresh whenever you need.')}}>Reset checklist</button></div></div></>; }
const pitchQuestions = [{title:'The problem',question:'What important problem are you solving, and who experiences it?',hint:'Be specific about the people affected and why the problem matters.'},{title:'Your solution',question:'How does your product or service solve that problem better than current alternatives?',hint:'Focus on your key benefit, not a long list of features.'},{title:'Your market',question:'Who is your ideal customer, and how big is the opportunity?',hint:'Describe a real customer group and what you know about their needs.'},{title:'Your business model',question:'How will you make money and build a sustainable business?',hint:'Mention your pricing, revenue source, or how you will test willingness to pay.'},{title:'Your advantage',question:'Why is your team or approach the right one to make this happen?',hint:'Share your insight, experience, technology, or differentiator.'}];
function PitchArena({pitchAnswers,setPitchAnswers,pitchIndex,setPitchIndex,notify}) { const q=pitchQuestions[pitchIndex]; const [draft,setDraft]=useState(pitchAnswers[pitchIndex]||''); const [feedback,setFeedback]=useState(null); useEffect(()=>{setDraft(pitchAnswers[pitchIndex]||'');setFeedback(null)},[pitchIndex,pitchAnswers]); const answered=Object.values(pitchAnswers).filter(v=>v.trim()).length; const score=Math.min(96,62+answered*6); const submit=()=>{if(!draft.trim()){setFeedback({title:'Add a little detail first',body:'Write a few sentences so we can give you useful, specific feedback.'});return;}setPitchAnswers(prev=>({...prev,[pitchIndex]:draft}));setFeedback({title:'A solid start!',body:draft.length<100?'Try adding one concrete example or customer insight. Specific details make a pitch more memorable.':'Great detail. For an even stronger pitch, lead with the customer impact and finish with one clear, memorable benefit.'});};return <><PageHeader eyebrow="FIND YOUR VOICE" title="Pitch Arena" subtitle="Practice answering the questions investors care about. No pressure — just progress."/><div className="pitch-layout"><div className="pitch-main"><div className="pitch-progress-head"><div><span className="small-label">PRACTICE ROUND</span><h2>Build your investor pitch</h2></div><span className="round-pill"><Trophy size={15}/> {answered}/5 answered</span></div><div className="pitch-progress-dots">{pitchQuestions.map((_,i)=><button key={i} onClick={()=>setPitchIndex(i)} className={`${i===pitchIndex?'current':''} ${pitchAnswers[i]?'answered':''}`} aria-label={`Question ${i+1}`}/>)}</div><div className="question-card"><div className="question-number">QUESTION {String(pitchIndex+1).padStart(2,'0')} <span>OF 05</span></div><span className="question-icon"><Target size={23}/></span><h2>{q.title}</h2><p>{q.question}</p><div className="coach-hint"><Sparkles size={16}/><span><strong>Coach's tip</strong>{q.hint}</span></div><label className="pitch-answer-label">Your answer<textarea value={draft} onChange={e=>setDraft(e.target.value)} rows="6" placeholder="Take a moment to think. Write your answer in your own words..."/></label>{feedback&&<div className="feedback-box"><span className="feedback-icon"><Star size={17}/></span><div><strong>{feedback.title}</strong><p>{feedback.body}</p></div></div>}<div className="pitch-controls"><button className="secondary-btn" disabled={pitchIndex===0} onClick={()=>setPitchIndex(i=>i-1)}>Previous</button><button className="primary-btn" onClick={submit}>Get feedback <Sparkles size={16}/></button><button className="next-link" onClick={()=>setPitchIndex(i=>(i+1)%pitchQuestions.length)}>Next question <ArrowRight size={15}/></button></div></div></div><aside className="pitch-aside"><div className="pitch-score-card"><div className="score-trophy"><Trophy size={24}/></div><span className="small-label">YOUR PRACTICE SCORE</span><div className="pitch-score-value">{score}<small>/100</small></div><div className="score-track"><span style={{width:`${score}%`}}/></div><p>{answered===5?'All questions answered — fantastic work!':'Answer questions to build your score and confidence.'}</p></div><div className="pitch-checkpoints"><h3>What makes a great pitch?</h3>{['A clear, relatable problem','A simple and compelling solution','A defined target customer','A credible path to revenue','A memorable closing'].map((s,i)=><div key={s} className="pitch-checkpoint"><span className={pitchAnswers[i]?'checkpoint-done':''}>{pitchAnswers[i]?<Check size={13}/>:i+1}</span>{s}</div>)}</div><div className="mentor-mini"><span><Bot size={19}/></span><div><strong>Need a little help?</strong><p>Your AI Tutor can help sharpen your answers.</p></div></div></aside></div></>; }
function TutorPage({messages,sendMessage,chatInput,setChatInput,chatBusy}) { const bottomRef = React.useRef(null); useEffect(()=>bottomRef.current?.scrollIntoView({behavior:'smooth'}),[messages,chatBusy]);const suggestions=['Help me create a business plan','Improve my pitch','Give me startup ideas','Check my readiness score'];return <><PageHeader eyebrow="YOUR ALWAYS-ON MENTOR" title="AI Tutor" subtitle="Think out loud, ask questions, and get practical next steps for your startup."/><div className="tutor-page-layout"><div className="tutor-chat-large"><div className="chat-topline"><div className="tutor-avatar"><Bot size={24}/><span/></div><div><strong>EchoPitch AI Tutor</strong><span><span className="online-dot"/> Online · Ready to help</span></div><span className="powered-tag"><Sparkles size={13}/> Startup coach</span></div><div className="chat-history">{messages.map((m,i)=><div className={`chat-row ${m.from}`} key={i}>{m.from==='bot'&&<span className="chat-mini-avatar"><Bot size={17}/></span>}<div className="chat-bubble">{m.text}</div>{m.from==='user'&&<span className="chat-user-avatar">{'N'}</span>}</div>)}{chatBusy&&<div className="chat-row bot"><span className="chat-mini-avatar"><Bot size={17}/></span><div className="chat-bubble typing"><i/><i/><i/></div></div>}<div ref={bottomRef}/></div><div className="suggestion-row">{suggestions.map(s=><button key={s} onClick={()=>sendMessage(s)}>{s}</button>)}</div><form className="chat-compose" onSubmit={e=>{e.preventDefault();sendMessage()}}><input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Ask anything about your startup..."/><button className="send-btn" type="submit" disabled={!chatInput.trim()||chatBusy} aria-label="Send message"><Send size={18}/></button></form><div className="chat-disclaimer">AI-generated guidance can be a starting point. Validate important business decisions with real customers and experts.</div></div><aside className="tutor-side"><div className="tutor-welcome"><div className="welcome-sparkle"><Sparkles size={20}/></div><h3>Let's make your idea happen.</h3><p>Tell me where you are in your journey, and we'll work through the next step together.</p></div><div className="topic-list"><span className="small-label">I CAN HELP WITH</span>{[{icon:FileText,title:'Business planning',desc:'Structure your idea into a plan'},{icon:MessageCircle,title:'Pitch feedback',desc:'Make your story more compelling'},{icon:TrendingUp,title:'Market validation',desc:'Understand customers and demand'},{icon:Zap,title:'Next-step coaching',desc:'Find your most useful next action'}].map(({icon:Icon,title,desc})=><button key={title} onClick={()=>sendMessage(`Help me with ${title.toLowerCase()}. ${desc}.`)}><span><Icon size={18}/></span><div><strong>{title}</strong><small>{desc}</small></div><ChevronRight size={16}/></button>)}</div></aside></div></>; }
function Incubator({notify}) {const programs=[{name:'Launchpad Essentials',type:'FOUNDATION',desc:'Build the foundations: customer discovery, business models and your first plan.',duration:'4 weeks',tone:'lavender',status:'Open for applications'},{name:'Impact Innovators',type:'SOCIAL IMPACT',desc:'For founders building solutions that make communities and the planet stronger.',duration:'8 weeks',tone:'mint',status:'Applications open'},{name:'Pitch Ready',type:'PITCH & FUNDING',desc:'Sharpen your story, understand investor expectations and practice with mentors.',duration:'2 weeks',tone:'peach',status:'Join the waitlist'}];const [joined,setJoined]=useState([]);return <><PageHeader eyebrow="GROW WITH A COMMUNITY" title="Incubator Programs" subtitle="Find the structure, mentors, and momentum to take your idea further."/><div className="incubator-banner"><div className="incubator-banner-icon"><Landmark size={28}/></div><div><span>YOUR NEXT MILESTONE</span><h2>You don't have to build alone.</h2><p>Explore founder-friendly programs designed to help you learn by doing.</p></div><div className="incubator-decoration"><Rocket size={64}/></div></div><div className="section-heading programs-heading"><div><h2>Programs for your stage</h2><p>Choose a path that matches your goals.</p></div><span className="count-pill">3 programs</span></div><div className="program-grid">{programs.map((p,i)=><article className="program-card" key={p.name}><div className={`program-art ${p.tone}`}><span className="program-index">0{i+1}</span>{i===0?<Lightbulb size={38}/>:i===1?<Leaf size={38}/>:<Trophy size={38}/>}</div><div className="program-content"><span className="category-label">{p.type}</span><h3>{p.name}</h3><p>{p.desc}</p><div className="program-meta"><span><Clock3 size={15}/>{p.duration}</span><span className="open-status"><span/> {p.status}</span></div><button className={joined.includes(p.name)?'secondary-btn full-btn':'primary-btn full-btn'} onClick={()=>{setJoined(prev=>prev.includes(p.name)?prev.filter(x=>x!==p.name):[...prev,p.name]);notify(joined.includes(p.name)?'Program removed from your list.':`You're interested in ${p.name}!`);}}>{joined.includes(p.name)?<><Check size={16}/> Added to your list</>:<>Explore program <ArrowRight size={16}/></>}</button></div></article>)}</div></>; }
function Reports({startups,readiness,latestPitch}) {const activities=[{title:'Readiness checklist updated',desc:'Keep building your startup foundations.',time:'Today',icon:ClipboardCheck,tone:'mint'},{title:'Pitch Arena is ready',desc:'Practice your answers and improve your score.',time:'Anytime',icon:Trophy,tone:'peach'},{title:'Business plan workspace',desc:'Capture your ideas in a structured plan.',time:'In progress',icon:FileText,tone:'lavender'}];return <><PageHeader eyebrow="YOUR MOMENTUM AT A GLANCE" title="Progress Reports" subtitle="See how your startup journey is moving forward."/><div className="report-metrics"><div className="report-metric"><span className="report-icon lavender"><BriefcaseBusiness size={20}/></span><span>Startup workspaces</span><strong>{startups.length}</strong><small>Ideas in your pipeline</small></div><div className="report-metric"><span className="report-icon mint"><CircleCheck size={20}/></span><span>Readiness</span><strong>{readiness}%</strong><small>Checklist completion</small><div className="mini-progress"><span style={{width:`${readiness}%`}}/></div></div><div className="report-metric"><span className="report-icon peach"><Trophy size={20}/></span><span>Pitch practice</span><strong>{latestPitch}%</strong><small>Practice score</small><div className="mini-progress"><span style={{width:`${latestPitch}%`}}/></div></div></div><div className="reports-lower"><section className="report-panel"><div className="section-heading"><div><h2>Journey snapshot</h2><p>Your current activity at a glance.</p></div><span className="count-pill">This week</span></div><div className="activity-list">{activities.map(({title,desc,time,icon:Icon,tone})=><div className="activity-row" key={title}><span className={`activity-icon ${tone}`}><Icon size={18}/></span><div><strong>{title}</strong><p>{desc}</p></div><span className="activity-time">{time}</span></div>)}</div></section><section className="report-panel insight-panel"><div className="insight-icon"><Sparkles size={21}/></div><span className="small-label">YOUR NEXT OPPORTUNITY</span><h2>Consistency beats perfection.</h2><p>Small, regular actions help you learn faster. Pick one checklist item and make progress on it this week.</p></section></div></>; }
function ProfilePage({user,setUser,notify,onAuth}) {const [form,setForm]=useState(user);useEffect(()=>setForm(user),[user]);return <><PageHeader eyebrow="YOUR ACCOUNT" title="Profile & Settings" subtitle="Manage your details and make EchoPitch feel like yours."/><div className="profile-layout"><div className="profile-card"><div className="profile-cover"><div className="profile-big-avatar">{user.name.charAt(0).toUpperCase()}</div></div><div className="profile-card-body"><h2>{user.name}</h2><p>{user.email}</p><span className="member-pill"><Star size={13}/> Founder in progress</span><div className="profile-mini-stats"><div><strong> {user.name?user.name.length+1:1}</strong><span>Steps taken</span></div><div><strong>3</strong><span>Programs to explore</span></div></div><button className="secondary-btn full-btn" onClick={onAuth}>Switch account / sign in</button></div></div><form className="profile-edit panel" onSubmit={e=>{e.preventDefault();setUser(form);notify('Profile updated successfully.')}}><div className="section-heading"><div><h2>Personal information</h2><p>Keep your account details up to date.</p></div></div><label>Full name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></label><label>Email address<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></label><div className="settings-note"><LockKeyhole size={17}/><span><strong>Your information stays in this browser</strong><small>This demo stores profile data locally. Connect a backend to support secure accounts across devices.</small></span></div><button className="primary-btn" type="submit"><Save size={16}/> Save changes</button></form></div></>; }
function EmptyState({icon:Icon,title,desc,action,actionLabel}) {return <div className="empty-state"><span><Icon size={28}/></span><h2>{title}</h2><p>{desc}</p><button className="primary-btn" onClick={action}><Plus size={16}/>{actionLabel}</button></div>;}
function Modal({title,subtitle,onClose,children}) {return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="modal-card"><button className="modal-close icon-btn" onClick={onClose} aria-label="Close modal"><X size={19}/></button><div className="modal-heading"><span className="modal-symbol"><Sparkles size={20}/></span><h2>{title}</h2><p>{subtitle}</p></div>{children}</div></div>;}
function tutorReply(question, startupName) {const q=question.toLowerCase();if(q.includes('business plan')||q.includes('plan'))return 'Absolutely — let’s make your business plan practical. Start with these five pieces: (1) the customer problem, (2) your solution, (3) who will pay for it, (4) how you will reach those customers, and (5) your main costs and revenue. Keep each section clear and test your assumptions with real people. Want to start with the problem you are solving?';if(q.includes('pitch'))return 'Let’s sharpen your pitch. A strong 60-second pitch usually follows this flow: hook → customer problem → your solution → why it is different → the opportunity → your ask. Try opening with a specific customer situation rather than a broad claim. Share your current pitch and I’ll help you make it clearer and more memorable.';if(q.includes('idea'))return 'Let’s find an idea that fits you. Look for a repeated frustration in a community you understand, a task people already spend time or money solving, or a service that could be simpler or more accessible. Three useful starting areas are sustainable everyday products, student services, and local-business tools. Which people or problems do you care most about?';if(q.includes('readiness')||q.includes('score'))return 'Your readiness score comes from the checklist on your dashboard. The most valuable early steps are talking to potential customers, validating that the problem is real, and researching alternatives. You don’t need every answer before you begin — use the checklist to identify one small next step, then learn from it.';if(q.includes('market')||q.includes('customer'))return 'Start market validation by speaking with 5–10 people who match your target customer. Ask how they solve the problem today, what is frustrating about that process, and what they have already tried. Avoid asking only “Would you use my idea?” — people are more helpful when describing real past behaviour. Write down repeated patterns before deciding what to build.';if(q.includes('next')||q.includes('focus'))return `For ${startupName}, I’d focus on one learning milestone rather than trying to do everything. First, write the problem in one sentence. Next, speak to five potential customers and note what you learn. Then update your solution based on those conversations. If you have already done that, move to a simple business model and test how the idea could earn revenue. What stage are you at today?`;return 'Good question. Let’s break it into a manageable next step. First, describe the customer you want to help and the problem they face. Then we can compare possible solutions, identify what makes yours different, and decide how to test it with minimal time and cost. If you share a little more about your idea, I can give you more tailored guidance.';}

createRoot(document.getElementById('root')).render(<App/>);
