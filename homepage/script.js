const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelector(".nav-links");

// Mobile hamburger menu
navToggle.addEventListener("click", function () {
  navLinks.classList.toggle("open");
});