const ContactMessage = require("../models/ContactMessage");

exports.createContactMessage = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message required" });
    }

    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Not authenticated (no user on request)" });
    }

    const payload = {
      user: req.user._id,
      subject,
      message,
      status: "open",
    };

    const doc = await ContactMessage.create(payload);

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({
      message: "Failed to create message",
    });
  }
};

exports.getMyMessages = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Not authenticated (no user on request)" });
    }

    const messages = await ContactMessage.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(messages);
  } catch (err) {
    console.error("GET MY MESSAGES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

exports.addAdminReply = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Reply message required" });
    }

    let contact = await ContactMessage.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }

    contact.replies.push({ author: "admin", message });
    contact.status = "answered";
    await contact.save();

    contact = await ContactMessage.findById(contact._id)
      .populate("user", "name email")
      .exec();

    res.json(contact);
  } catch (err) {
    console.error("ADD ADMIN REPLY ERROR:", err);
    res.status(500).json({ message: "Failed to add reply" });
  }
};

exports.deleteMyContact = async (req, res) => {
  try {
    const { id } = req.params;

    const msg = await ContactMessage.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!msg) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    await ContactMessage.findByIdAndDelete(id);

    return res.status(204).end();
    t;
  } catch (err) {
    console.error("DELETE CONTACT ERROR:", err);
    return res.status(500).json({ message: "Failed to delete conversation" });
  }
};
