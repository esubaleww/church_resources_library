import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminRsvps() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllRsvps = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setEvents([]);
          toast.error("No admin token found. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();

        if (res.ok) {
          const withRsvps = json.filter((e) => e.rsvps && e.rsvps.length > 0);
          setEvents(withRsvps);
        } else {
          toast.error(json.message || "Failed to load RSVP data.");
        }
      } catch (err) {
        toast.error("Could not load RSVPs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllRsvps();
  }, []);

  if (loading) {
    return <p className="text-sm text-neutral-400">Loading RSVPs...</p>;
  }

  if (!events.length) {
    return (
      <p className="text-sm text-neutral-400">
        There are no events with RSVPs yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">RSVPs overview</h2>

      {events.map((event) => (
        <div
          key={event._id}
          className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950/60"
        >
          <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">
                {event.title}
              </h3>
              {event.date && (
                <p className="text-xs text-neutral-400">{event.date}</p>
              )}
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-neutral-900 text-neutral-300">
              {event.rsvps.length} RSVP
              {event.rsvps.length !== 1 && "s"}
            </span>
          </div>

          <table className="w-full text-xs border-t border-neutral-800">
            <thead className="bg-neutral-900">
              <tr>
                <th className="px-3 py-2 text-left text-neutral-300">Name</th>
                <th className="px-3 py-2 text-left text-neutral-300">Email</th>
                <th className="px-3 py-2 text-left text-neutral-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {event.rsvps.map((r) => (
                <tr key={r._id}>
                  <td className="px-3 py-2 border-t border-neutral-800 text-neutral-100">
                    {r.name}
                  </td>
                  <td className="px-3 py-2 border-t border-neutral-800 text-neutral-100">
                    {r.email}
                  </td>
                  <td className="px-3 py-2 border-t border-neutral-800 text-neutral-400">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
