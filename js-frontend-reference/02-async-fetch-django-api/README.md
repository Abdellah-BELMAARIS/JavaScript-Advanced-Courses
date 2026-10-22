# 02 — Asynchronous JS & Fetching Django/Flask APIs

## 1. Mental Model: Python `requests` vs Browser `fetch()`
1. **`fetch()` requires TWO `await` calls:**
   - First `await fetch(url)` resolves as soon as HTTP response headers arrive.
   - Second `await response.json()` reads and parses the response body stream.
2. **`fetch()` does NOT throw on HTTP 400 / 404 / 500!**
   - Unlike Python's `response.raise_for_status()`, `fetch()` only rejects on network failure or timeout.
   - You **must** check `if (!response.ok)` manually.

```javascript
async function fetchArticles(page = 1) {
  const response = await fetch(`/api/articles/?page=${page}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return await response.json(); // { count, next, previous, results: [...] }
}
```

---

## 2. Parallel Requests (`Promise.all`)
When a page needs multiple independent endpoints (e.g., User Profile + Notifications + Stats), **do not** `await` them sequentially in a waterfall:

```javascript
// SLOW (Sequential Waterfall: t1 + t2 + t3)
const profile = await getProfile();
const stats = await getStats();

// FAST (Concurrent execution: max(t1, t2))
const [profile, stats] = await Promise.all([
  getProfile(),
  getStats(),
]);
```

---

## 3. Cancelling Stale Requests (`AbortController`)
When a user types fast in a live search box or switches tabs quickly, cancel the previous in-flight request so an older slow response doesn't overwrite a newer fast response:

```javascript
let searchController = null;

async function searchProducts(query) {
  if (searchController) searchController.abort(); // Cancel previous request
  searchController = new AbortController();

  try {
    const res = await fetch(`/api/products/?search=${encodeURIComponent(query)}`, {
      signal: searchController.signal,
    });
    const data = await res.json();
    renderProducts(data.results);
  } catch (err) {
    if (err.name === 'AbortError') return; // Expected cancellation, ignore
    console.error('Search failed:', err);
  }
}
```
