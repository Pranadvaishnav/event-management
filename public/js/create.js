const form = document.getElementById("createEventForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const eventData = {
        title: document.getElementById("title").value,
        category: document.getElementById("category").value,
        location: document.getElementById("location").value,
        date: document.getElementById("date").value,
        description: document.getElementById("description").value,
        createdById: localStorage.getItem("userId")
    };

    const response = await fetch("/events", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(eventData)
    });

    if (response.ok) {
        alert("Event Created Successfully!");
        window.location.href = "event_listing.html";
    } else {
        alert("Error creating event");
    }
});