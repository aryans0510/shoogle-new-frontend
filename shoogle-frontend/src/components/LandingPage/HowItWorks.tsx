import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Search, ShoppingBag, Sparkles } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: MessageCircle,
      title: "Just Ask",
      description:
        "Type what you're looking for in natural language. 'Need a birthday gift for my mom under ₹2000'",
      color: "primary",
    },
    {
      number: "02",
      icon: Sparkles,
      title: "AI Magic",
      description:
        "Our AI understands your needs and searches through thousands of listings to find perfect matches.",
      color: "accent",
    },
    {
      number: "03",
      icon: Search,
      title: "Discover Results",
      description:
        "Browse beautiful, curated results with images, prices, and seller info - all filtered for you.",
      color: "primary",
    },
    {
      number: "04",
      icon: ShoppingBag,
      title: "Connect & Buy",
      description:
        "Chat directly with sellers, negotiate, and complete your purchase. It's that simple!",
      color: "accent",
    },
  ];

  return (
    <section className="min-w-full overflow-x-hidden bg-muted/30 px-2 py-12 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        {/* Section Header */}
        <div className="mb-10 px-1 text-center sm:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary sm:mb-6">
            <Sparkles className="h-4 w-4" />
            How It Works
          </div>
          <div className="mb-4 text-2xl font-bold sm:mb-6 sm:text-4xl lg:text-5xl">
            <h1 className="mb-2 text-foreground">Shopping Made</h1>
            <h1 className="gradient-text">Ridiculously Simple</h1>
          </div>
          <p className="mx-auto max-w-full text-base text-muted-foreground sm:max-w-2xl sm:text-lg">
            Four easy steps to find anything you need. No complicated searches, no endless scrolling
            - just conversation.
          </p>
        </div>
        {/* Steps */}
        <div className="grid max-w-full grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="group relative min-h-[240px] border-2 bg-background/80 backdrop-blur-xs transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
            >
              <CardContent className="flex flex-col items-center p-6 text-center sm:p-8">
                {/* Step Number */}
                <div
                  className={`absolute -top-4 left-1/2 h-7 w-7 -translate-x-1/2 transform rounded-full sm:h-8 sm:w-8 bg-${step.color} flex items-center justify-center text-xs font-bold text-white sm:text-sm`}
                >
                  {step.number}
                </div>
                {/* Icon */}
                <div
                  className={`bg-${step.color}/10 mx-auto mb-4 w-fit rounded-xl p-3 transition-transform group-hover:scale-110 sm:mb-6 sm:p-4`}
                >
                  <step.icon className={`h-7 w-7 sm:h-8 sm:w-8 text-${step.color}`} />
                </div>
                {/* Content */}
                <h3 className="mb-2 text-base font-bold sm:mb-4 sm:text-xl">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
