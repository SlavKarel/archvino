const SELECTOR = '[data-parallax]';

export default function initParallax(): void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const elements = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));

  if (elements.length === 0 || reduceMotion.matches) {
    return;
  }

  let frame = 0;

  const update = () => {
    const viewportCenter = window.innerHeight / 2;

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();

      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) {
        return;
      }

      const speed = Number(element.dataset.parallaxSpeed ?? 0.1);
      const elementCenter = rect.top + rect.height / 2;
      const offset = Math.max(-90, Math.min(90, (elementCenter - viewportCenter) * speed));
      element.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
    });

    frame = 0;
  };

  const requestUpdate = () => {
    if (frame === 0) {
      frame = window.requestAnimationFrame(update);
    }
  };

  update();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
}
