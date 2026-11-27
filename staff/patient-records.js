if (sessionStorage.getItem("staffLoggedIn") !== "true") {
    window.location.href = "staff-login.html";
}

const patientTableBody = document.getElementById("patient-table-body");
const searchInput = document.getElementById("search-patient");
const noRecordsMessage = document.getElementById("no-records");
const logoutButton = document.getElementById("logout-button");

const appointmentTableBody = document.getElementById("appointment-table-body");
const noAppointmentsMessage = document.getElementById("no-appointments");

const patients = JSON.parse(localStorage.getItem("patients")) || [];
const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

function displayPatients(patientList) {
    patientTableBody.innerHTML = "";

    if (patientList.length === 0) {
        noRecordsMessage.textContent = "No patient records found.";
        return;
    }

    noRecordsMessage.textContent = "";

    patientList.forEach(function (patient) {
        const newRow = document.createElement("tr");

        const values = [
            patient.id,
            patient.name,
            patient.age,
            patient.gender,
            patient.bloodGroup,
            patient.phone,
            patient.email,
            patient.lastVisit,
            patient.status
        ];

        values.forEach(function (value) {
            const cell = document.createElement("td");
            cell.textContent = value || "N/A";
            newRow.appendChild(cell);
        });

        patientTableBody.appendChild(newRow);
    });
}


function displayAppointments() {
    appointmentTableBody.innerHTML = "";

    if (appointments.length === 0) {
        noAppointmentsMessage.textContent = "No appointment records found.";
        return;
    }

    noAppointmentsMessage.textContent = "";

    appointments.forEach(function (appointment, index) {
        const newRow = document.createElement("tr");

        const values = [
            appointment.patientName,
            appointment.doctorName,
            appointment.appointmentType,
            appointment.appointmentDate,
            appointment.appointmentTime,
            appointment.reason,
            appointment.status
        ];

        values.forEach(function (value) {
            const cell = document.createElement("td");
            cell.textContent = value || "N/A";
            newRow.appendChild(cell);
        });
        const actionCell = document.createElement("td");
        const cancelButton = document.createElement("button");

        cancelButton.textContent = "Cancel";
        cancelButton.classList.add("cancel-button");

        if (appointment.status === "Cancelled") {
            cancelButton.textContent = "Cancelled";
            cancelButton.disabled = true;
        }

        cancelButton.addEventListener("click", function () {
            const confirmCancel = confirm(
                "Are you sure you want to cancel this appointment?"
            );

            if (confirmCancel) {
                appointments[index].status = "Cancelled";

                localStorage.setItem(
                    "appointments",
                    JSON.stringify(appointments)
                );

                displayAppointments();
                alert("Appointment cancelled successfully!");
            }
        });

        actionCell.appendChild(cancelButton);
        newRow.appendChild(actionCell);

        appointmentTableBody.appendChild(newRow);
    });
}


displayPatients(patients);
displayAppointments();

searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.toLowerCase();

    const filteredPatients = patients.filter(function (patient) {
        return (
            String(patient.name || "").toLowerCase().includes(searchText) ||
            String(patient.id || "").toLowerCase().includes(searchText)
        );
    });

    displayPatients(filteredPatients);
});

logoutButton.addEventListener("click", function () {
    sessionStorage.removeItem("staffLoggedIn");
    window.location.href = "staff-login.html";
});
