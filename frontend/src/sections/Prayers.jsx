import { useEffect, useState } from "react";
import PrayerCard from "../components/PrayerCard";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

export default function Prayers() {
  const [prayerList, setPrayerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation("prayers");
  const lng = i18n.language || "en";

  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/prayers");
        if (!res.ok) throw new Error("prayers.fetch_failed");
        const data = await res.json();
        setPrayerList(data);
      } catch (error) {
        console.error(error);
        setPrayerList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayers();
  }, []);

  const visiblePrayers =
    lng === "am"
      ? prayerList.filter(
          (p) =>
            (p.title_am && p.title_am.trim()) ||
            (p.description_am && p.description_am.trim()) ||
            (p.filePath_am && p.filePath_am.trim())
        )
      : prayerList;

  const hasAny = visiblePrayers.length > 0;

  return (
    <section
      id="prayers"
      className="relative py-20 md:py-24
                 bg-linear-to-b from-white via-amber-50/40 to-white
                 dark:from-slate-950 dark:via-slate-900/80 dark:to-slate-950
                 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-24 -left-24 w-72 h-72 
                      bg-linear-to-br from-amber-200/60 via-amber-100/40 to-transparent
                      dark:from-amber-600/20 dark:via-amber-500/15 dark:to-transparent 
                      rounded-full blur-3xl"
        />
        <div
          className="absolute -bottom-20 -right-16 w-80 h-80 
                      bg-linear-to-tr from-amber-300/40 via-purple-200/30 to-transparent
                      dark:from-purple-600/15 dark:via-amber-500/10 dark:to-transparent 
                      rounded-full blur-3xl"
        />

        <div
          className="absolute inset-0 bg-[radial-linear(circle_at_1px_1px,rgba(120,53,15,0.05)_1px,transparent_1px)] 
                      dark:bg-[radial-linear(circle_at_1px_1px,rgba(251,191,36,0.03)_1px,transparent_1px)] 
                      bg-size-[20px_20px] opacity-40 dark:opacity-30"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                       bg-linear-to-r from-amber-100/90 to-amber-50/90
                       dark:from-amber-500/15 dark:to-purple-500/15
                       border border-amber-200/80 dark:border-amber-500/30
                       text-xs font-semibold tracking-[0.18em] uppercase
                       text-amber-800 dark:text-amber-200 mb-4
                       shadow-sm dark:shadow-amber-500/10"
          >
            {t("badge")}
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 
                           dark:bg-amber-400"
            />
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold 
                       bg-linear-to-r from-amber-800 via-amber-700 to-amber-800
                       dark:from-amber-100 dark:via-amber-200 dark:to-amber-100
                       bg-clip-text text-transparent mb-4"
          >
            {t("title")}
          </h2>
          <p
            className="text-neutral-700 dark:text-neutral-300 
                     max-w-3xl mx-auto text-base md:text-lg 
                     leading-relaxed"
          >
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl 
                     border-2 border-amber-100/80 dark:border-slate-800/70
                     bg-linear-to-br from-white/95 via-white/90 to-amber-50/80
                     dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-950/90
                     backdrop-blur-sm 
                     shadow-xl shadow-amber-200/30 dark:shadow-black/40
                     px-6 py-8 sm:px-8 sm:py-10
                     relative overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-linear-to-tr from-amber-100/0 via-transparent to-purple-100/0
                        dark:from-amber-500/0 dark:via-transparent dark:to-purple-500/0
                        opacity-30 dark:opacity-20"
          />

          <div className="relative grid gap-8 md:gap-10 md:grid-cols-3">
            {loading ? (
              <div className="text-center py-12 col-span-full">
                <div className="inline-flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500/80 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/80 animate-pulse delay-100" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/80 animate-pulse delay-200" />
                </div>
                <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                  {t("loading")}
                </p>
              </div>
            ) : hasAny ? (
              visiblePrayers.map((prayer, index) => (
                <PrayerCard
                  key={prayer._id || index}
                  index={index}
                  {...prayer}
                />
              ))
            ) : (
              <div className="text-center py-12 col-span-full">
                <div
                  className="inline-flex items-center justify-center w-12 h-12 
                             rounded-full bg-amber-100/50 dark:bg-slate-800/50 
                             mb-4"
                >
                  <span className="text-amber-600 dark:text-amber-400">🙏</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                  {t("empty", "No prayers available")}
                </h3>
              </div>
            )}
          </div>

          {lng === "am" && (
            <div className="absolute top-4 right-4">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full
                           bg-amber-100/60 dark:bg-amber-500/20 
                           border border-amber-200/50 dark:border-amber-500/30"
              >
                <span className="text-xs font-medium text-amber-800 dark:text-amber-200">
                  🇪🇹 Amharic
                </span>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p
            className="text-xs text-neutral-500 dark:text-neutral-400 
                     inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                     bg-white/50 dark:bg-slate-900/50
                     border border-amber-100/50 dark:border-slate-800/50"
          >
            <span className="w-1 h-1 rounded-full bg-amber-400/70" />
            {visiblePrayers.length} {t("prayers_count", "prayers available")}
            <span className="w-1 h-1 rounded-full bg-amber-400/70" />
          </p>
        </motion.div>
      </div>
    </section>
  );
}
