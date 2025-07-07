const authButtonsEl = document.getElementById("auth-buttons");
const userId = localStorage.getItem("user_id");
const searchInput = document.querySelector(".search-input");

async function renderAuthButtons() {
  if (userId) {
    try {
      const res = await api.get(`/get_users?id=${userId}`);
      const user = res.data.user;
      const profilePicUrl = user.profile_picture
        ? `${baseURL}${user.profile_picture}`
        : `${baseURL}/uploads/profile_pictures/default-avatar.jpeg`;

      authButtonsEl.innerHTML = `
        <a href="/pages/profile.html" class="profile-link">
          <img src="${profilePicUrl}" alt="Profile" class="avatar" />
        </a>
        <button class="btn btn-outline" id="logout-btn">Logout</button>
      `;

      document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.clear();
        location.reload();
      });
    } catch (err) {
      console.error("Failed to fetch user:", err);
      showGuestButtons();
    }
  } else {
    showGuestButtons();
  }
}

function showGuestButtons() {
  authButtonsEl.innerHTML = `
    <a href="/pages/login.html" class="btn">Login</a>
    <a href="/pages/register.html" class="btn btn-outline">Register</a>
  `;
}

async function loadNowShowing() {
  try {
    const res = await api.get("/get_movies");

    const movies = res.data.movies.slice(0, 4);

    const grid = document.getElementById("now-showing-movies");
    grid.innerHTML = movies
      .map(
        movie => `
      <a href="/pages/movie.html?id=${movie.id}" class="movie-card">
        <img src="${baseURL}${movie.poster}" alt="${movie.title}" />
        <h4>${movie.title}</h4>
      </a>
    `
      )
      .join("");
  } catch (err) {
    console.error("Failed to load movies:", err);
  }
}

searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const title = searchInput.value.trim();
    if (title) {
      window.location.href = `/pages/movies.html?title=${encodeURIComponent(
        title
      )}`;
    }
  }
});

loadNowShowing();

renderAuthButtons();
