const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    createdById: { type: mongoose.Schema.Types.Mixed, required: true }
});

module.exports = mongoose.model("Event", eventSchema);
