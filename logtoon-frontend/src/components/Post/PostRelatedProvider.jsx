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

  const getFilteredPosts = async (filterParams, token) => {
    const { sort, ...requestFilterParams } = filterParams;
    requestFilterParams.minimumRating = filterParams.minimumRating * 2;

    const url = new URL(`${baseUrl}/posts`);
    url.search = new URLSearchParams(requestFilterParams).toString();
    try {
      const response = await fetch(url, {
        headers:
          token && token.length > 0 ? { Authorization: `Bearer ${token}` } : {},
      });

      const res = await response.json();

      if (response.ok) {
        console.log(res);
        return res;
      } else throw new Error(res.message + "\n" + " status: " + res.status);
    } catch (error) {
      alert(error);
    }
  };

  const likeorDislikeOrSaveOrUnsavePost = async (postId, token, type) => {
    try {
      const response = await fetch(`${baseUrl}/${type}/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      if (response.ok) {
        return res;
      } else
        throw new Error(
          `failed to ${type} post. message: ` +
            res.message +
            "\n" +
            " status: " +
            res.status,
        );
    } catch (error) {
      alert(error);
      throw error;
    }
  };

  const createPost = async (requestForm, token) => {
    try {
      const response = await fetch(`${baseUrl}/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: requestForm,
      });
      const res = await response.json();
      console.log(res);

      if (response.ok) {
        return res;
      } else throw new Error(res.message + "\n" + " status: " + res.status);
    } catch (error) {
      console.log(error);
      throw error;
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
        likeorDislikeOrSaveOrUnsavePost,
        createPost,
      }}
    >
      {children}
    </PostRelatedContext.Provider>
  );
}
