import { Check, Copy, Loader2, RefreshCw, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ResponsibleAiNotice() {
  return (
    <p className="mt-6 flex items-start gap-2 rounded-xl border border-border bg-surface p-3 text-xs leading-relaxed text-muted-foreground">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
      <span>
        <strong className="font-medium text-foreground">Responsible AI:</strong> responses are
        AI-generated and may be inaccurate or incomplete. Always review, edit and fact-check before
        sending or acting. Do not enter confidential personal data.
      </span>
    </p>
  );
}

type Props = {
  title?: string;
  text: string;
  isLoading: boolean;
  error?: string | null | undefined;
  onRegenerate?: (() => void) | undefined;
  emptyHint: string;
};

export function AiOutput({ title = "AI response", text, isLoading, error, onRegenerate, emptyHint }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={copy}
            disabled={!text || isLoading}
          >
            {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={onRegenerate}
            disabled={!onRegenerate || isLoading}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Regenerate
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Generating…
        </div>
      ) : error ? (
        <p className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</p>
      ) : text ? (
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
          {text}
        </pre>
      ) : (
        <p className="py-10 text-sm text-muted-foreground">{emptyHint}</p>
      )}
    </section>
  );
}
