import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, ShoppingBag, Search, Sparkles, MapPin, Shield } from "lucide-react";

const FeatureSection = () => {
  const sellerFeatures = [
    {
      icon: ShoppingBag,
      title: "List in Minutes",
      description:
        "Add products by chatting or quick forms. No tech skills needed - just describe what you're selling!",
    },
    {
      icon: Sparkles,
      title: "Smart Analytics",
      description:
        "Track views, clicks, and inquiries with beautiful dashboards that help you sell better.",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description:
        "Optional verification and secure communication keep both buyers and sellers protected.",
    },
  ];

  const buyerFeatures = [
    {
      icon: MessageCircle,
      title: "Chat to Shop",
      description:
        "Just tell us what you need! 'Looking for a gaming laptop under ₹50k' - and we'll find it.",
    },
    {
      icon: Search,
      title: "Smart Discovery",
      description:
        "Our AI understands context, location, and preferences to show you exactly what you want.",
    },
    {
      icon: MapPin,
      title: "Local & Global",
      description: "Find items nearby for quick pickup or discover unique products from anywhere.",
    },
  ];

  return (
    <section className="max-w-full overflow-x-hidden px-2 py-12 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        {/* Section Header */}
        <div className="mb-10 px-1 text-center sm:mb-16">
          <h2 className="mb-4 text-2xl font-bold break-words sm:mb-6 sm:text-4xl lg:text-5xl">
            <span className="gradient-text">Two Sides,</span>
            <br />
            <span className="text-foreground">One Amazing Experience</span>
          </h2>
          <p className="mx-auto max-w-full text-base text-muted-foreground sm:max-w-2xl sm:text-lg">
            Whether you're buying or selling, Shoogle makes it as easy as having a conversation with
            a friend.
          </p>
        </div>
        <div className="grid max-w-full grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Seller Features */}
          <div className="space-y-6 sm:space-y-8">
            <div className="px-1 text-center sm:text-left">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary sm:mb-4">
                <ShoppingBag className="h-4 w-4" />
                For Sellers
              </div>
              <h3 className="mb-2 text-xl font-bold sm:mb-4 sm:text-2xl">Start Selling Today</h3>
              <p className="text-sm text-muted-foreground sm:text-base">
                Turn your items into income with our friendly seller tools.
              </p>
            </div>
            <div className="space-y-4 sm:space-y-6">
              {sellerFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="border-2 bg-card/50 backdrop-blur-xs transition-colors hover:border-primary/20"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="shrink-0 rounded-lg bg-primary/10 p-2 sm:p-3">
                        <feature.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <h4 className="mb-1 text-base font-semibold sm:mb-2 sm:text-lg">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-muted-foreground sm:text-base">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          {/* Buyer Features */}
          <div className="space-y-6 sm:space-y-8">
            <div className="px-1 text-center sm:text-left">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent sm:mb-4">
                <Search className="h-4 w-4" />
                For Buyers
              </div>
              <h3 className="mb-2 text-xl font-bold sm:mb-4 sm:text-2xl">Discover Anything</h3>
              <p className="text-sm text-muted-foreground sm:text-base">
                Find exactly what you need through intelligent conversation.
              </p>
            </div>
            <div className="space-y-4 sm:space-y-6">
              {buyerFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="border-2 bg-card/50 backdrop-blur-xs transition-colors hover:border-accent/20"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="shrink-0 rounded-lg bg-accent/10 p-2 sm:p-3">
                        <feature.icon className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <h4 className="mb-1 text-base font-semibold sm:mb-2 sm:text-lg">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-muted-foreground sm:text-base">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
