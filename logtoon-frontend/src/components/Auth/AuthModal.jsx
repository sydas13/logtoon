import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAuth } from "./AuthContext";

export default function AuthModal() {
  const [mode, setMode] = useState("login");
  const { isAuthOpen, closeModal } = useAuth();

  if (!isAuthOpen) return null;

  const switchToLogin = function () {
    setMode("login");
  };

  const switchToRegister = function () {
    setMode("register");
  };

  return (
    <div
      className="
        fixed inset-0
        flex items-center justify-center
        bg-black/30
        backdrop-blur-sm
        z-50
      "
    >
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg relative">
        <button
          onClick={closeModal}
          className="
            absolute
            top-3
            right-4
            text-gray-500
            hover:text-black
            text-2xl
            cursor-pointer
          "
        >
          ×
        </button>
        {/* Login/Register Form */}
        {mode === "login" ? (
          <LoginForm switchToRegister={switchToRegister} />
        ) : (
          <RegisterForm switchToLogin={switchToLogin} />
        )}
      </div>
    </div>
  );
}
