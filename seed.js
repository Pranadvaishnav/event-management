require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Import models
const User = require("./models/User");
const Event = require("./models/Event");
const Participant = require("./models/Participant");
const Notification = require("./models/Notification");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/event-management";

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB successfully for seeding.");

        // Clear existing data in our target collections
        await User.deleteMany({});
        await Event.deleteMany({});
        await Participant.deleteMany({});
        await Notification.deleteMany({});
        console.log("Cleared existing database collections.");

        // Read local JSON files
        const users = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "users.json"), "utf8"));
        const events = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "events.json"), "utf8"));
        const participants = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "participants.json"), "utf8"));
        const notifications = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "notifications.json"), "utf8"));

        // Insert documents
        await User.insertMany(users);
        console.log(`Successfully seeded ${users.length} users.`);

        await Event.insertMany(events);
        console.log(`Successfully seeded ${events.length} events.`);

        await Participant.insertMany(participants);
        console.log(`Successfully seeded ${participants.length} participants.`);

        await Notification.insertMany(notifications);
        console.log(`Successfully seeded ${notifications.length} notifications.`);

        console.log("Database seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error during database seeding:", err);
        process.exit(1);
    }
}

seed();
