/**
 * paymentSummary.js — Checkout payment summary renderer
 */

import { cart, clearCart } from '../../data/cart.js';
import { getProduct }       from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency }   from '../utils/money.js';
import { createParticles }  from '../utils/particles.js';

export function renderPaymentSummary() {
  let productPriceCents  = 0;
  let shippingPriceCents = 0;
  let totalItems         = 0;

  cart.forEach(cartItem => {
    const product = getProduct(cartItem.productId);
    if (!product) return;

    productPriceCents  += product.priceCents * cartItem.quantity;
    totalItems         += cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents  += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents            = totalBeforeTaxCents * 0.1;
  const totalCents          = totalBeforeTaxCents + taxCents;

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

    <button class="place-order-button button-primary" type="button">
      Place your order
    </button>

    <button class="empty-cart-button js-empty-cart" type="button">
      🗑 Empty Cart
    </button>
  `;

  const paymentSummaryEl = document.querySelector('.js-payment-summary');
  if (!paymentSummaryEl) return;

  paymentSummaryEl.innerHTML = paymentSummaryHTML;

  /* ── Place Order — particle burst ────────────────────────────────── */
  const placeOrderBtn = paymentSummaryEl.querySelector('.place-order-button');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => createParticles(placeOrderBtn));
  }

  /* ── Empty Cart ───────────────────────────────────────────────────── */
  const emptyCartBtn = paymentSummaryEl.querySelector('.js-empty-cart');
  if (emptyCartBtn) {
    emptyCartBtn.addEventListener('click', () => {
      clearCart();
      /**
       * Dispatch a custom event instead of importing renderOrderSummary()
       * directly — that would create a circular dependency since
       * orderSummary.js already imports renderPaymentSummary().
       * checkout.js listens for this event and re-renders both panels.
       */
      document.dispatchEvent(new CustomEvent('cart:cleared'));
    });
  }
}
