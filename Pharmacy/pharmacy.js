
try {
    const medicineCards = document.querySelectorAll(".medicine-card");

    const medicineDialog = document.getElementById("medicineDialog");

    const closeButton = document.getElementById("closeMedicineDialog");

    if (!medicineCards.length || !medicineDialog || !closeButton) {
        throw new Error("Required pharmacy elements not found.");
    }

    medicineCards.forEach(function (card) {

        const viewButton = card.querySelector(".medicine-button");

        viewButton.addEventListener("click", function () {

            try {
                const name = card.querySelector("h3").textContent.trim();

                const category = card.querySelector(".medicine-category").textContent.trim();

                const description = card.querySelector("p").textContent.trim();

                const price = card.querySelector(".medicine-info strong").textContent.trim();

                document.getElementById("dialogMedicineName").textContent = name;

                document.getElementById("dialogMedicineCategory").textContent =
                    "Category: " + category;

                document.getElementById("dialogMedicineDescription").textContent =
                    description;

                document.getElementById("dialogMedicinePrice").textContent =
                    "Price: " + price;

                medicineDialog.showModal();

            } catch (error) {
                console.error("Medicine Details Error:", error);
                alert("Unable to display medicine details.");
            }

        });

    });

    closeButton.addEventListener("click", function () {
        try {
            medicineDialog.close();
        } catch (error) {
            console.error("Popup Close Error:", error);
        }
    });

} catch (error) {
    console.error("Pharmacy Page Error:", error);
}

// ================= SHOPPING CART =================

try {

    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const clearCartButton = document.getElementById("clearCart");

    if (!cartItemsContainer || !cartTotal || !clearCartButton) {
        throw new Error("Cart elements not found.");
    }

    // Load cart from localStorage
    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem("pharmacyCart")) || [];

        if (!Array.isArray(cart)) {
            cart = [];
        }

    } catch (error) {
        console.error("Cart Loading Error:", error);
        cart = [];
    }

    // Save cart
    function saveCart() {
        try {
            localStorage.setItem("pharmacyCart", JSON.stringify(cart));
        } catch (error) {
            console.error("Cart Saving Error:", error);
            alert("Unable to save cart.");
        }
    }

    // Display cart
    function displayCart() {
        try {

            if (cart.length === 0) {
                cartItemsContainer.textContent = "Your cart is empty.";
                cartTotal.textContent = "₹0";
                return;
            }

            cartItemsContainer.innerHTML = cart.map(function (item) {

                const safeName = item.name.replace(/[&<>"']/g, function (char) {
                    return {
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#39;"
                    }[char];
                });

                return `
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">

                        <div>
                            <strong>${safeName}</strong>
                            <p>₹${item.price} × ${item.quantity}</p>
                        </div>

                        <div>
                            <button type="button" data-action="decrease" data-name="${safeName}">-</button>

                            <span>${item.quantity}</span>

                            <button type="button" data-action="increase" data-name="${safeName}">+</button>

                            <button type="button" data-action="remove" data-name="${safeName}">Remove</button>
                        </div>

                    </div>
                `;

            }).join("");

            const total = cart.reduce(function (sum, item) {
                return sum + item.price * item.quantity;
            }, 0);

            cartTotal.textContent = "₹" + total;

        } catch (error) {
            console.error("Cart Display Error:", error);
        }
    }

    // Add buttons to medicine cards
    document.querySelectorAll(".medicine-card").forEach(function (card) {

        try {

            const viewButton = card.querySelector(".medicine-button");

            if (!viewButton || card.querySelector(".add-cart-button")) {
                return;
            }

            const addButton = document.createElement("button");

            addButton.type = "button";
            addButton.textContent = "Add to Cart";
            addButton.className = "medicine-button add-cart-button";

            viewButton.insertAdjacentElement("afterend", addButton);

            addButton.addEventListener("click", function () {

                try {

                    const name = card.querySelector("h3").textContent.trim();

                    const priceText = card.querySelector(".medicine-info strong").textContent;

                    const price = Number(priceText.replace(/[^\d.]/g, ""));

                    if (!name || !Number.isFinite(price) || price <= 0) {
                        throw new Error("Invalid medicine information.");
                    }

                    const existingItem = cart.find(function (item) {
                        return item.name === name;
                    });

                    if (existingItem) {
                        existingItem.quantity++;
                    } else {
                        cart.push({
                            name: name,
                            price: price,
                            quantity: 1
                        });
                    }

                    saveCart();
                    displayCart();

                    alert(name + " added to cart!");

                } catch (error) {
                    console.error("Add to Cart Error:", error);
                    alert(error.message);
                }

            });

        } catch (error) {
            console.error("Medicine Button Error:", error);
        }

    });

    // Handle quantity and remove buttons
    cartItemsContainer.addEventListener("click", function (event) {

        try {

            const button = event.target.closest("button[data-action]");

            if (!button) return;

            const action = button.dataset.action;
            const name = button.dataset.name;

            const item = cart.find(function (product) {
                return product.name === name;
            });

            if (!item) return;

            if (action === "increase") {
                item.quantity++;
            }

            if (action === "decrease") {
                item.quantity--;

                if (item.quantity <= 0) {
                    cart = cart.filter(function (product) {
                        return product.name !== name;
                    });
                }
            }

            if (action === "remove") {
                cart = cart.filter(function (product) {
                    return product.name !== name;
                });
            }

            saveCart();
            displayCart();

        } catch (error) {
            console.error("Cart Update Error:", error);
        }

    });

    // Clear complete cart
    clearCartButton.addEventListener("click", function () {

        try {

            cart = [];

            saveCart();
            displayCart();

        } catch (error) {
            console.error("Clear Cart Error:", error);
        }

    });

    // Initial display
    displayCart();

} catch (error) {
    console.error("Shopping Cart Error:", error);
}

// ================= MEDICINE SEARCH AND CATEGORY FILTER =================

try {
    const searchInput = document.getElementById("medicineSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const noMedicinesFound = document.getElementById("noMedicinesFound");

    const medicineCards = document.querySelectorAll(".medicine-card");

    if (!searchInput || !categoryFilter || !noMedicinesFound) {
        throw new Error("Search elements not found.");
    }

    function filterMedicines() {
        try {
            const searchValue = searchInput.value.toLowerCase().trim();
            const selectedCategory = categoryFilter.value;

            let visibleCount = 0;

            medicineCards.forEach(function (card) {

                const medicineName = card.querySelector("h3")
                    .textContent.toLowerCase().trim();

                const category = card.querySelector(".medicine-category")
                    .textContent.trim();

                const matchesName = medicineName.includes(searchValue);

                const matchesCategory =
                    selectedCategory === "all" ||
                    category === selectedCategory;

                const shouldDisplay = matchesName && matchesCategory;

                card.parentElement.style.display =
                    shouldDisplay ? "" : "none";

                if (shouldDisplay) {
                    visibleCount++;
                }
            });

            noMedicinesFound.style.display =
                visibleCount === 0 ? "block" : "none";

        } catch (error) {
            console.error("Medicine Filter Error:", error);
        }
    }

    searchInput.addEventListener("input", filterMedicines);

    categoryFilter.addEventListener("change", filterMedicines);

} catch (error) {
    console.error("Search and Filter Error:", error);
}
