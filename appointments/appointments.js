
const appointmentForm = document.querySelector("form");

const defaultAppointments = [
    {
        patientName: "Rahul Sharma",
        doctorName: "Dr. Amit Verma",
        appointmentType: "Consultation",
        appointmentDate: "2026-09-20",
        appointmentTime: "10:00",
        reason: "General consultation",
        status: "Confirmed"
    },
    {
        patientName: "Priya Singh",
        doctorName: "Dr. Neha Kapoor",
        appointmentType: "Follow-up",
        appointmentDate: "2026-09-21",
        appointmentTime: "11:30",
        reason: "Follow-up visit",
        status: "Pending"
    }
];

let appointments = JSON.parse(
    localStorage.getItem("appointments")
) || [];

if (localStorage.getItem("appointments") === null) {
    appointments = defaultAppointments;
    localStorage.setItem("appointments", JSON.stringify(appointments));
}

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

    console.log("Appointment scheduled successfully!");
});
