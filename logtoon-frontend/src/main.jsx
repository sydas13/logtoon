import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Profile from "./components/Profile/Profile.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home.jsx";
import AuthProvider from "./components/Auth/AuthProvider.jsx";
import ProfileProvider from "./components/Profile/ProfileProvider.jsx";
import ImageViewerProvider from "./components/Image/ImageViewerProvider.jsx";
import PostRelatedProvider from "./components/Post/PostRelatedProvider.jsx";
import CommentProvider from "./components/Post/CommentProvider.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "profile/:userId",
        element: <Profile />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <PostRelatedProvider>
        <ProfileProvider>
          <ImageViewerProvider>
            <CommentProvider>
              <RouterProvider router={router} />
            </CommentProvider>
          </ImageViewerProvider>
        </ProfileProvider>
      </PostRelatedProvider>
    </AuthProvider>
  </StrictMode>,
);
