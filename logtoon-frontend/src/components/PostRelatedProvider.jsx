import { useState } from "react";
import { PostRelatedContext } from "./PostRelatedContext";

export default function PostRelatedProvider({ children }) {
  const baseUrl = "http://localhost:8081/api/logtoon/post";

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
      const response = await fetch(`${baseUrl}/post-adjectives`);
      const res = await response.json();
      if (response.ok) {
        setPostAdjectives(res);
      } else throw new Error(res.message + "\n" + " status: " + res.status);
    } catch (error) {
      alert(error + "\nRefresh the page. Something went wrong!");
    }
  };

  const getFilteredPosts = async (filterParams) => {
    const { sort, ...requestFilterParams } = filterParams;
    requestFilterParams.minimumRating = filterParams.minimumRating * 2;

    const url = new URL(`${baseUrl}/posts`);
    url.search = new URLSearchParams(requestFilterParams).toString();

    try {
      const response = await fetch(url);
      const res = await response.json();
      if (response.ok) {
        console.log(res);
        return res;
      } else throw new Error(res.message + "\n" + " status: " + res.status);
    } catch (error) {
      alert(error);
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
        getFilteredPosts,
      }}
    >
      {children}
    </PostRelatedContext.Provider>
  );
}
