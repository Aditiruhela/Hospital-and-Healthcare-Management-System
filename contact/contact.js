
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

const STORAGE_KEY = "medicareContactMessages";

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) {
        formMessage.textContent = "Please fill in all fields.";
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        formMessage.textContent = "Please enter a valid email address.";
        return;
    }

    const messages = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );

    const newMessage = {
        id: Date.now(),
        name,
        email,
        subject,
        message,
        date: new Date().toLocaleString()
    };

    messages.unshift(newMessage);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));

    formMessage.textContent =
        "Your message has been submitted successfully!";

    formMessage.style.color = "#0b7a45";

    contactForm.reset();
});

// Retrieve saved messages when needed
function getContactMessages() {
    return JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );
}

console.log("Contact form initialized successfully.");
