import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runGateway } from "./ai.server";

const EmailInput = z.object({
  brief: z.string().min(5).max(4000),
  tone: z.enum(["formal", "friendly", "persuasive", "concise", "apologetic"]),
  recipient: z.string().max(200).optional(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await runGateway(
      "You are a professional workplace writing assistant. Write complete, ready-to-send business emails in markdown. Always include a subject line, a greeting, a well-structured body and a sign-off. Never invent facts that were not provided; use [placeholders] instead.",
      `Tone: ${data.tone}\nRecipient: ${data.recipient || "unspecified"}\n\nWrite an email based on this brief:\n${data.brief}`,
    );
    return { text };
  });

const NotesInput = z.object({ notes: z.string().min(20).max(20000) });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => NotesInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await runGateway(
      "You summarize meeting notes for busy professionals. Reply in markdown with exactly these sections: '## Summary' (3-5 bullets), '## Decisions', '## Action items' (a markdown table with Owner, Task, Deadline), '## Risks & open questions'. If information is missing, write 'Not specified'.",
      `Summarize these meeting notes:\n\n${data.notes}`,
    );
    return { text };
  });

const PlannerInput = z.object({
  tasks: z.string().min(5).max(8000),
  horizon: z.enum(["day", "week"]),
  hours: z.number().min(1).max(16),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlannerInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await runGateway(
      "You are a productivity planner. Produce a realistic, time-blocked schedule in markdown. Prioritise using impact vs urgency, include focus blocks, short breaks and a '## Priorities' section explaining the ranking. End with '## If time runs out' listing what to drop.",
      `Planning horizon: ${data.horizon}\nAvailable working hours per day: ${data.hours}\n\nTasks and context:\n${data.tasks}`,
    );
    return { text };
  });
