/**
 * FILE: js/ui.js
 * PURPOSE: Reusable UI component rendering utilities
 * 
 * This module provides helper functions for creating and rendering common
 * UI components programmatically. It includes:
 * - createEl: Generic DOM element creation with attributes
 * - renderCard: Creates card components with headers and content
 * - renderTable: Generates data tables from structured data
 * - renderTabs: Creates tabbed interfaces
 * - renderBadge: Creates status badges with different styles
 * - formatDate/formatTimestamp: Date formatting utilities
 * 
 * WHY: Reduces code duplication across page modules by providing reusable
 * UI building blocks. This makes the codebase more maintainable and ensures
 * consistent styling and behavior across all pages. All components follow
 * the retro aesthetic defined in styles.css.
 */

/**
 * Create a DOM element with attributes and children
 */
export function createEl(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'textContent') {
      el.textContent = value;
    } else if (key === 'innerHTML') {
      el.innerHTML = value;
    } else if (key.startsWith('on')) {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
  });
  
  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  });
  
  return el;
}

/**
 * Render a card component
 */
export function renderCard(title, subtitle, content, className = '') {
  const card = createEl('div', { className: `card ${className}` });
  
  if (title || subtitle) {
    const header = createEl('div', { className: 'card-header' });
    if (title) {
      header.appendChild(createEl('h3', { className: 'card-title', textContent: title }));
    }
    if (subtitle) {
      header.appendChild(createEl('p', { className: 'card-subtitle', textContent: subtitle }));
    }
    card.appendChild(header);
  }
  
  if (typeof content === 'string') {
    card.innerHTML += content;
  } else if (content instanceof Node) {
    card.appendChild(content);
  }
  
  return card;
}

/**
 * Render a table from data
 */
export function renderTable(headers, rows, options = {}) {
  const { className = '', onRowClick = null } = options;
  
  const container = createEl('div', { className: 'table-container' });
  const table = createEl('table', { className: `table ${className}` });
  
  // Header
  const thead = createEl('thead');
  const headerRow = createEl('tr');
  headers.forEach(header => {
    const th = createEl('th', {}, header.label || header);
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Body
  const tbody = createEl('tbody');
  rows.forEach((row, idx) => {
    const tr = createEl('tr');
    if (onRowClick) {
      tr.style.cursor = 'pointer';
      tr.addEventListener('click', () => onRowClick(row, idx));
    }
    
    headers.forEach((header, colIdx) => {
      const td = createEl('td');
      const cellData = row[header.key || colIdx];
      
      if (typeof cellData === 'string') {
        td.textContent = cellData;
      } else if (cellData instanceof Node) {
        td.appendChild(cellData);
      } else {
        td.innerHTML = cellData || '';
      }
      
      tr.appendChild(td);
    });
    
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);
  
  return container;
}

/**
 * Render tabs
 */
export function renderTabs(tabs, activeTab = 0, onTabChange = null) {
  const container = createEl('div');
  const tabBar = createEl('div', { className: 'tabs' });
  const contents = createEl('div');
  
  tabs.forEach((tab, idx) => {
    const tabBtn = createEl('button', {
      className: `tab ${idx === activeTab ? 'active' : ''}`,
      textContent: tab.label
    });
    
    tabBtn.addEventListener('click', () => {
      // Update active state
      tabBar.querySelectorAll('.tab').forEach((t, i) => {
        t.classList.toggle('active', i === idx);
      });
      contents.querySelectorAll('.tab-content').forEach((c, i) => {
        c.classList.toggle('active', i === idx);
      });
      
      if (onTabChange) {
        onTabChange(idx, tab);
      }
    });
    
    tabBar.appendChild(tabBtn);
    
    const content = createEl('div', {
      className: `tab-content ${idx === activeTab ? 'active' : ''}`
    });
    
    if (typeof tab.content === 'string') {
      content.innerHTML = tab.content;
    } else if (tab.content instanceof Node) {
      content.appendChild(tab.content);
    }
    
    contents.appendChild(content);
  });
  
  container.appendChild(tabBar);
  container.appendChild(contents);
  
  return container;
}

/**
 * Render a badge
 */
export function renderBadge(text, type = 'muted') {
  return createEl('span', {
    className: `badge badge-${type}`,
    textContent: text
  });
}

/**
 * Format date string
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

/**
 * Format timestamp
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return '—';
  try {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return timestamp;
  }
}
