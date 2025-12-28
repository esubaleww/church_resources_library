const mongoose = require("mongoose");
const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },

    title_en: String,
    title_am: String,
    description_en: String,
    description_am: String,
    category_en: String,
    category_am: String,

    type: { type: String, required: true },
    type_en: String,
    type_am: String,

    link: String,
    link_en: String,
    link_am: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Resource", resourceSchema);
