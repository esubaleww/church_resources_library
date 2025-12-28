import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Users, BookOpen, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Community() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("community");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      const ok = window.confirm(t("auth_required_confirm"));
      if (ok) navigate("/register");
      return;
    }

    if (!subject || !message) {
      toast.error(t("errors.empty_fields"));
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, message }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || t("errors.send_failed"));
        return;
      }

      toast.success(t("messages.sent"));
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error("CONTACT ERROR:", err);
      toast.error(t("errors.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="community"
      className="relative py-20 md:py-28
                 bg-linear-to-b from-white via-amber-50/40 to-white
                 dark:from-slate-950 dark:via-slate-900/80 dark:to-slate-950
                 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-24 right-0 w-72 h-72 
                      bg-linear-to-br from-amber-200/40 via-amber-100/30 to-transparent
                      dark:from-amber-600/20 dark:via-amber-500/15 dark:to-transparent 
                      rounded-full blur-3xl"
        />
        <div
          className="absolute -bottom-24 -left-16 w-80 h-80 
                      bg-linear-to-tr from-amber-300/35 via-purple-200/25 to-transparent
                      dark:from-purple-600/15 dark:via-amber-500/12 dark:to-transparent 
                      rounded-full blur-3xl"
        />

        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.008]">
          <div
            className="absolute top-1/3 right-1/3 w-16 h-16 
                        border border-amber-300/20 dark:border-amber-400/10 rotate-45"
          />
          <div
            className="absolute bottom-1/4 left-1/4 w-24 h-24 
                        border-2 border-amber-400/15 dark:border-amber-500/10 rounded-full"
          />
          <div
            className="absolute top-1/2 left-1/2 w-12 h-12 
                        border border-amber-200/10 dark:border-amber-300/5 rotate-12"
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
          className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          <div>
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
              className="text-4xl md:text-5xl font-bold mb-4
                       bg-linear-to-r from-amber-800 via-purple-800 to-amber-800
                       dark:from-amber-100 dark:via-purple-200 dark:to-amber-100
                       bg-clip-text text-transparent"
            >
              {t("title")}
            </h2>

            <p
              className="text-base md:text-lg text-neutral-700 dark:text-neutral-300 
                       leading-relaxed mb-8"
            >
              {t("intro")}
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div
                  className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl 
                              bg-linear-to-br from-amber-500/15 to-amber-400/10 
                              dark:from-amber-500/20 dark:to-purple-500/15
                              border border-amber-200/50 dark:border-amber-500/30
                              text-amber-700 dark:text-amber-200 shadow-sm"
                >
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-amber-900 dark:text-amber-100 mb-1.5">
                    {t("bullets.weekly.title")}
                  </h3>
                  <p className="text-sm md:text-[0.95rem] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {t("bullets.weekly.body")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl 
                              bg-linear-to-br from-amber-500/15 to-amber-400/10 
                              dark:from-amber-500/20 dark:to-purple-500/15
                              border border-amber-200/50 dark:border-amber-500/30
                              text-amber-700 dark:text-amber-200 shadow-sm"
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-amber-900 dark:text-amber-100 mb-1.5">
                    {t("bullets.study.title")}
                  </h3>
                  <p className="text-sm md:text-[0.95rem] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {t("bullets.study.body")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl 
                              bg-linear-to-br from-amber-500/15 to-amber-400/10 
                              dark:from-amber-500/20 dark:to-purple-500/15
                              border border-amber-200/50 dark:border-amber-500/30
                              text-amber-700 dark:text-amber-200 shadow-sm"
                >
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-amber-900 dark:text-amber-100 mb-1.5">
                    {t("bullets.spiritual.title")}
                  </h3>
                  <p className="text-sm md:text-[0.95rem] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {t("bullets.spiritual.body")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div
              className="relative rounded-3xl overflow-hidden
                         border-2 border-amber-100/60 dark:border-slate-800/70
                         bg-linear-to-br from-white/40 to-amber-50/30
                         dark:from-slate-900/60 dark:to-slate-800/40
                         backdrop-blur-sm 
                         shadow-xl shadow-amber-200/30 dark:shadow-black/40"
            >
              <div
                className="absolute inset-0 bg-linear-to-t from-amber-900/50 via-amber-900/20 to-transparent 
                            dark:from-black/60 dark:via-black/40 dark:to-transparent"
              />
              <img
                loading="lazy"
                src="https://images.unsplash.com/photo-1625246433906-6cfa33544b31?auto=format&fit=crop&w=1200&q=80"
                alt={t("image.alt")}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-900/85 text-amber-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]">
                  {t("image.chip")}
                </div>
                <p className="hidden sm:block text-xs text-amber-50/90 max-w-md">
                  {t("image.quote")}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-16 md:mt-20 max-w-2xl mx-auto"
        >
          <div
            className="relative rounded-3xl
                       border-2 border-amber-100/50 dark:border-slate-800/50
                       bg-linear-to-br from-white/85 to-amber-50/30
                       dark:from-slate-900/70 dark:to-slate-950/90
                       backdrop-blur-sm shadow-xl shadow-amber-200/20 dark:shadow-black/40
                       p-6 sm:p-8
                       overflow-hidden"
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div
                className="absolute top-0 right-0 w-32 h-32 
                            border-2 border-amber-300/20 rounded-full"
              />
              <div
                className="absolute bottom-0 left-0 w-24 h-24 
                            border border-amber-200/20 rounded-full"
              />
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-amber-900 dark:text-amber-100 mb-3">
                {t("form.title")}
              </h3>
              <p className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 mb-6">
                {t("form.subtitle")}
              </p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="community-subject"
                    className="block text-sm font-medium text-amber-900 dark:text-amber-200 mb-2"
                  >
                    {t("form.subject_label")}
                  </label>
                  <input
                    id="community-subject"
                    name="subject"
                    type="text"
                    className="w-full px-4 py-3 rounded-xl
                             border-2 border-amber-100/50 dark:border-slate-700/50
                             bg-white/90 dark:bg-slate-900/90
                             text-sm text-amber-900 dark:text-neutral-100
                             focus:outline-none focus:ring-2 focus:ring-amber-500/50 
                             focus:border-amber-300 dark:focus:border-amber-500/30
                             placeholder:text-neutral-400 dark:placeholder:text-neutral-500
                             transition-all"
                    placeholder={t("form.subject_placeholder")}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="community-message"
                    className="block text-sm font-medium text-amber-900 dark:text-amber-200 mb-2"
                  >
                    {t("form.message_label")}
                  </label>
                  <textarea
                    id="community-message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl
                             border-2 border-amber-100/50 dark:border-slate-700/50
                             bg-white/90 dark:bg-slate-900/90
                             text-sm text-amber-900 dark:text-neutral-100
                             focus:outline-none focus:ring-2 focus:ring-amber-500/50 
                             focus:border-amber-300 dark:focus:border-amber-500/30
                             placeholder:text-neutral-400 dark:placeholder:text-neutral-500
                             transition-all resize-none"
                    placeholder={t("form.message_placeholder")}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{
                    scale: submitting ? 1 : 1.02,
                    y: submitting ? 0 : -2,
                  }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  disabled={submitting}
                  className="w-full px-6 py-3.5 rounded-xl
                           bg-linear-to-r from-amber-600 to-amber-700
                           dark:from-amber-700 dark:to-amber-800
                           hover:from-amber-700 hover:to-amber-800
                           dark:hover:from-amber-800 dark:hover:to-amber-900
                           text-white font-medium shadow-lg shadow-amber-600/40 dark:shadow-amber-900/40
                           hover:shadow-xl hover:shadow-amber-600/50 dark:hover:shadow-amber-900/50
                           disabled:opacity-60 disabled:cursor-not-allowed
                           transition-all duration-300"
                >
                  {submitting ? t("form.sending") : t("form.send")}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
