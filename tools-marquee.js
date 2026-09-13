(() => {
  const root = document.querySelector('.tools-grid');
  if (!root || root.dataset.toolsEnhanced === 'true') return;

  const toolMeta = {
    'Microsoft 365': {
      icon: 'https://cdn.simpleicons.org/microsoft365/4E0911',
      short: 'Copilot, productivity, document automation, and connected collaboration.'
    },
    'Microsoft Teams': {
      icon: 'https://cdn.simpleicons.org/microsoftteams/4E0911',
      short: 'AI assistants, approvals, notifications, and collaborative workflows.'
    },
    'SharePoint': {
      icon: 'https://cdn.simpleicons.org/microsoftsharepoint/4E0911',
      short: 'Knowledge bases, AI-ready content, intranets, and document workflows.'
    },
    'Microsoft Azure': {
      icon: 'https://cdn.simpleicons.org/microsoftazure/4E0911',
      short: 'Cloud AI services, APIs, integrations, automation, and scalable solutions.'
    },
    'Power Platform': {
      icon: 'https://cdn.simpleicons.org/powerautomate/4E0911',
      short: 'Low-code apps, Power Automate, approvals, and business process automation.'
    },
    'Jira': {
      icon: 'https://cdn.simpleicons.org/jira/4E0911',
      short: 'AI project backlogs, requirements, testing, and delivery tracking.'
    },
    'Asana': {
      icon: 'https://cdn.simpleicons.org/asana/4E0911',
      short: 'Project plans, client deliverables, automation tasks, and team coordination.'
    },
    'Monday.com': {
      icon: 'https://cdn.simpleicons.org/mondaydotcom/4E0911',
      short: 'Visual workflows, pipelines, automation, and operational visibility.'
    },
    'GLPI': {
      icon: 'https://cdn.simpleicons.org/glpi/4E0911',
      short: 'Service, asset, support, and operational data for smarter workflows.'
    },
    'Google Workspace': {
      icon: 'https://cdn.simpleicons.org/googleworkspace/4E0911',
      short: 'Gemini-enabled productivity, collaboration, data collection, and automation.'
    },
    'GitHub': {
      icon: 'https://cdn.simpleicons.org/github/4E0911',
      short: 'Versioning AI apps, scripts, APIs, prototypes, and production solutions.'
    },
    'Generative AI Tools': {
      icon: 'https://cdn.simpleicons.org/openai/4E0911',
      short: 'AI assistants, research, prompting, agents, prototyping, and automation.'
    },
    'Power BI': {
      icon: 'https://cdn.simpleicons.org/powerbi/4E0911',
      short: 'Dashboards, AI-generated insights, decision support, and performance reporting.'
    },
    'Canva': {
      icon: 'https://cdn.simpleicons.org/canva/4E0911',
      short: 'AI-assisted visual content, presentations, campaign assets, and rapid concepts.'
    },
    'Figma': {
      icon: 'https://cdn.simpleicons.org/figma/4E0911',
      short: 'AI interfaces, user journeys, workflow prototypes, and digital product concepts.'
    }
  };

  const fallbackIcon = (label) => {
    const initials = String(label || 'AI')
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 3)
      .toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#FAF1EC"/><rect x="1" y="1" width="62" height="62" rx="15" fill="none" stroke="#4E0911" stroke-opacity=".24"/><text x="32" y="38" text-anchor="middle" fill="#4E0911" font-family="Arial,sans-serif" font-size="16" font-weight="700">${initials}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  root.dataset.toolsEnhanced = 'true';
  root.setAttribute('role', 'list');
  root.setAttribute('aria-label', 'Platforms used for AI consulting, automation, collaboration, analytics, and digital solutions');

  [...root.querySelectorAll('.tool-card')].forEach((card) => {
    const name = card.querySelector('strong')?.textContent?.trim() || 'Technology platform';
    const meta = toolMeta[name] || {};
    const content = card.querySelector('div');
    const mark = card.querySelector('.tool-mark');

    card.setAttribute('role', 'listitem');
    card.classList.add('tool-card--enhanced');

    const visual = document.createElement('div');
    visual.className = 'tool-card__visual';

    const image = document.createElement('img');
    image.className = 'tool-card__logo';
    image.src = meta.icon || fallbackIcon(name);
    image.alt = `${name} logo`;
    image.width = 48;
    image.height = 48;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => {
      if (!image.dataset.fallbackApplied) {
        image.dataset.fallbackApplied = 'true';
        image.src = fallbackIcon(name);
      }
    });

    visual.appendChild(image);
    mark?.replaceWith(visual);

    if (content) {
      content.classList.add('tool-card__content');
      const description = content.querySelector('span');
      if (description && meta.short) description.textContent = meta.short;
    }
  });

  const style = document.createElement('style');
  style.id = 'tools-responsive-grid-styles';
  style.textContent = `
    .tools-section{overflow:visible!important;}
    .tools-section .tools-intro{
      max-width:780px;
      margin-bottom:32px!important;
      font-size:1rem;
      line-height:1.7;
    }
    .tools-section .tools-grid{
      display:grid!important;
      grid-template-columns:repeat(4,minmax(0,1fr))!important;
      gap:16px!important;
      width:100%;
      overflow:visible!important;
      border:0!important;
      border-radius:0!important;
      background:transparent!important;
      box-shadow:none!important;
    }
    .tools-section .tool-card--enhanced{
      min-width:0;
      min-height:190px;
      display:flex!important;
      flex-direction:column;
      align-items:flex-start;
      gap:18px;
      padding:24px!important;
      border:1px solid rgba(78,9,17,.12)!important;
      border-radius:20px!important;
      background:rgba(255,253,252,.92)!important;
      box-shadow:0 12px 30px rgba(78,9,17,.055)!important;
      transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease!important;
    }
    .tools-section .tool-card--enhanced:hover{
      transform:translateY(-4px);
      border-color:rgba(78,9,17,.34)!important;
      box-shadow:0 18px 36px rgba(78,9,17,.09)!important;
    }
    .tool-card__visual{
      width:62px;
      height:62px;
      display:grid;
      place-items:center;
      flex:0 0 auto;
      border:1px solid rgba(78,9,17,.1);
      border-radius:16px;
      background:#FAF1EC;
    }
    .tool-card__logo{
      display:block;
      width:40px!important;
      height:40px!important;
      object-fit:contain!important;
      filter:none!important;
    }
    .tool-card__content{
      min-width:0;
      width:100%;
    }
    .tool-card__content strong{
      display:block;
      margin-bottom:8px;
      color:#2F2420!important;
      font-size:1rem!important;
      line-height:1.3!important;
    }
    .tool-card__content br{display:none;}
    .tool-card__content span{
      display:block;
      margin:0!important;
      color:#6F5C54!important;
      font-size:.84rem!important;
      line-height:1.55!important;
    }
    @media(max-width:1100px){
      .tools-section .tools-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;}
    }
    @media(max-width:820px){
      .tools-section .tools-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px!important;}
      .tools-section .tool-card--enhanced{min-height:170px;padding:20px!important;}
    }
    @media(max-width:560px){
      .tools-section .tools-intro{font-size:.94rem;line-height:1.65;margin-bottom:24px!important;}
      .tools-section .tools-grid{grid-template-columns:1fr!important;gap:12px!important;}
      .tools-section .tool-card--enhanced{
        min-height:auto;
        display:grid!important;
        grid-template-columns:56px minmax(0,1fr);
        gap:16px;
        align-items:start;
        padding:18px!important;
        border-radius:16px!important;
      }
      .tool-card__visual{width:56px;height:56px;border-radius:14px;}
      .tool-card__logo{width:36px!important;height:36px!important;}
      .tool-card__content strong{font-size:.98rem!important;margin-bottom:5px;}
      .tool-card__content span{font-size:.82rem!important;line-height:1.5!important;}
    }
    @media(prefers-reduced-motion:reduce){
      .tools-section .tool-card--enhanced{transition:none!important;}
    }
  `;
  document.head.appendChild(style);
})();