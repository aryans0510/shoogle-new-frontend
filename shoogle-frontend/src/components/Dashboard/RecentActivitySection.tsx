import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useNavigate } from "react-router";

const RecentActivitySection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
            <div>
              <p className="font-medium">Welcome to Shoogle! 🎉</p>
              <p className="text-sm text-muted-foreground">
                You're all set up and ready to start selling
              </p>
            </div>
            <span className="text-xs text-muted-foreground">Just now</span>
          </div>

          {/* Community Card */}
          <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-500" />
              <div>
                <p className="font-medium">Join the Seller Community</p>
                <p className="text-sm text-muted-foreground">
                  Connect, refer each other, and grow together as sellers
                </p>
              </div>
            </div>
            <Button variant="outline" className="ml-4" onClick={() => navigate("/community")}>
              Visit Community
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivitySection;
