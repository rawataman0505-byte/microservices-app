// Small auth service. Keep network code separate from components for maintainability.
// Use same-origin proxy paths by default to avoid browser CORS in dev.
// Rewrites in next.config.js will forward /api/auth/* to the backend.
const DEFAULT_SIGNUP_URL = '/api/auth/signup';
const DEFAULT_LOGIN_URL = '/api/auth/login';

// Structured API error so consumers can inspect status and response body
export class APIError extends Error {
  constructor(message, status = 0, response = null) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.response = response;
  }
}

async function parseResponse(res) {
  let data = null;
  try {
    data = await res.json();
  } catch (err) {
    data = null;
  }
  // Normalize token extraction (header or body)
  let token = null;
  try {
    const headerToken =
      res.headers.get("authorization") ||
      res.headers.get("Authorization") ||
      null;
    if (headerToken) token = headerToken.replace(/^Bearer\s+/i, "");
  } catch (e) {
    // ignore header read errors
  }

  // If token not found in header, look into response body with flexible key matching
  if (!token && data && typeof data === "object") {
    // create a map of lowercase keys to values for case-insensitive lookup
    const lc = Object.keys(data).reduce((acc, k) => {
      acc[k.toLowerCase()] = data[k];
      return acc;
    }, {});

    if (lc.token) token = lc.token;
    else if (lc.accesstoken) token = lc.accesstoken;
    else if (lc.jwt) token = lc.jwt;
    else if (lc.authorization) {
      // sometimes backend may return the full header value
      token = String(lc.authorization).replace(/^Bearer\s+/i, "");
    } else if (typeof data.Token === "string") {
      // handle oddly-cased Token field
      token = data.Token;
    }
  }

  // On non-OK responses throw a structured APIError; prefer server message (case-insensitive)
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    if (data && typeof data === "object") {
      message = data.message || data.Message || message;
    }
    throw new APIError(message, res.status, data);
  }

  return { data, token };
}

export async function signup({ name, email, password }) {
  // Prefer same-origin proxy path; if env var is a full backend URL, convert it
  // to the proxied client path to avoid CORS.
  let url = DEFAULT_SIGNUP_URL
  const envUrl = process.env.NEXT_PUBLIC_SIGNUP_URL
  if (envUrl) {
    try {
      const parsed = new URL(envUrl)
      if (parsed.pathname && parsed.pathname.startsWith('/auth/api/auth')) {
        url = '/api/auth' + parsed.pathname.replace('/auth/api/auth','')
      } else {
        url = envUrl
      }
    } catch (e) {
      url = envUrl
    }
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    return await parseResponse(res);
  } catch (err) {
    // Re-throw known APIError or wrap network errors
    if (err instanceof APIError) throw err;
    throw new APIError(err.message || "Network error", 0, null);
  }
}

export async function login({ email, password }) {
  let url = DEFAULT_LOGIN_URL
  const envUrl = process.env.NEXT_PUBLIC_LOGIN_URL
  if (envUrl) {
    try {
      const parsed = new URL(envUrl)
      if (parsed.pathname && parsed.pathname.startsWith('/auth/api/auth')) {
        url = '/api/auth' + parsed.pathname.replace('/auth/api/auth','')
      } else {
        url = envUrl
      }
    } catch (e) {
      url = envUrl
    }
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    return await parseResponse(res);
  } catch (err) {
    if (err instanceof APIError) throw err;
    throw new APIError(err.message || "Network error", 0, null);
  }
}
