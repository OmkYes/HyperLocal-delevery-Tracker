const mongoose = require("mongoose")

module.exports = mongoose.model("menu", new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: String, required: true },
    type: { type: String, required: true },
    images: { type: [String], required: true },
    hotel: { type: mongoose.Types.ObjectId, ref: "hotel", required: true },

    isPublish: { type: Boolean, default: false },
}))