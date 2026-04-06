import fs from "node:fs";
import path from "node:path";
import admin from "firebase-admin";

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/set-admin-claim.mjs <email>");
  process.exit(1);
}

const serviceAccountPath = path.resolve(process.cwd(), "service-account.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("service-account.json not found in project root.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const user = await admin.auth().getUserByEmail(email);
await admin.auth().setCustomUserClaims(user.uid, { admin: true });

console.log(`Admin claim set for ${email} (uid: ${user.uid}).`);