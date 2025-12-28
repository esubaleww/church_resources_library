import { Clock, Cross, Mail, MapPin, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("footer");

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="bg-neutral-950 dark:bg-slate-950 text-white pt-16 pb-12 
                     border-t border-neutral-900/80 dark:border-slate-800/80
                     relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-amber-600/20 via-amber-500/30 to-amber-600/20" />

        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute top-1/4 left-1/4 w-16 h-16 
                        border border-amber-500/20 dark:border-amber-400/10 
                        rotate-45"
          />
          <div
            className="absolute bottom-1/3 right-1/4 w-20 h-20 
                        border-2 border-amber-600/15 dark:border-amber-500/10 
                        rounded-full"
          />
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-amber-900/5 via-transparent to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-amber-500/40 to-amber-400/30 blur-lg" />
                <div
                  className="relative flex h-10 w-10 items-center justify-center rounded-2xl 
                              bg-linear-to-br from-amber-600 to-amber-700
                              border border-amber-400/40 
                              shadow-lg shadow-amber-900/40"
                >
                  <Cross className="w-5 h-5 text-amber-100" />
                </div>
              </div>
              <div className="flex flex-col">
                <span
                  className="text-xs font-semibold tracking-[0.18em] uppercase 
                               bg-linear-to-r from-amber-300 to-amber-200 
                               bg-clip-text text-transparent"
                >
                  {t("brand.tagline")}
                </span>
                <span className="text-lg font-bold text-white mt-0.5">
                  {t("brand.name")}
                </span>
              </div>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {t("brand.subtitle")}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-300/80">
                {t("blessing", "May God bless you abundantly")}
              </span>
            </div>
          </div>

          <div>
            <h4
              className="mb-4 text-sm font-semibold tracking-[0.18em] uppercase 
                          text-amber-200 flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {t("links.title")}
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { id: "resources", labelKey: "links.resources" },
                { id: "prayers", labelKey: "links.prayers" },
                { id: "events", labelKey: "links.events" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl
                           bg-neutral-900/60 dark:bg-slate-900/60
                           border border-neutral-800 dark:border-slate-800
                           text-sm font-medium text-neutral-200 
                           hover:bg-linear-to-r hover:from-amber-900/30 hover:to-purple-900/20
                           hover:border-amber-500/40 hover:text-amber-100
                           transition-all duration-300 group"
                >
                  <span>{t(item.labelKey)}</span>
                  <span
                    className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 
                                 transition-all duration-300 text-amber-400"
                  >
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4
              className="mb-4 text-sm font-semibold tracking-[0.18em] uppercase 
                          text-amber-200 flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t("contact.title")}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 group">
                <div
                  className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg 
                              bg-amber-900/30 border border-amber-500/30 
                              text-amber-300 group-hover:bg-amber-500/20 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <a
                    href={`mailto:${t("contact.email")}`}
                    className="text-sm text-white hover:text-amber-300 transition-colors"
                  >
                    {t("contact.email")}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div
                  className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg 
                              bg-amber-900/30 border border-amber-500/30 
                              text-amber-300 group-hover:bg-amber-500/20 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-sm text-white">
                    {t("contact.location")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4
              className="mb-4 text-sm font-semibold tracking-[0.18em] uppercase 
                          text-amber-200 flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              {t("hours.title")}
            </h4>
            <div
              className="space-y-3 bg-neutral-900/40 dark:bg-slate-900/40 
                          rounded-xl p-4 border border-neutral-800 dark:border-slate-800"
            >
              <div className="flex items-center gap-3 group">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg 
                              bg-emerald-900/30 border border-emerald-500/30 
                              text-emerald-300"
                >
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">
                    {t("hours.weekday")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg 
                              bg-purple-900/30 border border-purple-500/30 
                              text-purple-300"
                >
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">
                    {t("hours.sunday")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800/50 dark:border-slate-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs text-neutral-500">{t("copyright")}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
