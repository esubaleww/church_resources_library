import { motion } from "motion/react";
import {
  getTypeIcon,
  getTypeColor,
  getTypeBg,
} from "../utils/resourceTypeUtils";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ResourceCard({
  title,
  description,
  category,
  type,
  link,

  title_en,
  title_am,
  description_en,
  description_am,
  category_en,
  category_am,
  type_en,
  type_am,
  link_en,
  link_am,

  index,
  onOpen,
}) {
  const { i18n, t } = useTranslation("resources");
  const lng = i18n.language || "en";

  const displayTitle = lng === "am" ? title_am ?? "" : title_en ?? title ?? "";

  const displayDescription =
    lng === "am" ? description_am ?? "" : description_en ?? description ?? "";

  const displayCategory =
    lng === "am" ? category_am ?? "" : category_en ?? category ?? "";

  const displayType = lng === "am" ? type_am ?? "" : type_en ?? type ?? "";

  const displayLink = lng === "am" ? link_am ?? "" : link_en ?? link ?? "";

  const typeForStyle = displayType || type_en || type || "";
  const TypeIcon = getTypeIcon(typeForStyle);
  const typeColorClass = getTypeColor(typeForStyle);
  const typeBgClass = getTypeBg(typeForStyle);

  const handleClick = () => {
    onOpen?.({
      title: displayTitle,
      description: displayDescription,
      category: displayCategory,
      type: displayType,
      link: displayLink,
    });
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label={t("card.open_aria", { title: displayTitle || "resource" })}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      className="group relative w-full text-left h-full"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(168, 85, 247, 0.15), rgba(59, 130, 246, 0.15))",
          filter: "blur(20px)",
        }}
      />

      <div
        className="relative h-full rounded-[1.75rem] overflow-hidden
                   bg-linear-to-br from-white via-amber-50/30 to-white
                   dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900
                   border border-amber-200/60 dark:border-slate-700/60
                   shadow-lg shadow-amber-100/20 dark:shadow-black/40
                   transition-all duration-300
                   group-hover:shadow-2xl group-hover:shadow-amber-200/30 dark:group-hover:shadow-purple-900/20
                   group-hover:border-amber-300/80 dark:group-hover:border-purple-500/50"
      >
        <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-amber-50/30 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-amber-200/20 to-transparent dark:from-amber-500/10 rounded-bl-full opacity-50" />

        <div className="relative p-6 sm:p-7 flex flex-col h-full">
          <div className="flex items-start justify-between mb-5">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`relative flex items-center justify-center w-14 h-14 rounded-2xl
                          ${typeBgClass} ${typeColorClass}
                          shadow-sm group-hover:shadow-md
                          transition-shadow duration-300`}
            >
              <div
                className={`absolute inset-0 rounded-2xl ${typeBgClass} blur-md opacity-50`}
              />
              <TypeIcon className="relative w-6 h-6" strokeWidth={2.5} />
            </motion.div>

            <span
              className="px-3.5 py-1.5 text-xs font-semibold rounded-full
                         bg-linear-to-r from-amber-100 to-amber-50
                         dark:from-slate-800 dark:to-slate-700/80
                         text-amber-900 dark:text-amber-200
                         border border-amber-200/50 dark:border-slate-600/50
                         shadow-sm backdrop-blur-sm
                         transition-all duration-300
                         group-hover:shadow-md group-hover:scale-105"
            >
              {displayCategory}
            </span>
          </div>

          <div className="flex-1 space-y-3 mb-4">
            <h3
              className="text-lg sm:text-xl font-bold
                         bg-linear-to-br from-slate-900 via-slate-800 to-slate-900
                         dark:from-amber-50 dark:via-white dark:to-amber-50
                         bg-clip-text text-transparent
                         leading-snug line-clamp-2
                         transition-all duration-300
                         group-hover:from-amber-900 group-hover:via-amber-800 group-hover:to-amber-900
                         dark:group-hover:from-amber-200 dark:group-hover:via-amber-100 dark:group-hover:to-amber-200"
              title={displayTitle}
            >
              {displayTitle}
            </h3>

            <p
              className="text-sm leading-relaxed
                         text-slate-700 dark:text-slate-300
                         line-clamp-3
                         transition-colors duration-300
                         group-hover:text-slate-900 dark:group-hover:text-slate-100"
            >
              {displayDescription}
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-amber-100/50 dark:border-slate-700/50">
            <div
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl
                          bg-linear-to-r from-white to-amber-50/50
                          dark:from-slate-800/80 dark:to-slate-700/50
                          border border-amber-200/40 dark:border-slate-600/40
                          ${typeColorClass}
                          shadow-sm backdrop-blur-sm
                          transition-all duration-300
                          group-hover:shadow-md`}
            >
              <TypeIcon className="w-4 h-4" strokeWidth={2} />
              <span className="text-xs font-semibold capitalize tracking-wide">
                {displayType}
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1.5
                         text-xs font-semibold
                         text-amber-700 dark:text-amber-300
                         opacity-0 group-hover:opacity-100
                         translate-x-2 group-hover:translate-x-0
                         transition-all duration-300"
            >
              <span>{t("card.explore")}</span>
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} />
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "linear-linear(135deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%)",
          }}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      </div>
    </motion.button>
  );
}
