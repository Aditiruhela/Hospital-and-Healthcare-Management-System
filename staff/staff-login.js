
const loginForm = document.getElementById("staff-login-form");
const errorMessage = document.getElementById("error-message");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Demo staff credentials
    const staffUsername = "staff";
    const staffPassword = "MediCare@123";

    if (username === staffUsername && password === staffPassword) {

        // Store login status for this browser tab
        sessionStorage.setItem("staffLoggedIn", "true");

        // Redirect to staff dashboard
        window.location.href = "patient-records.html";

    } else {
        errorMessage.textContent = "Invalid username or password!";
    }
});
