import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EmailInput = z.object({
  purpose: z.string().trim().min(3).max(2000),
  recipient: z.string().trim().max(200).default(""),
  tone: z.string().trim().max(60).default("Professional"),
  length: z.string().trim().max(60).default("Medium"),
});

const NotesInput = z.object({
  notes: z.string().trim().min(20).max(20000),
  format: z.string().trim().max(60).default("Summary + action items"),
});

const PlannerInput = z.object({
  goals: z.string().trim().min(5).max(5000),
  horizon: z.string().trim().max(60).default("Today"),
  hours: z.string().trim().max(20).default("8"),
});

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(5000),
      }),
    )
    .min(1)
    .max(40),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => EmailInput.parse(data))
  .handler(async ({ data }) => {
    const { callLovableAI } = await import("./ai.server");
    const text = await callLovableAI([
      {
        role: "system",
        content:
          "You are a workplace writing assistant. Write clear, respectful business emails. Return only the email: a Subject line, then the body, then a sign-off. No commentary, no markdown code fences.",
      },
      {
        role: "user",
        content: `Write an email.\nRecipient: ${data.recipient || "unspecified"}\nTone: ${data.tone}\nLength: ${data.length}\nPurpose and key points:\n${data.purpose}`,
      },
    ]);
    return { text };
  });

export const summariseNotes = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => NotesInput.parse(data))
  .handler(async ({ data }) => {
    const { callLovableAI } = await import("./ai.server");
    const text = await callLovableAI([
      {
        role: "system",
        content:
          "You summarise meeting notes for busy teams. Be accurate and never invent decisions, names, dates or owners that are not present in the notes. If something is unclear, say so. Use plain markdown headings and bullet lists.",
      },
      {
        role: "user",
        content: `Preferred output format: ${data.format}.\n\nMeeting notes / transcript:\n${data.notes}`,
      },
    ]);
    return { text };
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => PlannerInput.parse(data))
  .handler(async ({ data }) => {
    const { callLovableAI } = await import("./ai.server");
    const text = await callLovableAI([
      {
        role: "system",
        content:
          "You are a pragmatic work planner. Turn goals into a realistic, prioritised plan. Use markdown: a prioritised task table or list with estimated effort, a suggested order of work, and a short 'watch out for' section. Do not over-commit the available time.",
      },
      {
        role: "user",
        content: `Planning horizon: ${data.horizon}\nAvailable working hours: ${data.hours}\nGoals and tasks:\n${data.goals}`,
      },
    ]);
    return { text };
  });

export const chatReply = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ChatInput.parse(data))
  .handler(async ({ data }) => {
    const { callLovableAI } = await import("./ai.server");
    const text = await callLovableAI([
      {
        role: "system",
        content:
          "You are Ada, a workplace productivity assistant. Answer concisely and practically. Help with writing, planning, prioritising, meeting prep and process questions. If you are unsure or the question needs company-specific data you do not have, say so rather than guessing.",
      },
      ...data.messages,
    ]);
    return { text };
  });
