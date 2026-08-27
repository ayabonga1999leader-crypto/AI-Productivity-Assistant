import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks, Loader2 } from "lucide-react";
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
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — UrbanCart AI" },
      {
        name: "description",
        content:
          "Turn a messy list of goals into a prioritised, time-boxed plan with effort estimates and a sensible order of work.",
      },
      { property: "og:title", content: "AI Task Planner — UrbanCart AI" },
      {
        property: "og:description",
        content: "Prioritised, realistic work plans built from your goals and available hours.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TaskPlanner,
});

const horizons = ["Today", "This week", "Next two weeks", "This month", "This quarter"];

function TaskPlanner() {
  const run = useServerFn(planTasks);
  const [goals, setGoals] = useState("");
  const [horizon, setHorizon] = useState("Today");
  const [hours, setHours] = useState("8");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async () => {
    if (goals.trim().length < 5) {
      setError("List a few goals or tasks to plan.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await run({ data: { goals, horizon, hours } });
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
        eyebrow="AI tool 03"
        title="AI Task Planner"
        description="Dump everything on your plate. The planner prioritises it, estimates the effort and lays out a realistic order of work for the time you actually have."
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
            <Label htmlFor="goals">Goals, tasks and deadlines</Label>
            <Textarea
              id="goals"
              className="min-h-56 rounded-none"
              placeholder={"• Finish Q3 report (due Thursday)\n• Onboard new intern\n• Reply to supplier quotes\n• Prep Monday's team session"}
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Planning horizon</Label>
              <Select value={horizon} onValueChange={setHorizon}>
                <SelectTrigger className="rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {horizons.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Available hours</Label>
              <Input
                id="hours"
                type="number"
                min={1}
                max={200}
                className="rounded-none"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="rounded-none" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ListChecks className="mr-2 h-4 w-4" /> Build my plan
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
            emptyHint="Your prioritised plan will appear here, with effort estimates and an order of work."
          />
          <AiDisclaimer />
        </div>
      </section>
    </>
  );
}
