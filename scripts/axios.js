const baseURL = "http://localhost/cinema-server";
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
