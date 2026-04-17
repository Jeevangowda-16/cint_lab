import nodemailer from "nodemailer";

const DEFAULT_RECIPIENT = "jeevangowda1622@gmail.com";

function ensureMailConfig() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "Email service is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local."
    );
  }

  return {
    user,
    pass,
    to: process.env.GMAIL_TO || DEFAULT_RECIPIENT,
  };
}

function buildEmailContent(application) {
  const interests = Array.isArray(application.interests) && application.interests.length
    ? application.interests.join(", ")
    : "None selected";

  const lines = [
    "New internship application received",
    "",
    `Submitted at: ${new Date().toISOString()}`,
    `Full Name: ${application.fullName}`,
    `Email: ${application.email}`,
    `Phone: ${application.phone || "Not provided"}`,
    `Institution: ${application.institution}`,
    `Program Level: ${application.programLevel || "Not provided"}`,
    `Interests: ${interests}`,
    `Resume URL: ${application.resumeUrl || "Not provided"}`,
    "",
    "Statement of Purpose:",
    application.statement,
  ];

  return lines.join("\n");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildEmailHtml(application) {
  const interests = Array.isArray(application.interests) && application.interests.length
    ? application.interests.join(", ")
    : "None selected";

  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.5;">
      <h2 style="margin: 0 0 12px;">New internship application received</h2>
      <p style="margin: 0 0 16px;"><strong>Submitted at:</strong> ${escapeHtml(new Date().toISOString())}</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 720px;">
        <tbody>
          <tr><td style="padding: 6px 0; width: 160px;"><strong>Full Name</strong></td><td style="padding: 6px 0;">${escapeHtml(application.fullName)}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Email</strong></td><td style="padding: 6px 0;">${escapeHtml(application.email)}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Phone</strong></td><td style="padding: 6px 0;">${escapeHtml(application.phone || "Not provided")}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Institution</strong></td><td style="padding: 6px 0;">${escapeHtml(application.institution)}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Program Level</strong></td><td style="padding: 6px 0;">${escapeHtml(application.programLevel || "Not provided")}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Interests</strong></td><td style="padding: 6px 0;">${escapeHtml(interests)}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Resume URL</strong></td><td style="padding: 6px 0;">${escapeHtml(application.resumeUrl || "Not provided")}</td></tr>
        </tbody>
      </table>
      <h3 style="margin: 18px 0 8px;">Statement of Purpose</h3>
      <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(application.statement)}</p>
    </div>
  `;
}

export async function sendInternshipApplicationEmail(application) {
  const { user, pass, to } = ensureMailConfig();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  const text = buildEmailContent(application);
  const html = buildEmailHtml(application);

  await transporter.sendMail({
    from: user,
    to,
    replyTo: application.email,
    subject: `New Internship Application: ${application.fullName}`,
    text,
    html,
  });
}
