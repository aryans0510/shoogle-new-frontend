import { Outlet } from "react-router";
import { AuthCheck } from "@/components/common";
import { Header } from "@/components/ui/header-3";

const Layout = () => {
  return (
    <AuthCheck>
      <Header />
      <Outlet />
    </AuthCheck>
  );
};

export default Layout;
