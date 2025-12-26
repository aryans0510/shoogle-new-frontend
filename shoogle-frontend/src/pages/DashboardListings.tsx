import React from "react";
import { SellerListings } from "@/components/Dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router";

const DashboardListings = () => {
  const { user } = useAuth();

  // Redirect non-sellers to discover page
  if (!user?.seller) {
    return <Navigate to="/discover" replace />;
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <SellerListings />
      </div>
    </div>
  );
};

export default DashboardListings;


