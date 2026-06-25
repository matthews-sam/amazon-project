/**
 * money.js — Currency formatting utility
 */

/**
 * FIX: Original had no input validation. Passing NaN, null, or a
 * string would silently produce "NaN" or crash. Now returns '0.00'
 * as a safe default for invalid inputs.
 */
export function formatCurrency(priceCents) {
  if (typeof priceCents !== 'number' || isNaN(priceCents)) return '0.00';
  return (Math.round(priceCents) / 100).toFixed(2);
}

export default formatCurrency;
