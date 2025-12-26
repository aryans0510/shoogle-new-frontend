import React from "react";
import { Button } from "@/components/ui/button";
import PromotionsSection from "@/components/Dashboard/PromotionsSection";
import { useNavigate } from "react-router";
interface PromotionsGateSectionProps {
  isPro: boolean;
}
const PromotionsGateSection: React.FC<PromotionsGateSectionProps> = ({ isPro }) => {
  const navigate = useNavigate();
  return (
    <div className="mb-8 py-[10px]">
      {isPro ? (
        <PromotionsSection />
      ) : (
        <div className="mx-auto max-w-lg">
          <div className="flex flex-col items-center rounded-lg border border-blue-200 bg-blue-50 p-6">
            <span className="mb-2 text-3xl">🔒</span>
            <h2 className="mb-1 text-lg font-semibold">Unlock Promotions</h2>
            <p className="mb-3 text-center text-sm text-blue-900">
              Sending exclusive offers is available only to <b>Pro</b> plan sellers. Upgrade to Pro
              to send promotions directly to all your customers.
            </p>
            <Button
              className="w-full"
              variant="default"
              onClick={() => navigate("/dashboard/subscriptions")}
            >
              Upgrade to Pro
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default PromotionsGateSection;
