import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

export default function Events() {
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("events");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = token
          ? "http://localhost:5000/api/events/me"
          : "http://localhost:5000/api/events";

        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          const msgKey = data.message || "events.fetch_failed";
          toast.error(t(msgKey, "Could not load events.", "error"));
          setEventList([]);
          return;
        }

        if (JSON.stringify(eventList) !== JSON.stringify(data)) {
          setEventList(data);
        }
      } catch (err) {
        toast.error(
          t("events.fetch_failed", "Could not load events.", "error"),
        );
        setEventList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    const intervalId = setInterval(fetchEvents, 15000);
    return () => clearInterval(intervalId);
  }, [t]);

  const handleRsvp = (id, payload) => {
    setEventList((prev) =>
      prev.map((ev) =>
        ev._id === id
          ? {
              ...ev,
              attendees: payload.attendees,
              hasRsvped: payload.hasRsvped,
            }
          : ev,
      ),
    );
  };

  return (
    <section
      id="events"
      className="py-20 md:py-28
                 bg-linear-to-b from-amber-50/40 via-white to-amber-50/20
                 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
                 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-64 h-64 
                      bg-linear-to-br from-amber-300/20 via-transparent to-transparent 
                      dark:from-amber-600/10 dark:via-transparent dark:to-transparent 
                      rounded-full blur-3xl"
        />
        <div
          className="absolute -bottom-20 -left-20 w-72 h-72 
                      bg-linear-to-tr from-purple-300/15 via-transparent to-transparent 
                      dark:from-purple-600/10 dark:via-transparent dark:to-transparent 
                      rounded-full blur-3xl"
        />

        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01]">
          <div
            className="absolute top-1/4 left-1/4 w-24 h-24 
                        border border-amber-400/10 dark:border-amber-300/5 
                        rotate-45"
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-20 h-20 
                        border-2 border-amber-500/10 dark:border-amber-400/5 
                        rounded-full"
          />
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
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

        <div className="relative">
          <div
            className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 
                        bg-linear-to-b from-amber-400/30 via-amber-500/40 to-transparent 
                        dark:from-amber-500/20 dark:via-amber-400/30 dark:to-transparent 
                        pointer-events-none"
          />

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-amber-500/80 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-amber-500/80 animate-pulse delay-100" />
                <div className="w-2 h-2 rounded-full bg-amber-500/80 animate-pulse delay-200" />
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {t("loading")}
              </p>
            </motion.div>
          ) : eventList.length > 0 ? (
            <div className="space-y-12">
              {eventList.map((event, index) => {
                const isRight = index % 2 === 1;
                return (
                  <motion.div
                    key={event._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.04 }}
                    className={`relative flex gap-4 sm:gap-8 ${
                      isRight
                        ? "sm:flex-row-reverse sm:text-right"
                        : "sm:flex-row"
                    }`}
                  >
                    <div className="absolute left-4 sm:left-1/2 top-4 -translate-x-1/2 z-10">
                      <div className="relative">
                        <div
                          className="absolute inset-0 rounded-full 
                                      bg-amber-500/30 dark:bg-amber-400/20 
                                      animate-ping"
                        />
                        <div
                          className="relative h-4 w-4 rounded-full 
                                      bg-linear-to-br from-amber-500 to-amber-600
                                      dark:from-amber-400 dark:to-amber-500
                                      border-2 border-white dark:border-slate-900 
                                      shadow-lg shadow-amber-500/30 dark:shadow-amber-500/20"
                        />
                      </div>
                    </div>

                    <div className="hidden sm:block w-1/2" />

                    <div className="w-full sm:w-1/2">
                      <EventCard
                        index={index}
                        {...event}
                        onRsvp={handleRsvp}
                        isRight={isRight}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div
                className="inline-flex items-center justify-center w-16 h-16 
                           rounded-full bg-amber-100/50 dark:bg-amber-500/10 
                           mb-4"
              >
                <span className="text-2xl text-amber-600 dark:text-amber-400">
                  📅
                </span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                {t("empty.title", "No upcoming events")}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                {t(
                  "empty.message",
                  "Check back later for new events and celebrations",
                )}
              </p>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p
            className="text-xs text-neutral-500 dark:text-neutral-400 
                     inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                     bg-white/50 dark:bg-slate-900/50
                     border border-amber-100/50 dark:border-slate-800/50"
          >
            <span className="w-1 h-1 rounded-full bg-amber-400/70" />
            {eventList.length} {t("events_count", "upcoming events")}
            <span className="w-1 h-1 rounded-full bg-amber-400/70" />
          </p>
        </motion.div>
      </div>
    </section>
  );
}
