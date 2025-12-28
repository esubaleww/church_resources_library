import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "am", label: "አማ" },
];

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const current = i18n.language || "en";

  const setLang = (code) => {
    if (code === current) return;
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
  };

  return (
    <div className="inline-flex items-center rounded-full border border-neutral-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 p-1">
      {LANGS.map((l) => {
        const active = l.code === current;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
              active
                ? "bg-amber-500 text-white shadow-sm"
                : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-slate-800"
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
