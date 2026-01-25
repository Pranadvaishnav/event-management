console.log("Login JS loaded");

function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        document.getElementById("error-message").innerText =
            "Please enter both email and password.";
        return;
    }

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Server response:", data);   
        if (data.status === "success") {

            // store logged-in user
            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("userName", data.name);
            localStorage.setItem("userRole", data.role);
            localStorage.setItem("userId", data.id);

            window.location.href = "Dashboard.html";

        } else {
            document.getElementById("error-message").innerText =
                "Invalid Email or Password.";
        }
    })
    .catch(err => {
        console.error("Login error:", err);
        document.getElementById("error-message").innerText =
            "Server error. Please try again.";
    });
}
