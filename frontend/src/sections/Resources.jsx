import { useState, useEffect, useMemo, useCallback } from "react";
import ResourceCard from "../components/ResourceCard";
import ResourceRow from "../components/ResourceRow";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutGrid,
  List as ListIcon,
  ChevronDown,
  RefreshCw,
  X,
  Filter,
  Cross,
} from "lucide-react";
import { resourceCategories } from "../utils/resourceCategories";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewerResource, setViewerResource] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [frameLoading, setFrameLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const PAGE_SIZE = 8;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { t, i18n } = useTranslation("resources");
  const lng = i18n.language || "en";

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/resources");
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          const msgKey = data.message || "resources.fetch_failed";
          toast.error(t(msgKey, "Could not load resources. Please try again."));
          setResources([]);
          return;
        }

        setResources((prev) => {
          if (
            Array.isArray(data) &&
            prev.length === data.length &&
            JSON.stringify(prev) === JSON.stringify(data)
          ) {
            return prev;
          }

          return Array.isArray(data) ? data : [];
        });
      } catch (error) {
        toast.error(
          t(
            "resources.fetch_failed",
            "Could not load resources. Please try again.",
          ),
        );
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
    const interval = setInterval(fetchResources, 10000);
    return () => clearInterval(interval);
  }, [t, loading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setVisibleCount(PAGE_SIZE);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, PAGE_SIZE]);

  const languageResources = useMemo(() => {
    return resources
      .map((res) => {
        let title, description;

        if (lng === "am") {
          title = res.title_am;
          description = res.description_am;
        } else {
          title = res.title || res.title_en;
          description = res.description || res.description_en;
        }

        return {
          ...res,
          title: title || "",
          description: description || "",
        };
      })
      .filter((res) => {
        if (lng === "am") {
          return (
            (res.title_am && res.title_am.trim()) ||
            (res.description_am && res.description_am.trim())
          );
        } else {
          return (
            (res.title && res.title.trim()) ||
            (res.description && res.description.trim()) ||
            (res.title_en && res.title_en.trim()) ||
            (res.description_en && res.description_en.trim())
          );
        }
      });
  }, [resources, lng]);

  const searchableResources = useMemo(
    () =>
      languageResources.map((res) => ({
        ...res,
        searchString:
          `${res.title || ""} ${res.description || ""}`.toLowerCase(),
      })),
    [languageResources],
  );

  const filteredResources = useMemo(() => {
    let filtered = searchableResources;

    if (selectedCategory !== "All") {
      const cat = selectedCategory.toLowerCase().trim();
      filtered = filtered.filter(
        (res) => res.category && res.category.toLowerCase().trim() === cat,
      );
    }

    if (debouncedSearch.trim() !== "") {
      const term = debouncedSearch.toLowerCase();
      filtered = filtered.filter((res) => res.searchString.includes(term));
    }

    return filtered;
  }, [searchableResources, selectedCategory, debouncedSearch]);

  const visibleResources = filteredResources.slice(0, visibleCount);
  const hasMore = visibleCount < filteredResources.length;

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  const handleOpenResource = useCallback((res) => {
    setViewerResource(res);
    setIsViewerOpen(true);
    setFrameLoading(true);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setIsViewerOpen(false);
    setTimeout(() => {
      setViewerResource(null);
      setFrameLoading(true);
    }, 300);
  }, []);

  const convertYouTubeToEmbed = useCallback((url) => {
    if (!url || typeof url !== "string") return url;

    try {
      const u = new URL(url);

      if (u.hostname.includes("google.") && u.pathname === "/url") {
        const inner = u.searchParams.get("url");
        if (inner) return convertYouTubeToEmbed(inner);
      }

      if (
        !u.hostname.includes("youtube.com") &&
        !u.hostname.includes("youtu.be")
      ) {
        return url;
      }

      let videoId = "";

      if (u.searchParams.has("v")) {
        videoId = u.searchParams.get("v");
      } else if (u.hostname.includes("youtu.be")) {
        videoId = u.pathname.slice(1);
      }

      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (e) {
      console.error("Failed to parse YouTube URL", e);
    }
    return url;
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory("All");
    setSearchTerm("");
    setVisibleCount(PAGE_SIZE);
  }, [PAGE_SIZE]);

  return (
    <section
      id="resources"
      className="relative pt-24 pb-16
                 bg-lnear-to-b from-amber-50/40 via-white to-amber-50/20
                 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
                 overflow-hidden min-h-screen"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 border-2 border-amber-900/20 dark:border-amber-500/10 rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-amber-800/15 dark:border-amber-400/10 rounded-full" />
          <div className="absolute top-1/3 right-1/3 w-32 h-32 border border-amber-700/10 dark:border-amber-300/5" />
        </div>

        <div
          className="absolute -top-40 -right-40 w-80 h-80 
                     bg-lnear-to-br from-amber-300/30 via-transparent to-transparent 
                     dark:from-amber-600/20 dark:via-transparent dark:to-transparent 
                     rounded-full blur-3xl"
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 
                     bg-lnear-to-tr from-purple-300/20 via-transparent to-transparent 
                     dark:from-purple-600/10 dark:via-transparent dark:to-transparent 
                     rounded-full blur-3xl"
        />

        <div className="absolute inset-0 opacity-40 dark:opacity-5 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.02%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 pt-4"
        >
          <div className="relative inline-flex items-center gap-3 mb-4">
            <div className="w-4 h-0.5 bg-lnear-to-r from-transparent to-amber-600/50 dark:to-amber-400/50" />
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                         bg-lnear-to-r from-amber-900/5 to-purple-900/5 
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
            <div className="w-4 h-0.5 bg-lnear-to-l from-transparent to-amber-600/50 dark:to-amber-400/50" />
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold 
                       bg-linear-to-r from-amber-800 via-amber-700 to-amber-800
                       dark:from-amber-100 dark:via-amber-200 dark:to-amber-100
                       bg-clip-text text-transparent mb-4"
          >
            {t("title")}
          </h2>

          <p
            className="text-base md:text-lg text-neutral-700 dark:text-neutral-300 
                       max-w-2xl mx-auto leading-relaxed"
          >
            {t("subtitle")}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-2xl w-full">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 
                             text-amber-600/70 dark:text-amber-400/70"
                />
                <input
                  type="text"
                  placeholder={t("search.placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 rounded-xl 
                             border-2 border-amber-100/50 dark:border-slate-700/50 
                             bg-white/80 dark:bg-slate-900/60 
                             shadow-lg shadow-amber-500/5 dark:shadow-slate-900/30
                             focus:outline-none focus:ring-2 focus:ring-amber-500/50 
                             focus:border-amber-300 dark:focus:border-amber-500/30
                             transition-all placeholder:text-neutral-400 
                             dark:placeholder:text-neutral-500 
                             text-neutral-900 dark:text-neutral-100
                             backdrop-blur-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    aria-label="close"
                    className="absolute right-3 top-1/2 -translate-y-1/2 
                               p-1 rounded-full hover:bg-amber-100/50 
                               dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <X className="w-4 h-4 text-neutral-400" />
                  </button>
                )}
              </div>
              <p
                className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 
                           text-center lg:text-left"
              >
                {t("search.helper")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileFilters(true)}
                aria-label="show-modal"
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 
                           rounded-xl border-2 border-amber-200/50 dark:border-slate-700/50 
                           bg-white/80 dark:bg-slate-900/60 
                           text-sm font-medium text-amber-800 dark:text-amber-200 
                           shadow-sm hover:shadow-md transition-all"
              >
                <Filter className="w-4 h-4" />
                {t("filters.filter_button")}
              </button>

              <div
                className="inline-flex items-center rounded-xl 
             bg-white/80 dark:bg-slate-900/60 
             border-2 border-amber-100/50 dark:border-slate-700/50 
             p-1 backdrop-blur-sm"
              >
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="grid-view"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg 
                text-sm font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-linear-to-r from-amber-500 to-purple-600 text-white shadow-lg"
                    : "text-neutral-600 dark:text-neutral-300 hover:bg-amber-50/50 dark:hover:bg-slate-800/50"
                }`}
                >
                  <LayoutGrid
                    className={`w-4 h-4 ${
                      viewMode === "grid"
                        ? "text-white"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  />
                  <span className="hidden sm:inline">{t("view.grid")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="list-view"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg 
                text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-linear-to-r from-amber-500 to-purple-600 text-white shadow-lg"
                    : "text-neutral-600 dark:text-neutral-300 hover:bg-amber-50/50 dark:hover:bg-slate-800/50"
                }`}
                >
                  <ListIcon
                    className={`w-4 h-4 ${
                      viewMode === "list"
                        ? "text-white"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  />
                  <span className="hidden sm:inline">{t("view.list")}</span>
                </button>
              </div>
            </div>
          </div>

          {(selectedCategory !== "All" || searchTerm) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex flex-wrap items-center gap-2"
            >
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {t("filters.active_label")}
              </span>
              {selectedCategory !== "All" && (
                <span
                  className="inline-flex items-center gap-1 px-3 py-1.5 
                             rounded-full bg-amber-100/70 dark:bg-amber-500/20 
                             text-xs font-medium text-amber-800 dark:text-amber-200"
                >
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("All")}
                    aria-label="category"
                    className="ml-1 p-0.5 hover:bg-amber-200/50 dark:hover:bg-amber-500/30 
                               rounded-full transition-colors"
                  >
                    <Cross className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span
                  className="inline-flex items-center gap-1 px-3 py-1.5 
                             rounded-full bg-purple-100/70 dark:bg-purple-500/20 
                             text-xs font-medium text-purple-800 dark:text-purple-200"
                >
                  "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    aria-label="search"
                    className="ml-1 p-0.5 hover:bg-purple-200/50 dark:hover:bg-purple-500/30 
                               rounded-full transition-colors"
                  >
                    <Cross className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-neutral-500 dark:text-neutral-400 
                           hover:text-amber-600 dark:hover:text-amber-300 
                           underline underline-offset-2 transition-colors"
              >
                {t("filters.clear_all")}
              </button>
            </motion.div>
          )}
        </motion.div>

        <div className="flex gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block w-64 shrink-0"
          >
            <div className="sticky top-24">
              <div
                className="rounded-2xl border-2 border-amber-100/50 dark:border-slate-800/50 
                 bg-white/80 dark:bg-slate-900/40 p-6 
                 backdrop-blur-sm shadow-xl shadow-amber-500/10 dark:shadow-slate-900/30"
              >
                <h3
                  className="text-lg font-semibold mb-4 
                   text-amber-800 dark:text-amber-100 
                   flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {t("sidebar.categories_title")}
                </h3>
                <div className="space-y-2">
                  {resourceCategories.map(({ short, shortLabel, full }) => (
                    <button
                      key={short}
                      onClick={() => setSelectedCategory(short)}
                      aria-label="setCategory"
                      className={`w-full text-left px-4 py-3 rounded-xl 
                       transition-all duration-200 ${
                         selectedCategory === short
                           ? "bg-linear-to-r from-amber-500/15 to-purple-500/15 dark:from-amber-500/20 dark:to-purple-500/20 border-2 border-amber-300/70 dark:border-amber-500/40 text-amber-900 dark:text-amber-100 shadow-sm"
                           : "hover:bg-amber-50/70 dark:hover:bg-slate-800/50 text-amber-900 dark:text-neutral-300 border-2 border-transparent"
                       }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{shortLabel}</span>
                        {selectedCategory === short && (
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                        )}
                      </div>
                      <p
                        className={`text-xs mt-1 ${
                          selectedCategory === short
                            ? "text-amber-700 dark:text-amber-300/80"
                            : "text-amber-700/80 dark:text-neutral-400"
                        }`}
                      >
                        {full}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-amber-100/50 dark:border-slate-800/50">
                  <div className="text-center">
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      {t("showing", {
                        count: filteredResources.length,
                      })}
                    </p>
                    <p className="text-xs text-amber-700/70 dark:text-neutral-400 mt-1">
                      {t("sidebar.total", { count: resources.length })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          <div className="flex-1">
            {viewMode === "grid" ? (
              <>
                <motion.div
                  key="grid-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                >
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-64 rounded-2xl bg-lnear-to-br from-amber-50/50 to-white/50 
                                   dark:from-slate-900/50 dark:to-slate-800/50 
                                   animate-pulse border-2 border-amber-100/30 dark:border-slate-800/50"
                      />
                    ))
                  ) : visibleResources.length > 0 ? (
                    visibleResources.map((resource, index) => (
                      <motion.div
                        key={resource._id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="h-full"
                      >
                        <ResourceCard
                          index={index}
                          {...resource}
                          onOpen={handleOpenResource}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16">
                      <div
                        className="inline-flex items-center justify-center w-16 h-16 
                                   rounded-full bg-amber-100/50 dark:bg-amber-500/10 
                                   mb-4"
                      >
                        <Search className="w-8 h-8 text-amber-500/70" />
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                        {t("empty.grid_title")}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                        {t("empty.grid_subtitle")}
                      </p>
                    </div>
                  )}
                </motion.div>

                {!loading && hasMore && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 flex justify-center"
                  >
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      aria-label="load-more"
                      className="group inline-flex items-center gap-3 rounded-xl
                                 border-2 border-amber-200/50 dark:border-slate-700/50
                                 bg-lnear-to-r from-white/80 to-amber-50/80 
                                 dark:from-slate-900/60 dark:to-slate-800/60
                                 px-6 py-3 text-sm font-medium
                                 text-amber-900 dark:text-amber-100
                                 shadow-lg shadow-amber-500/10 dark:shadow-slate-900/30
                                 hover:shadow-xl hover:shadow-amber-500/20 
                                 dark:hover:shadow-amber-500/10
                                 hover:border-amber-300/70 dark:hover:border-amber-500/50
                                 transition-all duration-300"
                    >
                      <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                      <span>{t("load_more.button")}</span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {t("load_more.progress", {
                          visible: visibleResources.length,
                          total: filteredResources.length,
                        })}
                      </span>
                      <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                    </button>
                  </motion.div>
                )}
              </>
            ) : (
              <>
                <motion.div
                  key="list-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border-2 border-amber-100/30 dark:border-slate-800/50 
                             bg-white/60 dark:bg-slate-900/40 overflow-hidden 
                             backdrop-blur-sm shadow-xl shadow-amber-500/5 dark:shadow-slate-900/30"
                >
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-20 border-b border-amber-100/30 dark:border-slate-800/50 
                                   animate-pulse"
                      />
                    ))
                  ) : visibleResources.length > 0 ? (
                    visibleResources.map((resource, index) => (
                      <motion.div
                        key={resource._id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <ResourceRow
                          index={index}
                          {...resource}
                          onOpen={handleOpenResource}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-neutral-500 dark:text-neutral-400">
                        {t("empty.list")}
                      </p>
                    </div>
                  )}
                </motion.div>

                {!loading && hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      aria-label="load-more"
                      className="inline-flex items-center gap-2 rounded-xl
                                 border-2 border-amber-200/50 dark:border-slate-700/50
                                 bg-white/80 dark:bg-slate-900/60
                                 px-5 py-2.5 text-sm font-medium
                                 text-amber-900 dark:text-amber-100
                                 shadow-lg hover:shadow-xl transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {t("load_more.button")}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="absolute left-0 top-0 h-full w-80 max-w-full 
                         bg-lnear-to-b from-amber-50 to-white 
                         dark:from-slate-950 dark:to-slate-900 
                         shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">
                  {t("filters.mobile_title")}
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 rounded-lg hover:bg-amber-100/50 dark:hover:bg-slate-800/50"
                  aria-label="close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {resourceCategories.map(({ short, shortLabel, full }) => (
                  <button
                    key={short}
                    aria-label="filter"
                    onClick={() => {
                      setSelectedCategory(short);
                      setShowMobileFilters(false);
                    }}
                    className={`w-full text-left p-4 rounded-xl 
                                transition-all ${
                                  selectedCategory === short
                                    ? "bg-lnear-to-r from-amber-500/20 to-purple-500/20 border-2 border-amber-300/50"
                                    : "hover:bg-amber-50/50 dark:hover:bg-slate-800/50 border-2 border-transparent"
                                }`}
                  >
                    <div className="font-medium text-amber-900 dark:text-amber-100">
                      {shortLabel}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {full}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-amber-200/30 dark:border-slate-800/50">
                <button
                  onClick={clearFilters}
                  aria-label="clear-filter"
                  className="w-full py-3 rounded-xl border-2 border-amber-200/50 
                             text-amber-700 dark:text-amber-300 
                             hover:bg-amber-50/50 dark:hover:bg-slate-800/50 
                             transition-colors"
                >
                  {t("filters.clear_all_mobile")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isViewerOpen && viewerResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-100"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-lg"
              onClick={handleCloseViewer}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 
                   bg-linear-to-br from-slate-900 to-slate-950 
                   shadow-2xl 
                   border-2 border-slate-800/50 overflow-hidden flex flex-col"
            >
              <div
                className="flex items-center justify-between px-6 py-4 
                     bg-linear-to-r from-slate-900 to-slate-800/90 
                     border-b border-slate-800/50 shrink-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      viewerResource?.type === "Video"
                        ? "bg-red-500"
                        : viewerResource?.type === "Audio"
                          ? "bg-emerald-500"
                          : viewerResource?.type === "PDF"
                            ? "bg-amber-500"
                            : "bg-purple-500"
                    }`}
                  />
                  <div className="min-w-0">
                    <span
                      className="text-xs uppercase tracking-wider 
                           text-amber-300 font-medium block"
                    >
                      {viewerResource.type}
                    </span>
                    <h3 className="text-base md:text-lg font-semibold text-white truncate">
                      {viewerResource.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={handleCloseViewer}
                  aria-label="close"
                  className="p-2 rounded-lg hover:bg-slate-800/50 
                       text-slate-400 hover:text-white transition-colors shrink-0 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 bg-black relative overflow-hidden">
                {viewerResource?.type === "Audio" && viewerResource?.link && (
                  <div
                    className="absolute inset-0 flex items-center justify-center 
                           bg-linear-to-br from-slate-900 via-slate-950 to-slate-900"
                  >
                    <div
                      className="w-full max-w-xl bg-slate-900/70 
                            border border-slate-700 rounded-2xl p-8 
                            shadow-2xl backdrop-blur-sm"
                    >
                      <div className="text-center mb-6">
                        <div
                          className="inline-flex items-center justify-center 
                               w-12 h-12 rounded-full bg-amber-500/20 
                               mb-3"
                        >
                          <div
                            className="w-6 h-6 rounded-full bg-linear-to-r 
                                 from-amber-400 to-amber-300"
                          />
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-2">
                          {viewerResource.title}
                        </h4>
                        <p className="text-sm text-slate-400">Now playing</p>
                      </div>
                      <audio
                        controls
                        src={viewerResource.link}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                {viewerResource?.type === "Video" && viewerResource?.link && (
                  <div className="absolute inset-0 bg-black">
                    <div className="relative w-full h-full">
                      {(() => {
                        const raw = convertYouTubeToEmbed(viewerResource.link);
                        const src = raw ? raw.trim() : "";
                        return (
                          <iframe
                            src={src}
                            title={viewerResource.title}
                            className="absolute inset-0 w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                          />
                        );
                      })()}
                    </div>
                  </div>
                )}

                {(viewerResource?.type === "Article" ||
                  viewerResource?.type === "PDF" ||
                  viewerResource?.type === "Book" ||
                  viewerResource?.type === "Web") &&
                  viewerResource?.link && (
                    <div className="absolute inset-0">
                      {frameLoading && (
                        <div
                          className="absolute inset-0 flex items-center justify-center 
                               bg-slate-950 z-10"
                        >
                          <div className="text-center">
                            <div
                              className="inline-block animate-spin rounded-full 
                                   h-8 w-8 border-2 border-amber-500/30 
                                   border-t-amber-500 mb-3"
                            />
                            <p className="text-sm text-slate-400">
                              Loading content...
                            </p>
                          </div>
                        </div>
                      )}
                      <iframe
                        src={viewerResource.link}
                        title={viewerResource.title}
                        className="absolute inset-0 w-full h-full bg-white"
                        referrerPolicy="strict-origin-when-cross-origin"
                        onLoad={() => setFrameLoading(false)}
                      />
                    </div>
                  )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
