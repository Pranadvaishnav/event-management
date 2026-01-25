console.log("MY EVENTS JS RUNNING");

const container = document.getElementById("myEventsContainer");

async function loadMyEvents() {
    try {

        const userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Please login first.");
            window.location.href = "login.html";
            return;
        }

        const res = await fetch(`/my-events/${userId}`);
        const events = await res.json();

        console.log("Fetched events:", events);

        container.innerHTML = "";

        events.forEach(event => {

            const card = document.createElement("div");
            card.classList.add("event-card");

            card.innerHTML = `
                <h3>${event.title}</h3>
                <p>${event.category}</p>
                <p>${event.location} • ${event.date}</p>

                <div class="card-footer">
                    <button class="btn-primary manage-btn">
                        Manage
                    </button>
                </div>
            `;

            const manageBtn = card.querySelector(".manage-btn");

            manageBtn.addEventListener("click", () => {
                window.location.href = `/html/manage_event.html?id=${event.id}`;
            });

            container.appendChild(card);
        });

    } catch (err) {
        console.error("ERROR:", err);
    }
}

loadMyEvents();