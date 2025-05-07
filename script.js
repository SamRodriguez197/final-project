document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const video = document.getElementById('bg-video');
    const btn = document.getElementById('unmask-btn');
    
    // Initially hide the button (it will be shown when video ends)
    btn.style.display = 'none';
    
    // Show button after 6 seconds with fade effect
    setTimeout(() => {
        btn.style.display = 'block';
        btn.classList.add('fade-in');
    }, 7000);
    
    // Add reverse playback functionality
    let isReversing = false;
    
    // Listen for the video's timeupdate event to detect when it's near the end
    // You might need to adjust this value based on your video length
    video.addEventListener('timeupdate', () => {
      // If the video is near the end (5 seconds from the end)
      // Note: video.duration gives the total length of the video
      if (video.currentTime >= (video.duration - 0.5) && !isReversing) {
        isReversing = true;
        video.playbackRate = -1;
        video.currentTime = video.duration;
      } else if (video.currentTime <= 0.5 && isReversing) {
        isReversing = false;
        video.playbackRate = 1;
      }
      
      if (video.currentTime >= (video.duration - 5)) {
        // Show the button
        btn.style.display = 'block';
        
        // Add fade-in effect
        btn.classList.add('fade-in');
      }
    });
    
    // Alternative: If you want to show the button after the video ends completely
    video.addEventListener('ended', () => {
      btn.style.display = 'block';
      btn.classList.add('fade-in');
    });
    
    // When the unmask button is clicked
    btn.addEventListener('click', () => {
      // Add fade-out effect to the entire body
      document.body.classList.add('fade-out');
      
      // Wait for fade-out animation to complete before navigating to next page
      setTimeout(() => {
        window.location.href = 'feature.html'; // Navigate to the feature page
      }, 1000); // 1000ms = 1 second (should match your CSS transition time)
    });

    // Force video to loop smoothly
    video.addEventListener('timeupdate', () => {
      if (video.currentTime >= video.duration - 0.1) {
        video.currentTime = 0;
      }
    });
  });

 
 //Creates a clickable image mod
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

// Attach modal functionality to all images on the page
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    img.classList.add('clickable'); // Add a class for styling if needed
    img.addEventListener('click', () => createImageModal(img.src, img.alt));
  });
});



//Convert URLs in text to clickable links
function convertUrlsToLinks(text) {
  if (!text) return '';
  
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Replace URLs with anchor tags
  return text.replace(urlRegex, url => `<a href="${url}" target="_blank" class="content-link">${url}</a>`);
}

// Update the table row creation code where we create cells:
// ...existing code...
const noteCell = document.createElement('td');
noteCell.className = 'note-cell';
noteCell.innerHTML = convertUrlsToLinks(entry.curatorialNote);
entryRow.appendChild(noteCell);

const mediumCell = document.createElement('td');
mediumCell.innerHTML = convertUrlsToLinks(entry.medium);
entryRow.appendChild(mediumCell);