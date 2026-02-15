import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Check, Zap, Shield, Star, Sparkles, CreditCard, Lock, AlertCircle, Calendar } from "lucide-react";
import { useRazorpay } from "@/hooks/useRazorpay";
import { paymentService, PaymentOrderResponse } from "@/services/paymentService";
import { useAuth } from "@/context/AuthContext";
import type { RazorpayPaymentResponse } from "@/types/razorpay";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (plan: "viewer" | "creator") => void;
  /** Enable demo mode (simulated payment, no real Razorpay) */
  demoMode?: boolean;
}

const plans = [
  {
    id: "viewer" as const,
    backendType: "VIEWER" as const,
    name: "Elite Viewer",
    price: "₹499",
    priceValue: 499,
    period: "year",
    description: "Unlock full access to all developer profiles",
    icon: Shield,
    features: [
      "View complete skill breakdowns",
      "Access contact information",
      "See experience & rate details",
      "Download resumes",
      "1 Year access",
    ],
    color: "#FFAB00",
    popular: false,
  },
  {
    id: "creator" as const,
    backendType: "CREATOR" as const,
    name: "Elite Creator",
    price: "₹1,499",
    priceValue: 1499,
    period: "year",
    description: "Get featured with premium profile display",
    icon: Crown,
    features: [
      "All Viewer benefits included",
      "Large premium profile card",
      "Fire animation border effect",
      "Priority placement in search",
      "Featured in Elite section",
      "Profile analytics dashboard",
    ],
    color: "#FFD700",
    popular: true,
  },
];

export const PricingModal = ({
  isOpen,
  onClose,
  onSelectPlan,
  demoMode = false,
}: PricingModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<"viewer" | "creator" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "creating" | "pending" | "success" | "failed">("idle");
  
  const { isLoaded: razorpayLoaded, error: razorpayError } = useRazorpay();
  const { isAuthenticated, dbUser } = useAuth();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPlan(null);
      setIsProcessing(false);
      setError(null);
      setPaymentStatus("idle");
    }
  }, [isOpen]);

  /**
   * Handle demo mode payment (simulated)
   */
  const handleDemoPayment = async (planId: "viewer" | "creator") => {
    setIsProcessing(true);
    setPaymentStatus("pending");
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setPaymentStatus("success");
    setIsProcessing(false);
    onSelectPlan?.(planId);
    
    // Small delay before closing to show success
    setTimeout(() => onClose(), 500);
  };

  /**
   * Handle real Razorpay payment flow
   */
  const handleRazorpayPayment = async (planId: "viewer" | "creator") => {
    if (!razorpayLoaded || !window.Razorpay) {
      setError("Payment system is loading. Please try again.");
      return;
    }

    if (!isAuthenticated) {
      setError("Please sign in to continue with payment.");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("creating");
    setError(null);

    try {
      // Step 1: Create order on backend
      const plan = plans.find(p => p.id === planId)!;
      const orderResponse: PaymentOrderResponse = await paymentService.createOrder({
        subscriptionType: plan.backendType,
      });

      setPaymentStatus("pending");

      // Step 2: Open Razorpay checkout
      const razorpayOptions = {
        key: orderResponse.keyId,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: "GameTout",
        description: `${plan.name} - 1 Year Subscription`,
        image: "/logo.png",
        order_id: orderResponse.orderId,
        handler: async (response: RazorpayPaymentResponse) => {
          // Step 3: Verify payment on backend
          try {
            setPaymentStatus("creating");
            const verifyResponse = await paymentService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyResponse.success) {
              setPaymentStatus("success");
              onSelectPlan?.(planId);
              setTimeout(() => onClose(), 1000);
            } else {
              setPaymentStatus("failed");
              setError(verifyResponse.message || "Payment verification failed");
            }
          } catch (verifyError) {
            setPaymentStatus("failed");
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: orderResponse.userName || dbUser?.email?.split("@")[0] || "",
          email: orderResponse.userEmail || dbUser?.email || "",
        },
        notes: {
          subscription_type: plan.backendType,
        },
        theme: {
          color: "#FFAB00",
          backdrop_color: "rgba(0, 0, 0, 0.8)",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setPaymentStatus("idle");
          },
          escape: true,
          confirm_close: true,
          animation: true,
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      
      razorpay.on("payment.failed", (response: any) => {
        setPaymentStatus("failed");
        setError(response.error?.description || "Payment failed. Please try again.");
        setIsProcessing(false);
      });

      razorpay.open();
    } catch (err) {
      setPaymentStatus("failed");
      setError(err instanceof Error ? err.message : "Failed to create payment order");
      setIsProcessing(false);
    }
  };

  const handleSelectPlan = async (planId: "viewer" | "creator") => {
    setSelectedPlan(planId);
    
    if (demoMode) {
      await handleDemoPayment(planId);
    } else {
      await handleRazorpayPayment(planId);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center pt-10 pb-6 px-6 border-b border-white/10">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255, 171, 0, 0.3)",
                    "0 0 40px rgba(255, 171, 0, 0.5)",
                    "0 0 20px rgba(255, 171, 0, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFAB00]/10 border border-[#FFAB00]/30 rounded-full mb-4"
              >
                <Lock className="w-4 h-4 text-[#FFAB00]" />
                <span className="text-[#FFAB00] text-xs font-bold uppercase tracking-wider">
                  Premium Access Required
                </span>
              </motion.div>
              
              <h2 className="font-display text-4xl text-white mb-2">
                Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAB00] to-[#FFD700]">Elite</span> Access
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Get unlimited access to India's top game developer profiles
              </p>
            </div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-2 gap-6 p-8">
              {plans.map((plan) => {
                const Icon = plan.icon;
                const isSelected = selectedPlan === plan.id;
                
                return (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#FFAB00] bg-[#FFAB00]/5"
                        : "border-white/10 hover:border-white/30 bg-white/5"
                    }`}
                    onClick={() => !isProcessing && setSelectedPlan(plan.id)}
                  >
                    {/* Popular badge */}
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#FFAB00] to-[#FFD700] rounded-full">
                          <Star className="w-3 h-3 text-black" fill="black" />
                          <span className="text-[10px] font-black text-black uppercase">Most Popular</span>
                        </div>
                      </div>
                    )}

                    {/* Plan header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${plan.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: plan.color }} />
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-white mb-1">{plan.name}</h3>
                        <p className="text-gray-500 text-sm">{plan.description}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <span className="font-display text-4xl text-white">{plan.price}</span>
                      <span className="text-gray-500 text-sm ml-2">/{plan.period}</span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center gap-2 text-sm text-gray-300"
                        >
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>

                    {/* Select button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isProcessing}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPlan(plan.id);
                      }}
                      className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSelected || plan.popular
                          ? "bg-gradient-to-r from-[#FFAB00] to-[#FFD700] text-black shadow-[0_0_20px_rgba(255,171,0,0.3)]"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {isProcessing && isSelected ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-5 h-5" />
                          </motion.div>
                          {paymentStatus === "creating" ? "Creating Order..." : 
                           paymentStatus === "pending" ? "Opening Payment..." :
                           paymentStatus === "success" ? "Success!" : "Processing..."}
                        </>
                      ) : paymentStatus === "success" && isSelected ? (
                        <>
                          <Check className="w-5 h-5" />
                          Payment Successful!
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Select {plan.name}
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {(error || razorpayError) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mx-8 mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error || razorpayError}</p>
                  <button
                    onClick={() => setError(null)}
                    className="ml-auto text-red-500 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="px-8 pb-8 text-center space-y-2">
              {demoMode && (
                <p className="text-purple-400 text-xs mb-2 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Demo Mode - No real payment
                </p>
              )}
              <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                <Calendar className="w-4 h-4" />
                <span>Subscription valid for 1 year from purchase</span>
              </div>
              <p className="text-gray-600 text-sm">
                <Zap className="w-4 h-4 inline text-[#FFAB00] mr-1" />
                Secure payment powered by Razorpay • 100% money-back guarantee
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PricingModal;
