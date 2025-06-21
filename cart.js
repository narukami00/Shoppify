function loadCart() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  cartItemsContainer.innerHTML = "";

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "";
    return;
  }

  let total = 0;

  cartItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
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

    cartItemsContainer.appendChild(itemEl);
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;

  // remove buttons
  document.querySelectorAll(".remove-btn").forEach(button => {
    button.addEventListener("click", () => {
      const index = button.getAttribute("data-index");
      removeFromCart(index);
    });
  });

  // decrease buttons
  document.querySelectorAll(".decrease-btn").forEach(button => {
    button.addEventListener("click", () => {
      const index = button.getAttribute("data-index");
      changeQuantity(index, -1);
    });
  });

  // increase buttons
  document.querySelectorAll(".increase-btn").forEach(button => {
    button.addEventListener("click", () => {
      const index = button.getAttribute("data-index");
      changeQuantity(index, 1);
    });
  });
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function changeQuantity(index, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart[index]) return;

  cart[index].quantity += delta;

  if (cart[index].quantity < 1) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

document.addEventListener("DOMContentLoaded", loadCart);
