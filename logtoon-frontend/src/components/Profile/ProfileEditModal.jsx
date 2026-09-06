import { useState, useRef, useEffect } from "react";
import { useProfile } from "./ProfileContext";

export default function ProfileEditModal({ closeEditModal }) {
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const fileInputRef = useRef(null);
  const { profile, updateProfile } = useProfile();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (avatar) formData.append("avatar", avatar);

    if (name != "") formData.append("name", name);

    if (bio != "") formData.append("bio", bio);

    await updateProfile(formData);
    closeEditModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-slate-800 text-white rounded-xl p-6 w-96 shadow-lg relative">
        <button
          className="absolute top-3 right-4 text-gray-300 hover:text-white text-2xl cursor-pointer"
          onClick={closeEditModal}
        >
          ×
        </button>

        <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

        <form className="flex flex-col gap-3" onSubmit={handleSave}>
          <div className="flex flex-col text-sm">
            Avatar
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/jpeg, image/png"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setAvatar(e.target.files[0]);
                  setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <div
              className="profile-picture relative w-20 h-20 bg-white rounded-full overflow-hidden flex-shrink-0 group cursor-pointer mt-2"
              onClick={handleAvatarClick}
            >
              <img
                src={
                  previewUrl
                    ? previewUrl
                    : `http://localhost:8081/api/logtoon/general/image/${profile.avatarFileName}`
                }
                alt="profile-pic"
                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-200"
              ></img>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-gray-600 text-xs font-semibold text-center px-1">
                  edit
                </span>
              </div>
            </div>
          </div>

          <label className="flex flex-col text-sm">
            Name
            <input
              className="mt-1 p-2 rounded bg-slate-700 text-white border border-slate-600"
              placeholder="Your name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="flex flex-col text-sm">
            Bio
            <textarea
              className="mt-1 p-2 rounded bg-slate-700 text-white border border-slate-600 resize-none min-h-24"
              placeholder="Tell us about yourself"
              rows={4}
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </label>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="px-3 py-1 rounded bg-transparent border border-slate-600 text-sm cursor-pointer"
              onClick={closeEditModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-sm font-semibold cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
