import { useState } from "react";
import RatingStar from "./RatingStar";
import { useAuth } from "./AuthContext";
import { useProfile } from "./ProfileContext";
import { usePostRelated } from "./PostRelatedContext";

const initialForm = {
  rating: 0,
  moneySpent: "",
  review: "",
  location: "",
  images: [],
  categories: [],
  cuisines: [],
  tags: [],
};

export default function CreatePostModal() {
  const { token } = useAuth();
  const { getPosts, getProfile } = useProfile();
  const { isCreatePostModalOpen, closeCreatePostModal, postAdjectives } =
    usePostRelated();
  const [formData, setFormData] = useState(initialForm);
  const [hoveredStarRating, setHoveredStarRating] = useState(0);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotosChange = (event) => {
    const files = Array.from(event.target.files || []).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    // event.target.value = null;
  };

  const removePhoto = (index) => {
    setFormData((prev) => {
      const removed = prev.images[index];
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return {
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      };
    });
  };

  const handleSubmit = async function (event) {
    event.preventDefault();
    if (formData.rating === 0) {
      alert("please add a rating for the post you are trying to create.");
      return;
    }
    if (formData.categories.length === 0) {
      alert("please select atleast one category.");
      return;
    }
    if (formData.cuisines.length === 0) {
      alert("please select atleast one cuisine.");
      return;
    }
    if (formData.tags.length === 0) {
      alert("please select atleast one tag.");
      return;
    }

    const requestForm = new FormData();
    requestForm.append("rating", formData.rating * 2);
    requestForm.append("moneySpent", formData.moneySpent);
    requestForm.append("review", formData.review);
    requestForm.append("location", formData.location);

    formData.images.forEach((image) =>
      requestForm.append("images", image.file),
    );

    formData.categories.forEach((category) =>
      requestForm.append("categories", category),
    );

    formData.cuisines.forEach((cuisine) =>
      requestForm.append("cuisines", cuisine),
    );

    formData.tags.forEach((tag) => requestForm.append("tags", tag));

    try {
      const response = await fetch(
        "http://localhost:8081/api/logtoon/user/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: requestForm,
        },
      );

      const res = await response.json();

      console.log(res);

      if (response.ok) {
        alert("new post created!");
        await getPosts();
        await getProfile();
        closeCreatePostModal();
        setFormData(initialForm);
        setHoveredStarRating(0);
      } else throw new Error(res.message + "\n" + " status: " + res.status);
    } catch (error) {
      alert(error);
    }
  };

  const setClickedRating = (ratingValue) => {
    setFormData((prev) => ({ ...prev, rating: ratingValue }));
  };

  const toggleSelection = (field, value) => {
    setFormData((prev) => {
      const currentValue = prev[field];
      return {
        ...prev,
        [field]: currentValue.includes(value)
          ? currentValue.filter((item) => item !== value)
          : [...currentValue, value],
      };
    });
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
        <RatingStar
          key={index}
          index={index}
          offset={offset}
          setHoveredStarRating={setHoveredStarRating}
          currentStarRating={formData.rating}
          setClickedRating={setClickedRating}
        />
      );
    });
  };

  if (!isCreatePostModalOpen) return null;

  return (
    <div
      onClick={closeCreatePostModal}
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-900/40 px-4 py-6 backdrop-blur-sm"
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className="relative mt-5 w-full max-w-3xl rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-xl shadow-slate-200/50"
      >
        <button
          onClick={closeCreatePostModal}
          className="absolute top-3 right-4 text-slate-900 hover:text-slate-500 text-2xl cursor-pointer"
        >
          ×
        </button>
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">
          Latest Food Adventure
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 text-sm font-medium text-slate-700">
                Rating
              </span>
              <div className="flex items-center gap-1 text-sm mt-2">
                {renderStars(hoveredStarRating)}
              </div>
            </label>

            <label className="block">
              <span className="mb-1 text-sm font-medium text-slate-700">
                Money Spent
              </span>
              <div className="mt-1 flex rounded-2xl border border-slate-300 bg-white shadow-sm focus-within:border-slate-500 focus-within:ring-2 focus-within:ring-slate-200">
                <span className="inline-flex items-center px-3 text-sm text-slate-600">
                  ₹
                </span>
                <input
                  required
                  type="number"
                  name="moneySpent"
                  value={formData.moneySpent}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full rounded-r-2xl border-none bg-transparent px-3 py-2 text-sm text-slate-900 outline-none"
                />
              </div>
            </label>
          </div>

          <label className="block">
            <span
              className="mb-1 text-sm font-medium
             text-slate-700"
            >
              Review
            </span>
            <textarea
              required
              minLength={20}
              name="review"
              value={formData.review}
              onChange={handleChange}
              rows="5"
              placeholder="Share what made this meal special...(atleast 20 letters)"
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 text-sm font-medium text-slate-700">
              Location
            </span>
            <input
              required
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Restaurant, city, or street"
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </span>
              <div className="grid gap-2 sm:grid-cols-4 grid-cols-2">
                {postAdjectives.categories.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(option)}
                      onChange={() => toggleSelection("categories", option)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                    />
                    <span className="capitalize">
                      {option.replace("-", " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Cuisine
              </span>
              <div className="grid gap-2 sm:grid-cols-4 grd-cols-2">
                {postAdjectives.cuisines.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.cuisines.includes(option)}
                      onChange={() => toggleSelection("cuisines", option)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 "
                    />
                    <span className="capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Tags
              </span>
              <div className="grid gap-2 sm:grid-cols-4 grd-cols-2">
                {postAdjectives.tags.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.tags.includes(option)}
                      onChange={() => toggleSelection("tags", option)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 "
                    />
                    <span className="capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <label className="block">
            <span className="mb-1 text-sm font-medium text-slate-700">
              Photos
            </span>
            <input
              required
              type="file"
              accept="image/jpeg, image/png"
              multiple
              onChange={handlePhotosChange}
              className="mt-1 block w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:text-white file:shadow-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-200 cursor-pointer"
            />
            {formData.images.length > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {formData.images.map((image, index) => (
                  <div
                    key={`${image.file.name}-${index}`}
                    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="flex h-48 w-full items-center justify-center bg-slate-100">
                      <img
                        src={image.preview}
                        alt={image.file.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white transition hover:bg-black"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </button>
                    <div className="p-2 text-xs text-slate-700">
                      {image.file.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Capture your latest food adventure details here.
            </p>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
