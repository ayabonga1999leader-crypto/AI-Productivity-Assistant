import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Wand2 } from "lucide-react";
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
import { AiOutput } from "@/components/AiOutput";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { ToolHeader } from "@/components/ToolHeader";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — UrbanCart AI" },
      {
        name: "description",
        content:
          "Draft clear, professional work emails in seconds. Set the recipient, tone and length, then copy or regenerate the AI-written draft.",
      },
      { property: "og:title", content: "Smart Email Generator — UrbanCart AI" },
      {
        property: "og:description",
        content: "Turn a few bullet points into a polished, ready-to-send work email.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailGenerator,
});

const tones = ["Professional", "Friendly", "Direct", "Apologetic", "Persuasive", "Formal"];
const lengths = ["Short", "Medium", "Detailed"];

function EmailGenerator() {
  const run = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async () => {
    if (purpose.trim().length < 3) {
      setError("Tell the AI what the email is about first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await run({ data: { purpose, recipient, tone, length } });
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
        eyebrow="AI tool 01"
        title="Smart Email Generator"
        description="Give the assistant the gist — who it is for, what you need to say and how it should sound — and get a clean draft you can edit and send."
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
            <Label htmlFor="recipient">Recipient / context</Label>
            <Input
              id="recipient"
              className="rounded-none"
              placeholder="e.g. Thandi, our supplier account manager"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">What must the email say?</Label>
            <Textarea
              id="purpose"
              className="min-h-40 rounded-none"
              placeholder={"• Delivery of order 4821 is two days late\n• Ask for a revised date\n• Request confirmation by Friday"}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger className="rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lengths.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" size="lg" className="rounded-none" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" /> Generate email
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
            emptyHint="Your generated email will appear here. Add the key points on the left and hit Generate."
          />
          <AiDisclaimer />
        </div>
      </section>
    </>
  );
}
