(() => {
  const clientsGrid = document.querySelector('.clients-grid');
  if (!clientsGrid || clientsGrid.dataset.glideReady === 'true') return;

  const GLIDE_VERSION = '3.7.1';
  const glideCssUrl = `https://cdn.jsdelivr.net/npm/@glidejs/glide@${GLIDE_VERSION}/dist/css/glide.core.min.css`;
  const glideJsUrl = `https://cdn.jsdelivr.net/npm/@glidejs/glide@${GLIDE_VERSION}/dist/glide.min.js`;

  const appendStylesheet = (href, dataAttribute) => {
    if (document.querySelector(`link[${dataAttribute}]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute(dataAttribute, 'true');
    document.head.appendChild(link);
  };

  const loadStylesheets = () => {
    appendStylesheet(glideCssUrl, 'data-glide-core');
    appendStylesheet('clients-carousel.css', 'data-clients-carousel-styles');
  };

  const buildCarousel = () => {
    if (!window.Glide || clientsGrid.dataset.glideReady === 'true') return;

    const cards = [...clientsGrid.querySelectorAll('.client-card')];
    if (cards.length < 2) return;

    clientsGrid.dataset.glideReady = 'true';
    clientsGrid.classList.remove('clients-grid');
    clientsGrid.classList.add('clients-glide', 'glide');
    clientsGrid.setAttribute('role', 'region');
    clientsGrid.setAttribute('aria-roledescription', 'carousel');
    clientsGrid.setAttribute('aria-label', 'Clients and organisations');

    const track = document.createElement('div');
    track.className = 'glide__track';
    track.dataset.glideEl = 'track';

    const slides = document.createElement('ul');
    slides.className = 'glide__slides';

    cards.forEach((card, index) => {
      const slide = document.createElement('li');
      slide.className = 'glide__slide';
      slide.setAttribute('aria-label', `${index + 1} of ${cards.length}`);
      slide.appendChild(card);
      slides.appendChild(slide);
    });

    track.appendChild(slides);

    const controls = document.createElement('div');
    controls.className = 'clients-carousel-controls';
    controls.dataset.glideEl = 'controls';
    controls.innerHTML = `
      <button type="button" data-glide-dir="<" aria-label="Show previous organisation">
        <span aria-hidden="true">←</span>
      </button>
      <button type="button" data-glide-dir=">" aria-label="Show next organisation">
        <span aria-hidden="true">→</span>
      </button>`;

    const bullets = document.createElement('div');
    bullets.className = 'clients-carousel-bullets';
    bullets.dataset.glideEl = 'controls[nav]';
    cards.forEach((_, index) => {
      const bullet = document.createElement('button');
      bullet.type = 'button';
      bullet.dataset.glideDir = `=${index}`;
      bullet.setAttribute('aria-label', `Go to organisation ${index + 1}`);
      bullets.appendChild(bullet);
    });

    const footer = document.createElement('div');
    footer.className = 'clients-carousel-footer';
    footer.append(bullets, controls);

    clientsGrid.replaceChildren(track, footer);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const glide = new window.Glide(clientsGrid, {
      type: 'carousel',
      startAt: 0,
      perView: 3,
      gap: 22,
      animationDuration: reduceMotion ? 0 : 650,
      autoplay: reduceMotion ? false : 5000,
      hoverpause: true,
      keyboard: true,
      swipeThreshold: 60,
      dragThreshold: 90,
      breakpoints: {
        1050: { perView: 2, gap: 20 },
        700: { perView: 1, gap: 16, peek: { before: 0, after: 28 } }
      }
    });

    glide.mount();
  };

  const loadGlide = () => {
    loadStylesheets();

    if (window.Glide) {
      buildCarousel();
      return;
    }

    const existing = document.querySelector('script[data-glide-library]');
    if (existing) {
      existing.addEventListener('load', buildCarousel, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = glideJsUrl;
    script.defer = true;
    script.dataset.glideLibrary = 'true';
    script.addEventListener('load', buildCarousel, { once: true });
    script.addEventListener('error', () => {
      clientsGrid.dataset.glideReady = 'false';
      console.warn('The clients carousel could not load. The client cards remain available as a static grid.');
    }, { once: true });
    document.head.appendChild(script);
  };

  loadGlide();
})();
