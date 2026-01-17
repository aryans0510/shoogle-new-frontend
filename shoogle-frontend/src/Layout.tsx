import { Outlet } from "react-router";
import { AuthCheck } from "@/components/common";
import { Header } from "@/components/ui/header-3";

const Layout = () => {
  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-b from-purple-50/40 via-pink-50/20 to-white">
        <Header />
        <Outlet />
      </div>
    </AuthCheck>
  );
};

export default Layout;
