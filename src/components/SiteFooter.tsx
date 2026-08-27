import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-12 sm:grid-cols-4 sm:px-8">
        <div className="sm:col-span-2">
          <p className="font-display text-xl">
            URBANCART<span className="text-accent">.</span>
          </p>
          <p className="mt-3 max-w-[38ch] text-sm text-primary-foreground/60">
            AI tools for everyday workplace admin — drafting, summarising, planning and answering
            questions, so your team spends its time on the work that matters.
          </p>
        </div>
        <div>
          <p className="label-mono mb-3 text-primary-foreground/50">AI tools</p>
          <div className="space-y-2 text-sm">
            <Link to="/email-generator" className="block transition-colors hover:text-accent">
              Smart Email Generator
            </Link>
            <Link to="/meeting-notes" className="block transition-colors hover:text-accent">
              Meeting Notes Summarizer
            </Link>
            <Link to="/task-planner" className="block transition-colors hover:text-accent">
              AI Task Planner
            </Link>
            <Link to="/chatbot" className="block transition-colors hover:text-accent">
              AI Chatbot
            </Link>
          </div>
        </div>
        <div>
          <p className="label-mono mb-3 text-primary-foreground/50">Responsible use</p>
          <p className="text-sm text-primary-foreground/60">
            AI output can be wrong. Always review before sending, and keep confidential information
            out of prompts.
          </p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-[1400px] flex-wrap justify-between gap-2 px-5 py-5 label-mono text-primary-foreground/50 sm:px-8">
          <span>© {new Date().getFullYear()} UrbanCart</span>
          <span>Human in the loop, always</span>
        </div>
      </div>
    </footer>
  );
}
