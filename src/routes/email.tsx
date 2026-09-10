import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AiOutput, ResponsibleAiNotice } from "@/components/AiOutput";
import { generateEmail } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate professional workplace emails in formal, friendly or persuasive tones with AI, then copy or regenerate the draft.",
      },
      { property: "og:title", content: "Smart Email Generator | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Turn a short brief into a polished, ready-to-send business email.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

type Tone = "formal" | "friendly" | "persuasive" | "concise" | "apologetic";

function EmailPage() {
  const [brief, setBrief] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<Tone>("formal");

  const mutation = useMutation({
    mutationFn: () => generateEmail({ data: { brief, recipient: recipient || undefined, tone } }),
  });

  const run = () => {
    if (brief.trim().length < 5) return;
    mutation.mutate();
  };

  return (
    <>
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        subtitle="Describe what you need to say — get a structured, professional email in your chosen tone."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide">Your brief</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient (optional)</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Thabo, Head of Operations"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="apologetic">Apologetic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brief">What is the email about?</Label>
              <Textarea
                id="brief"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                rows={9}
                placeholder="Ask the client for a two-week extension on the delivery deadline, apologise for the delay and propose a new date."
              />
            </div>
            <Button
              className="w-full rounded-full"
              onClick={run}
              disabled={mutation.isPending || brief.trim().length < 5}
            >
              Generate email
            </Button>
          </div>
        </section>

        <AiOutput
          title="Generated email"
          text={mutation.data?.text ?? ""}
          isLoading={mutation.isPending}
          error={mutation.error ? (mutation.error as Error).message : null}
          onRegenerate={mutation.data || mutation.error ? run : undefined}
          emptyHint="Your generated email will appear here."
        />
      </div>

      <ResponsibleAiNotice />
    </>
  );
}
