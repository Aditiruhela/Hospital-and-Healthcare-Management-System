function bindNavbarMenu(nav) {
  const navToggle = nav.querySelector(".nav-toggle");
  const navLinks = nav.querySelector(".nav-links");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", function () {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });

  navLinks.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}

function normalizeNavbar() {
  const existingNavbar = document.querySelector(".unified-navbar");

  if (existingNavbar) {
    bindNavbarMenu(existingNavbar);
    return;
  }

  const oldNavbar = document.querySelector(
    "header.site-header, header.header, nav.main-navbar, header"
  );

  if (!oldNavbar) return;

  const header = document.createElement("header");
  header.className = "site-header unified-site-header";

  const nav = document.createElement("nav");
  nav.className = "navbar unified-navbar";

  const logo = document.createElement("a");
  logo.className = "logo";
  logo.href = "../homepage/index.html";
  logo.innerHTML =
    '<span class="logo-mark" aria-hidden="true">+</span>' +
    '<span class="logo-name">MediCare <b>Central</b></span>';

  const navLinks = document.createElement("ul");
  navLinks.className = "nav-links";

  const links = [
    ["Home", "../homepage/index.html", "homepage"],
    ["Patients", "../patients/patients.html", "patients"],
    ["Doctors", "../doctors/doctors.html", "doctors"],
    ["Departments", "../departments/departments.html", "departments"],
    ["Appointments", "../appointments/appointments.html", "appointments"],
    ["Services", "../services/services.html", "services"],
    ["Pharmacy", "../Pharmacy/Pharmacy.html", "pharmacy"],
    ["Billing", "../billing/billing.html", "billing"],
    ["Contact", "../contact/contact.html", "contact"]
  ];

  const currentPage = window.location.pathname.toLowerCase();
  const activePage = currentPage.includes("/schedule/") ||
    currentPage.includes("/doctor-profile/") ? "doctors" : null;

  links.forEach(function ([label, href, page]) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;

    if (page === activePage || currentPage.includes("/" + page + "/")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }

    item.appendChild(link);
    navLinks.appendChild(item);
  });

  const themeButton = document.createElement("button");
  themeButton.type = "button";
  themeButton.id = "themeToggle";
  themeButton.className = "theme-btn site-theme-toggle";

  const navToggle = document.createElement("button");
  navToggle.type = "button";
  navToggle.id = "navToggle";
  navToggle.className = "nav-toggle";
  navToggle.setAttribute("aria-label", "Open navigation");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.innerHTML = "<span></span><span></span><span></span>";

  nav.append(logo, navLinks, themeButton, navToggle);
  header.appendChild(nav);
  oldNavbar.replaceWith(header);
  bindNavbarMenu(nav);
}

normalizeNavbar();

const themeButton = document.getElementById("themeToggle") || document.createElement("button");

themeButton.type = "button";
themeButton.id = "themeToggle";
themeButton.classList.add("site-theme-toggle");

if (!themeButton.isConnected) {
  const navContainer = document.querySelector(".nav-container");
  const bootstrapContainer = document.querySelector(
    ".main-navbar > .container, .main-navbar > .container-fluid"
  );
  const headerNav = document.querySelector("header nav");
  const target = navContainer || bootstrapContainer || headerNav ||
    document.querySelector("header, nav.main-navbar");

  if (target) {
    target.append(themeButton);
  } else {
    document.body.prepend(themeButton);
  }
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);
  themeButton.textContent = isDark ? "☀️ Light" : "🌙 Dark";
  themeButton.setAttribute("aria-label", isDark ? "Enable light mode" : "Enable dark mode");
  themeButton.setAttribute("aria-pressed", String(isDark));
}

try {
  applyTheme(localStorage.getItem("theme") || "light");
} catch (error) {
  console.warn("Could not read the saved theme preference.", error);
  applyTheme("light");
}

themeButton.addEventListener("click", function () {
  const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(nextTheme);

  try {
    localStorage.setItem("theme", nextTheme);
  } catch (error) {
    console.warn("Could not save the theme preference.", error);
  }
});

window.addEventListener("storage", function (event) {
  if (event.key === "theme") {
    applyTheme(event.newValue || "light");
  }
});
