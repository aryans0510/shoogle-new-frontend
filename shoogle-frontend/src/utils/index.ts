import { useAuth } from "@/contexts/AuthContext";

export const getFirstName = () => {
  const { user } = useAuth();
  const name = user.name;

  if (name.split(" ").length === 1) {
    return name;
  }

  return name.split(" ")[0];
};
