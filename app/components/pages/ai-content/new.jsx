'use client'
import { useState } from 'react';
import './newPost.css';
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

const SparkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1v2M7 11v2M1 7h2M11 7h2M3 3l1.4 1.4M9.6 9.6L11 11M3 11l1.4-1.4M9.6 4.4L11 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ImageIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="3" y="5" width="22" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="9.5" cy="11" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 19l6-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MODELS = [
  { id: 'claude',  name: 'Claude',   sub: 'Anthropic · Balanced' },
  { id: 'gpt',     name: 'OpenAI',   sub: 'GPT · High quality' },
  { id: 'mistral', name: 'Mistral',  sub: 'Mistral · Fast & open' },
];

const PLATFORMS = [
  { id: 'twitter',   label: 'Twitter / X', icon: faXTwitter },
  { id: 'linkedin',  label: 'LinkedIn',    icon: faLinkedin },
  { id: 'instagram', label: 'Instagram',   icon: faInstagram },
  { id: 'facebook',  label: 'Facebook',    icon: faFacebook },
  { id: 'blog',      label: 'Blog',        icon: faBlog },
  { id: 'threads',   label: 'Threads',     icon: faThreads },
];

const STEPS = [
  { id: 'topic',    label: 'Add topic' },
  { id: 'model',    label: 'Choose model' },
  { id: 'platform', label: 'Choose platform' },
  { id: 'generate', label: 'Generate' },
];

function getStep(topic, model, platform, output) {
  if (output)   return 3;
  if (platform) return 2;
  if (model)    return 1;
  if (topic)    return 0;
  return 0;
}

function PanelContent({ topic, model, setModel, platform, setPlatform, output }) {
  const stepIndex = getStep(topic, model, platform, output);
  const progress  = Math.round(((stepIndex + (topic ? 1 : 0)) / STEPS.length) * 100);

  return (
    <>
      {/* Model */}
      <div className="np-panel-section">
        <div className="np-panel-label">Model</div>
        <div className="np-model-list">
          {MODELS.map((m) => (
            <div
              key={m.id}
              className={`np-model-option ${model === m.id ? 'selected' : ''}`}
              onClick={() => setModel(m.id)}
            >
              <div className="np-model-radio">
                <div className="np-model-radio-dot" />
              </div>
              <div>
                <div className="np-model-name">{m.name}</div>
                <div className="np-model-sub">{m.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div className="np-panel-section">
        <div className="np-panel-label">Platform</div>
        <div className="np-platform-grid">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              className={`np-platform-btn ${platform === p.id ? 'selected' : ''}`}
              onClick={() => setPlatform(platform === p.id ? '' : p.id)}
            >
              <FontAwesomeIcon icon={p.icon} className="np-platform-icon" />
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="np-panel-section">
        <div className="np-panel-label">Progress</div>
        <div className="np-progress-wrap">
          <div className="np-progress-steps">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={`np-progress-step ${i === stepIndex ? 'active' : i < stepIndex ? 'done' : ''}`}
              >
                <div className="np-progress-dot">
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                {s.label}
              </div>
            ))}
          </div>
          <div className="np-progress-bar-track">
            <div className="np-progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function NewPost() {
  const [topic,       setTopic]       = useState('');
  const [description, setDescription] = useState('');
  const [output,      setOutput]      = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [model,       setModel]       = useState('claude');
  const [platform,    setPlatform]    = useState('');

  const isDirty = topic.trim() !== '' || description.trim() !== '';

  const handleDiscard = () => {
    setTopic('');
    setDescription('');
    setOutput('');
    setError('');
    setModel('claude');
    setPlatform('');
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const response = await fetch('', { // ← attach your endpoint here
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, description, model, platform }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || 'Failed to generate post.');
      }

      const text = data.content
        ?.filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('');

      setOutput(text || '');
      toast.success('Post generated successfully.');
    } catch (err) {
      const message = err.message || 'Something went wrong. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="np-root">
      {/* ── LEFT COLUMN ── */}
      <div className="np-left">
        <div className="np-header">
          <div className="np-eyebrow">AI Content Studio</div>
          <div className="np-title">New Post</div>
        </div>

        {/* Inline panel — mobile only */}
        <div className="np-panel-inline">
          <PanelContent
            topic={topic}
            model={model}
            setModel={setModel}
            platform={platform}
            setPlatform={setPlatform}
            output={output}
          />
        </div>

        <div className="np-form">
          <div className="np-field">
            <label className="np-label" htmlFor="np-topic">Topic</label>
            <input
              id="np-topic"
              className="np-input"
              type="text"
              placeholder="e.g. The future of remote work"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="np-field">
            <label className="np-label" htmlFor="np-desc">Description</label>
            <textarea
              id="np-desc"
              className="np-textarea"
              placeholder="Add context, tone, audience, or key points to include…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="np-actions">
            <button
              className="np-btn-generate"
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
            >
              {loading ? <span className="np-btn-generate-spinner" /> : <SparkIcon />}
              {loading ? 'Generating…' : 'Generate'}
            </button>

            {isDirty && !loading && (
              <button className="np-btn-discard" onClick={handleDiscard}>
                Discard
              </button>
            )}
          </div>

          {error && <div className="np-error">{error}</div>}
        </div>

        {(loading || output) && (
          <div className="np-output">
            <div className="np-output-header">
              <span className="np-output-label">Output</span>
            </div>

            <div className="np-output-body">
              <div className="np-image-placeholder">
                <ImageIcon />
                <span>Image Placeholder</span>
              </div>

              <div className="np-post-card">
                <span className="np-post-card-label">Post</span>
                {loading ? (
                  <div className="np-skeleton">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="np-skeleton-line" />
                    ))}
                  </div>
                ) : (
                  <p className="np-post-card-text">{output}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT PANEL (desktop only) ── */}
      <aside className="np-panel">
        <PanelContent
          topic={topic}
          model={model}
          setModel={setModel}
          platform={platform}
          setPlatform={setPlatform}
          output={output}
        />
      </aside>
    </div>
  );
}