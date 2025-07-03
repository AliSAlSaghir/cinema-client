const userId = localStorage.getItem("user_id");

async function loadUserData() {
  if (!userId) return;

  try {
    const res = await api.get(`/get_user.php?id=${userId}`);
    const user = res.data.user;

    const form = document.getElementById("profile-form");

    for (const key in user) {
      const input = form.elements[key];
      if (input && user[key] && input.type !== "file") {
        input.value = user[key];
      }
    }

    if (user.profile_picture) {
      document.getElementById(
        "profile-preview"
      ).src = `http://localhost/cinema-server${user.profile_picture}`;
    }
  } catch (err) {
    console.error("Failed to load user:", err);
  }
}

document.getElementById("profile-form").addEventListener("submit", async e => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  formData.append("id", userId);

  try {
    const res = await axios.post(
      "http://localhost/cinema-server/controllers/update_user.php",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("Profile updated successfully!");
    location.reload();
  } catch (err) {
    console.error(err);
    alert(
      "Update failed: " + (err.response?.data?.error || "Unexpected error.")
    );
  }
});

function logoutUser() {
  localStorage.removeItem("user_id");
  window.location.href = "/index.html";
}

loadUserData();
