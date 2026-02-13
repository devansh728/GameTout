/**
 * OAuth2 utility functions for Discord, LinkedIn, and Steam authentication.
 * These providers are handled by the backend, not Firebase.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type OAuth2Provider = "discord" | "linkedin" | "steam";

export interface OAuth2TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  email: string;
  role: string;
  provider: string;
  newUser: boolean;
}

export interface OAuth2CallbackParams {
  token?: string;
  provider?: string;
  userId?: string;
  newUser?: string;
  error?: string;
}

// Storage key for OAuth2 tokens
const OAUTH2_TOKEN_KEY = "gametout_oauth2_token";
const OAUTH2_PROVIDER_KEY = "gametout_oauth2_provider";

/**
 * Open OAuth2 login popup window.
 */
export function openOAuth2Popup(provider: OAuth2Provider): Promise<OAuth2CallbackParams> {
  return new Promise((resolve, reject) => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `${API_BASE_URL}/oauth2/login/${provider}`,
      `${provider}Login`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    );

    if (!popup) {
      reject(new Error("Popup blocked. Please allow popups for this site."));
      return;
    }

    let resolved = false;

    // Listen for postMessage from popup (works cross-origin)
    const messageHandler = (event: MessageEvent) => {
      console.log("[OAuth2] Received message:", event.data, "from origin:", event.origin);
      
      // Verify origin
      if (event.origin !== window.location.origin) {
        console.log("[OAuth2] Ignoring message from different origin");
        return;
      }
      
      if (event.data?.type === "OAUTH2_CALLBACK") {
        console.log("[OAuth2] Processing OAUTH2_CALLBACK message");
        resolved = true;
        window.removeEventListener("message", messageHandler);
        clearInterval(checkInterval);
        
        const params: OAuth2CallbackParams = {
          token: event.data.token,
          provider: event.data.provider,
          userId: event.data.userId,
          newUser: event.data.newUser ? "true" : "false",
          error: event.data.error,
        };
        
        console.log("[OAuth2] Parsed params:", { ...params, token: params.token ? "***" : undefined });
        
        if (params.error) {
          reject(new Error(params.error));
        } else if (params.token) {
          resolve(params);
        } else {
          reject(new Error("No token received"));
        }
      }
    };
    
    window.addEventListener("message", messageHandler);

    // Poll for popup close or callback (fallback)
    const checkInterval = setInterval(() => {
      if (resolved) {
        console.log("[OAuth2] Already resolved, stopping poll");
        clearInterval(checkInterval);
        return;
      }
      
      try {
        // Check if popup was closed
        if (popup.closed) {
          console.log("[OAuth2] Popup closed, resolved:", resolved);
          clearInterval(checkInterval);
          window.removeEventListener("message", messageHandler);
          if (!resolved) {
            reject(new Error("Login cancelled"));
          }
          return;
        }

        // Check if popup navigated to callback URL (same-origin only)
        const currentUrl = popup.location.href;
        if (currentUrl.includes("/auth/callback")) {
          clearInterval(checkInterval);
          window.removeEventListener("message", messageHandler);
          resolved = true;
          
          // Parse callback parameters
          const url = new URL(currentUrl);
          const params: OAuth2CallbackParams = {
            token: url.searchParams.get("token") || undefined,
            provider: url.searchParams.get("provider") || undefined,
            userId: url.searchParams.get("userId") || undefined,
            newUser: url.searchParams.get("newUser") || undefined,
            error: url.searchParams.get("error") || undefined,
          };

          popup.close();

          if (params.error) {
            reject(new Error(params.error));
          } else if (params.token) {
            resolve(params);
          } else {
            reject(new Error("No token received"));
          }
        }
      } catch {
        // Cross-origin error - popup is still on provider's domain
        // Continue polling and rely on postMessage
      }
    }, 500);

    // Timeout after 5 minutes
    setTimeout(() => {
      if (resolved) return;
      clearInterval(checkInterval);
      window.removeEventListener("message", messageHandler);
      if (!popup.closed) {
        popup.close();
      }
      reject(new Error("Login timeout"));
    }, 5 * 60 * 1000);
  });
}

/**
 * Redirect-based OAuth2 login (for mobile or when popups are blocked).
 */
export function redirectToOAuth2Login(provider: OAuth2Provider): void {
  // Store current URL for redirect back
  sessionStorage.setItem("oauth2_redirect_url", window.location.href);
  window.location.href = `${API_BASE_URL}/oauth2/login/${provider}`;
}

/**
 * Store OAuth2 token in localStorage.
 */
export function storeOAuth2Token(token: string, provider: string): void {
  localStorage.setItem(OAUTH2_TOKEN_KEY, token);
  localStorage.setItem(OAUTH2_PROVIDER_KEY, provider);
}

/**
 * Get stored OAuth2 token.
 */
export function getOAuth2Token(): string | null {
  return localStorage.getItem(OAUTH2_TOKEN_KEY);
}

/**
 * Get stored OAuth2 provider.
 */
export function getOAuth2Provider(): string | null {
  return localStorage.getItem(OAUTH2_PROVIDER_KEY);
}

/**
 * Clear OAuth2 token from storage.
 */
export function clearOAuth2Token(): void {
  localStorage.removeItem(OAUTH2_TOKEN_KEY);
  localStorage.removeItem(OAUTH2_PROVIDER_KEY);
}

/**
 * Check if user is authenticated via OAuth2.
 */
export function isOAuth2Authenticated(): boolean {
  return !!getOAuth2Token();
}

/**
 * Parse OAuth2 callback from URL (for redirect-based flow).
 */
export function parseOAuth2Callback(): OAuth2CallbackParams | null {
  const url = new URL(window.location.href);
  
  if (!url.pathname.includes("/auth/callback")) {
    return null;
  }

  return {
    token: url.searchParams.get("token") || undefined,
    provider: url.searchParams.get("provider") || undefined,
    userId: url.searchParams.get("userId") || undefined,
    newUser: url.searchParams.get("newUser") || undefined,
    error: url.searchParams.get("error") || undefined,
  };
}

/**
 * Handle OAuth2 callback and store token.
 */
export function handleOAuth2Callback(): OAuth2CallbackParams | null {
  const params = parseOAuth2Callback();
  
  if (!params) {
    return null;
  }

  if (params.token && params.provider) {
    storeOAuth2Token(params.token, params.provider);
  }

  // Clean up URL
  const cleanUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);

  return params;
}

/**
 * Get authorization URL for linking account.
 */
export async function getLinkAccountUrl(provider: OAuth2Provider): Promise<string> {
  const token = getOAuth2Token();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/oauth2/link/${provider}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get link URL");
  }

  const data = await response.json();
  return data.authorizationUrl;
}

/**
 * Unlink an OAuth2 account.
 */
export async function unlinkAccount(provider: OAuth2Provider): Promise<void> {
  const token = getOAuth2Token();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/oauth2/unlink/${provider}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to unlink account");
  }
}

/**
 * Get linked OAuth2 accounts.
 */
export interface LinkedAccount {
  id: number;
  provider: OAuth2Provider;
  providerUsername: string;
  providerEmail: string;
  avatarUrl: string;
  linkedAt: string;
}

export async function getLinkedAccounts(): Promise<LinkedAccount[]> {
  const token = getOAuth2Token();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/oauth2/linked-accounts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get linked accounts");
  }

  return response.json();
}
