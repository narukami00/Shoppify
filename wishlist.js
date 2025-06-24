// Load the wishlist from Local Storage
function loadWishlist() {
  const list = JSON.parse(localStorage.getItem('wishlist')) || [];

  const container = document.getElementById('wishlist-items');
  const emptyMsg = document.getElementById('empty-msg');

  container.innerHTML = '';

  // Show the empty message if the wishlist is empty and return
  if (list.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }
  // Else set the display of empty message to None
  emptyMsg.style.display = 'none';

  // For each of the wishlisted items, create a div wish className 'wishlist-card'
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
    // Append the item to the wishlist-items container
    container.appendChild(card);
  });

  // Event for Remove from wishlist button
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      removeFromWishlist(idx);
    });
  });

  // Event for View Product button
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      window.location.href = `product.html?id=${id}`;
    });
  });
}

// Function to remove item from wishlist (splice the index, update local storage, load the wishlist again)
function removeFromWishlist(index) {
  const list = JSON.parse(localStorage.getItem('wishlist')) || [];
  list.splice(index, 1);
  localStorage.setItem('wishlist', JSON.stringify(list));
  loadWishlist();
}

// Call the loadWishlist funtion and add event to the Back to Home button when page's DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadWishlist();
  document.querySelector('.back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});