import axios from "axios";
import Cookies from "js-cookie";

// Creates an Axios instance with base URL and default headers
const api = axios.create({
  baseURL: "44.204.152.96",
  headers: {
    "Content-Type": "application/json",
  },
});

// Adds a request interceptor to attach the token if it exists
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
