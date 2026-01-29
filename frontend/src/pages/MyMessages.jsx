import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

export default function MyMessages() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation("myMessages");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAndSet = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/contact/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error(data.message || t("errors.load_failed"));
          return;
        }

        const safe = Array.isArray(data) ? data : [];
        setThreads((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(safe)) {
            return safe;
          }
          return prev;
        });
      } catch (err) {
        toast.error(t("errors.generic") || "Could not load messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndSet();
    const intervalId = setInterval(fetchAndSet, 15000);
    return () => clearInterval(intervalId);
  }, [navigate, t]);

  const handleDeleteThread = async (threadId) => {
    if (!window.confirm(t("delete_confirm"))) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error(t("errors.auth") || "Please log in again.");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/contact/${threadId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || t("errors.delete_failed"));
        return;
      }

      setThreads((prev) => prev.filter((t) => t._id !== threadId));
      toast.success(t("delete_success") || "Conversation deleted.");
    } catch (err) {
      toast.error(t("errors.generic") || "Could not delete conversation.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-amber-50 via-neutral-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-300">
          {t("loading")}
        </p>
      </div>
    );
  }

  const conversationLabel = t("badge", { count: threads.length });

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-neutral-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
              {t("title")}
            </h1>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {t("subtitle")}
            </p>
          </div>
          {threads.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-neutral-900 text-neutral-100 dark:bg-slate-800 dark:text-neutral-50 text-[11px] px-3 py-1">
              {conversationLabel}
            </span>
          )}
        </div>

        {threads.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-neutral-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 px-4 py-8 text-center">
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-50">
              {t("empty_title")}
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {t("empty_subtitle")}
            </p>
          </div>
        )}

        <div className="space-y-5">
          {threads.map((tThread) => (
            <div
              key={tThread._id}
              className="rounded-2xl border border-neutral-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/85 shadow-sm shadow-neutral-200/60 dark:shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden"
            >
              <div className="px-4 py-3 flex items-start justify-between gap-3 border-b border-neutral-100 dark:border-slate-700/80">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wide text-amber-600 dark:text-amber-400">
                    {new Date(tThread.createdAt).toLocaleString()}
                  </p>
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                    {tThread.subject}
                  </h2>
                </div>
                <span
                  className={`text-[11px] px-2 py-1 rounded-full border ${
                    tThread.status === "answered"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : tThread.status === "closed"
                        ? "bg-neutral-100 text-neutral-700 border-neutral-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {t(`status.${tThread.status}`)}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteThread(tThread._id)}
                  className="text-[11px] text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                >
                  {t("delete_btn")}
                </button>
              </div>

              <div className="px-4 py-3 space-y-3">
                <div className="flex gap-2">
                  <div className="mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-emerald-600 text-[11px] font-semibold text-neutral-50">
                    {t("from_you")}
                  </div>
                  <div className="flex-1">
                    <div className="inline-block max-w-full rounded-2xl bg-emerald-50 text-emerald-600 px-3 py-2 text-xs whitespace-pre-wrap">
                      {tThread.message}
                    </div>
                  </div>
                </div>

                {tThread.replies && tThread.replies.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {tThread.replies.map((r) => (
                      <div
                        key={r._id}
                        className={`flex gap-2 ${
                          r.author === "admin" ? "justify-start" : "justify-end"
                        }`}
                      >
                        {r.author === "admin" && (
                          <div className="mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-amber-500 text-[11px] font-semibold text-neutral-950">
                            A
                          </div>
                        )}
                        <div className="max-w-[80%]">
                          <div
                            className={`rounded-2xl px-3 py-2 text-[11px] whitespace-pre-wrap ${
                              r.author === "admin"
                                ? "bg-amber-50 text-amber-900 border border-amber-100"
                                : "bg-emerald-200 text-neutral-50"
                            }`}
                          >
                            {r.message}
                          </div>
                          <p className="mt-0.5 text-[10px] text-neutral-400 dark:text-neutral-500">
                            {r.author === "admin"
                              ? t("from_admin")
                              : t("from_you")}{" "}
                            • {new Date(r.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {r.author !== "admin" && (
                          <div className="mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-neutral-900 dark:bg-slate-800 text-[11px] font-semibold text-neutral-50">
                            {t("from_you")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {(!tThread.replies || tThread.replies.length === 0) && (
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                    {t("no_replies")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
