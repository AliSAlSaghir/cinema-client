document
  .getElementById("auditorium-form")
  .addEventListener("submit", async e => {
    e.preventDefault();

    const userId = localStorage.getItem("user_id");
    if (!userId) return alert("Unauthorized: Admin not logged in");

    const payload = {
      user_id: parseInt(userId),
      name: document.getElementById("aud-name").value.trim(),
      seat_rows: parseInt(document.getElementById("aud-rows").value),
      seats_per_row: parseInt(document.getElementById("aud-cols").value),
    };

    try {
      const res = await api.post("/create_auditorium.php", payload);
      alert("Auditorium created successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to create auditorium");
    }
  });

// Coupon Form Handler
document.getElementById("coupon-form").addEventListener("submit", async e => {
  e.preventDefault();

  const userId = localStorage.getItem("user_id");
  if (!userId) return alert("Unauthorized: Admin not logged in");

  const payload = {
    user_id: parseInt(userId),
    code: document.getElementById("coupon-code").value.trim(),
    discount_percentage: parseInt(
      document.getElementById("coupon-discount").value
    ),
    expires_at: document.getElementById("coupon-expiry").value || null,
    is_active: document.getElementById("coupon-active").checked,
  };

  try {
    const res = await api.post("/create_coupon.php", payload);
    alert("Coupon created successfully!");
  } catch (err) {
    alert(err.response?.data?.error || "Failed to create coupon");
  }
});

document.getElementById("genre-form").addEventListener("submit", async e => {
  e.preventDefault();

  const userId = localStorage.getItem("user_id");
  if (!userId) return alert("Unauthorized: Admin not logged in");

  const payload = {
    user_id: parseInt(userId),
    name: document.getElementById("genre-name").value.trim(),
  };

  try {
    console.log(payload);
    const res = await api.post("/create_genre.php", payload);
    alert("Genre created successfully!");
  } catch (err) {
    alert(err.response?.data?.error || "Failed to create genre");
  }
});

async function loadGenres() {
  try {
    const res = await api.get("/get_genres.php"); // or whatever your endpoint is
    const genres = res.data.genres || [];
    const select = document.getElementById("movie-genres");

    genres.forEach(genre => {
      const option = document.createElement("option");
      option.value = genre.id;
      option.textContent = genre.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load genres:", err);
  }
}

document.getElementById("movie-form").addEventListener("submit", async e => {
  e.preventDefault();

  const userId = localStorage.getItem("user_id");
  if (!userId) return alert("Unauthorized: Admin not logged in");

  const form = e.target;
  const formData = new FormData(form);

  formData.append("user_id", userId);

  const genreSelect = document.getElementById("movie-genres");
  const selectedGenres = [...genreSelect.selectedOptions].map(opt => opt.value);

  formData.set("genre_ids", JSON.stringify(selectedGenres));

  try {
    const res = await api.post("/create_movie.php", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Movie created successfully!");
    form.reset();
  } catch (err) {
    alert(err.response?.data?.error || "Failed to create movie");
  }
});

loadGenres();

async function loadMoviesForShowtime() {
  try {
    const res = await api.get("/get_movies.php");
    const movies = res.data.movies || [];
    const select = document.getElementById("showtime-movie");

    movies.forEach(movie => {
      const option = document.createElement("option");
      option.value = movie.id;
      option.textContent = movie.title;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load movies for showtime:", err);
  }
}

async function loadAuditoriumsForShowtime() {
  try {
    const res = await api.get("/get_auditoriums.php");
    const auditoriums = res.data.auditoriums || [];
    const select = document.getElementById("showtime-auditorium");

    auditoriums.forEach(aud => {
      const option = document.createElement("option");
      option.value = aud.id;
      option.textContent = aud.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load auditoriums:", err);
  }
}

document.getElementById("showtime-form").addEventListener("submit", async e => {
  e.preventDefault();

  const userId = localStorage.getItem("user_id");
  if (!userId) return alert("Unauthorized: Admin not logged in");

  const data = {
    user_id: userId,
    movie_id: e.target.movie_id.value,
    auditorium_id: e.target.auditorium_id.value,
    show_date: e.target.show_date.value,
    show_time: e.target.show_time.value,
  };

  try {
    const res = await api.post("/create_showtime.php", data);
    alert("Showtime created successfully!");
    e.target.reset();
  } catch (err) {
    alert(err.response?.data?.error || "Failed to create showtime");
  }
});

document.getElementById("snack-form").addEventListener("submit", async e => {
  e.preventDefault();

  const userId = localStorage.getItem("user_id");
  if (!userId) return alert("Unauthorized: Admin not logged in");

  const formData = new FormData(e.target);
  formData.append("user_id", userId);

  try {
    const res = await api.post("/create_snack.php", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Snack created successfully!");
    e.target.reset();
  } catch (err) {
    alert(err.response?.data?.error || "Failed to create snack");
  }
});

loadMoviesForShowtime();
loadAuditoriumsForShowtime();
