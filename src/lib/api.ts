import axios from "axios";
import { auth } from "./firebase";
import { getOAuth2Token, clearOAuth2Token } from "./oauth2";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    // First, check for OAuth2 token (Discord, LinkedIn, Steam)
    const oauth2Token = getOAuth2Token();
    if (oauth2Token) {
      config.headers.Authorization = `Bearer ${oauth2Token}`;
      return config;
    }

    // Fallback to Firebase token (Google, GitHub)
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - Redirecting to login");
      // Clear OAuth2 token on unauthorized
      clearOAuth2Token();
    }
    return Promise.reject(error);
  }
);