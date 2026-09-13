(() => {
  const root = document.querySelector('.tools-grid');
  if (!root || root.dataset.toolsTickerReady === 'true') return;

  const toolMeta = {
    'Microsoft 365': { short: 'Copilot & productivity', key: 'm365' },
    'Microsoft Teams': { short: 'Collaboration & assistants', key: 'teams' },
    'SharePoint': { short: 'Knowledge & workflows', key: 'sharepoint' },
    'Microsoft Azure': { short: 'Cloud AI & integrations', key: 'azure' },
    'Power Platform': { short: 'Low-code automation', key: 'powerplatform' },
    'Jira': { short: 'Delivery & tracking', key: 'jira' },
    'Asana': { short: 'Project coordination', key: 'asana' },
    'Monday.com': { short: 'Visual workflows', key: 'monday' },
    'GLPI': { short: 'Service & asset data', key: 'glpi' },
    'Google Workspace': { short: 'Gemini & collaboration', key: 'google' },
    'GitHub': { short: 'AI apps & versioning', key: 'github' },
    'Generative AI Tools': { short: 'Agents & prototyping', key: 'genai' },
    'Power BI': { short: 'Insights & reporting', key: 'powerbi' },
    'Canva': { short: 'Visual communication', key: 'canva' },
    'Figma': { short: 'UI & prototyping', key: 'figma' }
  };

  const iconSvg = (key, label) => {
    const common = 'fill="none" stroke="#4E0911" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"';
    const filled = 'fill="#4E0911"';
    const icons = {
      m365: `<rect x="11" y="11" width="18" height="18" rx="3" ${filled}/><rect x="35" y="11" width="18" height="18" rx="3" ${filled}/><rect x="11" y="35" width="18" height="18" rx="3" ${filled}/><rect x="35" y="35" width="18" height="18" rx="3" ${filled}/>` ,
      teams: `<rect x="13" y="19" width="27" height="28" rx="6" ${common}/><path d="M21 27h12M27 27v14" ${common}/><circle cx="46" cy="24" r="5" ${filled}/><path d="M42 32h8a6 6 0 0 1 6 6v6" ${common}/>` ,
      sharepoint: `<circle cx="26" cy="24" r="11" ${common}/><circle cx="39" cy="32" r="11" ${common}/><circle cx="27" cy="42" r="11" ${common}/><path d="M22 24h8M25 20l-3 4 3 4" ${common}/>` ,
      azure: `<path d="M14 48 29 14h11l10 34H40l-3-10H25l-4 10Z" ${common}/><path d="M29 31h11" ${common}/>` ,
      powerplatform: `<path d="m12 32 13-16 12 8 15-8-16 32-11-8Z" ${common}/><path d="m25 16 11 32" ${common}/>` ,
      jira: `<path d="m32 10 13 13-13 13-13-13Z" ${filled}/><path d="m32 28 10 10-10 10-10-10Z" fill="#7A3941"/>` ,
      asana: `<circle cx="32" cy="20" r="7" ${filled}/><circle cx="21" cy="39" r="7" ${filled}/><circle cx="43" cy="39" r="7" ${filled}/>` ,
      monday: `<rect x="13" y="17" width="9" height="30" rx="4.5" ${filled}/><rect x="28" y="12" width="9" height="35" rx="4.5" fill="#7A3941"/><rect x="43" y="22" width="9" height="25" rx="4.5" fill="#9D5F66"/>` ,
      glpi: `<path d="M41 18a10 10 0 0 0-13 12L15 43l6 6 13-13a10 10 0 0 0 12-13l-7 7-6-6Z" ${common}/><circle cx="19" cy="45" r="2.5" ${filled}/>` ,
      google: `<path d="M48 31H33v8h8c-2 5-6 8-12 8-9 0-16-7-16-16s7-16 16-16c5 0 9 2 12 5l6-6C42 9 36 7 29 7 15 7 5 18 5 31s10 24 24 24c14 0 23-10 23-24Z" ${filled}/>` ,
      github: `<path d="M32 9c-13 0-23 10-23 23 0 10 7 19 17 22v-7c-7 2-9-3-9-3-1-3-3-4-3-4-2-2 0-2 0-2 3 0 5 3 5 3 3 4 7 3 9 2 0-2 1-4 2-5-6-1-12-3-12-12 0-3 1-6 3-8 0-2-1-5 0-8 0 0 3-1 9 3 3-1 6-2 9-2s6 1 9 2c6-4 9-3 9-3 1 3 0 6 0 8 2 2 3 5 3 8 0 9-6 11-12 12 2 2 2 5 2 8v12c10-3 17-12 17-22C55 19 45 9 32 9Z" ${filled}/>` ,
      genai: `<circle cx="32" cy="32" r="20" ${common}/><path d="M32 16v32M16 32h32M21 21l22 22M43 21 21 43" ${common}/><circle cx="32" cy="32" r="5" ${filled}/>` ,
      powerbi: `<rect x="14" y="34" width="8" height="16" rx="3" ${filled}/><rect x="27" y="25" width="8" height="25" rx="3" fill="#7A3941"/><rect x="40" y="14" width="8" height="36" rx="3" fill="#9D5F66"/>` ,
      canva: `<circle cx="32" cy="32" r="22" ${common}/><path d="M40 23c-2-3-5-5-9-5-7 0-12 6-12 14s5 14 12 14c4 0 7-2 9-5" ${common}/>` ,
      figma: `<rect x="18" y="10" width="14" height="14" rx="7" ${filled}/><rect x="32" y="10" width="14" height="14" rx="7" fill="#7A3941"/><rect x="18" y="25" width="14" height="14" rx="7" fill="#9D5F66"/><rect x="32" y="25" width="14" height="14" rx="7" ${common}/><rect x="18" y="40" width="14" height="14" rx="7" ${common}/>`
    };

    const initials = String(label || 'AI').split(/\s+/).map((part) => part[0]).join('').slice(0, 3).toUpperCase();
    const body = icons[key] || `<rect x="12" y="12" width="40" height="40" rx="12" ${common}/><text x="32" y="38" text-anchor="middle" fill="#4E0911" font-family="Arial,sans-serif" font-size="15" font-weight="700">${initials}</text>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#FAF1EC"/>${body}</svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  const cards = [...root.querySelectorAll('.tool-card')];
  if (!cards.length) return;

  const buildTile = (card, isClone = false) => {
    const name = card.querySelector('strong')?.textContent?.trim() || 'Technology platform';
    const meta = toolMeta[name] || {};

    const tile = document.createElement('article');
    tile.className = 'tools-ticker__item';
    if (isClone) {
      tile.setAttribute('aria-hidden', 'true');
    } else {
      tile.setAttribute('role', 'listitem');
      tile.setAttribute('aria-label', `${name}: ${meta.short || 'Technology platform'}`);
    }

    const visual = document.createElement('div');
    visual.className = 'tools-ticker__visual';

    const image = document.createElement('img');
    image.className = 'tools-ticker__logo';
    image.src = iconSvg(meta.key, name);
    image.alt = isClone ? '' : `${name} icon`;
    image.width = 44;
    image.height = 44;
    image.decoding = 'async';

    const copy = document.createElement('div');
    copy.className = 'tools-ticker__copy';

    const title = document.createElement('strong');
    title.textContent = name;

    const description = document.createElement('span');
    description.textContent = meta.short || 'Technology platform';

    visual.appendChild(image);
    copy.append(title, description);
    tile.append(visual, copy);
    return tile;
  };

  root.dataset.toolsTickerReady = 'true';
  root.className = 'tools-ticker reveal is-visible';
  root.setAttribute('role', 'region');
  root.setAttribute('aria-label', 'Platforms used. Continuous scrolling list. Animation pauses when hovered or focused.');
  root.setAttribute('tabindex', '0');

  const viewport = document.createElement('div');
  viewport.className = 'tools-ticker__viewport';

  const track = document.createElement('div');
  track.className = 'tools-ticker__track';
  track.setAttribute('role', 'list');

  cards.forEach((card) => track.appendChild(buildTile(card, false)));
  cards.forEach((card) => track.appendChild(buildTile(card, true)));

  viewport.appendChild(track);
  root.replaceChildren(viewport);

  if (!document.querySelector('#tools-ticker-styles')) {
    const style = document.createElement('style');
    style.id = 'tools-ticker-styles';
    style.textContent = `
      @keyframes toolsTickerScroll{
        from{transform:translate3d(0,0,0)}
        to{transform:translate3d(-50%,0,0)}
      }

      .tools-section{overflow:hidden!important;}
      .tools-section .tools-intro{max-width:760px;margin-bottom:30px!important;line-height:1.7;}
      .tools-ticker{position:relative;width:100%;overflow:hidden;border:1px solid rgba(78,9,17,.13);border-radius:24px;background:rgba(255,253,252,.9);box-shadow:0 14px 34px rgba(78,9,17,.065);isolation:isolate;}
      .tools-ticker::before,.tools-ticker::after{content:"";position:absolute;top:0;bottom:0;width:clamp(42px,8vw,110px);z-index:4;pointer-events:none;}
      .tools-ticker::before{left:0;background:linear-gradient(90deg,#F3E4DA 0%,rgba(243,228,218,.92) 28%,rgba(243,228,218,0) 100%);}
      .tools-ticker::after{right:0;background:linear-gradient(270deg,#F3E4DA 0%,rgba(243,228,218,.92) 28%,rgba(243,228,218,0) 100%);}
      .tools-ticker__viewport{width:100%;overflow:hidden;}
      .tools-ticker__track{display:flex;align-items:stretch;width:max-content;will-change:transform;animation:toolsTickerScroll 52s linear infinite;}
      .tools-ticker:hover .tools-ticker__track,.tools-ticker:focus-within .tools-ticker__track{animation-play-state:paused;}
      .tools-ticker__item{flex:0 0 clamp(220px,20vw,270px);min-height:112px;display:grid;grid-template-columns:56px minmax(0,1fr);align-items:center;gap:15px;padding:22px 24px;border-right:1px solid rgba(78,9,17,.085);background:rgba(255,253,252,.82);}
      .tools-ticker__visual{width:52px;height:52px;display:grid;place-items:center;border:1px solid rgba(78,9,17,.12);border-radius:15px;background:#FAF1EC;}
      .tools-ticker__logo{display:block;width:34px!important;height:34px!important;object-fit:contain!important;filter:none!important;}
      .tools-ticker__copy{min-width:0;}
      .tools-ticker__copy strong{display:block;margin-bottom:5px;color:#2F2420!important;font-size:.92rem;line-height:1.25;}
      .tools-ticker__copy span{display:block;color:#7A665D!important;font-size:.74rem;line-height:1.45;}
      .tools-ticker:focus-visible{outline:3px solid rgba(78,9,17,.24)!important;outline-offset:5px;}

      @media(max-width:760px){
        .tools-ticker{border-radius:18px;}
        .tools-ticker__track{animation-duration:42s;}
        .tools-ticker__item{flex-basis:220px;min-height:100px;grid-template-columns:50px minmax(0,1fr);gap:13px;padding:18px;}
        .tools-ticker__visual{width:48px;height:48px;border-radius:13px;}
        .tools-ticker__logo{width:31px!important;height:31px!important;}
        .tools-ticker__copy strong{font-size:.86rem;}
        .tools-ticker__copy span{font-size:.7rem;}
      }

      @media(max-width:480px){
        .tools-section .tools-intro{margin-bottom:22px!important;font-size:.93rem;}
        .tools-ticker__item{flex-basis:200px;min-height:94px;grid-template-columns:46px minmax(0,1fr);padding:16px;}
        .tools-ticker__visual{width:44px;height:44px;}
        .tools-ticker__logo{width:28px!important;height:28px!important;}
      }

      @media(prefers-reduced-motion:reduce){
        .tools-ticker__viewport{overflow-x:auto;scrollbar-width:thin;}
        .tools-ticker__track{animation:none;transform:none!important;}
        .tools-ticker::before,.tools-ticker::after{display:none;}
      }
    `;
    document.head.appendChild(style);
  }
})();