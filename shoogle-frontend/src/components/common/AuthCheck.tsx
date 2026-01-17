import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components/common";
import { ReactNode } from "react";

interface AuthCheckProps {
  children: ReactNode;
}

const AuthCheck = ({ children }: AuthCheckProps) => {
  const { userLoading } = useAuth();

  if (userLoading) {
    return <Loader />;
  }

  return children;
};

export default AuthCheck;
