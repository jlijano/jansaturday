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

(() => {
  const servicesSection = document.querySelector('#services');
  const servicesRoot = document.querySelector('[data-services]');
  if (!servicesSection || !servicesRoot) return;

  const heading = servicesSection.querySelector('#services-title');
  const intro = servicesSection.querySelector('.section-head p');

  if (heading) heading.textContent = 'AI solutions designed around real business workflows.';
  if (intro) intro.textContent = 'From opportunity discovery to implementation, I help organisations apply AI where it can reduce manual work, improve decisions, strengthen customer experiences, and create scalable operational value.';

  const services = [
    {
      icon: 'AI',
      title: 'AI Strategy & Opportunity Mapping',
      description: 'Identify high-value AI use cases, prioritise opportunities, assess readiness, and create a practical roadmap aligned with business goals, risk, and return on investment.'
    },
    {
      icon: 'AUT',
      title: 'AI Automation & Intelligent Workflows',
      description: 'Automate repetitive tasks and connect business processes using AI, workflow tools, APIs, and intelligent decision steps that reduce manual effort and improve consistency.'
    },
    {
      icon: 'AG',
      title: 'AI Assistants, Agents & Business Tools',
      description: 'Design and implement AI-powered assistants, agents, internal tools, knowledge workflows, and customer-facing experiences tailored to real operational needs.'
    },
    {
      icon: 'GEN',
      title: 'Generative AI, Video & Digital Content',
      description: 'Create practical generative-AI solutions for content, video, creative production, campaign assets, prototypes, and digital experiences while keeping quality and brand consistency in focus.'
    }
  ];

  servicesRoot.innerHTML = services.map((service) => `
    <article class="service-card reveal is-visible">
      <span class="service-icon" aria-hidden="true">${service.icon}</span>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
    </article>`).join('');
})();

(() => {
  const toolsSection = document.querySelector('#tools');
  const toolsRoot = toolsSection?.querySelector('.tools-grid');
  if (!toolsSection || !toolsRoot) return;

  const intro = toolsSection.querySelector('.tools-intro');
  if (intro) {
    intro.textContent = 'Platforms I use to design AI-enabled solutions, automate workflows, connect business systems, generate insights, collaborate with teams, and deliver practical digital experiences.';
  }

  const platforms = [
    { mark: 'M365', name: 'Microsoft 365', use: 'AI-enabled productivity, Copilot adoption, knowledge workflows, document automation, and connected business collaboration.' },
    { mark: 'TEAMS', name: 'Microsoft Teams', use: 'Conversational AI, workflow notifications, approvals, team collaboration, and AI assistants embedded into everyday work.' },
    { mark: 'SP', name: 'SharePoint', use: 'Structured knowledge bases, document intelligence, AI-ready content repositories, intranets, and automated information workflows.' },
    { mark: 'AZ', name: 'Microsoft Azure', use: 'Cloud infrastructure for AI services, APIs, secure integrations, data processing, automation, and scalable digital solutions.' },
    { mark: 'PP', name: 'Power Platform', use: 'Low-code apps, Power Automate workflows, AI-assisted processes, approvals, data capture, and business process automation.' },
    { mark: 'JIRA', name: 'Jira', use: 'Managing AI initiatives, automation backlogs, delivery workflows, requirements, testing, and implementation progress.' },
    { mark: 'ASANA', name: 'Asana', use: 'Coordinating AI projects, automation tasks, client deliverables, implementation plans, and cross-functional workflows.' },
    { mark: 'MON', name: 'Monday.com', use: 'Visual workflow design, operational automation, AI project tracking, pipeline management, and process visibility.' },
    { mark: 'GLPI', name: 'GLPI', use: 'Service and asset data that can support AI-assisted support workflows, automation, knowledge routing, and operational insights.' },
    { mark: 'GWS', name: 'Google Workspace', use: 'AI-assisted productivity, Gemini-enabled workflows, collaborative content, data collection, and business process automation.' },
    { mark: 'GH', name: 'GitHub', use: 'Building and versioning AI applications, automation scripts, APIs, prototypes, integrations, and production-ready digital solutions.' },
    { mark: 'AI', name: 'Generative AI Tools', use: 'AI assistants, research, content generation, prompt systems, agentic workflows, prototyping, and business automation.' },
    { mark: 'PBI', name: 'Power BI', use: 'Turning operational and AI-generated data into dashboards, decision support, performance insights, and measurable business outcomes.' },
    { mark: 'CANVA', name: 'Canva', use: 'AI-assisted content creation, presentations, campaign assets, rapid visual concepts, and branded digital communication.' },
    { mark: 'FIGMA', name: 'Figma', use: 'Designing AI-powered interfaces, user journeys, workflow prototypes, digital products, and collaborative solution concepts.' }
  ];

  toolsRoot.setAttribute('aria-label', 'Platforms supporting AI consulting and automation');
  toolsRoot.innerHTML = platforms.map((platform) => `
    <article class="tool-card">
      <span class="tool-mark">${platform.mark}</span>
      <div>
        <strong>${platform.name}</strong><br>
        <span>${platform.use}</span>
      </div>
    </article>`).join('');
})();
