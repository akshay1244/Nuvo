<<<<<<< HEAD
import { useState } from 'react';

const featureCards = [
  {
    title: 'Private by design',
    description: 'A calm, secure space for your ideas, memories, and daily momentum.',
  },
  {
    title: 'Adaptive AI',
    description: 'Nuvo learns your rhythm so it can help before you even ask.',
  },
  {
    title: 'Waitlist-first access',
    description: 'Be the first to try the experience when it opens to early adopters.',
  },
];

function App() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) return;

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('nuvo-waitlist-email', email.trim());
    }

    setSubmitted(true);
    setEmail('');
  };

  return (
    <div className="waitlist-shell">
      <div className="ambient-bg" />
      <header className="hero-shell">
        <nav className="top-nav">
          <div className="brand-mark">NUVO</div>
          <a className="nav-link" href="#join">Join waitlist</a>
        </nav>

        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">Early access · waitlist open</p>
            <h1>The calm, adaptive AI that grows with you.</h1>
            <p className="hero-text">
              Nuvo is building a private AI companion for memory, creativity, and momentum. Join the waitlist to get first access when we open the doors.
            </p>

            <form className="waitlist-form" onSubmit={handleSubmit} id="join">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                required
              />
              <button className="primary-button" type="submit">Join waitlist</button>
            </form>

            {submitted ? (
              <p className="message-line">You are on the list. We will reach out with early access updates soon.</p>
            ) : (
              <p className="tiny-copy">No spam. Just launch updates and early access invites.</p>
            )}
          </div>

          <div className="hero-orb" aria-hidden="true">
            <div className="orb-core" />
            <div className="orb-ring ring-one" />
            <div className="orb-ring ring-two" />
            <div className="orb-pulse" />
          </div>
        </div>
      </header>

      <main>
        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">Why Nuvo</p>
            <h2>Designed for people who want AI that feels personal, private, and useful.</h2>
          </div>
          <div className="feature-grid">
            {featureCards.map((card) => (
              <article key={card.title} className="feature-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block cta-panel">
          <p className="eyebrow">Coming soon</p>
          <h2>Be first in line for the launch.</h2>
          <p>We are opening the waitlist for early adopters, creators, and curious builders who want a more thoughtful AI experience.</p>
        </section>
      </main>
    </div>
  );
}

export default App;
=======
import { useEffect, useMemo, useState } from 'react';
import {
  getInitialSession,
  resetPassword,
  signIn withEmail,
  signOutUser,
  signUpWithEmail,
  uploadPhotoFile,
  getStoredPhotos,
  getStoredProfile,
} from './lib/supabase';

const featureCards = [
  { title: 'AI conversations', description: 'Natural, context-rich dialogue that feels like a thoughtful companion.', accent: 'cyan' },
  { title: 'Photo understanding', description: 'Turn your memories into searchable, meaningful stories.', accent: 'violet' },
  { title: 'Personal workspace', description: 'Gather notes, tasks, and goals in one luminous environment.', accent: 'blue' },
  { title: 'Creativity tools', description: 'Generate polished ideas, concepts, and visual directions instantly.', accent: 'magenta' },
  { title: 'Productivity flow', description: 'Automate routines with calm, intelligent assistance.', accent: 'mint' },
  { title: 'Secure memories', description: 'Your photos and profiles stay protected with Supabase RLS policies.', accent: 'gold' },
];

const navItems = [
  { id: 'dashboard', label: 'Overview' },
  { id: 'photos', label: 'Photos' },
  { id: 'chat', label: 'Chat' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'profile', label: 'Profile' },
];

const sampleMessages = [
  { sender: 'Nuvo', text: 'Your week is opening up beautifully. I prepared a calm plan for your launch sprint.' },
  { sender: 'You', text: 'Please turn that into a focused checklist with three priorities.' },
  { sender: 'Nuvo', text: 'Absolutely — I grouped them into momentum, polish, and follow-up.' },
];

const sampleTasks = [
  { title: 'Ship onboarding journey', meta: 'Priority · 3 tasks' },
  { title: 'Curate launch photos', meta: 'Today · 2 edits' },
  { title: 'Draft product narrative', meta: 'Tomorrow · 1 review' },
];

const sampleIdeas = [
  'Turn your morning notes into a guided ritual.',
  'Create a visual memory board for your best moments.',
  'Use Nuvo to summarize your daily momentum before bed.',
];

function App() {
  const [view, setView] = useState('landing');
  const [authMode, setAuthMode] = useState('signup');
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [photos, setPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const bootstrap = async () => {
      const initial = await getInitialSession();
      if (initial?.user) {
        setSession(initial);
        setProfile(initial.profile || await getStoredProfile(initial.user.id));
        setPhotos(await getStoredPhotos(initial.user.id));
        setView('dashboard');
        setActiveTab('dashboard');
      }
      setLoading(false);
    };

    bootstrap();
  }, []);

  const heroLabel = useMemo(() => (session ? 'Signed in and ready' : 'Premium AI companion'), [session]);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (authMode === 'signup') {
      if (form.password !== form.confirmPassword) {
        setMessage('Passwords do not match.');
        return;
      }

      const result = await signUpWithEmail({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (result?.user) {
        setSession(result);
        setProfile(result.profile);
        setPhotos(result.photos || []);
        setView('dashboard');
        setActiveTab('dashboard');
        return;
      }

      setMessage(result?.message || 'Unable to create account.');
      return;
    }

    const result = await signIn withEmail({ email: form.email, password: form.password });
    if (result?.user) {
      setSession(result);
      setProfile(result.profile);
      setPhotos(result.photos || []);
      setView('dashboard');
      setActiveTab('dashboard');
      return;
    }

    setMessage(result?.message || 'Unable to sign in.');
  };

  const handleGoogle = () => {
    setMessage('Google OAuth is ready for Supabase when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured.');
  };

  const handleForgotPassword = async () => {
    const result = await resetPassword(form.email);
    setMessage(result?.message || 'If the address exists, a reset link is on the way.');
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user) return;

    const uploaded = await uploadPhotoFile(file, session.user.id);
    setPhotos((current) => [uploaded, ...current]);
    setMessage('Photo added to your private gallery.');
  };

  const handleSignOut = async () => {
    await signOutUser();
    setSession(null);
    setProfile(null);
    setPhotos([]);
    setView('landing');
    setActiveTab('dashboard');
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'photos':
        return (
          <section className="main-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Photos</p>
                <h2>Private memory gallery</h2>
              </div>
              <label className="mini-button">
                <input type="file" accept="image/*" onChange={handleUpload} />
                + Upload
              </label>
            </div>

            <div className="photo-grid">
              {photos.length ? photos.map((photo) => (
                <article key={photo.id} className="photo-card">
                  <div className="photo-image" style={{ backgroundImage: `url(${photo.url})` }} />
                  <div className="photo-meta">
                    <strong>{photo.title}</strong>
                    <span>{photo.description}</span>
                  </div>
                </article>
              )) : (
                <article className="photo-card empty-card">
                  <h3>Your gallery will appear here</h3>
                  <p>Upload a photo and it will be stored securely via Supabase when configured.</p>
                </article>
              )}
            </div>
          </section>
        );
      case 'chat':
        return (
          <section className="main-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Chat</p>
                <h2>Nuvo conversation</h2>
              </div>
              <button className="mini-button">+ Voice</button>
            </div>
            <div className="chat-shell">
              <div className="chat-thread">
                {sampleMessages.map((messageItem) => (
                  <div key={messageItem.text} className={`chat-bubble ${messageItem.sender === 'You' ? 'mine' : ''}`}>
                    <strong>{messageItem.sender}</strong>
                    <p>{messageItem.text}</p>
                  </div>
                ))}
              </div>
              <div className="composer">
                <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask Nuvo anything..." />
                <button className="mini-button">Send</button>
              </div>
            </div>
          </section>
        );
      case 'workspace':
        return (
          <section className="main-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Workspace</p>
                <h2>Notes, tasks, and goals</h2>
              </div>
            </div>
            <div className="workspace-grid">
              <article className="workspace-card">
                <h3>Notes</h3>
                <p>Build a personal operating system for your ideas, plans, and reflections.</p>
              </article>
              <article className="workspace-card">
                <h3>Tasks</h3>
                <ul>
                  {sampleTasks.map((task) => <li key={task.title}>{task.title} <span>{task.meta}</span></li>)}
                </ul>
              </article>
              <article className="workspace-card">
                <h3>Goals</h3>
                <ul>
                  {sampleIdeas.map((idea) => <li key={idea}>{idea}</li>)}
                </ul>
              </article>
            </div>
          </section>
        );
      case 'profile':
        return (
          <section className="main-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Profile</p>
                <h2>Account and preferences</h2>
              </div>
            </div>
            <div className="profile-grid">
              <article className="workspace-card">
                <h3>Account</h3>
                <p>{profile?.full_name || profile?.name || session?.user?.email || 'Your profile is ready'}</p>
                <p>{session?.user?.email}</p>
              </article>
              <article className="workspace-card">
                <h3>Preferences</h3>
                <p>Theme: Aurora Night</p>
                <p>Memory mode: Private and secure</p>
              </article>
            </div>
          </section>
        );
      default:
        return (
          <section className="main-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Welcome back</p>
                <h2>{profile?.full_name ? `Hello, ${profile.full_name}` : 'Welcome to Nuvo'}</h2>
              </div>
            </div>
            <div className="overview-grid">
              <article className="overview-card accent-card">
                <h3>Recent conversations</h3>
                <p>Three thoughtful threads are waiting for you.</p>
              </article>
              <article className="overview-card">
                <h3>Photo gallery preview</h3>
                <p>{photos.length ? `${photos.length} private memories ready` : 'Your gallery is empty until you upload your first memory.'}</p>
              </article>
              <article className="overview-card">
                <h3>Tasks and goals</h3>
                <ul>
                  {sampleTasks.slice(0, 2).map((task) => <li key={task.title}>{task.title}</li>)}
                </ul>
              </article>
              <article className="overview-card">
                <h3>Saved ideas</h3>
                <ul>
                  {sampleIdeas.map((idea) => <li key={idea}>{idea}</li>)}
                </ul>
              </article>
            </div>
          </section>
        );
    }
  };

  if (loading) {
    return <div className="loading-state">Preparing Nuvo experience…</div>;
  }

  if (view === 'landing') {
    return (
      <div className="app-shell">
        <div className="ambient-bg" />
        <header className="hero-shell">
          <nav className="top-nav">
            <div className="brand-mark">NUVO</div>
            <div className="top-nav-links">
              <a href="#features">Features</a>
              <a href="#auth">Secure sign in</a>
            </div>
            <button className="ghost-button" onClick={() => { setAuthMode('login'); setView('auth'); }}>Log in</button>
          </nav>

          <div className="hero-content">
            <div className="hero-copy">
              <p className="eyebrow">{heroLabel}</p>
              <h1>Your personal AI companion for everything that matters.</h1>
              <p className="hero-text">Nuvo blends conversations, photo memory, creativity, and productivity into one premium experience that feels alive, secure, and beautifully intuitive.</p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => { setAuthMode('signup'); setView('auth'); }}>Get started</button>
                <button className="secondary-button" onClick={() => { setAuthMode('login'); setView('auth'); }}>Log in</button>
              </div>
              <div className="hero-badges">
                <span>3D immersive UI</span>
                <span>Supabase ready</span>
                <span>RLS protected</span>
              </div>
            </div>

            <div className="hero-orb">
              <div className="orb-core" />
              <div className="orb-ring ring-one" />
              <div className="orb-ring ring-two" />
              <div className="orb-pulse" />
            </div>
          </div>
        </header>

        <main>
          <section id="features" className="section-block">
            <div className="section-heading">
              <p className="eyebrow">Product showcase</p>
              <h2>Designed to feel like your smartest place on the planet.</h2>
            </div>
            <div className="feature-grid">
              {featureCards.map((card) => (
                <article key={card.title} className={`feature-card ${card.accent}`}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="auth" className="section-block auth-section">
            <div className="auth-preview-card">
              <p className="eyebrow">Authentication</p>
              <h2>Sign up or log in in a fluid glass card experience.</h2>
              <p>Fresh onboarding, password reset flow, and Google-ready entry points are built in for the premium product experience.</p>
            </div>
            <div className="auth-preview-card compact">
              <button className="primary-button full" onClick={() => { setAuthMode('signup'); setView('auth'); }}>Create account</button>
              <button className="secondary-button full" onClick={() => { setAuthMode('login'); setView('auth'); }}>Open login</button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (view === 'auth') {
    return (
      <div className="auth-page">
        <div className="ambient-bg" />
        <div className="auth-card">
          <div className="auth-card-header">
            <p className="eyebrow">{authMode === 'signup' ? 'Create account' : 'Welcome back'}</p>
            <h2>{authMode === 'signup' ? 'Start your Nuvo journey' : 'Continue your flow'}</h2>
            <p>Glass, motion, and clarity designed for a premium AI product launch.</p>
          </div>

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {authMode === 'signup' && (
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Name" required />
            )}
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" required />
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password" required />
            {authMode === 'signup' && (
              <input type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} placeholder="Confirm password" required />
            )}
            <button className="primary-button full" type="submit">{authMode === 'signup' ? 'Create account' : 'Log in'}</button>
            <button type="button" className="secondary-button full" onClick={handleGoogle}>Continue with Google</button>
          </form>

          {message && <p className="message-line">{message}</p>}

          <div className="auth-links">
            {authMode === 'signup' ? (
              <button type="button" onClick={() => { setAuthMode('login'); setMessage(''); }}>Already have an account? Log in</button>
            ) : (
              <>
                <button type="button" onClick={() => { setAuthMode('signup'); setMessage(''); }}>Create an account</button>
                <button type="button" onClick={handleForgotPassword}>Forgot password?</button>
              </>
            )}
            <button type="button" onClick={() => setView('landing')}>Back home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand-mark">NUVO</div>
        <p className="sidebar-copy">Your luminous personal operating system.</p>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button key={item.id} className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <button className="secondary-button full" onClick={handleSignOut}>Log out</button>
      </aside>
      <main className="dashboard-main">{renderMainContent()}</main>
    </div>
  );
}

export default App;
>>>>>>> 9c0505cfc5bc9955de9d3b63242791d835c527f8
