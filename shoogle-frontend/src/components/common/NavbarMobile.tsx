import { useAuth } from "@/contexts/AuthContext";
import { NavLink, useNavigate } from "react-router";
import api from "@/api";
import { toast } from "sonner";

export default function NavbarMobile({ isBurgerOpen, toggleBurger }) {
  const { user, setUserLoading, clearContext } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setUserLoading(true);
      const res = await api.get("/auth/logout");
      toast.success(res.data.message, { description: "You have been logged out." });
      clearContext();
      navigate("/");
      toggleBurger();
    } catch (error) {
      console.log("error logging out", error);
      toast.error("Some error occurred");
    } finally {
      setUserLoading(false);
    }
  };

  return (
    <div
      className={`${isBurgerOpen ? "translate-x-0" : "-translate-x-500"} fixed top-0 z-1 flex h-screen w-screen flex-col items-center justify-center space-y-10 bg-neutral-300 transition-transform *:rounded-md *:bg-neutral-800 *:px-10 *:py-2 *:text-white`}
    >
      <NavLink to="/" onClick={toggleBurger}>
        Home
      </NavLink>
      {user?.seller ? (
        <>
          <NavLink to="/dashboard" onClick={toggleBurger}>
            Dashboard
          </NavLink>
          <NavLink to="/dashboard/listings" onClick={toggleBurger}>
            My Listings
          </NavLink>
          <NavLink to="/discover" onClick={toggleBurger}>
            Browse
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/discover" onClick={toggleBurger}>
            Listings
          </NavLink>
        </>
      )}
      <NavLink to="/dashboard/profile" onClick={toggleBurger}>
        Profile
      </NavLink>
      {user?.name && user?.name !== "User" ? (
        <button onClick={handleLogout} className="rounded-md bg-neutral-800 px-10 py-2 text-white">
          Logout
        </button>
      ) : (
        <>
          <NavLink to="/" onClick={toggleBurger}>
            Sign Up
          </NavLink>
          <NavLink to="/" onClick={toggleBurger}>
            Login
          </NavLink>
        </>
      )}
    </div>
  );
}
