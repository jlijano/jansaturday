"use strict";

(() => {
  const root = document.querySelector("[data-project-carousel]");
  if (!root || document.querySelector("#portfolio-cinematic-deck-styles")) return;

  const style = document.createElement("style");
  style.id = "portfolio-cinematic-deck-styles";
  style.textContent = `
    .projects-carousel-section{overflow:clip}
    .portfolio-carousel{
      overflow:visible!important;
      border:0!important;
      background:transparent!important;
      box-shadow:none!important;
      isolation:isolate;
    }
    .portfolio-carousel__stage{
      width:min(92%,1120px)!important;
      margin-inline:auto!important;
      overflow:visible!important;
      border-radius:30px;
      perspective:1400px;
      transform-style:preserve-3d;
      background:transparent!important;
    }
    .portfolio-carousel__slide{
      overflow:hidden;
      border:1px solid rgba(255,255,255,.34);
      border-radius:30px;
      background:rgba(38,7,7,.94);
      box-shadow:0 28px 70px rgba(78,9,17,.18);
      transform-origin:center center;
      transition:transform .58s cubic-bezier(.22,.75,.2,1),opacity .5s ease,filter .5s ease,box-shadow .5s ease!important;
    }
    .portfolio-carousel__slide::after{
      content:"";
      position:absolute;
      inset:0;
      z-index:6;
      border-radius:inherit;
      background:linear-gradient(118deg,rgba(255,255,255,.16),rgba(255,255,255,.025) 32%,transparent 58%,rgba(228,206,194,.10));
      box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);
      pointer-events:none;
      opacity:0;
      transition:opacity .45s ease;
    }
    .portfolio-carousel__slide.is-active{
      z-index:8!important;
      transform:translate3d(0,0,0) scale(1)!important;
      opacity:1!important;
      visibility:visible!important;
      filter:none!important;
      pointer-events:auto!important;
      box-shadow:0 34px 86px rgba(78,9,17,.24),0 10px 24px rgba(47,36,32,.10);
    }
    .portfolio-carousel__slide.is-deck-next,
    .portfolio-carousel__slide.is-deck-prev,
    .portfolio-carousel__slide.is-deck-next-2{
      visibility:visible!important;
      pointer-events:auto!important;
      cursor:pointer;
    }
    .portfolio-carousel__slide.is-deck-next{
      z-index:6!important;
      opacity:.62!important;
      transform:translate3d(7.5%,2.6%,0) scale(.945)!important;
      filter:blur(1.1px) saturate(.78) brightness(.86);
      box-shadow:0 26px 62px rgba(78,9,17,.18);
    }
    .portfolio-carousel__slide.is-deck-prev{
      z-index:5!important;
      opacity:.42!important;
      transform:translate3d(-7.5%,3.4%,0) scale(.91)!important;
      filter:blur(1.7px) saturate(.72) brightness(.82);
    }
    .portfolio-carousel__slide.is-deck-next-2{
      z-index:4!important;
      opacity:.26!important;
      transform:translate3d(12.5%,5.2%,0) scale(.875)!important;
      filter:blur(2.4px) saturate(.62) brightness(.78);
    }
    .portfolio-carousel__slide.is-deck-next::after,
    .portfolio-carousel__slide.is-deck-prev::after,
    .portfolio-carousel__slide.is-deck-next-2::after{opacity:1}
    .portfolio-carousel__slide.is-deck-hidden{
      z-index:1!important;
      opacity:0!important;
      visibility:hidden!important;
      transform:scale(.82)!important;
      filter:blur(4px);
      pointer-events:none!important;
    }
    .portfolio-carousel__floating-control{
      background:rgba(255,253,252,.16)!important;
      border:1px solid rgba(255,255,255,.46)!important;
      color:#fff!important;
      box-shadow:0 12px 30px rgba(38,7,7,.18)!important;
      backdrop-filter:blur(18px) saturate(135%)!important;
      -webkit-backdrop-filter:blur(18px) saturate(135%)!important;
    }
    .portfolio-carousel__floating-control:hover,
    .portfolio-carousel__floating-control:focus-visible{
      background:rgba(78,9,17,.82)!important;
      border-color:rgba(255,255,255,.72)!important;
    }
    .portfolio-carousel__floating-nav{
      background:rgba(255,253,252,.15)!important;
      border:1px solid rgba(255,255,255,.4)!important;
      box-shadow:0 14px 36px rgba(38,7,7,.16)!important;
      backdrop-filter:blur(20px) saturate(140%)!important;
      -webkit-backdrop-filter:blur(20px) saturate(140%)!important;
    }
    .portfolio-carousel__counter{color:rgba(255,255,255,.9)!important}
    .portfolio-carousel__dot{background:rgba(255,255,255,.48)!important;box-shadow:0 0 0 1px rgba(78,9,17,.08)}
    .portfolio-carousel__dot.is-active{background:#fff!important;box-shadow:0 0 18px rgba(255,255,255,.56)}
    .portfolio-carousel__overlay{
      padding:18px 20px 18px 0;
      border-radius:20px;
    }
    .portfolio-carousel__slide.is-active:hover .portfolio-carousel__overlay,
    .portfolio-carousel__slide.is-active:focus-within .portfolio-carousel__overlay,
    .portfolio-carousel:focus-visible .portfolio-carousel__slide.is-active .portfolio-carousel__overlay{
      backdrop-filter:blur(2px);
    }
    @media(max-width:900px){
      .portfolio-carousel__stage{width:94%!important}
      .portfolio-carousel__slide.is-deck-next{transform:translate3d(5.2%,2.8%,0) scale(.95)!important;opacity:.52!important}
      .portfolio-carousel__slide.is-deck-prev{transform:translate3d(-5.2%,3.5%,0) scale(.92)!important;opacity:.34!important}
      .portfolio-carousel__slide.is-deck-next-2{transform:translate3d(8.5%,5%,0) scale(.89)!important;opacity:.2!important}
    }
    @media(max-width:640px){
      .portfolio-carousel__stage{width:96%!important}
      .portfolio-carousel__slide{border-radius:20px}
      .portfolio-carousel__slide.is-deck-next{transform:translate3d(3.8%,2.8%,0) scale(.96)!important;opacity:.46!important}
      .portfolio-carousel__slide.is-deck-prev{transform:translate3d(-3.8%,3.7%,0) scale(.93)!important;opacity:.28!important}
      .portfolio-carousel__slide.is-deck-next-2{display:none!important}
    }
    @media(prefers-reduced-motion:reduce){
      .portfolio-carousel__slide{transition:none!important}
    }
  `;
  document.head.appendChild(style);

  let lastSignature = "";

  const restoreVideoControls = () => {
    root.querySelectorAll("video.portfolio-carousel__video").forEach((video) => {
      video.controls = true;
      video.setAttribute("controls", "");
      video.setAttribute("playsinline", "");
    });
  };

  const syncDeck = () => {
    const slides = [...root.querySelectorAll("[data-portfolio-slide]")];
    if (!slides.length) return;

    restoreVideoControls();

    let active = slides.findIndex((slide) => slide.classList.contains("is-active"));
    if (active < 0) active = 0;

    const signature = `${active}:${slides.length}`;
    if (signature === lastSignature) return;
    lastSignature = signature;

    slides.forEach((slide) => {
      slide.classList.remove("is-deck-next", "is-deck-prev", "is-deck-next-2", "is-deck-hidden");
      if (!slide.classList.contains("is-active")) slide.classList.add("is-deck-hidden");
    });

    if (slides.length > 1) {
      const next = (active + 1) % slides.length;
      slides[next].classList.remove("is-deck-hidden");
      slides[next].classList.add("is-deck-next");
    }

    if (slides.length > 2) {
      const prev = (active - 1 + slides.length) % slides.length;
      slides[prev].classList.remove("is-deck-hidden");
      slides[prev].classList.add("is-deck-prev");
    }

    if (slides.length > 3) {
      const next2 = (active + 2) % slides.length;
      slides[next2].classList.remove("is-deck-hidden");
      slides[next2].classList.add("is-deck-next-2");
    }
  };

  root.addEventListener("click", (event) => {
    const slide = event.target.closest("[data-portfolio-slide]");
    if (!slide || slide.classList.contains("is-active")) return;

    if (slide.classList.contains("is-deck-prev")) {
      root.querySelector("[data-portfolio-prev]")?.click();
    } else if (slide.classList.contains("is-deck-next") || slide.classList.contains("is-deck-next-2")) {
      root.querySelector("[data-portfolio-next]")?.click();
    }
  });

  const observer = new MutationObserver(() => {
    requestAnimationFrame(syncDeck);
  });

  observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  requestAnimationFrame(syncDeck);
})();
