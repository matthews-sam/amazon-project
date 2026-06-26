/**
 * orders.js — Orders page logic
 *
 * Responsibilities:
 *  1. Sync the cart quantity badge in the header with localStorage
 *  2. "Buy It Again" — adds the product back to the cart with 1 quantity
 *     and fires the same particle burst animation used on the product page
 */

import { addToCart, getCartQuantity } from '../data/cart.js';
import { createParticles } from './utils/particles.js';

// ─── Cart header badge ────────────────────────────────────────────────────────

function updateCartQuantity() {
  const qty = getCartQuantity();
  const el  = document.querySelector('.cart-quantity');
  if (!el) return;
  el.textContent = qty;
}

// ─── Buy It Again ─────────────────────────────────────────────────────────────

document.querySelectorAll('.js-buy-again').forEach(button => {
  button.addEventListener('click', () => {
    const { productId } = button.dataset;
    if (!productId) return;

    // Add 1 of this product back to the cart
    addToCart(productId, 1);
    updateCartQuantity();

    // Fire the particle burst (same animation as Add to Cart)
    createParticles(button);

    // Visual confirmation: swap the label briefly to "✓ Added!"
    const label = button.querySelector('.buy-again-label');
    if (label) {
      const original = label.textContent;
      label.textContent = '✓ Added!';
      button.disabled = true;
      setTimeout(() => {
        label.textContent = original;
        button.disabled   = false;
      }, 1500);
    }
  });
});

// ─── Init ─────────────────────────────────────────────────────────────────────

updateCartQuantity();
