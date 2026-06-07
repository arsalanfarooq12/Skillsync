import "./LandingPage.css";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const focusEmail = () => {
    document.querySelector(".cta-input")?.focus();
  };

  return (
    <>
      {/* NAV */}
      <nav>
        <div className="nav-logo">
          Skill<span>Sync</span>
        </div>

        <ul className="nav-links">
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#how">How it works</a>
          </li>
          <li>
            <a href="#community">Community</a>
          </li>
        </ul>
        <div className="nav-actions">
          <Link
            to="/login"
            className="btn-ghost "
            style={{ padding: "0.9rem 2rem", marginRight: "1rem" }}
          >
            Log in
          </Link>
          <Link className="nav-cta" to="/register">
            Sign Up Free
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>

        <div className="hero-tag fade-up delay-1">
          <span className="dot"></span>
          Now in open beta — join for free
        </div>

        <h1 className="hero-headline fade-up delay-2">
          Share Skills.
          <br />
          <span className="line-accent">Grow Together.</span>
          <br />
          <span className="line-green">No Limits.</span>
        </h1>

        <p className="hero-sub fade-up delay-3">
          SkillSync connects students and learners with real people who've
          mastered what you want to learn. Every skill. Every level. One
          thriving community.
        </p>

        <div className="hero-actions fade-up delay-4">
          <a className="btn-primary" href="#cta">
            Sign Up for Free <span className="arrow">→</span>
          </a>

          <a className="btn-ghost" href="#how">
            See how it works
          </a>
        </div>

        <div className="hero-stats fade-up delay-5">
          <div>
            <div className="stat-num">Increasing</div>
            <div className="stat-label">Active learners</div>
          </div>

          <div>
            <div className="stat-num">Daily</div>
            <div className="stat-label">Skills shared</div>
          </div>

          <div>
            <div className="stat-num">High</div>
            <div className="stat-label"> Satisfaction rate</div>
          </div>
        </div>

        <div className="hero-float">
          <div className="skill-pill">
            <span className="icon">🎸</span>
            <span className="name">Guitar Basics</span>
            <span className="badge">Live now</span>
          </div>

          <div className="skill-pill">
            <span className="icon">🎨</span>
            <span className="name">UI Design</span>
            <span className="badge">12 learners</span>
          </div>

          <div className="skill-pill">
            <span className="icon">🗣️</span>
            <span className="name">Public Speaking</span>
            <span className="badge">New</span>
          </div>

          <div className="skill-pill">
            <span className="icon">📸</span>
            <span className="name">Photography</span>
            <span className="badge">Popular</span>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="features-bg"></div>

        <div className="section-label">Why SkillSync</div>

        <h2 className="section-title">
          Everything you need to learn and teach
        </h2>

        <div className="features-grid">
          {[
            {
              icon: "🧭",
              title: "Discover any skill",
              desc: "From coding and design to cooking and music — browse hundreds of skills taught by real community members.",
            },
            {
              icon: "🤝",
              title: "Real human connection",
              desc: "No pre-recorded lectures. Connect 1-on-1 or in small groups with passionate teachers.",
            },
            {
              icon: "⚡",
              title: "Learn at your pace",
              desc: "Flexible scheduling and async resources mean you learn when you're ready.",
            },
            {
              icon: "🏆",
              title: "Track your growth",
              desc: "Visual skill trees and milestones keep you motivated.",
            },
            {
              icon: "🌱",
              title: "Teach what you love",
              desc: "Share your expertise and grow a following.",
            },
            {
              icon: "🔒",
              title: "Safe and trusted",
              desc: "Verified profiles and transparent reviews ensure trust.",
            },
          ].map((item, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{item.icon}</div>
              <div className="feature-title">{item.title}</div>
              <p className="feature-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div className="section-label">The process</div>

        <h2 className="section-title">Up and running in 4 simple steps</h2>

        <div className="steps">
          {[
            {
              num: "01",
              cls: "step-num-1",
              title: "Create your profile",
              desc: "Sign up free and tell us what you love to learn or teach.",
            },
            {
              num: "02",
              cls: "step-num-2",
              title: "Discover skills",
              desc: "Browse the community or search for exactly what you need.",
            },
            {
              num: "03",
              cls: "step-num-3",
              title: "Connect & learn",
              desc: "Book a session, join a group, or dive into content.",
            },
            {
              num: "04",
              cls: "step-num-4",
              title: "Grow together",
              desc: "Level up and become a teacher yourself.",
            },
          ].map((step) => (
            <div className="step" key={step.num}>
              <div className={`step-num ${step.cls}`}>{step.num}</div>

              <div className="step-title">{step.title}</div>

              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
        <div className="cta-bg"></div>

        <div className="section-label">Get started today</div>

        <h2 className="cta-headline">
          Ready to <span>sync your skills?</span>
        </h2>

        <p className="cta-sub">
          Join thousands of learners already building something great.
        </p>

        <div className="cta-form">
          <Link
            to="/login"
            className="btn-ghost"
            style={{ padding: "0.9rem 2rem" }}
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="btn-primary"
            style={{ padding: "0.9rem 2rem" }}
          >
            Sign Up Free →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          Skill<span>Sync</span>
        </div>

        <p>© 2025 SkillSync. Built for learners, by learners.</p>
      </footer>
    </>
  );
}
