// Load wishlist from localStorage and render
function loadWishlist() {
  const list = JSON.parse(localStorage.getItem('wishlist')) || [];
  const container = document.getElementById('wishlist-items');
  const emptyMsg = document.getElementById('empty-msg');
  container.innerHTML = '';

  if (list.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';

  list.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'wishlist-card';
    card.innerHTML = `
      <div class="card-image">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="card-info">
        <h3>${product.name}</h3>
        <p class="price">$${product.price.toFixed(2)}</p>
        <button class="view-btn" data-id="${product.id}">View</button>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </div>
    `;
    container.appendChild(card);
  });

  // Attach events
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      removeFromWishlist(idx);
    });
  });
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      window.location.href = `product.html?id=${id}`;
    });
  });
}

// Remove item
function removeFromWishlist(index) {
  const list = JSON.parse(localStorage.getItem('wishlist')) || [];
  list.splice(index, 1);
  localStorage.setItem('wishlist', JSON.stringify(list));
  loadWishlist();
}

document.addEventListener('DOMContentLoaded', () => {
  loadWishlist();
  document.querySelector('.back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});