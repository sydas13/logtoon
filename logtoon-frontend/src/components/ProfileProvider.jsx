import { useState } from "react";
import { useAuth } from "./AuthContext";
import { ProfileContext } from "./ProfileContext";

export default function ProfileProvider({ children }) {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  const getProfile = async function () {
    try {
      const response = await fetch(
        "http://localhost:8081/api/logtoon/user/profile",
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

  const getPosts = async function () {
    try {
      const response = await fetch(
        "http://localhost:8081/api/logtoon/user/posts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const res = await response.json();
      if (response.ok) {
        console.log(res);
        setPosts(res);
      } else {
        throw new Error(res.message + "\n" + " status: " + res.status);
      }
    } catch (error) {
      console.log(error);
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
        posts,
        getPosts,
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
