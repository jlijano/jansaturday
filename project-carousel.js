"use strict";

const INTRO_VIDEO_URL = "https://player.cloudinary.com/embed/?cloud_name=brfm6p40&public_id=lv_0_20260912150315&autoplay=true&muted=true&loop=true";
const INTRO_DESCRIPTION = "AI Consultant helping businesses adopt practical AI, automation, and intelligent digital solutions to work smarter and grow efficiently.";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setupProfileIntro = () => {
  const heroGrid = document.querySelector(".hero-grid");
  const heroDescription = document.querySelector(".hero-description");
  if (heroDescription) heroDescription.textContent = INTRO_DESCRIPTION;
  if (!heroGrid || heroGrid.querySelector(".hero-intro-video")) return;

  const media = document.createElement("div");
  media.className = "hero-intro-video reveal is-visible";
  media.setAttribute("aria-label", "Who am I profile introduction video");
  const introSrc = reduceMotion ? INTRO_VIDEO_URL.replace("autoplay=true", "autoplay=false") : INTRO_VIDEO_URL;
  media.innerHTML = `
    <div class="hero-intro-video__frame">
      <iframe
        src="${introSrc}"
        title="Who am I? — Jan Christian Lijano, AI Consultant"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowfullscreen
        frameborder="0"
        loading="eager"></iframe>
      <div class="hero-intro-video__label" aria-hidden="true">Who am I?</div>
    </div>`;
  heroGrid.appendChild(media);

  if (!document.querySelector("#hero-intro-video-styles")) {
    const style = document.createElement("style");
    style.id = "hero-intro-video-styles";
    style.textContent = `
      .hero .hero-grid{grid-template-columns:minmax(0,1fr) minmax(320px,.72fr)!important;max-width:1180px;margin-inline:auto;gap:clamp(42px,6vw,88px);align-items:center}
      .hero .hero-copy{max-width:620px}.hero .hero-description{max-width:560px}
      .hero-intro-video{width:100%;max-width:360px;justify-self:center}
      .hero-intro-video__frame{position:relative;width:100%;aspect-ratio:9/16;overflow:hidden;border:1px solid rgba(78,9,17,.2);border-radius:26px;background:#260707;box-shadow:0 28px 70px rgba(78,9,17,.16)}
      .hero-intro-video iframe{display:block;width:100%;height:100%;border:0;background:#260707}
      .hero-intro-video__label{position:absolute;left:14px;top:14px;z-index:3;padding:8px 12px;border:1px solid rgba(255,255,255,.2);border-radius:999px;background:rgba(78,9,17,.8);color:#FAF1EC;font-size:.76rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;backdrop-filter:blur(10px);pointer-events:none}
      @media(max-width:1024px){.hero .hero-grid{grid-template-columns:1fr!important;max-width:820px;gap:44px}.hero-intro-video{max-width:360px;justify-self:center}}
      @media(max-width:640px){.hero-intro-video__frame{border-radius:18px}.hero-intro-video{max-width:320px}.hero-intro-video__label{left:12px;top:12px;font-size:.68rem}}
    `;
    document.head.appendChild(style);
  }
};

setupProfileIntro();

const root = document.querySelector("[data-project-carousel]");
const DATA_URL = "portfolio-videos.json";
let items = [];
let activeIndex = 0;
let activeMedia = null;

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const cloudinaryInfo = (input = "") => {
  try {
    const url = new URL(String(input).trim());
    if (url.hostname === "player.cloudinary.com") {
      const cloudName = url.searchParams.get("cloud_name");
      const publicId = url.searchParams.get("public_id");
      if (cloudName && publicId) return { cloudName, publicId };
    }
    if (url.hostname === "res.cloudinary.com") {
      const parts = url.pathname.split("/").filter(Boolean);
      const cloudName = parts[0];
      const uploadIndex = parts.indexOf("upload");
      if (cloudName && uploadIndex >= 0) {
        const idParts = parts.slice(uploadIndex + 1).filter((part) => !part.includes(","));
        const joined = idParts.join("/").replace(/\.(mp4|webm|ogg)$/i, "");
        if (joined) return { cloudName, publicId: joined };
      }
    }
  } catch (_) {}
  return null;
};

const cloudinaryVideoUrl = (input = "") => {
  const info = cloudinaryInfo(input);
  if (info) {
    const encodedId = info.publicId.split("/").map(encodeURIComponent).join("/");
    return `https://res.cloudinary.com/${encodeURIComponent(info.cloudName)}/video/upload/f_auto,q_auto/${encodedId}.mp4`;
  }
  try {
    const url = new URL(String(input).trim());
    return /\.(mp4|webm|ogg)(?:$|\?)/i.test(url.href) ? url.href : "";
  } catch (_) {
    return "";
  }
};

const cloudinaryPosterUrl = (input = "") => {
  const info = cloudinaryInfo(input);
  if (!info) return "";
  const encodedId = info.publicId.split("/").map(encodeURIComponent).join("/");
  return `https://res.cloudinary.com/${encodeURIComponent(info.cloudName)}/video/upload/so_0,f_jpg,q_auto,w_1200/${encodedId}.jpg`;
};

const directImageUrl = (input = "") => {
  try {
    const url = new URL(String(input).trim());
    return /\.(avif|webp|png|jpe?g|gif)(?:$|\?)/i.test(url.href) ? url.href : "";
  } catch (_) {
    return "";
  }
};

const normalize = (rows) => (Array.isArray(rows) ? rows : [])
  .filter((row) => row && row.title && (row.videoLink || row.imageLink || row.mediaLink))
  .map((row, index) => {
    const originalUrl = String(row.videoLink || row.imageLink || row.mediaLink || "").trim();
    const imageUrl = directImageUrl(originalUrl);
    return {
      id: row.id || `portfolio-${index + 1}`,
      title: String(row.title).trim(),
      description: String(row.description || "").trim(),
      status: String(row.status || "").trim(),
      mediaType: imageUrl ? "image" : "video",
      mediaUrl: imageUrl || cloudinaryVideoUrl(originalUrl),
      posterUrl: String(row.posterLink || "").trim() || (imageUrl ? imageUrl : cloudinaryPosterUrl(originalUrl))
    };
  });

const applyAspectRatio = (media) => {
  const stage = root?.querySelector(".portfolio-deck__active");
  if (!stage || !media) return;
  const width = media.tagName === "VIDEO" ? media.videoWidth : media.naturalWidth;
  const height = media.tagName === "VIDEO" ? media.videoHeight : media.naturalHeight;
  if (!width || !height) return;
  stage.style.aspectRatio = `${width} / ${height}`;
  stage.dataset.orientation = height > width ? "portrait" : width > height ? "landscape" : "square";
};

const stopActiveMedia = () => {
  if (activeMedia?.tagName === "VIDEO") {
    activeMedia.pause();
    activeMedia.removeAttribute("src");
    activeMedia.load();
  }
  activeMedia = null;
};

const buildActiveMedia = (item) => {
  const host = root?.querySelector("[data-active-media]");
  if (!host) return;
  stopActiveMedia();
  host.replaceChildren();

  if (!item.mediaUrl) {
    host.innerHTML = `<div class="portfolio-deck__error"><strong>Media unavailable</strong><span>Please verify the portfolio media URL.</span></div>`;
    return;
  }

  if (item.mediaType === "image") {
    const image = document.createElement("img");
    image.src = item.mediaUrl;
    image.alt = item.title;
    image.loading = "eager";
    image.addEventListener("load", () => applyAspectRatio(image), { once: true });
    host.appendChild(image);
    activeMedia = image;
    return;
  }

  const video = document.createElement("video");
  video.src = item.mediaUrl;
  video.poster = item.posterUrl || "";
  video.controls = true;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.setAttribute("aria-label", item.title);
  video.addEventListener("loadedmetadata", () => applyAspectRatio(video), { once: true });
  video.addEventListener("ended", () => goTo(activeIndex + 1));
  video.addEventListener("error", () => {
    if (!host.querySelector(".portfolio-deck__error")) {
      host.innerHTML = `<div class="portfolio-deck__error"><strong>Video failed to load</strong><span>Please verify the public media asset.</span></div>`;
    }
  }, { once: true });
  host.appendChild(video);
  activeMedia = video;

  if (!reduceMotion) {
    video.play().catch(() => {});
  }
};

const previewPosition = (index) => {
  const previous = (activeIndex - 1 + items.length) % items.length;
  const next = (activeIndex + 1) % items.length;
  if (items.length <= 1 || index === activeIndex) return "hidden";
  if (index === previous) return "previous";
  if (index === next) return "next";
  return "hidden";
};

const updatePreviewDeck = () => {
  root?.querySelectorAll("[data-portfolio-preview]").forEach((card, index) => {
    const position = previewPosition(index);
    card.dataset.position = position;
    card.hidden = position === "hidden";
    card.setAttribute("aria-hidden", String(position === "hidden"));
    card.tabIndex = position === "hidden" ? -1 : 0;
  });
};

function goTo(index, announce = true) {
  if (!root || !items.length) return;
  activeIndex = (index + items.length) % items.length;
  const item = items[activeIndex];
  buildActiveMedia(item);
  updatePreviewDeck();

  const title = root.querySelector("[data-active-title]");
  const description = root.querySelector("[data-active-description]");
  const category = root.querySelector("[data-active-category]");
  if (title) title.textContent = item.title;
  if (description) description.textContent = item.description;
  if (category) {
    category.textContent = item.status || "AI Portfolio";
    category.hidden = false;
  }

  root.querySelectorAll("[data-portfolio-dot]").forEach((dot, dotIndex) => {
    const current = dotIndex === activeIndex;
    dot.classList.toggle("is-active", current);
    dot.setAttribute("aria-current", current ? "true" : "false");
  });

  const counter = root.querySelector("[data-portfolio-counter]");
  if (counter) counter.textContent = `${activeIndex + 1} / ${items.length}`;
  const status = root.querySelector("[data-portfolio-status]");
  if (announce && status) status.textContent = `${item.title} is now displayed.`;
}

const next = () => goTo(activeIndex + 1);
const previous = () => goTo(activeIndex - 1);

const previewMarkup = (item, index) => `
  <button class="portfolio-deck__preview" type="button" data-portfolio-preview data-index="${index}" aria-label="Show ${escapeHtml(item.title)}">
    ${item.posterUrl ? `<img src="${escapeHtml(item.posterUrl)}" alt="" loading="lazy">` : `<span class="portfolio-deck__preview-fallback" aria-hidden="true">AI</span>`}
    <span class="portfolio-deck__preview-copy"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.status || "AI Portfolio")}</small></span>
  </button>`;

const render = () => {
  if (!root) return;
  root.className = "portfolio-deck reveal is-visible";
  root.setAttribute("tabindex", "0");
  root.setAttribute("aria-roledescription", "carousel");
  root.setAttribute("aria-label", "Featured AI and video portfolio");

  if (!items.length) {
    root.innerHTML = `<div class="portfolio-deck__empty"><strong>No portfolio media available yet.</strong><span>Add entries to portfolio-videos.json.</span></div>`;
    return;
  }

  root.innerHTML = `
    <div class="portfolio-deck__stage">
      <div class="portfolio-deck__previews">${items.map(previewMarkup).join("")}</div>
      <article class="portfolio-deck__active">
        <div class="portfolio-deck__media" data-active-media></div>
        <div class="portfolio-deck__identity">
          <span class="portfolio-deck__category" data-active-category></span>
          <h3 data-active-title></h3>
          <p data-active-description></p>
        </div>
        <button class="portfolio-deck__control portfolio-deck__control--prev" type="button" data-portfolio-prev aria-label="Previous portfolio item">←</button>
        <button class="portfolio-deck__control portfolio-deck__control--next" type="button" data-portfolio-next aria-label="Next portfolio item">→</button>
        <div class="portfolio-deck__nav" aria-label="Choose portfolio item">
          <span data-portfolio-counter>1 / ${items.length}</span>
          <div>${items.map((item, index) => `<button class="portfolio-deck__dot${index === 0 ? " is-active" : ""}" type="button" data-portfolio-dot aria-label="Show ${escapeHtml(item.title)}" aria-current="${index === 0 ? "true" : "false"}"></button>`).join("")}</div>
        </div>
      </article>
    </div>
    <p class="portfolio-deck__status" data-portfolio-status aria-live="polite"></p>`;

  root.querySelector("[data-portfolio-next]")?.addEventListener("click", next);
  root.querySelector("[data-portfolio-prev]")?.addEventListener("click", previous);
  root.querySelectorAll("[data-portfolio-dot]").forEach((dot, index) => dot.addEventListener("click", () => goTo(index)));
  root.querySelectorAll("[data-portfolio-preview]").forEach((card) => card.addEventListener("click", () => goTo(Number(card.dataset.index))));

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") { event.preventDefault(); next(); }
    if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
  });

  let touchStartX = 0;
  root.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0]?.clientX ?? 0; }, { passive: true });
  root.addEventListener("touchend", (event) => {
    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX;
    if (Math.abs(delta) > 45) delta < 0 ? next() : previous();
  }, { passive: true });

  goTo(0, false);
};

const installStyles = () => {
  if (document.querySelector("#portfolio-deck-styles")) return;
  const style = document.createElement("style");
  style.id = "portfolio-deck-styles";
  style.textContent = `
    .portfolio-deck{position:relative;width:100%;outline:none}.portfolio-deck__stage{position:relative;min-height:620px;display:grid;place-items:center;padding:44px 0}.portfolio-deck__active{position:relative;z-index:5;width:min(100%,1040px);aspect-ratio:16/9;border:1px solid rgba(78,9,17,.18);border-radius:28px;background:#260707;box-shadow:0 32px 80px rgba(78,9,17,.22);overflow:hidden;transition:width .3s ease,aspect-ratio .3s ease}.portfolio-deck__active[data-orientation="portrait"]{width:min(72vw,430px)}.portfolio-deck__active[data-orientation="square"]{width:min(78vw,650px)}
    .portfolio-deck__media,.portfolio-deck__media video,.portfolio-deck__media img{position:absolute;inset:0;width:100%;height:100%}.portfolio-deck__media video,.portfolio-deck__media img{display:block;object-fit:contain;background:#260707}.portfolio-deck__identity{position:absolute;left:20px;right:20px;top:18px;z-index:8;display:flex;align-items:center;gap:10px;pointer-events:none}.portfolio-deck__identity h3{margin:0;max-width:70%;padding:8px 12px;border-radius:999px;background:rgba(38,7,7,.72);color:#fff;font-size:clamp(.84rem,1.3vw,1rem);line-height:1.2;letter-spacing:-.01em;backdrop-filter:blur(10px)}.portfolio-deck__identity p{position:absolute;left:0;top:48px;max-width:min(620px,80%);margin:0;padding:12px 14px;border-radius:14px;background:rgba(38,7,7,.82);color:#FAF1EC;font-size:.86rem;line-height:1.5;opacity:0;transform:translateY(-4px);transition:opacity .2s ease,transform .2s ease}.portfolio-deck__category{padding:7px 10px;border-radius:999px;background:#4E0911;color:#FAF1EC;font-size:.7rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase}.portfolio-deck__active:hover .portfolio-deck__identity p,.portfolio-deck:focus-within .portfolio-deck__identity p{opacity:1;transform:none}
    .portfolio-deck__control{position:absolute;top:50%;z-index:10;display:grid;place-items:center;width:48px;height:48px;border:1px solid rgba(255,255,255,.34);border-radius:50%;background:rgba(38,7,7,.62);color:#fff;font-size:1.1rem;cursor:pointer;backdrop-filter:blur(10px);transform:translateY(-50%)}.portfolio-deck__control--prev{left:16px}.portfolio-deck__control--next{right:16px}.portfolio-deck__control:hover,.portfolio-deck__control:focus-visible{background:#4E0911;outline:2px solid #fff;outline-offset:2px}
    .portfolio-deck__nav{position:absolute;left:50%;bottom:16px;z-index:10;display:flex;align-items:center;gap:12px;padding:9px 13px;border:1px solid rgba(255,255,255,.22);border-radius:999px;background:rgba(38,7,7,.64);color:#fff;font-size:.72rem;font-weight:800;backdrop-filter:blur(10px);transform:translateX(-50%)}.portfolio-deck__nav>div{display:flex;gap:7px}.portfolio-deck__dot{width:8px;height:8px;padding:0;border:0;border-radius:999px;background:rgba(255,255,255,.45);cursor:pointer}.portfolio-deck__dot.is-active{width:24px;background:#fff}
    .portfolio-deck__previews{position:absolute;inset:0;z-index:1;pointer-events:none}.portfolio-deck__preview{position:absolute;top:50%;width:min(28vw,300px);aspect-ratio:16/10;padding:0;overflow:hidden;border:1px solid rgba(78,9,17,.18);border-radius:24px;background:#4E0911;box-shadow:0 24px 60px rgba(78,9,17,.15);opacity:.38;filter:saturate(.65);cursor:pointer;pointer-events:auto;transform:translateY(-50%) scale(.9);transition:opacity .25s ease,transform .25s ease,filter .25s ease}.portfolio-deck__preview[data-position="previous"]{left:0;transform:translate(-18%,-50%) rotate(-2deg) scale(.9)}.portfolio-deck__preview[data-position="next"]{right:0;transform:translate(18%,-50%) rotate(2deg) scale(.9)}.portfolio-deck__preview:hover,.portfolio-deck__preview:focus-visible{opacity:.72;filter:saturate(.9);outline:3px solid rgba(78,9,17,.34);outline-offset:4px}.portfolio-deck__preview img{width:100%;height:100%;object-fit:cover}.portfolio-deck__preview-copy{position:absolute;inset:auto 0 0;display:grid;gap:2px;padding:14px;background:linear-gradient(transparent,rgba(38,7,7,.92));color:#fff;text-align:left}.portfolio-deck__preview-copy strong{font-size:.78rem;line-height:1.25}.portfolio-deck__preview-copy small{font-size:.66rem;opacity:.78}.portfolio-deck__preview-fallback{display:grid;place-items:center;width:100%;height:100%;color:#FAF1EC;font-weight:800;font-size:2rem}
    .portfolio-deck__error,.portfolio-deck__empty{display:grid;place-content:center;gap:8px;height:100%;padding:32px;text-align:center;color:#FAF1EC}.portfolio-deck__status{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
    @media(max-width:900px){.portfolio-deck__stage{min-height:560px}.portfolio-deck__preview{width:240px;opacity:.24}.portfolio-deck__active{width:min(90%,880px)}}
    @media(max-width:640px){.portfolio-deck__stage{min-height:520px;padding:28px 0 96px}.portfolio-deck__active{width:94%;border-radius:20px}.portfolio-deck__active[data-orientation="portrait"]{width:min(90vw,390px)}.portfolio-deck__preview{display:none}.portfolio-deck__control{top:auto;bottom:-66px;transform:none;width:44px;height:44px}.portfolio-deck__control--prev{left:18px}.portfolio-deck__control--next{right:18px}.portfolio-deck__nav{bottom:-64px}.portfolio-deck__identity{top:12px;left:12px;right:12px;align-items:flex-start;flex-direction:column}.portfolio-deck__identity h3{max-width:88%;font-size:.78rem}.portfolio-deck__identity p{position:static;max-width:92%;font-size:.78rem;opacity:1;transform:none;padding:8px 10px;background:rgba(38,7,7,.72)}.portfolio-deck__category{font-size:.62rem}.portfolio-deck__nav>span{display:none}}
    @media(prefers-reduced-motion:reduce){.portfolio-deck__active,.portfolio-deck__preview,.portfolio-deck__identity p{transition:none}}
  `;
  document.head.appendChild(style);
};

const load = async () => {
  if (!root) return;
  try {
    const response = await fetch(DATA_URL, { cache: "default" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    items = normalize(await response.json());
    installStyles();
    render();
  } catch (error) {
    console.error("Portfolio media data failed to load", error);
    root.innerHTML = `<div class="portfolio-deck__empty"><strong>Portfolio media could not be loaded.</strong><span>Please refresh the page or try again shortly.</span></div>`;
  }
};

if (root) {
  installStyles();
  load();
}
