import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, Copy, Loader2, RefreshCcw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { ToolHeader } from "@/components/ToolHeader";
import { chatReply } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — UrbanCart AI" },
      {
        name: "description",
        content:
          "Ask the workplace assistant anything: draft wording, unblock a process, prep a meeting or think through a decision.",
      },
      { property: "og:title", content: "AI Chatbot — UrbanCart AI" },
      {
        property: "og:description",
        content: "A conversational workplace assistant for writing, planning and quick answers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Chatbot;
});

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Help me say no to a meeting politely",
  "How do I structure a weekly team check-in?",
  "Rewrite this sentence to sound more confident",
  "What should go in a project handover doc?",
];

function Chatbot() {
  const run = useServerFn(chatReply);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading]);

  const send = async (history: Msg[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await run({ data: { messages: history } });
      setMessages([...history, { role: "assistant", content: result.text }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    void send(next);
  };

  const regenerate = () => {
    const lastUser = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUser === -1) return;
    const cutoff = messages.length - lastUser;
    const history = messages.slice(0, cutoff);
    setMessages(history);
    void send(history as Msg[]);
  };

  const copy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success("Copied to clipboard", { position: "top-center" });
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      toast.error("Could not copy", { position: "top-center" });
    }
  };

  return (
    <>
      <ToolHeader
        eyebrow="AI tool 04"
        title="AI Chatbot"
        description="A general workplace assistant. Ask for wording, structure, checklists or a second opinion — and keep the conversation going."
      />

      <section className="mx-auto grid max-w-[1400px] gap-8 px-5 py-12 sm:px-8">
        <div className="flex flex-col border border-border bg-surface">
          <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <h2 className="label-mono text-muted-foreground">Conversation</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-none"
                onClick={regenerate}
                disabled={isLoading || messages.length === 0}
              >
                <RefreshCcw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span className="ml-2 hidden sm:inline">Regenerate</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-none"
                onClick={() => {
                  setMessages([]);
                  setError(null);
                }}
                disabled={isLoading || messages.length === 0}
              >
                Clear
              </Button>
            </div>
          </header>

          <div ref={scrollRef} className="h-[26rem] overflow-y-auto p-4 sm:h-[32rem]">
            {messages.length === 0 && !isLoading ? (
              <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
                <p className="max-w-md text-sm text-muted-foreground">
                  Ask anything about your work day. Try one of these to start:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      className="border border-border px-3 py-2 text-xs transition-colors hover:border-accent hover:text-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    {m.role === "user" ? (
                      <p className="max-w-[85%] bg-primary px-4 py-3 text-sm whitespace-pre-wrap text-primary-foreground">
                        {m.content}
                      </p>
                    ) : (
                      <div className="max-w-[90%]">
                        <p className="label-mono mb-2 text-accent">Assistant</p>
                        <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground">
                          {m.content}
                        </pre>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-7 rounded-none px-2 text-xs"
                          onClick={() => copy(m.content, i)}
                        >
                          {copiedIndex === i ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          <span className="ml-1.5">Copy</span>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    <span className="label-mono">Thinking</span>
                  </div>
                )}
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
            )}
          </div>

          <form
            className="flex items-end gap-3 border-t border-border p-4"
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
          >
            <Textarea
              ref={inputRef}
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              placeholder="Ask the workplace assistant…"
              className="max-h-40 min-h-11 flex-1 resize-none rounded-none"
            />
            <Button
              type="submit"
              size="icon"
              className="h-11 w-11 rounded-none"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>

        <AiDisclaimer />
      </section>
    </>
  );
}
