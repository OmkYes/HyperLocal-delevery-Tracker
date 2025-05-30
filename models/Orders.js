const mongoose = require("mongoose")

module.exports = mongoose.model("order", new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    products: [
        {
            product: { type: mongoose.Types.ObjectId, ref: "menu", required: true },
            qty: { type: String, required: true }
        }
    ],
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    status: { type: String, enum: ["placed", "deliver", "cancle", "shiped", "out", "pending"], default: "placed" },

}, { timestamps: true })) 