const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    eventId: { type: mongoose.Schema.Types.Mixed, required: true },
    message: { type: String, required: true },
    date: { type: String, required: true }
});

module.exports = mongoose.model("Notification", notificationSchema);
