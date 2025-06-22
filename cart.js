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

    cartItemsContainer.appendChild(itemEl);
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;

  // Attach events
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.index));
  });
  document.querySelectorAll(".decrease-btn").forEach(btn => {
    btn.addEventListener("click", () => changeQuantity(btn.dataset.index, -1));
  });
  document.querySelectorAll(".increase-btn").forEach(btn => {
    btn.addEventListener("click", () => changeQuantity(btn.dataset.index, 1));
  });
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
  updateHeaderCounts();
}

function changeQuantity(index, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart[index]) return;
  cart[index].quantity += delta;
  if (cart[index].quantity < 1) cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
  updateHeaderCounts();
}

document.addEventListener("DOMContentLoaded", loadCart);
