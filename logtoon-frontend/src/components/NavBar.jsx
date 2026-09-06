import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useAuth } from "./Auth/AuthContext";
import { usePostRelated } from "./Post/PostRelatedContext";

export default function NavBar() {
  const { user, openModal } = useAuth();
  const { openCreatePostModal } = usePostRelated();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <nav className="min-w-full bg-white shadow-xl">
      <div className="flex justify-between items-center py-4 sm:py-5 px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Logo Link - Left Side */}
        <NavLink
          to="/"
          className="flex items-center gap-1 sm:gap-2 logo hover:opacity-80 transition-opacity flex-shrink-0"
        >
          <img
            src={logo}
            alt="logtoon-logo"
            className="w-6 h-6 sm:w-10 sm:h-10 md:w-8 md:h-8 rounded-full"
          />
          <span className="font-logo font-bold text-sm sm:text-base md:text-lg text-black">
            share-a-bite
          </span>
        </NavLink>

        {/* Menu - Right Side */}
        <div className="menu flex items-center gap-4 sm:gap-6">
          <div className="relative flex items-center gap-4">
            <button
              title="Settings"
              onClick={toggleSettings}
              className="flex items-center justify-cente cursor-pointer"
              aria-label="Settings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                className="size-6 stroke-slate-900 hover:stroke-slate-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-md bg-gray-200 shadow-lg z-20">
                <NavLink
                  to="/#about"
                  className="block px-4 py-2 text-sm  hover:bg-gray-300 transition-colors"
                >
                  About
                </NavLink>
                <NavLink
                  to="/#contact"
                  className="block px-4 py-2 text-sm  hover:bg-gray-300 transition-colors"
                >
                  Contact
                </NavLink>
              </div>
            )}

            {user === null ? (
              <button
                className="bg-gray-200 px-3 py-1 rounded-sm cursor-pointer hover:bg-gray-300 transition-colors login-btn"
                onClick={openModal}
              >
                Login
              </button>
            ) : (
              <NavLink
                title="Profile"
                to={`/profile/${user.id}`}
                aria-label="Profile"
                className={({ isActive }) =>
                  `cursor-pointer hover:stroke-slate-500  ${isActive ? "stroke-slate-500" : "stroke-slate-900"}`
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </NavLink>
            )}

            {user !== null && (
              <button
                onClick={openCreatePostModal}
                title="Create new post"
                className="flex items-center justify-center cursor-pointer"
                aria-label="Create new post"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 stroke-slate-900 hover:stroke-slate-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
