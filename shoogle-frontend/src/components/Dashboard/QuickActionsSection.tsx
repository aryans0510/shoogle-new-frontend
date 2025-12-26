import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Box, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

interface QuickActionsSectionProps {
  onViewAnalytics: () => void;
}

const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({ onViewAnalytics }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      <Card className="cursor-pointer transition-shadow hover:shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Plus className="h-5 w-5 shrink-0 text-primary" />
            Create Listing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Add a new product or service to your store
          </p>
          <Button
            onClick={() => navigate("/dashboard/create-listing")}
            className="w-full"
            disabled={!user.isOnboarded}
          >
            Start Listing
          </Button>
        </CardContent>
      </Card>

      {/* My Subscriptions Card */}
      <Card className="cursor-pointer transition-shadow hover:shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Box className="h-5 w-5 shrink-0 text-primary" />
            My Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Manage your active subscriptions and upcoming renewals
          </p>
          <Button className="w-full" onClick={() => navigate("/dashboard/subscriptions")}>
            View All
          </Button>
        </CardContent>
      </Card>

      {/* Analytics Card */}
      <Card className="cursor-pointer transition-shadow hover:shadow-lg sm:col-span-2 lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BarChart3 className="h-5 w-5 shrink-0 text-primary" />
            <span className="font-bold">Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">Track your performance and insights</p>
          <Button onClick={onViewAnalytics} className="w-full">
            View Stats
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActionsSection;
