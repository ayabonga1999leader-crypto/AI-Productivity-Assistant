import { useState } from "react";
import { Check, Copy, Loader2, RefreshCcw, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AiOutputProps {
  output: string;
  isLoading: boolean;
  error?: string | null;
  onRegenerate: () => void;
  emptyHint: string;
}

export function AiOutput({ output, isLoading, error, onRegenerate, emptyHint }: AiOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.success("Copied to clipboard", { position: "top-center" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy — select the text and copy manually", { position: "top-center" });
    }
  };

  return (
    <section aria-live="polite" className="flex h-full flex-col border border-border bg-surface">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h2 className="label-mono text-muted-foreground">Output</h2>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-none"
            onClick={handleCopy}
            disabled={!output || isLoading}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="ml-2 hidden sm:inline">Copy</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-none"
            onClick={onRegenerate}
            disabled={isLoading}
          >
            <RefreshCcw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="ml-2 hidden sm:inline">Regenerate</span>
          </Button>
        </div>
      </header>

      <div className="min-h-[18rem] flex-1 p-4">
        {isLoading ? (
          <div className="flex h-full min-h-[16rem] flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
            <p className="label-mono">Generating</p>
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : output ? (
          <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground">
            {output}
          </pre>
        ) : (
          <div className="flex h-full min-h-[16rem] flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
            <Sparkle className="h-5 w-5 text-accent" />
            <p className="text-sm">{emptyHint}</p>
          </div>
        )}
      </div>
    </section>
  );
}
