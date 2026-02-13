import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "@/lib/firebase";
import { api } from "@/lib/api";
import {
  OAuth2Provider,
  openOAuth2Popup,
  storeOAuth2Token,
  getOAuth2Token,
  clearOAuth2Token,
  handleOAuth2Callback,
  getOAuth2Provider,
} from "@/lib/oauth2";

type AuthProviderType = "FIREBASE" | "DISCORD" | "LINKEDIN" | "STEAM";

interface AuthUser {
  id: number;
  email: string;
  role: "USER" | "PREMIUM" | "ADMIN";
  emailVerified: boolean;
  active: boolean;
  subscriptionType: "VIEWER" | "CREATOR" | null;
  authProvider: AuthProviderType;
}

interface AuthContextType {
  user: User | null; 
  dbUser: AuthUser | null; 
  loading: boolean;
  authProvider: AuthProviderType | null;
  isAuthenticated: boolean; // true if logged in via Firebase OR OAuth2
  // Firebase login methods
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  registerWithEmail: (e: string, p: string) => Promise<void>;
  // OAuth2 login methods (Discord, LinkedIn, Steam)
  loginWithDiscord: () => Promise<void>;
  loginWithLinkedIn: () => Promise<void>;
  loginWithSteam: () => Promise<void>;
  // General
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authProvider, setAuthProvider] = useState<AuthProviderType | null>(null);

  const syncWithBackend = useCallback(async () => {
    try {
      console.log("[Auth] Syncing with backend...");
      console.log("[Auth] OAuth2 Token:", getOAuth2Token() ? "present" : "missing");
      const { data } = await api.get<AuthUser>("/auth/me");
      console.log("[Auth] Backend sync success:", data);
      setDbUser(data);
      setAuthProvider(data.authProvider);
    } catch (error) {
      console.error("[Auth] Backend Sync Failed:", error);
      // Clear OAuth2 token if backend rejects
      clearOAuth2Token();
      setDbUser(null);
      setAuthProvider(null);
    }
  }, []);

  // Handle OAuth2 callback on mount
  useEffect(() => {
    // Check for OAuth2 callback (redirect flow)
    const callbackParams = handleOAuth2Callback();
    if (callbackParams?.token) {
      console.log("[Auth] OAuth2 callback detected, syncing...");
      // OAuth2 login successful, sync with backend
      syncWithBackend().then(() => setLoading(false));
      return; // Don't set up Firebase listener
    }

    // Check for existing OAuth2 token
    const oauth2Token = getOAuth2Token();
    if (oauth2Token) {
      console.log("[Auth] Existing OAuth2 token found, syncing...");
      const provider = getOAuth2Provider();
      if (provider) {
        setAuthProvider(provider.toUpperCase() as AuthProviderType);
      }
      syncWithBackend().then(() => setLoading(false));
      return; // Don't set up Firebase listener - we're using OAuth2
    }

    console.log("[Auth] No OAuth2 token, setting up Firebase listener...");
    
    // Firebase auth state listener (only if not using OAuth2)
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Double-check OAuth2 token isn't present (might have been added by popup)
      if (getOAuth2Token()) {
        console.log("[Auth] OAuth2 token detected in Firebase listener, skipping Firebase auth");
        return;
      }
      
      setUser(currentUser);
      
      if (currentUser) {
        setAuthProvider("FIREBASE");
        await syncWithBackend();
      } else {
        setDbUser(null);
        setAuthProvider(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncWithBackend]);

  const refreshUser = useCallback(async () => {
    await syncWithBackend();
  }, [syncWithBackend]);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const loginWithGithub = async () => {
    await signInWithPopup(auth, githubProvider);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  // OAuth2 login methods
  const loginWithOAuth2 = useCallback(async (provider: OAuth2Provider) => {
    try {
      setLoading(true);
      console.log(`[Auth] Starting ${provider} login...`);
      const params = await openOAuth2Popup(provider);
      console.log(`[Auth] Popup returned params:`, params);
      
      if (params.token && params.provider) {
        console.log(`[Auth] Storing token for ${params.provider}...`);
        storeOAuth2Token(params.token, params.provider);
        
        // Verify token was stored
        const storedToken = getOAuth2Token();
        console.log(`[Auth] Token stored: ${storedToken ? 'yes' : 'no'}`);
        
        setAuthProvider(params.provider.toUpperCase() as AuthProviderType);
        await syncWithBackend();
      }
    } catch (error) {
      console.error(`[Auth] ${provider} login failed:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [syncWithBackend]);

  const loginWithDiscord = useCallback(async () => {
    await loginWithOAuth2("discord");
  }, [loginWithOAuth2]);

  const loginWithLinkedIn = useCallback(async () => {
    await loginWithOAuth2("linkedin");
  }, [loginWithOAuth2]);

  const loginWithSteam = useCallback(async () => {
    await loginWithOAuth2("steam");
  }, [loginWithOAuth2]);

  const logout = async () => {
    // Clear OAuth2 token
    clearOAuth2Token();
    
    // Sign out from Firebase if logged in via Firebase
    if (user) {
      await signOut(auth);
    }
    
    setDbUser(null);
    setUser(null);
    setAuthProvider(null);
  };

  // User is authenticated if either Firebase user exists OR OAuth2 dbUser exists
  const isAuthenticated = !!(user || dbUser);

  return (
    <AuthContext.Provider value={{ 
      user, 
      dbUser, 
      loading,
      authProvider,
      isAuthenticated,
      loginWithGoogle, 
      loginWithGithub,
      loginWithEmail,
      registerWithEmail,
      loginWithDiscord,
      loginWithLinkedIn,
      loginWithSteam,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};