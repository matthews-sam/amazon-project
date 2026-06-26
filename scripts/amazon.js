/**
 * amazon.js — Main product page logic
 */

import { addToCart, getCartQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { createParticles } from './utils/particles.js';

// ─── Rendering ───────────────────────────────────────────────────────────────

function renderProducts(productList) {
  const grid = document.querySelector('.js-products-grid');

  if (productList.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <p>No products found.</p>
        <small>Try a different search term or browse all products.</small>
      </div>
    `;
    return;
  }

  const productsHTML = productList.map((product, index) => {
    const delay = Math.min(index, 10) * 35;
    return `
      <article class="product-container" style="animation-delay:${delay}ms">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}"
            alt="${product.name}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png"
            alt="${product.rating.stars} out of 5 stars">
          <div class="product-rating-count link-primary">
            ${product.rating.count.toLocaleString()}
          </div>
        </div>

        <div class="product-price">
          $${formatCurrency(product.priceCents)}
        </div>

        <div class="product-quantity-container">
          <select
            class="js-quantity-selector-${product.id}"
            aria-label="Quantity for ${product.name}">
            ${Array.from({ length: 10 }, (_, i) => i + 1)
              .map(n => `<option value="${n}">${n}</option>`)
              .join('')}
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}"
          aria-live="polite" role="status">
          <img src="images/icons/checkmark.png" alt=""> Added
        </div>

        <button
          class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${product.id}"
          type="button">
          Add to Cart
        </button>
      </article>
    `;
  }).join('');

  grid.innerHTML = productsHTML;
  attachCartListeners();
}

// ─── Cart interactions ────────────────────────────────────────────────────────

function attachCartListeners() {
  document.querySelectorAll('.js-add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const { productId } = button.dataset;

      const quantitySelector = document.querySelector(
        `.js-quantity-selector-${productId}`
      );
      const quantity = quantitySelector
        ? parseInt(quantitySelector.value, 10)
        : 1;

      addToCart(productId, quantity);
      updateCartQuantity();
      showAddedMessage(productId);

      // Particle burst — mirrors the ParticleButton reference animation
      createParticles(button);
    });
  });
}

const addedMessageTimers = {};

function showAddedMessage(productId) {
  const messageEl = document.querySelector(`.js-added-to-cart-${productId}`);
  if (!messageEl) return;

  messageEl.style.opacity   = '1';
  messageEl.style.transform = 'translateY(0)';

  clearTimeout(addedMessageTimers[productId]);
  addedMessageTimers[productId] = setTimeout(() => {
    messageEl.style.opacity   = '0';
    messageEl.style.transform = 'translateY(4px)';
  }, 2000);
}

function updateCartQuantity() {
  const qty = getCartQuantity();
  const el  = document.querySelector('.js-cart-quantity');
  if (!el) return;

  el.textContent = qty;

  // Badge pulse micro-interaction
  el.style.transform = 'scale(1.35)';
  setTimeout(() => { el.style.transform = 'scale(1)'; }, 250);
}

// ─── Search ───────────────────────────────────────────────────────────────────

function handleSearch() {
  const searchBar = document.querySelector('.search-bar');
  const query = searchBar ? searchBar.value.trim().toLowerCase() : '';

  if (!query) {
    renderProducts(products);
    return;
  }

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(query) ||
    (product.keywords ?? []).some(kw => kw.toLowerCase().includes(query))
  );

  renderProducts(filtered);
}

// ─── Init ─────────────────────────────────────────────────────────────────────

renderProducts(products);
updateCartQuantity();

const searchForm = document.querySelector('.search-form');
const searchBar  = document.querySelector('.search-bar');

if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSearch();
  });
}

if (searchBar) {
  searchBar.addEventListener('input', () => {
    if (searchBar.value.trim() === '') renderProducts(products);
  });
}
