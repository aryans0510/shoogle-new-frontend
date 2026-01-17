import { toast } from "sonner";
import api from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

/**
 * Store user data in context after google callback i.e. if `token` is present as query params
 */
const useExchangeTokenAfterGoogleCallback = (type: "seller" | "user") => {
  const { setUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const success = params.get("success");

        if (success === "false") {
          toast.error("Some Error Occured");
          return;
        }
        if (success === "invalid") {
          toast.error("Invalid Google Credentials");
          return;
        }

        if (!token) return;
        const res = await api.get(`/auth/exchange?token=${token}&type=${type}`);
        if (res.data.success) {
          toast.success("Login Success");
          window.history.replaceState({}, "", "/discover");
          setUser(res.data.data);
        }
      } catch (error) {
        // console.log("error", error);
        toast.error(error.response.data.message || "Internal Server Error");
      }
    };

    handleCallback();
  }, []);
};

export default useExchangeTokenAfterGoogleCallback;
