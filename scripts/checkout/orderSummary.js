/**
 * orderSummary.js — Checkout order summary renderer
 */

import { cart, removeFromCart, updateDeliveryOption } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

// FIX: Removed the unused debug import:
//   import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js'
// It served no purpose and added an unnecessary network request.

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * FIX: Moved deliveryOptionsHTML out of renderOrderSummary and renamed
 * to avoid the original parameter-shadowing bug where the forEach
 * callback parameter was also named "deliveryOptions", shadowing the
 * imported array:
 *   deliveryOptions.forEach((deliveryOptions) => { ... })  ← confusing/error-prone
 *
 * FIX: The original price formatting was wrong in two ways:
 *   - FREE options rendered as "$FREE Shipping" (spurious leading $)
 *   - Paid options rendered as "$$4.99 - Shipping" (double $)
 * Now correctly renders "FREE Shipping" or "$4.99 Shipping".
 */
function buildDeliveryOptionsHTML(matchingProduct, cartItem) {
  return deliveryOptions.map(option => {
    const deliveryDate = dayjs().add(option.deliveryDays, 'days').format('dddd, MMMM D');

    const priceString = option.priceCents === 0
      ? 'FREE'
      : `$${formatCurrency(option.priceCents)}`;

    const isChecked = cartItem.deliveryOptionId === option.id;

    // FIX: Original had a typo "js-delivery-opion" (missing 't') in both
    // the HTML template and the querySelectorAll call below — they matched
    // each other so it silently worked, but the typo is now corrected.
    return `
      <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${option.id}">
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">${deliveryDate}</div>
          <div class="delivery-option-price">${priceString} Shipping</div>
        </div>
      </div>
    `;
  }).join('');
}

function updateCheckoutHeader() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const headerLink = document.querySelector('.return-to-home-link');
  if (headerLink) {
    headerLink.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
  }
}

// ─── Renderer ─────────────────────────────────────────────────────────────────

export function renderOrderSummary() {
  /**
   * FIX: Original used string concatenation in a forEach; replaced
   * with map().join('') for clarity.
   * FIX: Added null-guard for getProduct() — if a productId in the
   * cart doesn't match any product, we skip it gracefully instead
   * of crashing when trying to access matchingProduct.image etc.
   */
  const cartSummaryHTML = cart.map(cartItem => {
    const matchingProduct = getProduct(cartItem.productId);
    if (!matchingProduct) return ''; // Guard: skip orphaned cart items

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    const deliveryDate = dayjs()
      .add(deliveryOption.deliveryDays, 'days')
      .format('dddd, MMMM D');

    return `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${deliveryDate}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}"
            alt="${matchingProduct.name}">

          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
            <div class="product-quantity">
              <span>
                Quantity:
                <span class="quantity-label js-quantity-label-${matchingProduct.id}">
                  ${cartItem.quantity}
                </span>
              </span>
              <span class="update-quantity-link link-primary js-update-link"
                data-product-id="${matchingProduct.id}">
                Update
              </span>
              <span class="delete-quantity-link link-primary js-delete-link"
                data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${buildDeliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  }).join('');

  const orderSummaryEl = document.querySelector('.js-order-summary');
  if (orderSummaryEl) {
    orderSummaryEl.innerHTML = cartSummaryHTML;
  }

  // ─── Event listeners ──────────────────────────────────────────────────────

  document.querySelectorAll('.js-delete-link').forEach(link => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;
      removeFromCart(productId);

      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      if (container) container.remove();

      updateCheckoutHeader();
      renderPaymentSummary();
    });
  });

  // FIX: Corrected selector from '.js-delivery-opion' (typo) to '.js-delivery-option'.
  document.querySelectorAll('.js-delivery-option').forEach(element => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
