'use client'
import { useState } from 'react';
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXTwitter,
  faLinkedin,
  faInstagram,
  faFacebook,
  faThreads,
} from '@fortawesome/free-brands-svg-icons';
import { faBlog } from '@fortawesome/free-solid-svg-icons';
import './Popover.css';

const PLATFORMS = [
  { id: 'twitter',   label: 'Twitter / X', icon: faXTwitter },
  { id: 'linkedin',  label: 'LinkedIn',    icon: faLinkedin },
  { id: 'instagram', label: 'Instagram',   icon: faInstagram },
  { id: 'facebook',  label: 'Facebook',    icon: faFacebook },
  { id: 'blog',      label: 'Blog',        icon: faBlog },
  { id: 'threads',   label: 'Threads',     icon: faThreads },
];

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M12 7H2M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function PostPopover({
  open,
  onClose,
  output,
  topic,
  description,
  imagePreview,
  defaultPlatform,
  onSuccess,
}) {
  const [selected,  setSelected]  = useState(() =>
    defaultPlatform ? [defaultPlatform] : []
  );
  const [posting,   setPosting]   = useState(false);
  const [posted,    setPosted]    = useState(false);

  if (!open) return null;

  const togglePlatform = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    if (selected.length === 0 || posting) return;

    setPosting(true);
    try {
      const res = await fetch('/api/posts/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          description,
          post:      output,
          platforms: selected,
          date:      new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'Failed to publish.');

      setPosted(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
        setPosted(false);
        setPosting(false);
      }, 1400);
    } catch (err) {
      setPosting(false);
      alert(err.message);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="pop-backdrop" onClick={onClose} />

      {/* Popover */}
      <div className="pop-root" role="dialog" aria-modal="true">

        {/* Header */}
        <div className="pop-header">
          <div className="pop-header-left">
            <div className="pop-eyebrow">Review & Publish</div>
            <div className="pop-title">Post Preview</div>
          </div>
          <button className="pop-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="pop-body">

          {/* Image preview */}
          {imagePreview && (
            <div className="pop-image-wrap">
              <Image src={imagePreview} 
              width={100}
              height={100}
              alt="Post" 
              className="pop-image" />
            </div>
          )}

          {/* Post text */}
          <div className="pop-text-card">
            <p className="pop-text">{output}</p>
          </div>

          {/* Platform selector */}
          <div className="pop-section">
            <div className="pop-section-label">Select platforms to post to</div>
            <div className="pop-platforms">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  className={`pop-platform-btn ${selected.includes(p.id) ? 'selected' : ''}`}
                  onClick={() => togglePlatform(p.id)}
                >
                  <FontAwesomeIcon icon={p.icon} className="pop-platform-icon" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pop-footer">
          <button className="pop-btn-cancel" onClick={onClose} disabled={posting}>
            Cancel
          </button>
          <button
            className={`pop-btn-confirm ${posted ? 'posted' : ''}`}
            onClick={handleConfirm}
            disabled={selected.length === 0 || posting}
          >
            {posted ? (
              '✓ Posted'
            ) : posting ? (
              <>
                <span className="pop-spinner" />
                Publishing…
              </>
            ) : (
              <>
                <SendIcon />
                Confirm & Post
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}