/**
 * header.js — Shared mobile header interactivity
 *
 * Implements the animated hamburger → X toggle from menu.txt (React reference),
 * translated to vanilla JS + CSS classes. The SVG animation is driven
 * entirely by CSS (stroke-dasharray / stroke-dashoffset + rotation) —
 * JS only toggles the `.open` class and manages ARIA attributes.
 *
 * Usage: import { initHamburger, updateMobileCartQty } from './utils/header.js'
 *        then call both on every page that has the shared header.
 */

/**
 * Wires up the hamburger button:
 *  - click toggles the dropdown open/closed
 *  - clicking any nav link closes it (before the page navigates)
 *  - clicking anywhere outside closes it
 */
export function initHamburger() {
  const btn = document.querySelector('.js-hamburger');
  const svg = btn?.querySelector('.js-hamburger-svg');
  const nav = document.querySelector('.js-mobile-nav');
  if (!btn || !nav) return;

  function setOpen(open) {
    nav.classList.toggle('open', open);
    svg?.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    nav.setAttribute('aria-hidden',   String(!open));
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!nav.classList.contains('open'));
  });

  // Close immediately when the user taps a link (navigation will follow)
  nav.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });

  // Close on any outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !nav.contains(e.target)) {
      setOpen(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

/**
 * Syncs the cart quantity badge inside the mobile dropdown.
 * Call this wherever you call the main updateCartQuantity() function
 * so both badges stay in lockstep.
 *
 * @param {number} qty  Current total cart item count
 */
export function updateMobileCartQty(qty) {
  document.querySelectorAll('.js-mobile-cart-qty').forEach(el => {
    el.textContent      = qty > 0 ? String(qty) : '';
    el.style.display    = qty > 0 ? ''           : 'none';
  });
}
