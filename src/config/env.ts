const apiUrl = import.meta.env.VITE_API_URL?.trim();

if (!apiUrl) {
  throw new Error("Missing VITE_API_URL in the frontend environment");
}

export const env = {
  apiUrl: apiUrl.replace(/\/+$/, ""),
} as const;
