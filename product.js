function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

document.addEventListener("DOMContentLoaded", () => {
  const productId = getQueryParam("id");
  if (!productId) return;

  fetch("products/products.json")
    .then((res) => res.json())
    .then((products) => {
      const product = products.find(p => p.id === parseInt(productId));
      if (!product) return;

      renderProductDetail(product);
      renderSimilarProducts(products, product.category, product.id);
    });
});

function renderProductDetail(product) {
  const container = document.getElementById("product-detail");

  // Build color <option>s dynamically
  const colorOptions = product.colors
    .map(color => `<option value="${color.toLowerCase()}">${color}</option>`)
    .join("");

  container.innerHTML = `
    <button class="back-btn">← Back to Home</button>

    <div class="product-detail-wrapper">
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="product-info-container">
        <h1>${product.name}</h1>
        <p class="brand">Brand: Shoppify</p>
        <p class="sku">SKU: #${product.id.toString().padStart(5, '0')}</p>
        <div class="stars">${"★".repeat(product.rating)}${"☆".repeat(5 - product.rating)}</div>
        <p class="price">$${product.price.toFixed(2)}</p>

        <div class="selectors">
          <div class="selector">
            <label for="color-select">Color:</label>
            <select id="color-select">
              ${colorOptions}
            </select>
          </div>
          <div class="selector">
            <label for="qty-select">Quantity:</label>
            <input id="qty-select" type="number" value="1" min="1" max="${product.stock}" />
          </div>
        </div>

        <p class="stock">${product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}</p>
        <p class="shipping">🚚 ${product.shipping}</p>
      </div>
      <div class="product-action-container">
        <button id="add-to-cart"${product.stock === 0 ? " disabled" : ""}>
          ${product.stock === 0 ? "Unavailable" : "Add to Cart"}
        </button>
        <button class="buy-now"${product.stock === 0 ? " disabled" : ""}>
          Buy Now
        </button>
        <button class="wishlist-btn">♡ Add to Wishlist</button>
      </div>
    </div>

    <div class="extra-info">
      <h2>Description</h2>
      <p>${product.description}</p>

      <h2>Reviews</h2>
      <p>No reviews yet.</p>

      <h2>Similar Products</h2>
      <div id="similar-products" class="similar-products"></div>
    </div>
  `;

  document.querySelector('.wishlist-btn').addEventListener('click', () => {
    let list = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!list.find(p => p.id === product.id)) {
        list.push(product);
        localStorage.setItem('wishlist', JSON.stringify(list));
        alert('Added to wishlist!');
    } else alert('Already in wishlist');
    });

  // Back to Home
  document.querySelector('.back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // Add to Cart
  const addBtn = document.getElementById("add-to-cart");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const qty = parseInt(document.getElementById("qty-select").value);
      const selectedColor = document.getElementById("color-select").value;
      addToCart({ 
        ...product, 
        quantity: qty,
        selectedColor 
      });
    });
  }
}

function renderSimilarProducts(allProducts, category, excludeId) {
  const similarContainer = document.getElementById("similar-products");
  const similar = allProducts.filter(
    p => p.category === category && p.id !== parseInt(excludeId)
  );

  similar.forEach((product) => {
    const div = document.createElement("div");
    div.className = "productBox";
    div.style.cursor = "pointer";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <p>${product.name}</p>
      <a href="product.html?id=${product.id}">$${product.price}</a>
    `;
    div.addEventListener("click", () => {
      window.location.href = `product.html?id=${product.id}`;
    });
    similarContainer.appendChild(div);
  });
}


function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.name} added to cart!`);
}
