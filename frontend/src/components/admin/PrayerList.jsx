import { useState, useEffect } from "react";
import { Pencil, Trash, Plus } from "lucide-react";

export default function PrayerList({ onCreate, onEdit }) {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrayers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/prayers");
      const data = await res.json();
      setPrayers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prayer?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/prayers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete prayer");

      setPrayers((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete prayer");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100">Prayers</h2>
          <p className="text-xs text-neutral-400">
            Manage shared prayers and campus prayer times.
          </p>
        </div>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-md shadow-amber-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          New prayer
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-sm text-neutral-400">Loading prayers...</p>
        </div>
      ) : prayers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/40">
          <p className="text-sm text-neutral-400 mb-3">No prayers found.</p>
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-md shadow-amber-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add your first prayer
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {prayers.map((prayer) => (
            <div
              key={prayer._id}
              className="group flex items-center justify-between gap-4 px-4 py-3 rounded-2xl border border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900/80 hover:border-neutral-700 transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                {prayer.image && (
                  <img
                    src={prayer.image}
                    alt={prayer.title}
                    className="w-10 h-10 rounded-xl object-cover border border-neutral-700/80"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-neutral-100 truncate">
                    {prayer.title}
                  </h3>
                  {prayer.time && (
                    <p className="text-xs text-neutral-400">{prayer.time}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onEdit(prayer)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900 text-neutral-200 border border-neutral-700 hover:bg-neutral-800 hover:text-white transition"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(prayer._id)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-600/80 text-white border border-red-500/60 hover:bg-red-600 transition"
                  title="Delete"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
