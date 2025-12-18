import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const Navbar = () => {
  const { user: authUser, logOut } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [backendUser, setBackendUser] = useState(null);

  useEffect(() => {
    if (authUser?.uid) {
      axiosSecure
        .get(`/user/${authUser.uid}`)
        .then((res) => {
          setBackendUser(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch backend user:", err);
        });
    } else {
      setBackendUser(null);
    }
  }, [authUser?.uid, axiosSecure]);

  useEffect(() => {
    document.querySelector("html")?.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const handleLogOut = () => {
    logOut()
      .then(() => toast.success("Logged out successfully"))
      .catch((error) => console.error(error));
  };

  const navLinks = (
    <>
      <Link to="/">
        <li className="m-2">Home</li>
      </Link>
      <Link to="/all-contests">
        <li className="m-2">All Contests</li>
      </Link>
      <Link to="/leaderboard">
        <li className="m-2">Leaderboard</li>
      </Link>
      <Link to="/how-it-works">
        <li className="m-2">How It Works</li>
      </Link>
      <Link to="/faq">
        <li className="m-2">FAQ</li>
      </Link>
    </>
  );

  const displayName =
    backendUser?.displayName ||
    authUser?.displayName ||
    authUser?.email ||
    "User";

  const photoURL =
    backendUser?.photoURL ||
    authUser?.photoURL ||
    "https://img.icons8.com/?size=100&id=21441&format=png&color=000000";

  return (
    <div className="navbar bg-base-100 lg:px-10 container mx-auto">
      <div className="navbar-start">
        <div className="dropdown dropdown-right">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow z-50"
          >
            {navLinks}
          </ul>
        </div>

        <Link
          to="/"
          className="group text-xl flex items-center gap-1 font-bold text-primary"
        >
          <Zap
            className="w-7 h-7 text-primary-foreground transition-transform duration-300 group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.8)] group-hover:scale-125 group-hover:rotate-12
"
          />
          <span className="text-2xl">ContestHub</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium text-lg">
          {navLinks}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {authUser ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="avatar online rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 cursor-pointer"
            >
              <div className="w-10 rounded-full">
                <img src={photoURL} alt="User avatar" />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box z-50 mt-2 w-48 p-2 shadow"
            >
              <li className="px-3 py-2 text-sm font-medium text-base-700">
                {displayName}
              </li>
              <div className="divider my-1"></div>
              <li>
                <Link to="/dashboard" className="flex items-center gap-2">
                  Dashboard
                </Link>
              </li>
              <div className="divider my-1"></div>
              <li>
                <button
                  onClick={handleLogOut}
                  className="btn btn-primary btn-sm w-full text-white"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/auth/login" className="btn btn-primary">
              Login
            </Link>
            <Link
              to="/auth/signup"
              className="btn btn-outline hidden md:inline-flex"
            >
              Register
            </Link>
          </div>
        )}

        <button onClick={toggleTheme} className="btn btn-circle ml-2">
          {theme === "light" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.36 5.66l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7M12 8a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21.64 13a9 9 0 01-9.64 8 9 9 0 01-.9-17.95 7 7 0 009.55 9.95z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
