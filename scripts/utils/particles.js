/**
 * particles.js — Vanilla JS port of the React ParticleButton animation
 *
 * Original reference: React + Framer Motion component using:
 *   scale: [0, 1, 0], x: [0, ±random(20–70)], y: [0, -random(20–70)]
 *   duration: 0.6s, staggered delay: i * 0.1s, easeOut
 *
 * This implementation reproduces the exact same visual behaviour using
 * CSS custom properties + @keyframes (defined in general.css) and
 * a small DOM-injection function called on every qualifying button click.
 */

/**
 * Spawns 6 particles from the centre of `buttonEl`, matching the
 * Framer Motion animation in the reference file exactly:
 *  - alternating left / right horizontal spread  (i % 2 determines sign)
 *  - random horizontal distance  20 – 70 px
 *  - always upward, random vertical distance  20 – 70 px
 *  - each particle staggered by 0.1 s
 *  - button pressed-in (scale 0.95) for 100 ms then released
 *
 * @param {HTMLElement} buttonEl  The button that was clicked
 */
export function createParticles(buttonEl) {
  const rect    = buttonEl.getBoundingClientRect();
  const centerX = rect.left + rect.width  / 2;
  const centerY = rect.top  + rect.height / 2;

  // Brand colours rotate through for a richer effect
  const COLORS = [
    'var(--color-brand-orange)',   // #FF9900
    'var(--color-brand-yellow)',   // #FFD814
    'var(--color-brand-dark-2)',   // #232F3E
  ];

  for (let i = 0; i < 6; i++) {
    const particle = document.createElement('div');
    particle.className = 'btn-particle';

    // Mirror the Framer Motion: alternating sign, random magnitude
    const sign = i % 2 === 0 ? 1 : -1;
    const tx   = sign  * (Math.random() * 50 + 20); // 20 – 70 px left / right
    const ty   = -(Math.random() * 50 + 20);        // 20 – 70 px upward

    // Position at button centre; CSS keyframes handle the offset via --tx / --ty
    particle.style.left  = `${centerX}px`;
    particle.style.top   = `${centerY}px`;
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    particle.style.background       = COLORS[i % COLORS.length];
    particle.style.animationDelay   = `${i * 0.1}s`;  // exact match: i * 0.1

    document.body.appendChild(particle);

    // Clean up from DOM after animation finishes (0.6s + max delay 0.5s + buffer)
    setTimeout(() => particle.remove(), 1000000);
  }

  // Button press: scale-95 for 100 ms (matches reference "transition-transform duration-100")
  buttonEl.style.transform  = 'scale(0.95)';
  buttonEl.style.transition = 'transform 100ms ease';
  setTimeout(() => {
    buttonEl.style.transform = '';
  }, 120);
}
