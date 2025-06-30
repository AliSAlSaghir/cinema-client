const authButtonsEl = document.getElementById("auth-buttons");
const userId = localStorage.getItem("user_id");

async function renderAuthButtons() {
  if (userId) {
    try {
      const res = await axios.get(
        `http://localhost/cinema_server/controllers/get_user.php?id=${userId}`
      );
      const user = res.data.user;
      const profilePicUrl =
        user.profile_picture || "/assets/default-avatar.png";

      authButtonsEl.innerHTML = `
        <a href="/pages/profile.html" class="profile-link">
          <img src="http://localhost/cinema_server${profilePicUrl}" alt="Profile" class="avatar" />
        </a>
        <button class="btn btn-outline" id="logout-btn">Logout</button>
      `;

      document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.clear();
        location.reload();
      });
    } catch (err) {
      console.error("Failed to fetch user:", err);
      showGuestButtons(); // fallback to login/register if user fetch fails
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
    const res = await axios.get(
      "http://localhost/cinema_server/controllers/get_movies.php"
    );
    const movies = res.data.movies.slice(0, 4); // Show only 4

    const grid = document.getElementById("now-showing-movies");
    grid.innerHTML = movies
      .map(
        movie => `
      <a href="/pages/movie.html?id=${movie.id}" class="movie-card">
        <img src="http://localhost/cinema_server${movie.poster}" alt="${movie.title}" />
        <h4>${movie.title}</h4>
      </a>
    `
      )
      .join("");
  } catch (err) {
    console.error("Failed to load movies:", err);
  }
}

loadNowShowing();

renderAuthButtons();
