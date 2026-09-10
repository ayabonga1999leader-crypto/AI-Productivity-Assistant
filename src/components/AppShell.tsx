import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarClock, LayoutDashboard, Mail, Menu, NotebookPen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, desc: "Overview of your AI workspace" },
  { to: "/email", label: "Email Generator", icon: Mail, desc: "Draft professional emails in any tone" },
  {
    to: "/meeting-notes",
    label: "Notes Summarizer",
    icon: NotebookPen,
    desc: "Turn long notes into decisions and actions",
  },
  {
    to: "/planner",
    label: "Task Planner",
    icon: CalendarClock,
    desc: "Build a prioritised daily or weekly plan",
  },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground font-medium" }}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Link to="/" className="mb-8 block px-3 pt-2">
          <span className="font-display text-base leading-tight text-sidebar-foreground">
            WORKFLOW<span className="text-accent">.AI</span>
          </span>
          <span className="mt-1 block text-[11px] uppercase tracking-widest text-sidebar-foreground/50">
            Productivity assistant
          </span>
        </Link>
        <NavLinks />
        <p className="mt-auto rounded-xl bg-sidebar-accent/60 p-3 text-[11px] leading-relaxed text-sidebar-foreground/70">
          AI can make mistakes. Review every draft before you send or act on it.
        </p>
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur lg:hidden">
        <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <Link to="/" className="font-display text-sm">
          WORKFLOW<span className="text-accent">.AI</span>
        </Link>
      </header>

      {open && (
        <div className="sticky top-14 z-30 border-b border-border bg-sidebar p-4 lg:hidden">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      )}

      <main className={cn("lg:pl-64")}>
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
