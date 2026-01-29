import { motion, useReducedMotion, m } from "framer-motion";
import { Cross } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useEffect } from "react";

export default function Hero({ scrollToSection }) {
  const { t } = useTranslation("hero");
  const prefersReducedMotion = useReducedMotion();

  // Preload hero image on component mount
  useEffect(() => {
    if (typeof document !== "undefined") {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = "/hero.webp";
      link.as = "image";
      link.type = "image/webp";

      // Check if link already exists
      const existing = document.querySelector(`link[href="/hero.webp"]`);
      if (!existing) {
        document.head.appendChild(link);
      }
    }
  }, []);

  // Optimize image loading with proper dimensions
  const heroImage = useMemo(
    () => ({
      src: "/hero.webp",
      alt: t("background_alt"),
      sideAlt: t("side_image_alt"),
      width: 1920,
      height: 1080,
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    }),
    [t],
  );

  // Memoize scroll handlers to prevent re-renders
  const handleScrollToResources = useCallback(
    (e) => {
      e.preventDefault();
      scrollToSection("resources");
    },
    [scrollToSection],
  );

  const handleScrollToEvents = useCallback(
    (e) => {
      e.preventDefault();
      scrollToSection("events");
    },
    [scrollToSection],
  );

  // Optimize animations for reduced motion preference
  const animationProps = useMemo(
    () => ({
      initial: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 },
      animate: prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            duration: 0.85,
            ease: [0.6, 0.01, -0.05, 0.95],
            type: "spring",
            stiffness: 100,
            damping: 10,
          },
    }),
    [prefersReducedMotion],
  );

  const rightAnimationProps = useMemo(
    () => ({
      initial: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 40 },
      animate: prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 },
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            duration: 0.9,
            delay: 0.25,
            ease: [0.6, 0.01, -0.05, 0.95],
            type: "spring",
            stiffness: 100,
            damping: 10,
          },
    }),
    [prefersReducedMotion],
  );

  // Optimize button hover animations
  const buttonHoverProps = useMemo(
    () => (prefersReducedMotion ? {} : { scale: 1.06, y: -2 }),
    [prefersReducedMotion],
  );

  const buttonTapProps = useMemo(
    () => (prefersReducedMotion ? {} : { scale: 0.96 }),
    [prefersReducedMotion],
  );

  // Optimize gradients - convert to CSS where possible
  const gradientOverlay = useMemo(
    () => (
      <div
        className="absolute inset-0 hero-gradient-fix
        bg-linear-to-br 
        from-black/85 via-amber-950/75 to-purple-950/60
        dark:from-black/95 dark:via-slate-950/90 dark:to-purple-950/80
        mix-blend-multiply"
      />
    ),
    [],
  );

  // Optimize radial gradients - convert complex gradients to simpler ones
  const radialGradients = useMemo(
    () => (
      <div
        className="pointer-events-none absolute inset-0 hero-gradient-fix
        bg-[radial-linear(circle_at_top_right,rgba(251,191,36,0.32),transparent_55%)]
        dark:bg-[radial-linear(circle_at_top_right,rgba(251,191,36,0.22),transparent_55%)]"
      />
    ),
    [],
  );

  // Optimize main hero image
  const MainHeroImage = useMemo(
    () => (
      <img
        src={heroImage.src}
        alt={heroImage.alt}
        width={heroImage.width}
        height={heroImage.height}
        sizes={heroImage.sizes}
        loading="eager" // Changed from lazy for above-the-fold content
        decoding="async"
        fetchPriority="high" // Critical for LCP
        className="w-full h-full object-cover hero-gradient-fix"
        style={{ contentVisibility: "auto" }}
      />
    ),
    [heroImage],
  );

  // Optimize side image
  const SideHeroImage = useMemo(
    () => (
      <img
        src={heroImage.src}
        alt={heroImage.sideAlt}
        width={heroImage.width}
        height={heroImage.height}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover scale-110 hero-gradient-fix"
        style={{ contentVisibility: "auto" }}
      />
    ),
    [heroImage],
  );

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-black dark:bg-slate-950 hero-section"
    >
      {/* Critical CSS for initial paint */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .hero-gradient-fix {
            will-change: transform;
            transform: translateZ(0);
            backface-visibility: hidden;
          }
          .hero-blur-fix {
            isolation: isolate;
          }
          @keyframes heroFadeIn {
            to { opacity: 1; }
          }
          .hero-section {
            opacity: 0;
            animation: heroFadeIn 0.3s ease-out forwards;
          }
        `,
        }}
      />

      <div className="absolute inset-0 z-0">
        {/* Main hero image */}
        {MainHeroImage}

        {gradientOverlay}
        {radialGradients}

        <div className="pointer-events-none absolute inset-0 opacity-[0.015] dark:opacity-[0.008] hero-blur-fix">
          <div
            className="absolute top-1/4 left-1/4 w-32 h-32 
                border-2 border-amber-300/20 dark:border-amber-400/10 rounded-full hero-gradient-fix"
          />
          <div
            className="absolute bottom-1/3 right-1/3 w-24 h-24 
                border border-amber-200/15 dark:border-amber-300/10 rounded-full hero-gradient-fix"
          />
        </div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-16 md:py-20 lg:py-28">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center w-full">
            <motion.div {...animationProps}>
              <div className="flex items-center gap-4 mb-8">
                <div className="relative hero-blur-fix">
                  <div
                    className="absolute inset-0 rounded-full 
                  bg-linear-to-br from-amber-400/50 via-amber-300/30 to-yellow-200/20 
                  blur-2xl animate-pulse-slow hero-blur-fix"
                  />
                  <Cross
                    aria-label={t("cross_aria")}
                    className="relative w-16 h-16 md:w-20 md:h-20 
                text-amber-300 dark:text-amber-200
                drop-shadow-[0_0_24px_rgba(250,204,21,0.8)]
                dark:drop-shadow-[0_0_24px_rgba(251,191,36,0.6)] hero-gradient-fix"
                  />
                </div>

                <div className="hidden sm:flex flex-col">
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
                    bg-white/10 border border-white/15 backdrop-blur-sm
                    text-amber-100 hero-blur-fix"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {t("badge.church")}
                  </span>

                  <span className="mt-2 text-xs italic text-amber-200/80">
                    {t("verse.top.text")}
                    <span className="ml-1 text-[11px] opacity-90">
                      {t("verse.top.ref")}
                    </span>
                  </span>
                </div>
              </div>

              <h1
                className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7.5xl
  font-bold leading-tight drop-shadow-2xl
  bg-linear-to-r from-amber-200 via-amber-100 to-amber-200
  dark:from-amber-100 dark:via-amber-50 dark:to-amber-100
  bg-clip-text text-transparent hero-gradient-fix"
              >
                {t("title")}
              </h1>

              <p
                className="max-w-2xl mb-8 text-neutral-100 dark:text-neutral-200
                text-base md:text-lg leading-relaxed"
              >
                {t("subtitle")}
              </p>

              <div className="lg:hidden mb-8 text-sm italic text-amber-200/80">
                {t("verse.mobile.text")}
                <span className="ml-2 opacity-80">{t("verse.mobile.ref")}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  className="inline-flex items-center justify-center px-10 py-4 rounded-xl
  bg-linear-to-r from-amber-500 via-amber-600 to-amber-700
  dark:from-amber-600 dark:via-amber-700 dark:to-amber-800
  text-base font-semibold text-white
  shadow-2xl shadow-amber-900/40 dark:shadow-amber-900/30
  hover:shadow-3xl hover:shadow-amber-900/50 dark:hover:shadow-amber-900/40
  hover:from-amber-600 hover:via-amber-700 hover:to-amber-800
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80
  transition-all duration-300 hero-gradient-fix"
                  whileHover={buttonHoverProps}
                  whileTap={buttonTapProps}
                  onClick={handleScrollToResources}
                >
                  {t("buttons.resources.label")}
                </motion.button>

                <motion.button
                  className="inline-flex items-center justify-center px-9 py-3.5 rounded-xl
                  border border-emerald-300/50
                  bg-white/5
                  text-sm md:text-base font-medium text-emerald-100/90
                  hover:bg-white/10 transition-all hero-gradient-fix"
                  whileHover={buttonHoverProps}
                  whileTap={buttonTapProps}
                  onClick={handleScrollToEvents}
                >
                  {t("buttons.events.label")}
                </motion.button>
              </div>
            </motion.div>

            <motion.div className="hidden lg:block" {...rightAnimationProps}>
              <div
                className="relative h-96 xl:h-104 rounded-3xl
  border border-amber-100/20 dark:border-amber-200/10
  bg-linear-to-br from-white/10 via-transparent to-amber-50/5
  dark:from-slate-900/30 dark:via-transparent dark:to-amber-900/10
  backdrop-blur-xl hero-blur-fix
  shadow-2xl shadow-black/40 dark:shadow-black/50
  overflow-hidden
  before:absolute before:inset-0 before:rounded-3xl 
  before:border before:border-white/10 dark:before:border-white/5
  before:pointer-events-none hero-gradient-fix"
              >
                <div className="absolute inset-3 rounded-2xl overflow-hidden">
                  {/* Keep the side image as requested */}
                  {SideHeroImage}
                  <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/30 to-transparent hero-gradient-fix" />
                </div>

                <div className="absolute inset-x-6 bottom-6 space-y-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-200/80">
                    {t("ribbon")}
                  </p>

                  <p className="text-sm text-amber-50/95 leading-relaxed">
                    {t("verse.desktop.top.text")}
                    <span className="ml-2 text-amber-100/80">
                      {t("verse.desktop.top.ref")}
                    </span>
                  </p>

                  <p className="text-sm italic text-amber-200/70">
                    {t("verse.desktop.bottom.text")}
                    <span className="ml-2 opacity-70">
                      {t("verse.desktop.bottom.ref")}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
