const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");
const container = document.getElementById("movie-container");

async function loadMovie() {
  if (!movieId) {
    container.innerHTML = "<p>Movie ID not found.</p>";
    return;
  }

  try {
    const res = await api.get(`/get_movies?id=${movieId}`);
    const movie = res.data.movie;

    const genres = movie.genres.map(g => g.name).join(", ");
    const showtimes = movie.showtimes.length
      ? movie.showtimes
          .map(
            st => `
          <a href="/pages/movie-booking.html?showtime_id=${
            st.id
          }" class="showtime">
            ${st.show_date} @ ${st.show_time.slice(0, 5)}
          </a>
        `
          )
          .join("")
      : '<span class="no-showtimes">No showtimes available</span>';

    container.innerHTML = `
      <div class="movie-detail">
        <img src="${baseURL}${movie.poster}" class="movie-detail-poster" />
        <div class="movie-detail-info">
          <h2>${movie.title}</h2>
          <p class="movie-genre">${genres}</p>
          <p class="movie-meta">Released: ${movie.release_date} • Duration: ${movie.duration_minutes} min • Rating: ${movie.rating}</p>
          <p class="movie-description">${movie.description}</p>
          <div class="showtimes-section">
            <h3>Available Showtimes</h3>
            <div class="showtimes">${showtimes}</div>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Failed to load movie:", err);
    container.innerHTML = "<p>Error loading movie.</p>";
  }
}

loadMovie();
