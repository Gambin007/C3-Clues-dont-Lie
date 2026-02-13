/**
 * FILE: js/pages/cases.js
 * PURPOSE: Case file entries list page with search and filtering
 * 
 * This module renders a table/list view of all case file entries loaded from cases.json.
 * Since there is only one case, these entries represent different documents/information
 * within that single case file. It provides:
 * - Search functionality (searches entry ID, title, assigned investigator)
 * - Filtering by status (active/archived) and year
 * - Visual indicators for locked entries (blurred/disabled)
 * - Click-to-navigate to entry detail pages
 * - Real-time filtering as user types
 * 
 * WHY: Allows users to browse and find specific case file entries quickly. The search
 * and filter functionality makes it easy to locate entries even with many
 * items. Locked entries are visible but clearly marked, encouraging task
 * completion to unlock content.
 */

import { loadCases, isLocked } from '../store.js';
import { createEl, renderTable, renderBadge, formatDate } from '../ui.js';

export async function renderCases() {
  const container = createEl('div');
  
  // Header
  const header = createEl('div', { className: 'mb-3' });
  header.appendChild(createEl('h1', { textContent: 'Fallakte Müller' }));
  container.appendChild(header);
  
  // Search and filters
  const searchBar = createEl('div', { className: 'search-bar' });
  const searchInput = createEl('input', {
    type: 'text',
    className: 'search-input',
    placeholder: 'Einträge durchsuchen...'
  });
  searchBar.appendChild(searchInput);
  
  const filterGroup = createEl('div', { className: 'filter-group' });
  
  const statusFilter = createEl('select', { className: 'filter-select' });
  statusFilter.appendChild(createEl('option', { value: '', textContent: 'Alle Status' }));
  statusFilter.appendChild(createEl('option', { value: 'active', textContent: 'Aktiv' }));
  statusFilter.appendChild(createEl('option', { value: 'archived', textContent: 'Archiviert' }));
  filterGroup.appendChild(statusFilter);
  
  const yearFilter = createEl('select', { className: 'filter-select' });
  yearFilter.appendChild(createEl('option', { value: '', textContent: 'Alle Jahre' }));
  filterGroup.appendChild(yearFilter);
  
  container.appendChild(searchBar);
  container.appendChild(filterGroup);
  
  // Load cases
  const casesData = await loadCases();
  const casesArray = casesData || [];
  
  // Extract unique years
  const years = [...new Set(casesArray.map(c => c.year).filter(Boolean))].sort((a, b) => b - a);
  years.forEach(year => {
    yearFilter.appendChild(createEl('option', { value: year, textContent: year }));
  });
  
  // Filter and render function
  let filteredCases = [...casesArray];
  
  function renderCasesTable() {
    const existingTable = container.querySelector('.table-container');
    if (existingTable) {
      existingTable.remove();
    }
    
    if (filteredCases.length === 0) {
      const empty = createEl('div', { className: 'card' });
      empty.appendChild(createEl('p', { className: 'text-muted', textContent: 'Keine Einträge gefunden' }));
      container.appendChild(empty);
      return;
    }
    
    const headers = [
      { label: 'ID', key: 'id' },
      { label: 'Titel', key: 'title' },
      { label: 'Status', key: 'status' },
      { label: 'Jahr', key: 'year' },
      { label: 'Zugewiesen an', key: 'assignedTo' },
      { label: 'Zuletzt aktualisiert', key: 'lastUpdated' }
    ];
    
    const rows = filteredCases.map(caseItem => {
      const locked = isLocked(caseItem);
      
      return {
        id: locked ? createEl('span', { className: 'locked-item', textContent: caseItem.id }) : caseItem.id,
        title: (() => {
          const titleEl = createEl('span');
          if (locked) {
            titleEl.className = 'locked-item';
            titleEl.textContent = caseItem.title || '—';
          } else {
            titleEl.textContent = caseItem.title || '—';
          }
          return titleEl;
        })(),
        status: (() => {
          const status = caseItem.status || 'unknown';
          const badge = renderBadge(status, status === 'active' ? 'success' : 'muted');
          if (locked) {
            badge.classList.add('locked-item');
          }
          return badge;
        })(),
        year: locked ? createEl('span', { className: 'locked-item', textContent: caseItem.year || '—' }) : (caseItem.year || '—'),
        assignedTo: locked ? createEl('span', { className: 'locked-item', textContent: caseItem.assignedTo || '—' }) : (caseItem.assignedTo || '—'),
        lastUpdated: locked ? createEl('span', { className: 'locked-item', textContent: formatDate(caseItem.lastUpdated) }) : formatDate(caseItem.lastUpdated)
      };
    });
    
    const table = renderTable(headers, rows, {
      onRowClick: (row, idx) => {
        const caseItem = filteredCases[idx];
        if (!isLocked(caseItem)) {
          window.location.hash = `#/cases/${caseItem.id}`;
        }
      }
    });
    
    container.appendChild(table);
  }
  
  // Search handler
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const status = statusFilter.value;
    const year = yearFilter.value;
    
    filteredCases = casesArray.filter(c => {
      const matchesSearch = !query || 
        (c.id && c.id.toLowerCase().includes(query)) ||
        (c.title && c.title.toLowerCase().includes(query)) ||
        (c.assignedTo && c.assignedTo.toLowerCase().includes(query));
      
      const matchesStatus = !status || c.status === status;
      const matchesYear = !year || String(c.year) === year;
      
      return matchesSearch && matchesStatus && matchesYear;
    });
    
    renderCasesTable();
  });
  
  // Filter handlers
  statusFilter.addEventListener('change', () => {
    searchInput.dispatchEvent(new Event('input'));
  });
  
  yearFilter.addEventListener('change', () => {
    searchInput.dispatchEvent(new Event('input'));
  });
  
  // Initial render
  renderCasesTable();
  
  return container;
}
