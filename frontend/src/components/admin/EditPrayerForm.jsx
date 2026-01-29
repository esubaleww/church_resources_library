import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function EditPrayerForm({ item, onUpdated, onCancel }) {
  const [editingLang, setEditingLang] = useState("en");

  const [titleEn, setTitleEn] = useState("");
  const [titleAm, setTitleAm] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAm, setDescriptionAm] = useState("");

  const [time, setTime] = useState("");
  const [image, setImage] = useState("");

  const [filePathEn, setFilePathEn] = useState("");
  const [filePathAm, setFilePathAm] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!item) return;

    setTitleEn(item.title_en || item.title || "");
    setTitleAm(item.title_am || "");
    setDescriptionEn(item.description_en || item.description || "");
    setDescriptionAm(item.description_am || "");

    setTime(item.time || "");
    setImage(item.image || "");

    setFilePathEn(item.filePath_en || item.filePath || "");
    setFilePathAm(item.filePath_am || "");
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No admin token found. Please log in again.");
        setLoading(false);
        return;
      }

      const body = {
        title_en: titleEn,
        title_am: titleAm,
        description_en: descriptionEn,
        description_am: descriptionAm,
        filePath_en: filePathEn,
        filePath_am: filePathAm,

        time,
        image,

        title: titleEn,
        description: descriptionEn,
        filePath: filePathEn || filePathAm,
      };

      const res = await fetch(`http://localhost:5000/api/prayers/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.message || "Failed to update prayer.");
        return;
      }

      toast.success("Prayer updated successfully.");
      onUpdated?.(data);
    } catch (err) {
      toast.error("Error updating prayer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  const isEn = editingLang === "en";

  const currentTitle = isEn ? titleEn : titleAm;
  const currentDescription = isEn ? descriptionEn : descriptionAm;
  const currentFilePath = isEn ? filePathEn : filePathAm;

  const setCurrentTitle = (val) => (isEn ? setTitleEn(val) : setTitleAm(val));
  const setCurrentDescription = (val) =>
    isEn ? setDescriptionEn(val) : setDescriptionAm(val);
  const setCurrentFilePath = (val) =>
    isEn ? setFilePathEn(val) : setFilePathAm(val);

  return (
    <div className="max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-neutral-100">Edit prayer</h2>

        <div className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-900/70 p-1 text-xs">
          <button
            type="button"
            onClick={() => setEditingLang("en")}
            className={`px-3 py-1 rounded-full font-medium ${
              isEn
                ? "bg-amber-500 text-neutral-900"
                : "text-neutral-300 hover:bg-neutral-800"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setEditingLang("am")}
            className={`px-3 py-1 rounded-full font-medium ${
              !isEn
                ? "bg-amber-500 text-neutral-900"
                : "text-neutral-300 hover:bg-neutral-800"
            }`}
          >
            አማ
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={currentTitle}
          onChange={(e) => setCurrentTitle(e.target.value)}
          placeholder={isEn ? "Prayer title (English)" : "የጸሎት ርዕስ (አማርኛ)"}
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          required={isEn}
        />

        <input
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Time (e.g. Morning, After Liturgy...)"
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />

        <textarea
          value={currentDescription}
          onChange={(e) => setCurrentDescription(e.target.value)}
          placeholder={
            isEn
              ? "Description or short text (English)"
              : "አጭር መግለጫ ወይም ጸሎት ጽሑፍ (አማርኛ)"
          }
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
          rows={3}
        />

        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL (required)"
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          required
        />

        <input
          value={currentFilePath}
          onChange={(e) => setCurrentFilePath(e.target.value)}
          placeholder={
            isEn
              ? "Prayer text path (English, e.g. /prayers/morning_en.html)"
              : "የጸሎት ጽሑፍ መንገድ (አማርኛ,  ለምሳሌ . /prayers/morning_am.html)"
          }
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 rounded-full text-xs font-medium bg-neutral-900 text-neutral-300 border border-neutral-700 hover:bg-neutral-800 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-full text-xs font-medium bg-amber-500 text-neutral-950 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-amber-500/30 transition-all"
          >
            {loading ? "Updating..." : "Update prayer"}
          </button>
        </div>
      </form>
    </div>
  );
}
