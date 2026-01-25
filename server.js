// ================= BASIC SERVER SETUP =================
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");

// Import Mongoose models
const User = require("./models/User");
const Event = require("./models/Event");
const Participant = require("./models/Participant");
const Notification = require("./models/Notification");

const app = express();
const PORT = process.env.PORT || 4242;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/event";

app.use(express.json());
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB successfully");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });

// =====================================================
// ================= EVENTS ROUTES =====================
// =====================================================

// ✅ 1️⃣ Get ALL events (All Events page)
app.get("/events", async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (err) {
        console.error("Error in GET /events:", err);
        res.status(500).json({ message: err.message });
    }
});

// ✅ 2️⃣ Get ONE event by ID
app.get("/events/:id", async (req, res) => {
    try {
        const event = await Event.findOne({ id: Number(req.params.id) });
        res.json(event);
    } catch (err) {
        console.error("Error in GET /events/:id:", err);
        res.status(500).json({ message: err.message });
    }
});

// ✅ 3️⃣ Create new event
app.post("/events", async (req, res) => {
    try {
        const newEvent = new Event({
            id: Date.now(),
            title: req.body.title,
            category: req.body.category,
            location: req.body.location,
            date: req.body.date,
            description: req.body.description,
            createdById: req.body.createdById   // 🔥 userId mapping
        });

        await newEvent.save();
        res.json(newEvent);
    } catch (err) {
        console.error("Error in POST /events:", err);
        res.status(500).json({ message: err.message });
    }
});

// =====================================================
// ================= MY EVENTS ROUTE ===================
// =====================================================

app.get("/my-events/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ id: Number(userId) });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 👑 Admin sees all events
        if (user.role === "admin") {
            const events = await Event.find({});
            return res.json(events);
        }

        // 👤 Normal user sees only their events
        const userEvents = await Event.find({
            createdById: { $in: [Number(userId), String(userId)] }
        });

        res.json(userEvents);
    } catch (err) {
        console.error("Error in GET /my-events/:userId:", err);
        res.status(500).json({ message: err.message });
    }
});

// =====================================================
// ================= DASHBOARD ROUTE ===================
// =====================================================

app.get("/dashboard/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ id: Number(userId) });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let userEvents;

        if (user.role === "admin") {
            userEvents = await Event.find({});
        } else {
            // 🔥 FIXED HERE
            userEvents = await Event.find({
                createdById: { $in: [Number(user.id), String(user.id)] }
            });
        }

        const userEventIds = userEvents.map(e => e.id);

        const totalParticipants = await Participant.countDocuments({
            eventId: { $in: [...userEventIds.map(Number), ...userEventIds.map(String)] }
        });

        const totalAnnouncements = await Notification.countDocuments({
            eventId: { $in: [...userEventIds.map(Number), ...userEventIds.map(String)] }
        });

        res.json({
            totalEvents: userEvents.length,
            totalParticipants,
            totalAnnouncements
        });
    } catch (err) {
        console.error("Error in GET /dashboard/:userId:", err);
        res.status(500).json({ message: err.message });
    }
});

// =====================================================
// ================= PARTICIPANTS ======================
// =====================================================

// Get participants of a specific event
app.get("/participants/:eventId", async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const filtered = await Participant.find({
            eventId: { $in: [Number(eventId), String(eventId)] }
        });
        res.json(filtered);
    } catch (err) {
        console.error("Error in GET /participants/:eventId:", err);
        res.status(500).json({ message: err.message });
    }
});

// Add participant
app.post("/participants", async (req, res) => {
    try {
        const newParticipant = new Participant({
            id: Date.now(),
            eventId: req.body.eventId,
            name: req.body.name,
            email: req.body.email
        });

        await newParticipant.save();
        res.json(newParticipant);
    } catch (err) {
        console.error("Error in POST /participants:", err);
        res.status(500).json({ message: err.message });
    }
});

// Delete participant
app.delete("/participants/:id", async (req, res) => {
    try {
        await Participant.deleteOne({ id: Number(req.params.id) });
        res.json({ message: "Participant removed" });
    } catch (err) {
        console.error("Error in DELETE /participants/:id:", err);
        res.status(500).json({ message: err.message });
    }
});

// =====================================================
// ================= NOTIFICATIONS =====================
// =====================================================

app.post("/notifications", async (req, res) => {
    try {
        const newNotification = new Notification({
            id: Date.now(),
            eventId: req.body.eventId,
            message: req.body.message,
            date: new Date().toISOString()
        });

        await newNotification.save();
        res.json(newNotification);
    } catch (err) {
        console.error("Error in POST /notifications:", err);
        res.status(500).json({ message: err.message });
    }
});

app.get("/notifications", async (req, res) => {
    try {
        const notifications = await Notification.find({});
        res.json(notifications);
    } catch (err) {
        console.error("Error in GET /notifications:", err);
        res.status(500).json({ message: err.message });
    }
});

// =====================================================
// ================= SIGNUP ROUTE ======================
// =====================================================

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ status: "exists", message: "Email already registered." });
        }

        const maxUser = await User.findOne().sort("-id");
        const newId = maxUser && typeof maxUser.id === "number" ? maxUser.id + 1 : Date.now();

        // Securely hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            id: newId,
            name,
            email,
            password: hashedPassword,
            role: "user"
        });

        await newUser.save();
        res.json({
            status: "success",
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        });
    } catch (err) {
        console.error("Error in POST /signup:", err);
        res.status(500).json({ message: err.message });
    }
});

// =====================================================
// ================= LOGIN ROUTE =======================
// =====================================================

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ status: "invalid" });
        }

        // Check if stored password is a bcrypt hash (starts with typical bcrypt prefixes)
        const isBcryptHash = user.password.startsWith("$2a$") || user.password.startsWith("$2b$") || user.password.startsWith("$2y$");
        let isMatch = false;

        if (isBcryptHash) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // Fallback for legacy plain-text passwords
            isMatch = user.password === password;
            if (isMatch) {
                // Proactively upgrade plain-text password to bcrypt hash in the database
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
                await user.save();
                console.log(`Auto-upgraded legacy user ${user.email} password to bcrypt hash`);
            }
        }

        if (isMatch) {
            return res.json({
                status: "success",
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            return res.json({ status: "invalid" });
        }
    } catch (err) {
        console.error("Error in POST /login:", err);
        res.status(500).json({ message: err.message });
    }
});
