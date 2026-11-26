
// ==========================================
// MEDICARE CENTRAL - BILLING MANAGEMENT
// ==========================================

const STORAGE_KEY = "medicareInvoices";

let invoiceItems = [];
let editingInvoiceId = null;

const $ = (id) => document.getElementById(id);

function getInvoices() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveInvoices(invoices) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
}

function money(amount) {
    return "₹" + Number(amount || 0).toFixed(2);
}

// Generate invoice number
function generateInvoiceId() {
    return "INV-" + Date.now().toString().slice(-8);
}

// Add a service row
function addItem(name = "", quantity = 1, price = 0) {
    const item = {
        id: Date.now() + Math.random(),
        name,
        quantity,
        price
    };

    invoiceItems.push(item);
    renderItems();
}

// Display invoice items
function renderItems() {
    const tbody = $("itemsBody");
    tbody.innerHTML = "";

    invoiceItems.forEach((item, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <input class="form-control item-name"
                    value="${escapeHTML(item.name)}"
                    placeholder="Service name">
            </td>
            <td>
                <input class="form-control item-quantity"
                    type="number" min="1" value="${item.quantity}">
            </td>
            <td>
                <input class="form-control item-price"
                    type="number" min="0" step="0.01"
                    value="${item.price}">
            </td>
            <td class="item-total">${money(item.quantity * item.price)}</td>
            <td>
                <button type="button" class="btn btn-sm btn-danger remove-item">
                    Remove
                </button>
            </td>
        `;

        row.querySelector(".item-name").addEventListener("input", e => {
            item.name = e.target.value;
            calculateTotal();
        });

        row.querySelector(".item-quantity").addEventListener("input", e => {
            item.quantity = Math.max(1, Number(e.target.value) || 1);
            calculateTotal();
        });

        row.querySelector(".item-price").addEventListener("input", e => {
            item.price = Math.max(0, Number(e.target.value) || 0);
            calculateTotal();
        });

        row.querySelector(".remove-item").addEventListener("click", () => {
            invoiceItems = invoiceItems.filter(i => i.id !== item.id);
            renderItems();
        });

        tbody.appendChild(row);
    });

    calculateTotal();
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Calculate subtotal, tax, discount and grand total
function calculateTotal() {
    const subtotal = invoiceItems.reduce(
        (sum, item) => sum + item.quantity * item.price, 0
    );

    const taxPercent = Math.max(0, Number($("taxPercent").value) || 0);
    const discount = Math.max(0, Number($("discount").value) || 0);

    const tax = subtotal * taxPercent / 100;
    const total = Math.max(0, subtotal + tax - discount);

    $("subtotal").textContent = money(subtotal);
    $("taxAmount").textContent = money(tax);
    $("discountAmount").textContent = money(discount);
    $("grandTotal").textContent = money(total);

    return { subtotal, tax, discount, total };
}

// Reset form
function resetForm() {
    $("invoiceForm").reset();
    invoiceItems = [];
    editingInvoiceId = null;

    $("formTitle").textContent = "Create New Invoice";
    $("saveInvoiceBtn").textContent = "Save Invoice";
    $("invoiceNumber").value = generateInvoiceId();

    addItem();
}

// Save invoice
$("invoiceForm").addEventListener("submit", function(event) {
    event.preventDefault();

    if (!invoiceItems.length || invoiceItems.some(item => !item.name.trim())) {
        alert("Please add at least one service with a name.");
        return;
    }

    const patientName = $("patientName").value.trim();
    const patientId = $("patientId").value.trim();

    if (!patientName || !patientId) {
        alert("Please enter patient name and ID.");
        return;
    }

    const totals = calculateTotal();
    const invoices = getInvoices();

    const invoice = {
        id: editingInvoiceId || generateInvoiceId(),
        patientName,
        patientId,
        admissionDate: $("admissionDate").value,
        invoiceDate: $("invoiceDate").value,
        paymentMethod: $("paymentMethod").value,
        paymentStatus: $("paymentStatus").value,
        items: invoiceItems.map(item => ({ ...item })),
        ...totals,
        updatedAt: new Date().toISOString()
    };

    if (editingInvoiceId) {
        const index = invoices.findIndex(i => i.id === editingInvoiceId);
        if (index !== -1) invoices[index] = invoice;
    } else {
        invoices.unshift(invoice);
    }

    saveInvoices(invoices);

    alert("Invoice saved successfully!");
    resetForm();
    renderInvoices();
});

// Display saved invoices
function renderInvoices(search = "") {
    const tbody = $("savedInvoicesBody");
    tbody.innerHTML = "";

    const filtered = getInvoices().filter(invoice =>
        invoice.patientName.toLowerCase().includes(search.toLowerCase()) ||
        invoice.patientId.toLowerCase().includes(search.toLowerCase()) ||
        invoice.id.toLowerCase().includes(search.toLowerCase())
    );

    $("invoiceCount").textContent = filtered.length;

    if (!filtered.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    No invoices found.
                </td>
            </tr>`;
        return;
    }

    filtered.forEach(invoice => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(invoice.id)}</td>
            <td>${escapeHTML(invoice.patientName)}</td>
            <td>${escapeHTML(invoice.patientId)}</td>
            <td>${money(invoice.total)}</td>
            <td>${escapeHTML(invoice.paymentStatus)}</td>
            <td>${escapeHTML(invoice.invoiceDate)}</td>
            <td>
                <button class="btn btn-sm btn-success view-btn">View</button>
                <button class="btn btn-sm btn-warning edit-btn">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn">Delete</button>
            </td>
        `;

        row.querySelector(".view-btn").onclick = () => viewInvoice(invoice.id);
        row.querySelector(".edit-btn").onclick = () => editInvoice(invoice.id);
        row.querySelector(".delete-btn").onclick = () => deleteInvoice(invoice.id);

        tbody.appendChild(row);
    });
}

// View invoice
function viewInvoice(id) {
    const invoice = getInvoices().find(i => i.id === id);
    if (!invoice) return;

    $("viewInvoiceContent").innerHTML = `
        <h3>MediCare Central</h3>
        <p><strong>Invoice:</strong> ${escapeHTML(invoice.id)}</p>
        <p><strong>Patient:</strong> ${escapeHTML(invoice.patientName)}</p>
        <p><strong>Patient ID:</strong> ${escapeHTML(invoice.patientId)}</p>
        <p><strong>Date:</strong> ${escapeHTML(invoice.invoiceDate)}</p>
        <hr>
        <table class="table">
            <thead>
                <tr><th>Service</th><th>Qty</th><th>Price</th><th>Total</th></tr>
            </thead>
            <tbody>
                ${invoice.items.map(item => `
                    <tr>
                        <td>${escapeHTML(item.name)}</td>
                        <td>${item.quantity}</td>
                        <td>${money(item.price)}</td>
                        <td>${money(item.quantity * item.price)}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
        <p>Subtotal: ${money(invoice.subtotal)}</p>
        <p>Tax: ${money(invoice.tax)}</p>
        <p>Discount: ${money(invoice.discount)}</p>
        <h4>Total: ${money(invoice.total)}</h4>
        <p>Payment: ${escapeHTML(invoice.paymentStatus)}</p>
    `;

    $("invoiceDialog").showModal();
}

// Edit invoice
function editInvoice(id) {
    const invoice = getInvoices().find(i => i.id === id);
    if (!invoice) return;

    editingInvoiceId = id;

    $("patientName").value = invoice.patientName;
    $("patientId").value = invoice.patientId;
    $("admissionDate").value = invoice.admissionDate;
    $("invoiceDate").value = invoice.invoiceDate;
    $("paymentMethod").value = invoice.paymentMethod;
    $("paymentStatus").value = invoice.paymentStatus;
    $("invoiceNumber").value = invoice.id;

    $("taxPercent").value = invoice.subtotal
        ? (invoice.tax / invoice.subtotal * 100).toFixed(2)
        : 0;

    $("discount").value = invoice.discount;

    invoiceItems = invoice.items.map(item => ({ ...item }));

    $("formTitle").textContent = "Edit Invoice";
    $("saveInvoiceBtn").textContent = "Update Invoice";

    renderItems();
    $("invoiceForm").scrollIntoView({ behavior: "smooth" });
}

// Delete invoice
function deleteInvoice(id) {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    saveInvoices(getInvoices().filter(invoice => invoice.id !== id));
    renderInvoices();
}

// Close invoice dialog
$("closeInvoiceDialog").addEventListener("click", () => {
    $("invoiceDialog").close();
});

// Search invoices
$("invoiceSearch").addEventListener("input", event => {
    renderInvoices(event.target.value);
});

// Buttons
$("addItemBtn").addEventListener("click", () => addItem());
$("newInvoiceBtn").addEventListener("click", resetForm);

$("taxPercent").addEventListener("input", calculateTotal);
$("discount").addEventListener("input", calculateTotal);

// Initial setup
$("invoiceDate").value = new Date().toISOString().split("T")[0];
$("invoiceNumber").value = generateInvoiceId();

addItem();
renderInvoices();

// Print individual invoice
$("printInvoiceBtn").addEventListener("click", () => {
    const content = $("viewInvoiceContent").innerHTML;
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
        alert("Please allow pop-ups to print the invoice.");
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>MediCare Invoice</title>
            <style>
                body { font-family: Arial; padding: 30px; color: #123c38; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                h3, h4 { color: #0b4f47; }
            </style>
        </head>
        <body>${content}</body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
});
