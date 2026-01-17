import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Verified Seller",
      location: "Mumbai",
      text: "Shoogle connected me with buyers instantly. The AI matching is scary good.",
      initials: "PS",
    },
    {
      name: "Rahul Gupta",
      role: "Power Buyer",
      location: "Delhi",
      text: "Found a gaming rig in 5 mins. No scrolling, just chatting. Love it.",
      initials: "RG",
    },
    {
      name: "Sneha Patel",
      role: "Local Artist",
      location: "Bangalore",
      text: "Sold my entire vintage collection here. The buyers are actually serious.",
      initials: "SP",
    },
    {
      name: "Amit Kumar",
      role: "Student",
      location: "Pune",
      text: "Best way to find second-hand books nearby. Highly recommended!",
      initials: "AK",
    },
  ];

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 bg-slate-50 text-slate-900">
      {/* Light Background Mesh */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 -z-10" />

      <div className="container mx-auto px-4">

        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4 text-slate-900">
            Trusted by Locals
          </h2>
          <p className="text-lg text-slate-600">
            See why thousands of buyers and sellers are switching to conversational commerce.
          </p>
        </div>

        {/* Infinite Scroll Wrapper */}
        <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
          <motion.div
            className="flex gap-6 py-4 pr-6"
            animate={{ x: "-50%" }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 25
            }}
            style={{ width: "max-content" }}
          >
            {[...testimonials, ...testimonials, ...testimonials].map((testimonial, i) => (
              <Card key={i} className="w-[250px] sm:w-[350px] shrink-0 border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex gap-1 opacity-90">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 leading-relaxed flex-1 text-lg font-light italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-sm">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{testimonial.name}</p>
                      <p className="text-xs text-slate-500">{testimonial.role} • {testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>

        {/* Stats Strip */}
        <div className="mt-20 border-y border-slate-200 bg-white py-12">
          <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-slate-900">100k+</p>
              <p className="text-sm text-slate-500 mt-1">Transactions</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-slate-900">4.9/5</p>
              <p className="text-sm text-slate-500 mt-1">App Rating</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-slate-900">12m</p>
              <p className="text-sm text-slate-500 mt-1">Response Time</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-slate-900">Verified</p>
              <p className="text-sm text-slate-500 mt-1">Community</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
