import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { storeOAuth2Token } from "@/lib/oauth2";

/**
 * OAuth2 Callback page - handles redirect from OAuth2 providers.
 * This page receives the token from the backend and stores it.
 */
export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const provider = searchParams.get("provider");
    const error = searchParams.get("error");
    const newUser = searchParams.get("newUser") === "true";

    if (error) {
      setStatus("error");
      setMessage(decodeURIComponent(error));
      
      // Redirect to login after showing error
      setTimeout(() => {
        navigate("/login", { state: { error: decodeURIComponent(error) } });
      }, 3000);
      return;
    }

    if (token && provider) {
      // Store the token
      storeOAuth2Token(token, provider);
      
      setStatus("success");
      setMessage(`Successfully logged in with ${provider}`);

      // If this is a popup, notify parent and close
      if (window.opener) {
        // Send message to parent window with auth result
        try {
          window.opener.postMessage({
            type: "OAUTH2_CALLBACK",
            token,
            provider,
            userId: searchParams.get("userId"),
            newUser,
          }, window.location.origin);
        } catch (e) {
          // postMessage failed - parent may have closed
        }
        
        // Close popup after a short delay
        setTimeout(() => {
          window.close();
        }, 500);
        return;
      }

      // Redirect to appropriate page
      setTimeout(() => {
        if (newUser) {
          navigate("/onboarding", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 1500);
    } else {
      setStatus("error");
      setMessage("Invalid callback - missing token or provider");
      
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
      <div className="text-center p-8 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] max-w-md w-full mx-4">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFAB00] mx-auto mb-4" />
            <p className="text-gray-400">Processing authentication...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-400 font-medium">{message}</p>
            <p className="text-gray-500 text-sm mt-2">Redirecting...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-400 font-medium">Authentication Failed</p>
            <p className="text-gray-500 text-sm mt-2">{message}</p>
            <p className="text-gray-600 text-xs mt-4">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  );
}
