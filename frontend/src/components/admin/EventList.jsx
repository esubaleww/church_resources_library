import { useState, useEffect } from "react";
import { Pencil, Trash, Plus, Users } from "lucide-react";
import { toast } from "react-hot-toast";

export default function EventList({ onCreate, onEdit, onViewRsvps }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        toast.error("No admin token found. Please log in again.");
        return;
      }

      const res = await fetch("http://localhost:5000/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch events.");
        setLoading(false);
        return;
      }

      setEvents(data);
    } catch (err) {
      toast.error("Error loading events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No admin token found. Please log in again.");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.message || "Failed to delete event.");
        return;
      }

      setEvents((prev) => prev.filter((e) => e._id !== id));
      toast.success("Event deleted successfully.");
    } catch (err) {
      toast.error("Error deleting event. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100">Events</h2>
          <p className="text-xs text-neutral-400">
            Manage upcoming gatherings, talks, and campus activities.
          </p>
        </div>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-md shadow-amber-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          New event
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-sm text-neutral-400">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/40">
          <p className="text-sm text-neutral-400 mb-3">No events found.</p>
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-md shadow-amber-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add your first event
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event._id}
              className="group flex items-center justify-between gap-4 px-4 py-3 rounded-2xl border border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900/80 hover:border-neutral-700 transition-all"
            >
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-neutral-100 truncate">
                  {event.title}
                </h3>
                <p className="mt-1 text-xs text-neutral-400">
                  {event.date} {event.time && `• ${event.time}`}{" "}
                  {event.location && `• ${event.location}`}
                </p>
                {typeof event.attendees === "number" && (
                  <p className="mt-1 text-[11px] text-neutral-500 inline-flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {event.attendees} attending
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onViewRsvps && (
                  <button
                    onClick={() => onViewRsvps(event)}
                    className="hidden sm:inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-neutral-900 text-neutral-200 border border-neutral-700 hover:bg-neutral-800 hover:text-white transition"
                    title="View RSVPs"
                  >
                    <Users className="w-3.5 h-3.5 mr-1" />
                    RSVPs
                  </button>
                )}
                <button
                  onClick={() => onEdit(event)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900 text-neutral-200 border border-neutral-700 hover:bg-neutral-800 hover:text-white transition"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
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
