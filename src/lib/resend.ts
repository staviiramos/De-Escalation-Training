import "server-only";
import { Resend } from "resend";

const DEFAULT_FROM = "CHCR Training <onboarding@resend.dev>";

let client: Resend | null = null;

function resendClient(): Resend {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("Email is not configured — set RESEND_API_KEY (see .env.example).");
  }
  client = new Resend(key);
  return client;
}

function appUrl(): string {
  return (process.env.APP_URL || "").replace(/\/$/, "");
}

function wrapEmail(bodyHtml: string): string {
  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 560px; margin: 0 auto; color: #0C1F3E;">
      <div style="border-bottom: 3px solid #214FA2; padding-bottom: 12px; margin-bottom: 20px;">
        <div style="font-size: 20px; font-weight: bold;">Community Health Center of Richmond</div>
        <div style="font-size: 14px; opacity: 0.75;">De-Escalation Training</div>
      </div>
      ${bodyHtml}
      <p style="margin-top: 32px; font-size: 12px; opacity: 0.6;">
        This is an automated message from CHCR's De-Escalation Training tool.
      </p>
    </div>
  `;
}

/** Sent once, immediately, when a facilitator assigns the training to someone. */
export async function sendAssignmentEmail(to: string, name: string | null): Promise<void> {
  const greeting = name ? `Hi ${name},` : "Hi,";
  const link = appUrl();
  const html = wrapEmail(`
    <p>${greeting}</p>
    <p>You've been assigned CHCR's De-Escalation Training. It's a self-paced course — a short
    pre-test, an interactive lesson with practice scenarios, and a post-test — and takes about
    an hour.</p>
    <p style="margin: 28px 0;">
      <a href="${link}" style="background: #214FA2; color: #fff; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: bold;">
        Start the Training
      </a>
    </p>
    <p style="font-size: 13px; opacity: 0.7;">Or copy this link: ${link}</p>
  `);

  await resendClient().emails.send({
    from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM,
    to,
    subject: "You've been assigned: CHCR De-Escalation Training",
    html,
  });
}

/** Sent by the reminder cron on a fixed cadence until the assignee completes the course. */
export async function sendReminderEmail(to: string, name: string | null): Promise<void> {
  const greeting = name ? `Hi ${name},` : "Hi,";
  const link = appUrl();
  const html = wrapEmail(`
    <p>${greeting}</p>
    <p>This is a reminder that CHCR's De-Escalation Training is still waiting on you. It takes
    about an hour, self-paced.</p>
    <p style="margin: 28px 0;">
      <a href="${link}" style="background: #214FA2; color: #fff; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: bold;">
        Continue to the Training
      </a>
    </p>
    <p style="font-size: 13px; opacity: 0.7;">Or copy this link: ${link}</p>
  `);

  await resendClient().emails.send({
    from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM,
    to,
    subject: "Reminder: CHCR De-Escalation Training",
    html,
  });
}
