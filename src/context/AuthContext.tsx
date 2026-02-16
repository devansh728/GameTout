import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";
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
  isOAuth2Authenticated,
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
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  registerWithEmail: (e: string, p: string) => Promise<void>;
  loginWithDiscord: () => Promise<void>;
  loginWithLinkedIn: () => Promise<void>;
  loginWithSteam: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authProvider, setAuthProvider] = useState<AuthProviderType | null>(null);
  
  // Use ref to track if we've already initialized
  const initialized = useRef(false);

  const syncWithBackend = useCallback(async () => {
    try {
      const { data } = await api.get<AuthUser>("/auth/me");
      setDbUser(data);
      setAuthProvider(data.authProvider);
      return true;
    } catch (error) {
      console.error("Backend sync failed:", error);
      // Clear OAuth2 token if backend rejects
      clearOAuth2Token();
      setDbUser(null);
      setAuthProvider(null);
      return false;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        // Step 1: Check for OAuth2 token (Discord, LinkedIn, Steam)
        const oauth2Token = getOAuth2Token();
        const oauth2Provider = getOAuth2Provider();
        
        if (oauth2Token && oauth2Provider) {
          console.log("Found OAuth2 token, syncing with backend...");
          setAuthProvider(oauth2Provider.toUpperCase() as AuthProviderType);
          
          const success = await syncWithBackend();
          if (success) {
            setLoading(false);
            return; // OAuth2 auth successful, don't set up Firebase listener
          }
          // If sync failed, clear token and fall through to Firebase
          clearOAuth2Token();
        }

        // Step 2: Check for OAuth2 callback (redirect flow)
        const callbackParams = handleOAuth2Callback();
        if (callbackParams?.token) {
          console.log("OAuth2 callback detected, token stored");
          setAuthProvider(callbackParams.provider?.toUpperCase() as AuthProviderType);
          await syncWithBackend();
          setLoading(false);
          return; // OAuth2 callback handled
        }

        // Step 3: Fallback to Firebase auth
        console.log("No OAuth2 token, setting up Firebase listener");
        
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          // Double-check OAuth2 token wasn't set during Firebase listener setup
          if (isOAuth2Authenticated()) {
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
      } catch (error) {
        console.error("Auth initialization error:", error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, [syncWithBackend]); // Only runs once due to initialized ref

  const refreshUser = useCallback(async () => {
    await syncWithBackend();
  }, [syncWithBackend]);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGithub = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, githubProvider);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } finally {
      setLoading(false);
    }
  };

  const loginWithOAuth2 = useCallback(async (provider: OAuth2Provider) => {
    setLoading(true);
    try {
      const params = await openOAuth2Popup(provider);
      
      if (params.token && params.provider) {
        storeOAuth2Token(params.token, params.provider);
        setAuthProvider(params.provider.toUpperCase() as AuthProviderType);
        await syncWithBackend();
      }
    } catch (error) {
      console.error(`${provider} login failed:`, error);
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
    setLoading(true);
    try {
      // Step 1: Call backend logout API to revoke all tokens
      try {
        await api.post("/auth/logout");
      } catch (error) {
        console.error("Backend logout failed:", error);
      }
    } finally {
      // Step 2: Clear OAuth2 token from localStorage
      clearOAuth2Token();
      
      // Step 3: Sign out from Firebase if logged in via Firebase
      if (user) {
        try {
          await signOut(auth);
        } catch (error) {
          console.error("Firebase signOut failed:", error);
        }
      }
      
      // Step 4: Clear all auth state
      setDbUser(null);
      setUser(null);
      setAuthProvider(null);
      setLoading(false);
    }
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