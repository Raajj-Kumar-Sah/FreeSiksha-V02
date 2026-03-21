const backendPort = import.meta.env.VITE_BACKEND_PORT || "5000";
export const serverUrl = import.meta.env.VITE_API_URL || `http://localhost:${backendPort}`;
