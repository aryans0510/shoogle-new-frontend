import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
const plans = [
  {
    name: "Basic",
    price: "Free",
    listings: "1 listing",
    description: "Perfect for getting started.",
    perks: [
      "1 active listing",
      "Basic support",
      "Free forever",
      "5 review compulsion on your listing.",
    ],
    current: true,
    cta: null,
  },
  {
    name: "Pro",
    price: "₹299/mo",
    listings: "5 listings / month",
    description: "For growing sellers who need more.",
    perks: [
      "Up to 5 listings/month",
      "Priority support",
      "Unlock more visibility",
      "Unlock communities",
      "Send promotions via push notification to your customers and redirect them",
      "No review compulsion – get Discovery access for all your Pro listings",
    ],
    current: false,
    cta: null,
  },
  {
    name: "Enterprise",
    price: "Custom",
    listings: "Unlimited",
    description: "For large businesses with unique needs.",
    perks: ["Custom listing limits", "Dedicated manager", "Bespoke solutions"],
    current: false,
    cta: (
      <Button className="w-full" variant="outline">
        Contact Us
      </Button>
    ),
  },
];
const DashboardSubscriptions = () => {
  const navigate = useNavigate();

  // Handler for upgrade to pro
  const handleUpgradeToPro = async () => {
    // TODO: Integrate with actual payment gateway
    // Placeholder: navigate to a dummy payment URL or log to the console
    // window.location.href = "/your-payment-gateway-link";
    console.log("Redirecting to payment gateway for Pro plan...");
    // Example: navigate("/payment"); or window.open(paymentUrl, "_blank");
    // For now, just as a user experience demo:
    alert("Redirecting to payment gateway (demo)!");
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Manage your Subscription
            </h1>
            <p className="hidden text-sm text-gray-600 sm:block">
              Choose the plan that fits your goals. Upgrade for more listings and features.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map(plan => {
            // If this is the Pro plan, add the handler
            let CTA = plan.cta;
            if (plan.name === "Pro") {
              CTA = (
                <Button className="w-full" onClick={handleUpgradeToPro}>
                  Upgrade to Pro
                </Button>
              );
            }
            return (
              <Card
                key={plan.name}
                className={`relative flex flex-col ${plan.current ? "border-2 border-blue-600 shadow-lg" : "border border-gray-200"}`}
              >
                <CardHeader className="flex flex-col items-center space-y-2 pb-4">
                  <Package className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                  {plan.current && (
                    <span className="absolute top-3 right-3 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      Current Plan
                    </span>
                  )}
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <div className="mb-4 text-center">
                    <div className="text-3xl font-bold text-gray-900">{plan.price}</div>
                    <div className="mt-1 text-sm text-gray-600">{plan.listings}</div>
                  </div>
                  <ul className="mb-6 flex-1 space-y-2 text-sm">
                    {plan.perks.map(perk => (
                      <li key={perk} className="flex items-start gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"></span>
                        <span className="text-gray-700">{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">{CTA}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default DashboardSubscriptions;
