import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { Menu, X, Cross } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Navbar({
  activeSection,
  setActiveSection,
  scrollToSection,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const { t } = useTranslation("nav");
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setCurrentUser(parsed);
      } catch {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "resources",
        "prayers",
        "events",
        "community",
        "about",
      ];

      const scrollPosition = window.scrollY + 100;
      setIsAtTop(window.scrollY < 10);

      for (const section of sections) {
        const element = document.getElementById(section);
        if (
          element &&
          scrollPosition >= element.offsetTop &&
          scrollPosition < element.offsetTop + element.offsetHeight
        ) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setActiveSection]);

  const navItems = [
    { id: "home", label: t("items.home") },
    { id: "resources", label: t("items.resources") },
    { id: "prayers", label: t("items.prayers") },
    { id: "events", label: t("items.events") },
    { id: "community", label: t("items.community") },
    { id: "about", label: t("items.about") },
  ];

  const handleNavClick = (id) => {
    scrollToSection(id);
    setIsMenuOpen(false);
  };

  const isNormalUser = currentUser?.role === "user";
  const isAdmin = currentUser?.role === "admin";
  const isAuthed = !!currentUser;

  const handleMyMessages = () => {
    if (!isNormalUser) return;
    navigate("/my-messages");
    setIsMenuOpen(false);
  };

  const handleAuthClick = () => {
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isAtTop
          ? "bg-linear-to-b from-black/30 to-transparent"
          : "bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-800/70"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button
          aria-label={t("aria.scroll_home")}
          onClick={() => handleNavClick("home")}
          className="flex items-center gap-2 group"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-white/5 border border-amber-300/40 shadow-md shadow-amber-900/40">
            <div className="absolute inset-0 rounded-2xl bg-amber-400/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <Cross className="relative w-5 h-5 text-amber-300" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-amber-200/80">
              {t("brand.line1")}
            </span>
            <span className="text-sm font-medium text-neutral-50 leading-tight">
              {t("brand.line2")}
            </span>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map(({ id, label }) => {
            const isActive = activeSection === id;
            return (
              <button
                aria-label={t("aria.navigate_to", { section: label })}
                key={id}
                onClick={() => handleNavClick(id)}
                className={`relative text-sm font-medium transition-all ${
                  isActive
                    ? "text-amber-300"
                    : "text-neutral-200/80 hover:text-amber-200"
                }`}
              >
                <span>{label}</span>
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-1 h-0.5 rounded-full bg-linear-to-r from-amber-400 via-amber-300 to-amber-500" />
                )}
              </button>
            );
          })}

          <button
            aria-label={t("aria.go_prayers")}
            onClick={() => handleNavClick("prayers")}
            className="hidden lg:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-300/40 text-amber-100 hover:bg-amber-500/20 transition-colors"
          >
            {t("daily_prayer")}
          </button>

          <ThemeToggle />
          <LanguageToggle />

          {!isAuthed && (
            <button
              onClick={handleAuthClick}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100/5 border border-neutral-500/40 text-neutral-100 hover:bg-neutral-100/10 transition-colors"
            >
              {t("login_signup")}
            </button>
          )}

          {isNormalUser && (
            <div className="relative inline-block group">
              <button
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
                           bg-amber-500/15 border border-amber-300/70
                           text-amber-50 hover:bg-amber-400/30 hover:border-amber-200
                           shadow-sm shadow-amber-900/40 transition-colors"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold">
                  {currentUser?.name?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="hidden sm:inline">
                  {currentUser?.name || t("account")}
                </span>
                <svg
                  className="w-3 h-3 text-amber-100"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M6 8l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                className="absolute right-0 top-full mt-px w-44 rounded-xl bg-neutral-900/95
                           border border-amber-400/60 shadow-xl shadow-amber-900/40
                           opacity-0 translate-y-1 pointer-events-none
                           group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
                           transition-all duration-150"
              >
                <div className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-[0.16em] uppercase text-amber-200/85 bg-neutral-900/90">
                  {t("account")}
                </div>

                <button
                  onClick={handleMyMessages}
                  aria-label="mymessage"
                  className="block w-full text-left px-3 py-2 text-xs
                             text-emerald-50 bg-neutral-900/95
                             hover:bg-emerald-500/25 hover:text-emerald-50
                             transition-colors"
                >
                  {t("my_messages")}
                </button>

                <button
                  onClick={handleLogout}
                  aria-label="logout"
                  className="block w-full text-left px-3 py-2 text-xs
                             text-red-100 bg-neutral-900/95
                             hover:bg-red-600/35 hover:text-red-50
                             transition-colors"
                >
                  {t("logout")}
                </button>
              </div>
            </div>
          )}

          {isAdmin && null}
        </div>

        <button
          aria-label={t("aria.menu_button")}
          className="md:hidden p-2 text-neutral-100"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          isMenuOpen ? "max-h-[70vh]" : "max-h-0"
        }`}
      >
        <div className="mx-4 mb-3 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 backdrop-blur-xl shadow-xl">
          <div className="px-4 py-3 space-y-1">
            {navItems.map(({ id, label }) => {
              const isActive = activeSection === id;
              return (
                <button
                  aria-label={t("aria.navigate_to", { section: label })}
                  key={id}
                  onClick={() => handleNavClick(id)}
                  className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-amber-500/15 text-amber-100 border border-amber-400/50"
                      : "text-neutral-100/80 hover:bg-neutral-800/80"
                  }`}
                >
                  {label}
                </button>
              );
            })}

            {!isAuthed && (
              <button
                onClick={handleAuthClick}
                aria-label="login_signup"
                className="mt-2 block w-full text-left px-3 py-2 rounded-xl text-sm font-semibold
                           bg-neutral-100/5 border border-neutral-500/40 text-neutral-100
                           hover:bg-neutral-100/10 transition-colors"
              >
                {t("login_signup")}
              </button>
            )}

            {isNormalUser && (
              <>
                <button
                  onClick={handleMyMessages}
                  aria-label="mymessage-btn"
                  className="mt-2 block w-full text-left px-3 py-2 rounded-xl text-sm font-semibold
                             bg-emerald-500/15 border border-emerald-300/50 text-emerald-100
                             hover:bg-emerald-500/25 transition-colors"
                >
                  {t("my_messages")}
                </button>
                <button
                  onClick={handleLogout}
                  aria-label="logout-btn"
                  className="mt-2 block w-full text-left px-3 py-2 rounded-xl text-sm font-semibold
                             bg-neutral-100/5 border border-neutral-500/40 text-neutral-100
                             hover:bg-neutral-100/10 transition-colors"
                >
                  {t("logout")}
                </button>
              </>
            )}

            {isAdmin && null}

            <div className="mt-3 grid grid-cols-2 gap-3 px-2 pt-2 border-t border-neutral-800/70">
              <div className="flex items-center justify-between">
                <ThemeToggle />
                <LanguageToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
