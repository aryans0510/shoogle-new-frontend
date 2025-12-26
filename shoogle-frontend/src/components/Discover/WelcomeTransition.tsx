import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Users, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WelcomeTransitionProps {
  username?: string;
  onContinue?: () => void;
  children?: React.ReactNode; // The listings grid component to show after transition
  showListings?: boolean; // Control from parent
}

const WelcomeTransition: React.FC<WelcomeTransitionProps> = ({
  username = "User",
  onContinue,
  children,
  showListings: externalShowListings,
}) => {
  const [internalShowListings, setInternalShowListings] = useState(false);

  // Use external prop if provided, otherwise use internal state
  const showListings =
    externalShowListings !== undefined ? externalShowListings : internalShowListings;

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleTransition = () => {
    setInternalShowListings(true);
    onContinue?.();
  };

  const features = [
    { icon: Sparkles, text: "Smart listings & recommendations" },
    { icon: MapPin, text: "Local discovery engine" },
    { icon: Users, text: "User-powered marketplace" },
  ];

  return (
    <div className="relative flex w-full items-center justify-center">
      <AnimatePresence mode="wait">
        {!showListings ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex min-h-[60vh] w-full items-center justify-center px-6 py-8 sm:px-8 sm:py-16"
          >
            <div className="w-full max-w-2xl space-y-6 sm:space-y-8">
              {/* Welcome Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex justify-center"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 shadow-sm sm:px-6 sm:py-2.5">
                  <span className="text-xs font-semibold tracking-wide text-blue-700 sm:text-sm">
                    WELCOME BACK
                  </span>
                  <Hand className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="space-y-3 text-center sm:space-y-4"
              >
                <h1 className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] bg-clip-text text-3xl font-bold text-transparent sm:text-5xl md:text-6xl">
                  {getGreeting()}, {username}
                </h1>
                <p className="mx-auto max-w-xl text-sm leading-relaxed text-gray-600 sm:text-lg">
                  I'm primed to help you discover and list products faster than ever — from{" "}
                  <span className="font-medium text-blue-600">chocolates</span> to{" "}
                  <span className="font-medium text-blue-600">car loans</span>.
                </p>
              </motion.div>

              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(74, 144, 226, 0.3)" }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1.5 shadow-sm transition-all hover:border-blue-300 sm:gap-2 sm:px-5 sm:py-2.5"
                  >
                    <feature.icon className="h-3.5 w-3.5 text-blue-500 sm:h-4 sm:w-4" />
                    <span className="text-xs font-medium text-gray-700 sm:text-sm">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="pt-2 sm:pt-4"
              >
                {/* Continue Button */}
                <Button
                  onClick={handleTransition}
                  className="h-12 w-full rounded-2xl bg-[hsl(217,91%,59%)] text-sm font-semibold text-white shadow-lg transition-all hover:bg-[hsl(217,91%,65%)] hover:shadow-xl hover:shadow-blue-200 sm:h-14 sm:text-base"
                >
                  Continue to Listings
                </Button>
              </motion.div>

              {/* Subtle hint text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-center text-xs text-gray-400 sm:text-sm"
              >
                Click Continue to Listings or use the search bar below to explore
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="listings"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="min-h-[60vh] w-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomeTransition;
