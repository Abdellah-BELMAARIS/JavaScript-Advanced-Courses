/**
 * SNIPPET 04: DRF SimpleJWT Fetch Wrapper with Automatic 401 Token Refresh
 */
export async function fetchWithJwt(url, options = {}) {
  let accessToken = localStorage.getItem('access_token');
  const headers = new Headers(options.headers || {});
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('Unauthenticated');

    const refreshRes = await fetch('/api/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!refreshRes.ok) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw new Error('Refresh token expired');
    }

    const { access } = await refreshRes.json();
    localStorage.setItem('access_token', access);
    headers.set('Authorization', `Bearer ${access}`);
    response = await fetch(url, { ...options, headers });
  }

  return response;
}
