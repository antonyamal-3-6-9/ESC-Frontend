import axios from "axios";

const API = axios.create({
  baseURL: "https://your-backend.com/api",
  withCredentials: true, // Send cookies
});

// Interceptor for auto-refreshing tokens
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      try {
        const refreshResponse = await axios.post("/auth/refresh/", {}, { withCredentials: true });

        localStorage.setItem("accessToken", refreshResponse.data.access_token);
        API.defaults.headers.common["Authorization"] = `Bearer ${refreshResponse.data.access_token}`;

        return API(error.config);
      } catch (refreshError) {
        console.error("Session expired. Redirecting to login...");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
