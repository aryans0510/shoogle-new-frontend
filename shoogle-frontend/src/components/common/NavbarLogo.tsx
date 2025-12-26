import { NavLink } from "react-router";
import logo from "@/assets/loader.png";

export default function NavbarLogo() {
  return (
    <NavLink to="/">
      <img
        src={logo}
        alt="logo"
        className="h-18 rounded-full border transition-transform hover:scale-120"
      />
    </NavLink>
  );
}
