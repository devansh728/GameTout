import axios from "axios";
import { auth } from "./firebase";
import { getOAuth2Token, clearOAuth2Token } from "./oauth2";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Decode JWT token without verification (for client-side validation only).
 * Do NOT use this for security-critical operations; backend always validates.
 */
function decodeJWT(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Check if JWT token is expired.
 */
function isJWTExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  // exp is in seconds, compare with current time
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}

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
      // Validate token is not expired before sending
      if (isJWTExpired(oauth2Token)) {
        clearOAuth2Token();
        // Continue to Firebase fallback
      } else {
        // Token is valid, use it
        config.headers.Authorization = `Bearer ${oauth2Token}`;
        return config;
      }
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
      // Clear OAuth2 token on unauthorized (token revoked or invalid)
      clearOAuth2Token();
    }
    return Promise.reject(error);
  }
);