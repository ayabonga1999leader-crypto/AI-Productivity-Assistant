import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CalendarClock } from "lucide-react";
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
import { planTasks } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn a messy task list into a prioritised, time-blocked daily or weekly schedule with AI.",
      },
      { property: "og:title", content: "AI Task Planner | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Prioritise your workload and get a realistic time-blocked plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState<"day" | "week">("day");
  const [hours, setHours] = useState(8);

  const mutation = useMutation({
    mutationFn: () => planTasks({ data: { tasks, horizon, hours } }),
  });

  const run = () => {
    if (tasks.trim().length < 5) return;
    mutation.mutate();
  };

  return (
    <>
      <PageHeader
        icon={CalendarClock}
        title="AI Task Planner"
        subtitle="List everything on your plate — get a prioritised, time-blocked schedule."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide">Your workload</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="horizon">Plan for</Label>
                <Select value={horizon} onValueChange={(v) => setHorizon(v as "day" | "week")}>
                  <SelectTrigger id="horizon">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">A single day</SelectItem>
                    <SelectItem value="week">A full week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Working hours per day</Label>
                <Input
                  id="hours"
                  type="number"
                  min={1}
                  max={16}
                  value={hours}
                  onChange={(e) => setHours(Math.min(16, Math.max(1, Number(e.target.value) || 1)))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tasks">Tasks, deadlines and context</Label>
              <Textarea
                id="tasks"
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                rows={12}
                placeholder={"Finish Q3 report (due Friday)\nClient call at 11:00\nReview 3 pull requests\nPrep onboarding deck"}
              />
            </div>
            <Button
              className="w-full rounded-full"
              onClick={run}
              disabled={mutation.isPending || tasks.trim().length < 5}
            >
              Build my schedule
            </Button>
          </div>
        </section>

        <AiOutput
          title="Your plan"
          text={mutation.data?.text ?? ""}
          isLoading={mutation.isPending}
          error={mutation.error ? (mutation.error as Error).message : null}
          onRegenerate={mutation.data || mutation.error ? run : undefined}
          emptyHint="Your prioritised schedule will appear here."
        />
      </div>

      <ResponsibleAiNotice />
    </>
  );
}
