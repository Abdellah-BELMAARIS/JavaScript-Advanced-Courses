# 05 — Modular Frontend Architecture in Django / Flask Projects

Instead of putting 1,000 lines of spaghetti jQuery/JS inside `<script>` tags at the bottom of a Django template, use native **ES Modules** (`<script type="module">`).

## Recommended Folder Structure in Django `static/js/`

```text
static/
└── js/
    ├── core/
    │   ├── api.js          # Fetch wrapper with CSRF & error handling
    │   ├── storage.js      # localStorage & URLSearchParams helpers
    │   └── dom.js          # Reusable DOM / Toast / Modal helpers
    ├── components/
    │   ├── ArticleCard.js  # Pure UI rendering functions
    │   └── Pagination.js   # Pagination controls
    └── pages/
        ├── dashboard.js    # Entry point for dashboard page
        └── articles.js     # Entry point for articles page
```

## Loading in HTML
```html
<!-- type="module" automatically defers execution until DOM is parsed and enables import/export -->
<script type="module" src="/static/js/pages/articles.js"></script>
```
