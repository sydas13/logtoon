import { createContext, useContext } from "react";

export const PostRelatedContext = createContext();
export const usePostRelated = () => {
  return useContext(PostRelatedContext);
};
