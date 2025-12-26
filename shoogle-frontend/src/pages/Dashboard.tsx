import { useState } from "react";
import { useStoreProximityNudge } from "@/hooks/useStoreProximityNudge";
import {
  SellerListings,
  WelcomeSection,
  AnalyticsDashboard,
  QuickActionsSection,
  RecentActivitySection,
  PromotionsGateSection,
} from "@/components/Dashboard";
import useExchangeTokenAfterGoogleCallback from "@/hooks/useSetUser";

const Dashboard = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  // TODO: Replace this with your subscription logic. Example: const isPro = user?.subscriptionTier === "Pro";
  const [isPro, setIsPro] = useState(false);

  useExchangeTokenAfterGoogleCallback("seller");

  useStoreProximityNudge();

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {showAnalytics ? (
          <AnalyticsDashboard onBack={() => setShowAnalytics(false)} />
        ) : (
          <>
            <WelcomeSection />
            <QuickActionsSection onViewAnalytics={() => setShowAnalytics(true)} />
            <SellerListings />
            <div className="mt-6 sm:mt-8" />
            <RecentActivitySection />
            <PromotionsGateSection isPro={isPro} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
