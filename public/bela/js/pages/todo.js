/**
 * FILE: js/pages/todo.js
 * PURPOSE: Interactive todo/task list interface
 * 
 * This module renders the todo list system where users complete step-by-step
 * tasks to unlock content. It provides:
 * - List of all todo tasks from config.json
 * - Input fields for each unlocked task
 * - Answer validation against expected answers
 * - Progress tracking in localStorage
 * - Task locking (later tasks locked until previous ones are completed)
 * - Success messages and visual feedback
 * 
 * WHY: Core progression mechanic that gates content. Users must
 * complete tasks in order to unlock cases, notes, and evidence. The answers
 * are validated client-side, and completion state persists across sessions.
 * This creates a progressive reveal system that guides users through the case.
 */

import { loadConfig, getProgress, completeStep, isStepCompleted } from '../store.js';
import { createEl, renderCard } from '../ui.js';

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Convert URLs in text to clickable links
 */
function linkifyUrls(text) {
  // First escape HTML to prevent XSS
  let escaped = escapeHtml(text);
  
  // Check for internal route navigation (e.g., /experience/movie/part3)
  const internalRouteRegex = /(\/experience\/[^\s]+)/gi;
  escaped = escaped.replace(internalRouteRegex, (route) => {
    // For internal routes, break out of iframe using target="_top"
    return `<a href="${escapeHtml(route)}" target="_top" style="color: var(--success); text-decoration: underline;">${route}</a>`;
  });
  
  // URL regex pattern - matches http://, https://, and www.
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  
  // Replace URLs with clickable links
  return escaped.replace(urlRegex, (url) => {
    // Add http:// if it starts with www.
    const href = url.startsWith('www.') ? `http://${url}` : url;
    return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" style="color: var(--success); text-decoration: underline;">${url}</a>`;
  });
}

export async function renderTodo() {
  const container = createEl('div');
  
  // Header
  const header = createEl('div', { className: 'mb-3' });
  header.appendChild(createEl('h1', { textContent: 'To Do Liste' }));
  header.appendChild(createEl('p', {
    className: 'text-secondary',
    textContent: 'Hoi Tim, ich habe dir eine To Do Liste vorbereitet, damit du nicht ganz verloren bist. Damit du eine gewisse Hilfe hast, habe ich dir bereits ein wenig vorgearbeitet. Sobald du Aufgaben abschliesst, werden neue Inhalte freigeschaltet und du kannst so die Adresse von Lisas Mutter herausfinden. LG Bela'
  }));
  container.appendChild(header);
  
  // Load config
  const config = await loadConfig();
  const todoSteps = config?.todoSteps || config?.puzzleSteps || [];
  const progress = getProgress();
  
  if (todoSteps.length === 0) {
    container.appendChild(createEl('div', {
      className: 'card',
      innerHTML: '<p class="text-muted">Keine Aufgaben konfiguriert.</p>'
    }));
    return container;
  }
  
  // Todo steps container
  const stepsContainer = createEl('div', { className: 'todo-steps' });
  
  todoSteps.forEach((step, idx) => {
    const completed = isStepCompleted(step.id);
    const locked = idx > 0 && !isStepCompleted(todoSteps[idx - 1].id);
    
    const stepCard = createEl('div', {
      className: `todo-step ${completed ? 'completed' : ''} ${locked ? 'locked' : ''}`
    });
    
    // Header
    const header = createEl('div', { className: 'todo-step-header' });
    const title = createEl('div', { className: 'todo-step-title' });
    title.textContent = step.title || `Schritt ${idx + 1}`;
    header.appendChild(title);
    
    if (completed) {
      const badge = createEl('span', {
        className: 'badge badge-success',
        textContent: 'Abgeschlossen'
      });
      header.appendChild(badge);
    }
    stepCard.appendChild(header);
    
    // Description
    if (step.description) {
      const desc = createEl('div', { className: 'todo-step-description' });
      desc.textContent = step.description;
      stepCard.appendChild(desc);
    }
    
    // Input form (only if not completed and not locked)
    if (!completed && !locked) {
      const inputGroup = createEl('div', { className: 'todo-input-group' });
      const input = createEl('input', {
        type: 'text',
        className: 'todo-input',
        placeholder: step.inputLabel || 'Antwort eingeben...',
        id: `todo-input-${step.id}`
      });
      
      const submitBtn = createEl('button', {
        type: 'button',
        className: 'btn btn-primary',
        textContent: 'Absenden'
      });
      
      submitBtn.addEventListener('click', () => {
        const answer = input.value.trim().toLowerCase();
        const expected = (step.expectedAnswer || '').trim().toLowerCase();
        
        // Remove any existing error message
        const existingError = stepCard.querySelector('.todo-error');
        if (existingError) {
          existingError.remove();
        }
        
        if (answer === expected) {
          // Correct!
          completeStep(step.id);
          
          // Show success message
          const success = stepCard.querySelector('.todo-success');
          if (success) {
            success.classList.add('show');
            success.innerHTML = linkifyUrls(step.successMessage || 'Richtig! Schritt abgeschlossen.');
          } else {
            const successEl = createEl('div', {
              className: 'todo-success show',
              innerHTML: linkifyUrls(step.successMessage || 'Richtig! Schritt abgeschlossen.')
            });
            stepCard.appendChild(successEl);
          }
          
          // Disable input
          input.disabled = true;
          submitBtn.disabled = true;
          
          // Reload page to update UI
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          // Wrong answer - show error message in UI
          const errorEl = createEl('div', {
            className: 'todo-error show',
            textContent: 'Falsche Antwort. Versuche es erneut.'
          });
          stepCard.appendChild(errorEl);
          input.focus();
          
          // Remove error message after 5 seconds
          setTimeout(() => {
            if (errorEl.parentElement) {
              errorEl.remove();
            }
          }, 5000);
        }
      });
      
      // Allow Enter key
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          submitBtn.click();
        }
      });
      
      inputGroup.appendChild(input);
      inputGroup.appendChild(submitBtn);
      stepCard.appendChild(inputGroup);
    } else if (completed) {
      // Show success message for completed steps
      const successEl = createEl('div', {
        className: 'todo-success show',
        innerHTML: linkifyUrls(step.successMessage || '✓ Schritt abgeschlossen!')
      });
      stepCard.appendChild(successEl);
    } else if (locked) {
      // Show locked message
      const lockedMsg = createEl('div', {
        className: 'text-muted',
        style: 'padding: 12px; background: var(--bg-secondary); border-radius: var(--radius);',
        textContent: `Schließen Sie die vorherige Aufgabe ab, um diese Aufgabe freizuschalten.`
      });
      stepCard.appendChild(lockedMsg);
    }
    
    stepsContainer.appendChild(stepCard);
  });
  
  container.appendChild(stepsContainer);
  
  return container;
}
