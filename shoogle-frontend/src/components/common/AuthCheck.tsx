import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components/common";

const AuthCheck = ({ children }) => {
  const { userLoading } = useAuth();

  if (userLoading) {
    return <Loader />;
  }

  return children;
};

export default AuthCheck;
