import { useState, useEffect } from "react";
import Admin from "./Admin";
import { useNavigate } from "react-router-dom";

export default function AdminWrapper() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthed(false);
        setChecking(false);
        navigate("/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || data.role !== "admin") {
          setIsAuthed(false);
          navigate("/login");
        } else {
          setIsAuthed(true);
        }
      } catch {
        setIsAuthed(false);
        navigate("/login");
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthed(false);
    navigate("/");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-500">Checking admin access...</p>
      </div>
    );
  }

  if (!isAuthed) return null;

  return <Admin onExit={handleLogout} />;
}
