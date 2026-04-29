/**
 * api/client.js
 *
 * This is your "API Client" — a thin wrapper around the browser's built-in
 * fetch() function. Every request your app makes to the backend goes through here.
 *
 * WHY have a wrapper at all?
 *   - One place to set your base URL (point at Laravel, Node, etc.)
 *   - One place to attach auth tokens to every request
 *   - One place to handle errors consistently
 *
 * When you connect to Laravel, you'll change BASE_URL to something like:
 *   http://localhost:8000/api
 * and the rest of your components stay exactly the same.
 */


// htis is how to connec to backend, think of it all your requiest as a presset of http://localhost:8000 which is needed to 
// call backend, and now you just have to put the url of this frontend to backend cors
const BASE_URL = import.meta.env.BACKEND_URL || "http://localhost:8000/api";

/**
 * Reads the JWT token from localStorage.
 * When the user logs in, you save their token here.
 * Every request then sends it in the Authorization header.
 */
function getToken() {
  return localStorage.getItem("auth_token");
}

/**
 * The main function. All the specific API calls below use this.
 *
 * @param {string} path       - e.g. "/classes" or "/classes/5"
 * @param {object} options    - same options as fetch() — method, body, etc.
 * @returns {Promise<any>}    - the JSON response from your backend
 */
async function request(path, options = {}) {
  const token = getToken();

  const response = await fetch(`${BASE_URL}${path}`, {
    // Default headers for every request:
    headers: {
      "Content-Type": "application/json",
      // If the user is logged in, send their token.
      // Laravel's Sanctum or Passport will validate this.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // Merge any extra headers the caller passed in:
      ...options.headers,
    },
    ...options,
  });

  // If the server sends back a non-2xx status (like 404, 500, 401),
  // throw an error so the calling code can catch it.
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || `HTTP error ${response.status}`;
    throw new Error(message);
  }

  // 204 No Content — server responded OK but sent no body
  if (response.status === 204) return null;

  return response.json();
}

// ─── Exported helpers ──────────────────────────────────────────────────────────
// These are just shortcuts so callers don't have to write { method: "GET" } etc.

export function get(path) {
  return request(path, { method: "GET" });
}

export function post(path, data) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function put(path, data) {
  return request(path, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function patch(path, data) {
  return request(path, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function del(path) {
  return request(path, { method: "DELETE" });
}