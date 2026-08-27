import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/email-generator", label: "Email Generator" },
  { to: "/meeting-notes", label: "Meeting Notes" },
  { to: "/task-planner", label: "Task Planner" },
  { to: "/chatbot", label: "Chatbot" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="font-display text-lg leading-none" onClick={() => setOpen(false)}>
          URBANCART<span className="text-accent">.</span>
          <span className="sr-only"> AI workplace tools</span>
        </Link>

        <nav className="hidden items-center gap-6 text-[13px] font-medium md:flex">
          {links.slice(1).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden label-mono text-muted-foreground sm:block">AI · Workplace</span>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-surface md:hidden">
          <div className="mx-auto max-w-[1400px] px-5 py-2 sm:px-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block border-b border-border py-3 text-sm last:border-b-0"
                activeProps={{ className: "text-accent" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
