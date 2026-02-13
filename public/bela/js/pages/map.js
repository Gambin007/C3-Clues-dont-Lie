/**
 * FILE: js/pages/map.js
 * PURPOSE: Interactive map page with zoom and pan functionality
 * 
 * This module renders an interactive map view that allows users to:
 * - View a large map image (fake map, just an image)
 * - Zoom in and out using buttons or mouse wheel
 * - Pan/drag the map to move around
 * - Reset the view to default position and zoom
 * 
 * The map is implemented as a draggable, zoomable image container that
 * behaves similar to a real map interface. All interactions work with both
 * mouse and touch events for better usability.
 * 
 * WHY: Provides a visual navigation tool for the detective case, allowing
 * users to explore locations and get a spatial understanding of the case.
 * The interactive nature makes it feel like a real mapping system despite
 * being just a static image.
 */

import { createEl } from '../ui.js';
import { loadConfig } from '../store.js';

export async function renderMap() {
  const container = createEl('div', { className: 'map-page' });
  
  // Load config to get map image path (optional, can be hardcoded)
  let mapImagePath = './files/map.jpg'; // Default path
  let mapPreviewPath = null;
  
  try {
    const config = await loadConfig();
    if (config?.mapImagePath) {
      mapImagePath = config.mapImagePath;
    }
    if (config?.mapPreviewPath) {
      mapPreviewPath = config.mapPreviewPath;
    }
  } catch (error) {
    console.warn('Could not load config for map image path, using default:', error);
  }
  
  // Create header
  const header = createEl('div', { className: 'map-header' });
  const title = createEl('h2', { textContent: 'Karte' });
  header.appendChild(title);
  container.appendChild(header);
  
  // Create map container
  const mapContainer = createEl('div', { className: 'map-container' });
  
  // Create map viewport (the visible area)
  const mapViewport = createEl('div', { className: 'map-viewport' });
  
  // Create loading indicator
  const loadingIndicator = createEl('div', { 
    className: 'map-loading',
    textContent: 'Karte wird geladen...'
  });
  mapViewport.appendChild(loadingIndicator);
  
  // Create map image wrapper (the draggable/zoomable content)
  const mapImageWrapper = createEl('div', { className: 'map-image-wrapper' });
  
  // Create preview image (low-res, loads first)
  let previewImage = null;
  if (mapPreviewPath) {
    previewImage = createEl('img', {
      className: 'map-image map-preview',
      src: mapPreviewPath,
      alt: 'Karte (Vorschau)',
      draggable: false
    });
    mapImageWrapper.appendChild(previewImage);
  }
  
  // Create full resolution image (loads in background)
  const mapImage = createEl('img', {
    className: 'map-image map-full',
    src: mapImagePath,
    alt: 'Karte',
    draggable: false,
    style: previewImage ? 'opacity: 0;' : 'opacity: 1;' // Hide until loaded if preview exists
  });
  
  // Handle image load error
  mapImage.addEventListener('error', function() {
    this.alt = 'Karte nicht gefunden';
    this.style.border = '2px solid var(--error)';
    console.warn('Map image not found:', mapImagePath);
    if (loadingIndicator.parentElement) {
      loadingIndicator.remove();
    }
  });
  
  // When full image loads, fade it in and hide preview
  mapImage.addEventListener('load', function() {
    // Update dimensions when full image loads (important if preview was used first)
    if (this.naturalWidth > 0 && this.naturalHeight > 0) {
      imageWidth = this.naturalWidth;
      imageHeight = this.naturalHeight;
      viewportWidth = mapViewport.clientWidth;
      viewportHeight = mapViewport.clientHeight;
      // Recalculate constraints with new dimensions
      constrainPosition();
      updateTransform();
    }
    
    if (previewImage) {
      // Fade in full image
      this.style.transition = 'opacity 0.5s ease-in';
      this.style.opacity = '1';
      // Hide preview after fade
      setTimeout(() => {
        if (previewImage.parentElement) {
          previewImage.style.transition = 'opacity 0.3s ease-out';
          previewImage.style.opacity = '0';
          setTimeout(() => {
            if (previewImage.parentElement) {
              previewImage.remove();
            }
          }, 300);
        }
      }, 500);
    }
    // Hide loading indicator
    if (loadingIndicator.parentElement) {
      loadingIndicator.style.transition = 'opacity 0.3s ease-out';
      loadingIndicator.style.opacity = '0';
      setTimeout(() => {
        if (loadingIndicator.parentElement) {
          loadingIndicator.remove();
        }
      }, 300);
    }
  });
  
  mapImageWrapper.appendChild(mapImage);
  mapViewport.appendChild(mapImageWrapper);
  mapContainer.appendChild(mapViewport);
  
  // Create controls
  const controls = createEl('div', { className: 'map-controls' });
  
  // Zoom in button
  const zoomInBtn = createEl('button', {
    className: 'map-btn map-btn-zoom-in',
    textContent: '+',
    title: 'Vergrößern'
  });
  
  // Zoom out button
  const zoomOutBtn = createEl('button', {
    className: 'map-btn map-btn-zoom-out',
    textContent: '−',
    title: 'Verkleinern'
  });
  
  // Reset button
  const resetBtn = createEl('button', {
    className: 'map-btn map-btn-reset',
    textContent: '⟲',
    title: 'Zurücksetzen'
  });
  
  controls.appendChild(zoomInBtn);
  controls.appendChild(zoomOutBtn);
  controls.appendChild(resetBtn);
  mapContainer.appendChild(controls);
  
  container.appendChild(mapContainer);
  
  // Map state
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartTranslateX = 0;
  let dragStartTranslateY = 0;
  let imageWidth = 0;
  let imageHeight = 0;
  let viewportWidth = 0;
  let viewportHeight = 0;
  
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 5;
  const ZOOM_STEP = 0.2;
  
  // Calculate constraints based on current scale
  function getConstraints() {
    // Always get fresh viewport dimensions
    viewportWidth = mapViewport.clientWidth;
    viewportHeight = mapViewport.clientHeight;
    
    if (imageWidth === 0 || imageHeight === 0 || viewportWidth === 0 || viewportHeight === 0) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }
    
    const scaledWidth = imageWidth * scale;
    const scaledHeight = imageHeight * scale;
    
    // Calculate constraints for X axis
    let minX = 0, maxX = 0;
    if (scaledWidth > viewportWidth) {
      // Image is wider than viewport - allow horizontal movement
      const maxTranslateX = (scaledWidth - viewportWidth) / 2;
      minX = -maxTranslateX;
      maxX = maxTranslateX;
    } else {
      // Image is narrower than or equal to viewport - keep centered (no movement)
      minX = 0;
      maxX = 0;
    }
    
    // Calculate constraints for Y axis
    let minY = 0, maxY = 0;
    if (scaledHeight > viewportHeight) {
      // Image is taller than viewport - allow vertical movement
      const maxTranslateY = (scaledHeight - viewportHeight) / 2;
      minY = -maxTranslateY;
      maxY = maxTranslateY;
    } else {
      // Image is shorter than or equal to viewport - keep centered (no movement)
      minY = 0;
      maxY = 0;
    }
    
    return { minX, maxX, minY, maxY };
  }
  
  // Constrain translate values to keep image within bounds
  function constrainPosition() {
    const constraints = getConstraints();
    // Clamp translateX between minX and maxX
    translateX = Math.max(constraints.minX, Math.min(translateX, constraints.maxX));
    // Clamp translateY between minY and maxY
    translateY = Math.max(constraints.minY, Math.min(translateY, constraints.maxY));
  }
  
  // Update map transform
  // Combine centering translate(-50%, -50%) with pan/zoom transforms
  function updateTransform() {
    constrainPosition();
    mapImageWrapper.style.transform = `translate(-50%, -50%) translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }
  
  // Initialize image dimensions and center it
  // Use preview if available, otherwise wait for full image
  function initializeImage() {
    return new Promise((resolve) => {
      const imageToUse = previewImage && previewImage.complete ? previewImage : mapImage;
      
      function setupDimensions() {
        // Use full image dimensions if available, otherwise preview
        if (mapImage.complete && mapImage.naturalWidth > 0) {
          imageWidth = mapImage.naturalWidth;
          imageHeight = mapImage.naturalHeight;
        } else if (previewImage && previewImage.complete && previewImage.naturalWidth > 0) {
          imageWidth = previewImage.naturalWidth;
          imageHeight = previewImage.naturalHeight;
        } else {
          return false;
        }
        
        viewportWidth = mapViewport.clientWidth;
        viewportHeight = mapViewport.clientHeight;
        
        // Center the image initially
        translateX = 0;
        translateY = 0;
        scale = 1;
        updateTransform();
        return true;
      }
      
      if (imageToUse.complete && imageToUse.naturalWidth > 0) {
        if (setupDimensions()) {
          resolve();
        }
      } else {
        // Wait for preview or full image to load
        const checkImage = () => {
          if (setupDimensions()) {
            resolve();
          }
        };
        
        if (previewImage) {
          previewImage.addEventListener('load', checkImage, { once: true });
        }
        mapImage.addEventListener('load', () => {
          // Update dimensions when full image loads
          if (mapImage.naturalWidth > 0 && mapImage.naturalHeight > 0) {
            imageWidth = mapImage.naturalWidth;
            imageHeight = mapImage.naturalHeight;
            viewportWidth = mapViewport.clientWidth;
            viewportHeight = mapViewport.clientHeight;
            // Recalculate constraints with new dimensions
            constrainPosition();
            updateTransform();
          }
          checkImage();
        }, { once: true });
      }
    });
  }
  
  // Zoom functions
  function zoomIn() {
    const oldScale = scale;
    scale = Math.min(scale + ZOOM_STEP, MAX_SCALE);
    
    // Adjust position to maintain zoom center
    const constraints = getConstraints();
    if (scale > oldScale && (constraints.maxX > 0 || constraints.maxY > 0)) {
      // Keep current position but constrain it
      updateTransform();
    } else {
      updateTransform();
    }
  }
  
  function zoomOut() {
    const oldScale = scale;
    scale = Math.max(scale - ZOOM_STEP, MIN_SCALE);
    
    // Adjust position to maintain zoom center
    const constraints = getConstraints();
    if (scale < oldScale) {
      // Constrain position when zooming out
      updateTransform();
    } else {
      updateTransform();
    }
  }
  
  function resetView() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }
  
  // Mouse wheel zoom
  mapViewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    const oldScale = scale;
    scale = Math.max(MIN_SCALE, Math.min(scale + delta, MAX_SCALE));
    
    // Zoom towards mouse position
    const rect = mapViewport.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const viewportCenterX = rect.width / 2;
    const viewportCenterY = rect.height / 2;
    
    const offsetX = mouseX - viewportCenterX;
    const offsetY = mouseY - viewportCenterY;
    
    translateX -= offsetX * (scale - oldScale) / oldScale;
    translateY -= offsetY * (scale - oldScale) / oldScale;
    
    // Constrain after zoom
    updateTransform();
  });
  
  // Mouse drag/pan
  mapViewport.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // Left mouse button
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragStartTranslateX = translateX;
      dragStartTranslateY = translateY;
      mapViewport.style.cursor = 'grabbing';
      e.preventDefault();
    }
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;
      translateX = dragStartTranslateX + deltaX;
      translateY = dragStartTranslateY + deltaY;
      // Constraints will be applied in updateTransform
      updateTransform();
    }
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      mapViewport.style.cursor = 'grab';
    }
  });
  
  // Touch events for mobile
  let touchStartDistance = 0;
  let touchStartScale = 1;
  let touchStartTranslateX = 0;
  let touchStartTranslateY = 0;
  
  mapViewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      // Single touch - pan
      isDragging = true;
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
      dragStartTranslateX = translateX;
      dragStartTranslateY = translateY;
    } else if (e.touches.length === 2) {
      // Two touches - pinch zoom
      isDragging = false;
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      touchStartDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      touchStartScale = scale;
      touchStartTranslateX = translateX;
      touchStartTranslateY = translateY;
    }
    e.preventDefault();
  });
  
  mapViewport.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && isDragging) {
      // Pan
      const deltaX = e.touches[0].clientX - dragStartX;
      const deltaY = e.touches[0].clientY - dragStartY;
      translateX = dragStartTranslateX + deltaX;
      translateY = dragStartTranslateY + deltaY;
      // Constraints will be applied in updateTransform
      updateTransform();
    } else if (e.touches.length === 2) {
      // Pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      scale = Math.max(MIN_SCALE, Math.min(
        touchStartScale * (distance / touchStartDistance),
        MAX_SCALE
      ));
      // Constraints will be applied in updateTransform
      updateTransform();
    }
    e.preventDefault();
  });
  
  mapViewport.addEventListener('touchend', () => {
    isDragging = false;
  });
  
  // Button event listeners
  zoomInBtn.addEventListener('click', zoomIn);
  zoomOutBtn.addEventListener('click', zoomOut);
  resetBtn.addEventListener('click', resetView);
  
  // Set initial cursor
  mapViewport.style.cursor = 'grab';
  
  // Handle window resize to update viewport dimensions
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      viewportWidth = mapViewport.clientWidth;
      viewportHeight = mapViewport.clientHeight;
      // Recalculate constraints with new viewport dimensions
      constrainPosition();
      updateTransform();
    }, 100);
  });
  
  // Initialize image and center it
  initializeImage().then(() => {
    // Image is now loaded and centered
  });
  
  return container;
}
