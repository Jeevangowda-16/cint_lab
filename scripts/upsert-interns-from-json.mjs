import fs from "node:fs";
import path from "node:path";
import admin from "firebase-admin";

const serviceAccountPath = path.resolve(process.cwd(), "service-account.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("service-account.json not found in project root.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const timestamp = admin.firestore.FieldValue.serverTimestamp();

const rawInterns = {
  "HARSHAVARDHAN K": {
    college: "Dr. AMBEDKAR INSTITUTE OF TECHNOLOGY",
    project: "Generative Media & Visualization (IGA)",
    phone: "9110488856",
    email: "harshakrupakar2004@gmail.com",
    github: "https://github.com/harsharupakar",
    linkedin: "linkedin.com/in/harsha-krupakar887328333",
  },
  "Mohammed Ayan": {
    college: "Dr Ambedkar Institute of Technology",
    project: "GMA Project",
    phone: "6361937273",
    email: "mohammedayan262005@gmail.com",
    github: "https://github.com/M0hammedAyan",
    linkedin: "linkedin.com/in/mohammedayan26",
  },
  "Abhay B Suvarna": {
    college: "Dr Ambedkar Institute of Technology",
    project: "Pose Correction App",
    phone: "9148707001",
    email: "abhaybs2305@gmail.com",
    github: "https://github.com/Abhaybs",
    linkedin: "www.linkedin.com/in/abhay-bs-a1a84129b",
  },
  "Gurmann Ajmani": {
    college: "Manipal Institute of Technology, Manipal",
    project: "GMA Project",
    phone: "",
    email: "gurmann.ajmani@gmail.com",
    github: "http://github.com/GurmannAjmani",
    linkedin: "https://www.linkedin.com/in/gurmann-singh-ajmani-a80a31262/",
  },
  "C M Yuktha": {
    college: "Dr Ambedkar Institute of Technology",
    project: "GMA Project",
    phone: "9380037318",
    email: "cm.yuktha13@gmail.com",
    github: "https://github.com/CM-Yuktha",
    linkedin: "www.linkedin.com/in/cmyuktha",
  },
  "JEEVAN D": {
    college: "Dr Ambedkar Institute of Technology",
    project: "Generative Media & Visualization (IGA)",
    phone: "6360848279",
    email: "jeevandevaraju1603@gmail.com",
    github: "https://github.com/Jeevangowda-16",
    linkedin: "https://www.linkedin.com/in/jeevan-d-2b4074329",
  },
};

function toId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function toAbsoluteUrl(value) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

async function run() {
  const entries = Object.entries(rawInterns);

  for (const [name, payload] of entries) {
    const docId = toId(name);
    const ref = db.collection("interns").doc(docId);

    await ref.set(
      {
        name,
        college: payload.college,
        project: payload.project,
        program: payload.project,
        phone: payload.phone || "",
        email: payload.email,
        github: toAbsoluteUrl(payload.github),
        linkedin: toAbsoluteUrl(payload.linkedin),
        cohort: "2026",
        mentorId: "",
        focusArea: payload.project,
        status: "active",
        updatedAt: timestamp,
        createdAt: timestamp,
      },
      { merge: true }
    );

    console.log(`Upserted interns/${docId} (${name})`);
  }

  console.log(`Done. Upserted ${entries.length} interns in Firestore.`);
}

run().catch((error) => {
  console.error("Failed to upsert interns:", error.message || error);
  process.exit(1);
});
