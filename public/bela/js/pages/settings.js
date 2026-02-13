/**
 * FILE: js/pages/settings.js
 * PURPOSE: Application settings and account management
 * 
 * This module renders the settings page where users can:
 * - View current logged-in user information
 * - Logout (clears session and redirects to login)
 * - View system version information
 * 
 * WHY: Provides a standard settings interface for user account management
 * and system information. The logout functionality is essential for session
 * management. This page follows the same retro aesthetic as the rest of
 * the application.
 */

import { checkSession, clearSession } from '../session.js';
import { createEl } from '../ui.js';

export async function renderSettings() {
  const container = createEl('div');
  
  // Header
  const header = createEl('div', { className: 'mb-3' });
  header.appendChild(createEl('h1', { textContent: 'Einstellungen' }));
  container.appendChild(header);
  
  // Account section
  const accountSection = createEl('div', { className: 'settings-section' });
  accountSection.appendChild(createEl('h2', {
    className: 'settings-section-title',
    textContent: 'Konto'
  }));
  
  const session = checkSession();
  const accountItem = createEl('div', { className: 'settings-item' });
  accountItem.appendChild(createEl('div', {}, 
    createEl('div', { className: 'settings-label', textContent: 'Angemeldet als' }),
    createEl('div', { className: 'settings-description', textContent: session?.username || 'Unbekannt' })
  ));
  accountSection.appendChild(accountItem);
  
  container.appendChild(accountSection);
  
  // Actions section
  const actionsSection = createEl('div', { className: 'settings-section' });
  actionsSection.appendChild(createEl('h2', {
    className: 'settings-section-title',
    textContent: 'Aktionen'
  }));
  
  const logoutItem = createEl('div', { className: 'settings-item' });
  logoutItem.appendChild(createEl('div', {}, 
    createEl('div', { className: 'settings-label', textContent: 'Abmelden' }),
    createEl('div', { className: 'settings-description', textContent: 'Vom System abmelden' })
  ));
  
  const logoutBtn = createEl('button', {
    className: 'btn btn-primary',
    textContent: 'Abmelden'
  });
  
  logoutBtn.addEventListener('click', () => {
    clearSession();
    // Also clear lastUsername to force fresh login
    localStorage.removeItem('lastUsername');
    window.location.href = 'index.html';
  });
  
  logoutItem.appendChild(logoutBtn);
  actionsSection.appendChild(logoutItem);
  
  container.appendChild(actionsSection);
  
  // System info
  const infoSection = createEl('div', { className: 'settings-section' });
  infoSection.appendChild(createEl('h2', {
    className: 'settings-section-title',
    textContent: 'Systeminformationen'
  }));
  
  const versionItem = createEl('div', { className: 'settings-item' });
  versionItem.appendChild(createEl('div', {}, 
    createEl('div', { className: 'settings-label', textContent: 'Version' }),
    createEl('div', { className: 'settings-description monospace', textContent: 'SYS v0.9.4' })
  ));
  infoSection.appendChild(versionItem);
  
  container.appendChild(infoSection);
  
  return container;
}
