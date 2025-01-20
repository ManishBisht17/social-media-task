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

    const images = user.images.map((imgSrc) => {
      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = "User Image";
      img.addEventListener("click", () => {
        const modal = document.createElement("div");
        modal.classList.add("modal");
        const modalImage = document.createElement("img");
        modalImage.src = imgSrc;
        modal.appendChild(modalImage);
        document.body.appendChild(modal);

        modal.addEventListener("click", () => {
          modal.remove(); // Close the modal when clicked
        });
      });
      return img;
    });

    userCard.appendChild(...images);
    userCard.innerHTML += `<h3>${user.name}</h3><p>@${user.socialMediaHandle}</p>`;
    userList.appendChild(userCard);
  });
}

// Load users when the page is loaded
window.onload = loadUsers;
