/**
 * FILE: js/store.js
 * PURPOSE: Content loading and todo progress management
 * 
 * This module serves as the data layer for the application. It handles:
 * - Loading JSON content files from /content directory (cases, notes, evidence, etc.)
 * - Caching loaded content to avoid redundant network requests
 * - Managing todo progress in localStorage
 * - Checking if todo steps are completed
 * - Determining if content items are locked (require completed todo steps)
 * 
 * WHY: Centralizes all data access and todo state management. By loading content
 * from JSON files, the todo content can be easily edited without touching code.
 * The todo progress system gates content based on completion, creating a
 * progressive reveal mechanism that enhances the experience.
 */

const PROGRESS_KEY = 'cms_progress';
// Use relative path that works with both file:// and http://
const CONTENT_BASE = './content';

// Cache for loaded content
let contentCache = {};

/**
 * Load JSON content from /content directory
 */
export async function loadContent(filename) {
  if (contentCache[filename]) {
    return contentCache[filename];
  }

  try {
    const response = await fetch(`${CONTENT_BASE}/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    const data = await response.json();
    contentCache[filename] = data;
    return data;
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return null;
  }
}

/**
 * Load config.json
 */
export async function loadConfig() {
  return await loadContent('config.json');
}

/**
 * Load cases.json
 */
export async function loadCases() {
  return await loadContent('cases.json');
}

/**
 * Load notes.json
 */
export async function loadNotes() {
  return await loadContent('notes.json');
}

/**
 * Load evidence.json
 */
export async function loadEvidence() {
  return await loadContent('evidence.json');
}

/**
 * Load activity.json
 */
export async function loadActivity() {
  return await loadContent('activity.json');
}

/**
 * Get todo progress from localStorage
 */
export function getProgress() {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading progress:', e);
  }
  return { completedSteps: [] };
}

/**
 * Save todo progress to localStorage
 */
export function saveProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    return true;
  } catch (e) {
    console.error('Error saving progress:', e);
    return false;
  }
}

/**
 * Check if a todo step is completed
 */
export function isStepCompleted(stepId) {
  const progress = getProgress();
  return progress.completedSteps?.includes(stepId) || false;
}

/**
 * Mark a todo step as completed
 */
export function completeStep(stepId) {
  const progress = getProgress();
  if (!progress.completedSteps) {
    progress.completedSteps = [];
  }
  if (!progress.completedSteps.includes(stepId)) {
    progress.completedSteps.push(stepId);
    saveProgress(progress);
  }
}

/**
 * Check if content item is locked (requires a step that isn't completed)
 */
export function isLocked(item) {
  if (!item || !item.requiresStepId) {
    return false;
  }
  return !isStepCompleted(item.requiresStepId);
}

/**
 * Filter locked items from an array
 */
export function filterUnlocked(items) {
  if (!Array.isArray(items)) return [];
  return items.filter(item => !isLocked(item));
}
