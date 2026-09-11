const projectArtwork = (title, accent) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#101c37"/><stop offset="1" stop-color="${accent}"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><rect x="90" y="90" width="620" height="420" rx="28" fill="#08152d" stroke="rgba(255,255,255,.18)"/><rect x="125" y="130" width="210" height="22" rx="11" fill="#9346ff"/><rect x="125" y="180" width="290" height="12" rx="6" fill="#75809a"/><rect x="125" y="220" width="250" height="12" rx="6" fill="#75809a"/><rect x="125" y="285" width="160" height="150" rx="18" fill="#142241"/><rect x="315" y="285" width="355" height="150" rx="18" fill="#142241"/><path d="M350 395c65-95 130 25 285-70" fill="none" stroke="#38a7ff" stroke-width="12" stroke-linecap="round"/><text x="125" y="480" fill="#f7f9ff" font-family="Arial" font-size="34" font-weight="700">${title}</text></svg>`)} `;

const portfolioData = {
  projects: [
    { title: "Microsoft 365 Transformation", category: "Email, Teams, SharePoint, OneDrive & Security", image: projectArtwork("Microsoft 365", "#44207a"), link: "#contact" },
    { title: "IT Asset Governance", category: "Lifecycle, Licensing, Compliance & Cost Control", image: projectArtwork("IT Asset Governance", "#143d78"), link: "#contact" },
    { title: "Service Delivery Optimisation", category: "Workflow, SLA, Client Experience & Reporting", image: projectArtwork("Service Delivery", "#352378"), link: "#contact" }
  ],
  services: [
    { icon: "PM", title: "IT Project Management", description: "End-to-end planning, governance, budgeting, resource coordination, stakeholder reporting, and delivery control." },
    { icon: "SD", title: "Service Delivery", description: "Client management, workflow optimisation, service quality, operational reporting, and continuous improvement." },
    { icon: "M365", title: "Microsoft 365 & Cloud", description: "Microsoft 365 implementation, Teams, SharePoint, OneDrive, identity, security, backup, and remote access." },
    { icon: "ITAM", title: "IT Asset Management", description: "Hardware and software lifecycle governance, licensing, compliance, forecasting, audit readiness, and cost optimisation." }
  ],
  experience: [
    {
      marker: "O",
      role: "Service Delivery Manager / Service Project Manager",
      company: "Oligarchy",
      meta: "Nov 2024 – Present · Part-time · United States · Remote",
      summary: "Lead client-facing service delivery and L&D programmes, aligning internal teams, budgets, training operations, and business goals.",
      achievements: [
        "Improved training programme effectiveness by 15% and increased client engagement by 20%.",
        "Reduced training development time by 30% and optimised training budgets by 10%.",
        "Led the L&D team, resolved delivery issues, and improved learner experience through continuous process improvement."
      ],
      skills: ["Service Delivery", "L&D Strategy", "Training Needs Analysis", "Client Relationships", "Budget Management"]
    },
    {
      marker: "DC",
      role: "Information Technology Project Manager",
      company: "Dexterton Corporation",
      meta: "Jan 2025 – Jun 2026 · Full-time",
      summary: "Managed complex technology programmes from initiation through completion across cloud, cybersecurity, virtualisation, AI, and IoT initiatives.",
      achievements: [
        "Directed cross-functional teams and resolved delivery risks to keep projects aligned with scope, budget, quality, and deadlines.",
        "Created detailed project plans, budgets, resource strategies, and leadership performance updates.",
        "Oversaw system design and implementation for strategic technology initiatives."
      ],
      skills: ["IT Project Management", "Cloud Computing", "Cybersecurity", "AI & IoT", "Stakeholder Reporting"]
    },
    {
      marker: "EA",
      role: "IT Consultant",
      company: "Elite Auto Estimates LLC",
      meta: "Apr 2025 – May 2026 · Part-time",
      summary: "Led Microsoft 365 deployment and digital workflow improvements supporting appraisal operations, claims documentation, scheduling, and communication.",
      achievements: [
        "Implemented email migration, Teams, SharePoint, OneDrive, user access, and security controls.",
        "Created project plans, training materials, timelines, and resource strategies for technology upgrades.",
        "Improved cloud storage, backup, device management, cybersecurity, and secure remote access."
      ],
      skills: ["Microsoft 365", "SharePoint", "OneDrive", "Teams", "Secure Remote Access"]
    },
    {
      marker: "DD",
      role: "Service Delivery Manager / Service Project Manager",
      company: "Destroy Drive",
      meta: "Apr 2024 – Apr 2025 · United States · Hybrid",
      summary: "Managed client relationships and IT asset disposition services, coordinating internal teams, compliance, workflow quality, and operational efficiency.",
      achievements: [
        "Improved service delivery speed and customer satisfaction by 10%.",
        "Raised project delivery efficiency and team productivity by 20%.",
        "Reduced operational costs by 35% through process optimisation."
      ],
      skills: ["ITAD", "Service Delivery", "Client Management", "Process Optimisation", "Compliance"]
    },
    {
      marker: "AIT",
      role: "Senior Information Technology Project Manager",
      company: "Adaptive ITC",
      meta: "Sep 2020 – May 2024 · Part-time · Remote",
      summary: "Managed security, backup, user support systems, strategic computing resources, and day-to-day technology operations.",
      achievements: [
        "Maintained system integrity through security, backup, and support controls.",
        "Developed technology strategies focused on data governance and security.",
        "Worked with department heads to resolve issues, report progress, and meet operational deadlines."
      ],
      skills: ["IT Strategy", "Security", "Backup", "Operations", "Stakeholder Management"]
    },
    {
      marker: "CGS",
      role: "IT Asset Manager",
      company: "Carelon Global Solutions",
      meta: "Jul 2023 – Apr 2024 · Full-time · Philippines · Hybrid",
      summary: "Managed enterprise cloud and software licence lifecycle, forecasting, budgeting, compliance, audit readiness, and cost control.",
      achievements: [
        "Improved asset tracking, governance, reporting discipline, and operational visibility.",
        "Conducted audits and compliance assessments across IT assets and software licences.",
        "Collaborated with cross-functional teams to optimise procurement and asset processes."
      ],
      skills: ["ITAM", "Software Licensing", "Audit", "Forecasting", "Cost Control"]
    },
    {
      marker: "C&C",
      role: "Global IT Asset Management / IT Desktop Support Engineer",
      company: "Crawford & Company",
      meta: "Apr 2018 – Jul 2023 · Full-time · Remote / Hybrid",
      summary: "Progressed from desktop support into global IT asset management, combining technical operations, lifecycle governance, audits, policy, and cost optimisation.",
      achievements: [
        "Improved asset tracking accuracy by 15% and operational efficiency by 25%.",
        "Reduced IT asset costs by 15% through data-driven lifecycle decisions.",
        "Reduced system downtime by 20% through proactive technical support and maintenance."
      ],
      skills: ["Global ITAM", "Desktop Support", "Audit", "Policy", "Technical Operations"]
    },
    {
      marker: "VOAJ",
      role: "IT Business Consultant",
      company: "VOAJ Enterprise",
      meta: "Apr 2017 – May 2021 · Part-time · Remote",
      summary: "Advised organisations on process improvement, system optimisation, technology selection, implementation, and user adoption.",
      achievements: ["Improved operational efficiency by 20% through business process optimisation and system recommendations."],
      skills: ["Business Consulting", "Process Improvement", "Systems Selection", "Training", "Technology Adoption"],
      hidden: true
    },
    {
      marker: "PBS",
      role: "IT Manager",
      company: "Pacific Business Services",
      meta: "Apr 2017 – Apr 2018 · Philippines",
      summary: "Led the IT department, systems, policies, procedures, team performance, and company-wide technology operations.",
      achievements: ["Increased department efficiency by 15%, team productivity by 25%, and operational consistency by 20%."],
      skills: ["IT Management", "Team Leadership", "Policies", "Operations", "Performance Management"],
      hidden: true
    },
    {
      marker: "AL",
      role: "IT Manager",
      company: "AccentLine",
      meta: "Dec 2015 – Apr 2017 · Iloilo City",
      summary: "Managed IT staff, server setup, infrastructure reliability, recruitment, training, and team development.",
      achievements: ["Maintained 98.3% server uptime and improved team performance by 25%."],
      skills: ["Server Administration", "IT Leadership", "Recruitment", "Training", "Infrastructure"],
      hidden: true
    },
    {
      marker: "MS",
      role: "Software Quality Assurance Officer",
      company: "Microsoft",
      meta: "Mar 2013 – Oct 2014 · Makati",
      summary: "Designed test strategies, validation procedures, test plans, and process improvements for software quality and release assurance.",
      achievements: ["Improved testing efficiency by 25%, reduced post-release defects by 30%, and shortened testing time by 15%."],
      skills: ["Software QA", "Test Planning", "Validation", "Process Improvement", "Automation"],
      hidden: true
    },
    {
      marker: "TC",
      role: "Technical Services Specialist",
      company: "Transcom",
      meta: "Aug 2012 – Mar 2013 · Iloilo City",
      summary: "Provided customer technical support across hardware, software, networks, upgrades, migrations, and user training.",
      achievements: ["Supported customers through phone, email, and in-person channels while collaborating on system upgrades and migrations."],
      skills: ["Technical Support", "Networking", "Customer Service", "Training", "Troubleshooting"],
      hidden: true
    }
  ]
};

const projectsRoot = document.querySelector("[data-projects]");
const servicesRoot = document.querySelector("[data-services]");
const experienceRoot = document.querySelector("[data-experience]");

if (projectsRoot) {
  projectsRoot.innerHTML = portfolioData.projects.map((project) => `
    <article class="project-card reveal">
      <a class="project-link" href="${project.link}" aria-label="View ${project.title} project">
        <div class="project-image"><img src="${project.image}" alt="${project.title} preview" width="800" height="600" loading="lazy"></div>
        <div class="project-body"><div><h3>${project.title}</h3><p>${project.category}</p></div><span class="project-arrow" aria-hidden="true">↗</span></div>
      </a>
    </article>`).join("");
}

if (servicesRoot) {
  servicesRoot.innerHTML = portfolioData.services.map((service) => `
    <article class="service-card reveal"><span class="service-icon" aria-hidden="true">${service.icon}</span><h3>${service.title}</h3><p>${service.description}</p></article>`).join("");
}

if (experienceRoot) {
  experienceRoot.innerHTML = portfolioData.experience.map((item) => `
    <article class="experience-item reveal${item.hidden ? " is-hidden" : ""}" data-earlier-experience="${item.hidden ? "true" : "false"}">
      <div class="experience-marker" aria-hidden="true">${item.marker}</div>
      <div class="experience-card">
        <div class="experience-head"><div><h3>${item.role}</h3><p class="experience-company">${item.company}</p></div><div class="experience-meta">${item.meta}</div></div>
        <p class="experience-summary">${item.summary}</p>
        <ul class="experience-achievements">${item.achievements.map((achievement) => `<li>${achievement}</li>`).join("")}</ul>
        <div class="experience-skills">${item.skills.map((skill) => `<span>${skill}</span>`).join("")}</div>
      </div>
    </article>`).join("");
}

const experienceToggle = document.querySelector("[data-experience-toggle]");
experienceToggle?.addEventListener("click", () => {
  const expanded = experienceToggle.getAttribute("aria-expanded") === "true";
  document.querySelectorAll('[data-earlier-experience="true"]').forEach((item) => item.classList.toggle("is-hidden", expanded));
  experienceToggle.setAttribute("aria-expanded", String(!expanded));
  experienceToggle.textContent = expanded ? "Show Earlier Experience" : "Hide Earlier Experience";
});

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
mobileMenu?.addEventListener("click", (event) => { if (event.target instanceof HTMLAnchorElement) setMenu(false); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape") setMenu(false); });
document.addEventListener("click", (event) => {
  if (!mobileMenu || mobileMenu.hidden || !menuToggle) return;
  const target = event.target;
  if (target instanceof Node && !mobileMenu.contains(target) && !menuToggle.contains(target)) setMenu(false);
});

function updateHeader() { header?.classList.toggle("scrolled", window.scrollY > 20); }
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

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
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

document.querySelector("[data-year]")?.replaceChildren(String(new Date().getFullYear()));

const form = document.querySelector("[data-contact-form]");
const status = form?.querySelector(".form-status");
function validateField(field) {
  const error = document.querySelector(`#${field.id}-error`);
  let message = "";
  if (!field.value.trim()) message = `${field.labels?.[0]?.textContent || "This field"} is required.`;
  if (field.type === "email" && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) message = "Enter a valid email address.";
  field.setAttribute("aria-invalid", String(Boolean(message)));
  field.setAttribute("aria-describedby", `${field.id}-error`);
  if (error) error.textContent = message;
  return !message;
}
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [...form.querySelectorAll("input, textarea")];
  const valid = fields.map(validateField).every(Boolean);
  if (!valid) {
    fields.find((field) => field.getAttribute("aria-invalid") === "true")?.focus();
    if (status) status.textContent = "Please correct the highlighted fields.";
    return;
  }
  if (status) status.textContent = "Thanks! This form is ready to connect to your preferred form service.";
  form.reset();
  fields.forEach((field) => field.removeAttribute("aria-invalid"));
});
form?.addEventListener("input", (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) validateField(event.target);
});