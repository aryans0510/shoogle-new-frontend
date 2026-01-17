import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api";
import { toast } from "sonner";
import { getFirstName } from "@/utils";
import { LogOut } from "lucide-react";
import { AuthModal } from "@/components/modals";

export default function DesktopNavbar() {
  const { user, setUserLoading, clearContext } = useAuth();
  const navigate = useNavigate();
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: "shopping" | "selling";
    initialAuthMode: "login" | "signup";
  }>({
    isOpen: false,
    mode: "shopping",
    initialAuthMode: "signup",
  });

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

  const handleLogin = () => {
    setAuthModal({ isOpen: true, mode: "shopping", initialAuthMode: "login" });
  };

  const handleSignUp = () => {
    setAuthModal({ isOpen: true, mode: "selling", initialAuthMode: "signup" });
  };

  const handleAuthSuccess = () => {
    if (authModal.mode === "shopping") {
      navigate("/discover");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <div className="hidden cursor-pointer items-center space-x-10 sm:flex [&>p]:transition-all [&>p]:duration-300 [&>p]:hover:scale-110 [&>p]:hover:text-primary">
        <p onClick={() => navigate("/")}>Home</p>
        {user?.seller ? (
          <>
            <p onClick={() => navigate("/dashboard")}>Dashboard</p>
            <p onClick={() => navigate("/dashboard/listings")}>My Listings</p>
            <p onClick={() => navigate("/discover")}>Search</p>
            <p onClick={() => navigate("/dashboard/profile")}>Profile</p>
          </>
        ) : (
          <>
            <p onClick={() => navigate("/discover")}>Search</p>
          </>
        )}

        {user.name !== "User" ? (
          <>
            <p onClick={handleLogout} className="flex cursor-pointer">
              Logout
              <LogOut size={18} className="relative top-[3px] ml-3" />
            </p>
          </>
        ) : (
          <>
            <p onClick={handleSignUp}>Sign Up</p>
            <Button onClick={handleLogin}>Login</Button>
          </>
        )}
      </div>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
        mode={authModal.mode}
        onSuccess={handleAuthSuccess}
        initialAuthMode={authModal.initialAuthMode}
      />
    </>
  );
}
