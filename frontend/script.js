// Handle form submission
const form = document.getElementById("submission-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const response = await fetch("http://localhost:5000/api/users", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (response.status === 201) {
    alert(result.message);
    form.reset(); // Clear the form fields after submission
    loadUsers(); // Reload users list after submission
  } else {
    alert("Error: " + result.error);
  }
});

// Fetch users and display them
async function loadUsers() {
  const response = await fetch("http://localhost:5000/api/users");
  const users = await response.json();

  const userList = document.getElementById("user-list");
  userList.innerHTML = ""; // Clear the current list

  users.forEach((user) => {
    const userCard = document.createElement("div");
    userCard.classList.add("user-card");

    // Create and append image elements
    user.images.forEach((imgSrc) => {
      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = "User Image";
      img.addEventListener("click", () => openModal(imgSrc)); // Open modal on click
      userCard.appendChild(img);
    });

    userCard.innerHTML += `<h3>${user.name}</h3><p>@${user.socialMediaHandle}</p>`;
    userList.appendChild(userCard);
  });
}

// Open modal to view image in full size
function openModal(imgSrc) {
  const modal = document.getElementById("image-modal");
  const modalImage = document.getElementById("modal-image");

  modal.style.display = "block";
  modalImage.src = imgSrc;
}

// Close modal when the close button is clicked
document.getElementById("close-modal").addEventListener("click", () => {
  const modal = document.getElementById("image-modal");
  modal.style.display = "none";
});

// Load users when the page is loaded
window.onload = loadUsers;
