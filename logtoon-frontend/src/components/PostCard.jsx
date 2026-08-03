import { useState } from "react";
import { useImageViewer } from "./ImageViewerContext";

export default function PostCard() {
  const [post, setPost] = useState({
    profilePic:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    name: "Ava Carter",
    username: "@avafoodie",
    rating: 2.5,
    spent: "$4200",
    location: "Downtown Bistro, Seattle ",
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit  ",
    photos: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    ],
    likes: 24,
    comments: 12,
    saves: 5,
    isLiked: false,
    isSaved: false,
  });

  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const [imageDisplayCount, setImageDisplayCount] = useState(2);
  const { handleOpen } = useImageViewer();

  const handleLike = () => {
    const addOrSubtract = post.isLiked ? -1 : 1;
    setPost((prev) => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.likes + addOrSubtract,
    }));
  };

  const handleSave = () => {
    const addOrSubtract = post.isSaved ? -1 : 1;
    setPost((prev) => ({
      ...prev,
      isSaved: !prev.isSaved,
      saves: prev.saves + addOrSubtract,
    }));
  };

  const handleOpenOrClose = () => {
    setIsCommentOpen((prev) => !prev);
  };

  const showAllImages = (e) => {
    e.stopPropagation();
    setImageDisplayCount(post.photos.length);
  };

  const showLessImages = (e) => {
    e.stopPropagation();
    setImageDisplayCount(2);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    console.log(fullStars);
    return Array.from({ length: 5 }, (_, index) => {
      const offset =
        index < fullStars ? "100%" : index === fullStars ? "50%" : "0%";
      return (
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          className="w-4 h-4 "
          viewBox="0 0 32 32"
        >
          <defs>
            <linearGradient id={`grad-${index}`}>
              <stop offset={offset} stop-color="#ba8718" />
              <stop offset={offset} stop-color="grey" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#grad-${index})`}
            d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,12.118
  l11.547-1.2L16.026,0.6L20.388,10.918z"
          />
        </svg>
      );
    });
  };

  return (
    <article className="relative w-full max-w-xl rounded-3xl p-4 shadow-2xl shadow-black/30 sm:p-5 ml-13 mb-13 text-black">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.profilePic}
            alt={`${post.name} profile`}
            className="h-12 w-12 rounded-full object-cover "
          />
          <div>
            <p className="text-base font-semibold">{post.name}</p>
            <p className="text-sm text-slate-600">{post.username}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex items-center gap-1 text-sm ">
            {renderStars(post.rating)}
            <span className="ml-1">{post.rating.toFixed(1)}/5</span>
          </div>
          <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-slate-600 shadow-lg shadow-slate-950/25 backdrop-blur-sm">
            SPENT: {post.spent}
          </div>
        </div>
      </header>

      <div className="mt-5">
        <div className="grid grid-cols-2 gap-2">
          {post.photos.slice(0, imageDisplayCount).map((photo, index) => (
            <button
              key={photo}
              type="button"
              className="group relative overflow-hidden rounded-2xl bg-slate-700/10 aspect-square cursor-pointer"
              onClick={() => {
                handleOpen(post.photos, index);
              }}
            >
              <img
                src={photo}
                alt={`Food preview ${index + 1}`}
                className="h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
              />
              {index === imageDisplayCount - 1 &&
              post.photos.length > imageDisplayCount ? (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-slate-950/65 text-lg font-semibold text-white cursor-pointer"
                  onClick={showAllImages}
                >
                  +{post.photos.length - imageDisplayCount}
                </div>
              ) : null}
            </button>
          ))}
        </div>
        {imageDisplayCount === post.photos.length ? (
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
        <p className="text-sm leading-7">{post.review}</p>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="text-lg">📍</span>
          <span className="text-slate-600">{post.location}</span>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 flex items-center gap-1 text-black">
        <button
          aria-label="Like"
          className="flex items-center gap-2 px-3 py-1 cursor-pointer"
          onClick={handleLike}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${post.isLiked ? "fill-pink-700 hover:stroke-0" : "fill-white stroke-slate-600 stroke-2 hover:bg-pink-200"} `}
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="text-sm ">{post.likes}</span>
        </button>

        <button
          aria-label="Comments"
          className="flex items-center gap-2 px-3 py-1 cursor-pointer"
          onClick={handleOpenOrClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 stroke-2 ${isCommentOpen ? "stroke-black fill-white" : " stroke-slate-600 fill-white hover:bg-slate-200"} `}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21 6h-18v12h4v4l4-4h10z" />
          </svg>
          <span className="text-sm ">{post.comments}</span>
        </button>

        <button
          aria-label="Save"
          className="flex items-center gap-2 px-3 py-1 cursor-pointer"
          onClick={handleSave}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${post.isSaved ? "fill-slate-500 hover:stroke-0" : "fill-white stroke-slate-600 stroke-2 hover:bg-slate-200"} `}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M6 2h12v20l-6-4-6 4z" />
          </svg>
          <span className="text-sm ">{post.saves}</span>
        </button>
      </div>
    </article>
  );
}
