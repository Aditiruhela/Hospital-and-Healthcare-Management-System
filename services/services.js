
const serviceDetails = {
    emergency: {
        title: "Emergency Care",
        description: "Our emergency care team provides immediate medical attention, emergency diagnosis and support for patients in critical situations."
    },
    laboratory: {
        title: "Laboratory",
        description: "Our laboratory offers diagnostic testing and medical investigations to help healthcare professionals make accurate treatment decisions."
    },
    icu: {
        title: "Intensive Care",
        description: "Our Intensive Care Unit provides continuous monitoring and specialized medical support for patients who need critical care."
    },
    ambulance: {
        title: "Ambulance Services",
        description: "Our ambulance service provides emergency patient transportation and timely assistance when urgent medical attention is required."
    },
    blood: {
        title: "Blood Bank",
        description: "Our blood bank supports patients by maintaining safe blood storage and availability for routine and emergency requirements."
    },
    surgery: {
        title: "Surgical Care",
        description: "Our surgical care facilities support a range of surgical procedures with experienced healthcare professionals and patient-focused care."
    }
};

const serviceDialog = document.getElementById("serviceDialog");
const dialogTitle = document.getElementById("dialogServiceTitle");
const dialogDescription = document.getElementById("dialogServiceDescription");
const closeButton = document.getElementById("closeServiceDialog");

document.querySelectorAll(".service-link").forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        const service = serviceDetails[this.dataset.service];

        if (service) {
            dialogTitle.textContent = service.title;
            dialogDescription.textContent = service.description;
            serviceDialog.showModal();
        }
    });
});

closeButton.addEventListener("click", () => {
    serviceDialog.close();
});

serviceDialog.addEventListener("click", event => {
    if (event.target === serviceDialog) {
        serviceDialog.close();
    }
});
