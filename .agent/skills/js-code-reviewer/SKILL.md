---
name: js-code-reviewer
description: >-
  Review, debug, and explain JavaScript code problems for a Python/Django developer without modifying user files unless permitted.
---

# JavaScript Code Reviewer & Debugger (Python/Django Bridge)

## Protocol
1. **Strict Rule #1 Compliance:** Read the user's code, diagnose the issue, and explain how to fix it in the response (or in `.agent/snippets/`). Never edit the user's file without explicit permission.
2. **Diagnostic Checklist:**
   - **Async/Await & Promises:** Missing `await` on `fetch()` or `response.json()`, unhandled rejections, missing `if (!response.ok)` check, sequential waterfall instead of `Promise.all`.
   - **DOM & Events:** Selecting elements before DOM is ready, attaching listeners inside loops instead of Event Delegation (`e.target.closest()`), XSS risks with `innerHTML`.
   - **Python-to-JS Gotchas:** Using `==` instead of `===`, assuming `[]` or `{}` is falsy (they are truthy in JS!), `for...in` vs `for...of`, `this` binding in callbacks.
3. **Log Learnings:** When a notable bug or concept is discussed, record a summary in `.agent/discussions/`.
