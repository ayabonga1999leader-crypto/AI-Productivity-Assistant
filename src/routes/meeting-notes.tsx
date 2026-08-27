import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AiOutput } from "@/components/AiOutput";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { ToolHeader } from "@/components/ToolHeader";
import { summariseNotes } from "@/lib/ai.functions";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — UrbanCart AI" },
      {
        name: "description",
        content:
          "Paste raw meeting notes or a transcript and get a structured summary with decisions, action items and owners you can copy straight into your tracker.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — UrbanCart AI" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into decisions, action items and next steps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MeetingNotes;
});

const formats = [
  "Summary + action items",
  "Bullet summary only",
  "Decisions and owners",
  "Executive one-pager",
];

function MeetingNotes() {
  const run = useServerFn(summariseNotes);
  const [notes, setNotes] = useState("");
  const [format, setFormat] = useState(formats[0]!);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async () => {
    if (notes.trim().length < 20) {
      setError("Paste at least a few lines of notes to summarise.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await run({ data: { notes, format } });
      setOutput(result.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToolHeader
        eyebrow="AI tool 02"
        title="Meeting Notes Summarizer"
        description="Drop in your raw notes or transcript. The assistant pulls out the summary, the decisions and who owes what by when."
      />

      <section className="mx-auto grid max-w-[1400px] gap-8 px-5 py-12 sm:px-8 lg:grid-cols-2">
        <form
          className="flex flex-col gap-5 border border-border bg-surface p-6"
          onSubmit={(e) => {
            e.preventDefault();
            void generate();
          }}
        >
          <p className="label-mono text-muted-foreground">Input</p>

          <div className="space-y-2">
            <Label htmlFor="notes">Raw notes or transcript</Label>
            <Textarea
              id="notes"
              className="min-h-72 rounded-none"
              placeholder="Paste the meeting notes here — bullet points, shorthand or a full transcript all work."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">{notes.length} characters</p>
          </div>

          <div className="space-y-2">
            <Label>Output format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="rounded-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formats.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" size="lg" className="rounded-none" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" /> Summarise notes
              </>
            )}
          </Button>
        </form>

        <div className="flex flex-col gap-4">
          <AiOutput
            output={output}
            isLoading={isLoading}
            error={error}
            onRegenerate={() => void generate()}
            emptyHint="Your summary, decisions and action items will appear here."
          />
          <AiDisclaimer />
        </div>
      </section>
    </>
  );
}
