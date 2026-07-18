import { useState } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("site") || "");
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openModal = function () {
    setIsAuthOpen(true);
  };

  const closeModal = function () {
    setIsAuthOpen(false);
  };

  const loginAction = async function (data) {
    try {
      const response = await fetch(
        "http://localhost:8081/api/logtoon/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const res = await response.json();
      console.log(res);
      if (response.ok) {
        setUser(res.user);
        localStorage.setItem("site", res.token);
        setToken(res.token);
        alert("Successfully logged in!");
        return res.user;
      } else {
        throw new Error(res.message + "\n" + " status: " + res.status);
      }
    } catch (error) {
      alert(error);
      throw error;
    }
  };

  const registerAction = async function (data) {
    try {
      const response = await fetch(
        "http://localhost:8081/api/logtoon/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      const res = await response.json();
      console.log(res);
      if (response.ok) {
        alert("Successfully registered!");
      } else {
        throw new Error(res.message + "\n" + " status: " + res.status);
      }
    } catch (error) {
      alert(error);
      throw error;
    }
  };

  const getUser = async () => {
    if (!token || user) return;

    try {
      const response = await fetch(
        "http://localhost:8081/api/logtoon/user/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const res = await response.json();
      if (!response.ok)
        throw new Error(res.message + "\n" + " status: " + res.status);
      else setUser(res);
    } catch (error) {
      console.log(error);
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        registerAction,
        loginAction,
        isAuthOpen,
        openModal,
        closeModal,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
