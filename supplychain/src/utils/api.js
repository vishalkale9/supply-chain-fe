import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle global errors (like expired tokens)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If the backend says the token is invalid or expired (401 Unauthorized),
      // we can automatically log the user out here.
      console.error("Unauthorized! Token may be expired.");
      localStorage.removeItem("token");
      // Optionally redirect to login page here
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
export default apiClient;
