import { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import PostComment from "./PostComment";
import { useComment } from "./CommentContext";

export default function PostCommentContainer({ postId, setPost }) {
  const [comments, setComments] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const { token } = useAuth();
  const { getComments, addComment } = useComment();

  useEffect(() => {
    const loadComments = async () => {
      const res = await getComments(postId, token);
      setComments(res);
    };

    loadComments();
  }, []);

  const handleAddComment = async (event) => {
    event.preventDefault();

    const trimmedComment = commentInput.trim();

    if (!trimmedComment) return;

    const requestBody = {
      comment: trimmedComment,
      postId,
    };

    try {
      const res = await addComment(requestBody, token);

      setComments((prev) => [...prev, res]);
      setCommentInput("");
      setPost((prev) => ({ ...prev, commentCount: prev.commentCount + 1 }));
    } catch (error) {
      alert(error);
    }
  };

  return (
    <section
      className="comment-section mt-3 border-t border-black/10 pt-4"
      aria-label="Comments"
    >
      {!comments ? (
        "loading"
      ) : (
        <div className="mb-4 max-h-96 min-h-0 overflow-y-auto pr-1">
          <div className="space-y-3">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <PostComment
                  key={`${comment.id}`}
                  commentDetails={comment}
                  setPost={setPost}
                ></PostComment>
              ))
            ) : (
              <p className="text-sm text-slate-500">Be the first to comment.</p>
            )}
          </div>
        </div>
      )}

      <form className="flex gap-2" onSubmit={handleAddComment}>
        <label className="sr-only" htmlFor={`comment-${postId}`}>
          Write a comment
        </label>
        <input
          id={`comment-${postId}`}
          type="text"
          value={commentInput}
          onChange={(event) => setCommentInput(event.target.value)}
          placeholder="Write a comment..."
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white/70 px-3 py-2 text-sm outline-none focus:border-slate-600"
        />
        <button
          type="submit"
          disabled={!commentInput.trim()}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Post
        </button>
      </form>
    </section>
  );
}
