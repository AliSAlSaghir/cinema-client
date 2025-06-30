const api = axios.create({
  baseURL: "http://localhost/cinema_server/controllers",
  headers: {
    "Content-Type": "application/json",
  },
});
