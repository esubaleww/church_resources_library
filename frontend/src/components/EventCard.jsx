import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function EventCard({
  _id,
  title,
  date,
  time,
  location,
  description,
  attendees,
  hasRsvped,
  index,
  onRsvp,
}) {
  const { t } = useTranslation("events");

  const [openForm, setOpenForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(Boolean(hasRsvped));

  const storedUser = (() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const isLoggedIn =
    typeof window !== "undefined" &&
    !!localStorage.getItem("token") &&
    !!storedUser;

  const handleRsvpClick = async () => {
    if (submitted) return;

    if (isLoggedIn) {
      try {
        setSubmitting(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/events/${_id}/rsvp`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: storedUser.name,
              email: storedUser.email,
            }),
          }
        );
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || t("errors.rsvp_failed"));
          if (data.hasRsvped) {
            setSubmitted(true);
            onRsvp?.(_id, {
              attendees: data.attendees,
              hasRsvped: true,
            });
          }
          return;
        }

        onRsvp?.(_id, {
          attendees: data.attendees,
          hasRsvped: data.hasRsvped,
        });
        setSubmitted(true);
        toast.success(data.message || t("messages.rsvp_thanks"));
      } catch (err) {
        console.error("RSVP ERROR:", err);
        toast.error(t("errors.generic"));
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setOpenForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch(`http://localhost:5000/api/events/${_id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.hasRsvped) {
          setSubmitted(true);
          onRsvp?.(_id, {
            attendees: data.attendees,
            hasRsvped: true,
          });
        }
        toast.error(data.message || t("errors.rsvp_failed"));
        return;
      }

      onRsvp?.(_id, {
        attendees: data.attendees,
        hasRsvped: data.hasRsvped,
      });
      setSubmitted(true);
      setOpenForm(false);
      toast.success(data.message || t("messages.rsvp_thanks"));
    } catch (err) {
      console.error("RSVP ERROR:", err);
      toast.error(t("errors.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="group relative overflow-hidden rounded-2xl p-6
                   bg-white dark:bg-slate-900
                   shadow-md hover:shadow-xl
                   dark:shadow-[0_18px_48px_rgba(0,0,0,0.55)]
                   transition-all duration-300
                   border border-neutral-100 dark:border-slate-700
                   hover:border-amber-200 dark:hover:border-amber-400/80"
      >
        <div
          className="absolute inset-0 rounded-2xl
                     bg-linear-to-br from-amber-50/0 to-amber-100/0
                     group-hover:from-amber-50/30 group-hover:to-amber-100/20
                     dark:group-hover:from-amber-500/10 dark:group-hover:to-amber-500/5
                     transition-all duration-300"
        />

        <div className="relative z-10">
          <h3 className="mb-4 text-neutral-900 dark:text-neutral-50 group-hover:text-amber-900 dark:group-hover:text-amber-200 transition-colors">
            {title}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            {description}
          </p>

          <div className="space-y-2.5 mb-5">
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-amber-500/25 transition-colors">
                <Calendar className="w-4 h-4 text-amber-700 dark:text-amber-200" />
              </div>
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-amber-500/25 transition-colors">
                <Clock className="w-4 h-4 text-amber-700 dark:text-amber-200" />
              </div>
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-amber-500/25 transition-colors">
                <MapPin className="w-4 h-4 text-amber-700 dark:text-amber-200" />
              </div>
              <span>{location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <Users className="w-5 h-5 text-amber-700 dark:text-amber-200" />
              <span>
                {attendees} {t("card.attending")}
              </span>
            </div>

            <motion.button
              className={`px-5 py-2.5 rounded-xl transition-all shadow-md shadow-amber-600/20 disabled:opacity-60 disabled:cursor-not-allowed
                ${
                  submitted
                    ? "bg-emerald-600 text-white"
                    : "bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white"
                }`}
              whileHover={{ scale: submitting || submitted ? 1 : 1.05 }}
              whileTap={{ scale: submitting || submitted ? 1 : 0.95 }}
              onClick={handleRsvpClick}
              disabled={submitting || submitted}
            >
              {submitted
                ? t("buttons.rsvped")
                : submitting
                ? t("buttons.submitting")
                : t("buttons.rsvp")}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {openForm && !isLoggedIn && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center px-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-neutral-200/80 dark:border-slate-700 space-y-4"
          >
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
              {t("form.title", { event: title })}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              {t("form.subtitle")}
            </p>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {t("form.name_label")}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {t("form.email_label")}
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOpenForm(false)}
                className="px-4 py-2 text-sm rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-slate-800"
              >
                {t("buttons.cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? t("buttons.submitting") : t("form.confirm")}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
