import { useState } from "react";
import { PostRelatedContext } from "./PostRelatedContext";

export default function PostRelatedProvider({ children }) {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [postAdjectives, setPostAdjectives] = useState({
    categories: [],
    cuisines: [],
    tags: [],
  });

  const openCreatePostModal = () => {
    setIsCreatePostModalOpen(true);
  };

  const closeCreatePostModal = () => {
    setIsCreatePostModalOpen(false);
  };

  const getPostAdjectives = async function () {
    try {
      const response = await fetch(
        "http://localhost:8081/api/logtoon/post/post-adjectives",
      );
      const res = await response.json();
      if (response.ok) {
        console.log(res);
        setPostAdjectives(res);
      } else throw new Error(res.message + "\n" + " status: " + res.status);
    } catch (error) {
      alert(error + "\nRefresh the page. Something went wrong!");
    }
  };

  return (
    <PostRelatedContext.Provider
      value={{
        isCreatePostModalOpen,
        postAdjectives,
        openCreatePostModal,
        closeCreatePostModal,
        getPostAdjectives,
      }}
    >
      {children}
    </PostRelatedContext.Provider>
  );
}
