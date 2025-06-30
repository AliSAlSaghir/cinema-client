const searchInput = document.getElementById("search");

async function loadMovies() {
  const container = document.getElementById("movies-list");
  container.innerHTML = "<p>Loading movies...</p>";

  const urlParams = new URLSearchParams(window.location.search);
  const titleFilter = urlParams.get("title");

  try {
    const endpoint = titleFilter
      ? `/get_movies.php?title=${encodeURIComponent(titleFilter)}`
      : `/get_movies.php`;

    const res = await api.get(endpoint);
    const movies = res.data.movies;

    if (!movies.length) {
      container.innerHTML = "<p>No movies found.</p>";
      return;
    }

    container.innerHTML = "";

    movies.forEach(movie => {
      const genres = movie.genres.map(g => g.name).join(", ");
      const movieEl = document.createElement("a");
      movieEl.className = "movie-card";
      movieEl.href = `/pages/movie.html?id=${movie.id}`;
      movieEl.innerHTML = `
        <img src="http://localhost/cinema-server${movie.poster}" alt="${movie.title}" class="movie-poster" />
        <div class="movie-info">
          <div class="movie-title">${movie.title}</div>
          <div class="movie-genres">${genres}</div>
          <div class="movie-description">${movie.description}</div>
        </div>
      `;
      container.appendChild(movieEl);
    });
  } catch (err) {
    console.error("Failed to load movies:", err);
    container.innerHTML = "<p>Error loading movies.</p>";
  }
}

async function loadUserProfile() {
  const userId = localStorage.getItem("user_id");
  if (!userId) return;

  try {
    const res = await api.get(`/get_user.php?id=${userId}`);
    const user = res.data.user;
    console.log(res);

    const avatarEl = document.querySelector("#profile-avatar img");

    if (user.profile_picture) {
      avatarEl.src = `http://localhost/cinema-server/${user.profile_picture}`;
    }
  } catch (err) {
    console.error("Failed to load user profile picture:", err);
  }
}

searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const title = searchInput.value.trim();
    window.location.href = `/pages/movies.html?title=${encodeURIComponent(
      title
    )}`;
  }
});

loadUserProfile();

loadMovies();
