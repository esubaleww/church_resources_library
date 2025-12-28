import { SunMoon } from "lucide-react";
import { useTheme } from "../hooks/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="inline-flex items-center justify-center w-9 h-9 rounded-full
                 border border-neutral-300/70 dark:border-neutral-600/70
                 bg-neutral-100/80 dark:bg-neutral-900/80
                 text-neutral-800 dark:text-neutral-100
                 hover:bg-neutral-200/90 dark:hover:bg-neutral-800/90
                 hover:border-amber-400/70 transition-colors"
    >
      <SunMoon className="w-4 h-4" />
      <span className="sr-only">
        Switch to {isDark ? "light" : "dark"} mode
      </span>
    </button>
  );
}
