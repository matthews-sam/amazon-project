/**
 * checkout.js — Checkout page entry point
 */

import { renderOrderSummary }  from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { getCartQuantity }      from '../data/cart.js';

function updateCheckoutHeader() {
  const total      = getCartQuantity();
  const headerLink = document.querySelector('.return-to-home-link');
  if (headerLink) {
    headerLink.textContent = `${total} item${total !== 1 ? 's' : ''}`;
  }
}

/* ── Initial render ───────────────────────────────────────────────────────── */
renderOrderSummary();
renderPaymentSummary();
updateCheckoutHeader();

/* ── Cart cleared: re-render everything and sync the header count ─────────── */
document.addEventListener('cart:cleared', () => {
  renderOrderSummary();
  renderPaymentSummary();
  updateCheckoutHeader();
});
