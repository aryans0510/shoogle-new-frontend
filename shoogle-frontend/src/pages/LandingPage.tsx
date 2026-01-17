import {
  HeroSection,
  FeatureSection,
  HowItWorks,
  TestimonialsSection,
  CTASection,
} from "@/components/LandingPage";
import { Footer } from "@/components/common";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-shopgpt-50/30 to-magic-50/20">
      <HeroSection />
      <FeatureSection />
      <HowItWorks />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
