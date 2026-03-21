'use client'
import { useState, useRef } from 'react';
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
import PostPopover from './postPopover';

const SparkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1v2M7 11v2M1 7h2M11 7h2M3 3l1.4 1.4M9.6 9.6L11 11M3 11l1.4-1.4M9.6 4.4L11 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 16V8M12 8l-3 3M12 8l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 16v2a2 2 0 002 2h14a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M12 7H2M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M2 10V2h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MODELS = [
  { id: 'claude',  name: 'Claude',  sub: 'Anthropic · Balanced' },
  { id: 'gpt',     name: 'OpenAI',  sub: 'GPT · High quality' },
  { id: 'mistral', name: 'Mistral', sub: 'Mistral · Fast & open' },
];

const PLATFORMS = [
  { id: 'twitter',   label: 'Twitter / X', icon: faXTwitter },
  { id: 'linkedin',  label: 'LinkedIn',    icon: faLinkedin },
  { id: 'instagram', label: 'Instagram',   icon: faInstagram },
  { id: 'facebook',  label: 'Facebook',    icon: faFacebook },
  { id: 'blog',      label: 'Blog',        icon: faBlog },
  { id: 'threads',   label: 'Threads',     icon: faThreads },
];

const GEN_STEPS = [
  { id: 'db',       label: 'Checking past posts' },
  { id: 'web',      label: 'Searching the web' },
  { id: 'generate', label: 'Generating your post' },
  { id: 'done',     label: 'Done' },
];

const PANEL_STEPS = [
  { id: 'topic',    label: 'Add topic' },
  { id: 'model',    label: 'Choose model' },
  { id: 'platform', label: 'Choose platform' },
  { id: 'generate', label: 'Generate' },
];

function getPanelStep(topic, model, platform, output) {
  if (output)   return 3;
  if (platform) return 2;
  if (model)    return 1;
  if (topic)    return 0;
  return 0;
}

function PanelContent({ topic, model, setModel, platform, setPlatform, output }) {
  const stepIndex = getPanelStep(topic, model, platform, output);
  const progress  = Math.round(((stepIndex + (topic ? 1 : 0)) / PANEL_STEPS.length) * 100);

  return (
    <>
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

      <div className="np-panel-section">
        <div className="np-panel-label">Progress</div>
        <div className="np-progress-wrap">
          <div className="np-progress-steps">
            {PANEL_STEPS.map((s, i) => (
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
  const [topic,        setTopic]        = useState('');
  const [description,  setDescription]  = useState('');
  const [output,       setOutput]       = useState('');
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');
  const [model,        setModel]        = useState('mistral');
  const [platform,     setPlatform]     = useState('');
  const [image,        setImage]        = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [copied,       setCopied]       = useState(false);
  const [popoverOpen,  setPopoverOpen]  = useState(false);
  const [pastPost,     setPastPost]     = useState(null);
  const [genStep,      setGenStep]      = useState(-1);
  const [showPast,     setShowPast]     = useState(false);
  const [fadePast,     setFadePast]     = useState(false);
  const fileInputRef = useRef(null);
  const stepTimers   = useRef([]);

  const isDirty      = topic.trim() !== '' || description.trim() !== '';
  const isGenerating = loading;

  const startStepSimulation = () => {
    setGenStep(0);
    const t1 = setTimeout(() => setGenStep(1), 1500);
    const t2 = setTimeout(() => setGenStep(2), 3500);
    stepTimers.current = [t1, t2];
  };

  const clearStepTimers = () => {
    stepTimers.current.forEach(clearTimeout);
    stepTimers.current = [];
  };

  const handleDiscard = () => {
    setTopic('');
    setDescription('');
    setOutput('');
    setError('');
    setModel('mistral');
    setPlatform('');
    setImage(null);
    setImagePreview(null);
    setCopied(false);
    setPastPost(null);
    setGenStep(-1);
    setShowPast(false);
    setFadePast(false);
    clearStepTimers();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.success('Copied to clipboard.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard.');
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setOutput('');
    setCopied(false);
    setPastPost(null);
    setShowPast(false);
    setFadePast(false);

    startStepSimulation();

    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, description, model, platform }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || 'Failed to generate post.');

      clearStepTimers();
      setGenStep(3);

      const text = data.content
        ?.filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('');

      if (data.pastPost) {
        setPastPost(data.pastPost);
        setShowPast(true);

        setTimeout(() => {
          setFadePast(true);
          setTimeout(() => {
            setShowPast(false);
            setFadePast(false);
            setOutput(text || '');
          }, 600);
        }, 2200);
      } else {
        setOutput(text || '');
      }

      toast.success('Post generated successfully.');
    } catch (err) {
      clearStepTimers();
      setGenStep(-1);
      const message = err.message || 'Something went wrong. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSuccess = () => {
    toast.success('Post published and saved.');
    handleDiscard();
  };

  return (
    <>
      <div className="np-root">
        <div className="np-left">
          <div className="np-header">
            <div className="np-eyebrow">AI Content Studio</div>
            <div className="np-title">New Post</div>
          </div>

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
                disabled={isGenerating || !topic.trim()}
              >
                {isGenerating ? <span className="np-btn-generate-spinner" /> : <SparkIcon />}
                {isGenerating
                  ? genStep >= 0 ? GEN_STEPS[genStep]?.label : 'Starting…'
                  : 'Generate'}
              </button>

              {isDirty && !isGenerating && (
                <button className="np-btn-discard" onClick={handleDiscard}>
                  Discard
                </button>
              )}
            </div>

            {/* Generation progress steps */}
            {isGenerating && genStep >= 0 && (
              <div className="np-gen-steps">
                {GEN_STEPS.slice(0, 3).map((s, i) => (
                  <div
                    key={s.id}
                    className={`np-gen-step ${
                      i === genStep ? 'active' :
                      i < genStep  ? 'done'   : ''
                    }`}
                  >
                    <div className="np-gen-step-dot">
                      {i < genStep
                        ? '✓'
                        : i === genStep
                        ? <span className="np-gen-dot-pulse" />
                        : ''}
                    </div>
                    {s.label}
                  </div>
                ))}
              </div>
            )}

            {error && <div className="np-error">{error}</div>}
          </div>

          {/* Past post context card */}
          {showPast && pastPost && (
            <div className={`np-context-card ${fadePast ? 'fading' : ''}`}>
              <div className="np-context-tag">Being used as context</div>
              <p className="np-context-text">{pastPost.post}</p>
            </div>
          )}

          {/* Output */}
          {(isGenerating || output) && (
            <div className="np-output">
              <div className="np-output-header">
                <span className="np-output-label">Output</span>
              </div>

              <div className="np-output-body">
                <div
                  className={`np-image-upload ${imagePreview ? 'has-image' : ''}`}
                  onClick={handleImageClick}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="np-image-input"
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Post" className="np-image-preview" />
                      <button className="np-image-remove" onClick={handleRemoveImage}>✕</button>
                    </>
                  ) : (
                    <div className="np-image-empty">
                      <UploadIcon />
                      <span>Add Image</span>
                      <span className="np-image-hint">Click to upload</span>
                    </div>
                  )}
                </div>

                <div className="np-post-card">
                  <div className="np-post-card-header">
                    <span className="np-post-card-label">Post</span>
                    {!isGenerating && output && (
                      <button
                        className={`np-copy-btn ${copied ? 'copied' : ''}`}
                        onClick={handleCopy}
                        title="Copy to clipboard"
                      >
                        {copied ? <CheckIcon /> : <CopyIcon />}
                      </button>
                    )}
                  </div>

                  {isGenerating ? (
                    <div className="np-skeleton">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="np-skeleton-line" />
                      ))}
                    </div>
                  ) : (
                    <>
                      <p className="np-post-card-text">{output}</p>
                      {output && (
                        <div className="np-post-actions">
                          <button
                            className="np-btn-post"
                            onClick={() => setPopoverOpen(true)}
                          >
                            <SendIcon />
                            {platform ? `Post to ${platform}` : 'Post'}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

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

      <PostPopover
        open={popoverOpen}
        onClose={() => setPopoverOpen(false)}
        output={output}
        topic={topic}
        description={description}
        imagePreview={imagePreview}
        defaultPlatform={platform}
        onSuccess={handlePostSuccess}
      />
    </>
  );
}