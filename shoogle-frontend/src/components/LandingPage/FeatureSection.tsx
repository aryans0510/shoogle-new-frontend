
import { useRef, useState } from "react";
import { MessageCircle, ShoppingBag, Search, Sparkles, MapPin, Shield, Zap, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const FeatureSection = () => {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-2xl mx-auto text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900"
          >
            Everything you need. <br />
            <span className="text-blue-600">Nothing you don't.</span>
          </motion.h2>
          <p className="text-lg text-slate-600">
            Powerful features for both buyers and sellers, wrapped in a simple, beautiful interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 md:auto-rows-[300px]">

          {/* Main Large Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 relative overflow-hidden rounded-3xl bg-blue-600 p-8 md:p-12 text-white shadow-xl shadow-blue-900/20 group hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="p-3 bg-white/10 w-fit rounded-xl backdrop-blur-md mb-6 border border-white/20">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Smart Semantic Search</h3>
                <p className="text-blue-50 max-w-md text-lg">
                  Don't just search for keywords. Describe what you need, and our AI understands context, location, and intent.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-blue-100 group-hover:text-white transition-colors">
                Try it out <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>

            {/* Abstract background shapes */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />
          </motion.div>

          {/* Tall Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:row-span-2 relative overflow-hidden rounded-3xl bg-white p-8 md:p-10 border border-slate-200 shadow-lg shadow-slate-200/50 group hover:border-blue-200 transition-colors duration-300"
          >
            <div className="h-full flex flex-col relative z-10">
              <div className="p-3 bg-blue-50 w-fit rounded-xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Zap className="h-6 w-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Instant Chat</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Connect directly via WhatsApp or our in-app messenger. No waiting for emails.
              </p>

              {/* Mock Chat UI */}
              <div className="mt-auto space-y-3">
                <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-sm text-xs text-slate-600 max-w-[80%] border border-slate-100">
                  Is this still available?
                </div>
                <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-sm text-xs text-white max-w-[80%] self-end ml-auto shadow-md shadow-blue-200">
                  Yes! When can you pick it up?
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-sm text-xs text-slate-600 max-w-[80%] border border-slate-100">
                  I can come by around 5pm.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Standard Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl bg-white p-8 border border-slate-200 shadow-lg shadow-slate-200/50 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="relative z-10">
              <div className="p-3 bg-blue-50 w-fit rounded-xl mb-4 text-blue-600">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Hyper-Local</h3>
              <p className="text-slate-500 text-sm">
                Find deals within walking distance. Save on shipping and carbon footprint.
              </p>
            </div>
          </motion.div>

          {/* Standard Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden rounded-3xl bg-white p-8 border border-slate-200 shadow-lg shadow-slate-200/50 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="relative z-10">
              <div className="p-3 bg-blue-50 w-fit rounded-xl mb-4 text-blue-600">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Verified Trust</h3>
              <p className="text-slate-500 text-sm">
                Every user is verified. Community ratings keep the marketplace safe.
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default FeatureSection;
