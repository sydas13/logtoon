import { useState } from "react";
import { useImageViewer } from "../Image/ImageViewerContext";
import { usePostRelated } from "./PostRelatedContext";
import { useAuth } from "../Auth/AuthContext";
import PostCommentContainer from "./PostCommentContainer";

export default function PostCard({ postData }) {
  const [post, setPost] = useState(postData);
  const [imageDisplayCount, setImageDisplayCount] = useState(2);
  const [showMoreReview, setShowMoreReview] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const { handleOpen } = useImageViewer();
  const { likeorDislikeOrSaveOrUnsavePost } = usePostRelated();
  const { token } = useAuth();

  const showAllImages = (e) => {
    e.stopPropagation();
    setImageDisplayCount(post.imageFiles.length);
  };

  const showLessImages = (e) => {
    e.stopPropagation();
    setImageDisplayCount(2);
  };

  const handleLikeOrSaveBtn = async (type) => {
    try {
      const res = await likeorDislikeOrSaveOrUnsavePost(post.id, token, type);
      setPost(res);
    } catch (error) {
      console.log(error);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    return Array.from({ length: 5 }, (_, index) => {
      const offset =
        index < fullStars
          ? "100%"
          : index === fullStars && fullStars !== rating && rating !== 0
            ? "50%"
            : "0%";

      return (
        <svg
          key={`${post.id}-${index}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-5 h-5 cursor-pointer"
        >
          <defs>
            <linearGradient id={`grad-${post.id}-${index}`}>
              <stop offset={offset} stopColor="#ffa534" />
              <stop offset={offset} stopColor="grey" />
            </linearGradient>
          </defs>

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`url(#grad-${post.id}-${index})`}
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      );
    });
  };

  const postRating = post.rating / 2.0;

  return (
    <article className="relative h-auto max-w-xl min-w-sm rounded-3xl p-4 shadow-2xl shadow-black/30 sm:p-5 text-black">
      <header className="post-header flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3 ">
          <img
            src={`http://localhost:8081/api/logtoon/general/image/${post.avatarFile}`}
            alt={`${post.profileName} profile`}
            className="h-12 w-12 rounded-full object-cover "
          />
          <div>
            <p className="text-base font-semibold">{post.profileName}</p>
            <p className="text-sm text-slate-600">{post.username}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <div className="inline-flex items-center text-sm">
            {renderStars(postRating)}
            {/* <span className="ml-1 leading-none">{postRating.toFixed(1)}/5</span> */}
          </div>
          <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-slate-600 shadow-lg shadow-slate-950/25 backdrop-blur-sm">
            SPENT: {post.moneySpent}
          </div>
        </div>
      </header>
      <div className="flex flex-wrap items-center gap-2 mt-4">
        {post.categories.map((category, index) => (
          <button
            key={`${post.id}-${index}`}
            className=" bg-green-700 hover:bg-green-600 px-2 py-1 text-sm text-white whitespace-nowrap cursor-pointer"
          >
            {category}
          </button>
        ))}

        {post.cuisines.map((cuisine, index) => (
          <button
            key={`${post.id}-${index}`}
            className=" bg-red-900 hover:bg-red-700 px-2 py-1 text-sm text-white whitespace-nowrap cursor-pointer"
          >
            {cuisine}
          </button>
        ))}
      </div>
      <div className="mt-5">
        <div className="grid grid-cols-2 gap-2">
          {post.imageFiles
            .slice(0, imageDisplayCount)
            .map((imageFile, index) => (
              <button
                key={imageFile}
                type="button"
                className="group relative overflow-hidden rounded-2xl bg-slate-700/10 aspect-square cursor-pointer"
                onClick={() => {
                  handleOpen(post.imageFiles, index);
                }}
              >
                <img
                  src={`http://localhost:8081/api/logtoon/general/image/${imageFile}`}
                  alt={`Food preview ${index + 1}`}
                  className="h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
                />
                {index === imageDisplayCount - 1 &&
                post.imageFiles.length > imageDisplayCount ? (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-slate-950/65 text-lg font-semibold text-white cursor-pointer"
                    onClick={showAllImages}
                  >
                    +{post.imageFiles.length - imageDisplayCount}
                  </div>
                ) : null}
              </button>
            ))}
        </div>
        {post.imageFiles.length > 2 &&
        imageDisplayCount === post.imageFiles.length ? (
          <div className="mt-3 text-right">
            <button
              type="button"
              onClick={showLessImages}
              className="text-sm font-semibold cursor-pointer text-slate-600 hover:text-black"
            >
              Show less
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <p className="text-md leading-7 wrap-break-word">
            {showMoreReview ? post.review : post.review.substring(0, 270)}
            {post.review.length > 270 && (
              <button
                type="button"
                onClick={() => {
                  setShowMoreReview((prev) => !prev);
                }}
                className="ml-1 inline text-sm font-semibold cursor-pointer text-slate-600 hover:text-black"
              >
                {showMoreReview ? "Show Less" : "Show More"}
              </button>
            )}
          </p>
          {
            <p className="text-sm flex gap-2 leading-7 wrap-break-word">
              {post.tags.map((tag, index) => (
                <span
                  className="text-blue-900 hover:text-blue-950 font-semibold cursor-pointer"
                  key={`${post.id}-${index}`}
                >
                  #{tag}
                </span>
              ))}
            </p>
          }
          <p className="mt-1 text-xs  text-slate-800">{post.createdAt}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="text-lg">📍</span>
          <span className="text-slate-600">{post.location} </span>
        </div>
      </div>
      <div className="justify-end mt-2 flex items-center gap-1 text-black">
        <button
          aria-label="Like"
          className="flex items-center gap-2 px-3 py-1 cursor-pointer"
          onClick={() =>
            post.isLiked
              ? handleLikeOrSaveBtn("dislike")
              : handleLikeOrSaveBtn("like")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${post.isLiked ? "fill-pink-700 hover:stroke-0" : "fill-white stroke-slate-600 stroke-2 hover:bg-pink-200"} `}
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="text-sm ">{post.likesCount}</span>
        </button>

        <button
          aria-label="Comments"
          className="flex items-center gap-2 px-3 py-1 cursor-pointer"
          onClick={() => setIsCommentOpen((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 stroke-2 ${isCommentOpen ? "stroke-black fill-white" : " stroke-slate-600 fill-white hover:bg-slate-200"} `}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21 6h-18v12h4v4l4-4h10z" />
          </svg>
          <span className="text-sm ">{post.commentCount}</span>
        </button>

        <button
          aria-label="Save"
          className="flex items-center gap-2 px-3 py-1 cursor-pointer"
          onClick={() =>
            post.isSaved
              ? handleLikeOrSaveBtn("unsave")
              : handleLikeOrSaveBtn("save")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${post.isSaved ? "fill-slate-500 hover:stroke-0" : "fill-white stroke-slate-600 stroke-2 hover:bg-slate-200"} `}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M6 2h12v20l-6-4-6 4z" />
          </svg>
          <span className="text-sm ">{post.savesCount}</span>
        </button>
      </div>
      {isCommentOpen ? (
        <PostCommentContainer
          postId={post.id}
          setPost={setPost}
        ></PostCommentContainer>
      ) : null}
    </article>
  );
}
