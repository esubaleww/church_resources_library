const Event = require("../models/Event");

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).lean();

    const user = req.user || null;
    const email = user?.email;

    const eventsWithFlag = events.map((ev) => {
      let hasRsvped = false;

      if (email) {
        hasRsvped = (ev.rsvps || []).some((r) => r.email === email);
      }

      return {
        ...ev,
        hasRsvped,
      };
    });

    res.json(eventsWithFlag);
  } catch (err) {
    console.error("getEvents error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Not found" });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!event) return res.status(404).json({ message: "Not found" });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.rsvpToEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    let rsvpName = "";
    let rsvpEmail = "";

    if (req.user) {
      rsvpName = req.user.name || "";
      rsvpEmail = req.user.email || "";
    } else {
      const { name, email } = req.body || {};
      rsvpName = name || "";
      rsvpEmail = email || "";
    }

    if (!rsvpEmail) {
      return res.status(400).json({ message: "Email is required to RSVP" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // already RSVPed? don't increment twice
    const already = event.rsvps.some((r) => r.email === rsvpEmail);

    if (already) {
      return res.json({
        message: "Already RSVPed",
        attendees: event.attendees,
        hasRsvped: true,
      });
    }

    event.attendees += 1;
    event.rsvps.push({
      name: rsvpName,
      email: rsvpEmail,
    });

    await event.save();

    res.json({
      message: "RSVP recorded",
      attendees: event.attendees,
      hasRsvped: true,
    });
  } catch (error) {
    console.error("RSVP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEventRsvps = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).select("title rsvps");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error("getEventRsvps error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
