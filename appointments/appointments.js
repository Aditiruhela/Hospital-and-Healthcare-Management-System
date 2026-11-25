
const appointmentForm = document.querySelector("form");
const appointmentTableBody = document.querySelector("tbody");

console.log("Appointments JavaScript is connected!");

appointmentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const patientName = document.getElementById("appointment-patient").value;
    const doctorName = document.getElementById("doctor").value;
    const appointmentType = document.getElementById("appointment-type").value;
    const appointmentDate = document.getElementById("appointment-date").value;
    const appointmentTime = document.getElementById("appointment-time").value;
    const reason = document.getElementById("reason").value;

    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${patientName}</td>
        <td>${doctorName}</td>
        <td>${appointmentType}</td>
        <td>${appointmentDate}</td>
        <td>${appointmentTime}</td>
        <td>Scheduled</td>
        <td>
            <button type="button" class="cancel-btn">
                Cancel
            </button>
        </td>
    `;

    appointmentTableBody.appendChild(newRow);

    appointmentForm.reset();

    console.log("Appointment scheduled successfully!");
    console.log("Reason for Visit:", reason);
});

// Cancel appointment using event delegation
appointmentTableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("cancel-btn")) {
        const row = event.target.closest("tr");

        row.cells[5].textContent = "Cancelled";

        event.target.remove();
        
        console.log("Appointment cancelled!");
    }
});
