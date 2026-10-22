# 03 — DOM Events, Event Delegation & AJAX Forms

## 1. Why Event Delegation Matters for Dynamic UI
When you render elements dynamically via `fetch()` (replacing `{% for %}`), attaching `addEventListener` to individual buttons before they exist fails, and re-attaching on every re-render causes memory leaks.

**Solution:** Attach a single listener to the static parent container and use `event.target.closest(selector)`:

```javascript
const todoList = document.querySelector('#todo-list');

todoList.addEventListener('click', async (e) => {
  const deleteBtn = e.target.closest('button[data-action="delete"]');
  if (!deleteBtn) return;

  const row = deleteBtn.closest('li[data-id]');
  const todoId = row.dataset.id;

  // Optimistic UI or await API delete
  const res = await fetch(`/api/todos/${todoId}/`, { method: 'DELETE' });
  if (res.ok) row.remove();
});
```

---

## 2. Debouncing Input Events (Search / Autocomplete)
Never fire an API call on every single `input` keystroke without debouncing:

```javascript
export function debounce(fn, delayMs = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

// Usage:
const searchInput = document.querySelector('#search-input');
searchInput.addEventListener('input', debounce((e) => {
  fetchSearchResults(e.target.value.trim());
}, 300));
```
