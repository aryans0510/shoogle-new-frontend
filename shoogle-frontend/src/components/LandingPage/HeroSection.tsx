import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageCircle, ShoppingBag, LoaderCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";
import { AuthModal } from "@/components/modals";
import { SplitText } from "@/components/animations";
import { Loader } from "@/components/common";

const HeroSection = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const { isAuthenticated } = useAuth();
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
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
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

  // animations start after font loads
  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontLoaded(true);
    });
  }, []);

  if (!fontLoaded) {
    return <Loader />;
  }

  return (
    <>
      <section className="relative max-w-full overflow-hidden px-2 pt-14 pb-10 sm:px-6 sm:pt-20 sm:pb-16 lg:px-12">
        <div className="relative mx-auto w-full">
          <div className="space-y-6 px-2 text-center sm:space-y-8">
            <div className="font-bold tracking-tight">
              {fontLoaded && (
                <SplitText
                  text="Shoogle"
                  className="text-3xl leading-snug text-primary sm:text-5xl md:text-6xl lg:text-7xl"
                  delay={100}
                  duration={1}
                  ease="elastic.out(1.5,0.8)"
                  splitType="chars"
                  from={{ opacity: 0, y: -50 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                />
              )}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                Your Friendly AI Marketplace
              </h1>
            </div>

            <p className="mx-auto max-w-full px-1 text-base leading-relaxed text-muted-foreground sm:max-w-3xl sm:text-xl">
              Discover anything you need just by chatting! From handcrafted soaps to secondhand
              smartphones -<strong className="text-foreground"> buy and sell effortlessly</strong>{" "}
              through our intelligent, conversational marketplace.
            </p>

            {/* CTA Buttons */}
            <div className="flex w-full max-w-full flex-col items-center justify-center gap-3 pt-2 sm:flex-row sm:gap-4 sm:pt-4">
              <Button
                size="lg"
                className="group w-full cursor-pointer bg-primary px-6 py-5 text-base font-semibold text-primary-foreground glow-effect hover:bg-primary/90 sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
                onClick={handleStartShopping}
              >
                <MessageCircle className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Start Shopping Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-primary/20 px-6 py-5 text-base hover:bg-primary/5 sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
                onClick={handleStartSelling}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Sell Your Items
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col items-center justify-center gap-6 pt-9 text-xs text-muted-foreground sm:flex-row sm:gap-8 sm:pt-12 sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="h-7 w-7 rounded-full border-2 border-background bg-linear-to-r from-[#e0a800] to-[#fdd676] sm:h-8 sm:w-8"
                    ></div>
                  ))}
                </div>
                <span>Trusted by 10,000+ sellers</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-glow text-accent" />
                <span>AI-powered matching</span>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 w-full max-w-[95vw] sm:mt-16 sm:max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl border bg-card glow-effect shadow-2xl">
              <div className="bg-linear-to-r from-[#3B82F6] to-[#60A5FA] p-1">
                <div className="rounded-xl bg-background p-4 sm:p-6">
                  <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
                    <div className="h-2 w-2 rounded-full bg-red-500 sm:h-3 sm:w-3"></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-500 sm:h-3 sm:w-3"></div>
                    <div className="h-2 w-2 rounded-full bg-green-500 sm:h-3 sm:w-3"></div>
                  </div>
                  <div className="space-y-2 sm:space-y-4">
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-xs break-words text-primary-foreground sm:max-w-[60%] sm:text-base">
                        "I'm looking for a used iPhone in Mumbai"
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-full rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-xs sm:max-w-md sm:text-base">
                        <p>🔍 Found 12 iPhones in Mumbai! Here are the best matches:</p>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div className="min-w-0 rounded-lg border bg-background p-2 sm:p-3">
                            <div className="mb-1 h-12 w-full rounded bg-linear-to-r from-shopgpt-100 to-magic-100 sm:mb-2 sm:h-20"></div>
                            <p className="text-xs font-medium">iPhone 13 Pro</p>
                            <p className="text-xs text-muted-foreground">₹45,000</p>
                          </div>
                          <div className="min-w-0 rounded-lg border bg-background p-2 sm:p-3">
                            <div className="mb-1 h-12 w-full rounded bg-linear-to-r from-magic-100 to-shopgpt-100 sm:mb-2 sm:h-20"></div>
                            <p className="text-xs font-medium">iPhone 12</p>
                            <p className="text-xs text-muted-foreground">₹32,000</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

export default HeroSection;
