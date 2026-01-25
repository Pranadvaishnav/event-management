const container = document.getElementById("notificationContainer");

async function loadNotifications() {
    try {
        // Fetch notifications
        const notifRes = await fetch("/notifications");
        const notifications = await notifRes.json();

        // Fetch all events (IMPORTANT for performance)
        const eventRes = await fetch("/events");
        const events = await eventRes.json();

        container.innerHTML = "";

        if (!notifications || notifications.length === 0) {
            container.innerHTML = "<p>No notifications yet.</p>";
            return;
        }

        // Sort latest first
        const sortedNotifications = [...notifications].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        sortedNotifications.forEach(notification => {

            // Find event by ID
            const event = events.find(e => e.id == notification.eventId);
            const eventName = event ? event.title : "Unknown Event";

            const div = document.createElement("div");
            div.classList.add("notification");

             // 🔥 MAKE IT CLICKABLE
            div.style.cursor = "pointer";

            div.addEventListener("click", () => {
            window.location.href = `event_detail.html?id=${notification.eventId}`;
    });

    div.innerHTML = `
        <h4>📢 Announcement – ${eventName}</h4>
        <p>${notification.message}</p>
        <span class="time">
            ${new Date(notification.date).toLocaleString()}
        </span>
    `;

    container.appendChild(div);
});

    } catch (error) {
        container.innerHTML = "<p>Failed to load notifications.</p>";
        console.error("Error loading notifications:", error);
    }
}

loadNotifications();