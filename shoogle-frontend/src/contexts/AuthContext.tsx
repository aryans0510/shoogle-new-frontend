import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/api";

interface User {
  id?: string;
  name: string;
  seller: boolean;
  isOnboarded?: boolean;
  // businessName?: string;
  // avatar?: string;
  // whatsapp?: string;
}

interface UserContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  userLoading: boolean;
  setUserLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
  clearContext: () => void;
}

const AuthContext = createContext<UserContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    name: "User",
    seller: false,
    isOnboarded: false,
  });
  const [userLoading, setUserLoading] = useState<boolean>(true);

  // If user has accessToken, setup context
  useEffect(() => {
    const authStatus = async () => {
      try {
        const res = await api.get("/auth/status");
        setUser(res.data.data);
      } catch (error) {
        console.log("error setting User", error.response.data);
      } finally {
        setUserLoading(false);
      }
    };
    authStatus();
  }, []);

  const clearContext = () => {
    setUser({
      name: "User",
      seller: false,
      isOnboarded: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userLoading,
        setUserLoading,
        isAuthenticated: user.name !== "User",
        clearContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
