import { NextResponse } from "next/server";
import { sendInternshipApplicationEmail } from "@/services/emailService";
import { ensureRequiredFields } from "@/services/helpers";

function normalizePayload(payload) {
  return {
    fullName: String(payload?.fullName || "").trim(),
    email: String(payload?.email || "").trim(),
    phone: String(payload?.phone || "").trim(),
    institution: String(payload?.institution || "").trim(),
    programLevel: String(payload?.programLevel || "").trim(),
    interests: Array.isArray(payload?.interests)
      ? payload.interests.map((item) => String(item).trim()).filter(Boolean)
      : [],
    statement: String(payload?.statement || "").trim(),
    resumeUrl: String(payload?.resumeUrl || "").trim(),
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  try {
    const rawPayload = await request.json();
    const application = normalizePayload(rawPayload);

    ensureRequiredFields(application, ["fullName", "email", "institution", "statement"]);

    if (!isValidEmail(application.email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    await sendInternshipApplicationEmail(application);

    return NextResponse.json({
      success: true,
      id: `APP-${Date.now()}`,
      message: "Application submitted successfully.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submission failed.";
    const status = message.includes("Missing required fields") ? 400 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
