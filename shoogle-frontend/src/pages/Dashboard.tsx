import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Search, Heart, Clock, ShoppingBag } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAnalytics, setShowAnalytics] = useState(false);
  // TODO: Replace this with your subscription logic. Example: const isPro = user?.subscriptionTier === "Pro";
  const [isPro, setIsPro] = useState(false);

  useExchangeTokenAfterGoogleCallback("seller");
  useStoreProximityNudge();

  // Buyer Dashboard
  if (!user?.seller) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/10">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="space-y-8">
            {/* Welcome Section for Buyers */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Hello, {user.name || "User"}! 👋
                    </h1>
                    <p className="text-gray-600">Welcome back to Shoogle</p>
                  </div>
                </div>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  Ready to discover amazing products and services? Start searching now!
                </p>
              </div>
            </div>

            {/* Quick Actions for Buyers */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">What would you like to do?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => navigate("/discover")}
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <Search className="h-6 w-6" />
                  <span className="font-medium">Search Products</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/discover")}
                  className="h-20 flex flex-col items-center justify-center gap-2 border-blue-200 hover:bg-blue-50"
                >
                  <Heart className="h-6 w-6 text-blue-600" />
                  <span className="font-medium text-blue-600">Browse Categories</span>
                </Button>
              </div>
            </div>

            {/* Popular Categories */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Popular Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { name: "Swimming Pools", emoji: "🏊‍♂️" },
                  { name: "Smartphones", emoji: "📱" },
                  { name: "Gyms", emoji: "💪" },
                  { name: "Laptops", emoji: "💻" },
                  { name: "Beauty Salons", emoji: "💄" },
                  { name: "Coaching", emoji: "📚" },
                ].map((category, index) => (
                  <button
                    key={index}
                    onClick={() => navigate("/discover")}
                    className="p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors text-center group"
                  >
                    <div className="text-2xl mb-2">{category.emoji}</div>
                    <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                      {category.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity yet</p>
                <p className="text-sm text-gray-400 mt-2">Start searching to see your activity here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Seller Dashboard (existing code)
  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {showAnalytics ? (
          <AnalyticsDashboard onBack={() => setShowAnalytics(false)} />
        ) : (
          <div className="space-y-8">
            <WelcomeSection />
            <QuickActionsSection onViewAnalytics={() => setShowAnalytics(true)} />
            <SellerListings />
            <RecentActivitySection />
            <PromotionsGateSection isPro={isPro} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
