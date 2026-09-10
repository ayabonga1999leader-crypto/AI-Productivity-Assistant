import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AiOutput, ResponsibleAiNotice } from "@/components/AiOutput";
import { summarizeNotes } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste long meeting notes and get an AI summary with decisions, owners, action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into decisions, action items and deadlines.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState("");

  const mutation = useMutation({ mutationFn: () => summarizeNotes({ data: { notes } }) });

  const run = () => {
    if (notes.trim().length < 20) return;
    mutation.mutate();
  };

  return (
    <>
      <PageHeader
        icon={NotebookPen}
        title="Meeting Notes Summarizer"
        subtitle="Paste raw notes or a transcript — get a summary, decisions, owners and deadlines."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide">Meeting notes</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes or transcript</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={16}
                placeholder="Paste your meeting notes here (at least a few sentences)…"
              />
              <p className="text-xs text-muted-foreground">{notes.length} characters</p>
            </div>
            <Button
              className="w-full rounded-full"
              onClick={run}
              disabled={mutation.isPending || notes.trim().length < 20}
            >
              Summarize notes
            </Button>
          </div>
        </section>

        <AiOutput
          title="Summary & action items"
          text={mutation.data?.text ?? ""}
          isLoading={mutation.isPending}
          error={mutation.error ? (mutation.error as Error).message : null}
          onRegenerate={mutation.data || mutation.error ? run : undefined}
          emptyHint="Your summary, decisions and action items will appear here."
        />
      </div>

      <ResponsibleAiNotice />
    </>
  );
}
