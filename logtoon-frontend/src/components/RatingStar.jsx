export default function RatingStar({
  index,
  offset,
  setHoveredStarRating,
  currentStarRating,
  setClickedRating,
}) {
  const findRatingValue = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mousePosition = e.clientX - rect.left;
    if (mousePosition < rect.width / 2) {
      return index + 0.5;
    } else {
      return index + 1;
    }
  };

  const handleHover = (e) => {
    const ratingValue = findRatingValue(e);
    setHoveredStarRating(ratingValue);
  };

  const handleClick = (e) => {
    const ratingValue = findRatingValue(e);
    setClickedRating(ratingValue);
  };

  return (
    <svg
      id={index}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-7 h-7 cursor-pointer"
      onMouseMove={handleHover}
      onMouseLeave={() => setHoveredStarRating(currentStarRating)}
      onClick={handleClick}
    >
      <defs>
        <linearGradient id={`grad-${index}`}>
          <stop offset={offset} stop-color="#ffa534" />
          <stop offset={offset} stop-color="grey" />
        </linearGradient>
      </defs>

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={`url(#grad-${index})`}
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      />
    </svg>
  );
}
