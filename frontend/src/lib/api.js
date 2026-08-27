// Base URL resolver used by all API callers.
// Priority:
//   1. REACT_APP_BACKEND_URL — set in `frontend/.env` (used by the current preview build).
//   2. window.location.origin — used in production docker build where the frontend
//      is served by nginx together with the API under the same domain (nginx proxies /api).
//   3. "" — SSR / non-browser fallback (never actually hit in this SPA).
const envUrl = (process.env.REACT_APP_BACKEND_URL || "").trim();
export const API_BASE =
  envUrl ||
  (typeof window !== "undefined" ? window.location.origin : "");

export const API = `${API_BASE}/api`;
