const api = axios.create({
  baseURL: "http://localhost/cinema-server/controllers",
  headers: {
    "Content-Type": "application/json",
  },
});
