/**
 * deliveryOptions.js — Delivery options data layer
 */

export const deliveryOptions = [
  { id: '1', deliveryDays: 7, priceCents: 0 },
  { id: '2', deliveryDays: 3, priceCents: 499 },
  { id: '3', deliveryDays: 1, priceCents: 999 }
];

/**
 * FIX: Original used forEach to scan for a match; replaced with
 * Array.find() which short-circuits and is semantically correct.
 * The fallback to deliveryOptions[0] is preserved.
 */
export function getDeliveryOption(deliveryOptionId) {
  return deliveryOptions.find(option => option.id === deliveryOptionId) ?? deliveryOptions[0];
}
