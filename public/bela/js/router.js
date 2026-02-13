/**
 * FILE: js/router.js
 * PURPOSE: Client-side hash-based routing system
 * 
 * This module implements a simple single-page application router that uses
 * URL hash fragments (#/dashboard, #/cases/:id, etc.) to navigate between
 * different pages without full page reloads. It:
 * - Parses hash routes and extracts route parameters
 * - Maps routes to corresponding page rendering functions
 * - Updates the active navigation state
 * - Handles initial page load and hash change events
 * - Renders page content dynamically into the main content area
 * 
 * WHY: Enables navigation within the app without server round-trips, providing
 * a smooth user experience. Hash-based routing works without server configuration
 * and allows for bookmarkable URLs. This is essential for a single-page application
 * that needs to feel like a native desktop application.
 */

import { renderDashboard } from './pages/dashboard.js';
import { renderCases } from './pages/cases.js';
import { renderCaseDetail } from './pages/caseDetail.js';
import { renderTodo } from './pages/todo.js';
import { renderSearch } from './pages/search.js';
import { renderMap } from './pages/map.js';
import { renderSettings } from './pages/settings.js';

const contentEl = document.getElementById('page-content');

/**
 * Parse route from hash
 */
function parseRoute(hash) {
  const path = hash.replace(/^#/, '') || '/dashboard';
  const parts = path.split('/').filter(p => p);
  return {
    path,
    parts,
    base: parts[0] || 'dashboard',
    param: parts[1] || null
  };
}

/**
 * Update active nav item
 */
function updateNav(route) {
  document.querySelectorAll('.nav-item').forEach(item => {
    const routePath = item.getAttribute('data-route');
    if (routePath === `/${route.base}`) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

/**
 * Route handler
 */
async function handleRoute(route) {
  updateNav(route);
  contentEl.innerHTML = '<div class="loading">Loading...</div>';
  
  try {
    let content;
    
    switch (route.base) {
      case 'dashboard':
        content = await renderDashboard();
        break;
      case 'cases':
        if (route.param) {
          content = await renderCaseDetail(route.param);
        } else {
          content = await renderCases();
        }
        break;
      case 'todo':
        content = await renderTodo();
        break;
      case 'search':
        content = await renderSearch();
        break;
      case 'map':
        content = await renderMap();
        break;
      case 'settings':
        content = await renderSettings();
        break;
      default:
        content = await renderDashboard();
    }
    
    contentEl.innerHTML = '';
    if (content instanceof Node) {
      contentEl.appendChild(content);
    } else {
      contentEl.innerHTML = content;
    }
  } catch (error) {
    console.error('Route error:', error);
    contentEl.innerHTML = `
      <div class="card">
        <h3>Error</h3>
        <p>Failed to load page: ${error.message}</p>
      </div>
    `;
  }
}

/**
 * Initialize router
 */
export function initRouter() {
  // Handle initial route
  const initialRoute = parseRoute(window.location.hash);
  handleRoute(initialRoute);
  
  // Handle hash changes
  window.addEventListener('hashchange', () => {
    const route = parseRoute(window.location.hash);
    handleRoute(route);
  });
  
  // Handle nav clicks
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const route = item.getAttribute('data-route');
      window.location.hash = route;
    });
  });
}
