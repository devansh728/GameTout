import { useState, useEffect, useCallback } from "react";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

/**
 * Hook to dynamically load Razorpay Checkout script
 * 
 * @returns Object with loaded state and error
 * 
 * @example
 * const { isLoaded, error } = useRazorpay();
 * 
 * if (isLoaded && window.Razorpay) {
 *   const rzp = new window.Razorpay(options);
 *   rzp.open();
 * }
 */
export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if already loaded
    if (window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => setIsLoaded(true));
      existingScript.addEventListener("error", () => setError("Failed to load Razorpay SDK"));
      return;
    }

    // Create and load script
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
      console.log("[Razorpay] SDK loaded successfully");
    };

    script.onerror = () => {
      setError("Failed to load Razorpay SDK");
      console.error("[Razorpay] Failed to load SDK");
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup is optional - we usually want to keep the script loaded
    };
  }, []);

  return { isLoaded, error };
}

/**
 * Imperatively load Razorpay script (useful outside React components)
 * @returns Promise that resolves when script is loaded
 */
export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Razorpay SDK")));
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

export default useRazorpay;
