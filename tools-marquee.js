(() => {
  const toolsGrid = document.querySelector('.tools-grid');
  if (!toolsGrid) return;

  const svg = (body) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${body}</svg>`)}`;
  const badge = (text, start, end = start) => svg(`<defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="${start}"/><stop offset="1" stop-color="${end}"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#g)"/><text x="32" y="39" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="18" font-weight="700">${text}</text>`);

  const logoSources = {
    'Microsoft 365': svg('<rect x="8" y="8" width="20" height="20" fill="#f25022"/><rect x="36" y="8" width="20" height="20" fill="#7fba00"/><rect x="8" y="36" width="20" height="20" fill="#00a4ef"/><rect x="36" y="36" width="20" height="20" fill="#ffb900"/>'),
    'Microsoft Teams': svg('<rect x="8" y="16" width="34" height="34" rx="8" fill="#6264a7"/><rect x="18" y="24" width="14" height="6" fill="white"/><rect x="22" y="24" width="6" height="20" fill="white"/><circle cx="48" cy="20" r="7" fill="#8b8cc7"/><circle cx="50" cy="40" r="9" fill="#7b83eb"/>'),
    'SharePoint': svg('<circle cx="25" cy="32" r="21" fill="#038387"/><circle cx="43" cy="22" r="11" fill="#36a9ae"/><circle cx="45" cy="43" r="13" fill="#0b6f73"/><text x="25" y="40" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="700">S</text>'),
    'Microsoft Azure': 'https://www.northware.mx/wp-content/uploads/2022/09/northware-microsoft-azure-logo.png',
    'Power Platform': svg('<path d="M10 22 27 8l17 14-17 14z" fill="#742774"/><path d="M20 42 37 28l17 14-17 14z" fill="#4f6bed"/><path d="m27 36 10-8 10 8-10 8z" fill="#a426a8"/>'),
    'Rework.com': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQotyMWSOS3zhyfKB3CGgNgoTOVDPn2L_4F-MPI-23ZtmLwByJsbi_q0oU&s=10',
    'Asana': svg('<circle cx="32" cy="17" r="11" fill="#f06a6a"/><circle cx="19" cy="42" r="11" fill="#f06a6a"/><circle cx="45" cy="42" r="11" fill="#f06a6a"/>'),
    'Monday.com': svg('<rect width="64" height="64" rx="16" fill="white"/><rect x="11" y="12" width="10" height="40" rx="5" transform="rotate(28 16 32)" fill="#f62b54"/><rect x="27" y="12" width="10" height="40" rx="5" transform="rotate(28 32 32)" fill="#ffcc00"/><circle cx="49" cy="45" r="6.5" fill="#00c875"/>'),
    'Google Workspace': 'https://static.wikia.nocookie.net/logopedia/images/c/c1/Google_Apps_for_Work_icon.png/revision/latest/scale-to-width-down/250?cb=20241121044151',
    'GitHub': 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
    'Codex': 'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/codex-color.png',
    'Claude': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlKwMmVefqPlDmzhC_PadwBso7gHH5-QclBoh6qM6SsrSiuGuC2oxgQ8w&s=10',
    'ChatGPT': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ChatGPT-Logo.svg/960px-ChatGPT-Logo.svg.png?_=20240214002031',
    'Hermes': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjcJ9P4EkbG4tU5ST2QOFarrM-i5e5DIbFT_27yBn1Jw&s=10',
    'Power BI': svg('<rect x="10" y="34" width="8" height="20" rx="4" fill="#f2c811"/><rect x="22" y="24" width="8" height="30" rx="4" fill="#f2c811"/><rect x="34" y="14" width="8" height="40" rx="4" fill="#f2c811"/><rect x="46" y="8" width="8" height="46" rx="4" fill="#d4a900"/>'),
    'Canva': svg('<defs><linearGradient id="canva" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#00c4cc"/><stop offset="1" stop-color="#7d2ae8"/></linearGradient></defs><circle cx="32" cy="32" r="29" fill="url(#canva)"/><text x="32" y="39" text-anchor="middle" fill="white" font-family="cursive" font-size="22" font-weight="700" font-style="italic">Canva</text>'),
    'Figma': svg('<rect x="18" y="6" width="14" height="14" rx="7" fill="#f24e1e"/><rect x="32" y="6" width="14" height="14" rx="7" fill="#ff7262"/><rect x="18" y="20" width="14" height="14" rx="7" fill="#a259ff"/><rect x="32" y="20" width="14" height="14" rx="7" fill="#1abcfe"/><rect x="18" y="34" width="14" height="14" rx="7" fill="#0acf83"/>')
  };

  const createToolCard = (markText, name, description) => {
    const card = document.createElement('article');
    card.className = 'tool-card';
    const mark = document.createElement('span');
    mark.className = 'tool-mark';
    mark.textContent = markText;
    const content = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = name;
    const breakElement = document.createElement('br');
    const detail = document.createElement('span');
    detail.textContent = description;
    content.append(title, breakElement, detail);
    card.append(mark, content);
    return card;
  };

  [...toolsGrid.querySelectorAll('.tool-card')].forEach((card) => {
    const title = card.querySelector('strong');
    const name = title?.textContent?.trim();
    if (name === 'Jira') {
      const mark = card.querySelector('.tool-mark');
      const detail = card.querySelector('div span');
      if (mark) mark.textContent = 'RW';
      if (title) title.textContent = 'Rework.com';
      if (detail) detail.textContent = 'Workflow management';
    }
    if (name === 'GLPI') card.remove();
    if (name === 'Generative AI Tools') {
      card.replaceWith(
        createToolCard('CX', 'Codex', 'AI-assisted development'),
        createToolCard('CL', 'Claude', 'AI research and analysis'),
        createToolCard('GPT', 'ChatGPT', 'AI productivity and automation'),
        createToolCard('H', 'Hermes', 'AI agent workflows')
      );
    }
  });

  toolsGrid.classList.remove('tools-grid');
  toolsGrid.classList.add('tools-slider');
  toolsGrid.setAttribute('tabindex', '0');
  toolsGrid.setAttribute('role', 'region');
  toolsGrid.setAttribute('aria-label', 'Tools and software logo carousel. Animation pauses while focused or hovered.');

  const originalCards = [...toolsGrid.querySelectorAll('.tool-card')];
  const track = document.createElement('div');
  track.className = 'tools-slide-track';

  const prepareCard = (card, isClone = false) => {
    card.classList.remove('tool-card');
    card.classList.add('tools-slide');
    const name = card.querySelector('strong')?.textContent?.trim() || 'Technology tool';
    const mark = card.querySelector('.tool-mark');
    if (mark) {
      const image = document.createElement('img');
      image.src = logoSources[name] || badge(name.slice(0, 2).toUpperCase(), '#9346ff', '#297dff');
      image.width = 58;
      image.height = 58;
      image.alt = '';
      image.setAttribute('aria-hidden', 'true');
      mark.replaceWith(image);
    }
    card.setAttribute('aria-label', name);
    if (isClone) {
      card.setAttribute('aria-hidden', 'true');
      card.removeAttribute('aria-label');
    }
    return card;
  };

  originalCards.forEach((card) => track.appendChild(prepareCard(card)));
  originalCards.forEach((card) => track.appendChild(prepareCard(card.cloneNode(true), true)));
  toolsGrid.replaceChildren(track);
})();

(() => {
  if (document.querySelector('script[data-clients-carousel-module]')) return;
  const script = document.createElement('script');
  script.src = 'clients-carousel.js';
  script.defer = true;
  script.dataset.clientsCarouselModule = 'true';
  document.head.appendChild(script);
})();
