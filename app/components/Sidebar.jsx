'use client'
import { useState, useRef, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import "./css/sidebar.css";

export default function Sidebar({
  navConfig = [],
  sectionLabel = '',
  activeView,
  onViewChange,
  children,
}) {
  const [ collapsed, setCollapsed ] = useState(false);
  const [ mobileExpanded, setMobileExpanded ] = useState(false);
  const [ prevView, setPrevView ] = useState(null);
  const mobileRef = useRef(null); 

  const handleViewChange = (id) => {
    if (id !== activeView) setPrevView(activeView);
    setMobileExpanded(false);
    onViewChange?.(id);
  };

  // close drawer when clicking outside
  useEffect(() => {
    if (!mobileExpanded) return;

    const handler = (e) => {
      if (
        mobileRef.current &&
        document.contains(mobileRef.current) &&
        !mobileRef.current.contains(e.target)
      ) {
        setMobileExpanded(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ mobileExpanded ]);

  const activeTab = navConfig.find((n) => n.id === activeView);
  const secondTab = prevView
    ? navConfig.find((n) => n.id === prevView)
    : navConfig.find((n) => n.id !== activeView);

  return (
    <>
      {/* Backdrop — mobile only, rendered at root level */}
      {mobileExpanded && (
        <div
          className="sb-backdrop"
          onClick={() => setMobileExpanded(false)}
        />
      )}

      <div className="sb-layout">

        {/* ── DESKTOP SIDEBAR ── */}
        <aside className={`sb-sidebar ${collapsed ? 'collapsed' : ''}`}>

          <div className={`sb-toggle ${collapsed ? 'collapsed' : ''}`}>
            <button
              className="sb-toggle-btn"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <span className="sb-toggle-bar" />
              <span className="sb-toggle-bar" />
              <span className="sb-toggle-bar" />
            </button>
          </div>

          <Link href="/">
            <div className="sb-brand">
              <div className="sb-brand-badge">
                <Image src="/logo.jpg" alt="Logo" width={30} height={30} />
              </div>
              <span className="sb-brand-name">Stravon<br />Tech Labs</span>
            </div>
          </Link>

          <div className="sb-divider" />

          {sectionLabel && (
            <div className="sb-section-label">{sectionLabel}</div>
          )}

          <nav className="sb-nav">
            {navConfig.map((item, index) => (
              <button
                key={item.id}
                data-tooltip={item.tooltip ?? item.label}
                className={`sb-btn ${index === 0 ? 'sb-btn-primary' : 'sb-btn-secondary'} ${activeView === item.id ? 'sb-btn-active' : ''}`}
                onClick={() => handleViewChange(item.id)}
              >
                <span className="sb-btn-icon">{item.icon}</span>
                <span className="sb-btn-label">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sb-footer">
            <span className="sb-footer-text">Stravon © 2025</span>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="sb-main">
          {children}
        </main>
      </div>

      {/* ── MOBILE BOTTOM BAR + DRAWER — outside sb-layout entirely ── */}
      <div className="sb-mobile-shell" ref={mobileRef}>

        {/* Drawer slides up above the bar */}
        <div className={`sb-drawer ${mobileExpanded ? 'open' : ''}`}>
          {sectionLabel && (
            <div className="sb-drawer-label">{sectionLabel}</div>
          )}
          <nav className="sb-drawer-nav">
            {navConfig.map((item, index) => (
              <button
                key={item.id}
                className={`sb-btn ${index === 0 ? 'sb-btn-primary' : 'sb-btn-secondary'} ${activeView === item.id ? 'sb-btn-active' : ''}`}
                onClick={() => handleViewChange(item.id)}
              >
                <span className="sb-btn-icon">{item.icon}</span>
                <span className="sb-btn-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Fixed bottom bar */}
        <div className="sb-bar">
          <button
            className="sb-bar-hamburger"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            aria-label="Toggle navigation"
          >
            <span className={`sb-bar-line ${mobileExpanded ? 'open' : ''}`} />
            <span className={`sb-bar-line mid ${mobileExpanded ? 'open' : ''}`} />
            <span className={`sb-bar-line ${mobileExpanded ? 'open' : ''}`} />
          </button>

          {activeTab && (
            <button
              className="sb-btn sb-btn-active sb-bar-tab"
              onClick={() => handleViewChange(activeTab.id)}
            >
              <span className="sb-btn-icon">{activeTab.icon}</span>
              <span className="sb-btn-label">{activeTab.label}</span>
            </button>
          )}

          {secondTab && secondTab.id !== activeView && (
            <button
              className="sb-btn sb-btn-secondary sb-bar-tab"
              onClick={() => handleViewChange(secondTab.id)}
            >
              <span className="sb-btn-icon">{secondTab.icon}</span>
              <span className="sb-btn-label">{secondTab.label}</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}