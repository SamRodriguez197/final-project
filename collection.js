import { collectionEntries } from './data.js';

/**
 * This script creates a table-based archive view of all Spider-Man collection entries,
 * organized by chapter.
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log("Collection page loaded");
  console.log("Collection entries:", collectionEntries); // Debug log to check data
  
  // Get the main container element
  const container = document.getElementById('table-container');
  
  if (!container) {
    console.error("Container not found!");
    return;
  }
  
  // Step 1: Group entries by chapter for organization
  const entriesByChapter = {};
  
  // Loop through all entries and organize them by chapter
  collectionEntries.forEach(entry => {
    // If this is the first entry for this chapter, create a new array
    if (!entriesByChapter[entry.chapter]) {
      entriesByChapter[entry.chapter] = [];
    }
    // Add the entry to its chapter group
    entriesByChapter[entry.chapter].push(entry);
  });
  
  console.log("Entries by chapter:", entriesByChapter); // Debug log
  
  // Step 2: Sort chapters numerically
  // (this ensures Chapter 1 comes before Chapter 10, etc.)
  const sortedChapters = Object.keys(entriesByChapter).sort((a, b) => {
    return parseInt(a) - parseInt(b);
  });
  
  console.log("Sorted chapters:", sortedChapters); // Debug log
  
  // Step 3: Create a single table with chapter groupings
  const table = document.createElement('table');
  table.className = 'collection-table';
  
  // Create the table header row - this defines our columns
  const tableHeader = document.createElement('thead');
  tableHeader.innerHTML = `
    <tr>
      <th>Image</th>
      <th>Title</th>
      <th>Creator</th>
      <th>Year</th>
      <th>Medium</th>
      <th>Chapter</th>
      <th>Thematic Tag</th>
      <th>Curatorial Note</th>
    </tr>
  `;
  
  // Add the header to the table
  table.appendChild(tableHeader);
  
  // Create table body
  const tableBody = document.createElement('tbody');
  
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
  
  // For each chapter, add a chapter header row and then all entries
  sortedChapters.forEach(chapter => {
    // Chapter header row that spans all columns
    const chapterRow = document.createElement('tr');
    chapterRow.className = 'chapter-row';
    
    // Create the chapter header cell that spans all columns (8 columns)
    const chapterCell = document.createElement('td');
    chapterCell.colSpan = 8;
    chapterCell.className = 'chapter-header';
    chapterCell.innerHTML = `
      <div class="chapter-header-content">
        <span>Chapter ${chapter}</span>
        <span class="return-home" onclick="window.location.href='index.html'">Return Home</span>
      </div>
    `;
    chapterRow.appendChild(chapterCell);
    
    // Add the chapter header row to the table body
    tableBody.appendChild(chapterRow);
    
    // Add each entry for this chapter as a row
    entriesByChapter[chapter].forEach(entry => {
      const entryRow = document.createElement('tr');
      
      // Create image cell with clickable functionality
      const imageCell = document.createElement('td');
      imageCell.className = 'image-cell';
      
      const thumbnail = document.createElement('img');
      thumbnail.src = entry.image;
      thumbnail.alt = entry.title;
      thumbnail.className = 'entry-thumbnail clickable';
      thumbnail.addEventListener('click', () => createImageModal(entry.image, entry.title));
      
      imageCell.appendChild(thumbnail);
      entryRow.appendChild(imageCell);
      
      // Create the rest of the cells
      const titleCell = document.createElement('td');
      titleCell.textContent = entry.title;
      entryRow.appendChild(titleCell);
      
      const creatorCell = document.createElement('td');
      creatorCell.textContent = entry.creator;
      entryRow.appendChild(creatorCell);
      
      const yearCell = document.createElement('td');
      yearCell.textContent = entry.year || 'Unknown';
      entryRow.appendChild(yearCell);
      
      const mediumCell = document.createElement('td');
      mediumCell.innerHTML = processMediaLinks(entry.medium);
      entryRow.appendChild(mediumCell);
      
      const chapterCell = document.createElement('td');
      chapterCell.textContent = entry.chapter;
      entryRow.appendChild(chapterCell);
      
      const tagCell = document.createElement('td');
      tagCell.textContent = entry.thematic_tag;
      entryRow.appendChild(tagCell);
      
      const noteCell = document.createElement('td');
      noteCell.className = 'note-cell';
      noteCell.innerHTML = entry.curatorialNote;
      entryRow.appendChild(noteCell);
      
      // Add the entry row to the table body
      tableBody.appendChild(entryRow);
    });
  });
  
  // Add the table body to the table
  table.appendChild(tableBody);
  
  // Add the completed table to the container
  container.appendChild(table);
  
  // Step 4: Add navigation button to return home
  const homeBtn = document.createElement('button');
  homeBtn.textContent = 'Return to Home';
  homeBtn.id = 'home-btn';
  homeBtn.className = 'navigation-button';
  document.body.appendChild(homeBtn);  // Append to body instead of container

  // Add click handler for navigation
  homeBtn.addEventListener('click', () => {
    // Fade out effect before navigating
    document.body.classList.add('fade-out');
    
    // Wait for animation to complete before changing page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000); // 1 second delay to match CSS transition
  });
});