import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ArrowUp, Settings } from "lucide-react";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./sections/About";
import Resources from "./sections/Resources";
import Prayers from "./sections/Prayers";
import Events from "./sections/Events";
import Community from "./sections/Community";
import Footer from "./sections/Footer";

import AdminWrapper from "./components/admin/AdminWrapper.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyMessages from "./pages/MyMessages.jsx";

import "./App.css";

function MainApp() {
  const [activeSection, setActiveSection] = useState("home");
  const [showAdmin, setShowAdmin] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const sections = [
    "home",
    "resources",
    "prayers",
    "events",
    "community",
    "about",
  ];

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        setCurrentUser(JSON.parse(raw));
      } catch {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, []);

  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 120;
          for (const section of sections) {
            const el = document.getElementById(section);
            if (!el) continue;
            if (
              scrollPosition >= el.offsetTop &&
              scrollPosition < el.offsetTop + el.offsetHeight
            ) {
              setActiveSection(section);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const ScrollToTop = () => (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="flex items-center justify-center w-9 h-9 rounded-full
                 bg-amber-500 text-white shadow-lg
                 hover:bg-amber-600 transition-transform duration-200
                 hover:scale-110"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );

  useEffect(() => {
    const handleScrollShow = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScrollShow);
    return () => window.removeEventListener("scroll", handleScrollShow);
  }, []);
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  if (showAdmin) {
    return <AdminWrapper onExit={() => setShowAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-slate-950">
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        scrollToSection={scrollToSection}
      />
      <Hero scrollToSection={scrollToSection} />
      <Resources />
      <Prayers />
      <Events />
      <Community />
      <About />
      <Footer />

      {isAdmin && (
        <div className="fixed bottom-4 right-4 z-40 group flex flex-col items-end gap-2">
          {showScrollButton && (
            <div
              className="opacity-0 translate-y-1 pointer-events-none
                         group-hover:opacity-100 group-hover:translate-y-0
                         group-hover:pointer-events-auto
                         transition-all duration-200"
            >
              <ScrollToTop />
            </div>
          )}

          <div
            className="opacity-0 translate-y-1 pointer-events-none
                       group-hover:opacity-100 group-hover:translate-y-0
                       group-hover:pointer-events-auto
                       transition-all duration-200"
          >
            <button
              onClick={() => setShowAdmin(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full
                         bg-slate-900 text-amber-100 border border-amber-400/60
                         shadow-lg shadow-black/40
                         hover:bg-slate-800 hover:border-amber-300
                         text-xs font-semibold transition-colors"
              aria-label="Open admin panel"
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      )}
      {!isAdmin && showScrollButton && (
        <div className="fixed bottom-4 right-4 z-40 group">
          <div
            className="opacity-0 translate-y-1 pointer-events-none
                       group-hover:opacity-100 group-hover:translate-y-0
                       group-hover:pointer-events-auto
                       transition-all duration-200"
          >
            <ScrollToTop />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-messages" element={<MyMessages />} />
        <Route path="/admin/*" element={<AdminWrapper />} />
      </Routes>
    </>
  );
}
