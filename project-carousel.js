"use strict";

const projectCarousel = document.querySelector("[data-project-carousel]");
const projectsSectionTitle = document.querySelector("#projects-title");

if (projectsSectionTitle) {
  projectsSectionTitle.textContent = "Featured AI & Video Portfolio";
}

if (projectCarousel) {
  projectCarousel.removeAttribute("tabindex");
  projectCarousel.removeAttribute("aria-roledescription");
  projectCarousel.removeAttribute("data-project-carousel");
  projectCarousel.classList.add("portfolio-video");
  projectCarousel.setAttribute("aria-label", "Featured AI video portfolio");

  projectCarousel.innerHTML = `
    <video class="portfolio-video__player" controls playsinline preload="metadata" aria-label="AI portfolio video">
      <source src="assets/videos/lv_0_20260912031425.mp4" type="video/mp4">
      Your browser does not support the video element.
    </video>
  `;
}
