let summerProducts = []; // Global

window.addEventListener("DOMContentLoaded", () => {
  fetch("products/products.json")
    .then(res => res.json())
    .then(products => {
      summerProducts = products
        .filter(p => p.category === "clothing")
        .map(p => ({
          ...p,
          discountedPrice: parseFloat((p.price * (1 - p.discount / 100)).toFixed(2))
        }));

      renderSummerProducts(summerProducts);
    });
});

function renderSummerProducts(list) {
  const container = document.getElementById("summer-list");
  container.innerHTML = "";

  list.forEach(product => {
    const productBox = document.createElement("div");
    productBox.className = "productBox";

    productBox.innerHTML = `
      ${product.discount ? `<div class="discount-label">-${product.discount}%</div>` : ``}
      <img src="${product.image}" alt="${product.name}" class="product-link" style="cursor:pointer;">
      <p class="product-link" style="cursor:pointer;">${product.name}</p>
      ${product.discount ? `
        <p class="original-price">$${product.price.toFixed(2)}</p>
        <p class="discounted-price">$${product.discountedPrice}</p>
      ` : `
        <a href="#">$${product.price.toFixed(2)}</a>
      `}
    `;

    productBox.querySelectorAll(".product-link").forEach(el => {
      el.addEventListener("click", () => {
        window.location.href = `product.html?id=${product.id}`;
      });
    });

    const btn = document.createElement("a");
    btn.href = "#";
    btn.className = "buyBtn";
    btn.textContent = "Add to Cart";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      addToCart(product);
    });

    productBox.appendChild(btn);
    container.appendChild(productBox);
  });
}

document.getElementById("price-filter").addEventListener("change", function () {
  const sortOption = this.value;
  let sorted = [...summerProducts];

  if (sortOption === "low") {
    sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
  } else if (sortOption === "high") {
    sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
  }

  renderSummerProducts(sorted);
});

// Your existing addToCart function stays unchanged


// Add to Cart function
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
  updateHeaderCounts();
  alert(`${product.name} added to cart!`);
}

