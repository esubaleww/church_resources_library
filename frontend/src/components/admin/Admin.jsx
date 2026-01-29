import { useState } from "react";
import { ArrowLeft, LogOut, Inbox, Users, BookOpenText } from "lucide-react";
import { toast } from "react-hot-toast";

import ResourceList from "./ResourceList";
import EventList from "./EventList";
import PrayerList from "./PrayerList";
import CreateResourceForm from "./CreateResourceForm";
import EditResourceForm from "./EditResourceForm";
import CreateEventForm from "./CreateEventForm";
import EditEventForm from "./EditEventForm";
import CreatePrayerForm from "./CreatePrayerForm";
import EditPrayerForm from "./EditPrayerForm";

import AdminContacts from "./AdminContacts";
import AdminRsvps from "./AdminRsvps";

const TABS = [
  { id: "resources", label: "Resources" },
  { id: "events", label: "Events" },
  { id: "prayers", label: "Prayers" },
  { id: "messages", label: "Messages" },
  { id: "rsvps", label: "RSVPs" },
];

export default function Admin({ onExit }) {
  const [activeTab, setActiveTab] = useState("resources");
  const [view, setView] = useState("list");
  const [editingItem, setEditingItem] = useState(null);
  const [selectedEventForRsvps, setSelectedEventForRsvps] = useState(null);

  const handleCreateClick = () => {
    setView("create");
    setEditingItem(null);
  };

  const handleEditClick = (item) => {
    setView("edit");
    setEditingItem(item);
  };

  const handleBackToList = () => {
    setView("list");
    setEditingItem(null);
  };

  const handleDelete = async (item, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`))
      return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No admin token found. Please log in again.");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/${type}/${item._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.message || "Failed to delete item.");
        return;
      }

      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`,
      );
      handleBackToList();
    } catch (err) {
      toast.error("Error deleting item. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 py-4 px-4 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-4">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => (window.location.href = "/")}
            className="inline-flex items-center gap-2 text-neutral-300 hover:text-white text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to site</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs uppercase tracking-wide text-amber-400">
                Orthodox Resource Center
              </span>
              <span className="text-sm text-neutral-300">Admin Dashboard</span>
            </div>
            <button
              onClick={onExit}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-900/40"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-sm shadow-xl shadow-black/40 flex-1 flex flex-col max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="sticky top-0 z-20 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800 p-3 pb-3 sm:pt-3 sm:pb-4 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Manage resources, events, prayers, messages, and RSVPs in one
                  place.
                </p>
              </div>
              <div className="flex gap-2 text-xs text-neutral-400">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-800/70 border border-neutral-700">
                  <BookOpenText className="w-3.5 h-3.5 text-amber-400" />
                  Content
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-800/70 border border-neutral-700">
                  <Inbox className="w-3.5 h-3.5 text-emerald-400" />
                  Messages
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-800/70 border border-neutral-700">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  RSVPs
                </span>
              </div>
            </div>

            <nav className="flex flex-wrap gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setView("list");
                    setEditingItem(null);
                  }}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all border ${
                    activeTab === tab.id
                      ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/30"
                      : "bg-transparent text-neutral-300 border-transparent hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4 sm:p-5 space-y-6">
            {activeTab === "resources" && (
              <>
                {view === "list" && (
                  <ResourceList
                    onCreate={handleCreateClick}
                    onEdit={handleEditClick}
                    onDelete={(item) => handleDelete(item, "resources")}
                  />
                )}
                {view === "create" && (
                  <CreateResourceForm
                    onCreated={handleBackToList}
                    onCancel={handleBackToList}
                  />
                )}
                {view === "edit" && editingItem && (
                  <EditResourceForm
                    item={editingItem}
                    onUpdated={handleBackToList}
                    onCancel={handleBackToList}
                  />
                )}
              </>
            )}

            {activeTab === "events" && (
              <>
                {view === "list" && (
                  <EventList
                    onCreate={handleCreateClick}
                    onEdit={handleEditClick}
                    onDelete={(item) => handleDelete(item, "events")}
                    onViewRsvps={(item) => {
                      setSelectedEventForRsvps(item);
                      setActiveTab("rsvps");
                    }}
                  />
                )}
                {view === "create" && (
                  <CreateEventForm
                    onCreated={handleBackToList}
                    onCancel={handleBackToList}
                  />
                )}
                {view === "edit" && editingItem && (
                  <EditEventForm
                    item={editingItem}
                    onUpdated={handleBackToList}
                    onCancel={handleBackToList}
                  />
                )}
              </>
            )}

            {activeTab === "prayers" && (
              <>
                {view === "list" && (
                  <PrayerList
                    onCreate={handleCreateClick}
                    onEdit={handleEditClick}
                    onDelete={(item) => handleDelete(item, "prayers")}
                  />
                )}
                {view === "create" && (
                  <CreatePrayerForm
                    onCreated={handleBackToList}
                    onCancel={handleBackToList}
                  />
                )}
                {view === "edit" && editingItem && (
                  <EditPrayerForm
                    item={editingItem}
                    onUpdated={handleBackToList}
                    onCancel={handleBackToList}
                  />
                )}
              </>
            )}

            {activeTab === "messages" && <AdminContacts />}

            {activeTab === "rsvps" && (
              <AdminRsvps event={selectedEventForRsvps} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
