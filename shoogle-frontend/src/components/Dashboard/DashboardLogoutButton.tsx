import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";

const DashboardLogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
      onClick={async () => {
        await logout();
        navigate("/");
      }}
      type="button"
    >
      <LogOut className="h-4 w-4" />
      Log Out
    </Button>
  );
};

export default DashboardLogoutButton;
