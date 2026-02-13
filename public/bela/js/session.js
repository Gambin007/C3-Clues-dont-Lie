/**
 * FILE: js/session.js
 * PURPOSE: Session and authentication state management
 * 
 * This module handles user session persistence using localStorage. It provides:
 * - Creating new sessions when users log in
 * - Checking if a valid session exists
 * - Clearing sessions on logout
 * - Optional session expiration (24 hours)
 * 
 * WHY: Maintains user authentication state across page reloads without requiring
 * server-side sessions. Since this is a fake authentication system for an
 * interactive game, localStorage is perfect for persistence. The session check happens on
 * every app.html load to ensure users are authenticated before accessing content.
 */

const SESSION_KEY = 'cms_session';

export function createSession(username) {
  const session = {
    username,
    timestamp: Date.now()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function checkSession() {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  
  try {
    const session = JSON.parse(stored);
    // Session expires after 24 hours (optional check)
    const maxAge = 24 * 60 * 60 * 1000;
    if (Date.now() - session.timestamp > maxAge) {
      clearSession();
      return null;
    }
    return session;
  } catch (e) {
    clearSession();
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
