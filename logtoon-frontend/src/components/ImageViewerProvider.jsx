import { useState } from "react";
import { ImageViewerContext } from "./ImageViewerContext";

export default function ImageViewerProvider({ children }) {
  const [imageFiles, setImageFiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = (newImageFiles, newIndex) => {
    setImageFiles(newImageFiles);
    setIndex(newIndex);
    setIsOpen(true);
  };

  const handleNextImage = () => {
    setIndex((prev) => {
      if (prev < imageFiles.length - 1) return prev + 1;
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
        imageFiles,
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
