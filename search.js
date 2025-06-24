const searchQuery = localStorage.getItem('searchQuery');

fetch('products/products.json')
  .then(res => res.json())
  .then(products => {
    const fuse = new Fuse(products, {
      keys: ['name', 'description', 'keywords'],
      threshold: 0.4
    });

    const results = fuse.search(searchQuery).map(r => r.item);
    const resultContainer = document.getElementById('results');

    if (results.length === 0) {
      resultContainer.innerHTML = '<p>No results found.</p>';
      return;
    }

    results.forEach(product => {
      const productBox = document.createElement("div");
      productBox.className = "productBox";

      productBox.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-link" style="cursor:pointer;">
        <p class="product-link" style="cursor:pointer;">${product.name}</p>
        <a href="#">$${product.price}</a>
      `;

      // Add product description page link
      productBox.querySelectorAll(".product-link").forEach(el => {
        el.addEventListener("click", () => {
          window.location.href = `product.html?id=${product.id}`;
        });
      });

      // Back to Home Event
      document.querySelector('.back-btn').addEventListener('click', () => {
        window.location.href = 'index.html';
      });

      // Add to cart button
      const btn = document.createElement("a");
      btn.href = "#";
      btn.className = "buyBtn";
      btn.textContent = "Add to Cart";

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        addToCart(product);
      });

      productBox.appendChild(btn);
      resultContainer.appendChild(productBox);
    });
  });

// Add to Cart (copy-pasted from your main script)
function addToCart(product) {
  // Get the existing cart from Local Storage (if not found then empty list)
  let cart = JSON.parse(localStorage.getItem("cart")) || []; 
  // Check if product has discount
  const finalPrice = product.discount
    ? parseFloat((product.price * (1 - product.discount / 100)).toFixed(2))
    : product.price;
  // If already in cart, increase quantity, else push the product with quantity 1
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product,price: finalPrice, quantity: 1 });
  }

  // Set the updated cart to the Local Storage, update the header count and display a message
  localStorage.setItem("cart", JSON.stringify(cart));
  //updateHeaderCounts();
  alert(`${product.name} added to cart!`);
}


//For now, update header count is not needed in search results, might change for mobile though

// function updateHeaderCounts() {
//   const cart = JSON.parse(localStorage.getItem('cart')) || [];
//   const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
//   document.getElementById('cart-count').textContent = cart.length;
//   document.getElementById('wishlist-count').textContent = wishlist.length;
//   document.getElementById('mb-cart-count').textContent = cart.length;
//   document.getElementById('mb-wishlist-count').textContent = wishlist.length;
// }

// window.addEventListener('DOMContentLoaded', updateHeaderCounts);
