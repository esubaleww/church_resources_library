const mongoose = require("mongoose");

const prayerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    filePath: { type: String },

    time: { type: String, required: true },
    image: { type: String, required: true },

    title_en: { type: String },
    title_am: { type: String },

    description_en: { type: String },
    description_am: { type: String },

    filePath_en: { type: String },
    filePath_am: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prayer", prayerSchema);
