# 04 — Client-Side State, URL Params & Browser Storage

## 1. Syncing Filter/Pagination State with URL Query Params
In Django server rendering, `?page=2&category=django` is handled by `request.GET`.
In Frontend JS, you should still keep filters in the URL so the user can bookmark or share links!

```javascript
// Read query params (?page=2&category=ai)
function getFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    page: Number(params.get('page')) || 1,
    category: params.get('category') || 'all',
  };
}

// Update URL without reloading page
function updateUrlFilters({ page, category }) {
  const url = new URL(window.location.href);
  url.searchParams.set('page', String(page));
  url.searchParams.set('category', category);
  window.history.pushState({}, '', url);
}
```

---

## 2. `localStorage` Safe JSON Helper
`localStorage` only stores strings and throws if `JSON.parse` receives invalid JSON:

```javascript
export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};
```
