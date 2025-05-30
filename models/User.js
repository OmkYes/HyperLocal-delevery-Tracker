const mongoose = require("mongoose")

module.exports = mongoose.model("user", new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    picture: { type: String, required: true },

    isActive: { type: Boolean, default: false },
}, { timestamps: true }))