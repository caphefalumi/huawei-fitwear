import type { EmailMessage } from '../../src/modules/email/queue';

export function createTestEmailQueue() {
  const messages: EmailMessage[] = [];
  const queue = {
    send: async (body: EmailMessage) => { messages.push(structuredClone(body)); },
  } as unknown as Queue<EmailMessage>;
  return { queue, messages };
}
