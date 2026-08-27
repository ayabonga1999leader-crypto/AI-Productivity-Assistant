import { Link } from "@tanstack/react-router";
import { ArrowRight, type LucideIcon } from "lucide-react";

export interface ToolCardProps {
  to: string;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
}

export function ToolCard({ to, name, tagline, description, icon: Icon }: ToolCardProps) {
  return (
    <Link
      to={to}
      className="group flex flex-col border border-border bg-surface p-6 transition-colors hover:border-accent"
    >
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center bg-primary text-primary-foreground">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
      </div>
      <p className="label-mono mt-6 text-accent">{tagline}</p>
      <h3 className="mt-2 text-lg font-semibold leading-tight">{name}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}
