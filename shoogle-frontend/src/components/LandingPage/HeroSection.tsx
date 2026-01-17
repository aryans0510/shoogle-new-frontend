import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageCircle, ShoppingBag, Search, Verified, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";
import { AuthModal } from "@/components/modals";
import { motion } from "framer-motion";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: "shopping" | "selling";
    initialAuthMode: "login" | "signup";
  }>({
    isOpen: false,
    mode: "shopping",
    initialAuthMode: "signup",
  });

  const handleStartShopping = () => {
    if (isAuthenticated) {
      navigate("/discover");
    } else {
      setAuthModal({ isOpen: true, mode: "shopping", initialAuthMode: "login" });
    }
  };

  const handleStartSelling = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      setAuthModal({ isOpen: true, mode: "selling", initialAuthMode: "signup" });
    }
  };

  const handleAuthSuccess = () => {
    navigate(authModal.mode === "shopping" ? "/discover" : "/dashboard");
  };

  return (
    <>
      <section className="relative flex min-h-[calc(100vh-4rem)] w-full items-center overflow-hidden bg-background py-12 lg:py-0">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute top-[40%] left-[20%] h-[300px] w-[300px] rounded-full bg-blue-400/10 blur-3xl opacity-50" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">

            {/* Left Column: Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI-Powered Local Marketplace
                </motion.div>

                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl leading-[1.1]">
                  Find Anything, <br />
                  <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                    Sell Everything
                  </span>
                </h1>

                <p className="mx-auto max-w-2xl text-base text-muted-foreground lg:mx-0 lg:text-lg leading-relaxed">
                  Experience the future of local commerce. Type naturally to find what you need,
                  or list items in seconds. Safe, simple, and smart.
                </p>
              </div>

              <div className="flex flex-col w-full sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base h-12 px-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                  onClick={handleStartShopping}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Start Exploring
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base h-12 px-6 rounded-xl border-2 hover:bg-muted/50"
                  onClick={handleStartSelling}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Start Selling
                </Button>
              </div>

              {/* Quick Stats/Trust Indicators */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 w-full border-t border-border/50">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-xl font-bold text-foreground">25K+</span>
                  <span className="text-sm text-muted-foreground">Active Users</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-xl font-bold text-foreground">50+</span>
                  <span className="text-sm text-muted-foreground">Cities</span>
                </div>
                <div className="hidden sm:flex flex-col items-center lg:items-start">
                  <div className="flex items-center gap-1 font-bold text-foreground text-xl">
                    4.9 <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">User Rating</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Visual/Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="relative mx-auto w-full max-w-lg lg:max-w-none"
            >
              {/* Floating Cards Effect */}
              <div className="relative z-10 py-8 lg:py-0">
                <div className="absolute -top-12 -right-8 -z-10 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px]" />

                {/* Main Card */}
                <div className="relative overflow-hidden rounded-2xl border bg-background/80 backdrop-blur-xl shadow-2xl">
                  <div className="border-b px-4 py-3 bg-muted/30 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-400/80" />
                      <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                      <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                    </div>
                    <div className="flex-1 bg-muted/50 rounded-md h-6 mx-4" />
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Chat Bubble Interface */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex gap-3"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">U</span>
                      </div>
                      <div className="bg-muted p-3 rounded-2xl rounded-tl-sm text-sm text-foreground max-w-[85%]">
                        I'm looking for a second-hand acoustic guitar under ₹5000 in Mumbai.
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 }}
                      className="flex gap-3 flex-row-reverse"
                    >
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="bg-primary/10 p-3 rounded-2xl rounded-tr-sm text-sm text-foreground max-w-[85%]">
                        Found 12 great options near you! Here's a highly rated one:

                        <div className="mt-3 flex gap-3 p-2 bg-background/50 rounded-xl border">
                          <div className="h-16 w-16 bg-muted rounded-lg shrink-0" />
                          <div className="flex flex-col justify-center min-w-0">
                            <span className="font-semibold text-sm truncate">Yamaha F310 Acoustic</span>
                            <span className="text-xs text-muted-foreground">📍 Bandra West • 2.1km</span>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="font-bold text-sm">₹4,500</span>
                              <span className="text-[10px] bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded-full">Good Deal</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="absolute -bottom-6 -left-6 bg-background rounded-xl p-4 shadow-xl border flex items-center gap-3 z-20 max-w-[200px]"
                >
                  <div className="bg-green-100 p-2 rounded-full">
                    <Verified className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Trust Score</p>
                    <p className="font-bold text-foreground">100% Verified</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.6 }}
                  className="absolute -top-6 -right-6 bg-background rounded-xl p-4 shadow-xl border z-20 items-center justify-center hidden sm:flex"
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">2m+</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Searches</p>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
        mode={authModal.mode}
        onSuccess={handleAuthSuccess}
        initialAuthMode={authModal.initialAuthMode}
      />
    </>
  );
};

export default HeroSection;
