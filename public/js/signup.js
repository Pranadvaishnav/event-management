console.log("Signup JS loaded");

async function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const errorMessage = document.getElementById("error-message");

    errorMessage.innerText = "";

    if (!name || !email || !password || !confirmPassword) {
        errorMessage.innerText = "All fields are required.";
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.innerText = "Passwords do not match.";
        return;
    }

    try {
        const response = await fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (data.status === "success") {
            alert("Registration successful! Please log in.");
            window.location.href = "login.html";
        } else if (data.status === "exists") {
            errorMessage.innerText = data.message;
        } else {
            errorMessage.innerText = "Registration failed. Please try again.";
        }
    } catch (err) {
        console.error("Signup error:", err);
        errorMessage.innerText = "Server error. Please try again later.";
    }
}
