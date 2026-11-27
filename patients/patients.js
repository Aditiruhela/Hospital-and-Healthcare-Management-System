
const patientForm = document.getElementById("patient-form");
const patientTableBody = document.getElementById("patient-table-body");

const defaultPatients = [
    {
        id: "P001",
        name: "Rahul Sharma",
        age: "32",
        gender: "Male",
        bloodGroup: "A+",
        phone: "9876543210",
        email: "rahul.sharma@email.com",
        lastVisit: "2023-10-15",
        status: "Active"
    },
    {
        id: "P002",
        name: "Priya Singh",
        age: "28",
        gender: "Female",
        bloodGroup: "O+",
        phone: "9876501234",
        email: "priya.singh@email.com",
        lastVisit: "2023-10-10",
        status: "Active"
    },
    {
        id: "P003",
        name: "Aman Verma",
        age: "45",
        gender: "Male",
        bloodGroup: "B+",
        phone: "9812345678",
        email: "aman.verma@email.com",
        lastVisit: "2023-10-05",
        status: "Discharged"
    },
    {
        id: "P004",
        name: "Neha Gupta",
        age: "36",
        gender: "Female",
        bloodGroup: "AB+",
        phone: "9898989898",
        email: "neha.gupta@email.com",
        lastVisit: "2023-10-12",
        status: "Active"
    }
];

// Get saved patients from localStorage
let patients = JSON.parse(localStorage.getItem("patients")) || [];

// Add original patients if they are missing
defaultPatients.forEach(function (defaultPatient) {
    const exists = patients.some(function (patient) {
        return patient.id === defaultPatient.id;
    });

    if (!exists) {
        patients.unshift(defaultPatient);
    }
});

localStorage.setItem("patients", JSON.stringify(patients));

function displayPatients() {
    patientTableBody.innerHTML = "";

    patients.forEach(function (patient) {
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.gender}</td>
            <td>${patient.bloodGroup}</td>
            <td>${patient.phone}</td>
            <td>${patient.email}</td>
            <td>${patient.lastVisit}</td>
            <td>${patient.status}</td>
        `;

        patientTableBody.appendChild(newRow);
    });
}

displayPatients();

patientForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const patient = {
        id: document.getElementById("patient-id").value || "N/A",
        name: document.getElementById("full-name").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        bloodGroup: document.getElementById("blood-group").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        lastVisit: new Date().toISOString().split("T")[0],
        status: "Active"
    };

    patients.push(patient);

    localStorage.setItem("patients", JSON.stringify(patients));

    displayPatients();

    patientForm.reset();

    console.log("Patient registered successfully!");
});
