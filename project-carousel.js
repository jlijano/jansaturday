"use strict";

const INTRO_VIDEO_URL = "https://player.cloudinary.com/embed/?cloud_name=brfm6p40&public_id=lv_0_20260912150315&autoplay=true&muted=true&loop=true";
const INTRO_DESCRIPTION = "AI Consultant helping businesses adopt practical AI, automation, and intelligent digital solutions to work smarter and grow efficiently.";

const setupProfileIntro = () => {
  const heroGrid = document.querySelector(".hero-grid");
  const heroDescription = document.querySelector(".hero-description");

  if (heroDescription) heroDescription.textContent = INTRO_DESCRIPTION;
  if (!heroGrid || heroGrid.querySelector(".hero-intro-video")) return;

  const media = document.createElement("div");
  media.className = "hero-intro-video reveal is-visible";
  media.setAttribute("aria-label", "Who am I profile introduction video");
  media.innerHTML = `
    <div class="hero-intro-video__frame">
      <iframe
        src="${INTRO_VIDEO_URL}"
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
      .hero-intro-video__frame::after{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
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
const REFRESH_INTERVAL_MS = 60000;
let items = [];
let activeIndex = 0;
let dataSignature = "";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const cloudinaryDirectUrl = (input = "") => {
  try {
    const url = new URL(String(input).trim());
    if (url.hostname === "player.cloudinary.com") {
      const cloudName = url.searchParams.get("cloud_name");
      const publicId = url.searchParams.get("public_id");
      if (cloudName && publicId) {
        const encodedId = publicId.split("/").map(encodeURIComponent).join("/");
        return `https://res.cloudinary.com/${encodeURIComponent(cloudName)}/video/upload/f_auto,q_auto/${encodedId}.mp4`;
      }
    }
    if (url.hostname.endsWith("cloudinary.com") && /\.(mp4|webm|ogg)(?:$|\?)/i.test(url.href)) return url.href;
    if (/\.(mp4|webm|ogg)(?:$|\?)/i.test(url.href)) return url.href;
  } catch (_) {}
  return "";
};

const normalize = (rows) => (Array.isArray(rows) ? rows : [])
  .filter((row) => row && row.title && row.videoLink)
  .map((row, index) => ({
    id: row.id || `portfolio-${index + 1}`,
    title: String(row.title).trim(),
    description: String(row.description || "").trim(),
    status: String(row.status || "").trim(),
    originalUrl: String(row.videoLink).trim(),
    videoUrl: cloudinaryDirectUrl(row.videoLink)
  }));

const safePlay = async (video) => {
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  try { await video.play(); } catch (_) {}
};

const goTo = (index, announce = true) => {
  if (!root || !items.length) return;
  activeIndex = (index + items.length) % items.length;

  root.querySelectorAll("[data-portfolio-slide]").forEach((slide, i) => {
    const isActive = i === activeIndex;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
    const video = slide.querySelector("video");
    if (!video) return;
    if (isActive) {
      video.currentTime = 0;
      safePlay(video);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  });

  root.querySelectorAll("[data-portfolio-dot]").forEach((dot, i) => {
    const current = i === activeIndex;
    dot.classList.toggle("is-active", current);
    dot.setAttribute("aria-current", current ? "true" : "false");
  });

  const counter = root.querySelector("[data-portfolio-counter]");
  if (counter) counter.textContent = `${activeIndex + 1} / ${items.length}`;
  const status = root.querySelector("[data-portfolio-status]");
  if (announce && status) status.textContent = `${items[activeIndex].title} is now displayed.`;
};

const next = () => goTo(activeIndex + 1);
const previous = () => goTo(activeIndex - 1);

const mediaMarkup = (item) => {
  if (!item.videoUrl) {
    return `<div class="portfolio-carousel__media-error"><strong>Video unavailable</strong><span>This entry needs a direct video URL or Cloudinary player URL.</span></div>`;
  }
  return `<video class="portfolio-carousel__video" muted autoplay playsinline preload="metadata" aria-label="${escapeHtml(item.title)}"><source src="${escapeHtml(item.videoUrl)}" type="video/mp4"></video>`;
};

const slideMarkup = (item, index) => `
  <article class="portfolio-carousel__slide${index === 0 ? " is-active" : ""}" data-portfolio-slide aria-hidden="${index === 0 ? "false" : "true"}">
    ${mediaMarkup(item)}
    <div class="portfolio-carousel__shade" aria-hidden="true"></div>
    <div class="portfolio-carousel__overlay">
      ${item.status ? `<span class="portfolio-carousel__badge">${escapeHtml(item.status)}</span>` : ""}
      <h3>${escapeHtml(item.title)}</h3>
      ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
    </div>
  </article>`;

const render = () => {
  if (!root) return;
  root.className = "portfolio-carousel reveal is-visible";
  root.setAttribute("tabindex", "0");
  root.setAttribute("aria-roledescription", "carousel");
  root.setAttribute("aria-label", "Featured AI and video portfolio");

  if (!items.length) {
    root.innerHTML = `<div class="portfolio-carousel__empty"><strong>No portfolio videos available yet.</strong><span>Add entries to portfolio-videos.json.</span></div>`;
    return;
  }

  root.innerHTML = `
    <div class="portfolio-carousel__stage">
      ${items.map(slideMarkup).join("")}
      <button class="portfolio-carousel__floating-control portfolio-carousel__floating-control--prev" type="button" data-portfolio-prev aria-label="Previous portfolio video">←</button>
      <button class="portfolio-carousel__floating-control portfolio-carousel__floating-control--next" type="button" data-portfolio-next aria-label="Next portfolio video">→</button>
      <div class="portfolio-carousel__floating-nav" aria-label="Choose portfolio video">
        <span class="portfolio-carousel__counter" data-portfolio-counter>1 / ${items.length}</span>
        <div class="portfolio-carousel__dots">${items.map((item, index) => `<button class="portfolio-carousel__dot${index === 0 ? " is-active" : ""}" type="button" data-portfolio-dot aria-label="Show ${escapeHtml(item.title)}" aria-current="${index === 0 ? "true" : "false"}"></button>`).join("")}</div>
      </div>
    </div>
    <p class="portfolio-carousel__status" data-portfolio-status aria-live="polite"></p>`;

  root.querySelector("[data-portfolio-next]")?.addEventListener("click", next);
  root.querySelector("[data-portfolio-prev]")?.addEventListener("click", previous);
  root.querySelectorAll("[data-portfolio-dot]").forEach((dot, index) => dot.addEventListener("click", () => goTo(index)));

  root.querySelectorAll("video").forEach((video) => {
    video.addEventListener("ended", next);
    video.addEventListener("error", () => {
      const slide = video.closest("[data-portfolio-slide]");
      if (!slide || slide.querySelector(".portfolio-carousel__media-error")) return;
      const error = document.createElement("div");
      error.className = "portfolio-carousel__media-error";
      error.innerHTML = "<strong>Video failed to load</strong><span>Please verify the Cloudinary asset is publicly accessible.</span>";
      slide.appendChild(error);
    });
  });

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

  requestAnimationFrame(() => goTo(Math.min(activeIndex, items.length - 1), false));
};

const installStyles = () => {
  if (document.querySelector("#portfolio-carousel-v2-styles")) return;
  const style = document.createElement("style");
  style.id = "portfolio-carousel-v2-styles";
  style.textContent = `
    .portfolio-carousel{position:relative;width:100%;overflow:hidden;border:1px solid rgba(78,9,17,.16);border-radius:26px;background:#260707;box-shadow:0 24px 64px rgba(78,9,17,.18);isolation:isolate}
    .portfolio-carousel__stage{position:relative;width:100%;aspect-ratio:16/9;min-height:420px;background:#260707;overflow:hidden}
    .portfolio-carousel__slide{position:absolute;inset:0;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .4s ease}
    .portfolio-carousel__slide.is-active{opacity:1!important;visibility:visible!important;pointer-events:auto!important;z-index:2}
    .portfolio-carousel__video{position:absolute;inset:0;display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;opacity:1!important;visibility:visible!important;background:#260707;border:0}
    .portfolio-carousel__shade{position:absolute;inset:0;z-index:3;background:linear-gradient(180deg,rgba(38,7,7,.04) 0%,rgba(38,7,7,.08) 46%,rgba(38,7,7,.86) 100%),linear-gradient(90deg,rgba(38,7,7,.48) 0%,rgba(38,7,7,.06) 60%,transparent 82%);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .26s ease,visibility .26s ease}
    .portfolio-carousel__overlay{position:absolute;left:clamp(24px,5vw,64px);right:clamp(24px,5vw,64px);bottom:clamp(52px,7vw,82px);z-index:4;max-width:760px;color:#FAF1EC;text-shadow:0 3px 20px rgba(0,0,0,.45);opacity:0;visibility:hidden;transform:translateY(14px);pointer-events:none;transition:opacity .26s ease,visibility .26s ease,transform .26s ease}
    .portfolio-carousel__slide.is-active:hover .portfolio-carousel__shade,.portfolio-carousel__slide.is-active:focus-within .portfolio-carousel__shade,.portfolio-carousel:focus-visible .portfolio-carousel__slide.is-active .portfolio-carousel__shade{opacity:1;visibility:visible}
    .portfolio-carousel__slide.is-active:hover .portfolio-carousel__overlay,.portfolio-carousel__slide.is-active:focus-within .portfolio-carousel__overlay,.portfolio-carousel:focus-visible .portfolio-carousel__slide.is-active .portfolio-carousel__overlay{opacity:1;visibility:visible;transform:none}
    .portfolio-carousel__overlay h3{margin:0;color:#FFFDFC!important;font-size:clamp(2rem,4.3vw,4.4rem);line-height:.98;letter-spacing:-.05em}.portfolio-carousel__overlay p{margin:18px 0 0;max-width:680px;color:rgba(255,253,252,.9);font-size:clamp(.95rem,1.45vw,1.18rem);line-height:1.6}
    .portfolio-carousel__badge{display:inline-flex;margin-bottom:16px;padding:7px 11px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:rgba(78,9,17,.74);color:#FAF1EC;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;backdrop-filter:blur(10px)}
    .portfolio-carousel__toolbar{display:none!important}
    .portfolio-carousel__floating-control{position:absolute;top:50%;z-index:7;display:grid;place-items:center;width:48px;height:48px;padding:0;border:1px solid rgba(255,255,255,.3);border-radius:50%;background:rgba(38,7,7,.62);color:#fff;font-size:1.15rem;cursor:pointer;backdrop-filter:blur(10px);transform:translateY(-50%);transition:background .2s ease,transform .2s ease,opacity .2s ease}
    .portfolio-carousel__floating-control--prev{left:18px}.portfolio-carousel__floating-control--next{right:18px}.portfolio-carousel__floating-control:hover,.portfolio-carousel__floating-control:focus-visible{background:#4E0911;transform:translateY(-50%) scale(1.06);outline:2px solid rgba(255,255,255,.7);outline-offset:2px}
    .portfolio-carousel__floating-nav{position:absolute;left:50%;bottom:16px;z-index:7;display:flex;align-items:center;gap:12px;padding:9px 14px;border:1px solid rgba(255,255,255,.22);border-radius:999px;background:rgba(38,7,7,.64);backdrop-filter:blur(10px);transform:translateX(-50%)}
    .portfolio-carousel__counter{min-width:auto;color:rgba(255,255,255,.78);font-size:.72rem;font-weight:800}.portfolio-carousel__dots{display:flex;align-items:center;gap:7px}.portfolio-carousel__dot{width:8px;height:8px;padding:0;border:0;border-radius:999px;background:rgba(255,255,255,.42);cursor:pointer;transition:width .2s ease,background .2s ease}.portfolio-carousel__dot.is-active{width:24px;background:#fff}.portfolio-carousel__dot:focus-visible{outline:2px solid #fff;outline-offset:3px}
    .portfolio-carousel__media-error{position:absolute;inset:0;z-index:5;display:grid;place-content:center;gap:8px;padding:30px;background:linear-gradient(145deg,#260707,#4E0911);color:#FAF1EC;text-align:center}.portfolio-carousel__media-error span{color:rgba(250,241,236,.82)}
    .portfolio-carousel__status{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.portfolio-carousel__empty{display:grid;place-items:center;gap:8px;min-height:360px;padding:42px;text-align:center;background:#FFFDFC;color:#2F2420}
    @media(max-width:900px){.portfolio-carousel{border-radius:22px}.portfolio-carousel__stage{aspect-ratio:4/3;min-height:440px}.portfolio-carousel__floating-control{width:44px;height:44px}.portfolio-carousel__overlay{left:28px;right:28px;bottom:68px}}
    @media(max-width:640px){.portfolio-carousel{border-radius:18px}.portfolio-carousel__stage{aspect-ratio:9/13;min-height:560px}.portfolio-carousel__floating-control{top:auto;bottom:14px;transform:none;width:42px;height:42px}.portfolio-carousel__floating-control:hover,.portfolio-carousel__floating-control:focus-visible{transform:scale(1.05)}.portfolio-carousel__floating-control--prev{left:14px}.portfolio-carousel__floating-control--next{right:14px}.portfolio-carousel__floating-nav{bottom:16px;padding:8px 11px}.portfolio-carousel__counter{display:none}.portfolio-carousel__overlay{left:20px;right:20px;bottom:82px}.portfolio-carousel__overlay h3{font-size:clamp(2rem,11vw,3rem)}.portfolio-carousel__overlay p{margin-top:12px;font-size:.92rem;line-height:1.5}}
    @media(prefers-reduced-motion:reduce){.portfolio-carousel__slide,.portfolio-carousel__shade,.portfolio-carousel__overlay,.portfolio-carousel__dot,.portfolio-carousel__floating-control{transition:none}}
  `;
  document.head.appendChild(style);
};

const load = async () => {
  if (!root) return;
  try {
    const response = await fetch(`${DATA_URL}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const nextItems = normalize(await response.json());
    const signature = JSON.stringify(nextItems);
    if (signature === dataSignature) return;
    dataSignature = signature;
    items = nextItems;
    activeIndex = Math.min(activeIndex, Math.max(0, items.length - 1));
    installStyles();
    render();
  } catch (error) {
    console.error("Portfolio video data failed to load", error);
    root.innerHTML = `<div class="portfolio-carousel__empty"><strong>Portfolio videos could not be loaded.</strong><span>Please refresh the page or try again shortly.</span></div>`;
  }
};

if (root) {
  installStyles();
  load();
  window.setInterval(load, REFRESH_INTERVAL_MS);
}
