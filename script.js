// Product designs shown in the catalogue.
// Change the details here when you want to add or edit a design.
var designs = [
  {
    id: 1,
    name: "Sweetheart Neck",
    category: "Blouses",
    tag: "NECKLINE DETAIL",
    price: 1800,
    desc: "A richly embroidered sweetheart neckline.",
    image: "assets/design-01.jpg"
  },
  {
    id: 2,
    name: "Boat Neck",
    category: "Blouses",
    tag: "CLASSIC NECKLINE",
    price: 1600,
    desc: "An elegant boat neckline with delicate gold work.",
    image: "assets/design-02.jpg"
  },
  {
    id: 3,
    name: "Deep Back",
    category: "Blouses",
    tag: "STATEMENT BACK",
    price: 1900,
    desc: "A deep-back blouse design with tie detailing.",
    image: "assets/design-03.jpg"
  },
  {
    id: 4,
    name: "Puff Sleeves",
    category: "Blouses",
    tag: "SLEEVE DETAIL",
    price: 1200,
    desc: "Soft puff sleeves with embroidered cuffs.",
    image: "assets/design-04.jpg"
  },
  {
    id: 5,
    name: "Bell Sleeves",
    category: "Blouses",
    tag: "SLEEVE DETAIL",
    price: 1400,
    desc: "Flowing bell sleeves with fine gold motifs.",
    image: "assets/design-05.jpg"
  },
  {
    id: 6,
    name: "Elbow Length Sleeves",
    category: "Blouses",
    tag: "CLASSIC FINISH",
    price: 1300,
    desc: "Elbow-length sleeves with ornamental embroidery.",
    image: "assets/design-06.jpg"
  },
  {
    id: 7,
    name: "Zari Border",
    category: "Sarees",
    tag: "BORDER DETAIL",
    price: 2400,
    desc: "A traditional zari border for a rich finish.",
    image: "assets/design-07.jpg"
  },
  {
    id: 8,
    name: "Scalloped Border",
    category: "Sarees",
    tag: "BORDER DETAIL",
    price: 2600,
    desc: "A scalloped embroidered border with fine detailing.",
    image: "assets/design-08.jpg"
  },
  {
    id: 9,
    name: "Gota Patti Border",
    category: "Sarees",
    tag: "BORDER DETAIL",
    price: 2800,
    desc: "A decorative gota patti border with reflective accents.",
    image: "assets/design-09.jpg"
  }
];

// Keep track of the selected category and saved items.
var filter = "All";
var cart = JSON.parse(localStorage.getItem("aaryaCartV3") || "[]");
var saved = JSON.parse(localStorage.getItem("aaryaSavedV3") || "[]");
var recent = JSON.parse(localStorage.getItem("aaryaRecentV3") || "[]");

var grid = document.getElementById("productGrid");
var toast = document.getElementById("toast");
var toastTimer;

// Turn a number into a price with the rupee symbol.
function money(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

// Show a temporary message at the bottom of the page.
function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2200);
}

// Save cart and favourite designs in this browser.
// Then update the numbers and shopping bag.
function persist() {
  localStorage.setItem("aaryaCartV3", JSON.stringify(cart));
  localStorage.setItem("aaryaSavedV3", JSON.stringify(saved));

  var cartCount = 0;
  for (var i = 0; i < cart.length; i++) {
    cartCount = cartCount + cart[i].qty;
  }

  document.getElementById("cartCount").textContent = cartCount;
  document.getElementById("wishCount").textContent = saved.length;

  renderCart();
}

// Show the designs that match the search and selected category.
function renderProducts() {
  var searchText = document.getElementById("search").value.trim().toLowerCase();
  var sortType = document.getElementById("sort").value;
  var productList = [];

  for (var i = 0; i < designs.length; i++) {
    var design = designs[i];
    var matchesCategory = filter === "All" || design.category === filter;
    var searchDetails = (design.name + " " + design.category + " " + design.desc).toLowerCase();
    var matchesSearch = searchDetails.indexOf(searchText) !== -1;

    if (matchesCategory && matchesSearch) {
      productList.push(design);
    }
  }

  // Sort the designs by price or name.
  if (sortType === "low") {
    productList.sort(function (a, b) {
      return a.price - b.price;
    });
  }

  if (sortType === "high") {
    productList.sort(function (a, b) {
      return b.price - a.price;
    });
  }

  if (sortType === "az") {
    productList.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  if (productList.length === 0) {
    grid.innerHTML = '<div class="empty">No designs found. Try another search or category.</div>';
    return;
  }

  var productHTML = "";

  for (var j = 0; j < productList.length; j++) {
    var item = productList[j];
    var saveText = "♡ Save design";

    if (saved.indexOf(item.id) !== -1) {
      saveText = "♥ Saved";
    }

    productHTML +=
      '<article class="product-card">' +
        '<div class="product-image">' +
          '<img src="' + item.image + '" alt="' + item.name + ', garment-only illustration" loading="lazy">' +
          '<span class="product-tag">' + item.tag + '</span>' +
        '</div>' +
        '<div class="product-info">' +
          '<small>' + item.category.toUpperCase() + '</small>' +
          '<h3>' + item.name + '</h3>' +
          '<p>' + item.desc + '</p>' +
          '<div class="price-row">' +
            '<span class="price">' + money(item.price) + '</span>' +
            '<button class="add-cart" data-add="' + item.id + '">＋ Add to bag</button>' +
          '</div>' +
          '<button class="feature-link save-design" data-save="' + item.id + '">' + saveText + '</button>' +
        '</div>' +
      '</article>';
  }

  grid.innerHTML = productHTML;
}

// Update the shopping bag and show its total.
function renderCart() {
  var cartBox = document.getElementById("cartItems");

  if (!cartBox) {
    return;
  }

  if (cart.length === 0) {
    cartBox.innerHTML = '<p class="muted">Your bag is empty. Browse the catalogue to add a design.</p>';
    document.getElementById("cartTotal").textContent = "₹0";
    return;
  }

  var cartHTML = "";
  var total = 0;

  for (var i = 0; i < cart.length; i++) {
    var cartItem = cart[i];
    var design = null;

    for (var j = 0; j < designs.length; j++) {
      if (designs[j].id === cartItem.id) {
        design = designs[j];
        break;
      }
    }

    if (design) {
      var itemTotal = design.price * cartItem.qty;
      total = total + itemTotal;

      cartHTML +=
        '<div class="cart-line">' +
          '<img src="' + design.image + '" alt="' + design.name + '">' +
          '<div>' +
            '<strong>' + design.name + '</strong>' +
            '<small>' + money(design.price) + ' each</small>' +
            '<div class="quantity">' +
              '<button data-qty="-1" data-id="' + design.id + '">−</button>' +
              '<span>' + cartItem.qty + '</span>' +
              '<button data-qty="1" data-id="' + design.id + '">+</button>' +
              '<button class="remove-item" data-remove="' + design.id + '">Remove</button>' +
            '</div>' +
          '</div>' +
          '<span class="line-price">' + money(itemTotal) + '</span>' +
        '</div>';
    }
  }

  cartBox.innerHTML = cartHTML;
  document.getElementById("cartTotal").textContent = money(total);
}

// Handle clicks on product cards.
grid.addEventListener("click", function (event) {
  var addButton = event.target.closest("[data-add]");
  var saveButton = event.target.closest("[data-save]");

  // Add a design to the shopping bag.
  if (addButton) {
    var id = Number(addButton.dataset.add);
    var foundItem = null;

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        foundItem = cart[i];
        break;
      }
    }

    if (foundItem) {
      foundItem.qty = foundItem.qty + 1;
    } else {
      cart.push({ id: id, qty: 1 });
    }

    persist();
    notify("Added to your bag");
  }

  // Save or remove a favourite design.
  if (saveButton) {
    var savedId = Number(saveButton.dataset.save);
    var savedIndex = saved.indexOf(savedId);

    if (savedIndex !== -1) {
      saved.splice(savedIndex, 1);
    } else {
      saved.push(savedId);
    }

    persist();
    renderProducts();

    if (saved.indexOf(savedId) !== -1) {
      notify("Design saved");
    } else {
      notify("Removed from saved designs");
    }
  }

  // Add the design to recently viewed items.
  var card = event.target.closest(".product-card");

  if (card) {
    var title = card.querySelector("h3").textContent;
    var viewedDesign = null;

    for (var j = 0; j < designs.length; j++) {
      if (designs[j].name === title) {
        viewedDesign = designs[j];
        break;
      }
    }

    if (viewedDesign) {
      var updatedRecent = [viewedDesign.id];

      for (var k = 0; k < recent.length; k++) {
        if (recent[k] !== viewedDesign.id) {
          updatedRecent.push(recent[k]);
        }
      }

      recent = updatedRecent.slice(0, 5);
      localStorage.setItem("aaryaRecentV3", JSON.stringify(recent));
    }
  }
});

// Change the selected category.
document.getElementById("filters").addEventListener("click", function (event) {
  var button = event.target.closest("[data-filter]");

  if (!button) {
    return;
  }

  filter = button.dataset.filter;

  var filterButtons = document.querySelectorAll(".filter");

  for (var i = 0; i < filterButtons.length; i++) {
    filterButtons[i].classList.toggle("active", filterButtons[i] === button);
  }

  renderProducts();
});

// Update the catalogue when the user searches or changes the sorting option.
document.getElementById("search").addEventListener("input", renderProducts);
document.getElementById("sort").addEventListener("change", renderProducts);

// Open the catalogue with the matching category when a category link is clicked.
var categoryLinks = document.querySelectorAll("[data-category]");

for (var i = 0; i < categoryLinks.length; i++) {
  categoryLinks[i].addEventListener("click", function () {
    filter = this.dataset.category;

    var filterButtons = document.querySelectorAll(".filter");

    for (var j = 0; j < filterButtons.length; j++) {
      filterButtons[j].classList.toggle(
        "active",
        filterButtons[j].dataset.filter === filter
      );
    }

    renderProducts();
  });
}

// Get the shopping bag and pop-up elements.
var drawer = document.getElementById("cartDrawer");
var backdrop = document.getElementById("backdrop");
var modal = document.getElementById("modal");

// Open the shopping bag.
function openCart() {
  drawer.classList.add("open");
  backdrop.classList.add("open");
}

// Close the shopping bag.
function closeCart() {
  drawer.classList.remove("open");
  backdrop.classList.remove("open");
}

// Show content inside the pop-up window.
function showModal(content) {
  document.getElementById("modalContent").innerHTML = content;
  modal.classList.add("open");
}

// Close the pop-up window.
function closeModal() {
  modal.classList.remove("open");
}

document.getElementById("cartOpen").addEventListener("click", openCart);

var cartCloseButtons = document.querySelectorAll('[data-close="cart"]');

for (var i = 0; i < cartCloseButtons.length; i++) {
  cartCloseButtons[i].addEventListener("click", closeCart);
}

backdrop.addEventListener("click", closeCart);

document.querySelector('[data-close="modal"]').addEventListener("click", closeModal);

modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal();
  }
});

// Change item quantities or remove items from the shopping bag.
document.getElementById("cartItems").addEventListener("click", function (event) {
  var quantityButton = event.target.closest("[data-qty]");
  var removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    var itemId = Number(quantityButton.dataset.id);
    var change = Number(quantityButton.dataset.qty);

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === itemId) {
        cart[i].qty = cart[i].qty + change;

        if (cart[i].qty < 1) {
          cart.splice(i, 1);
        }

        break;
      }
    }

    persist();
  }

  if (removeButton) {
    var removeId = Number(removeButton.dataset.remove);

    for (var j = 0; j < cart.length; j++) {
      if (cart[j].id === removeId) {
        cart.splice(j, 1);
        break;
      }
    }

    persist();
  }
});

// Move the shopping bag details into the consultation form.
document.getElementById("checkoutBtn").addEventListener("click", function () {
  if (cart.length === 0) {
    notify("Your bag is empty");
    return;
  }

  var details = "";

  for (var i = 0; i < cart.length; i++) {
    var cartItem = cart[i];
    var design = null;

    for (var j = 0; j < designs.length; j++) {
      if (designs[j].id === cartItem.id) {
        design = designs[j];
        break;
      }
    }

    if (design) {
      details += design.name + " × " + cartItem.qty + " — " +
        money(design.price * cartItem.qty) + "\n";
    }
  }

  document.querySelector('#bookingForm [name="details"]').value =
    "Bag enquiry:\n" + details +
    "Subtotal: " + document.getElementById("cartTotal").textContent;

  document.querySelector('#bookingForm [name="service"]').value =
    "Design consultation";

  closeCart();
  document.getElementById("appointment").scrollIntoView({ behavior: "smooth" });
  notify("Bag added to consultation form");
});

// Switch between light mode and dark mode.
document.getElementById("themeToggle").addEventListener("click", function () {
  document.body.classList.toggle("dark");

  var darkMode = document.body.classList.contains("dark");

  if (darkMode) {
    localStorage.setItem("aaryaTheme", "dark");
    document.getElementById("themeToggle").innerHTML = "☀ <span>Light mode</span>";
  } else {
    localStorage.setItem("aaryaTheme", "light");
    document.getElementById("themeToggle").innerHTML = "☾ <span>Dark mode</span>";
  }
});

// Check the saved theme when the page opens.
if (localStorage.getItem("aaryaTheme") === "dark") {
  document.body.classList.add("dark");
  document.getElementById("themeToggle").innerHTML = "☀ <span>Light mode</span>";
}

// Show the designs saved by the user.
document.getElementById("wishlistOpen").addEventListener("click", function () {
  var savedDesigns = [];

  for (var i = 0; i < designs.length; i++) {
    if (saved.indexOf(designs[i].id) !== -1) {
      savedDesigns.push(designs[i]);
    }
  }

  var content =
    '<p class="eyebrow dark">YOUR SAVED EDIT</p>' +
    '<h2>Designs you love.</h2>';

  if (savedDesigns.length > 0) {
    for (var j = 0; j < savedDesigns.length; j++) {
      var design = savedDesigns[j];

      content +=
        '<div class="saved-row">' +
          '<img src="' + design.image + '" alt="">' +
          '<div><strong>' + design.name + '</strong><small>' + money(design.price) + '</small></div>' +
          '<button data-unsave="' + design.id + '">Remove</button>' +
        '</div>';
    }
  } else {
    content += '<p class="muted">No saved designs yet. Use “Save design” in the catalogue.</p>';
  }

  showModal(content);
});

// Remove a design from the saved list.
document.getElementById("modalContent").addEventListener("click", function (event) {
  var button = event.target.closest("[data-unsave]");

  if (button) {
    var id = Number(button.dataset.unsave);
    var index = saved.indexOf(id);

    if (index !== -1) {
      saved.splice(index, 1);
    }

    persist();
    renderProducts();
    document.getElementById("wishlistOpen").click();
  }
});

// Show the measurement checklist.
document.getElementById("measureOpen").addEventListener("click", function () {
  var measurements = [
    "Bust / chest",
    "Waist",
    "Hip",
    "Shoulder width",
    "Sleeve length",
    "Blouse length",
    "Preferred outfit length",
    "Existing outfit or reference design"
  ];

  var checklistHTML = "";

  for (var i = 0; i < measurements.length; i++) {
    checklistHTML +=
      '<label><input type="checkbox"> ' + measurements[i] + '</label>';
  }

  showModal(
    '<p class="eyebrow dark">FITTING PREPARATION</p>' +
    '<h2>Measurement checklist</h2>' +
    '<p class="muted">Tick off what you have ready for your appointment.</p>' +
    '<div class="check-list">' + checklistHTML + '</div>' +
    '<button class="gold-btn full" id="saveMeasures">Save checklist on this device</button>'
  );
});

// Show the budget planner.
document.getElementById("budgetOpen").addEventListener("click", function () {
  showModal(
    '<p class="eyebrow dark">OUTFIT PLANNER</p>' +
    '<h2>Plan your budget</h2>' +
    '<p class="muted">Choose an outfit type and a budget to see suitable sample designs.</p>' +
    '<label>Outfit type' +
      '<select id="budgetType">' +
        '<option>All</option>' +
        '<option>Sarees</option>' +
        '<option>Bridal</option>' +
        '<option>Blouses</option>' +
        '<option>Suits</option>' +
      '</select>' +
    '</label>' +
    '<label>Maximum budget (₹)' +
      '<input id="budgetAmount" type="number" min="0" value="10000">' +
    '</label>' +
    '<button class="gold-btn full" id="runBudget">Find designs in my budget</button>' +
    '<div id="budgetResults"></div>'
  );
});

// Show the recently viewed designs.
document.getElementById("recentOpen").addEventListener("click", function () {
  var recentDesigns = [];

  for (var i = 0; i < recent.length; i++) {
    for (var j = 0; j < designs.length; j++) {
      if (designs[j].id === recent[i]) {
        recentDesigns.push(designs[j]);
        break;
      }
    }
  }

  var content =
    '<p class="eyebrow dark">YOUR BROWSING HISTORY</p>' +
    '<h2>Recently viewed</h2>';

  if (recentDesigns.length > 0) {
    for (var k = 0; k < recentDesigns.length; k++) {
      var design = recentDesigns[k];

      content +=
        '<div class="recent-row">' +
          '<img src="' + design.image + '" alt="">' +
          '<div><strong>' + design.name + '</strong><small>' + money(design.price) + '</small></div>' +
        '</div>';
    }
  } else {
    content += '<p class="muted">Browse a design to have it appear here.</p>';
  }

  showModal(content);
});

// Handle the budget planner and measurement checklist buttons.
document.getElementById("modalContent").addEventListener("click", function (event) {
  if (event.target.id === "runBudget") {
    var type = document.getElementById("budgetType").value;
    var amount = Number(document.getElementById("budgetAmount").value) || 0;
    var matchingDesigns = [];

    for (var i = 0; i < designs.length; i++) {
      var matchesType = type === "All" || designs[i].category === type;
      var matchesPrice = designs[i].price <= amount;

      if (matchesType && matchesPrice) {
        matchingDesigns.push(designs[i]);
      }
    }

    var results = "";

    if (matchingDesigns.length > 0) {
      results = '<p class="muted">Matching designs:</p>';

      for (var j = 0; j < matchingDesigns.length; j++) {
        results += '<p>' + matchingDesigns[j].name + ' · <b>' +
          money(matchingDesigns[j].price) + '</b></p>';
      }
    } else {
      results = '<p class="muted">No sample designs match this budget. Try adjusting the amount or category.</p>';
    }

    document.getElementById("budgetResults").innerHTML = results;
  }

  if (event.target.id === "saveMeasures") {
    var checkboxes = document.querySelectorAll(".check-list input");
    var checkedItems = [];

    for (var k = 0; k < checkboxes.length; k++) {
      if (checkboxes[k].checked) {
        checkedItems.push(k);
      }
    }

    localStorage.setItem("aaryaMeasureChecklist", JSON.stringify(checkedItems));
    notify("Checklist saved on this device");
    closeModal();
  }
});

// Save the appointment request in this browser for this demo.
document.getElementById("bookingForm").addEventListener("submit", function (event) {
  event.preventDefault();

  if (!event.currentTarget.reportValidity()) {
    return;
  }

  var formData = new FormData(event.currentTarget);
  var request = {};

  formData.forEach(function (value, key) {
    request[key] = value;
  });

  request.createdAt = new Date().toISOString();

  var allRequests = JSON.parse(localStorage.getItem("aaryaRequestsV3") || "[]");
  allRequests.push(request);

  localStorage.setItem("aaryaRequestsV3", JSON.stringify(allRequests));

  document.getElementById("formMessage").textContent =
    "Request saved in this browser only. It has not been sent to the studio.";

  event.currentTarget.reset();
  notify("Request saved on this device");
});

// Show or hide the mobile navigation menu.
document.getElementById("menuToggle").addEventListener("click", function () {
  document.getElementById("nav").classList.toggle("show");
});

// Close open windows when the Escape key is pressed.
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeCart();
    closeModal();
  }
});

// Update the shopping bag and show the products when the page first opens.
persist();
renderProducts();
