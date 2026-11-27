const patientForm = document.getElementById("patient-form");

let patients = JSON.parse(localStorage.getItem("patients")) || [];

patientForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const patient = {
        id: document.getElementById("patient-id").value || "N/A",
        name: document.getElementById("full-name").value,
        dob: document.getElementById("dob").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        bloodGroup: document.getElementById("blood-group").value,
        emergencyContact: document.getElementById("emergency-contact").value,
        lastVisit: new Date().toISOString().split("T")[0],
        status: "Active"
    };

    patients.push(patient);

    localStorage.setItem("patients", JSON.stringify(patients));

    alert("Patient registered successfully!");

    patientForm.reset();
});