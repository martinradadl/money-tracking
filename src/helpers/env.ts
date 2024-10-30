export const API_URL =
  import.meta.env.NODE_ENV === "development"
    ? import.meta.env.VITE_API_DEV_URL
    : import.meta.env.VITE_API_URL;
