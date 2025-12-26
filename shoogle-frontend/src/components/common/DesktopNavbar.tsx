import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api";
import { toast } from "sonner";
import { getFirstName } from "@/utils";
import { LogOut } from "lucide-react";

export default function DesktopNavbar() {
  const { user, setUserLoading, clearContext } = useAuth();
  const navigate = useNavigate();

  // Handler for logout
  const handleLogout = async () => {
    try {
      setUserLoading(true);
      const res = await api.get("/auth/logout");
      toast.success(res.data.message, { description: "You have been logged out." });
      clearContext();
      navigate("/");
    } catch (error) {
      console.log("error logging out", error);
      toast.error("Some error occured");
    } finally {
      setUserLoading(false);
    }
  };

  return (
    <div className="hidden cursor-pointer items-center space-x-10 sm:flex [&>p]:transition-all [&>p]:duration-300 [&>p]:hover:scale-110 [&>p]:hover:text-primary">
      <p onClick={() => navigate("/")}>Home</p>
      {user?.seller ? (
        <>
          <p onClick={() => navigate("/dashboard")}>Dashboard</p>
          <p onClick={() => navigate("/dashboard/listings")}>My Listings</p>
          <p onClick={() => navigate("/discover")}>Browse</p>
        </>
      ) : (
        <>
          <p onClick={() => navigate("/discover")}>Listings</p>
        </>
      )}
      <p onClick={() => navigate("/dashboard/profile")}>Profile</p>

      {user.name !== "User" ? (
        <>
          <p onClick={handleLogout} className="flex cursor-pointer">
            Logout
            <LogOut size={18} className="relative top-[3px] ml-3" />
          </p>
        </>
      ) : (
        <>
          <p onClick={() => navigate("")}>Sign Up</p>
          <Button>Login</Button>
        </>
      )}
    </div>
  );
}
