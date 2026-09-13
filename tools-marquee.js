(() => {
  const root = document.querySelector('.tools-grid');
  if (!root || root.dataset.toolsTickerReady === 'true') return;

  const toolMeta = {
    'Microsoft 365': {
      icon: 'https://cdn.simpleicons.org/microsoft365/4E0911',
      short: 'Copilot & productivity'
    },
    'Microsoft Teams': {
      icon: 'https://cdn.simpleicons.org/microsoftteams/4E0911',
      short: 'Collaboration & assistants'
    },
    'SharePoint': {
      icon: 'https://cdn.simpleicons.org/microsoftsharepoint/4E0911',
      short: 'Knowledge & workflows'
    },
    'Microsoft Azure': {
      icon: 'https://cdn.simpleicons.org/microsoftazure/4E0911',
      short: 'Cloud AI & integrations'
    },
    'Power Platform': {
      icon: 'https://cdn.simpleicons.org/powerautomate/4E0911',
      short: 'Low-code automation'
    },
    'Jira': {
      icon: 'https://cdn.simpleicons.org/jira/4E0911',
      short: 'Delivery & tracking'
    },
    'Asana': {
      icon: 'https://cdn.simpleicons.org/asana/4E0911',
      short: 'Project coordination'
    },
    'Monday.com': {
      icon: 'https://cdn.simpleicons.org/mondaydotcom/4E0911',
      short: 'Visual workflows'
    },
    'GLPI': {
      icon: 'https://cdn.simpleicons.org/glpi/4E0911',
      short: 'Service & asset data'
    },
    'Google Workspace': {
      icon: 'https://cdn.simpleicons.org/googleworkspace/4E0911',
      short: 'Gemini & collaboration'
    },
    'GitHub': {
      icon: 'https://cdn.simpleicons.org/github/4E0911',
      short: 'AI apps & versioning'
    },
    'Generative AI Tools': {
      icon: 'https://cdn.simpleicons.org/openai/4E0911',
      short: 'Agents & prototyping'
    },
    'Power BI': {
      icon: 'https://cdn.simpleicons.org/powerbi/4E0911',
      short: 'Insights & reporting'
    },
    'Canva': {
      icon: 'https://cdn.simpleicons.org/canva/4E0911',
      short: 'Visual communication'
    },
    'Figma': {
      icon: 'https://cdn.simpleicons.org/figma/4E0911',
      short: 'UI & prototyping'
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
    image.src = meta.icon || fallbackIcon(name);
    image.alt = isClone ? '' : `${name} logo`;
    image.width = 44;
    image.height = 44;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => {
      if (!image.dataset.fallbackApplied) {
        image.dataset.fallbackApplied = 'true';
        image.src = fallbackIcon(name);
      }
    });

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

      .tools-section{
        overflow:hidden!important;
      }

      .tools-section .tools-intro{
        max-width:760px;
        margin-bottom:30px!important;
        line-height:1.7;
      }

      .tools-ticker{
        position:relative;
        width:100%;
        overflow:hidden;
        border:1px solid rgba(78,9,17,.13);
        border-radius:24px;
        background:rgba(255,253,252,.9);
        box-shadow:0 14px 34px rgba(78,9,17,.065);
        isolation:isolate;
      }

      .tools-ticker::before,
      .tools-ticker::after{
        content:"";
        position:absolute;
        top:0;
        bottom:0;
        width:clamp(42px,8vw,110px);
        z-index:4;
        pointer-events:none;
      }

      .tools-ticker::before{
        left:0;
        background:linear-gradient(90deg,#F3E4DA 0%,rgba(243,228,218,.92) 28%,rgba(243,228,218,0) 100%);
      }

      .tools-ticker::after{
        right:0;
        background:linear-gradient(270deg,#F3E4DA 0%,rgba(243,228,218,.92) 28%,rgba(243,228,218,0) 100%);
      }

      .tools-ticker__viewport{
        width:100%;
        overflow:hidden;
      }

      .tools-ticker__track{
        display:flex;
        align-items:stretch;
        width:max-content;
        will-change:transform;
        animation:toolsTickerScroll 52s linear infinite;
      }

      .tools-ticker:hover .tools-ticker__track,
      .tools-ticker:focus-within .tools-ticker__track{
        animation-play-state:paused;
      }

      .tools-ticker__item{
        flex:0 0 clamp(220px,20vw,270px);
        min-height:112px;
        display:grid;
        grid-template-columns:56px minmax(0,1fr);
        align-items:center;
        gap:15px;
        padding:22px 24px;
        border-right:1px solid rgba(78,9,17,.085);
        background:rgba(255,253,252,.82);
      }

      .tools-ticker__visual{
        width:52px;
        height:52px;
        display:grid;
        place-items:center;
        border:1px solid rgba(78,9,17,.12);
        border-radius:15px;
        background:#FAF1EC;
      }

      .tools-ticker__logo{
        display:block;
        width:34px!important;
        height:34px!important;
        object-fit:contain!important;
        filter:none!important;
      }

      .tools-ticker__copy{
        min-width:0;
      }

      .tools-ticker__copy strong{
        display:block;
        margin-bottom:5px;
        color:#2F2420!important;
        font-size:.92rem;
        line-height:1.25;
      }

      .tools-ticker__copy span{
        display:block;
        color:#7A665D!important;
        font-size:.74rem;
        line-height:1.45;
      }

      .tools-ticker:focus-visible{
        outline:3px solid rgba(78,9,17,.24)!important;
        outline-offset:5px;
      }

      @media(max-width:760px){
        .tools-ticker{
          border-radius:18px;
        }

        .tools-ticker__track{
          animation-duration:42s;
        }

        .tools-ticker__item{
          flex-basis:220px;
          min-height:100px;
          grid-template-columns:50px minmax(0,1fr);
          gap:13px;
          padding:18px 18px;
        }

        .tools-ticker__visual{
          width:48px;
          height:48px;
          border-radius:13px;
        }

        .tools-ticker__logo{
          width:31px!important;
          height:31px!important;
        }

        .tools-ticker__copy strong{font-size:.86rem;}
        .tools-ticker__copy span{font-size:.7rem;}
      }

      @media(max-width:480px){
        .tools-section .tools-intro{
          margin-bottom:22px!important;
          font-size:.93rem;
        }

        .tools-ticker__item{
          flex-basis:200px;
          min-height:94px;
          grid-template-columns:46px minmax(0,1fr);
          padding:16px;
        }

        .tools-ticker__visual{
          width:44px;
          height:44px;
        }

        .tools-ticker__logo{
          width:28px!important;
          height:28px!important;
        }
      }

      @media(prefers-reduced-motion:reduce){
        .tools-ticker__viewport{
          overflow-x:auto;
          scrollbar-width:thin;
        }

        .tools-ticker__track{
          animation:none;
          transform:none!important;
        }

        .tools-ticker::before,
        .tools-ticker::after{
          display:none;
        }
      }
    `;
    document.head.appendChild(style);
  }
})();