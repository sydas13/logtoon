import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";
import settings_icon from "../assets/settings-icon.svg";
import { useAuth } from "./AuthContext";

export default function NavBar() {
  const { user, openModal } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <nav className="bg-white shadow-xl ">
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
              onClick={toggleSettings}
              className="flex items-center justify-center text-black focus:outline-none"
              aria-label="Settings"
            >
              <img
                src={settings_icon}
                alt="settings-icon"
                className="w-6 h-6 sm:w-10 sm:h-10 md:w-8 md:h-8 rounded-full cursor-pointer"
              />
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

            {user == null ? (
              <button
                className="bg-gray-200 px-3 py-1 rounded-sm cursor-pointer hover:bg-gray-300 transition-colors login-btn"
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
