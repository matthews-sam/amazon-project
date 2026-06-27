/**
 * cart.js — Cart data layer
 */

function getDefaultCart() {
  return [];
}

function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem('cart');
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    console.warn('[Cart] localStorage data was corrupted — resetting to empty cart.');
  }
  return getDefaultCart();
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export let cart = loadCartFromStorage();

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

export function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  saveToStorage();
}

export function updateQuantity(productId, newQuantity) {
  const quantity = parseInt(newQuantity, 10);
  if (!quantity || quantity < 1) return;
  const matchingItem = cart.find(item => item.productId === productId);
  if (matchingItem) {
    matchingItem.quantity = quantity;
    saveToStorage();
  }
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  const matchingItem = cart.find(item => item.productId === productId);
  if (!matchingItem) {
    console.warn(`[Cart] updateDeliveryOption: product ${productId} not found.`);
    return;
  }
  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

/**
 * NEW: Empties the entire cart and persists the empty state to localStorage.
 * Used by the "Empty Cart" button on the checkout page.
 */
export function clearCart() {
  cart = [];
  saveToStorage();
}

export function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}
