import { useState, useEffect } from "react";

const RESOURCE_CATEGORIES = [
  "Scripture",
  "Teachings",
  "Spiritual Life",
  "Liturgy",
  "Saints & History",
  "Youth & Campus",
  "Media",
];

const TYPE_OPTIONS = ["PDF", "Video", "Audio", "Book", "Web"];

export default function EditResourceForm({ item, onUpdated, onCancel }) {
  const [editingLang, setEditingLang] = useState("en");

  const [titleEn, setTitleEn] = useState("");
  const [titleAm, setTitleAm] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAm, setDescriptionAm] = useState("");
  const [categoryEn, setCategoryEn] = useState("");
  const [categoryAm, setCategoryAm] = useState("");

  const [linkEn, setLinkEn] = useState("");
  const [linkAm, setLinkAm] = useState("");

  const [typeEn, setTypeEn] = useState("");
  const [typeAm, setTypeAm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!item) return;

    setTitleEn(item.title_en || item.title || "");
    setTitleAm(item.title_am || "");
    setDescriptionEn(item.description_en || item.description || "");
    setDescriptionAm(item.description_am || "");
    setCategoryEn(item.category_en || item.category || "");
    setCategoryAm(item.category_am || "");

    setLinkEn(item.link_en || item.link || "");
    setLinkAm(item.link_am || "");

    setTypeEn(item.type_en || item.type || "");
    setTypeAm(item.type_am || "");
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const body = {
        type_en: typeEn,
        type_am: typeAm,

        title_en: titleEn,
        title_am: titleAm,
        description_en: descriptionEn,
        description_am: descriptionAm,
        category_en: categoryEn,
        category_am: categoryAm,
        link_en: linkEn,
        link_am: linkAm,

        title: titleEn,
        description: descriptionEn,
        category: categoryEn,
        type: typeEn || typeAm,
        link: linkEn || linkAm,
      };

      const res = await fetch(
        `http://localhost:5000/api/resources/${item._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update resource");
      }

      onUpdated?.(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  const isEn = editingLang === "en";

  const currentTitle = isEn ? titleEn : titleAm;
  const currentDescription = isEn ? descriptionEn : descriptionAm;
  const currentCategory = isEn ? categoryEn : categoryAm;
  const currentLink = isEn ? linkEn : linkAm;
  const currentType = isEn ? typeEn : typeAm;

  const setCurrentType = (val) => (isEn ? setTypeEn(val) : setTypeAm(val));

  const setCurrentTitle = (val) => (isEn ? setTitleEn(val) : setTitleAm(val));
  const setCurrentDescription = (val) =>
    isEn ? setDescriptionEn(val) : setDescriptionAm(val);
  const setCurrentCategory = (val) =>
    isEn ? setCategoryEn(val) : setCategoryAm(val);
  const setCurrentLink = (val) => (isEn ? setLinkEn(val) : setLinkAm(val));

  return (
    <div className="max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-neutral-100">
          Edit resource
        </h2>

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
          placeholder={isEn ? "Title (English)" : "Title (Amharic)"}
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          required={isEn}
        />

        <textarea
          value={currentDescription}
          onChange={(e) => setCurrentDescription(e.target.value)}
          placeholder={isEn ? "Description (English)" : "Description (Amharic)"}
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
          rows={3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={currentCategory}
            onChange={(e) => setCurrentCategory(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="">
              {isEn ? "Category (English)" : "Category (Amharic)"}
            </option>
            {RESOURCE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={currentType}
            onChange={(e) => setCurrentType(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="">
              {isEn ? "Type (English)" : "Type (Amharic)"}
            </option>
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <input
          value={currentLink}
          onChange={(e) => setCurrentLink(e.target.value)}
          placeholder={isEn ? "Link (English URL)" : "Link (Amharic URL)"}
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
            {loading ? "Updating..." : "Update resource"}
          </button>
        </div>
      </form>
    </div>
  );
}
