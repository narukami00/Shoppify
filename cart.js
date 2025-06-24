// Load the cart from Local Storage
function loadCart() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  cartItemsContainer.innerHTML = "";

  // If empty cart then show a message and return
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "";
    return;
  }

  let total = 0;

  // For each of the cart items
  cartItems.forEach((item, index) => {
    // Update the total price
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    // Create a div for each with className 'cart-item'
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <a href="product.html?id=${item.id}" class="cart-image-link">
        <img src="${item.image}" alt="${item.name}" />
      </a>
      <div class="cart-info">
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)}</p>
        <div class="quantity-controls">
          <button class="decrease-btn" data-index="${index}">➖</button>
          <span class="quantity">${item.quantity}</span>
          <button class="increase-btn" data-index="${index}">➕</button>
        </div>
      </div>
      <div>$${itemTotal.toFixed(2)}</div>
      <button class="remove-btn" data-index="${index}">❌</button>
    `;

    //append the item to the cart-items container
    cartItemsContainer.appendChild(itemEl);
  });


  // Show total price
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;

  // Event for Remove from cart button
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.index));
  });

  // Event for Decrease quantity button
  document.querySelectorAll(".decrease-btn").forEach(btn => {
    btn.addEventListener("click", () => changeQuantity(btn.dataset.index, -1));
  });

  // Event for Increase quantity button
  document.querySelectorAll(".increase-btn").forEach(btn => {
    btn.addEventListener("click", () => changeQuantity(btn.dataset.index, 1));
  });
}


// Function to remove item from cart (splice the index, update local storage, load the cart again)
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// Function to change quantity of cart items (based on the delta, update the quantity of that index, update local storage, load the cart again)
function changeQuantity(index, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart[index]) return;
  cart[index].quantity += delta;
  // If quantity less than 1, remove that item
  if (cart[index].quantity < 1) cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// Call the loadCart function when page's DOM is loaded
document.addEventListener("DOMContentLoaded", loadCart);
