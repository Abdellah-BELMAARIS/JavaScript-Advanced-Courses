/**
 * SNIPPET 02: Django REST Framework / Flask Fetch API Client
 * Handles CSRF tokens (for session auth), JWT Bearer tokens, timeouts, and JSON error parsing.
 */

export function getDjangoCsrfToken() {
  const name = 'csrftoken';
  const cookies = document.cookie ? document.cookie.split(';') : [];
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

export async function apiRequest(endpoint, { method = 'GET', body = null, headers = {}, timeoutMs = 8000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const defaultHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  // Automatically attach CSRF token on mutating requests for Django
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())) {
    const csrfToken = getDjangoCsrfToken();
    if (csrfToken) defaultHeaders['X-CSRFToken'] = csrfToken;
  }

  // Handle JSON body vs FormData (for file uploads)
  let payload = body;
  if (body && !(body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  try {
    const response = await fetch(endpoint, {
      method,
      headers: defaultHeaders,
      body: payload,
      credentials: 'same-origin',
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : await response.text();

    if (!response.ok) {
      // Preserves DRF validation error dictionaries (e.g. { email: ["Enter a valid email."] })
      const error = new Error(data?.detail || `HTTP Error ${response.status}`);
      error.status = response.status;
      error.fieldErrors = data;
      throw error;
    }

    return data;
  } finally {
    clearTimeout(timer);
  }
}
