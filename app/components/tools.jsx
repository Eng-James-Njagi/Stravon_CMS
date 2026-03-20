import Link from "next/link";
import "../components/css/tools.css";

const TOOLS = [
   {
      id: "ai-content",
      name: "AI Content Studio",
      href: "/tools/ai-content",
      icon: (
         <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
            <path d="M14 24h8M14 30h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M28 18l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="36" cy="13" r="5" fill="#C8F135" />
            <path d="M34.5 13h3M36 11.5v3" stroke="#0F0E0A" strokeWidth="1.5" strokeLinecap="round" />
         </svg>
      ),
   },
   {
      id: "job-scheduler",
      name: "Job Scheduler",
      href: "/tools/job-scheduler",
      icon: (
         <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="12" width="32" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
            <path d="M8 20h32" stroke="currentColor" strokeWidth="2" />
            <path d="M16 8v8M32 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <rect x="14" y="26" width="8" height="7" rx="1.5" fill="#C8F135" />
            <path d="M28 28h6M28 32h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
         </svg>
      ),
   },
   {
      id: "task-manager",
      name: "Task Manager",
      href: "/tools/task-manager",
      icon: (
         <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
            <path d="M16 20l3 3 6-6" stroke="#C8F135" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 30l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
            <path d="M30 21h4M30 31h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
         </svg>
      ),
   },
   {
      id: "workflow",
      name: "Workflow Automator",
      href: "/tools/workflow",
      icon: (
         <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="24" r="5" stroke="currentColor" strokeWidth="2" />
            <circle cx="36" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
            <circle cx="36" cy="36" r="5" stroke="currentColor" strokeWidth="2" />
            <path d="M17 22l14-8M17 26l14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="36" cy="12" r="3" fill="#C8F135" />
         </svg>
      ),
   },
   {
      id: "analytics",
      name: "Analytics Board",
      href: "/tools/analytics",
      icon: (
         <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
            <path d="M14 34l7-9 6 5 7-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="34" cy="18" r="3" fill="#C8F135" />
            <path d="M14 38h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
         </svg>
      ),
   },
   {
      id: "integrations",
      name: "Integrations Hub",
      href: "/tools/integrations",
      icon: (
         <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2" />
            <circle cx="24" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
            <circle cx="38" cy="32" r="4" stroke="currentColor" strokeWidth="2" />
            <circle cx="10" cy="32" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M24 16v2M35 30l-2-1M13 30l2-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="24" cy="10" r="2" fill="#C8F135" />
         </svg>
      ),
   },
   {
      id: "file-manager",
      name: "File Manager",
      href: "/tools/file-manager",
      icon: (
         <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 16a4 4 0 014-4h8l4 4h12a4 4 0 014 4v16a4 4 0 01-4 4H12a4 4 0 01-4-4V16z" stroke="currentColor" strokeWidth="2" />
            <rect x="16" y="26" width="16" height="3" rx="1.5" fill="#C8F135" opacity="0.5" />
            <path d="M16 32h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
         </svg>
      ),
   },
   {
      id: "team-chat",
      name: "Team Messenger",
      href: "/tools/team-chat",
      icon: (
         <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12a4 4 0 014-4h24a4 4 0 014 4v18a4 4 0 01-4 4H28l-6 6v-6h-8a4 4 0 01-4-4V12z" stroke="currentColor" strokeWidth="2" />
            <path d="M15 20h18M15 26h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="38" cy="11" r="5" fill="#C8F135" />
            <path d="M36.5 11h3M38 9.5v3" stroke="#0F0E0A" strokeWidth="1.5" strokeLinecap="round" />
         </svg>
      ),
   },
   {
      id: "reports",
      name: "Report Builder",
      href: "/tools/reports",
      icon: (
         <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6h18l10 10v28a2 2 0 01-2 2H12a2 2 0 01-2-2V8a2 2 0 012-2z" stroke="currentColor" strokeWidth="2" />
            <path d="M30 6v10h10" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M16 22h16M16 28h16M16 34h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="16" y="20" width="5" height="16" rx="1" fill="#C8F135" opacity="0.5" />
         </svg>
      ),
   },
];

export default function ToolsGrid() {
   return (
      <div className="tg-root">
         {/* Bottom fade */}
         <div className="hero-bottom-fade" />
         <div className="tg-header">
            <div>
               <div className="tg-eyebrow">Platform Tools</div>
               <div className="tg-title">
                  Everything your<br /><em>team needs</em>
               </div>
            </div>
            <div className="tg-count">
               <strong>{TOOLS.length}</strong> tools available
            </div>
         </div>

         <div className="tg-grid">
            {TOOLS.map((tool) => (
               <Link key={tool.id} href={tool.href} className="tg-card">
                  <span className="tg-card-shine" />
                  <span className="tg-card-icon">{tool.icon}</span>
                  <span className="tg-card-name">{tool.name}</span>
                  <span className="tg-card-arrow">→</span>
               </Link>
            ))}
         </div>
      </div>
   );
}