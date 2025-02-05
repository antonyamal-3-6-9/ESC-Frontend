import axios from "axios";
import { dispatchAlert } from "./apiHelper"
const BASE_URL = "http://127.0.0.1:8000/";

// ✅ **Public API (No Authentication Needed)**
export const PublicAPI = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Ensures cookies (e.g., CSRF token) are sent
});

// ✅ **Authenticated API (Handles Token Management)**
export const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send cookies
});

// 🔹 **Attach Access Token to Requests**
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// 🔹 **Global Error Handling for Both APIs**
const handleErrorResponse = (error: any) => {
  if (!error.response) {
    console.error("Network error: Unable to connect to server.");
    dispatchAlert("Network error. Please check your internet connection.", "error");
    return Promise.reject({ message: "Network error" });
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      console.error("Bad Request:", data);
      dispatchAlert("Bad request: " + (data?.message || "Invalid input."), "error");
      break;
    case 401:
      console.error("Unauthorized:", data);
      dispatchAlert("Unauthorized. Please log in again.", "error");
      break;
    case 403:
      console.error("Forbidden:", data);
      dispatchAlert("You don't have permission to perform this action.", "error");
      break;
    case 404:
      console.error("Not Found:", data);
      dispatchAlert("Requested resource not found.", "error");
      break;
    case 500:
      console.error("Server Error:", data);
      dispatchAlert("Internal server error. Please try again later.", "error");
      break;
    default:
      console.error("Unexpected Error:", data);
      dispatchAlert("An unexpected error occurred.", "error");
  }

  return Promise.reject(error);
};

// 🔹 **Apply Global Error Handling to Both Instances**
PublicAPI.interceptors.response.use(
  (response) => response,
  (error) => handleErrorResponse(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        console.warn("Access token expired. Attempting refresh...");

        // Request new access token
        const refreshResponse = await PublicAPI.post(
          "auth/token/update/",
          {},
          { withCredentials: true }
        );

        // Store new token
        localStorage.setItem("accessToken", refreshResponse.data.access_token);
        API.defaults.headers.common["Authorization"] = `Bearer ${refreshResponse.data.access_token}`;

        // Retry the original request
        return API(error.config);
      } catch (refreshError) {
        alert(error)
        console.error("Session expired. Redirecting to login...");
        dispatchAlert("Session expired. Please log in again.", "error");
        window.location.href = "/trader/login/"; // Redirect user
      }
    }
    return handleErrorResponse(error);
  }
);
