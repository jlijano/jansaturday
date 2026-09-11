"use strict";

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
    /* Muted autoplay can still be blocked by some browser/device settings. */
  }
};

const stopAllNativeVideos = () => {
  projectCarousel?.querySelectorAll("video").forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });
};

const refreshDriveFrames = () => {
  if (!projectCarousel) return;
  projectCarousel.querySelectorAll(".portfolio-carousel__drive").forEach((frame) => {
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

  refreshDriveFrames();

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
      refreshDriveFrames();
    }
  });

  document.addEventListener("pointerdown", () => safePlay(getActiveNativeVideo()), { once: true });
  document.addEventListener("keydown", () => safePlay(getActiveNativeVideo()), { once: true });
};

const createMediaMarkup = (item, index) => {
  const drivePreview = getDrivePreviewUrl(item.videoLink);

  if (drivePreview) {
    return `<iframe class="portfolio-carousel__video portfolio-carousel__drive" src="${index === 0 ? escapeHtml(drivePreview) : "about:blank"}" data-src="${escapeHtml(drivePreview)}" title="${escapeHtml(item.title)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="${index === 0 ? "eager" : "lazy"}"></iframe>`;
  }

  if (isDirectVideoUrl(item.videoLink)) {
    return `<video class="portfolio-carousel__video" muted autoplay playsinline preload="metadata"${videos.length === 1 ? " loop" : ""} aria-label="${escapeHtml(item.title)}">
      <source src="${escapeHtml(item.videoLink)}" type="video/mp4">
      Your browser does not support HTML5 video.
    </video>`;
  }

  return `<div class="portfolio-carousel__media-error" role="note">
    <strong>Video preview unavailable</strong>
    <span>This portfolio entry needs a direct MP4/CDN URL or a public Google Drive video link.</span>
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
          <span>Please check the portfolio tracker data and video sharing permissions.</span>
        </div>`;
    }
  }
};

if (projectCarousel) {
  loadPortfolioData({ initial: true });
  window.setInterval(() => loadPortfolioData(), REFRESH_INTERVAL_MS);
}
