export const normalizeStorefrontHost = (hostHeader = "") => {
  const value = String(hostHeader).trim().toLowerCase();
  if (!value || value.includes(",") || /[\s/@]/.test(value.replace(/^https?:\/\//, ""))) return "";

  try {
    const url = new URL(value.includes("://") ? value : `http://${value}`);
    if (url.pathname !== "/" || url.search || url.hash) return "";
    const hostname = url.hostname.toLowerCase();
    if (!hostname || hostname.length > 253) return "";
    return hostname.endsWith(".") ? hostname.slice(0, -1) : hostname;
  } catch {
    return "";
  }
};
