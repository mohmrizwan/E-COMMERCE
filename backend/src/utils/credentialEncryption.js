import crypto from "crypto";

const algorithm = "aes-256-gcm";

const getEncryptionKey = () => {
  const encodedKey = process.env.INTEGRATION_ENCRYPTION_KEY || "";
  if (!/^[0-9a-fA-F]{64}$/.test(encodedKey)) {
    throw new Error("INTEGRATION_ENCRYPTION_KEY must be a 32-byte hex key");
  }

  return Buffer.from(encodedKey, "hex");
};

export const encryptCredential = (value) => {
  const initializationVector = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    algorithm,
    getEncryptionKey(),
    initializationVector,
  );
  const ciphertext = Buffer.concat([
    cipher.update(String(value), "utf8"),
    cipher.final(),
  ]);

  return [
    initializationVector.toString("base64"),
    cipher.getAuthTag().toString("base64"),
    ciphertext.toString("base64"),
  ].join(":");
};

export const decryptCredential = (encryptedValue) => {
  const [encodedIv, encodedAuthTag, encodedCiphertext] = String(
    encryptedValue || "",
  ).split(":");
  if (!encodedIv || !encodedAuthTag || !encodedCiphertext) {
    throw new Error("Encrypted credential has an invalid format");
  }

  const decipher = crypto.createDecipheriv(
    algorithm,
    getEncryptionKey(),
    Buffer.from(encodedIv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(encodedAuthTag, "base64"));

  return Buffer.concat([
    decipher.update(Buffer.from(encodedCiphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
};