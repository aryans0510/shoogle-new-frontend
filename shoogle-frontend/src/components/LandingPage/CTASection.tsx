import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
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
      // Directly open the chatbot shopping experience
      navigate("/discover");
    } else {
      // Show authentication modal
      setAuthModal({ isOpen: true, mode: "shopping" });
    }
  };

  const handleStartSelling = () => {
    if (isAuthenticated && user?.isOnboarded && user?.type === "seller") {
      // Redirect directly to dashboard
      navigate("/dashboard");
    } else {
      // Show seller authentication/onboarding modal
      setAuthModal({ isOpen: true, mode: "selling" });
    }
  };

  const handleAuthSuccess = () => {
    if (authModal.mode === "shopping") {
      navigate("/discover");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <section className="max-w-full overflow-x-hidden bg-linear-to-br from-primary/5 via-background to-accent/5 px-2 py-12 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto w-full max-w-3xl text-center sm:max-w-4xl">
          <div className="relative">
            <div className="pointer-events-none absolute -top-14 -left-8 h-20 w-20 animate-float rounded-full bg-primary/10 blur-3xl sm:h-40 sm:w-40"></div>
            <div
              className="pointer-events-none absolute -right-8 -bottom-14 h-20 w-20 animate-float rounded-full bg-accent/10 blur-3xl sm:h-40 sm:w-40"
              style={{ animationDelay: "-1s" }}
            ></div>

            <div className="relative z-10">
              <div className="mb-8 px-1 sm:mb-12">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary sm:mb-6">
                  <Sparkles className="h-4 w-4" />
                  Ready to Start?
                </div>
                <h2 className="mb-3 text-2xl font-bold sm:mb-6 sm:text-4xl lg:text-5xl">
                  <span className="gradient-text">Join Shoogle</span>
                  <br />
                  <span className="text-foreground">Today</span>
                </h2>
                <p className="mx-auto max-w-full text-base text-muted-foreground sm:max-w-2xl sm:text-lg">
                  Whether you're looking to sell your products or discover amazing deals, Shoogle
                  makes it as simple as having a conversation.
                </p>
              </div>

              <div className="mb-8 flex w-full flex-col items-center justify-center gap-3 px-1 sm:mb-12 sm:flex-row sm:gap-6">
                <Button
                  size="lg"
                  className="group w-full bg-primary px-6 py-5 text-base font-semibold text-primary-foreground glow-effect hover:bg-primary/90 sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
                  onClick={handleStartShopping}
                >
                  <MessageCircle className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Start Shopping Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="group w-full border-primary/20 px-6 py-5 text-base hover:bg-primary/5 sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
                  onClick={handleStartSelling}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Sell Your Items
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              <div className="grid w-full grid-cols-1 gap-4 text-xs text-muted-foreground sm:grid-cols-3 sm:gap-8 sm:text-sm">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Free to start</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>AI-powered matching</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span>Safe & secure</span>
                </div>
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
