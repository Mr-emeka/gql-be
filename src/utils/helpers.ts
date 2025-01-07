import crypto from "crypto";
import { UNIQUE_HASH_SECRET } from "./constants";

export function generateUniqueCode(digits: number = 6): string {
  if (digits <= 0 || digits > 32) {
    throw new Error(
      "Invalid number of digits. Please provide a value between 1 and 32."
    );
  }

  const uniqueString = `${UNIQUE_HASH_SECRET}-${Date.now()}`;

  const hash = crypto.createHash("sha256");
  hash.update(uniqueString);

  const hexDigest = hash.digest("hex");

  const code = parseInt(hexDigest.substr(0, Math.ceil(digits / 2)), 16);

  const codeString = code.toString().slice(0, digits);

  return codeString.padStart(digits, "0");
}