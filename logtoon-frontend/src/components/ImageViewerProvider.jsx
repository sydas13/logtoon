import { useState } from "react";
import { ImageViewerContext } from "./ImageViewerContext";

export default function ImageViewerProvider({ children }) {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    console.log("ran");
    setIsOpen(false);
  };

  const handleOpen = (newImages, newIndex) => {
    setImages(newImages);
    setIndex(newIndex);
    setIsOpen(true);
  };

  const handleNextImage = () => {
    setIndex((prev) => {
      if (prev < images.length - 1) return prev + 1;
      else return prev;
    });
  };

  const handlePrevImage = () => {
    setIndex((prev) => {
      if (prev > 0) return prev - 1;
      else return prev;
    });
  };

  return (
    <ImageViewerContext.Provider
      value={{
        images,
        index,
        isOpen,
        handleClose,
        handleOpen,
        handleNextImage,
        handlePrevImage,
      }}
    >
      {children}
    </ImageViewerContext.Provider>
  );
}
