import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import {
  getTypeIcon,
  getTypeColor,
  getTypeBg,
} from "../utils/resourceTypeUtils";
import { useTranslation } from "react-i18next";

export default function ResourceRow({
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
  const { i18n } = useTranslation("resources");
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
      aria-label={`Open resource: ${displayTitle || "resource"}`}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: index * 0.02 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      className="group relative w-full text-left"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0
                   group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(168,85,247,0.10), rgba(59,130,246,0.10))",
          filter: "blur(14px)",
        }}
      />

      <div
        className="relative rounded-2xl border
                   bg-linear-to-r from-white via-amber-50/20 to-white
                   dark:from-slate-950 dark:via-slate-900/70 dark:to-slate-950
                   border-amber-100/70 dark:border-slate-800
                   shadow-sm shadow-amber-100/30 dark:shadow-black/30
                   hover:shadow-md hover:border-amber-200/90
                   dark:hover:border-purple-500/50
                   transition-all duration-200"
      >
        <div className="px-4 sm:px-5 py-4 flex items-start gap-3 sm:gap-4">
          <div
            className={`relative flex h-9 w-9 items-center justify-center rounded-xl
                        ${typeBgClass} ${typeColorClass}
                        shadow-sm group-hover:shadow-md transition-shadow duration-200`}
          >
            <div
              className={`absolute inset-0 rounded-xl ${typeBgClass} blur-md opacity-40`}
            />
            <TypeIcon className="relative w-4 h-4" strokeWidth={2.2} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] mb-1">
              <span
                className="px-2.5 py-0.5 rounded-full
                           bg-linear-to-r from-amber-100/80 to-amber-50/60
                           dark:from-slate-800 dark:to-slate-700/80
                           text-amber-900 dark:text-amber-200
                           border border-amber-200/60 dark:border-slate-700/70
                           font-semibold tracking-wide"
              >
                {displayCategory}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
                            bg-white/80 dark:bg-slate-800/80
                            border border-amber-100/60 dark:border-slate-700/70
                            text-[11px] font-semibold capitalize
                            ${typeColorClass}`}
              >
                <TypeIcon className="w-3 h-3 opacity-80" strokeWidth={2} />
                <span className="tracking-wide">{displayType}</span>
              </span>
            </div>

            <p
              className="text-sm sm:text-[0.95rem] font-semibold
                         bg-linear-to-r from-slate-900 via-slate-800 to-slate-900
                         dark:from-amber-50 dark:via-white dark:to-amber-50
                         bg-clip-text text-transparent
                         line-clamp-1"
              title={displayTitle}
            >
              {displayTitle}
            </p>

            <p
              className="mt-0.5 text-xs sm:text-[0.8rem] leading-relaxed
                         text-slate-700 dark:text-slate-300
                         line-clamp-2
                         group-hover:text-slate-900 dark:group-hover:text-slate-100
                         transition-colors duration-200"
            >
              {displayDescription}
            </p>
          </div>

          <div
            className="ml-2 flex items-center gap-1 text-[11px] font-semibold
                       text-amber-700 dark:text-amber-300
                       opacity-0 translate-x-1
                       group-hover:opacity-100 group-hover:translate-x-0
                       transition-all duration-200"
          >
            <span className="hidden sm:inline">Open</span>
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.4} />
          </div>
        </div>
      </div>
    </motion.button>
  );
}
