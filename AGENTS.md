# AGENTS.md — Workspace Rules & Agent Protocol

## 🚨 RULE #1: NEVER MODIFY USER CODE WITHOUT EXPLICIT PERMISSION (CRITICAL)
- **Strict Read-Only Default on User Code:** You must **NEVER** create, edit, refactor, or overwrite the user's practice/project code files unless the user **explicitly asks you to edit the file** or **grants permission after you ask**.
- **How to Help Instead:**
  1. Read and analyze the user's code when asked.
  2. Point out bugs, edge cases, or architectural improvements in your response (or save reference examples in `.agent/snippets/`).
  3. Explain *why* the issue happens and guide the user on how to fix it themselves, or ask: *"Would you like me to apply this change to your file, or do you want to implement it yourself?"*
- **Allowed Autonomous Writes:** You may freely update agent documentation, logs, snippets, and reference notes inside `.agent/`, `.agent/discussions/`, `.agent/js-frontend-reference/`, and the Obsidian vault (`D:\MyDocs\Obsidien\Myspace`).

---

## 👨‍💻 RULE #2: DEVELOPER PROFILE & PYTHON/DJANGO-TO-JS PEDAGOGY
- **Developer:** Abdellah BELMAARIS — Junior Full-Stack Developer at BIMPulse Digital (Python, Django, Django REST Framework, Flask, PostgreSQL, SQL, Applied AI/LLMs, GoF Design Patterns).
- **Learning Goal:** Master **Frontend JavaScript** (DOM, Events, Async/Fetch, ES6+ Modules, State Management, TypeScript, React) specifically to **replace server-side Jinja2 / Django Templates rendering** with dynamic, API-driven frontend interfaces.
- **No Beginner Fluff:**
  - Do **NOT** explain fundamental programming concepts from scratch (e.g., what a variable, loop, function, or class is).
  - **Bridge from Python/Django:** Frame JavaScript concepts by contrasting them with Python/Django equivalents:
    - Django `{{ variable }}` / `{% for %}` $\rightarrow$ DOM creation, `<template>`, `DocumentFragment`, `textContent` (XSS safety).
    - Django Form `POST` + Redirect $\rightarrow$ `submit` event `e.preventDefault()`, `FormData`, `fetch()`, CSRF token header (`X-CSRFToken`), inline DRF validation error rendering.
    - Python `async/await` & `requests` $\rightarrow$ JS Event Loop, Microtasks, Promises, `fetch()`, `Promise.all`, `AbortController`.
    - Python modules/packages $\rightarrow$ ES Modules (`import` / `export`, `<script type="module">`).

---

## 🧠 RULE #3: ALWAYS UPDATE `.agent/discussions/` (NEVER FORGET PROTOCOL)
- **Continuous Discussion Memory:** After **every** discussion, Q&A, code review, bug fix, or architectural update, you **MUST** log and update:
  1. `D:\Coding\MyLearning\JavaScript\.agent\discussions\00-discussion-index.md`
  2. The current date's session log in `D:\Coding\MyLearning\JavaScript\.agent\discussions\YYYY-MM-DD-session-log.md`
- Never let any architectural decision, bug explanation, or user preference be forgotten across turns or sessions.

---

## 📂 Workspace Architecture (`D:\Coding\MyLearning\JavaScript`)
- `AGENTS.md` — Master agent instructions and rules (this file).
- `.agent/` — Agent memory, rules, skills, reference library, snippets, and discussion logs:
  - `.agent/agent.md` — Agent handbook & operational workflow.
  - `.agent/rules/` — Always-on rules (`01-no-unsolicited-edits.md`, `02-django-to-js-pedagogy.md`, `03-always-log-discussions.md`).
  - `.agent/skills/` — Specialized skills (`jinja-to-js-advisor`, `js-code-reviewer`).
  - `.agent/js-frontend-reference/` — Structured 5-module reference library for replacing Jinja/Django templates with Frontend JS.
  - `.agent/snippets/` — Curated, reusable JS patterns (01–06) for Django/Flask full-stack projects.
  - `.agent/discussions/` — Persistent chronological index (`00-discussion-index.md`) and detailed session logs.
- `tools/mock-drf-server.mjs` & `package.json` — Local Dev & Mock DRF Server (`npm run dev` on `http://localhost:8000`).
- `javasciprt_lessons/` — 7 Local MP4 video courses (`19h 38m` total).
- **Obsidian Vault:** `D:\MyDocs\Obsidien\Myspace` — Synchronized knowledge base, video course players, `.canvas` boards, and code notes.
