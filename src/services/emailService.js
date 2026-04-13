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

  await transporter.sendMail({
    from: user,
    to,
    replyTo: application.email,
    subject: `New Internship Application: ${application.fullName}`,
    text,
  });
}
