document.getElementById("login-form").addEventListener("submit", async e => {
  e.preventDefault();

  const identifier = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await api.post("/login", { identifier, password });

    const userId = res.data.user?.id;

    if (!userId) {
      throw new Error("Login response missing user ID.");
    }

    localStorage.setItem("user_id", userId);

    window.location.href = "/pages/movies.html";
  } catch (err) {
    console.error("Login error:", err);
    alert(
      "Login failed: " + (err.response?.data?.message || "Unexpected error.")
    );
  }
});
