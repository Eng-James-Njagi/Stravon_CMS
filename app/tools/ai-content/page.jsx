'use client'
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Posts   from "../../components/pages/ai-content/posts";
import NewPost from "../../components/pages/ai-content/new";

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

const NAV_CONFIG = [
  { id: 'new',   label: 'Add Post',   icon: <PlusIcon />, tooltip: 'Add Post'   },
  { id: 'posts', label: 'Past Posts', icon: <ListIcon />, tooltip: 'Past Posts' },
];

const VIEWS = {
  new:   <NewPost />,
  posts: <Posts />,
};

export default function AiContent() {
  const [activeView, setActiveView] = useState('posts');

  return (
    <Sidebar
      navConfig={NAV_CONFIG}
      sectionLabel="Posts"
      activeView={activeView}
      onViewChange={setActiveView}
    >
      {VIEWS[activeView]}
    </Sidebar>
  );
}