# ⚡ JavaScript Frontend Reference (Replacing Jinja2 / Django Templates)

> **Purpose:** Permanent architectural & code reference for **Abdellah BELMAARIS** when building dynamic frontends for **Django / Django REST Framework / Flask** backends without relying on full-page server-side template rendering.

---

## 🗺️ Quick Translation Matrix: Django/Jinja2 $\rightarrow$ Frontend JS

| Server-Side (Django / Jinja2) | Client-Side (Modern JavaScript) | Reference Module |
|:---|:---|:---|
| `{{ variable }}` (Auto-escaped text) | `element.textContent = variable` | [`01-dom-vs-jinja-rendering`](./01-dom-vs-jinja-rendering/README.md) |
| `{% if cond %} ... {% endif %}` | `element.hidden = !cond` or `classList.toggle('hidden', !cond)` | [`01-dom-vs-jinja-rendering`](./01-dom-vs-jinja-rendering/README.md) |
| `{% for item in items %} ... {% endfor %}` | `<template>` cloning or `DocumentFragment` + `items.forEach()` | [`01-dom-vs-jinja-rendering`](./01-dom-vs-jinja-rendering/README.md) |
| `{% include "partials/card.html" %}` | Reusable Component Function `createCardComponent(data)` | [`01-dom-vs-jinja-rendering`](./01-dom-vs-jinja-rendering/README.md) |
| Django View Context (`render(req, tpl, ctx)`) | `const data = await fetch('/api/items/').then(r => r.json())` | [`02-async-fetch-django-api`](./02-async-fetch-django-api/README.md) |
| `<form method="POST">` + `{% csrf_token %}` | `form.addEventListener('submit', e => { e.preventDefault(); ... })` + `X-CSRFToken` | [`03-events-and-ajax-forms`](./03-events-and-ajax-forms/README.md) |
| `request.session['cart']` / Query Params | `localStorage`, `sessionStorage`, `new URLSearchParams(location.search)` | [`04-state-and-storage`](./04-state-and-storage/README.md) |
| `{% extends "base.html" %}` / Python imports | ES Modules (`import` / `export` with `<script type="module">`) | [`05-es-modules-architecture`](./05-es-modules-architecture/README.md) |

---

## 📂 Directory Index

1. **[`01-dom-vs-jinja-rendering/`](./01-dom-vs-jinja-rendering/README.md)** — Selecting elements, safe DOM creation (`textContent` vs `innerHTML`), HTML `<template>` tags, `DocumentFragment`, and dynamic class/attribute manipulation.
2. **[`02-async-fetch-django-api/`](./02-async-fetch-django-api/README.md)** — Promises, `async/await`, `fetch()` wrapper for DRF/Flask, CSRF & JWT headers, `AbortController`, and loading/error states.
3. **[`03-events-and-ajax-forms/`](./03-events-and-ajax-forms/README.md)** — Event bubbling, Event Delegation (`e.target.closest()`), `FormData`, debouncing search inputs, and mapping DRF validation errors to form fields.
4. **[`04-state-and-storage/`](./04-state-and-storage/README.md)** — Client-side state pattern, `localStorage` / `sessionStorage`, syncing state with URL query parameters (`history.pushState` + `URLSearchParams`) for pagination/filtering.
5. **[`05-es-modules-architecture/`](./05-es-modules-architecture/README.md)** — Structuring production JS inside a Django project (`static/js/api/`, `static/js/components/`, `static/js/main.js`).
6. **[`practice-sandbox/`](./practice-sandbox/README.md)** — Your personal coding sandbox for tutorial exercises and experiments (Agent will **never** edit files here without your permission).
