document.addEventListener("DOMContentLoaded", () => {

    async function loadEvent() {
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get("id");

        if (!eventId) {
            alert("No event ID found in URL");
            return;
        }

        const res = await fetch(`/events/${eventId}`);
        const event = await res.json();

        document.getElementById("eventTitle").textContent = event.title;
        document.getElementById("eventSubtitle").textContent =
            `${event.category} • ${event.location}`;

        document.getElementById("eventDescription").textContent =
            event.description;

        document.getElementById("summaryCategory").textContent =
            event.category;
        document.getElementById("summaryLocation").textContent =
            event.location;
        document.getElementById("summaryDate").textContent =
            event.date;
        document.getElementById("summaryCreator").textContent =
            event.createdBy;

        // document.getElementById("summaryDescription").textContent =
        //     event.description;
    }

    loadEvent();

    // 🔥 Registration Logic
    const form = document.getElementById("registrationForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const params = new URLSearchParams(window.location.search);
        const eventId = params.get("id");

        const participantData = {
            eventId: eventId,
            name: document.getElementById("participantName").value,
            email: document.getElementById("participantEmail").value
        };

        const res = await fetch("/participants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(participantData)
        });

        if (res.ok) {
            document.getElementById("registrationMessage").textContent =
                "Successfully Registered!";
            form.reset();
        } else {
            document.getElementById("registrationMessage").textContent =
                "Registration failed.";
        }
    });

});