import axios from "axios";

const baseURL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL,
});

// Interceptor to add the token to requests automatically
axiosInstance.interceptors.request.use(
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

export default axiosInstance;
