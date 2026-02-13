/**
 * FILE: js/pages/caseDetail.js
 * PURPOSE: Individual case file entry detail view with tabs
 * 
 * This module renders a detailed view of a single case file entry. It displays:
 * - Entry header with title, status, assigned investigator, last updated
 * - Tabbed interface with: Summary, Notes, Evidence, Activity Log
 * - Locked overlay if the entry requires an incomplete task step
 * - All related content (notes, evidence, activity) filtered by entry ID
 * - Respects task gating - only shows unlocked content items
 * 
 * WHY: Provides comprehensive case file entry information in an organized, tabbed
 * interface. The locked overlay prevents access to entries that haven't been
 * unlocked yet, maintaining task progression. All content is dynamically
 * loaded from JSON files, making it easy to update entry information.
 */

import { loadCases, loadNotes, loadEvidence, loadActivity, isLocked, isStepCompleted } from '../store.js';
import { createEl, renderCard, renderTabs, renderBadge, formatDate, formatTimestamp } from '../ui.js';

export async function renderCaseDetail(caseId) {
  const container = createEl('div');
  
  // Load data
  const [casesData, notesData, evidenceData, activityData] = await Promise.all([
    loadCases(),
    loadNotes(),
    loadEvidence(),
    loadActivity()
  ]);
  
  const casesArray = casesData || [];
  const notesArray = notesData || [];
  const evidenceArray = evidenceData || [];
  const activityArray = activityData || [];
  
  // Find case
  const caseItem = casesArray.find(c => c.id === caseId);
  
  if (!caseItem) {
    container.appendChild(createEl('div', {
      className: 'card',
      innerHTML: '<h3>Eintrag nicht gefunden</h3><p>Der angeforderte Eintrag konnte nicht gefunden werden.</p>'
    }));
    return container;
  }
  
  const locked = isLocked(caseItem);
  
  // Header
  const header = createEl('div', { className: 'mb-3' });
  
  const headerTop = createEl('div', { style: 'display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;' });
  
  const titleGroup = createEl('div');
  titleGroup.appendChild(createEl('h1', { textContent: caseItem.title || 'Unbenannter Eintrag' }));
  const meta = createEl('div', { className: 'text-secondary', style: 'margin-top: 4px;' });
  meta.textContent = `Eintrags-ID: ${caseItem.id} • ${formatDate(caseItem.lastUpdated)}`;
  titleGroup.appendChild(meta);
  headerTop.appendChild(titleGroup);
  
  const statusBadge = renderBadge(caseItem.status || 'unknown', caseItem.status === 'active' ? 'success' : 'muted');
  headerTop.appendChild(statusBadge);
  
  header.appendChild(headerTop);
  
  if (caseItem.assignedTo) {
    const assigned = createEl('p', { className: 'text-secondary' });
    assigned.textContent = `Zugewiesen an: ${caseItem.assignedTo}`;
    header.appendChild(assigned);
  }
  
  container.appendChild(header);
  
  // Locked overlay
  if (locked) {
    const lockedOverlay = createEl('div', { className: 'card locked-overlay' });
    const lockedMsg = createEl('div', { className: 'locked-message' });
    lockedMsg.appendChild(createEl('h3', { textContent: '🔒 Eintrag gesperrt' }));
    lockedMsg.appendChild(createEl('p', {
      textContent: `Dieser Eintrag erfordert das Abschließen der Aufgabe: ${caseItem.requiresStepId}`
    }));
    const link = createEl('a', {
      href: '#/todo',
      className: 'btn btn-primary',
      textContent: 'Zur To Do Liste',
      style: 'margin-top: 12px; display: inline-block;'
    });
    lockedMsg.appendChild(link);
    lockedOverlay.appendChild(lockedMsg);
    container.appendChild(lockedOverlay);
    return container;
  }
  
  // Tabs
  const caseNotes = notesArray.filter(n => n.caseId === caseId);
  const caseEvidence = evidenceArray.filter(e => e.caseId === caseId);
  const caseActivity = activityArray.filter(a => a.caseId === caseId);
  
  // Filter locked items
  const unlockedNotes = caseNotes.filter(n => !isLocked(n));
  const unlockedEvidence = caseEvidence.filter(e => !isLocked(e));
  const unlockedActivity = caseActivity.filter(a => !isLocked(a));
  
  const tabs = [
    {
      label: 'Zusammenfassung',
      content: (() => {
        const div = createEl('div');
        div.appendChild(createEl('p', {
          textContent: caseItem.summary || 'Keine Zusammenfassung verfügbar.',
          style: 'line-height: 1.8;'
        }));
        return div;
      })()
    },
    {
      label: `Notizen (${unlockedNotes.length}${caseNotes.length > unlockedNotes.length ? `, ${caseNotes.length - unlockedNotes.length} gesperrt` : ''})`,
      content: (() => {
        const div = createEl('div');
        if (unlockedNotes.length === 0) {
          div.appendChild(createEl('p', { className: 'text-muted', textContent: 'Keine Notizen verfügbar' }));
        } else {
          unlockedNotes.forEach(note => {
            const noteCard = renderCard(
              note.title || 'Unbenannte Notiz',
              `${formatDate(note.date)} • ${note.author || 'Unbekannt'}`,
              createEl('p', { textContent: note.body || '', style: 'white-space: pre-wrap;' })
            );
            div.appendChild(noteCard);
            div.appendChild(createEl('div', { style: 'height: 16px;' })); // spacing
          });
        }
        return div;
      })()
    },
    {
      label: `Beweise (${unlockedEvidence.length}${caseEvidence.length > unlockedEvidence.length ? `, ${caseEvidence.length - unlockedEvidence.length} gesperrt` : ''})`,
      content: (() => {
        const div = createEl('div');
        if (unlockedEvidence.length === 0) {
          div.appendChild(createEl('p', { className: 'text-muted', textContent: 'Keine Beweise verfügbar' }));
        } else {
          unlockedEvidence.forEach(ev => {
            const evCard = renderCard(
              ev.filename || 'Unbekannte Datei',
              `${ev.type || 'unbekannt'} • ${ev.description || 'Keine Beschreibung'}`,
              ''
            );
            
            // Add image if evidence type is "image" and filename exists
            if (ev.type === 'image' && ev.filename) {
              const imageContainer = createEl('div', { className: 'evidence-image-container' });
              
              // Create zoom controls
              const zoomControls = createEl('div', { className: 'evidence-zoom-controls' });
              const zoomInBtn = createEl('button', { 
                className: 'evidence-zoom-btn', 
                textContent: '+',
                title: 'Vergrößern'
              });
              const zoomOutBtn = createEl('button', { 
                className: 'evidence-zoom-btn', 
                textContent: '−',
                title: 'Verkleinern'
              });
              const resetBtn = createEl('button', { 
                className: 'evidence-zoom-btn', 
                textContent: '⟲',
                title: 'Zurücksetzen'
              });
              zoomControls.appendChild(zoomInBtn);
              zoomControls.appendChild(zoomOutBtn);
              zoomControls.appendChild(resetBtn);
              
              // Create image wrapper for zoom/pan
              const imageWrapper = createEl('div', { className: 'evidence-image-wrapper' });
              const img = createEl('img', {
                src: ev.filename,
                alt: ev.description || ev.filename,
                className: 'evidence-image'
              });
              
              // Zoom state
              let scale = 1;
              let translateX = 0;
              let translateY = 0;
              let isDragging = false;
              let dragStartX = 0;
              let dragStartY = 0;
              let dragStartTranslateX = 0;
              let dragStartTranslateY = 0;
              
              const MIN_SCALE = 1; // Cannot zoom out smaller than original
              const MAX_SCALE = 5;
              const ZOOM_STEP = 0.3;
              
              // Get constraints to prevent dragging beyond image borders
              function getConstraints() {
                if (!img.naturalWidth || !img.naturalHeight) {
                  return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
                }
                
                const wrapperRect = imageWrapper.getBoundingClientRect();
                const wrapperWidth = wrapperRect.width;
                const wrapperHeight = wrapperRect.height;
                
                // Calculate displayed image size (respecting max-width/max-height)
                const imgRatio = img.naturalWidth / img.naturalHeight;
                const wrapperRatio = wrapperWidth / wrapperHeight;
                
                let displayedWidth, displayedHeight;
                if (imgRatio > wrapperRatio) {
                  displayedWidth = Math.min(img.naturalWidth, wrapperWidth);
                  displayedHeight = displayedWidth / imgRatio;
                } else {
                  displayedHeight = Math.min(img.naturalHeight, wrapperHeight);
                  displayedWidth = displayedHeight * imgRatio;
                }
                
                const scaledWidth = displayedWidth * scale;
                const scaledHeight = displayedHeight * scale;
                
                // Calculate max translation (how much the image extends beyond wrapper)
                let minX = 0, maxX = 0, minY = 0, maxY = 0;
                
                if (scaledWidth > wrapperWidth) {
                  const overflow = (scaledWidth - wrapperWidth) / 2;
                  minX = -overflow;
                  maxX = overflow;
                }
                
                if (scaledHeight > wrapperHeight) {
                  const overflow = (scaledHeight - wrapperHeight) / 2;
                  minY = -overflow;
                  maxY = overflow;
                }
                
                return { minX, maxX, minY, maxY };
              }
              
              function constrainPosition() {
                const constraints = getConstraints();
                translateX = Math.max(constraints.minX, Math.min(translateX, constraints.maxX));
                translateY = Math.max(constraints.minY, Math.min(translateY, constraints.maxY));
              }
              
              function updateTransform() {
                constrainPosition();
                img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
                imageWrapper.style.cursor = scale > 1 ? 'grab' : 'default';
              }
              
              function zoomIn() {
                scale = Math.min(scale + ZOOM_STEP, MAX_SCALE);
                updateTransform();
              }
              
              function zoomOut() {
                scale = Math.max(scale - ZOOM_STEP, MIN_SCALE);
                // Reset position if at minimum scale
                if (scale <= 1) {
                  translateX = 0;
                  translateY = 0;
                }
                updateTransform();
              }
              
              function resetZoom() {
                scale = 1;
                translateX = 0;
                translateY = 0;
                updateTransform();
              }
              
              zoomInBtn.addEventListener('click', zoomIn);
              zoomOutBtn.addEventListener('click', zoomOut);
              resetBtn.addEventListener('click', resetZoom);
              
              // Mouse wheel zoom
              imageWrapper.addEventListener('wheel', (e) => {
                e.preventDefault();
                if (e.deltaY < 0) {
                  zoomIn();
                } else {
                  zoomOut();
                }
              });
              
              // Drag to pan
              imageWrapper.addEventListener('mousedown', (e) => {
                if (scale > 1) {
                  isDragging = true;
                  dragStartX = e.clientX;
                  dragStartY = e.clientY;
                  dragStartTranslateX = translateX;
                  dragStartTranslateY = translateY;
                  imageWrapper.style.cursor = 'grabbing';
                  e.preventDefault();
                }
              });
              
              document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                  translateX = dragStartTranslateX + (e.clientX - dragStartX);
                  translateY = dragStartTranslateY + (e.clientY - dragStartY);
                  updateTransform();
                }
              });
              
              document.addEventListener('mouseup', () => {
                if (isDragging) {
                  isDragging = false;
                  imageWrapper.style.cursor = scale > 1 ? 'grab' : 'default';
                }
              });
              
              // Handle image load errors
              img.addEventListener('error', function() {
                this.style.display = 'none';
                zoomControls.style.display = 'none';
                const errorMsg = createEl('p', {
                  className: 'text-muted',
                  textContent: `Bild konnte nicht geladen werden: ${ev.filename}`
                });
                imageContainer.appendChild(errorMsg);
              });
              
              // Set cursor style
              img.addEventListener('load', () => {
                imageWrapper.style.cursor = 'default';
              });
              
              imageWrapper.appendChild(img);
              imageContainer.appendChild(zoomControls);
              imageContainer.appendChild(imageWrapper);
              
              // Find the card body and append image
              const cardBody = evCard.querySelector('.card-body');
              if (cardBody) {
                cardBody.appendChild(imageContainer);
              } else {
                evCard.appendChild(imageContainer);
              }
            }
            
            div.appendChild(evCard);
            div.appendChild(createEl('div', { style: 'height: 16px;' })); // spacing
          });
        }
        return div;
      })()
    },
    {
      label: `Aktivität (${unlockedActivity.length}${caseActivity.length > unlockedActivity.length ? `, ${caseActivity.length - unlockedActivity.length} gesperrt` : ''})`,
      content: (() => {
        const div = createEl('div');
        if (unlockedActivity.length === 0) {
          div.appendChild(createEl('p', { className: 'text-muted', textContent: 'Keine Aktivität verfügbar' }));
        } else {
          const activityList = createEl('div');
          unlockedActivity
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .forEach(act => {
              const item = createEl('div', {
                className: 'search-result-item',
                style: 'cursor: default;'
              });
              item.appendChild(createEl('div', {
                className: 'search-result-title',
                textContent: act.message || 'Aktivität'
              }));
              item.appendChild(createEl('div', {
                className: 'search-result-meta',
                textContent: formatTimestamp(act.timestamp)
              }));
              activityList.appendChild(item);
            });
          div.appendChild(activityList);
        }
        return div;
      })()
    }
  ];
  
  const tabsEl = renderTabs(tabs, 0);
  container.appendChild(tabsEl);
  
  return container;
}
