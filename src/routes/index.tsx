import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  FileText,
  ListChecks,
  Mail,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/ToolCard";
import heroAi from "@/assets/hero-ai.jpg";

const tools = [
  {
    to: "/email-generator",
    name: "Smart Email Generator",
    tagline: "AI tool 01",
    description:
      "Describe the email you need — purpose, tone, length — and get a polished draft with subject line in seconds.",
    icon: Mail,
  },
  {
    to: "/meeting-notes",
    name: "Meeting Notes Summarizer",
    tagline: "AI tool 02",
    description:
      "Paste raw notes or a transcript and get a clean summary with decisions, action items and owners.",
    icon: FileText,
  },
  {
    to: "/task-planner",
    name: "AI Task Planner",
    tagline: "AI tool 03",
    description:
      "Turn a messy goal list into a prioritised, realistic plan that fits the hours you actually have.",
    icon: ListChecks,
  },
  {
    to: "/chatbot",
    name: "AI Chatbot",
    tagline: "AI tool 04",
    description:
      "Ask Ada anything about workplace productivity — writing, planning, meeting prep and process.",
    icon: Bot,
  },
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UrbanCart AI — Workplace productivity tools" },
      {
        name: "description",
        content:
          "Four AI tools for everyday workplace admin: smart email drafting, meeting notes summaries, task planning and a productivity chatbot.",
      },
      { property: "og:title", content: "UrbanCart AI — Workplace productivity tools" },
      {
        property: "og:description",
        content:
          "Draft emails, summarise meetings, plan your week and get answers — four AI tools, one workspace.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="relative">
        <div className="relative aspect-[16/10] sm:aspect-[21/9] overflow-hidden bg-muted">
          <img
            src={heroAi}
            alt="Abstract workspace illustration with warm light and geometric shapes"
            width={1600}
            height={1104}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-[1400px] w-full px-5 sm:px-8">
            <div className="max-w-xl">
              <p className="label-mono text-accent">AI workplace tools</p>
              <h1 className="mt-4 text-4xl sm:text-6xl lg:text-7xl leading-[0.9] uppercase">
                Do the work that matters
              </h1>
              <p className="mt-5 text-sm sm:text-base text-muted-foreground max-w-md">
                UrbanCart AI handles the admin — drafting emails, summarising meetings, planning
                your day — so you can focus on the real work.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-none">
                  <Link to="/email-generator">
                    Try the email generator <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-none">
                  <Link to="/chatbot">Ask the chatbot</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-5 grid gap-4 sm:grid-cols-3 text-sm">
          <div className="flex items-center gap-3">
            <Zap className="h-4 w-4 text-accent" />
            <span>Results in seconds, not hours</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>Human in the loop, always</span>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>Four tools, one workspace</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-14">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl uppercase">The toolkit</h2>
          <p className="label-mono text-muted-foreground">4 tools</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.to} {...tool} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-14 grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <p className="label-mono text-accent">Responsible AI</p>
            <h2 className="mt-3 text-2xl sm:text-3xl uppercase">You stay in charge</h2>
            <p className="mt-4 max-w-[52ch] text-sm text-muted-foreground">
              AI can be wrong, miss context or misread tone. Every tool here is designed for a
              human-in-the-loop workflow: review the output, edit it, and only then send or share
              it. Keep confidential or personal information out of your prompts.
            </p>
          </div>
          <div className="grid gap-3 text-sm">
            <div className="border border-border bg-background p-4">
              <p className="font-semibold">Review before sending</p>
              <p className="mt-1 text-muted-foreground">
                Treat every output as a draft — check facts, names and tone.
              </p>
            </div>
            <div className="border border-border bg-background p-4">
              <p className="font-semibold">Protect sensitive data</p>
              <p className="mt-1 text-muted-foreground">
                Don't paste passwords, ID numbers or confidential business data into prompts.
              </p>
            </div>
            <div className="border border-border bg-background p-4">
              <p className="font-semibold">Own the final word</p>
              <p className="mt-1 text-muted-foreground">
                You're responsible for what you send, publish or decide — not the AI.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
