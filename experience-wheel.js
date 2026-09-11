(() => {
  const carousel = document.querySelector('[data-experience]');
  if (!carousel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let activeIndex = 0;
  let wheelTotal = 0;
  let locked = false;
  let resumeTimer;

  const visibleItems = () => [...carousel.querySelectorAll('.experience-item:not(.is-hidden)')];

  const getCurrentIndex = (items) => {
    let bestIndex = 0;
    let bestOpacity = -1;
    items.forEach((item, index) => {
      const opacity = Number.parseFloat(getComputedStyle(item).opacity) || 0;
      if (opacity > bestOpacity) {
        bestOpacity = opacity;
        bestIndex = index;
      }
    });
    return bestIndex;
  };

  const render = () => {
    const items = visibleItems();
    if (!items.length) return;
    activeIndex = ((activeIndex % items.length) + items.length) % items.length;

    items.forEach((item, index) => {
      const forward = (index - activeIndex + items.length) % items.length;
      const backward = (activeIndex - index + items.length) % items.length;
      item.classList.toggle('is-wheel-active', index === activeIndex);
      item.classList.toggle('is-wheel-next', forward === 1);
      item.classList.toggle('is-wheel-prev', backward === 1);
      const isVisible = index === activeIndex || forward === 1 || backward === 1;
      item.setAttribute('aria-hidden', String(!isVisible));
      if ('inert' in item) item.inert = !isVisible;
    });
  };

  const beginManualMode = () => {
    const items = visibleItems();
    if (!items.length) return false;
    if (!carousel.classList.contains('is-wheel-controlled')) {
      activeIndex = getCurrentIndex(items);
      carousel.classList.add('is-wheel-controlled');
    }
    return true;
  };

  const scheduleAutoplayResume = () => {
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      carousel.classList.remove('is-wheel-controlled');
      visibleItems().forEach((item) => {
        item.classList.remove('is-wheel-active', 'is-wheel-next', 'is-wheel-prev');
        item.removeAttribute('aria-hidden');
        if ('inert' in item) item.inert = false;
      });
    }, 3500);
  };

  carousel.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    wheelTotal += event.deltaY;
    if (Math.abs(wheelTotal) < 28 || locked) return;
    if (!beginManualMode()) return;

    event.preventDefault();
    activeIndex += wheelTotal > 0 ? 1 : -1;
    wheelTotal = 0;
    locked = true;
    render();
    scheduleAutoplayResume();
    window.setTimeout(() => { locked = false; }, 520);
  }, { passive: false });

  carousel.addEventListener('mouseenter', () => {
    if (carousel.classList.contains('is-wheel-controlled')) scheduleAutoplayResume();
  });

  const observer = new MutationObserver(() => {
    if (carousel.classList.contains('is-wheel-controlled')) render();
  });
  observer.observe(carousel, { subtree: true, attributes: true, attributeFilter: ['class'] });
})();
