async function loadMovies() {
  const container = document.getElementById("movies-list");

  try {
    const res = await api.get("/get_movies.php");
    const movies = res.data.movies;

    if (!movies.length) {
      container.innerHTML = "<p>No movies available.</p>";
      return;
    }

    movies.forEach(movie => {
      const genres = movie.genres.map(g => g.name).join(", ");
      const showtimesHTML = movie.showtimes.length
        ? movie.showtimes
            .map(st => {
              return `<a class="showtime-link" href="/pages/movie-booking.html?showtime_id=${
                st.id
              }">
              ${st.show_date} @ ${st.show_time.slice(0, 5)}
            </a>`;
            })
            .join("")
        : '<span style="color:#888">No showtimes</span>';

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

loadUserProfile();

loadMovies();
