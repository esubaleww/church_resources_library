import { useEffect, useMemo, useState } from "react";

export default function AdminContacts() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/contact/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setMessages(data);
        } else {
          console.error(data.message || "Failed to load messages");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const groupedByUser = useMemo(() => {
    const map = new Map();
    for (const m of messages) {
      const key = m.user?._id || "anonymous";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(m);
    }

    const groups = Array.from(map.entries()).map(([userId, msgs]) => {
      const sorted = [...msgs].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const latest = sorted[0];
      return { userId, messages: sorted, latest };
    });

    groups.sort(
      (a, b) => new Date(b.latest.createdAt) - new Date(a.latest.createdAt)
    );
    return groups;
  }, [messages]);

  const selectedGroup = useMemo(() => {
    if (!selectedUserId) return null;
    return groupedByUser.find((g) => g.userId === selectedUserId) || null;
  }, [groupedByUser, selectedUserId]);

  const openUserThread = (group) => {
    setSelectedUserId(group.userId);
    setReplyText("");
  };

  const closePanel = () => {
    setSelectedUserId(null);
    setReplyText("");
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedGroup) return;

    const latestThread = selectedGroup.messages[0];
    try {
      setSending(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/contact/admin/${latestThread._id}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: replyText }),
        }
      );
      const updated = await res.json();
      if (!res.ok) {
        console.error(updated.message || "Failed to send reply");
        return;
      }

      setMessages((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m))
      );
      setReplyText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return <p className="text-sm text-neutral-400">Loading messages...</p>;

  const hasSelection = !!selectedGroup;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Contact Messages</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-112 lg:max-h-128">
        <div
          className={`border border-neutral-800 rounded-lg overflow-hidden ${
            hasSelection ? "hidden" : "block"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-neutral-900/80">
                <tr>
                  <th className="px-3 py-2 text-left text-neutral-300">User</th>
                  <th className="px-3 py-2 text-left text-neutral-300">
                    Last message
                  </th>
                  <th className="px-3 py-2 text-left text-neutral-300">
                    Last date
                  </th>
                  <th className="px-3 py-2 text-right text-neutral-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-neutral-950/60">
                {groupedByUser.map((group) => {
                  const m = group.latest;
                  return (
                    <tr
                      key={group.userId}
                      className="border-t border-neutral-800 hover:bg-neutral-900/50 cursor-pointer"
                    >
                      <td className="px-3 py-2 text-neutral-100 align-top max-w-45">
                        <p className="truncate">{m.user?.name || "Unknown"}</p>
                        <p className="text-[11px] text-neutral-400 truncate">
                          {m.user?.email}
                        </p>
                        <p className="mt-1 text-[10px] text-neutral-500">
                          {group.messages.length} message
                          {group.messages.length > 1 ? "s" : ""}
                        </p>
                      </td>

                      <td className="px-3 py-2 align-top text-neutral-100 max-w-45">
                        <p className="font-medium truncate">{m.subject}</p>
                        <p className="text-[11px] text-neutral-400 line-clamp-2">
                          {m.message}
                        </p>
                      </td>

                      <td className="px-3 py-2 text-neutral-400 align-top whitespace-nowrap">
                        {new Date(m.createdAt).toLocaleString()}
                      </td>

                      <td className="px-3 py-2 align-top">
                        <div className="flex justify-end">
                          <button
                            onClick={() => openUserThread(group)}
                            className="text-[11px] px-2 py-1 rounded-full bg-neutral-800 text-neutral-100 hover:bg-neutral-700"
                          >
                            View thread
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {groupedByUser.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-neutral-500"
                    >
                      No messages yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className={`border border-neutral-800 rounded-lg bg-neutral-950/70 p-4 ${
            hasSelection ? "block" : "hidden"
          } flex flex-col`}
        >
          {!selectedGroup ? (
            <p className="text-sm text-neutral-500">
              Select a user to view all their messages and reply.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2 lg:mb-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-amber-400">
                    {selectedGroup.latest.user?.name || "Unknown user"}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    {selectedGroup.latest.user?.email}
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    {selectedGroup.messages.length} message
                    {selectedGroup.messages.length > 1 ? "s" : ""} in this
                    thread
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  className="text-[11px] px-2 py-1 rounded-full border border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                >
                  Back to list
                </button>
              </div>

              <div className="mt-2 space-y-2 flex-1 overflow-y-auto pr-1">
                {selectedGroup.messages.map((msg) => (
                  <div
                    key={msg._id}
                    className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] font-medium text-neutral-100">
                        {msg.subject}
                      </p>
                      <span className="text-[10px] text-neutral-500 whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-200 whitespace-pre-wrap">
                      {msg.message}
                    </p>

                    <div className="mt-2 space-y-1">
                      {msg.replies?.map((r) => (
                        <div
                          key={r._id}
                          className={`text-[11px] px-3 py-2 rounded-lg ${
                            r.author === "admin"
                              ? "bg-amber-500/15 border border-amber-500/30 text-amber-50"
                              : "bg-neutral-800/70 border border-neutral-700 text-neutral-100"
                          }`}
                        >
                          <div className="flex justify-between mb-0.5">
                            <span className="font-medium">
                              {r.author === "admin" ? "Admin" : "User"}
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              {new Date(r.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-[11px] whitespace-pre-wrap">
                            {r.message}
                          </p>
                        </div>
                      ))}
                      {(!msg.replies || msg.replies.length === 0) && (
                        <p className="text-[10px] text-neutral-500">
                          No replies yet for this message.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-800 pt-2 mt-1">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full text-xs rounded-lg bg-neutral-900 border border-neutral-700 px-2 py-1.5 text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500/70"
                  placeholder="Write a reply to this user (will be sent on the latest message)..."
                />
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closePanel}
                    className="px-3 py-1.5 text-[11px] rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    disabled={sending || !replyText.trim()}
                    onClick={handleSendReply}
                    className="px-3 py-1.5 text-[11px] rounded-lg bg-amber-500 text-neutral-950 font-medium hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending ? "Sending..." : "Send reply"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
