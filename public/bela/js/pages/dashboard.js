/**
 * FILE: js/pages/dashboard.js
 * PURPOSE: Main dashboard page rendering
 * 
 * This module renders the application's main dashboard view, which provides
 * an overview of the system. It displays:
 * - Statistics cards (active entries count, total notes, todo progress)
 * - Todo progress widget showing all tasks and their completion status
 * - Recent notes list (last 5 unlocked notes)
 * - Recent activity log (last 5 unlocked activities)
 * 
 * WHY: Provides users with a central hub to see system status and recent
 * activity. The dashboard helps users understand their progress and quickly
 * access recent information. All content respects todo gating - only
 * unlocked items are shown.
 */

import { loadCases, loadNotes, loadActivity, loadConfig, getProgress, isStepCompleted } from '../store.js';
import { createEl, renderCard, formatDate, formatTimestamp } from '../ui.js';

export async function renderDashboard() {
  const container = createEl('div');
  
  // Load data
  const [cases, notes, activity, config, progress] = await Promise.all([
    loadCases(),
    loadNotes(),
    loadActivity(),
    loadConfig(),
    Promise.resolve(getProgress())
  ]);
  
  const casesArray = cases || [];
  const notesArray = notes || [];
  const activityArray = activity || [];
  const todoSteps = config?.todoSteps || config?.puzzleSteps || [];
  
  // Active entries count
  const activeEntries = casesArray.filter(c => c.status === 'active').length;
  
  // Recent notes (last 5, unlocked)
  const unlockedNotes = notesArray.filter(n => !n.requiresStepId || isStepCompleted(n.requiresStepId));
  const recentNotes = unlockedNotes
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  // Recent activity (last 5, unlocked)
  const unlockedActivity = activityArray.filter(a => !a.requiresStepId || isStepCompleted(a.requiresStepId));
  const recentActivity = unlockedActivity
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);
  
  // Stats cards
  const statsGrid = createEl('div', { className: 'card-grid' });
  
  statsGrid.appendChild(renderCard(
    'Aktive Einträge',
    `${activeEntries} Eintrag${activeEntries !== 1 ? 'e' : ''}`,
    '',
    'card'
  ));
  
  statsGrid.appendChild(renderCard(
    'Notizen gesamt',
    `${unlockedNotes.length} freigeschaltet`,
    '',
    'card'
  ));
  
  statsGrid.appendChild(renderCard(
    'To Do Liste Fortschritt',
    `${progress.completedSteps?.length || 0} von ${todoSteps.length} Aufgaben`,
    '',
    'card'
  ));
  
  container.appendChild(statsGrid);
  
  // Todo Progress Widget
  const todoCard = renderCard(
    'To Do Liste Fortschritt',
    'Aufgaben abschließen, um neue Inhalte freizuschalten',
    ''
  );
  
  const progressWidget = createEl('div', { className: 'progress-widget' });
  
  todoSteps.forEach((step, idx) => {
    const completed = isStepCompleted(step.id);
    const locked = idx > 0 && !isStepCompleted(todoSteps[idx - 1].id);
    
    const stepEl = createEl('div', {
      className: `progress-step ${completed ? 'completed' : ''} ${locked ? 'locked' : ''}`
    });
    
    const icon = createEl('div', { className: 'progress-step-icon' });
    icon.textContent = completed ? '✓' : (idx + 1);
    stepEl.appendChild(icon);
    
    const label = createEl('div', { className: 'progress-step-label' });
    label.textContent = step.title || `Schritt ${idx + 1}`;
    stepEl.appendChild(label);
    
    progressWidget.appendChild(stepEl);
  });
  
  todoCard.appendChild(progressWidget);
  container.appendChild(todoCard);
  
  // Recent Notes
  const notesCard = renderCard(
    'Letzte Notizen',
    'Neueste freigeschaltete Notizen',
    ''
  );
  
  if (recentNotes.length === 0) {
    const empty = createEl('p', { className: 'text-muted' });
    empty.textContent = 'Keine Notizen verfügbar';
    notesCard.appendChild(empty);
  } else {
    const notesList = createEl('div');
    recentNotes.forEach(note => {
      const item = createEl('div', { className: 'search-result-item' });
      item.style.cursor = 'default';
      
      const title = createEl('div', { className: 'search-result-title' });
      title.textContent = note.title || 'Untitled Note';
      item.appendChild(title);
      
      const meta = createEl('div', { className: 'search-result-meta' });
      meta.textContent = `${formatDate(note.date)} • ${note.author || 'Unbekannt'}`;
      item.appendChild(meta);
      
      notesList.appendChild(item);
    });
    notesCard.appendChild(notesList);
  }
  
  container.appendChild(notesCard);
  
  // Recent Activity
  const activityCard = renderCard(
    'Letzte Aktivität',
    'Neueste Systemaktivität',
    ''
  );
  
  if (recentActivity.length === 0) {
    const empty = createEl('p', { className: 'text-muted' });
    empty.textContent = 'Keine Aktivität verfügbar';
    activityCard.appendChild(empty);
  } else {
    const activityList = createEl('div');
    recentActivity.forEach(act => {
      const item = createEl('div', { className: 'search-result-item' });
      item.style.cursor = 'default';
      
      const message = createEl('div', { className: 'search-result-title' });
      message.textContent = act.message || 'Aktivität';
      item.appendChild(message);
      
      const meta = createEl('div', { className: 'search-result-meta' });
      meta.textContent = formatTimestamp(act.timestamp);
      item.appendChild(meta);
      
      activityList.appendChild(item);
    });
    activityCard.appendChild(activityList);
  }
  
  container.appendChild(activityCard);
  
  return container;
}
