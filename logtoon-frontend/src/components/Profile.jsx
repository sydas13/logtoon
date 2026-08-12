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
  size: 5,
  sort: "newest",
  sortBy: "createdAt",
  sortDirection: "desc",
};

export default function Profile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user } = useAuth();
  const { profile, getProfile, getFilteredPosts } = useProfile();
  const [posts, setPosts] = useState(null);
  const [filterParams, setFilterParams] = useState(initialFilterParams);

  useEffect(() => {
    async function fetchProfile() {
      await getProfile();
    }

    async function fetchPosts() {
      console.log(filterParams);
      const data = await getFilteredPosts(filterParams);
      setPosts(data.content);
    }

    fetchProfile();
    fetchPosts();
  }, []);

  const loadFilteredPosts = async () => {
    const data = await getFilteredPosts(filterParams);
    setPosts(data.content);
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

  if (!profile) {
    return <p className="">Loading...</p>;
  }

  const avatarURL = `http://localhost:8081/api/logtoon/general/image/${profile.avatarFileName}`;

  return (
    <div className="flex w-full items-start gap-6">
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

        <div className="grid w-full grid-cols-1 gap-4 px-4 sm:px-5 md:px-10 lg:px-12 pb-8 md:grid-cols-2">
          {!posts
            ? "loading"
            : posts.map((post) => (
                <div key={post.id} className="break-inside-avoid">
                  <PostCard post={post} key={post.id} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
