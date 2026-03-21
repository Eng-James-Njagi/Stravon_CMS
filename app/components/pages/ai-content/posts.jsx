'use client'
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXTwitter,
  faLinkedin,
  faInstagram,
  faFacebook,
  faThreads,
} from '@fortawesome/free-brands-svg-icons';
import { faBlog } from '@fortawesome/free-solid-svg-icons';
import './posts.css';

const PER_PAGE = 8;

const PLATFORM_ICONS = {
  twitter:   faXTwitter,
  linkedin:  faLinkedin,
  instagram: faInstagram,
  facebook:  faFacebook,
  blog:      faBlog,
  threads:   faThreads,
};

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ReferenceIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2 3.5h9M5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M10.5 3.5l-.7 7a1 1 0 01-1 .9H4.2a1 1 0 01-1-.9l-.7-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M1.5 9V1.5h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2 6.5l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function PlatformBadge({ id }) {
  const icon = PLATFORM_ICONS[id];
  if (!icon) return (
    <span className="pp-platform-badge pp-platform-badge-text">{id}</span>
  );
  return (
    <span className="pp-platform-badge">
      <FontAwesomeIcon icon={icon} className="pp-platform-badge-icon" />
      <span>{id}</span>
    </span>
  );
}

function PostCard({ post, onDelete, onReference }) {
  const [expanded, setExpanded] = useState(false);
  const [copied,   setCopied]   = useState(false);

  const text      = post.post ?? post.content ?? '';
  const platforms = Array.isArray(post.platforms)
    ? post.platforms
    : post.platform
    ? [post.platform]
    : [];

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy.');
    }
  };

  return (
    <div className={`pp-card ${expanded ? 'expanded' : ''}`}>

      {/* Header — always visible, click to expand */}
      <div className="pp-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="pp-card-left">
          <div className="pp-card-meta">
            <span className="pp-card-date">{formatDate(post.date ?? post.createdAt)}</span>
          </div>
          <div className="pp-card-topic">{post.topic ?? 'Untitled'}</div>
          {!expanded && (
            <p className="pp-card-preview">{text}</p>
          )}
        </div>

        <div className="pp-card-header-right">
          <button
            className={`pp-copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title="Copy post"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
          <div className="pp-card-chevron">
            <ChevronIcon />
          </div>
        </div>
      </div>

      {/* Platform badges — always visible at bottom */}
      {platforms.length > 0 && (
        <div className="pp-card-platforms">
          {platforms.map((p) => (
            <PlatformBadge key={p} id={p} />
          ))}
        </div>
      )}

      {/* Expanded body */}
      {expanded && (
        <div className="pp-card-body">
          <p className="pp-card-full-text">{text}</p>
          <div className="pp-card-actions">
            <button
              className="pp-btn-reference"
              onClick={() => onReference(post)}
            >
              <ReferenceIcon />
              Use as Reference
            </button>
            <button
              className="pp-btn-delete"
              onClick={() => onDelete(post._id ?? post.id)}
            >
              <TrashIcon />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Pagination({ current, total, onChange }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  const getVisible = () => {
    if (total <= 7) return pages;
    const start = Math.max(1, current - 2);
    const end   = Math.min(total, current + 2);
    const visible = [];
    if (start > 1) visible.push(1, '...');
    for (let i = start; i <= end; i++) visible.push(i);
    if (end < total) visible.push('...', total);
    return visible;
  };

  return (
    <div className="pp-pagination">
      <button
        className="pp-page-btn"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
      >
        <span className="pp-page-arrow">‹</span>
      </button>

      {getVisible().map((p, i) =>
        p === '...'
          ? <span key={`ellipsis-${i}`} style={{ padding: '0 4px', color: 'var(--fg-muted)', fontSize: 12 }}>…</span>
          : (
            <button
              key={p}
              className={`pp-page-btn ${current === p ? 'active' : ''}`}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          )
      )}

      <button
        className="pp-page-btn"
        onClick={() => onChange(current + 1)}
        disabled={current === total}
      >
        <span className="pp-page-arrow">›</span>
      </button>
    </div>
  );
}

export default function Posts() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [page,    setPage]    = useState(1);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/posts');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'Failed to fetch posts.');
      setPosts(data.posts ?? data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post.');
      setPosts((prev) => prev.filter((p) => (p._id ?? p.id) !== id));
      toast.success('Post deleted.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReference = (post) => {
    toast.success(`"${post.topic}" marked as reference.`);
  };

  const totalPages = Math.ceil(posts.length / PER_PAGE);
  const paginated  = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pp-root">

      <div className="pp-header">
        <div className="pp-header-left">
          <div className="pp-eyebrow">AI Content Studio</div>
          <div className="pp-title">Past Posts</div>
        </div>
        {!loading && !error && (
          <div className="pp-count">
            <strong>{posts.length}</strong> post{posts.length !== 1 ? 's' : ''} total
          </div>
        )}
      </div>

      {!loading && !error && totalPages > 1 && (
        <Pagination current={page} total={totalPages} onChange={handlePageChange} />
      )}

      {loading && (
        <div className="pp-loading" style={{ marginTop: 24 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="pp-loading-card" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="pp-error">{error}</div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="pp-empty">
          <div className="pp-empty-icon">📭</div>
          <div className="pp-empty-text">No posts yet</div>
          <div className="pp-empty-sub">Generated posts will appear here.</div>
        </div>
      )}

      {!loading && !error && paginated.length > 0 && (
        <div className="pp-list" style={{ marginTop: totalPages > 1 ? 24 : 8 }}>
          {paginated.map((post, i) => (
            <div key={post._id ?? post.id ?? i} style={{ animationDelay: `${i * 0.05}s` }}>
              <PostCard
                post={post}
                onDelete={handleDelete}
                onReference={handleReference}
              />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <Pagination current={page} total={totalPages} onChange={handlePageChange} />
      )}
    </div>
  );
}