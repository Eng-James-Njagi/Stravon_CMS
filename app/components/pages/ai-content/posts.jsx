'use client'
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import './posts.css';

const PER_PAGE = 8;

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ReferenceIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2 3.5h9M5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M10.5 3.5l-.7 7a1 1 0 01-1 .9H4.2a1 1 0 01-1-.9l-.7-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function PostCard({ post, onDelete, onReference }) {
  const [expanded, setExpanded] = useState(false);

  const text     = post.post ?? post.content ?? '';
  const isLong   = text.length > 180;

  return (
    <div className={`pp-card ${expanded ? 'expanded' : ''}`}>

      {/* Header — always visible, click to expand */}
      <div className="pp-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="pp-card-left">
          <div className="pp-card-meta">
            <span className="pp-card-date">{formatDate(post.date ?? post.createdAt)}</span>
            {post.platform && (
              <span className="pp-card-platform">{post.platform}</span>
            )}
          </div>
          <div className="pp-card-topic">{post.topic ?? 'Untitled'}</div>
          {!expanded && (
            <p className="pp-card-preview">{text}</p>
          )}
        </div>
        <div className="pp-card-chevron">
          <ChevronIcon />
        </div>
      </div>

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

  // show max 5 page buttons around current
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
    // wire up AI reference logic here
    toast.success(`"${post.topic}" marked as reference.`);
  };

  const totalPages  = Math.ceil(posts.length / PER_PAGE);
  const paginated   = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pp-root">

      {/* Header */}
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

      {/* Top pagination */}
      {!loading && !error && totalPages > 1 && (
        <Pagination current={page} total={totalPages} onChange={handlePageChange} />
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="pp-loading" style={{ marginTop: 24 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="pp-loading-card" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="pp-error">{error}</div>
      )}

      {/* Empty */}
      {!loading && !error && posts.length === 0 && (
        <div className="pp-empty">
          <div className="pp-empty-icon">📭</div>
          <div className="pp-empty-text">No posts yet</div>
          <div className="pp-empty-sub">Generated posts will appear here.</div>
        </div>
      )}

      {/* Cards */}
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

      {/* Bottom pagination */}
      {!loading && !error && totalPages > 1 && (
        <Pagination current={page} total={totalPages} onChange={handlePageChange} />
      )}
    </div>
  );
}