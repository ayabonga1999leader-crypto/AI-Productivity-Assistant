export function ToolHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-10">
        <p className="label-mono text-accent">{eyebrow}</p>
        <h1 className="mt-3 text-3xl sm:text-5xl uppercase">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
      </div>
    </header>
  );
}
