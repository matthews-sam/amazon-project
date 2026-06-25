/**
 * paymentSummary.js — Checkout payment summary renderer
 */

import { cart } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let totalItems = 0;

  cart.forEach(cartItem => {
    const product = getProduct(cartItem.productId);
    if (!product) return; // Guard: skip orphaned cart items

    productPriceCents += product.priceCents * cartItem.quantity;
    totalItems += cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1; // 10% estimated tax
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
      <div>Items (${totalItems}):</div>
      <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;

  /**
   * CRITICAL FIX #1: Original used `Document` (capital D) which is the
   * WebAPI constructor interface, NOT the actual document object.
   * Calling Document.querySelector() throws "Document.querySelector is
   * not a function" and the payment summary NEVER renders.
   * Fixed to lowercase `document`.
   *
   * CRITICAL FIX #2: Original selector was 'js-payment-summary' — missing
   * the leading dot, so it was treated as a tag-name selector, which finds
   * nothing. Fixed to '.js-payment-summary'.
   *
   * CRITICAL FIX #3: Item count was hardcoded as "Items (3)" regardless
   * of what was actually in the cart. Now uses the computed totalItems.
   */
  const paymentSummaryEl = document.querySelector('.js-payment-summary');
  if (paymentSummaryEl) {
    paymentSummaryEl.innerHTML = paymentSummaryHTML;
  }
}
