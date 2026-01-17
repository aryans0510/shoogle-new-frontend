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
    <div className="min-h-screen">
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
