import nodeCrypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const secret = nodeCrypto.randomBytes(32).toString("base64");
const envPath = path.resolve(process.cwd(), ".env.local");

let existing = "";

if (fs.existsSync(envPath)) {
  existing = fs.readFileSync(envPath, "utf-8");

  if (existing.includes("AUTH_SECRET=")) {
    console.log("AUTH_SECRET already exists in .env.local");
    process.exit(0);
  }
}

const entry = `\n# Auth Secret\nAUTH_SECRET=${secret}\n`;
fs.appendFileSync(envPath, entry);

console.log("AUTH_SECRET added to .env.local");