import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import DashboardProfileContent from "@/components/Dashboard/DashboardProfileContent";
import api from "@/api";

const DashboardProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingPhoto, setUpdatingPhoto] = useState(false);
  const navigate = useNavigate();

  // Redirect buyers to dashboard
  useEffect(() => {
    if (user && !user.seller) {
      navigate("/dashboard");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      if (!user) return;
      
      // Debug: Let's see what user data we actually have
      console.log("User data available:", user);
      
      try {
        // For sellers, fetch seller profile; for buyers, create a basic profile from user data
        if (user.seller) {
          const response = await api.get("/user/seller-profile");
          if (response.data?.success && response.data?.data) {
            // Merge seller profile with user data to ensure we have all available info
            const mergedProfile = {
              ...response.data.data,
              // Ensure we have user data as fallbacks
              full_name: response.data.data.full_name || user.name,
              email: response.data.data.email || user.email,
              phone: response.data.data.phone || user.phone,
            };
            setProfile(mergedProfile);
          } else {
            // If no seller profile exists, create a comprehensive one from user data
            setProfile({
              full_name: user.name,
              email: user.email,
              phone: user.phone,
              // Add any other fields that might be available
              id: user.id,
            });
          }
        } else {
          // For buyers, create a comprehensive profile from all available user data
          console.log("Creating buyer profile from user data:", {
            full_name: user.name,
            email: user.email,
            phone: user.phone,
            id: user.id,
            location: user.location,
            avatar_url: user.avatar_url,
          });
          
          const buyerProfile = {
            full_name: user.name || "Test User", // Fallback for testing
            email: user.email || "test@example.com", // Fallback for testing
            phone: user.phone || "+91 9876543210", // Fallback for testing
            id: user.id,
            location: user.location || "Mumbai, India", // Fallback for testing
            // Add any other fields that might be available in user object
            ...(user.avatar_url && { avatar_url: user.avatar_url }),
          };
          
          console.log("Final buyer profile:", buyerProfile);
          setProfile(buyerProfile);
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        // Fallback to comprehensive profile from user data
        setProfile({
          full_name: user.name,
          email: user.email,
          phone: user.phone,
          id: user.id,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleProfileUpdate = (p: any) => {
    setProfile(p);
  };

  const updatePhoto = async (field: "avatar_url" | "background_photo_url", value: string) => {
    if (!user) return;
    setUpdatingPhoto(true);
    
    try {
      // Only sellers can update photos through seller-profile endpoint
      if (user.seller) {
        const response = await api.put("/user/seller-profile", {
          [field]: value,
        });
        
        if (response.data?.success && response.data?.data) {
          setProfile(response.data.data);
        } else {
          setProfile({ ...profile, [field]: value });
        }
      } else {
        // For buyers, just update the local state (or implement a buyer profile endpoint)
        setProfile({ ...profile, [field]: value });
      }
    } catch (error: any) {
      console.error("Error updating photo:", error);
      // Optimistically update UI
      setProfile({ ...profile, [field]: value });
    } finally {
      setUpdatingPhoto(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-lg rounded-lg bg-white p-8 text-center shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Please Sign In</h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-lg rounded-lg bg-white p-8 text-center shadow-sm">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-lg rounded-lg bg-white p-8 text-center shadow-sm">
          <p>Could not load your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/10">
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => navigate("/dashboard")}
              aria-label="Go Back"
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {user.seller ? "Profile & Business Details" : "Profile"}
              </h1>
              <p className="text-sm text-gray-600">
                {user.seller ? "Manage your profile and business information" : "Manage your profile information"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <DashboardProfileContent
          profile={profile}
          user={user}
          onProfileUpdate={handleProfileUpdate}
          onPhotoUpdate={updatePhoto}
          updatingPhoto={updatingPhoto}
        />
      </div>
    </div>
  );
};

export default DashboardProfile;
