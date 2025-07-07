document.getElementById("register-form").addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;

  if (!email && !phone) {
    alert("Please enter either an email or a phone number.");
    return;
  }

  try {
    const res = await api.post("/register", {
      name,
      email: email || null,
      phone_number: phone || null,
      password,
    });

    const userId = res.data.user_id;

    if (!userId) {
      throw new Error("Missing user_id in response.");
    }

    localStorage.setItem("user_id", userId);

    window.location.href = "/pages/movies.html";
  } catch (err) {
    console.error(err);
    alert(
      "Registration failed: " +
        (err.response?.data?.message || "Unexpected error.")
    );
  }
});
