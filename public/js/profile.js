
// // header elements
// let headerName = document.querySelector('#headerName');
// let headerEmail = document.querySelector('#headerEmail');

// // input fields
// let nameInput = document.querySelector('#nameInput');
// let emailInput = document.querySelector('#emailInput');


// // button click
// let btn = document.querySelector('.btn-primary');
// btn.addEventListener('click', function () {

//     let newName = nameInput.value;
//     let newEmail = emailInput.value;

//     if (newName) {
//         headerName.textContent = newName;
//         localStorage.setItem('name', newName);
//     }

//     if (newEmail) {
//         headerEmail.textContent = newEmail;
//         localStorage.setItem('email', newEmail);
//     }
// });
// {/* <h2>Harsh Raj</h2>
//             <p>harshraj@email.com</p> */}

//             // Get stored login data
const headerName = document.querySelector('#headerName');
const headerEmail = document.querySelector('#headerEmail');

// Get from localStorage (set during login)
const storedName = localStorage.getItem("userName");
const storedEmail = localStorage.getItem("userEmail");

// If user is logged in
if (storedName && storedEmail) {
    headerName.textContent = storedName;
    headerEmail.textContent = storedEmail;
} else {
    // If not logged in, redirect
    window.location.href = "login.html";
}