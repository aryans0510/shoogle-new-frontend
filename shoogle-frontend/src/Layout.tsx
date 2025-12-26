import { Outlet } from "react-router";
import { AuthCheck, Navbar } from "@/components/common";

const Layout = () => {
  return (
    <AuthCheck>
      <Navbar />
      <Outlet />
    </AuthCheck>
  );
};

export default Layout;
