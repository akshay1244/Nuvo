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
