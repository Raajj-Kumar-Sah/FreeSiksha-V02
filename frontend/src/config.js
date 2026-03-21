const backendPort = import.meta.env.VITE_BACKEND_PORT || "5000";
const rawServerUrl = import.meta.env.VITE_API_URL || `http://localhost:${backendPort}`;
export const serverUrl = rawServerUrl.replace(/\/+$/, "");
