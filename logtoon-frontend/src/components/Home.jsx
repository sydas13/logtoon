import { useEffect, useState } from "react";
import FilterSidebar from "./FilterSidebar";
import PostCard from "./PostCard";
import { usePostRelated } from "./PostRelatedContext";
import { useProfile } from "./ProfileContext";
import { useAuth } from "./AuthContext";

const initialFilterParams = {
  cuisines: [],
  categories: [],
  tags: [],
  minimumRating: 0,
  page: 0,
  size: 6,
  sort: "newest",
  sortBy: "createdAt",
  sortDirection: "desc",
};

export default function Home() {
  const { getFilteredPosts } = usePostRelated();
  const [postData, setPostData] = useState(null);
  const [filterParams, setFilterParams] = useState(initialFilterParams);
  const { token } = useAuth();

  useEffect(() => {
    const loadInitialafailteredPosts = async () => {
      const data = await getFilteredPosts(filterParams, token);
      setPostData(data);
    };

    loadInitialafailteredPosts();
  }, [filterParams]);

  const goToNextPage = () => {
    if (postData.last) return;
    setFilterParams((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const goToPrevPage = () => {
    if (postData.first) return;
    setFilterParams((prev) => ({ ...prev, page: prev.page - 1 }));
  };

  const resetFilters = () => {
    setFilterParams(initialFilterParams);
  };

  const loadFilteredPosts = async () => {
    const data = await getFilteredPosts(filterParams);
    setPostData(data);
  };

  return (
    <div className="flex ">
      <FilterSidebar
        filterParams={filterParams}
        setFilterParams={setFilterParams}
        resetFilters={resetFilters}
        handleFilter={loadFilteredPosts}
      />
      {!postData ? (
        "loading"
      ) : (
        <div className="flex flex-col gap-6">
          <div className="post-container columns-1 sm:columns-2 lg:columns-3 py-2 px-5 sm:px-3">
            {postData.content.map((post) => (
              <div key={post.id} className="break-inside-avoid mb-6">
                <PostCard postData={post} key={post.id} />
              </div>
            ))}
          </div>

          {postData.content.length > 0 && (
            <div className="post-body-navigation flex w-full flex-row justify-center gap-30 mb-6">
              <button
                title="go to previous page"
                onClick={goToPrevPage}
                aria-label="prev-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`size-8 hover:cursor-pointer ${postData.first ? "fill-white stroke-1 stroke-black hover:fill-white" : ""} hover:fill-gray-700`}
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <button
                title="go to next page"
                onClick={goToNextPage}
                aria-label="next-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`size-8 hover:cursor-pointer ${postData.last ? "fill-white stroke-1 stroke-black hover:fill-white" : ""} hover:fill-gray-700`}
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
