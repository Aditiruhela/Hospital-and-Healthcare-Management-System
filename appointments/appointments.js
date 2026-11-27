const appointmentForm = document.getElementById("appointment-form");

let appointments = JSON.parse(
    localStorage.getItem("appointments")
) || [];

appointmentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const appointment = {
        patientName: document.getElementById("patient-name").value,
        doctorName: document.getElementById("doctor-name").value,
        appointmentType: document.getElementById("appointment-type").value,
        appointmentDate: document.getElementById("appointment-date").value,
        appointmentTime: document.getElementById("appointment-time").value,
        reason: document.getElementById("reason").value,
        status: "Scheduled"
    };

    appointments.push(appointment);

    localStorage.setItem("appointments", JSON.stringify(appointments));

    alert("Appointment scheduled successfully!");

    appointmentForm.reset();
});