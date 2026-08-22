import { useEffect, useState } from "react";
import ProfileEditModal from "./ProfileEditModal";
import { useProfile } from "./ProfileContext";
import { useAuth } from "./AuthContext";
import PostCard from "./PostCard";
import FilterSidebar from "./FilterSidebar";

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

export default function Profile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user } = useAuth();
  const { profile, getProfile, getFilteredPosts, profileUpdated } =
    useProfile();
  const [postData, setPostData] = useState(null);
  const [filterParams, setFilterParams] = useState(initialFilterParams);

  useEffect(() => {
    async function fetchProfile() {
      await getProfile();
    }

    fetchProfile();
  }, [profileUpdated]);

  useEffect(() => {
    async function fetchPosts() {
      const data = await getFilteredPosts(filterParams);
      setPostData(data);
    }

    fetchPosts();
  }, [profileUpdated, filterParams]);

  const loadFilteredPosts = async () => {
    const data = await getFilteredPosts(filterParams);
    setPostData(data);
  };

  const openEditModal = function () {
    setIsEditModalOpen(true);
  };

  const closeEditModal = function () {
    setIsEditModalOpen(false);
  };

  const resetFilters = () => {
    setFilterParams(initialFilterParams);
  };

  const goToNextPage = () => {
    if (postData.last) return;
    setFilterParams((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const goToPrevPage = () => {
    if (postData.first) return;
    setFilterParams((prev) => ({ ...prev, page: prev.page - 1 }));
  };

  if (!profile) {
    return <p className="">Loading...</p>;
  }

  const avatarURL = `http://localhost:8081/api/logtoon/general/image/${profile.avatarFileName}`;

  return (
    <div className="flex w-full items-start gap-2">
      <FilterSidebar
        filterParams={filterParams}
        setFilterParams={setFilterParams}
        resetFilters={resetFilters}
        handleFilter={loadFilteredPosts}
      />
      <div className="profile-div flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 py-8 px-4 sm:px-5 md:px-10 lg:px-12">
          <div className="profile-picture w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-black rounded-full overflow-hidden flex-shrink-0">
            <img
              src={avatarURL}
              alt="profile-pic"
              className="w-full h-full object-cover"
            ></img>
          </div>
          <div className="profile-about flex flex-col w-full">
            <div className="flex flex-col gap-0.2 mb-3">
              <p className="profile-about-name text-lg sm:text-xl md:text-2xl font-semibold">
                {profile.name}
              </p>
              <span className="profile-about-username text-sm sm:text-base text-gray-600 font-medium">
                @{user.username}
              </span>
            </div>
            <div className="profile-about-stats flex gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm md:text-base flex-wrap">
              <span className="followers">
                <strong className="text-gray-600">
                  {profile.followerCount}
                </strong>{" "}
                Followers
              </span>
              <span className="following">
                <strong className="text-gray-600">
                  {profile.followingCount}
                </strong>{" "}
                Following
              </span>
              <span className="places-visited">
                <strong className="text-gray-600">
                  {profile.placesVisited}
                </strong>{" "}
                Places visited
              </span>
              <span className="hearts">
                <strong className="text-gray-600">{profile.heartCount}</strong>{" "}
                Hearts
              </span>
              <button className="profile-badge bg-green-700 text-white px-2 py-1 w-fit text-sm ">
                #{profile.badge}
              </button>
            </div>
            <p className="profile-about-bio mb-3 text-sm sm:text-base text-gray-600">
              {profile.bio}
            </p>
            <button
              className="profile-about-edit-btn border-1 hover:bg-gray-600 hover:text-white  px-3 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors duration-200 w-fit text-xs sm:text-sm font-semibold cursor-pointer"
              onClick={openEditModal}
            >
              edit profile
            </button>
          </div>
          {isEditModalOpen && (
            <ProfileEditModal closeEditModal={closeEditModal} />
          )}
        </div>

        {!postData ? (
          "loading"
        ) : (
          <div className="flex flex-col gap-6">
            <div className="post-container columns-1 sm:columns-2 lg:columns-3 py-2 px-5 sm:px-3">
              {postData.content.map((post) => (
                <div key={post.id} className="break-inside-avoid mb-6">
                  <PostCard post={post} key={post.id} />
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
    </div>
  );
}
