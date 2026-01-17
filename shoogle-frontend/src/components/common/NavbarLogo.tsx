import { NavLink } from "react-router";
import { motion } from "framer-motion";
import logo from "@/assets/loader.png";

export default function NavbarLogo() {
  return (
    <NavLink to="/" className="flex items-center gap-3">
      <motion.div
        initial={{ rotate: -360, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{
          rotate: { duration: 1, ease: "easeOut" },
          opacity: { duration: 0.5, delay: 0.5 }
        }}
        className="flex-shrink-0"
      >
        <img
          src={logo}
          alt="logo"
          className="h-10 w-10 rounded-full border transition-transform hover:scale-110"
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
        className="text-lg sm:text-xl font-semibold text-primary"
      >
        Shoogle
      </motion.span>
    </NavLink>
  );
}
