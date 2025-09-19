import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true, // send/receive the JWT cookie
});

export default api;
