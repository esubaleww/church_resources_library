const Prayer = require("../models/Prayer");

exports.getPrayers = async (req, res) => {
  try {
    const prayers = await Prayer.find({});
    res.json(prayers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPrayerById = async (req, res) => {
  try {
    const prayer = await Prayer.findById(req.params.id);
    if (!prayer) return res.status(404).json({ message: "Not found" });
    res.json(prayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createPrayer = async (req, res) => {
  try {
    const prayer = await Prayer.create(req.body);
    res.status(201).json(prayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePrayer = async (req, res) => {
  try {
    const prayer = await Prayer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!prayer) return res.status(404).json({ message: "Not found" });
    res.json(prayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deletePrayer = async (req, res) => {
  try {
    const prayer = await Prayer.findByIdAndDelete(req.params.id);
    if (!prayer) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Prayer deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
