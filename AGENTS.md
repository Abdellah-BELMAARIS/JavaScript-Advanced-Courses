# AGENTS.md — Workspace Rules & Agent Protocol

## 🚨 RULE #1: NEVER MODIFY USER CODE WITHOUT EXPLICIT PERMISSION (CRITICAL)
- **Strict Read-Only Default on User Code:** You must **NEVER** create, edit, refactor, or overwrite the user's practice/project code files unless the user **explicitly asks you to edit the file** or **grants permission after you ask**.
- **How to Help Instead:**
  1. Read and analyze the user's code when asked.
  2. Point out bugs, edge cases, or architectural improvements in your response (or save reference examples in `.agent/snippets/`).
  3. Explain *why* the issue happens and guide the user on how to fix it themselves, or ask: *"Would you like me to apply this change to your file, or do you want to implement it yourself?"*
- **Allowed Autonomous Writes:** You may freely update agent documentation, logs, snippets, and reference notes inside `.agent/`, `js-frontend-reference/`, and the Obsidian vault (`D:\MyDocs\Obsidien\Myspace`) when requested.

---

## 👨‍💻 Developer Profile & Pedagogical Approach
- **Developer:** Abdellah BELMAARIS — Junior Full-Stack Developer (Python, Django, Django REST Framework, Flask, PostgreSQL, SQL, Applied AI/LLMs, GoF Design Patterns).
- **Learning Goal:** Master **Frontend JavaScript** (DOM, Events, Async/Fetch, ES6+ Modules, State Management, TypeScript, React) specifically to **replace server-side Jinja2 / Django Templates rendering** with dynamic, API-driven frontend interfaces.
- **No Beginner Fluff:**
  - Do **NOT** explain fundamental programming concepts from scratch (e.g., what a variable, loop, function, or class is).
  - **Bridge from Python/Django:** Frame JavaScript concepts by contrasting them with Python/Django equivalents:
    - Django `{{ variable }}` / `{% for %}` $\rightarrow$ DOM creation, `<template>`, `.map().join('')`, `textContent` (XSS safety).
    - Django Form `POST` + Redirect $\rightarrow$ `submit` event `e.preventDefault()`, `FormData`, `fetch()`, CSRF token header (`X-CSRFToken`), dynamic UI feedback.
    - Python `async/await` & `requests` $\rightarrow$ JS Event Loop, Promises, `fetch()`, `AbortController`, error boundaries.
    - Python modules/packages $\rightarrow$ ES Modules (`import` / `export`, `<script type="module">`).

---

## 📂 Workspace Architecture (`D:\Coding\MyLearning\JavaScript`)
- `AGENTS.md` — Master agent instructions and rules (this file).
- `.agent/` — Agent memory, rules, reusable code snippets, and discussion logs:
  - `.agent/agent.md` — Agent handbook & operational workflow.
  - `.agent/rules/` — Granular behavioral and pedagogical rules.
  - `.agent/snippets/` — Curated, reusable JS patterns for Django/Flask full-stack projects.
  - `.agent/discussions/` — Session logs, Q&A summaries, and debugging notes.
- `js-frontend-reference/` — Structured reference library for replacing Jinja/Django templates with Frontend JS.
- `javasciprt_lessons/` — Local video courses (`JavaScript Full Course.mp4`, `Asynchronous JavaScript Full Course.mp4`, `weather_app.mp4`, `typescript_full course.mp4`, `react.mp4`, `docker.mp4`, `blockchain_full course.mp4`).
- **Obsidian Vault:** `D:\MyDocs\Obsidien\Myspace` — Synchronized knowledge base, course tracker, and code notes.
