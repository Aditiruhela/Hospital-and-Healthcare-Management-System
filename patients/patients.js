
const patientForm = document.getElementById("patient-form");
const patientTableBody = document.getElementById("patient-table-body");

console.log("JavaScript is loaded!");

console.log("Patient Form:", patientForm);
console.log("Patient Table:", patientTableBody);

patientForm.addEventListener("submit", function (event) {
    event.preventDefault();

    console.log("Register button clicked!");

    const patientId = document.getElementById("patient-id").value;
    const patientName = document.getElementById("full-name").value;
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const bloodGroup = document.getElementById("blood-group").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    console.log("Patient Details:");
    console.log(patientName, age, gender, bloodGroup, phone, email);

    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${patientId || "N/A"}</td>
        <td>${patientName}</td>
        <td>${age}</td>
        <td>${gender}</td>
        <td>${bloodGroup}</td>
        <td>${phone}</td>
        <td>${email}</td>
        <td>${new Date().toISOString().split("T")[0]}</td>
        <td>Active</td>
    `;

    patientTableBody.appendChild(newRow);

    patientForm.reset();

    console.log("Patient registered successfully!");
});