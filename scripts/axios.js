axios.create({
  baseURL: "http://localhost/cinema-server/controllers",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
