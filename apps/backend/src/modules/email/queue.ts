import { getEmailConfig, getEmailQueue } from "../../db";
export type EmailMessage =
  | { type: "welcome"; to: string; name: string | null }
  | { type: "password-reset"; to: string; otp: string; expiresAt: number };

const RESEND_URL = "https://api.resend.com/emails";
const MIN_SEND_INTERVAL_MS = 110;
let lastRequestStartedAt = 0;
async function waitForSendWindow(startedAt: number): Promise<void> {
  if (!Number.isFinite(startedAt) || startedAt <= 0) return;
  const deadline = startedAt + MIN_SEND_INTERVAL_MS;
  for (let attempt = 0; attempt < 5; attempt++) {
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) break;
    await new Promise((resolve) => setTimeout(resolve, remainingMs + 2));
  }
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]!,
  );
}

export function isEmailMessage(body: unknown): body is EmailMessage {
  if (!body || typeof body !== "object") return false;
  const message = body as Record<string, unknown>;
  if (typeof message.to !== "string" || !message.to) return false;
  if (message.type === "welcome") return message.name === null || typeof message.name === "string";
  return (
    message.type === "password-reset" &&
    typeof message.otp === "string" &&
    /^\d{8}$/.test(message.otp) &&
    typeof message.expiresAt === "number" &&
    Number.isFinite(message.expiresAt)
  );
}

export async function enqueueEmail(message: EmailMessage): Promise<void> {
  const queue = getEmailQueue();
  if (!queue) throw new Error("EMAIL_QUEUE binding is required.");
  await queue.send(message);
}

export async function consumeEmailBatch(batch: MessageBatch<unknown>): Promise<void> {
  for (const message of batch.messages) {
    const body = message.body;
    if (!isEmailMessage(body)) {
      console.error(
        JSON.stringify({
          event: "email_queue_invalid_message",
          messageId: message.id,
          attempts: message.attempts,
        }),
      );
      message.ack();
      continue;
    }
    if (body.type === "password-reset" && body.expiresAt <= Date.now()) {
      console.info(
        JSON.stringify({
          event: "email_queue_expired_reset",
          messageId: message.id,
          type: body.type,
          attempts: message.attempts,
        }),
      );
      message.ack();
      continue;
    }
    const { apiKey, from, resetUrl, welcomeTemplateId, passwordResetTemplateId } = getEmailConfig();

    if (
      !apiKey ||
      !from ||
      (body.type === "welcome" && !welcomeTemplateId) ||
      (body.type === "password-reset" && (!resetUrl || !passwordResetTemplateId))
    ) {
      message.retry({ delaySeconds: 60 });
      continue;
    }

    if (lastRequestStartedAt > 0) await waitForSendWindow(lastRequestStartedAt);
    let requestStartedAt = 0;

    try {
      let resetLink: URL | undefined;
      if (body.type === "password-reset") resetLink = new URL(resetUrl!);
      const isReset = body.type === "password-reset";
      const templateId = isReset ? passwordResetTemplateId! : welcomeTemplateId!;
      const variables = isReset
        ? { RESET_URL: resetLink!.toString(), RESET_OTP: body.otp }
        : { NAME: escapeHtml(body.name ?? "there") };
      lastRequestStartedAt = Date.now();
      requestStartedAt = lastRequestStartedAt;
      const response = await fetch(RESEND_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": message.id,
        },
        body: JSON.stringify({ from, to: [body.to], template: { id: templateId, variables } }),
      });
      if (!response.ok) throw new Error(`Resend returned HTTP ${response.status}.`);
      await waitForSendWindow(requestStartedAt);
      console.info(
        JSON.stringify({
          event: "email_queue_sent",
          messageId: message.id,
          type: body.type,
          attempts: message.attempts,
        }),
      );
      message.ack();
    } catch {
      if (requestStartedAt > 0) await waitForSendWindow(requestStartedAt);
      console.error(
        JSON.stringify({
          event: "email_queue_send_failed",
          messageId: message.id,
          type: body.type,
          attempts: message.attempts,
        }),
      );
      message.retry({ delaySeconds: 60 });
    }
  }
}
