import { motion } from "motion/react";
import { Clock, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

export default function PrayerCard({
  title,
  description,
  filePath,

  title_en,
  title_am,
  description_en,
  description_am,
  filePath_en,
  filePath_am,

  image,
  time,
  index,
}) {
  const { i18n, t } = useTranslation("prayers");
  const lng = i18n.language || "en";

  const displayTitle =
    lng === "am" ? (title_am ?? "") : (title_en ?? title ?? "");

  const displayDescription =
    lng === "am"
      ? (description_am ?? "")
      : (description_en ?? description ?? "");

  const displayFilePath =
    lng === "am" ? (filePath_am ?? "") : (filePath_en ?? filePath ?? "");

  const [openModal, setOpenModal] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(false);

  const isPdf = useMemo(() => {
    if (!displayFilePath) return false;
    const lower = displayFilePath.toLowerCase();
    return lower.endsWith(".pdf") || lower.includes(".pdf?");
  }, [displayFilePath]);

  const handleOpenModal = async () => {
    if (!displayFilePath) return;
    setOpenModal(true);

    if (!isPdf && !htmlContent && displayFilePath) {
      try {
        setLoading(true);
        const res = await fetch(displayFilePath);
        if (!res.ok) {
          toast.error(
            t("errors.load_text_failed") || "Failed to load prayer text.",
          );
          return;
        }
        const text = await res.text();
        setHtmlContent(text);
      } catch (err) {
        toast.error(
          t("errors.generic") ||
            "Unable to load this prayer text at the moment.",
        );
        setHtmlContent("<p>Unable to load this prayer text at the moment.</p>");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        whileHover={{ y: -6 }}
        className="group rounded-2xl overflow-hidden
                   bg-white dark:bg-slate-900
                   border border-neutral-100 dark:border-slate-700
                   shadow-sm shadow-neutral-200/70
                   dark:shadow-[0_18px_48px_rgba(0,0,0,0.55)]
                   transition-all duration-300"
      >
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-t from-amber-900/70 via-amber-900/40 to-transparent z-10" />
          <img
            src={image}
            alt={displayTitle || title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
            <h3 className="mb-1 text-lg font-semibold leading-snug drop-shadow-md">
              {displayTitle || title}
            </h3>
            <div className="flex items-center gap-2 text-amber-100 text-sm">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col h-full bg-white/90 dark:bg-slate-900/95">
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {displayDescription || description}
          </p>

          {displayFilePath && (
            <motion.button
              className="mt-5 w-full px-4 py-2.5 rounded-xl
                         bg-amber-50 text-amber-700
                         dark:bg-amber-500/15 dark:text-amber-100
                         font-medium shadow-sm
                         hover:bg-amber-100 dark:hover:bg-amber-500/25
                         transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpenModal}
            >
              {isPdf ? t("buttons.open_pdf") : t("buttons.view_text")}
            </motion.button>
          )}
        </div>
      </motion.div>

      {openModal && displayFilePath && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 py-6">
          <div
            className="w-full sm:w-11/12 md:w-5/6 lg:w-3/4 max-w-5xl
                   bg-white dark:bg-slate-950
                   rounded-2xl shadow-2xl p-5 md:p-6 max-h-[90vh] flex flex-col
                   border border-neutral-200/70 dark:border-slate-800
                   relative"
          >
            <button
              onClick={() => setOpenModal(false)}
              aria-label="close"
              className="absolute top-16 right-16 z-10
                     p-2 bg-white dark:bg-slate-900 
                     text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400
                     rounded-lg shadow border border-slate-200 dark:border-slate-700
                     transition-colors hover:scale-110
                     flex items-center justify-center w-9 h-9"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-3 pr-12">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                {displayTitle || title}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3" />
                <span>{time}</span>
              </p>
            </div>

            <div className="border-t border-neutral-200 dark:border-slate-800 pt-3 overflow-y-auto flex-1">
              {isPdf ? (
                <div className="w-full h-[70vh]">
                  <iframe
                    src={displayFilePath}
                    title={displayTitle || title}
                    className="w-full h-full border-0 bg-white dark:bg-slate-900"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {t("loading")}
                  </p>
                </div>
              ) : (
                <div
                  className="prose prose-sm md:prose-base prose-amber max-w-none
                         text-neutral-800 dark:text-neutral-100
                         dark:prose-invert p-2"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
