/**
 * SNIPPET 03: Event Delegation & AJAX Form Submission (Replacing Django Form Page Reloads)
 */
import { apiRequest } from './02-fetch-drf-api-client.js';

// 1. Event Delegation: Attach ONE listener to parent instead of N listeners to dynamic items
export function setupListActions(listSelector, { onDelete, onToggle }) {
  const listEl = document.querySelector(listSelector);
  if (!listEl) return;

  listEl.addEventListener('click', async (event) => {
    const actionBtn = event.target.closest('[data-action]');
    if (!actionBtn || !listEl.contains(actionBtn)) return;

    const itemCard = actionBtn.closest('[data-id]');
    const itemId = itemCard?.dataset.id;
    const action = actionBtn.dataset.action;

    if (action === 'delete' && onDelete) {
      await onDelete(itemId, itemCard, actionBtn);
    } else if (action === 'toggle' && onToggle) {
      await onToggle(itemId, itemCard, actionBtn);
    }
  });
}

// 2. Intercepting HTML Form Submit & Rendering DRF Field Validation Errors
export function bindAjaxForm(formSelector, apiEndpoint, onSuccess) {
  const form = document.querySelector(formSelector);
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Stop browser full-page POST reload

    const submitBtn = form.querySelector('[type="submit"]');
    const formData = new FormData(form);
    const jsonPayload = Object.fromEntries(formData.entries());

    // Clear previous field errors
    form.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));

    try {
      if (submitBtn) submitBtn.disabled = true;
      const result = await apiRequest(apiEndpoint, { method: 'POST', body: jsonPayload });
      form.reset();
      if (onSuccess) onSuccess(result);
    } catch (error) {
      // Map Django REST Framework field errors (e.g. { title: ["This field is required."] }) to DOM
      if (error.fieldErrors && typeof error.fieldErrors === 'object') {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          const errorSpan = form.querySelector(`[data-error-for="${field}"]`);
          if (errorSpan) {
            errorSpan.textContent = Array.isArray(messages) ? messages.join(' ') : String(messages);
          }
        }
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
