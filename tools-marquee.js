(() => {
  const root = document.querySelector('.tools-grid');
  if (!root || root.dataset.marqueeReady === 'true') return;

  const cards = [...root.querySelectorAll('.tool-card')];
  if (!cards.length) return;

  const makeBadge = (label) => {
    const safeLabel = String(label || 'AI').slice(0, 5).toUpperCase();
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop stop-color="#4E0911"/>
            <stop offset="1" stop-color="#9D5F66"/>
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#g)"/>
        <text x="32" y="38" text-anchor="middle" fill="#FFFDFC" font-family="Arial,sans-serif" font-size="${safeLabel.length > 3 ? 12 : 17}" font-weight="700">${safeLabel}</text>
      </svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  const prepareCard = (card, isClone = false) => {
    card.classList.remove('tool-card');
    card.classList.add('tools-slide');

    const name = card.querySelector('strong')?.textContent?.trim() || 'Technology platform';
    const mark = card.querySelector('.tool-mark');
    if (mark) {
      const image = document.createElement('img');
      image.src = makeBadge(mark.textContent?.trim() || name.slice(0, 2));
      image.width = 58;
      image.height = 58;
      image.alt = '';
      image.setAttribute('aria-hidden', 'true');
      mark.replaceWith(image);
    }

    if (isClone) {
      card.setAttribute('aria-hidden', 'true');
    } else {
      card.setAttribute('aria-label', name);
    }

    return card;
  };

  root.dataset.marqueeReady = 'true';
  root.classList.remove('tools-grid');
  root.classList.add('tools-slider');
  root.setAttribute('tabindex', '0');
  root.setAttribute('role', 'region');
  root.setAttribute('aria-label', 'Platforms used for AI consulting, automation, intelligent workflows, and digital solutions. Animation pauses while focused or hovered.');

  const track = document.createElement('div');
  track.className = 'tools-slide-track';

  cards.forEach((card) => track.appendChild(prepareCard(card)));
  cards.forEach((card) => track.appendChild(prepareCard(card.cloneNode(true), true)));

  root.replaceChildren(track);
})();
