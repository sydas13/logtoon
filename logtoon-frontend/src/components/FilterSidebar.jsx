import { useState } from "react";
import RatingStar from "./RatingStar";
import { usePostRelated } from "./PostRelatedContext";

export default function FilterSidebar({
  filterParams,
  setFilterParams,
  resetFilters,
  handleFilter,
}) {
  const { postAdjectives } = usePostRelated();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredStarRating, setHoveredStarRating] = useState(0);

  const setClickedRating = (ratingValue) => {
    setFilterParams((prev) => ({ ...prev, minimumRating: ratingValue }));
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
          currentStarRating={filterParams.minimumRating}
          setClickedRating={setClickedRating}
        />
      );
    });
  };

  const toggleFilter = (type, value) => {
    setFilterParams((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value],
    }));
  };

  const clearFilters = () => {
    resetFilters();
    setHoveredStarRating(0);
  };

  return (
    <>
      {/* Mobile filter button */}
      <button
        title="open filter bar"
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black focus:bg-gray-700 px-6 py-3 text-sm font-semibold text-white shadow-xl md:hidden cursor-pointer"
      >
        Filters
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-full w-80 overflow-y-auto md:my-2 md:mx-3
          bg-white p-6 shadow-2xl transition-transform duration-300
          md:sticky md:top-4 md:z-0 md:h-[calc(100vh-2rem)]
          md:w-72 md:shrink-0 md:translate-x-0 md:rounded-3xl md:shadow-xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Filters</h2>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-slate-500 hover:text-black"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-2xl leading-none ml-3 md:hidden"
              aria-label="Close filters"
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
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Sort */}
        <section className="border-b border-slate-200 pb-5">
          <h3 className="mb-3 text-sm font-semibold">Sort by</h3>

          <select
            value={filterParams.sort}
            onChange={(e) =>
              setFilterParams((prev) => ({
                ...prev,
                sort: e.target.value,
                sortBy:
                  e.target[e.target.selectedIndex].getAttribute("data-sort-by"),
                sortDirection: e.target[e.target.selectedIndex].getAttribute(
                  "data-sort-direction",
                ),
              }))
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
          >
            <option
              value="newest"
              data-sort-by="createdAt"
              data-sort-direction="desc"
            >
              Newest
            </option>
            <option
              value="oldest"
              data-sort-by="createdAt"
              data-sort-direction="asc"
            >
              Oldest
            </option>
            <option
              value="rating-high"
              data-sort-by="rating"
              data-sort-direction="desc"
            >
              Highest rated
            </option>
            <option
              value="rating-low"
              data-sort-by="rating"
              data-sort-direction="asc"
            >
              Lowest rated
            </option>
            <option
              value="price-low"
              data-sort-by="moneySpent"
              data-sort-direction="asc"
            >
              Price: Low to high
            </option>
            <option
              value="price-high"
              data-sort-by="moneySpent"
              data-sort-direction="desc"
            >
              Price: High to low
            </option>
          </select>
        </section>

        {/* Rating */}
        <section className="border-b border-slate-200 py-5">
          <div className="flex items-center gap-4">
            <h3 className="mb-1 text-sm font-semibold">Minimum rating</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="size-4 cursor-pointer"
              onClick={() => {
                setClickedRating(0);
                setHoveredStarRating(0);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1 text-sm ">
              {renderStars(hoveredStarRating)}
            </div>
            <span className="text-lg text-slate-500">/ 5</span>
          </div>
        </section>

        {/* Cuisine */}
        <FilterSection
          title="Cuisine"
          options={postAdjectives.cuisines}
          selected={filterParams.cuisines}
          onToggle={(value) => toggleFilter("cuisines", value)}
        />

        {/* Category */}
        <FilterSection
          title="Category"
          options={postAdjectives.categories}
          selected={filterParams.categories}
          onToggle={(value) => toggleFilter("categories", value)}
        />

        {/* Tags */}
        <FilterSection
          title="Tags"
          options={postAdjectives.tags}
          selected={filterParams.tags}
          onToggle={(value) => toggleFilter("tags", value)}
        />

        {/* Apply */}
        <button
          type="button"
          onClick={handleFilter}
          className="mt-6 w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Apply filters
        </button>
      </aside>
    </>
  );
}

function FilterSection({ title, options, selected, onToggle }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="border-b border-slate-200 py-5">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between"
      >
        <h3 className="text-sm font-semibold">{title}</h3>

        <span className="text-lg text-slate-500">{expanded ? "−" : "+"}</span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1">
          {options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-3 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onToggle(option)}
                className="h-4 w-4 rounded accent-black"
              />

              {option}
            </label>
          ))}
        </div>
      )}
    </section>
  );
}
