const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"], .mobile-menu a[href^="#"]')];

function setMenu(open) {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  mobileMenu.hidden = !open;
  document.body.classList.toggle("menu-open", open);
}

menuToggle?.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
mobileMenu?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

document.addEventListener("click", (event) => {
  if (!mobileMenu || mobileMenu.hidden || !menuToggle) return;
  if (event.target instanceof Node && !mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false);
});

function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 20);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const servicesTitle = document.querySelector("#services-title");
if (servicesTitle) servicesTitle.textContent = "AI Solutions for Real Business Needs";

const servicesSection = document.querySelector("#services.service-showcase");
const servicesGrid = servicesSection?.querySelector(".service-reference-grid");
if (servicesSection && servicesGrid && !servicesSection.querySelector(".services-more-wrap")) {
  const servicesMoreWrap = document.createElement("div");
  servicesMoreWrap.className = "services-more-wrap reveal";

  const servicesMoreLink = document.createElement("a");
  servicesMoreLink.className = "services-more-button";
  servicesMoreLink.href = "services.html";
  servicesMoreLink.textContent = "View More Services";
  servicesMoreLink.setAttribute("aria-label", "View the full AI services catalog");

  servicesMoreWrap.appendChild(servicesMoreLink);
  servicesGrid.insertAdjacentElement("afterend", servicesMoreWrap);
}

const sections = [...document.querySelectorAll("main section[id]")];
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-35% 0px -55%", threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));
}

const revealElements = document.querySelectorAll(".reveal");
const pageReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if ("IntersectionObserver" in window && !pageReduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

document.querySelector("[data-year]")?.replaceChildren(String(new Date().getFullYear()));

const footer = document.querySelector('.site-footer');
if (footer) {
  if (!document.querySelector('link[data-footer-reference]')) {
    const footerStyles = document.createElement('link');
    footerStyles.rel = 'stylesheet';
    footerStyles.href = 'footer-reference.css';
    footerStyles.dataset.footerReference = 'true';
    document.head.appendChild(footerStyles);
  }

  footer.classList.add('footer-reference');
  footer.innerHTML = `
    <div class="footer-reference__inner">
      <div class="footer-reference__top">
        <h2 class="footer-reference__headline">Let’s build the future<br>of AI together</h2>
        <a class="footer-reference__cta" href="#contact">Get Started</a>
      </div>
      <div class="footer-reference__logo" data-footer-logo aria-label="Jan Lijano AI Consulting"></div>
      <div class="footer-reference__bottom">
        <div class="footer-reference__brand">
          <strong>JAN LIJANO</strong>
          <span>· AI Consultant · © <span data-year></span></span>
        </div>
        <nav class="footer-reference__nav" aria-label="Footer navigation">
          <a href="#home">Home</a>
          <a href="#projects">Work</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
        </nav>
        <div class="footer-reference__social">
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X">X</a>
        </div>
      </div>
    </div>`;
  footer.querySelector('[data-year]')?.replaceChildren(String(new Date().getFullYear()));
}

const processModule = document.createElement("script");
processModule.src = "how-i-work.js";
processModule.defer = true;
document.body.appendChild(processModule);

const brandModule = document.createElement("script");
brandModule.src = "brand-logo.js";
brandModule.defer = true;
brandModule.addEventListener("load", () => {
  const syncFooterLogo = () => {
    const source = document.querySelector('.brand--logo img');
    const target = document.querySelector('[data-footer-logo]');
    if (!source || !target || !source.src) return;
    let logo = target.querySelector('img');
    if (!logo) {
      logo = document.createElement('img');
      logo.className = 'footer-reference__logo-image';
      logo.alt = 'Jan Lijano AI Consulting';
      logo.decoding = 'async';
      target.appendChild(logo);
    }
    if (logo.src !== source.src) logo.src = source.src;
  };

  syncFooterLogo();
  const brandImage = document.querySelector('.brand--logo img');
  if (brandImage && 'MutationObserver' in window) {
    new MutationObserver(syncFooterLogo).observe(brandImage, { attributes: true, attributeFilter: ['src'] });
  }

  const transparentBrandModule = document.createElement("script");
  transparentBrandModule.src = "brand-logo-transparent.js";
  transparentBrandModule.defer = true;
  transparentBrandModule.addEventListener('load', () => window.setTimeout(syncFooterLogo, 150));
  document.body.appendChild(transparentBrandModule);
});
document.body.appendChild(brandModule);

const consultationModule = document.createElement("script");
consultationModule.src = "consultation-form.js";
consultationModule.defer = true;
document.body.appendChild(consultationModule);
