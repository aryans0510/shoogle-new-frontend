import { motion } from "motion/react";
import loader from "@/assets/loader.png";

export default function Loader() {
  return (
    <div className="absolute flex min-h-screen min-w-full items-center justify-center">
      <motion.div className="relative inline-block">
        <motion.div
          className="absolute inset-0 rounded-full border-t-2 border-primary md:scale-130 lg:scale-150"
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeOut",
            repeatType: "loop",
          }}
        />
        <img src={loader} alt="loader" className="w-30 rounded-full" />
      </motion.div>
    </div>
  );
}
