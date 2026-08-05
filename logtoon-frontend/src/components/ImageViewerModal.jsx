import { useEffect } from "react";
import { useImageViewer } from "./ImageViewerContext";

export const ImageViewerModal = () => {
  const {
    imageFiles,
    index,
    isOpen,
    handleClose,
    handleNextImage,
    handlePrevImage,
  } = useImageViewer();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose, handleNextImage, handlePrevImage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* modal content */}
      <div className="relative z-10 w-full max-w-[95vw] max-h-[95vh] p-4">
        <button
          aria-label="Close image viewer"
          onClick={handleClose}
          className="absolute -top-2 -right-2 z-20 rounded-full cursor-pointer p-2 text-white hover:bg-black/80"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            aria-label="Previous image"
            onClick={handlePrevImage}
            className="rounded-full cursor-pointer p-2 text-white hover:bg-black/70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
            </svg>
          </button>

          <div className="overflow-hidden rounded-xl shadow-lg w-full max-w-[calc(100vw-6rem)]">
            <img
              src={`http://localhost:8081/api/logtoon/general/image/${imageFiles[index]}`}
              alt="Preview"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>

          <button
            aria-label="Next image"
            onClick={handleNextImage}
            className="rounded-full cursor-pointer p-2 text-white hover:bg-black/70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
