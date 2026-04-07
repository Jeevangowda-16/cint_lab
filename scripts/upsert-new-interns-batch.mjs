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
  "Harsh Anand": {
    college: "Jss academy of technical education",
    project: "Pose Correction App",
    phone: "9122426309",
    email: "harsh.anand.09.20@gmail.com",
    github: "https://github.com/harshanandsingh",
    linkedin: "https://www.linkedin.com/in/harsh-anand-404506245/",
  },
  "RAMISETTI KARTHIKEYA": {
    college: "ADIKAVI NANNAYA UNIVERSITY",
    project: "Prame (Yoga & Breathing) App",
    phone: "9177947293",
    email: "ramesettikarthikeya@gmail.com",
    github: "https://github.com/RGK0809",
    linkedin: "https://www.linkedin.com/in/karthikeya-ramisetti-179abb280",
  },
  "Amshumalee Bhat Marakini": {
    college: "Dr Ambedkar Institute of Technology",
    project: "GMA Project",
    phone: "9113045594",
    email: "amshurps@gmail.com",
    github: "https://github.com/amshu73",
    linkedin: "https://www.linkedin.com/in/amshumaleebhat",
  },
  "JEEVAN D": {
    college: "DR AMBEDKAR INSTITUTE OF TECHNOLOGY",
    project: "Generative Media & Visualization (IGA)",
    phone: "6360848279",
    email: "jeevandevaraju1603@gmail.com",
    github: "https://github.com/Jeevangowda-16",
    linkedin: "https://www.linkedin.com/in/jeevan-d-2b4074329",
  },
  "TEJAS M NAIDU": {
    college: "DR AMBEDKAR INSTITUTE OF TECHNOLOGY",
    project: "Generative Media & Visualization (IGA)",
    phone: "7411693431",
    email: "tejasmnaidu072@gmail.com",
    github: "https://github.com/tejasmnaidu",
    linkedin: "https://www.linkedin.com/in/tejas-m-naidu-06b2683a7",
  },
  "Mounesh S D": {
    college: "Dr Ambedkar institute of technology",
    project: "Pose Correction App",
    phone: "9380310156",
    email: "mouneshdevaraj@gmail.com",
    github: "https://github.com/Mounesh05",
    linkedin: "mounesh-s-d-43296a318/",
  },
  Priyansh: {
    college: "Presidency University",
    project: "Pose Correction App",
    phone: "8277335729",
    email: "jpriyansh223@gmail.com",
    github: "https://github.com/Priyansh0904",
    linkedin: "https://www.linkedin.com/in/priyansh-51462225b/",
  },
  "Divya N": {
    college: "JSS Academy Of Technical Education Bangalore",
    project: "Pose Correction App",
    phone: "6361686879",
    email: "divyanagaraju.2004@gmail.com",
    github: "https://github.com/DivyaN10",
    linkedin: "www.linkedin.com/in/divya-nagaraj-b76ab52aa",
  },
  "Gowtham U": {
    college: "JSS ACADEMY OF TECHNICAL EDUCATION",
    project: "Pose Correction App",
    phone: "7975650737",
    email: "gowthamubar40@gmail.com",
    github: "https://github.com/Gowtham-789",
    linkedin: "https://www.linkedin.com/in/gowtham-u-86a7b725a?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  "Veda K V": {
    college: "Dr Ambedkar Institute of technology",
    project: "Generative Media & Visualization (IGA)",
    phone: "6364179566",
    email: "vedavajjalad@gmail.com",
    github: "https://github.com/veda778",
    linkedin: "https://www.linkedin.com/in/vedakv/",
  },
  "AYUSH A WASTER": {
    college: "Dr. Ambedkar Institute of Technology",
    project: "Generative Media & Visualization (IGA)",
    phone: "8310398093",
    email: "ayushwaster@gmail.com",
    github: "https://github.com/ayush8771",
    linkedin: "https://www.linkedin.com/in/ayush-a-waster-41467633b",
  },
  "Nisarga D S": {
    college: "Dr Ambedkar Institute of Technology",
    project: "Generative Media & Visualization (IGA)",
    phone: "7019067470",
    email: "nisargads193@gmail.com",
    github: "https://github.com/nisarga193",
    linkedin: "https://www.linkedin.com/in/nisarga-d-s-780249373",
  },
  "Anvesh B R": {
    college: "Dr. Ambedkar Institute of Technology",
    project: "GMA Project",
    phone: "8660762848",
    email: "branvesh@gmail.com",
    github: "github.com/anveshbr-10",
    linkedin: "www.linkedin.com/in/anveshbr",
  },
};

const skipNames = new Set(["JEEVAN D"]);

function toId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function toAbsoluteUrl(value) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

async function run() {
  const entries = Object.entries(rawInterns).filter(([name]) => !skipNames.has(name));

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
  console.log("Skipped names:", [...skipNames].join(", "));
}

run().catch((error) => {
  console.error("Failed to upsert interns:", error.message || error);
  process.exit(1);
});
