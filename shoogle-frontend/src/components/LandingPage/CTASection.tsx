import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";
import { AuthModal } from "@/components/modals";

const CTASection = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: "shopping" | "selling" }>({
    isOpen: false,
    mode: "shopping",
  });

  const handleStartShopping = () => {
    if (isAuthenticated) {
      navigate("/discover");
    } else {
      setAuthModal({ isOpen: true, mode: "shopping" });
    }
  };

  const handleStartSelling = () => {
    if (isAuthenticated && user?.isOnboarded && user?.seller) {
      navigate("/dashboard");
    } else {
      setAuthModal({ isOpen: true, mode: "selling" });
    }
  };

  const handleAuthSuccess = () => {
    navigate(authModal.mode === "shopping" ? "/discover" : "/dashboard");
  };

  return (
    <>
      <section className="py-16 sm:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-blue-600 px-6 py-16 sm:py-24 text-center isolate shadow-2xl shadow-blue-900/20">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl drop-shadow-sm">
                Start Shoogling.
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-medium">
                Join the thousands of locals who have switched to the smarter, faster way to buy and sell.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Button
                  size="lg"
                  className="h-16 px-10 text-lg rounded-full bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all duration-300 font-bold shadow-xl"
                  onClick={handleStartShopping}
                >
                  <MessageCircle className="mr-2 h-6 w-6" />
                  Start Shopping
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 px-10 text-lg rounded-full border-2 border-white text-white hover:bg-white/10 hover:text-white bg-transparent transition-all duration-300 font-semibold"
                  onClick={handleStartSelling}
                >
                  <ShoppingBag className="mr-2 h-6 w-6" />
                  Start Selling
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
        mode={authModal.mode}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default CTASection;
