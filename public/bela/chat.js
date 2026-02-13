/**
 * FILE: js/chat.js
 * PURPOSE: Standalone chat application logic
 * 
 * This module handles all chat functionality including:
 * - Loading contacts and messages from JSON
 * - Rendering contact list and chat messages
 * - Sending new messages
 * - Adding new contacts
 * - Supporting different message types (text, image, voice, URL)
 * - Saving chat data back to JSON
 * 
 * WHY: Provides a complete WhatsApp-like chat interface that is completely
 * separate from the case management system. All data is stored in JSON files
 * for easy content management and editing.
 */

const CHAT_DATA_FILE = './content/chat.json';
const GALLERY_DATA_FILE = './content/gallery.json';
const CHAT_STORAGE_KEY = 'chat_data';
const USER_PROFILE_KEY = 'chat_user_profile';
const GALLERY_BASE_URL = 'https://pub-b5c905be79734df794cad8fee3c595d4.r2.dev/bela/gallery/';

// DOM Elements
let contactsListEl, chatMessagesEl, messageInputEl, sendBtnEl;
let addContactModal, galleryModal, currentContactId = null;
let chatData = { contacts: [], messages: {} };
let galleryData = { images: [] };
let userProfile = { name: 'Benutzer', avatar: '👤', status: 'Online' };

/**
 * Initialize the chat application
 */
async function init() {
  // Get DOM elements
  contactsListEl = document.getElementById('contacts-list');
  chatMessagesEl = document.getElementById('chat-messages');
  messageInputEl = document.getElementById('message-input');
  sendBtnEl = document.getElementById('send-btn');
  addContactModal = document.getElementById('add-contact-modal');
  galleryModal = document.getElementById('gallery-modal');

  // Load chat data
  await loadChatData();
  
  // Load gallery data
  await loadGalleryData();
  
  // Load user profile (must be after loadChatData so chatData is available)
  loadUserProfile();

  // Setup event listeners
  setupEventListeners();

  // Render contacts
  renderContacts();
  
  // Render user profile
  renderUserProfile();

  // Show empty state
  showEmptyState();
}

/**
 * Load chat data from JSON file or localStorage
 */
async function loadChatData() {
  try {
    const response = await fetch(CHAT_DATA_FILE);
    if (response.ok) {
      const data = await response.json();
      chatData = data;
      // Also save to localStorage as backup
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(data));
    } else {
      // Try loading from localStorage
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        chatData = JSON.parse(stored);
      }
    }
  } catch (error) {
    console.error('Error loading chat data:', error);
    // Try loading from localStorage
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (stored) {
      chatData = JSON.parse(stored);
    }
  }
}

/**
 * Load user profile from localStorage or JSON
 */
function loadUserProfile() {
  try {
    // Check if JSON has a userProfile and if localStorage should be overridden
    // Priority: JSON file (if it exists) > localStorage > defaults
    if (chatData.userProfile) {
      // If JSON has userProfile, use it (this allows JSON to override localStorage)
      // But if user has manually edited via UI, localStorage takes precedence
      const stored = localStorage.getItem(USER_PROFILE_KEY);
      if (stored) {
        // User has edited profile via UI, use localStorage but merge missing fields from JSON
        const storedProfile = JSON.parse(stored);
        userProfile = {
          name: storedProfile.name || chatData.userProfile.name || 'Benutzer',
          avatar: storedProfile.avatar || chatData.userProfile.avatar || '👤',
          status: storedProfile.status || chatData.userProfile.status || 'Online'
        };
      } else {
        // No localStorage entry, use JSON profile
        userProfile = {
          name: chatData.userProfile.name || 'Benutzer',
          avatar: chatData.userProfile.avatar || '👤',
          status: chatData.userProfile.status || 'Online'
        };
        // Save to localStorage so it persists
        saveUserProfile();
      }
    } else {
      // No JSON profile, try localStorage
      const stored = localStorage.getItem(USER_PROFILE_KEY);
      if (stored) {
        userProfile = JSON.parse(stored);
      } else {
        // No profile anywhere, use defaults
        userProfile = {
          name: 'Benutzer',
          avatar: '👤',
          status: 'Online'
        };
      }
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
    // Set defaults
    userProfile = {
      name: 'Benutzer',
      avatar: '👤',
      status: 'Online'
    };
  }
}

/**
 * Save user profile to localStorage
 */
function saveUserProfile() {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
}

/**
 * Render user profile in sidebar
 */
function renderUserProfile() {
  const avatarEl = document.getElementById('user-avatar');
  const nameEl = document.getElementById('user-name');
  const statusEl = document.getElementById('user-status');
  
  if (!avatarEl || !nameEl || !statusEl) {
    console.error('User profile elements not found');
    return;
  }
  
  // Clear previous content
  avatarEl.innerHTML = '';
  
  // Check if avatar is an image path or emoji
  if (userProfile.avatar && (userProfile.avatar.startsWith('./') || userProfile.avatar.startsWith('http') || userProfile.avatar.startsWith('/'))) {
    const img = document.createElement('img');
    img.src = userProfile.avatar; // Don't escape HTML for src attribute
    img.alt = userProfile.name || 'Profil';
    img.className = 'chat-avatar-image';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.onerror = function() {
      console.error('Failed to load profile image:', userProfile.avatar);
      this.parentElement.textContent = '👤';
    };
    avatarEl.appendChild(img);
  } else {
    avatarEl.textContent = userProfile.avatar || '👤';
  }
  
  nameEl.textContent = userProfile.name || 'Benutzer';
  statusEl.textContent = userProfile.status || 'Online';
}

/**
 * Load gallery data from JSON file
 */
async function loadGalleryData() {
  try {
    const response = await fetch(GALLERY_DATA_FILE);
    if (response.ok) {
      const data = await response.json();
      galleryData = data;
    }
  } catch (error) {
    console.error('Error loading gallery data:', error);
    galleryData = { images: [] };
  }
}

/**
 * Save chat data to localStorage (JSON file saving would require server)
 */
function saveChatData() {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatData));
  } catch (error) {
    console.error('Error saving chat data:', error);
  }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Send message
  sendBtnEl.addEventListener('click', sendMessage);
  messageInputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Add contact
  document.getElementById('add-contact-btn').addEventListener('click', () => {
    addContactModal.classList.remove('hidden');
  });

  // File attachment - open gallery
  const attachBtn = document.getElementById('attach-btn');
  attachBtn.addEventListener('click', () => {
    openGalleryModal();
  });

  // Gallery modal
  document.getElementById('close-gallery-btn').addEventListener('click', () => {
    galleryModal.classList.add('hidden');
  });
  document.getElementById('cancel-gallery-btn').addEventListener('click', () => {
    galleryModal.classList.add('hidden');
  });

  document.getElementById('close-modal-btn').addEventListener('click', () => {
    addContactModal.classList.add('hidden');
  });

  document.getElementById('cancel-contact-btn').addEventListener('click', () => {
    addContactModal.classList.add('hidden');
  });

  document.getElementById('save-contact-btn').addEventListener('click', addNewContact);

  // Edit profile
  document.getElementById('edit-profile-btn').addEventListener('click', showEditProfileModal);
  document.getElementById('close-profile-modal-btn').addEventListener('click', () => {
    document.getElementById('edit-profile-modal').classList.add('hidden');
  });
  document.getElementById('cancel-profile-btn').addEventListener('click', () => {
    document.getElementById('edit-profile-modal').classList.add('hidden');
  });
  document.getElementById('save-profile-btn').addEventListener('click', saveProfile);

  // Close chat
  document.getElementById('close-chat-btn').addEventListener('click', () => {
    currentContactId = null;
    showEmptyState();
  });

  // Contact search
  document.getElementById('contact-search').addEventListener('input', (e) => {
    filterContacts(e.target.value);
  });
}

/**
 * Render the contacts list
 */
function renderContacts(filter = '') {
  contactsListEl.innerHTML = '';

  const filtered = chatData.contacts.filter(contact => {
    if (!filter) return true;
    const search = filter.toLowerCase();
    return contact.name.toLowerCase().includes(search);
  });

  if (filtered.length === 0) {
    contactsListEl.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">Keine Kontakte gefunden</div>';
    return;
  }

  filtered.forEach(contact => {
    const contactEl = createContactElement(contact);
    contactsListEl.appendChild(contactEl);
  });
}

/**
 * Create a contact list item element
 */
function createContactElement(contact) {
  const item = document.createElement('div');
  item.className = `chat-contact-item ${contact.id === currentContactId ? 'active' : ''}`;
  item.dataset.contactId = contact.id;

  // Get last message preview
  const messages = chatData.messages[contact.id] || [];
  const lastMessage = messages[messages.length - 1];
  let preview = 'Noch keine Nachrichten';
  if (lastMessage) {
    if (lastMessage.type === 'text') {
      preview = lastMessage.content;
    } else if (lastMessage.type === 'image') {
      preview = '📷 Bild';
    } else if (lastMessage.type === 'voice') {
      preview = '🎤 Sprachnachricht';
    } else if (lastMessage.type === 'url') {
      preview = lastMessage.displayText || lastMessage.content || '🔗 Link';
    } else if (lastMessage.type === 'call') {
      const callStatus = lastMessage.callStatus || 'missed';
      if (callStatus === 'missed') {
        preview = '📞 Verpasster Anruf';
      } else if (callStatus === 'taken') {
        preview = '📞 Anruf';
      } else if (callStatus === 'outgoing') {
        preview = '📞 Ausgehender Anruf';
      } else {
        preview = '📞 Anruf';
      }
    }
  }

  // Get last message time - use displayTime if provided, otherwise format timestamp
  const lastTime = lastMessage ? (lastMessage.displayTime || formatTime(lastMessage.timestamp)) : '';

  // Render avatar - check if it's an image path or emoji
  let avatarHtml = '';
  if (contact.avatar && (contact.avatar.startsWith('./') || contact.avatar.startsWith('http'))) {
    avatarHtml = `<img src="${escapeHtml(contact.avatar)}" alt="${escapeHtml(contact.name)}" class="chat-avatar-image" onerror="this.parentElement.textContent='👤'">`;
  } else {
    avatarHtml = contact.avatar || '👤';
  }

  item.innerHTML = `
    <div class="chat-contact-avatar">${avatarHtml}</div>
    <div class="chat-contact-info">
      <div class="chat-contact-name">${escapeHtml(contact.name)}</div>
      <div class="chat-contact-preview">${escapeHtml(preview)}</div>
    </div>
    ${lastTime ? `<div class="chat-contact-time">${lastTime}</div>` : ''}
  `;

  item.addEventListener('click', () => {
    openChat(contact.id);
  });

  return item;
}

/**
 * Filter contacts by search term
 */
function filterContacts(searchTerm) {
  renderContacts(searchTerm);
}

/**
 * Open chat with a contact
 */
function openChat(contactId) {
  currentContactId = contactId;
  const contact = chatData.contacts.find(c => c.id === contactId);
  
  if (!contact) return;

  // Update header - check if avatar is image or emoji
  const chatAvatarEl = document.getElementById('chat-avatar');
  if (contact.avatar && (contact.avatar.startsWith('./') || contact.avatar.startsWith('http'))) {
    chatAvatarEl.innerHTML = `<img src="${escapeHtml(contact.avatar)}" alt="${escapeHtml(contact.name)}" class="chat-avatar-image" onerror="this.parentElement.textContent='👤'">`;
  } else {
    chatAvatarEl.textContent = contact.avatar || '👤';
  }
  document.getElementById('chat-name').textContent = contact.name;
  document.getElementById('chat-status').textContent = contact.status || 'Online';

  // Show chat window
  document.getElementById('chat-empty').classList.add('hidden');
  document.getElementById('chat-window').classList.remove('hidden');

  // Render messages
  renderMessages(contactId);

  // Update active contact in list
  document.querySelectorAll('.chat-contact-item').forEach(item => {
    item.classList.toggle('active', item.dataset.contactId === contactId);
  });

  // Focus input
  messageInputEl.focus();
}

/**
 * Render messages for a contact
 */
function renderMessages(contactId) {
  chatMessagesEl.innerHTML = '';

  const messages = chatData.messages[contactId] || [];

  if (messages.length === 0) {
    chatMessagesEl.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 40px;">Noch keine Nachrichten. Starten Sie die Unterhaltung!</div>';
    return;
  }

  messages.forEach(message => {
    const messageEl = createMessageElement(message);
    chatMessagesEl.appendChild(messageEl);
  });

  // Scroll to bottom
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

/**
 * Create a message element
 */
function createMessageElement(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${message.sent ? 'sent' : 'received'}`;

  const bubble = document.createElement('div');
  bubble.className = 'chat-message-bubble';

  // Render based on message type
  if (message.type === 'text') {
    // Auto-detect and linkify URLs in text
    let text = escapeHtml(message.content);
    text = text.replace(/\n/g, '<br>');
    // Simple URL regex
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    text = text.replace(urlRegex, '<a href="$1" target="_blank" class="chat-message-url">$1</a>');
    bubble.innerHTML = text;
  } else if (message.type === 'image') {
    // Load image from URL (can be remote URL or local path)
    const imagePath = message.content;
    bubble.innerHTML = `
      <img src="${escapeHtml(imagePath)}" alt="${escapeHtml(message.filename || 'Bild')}" 
           class="chat-message-image" 
           onerror="this.onerror=null; this.alt='Bild nicht gefunden: ${escapeHtml(imagePath)}'; this.style.border='2px solid var(--error)';">
      ${message.caption ? `<div class="chat-message-image-caption">${escapeHtml(message.caption).replace(/\n/g, '<br>')}</div>` : ''}
      ${message.filename ? `<div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">${escapeHtml(message.filename)}</div>` : ''}
    `;
  } else if (message.type === 'voice') {
    // Create audio player for voice notes
    const audioPath = message.content;
    // Ensure unique IDs even if message.id is duplicated
    const uniqueId = `${message.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const audioId = `audio-${uniqueId}`;
    const playBtnId = `play-btn-${uniqueId}`;
    
    bubble.innerHTML = `
      <div class="chat-message-voice">
        <button id="${playBtnId}" class="voice-play-btn" data-audio-id="${audioId}">▶</button>
        <span class="chat-message-voice-icon">🎤</span>
        <span class="chat-message-voice-duration">${message.duration || '0:00'}</span>
        <audio id="${audioId}" src="${escapeHtml(audioPath)}" preload="metadata"></audio>
        ${message.filename ? `<div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">${escapeHtml(message.filename)}</div>` : ''}
      </div>
    `;
    
    // Add play button functionality - use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      const playBtn = document.getElementById(playBtnId);
      const audio = document.getElementById(audioId);
      
      if (!playBtn || !audio) {
        console.error('Could not find play button or audio element:', { playBtnId, audioId });
        return;
      }
      
      // Stop all other audio players when this one starts
      const stopAllOtherAudio = () => {
        document.querySelectorAll('audio').forEach(otherAudio => {
          if (otherAudio.id !== audioId && !otherAudio.paused) {
            otherAudio.pause();
            otherAudio.currentTime = 0;
            // Reset all other play buttons
            const otherBtnId = otherAudio.id.replace('audio-', 'play-btn-');
            const otherBtn = document.getElementById(otherBtnId);
            if (otherBtn) {
              otherBtn.textContent = '▶';
            }
          }
        });
      };
      
      // Remove any existing listeners by cloning the button
      const newPlayBtn = playBtn.cloneNode(true);
      playBtn.parentNode.replaceChild(newPlayBtn, playBtn);
      
      newPlayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        stopAllOtherAudio();
        
        const currentAudio = document.getElementById(audioId);
        if (!currentAudio) {
          console.error('Audio element not found:', audioId);
          return;
        }
        
        if (currentAudio.paused) {
          currentAudio.play().then(() => {
            newPlayBtn.textContent = '⏸';
          }).catch(err => {
            console.error('Error playing audio:', err, audioPath);
            newPlayBtn.textContent = '⚠';
            newPlayBtn.title = 'Fehler beim Abspielen der Audiodatei: ' + audioPath;
          });
        } else {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          newPlayBtn.textContent = '▶';
        }
      });
      
      // Update button when audio ends
      audio.addEventListener('ended', () => {
        newPlayBtn.textContent = '▶';
        audio.currentTime = 0;
      });
      
      audio.addEventListener('pause', () => {
        if (audio.currentTime === 0 || audio.ended) {
          newPlayBtn.textContent = '▶';
        }
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e, audioPath);
        newPlayBtn.textContent = '⚠';
        newPlayBtn.title = 'Audiodatei nicht gefunden: ' + audioPath;
      });
    });
  } else if (message.type === 'url') {
    const url = escapeHtml(message.content);
    const displayText = message.displayText ? escapeHtml(message.displayText) : url;
    bubble.innerHTML = `<a href="${url}" target="_blank" class="chat-message-url" title="${url}">${displayText}</a>`;
  } else if (message.type === 'call') {
    // Render call message
    const callStatus = message.callStatus || 'missed';
    const callDuration = message.duration || null;
    let callIcon = '📞';
    let callText = 'Anruf';
    
    if (callStatus === 'missed') {
      callIcon = '📞';
      callText = 'Verpasster Anruf';
    } else if (callStatus === 'taken') {
      callIcon = '📞';
      callText = 'Anruf';
    } else if (callStatus === 'outgoing') {
      callIcon = '📞';
      callText = 'Ausgehender Anruf';
    }
    
    bubble.innerHTML = `
      <div class="chat-message-call">
        <span class="chat-message-call-icon">${callIcon}</span>
        <div class="chat-message-call-info">
          <div class="chat-message-call-text">${callText}</div>
          ${callDuration ? `<div class="chat-message-call-duration">Dauer: ${callDuration}</div>` : ''}
          ${message.callType ? `<div class="chat-message-call-type">${escapeHtml(message.callType)}</div>` : ''}
        </div>
      </div>
    `;
    
    // Style based on call status
    if (callStatus === 'missed') {
      bubble.style.borderColor = 'var(--error)';
      bubble.style.background = 'rgba(255, 0, 0, 0.1)';
    } else if (callStatus === 'taken') {
      bubble.style.borderColor = 'var(--success)';
      bubble.style.background = 'rgba(0, 255, 0, 0.1)';
    }
  }

  const timeDiv = document.createElement('div');
  timeDiv.className = 'chat-message-time';
  // Use displayTime if provided, otherwise format the timestamp
  timeDiv.textContent = message.displayTime || formatTime(message.timestamp);

  bubble.appendChild(timeDiv);
  messageDiv.appendChild(bubble);

  return messageDiv;
}

/**
 * Send a new message
 */
function sendMessage() {
  if (!currentContactId) return;

  const content = messageInputEl.value.trim();
  if (!content) return;

  // Detect message type
  let messageType = 'text';
  let displayText = null;
  
  if (isUrl(content)) {
    messageType = 'url';
    // Ask for display text if it's a URL
    displayText = prompt('Anzeigetext für den Link eingeben (optional, leer lassen um URL anzuzeigen):', '');
    if (displayText === null) {
      // User cancelled, don't send
      return;
    }
    displayText = displayText.trim() || null;
  }

  // Create message
  const message = {
    id: Date.now().toString(),
    type: messageType,
    content: content,
    sent: true,
    timestamp: new Date().toISOString()
  };
  
  // Add display text if provided
  if (displayText) {
    message.displayText = displayText;
  }

  // Add to messages
  if (!chatData.messages[currentContactId]) {
    chatData.messages[currentContactId] = [];
  }
  chatData.messages[currentContactId].push(message);

  // Save data
  saveChatData();

  // Clear input
  messageInputEl.value = '';

  // Re-render messages
  renderMessages(currentContactId);

  // Update contacts list
  renderContacts();
  
  // Trigger auto-reply if contact has autoReplies
  triggerAutoReply(currentContactId);
}

/**
 * Trigger an auto-reply from the contact if configured
 */
function triggerAutoReply(contactId) {
  const contact = chatData.contacts.find(c => c.id === contactId);
  if (!contact) return;
  
  // Check if contact has auto-replies
  const autoReplies = contact.autoReplies;
  if (!autoReplies || autoReplies.length === 0) return;
  
  // Get random reply
  const randomIndex = Math.floor(Math.random() * autoReplies.length);
  const replyContent = autoReplies[randomIndex];
  
  // Get delay (default 1000ms)
  const delay = contact.replyDelay || 1000;
  
  // Show typing indicator
  showTypingIndicator(contactId);
  
  // Send reply after delay
  setTimeout(() => {
    // Hide typing indicator
    hideTypingIndicator();
    
    // Only send if still on same chat
    if (currentContactId !== contactId) return;
    
    // Create reply message
    const replyMessage = {
      id: Date.now().toString(),
      type: 'text',
      content: replyContent,
      sent: false,
      timestamp: new Date().toISOString()
    };
    
    // Add to messages
    if (!chatData.messages[contactId]) {
      chatData.messages[contactId] = [];
    }
    chatData.messages[contactId].push(replyMessage);
    
    // Save data
    saveChatData();
    
    // Re-render if still on same chat
    if (currentContactId === contactId) {
      renderMessages(contactId);
    }
    
    // Update contacts list
    renderContacts();
  }, delay);
}

/**
 * Show typing indicator in chat
 */
function showTypingIndicator(contactId) {
  if (currentContactId !== contactId) return;
  
  const existingIndicator = document.getElementById('typing-indicator');
  if (existingIndicator) return;
  
  const indicator = document.createElement('div');
  indicator.id = 'typing-indicator';
  indicator.className = 'chat-message received';
  indicator.innerHTML = `
    <div class="chat-message-bubble typing-bubble">
      <span class="typing-dots">
        <span>.</span><span>.</span><span>.</span>
      </span>
    </div>
  `;
  
  chatMessagesEl.appendChild(indicator);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

/**
 * Hide typing indicator
 */
function hideTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

/**
 * Check if a string is a URL
 */
function isUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    // Check for common URL patterns
    return /^(https?:\/\/|www\.)/i.test(str);
  }
}

/**
 * Open gallery modal to select an image
 */
function openGalleryModal() {
  if (!currentContactId) {
    alert('Bitte wählen Sie zuerst einen Kontakt aus');
    return;
  }

  const galleryGrid = document.getElementById('gallery-grid');
  const galleryEmpty = document.getElementById('gallery-empty');
  
  // Clear previous content
  galleryGrid.innerHTML = '';
  
  // Check if gallery has images
  if (!galleryData.images || galleryData.images.length === 0) {
    galleryGrid.classList.add('hidden');
    galleryEmpty.classList.remove('hidden');
    galleryModal.classList.remove('hidden');
    return;
  }
  
  galleryGrid.classList.remove('hidden');
  galleryEmpty.classList.add('hidden');
  
  // Render gallery images
  galleryData.images.forEach((image) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    const img = document.createElement('img');
    // Support both url field and filename (construct URL from base + filename)
    if (image.url) {
      img.src = image.url;
    } else if (image.filename) {
      img.src = `${GALLERY_BASE_URL}${image.filename}`;
    } else {
      // Fallback to local file for backwards compatibility
      img.src = `./files/gallery/${image.filename || ''}`;
    }
    img.alt = image.label || image.filename || image.url;
    img.onerror = function() {
      this.parentElement.classList.add('gallery-item-error');
      this.style.display = 'none';
      this.parentElement.innerHTML = '❌';
    };
    
    const label = document.createElement('div');
    label.className = 'gallery-item-label';
    label.textContent = image.label || image.filename || 'Bild';
    
    item.appendChild(img);
    item.appendChild(label);
    
    // Click to select image
    item.addEventListener('click', () => {
      selectGalleryImage(image);
    });
    
    galleryGrid.appendChild(item);
  });
  
  galleryModal.classList.remove('hidden');
}

/**
 * Select an image from the gallery and send it as a message
 */
function selectGalleryImage(image) {
  if (!currentContactId) return;
  
  // Support both url field and filename (construct URL from base + filename)
  let imageUrl;
  if (image.url) {
    imageUrl = image.url;
  } else if (image.filename) {
    imageUrl = `${GALLERY_BASE_URL}${image.filename}`;
  } else {
    // Fallback to local file for backwards compatibility
    imageUrl = `./files/gallery/${image.filename || ''}`;
  }
  
  // Create message with image
  const message = {
    id: Date.now().toString(),
    type: 'image',
    content: imageUrl,
    sent: true,
    timestamp: new Date().toISOString(),
    filename: image.filename || image.url?.split('/').pop() || 'image'
  };

  // Add to messages
  if (!chatData.messages[currentContactId]) {
    chatData.messages[currentContactId] = [];
  }
  chatData.messages[currentContactId].push(message);

  // Save data
  saveChatData();

  // Close gallery modal
  galleryModal.classList.add('hidden');

  // Re-render messages
  renderMessages(currentContactId);

  // Update contacts list
  renderContacts();
  
  // Check for special reply for this image + contact combination
  triggerImageReply(image, currentContactId);
}

/**
 * Trigger a special reply if configured for this image + contact combination
 */
function triggerImageReply(image, contactId) {
  // Check if image has special replies configured
  if (!image.specialReplies || !image.specialReplies[contactId]) {
    // No special reply, try normal auto-reply
    triggerAutoReply(contactId);
    return;
  }
  
  const specialReply = image.specialReplies[contactId];
  const contact = chatData.contacts.find(c => c.id === contactId);
  
  // Get delay (use contact's replyDelay or default)
  const delay = contact?.replyDelay || 1500;
  
  // Show typing indicator
  showTypingIndicator(contactId);
  
  // Send special reply after delay
  setTimeout(() => {
    // Hide typing indicator
    hideTypingIndicator();
    
    // Only send if still on same chat
    if (currentContactId !== contactId) return;
    
    // Create reply message
    const replyMessage = {
      id: Date.now().toString(),
      type: 'text',
      content: specialReply,
      sent: false,
      timestamp: new Date().toISOString()
    };
    
    // Add to messages
    if (!chatData.messages[contactId]) {
      chatData.messages[contactId] = [];
    }
    chatData.messages[contactId].push(replyMessage);
    
    // Save data
    saveChatData();
    
    // Re-render if still on same chat
    if (currentContactId === contactId) {
      renderMessages(contactId);
    }
    
    // Update contacts list
    renderContacts();
  }, delay);
}

/**
 * Format duration in seconds to MM:SS
 */
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * Add a new contact
 */
function addNewContact() {
  const name = document.getElementById('new-contact-name').value.trim();
  let avatar = document.getElementById('new-contact-avatar').value.trim() || '👤';

  if (!name) {
    alert('Bitte geben Sie einen Kontaktnamen ein');
    return;
  }

  // Ensure avatar is max 2 characters (emoji or initials)
  // Emojis can be longer in byte length but visually 1-2 characters
  if (avatar.length > 2 && !isEmoji(avatar)) {
    avatar = avatar.substring(0, 2).toUpperCase();
  }

  // Create new contact (no auto-replies for user-added contacts, status is "unbekannt")
  const contact = {
    id: 'contact-' + Date.now(),
    name: name,
    avatar: avatar,
    status: 'unbekannt',
    autoReplies: []
  };

  // Add to contacts
  chatData.contacts.push(contact);

  // Initialize messages array
  if (!chatData.messages[contact.id]) {
    chatData.messages[contact.id] = [];
  }

  // Save data
  saveChatData();

  // Clear form
  document.getElementById('new-contact-name').value = '';
  document.getElementById('new-contact-avatar').value = '';

  // Close modal
  addContactModal.classList.add('hidden');

  // Re-render contacts
  renderContacts();

  // Open chat with new contact
  openChat(contact.id);
}

/**
 * Check if a string contains an emoji
 */
function isEmoji(str) {
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(str);
}

/**
 * Show edit profile modal
 */
function showEditProfileModal() {
  const modal = document.getElementById('edit-profile-modal');
  document.getElementById('profile-name').value = userProfile.name || '';
  document.getElementById('profile-status').value = userProfile.status || 'Online';
  modal.classList.remove('hidden');
}

/**
 * Save user profile (avatar is admin-only, not editable here)
 */
function saveProfile() {
  const name = document.getElementById('profile-name').value.trim();
  const status = document.getElementById('profile-status').value.trim() || 'Online';

  if (!name) {
    alert('Bitte geben Sie einen Namen ein');
    return;
  }

  userProfile.name = name;
  // Avatar is not changed - admin only
  userProfile.status = status;

  saveUserProfile();
  renderUserProfile();

  // Clear form
  document.getElementById('profile-name').value = '';
  document.getElementById('profile-status').value = '';

  // Close modal
  document.getElementById('edit-profile-modal').classList.add('hidden');
}

/**
 * Show empty state
 */
function showEmptyState() {
  document.getElementById('chat-empty').classList.remove('hidden');
  document.getElementById('chat-window').classList.add('hidden');
  currentContactId = null;
}

/**
 * Format timestamp to time string
 */
function formatTime(timestamp) {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'gerade eben';
    if (minutes < 60) return `vor ${minutes}m`;
    if (minutes < 1440) return `vor ${Math.floor(minutes / 60)}h`;
    
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch (e) {
    return '';
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
