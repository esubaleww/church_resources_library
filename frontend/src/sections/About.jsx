import { motion } from "motion/react";
import { Book, Heart, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation("about");

  const aboutItems = [
    {
      icon: Book,
      title: t("pillars.learn.title"),
      description: t("pillars.learn.description"),
    },
    {
      icon: Heart,
      title: t("pillars.grow.title"),
      description: t("pillars.grow.description"),
    },
    {
      icon: Users,
      title: t("pillars.connect.title"),
      description: t("pillars.connect.description"),
    },
  ];

  return (
    <section
      id="about"
      className="relative py-20 md:py-28 overflow-hidden
                 bg-linear-to-b from-amber-50/40 via-white to-amber-50/20
                 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-16 w-80 h-80 
                      bg-linear-to-br from-amber-300/35 via-amber-200/25 to-transparent
                      dark:from-amber-600/20 dark:via-amber-500/15 dark:to-transparent 
                      rounded-full blur-3xl"
        />
        <div
          className="absolute -bottom-40 -right-10 w-96 h-96 
                      bg-linear-to-tr from-amber-200/40 via-purple-200/20 to-transparent
                      dark:from-purple-600/15 dark:via-amber-500/14 dark:to-transparent 
                      rounded-full blur-3xl"
        />

        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.008]">
          <div
            className="absolute top-1/4 left-1/4 w-24 h-24 
                        border-2 border-amber-400/20 dark:border-amber-500/10 rounded-full"
          />
          <div
            className="absolute bottom-1/3 right-1/3 w-20 h-20 
                        border border-amber-300/15 dark:border-amber-400/10 rotate-45"
          />
          <div
            className="absolute top-1/2 left-1/2 w-16 h-16 
                        border border-amber-200/10 dark:border-amber-300/5"
          />
        </div>

        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(120,53,15,0.03)_1px,transparent_1px)] 
                      dark:bg-[radial-gradient(circle_at_1px_1px,rgba(251,191,36,0.02)_1px,transparent_1px)] 
                      bg-size-[20px_20px] opacity-30 dark:opacity-20"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-4 h-0.5 bg-linear-to-r from-transparent to-amber-600/50 dark:to-amber-400/50" />
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                         bg-linear-to-r from-amber-900/5 to-purple-900/5 
                         dark:from-amber-500/10 dark:to-purple-500/10 
                         border border-amber-200/50 dark:border-amber-500/20
                         text-xs font-semibold tracking-[0.2em] uppercase
                         text-amber-800 dark:text-amber-200 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400/70 dark:bg-amber-300/70" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 dark:bg-amber-400" />
              </span>
              {t("badge")}
            </span>
            <div className="w-4 h-0.5 bg-linear-to-l from-transparent to-amber-600/50 dark:to-amber-400/50" />
          </div>

          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4
                     bg-linear-to-r from-amber-800 via-purple-800 to-amber-800
                     dark:from-amber-100 dark:via-purple-200 dark:to-amber-100
                     bg-clip-text text-transparent"
          >
            {t("heading.main")}
          </h2>

          <p className="text-2xl md:text-3xl text-amber-900/90 dark:text-amber-100/90 mb-6">
            {t("heading.sub")}
          </p>

          <p
            className="text-base md:text-lg text-neutral-700 dark:text-neutral-300 
                     max-w-2xl mx-auto leading-relaxed"
          >
            {t("intro")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20"
        >
          {aboutItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-b from-amber-500/15 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div
                className="relative flex flex-col gap-4 rounded-2xl
                         bg-linear-to-b from-white/80 to-amber-50/40
                         dark:from-slate-900/80 dark:to-slate-800/40
                         backdrop-blur-md
                         border-2 border-amber-100/50 dark:border-slate-800/50
                         shadow-xl shadow-amber-200/20 dark:shadow-black/40
                         p-6
                         group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-amber-300/30 dark:group-hover:shadow-amber-500/10
                         group-hover:border-amber-200/70 dark:group-hover:border-amber-500/30
                         transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-full bg-amber-300/50 dark:bg-amber-500/40 blur-xl opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                    <div
                      className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl 
                                  bg-linear-to-br from-amber-500 to-amber-600
                                  dark:from-amber-600 dark:to-amber-700
                                  text-white shadow-lg shadow-amber-500/40"
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-300">
                {t("mission.badge")}
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-amber-900 dark:text-amber-100 mb-6 leading-tight">
              {t("mission.title")}
            </h3>
            <div className="space-y-4">
              <p className="text-base md:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {t("mission.body1")}
              </p>
              <p className="text-base md:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {t("mission.body2")}
              </p>
            </div>
          </div>

          <motion.div
            className="relative rounded-3xl overflow-hidden
                       border-2 border-amber-100/60 dark:border-slate-800/70
                       bg-linear-to-br from-white/40 to-amber-50/30
                       dark:from-slate-900/60 dark:to-slate-800/40
                       backdrop-blur-md 
                       shadow-xl shadow-amber-200/30 dark:shadow-black/40"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute inset-0 bg-linear-to-t from-amber-900/45 via-amber-900/20 to-transparent 
                          dark:from-black/65 dark:via-black/40 dark:to-transparent pointer-events-none"
            />
            <img
              src="/about.webp"
              alt={t("image.alt")}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-linear-to-t from-black/85 via-black/50 to-transparent">
              <div className="flex items-center justify-between gap-4">
                <div
                  className="inline-flex items-center gap-2 rounded-full 
                              bg-amber-900/85 text-amber-50 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em]"
                >
                  {t("image.chip")}
                </div>
                <span className="hidden sm:inline-block text-xs text-amber-50/90">
                  {t("image.caption")}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                        bg-white/60 dark:bg-slate-900/40 
                        border border-amber-100/50 dark:border-slate-800/50"
          >
            <span className="text-xs text-amber-700 dark:text-amber-300">
              🙏 {t("footer.blessing", "May God bless our journey together")}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
