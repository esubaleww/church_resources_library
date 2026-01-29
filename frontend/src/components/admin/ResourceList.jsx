import { useState, useEffect } from "react";
import { Pencil, Trash, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ResourceList({ onCreate, onEdit }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/resources");
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to load resources.");
        return;
      }

      setResources(data);
    } catch (err) {
      toast.error("Error loading resources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?"))
      return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No admin token found. Please log in again.");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/resources/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.message || "Failed to delete resource.");
        return;
      }

      setResources((prev) => prev.filter((r) => r._id !== id));
      toast.success("Resource deleted successfully.");
    } catch (err) {
      toast.error("Error deleting resource. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100">Resources</h2>
          <p className="text-xs text-neutral-400">
            Manage books, articles, videos, and other materials.
          </p>
        </div>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-md shadow-amber-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          New resource
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-sm text-neutral-400">Loading resources...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/40">
          <p className="text-sm text-neutral-400 mb-3">No resources found.</p>
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-md shadow-amber-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add your first resource
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {resources.map((res) => (
            <div
              key={res._id}
              className="group flex items-center justify-between gap-4 px-4 py-3 rounded-2xl border border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900/80 hover:border-neutral-700 transition-all"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-neutral-100 truncate">
                    {res.title}
                  </h3>
                  {res.category && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide bg-neutral-900 text-neutral-300 border border-neutral-700">
                      {res.category}
                    </span>
                  )}
                </div>
                {res.description && (
                  <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
                    {res.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onEdit(res)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900 text-neutral-200 border border-neutral-700 hover:bg-neutral-800 hover:text-white transition"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(res._id)}
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
