import { NavLink } from "react-router";
import { motion } from "framer-motion";
import logo from "@/assets/loader.png";

export default function NavbarLogo() {
  return (
    <NavLink to="/" className="flex items-center gap-3 group">
      <motion.div
        initial={{ rotate: -360, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{
          rotate: { duration: 1, ease: "easeOut" },
          opacity: { duration: 0.5, delay: 0.5 }
        }}
        whileHover={{ 
          rotate: 360,
          scale: 1.1,
          transition: { duration: 0.6, ease: "easeInOut" }
        }}
        className="relative flex-shrink-0"
      >
        {/* Blue glow effect */}
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse" />
        <img
          src={logo}
          alt="logo"
          className="relative h-10 w-10 rounded-full border-2 border-primary/30 shadow-lg shadow-primary/20 transition-all group-hover:border-primary/50 group-hover:shadow-primary/40"
        />
      </motion.div>
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: 1,
          duration: 0.5,
          ease: "easeOut"
        }}
        className="text-lg sm:text-xl font-semibold text-primary transition-colors group-hover:text-primary/80"
      >
        Shoogle
      </motion.span>
    </NavLink>
  );
}
