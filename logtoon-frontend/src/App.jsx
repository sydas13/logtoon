import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./components/AuthContext";
import { ImageViewerModal } from "./components/ImageViewerModal";
import CreatePostModal from "./components/CreatePostModal";

function App() {
  const { getUser, token } = useAuth();

  useEffect(() => {
    const loadUser = async () => {
      await getUser();
    };

    loadUser();
  }, [token]);

  return (
    <div className="min-h-screen bg-white">
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
