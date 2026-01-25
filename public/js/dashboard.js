

document.addEventListener("DOMContentLoaded", async () => {
    const notifRes = await fetch("/notifications");
    const notifications = await notifRes.json();

    document.getElementById("totalAnnouncements").textContent =
        notifications.length;
    document.getElementById("totalEvents").textContent = "0";
    document.getElementById("totalParticipants").textContent = "0";


    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        const dashRes = await fetch(`/dashboard/${userId}`);
        const dashData = await dashRes.json();

        document.getElementById("totalEvents").textContent =
            dashData.totalEvents;

        document.getElementById("totalParticipants").textContent =
            dashData.totalParticipants;


        loadDashboardExtras();

    } catch (error) {
        console.error("Dashboard error:", error);
    }
});