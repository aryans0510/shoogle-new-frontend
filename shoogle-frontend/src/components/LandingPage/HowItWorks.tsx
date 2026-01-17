import { useRef } from "react";
import { MessageCircle, Search, ShoppingBag, Sparkles, ArrowRight, ArrowDown } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      icon: MessageCircle,
      title: "Just Ask",
      description: "Type what you need in plain English.",
      delay: 0,
    },
    {
      number: "2",
      icon: Sparkles,
      title: "AI Analysis",
      description: "Our engine understands your intent instantly.",
      delay: 0.2,
    },
    {
      number: "3",
      icon: Search,
      title: "Find Match",
      description: "We locate the perfect item nearby.",
      delay: 0.4,
    },
    {
      number: "4",
      icon: ShoppingBag,
      title: "Purchase",
      description: "Secure deal with a single click.",
      delay: 0.6,
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900">
            It's almost <span className="text-blue-600">too easy.</span>
          </h2>
          <p className="text-lg text-slate-600">
            We removed the friction. You just find what you love.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-0 w-full h-1 bg-gradient-to-r from-slate-100 via-blue-200 to-slate-100 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.delay }}
                className="flex flex-col items-center text-center group"
              >
                {/* Step Circle */}
                <div className="w-32 h-32 rounded-full bg-white border-4 border-slate-50 shadow-xl flex items-center justify-center mb-8 relative z-10 transition-transform group-hover:scale-110 group-hover:border-blue-100 group-hover:shadow-blue-200/50">
                  <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <step.icon className="w-10 h-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm border-4 border-white">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm max-w-[200px]">
                  {step.description}
                </p>

                {/* Mobile Arrow */}
                {i !== steps.length - 1 && (
                  <ArrowDown className="md:hidden mt-8 text-slate-300" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
