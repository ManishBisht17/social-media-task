// Global error handler for fetch requests

const API_URL = 'https://your-backend-service-name.onrender.com';

// Update all fetch calls to use API_URL
const response = await fetch(`${API_URL}/api/users`, {
  method: "POST",
  body: formData,
});

// Update the loadUsers function
async function loadUsers() {
  const response = await fetch(`${API_URL}/api/users`);
  // ... rest of the function
}
async function handleFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { response, data };
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error('Network error occurred. Please try again.');
  }
}

// Handle form submission
const form = document.getElementById("submission-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  try {
    const formData = new FormData(form);
    
    // Validate form data
    const name = formData.get('name');
    const socialMediaHandle = formData.get('socialMediaHandle');
    const images = formData.getAll('images');
    
    if (!name || !socialMediaHandle) {
      throw new Error('Name and social media handle are required');
    }
    
    if (images.length === 0 || (images.length === 1 && images[0].size === 0)) {
      throw new Error('Please select at least one image');
    }

    const { response, data } = await handleFetch("http://localhost:5000/api/users", {
      method: "POST",
      body: formData,
    });

    if (response.status === 201) {
      alert(data.message);
      form.reset();
      await loadUsers();
    } else {
      throw new Error(data.error || 'Failed to submit form');
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

// Fetch users and display them
async function loadUsers() {
  try {
    const userList = document.getElementById("user-list");
    userList.innerHTML = '<div class="loading">Loading users...</div>';

    const { data: users } = await handleFetch("http://localhost:5000/api/users");

    userList.innerHTML = users.length ? '' : '<div class="no-users">No users found</div>';

    users.forEach((user) => {
      const userCard = document.createElement("div");
      userCard.classList.add("user-card");

      // Add user info
      const userInfo = document.createElement("div");
      userInfo.classList.add("user-info");
      userInfo.innerHTML = `
        <h3>${sanitizeHTML(user.name)}</h3>
        <p>@${sanitizeHTML(user.socialMediaHandle)}</p>
      `;

      // Add image gallery
      const imageGallery = document.createElement("div");
      imageGallery.classList.add("image-gallery");

      user.images.forEach((imgSrc) => {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("image-container");

        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = `${user.name}'s image`;
        img.loading = "lazy"; // Enable lazy loading
        img.addEventListener("click", () => openModal(imgSrc, user.name));

        imgContainer.appendChild(img);
        imageGallery.appendChild(imgContainer);
      });

      userCard.appendChild(userInfo);
      userCard.appendChild(imageGallery);
      userList.appendChild(userCard);
    });
  } catch (error) {
    const userList = document.getElementById("user-list");
    userList.innerHTML = `<div class="error">Error loading users: ${error.message}</div>`;
  }
}

// Sanitize HTML to prevent XSS
function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Modal functionality
function openModal(imgSrc, userName) {
  const modal = document.getElementById("image-modal");
  const modalImage = document.getElementById("modal-image");
  const modalCaption = document.getElementById("modal-caption");

  modalImage.src = imgSrc;
  modalImage.alt = `${userName}'s full size image`;
  modalCaption.textContent = `Image shared by ${userName}`;
  
  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
}

// Close modal functionality
function closeModal() {
  const modal = document.getElementById("image-modal");
  modal.classList.remove("active");
  document.body.style.overflow = ""; // Restore scrolling
}

// Event listeners for modal
document.getElementById("close-modal").addEventListener("click", closeModal);

// Close modal when clicking outside the image
document.getElementById("image-modal").addEventListener("click", (e) => {
  if (e.target.id === "image-modal") {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.getElementById("image-modal").classList.contains("active")) {
    closeModal();
  }
});

// Load users when the page is loaded
window.addEventListener("load", loadUsers);

// Refresh users periodically (every 30 seconds)
setInterval(loadUsers, 30000);