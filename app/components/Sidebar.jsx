'use client'
import { useState } from "react";
import Image from 'next/image';
import Link from 'next/link'
import Posts from './pages/ai-content/posts';
import NewPost from './pages/ai-content/new';
import "./css/sidebar.css";

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 4h10M3 8h10M3 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export default function Sidebar() {
  const [ collapsed, setCollapsed ] = useState(false);
  const [ activeView, setActiveView ] = useState('posts'); // default view

  const renderView = () => {
    switch (activeView) {
      case 'posts': return <Posts />;
      case 'new': return <NewPost />;
      default: return <Posts />;
    }
  }

  return (
    <div className="sb-layout">
      <aside className={`sb-sidebar ${collapsed ? "collapsed" : ""}`}>
        {/* Hamburger toggle */}
        <div className="sb-toggle">
          <button
            className="sb-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="sb-toggle-bar" />
            <span className="sb-toggle-bar" />
            <span className="sb-toggle-bar" />
          </button>
        </div>

        {/* Brand */}
        <Link  href="/#ai-content">
          <div className="sb-brand">
            <div className="sb-brand-badge">
              <Image src="/logo.jpg" alt="Logo" width={30} height={30} />
            </div>
            <span className="sb-brand-name">Stravon<br />Tech Labs</span>
          </div>
        </Link>

        <div className="sb-divider" />
        <div className="sb-section-label">Posts</div>

        {/* Nav buttons */}
        <nav className="sb-nav">
          <button
            className={`sb-btn sb-btn-primary ${activeView === 'new' ? 'sb-btn-active' : ''}`}
            onClick={() => setActiveView('new')}
          >
            <span className="sb-btn-icon"><PlusIcon /></span>
            <span className="sb-btn-label">Add Post</span>
          </button>

          <button
            className={`sb-btn sb-btn-secondary ${activeView === 'posts' ? 'sb-btn-active' : ''}`}
            onClick={() => setActiveView('posts')}
          >
            <span className="sb-btn-icon"><ListIcon /></span>
            <span className="sb-btn-label">Past Posts</span>
          </button>
        </nav>

        <div className="sb-footer">
          <span className="sb-footer-text">Stravon © 2025</span>
        </div>
      </aside>

      <main className="sb-main">
        {renderView()}
      </main>
    </div>
  );
}