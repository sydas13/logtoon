import { useEffect, useState } from "react";
import ProfileEditModal from "./ProfileEditModal";
import { useParams } from "react-router-dom";
import { useProfile } from "./ProfileContext";
import { useAuth } from "./AuthContext";

export default function Profile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { userId } = useParams();
  const { user } = useAuth();
  const { profile, getProfile } = useProfile();

  useEffect(() => {
    async function fetchProfile() {
      await getProfile(userId);
    }

    fetchProfile();
  }, [userId]);

  const openEditModal = function () {
    setIsEditModalOpen(true);
  };

  const closeEditModal = function () {
    setIsEditModalOpen(false);
  };

  if (!profile) {
    return <p className="text-white">Loading...</p>;
  }

  const avatarURL = `http://localhost:8081/api/logtoon/general/image/${profile.avatarFileName}`;

  return (
    <div className="text-white flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 py-8 px-4 sm:px-8 md:px-16 lg:px-20">
      <div className="profile-picture w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white rounded-full overflow-hidden flex-shrink-0">
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
          <span className="profile-about-username text-sm sm:text-base text-gray-400">
            @{user.username}
          </span>
        </div>
        <div className="profile-about-stats flex gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm md:text-base text-gray-300 flex-wrap">
          <span className="followers">
            <strong className="text-white">{profile.followerCount}</strong>{" "}
            Followers
          </span>
          <span className="following">
            <strong className="text-white">{profile.followingCount}</strong>{" "}
            Following
          </span>
          <span className="places-visited">
            <strong className="text-white">{profile.placesVisited}</strong>{" "}
            Places visited
          </span>
          <span className="hearts">
            <strong className="text-white">{profile.heartCount}</strong> Hearts
          </span>
          <button className="profile-badge bg-green-700 text-white px-2 py-1 w-fit text-sm ">
            #{profile.badge}
          </button>
        </div>
        <p className="profile-about-bio mb-3 text-sm sm:text-base text-gray-400">
          {profile.bio}
        </p>
        <button
          className="profile-about-edit-btn border-1 hover:bg-slate-900 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors duration-200 w-fit text-xs sm:text-sm font-semibold cursor-pointer"
          onClick={openEditModal}
        >
          edit profile
        </button>
      </div>
      {isEditModalOpen && <ProfileEditModal closeEditModal={closeEditModal} />}
    </div>
  );
}
