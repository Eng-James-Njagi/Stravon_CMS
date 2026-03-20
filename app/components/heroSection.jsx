'use client'
import { useEffect, useRef, useState } from "react";
import Image from 'next/image'
import '../components/css/heroSection.css'

export default function HeroSection() {
  const [ mouse, setMouse ] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      setMouse({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };
    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <>
      <div className="hero-root">
        <nav className="nav">
          <a className="nav-logo" href="#">
            <Image src="/logo.jpg"
              alt="Logo"
              width={30}
              height={30}
              className="nav-logo-badge"
            />
            <span className="nav-brand">Stravon Tech Labs</span>
          </a>
          <button className="nav-btn">Log In</button>
        </nav>

        {/* HERO */}
        <section className="hero-wrapper" ref={heroRef}>
          {/* Grid */}
          <div className="grid-bg" />

          {/* Blobs — react to mouse */}
          <div className="blob-wrap">
            <div
              className="blob blob-1"
              style={{
                transform: `translate(${mouse.x * 30}px, ${mouse.y * 20}px)`,
              }}
            />
            <div
              className="blob blob-2"
              style={{
                transform: `translate(${-mouse.x * 25}px, ${-mouse.y * 18}px)`,
              }}
            />
            <div
              className="blob blob-3"
              style={{
                transform: `translate(${(mouse.x - 0.5) * 40}px, ${(mouse.y - 0.5) * 30}px)`,
              }}
            />
          </div>

          {/* Main copy */}
          <div className="hero-content">
            <div className="hero-tag">
              <span className="hero-tag-dot" />
              Digital Workplace Platform
            </div>

            <h1 className="hero-h1">
              Your Digital Workplace,{" "}
              <span className="accent-word">
                <em>Connected</em>
              </span>
            </h1>

            <p className="hero-sub">
              Manage tasks, automate workflows, and centralize your tools — all in one
              platform. From AI-powered content creation to job scheduling, streamline
              every part of your team&apos;s day.
            </p>

            <div className="cta-row">
              <button className="cta-primary">
                Sign In
                <span className="cta-primary-arrow">→</span>
              </button>
              <button className="cta-secondary">Explore Tools</button>
            </div>
          </div>

          {/* Feature pills */}
          <div className="feature-pills">
            {[
              { icon: "⚡", label: "AI Content Creation" },
              { icon: "📅", label: "Job Scheduling" },
              { icon: "🔗", label: "Tool Integrations" },
              { icon: "📊", label: "Analytics" },
              { icon: "🤖", label: "Workflow Automation" },
            ].map((p) => (
              <div key={p.label} className="pill">
                <span className="pill-icon">{p.icon}</span>
                {p.label}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="stats-strip">
            {[
              { num: "12K+", label: "Teams" },
              { num: "98%", label: "Uptime" },
              { num: "40+", label: "Integrations" },
            ].map((s) => (
              <div key={s.label} className="stat">
                <span className="stat-num">{s.num}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}