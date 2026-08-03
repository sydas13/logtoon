import { useState } from "react";
import { useAuth } from "./AuthContext";
import { ProfileContext } from "./ProfileContext";

export default function ProfileProvider({ children }) {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  const getProfile = async function (id) {
    try {
      const response = await fetch(
        `http://localhost:8081/api/logtoon/user/profile/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const res = await response.json();
      console.log(res);
      if (response.ok) setProfile(res);
      else throw new Error(res.message + "\n" + " status: " + res.status);
    } catch (err) {
      console.log(err);
    }
  };

  const updateProfile = async function (updates) {
    try {
      const response = await fetch(
        "http://localhost:8081/api/logtoon/user/profile",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: updates,
        },
      );

      const res = await response.json();

      console.log(res);
      if (response.ok) setProfile(res);
      else throw new Error(res.message + "\n" + " status: " + res.status);
    } catch (error) {
      console.log(error);
    }
  };

  const openCreatePostModal = () => {
    setIsCreatePostModalOpen(true);
  };

  const closeCreatePostModal = () => {
    setIsCreatePostModalOpen(false);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        getProfile,
        updateProfile,
        isCreatePostModalOpen,
        openCreatePostModal,
        closeCreatePostModal,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
