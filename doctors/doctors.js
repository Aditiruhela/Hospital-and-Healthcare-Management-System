/**
 * Doctors Page JavaScript - MediCare Central
 * Implements live search, department filtering, availability filtering,
 * profile viewing modal, and appointment scheduling modal.
 */

document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const searchInput = document.getElementById("doctor-search");
    const departmentSelect = document.getElementById("department");
    const availabilitySelect = document.getElementById("availability-filter");
    const doctorCards = Array.from(document.querySelectorAll(".doctor-card"));
    const doctorCountEl = document.getElementById("doctor-count");
    const noDoctorsEl = document.getElementById("no-doctors");
    const resetFiltersBtn = document.getElementById("reset-filters");

    // Profile Modal Elements
    const profileModal = document.getElementById("doctor-profile-modal");
    const modalDocImg = document.getElementById("modal-doc-img");
    const modalDocName = document.getElementById("modal-doc-name");
    const modalDocSpec = document.getElementById("modal-doc-spec");
    const modalDocStatus = document.getElementById("modal-doc-status");
    const modalDocRating = document.getElementById("modal-doc-rating");
    const modalDocDept = document.getElementById("modal-doc-dept");
    const modalDocQual = document.getElementById("modal-doc-qual");
    const modalDocExp = document.getElementById("modal-doc-exp");
    const modalDocHours = document.getElementById("modal-doc-hours");
    const modalDocAbout = document.getElementById("modal-doc-about");
    const modalScheduleBtn = document.getElementById("modal-schedule-btn");

    // Schedule Modal Elements
    const scheduleModal = document.getElementById("doctor-schedule-modal");
    const scheduleForm = document.getElementById("schedule-form");
    const schedDoctorNameInput = document.getElementById("sched-doctor-name");
    const schedDateInput = document.getElementById("sched-date");
    const scheduleSuccessEl = document.getElementById("schedule-success");

    let currentSelectedDoctor = null;

    /**
     * Capitalize first letter of string
     */
    function capitalize(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Extract structured doctor data from a card element
     */
    function getDoctorData(card) {
        const name = card.dataset.name || card.querySelector("h3")?.textContent.trim() || "";
        const spec = card.dataset.specialization || card.querySelector(".specialization")?.textContent.trim() || "";
        const dept = card.dataset.department || "";
        const statusEl = card.querySelector(".doctor-status");
        const status = card.dataset.status || (statusEl?.classList.contains("busy") ? "busy" : "available");
        const statusText = statusEl ? statusEl.textContent.trim() : (status === "busy" ? "On Leave" : "Available");
        const exp = card.dataset.experience || "Not specified";
        const qual = card.dataset.qualification || "Not specified";
        const rating = card.dataset.rating || card.querySelector(".rating")?.textContent.trim() || "★ 4.8 / 5";
        const hours = card.dataset.hours || "9:00 AM - 2:00 PM";
        const about = card.dataset.about || `${name} is an experienced healthcare specialist at MediCare Central providing expert consultations.`;
        const img = card.querySelector(".doctor-image img")?.src || "";

        return {
            name,
            specialization: spec,
            department: dept,
            status,
            statusText,
            experience: exp,
            qualification: qual,
            rating,
            hours,
            about,
            image: img
        };
    }

    /**
     * Filter doctors based on search text, selected department, and availability
     */
    function filterDoctors() {
        const searchTerm = (searchInput ? searchInput.value : "").trim().toLowerCase();
        const selectedDept = (departmentSelect ? departmentSelect.value : "").trim().toLowerCase();
        const selectedAvailability = (availabilitySelect ? availabilitySelect.value : "").trim().toLowerCase();

        let visibleCount = 0;

        doctorCards.forEach(function (card) {
            const data = getDoctorData(card);

            // 1. Search matching (matches name or specialization)
            const nameMatch = data.name.toLowerCase().includes(searchTerm);
            const specMatch = data.specialization.toLowerCase().includes(searchTerm);
            const matchesSearch = !searchTerm || nameMatch || specMatch;

            // 2. Department matching
            const cardDept = (card.dataset.department || "").toLowerCase();
            const matchesDept = !selectedDept || cardDept === selectedDept || data.specialization.toLowerCase().includes(selectedDept);

            // 3. Availability matching
            const cardStatus = (card.dataset.status || data.status).toLowerCase();
            const matchesAvailability = !selectedAvailability || cardStatus === selectedAvailability;

            // Combined logic: all active filters must pass
            if (matchesSearch && matchesDept && matchesAvailability) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Update count display
        updateDoctorCount(visibleCount, doctorCards.length);

        // Show/hide no results message
        if (noDoctorsEl) {
            noDoctorsEl.style.display = visibleCount === 0 ? "block" : "none";
        }
    }

    /**
     * Update the visible doctor count counter
     */
    function updateDoctorCount(visible, total) {
        if (!doctorCountEl) return;
        if (visible === total) {
            doctorCountEl.textContent = `Showing all ${total} doctors`;
        } else if (visible === 1) {
            doctorCountEl.textContent = `Showing 1 doctor (filtered from ${total})`;
        } else {
            doctorCountEl.textContent = `Showing ${visible} of ${total} doctors`;
        }
    }

    /**
     * Reset all filters to default state
     */
    function resetAllFilters() {
        if (searchInput) searchInput.value = "";
        if (departmentSelect) departmentSelect.value = "";
        if (availabilitySelect) availabilitySelect.value = "";
        filterDoctors();
    }

    /**
     * Open Doctor Profile Modal with doctor's details
     */
    function openProfileModal(data) {
        currentSelectedDoctor = data;

        if (modalDocImg) modalDocImg.src = data.image;
        if (modalDocImg) modalDocImg.alt = data.name;
        if (modalDocName) modalDocName.textContent = data.name;
        if (modalDocSpec) modalDocSpec.textContent = data.specialization;
        if (modalDocRating) modalDocRating.textContent = data.rating;
        if (modalDocDept) modalDocDept.textContent = capitalize(data.department || data.specialization);
        if (modalDocQual) modalDocQual.textContent = data.qualification;
        if (modalDocExp) modalDocExp.textContent = data.experience;
        if (modalDocHours) modalDocHours.textContent = data.hours;
        if (modalDocAbout) modalDocAbout.textContent = data.about;

        if (modalDocStatus) {
            modalDocStatus.textContent = data.statusText;
            modalDocStatus.className = "doctor-status " + (data.status === "busy" ? "busy" : "available");
        }

        if (profileModal) {
            profileModal.classList.add("active");
            profileModal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        }
    }

    /**
     * Open Schedule Modal prefilled with doctor name
     */
    function openScheduleModal(data) {
        currentSelectedDoctor = data;

        if (schedDoctorNameInput) {
            schedDoctorNameInput.value = data.name + " (" + data.specialization + ")";
        }

        // Set minimum appointment date to today
        if (schedDateInput) {
            const today = new Date().toISOString().split("T")[0];
            schedDateInput.min = today;
            if (!schedDateInput.value) {
                schedDateInput.value = today;
            }
        }

        if (scheduleSuccessEl) {
            scheduleSuccessEl.style.display = "none";
            scheduleSuccessEl.textContent = "";
        }

        if (scheduleForm) {
            scheduleForm.style.display = "";
        }

        if (scheduleModal) {
            scheduleModal.classList.add("active");
            scheduleModal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        }
    }

    /**
     * Close all active modals
     */
    function closeModals() {
        if (profileModal) {
            profileModal.classList.remove("active");
            profileModal.setAttribute("aria-hidden", "true");
        }
        if (scheduleModal) {
            scheduleModal.classList.remove("active");
            scheduleModal.setAttribute("aria-hidden", "true");
        }
        document.body.style.overflow = "";
    }

    // Set up card button event listeners (delegated or direct)
    doctorCards.forEach(function (card) {
        const profileBtn = card.querySelector(".doctor-buttons a.btn:not(.secondary-btn)");
        const scheduleBtn = card.querySelector(".doctor-buttons a.secondary-btn");

        if (profileBtn) {
            profileBtn.addEventListener("click", function (event) {
                event.preventDefault();
                const data = getDoctorData(card);
                openProfileModal(data);
            });
        }

        if (scheduleBtn) {
            scheduleBtn.addEventListener("click", function (event) {
                event.preventDefault();
                const data = getDoctorData(card);
                openScheduleModal(data);
            });
        }
    });

    // Modal internal action buttons
    if (modalScheduleBtn) {
        modalScheduleBtn.addEventListener("click", function () {
            if (currentSelectedDoctor) {
                closeModals();
                openScheduleModal(currentSelectedDoctor);
            }
        });
    }

    // Close buttons on modals
    document.querySelectorAll(".doctor-modal-close, .schedule-cancel-btn").forEach(function (btn) {
        btn.addEventListener("click", closeModals);
    });

    // Close on clicking backdrop overlay
    [profileModal, scheduleModal].forEach(function (modal) {
        if (!modal) return;
        modal.addEventListener("click", function (e) {
            if (e.target === modal) {
                closeModals();
            }
        });
    });

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeModals();
        }
    });

    // Handle Appointment Schedule Form Submit
    if (scheduleForm) {
        scheduleForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const patientName = document.getElementById("sched-patient-name")?.value || "Patient";
            const apptType = document.getElementById("sched-appointment-type")?.value || "Consultation";
            const apptDate = document.getElementById("sched-date")?.value || "selected date";
            const apptTime = document.getElementById("sched-time")?.value || "";
            const docName = schedDoctorNameInput?.value || "the doctor";

            if (scheduleSuccessEl) {
                scheduleSuccessEl.innerHTML = `
                    <strong>✓ Appointment Scheduled!</strong><br>
                    Thank you, <b>${patientName}</b>. Your <b>${apptType}</b> appointment with <b>${docName}</b>
                    is confirmed for <b>${apptDate}</b> at <b>${apptTime}</b>.
                `;
                scheduleSuccessEl.style.display = "block";
            }

            scheduleForm.reset();

            // Auto-close after 2.5 seconds
            setTimeout(function () {
                closeModals();
                if (scheduleSuccessEl) {
                    scheduleSuccessEl.style.display = "none";
                }
            }, 2500);
        });
    }

    // Live search event
    if (searchInput) {
        searchInput.addEventListener("input", filterDoctors);
    }

    // Department filter change event
    if (departmentSelect) {
        departmentSelect.addEventListener("change", filterDoctors);
    }

    // Availability filter change event
    if (availabilitySelect) {
        availabilitySelect.addEventListener("change", filterDoctors);
    }

    // Reset button event
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener("click", resetAllFilters);
    }

    /**
     * Check URL query parameters (e.g., from Department page links: ?department=cardiology)
     */
    function applyUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const deptParam = urlParams.get("department");
        const searchParam = urlParams.get("search");

        if (deptParam && departmentSelect) {
            const normalized = deptParam.trim().toLowerCase();
            // Check if option exists in dropdown
            const optionExists = Array.from(departmentSelect.options).some(function (opt) {
                return opt.value.toLowerCase() === normalized;
            });
            if (optionExists) {
                departmentSelect.value = normalized;
            }
        }

        if (searchParam && searchInput) {
            searchInput.value = searchParam;
        }

        // Apply filters immediately
        filterDoctors();
    }

    // Initialize page with any pre-selected query params
    applyUrlParams();
});
