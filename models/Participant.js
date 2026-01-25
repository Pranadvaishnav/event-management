const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    eventId: { type: mongoose.Schema.Types.Mixed, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
});

module.exports = mongoose.model("Participant", participantSchema);
