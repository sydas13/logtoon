import { useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { ProfileContext } from "./ProfileContext";

export default function ProfileProvider({ children }) {
  const baseUrl = "http://localhost:8081/api/logtoon/user";
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);

  const getProfile = async function () {
    try {
      const response = await fetch(`${baseUrl}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();
      console.log(res);
      if (response.ok) setProfile(res);
      else throw new Error(res.message + "\n" + " status: " + res.status);
    } catch (err) {
      console.log(err);
    }
  };

  const getFilteredPosts = async function (filterParams) {
    const { sort, ...requestFilterParams } = filterParams;
    requestFilterParams.minimumRating = filterParams.minimumRating * 2;

    const url = new URL(`${baseUrl}/posts`);
    url.search = new URLSearchParams(requestFilterParams).toString();

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();
      if (response.ok) {
        console.log(res);
        return res;
      } else {
        throw new Error(res.message + "\n" + " status: " + res.status);
      }
    } catch (error) {
      alert(error);
    }
  };

  const updateProfile = async function (updates) {
    try {
      const response = await fetch(`${baseUrl}/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: updates,
      });

      const res = await response.json();

      console.log(res);
      if (response.ok) setProfile(res);
      else throw new Error(res.message + "\n" + " status: " + res.status);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        getProfile,
        getFilteredPosts,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
