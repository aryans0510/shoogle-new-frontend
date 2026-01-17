import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlignJustify, X } from "lucide-react";
import { NavbarLogo, DesktopNavbar, NavbarMobile } from ".";

export default function Navbar() {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-20 flex min-h-22 min-w-full items-center justify-around border-b-1 border-neutral-400 bg-white shadow-xl">
      <NavbarLogo />
      <NavbarMobile
        isBurgerOpen={isBurgerOpen}
        toggleBurger={() => setIsBurgerOpen(!isBurgerOpen)}
      />
      <DesktopNavbar />
      <Button className="relative z-1 sm:hidden" onClick={() => setIsBurgerOpen(!isBurgerOpen)}>
        {isBurgerOpen ? <X /> : <AlignJustify />}
      </Button>
    </nav>
  );
}
