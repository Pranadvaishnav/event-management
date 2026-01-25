// ===============================
// GLOBAL STORAGE FOR PARTICIPANTS
// ===============================
let allParticipants = [];


// ===============================
// LOAD EVENT + PARTICIPANTS
// ===============================
async function loadManageEvent() {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id");

    if (!eventId) {
        alert("No event ID found in URL");
        return;
    }

    // Fetch event info
    const eventRes = await fetch(`/events/${eventId}`);
    const event = await eventRes.json();

    document.getElementById("manageEventTitle").textContent = event.title;

    // Fetch participants
    const participantsRes = await fetch(`/participants/${eventId}`);
    const participants = await participantsRes.json();

    // Store full list globally
    allParticipants = participants;

    // Display all participants initially
    displayParticipants(allParticipants);
}


// ===============================
// DISPLAY PARTICIPANTS FUNCTION
// ===============================
function displayParticipants(participants) {
    const container = document.getElementById("participantsContainer");
    container.innerHTML = "";

    if (participants.length === 0) {
        container.innerHTML = "<p>No participants found.</p>";
        return;
    }

    participants.forEach(participant => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";
        row.style.marginBottom = "10px";

        row.innerHTML = `
            <div>
                <strong>${participant.name}</strong><br>
                <small>${participant.email}</small>
            </div>
            <button class="btn-primary" data-id="${participant.id}">
                Remove
            </button>
        `;

        // Remove participant
        row.querySelector("button").addEventListener("click", async () => {
            await fetch(`/participants/${participant.id}`, {
                method: "DELETE"
            });

            loadManageEvent(); // Reload list after deletion
        });

        container.appendChild(row);
    });
}


// ===============================
// LIVE SEARCH FUNCTION
// ===============================
const searchInput = document.getElementById("searchParticipants");

if (searchInput) {
    searchInput.addEventListener("input", function (e) {
        const value = e.target.value.toLowerCase();

        const filtered = allParticipants.filter(participant =>
            participant.name.toLowerCase().includes(value) ||
            participant.email.toLowerCase().includes(value)
        );

        displayParticipants(filtered);
    });
}


// ===============================
// ANNOUNCEMENT FORM
// ===============================
const announcementForm = document.getElementById("announcementForm");

if (announcementForm) {
    announcementForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const eventId = new URLSearchParams(window.location.search).get("id");

        if (!eventId) {
            alert("No event ID found in URL");
            return;
        }

        const message = document.getElementById("announcementText").value;

        const res = await fetch("/notifications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                eventId: eventId,
                message: message
            })
        });

        if (res.ok) {
            document.getElementById("announcementMessage").textContent =
                "Announcement sent successfully!";
            announcementForm.reset();
        } else {
            document.getElementById("announcementMessage").textContent =
                "Failed to send announcement.";
        }
    });
}


// ===============================
// INITIAL LOAD
// ===============================
loadManageEvent();