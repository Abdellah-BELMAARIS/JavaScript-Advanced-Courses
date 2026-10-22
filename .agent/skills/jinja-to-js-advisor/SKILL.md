---
name: jinja-to-js-advisor
description: >-
  Convert or explain how to replace server-side Jinja2 / Django Templates (loops, conditionals, context variables, forms, CSRF) with modern Frontend JavaScript (DOM APIs, <template>, DocumentFragment, Fetch API, Event Delegation).
---

# Jinja2 / Django Templates to Frontend JS Advisor

## Protocol
1. **Strict Rule #1 Compliance:** Never modify the user's own code files unless explicitly asked or granted permission.
2. **Side-by-Side Architecture Mapping:**
   - Show the exact mapping from the Django/Jinja construct (`{{ var }}`, `{% for %}`, `{% if %}`, `<form method="post">`) to modern Vanilla JS or React.
   - Always emphasize XSS protection (`textContent` / `<template>` over `innerHTML`), layout performance (`DocumentFragment`), and DRF integration (`X-CSRFToken`, `response.ok`, serializer field errors).
3. **Reference Linking:** Link relevant patterns to `js-frontend-reference/` and `.agent/snippets/`.
