/**
 * SNIPPET 01: Replacing Jinja2 / Django Templates ({% for %}, {% if %}, {{ var }}) with DOM Rendering
 * Safe against XSS by using <template> + textContent instead of raw innerHTML concatenation.
 */

// Equivalent to Django:
// {% for article in articles %}
//   <article class="card" data-id="{{ article.id }}">
//     <h3>{{ article.title }}</h3>
//     <span class="badge">{{ article.is_published|yesno:"Published,Draft" }}</span>
//   </article>
// {% empty %}
//   <p>No articles found.</p>
// {% endfor %}

export function renderArticlesList(containerSelector, articles) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.replaceChildren(); // Fast & safe way to clear container

  // Equivalent to {% empty %}
  if (!Array.isArray(articles) || articles.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'empty-state';
    emptyMsg.textContent = 'No articles found.';
    container.appendChild(emptyMsg);
    return;
  }

  // DocumentFragment batches DOM insertions into a single browser reflow/repaint
  const fragment = document.createDocumentFragment();

  for (const article of articles) {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.id = article.id; // data-id="{{ article.id }}"

    const title = document.createElement('h3');
    title.textContent = article.title; // Safe {{ article.title }} (auto-escaped)

    const badge = document.createElement('span');
    badge.className = `badge ${article.is_published ? 'badge-success' : 'badge-draft'}`;
    badge.textContent = article.is_published ? 'Published' : 'Draft';

    card.append(title, badge);
    fragment.appendChild(card);
  }

  container.appendChild(fragment);
}
