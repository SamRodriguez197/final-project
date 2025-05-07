import { collectionEntries } from './data.js';

// Track which entries have been shown to avoid duplicates
let remainingEntries = [...collectionEntries];
// Track if all entries have been shown
let allEntriesShown = false;
let currentEntryIndex = -1;
let shownEntries = [];
let hasShownCompletionNotification = false;

function getInitialEntry() {
  return collectionEntries.find(entry => entry.chapter === "1");
}

function getRandomEntry() {
  if (remainingEntries.length === 0) {
    allEntriesShown = true;
    remainingEntries = [...collectionEntries];
    showCompletionNotification();
    return remainingEntries.splice(Math.floor(Math.random() * remainingEntries.length), 1)[0];
  }
  
  const index = Math.floor(Math.random() * remainingEntries.length);
  const entry = remainingEntries.splice(index, 1)[0];
  shownEntries.push(entry);
  currentEntryIndex = shownEntries.length - 1;
  return entry;
}

function showPreviousEntry() {
  if (currentEntryIndex > 0) {
    currentEntryIndex--;
    showEntry(shownEntries[currentEntryIndex]);
  }
}

function showCompletionNotification() {
  if (hasShownCompletionNotification) return;
  
  const notification = document.createElement('div');
  notification.className = 'notification';
  
  // Add close button
  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-btn';
  closeBtn.innerHTML = '×';
  closeBtn.onclick = () => {
    notification.remove();
  };
  
  // Add message
  const message = document.createElement('span');
  message.textContent = 'You have seen all Spider-Man entries! Check out the full archive.';
  
  notification.appendChild(closeBtn);
  notification.appendChild(message);
  
  document.body.appendChild(notification);
  hasShownCompletionNotification = true;
}

function fadeInElement(el) {
  if (!el) return;
  el.style.opacity = 0;
  el.style.display = 'block';
  setTimeout(() => {
    el.style.transition = 'opacity 1s ease';
    el.style.opacity = 1;
  }, 10);
}

/**
 * Creates a clickable image modal
 * @param {string} imageUrl - URL of the image to display
 */
function createImageModal(imageUrl, title) {
  // Create the modal container
  const modal = document.createElement('div');
  modal.className = 'image-modal';
  
  // Create the image element
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = title || 'Enlarged image';
  
  // Create close button
  const closeBtn = document.createElement('span');
  closeBtn.className = 'modal-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    modal.remove();
  });
  
  // Add click event to close when clicking background
  modal.addEventListener('click', () => {
    modal.remove();
  });
  
  // Stop propagation for the image to prevent closing when clicking the image
  img.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // Append elements to the modal
  modal.appendChild(closeBtn);
  modal.appendChild(img);
  
  // Append the modal to the body
  document.body.appendChild(modal);
  
  // Fade in the modal
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

/**
 * Process medium text to extract and format links if present
 * @param {string} medium - The medium text which may contain a URL
 * @returns {string} - HTML string with formatted link if present
 */
function processMediaLinks(medium) {
  if (!medium) return '';
  
  // Check if medium contains a URL (starts with http or https)
  const urlMatch = medium.match(/(https?:\/\/[^\s]+)/);
  
  if (urlMatch) {
    // Extract the parts before and after the URL
    const beforeUrl = medium.substring(0, urlMatch.index).trim();
    const url = urlMatch[0];
    
    // Create a link element with the appropriate text
    return `${beforeUrl} <a href="${url}" target="_blank" class="medium-link">View Source</a>`;
  }
  
  return medium;
}

/**
 * Display a collection entry with elements positioned around Spider-Man in the background
 * This function creates all the elements positioned specifically to go around
 * the Spider-Man figure in the background image
 * 
 * @param {Object} entry - The collection entry object to display
 */
function showEntry(entry) {
  console.log("Showing entry:", entry); // Debug log
  const entryContainer = document.getElementById('entry-container');
  
  if (!entryContainer) {
    console.error('Entry container not found');
    return;
  }
  
  // Clear previous entry content
  entryContainer.innerHTML = '';
  
  // Create each element with specific positioning classes
  
  // Set up the image at the top center with click functionality
  const visualElement = document.createElement('div');
  visualElement.className = 'entry-visual';
  
  const entryImage = document.createElement('img');
  entryImage.src = entry.image;
  entryImage.alt = entry.title;
  entryImage.className = 'entry-image clickable';
  entryImage.addEventListener('click', () => createImageModal(entry.image, entry.title));
  
  visualElement.appendChild(entryImage);
  entryContainer.appendChild(visualElement);
  
  // Add title near the bottom center
  const titleElement = document.createElement('div');
  titleElement.className = 'entry-title';
  titleElement.innerHTML = `<h2>${entry.title}</h2>`;
  entryContainer.appendChild(titleElement);
  
  // Add creator and year to the right side
  const yearElement = document.createElement('div');
  yearElement.className = 'entry-year';
  yearElement.innerHTML = `<p><strong>Creator:</strong> ${entry.creator}</p><p><strong>Year:</strong> ${entry.year || 'Unknown'}</p>`;
  entryContainer.appendChild(yearElement);
  
  // Add medium to the left side with link processing
  const mediumElement = document.createElement('div');
  mediumElement.className = 'entry-medium';
  mediumElement.innerHTML = `<p><strong>Medium:</strong> ${processMediaLinks(entry.medium)}</p>`;
  entryContainer.appendChild(mediumElement);
  
  // Add chapter to the left side
  const chapterElement = document.createElement('div');
  chapterElement.className = 'entry-chapter';
  chapterElement.innerHTML = `<p><strong>Chapter:</strong> ${entry.chapter}</p>`;
  entryContainer.appendChild(chapterElement);
  
  // Add thematic tag to the right side
  const tagElement = document.createElement('div');
  tagElement.className = 'entry-tag';
  tagElement.innerHTML = `<p><strong>Thematic Tag:</strong> ${entry.thematic_tag}</p>`;
  entryContainer.appendChild(tagElement);
  
  // Add curatorial note at the bottom
  const noteElement = document.createElement('div');
  noteElement.className = 'entry-note';
  noteElement.innerHTML = `<p>${entry.curatorialNote}</p>`;
  entryContainer.appendChild(noteElement);
  
  // Make sure all elements are visible
  Array.from(entryContainer.children).forEach(child => {
    child.style.display = 'block';
  });
  
  // Fade in the container
  fadeInElement(entryContainer);

  // Handle Next Entry button visibility
  const nextBtn = document.getElementById('next-entry-btn');
  if (nextBtn) {
    nextBtn.style.display = 'block';
    fadeInElement(nextBtn);
  }

  // Handle Continue to Archive button visibility
  const continueBtn = document.getElementById('to-third-page-btn');
  if (continueBtn) {
    if (allEntriesShown) {
      continueBtn.textContent = 'View Full Archive';
      continueBtn.classList.add('highlight-button');
    } else {
      continueBtn.textContent = 'View Full Archive';
    }
    continueBtn.style.display = 'block';
    fadeInElement(continueBtn);
  }

  // Show back button only after first entry
  const backBtn = document.getElementById('back-entry-btn');
  if (backBtn) {
    backBtn.style.display = shownEntries.length > 1 ? 'block' : 'none';
  }
}

function loadNextEntry() {
  console.log("Loading next entry..."); // Debug log
  
  // If we're viewing a previous entry (not the latest one)
  if (currentEntryIndex < shownEntries.length - 1) {
    currentEntryIndex++;
    showEntry(shownEntries[currentEntryIndex]);
  } else {
    // Get a new random entry
    const entry = getRandomEntry();
    if (entry) {
      console.log("Got entry:", entry); // Debug log
      showEntry(entry);
      
      // Update button text and position when all entries shown
      if (allEntriesShown && !hasShownCompletionNotification) {
        showCompletionNotification();
        
        const nextBtn = document.getElementById('next-entry-btn');
        const buttonContainer = document.querySelector('.button-container');
        
        if (nextBtn && buttonContainer) {
          nextBtn.textContent = 'All Entries Seen - Next Spider-Man';
          buttonContainer.classList.add('all-entries-shown');
        }
      }
    } else {
      console.error("Failed to get entry");
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded"); // Debug log
  
  // Check if we're on the feature page
  const nextBtn = document.getElementById('next-entry-btn');
  const toThirdPageBtn = document.getElementById('to-third-page-btn');
  const entryContainer = document.getElementById('entry-container');
  
  console.log("Next button:", nextBtn);
  console.log("To third page button:", toThirdPageBtn);
  console.log("Entry container:", entryContainer);
  
  if (nextBtn) {
    nextBtn.addEventListener('click', loadNextEntry);

    // Make sure buttons are styled properly
    nextBtn.classList.add('navigation-button');
    
    // Add back button
    const backBtn = document.createElement('button');
    backBtn.id = 'back-entry-btn';
    backBtn.className = 'navigation-button';
    backBtn.textContent = 'Previous Spider-Man';
    backBtn.addEventListener('click', showPreviousEntry);
    document.querySelector('.button-container').appendChild(backBtn);
    
    // Update button text when all entries are shown
    if (allEntriesShown) {
      nextBtn.textContent = 'All Entries Seen - Next Spider-Man';
      document.querySelector('.button-container').classList.add('all-entries-shown');
    }

    // Start with Chapter 1 entry
    const firstEntry = getInitialEntry();
    if (firstEntry) {
      shownEntries.push(firstEntry);
      currentEntryIndex = 0;
      showEntry(firstEntry);
      
      // Remove the initial entry from remainingEntries
      const initialIndex = remainingEntries.findIndex(e => e.title === firstEntry.title);
      if (initialIndex > -1) {
        remainingEntries.splice(initialIndex, 1);
      }
    }
  }
  
  if (toThirdPageBtn) {
    toThirdPageBtn.classList.add('navigation-button');
    
    toThirdPageBtn.addEventListener('click', () => {
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location.href = 'collection.html';
      }, 1000);
    });
  }
});