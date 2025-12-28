const Resource = require("../models/Resource");

exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ updatedAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResourcesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const resources = await Resource.find({
      $or: [
        { category: category },
        { category_en: category },
        { category_am: category },
      ],
    }).sort({ updatedAt: -1 });

    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Not found" });
    res.json(resource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!resource) return res.status(404).json({ message: "Not found" });
    res.json(resource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Resource deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
