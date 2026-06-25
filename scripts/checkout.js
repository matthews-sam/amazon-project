/**
 * checkout.js — Checkout page entry point
 */

import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { getCartQuantity } from '../data/cart.js';

/**
 * FIX: Checkout header showed hardcoded "3 items" in the HTML.
 * Now dynamically reflects the real cart quantity on load.
 */
function updateCheckoutHeader() {
  const totalItems = getCartQuantity();
  const headerLink = document.querySelector('.return-to-home-link');
  if (headerLink) {
    headerLink.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
  }
}

renderOrderSummary();
renderPaymentSummary();
updateCheckoutHeader();
