import { createContext, useContext } from "react";

export const ImageViewerContext = createContext();
export const useImageViewer = () => {
  return useContext(ImageViewerContext);
};
