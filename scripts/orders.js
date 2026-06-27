/**
 * orders.js — Orders page logic
 */

import { addToCart, getCartQuantity }           from '../data/cart.js';
import { createParticles }                      from './utils/particles.js';
import { initHamburger, updateMobileCartQty }   from './utils/header.js';

function updateCartQuantity() {
  const qty = getCartQuantity();
  const el  = document.querySelector('.cart-quantity');
  if (el) el.textContent = qty;
  updateMobileCartQty(qty);
}

// ─── Buy It Again ─────────────────────────────────────────────────────────────

document.querySelectorAll('.js-buy-again').forEach(button => {
  button.addEventListener('click', () => {
    const { productId } = button.dataset;
    if (!productId) return;

    addToCart(productId, 1);
    updateCartQuantity();
    createParticles(button);

    const label    = button.querySelector('.buy-again-label');
    const original = label?.textContent ?? 'Buy it again';
    if (label) {
      label.textContent = '✓ Added!';
      button.disabled   = true;
      setTimeout(() => { label.textContent = original; button.disabled = false; }, 1500);
    }
  });
});

// ─── Init ─────────────────────────────────────────────────────────────────────

updateCartQuantity();
initHamburger();
