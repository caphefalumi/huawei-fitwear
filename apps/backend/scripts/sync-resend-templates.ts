import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const wrangler = JSON.parse(await readFile(resolve(root, "wrangler.json"), "utf8")) as {
  vars?: Record<string, unknown>;
};
const apiKey = process.env.RESEND_API_KEY;
const dryRun = process.argv.includes("--dry-run");

const templates: {
  name: string;
  binding: string;
  file: string;
  variables: readonly string[];
}[] = [
  {
    name: "welcome",
    binding: "RESEND_WELCOME_TEMPLATE_ID",
    file: "welcome.html",
    variables: ["NAME"],
  },
  {
    name: "password reset",
    binding: "RESEND_PASSWORD_RESET_TEMPLATE_ID",
    file: "password-reset.html",
    variables: ["RESET_OTP"],
  },
];

for (const template of templates) {
  const id = wrangler.vars?.[template.binding];
  if (typeof id !== "string" || !id) {
    throw new Error(`Missing ${template.binding} in apps/backend/wrangler.json.`);
  }

  const html = await readFile(resolve(root, "email-templates", template.file), "utf8");
  const variables = new Set(
    [...html.matchAll(/\{\{\{([A-Z][A-Z0-9_]*)\}\}\}/g)].map((match) => match[1]!),
  );
  if (
    !html.toLowerCase().includes("<!doctype html>") ||
    template.variables.some((variable) => !variables.has(variable)) ||
    [...variables].some((variable) => !template.variables.includes(variable))
  ) {
    throw new Error(`Invalid HTML or template variables in ${template.file}.`);
  }

  if (dryRun) {
    console.info(`Validated ${template.name} template (${id}) from ${template.file}.`);
    continue;
  }

  if (!apiKey) throw new Error("RESEND_API_KEY is required to sync templates.");
  const response = await fetch(`https://api.resend.com/templates/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ html }),
  });
  if (!response.ok) {
    throw new Error(
      `Failed to sync ${template.name} template: HTTP ${response.status} ${await response.text()}`,
    );
  }

  const publishResponse = await fetch(
    `https://api.resend.com/templates/${encodeURIComponent(id)}/publish`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    },
  );
  if (!publishResponse.ok) {
    throw new Error(
      `Failed to publish ${template.name} template: HTTP ${publishResponse.status} ${await publishResponse.text()}`,
    );
  }

  console.info(`Synced and published ${template.name} template (${id}) from ${template.file}.`);
}
