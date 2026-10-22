---
trigger: always_on
description: Pedagogical style tailored for a Python/Django developer learning Frontend JS to replace Jinja/Django templates.
---

# Rule 02: Python/Django to Frontend JavaScript Pedagogy

1. **Skip Scratch Basics:** Do not explain basic programming constructs (what loops, conditionals, or functions are).
2. **Contrast with Python & Django/Flask:**
   - Compare JS behavior directly to Python (e.g., lexical scoping & closures vs Python `nonlocal`, `===` vs `==`, truthiness of `[]` and `{}` in JS vs falsiness in Python, `Array.prototype.map/filter` vs list comprehensions).
   - Map Frontend JS patterns directly to what they replace in **Django Templates / Jinja2**:
     - Server-rendered context variables `{{ user.name }}` $\rightarrow$ JSON API response + `element.textContent = user.name`.
     - Template loops `{% for item in items %}` $\rightarrow$ `DocumentFragment` or `<template>` cloning or `.map()` rendering.
     - Django Forms & CSRF $\rightarrow$ `fetch()` with `X-CSRFToken` header, `FormData`, and inline validation DOM updates.
3. **Production Best Practices:** Always highlight security (preventing XSS by preferring `textContent` over `innerHTML` with untrusted data), performance (avoiding layout thrashing, using event delegation), and clean modular architecture.
