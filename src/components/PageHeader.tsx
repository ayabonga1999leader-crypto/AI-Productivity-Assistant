import type { LucideIcon } from "lucide-react";

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Icon className="h-5 w-5" />
        </span>
        <h1 className="text-2xl uppercase leading-none sm:text-3xl">{title}</h1>
      </div>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
    </header>
  );
}
