import fs from "node:fs";
import path from "node:path";

const dataPath = path.resolve(process.cwd(), "src", "data", "data.json");
if (!fs.existsSync(dataPath)) {
  console.error("src/data/data.json not found.");
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dataPath, "utf8"));
db.form_config = [
  {
    id: "default",
    internshipInterestOptions: [
      "Autonomous Systems",
      "Guidance and Control",
      "Biomechanics",
      "Data and ML",
      "Embedded Systems",
      "Computer Vision"
    ],
    contactSubjectOptions: [
      "Collaboration",
      "Internship",
      "Seminar",
      "General"
    ],
    updatedAt: new Date().toISOString()
  }
];

fs.writeFileSync(dataPath, JSON.stringify(db, null, 2));
console.log("Seeded local form_config/default in src/data/data.json.");
