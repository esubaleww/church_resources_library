import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { UserContext, useUser } from "./hooks/UserContext.jsx";

import "./App.css";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-slate-950 p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300 mb-6">
              Please refresh the page or contact support if the problem
              persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ScrollToTop = () => (
  <button
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    className="flex items-center justify-center w-9 h-9 rounded-full
               bg-amber-500 text-white shadow-lg
               hover:bg-amber-600 transition-all duration-200
               hover:scale-110 active:scale-95"
    aria-label="Scroll to top"
  >
    <ArrowUp className="w-4 h-4" />
  </button>
);

const FloatingButtons = ({ isAdmin, showScrollButton, setShowAdmin }) => (
  <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
    {showScrollButton && <ScrollToTop />}

    {isAdmin && (
      <button
        onClick={() => setShowAdmin(true)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full
                   bg-slate-900/90 backdrop-blur-sm border border-amber-400/60
                   text-amber-100 shadow-lg shadow-black/40
                   hover:bg-slate-800 hover:border-amber-300
                   text-xs font-semibold transition-all duration-200
                   opacity-90 hover:opacity-100"
        aria-label="Open admin panel"
      >
        <Settings className="w-4 h-4" />
        <span>Admin</span>
      </button>
    )}
  </div>
);

function MainApp() {
  const [activeSection, setActiveSection] = useState("home");
  const [showAdmin, setShowAdmin] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { currentUser, setCurrentUser } = useUser();

  const sections = useMemo(
    () => ["home", "resources", "prayers", "events", "community", "about"],
    [],
  );

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const userData = JSON.parse(raw);
        setCurrentUser(userData);
      } catch {
        setCurrentUser(null);
        localStorage.removeItem("user");
      }
    }
  }, [setCurrentUser]);

  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    let observer = null;

    const handleScrollFallback = () => {
      const currentScrollY = window.scrollY;
      setShowScrollButton(currentScrollY > 300);

      const scrollPosition = currentScrollY + 100;
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
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          root: null,
          rootMargin: "-20% 0px -70% 0px",
          threshold: 0,
        },
      );

      sections.forEach((section) => {
        const el = document.getElementById(section);
        if (el) observer.observe(el);
      });

      const onScroll = () => setShowScrollButton(window.scrollY > 300);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      return () => {
        if (observer) observer.disconnect();
        window.removeEventListener("scroll", onScroll);
      };
    } else {
      window.addEventListener("scroll", handleScrollFallback, {
        passive: true,
      });
      handleScrollFallback();
      return () => window.removeEventListener("scroll", handleScrollFallback);
    }
  }, [sections]);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  if (showAdmin) {
    return <AdminWrapper onExit={() => setShowAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-slate-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                  z-50 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg
                  font-semibold text-black dark:text-white shadow-lg
                  focus:z-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        Skip to main content
      </a>

      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        scrollToSection={scrollToSection}
      />

      <main id="main-content">
        <ErrorBoundary>
          <Hero scrollToSection={scrollToSection} />
          <Resources />
          <Prayers />
          <Events />
          <Community />
          <About />
        </ErrorBoundary>
      </main>

      <Footer />

      <FloatingButtons
        isAdmin={isAdmin}
        showScrollButton={showScrollButton}
        setShowAdmin={setShowAdmin}
      />
    </div>
  );
}

function ToastConfig() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: "var(--toast-bg, #1f2937)",
          color: "var(--toast-color, #f9fafb)",
          borderRadius: "8px",
          fontSize: "14px",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <ToastConfig />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-messages" element={<MyMessages />} />
          <Route path="/admin/*" element={<AdminWrapper />} />
        </Routes>
      </ErrorBoundary>
    </UserContext.Provider>
  );
}

export default App;
