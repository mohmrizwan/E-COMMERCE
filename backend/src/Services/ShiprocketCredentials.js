export const getShiprocketEnvironmentCredentials = (env = process.env) => {
  const email = String(env.SHIPROCKET_EMAIL || "").trim().toLowerCase();
  const password = String(env.SHIPROCKET_PASSWORD || "");
  const hasEmail = Boolean(email);
  const hasPassword = Boolean(password);

  if (hasEmail !== hasPassword) {
    throw new Error("SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD must be configured together");
  }

  return hasEmail ? { email, password } : null;
};

export const resolveShiprocketCredentials = ({
  environmentCredentials,
  storedCredentials,
}) => {
  if (environmentCredentials) return environmentCredentials;
  if (storedCredentials?.email && storedCredentials?.password) {
    return storedCredentials;
  }
  throw new Error("Shiprocket integration is not configured");
};
