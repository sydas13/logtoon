import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import AuthModal from "./components/Auth/AuthModal";
import { useAuth } from "./components/Auth/AuthContext";
import { ImageViewerModal } from "./components/Image/ImageViewerModal";
import CreatePostModal from "./components/Post/CreatePostModal";
import { usePostRelated } from "./components/Post/PostRelatedContext";

function App() {
  const { getUser, token } = useAuth();
  const { getPostAdjectives } = usePostRelated();

  useEffect(() => {
    const loadUser = async () => {
      await getUser();
    };

    const loadPostAdjectives = async () => {
      await getPostAdjectives();
    };

    loadUser();
    loadPostAdjectives();
  }, [token]);

  return (
    <div className="min-h-screen min-w-screen bg-white">
      <NavBar />
      <main>
        <ImageViewerModal />
        <AuthModal />
        <CreatePostModal />
        <Outlet />
      </main>
    </div>
  );
}

export default App;
