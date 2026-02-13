/**
 * FILE: js/pages/search.js
 * PURPOSE: Global search across all content types
 * 
 * This module provides a unified search interface that searches across
 * cases, notes, and evidence simultaneously. It features:
 * - Single search input that queries all content types
 * - Results grouped by type (Cases, Notes, Evidence)
 * - Real-time search with debouncing (300ms delay)
 * - Click-to-navigate to relevant detail pages
 * - Only searches unlocked content (respects todo gating)
 * 
 * WHY: Enables users to quickly find information across the entire system
 * without knowing which type of content it belongs to. The grouped results
 * make it easy to see what was found in each category. This is essential
 * for a detective system where users need to connect clues from different
 * sources.
 */

import { loadCases, loadNotes, loadEvidence, isLocked } from '../store.js';
import { createEl, formatDate } from '../ui.js';

export async function renderSearch() {
  const container = createEl('div');
  
  // Header
  const header = createEl('div', { className: 'mb-3' });
  header.appendChild(createEl('h1', { textContent: 'Suche' }));
  header.appendChild(createEl('p', {
    className: 'text-secondary',
    textContent: 'Durchsuchen Sie Fallakte Müller-Einträge, Notizen und Beweise.'
  }));
  container.appendChild(header);
  
  // Search input
  const searchBar = createEl('div', { className: 'search-bar' });
  const searchInput = createEl('input', {
    type: 'text',
    className: 'search-input',
    placeholder: 'Suchbegriff eingeben...',
    id: 'global-search-input'
  });
  searchBar.appendChild(searchInput);
  container.appendChild(searchBar);
  
  // Results container
  const resultsContainer = createEl('div', { className: 'search-results', id: 'search-results' });
  container.appendChild(resultsContainer);
  
  // Load all data
  const [casesData, notesData, evidenceData] = await Promise.all([
    loadCases(),
    loadNotes(),
    loadEvidence()
  ]);
  
  const casesArray = casesData || [];
  const notesArray = notesData || [];
  const evidenceArray = evidenceData || [];
  
  // Search function
  function performSearch(query) {
    const q = query.toLowerCase().trim();
    resultsContainer.innerHTML = '';
    
    if (!q) {
      resultsContainer.appendChild(createEl('p', {
        className: 'text-muted',
        textContent: 'Geben Sie einen Suchbegriff ein, um zu beginnen.'
      }));
      return;
    }
    
    // Search cases
    const matchingCases = casesArray.filter(c => {
      if (isLocked(c)) return false;
      return (
        (c.id && c.id.toLowerCase().includes(q)) ||
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.summary && c.summary.toLowerCase().includes(q)) ||
        (c.assignedTo && c.assignedTo.toLowerCase().includes(q))
      );
    });
    
    // Search notes
    const matchingNotes = notesArray.filter(n => {
      if (isLocked(n)) return false;
      return (
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.body && n.body.toLowerCase().includes(q)) ||
        (n.author && n.author.toLowerCase().includes(q))
      );
    });
    
    // Search evidence
    const matchingEvidence = evidenceArray.filter(e => {
      if (isLocked(e)) return false;
      return (
        (e.filename && e.filename.toLowerCase().includes(q)) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.type && e.type.toLowerCase().includes(q))
      );
    });
    
    // Render results
    if (matchingCases.length === 0 && matchingNotes.length === 0 && matchingEvidence.length === 0) {
      resultsContainer.appendChild(createEl('p', {
        className: 'text-muted',
        textContent: 'Keine Ergebnisse gefunden.'
      }));
      return;
    }
    
    // Cases group
    if (matchingCases.length > 0) {
      const group = createEl('div', { className: 'search-result-group' });
      group.appendChild(createEl('div', {
        className: 'search-result-group-title',
        textContent: `Fallakte Müller-Einträge (${matchingCases.length})`
      }));
      
      matchingCases.forEach(c => {
        const item = createEl('div', {
          className: 'search-result-item',
          style: 'cursor: pointer;'
        });
        
        item.addEventListener('click', () => {
          window.location.hash = `#/cases/${c.id}`;
        });
        
        item.appendChild(createEl('div', {
          className: 'search-result-title',
          textContent: c.title || 'Unbenannter Eintrag'
        }));
        
        const meta = createEl('div', { className: 'search-result-meta' });
        meta.textContent = `${c.id} • ${formatDate(c.lastUpdated)}`;
        item.appendChild(meta);
        
        group.appendChild(item);
      });
      
      resultsContainer.appendChild(group);
    }
    
    // Notes group
    if (matchingNotes.length > 0) {
      const group = createEl('div', { className: 'search-result-group' });
      group.appendChild(createEl('div', {
        className: 'search-result-group-title',
        textContent: `Notizen (${matchingNotes.length})`
      }));
      
      matchingNotes.forEach(n => {
        const item = createEl('div', {
          className: 'search-result-item',
          style: 'cursor: pointer;'
        });
        
        item.addEventListener('click', () => {
          if (n.caseId) {
            window.location.hash = `#/cases/${n.caseId}`;
          }
        });
        
        item.appendChild(createEl('div', {
          className: 'search-result-title',
          textContent: n.title || 'Unbenannte Notiz'
        }));
        
        const meta = createEl('div', { className: 'search-result-meta' });
        meta.textContent = `${formatDate(n.date)} • ${n.author || 'Unbekannt'}`;
        item.appendChild(meta);
        
        group.appendChild(item);
      });
      
      resultsContainer.appendChild(group);
    }
    
    // Evidence group
    if (matchingEvidence.length > 0) {
      const group = createEl('div', { className: 'search-result-group' });
      group.appendChild(createEl('div', {
        className: 'search-result-group-title',
        textContent: `Beweise (${matchingEvidence.length})`
      }));
      
      matchingEvidence.forEach(e => {
        const item = createEl('div', {
          className: 'search-result-item',
          style: 'cursor: pointer;'
        });
        
        item.addEventListener('click', () => {
          if (e.caseId) {
            window.location.hash = `#/cases/${e.caseId}`;
          }
        });
        
        item.appendChild(createEl('div', {
          className: 'search-result-title',
          textContent: e.filename || 'Unbekannte Datei'
        }));
        
        const meta = createEl('div', { className: 'search-result-meta' });
        meta.textContent = `${e.type || 'unbekannt'} • ${e.description || 'Keine Beschreibung'}`;
        item.appendChild(meta);
        
        group.appendChild(item);
      });
      
      resultsContainer.appendChild(group);
    }
  }
  
  // Search input handler
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performSearch(e.target.value);
    }, 300);
  });
  
  // Initial empty state
  resultsContainer.appendChild(createEl('p', {
    className: 'text-muted',
    textContent: 'Geben Sie einen Suchbegriff ein, um zu beginnen.'
  }));
  
  return container;
}
