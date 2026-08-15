/**
 * Scroll a section on the landing page into view.
 *
 * The scroll is animated by hand rather than with
 * `scrollIntoView({ behavior: "smooth" })` or
 * `scrollTo({ behavior: "smooth" })`. Both of those silently do nothing in
 * some browsers and automation environments — the page simply stays at the
 * top — which is exactly how the "Explore Features" button appeared broken.
 * A requestAnimationFrame tween behaves the same everywhere.
 *
 * The navbar is sticky, so its height is subtracted, otherwise it would sit
 * on top of the heading we just scrolled to.
 */

const DURATION = 500;

// Standard ease-in-out curve.
function ease(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return false;

  const navbar = document.querySelector(".navbar");
  const offset = navbar ? navbar.offsetHeight : 0;

  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;

  const start = window.scrollY;
  const destination = Math.max(
    0,
    Math.min(
      maxScroll,
      target.getBoundingClientRect().top + start - offset - 12
    )
  );

  const distance = destination - start;
  if (Math.abs(distance) < 2) return true;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Jump instantly when the user asked for less motion, and when the tab is
  // in the background — hidden tabs do not run requestAnimationFrame, so an
  // animated scroll there would never finish.
  if (prefersReduced || document.hidden) {
    window.scrollTo(0, destination);
    return true;
  }

  let startTime = null;

  function step(now) {
    if (startTime === null) startTime = now;

    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / DURATION);

    window.scrollTo(0, start + distance * ease(progress));

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
  return true;
}

export default scrollToSection;
