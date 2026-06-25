/**
 * cart.js — Cart data layer
 * Handles all cart state, persistence, and mutations.
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

function getDefaultCart() {
  return [
    { productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', quantity: 2, deliveryOptionId: '1' },
    { productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d', quantity: 1, deliveryOptionId: '2' }
  ];
}

/**
 * FIX: Original code did bare JSON.parse without try/catch.
 * If localStorage contained corrupted data it would crash immediately.
 * Now we safely parse and fall back to the default cart.
 */
function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem('cart');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    console.warn('[Cart] localStorage data was corrupted — resetting to default cart.');
  }
  return getDefaultCart();
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// ─── State ───────────────────────────────────────────────────────────────────

export let cart = loadCartFromStorage();

// ─── Mutations ───────────────────────────────────────────────────────────────

/**
 * FIX: Original addToCart always incremented by 1, ignoring the
 * quantity selector on the product page.  Now accepts a quantity param.
 * FIX: Used forEach to find a match; replaced with Array.find().
 */
export function addToCart(productId, quantity = 1) {
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const matchingItem = cart.find(item => item.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += qty;
  } else {
    cart.push({ productId, quantity: qty, deliveryOptionId: '1' });
  }

  saveToStorage();
}

/**
 * FIX: Original used forEach + push; replaced with filter for clarity.
 */
export function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  saveToStorage();
}

/**
 * NEW: Allows the update-quantity flow in the checkout to work.
 */
export function updateQuantity(productId, newQuantity) {
  const quantity = parseInt(newQuantity, 10);
  if (!quantity || quantity < 1) return;

  const matchingItem = cart.find(item => item.productId === productId);
  if (matchingItem) {
    matchingItem.quantity = quantity;
    saveToStorage();
  }
}

/**
 * FIX: Original had no null-check — if productId didn't exist in cart
 * it would crash with "Cannot set property of undefined".
 */
export function updateDeliveryOption(productId, deliveryOptionId) {
  const matchingItem = cart.find(item => item.productId === productId);

  if (!matchingItem) {
    console.warn(`[Cart] updateDeliveryOption: product ${productId} not found.`);
    return;
  }

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

// ─── Reads ───────────────────────────────────────────────────────────────────

/**
 * NEW: Single place to compute the total cart quantity shown in the header.
 */
export function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}
