import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Profile from "./components/Profile.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home.jsx";
import AuthProvider from "./components/AuthProvider.jsx";
import ProfileProvider from "./components/ProfileProvider.jsx";
import ImageViewerProvider from "./components/ImageViewerProvider.jsx";
import PostRelatedProvider from "./components/PostRelatedProvider.jsx";

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
            <RouterProvider router={router} />
          </ImageViewerProvider>
        </ProfileProvider>
      </PostRelatedProvider>
    </AuthProvider>
  </StrictMode>,
);
