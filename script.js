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
          <img src="${product.image}" alt="">
          <p>${product.name}</p>
          <a href="">$${product.price}</a>
        `;

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
  alert(`${product.name} added to cart!`);
}
