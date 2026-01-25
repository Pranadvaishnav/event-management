console.log("MY EVENTS JS RUNNING");

document.addEventListener("DOMContentLoaded", function () {

    const calendarEl = document.getElementById("calendar");

    const filterCategory = document.getElementById("filterCategory");
    const filterType = document.getElementById("filterType");
    const filterTime = document.getElementById("filterTime");

    const modal = document.getElementById("eventModal");

    // Modal elements (DO NOT remove from HTML)
    const modalTitle = document.getElementById("modalTitle");
    const modalDate = document.getElementById("modalDate");
    const modalCategory = document.getElementById("modalCategory");
    const modalLocation = document.getElementById("modalLocation");
    const modalOrganizer = document.getElementById("modalOrganizer");
    const modalStatus = document.getElementById("modalStatus");
    const modalSeats = document.getElementById("modalSeats");

    const manageBtn = document.getElementById("manageBtn");
    const unregisterBtn = document.getElementById("unregisterBtn");
    const closeBtn = document.getElementById("closeModal");

    let allEvents = [];

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
        },
        events: [],

        eventDidMount: function(info) {

    const dayCell = info.el.closest('.fc-daygrid-day');

    if (dayCell) {
        dayCell.style.backgroundColor = info.event.backgroundColor;
        dayCell.style.color = "#ffffff";
    }

    // hide default badge
    info.el.style.display = "none";
},

        eventClick: function (info) {

            const e = info.event;

            // Fill modal data (DO NOT replace modal HTML)
            modalTitle.innerText = e.title;
            modalDate.innerHTML = "<strong>Date:</strong> " + new Date(e.start).toLocaleString();
            modalCategory.innerHTML = "<strong>Category:</strong> " + e.extendedProps.category;
            modalLocation.innerHTML = "<strong>Location:</strong> " + e.extendedProps.location;
            modalOrganizer.innerHTML = "<strong>Organizer:</strong> " + e.extendedProps.organizer;
            modalStatus.innerHTML = "<strong>Status:</strong> " + e.extendedProps.status;

            // Button actions
            manageBtn.onclick = () => {
                window.location.href = "my_events.html";
            };

            unregisterBtn.onclick = async () => {
                await fetch(`/unregister/${e.id}`, { method: "DELETE" });
                location.reload();
            };

            modal.classList.remove("hidden");
        }
    });

    calendar.render();
    loadEvents();

    closeBtn.onclick = () => modal.classList.add("hidden");

    window.onclick = function (e) {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    };

    async function loadEvents() {
        const userId = localStorage.getItem("userId");
        const res = await fetch(`/my-events/${userId}`);
        const events = await res.json();

        allEvents = events.map(event => {

            let today = new Date();
            let eventDate = new Date(event.date);

            let color = "#007bff";

            if (event.createdById == userId)
                color = "#28a745";

            if (eventDate < today)
                color = "#dc3545";

            if (eventDate.toDateString() === today.toDateString())
                color = "#ff8c42";

            return {
                id: event.id,
                title: event.title,
                start: event.date,
                backgroundColor: color,
                borderColor: color,
                textColor: "#ffffff",
                extendedProps: {
                    category: event.category,
                    location: event.location,
                    organizer: event.createdBy,
                    status: event.createdBy === "Harsh Raj" ? "Created" : "Registered"
                }
            };
        });

        calendar.removeAllEvents();
        calendar.addEventSource(allEvents);
        updateDashboardCounts();
    }

    // FILTER LOGIC
    [filterCategory, filterType, filterTime].forEach(filter =>
        filter.addEventListener("change", applyFilters)
    );

    function applyFilters() {

        calendar.removeAllEvents();

        let filtered = allEvents.filter(e => {

            let matchCategory =
                !filterCategory.value ||
                e.extendedProps.category === filterCategory.value;

            let matchType =
                !filterType.value ||
                e.extendedProps.status.toLowerCase() === filterType.value;

            let now = new Date();
            let eventDate = new Date(e.start);

            let matchTime = true;

            if (filterTime.value === "upcoming")
                matchTime = eventDate >= now;

            if (filterTime.value === "past")
                matchTime = eventDate < now;

            return matchCategory && matchType && matchTime;
        });

        calendar.addEventSource(filtered);
    }

    function updateDashboardCounts() {
        const upcoming = allEvents.filter(e =>
            new Date(e.start) >= new Date()
        ).length;

        const total = allEvents.length;

        const registered = allEvents.filter(e =>
            e.extendedProps.status === "Registered"
        ).length;

        document.getElementById("totalEvents").textContent = total;
        document.getElementById("upcomingEvents").textContent = upcoming;
        document.getElementById("registeredEvents").textContent = registered;
    }

});