// Load The Products from products.json
window.addEventListener("DOMContentLoaded", () => {
  fetch("products/products.json")
    .then((res) => res.json())
    .then((products) => {
      // Now products has the response gotten from the products.json
      const bagList = document.getElementById("bag-list");
      const watchList = document.getElementById("watch-list");

      bagList.innerHTML = "";
      watchList.innerHTML = "";

      // For each product create a div with 'productBox' class
      products.forEach((product) => {
        const productBox = document.createElement("div");
        productBox.className = "productBox";

        productBox.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-link" style="cursor:pointer;">
        <p class="product-link" style="cursor:pointer;">${product.name}</p>
        <a href="#">$${product.price}</a>`;

        // Make name and image clickable, opens product description page
        productBox.querySelectorAll(".product-link").forEach(el => {
          el.addEventListener("click", () => {
            window.location.href = `product.html?id=${product.id}`;
          });
        });


        // Adding the Add to cart button
        const btn = document.createElement("a");
        btn.href = "#";
        btn.className = "buyBtn";
        btn.textContent = "Add to Cart";

        // Making Add to cart clickable
        btn.addEventListener("click", (e) => {
          e.preventDefault(); 
          addToCart(product);
        });

        // Appending the button to productBox
        productBox.appendChild(btn);

        // Appending productBox in their respective catagories
        if (product.category === "bags") {
          bagList.appendChild(productBox);
        } else if (product.category === "watches") {
          watchList.appendChild(productBox);
        }
      });
    });
});


// Add to cart function
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

// Updating header counts of cart and wishlist
function updateHeaderCounts() {
  // Get the existing cart and wishlist from Local Storage (if not found then empty list)
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  // Update the text content of these ID's with the length of the list 
  document.getElementById('cart-count').textContent = cart.length;
  document.getElementById('wishlist-count').textContent = wishlist.length;
  document.getElementById('mb-cart-count').textContent = cart.length;
  document.getElementById('mb-wishlist-count').textContent = wishlist.length;
}

// Update the header counts when the page's DOM is ready
window.addEventListener('DOMContentLoaded', updateHeaderCounts);

// Make the search bar toggleable on Mobile devices
document.addEventListener("DOMContentLoaded", () => {
  // Check if in Mobile-mode
  const searchIcon = document.querySelector(".mobile-search-icon");
  const searchToggle = document.querySelector(".mobile-search-toggle");

  // If in Mobile-mode make the search icon toggleable
  if (searchIcon && searchToggle) {
  searchIcon.addEventListener("click", () => {
    
    // Icon dissapears , search-bar visible
    searchIcon.style.display = "none";
    searchToggle.style.display = "flex";

    const input = searchToggle.querySelector("input");
    if (input) input.focus();
    });

  // If clicked anywhere else
  document.addEventListener("click", (e) => {
    // If in Mobile-mode
    if (
      !searchToggle.contains(e.target) &&
      !searchIcon.contains(e.target)
    ) {
      // Icon visible, search-bar dissapears
      searchToggle.style.display = "none";
      searchIcon.style.display = "flex";
    }
    });
  }
});


// Search Box
// Listen for Enter key on both desktop and mobile search inputs
document.querySelectorAll('.searchbox input[type="search"]').forEach(input => {
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      const query = e.target.value.trim();
      if (query) {
        localStorage.setItem('searchQuery', query);
        window.location.href = 'search.html';
      }
    }
  });
});


// Summer Collection
document.addEventListener("DOMContentLoaded", () => {
  const summerBtn = document.querySelector(".section1But .btn");
  if (summerBtn) {
    summerBtn.addEventListener("click", () => {
      window.location.href = "summer.html";
    });
  }
});


