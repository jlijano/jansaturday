"use strict";

const INTRO_VIDEO_URL = "https://player.cloudinary.com/embed/?cloud_name=brfm6p40&public_id=lv_0_20260912150315&autoplay=true&muted=true";
const INTRO_DESCRIPTION = "AI Consultant helping businesses adopt practical AI, automation, and intelligent digital solutions to work smarter and grow efficiently.";

const setupProfileIntro = () => {
  const heroGrid = document.querySelector(".hero-grid");
  const heroDescription = document.querySelector(".hero-description");

  if (heroDescription) {
    heroDescription.textContent = INTRO_DESCRIPTION;
  }

  if (!heroGrid || heroGrid.querySelector(".hero-intro-video")) return;

  const media = document.createElement("div");
  media.className = "hero-intro-video reveal";
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
      .hero .hero-grid{
        grid-template-columns:minmax(0,.92fr) minmax(440px,1.08fr) !important;
        max-width:1180px;
        margin-inline:auto;
        gap:clamp(42px,6vw,88px);
        align-items:center;
      }
      .hero .hero-copy{max-width:620px;}
      .hero .hero-description{max-width:560px;}
      .hero-intro-video{
        width:100%;
        max-width:620px;
        justify-self:end;
      }
      .hero-intro-video__frame{
        position:relative;
        width:100%;
        aspect-ratio:16/9;
        overflow:hidden;
        border:1px solid rgba(78,9,17,.2);
        border-radius:26px;
        background:#260707;
        box-shadow:0 28px 70px rgba(78,9,17,.16);
      }
      .hero-intro-video__frame::after{
        content:"";
        position:absolute;
        inset:0;
        pointer-events:none;
        border-radius:inherit;
        box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);
      }
      .hero-intro-video iframe{
        display:block;
        width:100%;
        height:100%;
        border:0;
        background:#260707;
      }
      .hero-intro-video__label{
        position:absolute;
        left:18px;
        bottom:18px;
        z-index:3;
        padding:8px 12px;
        border:1px solid rgba(255,255,255,.2);
        border-radius:999px;
        background:rgba(78,9,17,.8);
        color:#FAF1EC;
        font-size:.76rem;
        font-weight:800;
        letter-spacing:.06em;
        text-transform:uppercase;
        backdrop-filter:blur(10px);
        pointer-events:none;
      }
      @media(max-width:1024px){
        .hero .hero-grid{
          grid-template-columns:1fr !important;
          max-width:820px;
          gap:44px;
        }
        .hero-intro-video{
          max-width:760px;
          justify-self:stretch;
        }
      }
      @media(max-width:640px){
        .hero-intro-video__frame{border-radius:18px;}
        .hero-intro-video__label{left:14px;bottom:14px;font-size:.68rem;}
      }
    `;
    document.head.appendChild(style);
  }
};

setupProfileIntro();

const projectCarousel = document.querySelector("[data-project-carousel]");
const projectsSectionTitle = document.querySelector("#projects-title");
const DATA_URL = "portfolio-videos.json";
const REFRESH_INTERVAL_MS = 60000;

if (projectsSectionTitle) {
  projectsSectionTitle.textContent = "Featured AI & Video Portfolio";
}

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const getGoogleDriveId = (url = "") => {
  const value = String(url);
  const match = value.match(/\/d\/([a-zA-Z0-9_-]+)/) || value.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : "";
};

const isCloudinaryPlayerUrl = (url = "") => {
  try {
    return new URL(String(url).trim()).hostname === "player.cloudinary.com";
  } catch (_) {
    return false;
  }
};

const getCloudinaryEmbedUrl = (url = "") => {
  try {
    const parsed = new URL(String(url).trim());
    if (parsed.hostname !== "player.cloudinary.com") return "";
    parsed.searchParams.set("autoplay", "true");
    parsed.searchParams.set("muted", "true");
    return parsed.toString();
  } catch (_) {
    return "";
  }
};

const isDirectVideoUrl = (url = "") => {
  const value = String(url).toLowerCase();
  return /\.(mp4|webm|ogg)(\?|#|$)/.test(value) || value.includes("res.cloudinary.com/") || value.includes("cdn.");
};

const getDrivePreviewUrl = (url = "") => {
  const driveId = getGoogleDriveId(url);
  return driveId ? `https://drive.google.com/file/d/${driveId}/preview?autoplay=1` : "";
};

const normalizeRows = (rows) => (Array.isArray(rows) ? rows : [])
  .filter((item) => item && item.title && item.videoLink)
  .map((item, index) => ({
    id: item.id || `portfolio-video-${index + 1}`,
    title: String(item.title).trim(),
    description: String(item.description || "").trim(),
    videoLink: String(item.videoLink).trim(),
    status: String(item.status || "").trim()
  }));

let videos = [];
let activeIndex = 0;
let lastDataSignature = "";

const getActiveNativeVideo = () => projectCarousel?.querySelector(".portfolio-carousel__slide.is-active video");

const safePlay = async (video) => {
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  try {
    await video.play();
  } catch (_) {
    /* Browser autoplay policies may still require user interaction. */
  }
};

const stopAllNativeVideos = () => {
  projectCarousel?.querySelectorAll("video").forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });
};

const refreshEmbeddedFrames = () => {
  if (!projectCarousel) return;
  projectCarousel.querySelectorAll(".portfolio-carousel__embed").forEach((frame) => {
    const slide = frame.closest(".portfolio-carousel__slide");
    const shouldPlay = slide?.classList.contains("is-active");
    const source = frame.dataset.src || "";

    if (shouldPlay && source && frame.src !== source) {
      frame.src = source;
    } else if (!shouldPlay && frame.src && frame.src !== "about:blank") {
      frame.src = "about:blank";
    }
  });
};

const setActiveSlide = (index, { announce = true } = {}) => {
  if (!projectCarousel || videos.length === 0) return;

  activeIndex = (index + videos.length) % videos.length;
  const slides = [...projectCarousel.querySelectorAll(".portfolio-carousel__slide")];
  const dots = [...projectCarousel.querySelectorAll(".portfolio-carousel__dot")];

  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === activeIndex;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));

    const video = slide.querySelector("video");
    if (video) {
      if (active) {
        video.muted = true;
        video.defaultMuted = true;
        video.setAttribute("muted", "");
        video.setAttribute("autoplay", "");
        safePlay(video);
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  });

  refreshEmbeddedFrames();

  dots.forEach((dot, dotIndex) => {
    const active = dotIndex === activeIndex;
    dot.classList.toggle("is-active", active);
    dot.setAttribute("aria-current", active ? "true" : "false");
  });

  const counter = projectCarousel.querySelector("[data-portfolio-counter]");
  if (counter) counter.textContent = `${activeIndex + 1} / ${videos.length}`;

  const status = projectCarousel.querySelector("[data-portfolio-status]");
  if (announce && status) status.textContent = `${videos[activeIndex].title} is now displayed.`;
};

const showNext = () => setActiveSlide(activeIndex + 1);
const showPrevious = () => setActiveSlide(activeIndex - 1);

const bindCarouselEvents = () => {
  if (!projectCarousel) return;

  projectCarousel.querySelector("[data-portfolio-next]")?.addEventListener("click", showNext);
  projectCarousel.querySelector("[data-portfolio-prev]")?.addEventListener("click", showPrevious);

  projectCarousel.querySelectorAll(".portfolio-carousel__dot").forEach((dot, index) => {
    dot.addEventListener("click", () => setActiveSlide(index));
  });

  projectCarousel.querySelectorAll("video").forEach((video) => {
    video.addEventListener("ended", () => {
      if (videos.length > 1) showNext();
      else {
        video.currentTime = 0;
        safePlay(video);
      }
    });
  });

  projectCarousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    }
  });

  let touchStartX = 0;
  projectCarousel.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? 0;
  }, { passive: true });

  projectCarousel.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0]?.clientX ?? 0;
    const distance = touchEndX - touchStartX;
    if (Math.abs(distance) < 45) return;
    if (distance < 0) showNext();
    else showPrevious();
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAllNativeVideos();
    else {
      safePlay(getActiveNativeVideo());
      refreshEmbeddedFrames();
    }
  });

  document.addEventListener("pointerdown", () => safePlay(getActiveNativeVideo()), { once: true });
  document.addEventListener("keydown", () => safePlay(getActiveNativeVideo()), { once: true });
};

const createNativeVideoMarkup = (url, item) => `
  <video class="portfolio-carousel__video" muted autoplay playsinline preload="auto"${videos.length === 1 ? " loop" : ""} aria-label="${escapeHtml(item.title)}">
    <source src="${escapeHtml(url)}" type="video/mp4">
    Your browser does not support HTML5 video.
  </video>`;

const createMediaMarkup = (item, index) => {
  if (isCloudinaryPlayerUrl(item.videoLink)) {
    const embedUrl = getCloudinaryEmbedUrl(item.videoLink);
    return `<iframe class="portfolio-carousel__video portfolio-carousel__embed portfolio-carousel__cloudinary" src="${index === 0 ? escapeHtml(embedUrl) : "about:blank"}" data-src="${escapeHtml(embedUrl)}" title="${escapeHtml(item.title)}" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen frameborder="0" loading="${index === 0 ? "eager" : "lazy"}"></iframe>`;
  }

  const drivePreview = getDrivePreviewUrl(item.videoLink);
  if (drivePreview) {
    return `<iframe class="portfolio-carousel__video portfolio-carousel__embed portfolio-carousel__drive" src="${index === 0 ? escapeHtml(drivePreview) : "about:blank"}" data-src="${escapeHtml(drivePreview)}" title="${escapeHtml(item.title)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen frameborder="0" loading="${index === 0 ? "eager" : "lazy"}"></iframe>`;
  }

  if (isDirectVideoUrl(item.videoLink)) {
    return createNativeVideoMarkup(item.videoLink, item);
  }

  return `<div class="portfolio-carousel__media-error" role="note">
    <strong>Video preview unavailable</strong>
    <span>This portfolio entry needs a Cloudinary player URL, direct MP4/CDN URL, or a public Google Drive video link.</span>
  </div>`;
};

const createSlideMarkup = (item, index) => {
  const statusMarkup = item.status
    ? `<span class="portfolio-carousel__badge">${escapeHtml(item.status)}</span>`
    : "";

  return `
    <article class="portfolio-carousel__slide${index === 0 ? " is-active" : ""}" aria-hidden="${index === 0 ? "false" : "true"}" data-portfolio-slide>
      ${createMediaMarkup(item, index)}
      <div class="portfolio-carousel__shade" aria-hidden="true"></div>
      <div class="portfolio-carousel__overlay">
        ${statusMarkup}
        <h3>${escapeHtml(item.title)}</h3>
        ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
      </div>
    </article>`;
};

const renderCarousel = () => {
  if (!projectCarousel) return;

  projectCarousel.className = "portfolio-carousel reveal";
  projectCarousel.removeAttribute("data-project-carousel");
  projectCarousel.setAttribute("tabindex", "0");
  projectCarousel.setAttribute("aria-roledescription", "carousel");
  projectCarousel.setAttribute("aria-label", "Featured AI and video portfolio");

  if (videos.length === 0) {
    projectCarousel.innerHTML = `
      <div class="portfolio-carousel__empty">
        <strong>No portfolio videos available yet.</strong>
        <span>Add a Title, Description and Video Link to the portfolio tracker.</span>
      </div>`;
    return;
  }

  const dots = videos.map((item, index) => `
    <button class="portfolio-carousel__dot${index === 0 ? " is-active" : ""}" type="button" aria-label="Show ${escapeHtml(item.title)}" aria-current="${index === 0 ? "true" : "false"}"></button>`).join("");

  projectCarousel.innerHTML = `
    <div class="portfolio-carousel__stage">
      ${videos.map(createSlideMarkup).join("")}
    </div>
    <div class="portfolio-carousel__toolbar">
      <div class="portfolio-carousel__dots" aria-label="Choose portfolio video">${dots}</div>
      <div class="portfolio-carousel__nav">
        <span class="portfolio-carousel__counter" data-portfolio-counter>1 / ${videos.length}</span>
        <button class="portfolio-carousel__control" type="button" data-portfolio-prev aria-label="Previous portfolio video">←</button>
        <button class="portfolio-carousel__control" type="button" data-portfolio-next aria-label="Next portfolio video">→</button>
      </div>
    </div>
    <p class="portfolio-carousel__status" data-portfolio-status aria-live="polite"></p>`;

  if (videos.length === 1) {
    projectCarousel.querySelector(".portfolio-carousel__toolbar")?.classList.add("is-single");
  }

  bindCarouselEvents();
  setActiveSlide(Math.min(activeIndex, videos.length - 1), { announce: false });
};

const loadPortfolioData = async ({ initial = false } = {}) => {
  try {
    const response = await fetch(`${DATA_URL}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Portfolio data returned ${response.status}`);
    const rows = normalizeRows(await response.json());
    const signature = JSON.stringify(rows);

    if (initial || signature !== lastDataSignature) {
      lastDataSignature = signature;
      videos = rows;
      activeIndex = 0;
      renderCarousel();
    }
  } catch (error) {
    console.error("Unable to load portfolio video data:", error);
    if (initial && projectCarousel) {
      projectCarousel.innerHTML = `
        <div class="portfolio-carousel__empty">
          <strong>Portfolio videos could not be loaded.</strong>
          <span>Please check the portfolio tracker data and video URL.</span>
        </div>`;
    }
  }
};

if (projectCarousel) {
  loadPortfolioData({ initial: true });
  window.setInterval(() => loadPortfolioData(), REFRESH_INTERVAL_MS);
}
