// Helper function to get the ID of the product from the URL
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// When the page's DOM is ready, get the ID of the product to be rendered
document.addEventListener("DOMContentLoaded", () => {
  const productId = getQueryParam("id");
  if (!productId) return;

  // Fetch it's information from products.json and store in product
  fetch("products/products.json")
    .then((res) => res.json())
    .then((products) => {
      const product = products.find(p => p.id === parseInt(productId));
      if (!product) return;

      // Show the details of the products and show similar products based on product catagory
      renderProductDetail(product);
      renderSimilarProducts(products, product.category, product.id);
    });
});

// Function to Display Product Details
function renderProductDetail(product) {
  const container = document.getElementById("product-detail");

  // Build color <option>s dynamically
  const colorOptions = product.colors
    .map(color => `<option value="${color.toLowerCase()}">${color}</option>`)
    .join("");

  // Build the html for the page
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
        ${product.discount ? `
        <p class="discount-label">SUMMER SALE DISCOUNT ${product.discount}%</p>
        <p class="original-price">$${product.price.toFixed(2)}</p>
        <p class="discounted-price">$${(product.price * (1 - product.discount / 100)).toFixed(2)}</p>
      ` : `
        <p class="price">$${product.price.toFixed(2)}</p>
      `}


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

  // Add event for the wishlist button
  document.querySelector('.wishlist-btn').addEventListener('click', () => {
    let list = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!list.find(p => p.id === product.id)) {
      const finalPrice = product.discount
      ? parseFloat((product.price * (1 - product.discount / 100)).toFixed(2))
      : product.price;
        list.push({...product,price: finalPrice});
        localStorage.setItem('wishlist', JSON.stringify(list));
        alert('Added to wishlist!');
    } else alert('Already in wishlist');
    });

   

  // Add event for Back to Home button
  document.querySelector('.back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // Add event for Add to Cart button
  const addBtn = document.getElementById("add-to-cart");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const qty = parseInt(document.getElementById("qty-select").value);
      const selectedColor = document.getElementById("color-select").value;
      const finalPrice = product.discount
      ? parseFloat((product.price * (1 - product.discount / 100)).toFixed(2))
      : product.price;

      alert(`${product.name} added to cart!`);
      addToCart({ 
        ...product, 
        price: finalPrice,
        quantity: qty,
        selectedColor 
      });
    });
  }
}

// To show products of the same catagory underneath 
function renderSimilarProducts(allProducts, category, excludeId) {
  const similarContainer = document.getElementById("similar-products");
  const similar = allProducts.filter(
    p => p.category === category && p.id !== parseInt(excludeId)
  );

  // For now showing all but will limit to some number later

  // create a div with className productBox for each
  similar.forEach((product) => {
    const div = document.createElement("div");
    div.className = "productBox";
    div.style.cursor = "pointer";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <p>${product.name}</p>
      <a href="product.html?id=${product.id}">$${product.price}</a>
    `;
    // Add event for viewing product
    div.addEventListener("click", () => {
      window.location.href = `product.html?id=${product.id}`;
    });
    // Append item to similar-products container
    similarContainer.appendChild(div);
  });
}

// Add to cart function (DOESNT STORE COLOR INFORMATION YET)
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += product.quantity;
  } else {
    cart.push(product); 
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateHeaderCounts();
}
