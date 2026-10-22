# 01 — DOM Rendering vs Jinja2 / Django Templates

## 1. Safe Variable Interpolation (`{{ var }}` vs `textContent`)
In Django templates, `{{ user_input }}` is automatically HTML-escaped to prevent XSS.
In JavaScript:
- **NEVER** use `element.innerHTML = userInput` with untrusted data (this is equivalent to Django's `{{ user_input|safe }}` and opens XSS vulnerabilities).
- **ALWAYS** use `element.textContent = userInput` for text, or build elements via `document.createElement()` / `<template>`.

```javascript
// BAD (XSS Vulnerable if user.bio contains <script> or <img onerror=...>)
card.innerHTML = `<h3>${user.name}</h3><p>${user.bio}</p>`;

// GOOD (Safe, equivalent to auto-escaped {{ user.name }})
const title = document.createElement('h3');
title.textContent = user.name;
const bio = document.createElement('p');
bio.textContent = user.bio;
card.replaceChildren(title, bio);
```

---

## 2. Replacing `{% include "card.html" %}` with `<template>`
Instead of building deeply nested DOM trees with 20 lines of `document.createElement`, put an inert `<template>` in your HTML and clone it in JS:

```html
<!-- In your index.html -->
<template id="project-card-tpl">
  <article class="project-card">
    <h3 class="project-title"></h3>
    <p class="project-desc"></p>
    <a class="project-link" target="_blank" rel="noopener">View Repo</a>
  </article>
</template>

<div id="projects-grid"></div>
```

```javascript
// In your app.js
function renderProjects(projects) {
  const grid = document.querySelector('#projects-grid');
  const template = document.querySelector('#project-card-tpl');
  const fragment = document.createDocumentFragment();

  for (const project of projects) {
    const clone = template.content.cloneNode(true);
    clone.querySelector('.project-title').textContent = project.title;
    clone.querySelector('.project-desc').textContent = project.description;
    clone.querySelector('.project-link').href = project.repo_url;
    fragment.appendChild(clone);
  }

  grid.replaceChildren(fragment);
}
```

---

## 3. Conditional Rendering (`{% if %}`) & Classes
- Toggle visibility: `element.hidden = !isVisible;`
- Toggle CSS classes: `element.classList.toggle('is-active', isActive);`
- Read/Write `data-*` attributes (`data-user-id="42"`): `element.dataset.userId`
