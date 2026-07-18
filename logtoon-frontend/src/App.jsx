import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./components/AuthContext";

function App() {
  const { getUser, token } = useAuth();

  useEffect(() => {
    const loadUser = async () => {
      await getUser();
    };

    loadUser();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950">
      <NavBar />
      <main>
        <AuthModal />
        <Outlet />
      </main>
    </div>
  );
}

export default App;
