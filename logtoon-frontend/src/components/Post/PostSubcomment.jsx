import { useState } from "react";
import { useComment } from "./CommentContext";
import { useAuth } from "../Auth/AuthContext";

export default function PostSubcomment({
  subcommentDetails,
  setSubcomments,
  setPost,
}) {
  const [subcomment, setSubcomment] = useState(subcommentDetails);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [reply, setReply] = useState("");
  const { addComment, likeOrDisLikeComment } = useComment();
  const { token } = useAuth();

  const handleLikeBtn = async (type) => {
    try {
      const res = await likeOrDisLikeComment(subcomment.id, token, type);
      setSubcomment(res);
    } catch (error) {
      alert(error);
    }
  };

  const handleAddSubComment = async (event, reply, comment) => {
    event.preventDefault();
    const trimmedReply = reply.trim();

    if (!trimmedReply) return;

    const requestBody = {
      comment: trimmedReply,
      postId: comment.postId,
      parentId: comment.id,
    };

    try {
      const res = await addComment(requestBody, token);

      setSubcomments((prev) => [...prev, res]);
      setShowReplyInput(false);
      setReply("");
      setPost((prev) => ({ ...prev, commentCount: prev.commentCount + 1 }));
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-3 py-2">
      <img
        src={`http://localhost:8081/api/logtoon/general/image/${subcomment.avatarFileName}`}
        alt={`${subcomment.username} profile`}
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold leading-4 text-slate-700">
          {subcomment.username}
        </p>
        <p className="mt-1 wrap-break-word text-sm leading-5 text-slate-800">
          <span className="font-semibold text-blue-900 hover:text-blue-800 cursor-pointer">{`@${subcomment?.parentUserName}`}</span>
          {` ${subcomment.value}`}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            aria-label={subcomment.isLiked ? "Unlike comment" : "Like comment"}
            className={`inline-flex items-center gap-1 text-sm font-medium ${subcomment.isLiked ? "text-pink-700" : "text-slate-500 hover:text-pink-700"}`}
            onClick={() =>
              handleLikeBtn(subcomment.isLiked ? "dislike" : "like")
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {subcomment.likesCount}
          </button>
          <button
            type="button"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
            onClick={() => setShowReplyInput((prev) => !prev)}
          >
            reply
          </button>
        </div>
        {showReplyInput ? (
          <form
            className="mt-2 flex gap-2"
            onSubmit={(event) => handleAddSubComment(event, reply, subcomment)}
          >
            <label className="sr-only" htmlFor={`reply-${subcomment.id}`}>
              Write a reply
            </label>
            <input
              id={`reply-${subcomment.id}`}
              type="text"
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder="Write a reply..."
              className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:border-slate-600"
            />
            <button
              type="submit"
              disabled={!reply.trim()}
              className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
