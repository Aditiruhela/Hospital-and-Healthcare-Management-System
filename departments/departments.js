/**
 * Departments Page JavaScript - MediCare Central
 * Implements live search by department name and ensures
 * "View Specialists" links filter doctors by department.
 */

document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const searchInput = document.getElementById("department-search");
    const departmentCards = Array.from(document.querySelectorAll(".department-card"));
    const departmentCountEl = document.getElementById("department-count");
    const noDepartmentsEl = document.getElementById("no-departments");
    const resetSearchBtn = document.getElementById("reset-dept-search");

    /**
     * Extract searchable text from a department card
     */
    function getDepartmentData(card) {
        const title = card.querySelector("h3")?.textContent.trim() || "";
        const desc = card.querySelector(".department-content > p")?.textContent.trim() || "";
        const services = Array.from(card.querySelectorAll("ul li")).map(function (li) {
            return li.textContent.trim();
        }).join(" ");

        return {
            title,
            description: desc,
            services,
            allText: (title + " " + desc + " " + services).toLowerCase()
        };
    }

    /**
     * Filter department cards based on user search query
     */
    function filterDepartments() {
        const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
        let visibleCount = 0;

        departmentCards.forEach(function (card) {
            const data = getDepartmentData(card);

            // Check if department title matches or services match
            const matchesTitle = data.title.toLowerCase().includes(query);
            const matchesAll = data.allText.includes(query);

            if (!query || matchesTitle || matchesAll) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Update count indicator
        updateDepartmentCount(visibleCount, departmentCards.length);

        // Show/hide no results notice
        if (noDepartmentsEl) {
            noDepartmentsEl.style.display = visibleCount === 0 ? "block" : "none";
        }
    }

    /**
     * Update department count counter
     */
    function updateDepartmentCount(visible, total) {
        if (!departmentCountEl) return;
        if (visible === total) {
            departmentCountEl.textContent = `Showing all ${total} departments`;
        } else if (visible === 1) {
            departmentCountEl.textContent = `Showing 1 department (filtered from ${total})`;
        } else {
            departmentCountEl.textContent = `Showing ${visible} of ${total} departments`;
        }
    }

    /**
     * Reset search input and show all departments
     */
    function resetSearch() {
        if (searchInput) {
            searchInput.value = "";
            filterDepartments();
            searchInput.focus();
        }
    }

    // Attach search input listener
    if (searchInput) {
        searchInput.addEventListener("input", filterDepartments);
    }

    // Attach reset button listener
    if (resetSearchBtn) {
        resetSearchBtn.addEventListener("click", resetSearch);
    }

    // Initial count
    updateDepartmentCount(departmentCards.length, departmentCards.length);
});
