const configuredApiUrl = (import.meta.env.VITE_API_URL || "https://ecommerceba-6dtt.onrender.com").trim();

export const API_URL = configuredApiUrl
  ? configuredApiUrl.replace(/\/+$/, "")
  : "";

export const apiUrl = (path) => {
  if (!API_URL) {
    throw new Error("VITE_API_URL is not configured for this deployment.");
  }

  return `${API_URL}/${String(path).replace(/^\/+/, "")}`;
};
