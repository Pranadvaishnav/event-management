const container = document.getElementById("eventsContainer");
const searchInput = document.getElementById("searchInput"); // make sure your input has this ID

let allEvents = []; // store events globally

// Load events from backend
async function loadEvents() {
    try {
        const res = await fetch("/events");
        const events = await res.json();

        allEvents = events; // save for searching
        displayEvents(allEvents);

    } catch (error) {
        console.error("Error loading events:", error);
    }
}

// Display events function (reusable)
function displayEvents(eventsArray) {
    container.innerHTML = "";

    if (eventsArray.length === 0) {
        container.innerHTML = "<p style='padding:20px;'>No events found.</p>";
        return;
    }

    eventsArray.forEach(event => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div style="padding: 20px;">
                <h3>${event.title}</h3>
                <p>${event.category}</p>
                <span>${event.location} • ${event.date}</span>
            </div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `event_detail.html?id=${event.id}`;
        });

        container.appendChild(card);
    });
}

// Search functionality
searchInput.addEventListener("input", function (e) {
    const value = e.target.value.toLowerCase();

    const filtered = allEvents.filter(event =>
        event.title.toLowerCase().includes(value) ||
        event.category.toLowerCase().includes(value) ||
        event.location.toLowerCase().includes(value)
    );

    displayEvents(filtered);
});

// Initial load
loadEvents();