import { CommentContext } from "./CommentContext";

export default function CommentProvider({ children }) {
  const baseUrl = "http://localhost:8081/api/logtoon/comment";

  const getComments = async (postId, token) => {
    try {
      const response = await fetch(`${baseUrl}/post/${postId}`, {
        headers: {
          headers:
            token && token.length > 0
              ? { Authorization: `Bearer ${token}` }
              : {},
        },
      });

      const res = await response.json();

      if (response.ok) {
        console.log(res);
        return res;
      } else throw new Error(res.message + "\n" + " status: " + res.status);
    } catch (error) {
      console.log(error);
    }
  };

  const getSubComments = async (postId, commentId, token) => {
    try {
      const response = await fetch(
        `${baseUrl}/post/${postId}/comment/${commentId}`,
        {
          headers: {
            headers:
              token && token.length > 0
                ? { Authorization: `Bearer ${token}` }
                : {},
          },
        },
      );

      const res = await response.json();

      if (response.ok) {
        console.log(res);
        return res;
      } else throw new Error(res.message + "\n" + " status: " + res.status);
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async (requestBody, token) => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/logtoon/comment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        },
      );

      const res = await response.json();
      if (response.ok) {
        console.log(res);
        return res;
      } else throw new Error(res.message + "\n" + " status: " + res.status);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const likeOrDisLikeComment = async (commentId, token, type) => {
    try {
      const response = await fetch(`${baseUrl}/${type}/${commentId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      if (response.ok) {
        console.log(res);
        return res;
      } else throw new Error(res.message + "\n" + " status: " + res.status);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <CommentContext.Provider
      value={{ getComments, addComment, getSubComments, likeOrDisLikeComment }}
    >
      {children}
    </CommentContext.Provider>
  );
}
