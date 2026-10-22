/**
 * SNIPPET 05: Syncing DRF Pagination & Filters with Browser URLSearchParams
 */
export function getQueryFilters() {
  const params = new URLSearchParams(window.location.search);
  return {
    page: Number(params.get('page')) || 1,
    category: params.get('category') || '',
    search: params.get('search') || '',
  };
}

export function pushQueryFilters(filters) {
  const query = new URLSearchParams();
  for (const [key, val] of Object.entries(filters)) {
    if (val !== '' && val !== null && val !== undefined && !(key === 'page' && Number(val) === 1)) {
      query.set(key, String(val));
    }
  }
  const qs = query.toString();
  window.history.pushState({}, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
}
