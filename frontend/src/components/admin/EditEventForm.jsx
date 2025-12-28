import { useState, useEffect } from "react";

export default function EditEventForm({ item, onUpdated, onCancel }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [attendees, setAttendees] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setDate(item.date || "");
      setTime(item.time || "");
      setLocation(item.location || "");
      setDescription(item.description || "");
      setAttendees(item.attendees || 0);
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/events/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          date,
          time,
          location,
          description,
          attendees,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update event");
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

  return (
    <div className="max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 sm:p-6">
      <h2 className="text-sm font-semibold text-neutral-100 mb-4">
        Edit event
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="text"
            placeholder="Date (as you saved it)"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            type="time"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
          rows={3}
        />

        <div className="w-32">
          <label className="block text-[11px] text-neutral-400 mb-1">
            Attendees (optional)
          </label>
          <input
            value={attendees}
            onChange={(e) => setAttendees(Number(e.target.value))}
            type="number"
            min={0}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

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
            {loading ? "Updating..." : "Update event"}
          </button>
        </div>
      </form>
    </div>
  );
}
