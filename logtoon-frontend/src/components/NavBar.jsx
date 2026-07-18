import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useAuth } from "./AuthContext";

export default function NavBar() {
  const { user, openModal } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <nav className="bg-black shadow-xl border-b border-gray-800">
      <div className="flex justify-between items-center py-4 sm:py-5 px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Logo Link - Left Side */}
        <NavLink
          to="/"
          className="flex items-center gap-1 sm:gap-2 logo hover:opacity-80 transition-opacity flex-shrink-0"
        >
          <img
            src={logo}
            alt="logtoon-logo"
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full"
          />
          <span className="font-logo font-bold text-sm sm:text-base md:text-lg text-white">
            logtoon
          </span>
        </NavLink>

        {/* Menu - Right Side */}
        <div className="menu flex items-center gap-4 sm:gap-6">
          <div className="relative flex items-center gap-4">
            <button
              onClick={toggleSettings}
              className="flex items-center justify-center text-white hover:text-gray-300 transition-colors focus:outline-none"
              aria-label="Settings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 6.24 2.24l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 9 3.09V3a2 2 0 1 1 4 0v.09c.4.09.78.28 1.08.56l.1.1a1.65 1.65 0 0 0 1.82.33h.09a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09c.03.6.34 1.17.84 1.51z" />
              </svg>
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-md border border-gray-700 bg-slate-900 shadow-lg z-20">
                <NavLink
                  to="/#about"
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                >
                  About
                </NavLink>
                <NavLink
                  to="/#contact"
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                >
                  Contact
                </NavLink>
              </div>
            )}

            {user == null ? (
              <button
                className="bg-gray-50 px-3 py-1 rounded-sm cursor-pointer hover:bg-gray-300 transition-colors login-btn"
                onClick={openModal}
              >
                Login
              </button>
            ) : (
              <NavLink
                to={`/profile/${user.id}`}
                className={({ isActive }) =>
                  `px-3 py-1 rounded-sm cursor-pointer transition-colors ${
                    isActive
                      ? "bg-gray-400 text-gray-900"
                      : "bg-gray-50 hover:bg-gray-300"
                  }`
                }
              >
                Profile
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
