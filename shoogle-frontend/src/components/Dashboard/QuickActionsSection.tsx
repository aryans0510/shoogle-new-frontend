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
      {/* Create Listing - Primary Action with Enhanced Emphasis */}
      <Card className="cursor-pointer transition-shadow hover:shadow-lg border-2 border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold">
            <Plus className="h-6 w-6 shrink-0 text-primary" />
            Create Listing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-5 text-sm text-muted-foreground leading-relaxed">
            Add a new product or service to your store
          </p>
          <Button
            onClick={() => navigate("/dashboard/create-listing")}
            className="w-full h-11 font-semibold"
            disabled={!user.isOnboarded}
          >
            {user.isOnboarded ? "Start Listing" : "Complete Setup First"}
          </Button>
        </CardContent>
      </Card>

      {/* My Subscriptions Card - Secondary */}
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
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate("/dashboard/subscriptions")}
          >
            View All
          </Button>
        </CardContent>
      </Card>

      {/* Analytics Card - Secondary */}
      <Card className="cursor-pointer transition-shadow hover:shadow-lg sm:col-span-2 lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BarChart3 className="h-5 w-5 shrink-0 text-primary" />
            Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">Track your performance and insights</p>
          <Button 
            variant="outline" 
            onClick={onViewAnalytics} 
            className="w-full"
          >
            View Stats
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActionsSection;
