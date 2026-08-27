const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.7-flash";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export class AiGatewayError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "AiGatewayError";
  }
}

function friendlyMessage(status: number, raw: string) {
  if (status === 429) return "The AI service is busy right now. Please try again in a moment.";
  if (status === 402)
    return "This workspace has run out of AI credits. Add credits in Lovable to keep generating.";
  if (status === 403) return "AI access is currently blocked for this workspace.";
  if (status === 401) return "The AI service is not configured correctly.";
  return raw || "The AI service could not complete this request.";
}

export async function callLovableAI(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AiGatewayError(401, "Missing LOVABLE_API_KEY");

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`[ai-gateway] ${response.status}: ${body}`);
    throw new AiGatewayError(response.status, friendlyMessage(response.status, ""));
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new AiGatewayError(502, "The AI service returned an empty response.");
  return text;
}
