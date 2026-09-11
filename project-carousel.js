"use strict";

const projectCarousel = document.querySelector("[data-project-carousel]");
const projectsSectionTitle = document.querySelector("#projects-title");

if (projectsSectionTitle) projectsSectionTitle.textContent = "Featured Projects";

const featuredProjects = [
  {
    title: "Elite Auto Estimates",
    category: "Automotive appraisal website",
    description: "A professional website for Colorado auto-damage appraisal services, designed to present services clearly and help customers request assistance online.",
    tags: ["Website", "Automotive", "Lead Generation", "Responsive Design"],
    background: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1800&q=85",
    logo: "assets/elite-auto-logo.svg",
    logoAlt: "Elite Auto Estimates",
    ctaLabel: "Visit Website",
    ctaUrl: "https://eliteautoestimates.com/"
  },
  {
    title: "Optivex Solutions",
    category: "Business solutions website",
    description: "A responsive business website designed to present Optivex services, strengthen its professional online presence, and provide visitors with a clear path to enquire.",
    tags: ["Business Website", "Responsive Design", "Branding", "Lead Generation"],
    background: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85",
    logo: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,fit=crop/mv0PQyjGP6Sl0jQx/nav_logo-m5K8W4BJ6ESwRjO3.webp",
    logoAlt: "Optivex Solutions",
    ctaLabel: "Visit Website",
    ctaUrl: "https://optivex.solutions/"
  },
  {
    title: "Microsoft 365 Transformation",
    category: "Cloud collaboration and security",
    description: "Delivered modern workplace improvements across email, Microsoft Teams, SharePoint, OneDrive, access management, security controls, training, and adoption.",
    tags: ["Microsoft 365", "Teams", "SharePoint", "OneDrive", "Security"],
    background: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&w=1800&q=85",
    ctaLabel: "Discuss This Project",
    ctaUrl: "#contact"
  },
  {
    title: "Service Delivery Optimisation",
    category: "Operations and service management",
    description: "Improved service workflows, SLA visibility, reporting, client communication, and operational governance to support faster and more consistent delivery.",
    tags: ["Workflow", "SLA", "Reporting", "Client Experience"],
    background: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1800&q=85",
    ctaLabel: "Discuss This Project",
    ctaUrl: "#contact"
  },
  {
    title: "Custom Secure Login System",
    category: "Secure client portal",
    description: "A branded, responsive authentication experience built for private client workspaces, controlled account access, and secure organisation-managed sign-in.",
    secondaryDescription: "Key features include protected login flows, password visibility controls, remembered email preferences, access-request routing, organisation-managed accounts, validation states, and mobile-friendly design.",
    tags: ["Secure Authentication", "Role-Based Access", "Client Portal", "Responsive UI", "Access Requests"],
    background: "assets/secure-client-portal-preview.svg",
    ctaLabel: "Discuss This Project",
    ctaUrl: "#contact"
  },
  {
    title: "Oligarchy Services",
    category: "Technology services website",
    description: "A professional technology services website presenting digital solutions, managed services, consulting capabilities, and clear client engagement pathways.",
    tags: ["Technology Services", "Business Website", "Responsive Design", "Lead Generation"],
    background: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=85",
    logo: "assets/oligarchy-services-logo.svg",
    logoAlt: "Oligarchy Services",
    logoDark: true,
    ctaLabel: "Visit Website",
    ctaUrl: "https://oligarchyservices.com/"
  },
  {
    title: "IT Asset Governance",
    category: "Lifecycle governance and cost control",
    description: "Strengthened hardware and software lifecycle management through improved inventory controls, licensing governance, audit readiness, forecasting, and cost optimisation.",
    tags: ["ITAM", "Licensing", "Compliance", "Audit", "Cost Control"],
    background: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=85",
    ctaLabel: "Discuss This Project",
    ctaUrl: "#contact"
  }
];

const createProjectCard = (project) => {
  const article = document.createElement("article");
  article.className = "project-carousel__item";
  article.style.backgroundImage = `url('${project.background}')`;
  article.setAttribute("aria-label", `${project.title} project`);

  const logoMarkup = project.logo
    ? `<img class="project-carousel__logo${project.logoDark ? " project-carousel__logo--dark" : ""}" src="${project.logo}" alt="${project.logoAlt || project.title}">`
    : "";

  const tagsMarkup = project.tags
    .map((tag) => `<span>${tag}</span>`)
    .join("");

  const secondaryMarkup = project.secondaryDescription
    ? `<p class="project-carousel__description project-carousel__description--secondary">${project.secondaryDescription}</p>`
    : "";

  const isExternal = /^https?:\/\//i.test(project.ctaUrl);
  const externalAttributes = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";

  article.innerHTML = `
    <div class="project-carousel__content">
      ${logoMarkup}
      <p class="project-carousel__eyebrow">${project.category}</p>
      <h3 class="project-carousel__title">${project.title}</h3>
      <p class="project-carousel__description">${project.description}</p>
      <div class="project-carousel__tags" aria-label="Project capabilities">${tagsMarkup}</div>
      <a class="button project-carousel__link" href="${project.ctaUrl}"${externalAttributes}>${project.ctaLabel} <span aria-hidden="true">↗</span></a>
      ${secondaryMarkup}
    </div>`;

  return article;
};

if (projectCarousel) {
  const slide = projectCarousel.querySelector("[data-project-carousel-slide]");
  const nextButton = projectCarousel.querySelector("[data-project-carousel-next]");
  const previousButton = projectCarousel.querySelector("[data-project-carousel-prev]");
  const status = projectCarousel.querySelector("[data-project-carousel-status]");

  if (slide) {
    slide.replaceChildren(...featuredProjects.map(createProjectCard));
    slide.prepend(slide.lastElementChild);
  }

  const getItems = () => slide ? [...slide.querySelectorAll(".project-carousel__item")] : [];

  const refreshAccessibility = () => {
    const items = getItems();

    items.forEach((item, index) => {
      const isActive = index === 1;
      item.setAttribute("aria-hidden", String(!isActive));
      item.querySelectorAll("a, button").forEach((control) => {
        control.tabIndex = isActive ? 0 : -1;
      });
    });
  };

  const announceActiveProject = () => {
    const activeItem = getItems()[1];
    const title = activeItem?.querySelector(".project-carousel__title")?.textContent?.trim();
    if (status && title) status.textContent = `${title} is now displayed.`;
    refreshAccessibility();
  };

  const showNext = () => {
    const items = getItems();
    if (items.length > 1 && slide) slide.appendChild(items[0]);
    announceActiveProject();
  };

  const showPrevious = () => {
    const items = getItems();
    if (items.length > 1 && slide) slide.prepend(items[items.length - 1]);
    announceActiveProject();
  };

  nextButton?.addEventListener("click", showNext);
  previousButton?.addEventListener("click", showPrevious);

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

  announceActiveProject();
}