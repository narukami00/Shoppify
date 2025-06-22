window.addEventListener("DOMContentLoaded", () => {
  fetch("products/products.json")
    .then((res) => res.json())
    .then((products) => {
      const bagList = document.getElementById("bag-list");
      const watchList = document.getElementById("watch-list");

      bagList.innerHTML = "";
      watchList.innerHTML = "";

      products.forEach((product) => {
        const productBox = document.createElement("div");
        productBox.className = "productBox";

        productBox.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-link" style="cursor:pointer;">
        <p class="product-link" style="cursor:pointer;">${product.name}</p>
        <a href="#">$${product.price}</a>`;

        // Make name and image clickable
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

        if (product.category === "bags") {
          bagList.appendChild(productBox);
        } else if (product.category === "watches") {
          watchList.appendChild(productBox);
        }
      });
    });
});

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateHeaderCounts();
  alert(`${product.name} added to cart!`);
}


function updateHeaderCounts() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  document.getElementById('cart-count').textContent = cart.length;
  document.getElementById('wishlist-count').textContent = wishlist.length;
  document.getElementById('mb-cart-count').textContent = cart.length;
  document.getElementById('mb-wishlist-count').textContent = wishlist.length;
  }
  window.addEventListener('DOMContentLoaded', updateHeaderCounts);

  document.addEventListener("DOMContentLoaded", () => {
    const searchIcon = document.querySelector(".mobile-search-icon");
    const searchToggle = document.querySelector(".mobile-search-toggle");

    if (searchIcon && searchToggle) {
      searchIcon.addEventListener("click", () => {
        // Hide the icon and show the search bar
        searchIcon.style.display = "none";
        searchToggle.style.display = "flex";

        // Auto-focus the input
        const input = searchToggle.querySelector("input");
        if (input) input.focus();
      });

      // Optional: close searchbar when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !searchToggle.contains(e.target) &&
          !searchIcon.contains(e.target)
        ) {
          searchToggle.style.display = "none";
          searchIcon.style.display = "flex";
        }
      });
    }
});


