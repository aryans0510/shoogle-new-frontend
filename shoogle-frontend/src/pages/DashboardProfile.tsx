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

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      if (!user) return;
      
      try {
        const response = await api.get("/user/seller-profile");
        if (response.data?.success && response.data?.data) {
          setProfile(response.data.data);
        } else {
          setProfile(null);
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        setProfile(null);
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
      const response = await api.put("/user/seller-profile", {
        [field]: value,
      });
      
      if (response.data?.success && response.data?.data) {
        setProfile(response.data.data);
      } else {
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
    <div className="min-h-screen bg-neutral-50">
      {/* Top Header */}
      <div className="relative flex items-center justify-center border-b bg-neutral-50 py-4 text-white">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => navigate("/dashboard")}
          aria-label="Go Back"
          className="absolute top-1/2 left-4 -translate-y-1/2"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <span className="w-full text-center text-xl font-bold tracking-wide text-zinc-950">
          Profile &amp; Business Details
        </span>
      </div>
      <div className="flex w-full flex-col items-center px-1 pt-5 pb-10 sm:px-2 sm:py-8">
        <div className="w-full max-w-2xl">
          <DashboardProfileContent
            profile={profile}
            user={user}
            onProfileUpdate={handleProfileUpdate}
            onPhotoUpdate={updatePhoto}
            updatingPhoto={updatingPhoto}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile;
