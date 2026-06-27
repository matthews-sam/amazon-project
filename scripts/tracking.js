/**
 * tracking.js — Tracking page
 * Syncs the header cart badge and wires up the hamburger menu.
 */

import { getCartQuantity }                    from '../data/cart.js';
import { initHamburger, updateMobileCartQty } from './utils/header.js';

updateMobileCartQty(getCartQuantity());
initHamburger();
